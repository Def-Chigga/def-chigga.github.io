---
title: CSS 代码风格指南
date: 2025-10-01
categories: [前端]
tags: [前端, CSS, 代码规范]
---

# CSS 代码风格指南

## 目录

- [1. 前言](#_1-前言)
- [2. 基本格式规范](#_2-基本格式规范)
- [3. 文档结构规范](#_3-文档结构规范)
- [4. 选择器规范](#_4-选择器规范)
- [5. 属性规范](#_5-属性规范)
- [6. 注释规范](#_6-注释规范)
- [7. 现代CSS特性](#_7-现代css特性)
- [8. 响应式设计](#_8-响应式设计)
- [9. 性能与可访问性](#_9-性能与可访问性)

## 1. 前言

### 1.1 文档目的

本规范基于业界最佳实践（Google、MDN、W3C等）和现代CSS技术趋势制定，旨在提高CSS代码质量，为大型企业级前端项目提供统一的CSS编码标准。确保代码的一致性、可维护性、可访问性和团队协作效率。

### 1.2 适用范围

适用于所有新开发的Web项目及现有项目的重构工作。所有前端开发人员必须遵守本规范。

### 1.3 原则说明

- **可维护性**：编写易于理解和维护的代码
- **可扩展性**：确保样式易于扩展和修改
- **性能优化**：考虑渲染性能和加载性能
- **可访问性**：确保所有用户都能访问内容
- **现代特性**：合理使用现代CSS特性

## 2. 基本格式规范

### 2.1 代码缩进

**规则：** 使用2个空格进行代码缩进，禁止使用Tab制表符。

**示例**：

```css
/* 正确示例 ✅ */
.example {
  display: block;
  width: 100%;
}

/* 错误示例 ❌ */
.example {
    display: block; /* 使用Tab或4个空格 */
}
```

### 2.2 代码大小写

**规则：** 选择器、属性名、属性值关键字全部使用小写字母书写。

**示例**：

```css
/* 正确示例 ✅ */
.example {
  display: block;
  background-color: #ffffff;
}

/* 错误示例 ❌ */
.EXAMPLE {
  DISPLAY: BLOCK;
  BACKGROUND-COLOR: #FFFFFF;
}
```

### 2.3 空格使用

**规则：**

- 左括号与选择器之间一个空格
- 冒号与属性值之间一个空格
- 逗号分隔的取值，逗号之后一个空格

**示例**：

```css
/* 正确示例 ✅ */
.selector {
  box-shadow:
    1px 1px 1px #333,
    2px 2px 2px #ccc;
  color: rgba(255, 255, 255, 0.5);
}

/* 错误示例 ❌ */
.selector{
  box-shadow: 1px 1px 1px #333,2px 2px 2px #ccc;
  color: rgba(255,255,255,.5);
}
```

### 2.4 分号使用

**规则：** 每个声明末尾都要加分号。

**示例**：

```css
/* 正确示例 ✅ */
.example {
  display: block;
  width: 100%;
}

/* 错误示例 ❌ */
.example {
  display: block;
  width: 100%
}
```

### 2.5 引号使用

**规则：**

- 属性值使用双引号包裹
- URI值(`url()`)不使用引号
- `@charset`规则使用双引号

**示例**：

```css
/* 正确示例 ✅ */
@charset "UTF-8";

.example {
  font-family: "Open Sans", arial, sans-serif;
  background-image: url(../../media/examples/lizard.png);
}

/* 错误示例 ❌ */
@charset 'UTF-8';

.example {
  font-family: 'Open Sans', arial, sans-serif;
  background-image: url("../../media/examples/lizard.png");
}
```

## 3. 文档结构规范

### 3.1 样式表编码

**规则：** 样式文件首行必须使用`@charset`规则指定UTF-8编码。

**示例**：

```css
@charset "UTF-8";

/* 样式内容 */
```

### 3.2 文件信息注释

**规则：** 在`@charset`规则后注明文件信息。

**示例**：

```css
@charset "UTF-8";

/**
 * @desc 文件描述
 * @author 作者名称
 * @date YYYY-MM-DD
 */
```

### 3.3 导入规则

**规则：** 使用`@import`规则时，应置于样式表开头，`@charset`规则之后。

**示例**：

```css
@charset "UTF-8";

@import url(https://example.com/styles/reset.css);
@import url(https://example.com/styles/typography.css);

/* 本地样式 */
```

## 4. 选择器规范

### 4.1 选择器使用

**规则：**

- 尽量少用通用选择器`*`
- 不使用ID选择器
- 不使用无具体语义定义的标签选择器
- 类名使用短横线命名法(kebab-case)，参考BEM命名规范

**示例**：

```css
/* 正确示例 ✅ */
.nav-item {}
.user-profile {}
.search-form__input {}

/* 错误示例 ❌ */
#navItem {}
div.navItem {}
.userProfile {}
```

### 4.2 选择器特异性

**规则：** 保持选择器低特异性，避免过度嵌套。

**示例**：

```css
/* 正确示例 ✅ - 低特异性 */
.nav .item {}

/* 错误示例 ❌ - 高特异性 */
body > header > nav > ul > li > a {}
```

### 4.3 选择器分隔

**规则：** 多个选择器应单独成行。

**示例**：

```css
/* 正确示例 ✅ */
.selector-a,
.selector-b,
.selector-c {
  display: block;
}

/* 错误示例 ❌ */
.selector-a, .selector-b, .selector-c {
  display: block;
}
```

## 5. 属性规范

### 5.1 属性书写顺序

**规则：** 建议按以下顺序组织属性：

1. 布局属性：`display`, `position`, `float`, `clear`, `visibility`, `overflow`
2. 盒模型属性：`width`, `height`, `margin`, `padding`, `border`
3. 排版属性：`font`, `line-height`, `text-align`, `color`
4. 视觉属性：`background`, `box-shadow`, `opacity`
5. 动画属性：`transition`, `animation`
6. 其他属性：`cursor`, `z-index`

**示例**：

```css
.example {
  /* 布局属性 */
  display: block;
  position: relative;
  float: left;

  /* 盒模型属性 */
  width: 100px;
  height: 100px;
  margin: 0 10px;
  padding: 20px 0;

  /* 排版属性 */
  font: 100%/1.6 "Open Sans", arial, sans-serif;
  text-align: center;
  color: #333;

  /* 视觉属性 */
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  box-shadow: 1px 1px 1px #333;

  /* 动画属性 */
  transition: all 0.3s ease;

  /* 其他属性 */
  cursor: pointer;
  z-index: 10;
}
```

### 5.2 简写属性

**规则：** 尽可能使用简写属性，但需确保理解其含义。

**示例**：

```css
/* 正确示例 ✅ */
.example {
  margin: 10px 20px;
  font: bold 1rem/1.5 "Open Sans", sans-serif;
  background: #fff url(image.png) no-repeat 0 0;
}

/* 错误示例 ❌ - 不必要的全写 */
.example {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
}
```

### 5.3 0值与单位

**规则：** 0值不需要单位。

**示例**：

```css
/* 正确示例 ✅ */
.example {
  margin: 0;
  padding: 10px 0;
}

/* 错误示例 ❌ */
.example {
  margin: 0px;
  padding: 10px 0px;
}
```

### 5.4 颜色值

**规则：**

- 十六进制颜色使用小写字母
- 十六进制颜色不使用简写形式
- 透明颜色使用`rgba()`或`hsla()`

**示例**：

```css
/* 正确示例 ✅ */
.example {
  color: #eebbcc;
  background-color: rgba(0, 0, 0, 0.5);
  border-color: hsl(120, 100%, 50%);
}

/* 错误示例 ❌ */
.example {
  color: #EEBBCC;
  background-color: rgb(0,0,0,0.5);
  border-color: #ebc;
}
```

### 5.5 重要声明

**规则：** 避免使用`!important`，除非绝对必要。

**示例**：

```css
/* 不推荐 */
.example {
  color: red !important;
}

/* 推荐 - 通过增加特异性解决问题 */
.parent .example {
  color: red;
}
```

## 6. 注释规范

### 6.1 普通注释

**规则：** 单行注释使用`/* */`格式，注释内容前后各留一个空格。

**示例**：

```css
/* 单行注释 */

.example {
  /* 属性注释 */
  display: block;
}
```

### 6.2 模块注释

**规则：** 大型模块使用统一格式的起始和结束注释。

**示例**：

```css
/* ======= 用户信息卡片 Start ======= */
.user-card {
  /* 模块样式 */
}

.user-card__header {
  /* 子模块样式 */
}
/* ======= 用户信息卡片 End ======= */

/* 简化版 */
/* ======= 用户信息卡片 S ======= */
.user-card {
  /* 模块样式 */
}
/* ======= 用户信息卡片 E ======= */
```

### 6.3 文件结构注释

**规则：** 使用注释标识样式表的不同部分。

**示例**：

```css
/* ====== 基础样式 ====== */

/* 重置样式 */
.reset {}

/* 排版样式 */
.typography {}

/* ====== 组件样式 ====== */

/* 按钮组件 */
.button {}

/* 表单组件 */
.form {}
```

## 7. 现代CSS特性

### 7.1 CSS变量

**规则：** 使用CSS变量提高可维护性和主题支持能力。

**示例**：

```css
:root {
  /* 颜色系统 */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;

  /* 间距系统 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;

  /* 字体系统 */
  --font-family-base: "Open Sans", sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
}

.example {
  color: var(--color-primary);
  margin: var(--spacing-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
}
```

### 7.2 Flexbox与Grid布局

**规则：** 根据布局需求选择合适的现代布局技术。

**示例**：

```css
/* Flexbox示例 - 一维布局 */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

/* Grid示例 - 二维布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### 7.3 层叠层(Layers)

**规则：** 使用`@layer`管理样式优先级和架构。

**示例**：

```css
/* 定义层顺序 */
@layer reset, base, components, utilities;

/* 重置层 */
@layer reset {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}

/* 基础层 */
@layer base {
  body {
    font-family: var(--font-family-base);
    line-height: var(--line-height-base);
  }
}

/* 组件层 */
@layer components {
  .button {
    /* 组件样式 */
  }
}
```

## 8. 响应式设计

### 8.1 移动优先

**规则：** 采用移动优先的媒体查询策略。

**示例**：

```css
/* 基础样式 - 移动设备优先 */
.container {
  padding: 1rem;
  margin: 0 auto;
}

/* 中等屏幕 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 720px;
  }
}

/* 大屏幕 */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

/* 超大屏幕 */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

### 8.2 容器查询

**规则：** 适时使用容器查询实现组件级响应式设计。

**示例**：

```css
.card {
  container-type: inline-size;
}

/* 当卡片容器宽度大于400px时 */
@container (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }

  .card__image {
    flex: 0 0 150px;
  }
}
```

## 9. 性能与可访问性

### 9.1 性能优化

**规则：** 编写高性能的CSS代码。

**示例**：

```css
/* 减少重排重绘 */
.example {
  /* 使用transform和opacity实现动画，性能更好 */
  transform: translateX(100px);
  opacity: 0.5;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  /* 避免使用性能昂贵的属性 */
  /* box-shadow: 0 0 10px 5px rgba(0,0,0,0.5); */
}

/* 使用will-change提示浏览器优化 */
.animated-element {
  will-change: transform, opacity;
}
```

### 9.2 可访问性

**规则：** 确保样式不会妨碍可访问性。

**示例**：

```css
/* 确保焦点状态可见 */
.button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 减少运动偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 高对比度支持 */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}
```
