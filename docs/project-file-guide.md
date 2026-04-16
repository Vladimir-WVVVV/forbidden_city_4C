# 项目文件导览

本文档供后续 AI 或开发者快速理解当前项目。它描述项目在做什么、运行链路、关键目录与主要文件职责。

## 项目概览

这是一个以“故宫建筑细节交互”为主题的单页 Web 应用。当前主线不是原模板里的酒庄页面，而是一个故宫/紫禁城导览体验：

- 入口页展示故宫风格背景与进入按钮。
- 地图页使用本地故宫导览图，在指定建筑点位上放置可点击标记。
- 详情页以故宫角楼为核心，左侧展示建筑概览、热点构件说明、实景图/线稿图、技术参数和文化意义，右侧用 Three.js/R3F 展示 `corner-tower.glb` 三维模型与可点击热点。
- 数据可视化区用 ECharts 展示古建筑营造、木材、屋顶、彩画等示意图表，并可进入“故宫彩画专题”页面。
- AI 讲解面板会把当前建筑、热点和页面上下文发给本地 Express 代理，再调用腾讯云混元接口生成中文讲解。

## 技术栈

- 前端：React 19、TypeScript、Vite
- 样式：Tailwind CSS、全局 CSS、shadcn/ui 组件体系
- 动画：GSAP、CSS animation
- 3D：Three.js、@react-three/fiber、@react-three/drei
- 图表：ECharts、echarts-for-react
- 后端代理：Express、腾讯云 Hunyuan SDK、dotenv、cors

## 常用命令

```bash
npm run dev
npm run server
npm run build
npm run preview
npm run lint
```

开发时通常需要两个进程：

- `npm run server`：启动本地 `/api/hunyuan` 代理，默认端口 `3001`。
- `npm run dev`：启动 Vite 前端。Vite 会把 `/api` 代理到 `http://127.0.0.1:3001`。

混元接口需要复制 `.env.example` 为 `.env`，并填写 `TENCENT_SECRET_ID`、`TENCENT_SECRET_KEY` 等服务端环境变量。

## 运行链路

1. `index.html` 提供根节点 `#root`。
2. `src/main.tsx` 挂载 React 应用。
3. `src/App.tsx` 控制页面状态：`intro`、`map`、`detail`、`painting`。
4. 地图页选择建筑后进入详情页。
5. 详情页把热点数据传入 `Building3DCanvas`，用户点击三维热点后在左侧展示对应构件说明。
6. `AiGuidePanel` 向 `/api/hunyuan` 发送问题、建筑名、热点名和上下文。
7. `server.cjs` 调用腾讯云混元，再把结果返回前端。

## 顶层文件

| 文件 | 作用 |
| --- | --- |
| `.env.example` | 环境变量示例。用于提示混元代理所需的腾讯云密钥、模型、地区、端口等配置。 |
| `.gitignore` | Git 忽略规则。当前目录本身不是 git 仓库，但文件保留了项目忽略配置。 |
| `components.json` | shadcn/ui 配置，定义组件风格、别名、Tailwind CSS 文件、图标库等。 |
| `eslint.config.js` | ESLint 配置。用于检查 TypeScript/React 代码质量。 |
| `index.html` | Vite HTML 入口，包含根节点和页面基础元信息。 |
| `info.md` | 原 Villa Template 的说明文档，描述模板语言、内容、配置字段、设计规则等。当前项目已明显改造成故宫主题，本文档更多是历史模板参考。 |
| `package.json` | 项目依赖、脚本和包元数据。关键脚本包括 `dev`、`server`、`build`、`lint`、`preview`。 |
| `package-lock.json` | npm 锁文件，记录依赖的确定版本。 |
| `postcss.config.js` | PostCSS 配置，用于 Tailwind CSS 和 autoprefixer。 |
| `README.md` | 项目说明。顶部说明混元 AI 讲解代理接入，后面仍保留 Villa Template 的大量原始说明。当前终端读取中文时可能显示乱码。 |
| `server.cjs` | Express 后端代理。提供 `POST /api/hunyuan`，读取 `.env` 密钥，调用腾讯云混元，并在存在 `dist` 时托管构建产物。 |
| `tailwind.config.js` | Tailwind 配置。包含 shadcn 变量色、旧酒庄模板色板、故宫 imperial 色板、字体、动画等扩展。 |
| `tsconfig.json` | TypeScript 根配置，引用 app/node 两套 tsconfig。 |
| `tsconfig.app.json` | 前端应用 TypeScript 编译配置。 |
| `tsconfig.node.json` | Node/Vite 配置文件的 TypeScript 编译配置。 |
| `vite.config.ts` | Vite 配置。启用 React 插件、Kimi inspect 插件、`@` 别名，并代理 `/api` 到 `127.0.0.1:3001`。 |

## `src` 目录

| 文件 | 作用 |
| --- | --- |
| `src/main.tsx` | React 入口。引入 `index.css`，把 `App` 渲染到 `#root`。 |
| `src/App.tsx` | 当前核心应用文件。定义页面状态、故宫地图点位、建筑数据、角楼热点数据、入口页、地图页、详情页、文化拾遗区等。也是当前项目业务数据最集中的地方。 |
| `src/App.css` | 当前故宫交互应用的主要样式文件。覆盖入口页、地图页、详情页、三维视图、热点标记、导航、响应式布局等。 |
| `src/index.css` | 全局 CSS。导入字体，启用 Tailwind 层，保留 Villa Template 的基础变量、按钮、动画、字体工具类等。 |
| `src/config.ts` | 原 Villa Template 的集中配置类型与空配置值。当前主应用 `App.tsx` 不依赖它，但 `src/sections` 和部分旧组件仍会读取它。 |

## `src/components` 目录

| 文件 | 作用 |
| --- | --- |
| `src/components/AiGuidePanel.tsx` | AI 讲解面板。维护输入、加载、回答和错误状态；向 `/api/hunyuan` 发送问题、建筑、热点、上下文；展示示例问题和生成结果。 |
| `src/components/Building3DCanvas.tsx` | 三维角楼展示组件。加载 `/models/corner-tower.glb`，归一化模型尺寸，使用 R3F Canvas、OrbitControls、灯光和热点球体/HTML 标签，支持点击热点回传给详情页。 |
| `src/components/PalaceDataCharts.tsx` | 故宫数据可视化组件。定义配色、mock 数据、多个 ECharts option 工厂、懒加载图表、地图页图表区，以及“故宫彩画专题”独立页面。 |
| `src/components/Preloader.tsx` | 原模板预加载组件。读取 `preloaderConfig`，如果没有品牌名则不渲染。当前主 `App.tsx` 未使用。 |
| `src/components/ScrollToTop.tsx` | 原模板返回顶部按钮。读取 `scrollToTopConfig`，配置为空则不渲染。当前主 `App.tsx` 未使用。 |

## `src/components/ui` 目录

这个目录是 shadcn/ui 风格的通用 UI 组件库，当前项目保留了大量可复用基础组件。它们通常封装 Radix UI、Lucide 图标、Tailwind class 和本地工具函数 `cn`。

| 文件 | 作用 |
| --- | --- |
| `accordion.tsx` | 手风琴折叠面板组件。 |
| `alert-dialog.tsx` | 需要用户确认的弹窗对话框。 |
| `alert.tsx` | 提示/警告信息块。 |
| `aspect-ratio.tsx` | 固定宽高比容器。 |
| `avatar.tsx` | 用户头像组件。 |
| `badge.tsx` | 状态标签/徽章。 |
| `breadcrumb.tsx` | 面包屑导航。 |
| `button-group.tsx` | 按钮组容器。 |
| `button.tsx` | 通用按钮组件与样式变体。 |
| `calendar.tsx` | 日期选择日历。 |
| `card.tsx` | 卡片容器组件。 |
| `carousel.tsx` | 轮播组件。 |
| `chart.tsx` | 图表容器/主题辅助组件，常用于 Recharts 风格图表。 |
| `checkbox.tsx` | 复选框。 |
| `collapsible.tsx` | 折叠内容容器。 |
| `command.tsx` | 命令面板/搜索选择组件。 |
| `context-menu.tsx` | 右键上下文菜单。 |
| `dialog.tsx` | 通用弹窗对话框。 |
| `drawer.tsx` | 抽屉面板。 |
| `dropdown-menu.tsx` | 下拉菜单。 |
| `empty.tsx` | 空状态展示。 |
| `field.tsx` | 表单字段布局辅助组件。 |
| `form.tsx` | React Hook Form 集成组件。 |
| `hover-card.tsx` | 悬停展示卡片。 |
| `input-group.tsx` | 输入框组合布局。 |
| `input-otp.tsx` | OTP/验证码输入。 |
| `input.tsx` | 基础输入框。 |
| `item.tsx` | 列表项/菜单项风格组件。 |
| `kbd.tsx` | 键盘按键样式。 |
| `label.tsx` | 表单标签。 |
| `menubar.tsx` | 菜单栏。 |
| `navigation-menu.tsx` | 顶部导航菜单。 |
| `pagination.tsx` | 分页组件。 |
| `popover.tsx` | 浮层组件。 |
| `progress.tsx` | 进度条。 |
| `radio-group.tsx` | 单选组。 |
| `resizable.tsx` | 可拖拽调整尺寸的面板。 |
| `scroll-area.tsx` | 自定义滚动区域。 |
| `select.tsx` | 下拉选择器。 |
| `separator.tsx` | 分隔线。 |
| `sheet.tsx` | 侧边弹层。 |
| `sidebar.tsx` | 侧边栏组件。 |
| `skeleton.tsx` | 骨架屏占位。 |
| `slider.tsx` | 滑块。 |
| `sonner.tsx` | Toast 通知容器。 |
| `spinner.tsx` | 加载中旋转图标。 |
| `switch.tsx` | 开关。 |
| `table.tsx` | 表格组件。 |
| `tabs.tsx` | 标签页。 |
| `textarea.tsx` | 多行文本输入。 |
| `toggle-group.tsx` | 多按钮切换组。 |
| `toggle.tsx` | 单个切换按钮。 |
| `tooltip.tsx` | 提示气泡。 |

## `src/sections` 目录

这些文件来自原 Villa Template，当前主 `App.tsx` 没有导入它们。它们仍然可作为模板素材或后续复用的页面段落。

| 文件 | 作用 |
| --- | --- |
| `src/sections/Navigation.tsx` | 原模板导航栏。读取 `navigationConfig`，支持桌面导航、下拉、移动菜单。 |
| `src/sections/Hero.tsx` | 原模板首屏 Hero。读取 `heroConfig`，支持背景图、标题、CTA、统计数字。 |
| `src/sections/WineShowcase.tsx` | 原模板酒品展示区。读取 `wineShowcaseConfig`，支持酒款 tab、瓶身效果、特性卡片和引用文案。 |
| `src/sections/WineryCarousel.tsx` | 原模板酒庄/空间轮播区。读取 `wineryCarouselConfig`，支持自动轮播、背景图和地点标签。 |
| `src/sections/Museum.tsx` | 原模板博物馆/历史区。读取 `museumConfig`，支持时间线、tab、创始人图、开放时间等。 |
| `src/sections/News.tsx` | 原模板新闻、评价与故事区。读取 `newsConfig`。 |
| `src/sections/ContactForm.tsx` | 原模板联系表单。读取 `contactFormConfig`，提交到配置里的 Formspree endpoint。 |
| `src/sections/Footer.tsx` | 原模板页脚。读取 `footerConfig`，支持社交链接、链接组、订阅表单、备案文本等。 |

## `src/hooks` 与 `src/lib`

| 文件 | 作用 |
| --- | --- |
| `src/hooks/use-mobile.ts` | 响应式 hook，用于判断当前视口是否为移动端。主要供 shadcn/sidebar 等通用组件使用。 |
| `src/lib/utils.ts` | 通用工具函数。通常包含 `cn`，用于合并 Tailwind className。当前 `App.tsx`、`AiGuidePanel.tsx` 等会用到。 |

## `public` 目录

| 路径 | 作用 |
| --- | --- |
| `public/models/corner-tower.glb` | 角楼三维模型，供 `Building3DCanvas` 加载。 |
| `public/images/custom-palace-map.png` | 故宫导览底图，地图页的核心背景图。 |
| `public/images/forbidden-city-map.jpg` | 备用/历史故宫地图素材。 |
| `public/images/forbidden-city-guide-panorama.png` | 故宫导览/全景素材。 |
| `public/images/nine-dragon-wall.jpg` | 入口页背景图。 |
| `public/images/corner-tower.jpg` | 角楼图片素材。 |
| `public/images/corner-tower-interior.jpg` | 角楼内部图片素材。 |
| `public/images/wumen-gate.jpg` | 午门图片素材。 |
| `public/images/taihe-dian.jpg` | 太和殿图片素材。 |
| `public/images/qianqing-gong.jpg` | 乾清宫图片素材。 |
| `public/images/shenwu-gate.jpg` | 神武门图片素材。 |
| `public/images/xumizuo-line.png` | 须弥座/台基相关线稿图。 |
| `public/images/xumizuo-exterior.png` | 须弥座/台基相关实景图。 |
| `public/images/wuding-line.png` | 屋顶体系相关线稿图。 |
| `public/images/wuding-exterior.png` | 屋顶体系相关实景图。 |
| `public/images/waiqiang-exterior.png` | 外墙相关实景图。 |

## 构建产物与依赖目录

| 路径 | 作用 |
| --- | --- |
| `node_modules/` | npm 安装的第三方依赖。不要手动编辑，也不应逐文件阅读。 |
| `dist/` | `npm run build` 生成的静态构建产物。`server.cjs` 在该目录存在时会托管它。不要把源码改动直接写到这里。 |

## 当前需要特别注意的点

- `src/App.tsx` 是当前项目业务核心，且包含大量静态数据。要改地图点位、建筑列表、角楼热点、详情文案，大概率从这里入手。
- `src/config.ts` 和 `src/sections/*` 属于旧模板残留，不影响当前主应用，除非重新把这些 section 接回 `App.tsx`。
- 文本内容在当前 PowerShell 输出中出现乱码，说明文件编码或终端解码存在不匹配。浏览器中是否正常显示需以实际页面为准；后续编辑中文时建议统一使用 UTF-8。
- 图表数据在 `PalaceDataCharts.tsx` 中明确是 mock/示意数据，后续如果用于正式展示，应替换为有来源的考据数据。
- 混元密钥只应存在服务端 `.env`，前端只请求 `/api/hunyuan`，不要把密钥写入 `src` 或 `public`。
- Vite 配置了 `base: './'`，构建产物适合相对路径部署。
