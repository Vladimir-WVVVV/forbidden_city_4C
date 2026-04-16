import { type FormEvent, useMemo, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface AiGuidePanelProps {
  building: string;
  hotspot?: string;
  context?: string;
  compact?: boolean;
}

interface HunyuanErrorPayload {
  code?: string;
  message?: string;
}

interface HunyuanResponse {
  ok: boolean;
  answer?: string;
  error?: string | HunyuanErrorPayload;
}

const EXAMPLE_QUESTIONS = [
  '东北角楼为什么有这么复杂的层次？',
  '这个构件体现了什么营造智慧？',
  '它和故宫礼制有什么关系？',
];

const FALLBACK_ERROR = 'AI 讲解暂时不可用，请稍后再试，或检查后端代理与环境变量配置。';

function getErrorMessage(payload: HunyuanResponse | null, status: number) {
  if (!payload) {
    return status >= 500 ? 'AI 讲解服务返回异常，请稍后再试。' : FALLBACK_ERROR;
  }

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  if (payload.error?.message) {
    return payload.error.message;
  }

  return FALLBACK_ERROR;
}

async function readJsonSafely(response: Response): Promise<HunyuanResponse | null> {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as HunyuanResponse;
  } catch {
    return null;
  }
}

export function AiGuidePanel({ building, hotspot, context = '', compact = false }: AiGuidePanelProps) {
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const placeholder = useMemo(() => {
    if (hotspot) {
      return `例如：${hotspot}在结构和审美上有什么特点？`;
    }
    return '例如：东北角楼在故宫建筑体系中有什么意义？';
  }, [hotspot]);

  const askHunyuan = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/api/hunyuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          building,
          hotspot,
          context,
        }),
      });

      const data = await readJsonSafely(response);
      if (!response.ok || !data?.ok) {
        throw new Error(getErrorMessage(data, response.status));
      }

      const cleanAnswer = data.answer?.trim();
      setAnswer(cleanAnswer || '混元暂时没有返回有效内容，请稍后再试，或换一种问法继续提问。');
    } catch (fetchError) {
      if (fetchError instanceof TypeError) {
        setError('无法连接 AI 讲解服务。请确认后端代理已启动，并且当前访问地址可以请求 `/api/hunyuan`。');
      } else {
        setError(fetchError instanceof Error ? fetchError.message : FALLBACK_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askHunyuan(message);
  };

  const handleExampleClick = (question: string) => {
    setMessage(question);
    void askHunyuan(question);
  };

  return (
    <section
      className={cn(
        'ai-guide-panel rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-4 shadow-sm',
        compact ? 'space-y-3' : 'space-y-4'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-[var(--color-primary-dark)]">
            <Sparkles size={16} className="text-[var(--color-gold)]" />
            问问混元
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-gray)]">
            围绕{building}{hotspot ? ` · ${hotspot}` : ''}生成一段适合展陈讲解的回答。
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--color-gold)] px-2 py-1 text-[10px] text-[var(--color-primary-dark)]">
          AI讲解
        </span>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="min-h-20 w-full resize-y rounded-lg border border-[var(--color-border)] bg-white/80 px-3 py-2 text-sm leading-relaxed text-[var(--color-ink)] outline-none transition focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[rgba(212,175,55,0.18)]"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handleExampleClick(question)}
                className="rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-1 text-xs text-[var(--color-gray)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-primary-dark)]"
              >
                {question}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary-dark)] bg-[var(--color-primary-dark)] px-4 py-2 text-sm text-white transition hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!loading && <Send size={16} />}
            {loading ? '生成中...' : '生成讲解'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="rounded-lg border border-[var(--color-border)] bg-white/60 px-4 py-3 text-sm text-[var(--color-gray)]">
          正在联系 AI 讲解服务，请稍候。
        </div>
      )}

      {!loading && (answer || error) && (
        <div
          className={cn(
            'rounded-lg border px-4 py-3 text-sm leading-relaxed',
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-[var(--color-gold)] bg-white/75 text-[var(--color-ink)]'
          )}
        >
          {error || answer}
        </div>
      )}
    </section>
  );
}
