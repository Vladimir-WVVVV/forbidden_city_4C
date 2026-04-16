const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '0.0.0.0';
const HUNYUAN_API_KEY = process.env.HUNYUAN_API_KEY || '';
const HUNYUAN_BASE_URL = (process.env.HUNYUAN_BASE_URL || 'https://tokenhub.tencentmaas.com/v1').replace(/\/+$/, '');
const HUNYUAN_MODEL = process.env.HUNYUAN_MODEL || 'hunyuan-2.0-instruct-20251111';

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS origin is not allowed'));
  },
}));
app.use(express.json({ limit: '1mb' }));

function sendError(res, statusCode, code, message) {
  return res.status(statusCode).json({
    ok: false,
    error: { code, message },
  });
}

const systemPrompt = [
  '你是“故宫建筑数字展陈讲解助手”。',
  '请始终使用中文回答，语气适合网页展陈、课程汇报和答辩演示。',
  '回答要尽量结合当前建筑、当前热点和页面上下文，围绕古建筑构件、礼制秩序、营造智慧与审美意涵展开。',
  '不要编造文献出处；如果信息不确定，请明确说明“可作谨慎理解”或“仍需以馆方资料为准”。',
  '回答清晰适中，不要过度发散；优先给出可直接放在展陈讲解中的表达。',
].join('\n');

function requireHunyuanConfig() {
  if (!HUNYUAN_API_KEY) {
    const error = new Error('服务端缺少 HUNYUAN_API_KEY，请先在 .env 中配置 TokenHub API Key。');
    error.code = 'MISSING_HUNYUAN_API_KEY';
    error.statusCode = 500;
    throw error;
  }
}

function normalizeText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function extractAnswer(response) {
  const choice = response && Array.isArray(response.choices) ? response.choices[0] : null;
  return choice?.message?.content || choice?.delta?.content || '';
}

async function readJsonResponse(response) {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    const error = new Error('混元接口返回了非 JSON 内容。');
    error.code = 'INVALID_HUNYUAN_RESPONSE';
    error.statusCode = 502;
    throw error;
  }
}

function getUpstreamErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload.error === 'string') return payload.error;
  if (payload.error?.message) return payload.error.message;
  if (payload.message) return payload.message;
  return fallback;
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'hunyuan-proxy',
    model: HUNYUAN_MODEL,
  });
});

app.post('/api/hunyuan', async (req, res) => {
  const message = normalizeText(req.body?.message, 1000);
  const building = normalizeText(req.body?.building, 100);
  const hotspot = normalizeText(req.body?.hotspot, 100);
  const context = normalizeText(req.body?.context, 2400);

  if (!message) {
    return sendError(res, 400, 'EMPTY_MESSAGE', '请输入想咨询的问题。');
  }

  try {
    requireHunyuanConfig();
    const userPrompt = [
      `当前建筑：${building || '未指定'}`,
      `当前热点：${hotspot || '未指定'}`,
      `页面上下文：${context || '当前页面未提供额外说明。'}`,
      `用户问题：${message}`,
    ].join('\n\n');

    const response = await fetch(`${HUNYUAN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUNYUAN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HUNYUAN_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        stream: false,
      }),
    });

    const payload = await readJsonResponse(response);
    if (!response.ok) {
      const error = new Error(getUpstreamErrorMessage(payload, '混元接口调用失败，请稍后再试。'));
      error.code = payload?.error?.code || payload?.code || 'HUNYUAN_REQUEST_FAILED';
      error.statusCode = response.status || 502;
      throw error;
    }

    const answer = normalizeText(extractAnswer(payload), 6000);

    return res.json({
      ok: true,
      answer: answer || '混元暂时没有返回有效内容，请稍后再试，或换一种问法继续提问。',
    });
  } catch (error) {
    console.error('[hunyuan-proxy]', {
      code: error.code,
      message: error.message,
      requestId: error.requestId || error.RequestId,
    });
    const statusCode = error.statusCode || 502;
    const code = error.code || 'HUNYUAN_REQUEST_FAILED';
    const messageText = error.message || '混元接口调用失败，请稍后再试。';
    return sendError(res, statusCode, code, messageText);
  }
});

app.use('/api', (err, _req, res, _next) => {
  if (res.headersSent) return;

  if (err instanceof SyntaxError) {
    sendError(res, 400, 'INVALID_JSON', '请求体不是有效的 JSON，请检查前端请求格式。');
    return;
  }

  if (err?.message === 'CORS origin is not allowed') {
    sendError(res, 403, 'CORS_ORIGIN_DENIED', '当前访问来源未被服务端允许，请检查 CORS_ORIGIN 配置。');
    return;
  }

  sendError(res, err?.statusCode || 500, err?.code || 'API_ERROR', err?.message || '服务端处理请求失败。');
});

app.use('/api', (_req, res) => {
  sendError(res, 404, 'API_NOT_FOUND', '接口不存在，请检查请求路径。');
});

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, HOST, () => {
  console.log(`Hunyuan proxy server listening on http://${HOST}:${PORT}`);
});
