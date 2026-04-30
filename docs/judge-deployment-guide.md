# 评委部署说明

本文档面向评委或验收人员，说明拿到本项目代码压缩包后，如何在本地或服务器上部署运行。

## 1. 项目说明

本项目是一个“故宫建筑细节交互可视化”网页应用，主要由两部分组成：

- 前端：React + TypeScript + Vite，构建产物位于 `dist/`。
- 后端：`server.cjs`，基于 Express，提供 `/api/hunyuan` AI 讲解接口，并在生产模式下托管 `dist/` 静态文件。

完整体验需要运行 Node 后端，因为 AI 讲解接口需要服务端读取 `.env` 中的混元 API 配置。只部署到 GitHub Pages 等纯静态托管平台时，页面可以展示，但 `/api/hunyuan` 无法工作。

## 2. 环境要求

请先安装：

- Node.js：`20.19.0` 或更高版本，或 `22.12.0` 或更高版本
- npm：随 Node.js 一起安装即可

可用以下命令检查版本：

```bash
node -v
npm -v
```

本项目当前验证环境：

```text
Node.js v20.19.6
npm 10.8.2
```

## 3. 解压并进入项目

将压缩包解压后，进入项目根目录。项目根目录应包含 `package.json`、`server.cjs`、`vite.config.ts`、`src/`、`public/` 等文件和目录。

```bash
cd app
```

如果压缩包外层还有一层项目文件夹，请进入实际包含 `package.json` 的目录。

## 4. 安装依赖

推荐使用 `npm ci`，它会严格按照 `package-lock.json` 安装依赖：

```bash
npm ci
```

如果本地环境不支持 `npm ci`，也可以使用：

```bash
npm install
```

## 5. 配置环境变量

复制示例环境变量文件：

```bash
cp .env.example .env
```

Windows PowerShell 可使用：

```powershell
Copy-Item .env.example .env
```

然后编辑 `.env`，至少确认以下配置：

```env
HUNYUAN_API_KEY=your_hunyuan_api_key
HUNYUAN_BASE_URL=https://tokenhub.tencentmaas.com/v1
HUNYUAN_MODEL=hunyuan-2.0-instruct-20251111
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=
```

说明：

- `HUNYUAN_API_KEY` 是 AI 讲解接口所需的服务端密钥，请替换为有效 Key。
- `PORT=3001` 表示后端服务默认监听 `3001` 端口。
- `HOST=0.0.0.0` 表示允许局域网其他设备访问当前机器。
- 如果前后端同域部署，`CORS_ORIGIN` 可以留空。
- 如果前后端分域部署，请将 `CORS_ORIGIN` 设置为前端域名；多个域名用英文逗号分隔。
- 如果 `.env.example` 中包含 `NODE_ENV=production`，本地构建时 Vite 可能会给出提示。该提示不影响构建；也可以从 `.env` 中删除这一行。

## 6. 方式一：本地开发预览

适合评委在本机快速查看项目效果。

先启动后端代理：

```bash
npm run server
```

后端默认地址：

```text
http://127.0.0.1:3001
```

再打开第二个终端，启动前端开发服务：

```bash
npm run dev
```

如果需要让同一局域网内的其他设备访问，例如手机或另一台电脑，请使用：

```bash
npm run dev:lan
```

然后访问终端输出的地址，通常是：

```text
http://127.0.0.1:5173
```

或局域网地址，例如：

```text
http://192.168.x.x:5173
```

开发模式下，Vite 会把 `/api` 请求代理到后端。默认代理目标是：

```text
http://127.0.0.1:3001
```

如需修改代理地址，可在 `.env` 中设置：

```env
VITE_API_PROXY_TARGET=http://127.0.0.1:3001
VITE_DEV_PORT=5173
```

## 7. 方式二：生产构建后一体化运行

这是最推荐的验收方式。前端先构建为静态文件，再由 `server.cjs` 同时托管网页和 AI 接口。

执行构建：

```bash
npm run build
```

构建成功后会生成或更新 `dist/` 目录。

启动生产服务：

```bash
npm run start
```

或：

```bash
npm run server
```

然后访问：

```text
http://127.0.0.1:3001
```

如果部署在服务器上，请将 `127.0.0.1` 替换为服务器公网 IP、内网 IP 或绑定的域名。

## 8. 健康检查

服务启动后，可以访问：

```text
http://127.0.0.1:3001/api/health
```

正常情况下会返回类似：

```json
{
  "ok": true,
  "service": "hunyuan-proxy",
  "model": "hunyuan-2.0-instruct-20251111"
}
```

如果该接口正常，但页面中的 AI 讲解不可用，请优先检查 `.env` 中的 `HUNYUAN_API_KEY` 是否有效。

## 9. 云服务器部署建议

如果部署到云服务器，推荐流程如下：

```bash
npm ci
npm run build
npm run start
```

生产环境建议配置：

```env
HUNYUAN_API_KEY=your_hunyuan_api_key
HUNYUAN_BASE_URL=https://tokenhub.tencentmaas.com/v1
HUNYUAN_MODEL=hunyuan-2.0-instruct-20251111
HOST=0.0.0.0
PORT=3001
CORS_ORIGIN=https://your-domain.example
```

如果使用 Nginx 反向代理，可将域名请求转发到本机 `3001` 端口。示例思路：

```text
https://your-domain.example  ->  http://127.0.0.1:3001
```

项目本身不强制要求 Nginx；只要外部能访问 Node 服务监听的端口即可。

## 10. Render / Railway / Fly.io 等平台部署

选择支持 Node.js 服务的平台，并配置：

```text
Build Command: npm ci && npm run build
Start Command: npm run start
```

在平台环境变量中填写：

```env
HUNYUAN_API_KEY=your_hunyuan_api_key
HUNYUAN_BASE_URL=https://tokenhub.tencentmaas.com/v1
HUNYUAN_MODEL=hunyuan-2.0-instruct-20251111
HOST=0.0.0.0
CORS_ORIGIN=https://your-frontend-domain.example
```

多数平台会自动注入 `PORT`，此时可以不手动设置 `PORT`；如果平台要求固定端口，则按平台说明填写。

## 11. 常见问题

### 页面能打开，但 AI 讲解报错

请检查：

- 后端服务是否正在运行。
- `.env` 是否存在。
- `HUNYUAN_API_KEY` 是否填写且有效。
- 浏览器访问的页面地址是否能请求到 `/api/hunyuan`。
- 分域部署时，`CORS_ORIGIN` 是否包含当前前端域名。

### `npm run build` 出现大 chunk 警告

这是 Vite 的体积警告，不影响部署成功。项目包含 Three.js、ECharts 等较大的前端依赖，因此构建产物较大是正常现象。

### 构建时提示 `NODE_ENV=production is not supported in the .env file`

这是 Vite 对 `.env` 中 `NODE_ENV=production` 的提示，不影响本项目构建。可以从 `.env` 中删除 `NODE_ENV=production`。

### 端口被占用

修改 `.env`：

```env
PORT=3002
```

然后重新启动：

```bash
npm run start
```

访问地址也同步改为：

```text
http://127.0.0.1:3002
```

## 12. 验收检查清单

部署完成后，建议按以下顺序检查：

- 页面首页可以正常打开。
- 故宫建筑图片、3D 角楼模型和热点内容可以正常显示。
- `/api/health` 返回 `ok: true`。
- AI 讲解输入问题后可以返回中文讲解内容。
- 刷新页面后仍能正常访问，不出现 404。
- 局域网或公网访问时，地址、端口和防火墙规则配置正确。

## 13. 本项目已验证命令

在当前项目中，以下命令已验证可用：

```bash
npm run build
```

构建成功后输出 `dist/`，并可通过：

```bash
npm run start
```

启动一体化服务。
