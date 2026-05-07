# VitePress 博客

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>
</p>

基于 [VitePress](https://vitepress.dev/) 构建的静态博客站点。

## 特性

- ⚡️ **高性能**: 由 Vite 和 Vue.js 驱动。
- 📝 **内容管理**: 基于 Markdown 编写内容。
- 🗂 **内容组织**: 支持归档、分类和标签功能。
- 🔍 **搜索**: 内置本地搜索功能。

## 环境要求

- [Node.js](https://nodejs.org/) (建议版本 20+)
- [pnpm](https://pnpm.io/) (推荐使用的包管理器)

## 安装步骤

1. 克隆仓库：

   ```bash
   git clone <repository-url>
   cd vitepress-blog
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

## 使用指南

### 开发环境

启动本地开发服务器：

```bash
pnpm docs:dev
```

启动后，访问 `http://localhost:5173` (或终端显示的端口) 即可预览。

### 构建部署

构建生产版本：

```bash
pnpm docs:build
```

构建产物将生成在 `docs/.vitepress/dist` 目录下。

### 本地预览

预览构建后的站点：

```bash
pnpm docs:preview
```

### 代码格式化

使用 Prettier 格式化代码：

```bash
pnpm format
```

## 项目结构

- `docs/`: 存放 Markdown 文档和静态资源。
  - `.vitepress/`: VitePress 配置和主题自定义文件。
  - `posts/`: 博客文章目录。
- `package.json`: 项目依赖和脚本配置。

## 内容与合规说明

- 根目录 `LICENSE` 仅适用于本仓库代码，站点文章、图片、视频及其它媒体内容不当然按 MIT License 开放。
- 转载、引用或再分发站点内容前，请先确认对应内容的版权与来源说明。
- 本仓库与站点内容仅用于合法、合规、授权范围内的学习与交流，不应用于绕过第三方平台服务条款、访问控制、计费规则或账号限制。
- 如你认为仓库或站点内容存在侵权、来源标注不当或其它不适宜公开展示的问题，请联系作者处理。

## 开源协议

MIT License.
