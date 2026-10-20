# Repository Guidelines

## 项目结构

基于 VitePress 与 `vitepress-theme-async` 的静态博客。`docs/` 是站点根目录（`srcDir: './'`），文章位于 `docs/posts/<分类>/<slug>.md`，构建时通过 `rewrites` 去掉 `posts/` 前缀。`docs/.vitepress/config.ts` 集中管理站点信息、主题、分类卡片与 Vite 压缩；`docs/.vitepress/theme/index.ts` 只负责注册主题与自定义 CSS。`docs/public/` 存放按根路径访问的静态资源，`docs/images/` 存放文章图片。`[index]`、`[archives]`、`[categories]`、`[tags]` 及其 `.paths.ts` 由 `vitepress-theme-async/plugin/page` 动态生成。

## 构建与开发命令

使用 pnpm（README 要求 Node 20+，CI 使用 Node 24）：

- `pnpm install`
- `pnpm docs:dev`：启动本地开发服务器
- `pnpm docs:build`：构建到 `docs/.vitepress/dist`
- `pnpm docs:preview`：预览构建结果
- `pnpm format`：Prettier 格式化

没有测试或 lint 脚本。内容或配置改动后至少执行一次 `pnpm docs:build`，确认 frontmatter、动态路由与链接无误。

## 编码与内容约定

Prettier 配置为单引号、无分号、2 空格缩进、`printWidth: 100`。每篇文章必须有 `title` frontmatter，按需添加 `sticky`、`categories`、`tags`；分类名必须与 `config.ts` 中 `categorieCard.list` 一致，新增分类时同步更新该数组。正文使用中文与编号章节标题。作者信息从 `package.json` 读取，不要在配置里硬编码。修改 `config.ts` 后重启开发服务器；不要手工编辑 `docs/.vitepress/dist` 或 `docs/.vitepress/cache`。

## 提交与部署

历史采用 Conventional Commits：`feat:`、`fix:`、`docs:`、`chore:`、`refactor:`，可带 `(content)`、`(ci)`、`(workflow)` 等 scope，描述使用中文。推送到 `master` 会触发 `.github/workflows/deploy.yml`，用 pnpm 构建并部署 GitHub Pages，推送即上线。仓库代码适用 MIT；文章、图片和视频不自动适用 MIT，引用第三方素材必须在正文或 `docs/images/gallery/SOURCES.md` 标注来源。
