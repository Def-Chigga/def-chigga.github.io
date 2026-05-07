# VitePress Blog

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>
</p>

A static blog site built with [VitePress](https://vitepress.dev/)

## Features

- ⚡️ **Fast**: Powered by Vite and Vue.js.
- 📝 **Content**: Markdown-based content management.
- 🗂 **Organization**: Support for Archives, Categories, and Tags.
- 🔍 **Search**: Built-in local search functionality.

## Prerequisites

- [Node.js](https://nodejs.org/) (Version 20+ recommended)
- [pnpm](https://pnpm.io/) (Recommended package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vitepress-blog
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

### Development

Start the local development server:

```bash
pnpm docs:dev
```

The site will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build

Build the site for production:

```bash
pnpm docs:build
```

The output files will be generated in the `docs/.vitepress/dist` directory.

### Preview

Preview the built site locally:

```bash
pnpm docs:preview
```

### Formatting

Format code using Prettier:

```bash
pnpm format
```

## Project Structure

- `docs/`: Markdown content and static assets.
  - `.vitepress/`: VitePress configuration and theme customization.
  - `posts/`: Blog posts directory.
- `package.json`: Project dependencies and scripts.

## Content and compliance

- The root `LICENSE` applies to repository code only; blog posts, images, videos, and other media are not automatically licensed under MIT.
- Before reusing or redistributing site content, check the copyright and source notice for the specific material.
- This repository and site are intended for lawful, authorized learning and discussion, and should not be used to bypass third-party terms of service, access controls, billing rules, or account restrictions.
- If you believe any published material is infringing, improperly attributed, or otherwise unsuitable for public display, please contact the author for review.

## License

MIT License.
