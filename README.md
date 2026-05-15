# zero2x 首页（Vue）

zero2x 品牌站首页重设计：多区块长页、中英切换、三体计算星座模块与首屏动效等。

**仓库：** [github.com/linyun-wy/zero2x-home-redesign](https://github.com/linyun-wy/zero2x-home-redesign)

---

## 本地运行

**环境：** Node.js（推荐 **20+**），或使用 [Bun](https://bun.sh)。

```bash
npm install
npm run dev
```

默认开发服务器：<http://localhost:3000>（见 `package.json` 中 `vite` 配置）。

构建生产包：

```bash
npm run build
npm run preview
```

> 若项目内仍有 Gemini 相关依赖，可按需在 `.env.local` 中配置 `GEMINI_API_KEY`；当前首页以静态展示与动效为主，不以 API 为必需。

---

## 文档

- **结构化变更记录：** [CHANGELOG.md](./CHANGELOG.md)
- **GitHub Release 说明底稿（与 2026-05-14 节一致）：** [.github/release-notes/2026-05-14.md](./.github/release-notes/2026-05-14.md)

在本地已安装 [GitHub CLI](https://cli.github.com/) 且已 `gh auth login` 时，可从该文件创建 Release（标签与标题可按需微调）：

```bash
gh release create 2026.05.14 \
  --repo linyun-wy/zero2x-home-redesign \
  --title "2026.05.14" \
  --notes-file .github/release-notes/2026-05-14.md
```

若尚未安装 `gh`，也可在 GitHub 网页 **Releases → Draft a new release** 中，将上述文件内容粘贴到说明框。

---

## 最近更新（2026-05-14）

### 站点与资源

- 浏览器标签标题由占位文案改为 **`zero2x`**（`index.html`、`reference/index.html`）。
- 更新 **`public/o2x-lab-logo.png`**。
- 新增 **`public/orbit-models/`** 轨道案例相关配图资源。

### 导航与文案

- 原「南湖」区块更名为 **「三体计算星座」**（英文 **Three-body Constellation**）：路由/锚点、`Header`、`Footer`、`src/lang/index.ts` 等与首页 `index.vue` 引用同步。
- 视图文件 **`home-nanhu.vue`** 移除，由 **`home-constellation.vue`**（`HomeConstellation`）替代。

### 首页与模块视觉

- **`home-zero2x`**：首屏动效与灯带/氛围层等调整；接入 **`MatrixSpectralLayer`** 等组件。
- **`home-models`**、**`home-021`**、**`home-haina`**、**`home-cases`**、**`home-events`**：配套样式或内容更新。
- **三体计算星座区**：**`OrbilonBackdrop`** 星场背景；**`WireframeSphere`** 线框球；**标题与卫星可视化列间距**收紧，线框球更靠近主标题。
- **`LabGenosView`**：小幅调整。

### 性能与行为

- **`OrbilonBackdrop`**：入场静止阶段改用 **低频率 `setTimeout`**，动画阶段保留 RAF；**`paused`** 与销毁时统一清理 RAF/定时器；**画布绘制 DPR 上限**、粒子密度调整；**`document.visibilitychange`** 在后台停止调度。
- **`CharacterGrid`**：视口与 **`visibilitychange`** 下停止循环；矩阵刷新改为 **`setTimeout` 节流**（约 48ms 调度）。
- **`AsciiGrainBackdrop`**：同上 **`visibilitychange`** + **`setTimeout`** 节流；与 **`suspendAnimations`** 一致清理。
- **`CustomCursor`**：按首页容器优化启停/绘制节奏。

### 组件生命周期

- 删除未使用的 **`CharacterGridBackground.vue`**。
- **`WireframeSphere`**：支持静态帧、离屏暂停等（与星座区块用法一致）。

### 工程

- 新增 **`src/components/MatrixSpectralLayer.vue`**、`src/mixins/` 等相关代码。
