---
title: HTML 代码风格指南
date: 2025-10-01
categories: [前端]
tags: [HTML, 代码规范]
---

# HTML 代码风格指南

## 目录

- [1. 前言](#1-前言)
- [2. 基本格式规范](#2-基本格式规范)
- [3. 文档结构规范](#3-文档结构规范)
- [4. 元素规范](#4-元素规范)
- [5. 属性规范](#5-属性规范)
- [6. 注释规范](#6-注释规范)
- [7. 可访问性规范](#7-可访问性规范)
- [8. 文件与目录规范](#8-文件与目录规范)

## 1. 前言

### 1.1 文档目的

本规范基于业界最佳实践（Google、Airbnb、W3C、MDN等）制定，旨在提高HTML代码质量，为大型企业级前端项目提供统一的HTML编码标准。确保代码的一致性、可维护性、可扩展性和团队协作效率。

本规范结合现代前端工程化需求制定，适用于企业级前端项目开发，可作为代码审查和自动化检查的依据。

### 1.2 适用范围

适用于所有新开发的Web项目及现有项目的重构工作。所有前端开发人员必须遵守本规范，代码审查时应以此规范为依据。

### 1.3 原则说明

- **语义化优先**：选择最符合内容含义的HTML元素
- **关注点分离**：严格分离结构、表现和行为
- **可访问性**：确保所有用户都能访问内容
- **向前兼容**：采用现代标准，确保未来兼容性
- **性能优化**：考虑加载性能和渲染性能

## 2. 基本格式规范

### 2.1 缩进与换行

**规则：**

1. 使用2个空格作为缩进，禁止使用Tab制表符。
2. 行长度原则上不超过100字符，超长属性值单独成行。

**示例：**

```html
<!-- 正确示例 ✅ -->
<input 
  type="text"
  class="form-control"
  placeholder="请输入您的用户名"
  maxlength="20"
  required
/>

<!-- 错误示例 ❌ -->
<input type="text" class="form-control" placeholder="请输入您的用户名" maxlength="20" required />
```

### 2.2 命名规范

**规则：** 所有的代码都使用小写字母，适用于HTML元素、属性、属性值、CSS选择器、属性名以及属性值。

**示例：**

```html
<!-- 正确示例 ✅ -->
<div class="container" id="main-content"></div>

<!-- 错误示例 ❌ -->
<DIV CLASS="container" ID="main-content"></DIV>
```

### 2.3 引号使用

**规则：** 属性值必须使用双引号包裹，等号周围不加空格。

**示例：**

```html
<!-- 正确示例 ✅ -->
<div class="container" data-id="123"></div>

<!-- 错误示例 ❌ -->
<div class='container' data-id=123></div>
<link rel = "stylesheet" href = "styles.css">
```

## 3. 文档结构规范

### 3.1 文档类型声明

**规则：** 必须使用HTML5的文档类型声明。

**示例：**

```html
<!DOCTYPE html>
```

### 3.2 HTML根元素

**规则：** 必须指定lang属性，表明页面主要语言。

**示例：**

```html
<html lang="zh-CN">
```

### 3.3 文档头与体

**规则：** 必须包含 head 与 body 元素。

```html
<head>
  <!-- 元数据 -->
</head>
<body>
  <!-- 内容 -->
</body>
```

### 3.4 元数据规范

**规则：** head区域必须包含必要的meta标签，并按推荐顺序排列。

**示例：**

```html
<head>
  <!-- 字符编码声明必须为首行 -->
  <meta charset="UTF-8" />

  <!-- 视口设置，适配移动端 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- IE兼容模式 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <!-- 页面描述和关键词 -->
  <meta name="description" content="页面描述内容" />
  <meta name="keywords" content="关键词1,关键词2" />

  <!-- 页面标题 -->
  <title>页面标题 - 网站名称</title>
</head>
```

### 3.5 资源引入

**规则：** 省略CSS和JavaScript资源的type属性。

**示例：**

```html
<!-- 正确示例 ✅ -->
<link rel="stylesheet" href="styles.css" />
<script src="app.js"></script>

<!-- 错误示例 ❌ -->
<link rel="stylesheet" href="styles.css" type="text/css" />
<script src="app.js" type="text/javascript"></script>
```

### 3.6 基本模板

**示例：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keywords" content="关键词1, 关键词2" />
    <meta name="description" content="页面描述" />
    <title>页面标题</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <noscript>
      <strong>请启用JavaScript以获得完整体验</strong>
    </noscript>

    <!-- 页面内容 -->

    <script src="app.js"></script>
  </body>
</html>
```

## 4. 元素规范

### 4.1 语义化元素

**规则：** 优先使用语义化元素，避免滥用div和span。

**示例：**

```html
<!-- 组件注释说明 -->
<article class="component-name">
  <header class="component-name__header">
    <!-- 头部内容 -->
  </header>

  <main class="component-name__body">
    <!-- 主体内容 -->
    <section>...</section>
  </main>

  <footer class="component-name__footer">
    <!-- 底部内容 -->
  </footer>
</article>
```

### 4.2 空格和等号

**规则**：HTML 允许在等号周围使用空格。但是无空格更容易阅读，并且可以更好地将实体组合在一起

**示例**：

```html
<!-- 正确示例 ✅ -->
<link rel="stylesheet" href="styles.css" />

<!-- 错误示例 ❌ -->
<link rel = "stylesheet" href = "styles.css" />
```

### 4.3 标签闭合

**规则：** 所有标签必须正确闭合，自闭合标签以"/"结尾。

**示例：**

```html
<!-- 正确示例 ✅ -->
<div></div>
<br />
<input type="text" />

<!-- 错误示例 ❌ -->
<div>
<br>
<input type="text">
```

### 4.4 嵌套规则

**规则：** 元素必须正确嵌套，不允许交叉嵌套。

**示例：**

```html
<!-- 正确示例 ✅ -->
<p>这是一个<strong><em>示例</em></strong></p>

<!-- 错误示例 ❌ -->
<p>这是一个<strong><em>示例</strong></em></p>
```

### 4.5 标题层级

**规则：** 保持标题层级清晰合理，h1-h6应按层级使用。

**示例：**

```html
<h1>页面主标题（每个页面仅一个）</h1>
<section>
  <h2>二级标题</h2>
  <article>
    <h3>三级标题</h3>
  </article>
</section>
<section>
  <h2>另一个二级标题</h2>
  <article>
    <h3>三级标题</h3>
    <h4>四级标题</h4>
  </article>
</section>
```

### 4.6 减少嵌套层级

**规则：** 避免不必要的嵌套，保持DOM结构扁平。

**示例：**

```html
<!-- 正确示例 ✅ -->
<ul class="nav">
  <li><a href="#">首页</a></li>
  <li><a href="#">关于</a></li>
</ul>

<!-- 错误示例 ❌ -->
<div class="nav">
  <ul>
    <li>
      <div>
        <a href="#">
          <span>首页</span>
        </a>
      </div>
    </li>
  </ul>
</div>
```

### 4.7 实体引用

**规则：** 不要使用不必要的实体引用，尽可能使用字面字符（仍需转义尖括号和引号等特殊字符）。

**示例：**

```html
<!-- 正确示例 ✅ -->
<p>© 2025 Example Company</p>
<p>Hello World</p>
<!-- 必须使用实体的情况 -->
<p>5 &lt; 10 &amp; 10 &gt; 5</p>

<!-- 错误示例 ❌ -->
<p>&copy; 2025 Example Company</p>
<p>Hello&nbsp;World</p>
```

## 5. 属性规范

### 5.1 属性顺序

**规则：** 属性按以下顺序排列：

1. class
2. id, name
3. data-*
4. src, for, type, href, value
5. title, alt
6. role, aria-*
7. tabindex
8. style
9. 事件处理

**示例：**

```html
<input
  class="form-control"
  id="username"
  name="username"
  type="text"
  placeholder="请输入用户名"
  required
  style="width: 100%; height: 30px;"
  onchange="handleInputChange()"
/>
```

### 5.2 布尔属性

**规则：** 布尔属性使用简写形式。

**示例：**

```html
<!-- 正确示例 ✅ -->
<input type="checkbox" checked />
<select>
  <option selected>选项1</option>
</select>

<!-- 错误示例 ❌ -->
<input type="checkbox" checked="checked" />
<select>
  <option selected="selected">选项1</option>
</select>
```

### 5.3 必需属性

**规则：** 图像必须包含`alt`属性，链接必须包含`href`或`role="button"`。

**示例：**

```html
<!-- 正确示例 ✅ -->
<img src="html5.gif" alt="HTML5" />

<!-- 错误示例 ❌ -->
<img src="html5.gif" />
```

### 5.4 类名和ID命名

**规则：** 使用短横线命名法(kebab-case)，确保语义化且简洁。

**示例：**

```html
<!-- 正确示例 ✅ -->
<div class="user-profile" id="main-navigation"></div>

<!-- 错误示例 ❌ -->
<div class="userProfile" id="mainNavigation"></div>
<div class="user_profile" id="main_navigation"></div>
<div class="bigRedBox" id="mainContent"></div>
```

### 5.5 自定义数据属性

**规则：** 使用`data-*`格式存储自定义数据，值应为字符串，复杂数据使用JSON格式。

**示例：**

```html
<div data-user-id="123" data-role="admin"></div>

<!-- 复杂数据使用JSON格式 -->
<div data-user-info='{"id":123,"name":"John"}'></div>
```

## 6. 注释规范

### 6.1 普通注释

**规则：** 注释内容前后各留一个空格。

**示例：**

```html
<!-- 单行注释 -->

<!-- 
  多行注释
  第二行内容
-->
```

### 6.2 模块注释

**规则：** 大型模块使用统一格式的起始和结束注释。

**示例：**

```html
<!-- ======= 用户信息卡片 Start ======= -->
<section class="user-card">
  <!-- 模块内容 -->
</section>
<!-- ======= 用户信息卡片 End ======= -->

<!-- 简化版 -->
<!-- ======= 用户信息卡片 S ======= -->
<section class="user-card">
  <!-- 模块内容 -->
</section>
<!-- ======= 用户信息卡片 E ======= -->

<!-- 基础版 -->
<!-- 用户信息卡片开始 -->
<section class="user-card">
  <!-- 模块内容 -->
</section>
<!-- 用户信息卡片结束 -->
```

### 6.3 TODO注释

**规则：** TODO注释需注明负责人和预期完成时间。

**示例：**

```html
<!-- TODO(负责人): 描述待办事项 -->
<!-- FIXME(负责人): 描述需要修复的问题 -->
<!-- TODO(张三 2023-12-31): 优化用户登录逻辑 -->
```

### 6.4 条件注释（仅限IE）

**示例：**

```html
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
<![endif]-->
```

## 7. 可访问性规范

### 7.1 语义化结构

**规则：** 使用正确的标题层级和地标角色。

**示例：**

```html
<header role="banner">
  <h1>网站标题</h1>
  <nav role="navigation" aria-label="主导航">
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/about">关于</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <article>
    <h2>文章标题</h2>
    <p>文章内容</p>
  </article>
</main>

<footer role="contentinfo">
  <p>版权信息</p>
</footer>
```

### 7.2 表单可访问性

**规则：** 所有表单控件必须有关联的label。

**示例：**

```html
<!-- 正确示例 ✅ -->
<div class="form-group">
  <label for="email">电子邮箱</label>
  <input type="email" id="email" name="email" required />
  <span class="help-text">请输入有效的电子邮箱地址</span>
</div>

<!-- 错误示例 ❌ -->
<div class="form-group">
  <span>电子邮箱</span>
  <input type="email" name="email" placeholder="请输入邮箱" />
</div>

<!-- 使用fieldset和legend组织相关控件 -->
<fieldset>
  <legend>支付方式</legend>
  <input type="radio" id="credit-card" name="payment" value="card" />
  <label for="credit-card">信用卡</label>

  <input type="radio" id="paypal" name="payment" value="paypal" />
  <label for="paypal">PayPal</label>
</fieldset>
```

## 8. 文件与目录规范

### 8.1 文件扩展名

**规则**：HTML 文件名应该使用扩展名 *.html*（而不是 .htm）。

**示例：**

```text
<!-- 正确示例 ✅ -->
index.html

<!-- 错误示例 ❌ -->
index.htm
```

### 8.2 文件命名

**规则：** 使用小写字母和短横线命名文件。

**示例：**

```
<!-- 正确示例 ✅ -->
user-profile.html
about-us.html

<!-- 错误示例 ❌ -->
userProfile.html
AboutUs.html
```
