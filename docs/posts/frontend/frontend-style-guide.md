---
title: 前端开发风格指南
date: 2025-10-01
sticky: 1
categories: [前端]
tags: [前端, 代码规范]
---

# 前端开发风格指南

## 目录

- [1. 前言](#_1-前言)
- [2. 通用编码规范](#_2-通用编码规范)
- [3. HTML 编码规范](#_3-html-编码规范)
- [4. CSS 编码规范](#_4-css-编码规范)
- [5. JavaScript 编码规范](#_5-javascript-编码规范)
- [6. Vue 编码规范](#_6-vue-编码规范)
- [7. Git 协作规范](#_7-git-协作规范)

## 1. 前言

### 1.1 文档目的

本规范基于业界最佳实践（Google、Airbnb、W3C、MDN等）和现代前端技术趋势制定，旨在为大型企业级前端项目提供统一的编码标准，提高代码质量。确保代码的一致性、可维护性、可扩展性、可读性和团队协作效率。

### 1.2 适用范围

本规范结合现代前端工程化需求制定，适用于企业级所有新开发的Web项目及现有项目的重构工作，可作为代码审查和自动化检查的依据。所有前端开发人员必须遵守本规范。

### 1.3 原则说明

- **一致性**：统一团队代码风格和模式
- **可维护性**：编写易于理解和修改的代码
- **可扩展性**：确保代码易于扩展和修改
- **现代特性**：合理使用现代技术新特性
- **渐进式**：平衡严格规则与实际项目需求

## 2. 通用编码规范

### 2.1 缩进与空格

**规则：** 统一使用2个空格缩进，操作符周围添加空格。

**示例：**

```javascript
// 正确示例 ✅

// HTML
<div class="container">
∙∙<span class="text">内容</span>
</div>

// CSS
.selector {
∙∙display: block;
∙∙width: 100%;
}

// JavaScript
function calculateTotal(price, quantity) {
∙∙if (price > 0 && quantity > 0) {
∙∙∙∙return price * quantity;
∙∙}
∙∙return 0;
}

// 错误示例 ❌
function calculateTotal(price, quantity) {
∙if (price > 0 && quantity > 0) { // Tab缩进
∙∙∙∙return price * quantity;      // 4空格缩进
}
∙∙return 0;                       // 2空格缩进
}
```

### 2.2 行长度与换行

**规则：** 行长度不超过100字符，超长时合理换行。

**示例：**

```javascript
// 正确示例 ✅
const result = calculateTotal(
∙∙basePrice,
∙∙taxRate,
∙∙discountAmount,
∙∙shippingCost,
∙∙otherFees,
∙∙moreParams
);

// 错误示例 ❌
const result = calculateTotal(basePrice, taxRate, discountAmount, shippingCost, otherFees, moreParams);
```

### 2.3 通用命名

**规则：** 所有命名应具有描述性且简洁明了。

**示例：**

```javascript
// 正确示例 ✅
const userProfile = {}        // JavaScript变量
.user-profile-card {}         // CSS类名
<UserProfileCard />           // Vue组件
feature/user-authentication   // Git分支

// 错误示例 ❌
const up = {}                 // 无意义缩写
.userProfileCard {}           // 混合命名法
<userProfileCard />           // Vue组件不符合规范
feature/userAuthentication    // Git分支不符合规范
```

### 2.4 目录命名

**规则：** 统一使用小写字母和短横线命名法(kebab-case)。

**示例：**

```bash
# 正确示例 ✅
src/
|- views/
|- |- user-profile/
|- |- |- comonents/
|- |- |- index.vue
|- |- navigation/
|- styles/
|- |- main.css
|- utils/
|- |- api-service.js

# 错误示例 ❌
src/
|- Views/                # PascalCase
|- |- |- Comonents/
|- |- |- index.vue
|- Styles/               # PascalCase
|- |- main.css
|- Utils/                # PascalCase
|- |- apiService.js      # camelCase
```

### 2.5 文件命名

**规则：**统一使用小写字母和短横线命名法(kebab-case)，Vue 单文件组件使用PascalCase。

**示例：**

```bash
# 正确示例 ✅
user-profile.html
main-navigation.css
api-service.js
user-profile.vue
components/UserProfile.vue   # Vue组件文件PascalCase

# 错误示例 ❌
UserProfile.html             # HTML文件不应PascalCase
main_navigation.css          # 不应使用下划线
ApiService.js                # JavaScript文件不应PascalCase
userProfile.vue              # Vue组件文件不应camelCase
```

### 2.6 文件组织

**规则：** 按功能模块与组织文件，保持结构清晰。

**示例：**

```bash
src/
|- components/
|- |- PascalCase.vue
|- |- kebab-case/
|- |- |- components/
|- |- |- types/
|- |- |- index.vue
|- services/
|- |- auth.js
|- |- user.js
|- views/
|- |- auth/
|- |- |- components/
|- |- |- hooks/
|- |- |- index.vue
|- |- user/
|- |- |- components/
|- |- |- hooks/
|- |- |- index.vue
|- ...
```

### 2.7 通用注释

**规则：** 统一注释格式，保持一致性。

**示例：**

```javascript
// 正确示例 ✅

// 单行注释
const user = getUser();

/*
 * 多行注释
 * 这是一个多行注释的示例
 * 用于描述复杂逻辑或算法
 */

/**
 * 文档注释（JSDoc）
 * @param {number} userId - 用户ID
 * @returns {Object} 用户信息对象
 */
function getUserDetail(userId) {
∙∙// 函数实现
}

// 错误示例 ❌
//获取用户信息
const user = getUser();

/* 多行注释格式不一致
   缩进不统一
*/
```

### 2.8 模块注释

**规则：** 大型模块使用统一格式的起始和结束注释。

**示例：**

```javascript
// 正确示例 ✅

<!-- HTML模块 -->
<!-- ======= 用户信息卡片 Start ======= -->
<section class="user-card">
∙∙<!-- 模块内容 -->
</section>
<!-- ======= 用户信息卡片 End ======= -->

/* CSS模块 */
/* ======= 用户卡片样式 S ======= */
.user-card {
∙∙/* 样式内容 */
}
/* ======= 用户卡片样式 E ======= */

// JavaScript模块
// ======= 用户服务模块开始 =======
const UserService = {
∙∙// 模块内容
};
// ======= 用户服务模块结束 =======
```

## 3. HTML 编码规范

### 3.1 命名规范

**规则：** 所有的代码都使用小写字母，适用于HTML元素、属性、属性值、CSS选择器、属性名以及属性值。

**示例：**

```html
<!-- 正确示例 ✅ -->
<div class="container" id="main-content"></div>

<!-- 错误示例 ❌ -->
<DIV CLASS="container" ID="main-content"></DIV>
```

### 3.2 引号使用

**规则：** 属性值必须使用双引号包裹，等号周围不加空格。

**示例：**

```html
<!-- 正确示例 ✅ -->
<div class="container" data-id="123"></div>

<!-- 错误示例 ❌ -->
<div class='container' data-id=123></div>
<link rel = "stylesheet" href = "styles.css">
```

### 3.3 空格和等号

**规则**：HTML 允许在等号周围使用空格。但是无空格更容易阅读，并且可以更好地将实体组合在一起

**示例**：

```html
<!-- 正确示例 ✅ -->
<link rel="stylesheet" href="styles.css" />

<!-- 错误示例 ❌ -->
<link rel="stylesheet" href="styles.css" />
```

### 3.4 标签闭合

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

### 3.5 属性顺序

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
  onchange="onInputChange"
/>
```

## 4. CSS 编码规范

### 4.1 代码格式

**规则：**

- 每个样式规则换行，并添加分号
- 左括号与选择器之间一个空格
- 冒号与属性值之间一个空格
- 逗号分隔的取值，逗号之后一个空格

**示例**：

```css
/* 正确示例 ✅ */
.selector {
  display: block;
  width: 100%;
  color: #333;
}

.another-selector {
  box-shadow:
    1px 1px 1px #333,
    2px 2px 2px #ccc;
  color: rgba(255, 255, 255, .5);
}

/* 错误示例 ❌ */
.selector {padding:10px; margin:0 auto}

.another-selector{
  box-shadow: 1px 1px 1px #333,2px 2px 2px #CCC;
  color: rgba(255, 255, 255, 0.5);
}
```

### 4.2 选择器规范

**规则：**

- 尽量少用通用选择器`*`
- 尽量少用ID选择器
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

### 4.3 属性书写顺序

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

### 4.4 简写属性

**规则：** 尽可能使用简写属性，但需确保理解其含义。

**示例**：

```css
/* 正确示例 ✅ */
.example {
  margin: 10px 20px;

  padding: 10px 0;
  font: bold 1rem/1.5 "Open Sans", sans-serif;
  background: #fff url(image.png) no-repeat 0 0;
}

/* 错误示例 ❌ */
.example {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;

  padding: 10px 0px; /* 0值不需要单位 */
}
```

## 5. JavaScript 编码规范

### 5.1 命名规范

**规则：**

1. 优先使用`const`声明常量，可变变量使用`let`，避免使用`var`
2. 变量和函数使用camelCase命名法，首字母小写，后续单词首字母大写。
3. 常量使用UPPER_CASE命名法，全大写，单词间用下划线分隔。
4. 类使用PascalCase命名法，每个单词首字母大写。
5. 避免用一个字母命名，让你的命名有意义
6. 如果属性值/方法返回值是 `boolean`， 用 `isVal()` 或 `hasVal()`

**示例：** 

```javascript
// 正确示例 ✅
const MAX_COUNT = 100
let currentPage = 1
const user = {
  name: 'John',
  age: 30,
}
class UserProfile {}
function q() {
  // ...
}
if (!dragon.hasAge()) {
  return false
}

// 错误示例 ❌
var maxCount = 100
var currentPage = 1
var user = {
  name: 'John',
  age: 30,
}
class userProfile {}
function query() {
  // ...
}
if (!dragon.age()) {
  return false
}
```

### 5.2 分号

**规则：** 每个语句结束时不使用分号。
**示例：**

```javascript
// 正确示例 ✅
const name = 'John'

// 错误示例 ❌
const name = 'John';
```

### 5.3 引号

**规则：** 统一使用单引号，JSX属性使用双引号。

**示例：**

```javascript
// 正确示例
const name = 'John'
const html = '<div class="container"></div>'

// JSX中的正确示例
const element = <div className="container">Hello</div>

// 错误示例
const name = "John"
```

### 5.4 空行

**规则：** 在逻辑块之间使用空行分隔，提高可读性。
**示例：**

```javascript
// 正确示例 ✅
// 逻辑块 A
const name = 'John'
function sayHello() {
  console.log('Hello')
}
function sayGoodbye() {
  console.log('Goodbye')
}

// 逻辑块 B
const name = 'John'
function sayHello() {
  console.log('Hello')
}
function sayGoodbye() {
  console.log('Goodbye')
}

// 错误示例 ❌
// 逻辑块 A
const name = 'John'
function sayHello() {
  console.log('Hello')
}
function sayGoodbye() {
  console.log('Goodbye')
}
// 逻辑块 B
const name = 'John'
function sayHello() {
  console.log('Hello')
}
function sayGoodbye() {
  console.log('Goodbye')
}
```

### 5.5 空格

**规则：** 在操作符、关键字后添加空格，提高可读性。
**示例：**

```javascript
// 正确示例 ✅
const sum = a + b
const foo = { clark: 'kent' }
function foo() {
  return true
}

// 错误示例 ❌
const sum=a+b
const foo = {clark:'kent'}
function foo() {return true}
```

### 5.6 大括号

**规则：** 大括号应遵循K&R风格（左大括号不换行），对于非空块，内容应缩进。
**示例：**

```javascript
// 正确示例 ✅
if (condition) {
  doSomething()
}

if (test) {
  thing1()
  thing2()
} else {
  thing3()
}

// 错误示例 ❌
if (condition)
{
  doSomething()
}

if (test) {
  thing1()
  thing2()
}
else {
  thing3()
}
```

### 5.7 声明初始化

**规则：** 每个声明语句只声明一个变量，并在使用前初始化。

**示例：**

```javascript
// 正确示例
const name = 'John'
const age = 30
let score = 0

// 错误示例
const name = 'John', age = 30, score = 0
let user // 未初始化
```

### 5.8 函数定义

**规则：** 使用现代函数定义方式

```javascript
// 正确示例 ✅
const calculateTotal = (price, quantity) => {
  return price * quantity
}

function getUserInfo(userId) {
  // 函数逻辑
}

// 错误示例 ❌
var calculateTotal = function(price, quantity) {
  return price * quantity
}

function getUserInfo(userId) {
  var self = this // 使用self保存this引用
}
```

### 5.9 对象和数组创建

**规则：**

1. 使用对象字面量`{}`创建对象，而非`new Object()`。
2. 使用数组字面量`[]`创建数组，而非`new Array()`。

**示例：**

```javascript
// 正确示例 ✅
const obj = {
  key: 'value',
}
const arr = [1, 2, 3]

// 错误示例 ❌
const obj = new Object()
obj.key = 'value'
const arr = new Array(1, 2, 3)
```

### 5.10 属性和方法简写

**规则：**

1. 对象属性使用简写形式。
2. 对象方法使用简写形式。
3. 将所有简写放在对象声明的前面。

**示例：**

```javascript
const firstName = 'John'

// 正确示例 ✅
const obj = {
  firstName,
  lastName: 'Cena',
  age: 18,
  method() {
    // ...
  }
}

// 错误示例 ❌
const obj = {
  age: 18,
  lastName: 'Cena'
  first_name: firstName,
  method: function() {
    // ...
  }
}
```

### 5.11 方法简写

**规则：** 对象方法使用简写形式。
**示例：**

```javascript
// 正确示例 ✅
const obj = {
  method() {
    // ...
  },
}

// 错误示例 ❌
const obj = {
  method: function () {
    // ...
  },
}
```

### 5.12 解构赋值

**规则：** 使用解构赋值简化代码。
**示例：**

```javascript
// 正确示例 ✅
const { name, age } = user
const [first, second] = arr

// 错误示例 ❌
const name = user.name
const age = user.age
const first = arr[0]
const second = arr[1]
```

### 5.13 展开运算符

**规则：** 使用展开运算符进行数组和对象操作。
**示例：**

```javascript
// 正确示例 ✅
const newArr = [...arr, 4]
const newObj = { ...obj, key: 'value' }

// 错误示例 ❌
const newArr = arr.concat(4)
const newObj = Object.assign({}, obj, { key: 'value' })
```

### 5.14 相等比较

**规则：** 使用严格相等`===`和`!==`，避免使用`==`和`!=`。
**示例：**

```javascript
// 正确示例 ✅
if (value === 9) {}

// 错误示例 ❌
if (value == 9) {}
```

### 5.15 显式比较

**规则：** 布尔值要用缩写，而字符串和数字要明确使用比较操作符，避免隐式转换。
**示例：**

```javascript
// 正确示例 ✅
if (isValid) {}
if (name !== '') {}
if (collection.length > 0) {}

// 错误示例 ❌
if (isValid === true) {}
if (name) {}
if (collection.length) {}
```

### 5.16 类型转换

**规则：** 使用显式类型转换（如`Number()`, `String()`, `Boolean()`），避免隐式转换或包装类型。
**示例：**

```javascript
// 正确示例 ✅
const num = Number('113')
const str = String(113)
const hasAge = Boolean(age)
const hasAge = !!age

// 错误示例 ❌
const num = +'113'
const str = 113 + ''
const totalScore = new String(this.reviewScore)
const totalScore = this.reviewScore.toString()
const hasAge = new Boolean(age)
```

### 5.17 三元表达式

**规则：**

1.  三元表达式不应该嵌套，通常是单行表达式。
2.  避免不必要的三元表达式。

**示例：**

```javascript
// 正确示例 ✅
const maybeNull = value1 > value2 ? 'baz' : null
const foo = maybe1 > maybe2 ? 'bar' : maybeNull

const foo = maybe1 > maybe2 ? "bar" : (value1 > value2 ? "baz") : null // 还行

const foo = a || b
const bar = !!c
const baz = !c
const quux = a ?? b

// 错误示例 ❌
const foo = maybe1 > maybe2 ? "bar" : value1 > value2 ? "baz" : null

const foo = a ? a : b
const bar = c ? true : false
const baz = c ? false : true
const quux = a != null ? a : b
```

### 5.18 标准库

**规则：** 用标准库替代全局函数。
**示例：**

```javascript
// 正确示例 ✅
Number.isNaN('1.2.3') // false
Number.isNaN(Number('1.2.3')) // true

Number.isFinite('2e3') // false
Number.isFinite(parseInt('2e3', 9)) // true

// ...

// 错误示例 ❌
isNaN('1.2') // false
isNaN('1.2.3') // true

isFinite('2e3') // true
```

### 5.19 ES 模块

**规则：** 使用ES模块语法（`import`/`export`）而不是非标准的模块系统。
**示例：**

```javascript
// 正确示例 ✅
import { module } from './module'
export const name = 'John'

// 错误示例 ❌
const module = require('./module')
module.exports = { name: 'John' }
```

### 5.20 导入顺序

**规则：** 导入应分组，先第三方库后本地模块，组间用空行或注释分隔。
**示例：**

```javascript
// 正确示例 ✅
import React from 'react'
import lodash from 'lodash-es'

import { localModule } from './localModule'

// 错误示例 ❌
import React from 'react'
import { localModule } from './localModule'
import lodash from 'lodash'
```

### 5.21 单一导入

**规则：** 一个路径只 `import` 一次。
**示例：**

```javascript
// 正确示例 ✅
import foo, { named1, named2 } from 'foo'

// 错误示例 ❌
import foo from 'foo'
import { named1, named2 } from 'foo'
```

### 5.22 常量导出

**规则：** 不要导出可变的东西。
**示例：**

```javascript
// 正确示例 ✅
const foo = 3
export { foo }

// 错误示例 ❌
let foo = 3
export { foo }
```

### 5.23 ESNext 特性

**规则：** 优先使用ESNext新特性来简化代码。
**示例：**

```javascript
// 正确示例 ✅
const doubled = arr.map(item => item * 2)

const person = {
  name: 'Alice',
  age: 25
}
Object.keys(person).forEach(key => {
  console.log(`${key}: ${person[key]}`);
})

for (const [key, value] of Object.entries(person)) {
  console.log(`${key}: ${value}`)
}

// 错误示例 ❌
const doubled = []
for (let i = 0 i < arr.length i++) {
  doubled.push(arr[i] * 2)
}

for (let key in person) {
  console.log(key, person[key])
}
```

## 6. Vue 编码规范

### 6.1 组件命名

**规则：** 组件名应该始终是多个单词的（根组件 `App` 和 Vue 内置组件除外），使用 PascalCase 命名法。

**示例：**

```vue
<!-- 正确示例 ✅ -->
export default {
  name: 'HomeView'
}

<!-- 错误示例 ❌ -->
export default {
  name: 'Home'
}

export default {
  name: 'homeView'
}
```

### 6.2 组件文件命名

**规则：** 单文件组件文件名应该始终使用 PascalCase 或 kebab-case。

**示例：**

```bash
# 正确示例 ✅
components/
|- MyComponent.vue    # PascalCase
|- my-component
|-|- index.vue        # kebab-case

# 错误示例 ❌
components/
|- myComponent.vue    # 驼峰不一致
```

### 6.3 完整单词的组件名

**规则：** 组件名应该倾向于完整单词而不是缩写。

**示例：**

```javascript
// 正确示例 ✅
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue

// 错误示例 ❌
components/
|- SdSettings.vue
|- UProfOpts.vue
```

### 6.4 紧密耦合的组件命名

**规则：** 和父组件紧密耦合的子组件应该以父组件名作为前缀命名。

**示例：**

```bash
# 正确示例 ✅
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue

# 错误示例 ❌
components/
|- TodoList.vue
|- Item.vue
|- Button.vue

components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

### 6.5 组件名中的单词顺序

**规则：** 组件名应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词结尾。

**示例：**

```bash
# 正确示例 ✅
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue

# 错误示例 ❌
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

### 6.6 顶级元素顺序

**规则：** 单文件组件应该总是让 `<template>`、`<script>` 和 `<style>` 标签的顺序保持一致。且 `<style>` 要放在最后。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<template>
  <div>...</div>
</template>

<script>
export default {
  // ...
}
</script>

<style>
/* ... */
</style>

<!-- 错误示例 ❌ -->
<script>
export default {
  // ...
}
</script>

<template>
  <div>...</div>
</template>

<style>
/* ... */
</style>
```

### 6.7 组件标签大小写

**规则：** 在单文件组件、字符串模板和 JSX 中，组件标签应该使用 PascalCase；在 DOM 模板中使用 kebab-case。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<MyComponent/>
<my-component></my-component> <!-- DOM模板中 -->

<!-- 错误示例 ❌ -->
<myComponent />
```

### 6.8 自闭合组件

**规则：** 在单文件组件、字符串模板和 JSX 中没有内容的组件应该是自闭合的，但在 DOM 模板里永远不要这样做。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<MyComponent/>
<my-component></my-component> <!-- DOM模板中 -->

<!-- 错误示例 ❌ -->
<MyComponent></MyComponent>
```

### 6.9 v-for 设置键值

**规则：** 总是为 v-for 设置 key 值，且不要使用索引作为 key。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<ul>
  <li 
    v-for="item in items" 
    :key="item.id"
  >
    {{ item.text }}
  </li>
</ul>

<!-- 错误示例 ❌ -->
<ul>
  <li v-for="(item, index) in items">
    {{ item.text }}
  </li>
</ul>
```

### 6.10 避免 v-if 和 v-for 共用

**规则：** 永远不要把 v-if 和 v-for 同时用在同一个元素上。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<ul>
  <template v-for="user in activeUsers" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>

<!-- 错误示例 ❌ -->
<ul>
  <li 
    v-for="user in users" 
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

### 6.11 模板表达式简化

**规则：** 组件模板应该只包含简单的表达式，复杂的表达式应该重构为计算属性或方法。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<template>
  {{ normalizedFullName }}
</template>

<script>
export default {
  computed: {
    normalizedFullName() {
      return this.fullName
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')
    },
  },
}
</script>

<!-- 错误示例 ❌ -->
<template>
  {{
    fullName
      .split(' ')
      .map((word) => {
        return word[0].toUpperCase() + word.slice(1)
      })
      .join(' ')
  }}
</template>
```

### 6.12 指令缩写

**规则：** 指令缩写(用 `:` 表示 `v-bind:`、用 `@` 表示 `v-on:` 和用 `#` 表示 `v-slot:`)。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<input :value="newTodoText" :placeholder="newTodoInstructions" />
<input @input="onInput" @focus="onFocus" />

<template #default></template>

<!-- 错误示例 ❌ -->
<input v-bind:value="newTodoText" v-bind:placeholder="newTodoInstructions" />
<input v-on:input="onInput" v-on:focus="onFocus" />

<template v-slot:default></template>
```

### 6.13 Prop / Emit 传递

**规则：** 在模板和 JSX 中应该始终使用 kebab-case。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<WelcomeMessage greeting-text="hi" @on-message="onMessage" />

<!-- 错误示例 ❌ -->
<WelcomeMessage greetingText="hi" @onMessage="onMessage" />
```

### 6.14 Ref 命名

**规则：** 驼峰 `camelCase + Ref` 命名。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<input ref="inputRef" />
<UserProfile ref="userProfileRef" />

<!-- 错误示例 ❌ -->
<input ref="input" />
<UserProfile ref="UserProfileRef" />
```

### 6.15 避免使用 v-html

**规则：** 谨慎使用 v-html，确保内容安全，防止 XSS 攻击。

**示例：**

```vue
<template>
  <!-- 正确示例 ✅ -->
  <div>{{ userProvidedContent }}</div>
  <div v-html="sanitizedContent"></div>

  <!-- 错误示例 ❌ -->
  <div v-html="userProvidedContent"></div>
</template>

<script>
import DOMPurify from 'dompurify'

export default {
  computed: {
    sanitizedContent() {
      return DOMPurify.sanitize(this.userProvidedContent)
    },
  },
}
</script>
```

### 6.16 组件结构顺序

**规则：** 组件选项应该有统一的顺序。

**示例：**

```vue
<script>
export default {
  name: 'ExampleComponent',
  // 组件依赖
  components: {},
  directives: {},
  filters: {},

  // 组合选项
  mixins: [],
  provide() {},
  inject: [],

  // 接口定义
  props: {},
  emits: [],
  expose: [],

  // 组合式 API
  setup() {},

  // 本地状态
  data() {
    return {}
  },
  computed: {},

  // 事件监听
  watch: {},

  // 生命周期钩子
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeUnmount() {},
  unmounted() {},
  errorCaptured() {},

  // 非响应式属性
  methods: {},
}
</script>
```

### 6.17 Prop 定义

**规则：**

1. 在声明 Prop 的时候，其命名应该始终使用 camelCase。

2. Prop 定义应该尽量详细，至少指定其类型。

**示例：**

```vue
<script>
export default {
  // 正确示例 ✅
  props: {
    propA: Number,
    propB: [String, Number],
    propC: {
      type: String,
      required: true,
    },
    propD: {
      type: Number,
      default: 100,
    },
    propE: {
      type: Object,
      default: () => ({}),
    },
    propF: {
      validator(value) {
        return ['success', 'warning', 'danger'].includes(value)
      },
    },
    propG: {
      type: Function,
      default: () => {},
    },
  },

  // 错误示例 ❌
  props: ['propA', 'propB', '...'],

  props: {
    'greeting-text': String,
  },
}
</script>
```

### 6.18 Emit 定义

**规则：** 定义所有发出的事件，使用 camel-case 命名。

**示例：**

```vue
<script>
export default {
  // 正确示例 ✅
  emits: [
    'update-odel',
    'search-focus',
    // 带验证的事件
    'submit-form',
  ],

  methods: {
    submit() {
      this.$emit('submit-form', this.formData)
    },
  },

  // 错误示例 ❌
  emits: [
    'updateModel',
    'searchFocus',
    // 带验证的事件
    'submitForm',
  ],

  methods: {
    submit() {
      this.$emit('submit-form', this.formData)
    },
  },
}
</script>
```

### 6.19 计算属性

**规则：** 计算属性应该只做计算而没有任何副作用，避免直接修改计算属性值。

**示例：**

```vue
<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
    }
  },

  computed: {
    // 正确示例 ✅
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },

    // 错误示例 ❌
    badComputed() {
      this.apiCall() // 副作用!
      return this.firstName
    },
  },

  methods: {
    updateName() {
      // 正确示例 ✅
      this.firstName = 'Jane'

      // 错误示例 ❌
      this.fullName = 'Jane Smith'
    },
  },
}
</script>
```

### 6.20 避免重复键值

**规则：** 不允许重复的键值。

**示例：**

```vue
<script>
// 错误示例 ❌
export default {
  props: {
    foo: String,
    foo: Number, // 重复的键
  },
}
</script>
```

### 6.21 作用域样式

**规则：** 对于应用来说，顶级 App 组件和布局组件中的样式可以是全局的，但是其它所有组件都应该是有作用域的。

**示例：**

```vue
<template>
  <button class="btn btn-primary">Submit</button>
</template>

<!-- 正确示例 ✅ -->
<style scoped>
.btn {
  border: none;
  border-radius: 4px;
}

.btn-primary {
  background-color: blue;
  color: white;
}
</style>

<!-- 错误示例 ❌ -->
<style>
/* 全局样式可能影响其他组件 */
.btn {
  border: none;
}
</style>
```

### 6.22 Setup 语法糖

**规则：** 使用 `<script setup>` 语法糖提高代码简洁性。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: String,
})

const emit = defineEmits(['update-message'])

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<!-- 错误示例 ❌ -->
<script>
export default {
  props: {
    message: String,
  },
  emits: ['update-message'],
  setup(props, { emit }) {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return {
      count,
      doubled,
      increment,
    }
  },
}
</script>
```

### 6.23 Setup 函数

**规则：** 组合式函数应该以 "use" 开头，返回响应式数据和方法。

**示例：**

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    doubled,
    increment,
    decrement,
    reset,
  }
}
```

### 6.23 Setup Store

**规则：**与 Vue 组合式 API 的 setup 函数 相似，Pinia store 应该以 "use" 开头，返回响应式数据和方法。

**示例：**

```javascript
<!-- 正确示例 ✅ -->
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment }
})

<!-- 错误示例 ❌ -->
export const useCounterStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
  },
})
```

## 7. Git 协作规范

### 7.1 全局配置

**规则：** 所有开发人员必须正确配置全局用户信息。

**示例：**

```bash
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"
```

### 7.2 分支类型与用途

**规则：** 按功能划分明确的分支类型。

**示例：**

| 分支类型    | 前缀             | 用途说明           | 生命周期 |
| ----------- | ---------------- | ------------------ | -------- |
| 主分支      | master/ 或 main/ | 记录上线版本的迭代 | 长期     |
| 开发分支    | develop/         | 记录相对稳定的版本 | 长期     |
| 功能分支    | feature/         | 新功能开发         | 短期     |
| 修复分支    | fix/             | 问题修复           | 短期     |
| 发布分支    | release/         | 版本发布准备       | 中期     |
| 热修复分支  | hotfix/          | 生产环境紧急修复   | 短期     |
| Bug修复分支 | bugfix/          | 测试环境问题修复   | 短期     |
| 实验分支    | experiment/      | 技术实验和探索     | 可变     |

### 7.3 分支命名约定

**规则：** 使用统一的命名前缀和短横线命名法(kebab-case)。

**示例：**

```bash
# 正确示例 ✅
git branch feature/user-authentication
git branch fix/login-validation-issue
git branch release/v2.3.0
git branch hotfix/critical-security-patch
git branch bugfix/issue-123

# 错误示例 ❌
git branch UserAuthentication
git branch fix_login_validation_issue
git branch release230
```

### 7.4 提交类型规范

**规则：** 使用标准化的提交类型。

**示例：**

```bash
# 主要类型
feat:     新增功能（对应MINOR版本）
fix:      修复bug（对应PATCH版本）
perf:     性能优化（对应PATCH版本）
docs:     文档更新
style:    代码格式调整（不影响功能）
refactor: 代码重构（对应PATCH版本）
test:     测试相关
chore:    构建过程或辅助工具变动

# 扩展类型
ci:       持续集成配置
build:    构建系统或外部依赖调整
revert:   回滚提交
```

### 7.5 提交消息格式

**规则：** 遵循约定式提交规范，保持提交的原子性和一致性。

**示例：**

```bash
# 格式
<type>(<scope>): <subject>

<body>

<footer>

# 正确示例 ✅
git commit -m "feat(api): add user search endpoint"          # 添加新端点
git commit -m "test(api): add user search tests"             # 添加对应测试
git commit -m "docs(api): update user search documentation"  # 更新文档

# 完整
git commit -m "feat(auth): add OAuth2 integration

- implement Google OAuth2 provider
- add token refresh mechanism
- update authentication middleware

Closes #123"
BREAKING CHANGE: authentication API endpoints changed"

# 错误示例 ❌
git commit -m "update"
git commit -m "fix: various things"  # 包含多个不相关的修复
```
