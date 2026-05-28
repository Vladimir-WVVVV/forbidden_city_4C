# 紫禁营造志项目文件导览

本文档用于帮助后续 AI、开发者和参赛队友快速理解当前项目结构、运行方式、核心文件职责和国赛展示逻辑。本文档只描述当前主应用状态，不应把旧模板残留误认为当前展示功能。

## 项目概览

“紫禁营造志”是一个以紫禁城建筑细节交互为主题的单页 Web 应用，面向计算机设计大赛国赛展示。项目采用“重点样本深度识读 + 多建筑图文导览 + 专题可视化扩展 + AI 辅助讲解”的结构。

当前页面与功能包括：

- 首页：展示项目主题、项目定位语、古典字体风格和“开启故宫建筑之旅”入口按钮。
- 地图页：使用本地故宫导览图展示建筑点位、资料来源和推荐演示路线。
- 东北角楼：当前唯一 3D 深度探索样本，支持静态预览、点击加载三维模型、热点识读、线稿/实景对照、AI 讲解。
- 午门、太和殿、乾清宫、文华殿、武英殿：图文导览建筑，展示主图、基础介绍、空间功能和文化意义。
- 文化拾遗：展示宫廷建筑细节、屋脊瑞兽、故宫猫等文化补充内容，卡片 hover 时显示对应真实图片。
- 故宫时间轴：使用横向时间轴图片展示故宫重要历史节点。
- 紫禁数读：展示古建筑营造、木材、屋顶、彩画等专题可视化。
- 彩画专题：作为专题知识扩展页面。
- AI 讲解：前端请求 `/api/hunyuan`，由 Express 后端代理调用腾讯混元接口。

神武门点位已经删除，当前地图不展示神武门。`placeholder` 类型逻辑可以存在，但当前没有通过神武门暴露“建设中”入口。

## 技术栈

- 前端：React 19、TypeScript、Vite
- 样式：Tailwind CSS、全局 CSS、shadcn/ui 风格组件
- 动画：GSAP、CSS animation
- 3D：Three.js、@react-three/fiber、@react-three/drei
- 图表：ECharts、echarts-for-react
- 手势识别：MediaPipe Tasks Vision / Hand Landmarker，依赖包为 `@mediapipe/tasks-vision`
- 后端代理：Express、dotenv、cors、腾讯混元兼容接口
- 部署：Render 等支持 Node 的平台

## 建筑类型与详情页逻辑

当前建筑详情通过 `detailType` 区分：

```ts
detailType: "3d" | "image" | "placeholder"
```

当前实际展示：

| 建筑 | detailType | 展示方式 |
| --- | --- | --- |
| 东北角楼 | `3d` | 静态预览、点击加载 3D 模型、热点识读、线稿/实景对照、AI 讲解 |
| 午门 | `image` | 图文导览 |
| 太和殿 | `image` | 图文导览 |
| 乾清宫 | `image` | 图文导览 |
| 文华殿 | `image` | 图文导览 |
| 武英殿 | `image` | 图文导览 |

重要说明：

- 只有 `detailType === "3d"` 时才可能挂载 `Building3DCanvas`。
- 只有东北角楼会加载 `/models/corner-tower.glb`。
- 普通图片建筑不会请求 `corner-tower.glb`。
- 神武门 placeholder 已删除，不再展示在地图上。
- 不要把所有建筑误写成 3D 模型展示。

## 首页视觉说明

首页已进行国赛前视觉优化，相关实现主要在 `src/App.tsx` 和 `src/App.css`：

- 删除了原先的四个亮点卡片。
- 主标题采用更有书法、行楷、民艺感的字体风格。
- 小标题、定位语和按钮文字风格统一。
- 内容整体下移，增强留白和展陈感。
- 按钮仍然作为进入地图页的主操作。
- 不应恢复四个亮点卡片。

当前首页字体使用系统字体栈，例如 `"STXingkai"`、`"华文行楷"`、`"KaiTi"`、`"楷体"`、`"FangSong"`、`"仿宋"`、`serif`，运行时代码没有引用本机字体绝对路径。仓库中如存在字体素材文件，尤其文件名含“商用需授权”的字体，使用前必须确认授权；不要把本机字体路径写入代码或文档中的运行时引用示例。

## 3D 模型加载说明

东北角楼是当前唯一 3D 深度样本。为降低详情页初始渲染压力，3D 区域先显示静态预览图；用户点击“进入 3D 识读”等按钮后，才挂载 `Building3DCanvas` 并加载 `/models/corner-tower.glb`。

这样可以避免进入东北角楼详情页时立即触发 3D 渲染。`useGLTF.preload` 不应恢复，避免普通浏览阶段提前请求模型。普通图片建筑不会加载 3D 模型。

静态预览提示语中类似“先浏览静态图，点击后再加载三维模型，降低详情页初始渲染压力。”的解释性文案已删除，不应恢复。模型加载失败时应有友好兜底提示，例如提示“三维模型暂时加载失败，请刷新页面或稍后重试”。

## 文化拾遗

文化拾遗区域用于补充展示故宫建筑与宫城日常相关的文化细节，包括：

- 九梁传说：角楼为什么这么复杂
- 宫门细节：门钉不只是装饰
- 色彩记忆：红墙黄瓦的辨识度
- 屋脊故事：瑞兽守在屋脊上
- 宫城日常：一座城里的时间感
- 今日故宫：故宫里的猫

该区域已接入六张真实图片，图片存放在：

```text
public/images/culture-memory/
```

前端引用必须使用：

```text
/images/culture-memory/xxx.jpg
```

六张图片路径：

```text
/images/culture-memory/corner-tower-roof.jpg
/images/culture-memory/palace-door-nails.jpg
/images/culture-memory/red-wall-yellow-tiles.jpg
/images/culture-memory/roof-beasts.jpg
/images/culture-memory/palace-daily-light.jpg
/images/culture-memory/palace-cat.jpg
```

说明：

- hover 时卡片显示对应图片。
- 图片现在不再叠加强渐变遮罩。
- 图片应完整、清晰可见。
- 文字区域与图片区域应分离或保持可读。
- 移动端无 hover 时应保持布局稳定。
- 不要热链外站图片。
- 不要使用 AI 生成图片替代真实素材。

### 文化拾遗手势展陈模式

文化拾遗区域新增“开启手势展陈”按钮。点击后打开全屏沉浸式 overlay，展示 6 个文化拾遗主题。每个主题包含大图、标题、默认短文本、关键词标签和展开讲解长文本。

当前每个文化主题的数据层级应包含：

- `intro`：默认显示的短介绍，完整显示，不应省略。
- `detail`：展开讲解后的长文本。
- `tags`：关键词标签。
- `image`：对应图片路径。

默认状态显示 `intro`，点击“展开讲解”或使用张开手掌手势后显示 `detail`。切换上一项 / 下一项时，展开状态应自动收起，避免 overlay 默认文字过长，同时保留展陈讲解的信息层级。

键盘操作：

- `ArrowLeft`：上一项。
- `ArrowRight`：下一项。
- `Enter` / `Space`：展开或收起讲解。
- `Escape`：退出展陈。

按钮操作：

- 上一项。
- 下一项。
- 展开讲解 / 收起讲解。
- 退出展陈。
- 开启 / 关闭手势识别。

手势操作：

- 手向左划：下一项。
- 手向右划：上一项。
- 张开手掌：展开 / 收起讲解。
- 握拳：收起讲解或保持当前安全逻辑，不直接退出 overlay。

手势识别只作用于“文化拾遗 · 手势展陈”overlay，不会控制东北角楼 3D 模型，不会控制地图页，不会控制 AI，也不会上传视频流到后端。

### 手势识别运行条件

手势识别依赖浏览器摄像头权限。用户必须点击“开启手势识别”后才会请求摄像头；页面不会在打开 overlay 时自动请求摄像头。

运行条件：

- 本地 `localhost` 一般允许摄像头。
- 线上需要 HTTPS。
- Render 部署地址为 HTTPS，原则上支持浏览器摄像头权限。
- 如果用户拒绝摄像头权限，仍可使用按钮和键盘操作。
- 如果摄像头被占用或浏览器不支持，也不会影响普通展陈模式。

隐私原则：

```text
摄像头画面仅用于浏览器本地手势识别，不上传视频流。
```

项目没有为手势识别新增任何后端上传接口，也不应修改 `server.cjs` 来处理视频帧。

### 手势识别实现注意事项

当前手势方向与逻辑：

- 左挥：下一项。
- 右挥：上一项。
- 张开手掌：展开 / 收起讲解。
- 握拳：收起讲解，不建议直接退出 overlay，避免误触。

维护注意：

- 左右挥手通过手掌中心点在一段时间内的横向位移判断。
- 当前代码中使用 `IS_VIDEO_MIRRORED` 处理摄像头镜像预览和 MediaPipe 原始坐标之间的方向关系。
- 如果未来发现左右方向反了，应优先调整 `IS_VIDEO_MIRRORED` 或方向映射，不要大改算法。
- 手势识别应保留 cooldown，避免同一次手势连续触发。
- 关闭手势识别或关闭 overlay 时，应释放摄像头 `stream tracks`。
- 手势失败不能影响按钮和键盘兜底。

## 故宫时间轴

时间轴区域已从原来的简易横向文字条，升级为横向时间轴图片展示。

图片文件建议路径：

```text
public/images/culture-memory/forbidden-city-timeline.png
```

前端引用路径：

```text
/images/culture-memory/forbidden-city-timeline.png
```

说明：

- 该图用于展示故宫重要历史节点。
- 页面中应以图片化时间轴替代原先的 `1420 / 明清 / 今天` 简易文字横条。
- 图片应自适应容器宽度。
- 不应裁掉主要文字。
- 不应叠加强白色渐变导致图片发灰。
- 移动端应避免横向滚动。

## 资源路径规范

运行时代码和样式文件中不得出现本机绝对路径，例如：

```text
E:\
C:\
/Users/
Font materials
```

前端 public 资源应使用如下路径：

```text
/images/...
/models/...
/fonts/...
```

CSS 中应使用：

```css
url("/images/xxx.jpg")
```

不要写成：

```css
url("E:\\...")
```

文档中可以说明用户本地素材准备位置，但不要把本机路径写进运行时代码。如果文档中确需说明本地素材来源，应明确“仅为本地准备路径，不应进入代码”。

## 运行链路

1. `index.html` 提供根节点 `#root`。
2. `src/main.tsx` 挂载 React 应用。
3. `src/App.tsx` 控制核心页面状态，例如 `intro`、`map`、`detail`、`painting`。
4. 首页进入地图页。
5. 地图页点击建筑点位后，根据建筑 `detailType` 进入不同详情：
   - `3d`：东北角楼 3D 深度详情页。
   - `image`：图片图文详情页。
   - `placeholder`：建设中提示页。
6. 东北角楼详情页先显示静态预览，点击后挂载 `Building3DCanvas` 并加载 `/models/corner-tower.glb`。
7. 图片建筑详情页使用图片详情逻辑，不加载 3D。
8. 文化拾遗区域使用 `/images/culture-memory/` 下的真实图片做 hover 展示。
9. 时间轴区域使用 `/images/culture-memory/forbidden-city-timeline.png`。
10. 文化拾遗手势展陈 overlay 仅在用户点击“开启手势识别”后请求摄像头权限，并由 `CultureGestureController` 在浏览器本地进行手势识别。
11. AI 面板向 `/api/hunyuan` 发送当前建筑、热点和上下文，由 `server.cjs` 代理调用腾讯混元。
12. 图表区由 `PalaceDataCharts` 渲染，并包含可视化说明。
13. 彩画专题通过页面状态进入独立专题视图。

## 本地开发方式

常用命令：

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

用于启动 Vite 前端开发服务。默认访问地址通常为 `http://localhost:5173`。当前 `vite.config.ts` 中默认开发端口为 `5173`，也可通过 `VITE_DEV_PORT` 覆盖。Vite 会把 `/api` 请求代理到 `http://127.0.0.1:3001`，也可通过 `VITE_API_PROXY_TARGET` 覆盖。

如果只运行 `npm run dev`，AI 请求会失败，并出现类似：

```text
[vite] http proxy error: /api/hunyuan
Error: connect ECONNREFUSED 127.0.0.1:3001
```

这不是 AI 逻辑坏了，而是本地后端代理没有启动。线上 Node 平台部署时，`server.cjs` 可以托管构建产物并处理 `/api/hunyuan`，所以线上通常不需要像本地开发一样手动开两个终端。

文化拾遗手势识别不依赖后端代理，但依赖浏览器摄像头权限。本地 `localhost` 一般允许摄像头，线上需要 HTTPS。用户未点击“开启手势识别”前不会请求摄像头。

## AI 讲解与环境变量

`src/components/AiGuidePanel.tsx` 负责输入问题、展示示例问题、提交 `/api/hunyuan` 请求、展示 AI 返回结果或错误提示。

`server.cjs` 是 Express 后端代理，负责读取服务端环境变量，调用腾讯混元兼容接口，并返回前端可展示的讲解文本。AI 密钥只应存在服务端 `.env` 或部署平台环境变量中，不应写入 `src`、`public` 或前端代码。本地 `.env` 不应提交到仓库。

当前 `server.cjs` 读取的环境变量包括：

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
| `README.md` | 当前项目说明文档，本轮未修改。 |
| `server.cjs` | Express 后端代理，提供 `POST /api/hunyuan`，读取服务端环境变量调用腾讯混元，存在 `dist` 时托管构建产物；本地默认与 Vite 代理配合使用。 |
| `tailwind.config.js` | Tailwind 配置，包含色板、字体、动画等扩展。 |
| `tsconfig.json` | TypeScript 根配置。 |
| `tsconfig.app.json` | 前端应用 TypeScript 配置。 |
| `tsconfig.node.json` | Node/Vite 配置文件 TypeScript 配置。 |
| `vite.config.ts` | Vite 配置，设置 React 插件、别名、开发端口和 `/api` 代理；`/api` 会代理到本地后端，如果后端没启动会出现 `ECONNREFUSED 127.0.0.1:3001`。 |

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
| `src/App.tsx` | 核心业务入口。负责页面状态控制、首页、地图页、详情页、彩画专题入口、建筑点位数据、建筑详情数据、`detailType` 分支、东北角楼 3D 深度样本逻辑、图片建筑图文导览逻辑、文化拾遗卡片数据、故宫时间轴图片区域、资料来源信息条和推荐演示路线。 |
| `src/App.css` | 主要样式文件。负责首页视觉、古典字体与首页排版、地图页点位、分类标签、hover 卡片、资料来源模块、推荐演示路线、详情页布局、3D 静态预览区、图片详情页样式、文化拾遗 hover 图片效果、故宫时间轴图片展示样式和响应式布局。 |
| `src/index.css` | 全局 CSS，导入 Tailwind 层和旧模板基础工具样式。 |
| `src/config.ts` | 原 Villa Template 集中配置。当前主 `App.tsx` 不依赖它，主要供旧 `src/sections/*` 使用。 |

## `src/components` 目录

| 文件 | 作用 |
| --- | --- |
| `src/components/AiGuidePanel.tsx` | AI 问答面板。负责请求 `/api/hunyuan`，上下文来自当前建筑、热点和页面资料；本地开发必须依赖 `npm run server` 提供代理。 |
| `src/components/Building3DCanvas.tsx` | 只用于东北角楼。加载 `/models/corner-tower.glb`，提供 R3F Canvas、OrbitControls、灯光和热点；普通图片建筑不会挂载它；模型加载失败时应有兜底提示。 |
| `src/components/BuildingImageHotspot.tsx` | 用于图片建筑或图文热点展示。主图懒加载，图片加载失败有兜底提示，不加载 3D 模型。 |
| `src/components/CultureGestureController.tsx` | 只服务于“文化拾遗 · 手势展陈”overlay。负责打开摄像头、初始化 MediaPipe Hand Landmarker、检测手部关键点、判断左挥/右挥/张开手掌/握拳，并通过回调通知父组件；不控制地图、AI 或东北角楼 3D。 |
| `src/components/HotspotDetailCards.tsx` | 展示构件说明、技术参数、文化意义等折叠内容。主要服务于东北角楼热点详情，也可支持图文详情模块。 |
| `src/components/PalaceDataCharts.tsx` | 渲染“紫禁数读：古建筑营造密码”图表区和彩画专题页。当前包含可视化说明；图表部分用于知识结构和建筑等级关系可视化表达；部分图表不作为精确统计数据使用，不要在文档中声称所有图表都是精确统计数据。 |
| `src/components/ErrorBoundary.tsx` | 基础错误边界，避免局部组件异常导致整页白屏。 |
| `src/components/Preloader.tsx` | 原模板预加载组件，当前主 `App.tsx` 未使用。 |
| `src/components/ScrollToTop.tsx` | 原模板返回顶部按钮，当前主 `App.tsx` 未使用。 |

## `src/components/ui` 目录

这是 shadcn/ui 风格的通用 UI 组件库，通常封装 Radix UI、Lucide 图标、Tailwind class 和本地工具函数 `cn`。当前主流程主要使用少量组件和工具，目录中的大量组件属于通用资产。

## `src/sections` 目录

这些文件来自原 Villa Template，当前主 `App.tsx` 没有导入它们。它们仍可作为历史模板参考或后续复用素材，但不参与当前主应用。

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
| `public/images/corner-tower.jpg` | 东北角楼静态预览或图像素材。 |
| `public/images/corner-tower-interior.jpg` | 东北角楼内部图片素材。 |
| `public/images/culture-memory/` | 文化拾遗与时间轴素材目录。 |
| `public/images/culture-memory/corner-tower-roof.jpg` | 角楼复杂结构卡片图片。 |
| `public/images/culture-memory/palace-door-nails.jpg` | 宫门门钉卡片图片。 |
| `public/images/culture-memory/red-wall-yellow-tiles.jpg` | 红墙黄瓦卡片图片。 |
| `public/images/culture-memory/roof-beasts.jpg` | 屋脊瑞兽卡片图片。 |
| `public/images/culture-memory/palace-daily-light.jpg` | 宫城日常卡片图片。 |
| `public/images/culture-memory/palace-cat.jpg` | 故宫猫卡片图片。 |
| `public/images/culture-memory/forbidden-city-timeline.png` | 故宫时间轴图片。 |
| `public/images/buildings/*` | 午门、太和殿、乾清宫、文华殿、武英殿等图文建筑主图和局部图。 |
| `public/images/wumen-*.jpg`、`public/images/taihedian-*.jpg`、`public/images/qianqinggong-*.jpg` 等 | 其他建筑图文导览素材。 |
| `public/images/xumizuo-line.png`、`public/images/xumizuo-exterior.png` | 东北角楼须弥座线稿 / 实景对照素材。 |
| `public/images/wuding-line.png`、`public/images/wuding-exterior.png` | 东北角楼屋顶体系线稿 / 实景对照素材。 |
| `public/images/waiqiang-exterior.png` | 东北角楼外墙实景素材。 |

注意：当前不是所有建筑都有模型。不要写“所有建筑都有模型”或“所有建筑均支持 3D”。

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
→ 点击启动三维模型  
→ 点击屋顶 / 斗栱等构件热点  
→ 查看线稿与实景对照  
→ 查看文化拾遗  
→ 查看故宫时间轴  
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

该命令执行：

```bash
tsc -b && vite build
```

Vite 会生成 `dist/` 构建产物。`dist/` 通常不需要手动提交到仓库，除非项目部署策略明确要求提交构建产物。

一体化运行：

```bash
npm run start
```

部署到支持 Node 的平台时，应设置服务端环境变量，并由 `server.cjs` 同时处理静态文件和 `/api/hunyuan`。

### Render 部署

Render 部署的一般链路：

1. 将最新代码推送到 GitHub。
2. Render 自动拉取最新 commit。
3. Render 执行 Build Command。
4. Render 执行 Start Command。
5. `server.cjs` 托管 `dist/` 并提供 `/api/hunyuan`。

Build Command 通常为：

```bash
npm install && npm run build
```

如果 Render 当前配置使用 `npm ci && npm run build`，也可以继续使用，以平台实际配置为准。

Start Command 通常为：

```bash
npm run server
```

或：

```bash
npm run start
```

两者当前都会运行 `node server.cjs`。

Render 上必须配置 AI 所需环境变量，尤其是 `HUNYUAN_API_KEY`、`HUNYUAN_BASE_URL`、`HUNYUAN_MODEL`。Render 使用 HTTPS，因此浏览器摄像头权限和 MediaPipe 手势识别在线上原则上可用。

部署完成后访问地址以 Render Dashboard 为准。若当前服务仍使用以下地址，可用于验收：

```text
https://forbidden-city-4c.onrender.com/
```

### 构建警告说明

当前 `npm run build` 可能仍出现以下历史警告：

1. `.env` 中 `NODE_ENV=production` 不被 Vite 推荐。
2. Tailwind `duration-[1.5s]` 歧义警告。
3. chunk 体积超过 500kB。

这些警告目前不阻断 `npm run build`。chunk 较大主要与 Three.js、ECharts、MediaPipe 等依赖有关。后续可通过路由懒加载、组件拆包、资源压缩继续优化；国赛前不要为了消除警告而进行大规模重构。

### Lint 状态说明

`npm run lint` 可能仍有历史问题，常见来源包括旧模板、shadcn 通用组件或 fast-refresh 规则。只要 `npm run build` 通过，主流程展示不一定受影响。后续可单独安排 lint 清理；国赛前不要为修 lint 大规模重构无关历史文件。

如果某轮维护已经确认 lint 全量通过，应同步更新本节。

### 部署后验收清单

部署到 Render 后，应检查：

1. 首页是否正常显示。
2. 地图页是否正常，神武门是否未恢复。
3. 东北角楼是否进入 3D 深度样本页。
4. 东北角楼是否先显示静态预览，点击后加载 3D。
5. 普通图文建筑是否不会请求 3D 模型。
6. 文化拾遗 hover 图片是否正常。
7. 文化拾遗手势展陈 overlay 是否正常打开。
8. 文化拾遗按钮和键盘交互是否正常。
9. 浏览器是否能请求摄像头权限。
10. 左挥是否下一项，右挥是否上一项。
11. 张开手掌是否展开 / 收起讲解。
12. 握拳是否收起讲解且不误退出。
13. 时间轴图片是否正常加载。
14. 图表区是否正常显示。
15. AI 讲解是否正常返回。
16. 移动端是否无明显横向溢出。

### GitHub 提交注意事项

提交前建议运行：

```bash
npm run build
git status
git diff --stat
```

确认不要提交：

- `.env`
- `node_modules/`
- 不需要提交的 `dist/`
- 本机绝对路径
- 未授权字体文件
- 临时调试文件
- 摄像头测试截图或隐私图片

如果新增依赖，例如 `@mediapipe/tasks-vision`，需要提交：

- `package.json`
- `package-lock.json`

## 当前需要特别注意的点

1. 只有东北角楼是 3D 建筑，不要给其他建筑伪造 3D。
2. 普通图片建筑不要请求 `corner-tower.glb`。
3. 不要恢复神武门点位，除非后续确实补齐内容并确认要展示。
4. 本地 AI 需要同时启动 `npm run server` 和 `npm run dev`。
5. `.env` 不要提交。
6. 图表数据当前包含知识结构可视化表达，不要误写为精确统计数据。
7. 文化拾遗图片和时间轴图片应使用 `/images/culture-memory/...` 相对路径。
8. 不要在运行时代码中写入 `E:\...`、`C:\...` 等本机绝对路径。
9. 若使用第三方字体文件，需确认授权，尤其文件名中含“商用需授权”的字体。
10. 手势识别只在用户点击“开启手势识别”后请求摄像头；视频流只在浏览器本地用于识别，不上传后端。
11. 文化拾遗手势只控制展陈 overlay，不控制地图、AI 或东北角楼 3D。
12. `src/sections/*`、`info.md` 等旧模板残留不参与当前主应用。
13. lint 可能仍有历史问题，集中在旧模板或 shadcn 通用组件，不代表主流程无法构建。
14. chunk 体积警告与 Three.js、ECharts、MediaPipe 等依赖有关，后续可通过懒加载/拆包优化。

## 本次文档更新说明

本次只更新 `docs/project-file-guide.md`，不修改业务代码、AI、server、图表数据、地图点位、建筑详情、样式文件、资源文件或 README。Markdown 文档修改不影响构建，本轮不需要运行 build。
