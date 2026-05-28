# 紫禁营造志

“紫禁营造志”是一个以故宫建筑细节交互为主题的 React + TypeScript + Vite 单页 Web 应用，面向中国大学生计算机设计大赛国赛展示场景。作品叙事以“从一座城，到一处构件”为核心：先通过紫禁城空间导览建立整体认知，再以东北角楼作为三维构件识读样本，扩展到数据可视化、彩画专题与 AI 智能讲解。

## 当前作品结构

- 东北角楼：3D 深度探索样本，支持三维模型、构件热点、线稿与实景对照、AI 讲解。
- 午门、太和殿、乾清宫、文华殿、武英殿：图文导览节点，展示建筑图片、基础介绍、空间功能与文化说明。
- 资料建设中节点：用于标注后续扩展内容，不伪造 3D 模型或热点。
- 彩画专题与数据可视化：作为故宫建筑知识系统的专题扩展，当前图表数据保持项目既有逻辑。
- AI 讲解：通过服务端代理调用混元接口，前端不保存密钥，并提供本地兜底摘要。

## 技术栈

- React 19 + TypeScript
- Vite
- Three.js / React Three Fiber / Drei
- ECharts / echarts-for-react
- GSAP
- Tailwind CSS 与本地 CSS
- Express 服务端代理

## 本地运行

安装依赖：

```bash
npm install
```

启动前端开发服务：

```bash
npm run dev
```

局域网演示可使用：

```bash
npm run dev:lan
```

## AI 讲解代理

前端只请求 `/api/hunyuan`，腾讯云或 TokenHub 相关密钥只放在服务端 `.env` 中，不要写入前端代码。

1. 复制 `.env.example` 为 `.env`。
2. 根据当前后端代理配置填写 `HUNYUAN_API_KEY`、`HUNYUAN_BASE_URL`、`HUNYUAN_MODEL` 等变量。
3. 启动服务端代理：

```bash
npm run server
```

开发环境下 Vite 会将 `/api` 请求代理到后端。AI 接口异常或超时时，前端会展示本地讲解摘要，保证比赛现场演示不会停在无限加载状态。

## 构建与部署

构建生产包：

```bash
npm run build
```

一体化 Node 部署：

```bash
npm run start
```

`server.cjs` 会托管 `dist` 静态文件，并提供 `/api/hunyuan` 代理。由于 AI 讲解依赖服务端环境变量，完整版本建议部署到支持 Node 服务的平台或服务器；纯静态托管只能展示不含真实 AI 调用的前端部分。

## 项目文件说明

- `src/App.tsx`：主状态流转与核心页面，保持 `intro → map → detail → painting`。
- `src/components/Building3DCanvas.tsx`：东北角楼专用三维模型展示。
- `src/components/BuildingImageHotspot.tsx`：图文建筑主图热点导览。
- `src/components/HotspotDetailCards.tsx`：热点详情折叠卡片。
- `src/components/PalaceDataCharts.tsx`：数据可视化和彩画专题。
- `src/components/AiGuidePanel.tsx`：AI 讲解面板、模式选择、超时与兜底摘要。
- `src/components/ErrorBoundary.tsx`：基础错误边界，避免局部组件异常导致整页白屏。
- `server.cjs`：Express 代理与构建产物托管。

## 历史模板说明

项目早期从通用模板改造而来，`src/config.ts`、`src/sections/*` 与 `info.md` 属于历史模板参考内容，当前主应用不导入这些 section。保留它们是为了避免仓库历史和文档说明断裂，不参与国赛主页面运行。
