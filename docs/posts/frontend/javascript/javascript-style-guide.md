---
title: JavaScript 代码风格指南
date: 2025-10-01
categories: [前端]
tags: [前端, JavaScript, 代码规范]
---

# JavaScript 代码风格指南

## 目录

- [1. 前言](#_1-前言)
- [2. 基本格式规范](#_2-基本格式规范)
- [3. 注释规范](#_3-注释规范)
- [4. 变量与常量](#_4-变量与常量)
- [5. 对象](#_5-对象)
- [6. 数组](#_6-数组)
- [7. 字符串](#_7-字符串)
- [8. 函数](#_8-函数)
- [9. 类和构造函数](#_9-类和构造函数)
- [10. 模块](#_10-模块)
- [11. 异步处理](#_11-异步处理)
- [12. 比较操作符](#_12-比较操作符)

## 1. 前言

### 1.1 文档目的

本规范基于业界最佳实践（Google、MDN、Airbnb等）和现代JavaScript技术趋势制定，旨在提高JavaScript代码质量，为大型企业级前端项目提供统一的编码标准。确保代码的一致性、可维护性、可读性、性能性和团队协作效率。

### 1.2 适用范围

适用于所有新开发的Web项目及现有项目的重构工作。所有前端开发人员必须遵守本规范。

### 1.3 原则说明

- **可读性**：代码应清晰易懂，便于团队协作和维护。
- **一致性**：统一代码风格，减少认知负担。
- **现代性**：合理使用现代JavaScript特性（ES6+）。
- **性能**：编写高效代码，避免常见性能陷阱。
- **可维护性**：代码应易于修改和扩展。

## 2. 基本格式规范

### 2.1 缩进

**规则：** 使用2个空格进行缩进，禁止使用Tab制表符。
**示例：**

```javascript
// 正确示例 ✅
function example() {
∙∙console.log('hello')
}

// 错误示例 ❌
function example() {
∙console.log('hello')
}

function example() {
∙∙∙∙console.log('hello') // 4个空格或Tab
}
```

### 2.2 行宽

**规则：** 每行代码不应超过100个字符，过长时应合理断行。
**示例：**

```javascript
// 正确示例 ✅
const result = calculateTotal(
  basePrice,
  taxRate,
  discountAmount,
  shippingCost,
  otherParams
)

const foo = jsonData
  && jsonData.foo
  && jsonData.foo.bar
  && jsonData.foo.bar.baz
  && jsonData.foo.bar.baz.quux
  && jsonData.foo.bar.baz.quux.xyzzy

const longVariableName = someVeryLongFunctionName() +
  anotherLongFunctionName() -
  yetAnotherFunction()

// 错误示例 ❌
const result = calculateTotal(basePrice, taxRate, discountAmount, shippingCost, otherParams)

const foo = jsonData && jsonData.foo && jsonData.foo.bar && jsonData.foo.bar.baz && jsonData.foo.bar.baz.quux && jsonData.foo.bar.baz.quux.xyzzy

const longVariableName = someVeryLongFunctionName() + anotherLongFunctionName() - yetAnotherFunction()
```

### 2.3 分号

**规则：** 每个语句结束时不使用分号。
**示例：**

```javascript
// 正确示例 ✅
const name = 'John'

// 错误示例 ❌
const name = 'John';
```

### 2.4 引号

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

### 2.5 空行

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

### 2.6 空格

**规则：** 在操作符、关键字后添加空格，提高可读性。
**示例：**

```javascript
// 正确示例 ✅
const sum = a + b
const foo = { clark: 'kent' }
function foo() { return true }

// 错误示例 ❌
const sum=a+b
const foo = {clark:'kent'}
function foo() {return true}
```

### 2.7 大括号

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

## 3. 注释规范

### 3.1 单行注释

**规则：** 使用`//`进行单行注释，注释应放在代码上方并保持同级缩进。
**示例：**

```javascript
// 正确示例 ✅
function calculate() {
  // 这里执行计算
  return 42
}

// 错误示例 ❌
function calculate() {
  // 这里执行计算
  return 42
}
```

### 3.2 多行注释

**规则：** 使用`/* */`进行多行注释，注释内容应格式化，每行以`*`开头并后跟一个空格。
**示例：**

```javascript
// 正确示例 ✅
/*
 * 这是一个多行注释
 * 用于描述复杂逻辑
 */

// 错误示例 ❌
/* 这是一个多行注释
   没有使用标准格式 */
```

### 3.3 文档注释

> 全局通用函数必须，组件内可选

**规则：** 使用`/** */`进行文档注释，描述函数、参数、返回值等，遵循JSDoc规范。
**示例：**

```javascript
// 正确示例 ✅
/**
 * 添加元素到数组
 * @param {number} item - 要添加的元素
 * @return {boolean} - 添加成功与否
 */
function add(item) {
  // ...
}

// 错误示例 ❌
// 添加元素到数组
function add(item) {
  // ...
}
```

## 4. 变量与常量

### 4.1 变量和函数命名

**规则：**

1. 使用camelCase命名法，首字母小写，后续单词首字母大写。
2. 避免用一个字母命名，让你的命名有意义
3. 如果属性值/方法返回值是 `boolean`， 用 `isVal()` 或 `hasVal()`

**示例：**

```javascript
// 正确示例 ✅
const firstName = 'John'
function getUserName() {}

function query() {
  // ...
}

if (!dragon.hasAge()) {
  return false
}

// 错误示例 ❌
const first_name = 'John'
function get_user_name() {}

function q() {
  // ...
}

if (!dragon.age()) {
  return false
}
```

### 4.2 常量命名

**规则：** 常量使用UPPER_CASE命名法，全大写，单词间用下划线分隔。
**示例：**

```javascript
// 正确示例 ✅
const MAX_COUNT = 90

export const MAPPING = {
  key: 'value',
}

// 错误示例 ❌
const maxCount = 90

export const MAPPING = {
  KEY: 'value',
}
```

### 4.3 类命名

**规则：** 使用PascalCase命名法，每个单词首字母大写。
**示例：**

```javascript
// 正确示例 ✅
class UserProfile {}

// 错误示例 ❌
class userProfile {}
```

### 4.4 作用域/私有变量命名（可选）

**规则：** 使用下划线_开头拼接camelCase命名法。 
**示例：**

```javascript
// 正确示例 ✅
function demo() {
  const _testVar = null
}

// 错误示例 ❌
function demo() {
  const testVar = null
}
```

### 4.5 this 赋值

**规则：** 不要保存引用 `this`，用箭头函数或函数绑定。
**示例：**

```javascript
// 正确示例 ✅
function foo() {
  return () => {
    console.log(this)
  }
}

// 错误示例 ❌
function foo() {
  const self = this
  return function () {
    console.log(self)
  }
}

function foo() {
  const that = this
  return function () {
    console.log(that)
  }
}
```

### 4.6 变量类型

**规则：** 优先使用`const`声明常量，可变变量使用`let`，避免使用`var`。
**示例：**

```javascript
// 正确示例 ✅
const name = 'John'
let age = 30

// 错误示例 ❌
var name = 'John'
```

### 4.7 声明初始化

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

### 4.8 链式声明

**规则：** 不要使用链式声明变量。

**示例：**

```javascript
// 正确示例
let a = 1
let b = a
let c = a

// 错误示例
let a = b = c = 1
```

### 4.9 一元自增自减运算符

**规则：** 不要使用一元自增自减运算符（`++`， `--`）。

**示例：**

```javascript
let num = 1

// 正确示例
num += 1
num -= 1

// 错误示例
num++
--num
```

## 5. 对象

### 5.1 对象创建

**规则：** 使用对象字面量`{}`创建对象，而非`new Object()`。
**示例：**

```javascript
// 正确示例 ✅
const obj = {
  key: 'value',
}

// 错误示例 ❌
const obj = new Object()
obj.key = 'value'
```

### 5.2 属性命名

**规则：** 对象属性名使用camelCase，除非是字符串字面量。
**示例：**

```javascript
// 正确示例 ✅
const obj = {
  firstName: 'John',
  'last-name': 'Doe', // 特殊情况
}

// 错误示例 ❌
const obj = {
  first_name: 'John',
}
```

### 5.3 属性值简写

**规则：** 对象属性使用简写形式。
**示例：**

```javascript
const firstName = 'John'

// 正确示例 ✅
const obj = {
  firstName,
}

// 错误示例 ❌
const obj = {
  first_name: firstName,
}
```

### 5.4 方法简写

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

### 5.5 简写靠前

**规则：** 将所有简写放在对象声明的前面。
**示例：**

```javascript
const firstName = 'John'

// 正确示例 ✅
const obj = {
  firstName,
  lastName: 'Cena',
  age: 18,
}

// 错误示例 ❌
const obj = {
  age: 18,
  firstName,
  lastName: 'Cena',
}
```

### 5.6 对象遍历

**规则：** 禁止使用 `for...in` 循环来遍历对象。
**示例：**

```javascript
// 正确示例 ✅
const person = {
  name: 'Alice',
  age: 25,
}

Object.keys(person).forEach(key => {
  console.log(`${key}: ${person[key]}`)
})

for (const [key, value] of Object.entries(person)) {
  console.log(`${key}: ${value}`)
}

// 错误示例 ❌
for (let key in person) {
  console.log(key, person[key])
}
```

## 6. 数组

### 6.1 数组创建

**规则** 使用数组字面量`[]`创建数组，而非`new Array()`。
**示例：**

```javascript
// 正确示例 ✅
const arr = [1, 2, 3]

// 错误示例 ❌
const arr = new Array(1, 2, 3)
```

### 6.2 数组方法

**规则：** 使用现代数组方法如`map`, `filter`, `reduce`等，避免使用传统循环。
**示例：**

```javascript
// 正确示例 ✅
const doubled = arr.map(item => item * 2)

// 错误示例 ❌
const doubled = []
for (let i = 0; i < arr.length; i++) {
  doubled.push(arr[i] * 2)
}
```

### 6.3 解构赋值

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

### 6.4 展开运算符

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

## 7. 字符串

### 7.1 字符串引号

**规则：** 字符串使用单引号，动态内容使用模板字符串。
**示例：**

```javascript
// 正确示例 ✅
const name = 'John'
const greeting = `Hello ${name}`

// 错误示例 ❌
const name = "John"
const greeting = 'Hello ' + name
```

### 7.2 模板字符串

**规则：** 模板字符串用于多行字符串和插值。
**示例：**

```javascript
// 正确示例 ✅
const multiLine = `This is a
multi-line string`

// 错误示例 ❌
const multiLine = 'This is a\nmulti-line string'
```

## 8. 函数

### 8.1 函数定义

**规则：** 优先使用函数表达式或箭头函数；避免在块内使用函数声明。
**示例：**

```javascript
// 正确示例 ✅
const greetArrow = () => {
  console.log('Hello')
}

let test
if (currentUser) {
  test = () => {
    console.log('Yup.')
  }
}

// 错误示例 ❌
if (currentUser) {
  function test() {
    console.log('Nope.')
  }
}
```

### 8.2 箭头函数

**规则：** 箭头函数用于匿名函数和回调，以保持`this`上下文。
**示例：**

```javascript
// 正确示例 ✅
const arr = [1, 2, 3]
arr.map(item => item * 2)

// 错误示例 ❌
const arr = [1, 2, 3]
arr.map(function(item) { return item * 2 })
```

### 8.3 参数处理

**规则：** 使用默认参数，避免使用`arguments`对象，使用rest参数语法 `...` 代替。
**示例：**

```javascript
// 正确示例 ✅
function greet(name = 'Guest') {
  console.log(`Hello ${name}`)
}

function concatenateAll(...args) {
  return args.join('')
}

// 错误示例 ❌
function greet(name) {
  name = name || 'Guest'
  console.log('Hello ' + name)
}

function concatenateAll() {
  const args = Array.prototype.slice.call(arguments)
  return args.join('')
}
```

## 9. 类和构造函数

### 9.1 类定义

**规则：** 使用`class`语法定义类，而非构造函数，避免直接操作 `prototype`。
**示例：**

```javascript
// 正确示例 ✅
class Person {
  constructor(name) {
    this.name = name
  }

  test() {
    // ...
  }
}

// 错误示例 ❌
function Person(name) {
  this.name = name
}
Person.prototype.test = function () {
  // ...
}
```

### 9.2 继承

**规则：** 使用`extends`实现继承，子类构造函数中调用`super()`。
**示例：**

```javascript
// 正确示例 ✅
class Employee extends Person {
  constructor(name, title) {
    super(name)
    this.title = title
  }
}

// 错误示例 ❌
function Employee(name, title) {
  Person.call(this, name)
  this.title = title
}
Employee.prototype = Object.create(Person.prototype)
```

## 10. 模块

### 10.1 ES 模块

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

### 10.2 导入顺序

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

### 10.3 导入提前

**规则：** 把 `import` 放在其他所有语句之前。
**示例：**

```javascript
// 正确示例 ✅
import foo from 'foo'
import bar from 'bar'

foo.init()

// 错误示例 ❌
import foo from 'foo'
foo.init()

import bar from 'bar'
```

### 10.4 单一导入

**规则：** 一个路径只 `import` 一次。
**示例：**

```javascript
// 正确示例 ✅
import foo, { named1, named2 } from 'foo'

// 错误示例 ❌
import foo from 'foo'
import { named1, named2 } from 'foo'
```

### 10.5 常量导出

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

## 11. 异步处理

### 11.1 Promise

**规则：** 使用Promise处理异步操作，避免回调地狱。
**示例：**

```javascript
// 正确示例 ✅
function fetchData() {
  return fetch('url')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

// 错误示例 ❌
function fetchData(callback) {
  fetch('url', (error, data) => {
    if (error) {
      callback(error)
    } else {
      callback(null, data)
    }
  })
}
```

### 11.2 async/await

**规则：** 优先使用`async/await`处理异步操作。
**示例：**

```javascript
// 正确示例 ✅
async function fetchData() {
  try {
    const response = await fetch('url')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

// 错误示例 ❌
function fetchData() {
  fetch('url')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}
```

## 12. 比较操作符

### 12.1 相等比较

**规则：** 使用严格相等`===`和`!==`，避免使用`==`和`!=`。
**示例：**

```javascript
// 正确示例 ✅
if (value === 9) {}

// 错误示例 ❌
if (value == 9) {}
```

### 12.2 显式比较

**规则：** 布尔值要用缩写，而字符串和数字要明确使用比较操作符，避免隐式转换。
**示例：**

```javascript
// 正确示例 ✅
if (isValid) {
  // ...
}

if (name !== '') {
  // ...
}

if (collection.length > 0) {
  // ...
}

// 错误示例 ❌
if (isValid === true) {
  // ...
}

if (name) {
  // ...
}

if (collection.length) {
  // ...
}
```

### 12.3 类型转换

**规则：** 使用显式类型转换（如`Number()`, `String()`, `Boolean()`），避免隐式转换或包装类型。
**示例：**

```javascript
// 正确示例 ✅
const num = Number('113')
const str = String(113)
const hasAge = Boolean(age)
const hasAgeFromCoercion = !!age

// 错误示例 ❌
const num = +'113'
const str = 113 + ''
const totalScore = new String(this.reviewScore)
const totalScore = this.reviewScore.toString()
const hasAge = new Boolean(age)
```

### 12.4 三元表达式

**规则：**

1.  三元表达式不应该嵌套，通常是单行表达式。
2.  避免不必要的三元表达式。

**示例：**

```javascript
// 正确示例 ✅
const maybeNull = value1 > value2 ? 'baz' : null
const fallback = maybe1 > maybe2 ? 'bar' : maybeNull

const selected = a || b
const bar = !!c
const baz = !c
const quux = a ?? b

// 错误示例 ❌
const nestedFoo = maybe1 > maybe2 ? 'bar' : value1 > value2 ? 'baz' : null

const selectedValue = a ? a : b
const bar = c ? true : false
const baz = c ? false : true
const quux = a != null ? a : b
```

### 12.5 圆括号

**规则：** 用圆括号来组合多种操作符。
**示例：**

```javascript
// 正确示例 ✅
const foo = (a && b < 0) || c > 0 || (d + 1 === 0)
const bar = (a ** b) - (5 % d)
if (a || (b && c)) {
  return d
}
const bar = a + (b / c) * d

// 错误示例 ❌
const foo = a && b < 0 || c > 0 || d + 1 === 0
const bar = a ** b - 5 % d
if (a || b && c) {
  return d
}
const bar = a + b / c * d
```

### 12.6 标准库

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

---
