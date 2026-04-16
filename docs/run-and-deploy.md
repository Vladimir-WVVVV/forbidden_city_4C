# 运行与部署说明

本项目分为两部分：

- 静态前端：React + Vite 构建出的 `dist`。
- Node 后端代理：`server.cjs` 提供 `/api/hunyuan`，负责读取 `.env` 中的腾讯云密钥并调用混元接口。

因此，带 AI 讲解的完整版本不能只部署到 GitHub Pages 这类纯静态托管服务。GitHub Pages 可以展示纯前端页面，但无法运行 `server.cjs`，也无法安全保存服务端密钥。

## 局域网开发访问

1. 复制环境变量文件：

```bash
cp .env.example .env
```

Windows PowerShell 可用：

```powershell
Copy-Item .env.example .env
```

2. 在 `.env` 中填写腾讯云密钥：

```env
TENCENT_SECRET_ID=your_tencent_secret_id
TENCENT_SECRET_KEY=your_tencent_secret_key
HUNYUAN_MODEL=hunyuan-turbos-latest
TENCENT_REGION=ap-guangzhou
PORT=3001
HOST=0.0.0.0
```

3. 启动后端代理：

```bash
npm run server
```

4. 另开终端启动前端：

```bash
npm run dev:lan
```

5. 在同一局域网设备上访问 Vite 输出的 Network 地址，例如：

```text
http://192.168.1.23:5173
```

## 构建后一体化运行

```bash
npm run build
npm run start
```

构建后 `server.cjs` 会托管 `dist` 目录，并继续提供 `/api/hunyuan`。访问方式取决于部署机器地址与 `PORT`。

## 推荐上线方式

优先选择支持 Node 服务的部署平台：

- 云服务器：安装 Node，上传项目，配置 `.env`，运行 `npm ci && npm run build && npm run start`。
- Render / Railway / Fly.io 等：构建命令使用 `npm ci && npm run build`，启动命令使用 `npm run start`，并在平台环境变量中填写腾讯云密钥。

生产环境建议设置：

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3001
CORS_ORIGIN=https://your-domain.example
```

如果前后端同域部署，`CORS_ORIGIN` 可以留空；如果前端和后端分域部署，需要填写允许访问后端的前端域名，多个域名用英文逗号分隔。
