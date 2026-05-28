# 紫禁营造志项目文件导览

本文档用于帮助后续 AI、开发者和参赛队友快速理解当前项目结构、运行方式、核心文件职责和国赛展示逻辑。

## 项目概览

“紫禁营造志”是一个以紫禁城建筑细节交互为主题的单页 Web 应用，面向计算机设计大赛国赛展示。项目采用“重点样本深度识读 + 多建筑图文导览 + 专题可视化扩展 + AI 辅助讲解”的结构。

当前内容结构：

- 首页：展示项目主题、项目定位语“从一座城，到一处构件：用交互可视化读懂紫禁城营造智慧。”和四个核心亮点标签。
- 地图页：使用本地故宫导览图，展示建筑点位、资料来源、推荐演示路线。
- 东北角楼：当前唯一 3D 深度探索样本，支持三维模型、热点识读、线稿/实景对照、AI 讲解。
- 午门、太和殿、乾清宫、文华殿、武英殿：图文导览建筑，展示主图、基础介绍、空间功能和文化意义。
- 神武门：当前不再展示地图点位，之前的 placeholder 示例已删除。
- 图表区：“紫禁数读：古建筑营造密码”，展示古建筑营造、木材、屋顶、彩画等专题可视化。
- 彩画专题：作为专题知识扩展页面。
- AI 讲解：前端请求 `/api/hunyuan`，由本地或线上 Express 代理调用腾讯混元兼容接口。

## 技术栈

- 前端：React 19、TypeScript、Vite
- 样式：Tailwind CSS、全局 CSS、shadcn/ui 风格组件
- 动画：GSAP、CSS animation
- 3D：Three.js、@react-three/fiber、@react-three/drei
- 图表：ECharts、echarts-for-react
- 后端代理：Express、dotenv、cors、TokenHub/OpenAI-compatible 混元接口

## 建筑类型与详情页逻辑

当前建筑详情通过 `detailType` 区分：

```ts
detailType: "3d" | "image" | "placeholder"
```

当前实际展示：

| 建筑 | detailType | 展示方式 |
| --- | --- | --- |
| 东北角楼 | `3d` | 3D 模型、热点识读、线稿/实景对照、AI 讲解 |
| 午门 | `image` | 图文导览 |
| 太和殿 | `image` | 图文导览 |
| 乾清宫 | `image` | 图文导览 |
| 文华殿 | `image` | 图文导览 |
| 武英殿 | `image` | 图文导览 |

重要说明：

- 只有 `detailType === "3d"` 时才挂载 `Building3DCanvas`。
- 只有东北角楼会加载 `/models/corner-tower.glb`。
- 图片建筑不会请求 `corner-tower.glb`。
- placeholder 类型逻辑可以保留，但当前地图不展示神武门入口。
- 不要把所有建筑误写成 3D 模型展示。

## 运行链路

1. `index.html` 提供根节点 `#root`。
2. `src/main.tsx` 挂载 React 应用。
3. `src/App.tsx` 控制核心页面状态：`intro`、`map`、`detail`、`painting`。
4. 首页进入地图页。
5. 地图页点击建筑点位后，根据建筑 `detailType` 进入不同详情：
   - `3d`：东北角楼 3D 深度详情页。
   - `image`：图片图文详情页。
   - `placeholder`：建设中提示页。
6. 东北角楼详情页挂载 `Building3DCanvas`，加载 `/models/corner-tower.glb`。
7. 图片建筑详情页使用 `BuildingImageHotspot` 等图文逻辑，不加载 3D。
8. AI 面板向 `/api/hunyuan` 发送当前建筑、热点和上下文，由 `server.cjs` 代理调用腾讯混元兼容接口。
9. 图表区由 `PalaceDataCharts` 渲染，并包含可视化说明。
10. 彩画专题通过页面状态进入独立专题视图。

## 本地运行与常用命令

```bash
npm run dev
npm run dev:lan
npm run server
npm run start
npm run build
npm run preview
npm run lint
```

本地开发时，如果要使用 AI 讲解功能，需要同时启动两个进程：

```bash
npm run server
```

用于启动本地 Express 代理，默认监听 `3001`，提供 `/api/hunyuan`。

```bash
npm run dev
```

用于启动 Vite 前端开发服务。Vite 会把 `/api` 请求代理到 `http://127.0.0.1:3001`。

如果只运行 `npm run dev` 而没有运行 `npm run server`，AI 请求会失败，并在终端出现类似：

```text
[vite] http proxy error: /api/hunyuan
Error: connect ECONNREFUSED 127.0.0.1:3001
```

这不是 AI 逻辑坏了，而是本地后端代理没有启动。线上 Render 等 Node 平台部署时，`server.cjs` 会托管构建产物并处理 `/api/hunyuan`，所以线上不需要像本地一样手动开两个终端。

## AI 讲解与环境变量

`src/components/AiGuidePanel.tsx` 负责输入问题、展示示例问题、提交 `/api/hunyuan` 请求、展示 AI 返回结果或错误提示。

`server.cjs` 是 Express 后端代理，负责读取服务端环境变量，调用腾讯混元兼容接口，并返回前端可展示的讲解文本。AI 密钥只应存在服务端 `.env` 或部署平台环境变量中，不应写入 `src`、`public` 或前端代码。本地 `.env` 不应提交到仓库。

当前 `server.cjs` 实际读取的环境变量：

```env
HUNYUAN_API_KEY=your_tokenhub_api_key_here
HUNYUAN_BASE_URL=https://tokenhub.tencentmaas.com/v1
HUNYUAN_MODEL=hunyuan-2.0-instruct-20251111
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=
```

`.env.example` 应只保留占位符，不要写真实 key。

## 顶层文件

| 文件 | 作用 |
| --- | --- |
| `.env` | 本地服务端环境变量，包含密钥等敏感配置，不应提交。 |
| `.env.example` | 环境变量示例，与 `server.cjs` 当前读取变量保持一致，只使用占位符。 |
| `.gitattributes` | Git 属性配置。 |
| `.gitignore` | Git 忽略规则。 |
| `components.json` | shadcn/ui 配置。 |
| `eslint.config.js` | ESLint 配置。 |
| `index.html` | Vite HTML 入口，包含根节点 `#root`。 |
| `info.md` | 原 Villa Template 说明文档，当前作为历史模板参考，不参与主应用。 |
| `package.json` | 项目依赖、脚本和包元数据。 |
| `package-lock.json` | npm 锁文件。 |
| `postcss.config.js` | PostCSS 配置。 |
| `README.md` | 当前项目说明文档。 |
| `server.cjs` | Express 后端代理，提供 `POST /api/hunyuan`，存在 `dist` 时托管构建产物。 |
| `tailwind.config.js` | Tailwind 配置，包含色板、字体、动画等扩展。 |
| `tsconfig.json` | TypeScript 根配置。 |
| `tsconfig.app.json` | 前端应用 TypeScript 配置。 |
| `tsconfig.node.json` | Node/Vite 配置文件 TypeScript 配置。 |
| `vite.config.ts` | Vite 配置，设置 React 插件、别名、开发端口和 `/api` 代理。 |

## `docs` 目录

| 文件 | 作用 |
| --- | --- |
| `docs/project-file-guide.md` | 当前文件，项目结构与运行导览。 |
| `docs/run-and-deploy.md` | 运行与部署说明。 |
| `docs/judge-deployment-guide.md` | 评审/展示部署相关说明。 |
| `docs/building-hotspots-and-images-checklist*.md` | 建筑热点与图片素材检查记录。 |
| `docs/taihe-dian.md`、`docs/wumen.md`、`docs/wenhua-dian.md`、`docs/wuying-dian.md` | 建筑资料文档或整理稿。 |

## `src` 目录

| 文件 | 作用 |
| --- | --- |
| `src/main.tsx` | React 入口，引入 `index.css`，把 `App` 渲染到 `#root`。 |
| `src/App.tsx` | 核心业务入口。负责页面状态控制、首页、地图页、详情页、彩画专题入口、建筑点位数据、建筑详情数据、`detailType` 分支、东北角楼 3D 深度样本逻辑、图片建筑图文导览逻辑、资料来源信息条和推荐演示路线。 |
| `src/App.css` | 主要样式文件。负责首页视觉、地图点位、分类标签、hover 卡片、资料来源模块、推荐演示路线、详情页布局、3D 深度页、图片详情页和响应式布局。 |
| `src/index.css` | 全局 CSS，导入字体、Tailwind 层和旧模板基础工具样式。 |
| `src/config.ts` | 原 Villa Template 集中配置。当前主 `App.tsx` 不依赖它，主要供旧 `src/sections/*` 使用。 |

## `src/components` 目录

| 文件 | 作用 |
| --- | --- |
| `src/components/AiGuidePanel.tsx` | AI 问答面板。负责输入问题、示例问题、请求 `/api/hunyuan`、展示混元返回结果或错误提示。上下文来自当前建筑、热点和页面资料；本地开发依赖 `npm run server` 提供代理。 |
| `src/components/Building3DCanvas.tsx` | 只用于东北角楼。加载 `/models/corner-tower.glb`，提供 R3F Canvas、OrbitControls、灯光和热点；普通图片建筑不会挂载它；模型加载失败时有兜底提示。 |
| `src/components/BuildingImageHotspot.tsx` | 用于图片建筑或图文热点展示。主图懒加载，图片加载失败有兜底提示，不加载 3D 模型。 |
| `src/components/HotspotDetailCards.tsx` | 展示构件说明、技术参数、文化意义等折叠内容。主要服务于东北角楼热点详情，也可支持图文详情模块。 |
| `src/components/PalaceDataCharts.tsx` | 渲染“紫禁数读：古建筑营造密码”图表区和彩画专题页。当前包含可视化说明；图表用于知识结构和建筑等级关系可视化表达，部分图表不作为精确统计数据使用。 |
| `src/components/ErrorBoundary.tsx` | 基础错误边界，避免局部组件异常导致整页白屏。 |
| `src/components/Preloader.tsx` | 原模板预加载组件，当前主 `App.tsx` 未使用。 |
| `src/components/ScrollToTop.tsx` | 原模板返回顶部按钮，当前主 `App.tsx` 未使用。 |

## `src/components/ui` 目录

这是 shadcn/ui 风格的通用 UI 组件库，通常封装 Radix UI、Lucide 图标、Tailwind class 和本地工具函数 `cn`。当前主流程主要使用少量组件和工具，目录中的大量组件属于通用资产。

## `src/sections` 目录

这些文件来自原 Villa Template，当前主 `App.tsx` 没有导入它们。它们仍可作为历史模板参考或后续复用素材。

| 文件 | 作用 |
| --- | --- |
| `src/sections/Navigation.tsx` | 原模板导航栏。 |
| `src/sections/Hero.tsx` | 原模板首屏 Hero。 |
| `src/sections/WineShowcase.tsx` | 原模板酒品展示区。 |
| `src/sections/WineryCarousel.tsx` | 原模板酒庄/空间轮播区。 |
| `src/sections/Museum.tsx` | 原模板博物馆/历史区。 |
| `src/sections/News.tsx` | 原模板新闻区。 |
| `src/sections/ContactForm.tsx` | 原模板联系表单。 |
| `src/sections/Footer.tsx` | 原模板页脚。 |

## `src/hooks` 与 `src/lib`

| 文件 | 作用 |
| --- | --- |
| `src/hooks/use-mobile.ts` | 响应式 hook，用于判断移动端，主要供通用组件使用。 |
| `src/lib/utils.ts` | 通用工具函数，包含 `cn`，用于合并 className。 |

## `public` 目录

| 路径 | 作用 |
| --- | --- |
| `public/models/corner-tower.glb` | 东北角楼三维模型，只供 `Building3DCanvas` 使用。 |
| `public/images/custom-palace-map.png` | 地图页核心底图。 |
| `public/images/nine-dragon-wall.jpg` | 首页背景图。 |
| `public/images/corner-tower.jpg` | 东北角楼图像素材。 |
| `public/images/corner-tower-interior.jpg` | 东北角楼内部图片素材。 |
| `public/images/xumizuo-line.png`、`public/images/xumizuo-exterior.png` | 东北角楼须弥座线稿/实景对照素材。 |
| `public/images/wuding-line.png`、`public/images/wuding-exterior.png` | 东北角楼屋顶体系线稿/实景对照素材。 |
| `public/images/waiqiang-exterior.png` | 东北角楼外墙实景素材。 |
| `public/images/buildings/*` | 午门、太和殿、乾清宫、文华殿、武英殿等图文建筑主图和局部图。 |
| `public/images/wumen-*.jpg`、`public/images/taihedian-*.jpg`、`public/images/qianqinggong-*.jpg` 等 | 建筑图文导览素材。 |

注意：当前不是所有建筑都有模型。不要在文档或代码中写成“所有建筑均支持 3D”。

## 资料来源

地图页当前展示正式资料来源条：

> 资料来源：故宫博物院官网公开资料、《故宫建筑图典》、梁思成《中国建筑史》、于倬云《紫禁城宫殿》等资料整理。

## 可视化说明

图表区已有统一说明：

> 本作品部分图表为知识结构与建筑等级关系的可视化表达，用于辅助理解紫禁城古建筑营造逻辑；其中涉及的类型、等级、构造关系依据公开资料与文献整理，不作为精确统计数据使用。

不要把当前图表描述成全部精确统计数据。

## 推荐演示路线

首页  
→ 地图导览  
→ 东北角楼 3D 深度探索  
→ 点击屋顶 / 斗栱等构件热点  
→ 查看线稿与实景对照  
→ 返回图表区 / 进入彩画专题  
→ 使用 AI 讲解

东北角楼是当前三维构件识读样本，其他建筑主要提供图文导览，用于扩展紫禁城整体空间认知。该结构是“重点样本深度识读 + 多建筑图文导览 + 专题可视化扩展”。

## 构建产物与部署

| 路径 | 作用 |
| --- | --- |
| `node_modules/` | npm 安装的第三方依赖，不要手动编辑。 |
| `dist/` | `npm run build` 生成的静态构建产物。`server.cjs` 在该目录存在时会托管它。 |

构建：

```bash
npm run build
```

一体化运行：

```bash
npm run start
```

部署到支持 Node 的平台时，应设置服务端环境变量，并由 `server.cjs` 同时处理静态文件和 `/api/hunyuan`。

## 当前需要特别注意的点

1. 只有东北角楼是 3D 建筑，不要给其他建筑伪造 3D。
2. 普通图片建筑不要请求 `corner-tower.glb`。
3. 不要恢复神武门点位，除非后续确实补齐内容并确认要展示。
4. 本地 AI 需要同时启动 `npm run server` 和 `npm run dev`。
5. `.env` 不要提交，密钥不要写进前端代码。
6. 图表数据当前包含知识结构可视化表达，不要误写为精确统计数据。
7. `src/sections/*`、`info.md` 等旧模板残留不参与当前主应用。
8. lint 可能仍有历史问题，集中在旧模板或 shadcn 通用组件，不代表主流程无法构建。
9. chunk 体积警告与 Three.js、ECharts 等依赖有关，后续可通过懒加载/拆包优化。
10. Vite 配置了 `base: './'`，构建产物适合相对路径部署。

## 本次文档更新说明

本次只更新文档，不修改业务代码、图表数据、AI 逻辑、3D 逻辑或样式。Markdown 文档修改通常不影响构建，通常不需要为了文档变更单独运行 `npm run build`。
