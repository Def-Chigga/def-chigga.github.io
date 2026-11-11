---
title: JavaScript零基础入门学习手册
date: 2026-11-11
categories: [前端]
tags: [JavaScript]
---

# JavaScript零基础入门学习手册

## 前言

这本手册从“代码保存在哪里、谁来运行、结果为什么不同”开始。你不需要先会Java、Python、HTML或命令行。先用能观察的小程序建立数据与执行过程的直觉，再把函数、对象、模块、异步、网页、文件和测试接成完整工具。Java与Python对照放在JavaScript概念之后，可以跳过，不要求同时背三套语法。

学完主线，你应能独立准备环境、保存并运行源码、解释转换与共享关系、组织多文件程序、处理异步失败、制作可交互页面，并完成一个能重启恢复数据、拒绝非法文件且带自动化测试的学习任务管理器。进阶和选修用于回读，不以一次掌握所有机制作为继续实践的门槛。

**准备清单。** 一台可运行目标Node版本的电脑、UTF-8编辑器、终端和稳定版浏览器。Windows主要用PowerShell；有平台差异时给出macOS/Linux写法。浏览器页面从本机HTTP打开，第24章在首次浏览器模块之前提供不依赖第三方包的静态服务完整源码，按说明保存后即可使用。安装工具与依赖需要联网，主要语言和本机项目练习不依赖公共在线接口。

**版本约定。** 语言以已发布ECMAScript 2026、ECMA-262第17版为基线，Node.js主目标为26.13.0 LTS。Node、V8、npm、浏览器和语言年度分别记录。最新运行时不代表实现全部年度API，示例会标明能力条件；`Math.sumPrecise`等缺失时展示检测分支，不把不同语义的替代品冒充原功能。第42—43章区分首次年度、后续可用、提案阶段和宿主实现；Temporal与显式资源管理为独立后续标准选修。

**环境准备与多版本管理。** 第2章先讲从官网下载、安装和验证Node.js，运行第一个程序并学习基本排错；随后介绍向版本管理器迁移，以及nvm-windows、nvm-sh与fnm的安装、默认版本、项目版本、路径来源和切换；旧版行为单列说明。第38章和第48章联系项目依赖与版本约定。.nvmrc和engines表达期望，不自动证明当前进程已经切换。执行程序前用`node --version`、`npm --version`和命令来源确认实际环境。

**阅读路线。** 第1—14章建立运行、数据、控制流、函数与容器基础；第15—24章解释作用域、对象、常用内置对象和模块；第25章完成内存项目；第26—29章建立异步机制；第30—33章学习网页、DOM、事件和浏览器存储；第34—39章学习Node、HTTP、工具与测试；第40章完成浏览器本地版；第41—44章处理安全、版本与选修；第45章完成浏览器与Node协作项目；第46—48章用于对照、练习和复习。

闭包细节、描述符、弱引用、迭代器、共享内存、元编程和算法可先了解后回读。HTML/CSS只补足教学页面所需基础，框架、数据库、账号与公网部署放在后续路线。主线不要求安装Vue或React。

**示例约定。** C08E02表示第8章第2个示例，各例放在独立目录，同名`demo.mjs`不会互相覆盖。javascript、html、css等围栏是源码，powershell/bash是终端命令，text是输出或示意。终端提示符不属于源码。每例交代文件、运行环境、命令或页面操作、输入和预期结果；有复用时明确指出此前目录。完整项目按项目目录共同运行，不能把其中某个模块当作独立页面双击。

正文给齐必要源码，示例编号与文件名用于定位。默认短例无需键盘输入；需要终端输入、页面操作、文件或网络时在例子旁另行说明。解释片段会标明放入位置，故意错误会说明预期失败与修复方法。建议在本机建立`js-study`学习根目录，按每个示例给出的相对目录和文件名保存代码；完整项目要先把本章列出的必要文件保存齐，再运行入口。先在自己的学习目录练习；涉及文件操作的例子使用明确的测试路径或临时目录。故意失败的示例明确标识或捕获预期错误，不把异常演示当作正常业务实现。

**结果与练习。** 先预测，再运行，再只改一个条件，最后解释差异。固定文本可逐行核对；路径、时间、随机值、端口、浏览器差异和测试耗时会变化。没有标准输出不等于没有执行。练习提供参考答案或明确检查方法；速查表标出返回值、修改行为与边界。不要以“控制台显示已保存”代替检查真实持久化。

贯穿案例依次成长为单条任务、内存任务表、模块化核心、浏览器本地版、Node文件练习和本机HTTP综合版。版本条件和可变结果在相应示例旁说明，正文可独立用于学习与查阅。

**怎样选择阅读深度。** 【主线】是继续实践需要的内容；【进阶】可在最小项目运行后回读；【选修】不作为主线验收前提。未标记的基础语法、模块、异常和普通异步内容按主线学习。第2章先完成官网安装与第一个程序，nvm与fnm按需二选一；第46章语言对照可以整体跳过。

**贯穿案例怎样成长。** 同一条任务始终保留身份、标题、分钟、标签、完成状态和创建时间。普通小例只演示部分字段时，会说明局部前提；第25、40、45章采用同一完整契约。

| 阶段              | 输入与状态       | 新增能力                       | 离开阶段前应证明                             |
| :---------------- | :--------------- | :----------------------------- | :------------------------------------------- |
| 第1—14章          | 源码中的小数据   | 转换、控制流、函数与统计       | 能解释结果，能拒绝不合约定的输入             |
| 第15—25章         | 模块化内存任务表 | 独立规则、错误边界、稳定ID     | 删除不复用ID，非法操作不改变旧状态           |
| 第26—29章         | 稍后完成的结果   | 等待、组合、取消和防旧结果覆盖 | 能说明何时启动、何时恢复以及失败由谁接管     |
| 第30—33章与第40章 | 表单与浏览器存储 | 页面交互、导入导出、恢复       | 同来源刷新与重启后恢复，坏数据不被清空       |
| 第34—39章与第45章 | HTTP与文件快照   | 保存队列、接口、命令行和测试   | 保存失败保留旧状态，正常与主要失败路径可检查 |

完成第33章后可以先做第40章，再回到第34—39章补Node与工程能力。第42—44章按需要回读，第45章综合项目不依赖其选修内容。各阶段的具体任务和检查方法放在相应章节末，第48章提供验收入口汇总。

## 目录

1. [第1章 从零认识程序、JavaScript与学习方法](#第1章-从零认识程序javascript与学习方法)
2. [第2章 准备环境与运行第一个程序](#第2章-准备环境与运行第一个程序)
3. [第3章 读懂代码、执行顺序与错误信息](#第3章-读懂代码执行顺序与错误信息)
4. [第4章 变量、值与数据类型](#第4章-变量值与数据类型)
5. [第5章 类型转换、相等与逻辑判断](#第5章-类型转换相等与逻辑判断)
6. [第6章 数值、精度与数学工具](#第6章-数值精度与数学工具)
7. [第7章 字符串、Unicode与文本处理](#第7章-字符串unicode与文本处理)
8. [第8章 条件判断与输入规则](#第8章-条件判断与输入规则)
9. [第9章 循环与分步解决问题](#第9章-循环与分步解决问题)
10. [第10章 函数、参数与返回值](#第10章-函数参数与返回值)
11. [第11章 数组与有序数据](#第11章-数组与有序数据)
12. [第12章 对象、属性与结构化记录](#第12章-对象属性与结构化记录)
13. [第13章 解构、展开与复制边界](#第13章-解构展开与复制边界)
14. [第14章 回调、高阶函数与数据统计](#第14章-回调高阶函数与数据统计)
15. [第15章 作用域、提升与闭包](#第15章-作用域提升与闭包)
16. [第16章 this、调用方式与函数绑定](#第16章-this调用方式与函数绑定)
17. [第17章 原型、class与对象组织](#第17章-原型class与对象组织)
18. [第18章 Map、Set、Symbol与弱引用](#第18章-mapsetsymbol与弱引用)
19. [第19章 异常、错误边界与资源清理](#第19章-异常错误边界与资源清理)
20. [第20章 JSON、数据交换与边界校验](#第20章-json数据交换与边界校验)
21. [第21章 日期、时间与国际化](#第21章-日期时间与国际化)
22. [第22章 正则表达式与文本校验](#第22章-正则表达式与文本校验)
23. [第23章 迭代协议、生成器与惰性处理](#第23章-迭代协议生成器与惰性处理)
24. [第24章 模块、多文件与程序组织](#第24章-模块多文件与程序组织)
25. [第25章 阶段项目：模块化的内存任务管理器](#第25章-阶段项目模块化的内存任务管理器)
26. [第26章 同步、异步、回调与定时器](#第26章-同步异步回调与定时器)
27. [第27章 Promise与异步结果组合](#第27章-promise与异步结果组合)
28. [第28章 async/await、异步迭代与取消](#第28章-asyncawait异步迭代与取消)
29. [第29章 调用栈、任务、微任务与事件循环](#第29章-调用栈任务微任务与事件循环)
30. [第30章 浏览器前置：HTML、CSS与页面加载](#第30章-浏览器前置htmlcss与页面加载)
31. [第31章 DOM与页面内容更新](#第31章-dom与页面内容更新)
32. [第32章 事件、表单与用户交互](#第32章-事件表单与用户交互)
33. [第33章 浏览器存储、文件与页面状态](#第33章-浏览器存储文件与页面状态)
34. [第34章 Node.js、命令行与进程基础](#第34章-nodejs命令行与进程基础)
35. [第35章 文件、路径、二进制与流](#第35章-文件路径二进制与流)
36. [第36章 使用Node.js建立本机HTTP服务](#第36章-使用nodejs建立本机http服务)
37. [第37章 HTTP、Fetch与网络错误](#第37章-httpfetch与网络错误)
38. [第38章 npm、依赖与工程工具](#第38章-npm依赖与工程工具)
39. [第39章 调试、自动化测试与行为验证](#第39章-调试自动化测试与行为验证)
40. [第40章 阶段项目：可保存数据的浏览器任务管理器](#第40章-阶段项目可保存数据的浏览器任务管理器)
41. [第41章 安全、性能与故障排查](#第41章-安全性能与故障排查)
42. [第42章 ES5至ES2023：现代JavaScript怎样形成](#第42章-es5至es2023现代javascript怎样形成)
43. [第43章 ES2024至ES2026、提案状态与升级](#第43章-es2024至es2026提案状态与升级)
44. [第44章 元编程、Worker与后续标准导读](#第44章-元编程worker与后续标准导读)
45. [第45章 综合项目：浏览器与Node.js协作的学习任务管理器](#第45章-综合项目浏览器与nodejs协作的学习任务管理器)
46. [第46章 JavaScript与Java、Python系统对照](#第46章-javascript与javapython系统对照)
47. [第47章 分层练习、典型案例与参考答案](#第47章-分层练习典型案例与参考答案)
48. [第48章 速查、阶段验收与官方资料](#第48章-速查阶段验收与官方资料)

---

## 第1章 从零认识程序、JavaScript与学习方法

本章先建立一张能解释后续代码的地图：程序处理什么，代码保存在哪里，谁来运行它。你不需要先会Java、Python或网页制作。先观察输出即可；安装与保存操作在第2章完成。

### 1.1 程序怎样处理问题

程序是一组按明确规则处理数据的指令。输入是交给程序的数据，处理是对数据执行的步骤，输出是交回的结果。人能猜测“帮我记一下”的意思，程序则需要标题能否为空、空白是否去掉、保存到哪里等规则。先用一项学习任务观察这条链路。

示例 **C01E01**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch01/C01E01/`。

```javascript
console.log('输入：学习JavaScript')
console.log('处理：记录一项学习任务')
console.log('输出：任务已添加')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
输入：学习JavaScript
处理：记录一项学习任务
输出：任务已添加
```

`console.log`把括号中的值显示到终端并换行。引号标记文本边界，不属于输出内容。现在三行显示的是对过程的说明；它没有真的把任务写进文件。不要把“显示已保存”误当作已经完成保存。

示例 **C01E02**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch01/C01E02/`。

```javascript
// 同一段规则可以处理不同数据。
console.log('学习时长（分钟）：', 20 + 10)
console.log('已完成任务数：', 1 + 1)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
学习时长（分钟）： 30
已完成任务数： 2
```

括号中的加法先得到数值，再交给`console.log`。逗号分开两个参数，控制台把它们显示在同一行。规则和数据分开之后，才有机会复用处理步骤。

### 1.2 JavaScript、ECMAScript与Java

JavaScript是本书学习的语言。ECMAScript是描述这类语言核心语法与语义的标准名称，由ECMA-262规范定义。Java是另一门语言；名称相似不代表语法、对象模型或运行工具相同。ES2015是年度标准名称，也常称ES6；ES2026是本书的年度基线。

示例 **C01E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch01/C01E03/`。

```javascript
console.log('JavaScript源码文件通常使用.js或.mjs')
console.log('Java源码通常使用.java；工具和规则不同')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
JavaScript源码文件通常使用.js或.mjs
Java源码通常使用.java；工具和规则不同
```

本例刻意只输出文本：名称是知识说明，不是一个能自动识别所有语言的程序。后面Java/Python对照都在JavaScript概念之后出现，你可以完全跳过这些对照。

### 1.3 谁负责运行代码

引擎负责实现语言规则，例如V8。宿主环境是承载代码并提供额外能力的环境：浏览器提供页面、事件和网络接口；Node.js提供进程、文件与服务端接口。编辑器保存源码；终端接收系统命令；操作系统管理进程和文件。API即应用程序编程接口，这里指可以调用的功能入口。

示例 **C01E04**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch01/C01E04/`。

```javascript
console.log('console能力：', typeof console.log)
console.log('当前是否有document：', typeof document !== 'undefined')
console.log('当前是否有process：', typeof process !== 'undefined')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
console能力： function
当前是否有document： false
当前是否有process： true
```

在Node.js里没有页面document；浏览器控制台运行时结果可能不同。typeof在这里用于检查名字对应值的类别，第4章详细解释。console、document和process都是宿主相关接口，不能仅凭同是JavaScript就假定到处存在。

```text
编辑器保存demo.mjs → 终端执行node demo.mjs → Node.js启动引擎 → 执行代码
浏览器取得HTML与模块 → 浏览器引擎执行代码 → 通过浏览器API操作页面
```

这张图描述开发入口，并不表示引擎只能逐行解释。引擎可以解析、优化和编译代码；零基础阶段先分清运行入口。

### 1.4 内存与文件为什么不同

运行中的程序把许多值放在内存中。进程是操作系统正在执行的一次程序；本次运行结束，普通内存状态不会自动成为下一次运行的数据。持久化表示把需要保留的数据明确写入文件、数据库或浏览器存储。

示例 **C01E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch01/C01E05/`。

```javascript
let completed = 0
completed = completed + 1
console.log('本次完成：', completed)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
本次完成： 1
```

每次重新运行本文件，第一行都会重新把completed初始化为0，所以总输出1。运行两次不会变成2。let声明变量，=把右侧结果交给左侧名字；第4章展开。这是“重新开始一次运行”，不是在原运行中再执行一次最后两行。

### 1.5 怎样使用本书

建议按“预测—运行—只改一个条件—解释差异”的顺序学习。主线先学语言，再学模块、异步、浏览器与Node，最后做能保存数据的任务管理器。进阶节可回读。javascript围栏是源码，powershell/bash是终端命令，text是输出或图示；不要把它们混在一个文件里。

示例 **C01E06**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch01/C01E06/`。

```javascript
console.log('预测：2 + 3等于多少？')
console.log(2 + 3)
console.log('修改练习：只把上一行的3改成8')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
预测：2 + 3等于多少？
5
修改练习：只把上一行的3改成8
```

示例编号C01E06表示第1章第6个示例；同名`demo.mjs`放在各自目录。先在纸上写预期，再运行。错误记录写清输入、预期、实际和位置，而不是只写“不能运行”。

### 1.6 动手练习与参考答案

**先独立回答。**

1. 把“添加任务”写成三条明确规则。

2. 把显示“任务已保存”的代码运行一次，能证明文件存在吗？

3. 连续运行本章completed例子三次，最后一次显示几？

**参考答案与检查。**

1. 去掉标题两端空白；拒绝空标题；成功后保存并展示结果。“保存”具体到内存还是文件还需说明。

2. 不能；文字输出与文件操作是不同动作。

3. 答案为1；每次进程从初始化重新开始。

### 1.7 本章速查

| 场景         | 写法或工具           | 结果与边界                     |
| :----------- | :------------------- | :----------------------------- |
| 显示结果     | `console.log(value)` | 宿主控制台输出；不等于持久保存 |
| 运行源码     | `node demo.mjs`      | 命令在终端执行                 |
| 长期保留数据 | 文件或存储操作       | 必须明确编写和处理失败         |

## 第2章 准备环境与运行第一个程序

本章先从Node.js官网下载官方安装包，完成安装、验证和第一个程序，再介绍用nvm或fnm管理多个Node版本。第一次学习时，先完成2.1—2.7节即可继续第3章；2.8—2.12节在需要切换版本时学习。本书基线为Node.js 26.13.0 LTS。已有可用环境时先核对版本与来源，再决定是否需要调整。

### 2.1 先认识要安装的工具

JavaScript源码是写给运行环境执行的文本。Node.js让你在终端中运行JavaScript，不需要先制作网页。它包含执行JavaScript的V8引擎，并通常附带npm包管理工具；npm用于管理项目依赖，第38章再系统学习。先准备能保存UTF-8文本的代码编辑器、系统终端和稳定版浏览器。

LTS是Long Term Support，即长期支持发布线。ECMAScript的年度版本是语言标准编号，Node.js的版本是运行环境编号，两者不一一对应。为了让书中的操作可重复，本章使用确切的26.13.0；以后更新同一26.x发布线的补丁时，版本输出会随之变化。

本章的“原生安装”指直接使用Node.js官方安装包或官方预编译文件，不经过版本管理器。先完成这条单版本路线，理解node命令如何运行，再学习nvm或fnm的安装、切换和项目版本约定。版本管理器是额外的工具，不是执行第一个程序的前置条件。

### 2.2 Windows：从官网下载并安装Node.js

1. 打开[Node.js官方下载页](https://nodejs.org/en/download)，选择26.13.0 LTS、Windows以及与你的电脑相符的处理器架构，找到预编译安装包区域的Windows Installer（.msi）。网页也可能展示版本管理器命令，本节使用下载的.msi安装包。
2. 在Windows“设置 → 系统 → 系统信息／关于”中查看“系统类型”。常见Intel或AMD的64位电脑选择x64；ARM处理器电脑选择ARM64。可直接使用本书基线的官方[Windows x64安装包](https://nodejs.org/dist/v26.13.0/node-v26.13.0-x64.msi)或[Windows ARM64安装包](https://nodejs.org/dist/v26.13.0/node-v26.13.0-arm64.msi)。
3. 下载完成后双击.msi，按向导继续，阅读并接受许可，初学时保留默认安装目录。在自定义功能页保留Node.js运行时、npm和加入PATH的选项。PATH是系统查找命令的目录清单，2.7节会用它排错。
4. 如果向导出现额外原生模块构建工具的可选项，本章纯JavaScript示例不依赖它，可先跳过。点击Install；若系统弹出安装授权提示，确认来源为刚下载的官方安装包后继续。完成后点击Finish。
5. 关闭安装前已经打开的终端，再从开始菜单打开新的PowerShell。若使用编辑器内置终端，重新打开编辑器后新建终端。按2.4节验证，确认安装成功再运行代码。

.msi安装向导负责放置程序并配置命令入口；这里只需操作向导，不必自行复制node.exe或手动添加猜测的目录。下载包与机器架构不匹配、操作系统版本不受支持时，应重新核对[对应版本的支持平台](https://github.com/nodejs/node/blob/v26.13.0/BUILDING.md#supported-platforms)。安装完成后保留项目文件在自己的学习目录，不把练习源码放进Node安装目录。

### 2.3 macOS、Linux与WSL：直接安装官方发行文件

如果使用Windows原生PowerShell，跳过本节，直接进入2.4节。下面的命令使用macOS或Linux终端中的Bash兼容写法，不能原样粘贴到PowerShell。

**macOS。** 在[官方下载页](https://nodejs.org/en/download)选择本书基线与macOS，下载Installer（.pkg），也可使用固定版本的[官方.pkg安装包](https://nodejs.org/dist/v26.13.0/node-v26.13.0.pkg)。双击下载文件，按“继续 → 阅读许可并同意 → 选择安装位置 → 安装”的向导流程完成，按系统提示进行安装授权。完成后重新打开“终端”，执行2.4节的版本检查。这里不需要先安装Homebrew或nvm。Apple Silicon与Intel电脑下载独立压缩包时需分别选择arm64与x64；不要把Linux压缩包当作macOS程序。

**Linux与WSL。** WSL是Windows中的Linux环境；在WSL终端执行Linux版安装流程，与Windows侧的Node分开核对。本节将官方Linux预编译压缩包解压到当前用户目录，不修改系统包管理器管理的文件。以下命令适用于具备curl、tar和xz解压支持的常见glibc Linux环境；curl下载文件，tar解开压缩包。若提示工具不存在，先通过当前发行版的软件管理器安装缺少的工具。Alpine等musl环境应按官网提供的对应平台发行文件和支持条件选择，不能直接套用下面的glibc包。

示例 **C02E01**，文件 `install-node-linux.sh`，环境：Linux或WSL的Bash终端。建议保存到：`js-study/examples/ch02/C02E01/`。

```bash
# 先确认uname输出：常见x86_64对应x64，aarch64对应arm64。
uname -m
case "$(uname -m)" in
  x86_64) node_arch=x64 ;;
  aarch64|arm64) node_arch=arm64 ;;
  *) echo '此示例未覆盖当前架构，请在官网下载对应发行文件'; exit 1 ;;
esac
node_version=26.13.0
node_folder="node-v${node_version}-linux-${node_arch}"
node_archive="${node_folder}.tar.xz"
# 在下载目录保存压缩包，在用户目录中存放解压后的程序。
mkdir -p "$HOME/Downloads" "$HOME/.local/opt"
cd "$HOME/Downloads" || exit 1
curl -fL "https://nodejs.org/dist/v${node_version}/${node_archive}" -o "$node_archive" || exit 1
tar -xJf "$node_archive" -C "$HOME/.local/opt" || exit 1
export PATH="$HOME/.local/opt/$node_folder/bin:$PATH"
node --version
npm --version
command -v node
```

第一次执行时，可逐段粘贴到当前Bash终端；若保存为脚本并用bash `install-node-linux.sh`运行，PATH只在脚本进程内改变，脚本结束后还需配置自己的终端。`node --version`应显示v26.13.0；`command -v node`应指向用户目录下刚解压的bin/node。npm版本以安装包实际值为准。以美元符号开头的变量用于在这段Shell命令中保存文字，不是JavaScript变量。

export这一行把程序目录加入当前终端的搜索路径，关闭终端后不会自动保留。要让之后新开的终端也能找到它，用编辑器打开当前Shell实际使用的启动文件：常见交互Bash为~/.bashrc，Zsh为~/.zshrc；登录Shell还需按实际启动方式检查~/.profile或~/.bash_profile。把下面的一行加入选定文件一次，保存后新开终端验证。x64示例如下；ARM64机器把linux-x64改为linux-arm64。

```bash
export PATH="$HOME/.local/opt/node-v26.13.0-linux-x64/bin:$PATH"
```

这条路线不需要sudo。若出现缺少libatomic、GLIBC版本过低或无法执行二进制等错误，先查[本版发布说明](https://nodejs.org/en/blog/release/v26.13.0)与[支持平台](https://github.com/nodejs/node/blob/v26.13.0/BUILDING.md#supported-platforms)，按发行版安装必要运行库或使用受支持的环境。不要用重复解压、反复改PATH来处理平台不兼容。

### 2.4 验证Node.js和npm是否可用

安装结束并重新打开终端后，依次执行下面的命令。Windows使用PowerShell；macOS、Linux或WSL终端也可执行这四条命令。这些是终端命令，不是需要保存为.mjs的JavaScript源码。

示例 **C02E02**，文件 `check-environment.ps1`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E02/`。

```powershell
node --version
npm --version
node -p "process.versions.v8"
node -p "process.execPath"
```

第一行应显示v26.13.0；若你主动使用后续26.x补丁，则显示对应补丁。第二行显示npm版本，后两行分别显示V8版本和当前真正执行的Node程序路径。npm、V8和路径随实际安装而定，不照抄别人的输出。四条命令都能正常执行，并且路径属于你选择的安装，即可继续；若Windows的npm命令被脚本策略阻止，先按2.7节使用npm.cmd核对。

### 2.5 创建学习目录和.mjs文件

工作目录是终端当前所在的位置；相对路径从这里解析。先让编辑器和终端指向同一学习目录，保存`demo.mjs`，确认不是`demo.mjs.txt`。.mjs明确告诉Node按ECMAScript模块解释；第24章解释模块本身。

示例 **C02E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch02/C02E03/`。

```javascript
console.log('你好，JavaScript')
console.log('学习目录已经准备好')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
你好，JavaScript
学习目录已经准备好
```

macOS、Linux和WSL可以在自己的学习目录保存同样的`demo.mjs`，再在终端运行`node demo.mjs`。在PowerShell执行Get-Location可看当前目录，Get-ChildItem可看目录文件。按本节完整代码在自己的学习目录保存文件，进入该例目录后运行上面给出的node命令。不需要管理员权限来执行这个普通脚本。

示例 **C02E04**，文件 `create-study-folder.ps1`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E04/`。

```powershell
# 路径是学习目录示例，可按实际位置修改。
New-Item -ItemType Directory -Path "$env:USERPROFILE\js-study" -Force
Set-Location -LiteralPath "$env:USERPROFILE\js-study"
Get-Location
Get-ChildItem
# 用编辑器在这里保存demo.mjs，之后才执行下一行。
node .\demo.mjs
```

New-Item创建目录，Set-Location切换目录；命令中的环境变量指当前用户目录。不要把终端提示符PS或路径前缀一起复制。空格路径需加引号；LiteralPath避免路径字符被当通配符。文件没保存时运行会提示找不到，不应因此重新安装Node。

### 2.6 交互环境、脚本和浏览器控制台

执行node且不带文件可进入REPL，即读取—求值—输出循环。输入2 + 3会自动显示5；脚本只写2 + 3通常没有标准输出，需要`console.log`。输入.exit离开Node交互环境，再执行系统命令。浏览器按F12打开开发者工具，Console面板中执行同一纯语言表达式；浏览器可能限制首次粘贴，按界面提示了解安全规则，不要粘贴不理解的代码。

示例 **C02E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch02/C02E05/`。

```javascript
2 + 3
console.log(2 + 3)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
5
```

第一行计算但不显示；第二行明确显示5。REPL和浏览器控制台还可能显示表达式求值结果undefined，这是`console.log`调用的返回值，并非程序额外打印的文字。辨别“工具自动回显”和“代码输出”，才能核对结果。

### 2.7 第一轮排错与命令来源

PATH是操作系统搜索可执行文件的一组目录。安装成功却找不到命令，先新开终端并核对PATH，而不是反复覆盖安装。若`npm.ps1`受PowerShell执行策略阻止，可以使用随Node分发的npm.cmd；这不需要把整个系统的脚本策略放宽。

示例 **C02E06**，文件 `diagnose-windows.ps1`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E06/`。

```powershell
Get-Command node,npm,npm.cmd -All
where.exe node
where.exe npm
node -p "process.execPath"
npm.cmd --version
Get-Location
Get-ChildItem -Filter *.mjs
```

路径由你的机器决定，本节没有唯一固定输出。检查标准是：node命令能执行，真实路径属于你选择的安装；npm.cmd能显示版本；目录中存在要运行的文件。macOS、Linux和WSL用`command -v node`、`command -v npm`查看命令来源，用pwd查看当前目录，用ls查看文件；若使用2.3节的压缩包路线，还要检查启动文件是否包含正确的bin目录。

### 2.8 何时需要版本管理器，以及如何迁移原生安装

完成前面的安装和第一个程序后，已经可以继续学习基础语法。等到不同项目需要不同Node主版本，或需要比较新旧版本行为时，再引入版本管理器。它负责下载、保存和选择多个Node版本，项目源码仍由你自己保存。可选Windows原生环境的nvm-windows、macOS／Linux／WSL的nvm-sh，或跨平台的fnm。选择一条管理路线即可，不混用安装器和初始化配置；nvm的操作见2.9—2.11节，fnm见2.12节。

已经从官网安装过Node时，先记录版本、真实程序路径和全局工具清单，再迁移。下面的命令只查看信息，不会卸载Node或删除项目；在原环境仍能正常运行时执行。

示例 **C02E07**，文件 `before-nvm.txt`，环境：已完成官方Node安装的终端。建议保存到：`js-study/examples/ch02/C02E07/`。

```text
node --version
node -p "process.execPath"
npm list --global --depth=0
```

最后一条列出当前全局安装的包；刚安装的环境清单可能很短。需要保留工具清单时，复制终端结果到自己的笔记。全局安装是把命令行工具放进某个环境，项目依赖则由项目自身管理，两者在第38章展开。切换版本后，全局工具不保证自动共享；应按记录重新安装确实需要的工具。

**Windows迁移。** 关闭正在使用旧Node的开发终端和服务，按nvm-windows官方安装／迁移说明处理现有安装。若要求先移除官网.msi安装，在Windows“设置 → 应用 → 已安装的应用”中找到Node.js并通过系统卸载入口完成，再安装管理器。项目源码保存在学习目录中，不属于Node安装目录。重新打开终端后核对PATH与命令来源，避免原安装入口和管理器入口同时抢占命令。已有其他管理器时，先确认它的停用与迁移方式。

**macOS、Linux与WSL迁移。** 安装nvm-sh并加载后，确认当前终端优先找到nvm选择的Node。如果原来按2.3节手动写过固定版本PATH，迁移时从Shell启动文件中移除或注释掉那条固定版本配置，再由nvm负责选择入口。无需删除不确定归属的系统目录；macOS.pkg安装和系统包管理器安装应分别按各自来源处理。迁移完成的检查标准是版本、程序路径和终端重开后的结果都符合预期。

**选学路线。** 先完成官网安装的2.1—2.7节。需要多版本时，从下表选择一种管理器，阅读对应小节即可；不必依次安装全部工具。

| 你使用的环境          | 可选路线                 | 继续位置             |
| :-------------------- | :----------------------- | :------------------- |
| Windows原生PowerShell | nvm-windows或fnm，选一种 | 2.9与2.11，或2.12.1  |
| macOS／Linux／WSL     | nvm-sh或fnm，选一种      | 2.10与2.11，或2.12.2 |
| 当前只学单版本        | 已完成的官网安装         | 直接进入第3章        |

### 2.9 Windows：nvm-windows安装、切换与检查

本节以nvm-windows v2稳定版为主。当前官方项目为nvm-windows/nvm，旧coreybutler地址会重定向。先在[官方安装页](https://docs.nvm-windows.com/install/installers/)选择Community安装器，核对体系结构，运行安装向导。v2支持shim模式：PATH先找到一个轻量入口，再由它选择真实Node。link模式通过链接选择版本；旧v1常见符号链接权限问题属于另一套操作条件，不要把“始终管理员运行”套到v2社区版。

示例 **C02E08**，文件 `windows-nvm.ps1`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E08/`。

```powershell
# 安装器完成并重新打开PowerShell后执行；本文件不会安装管理器。
nvm env
nvm install 26.13.0
nvm list installed
nvm use 26.13.0
node --version
npm --version
where.exe node
Get-Command node -All
```

`nvm env`展示配置，`nvm doctor`可辅助诊断，install下载指定运行时，list installed列本地版本，use设置默认版本。where.exe和Get-Command用于核对实际入口。安装器若发现原官方Node，会涉及迁移/卸载原安装，先阅读向导对全局包和路径的说明，保留项目清单。不要手工删除不明目录，也不要与另一个管理器争用同一路径。

示例 **C02E09**，文件 `switch-versions.ps1`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E09/`。

```powershell
# 第二版本用于观察切换；两个版本都应先成功安装。
nvm install 24.22.2
nvm use 24.22.2
node --version
nvm use 26.13.0
node --version
```

两次`node --version`应分别对应24.22.2和26.13.0。全局工具不保证随版本共享，项目依赖也不应靠全局安装解决。已在运行的Node进程不会因切换而升级；编辑器可能保留旧环境，需重启终端或明确选择运行时。v2目录固定规则可能优先于默认版本，默认与项目解析的检查方法见2.11节。

### 2.10 macOS、Linux与WSL：nvm-sh

nvm-sh是按用户安装、按shell加载的函数，不是Windows的nvm.exe。WSL是Windows中的Linux环境，运行Linux版Node，不与Windows侧安装混成一套。本节选固定`nvm v0.41.0`安装脚本，先下载再运行，便于查看内容；脚本会配置shell启动文件。

示例 **C02E10**，文件 `posix-nvm.sh`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E10/`。

```bash
curl -fsSLo nvm-install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh
# 先用编辑器或less查看下载的脚本，再执行。
bash nvm-install.sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
command -v nvm
nvm install 26.13.0
nvm use 26.13.0
nvm alias default 26.13.0
node --version
nvm ls
command -v node
```

`command -v nvm`通常显示nvm，而不是一个可执行文件路径。若设置了XDG_CONFIG_HOME或自定义NVM_DIR，应按安装输出加载真实目录；新开终端需由.bashrc/.zshrc等实际shell启动文件加载`nvm.sh`。`nvm use`改变当前shell的PATH，其他已开的shell未必同步；default供新shell使用，运行中的进程也不会切换。nvm-sh通常不应通过sudo安装Node或全局包。

### 2.11 项目版本约定与旧版本管理器差异

把确切版本写入项目的.nvmrc，让协作者知道应使用什么版本。这个文件只是文本，不会凭空安装Node。nvm-sh进入目录后执行`nvm install`和`nvm use`可读取它；自动随目录切换需要额外shell集成。nvm-windows v2在shim模式且auto_use启用时可检测.nvmrc/.node-version/package.json；旧v1不能直接照搬此行为。

示例 **C02E11**，文件 `.nvmrc`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E11/`。

```text
26.13.0
```

在项目根目录保存此文件，内容只有一个版本号和换行，不加引号。nvm-sh执行`nvm install`、`nvm use`；Windows v2可用下一例诊断真实解析版本。不要把nvm-sh支持的所有.nvmrc内容形式默认当作其他管理器完全兼容。

示例 **C02E12**，文件 `pin-windows-v2.ps1`，环境：按本节说明的终端或工具。建议保存到：`js-study/examples/ch02/C02E12/`。

```powershell
# nvm-windows v2，先确认使用shim模式及配置允许自动检测。
nvm use shim
nvm pin 26.13.0 --file=.nvmrc
node --nvm-which --version
nvm default
node -p "process.execPath"
```

`nvm pin`写入确切版本。`node --nvm-which --version`展示项目解析来源并执行版本查询；`nvm default`显示默认版本，两者在有项目约定时可能不同。v1不支持这些v2命令，应按v1帮助手动读取.nvmrc内容再use，或先按官方迁移指南升级。不要同时更改默认版本、项目约定和PATH后再猜哪一项起作用。

### 2.12 fnm：跨平台管理Node版本

fnm是Fast Node Manager的简称，是独立于nvm的Node版本管理器，可用于Windows、macOS和Linux。它也能读取.nvmrc或.node-version，适合希望在不同系统使用同一套版本切换命令的读者。本节依据[fnm v1.39.0](https://github.com/Schniz/fnm/releases/tag/v1.39.0)及其[命令文档](https://github.com/Schniz/fnm/blob/v1.39.0/docs/commands.md)介绍；通过软件管理器安装时可能获得后续版本，应先用`fnm --version`记录实际版本。

选择fnm或当前系统适用的nvm之一即可。继续遵循本章顺序：先学会官网安装和运行程序，再选学管理器。从官网安装或nvm迁移前，先按2.8节记录Node路径与全局工具；改用fnm时，在Shell启动配置中停用旧nvm初始化或旧版固定PATH，让新终端由fnm选择Node。不必因为fnm能跨平台，就在Windows和WSL之间共用同一份Node程序；两侧仍分别安装与初始化。

#### 2.12.1 Windows：安装fnm并初始化PowerShell

在PowerShell执行下面的安装命令。winget是Windows的软件包管理工具；如果系统找不到winget，可通过系统的“应用安装程序”组件获取，或到[fnm官方发行页](https://github.com/Schniz/fnm/releases/tag/v1.39.0)选择匹配系统的Windows发行文件，按官方说明解压并把fnm.exe所在目录加入PATH。winget安装的是fnm本身，Node运行时在2.12.3节另行安装。

示例 **C02E13**，文件 `install-fnm-windows.ps1`，环境：Windows PowerShell。建议保存到：`js-study/examples/ch02/C02E13/`。

```powershell
winget install --id Schniz.fnm --exact
# 安装成功后关闭本终端，再在新PowerShell中执行下一行。
fnm --version
```

安装过程可能要求确认软件源协议。新终端中`fnm --version`应显示管理器版本，例如`fnm 1.39.0`；这不是Node版本。若仍提示命令不存在，先重开编辑器或终端并检查`Get-Command fnm`，不要立即运行`fnm use`。

`fnm env`会生成当前Shell需要的环境配置文本。只运行它会显示文本，还需要让当前Shell执行这段配置。下面先配置当前窗口，再准备持久化配置文件。

示例 **C02E14**，文件 `setup-fnm-powershell.ps1`，环境：已能执行fnm命令的PowerShell。建议保存到：`js-study/examples/ch02/C02E14/`。

```powershell
# 初始化当前PowerShell；不需要把其他网站的脚本文本接到这条管道。
fnm env --use-on-cd --version-file-strategy recursive --shell powershell | Out-String | Invoke-Expression
# 查看此PowerShell实际使用的配置文件位置。
$PROFILE
# 仅在文件不存在时创建，不覆盖已有配置。
if (-not (Test-Path -LiteralPath $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force | Out-Null
}
# 打开配置文件，按下文说明添加一行并保存。
notepad $PROFILE
```

$PROFILE是PowerShell自带的配置文件路径，Windows PowerShell 5.1与PowerShell 7通常使用不同文件；使用哪个终端就配置它实际显示的位置。在打开的文件末尾加入下面这一整行一次，保留原有其他配置，保存并关闭编辑器，再新开PowerShell。

```powershell
fnm env --use-on-cd --version-file-strategy recursive --shell powershell | Out-String | Invoke-Expression
```

Out-String把输出合成字符串，Invoke-Expression让PowerShell执行fnm生成的配置；这里的输入来源应是已经安装并确认来源的fnm。--shell明确输出PowerShell语法，--use-on-cd启用切换目录时选择版本，recursive让管理器从当前目录向上查找项目版本文件。后者适合在项目子目录工作，边界见2.12.4节。

如果组织策略阻止加载PowerShell配置文件，先遵守本机策略；允许交互运行时可在当前终端手动执行初始化行来检查，不要直接把系统执行策略全部放宽。脚本被阻止和fnm.exe没有加入PATH是不同问题。

#### 2.12.2 macOS、Linux与WSL：安装与Shell配置

**macOS。** 已安装Homebrew时，执行brew install fnm，安装结束后执行`fnm --version`。Homebrew是额外的软件管理工具，可按[Homebrew官网](https://brew.sh/)安装；不准备使用它时，可按fnm官方发行页下载适合架构的macOS文件并配置PATH。本节不把Windows版fnm.exe放进macOS或WSL使用。

```bash
brew install fnm
fnm --version
```

**Linux与WSL。** 下面使用官方安装脚本，前提是已有curl和unzip。为了清楚看到配置如何生效，指定安装目录，并用--skip-shell让安装脚本不自动改写Shell启动文件。先下载并阅读脚本，再执行；安装脚本默认获取当时的发行版本，以`fnm --version`输出为准。

示例 **C02E15**，文件 `install-fnm-linux.sh`，环境：Linux或WSL的Bash终端。建议保存到：`js-study/examples/ch02/C02E15/`。

```bash
curl -fsSLo fnm-install.sh https://fnm.vercel.app/install
# 先用编辑器或less查看下载的脚本，再执行下一行。
bash fnm-install.sh --install-dir "$HOME/.local/share/fnm" --skip-shell
export PATH="$HOME/.local/share/fnm:$PATH"
fnm --version
```

检查标准是fnm命令能够显示版本。Linux这条路线还需在实际Shell启动文件中加入下面的PATH配置一次；它指向fnm所在目录，不是某个Node版本的bin目录。

```bash
export PATH="$HOME/.local/share/fnm:$PATH"
```

**初始化Shell。** Bash用户把下面一行加入~/.bashrc，Zsh用户把再下一段的一行加入~/.zshrc；只使用与你的Shell相符的一条。macOS的默认终端常用Zsh。若实际使用登录Shell，按2.3节说明确认真正加载的启动文件。Linux先放置上一段fnm的PATH行，再放初始化行；Homebrew安装者先确认brew提供的fnm已在PATH中。

```bash
# Bash：加入~/.bashrc，并在当前Bash中执行一次可立即生效。
eval "$(fnm env --use-on-cd --version-file-strategy recursive --shell bash)"
```

```bash
# Zsh：加入~/.zshrc；在Zsh中执行，不能照搬到PowerShell。
eval "$(fnm env --use-on-cd --version-file-strategy recursive --shell zsh)"
```

eval让对应Shell执行`fnm env`生成的环境配置，不是JavaScript语法。新开终端后继续2.12.3节；如果把初始化仅写在单独的.sh脚本里再用bash运行，配置不会留在父终端。fnm在每个Shell中建立自己的版本选择环境，另一个已经打开的终端不保证同步切换。

#### 2.12.3 安装、切换、默认版本与单次执行

以下fnm与node命令可在已初始化的PowerShell、Bash或Zsh中逐条执行。为便于核对，使用确切版本号；`fnm install --lts`等动态选择会随发布变化，复现本书时先使用固定版本。

示例 **C02E16**，文件 `fnm-versions.txt`，环境：完成fnm初始化的终端。建议保存到：`js-study/examples/ch02/C02E16/`。这是终端命令清单，不是JavaScript源码。

```bash
fnm install 26.13.0
fnm install 24.22.2
fnm list
fnm use 24.22.2
node --version
fnm use 26.13.0
node --version
fnm default 26.13.0
fnm current
node -p "process.execPath"
fnm exec --using 24.22.2 node --version
node --version
```

两次use之后的`node --version`应依次显示v24.22.2和v26.13.0；`fnm current`此时应显示v26.13.0。`fnm exec`那一行用24.22.2运行一次子命令，输出v24.22.2，最后一行仍应显示v26.13.0。下载进度、版本列表的排列和本机路径不是固定输出；检查重点是实际版本和来源一致。

install下载并保存运行时；use选择当前Shell后续启动的程序使用哪个版本；default保存缺少项目版本要求时使用的默认版本，不能代替当前Shell中的use。exec给单次命令选择版本，适合兼容性比较。切换不会改变已启动的Node进程，也不保证全局npm工具跨版本共享；项目依赖仍由自己的`package.json`与锁文件管理。

当24.22.2仅用于本次练习，确认没有终端或进程继续使用它，也没有项目仍依赖它之后，可执行下面的命令移除该运行时。它不会卸载fnm，也不是删除项目源码的命令。

```bash
fnm uninstall 24.22.2
```

#### 2.12.4 项目固定版本、自动切换与检查

fnm可读取.nvmrc和.node-version。沿用本书已有的.nvmrc即可，不必为fnm另存一份含不同版本的文件。项目根目录只选一份明确的版本约定；如果确实同时保留两种文件，应保持内容一致。本节示例目录中的文件如下。

示例 **C02E17**，目录 `js-study/examples/ch02/C02E17/`，环境：已初始化fnm的终端和Node.js。

文件 `.nvmrc`：

```text
26.13.0
```

文件 `demo.mjs`：

```javascript
console.log('当前Node版本：' + process.version)
```

在终端进入此例目录，先执行`fnm install`安装项目约定的版本，再执行`fnm use`选择它；最后运行程序。

```bash
fnm install
fnm use
node demo.mjs
```

预期输出：

```text
当前Node版本：v26.13.0
```

没有显式版本参数时，`fnm install`和`fnm use`按配置读取项目版本要求。已启用--use-on-cd后，离开再进入此例目录可触发自动选择；目标版本尚未安装时，先显式执行`fnm install`，再核对结果，不把自动切换等同于自动完成安装。本节还显式配置了recursive，因此进入该项目的子目录时也会向上寻找版本文件；默认local策略只检查当前目录。查找范围也包含父目录，排查意外版本时应检查上层目录的版本文件。

当前fnm还可在没有版本文件时按配置解析`package.json`中的engines.node范围；这与其他管理器或npm本身的行为不同。范围可能匹配多个版本，学习项目使用固定版本文件更容易复现。每次仍以`fnm current`、`node --version`和`process.execPath`核对真实运行环境，不能只看文件内容。具体解析规则见[fnm配置说明](https://github.com/Schniz/fnm/blob/v1.39.0/docs/configuration.md)。

#### 2.12.5 常见问题与管理器选择

“fnm能显示版本，但use提示缺少环境变量”通常说明只安装了可执行文件，没有在当前终端执行对应Shell的`fnm env`初始化。先补初始化，切换后再检查Node版本。“当前终端正确，新终端错误”则检查初始化是否保存到该终端实际加载的配置文件，以及编辑器是否保留旧环境。

“`fnm current`与`node --version`不一致”时，先看`node -p "process.execPath"`，Windows再用`Get-Command node -All`和`where.exe node`，macOS／Linux用`command -v node`。常见原因是原生Node或旧管理器的PATH入口覆盖了fnm、编辑器沿用旧环境、或子目录读取了不同版本文件。一次只处理一个来源，并重新打开终端确认。

| 工具                 | 适用环境与项目约定                                                        | 当前环境检查                         |
| :------------------- | :------------------------------------------------------------------------ | :----------------------------------- |
| 官网安装包／发行文件 | 先完成单版本入门；版本由安装和PATH决定                                    | `node --version`与`process.execPath` |
| nvm-windows          | Windows原生；v1与v2行为按2.9、2.11节区分                                  | 对应版本的nvm诊断命令与Node真实路径  |
| nvm-sh               | macOS、Linux、WSL；按Shell加载并可读取.nvmrc                              | `nvm current`与Node真实路径          |
| fnm                  | Windows、macOS、Linux、WSL；可读取.nvmrc／.node-version，自动切换需初始化 | `fnm current`与Node真实路径          |

fnm不是nvm命令的别名，不能只把旧教程中的程序名替换后直接执行。项目成员可以使用不同管理器，但应共享确切版本要求、核对实际Node版本，并在升级后重新运行项目检查。

### 2.13 动手练习与参考答案

1. 不安装版本管理器，按自己的操作系统完成官网安装，再执行版本检查和你好示例。检查标准：`node --version`显示预期版本，程序输出两行指定文本，能够说明Node程序来自哪个路径。

2. 把`node demo.mjs`写进`demo.mjs`再运行，会怎样？它会被当JavaScript源码解析，不能作为系统运行命令执行。应把运行命令输入终端，把`console.log`等源码保存到文件。

3. 使用Linux压缩包路线时，为什么当前终端能运行，新终端却找不到node？可能只在当前Shell执行了export，尚未把正确路径加入该Shell使用的启动文件。检查新终端的`command -v node`和启动文件，再重新验证。

4. 选学nvm后，分别在项目目录与无.nvmrc的目录核对`node --version`和真实路径。答案不是固定路径；应能解释项目约定与默认版本是否一致。迁移前先记录原Node路径和全局工具，迁移后核对管理器实际选择的入口。

5. Windows旧v1教程要求管理员和符号链接，是否可当v2通则？不可以；v2有shim/link模式，权限和目录解析应按对应版本核对。

6. 切换Node后已经启动的服务会换版本吗？不会；需停止旧进程并在核对后的环境重新启动。

7. 选学fnm时，在完成初始化的终端比较use与exec：先use 26.13.0，再用exec单次执行已安装的24.22.2。检查标准：单次命令显示v24.22.2，回到当前终端执行`node --version`仍显示v26.13.0；若已卸载24.22.2，先重新安装再练习。

8. .nvmrc已经写好，为何新PowerShell没有自动切换？检查是否加载了该PowerShell实际的$PROFILE，初始化是否启用--use-on-cd，目标版本是否已安装，并核对当前目录及父目录的版本文件。

### 2.14 本章速查

| 场景                | 写法或工具                                    | 结果与边界                                    |
| :------------------ | :-------------------------------------------- | :-------------------------------------------- |
| 第一次安装          | 官网Windows .msi／macOS .pkg／Linux预编译文件 | 按系统与架构选择，安装后新开终端              |
| 核对版本            | `node --version / npm --version`              | 分别核对运行时与包管理器                      |
| 核对真正运行的程序  | `node -p "process.execPath"`                  | 路径应属于所选安装或管理器                    |
| 执行源码文件        | `node demo.mjs`                               | 先在终端进入文件所在目录                      |
| Windows npm脚本受限 | npm.cmd --version                             | 先用随Node分发的.cmd入口检查                  |
| 迁移前查看全局工具  | `npm list --global --depth=0`                 | 用于记录，不会自动迁移这些工具                |
| Windows v2列版本    | `nvm list installed`                          | 不等于项目shim最终解析                        |
| Windows v2项目诊断  | `node --nvm-which --version`                  | 仅v2 shim相关能力                             |
| POSIX项目切换       | `nvm use`                                     | 读取.nvmrc；当前shell生效                     |
| fnm安装与当前版本   | `fnm install 26.13.0`；`fnm current`          | 管理器与Node分别安装，先初始化Shell           |
| fnm当前与默认版本   | `fnm use 26.13.0`；`fnm default 26.13.0`      | 当前Shell切换与默认约定是两步                 |
| fnm项目切换         | `fnm install`；`fnm use`                      | 在项目中读取版本文件；自动切换另需--use-on-cd |
| fnm单次执行         | `fnm exec --using 24.22.2 node --version`     | 目标版本先安装，不改变当前Shell选择           |
| 路径冲突            | `where.exe / Get-Command / command -v`        | 先查入口，再修配置                            |

## 第3章 读懂代码、执行顺序与错误信息

会运行脚本后，要进一步看懂每行在做什么。这里用短小、独立的例子认识表达式、语句、调用和错误。故意错误会在例子中捕获并显示错误类型；完整异常处理在第19章展开。

### 3.1 值、字面量、表达式与语句

值是程序处理的数据，例如数字3和文本“学习”。直接写出的值称为字面量。表达式会求出一个值，例如2 + 3；语句用来组织执行动作，例如声明变量。函数调用把参数交给一个功能，`console.log`就是调用宿主提供的显示功能。

示例 **C03E01**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E01/`。

```javascript
console.log(2 + 3 * 4)
console.log((2 + 3) * 4)
console.log('分钟：', 15 + 5)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
14
20
分钟： 20
```

乘法先于加法，括号可先分组，所以前两行分别为14和20。调用前先求参数表达式的值。逗号分开参数，不是文本的一部分；输出中的空格由控制台组织。

### 3.2 注释、命名与代码块

注释向阅读代码的人说明意图，不参与普通运行。//到行末是单行注释，/_和_/包围多行注释。名字区分大小写，task与Task不同；不要用let等保留字作普通变量名。花括号在不同语法里可表示代码块或对象，要看上下文。

示例 **C03E02**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E02/`。

```javascript
const taskTitle = '学习注释'
// 用分钟表达时长，避免在这一层混入小时换算。
const minutes = 25
{
  console.log(taskTitle)
  console.log(minutes)
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
学习注释
25
```

本例独立代码块里的两条输出按顺序执行。缩进帮助人识别结构，但普通JavaScript块边界由花括号决定，不由空格数量决定。注释应解释约定或原因，不能用注释掩盖与实际行为不一致的实现。

### 3.3 顺序执行与状态变化

赋值先计算右边，再把结果保存为左边变量当前的值。显示发生在执行`console.log`那一刻；后来修改变量不会回到过去修改已输出的文字。

示例 **C03E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E03/`。

```javascript
let completed = 1
console.log(completed)
completed = completed + 2
console.log(completed)
completed = completed * 3
console.log(completed)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
1
3
9
```

执行表依次为1、3、9。第二次赋值右边读取旧的1，算出3后才更新变量。这不是数学中要求两边永远相等的等式；=是赋值运算符。

示例 **C03E04**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E04/`。

```javascript
let first = 2
let second = 5
const temporary = first
first = second
second = temporary
console.log(first, second)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
5 2
```

临时变量保留旧first，否则连续写first = second、second = first会丢掉原值。先画出每条语句执行后的两格数值，是排查状态问题的有效方法。第13章再讲解构交换。

### 3.4 分号与换行边界

本书普通语句采用不写末尾分号的统一风格，但必须知道换行不总等于语句结束。自动分号插入是语法规则，不是“看到换行就加分号”。return后换行会提前结束返回；以圆括号或方括号开头的新行还可能接上前一个表达式。

示例 **C03E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E05/`。

```javascript
function broken() {
  return
  10
}
function correct() {
  return 10
}
console.log(broken())
console.log(correct())
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined
10
```

函数是一段稍后可调用的代码，这里只需看return交回结果。broken在return后的换行处结束返回，得到undefined；10成为不可达语句。不要靠缩进改变这种语法。跨行返回对象时把左括号放在return同一行。

**理解后回读。** 下例的立即调用函数只用于说明语句边界。第一次阅读先记住“换行不一定结束语句”，学完第10章函数后再追踪括号和调用过程。

示例 **C03E06**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E06/`。

```javascript
const value = 3
// 前导分号防止以圆括号开头的表达式粘接到前一行。
;(function () {
  console.log(value)
})()
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
3
```

这个立即调用的函数用于演示语句边界，不要求日常代码都写成此样式。若移除前导分号，前一行可能被解析为对数字3的调用。统一格式化工具有帮助，但不能代替理解return等受限换行位置。

### 3.5 看懂错误的第一现场

语法错误表示代码结构不符合规则；运行时异常表示执行某一步失败；逻辑错误表示程序能运行但结果不符合需求。以下try/catch是演示保护：try中失败后进入catch，避免故意错误直接终止整份例子。不要因此认为所有错误都应该吞掉。

示例 **C03E07**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E07/`。

```javascript
try {
  // 以下为故意错误：读取不存在的名字。
  console.log(missingTask)
} catch (error) {
  console.log(error.name)
}
try {
  const title = null
  console.log(title.trim())
} catch (error) {
  console.log(error.name)
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
ReferenceError
TypeError
```

第一处是ReferenceError，第二处是TypeError。实际未捕获时通常还会显示文件、行列和调用栈。先找自己的第一处相关调用位置，不要只复制最后一行错误文字；异常消息全文可能随引擎版本变化。

示例 **C03E08**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch03/C03E08/`。

```javascript
// .mjs自动使用严格模式；给未声明名字赋值会失败。
try {
  accidentalGlobal = 1
} catch (error) {
  console.log(error.name)
}
console.log(typeof accidentalGlobal)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
ReferenceError
undefined
```

严格模式增加一组语义约束，例如阻止这种意外全局赋值。typeof对未声明名字返回undefined，因此最后一行不会再次抛错；第15章还会说明暂时性死区的不同情况。

#### 3.5.1 从真实错误定位到修复【阶段一验收】

先保存两个独立文件，故意错误不要与正常示例拼在同一个入口。此时不用try/catch遮住错误，让Node报告真实位置。

示例 **C03E09**，目录 `js-study/examples/ch03/C03E09/`，环境：Node.js。类型：故意错误及完整修正。

文件 `broken.mjs`：

```javascript
const title = '学习错误定位'
console.log(taskTitle.trim())
```

文件 `fixed.mjs`：

```javascript
const title = '学习错误定位'
console.log(title.trim())
```

在该目录分别执行，第一条失败后仍可输入第二条：

```powershell
node broken.mjs
node fixed.mjs
```

第一条应非正常退出。完整错误报告中应找到稳定文字`ReferenceError: taskTitle is not defined`，并找到指向自己`broken.mjs`第2行的路径；绝对路径和堆栈格式以本机为准，不要求与别人的截图一致。它说明名字找不到，不是Node没有安装。先对照已声明的`title`，再检查大小写和拼写；不要为消除错误随意新建另一个空变量。

第二条应输出：

```text
学习错误定位
```

独立检查：暂时不看`fixed.mjs`，自行修正`broken.mjs`并重新运行。通过标准是能说明出错文件、行号、错误类别、原因和改动，同时可以在新终端重新进入目录运行。

### 3.6 动手练习与参考答案

1. 顺序执行let n = 2、n = n + 3、n = n \* 2，结果是多少？答案10；每一步都读取前一步状态。

2. return后换行再写对象，能交回对象吗？不能；应将return和表达式起始部分放同一行。

3. 区分三种错误：缺右括号是语法错误；null.trim()是运行时异常；漏算一条任务是逻辑错误。

### 3.7 本章速查

| 场景         | 写法或工具         | 结果与边界                     |
| :----------- | :----------------- | :----------------------------- |
| 观察值       | `console.log(...)` | 执行时显示；后来赋值不改旧输出 |
| 赋值         | name = expression  | 先求右侧再更新                 |
| 故意失败演示 | try/catch          | 只捕获明确预期的错误           |
| 模块严格模式 | .mjs               | 不是编辑器格式选项             |

## 第4章 变量、值与数据类型

本章回答“名字里保存什么”和“为什么同一句赋值会出现不同结果”。变量可以重新绑定到值，对象的内容也可以改变，这两件事必须分开。先学常用类型，Symbol和BigInt在对应章节继续展开。

### 4.1 声明、初始化与重新赋值

声明建立名字，初始化为它提供初始值。let允许之后重新赋值，const要求声明时初始化且不能重新绑定；优先const，确实需要重新赋值时用let。const约束名字的绑定，不会递归冻结对象。

示例 **C04E01**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch04/C04E01/`。

```javascript
let completed = 0
completed = 1
const title = '学习变量'
console.log(title, completed)
let note
console.log(note)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
学习变量 1
undefined
```

未显式初始化的let变量在声明语句执行后值为undefined。const title = ...不是不可变字符串的唯一来源：字符串值本来就不可变，const限制的是title能否改指向另一个值。

示例 **C04E02**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch04/C04E02/`。

```javascript
const task = { title: '学习变量', done: false }
task.done = true
console.log(task.done)
try {
  // 以下为故意错误：试图重新绑定const。
  task = { title: '另一任务', done: false }
} catch (error) {
  console.log(error.name)
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
true
TypeError
```

对象属性可变而绑定不变，所以第一处成功。第二处要让task指向另一对象，违反const约束而抛TypeError。对象字面量和属性访问先按“记录和字段”理解，第12章系统学习。

### 4.2 七种原始类型与对象

原始值是语言中不是对象的基本值：undefined、null、布尔值、Number数值、BigInt大整数、字符串、Symbol。对象是可包含属性等行为的数据；数组和函数也属于对象体系。类型属于值，变量可在后续绑定不同类型的值。

示例 **C04E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch04/C04E03/`。

```javascript
console.log(typeof undefined)
console.log(typeof true)
console.log(typeof 25)
console.log(typeof 25n)
console.log(typeof '任务')
console.log(typeof Symbol('id'))
console.log(typeof {})
console.log(typeof function () {})
console.log(typeof null)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined
boolean
number
bigint
string
symbol
object
function
object
```

typeof给出字符串标签。null的标签为object是历史行为，不表示null真的是对象；函数标签是function，但函数仍是可调用对象。25n的n是BigInt字面量后缀，不属于普通Number。

### 4.3 动态类型与类型检查

动态类型表示同一变量可以先后保存不同类型的值；它不表示任意操作都能成功。typeof适合初步分类，数组应使用`Array.isArray`，null要单独比较。完整数据校验还要检查字段和业务规则。

示例 **C04E04**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch04/C04E04/`。

```javascript
let value = 10
console.log(typeof value)
value = '10'
console.log(typeof value)
console.log(value + 2)
console.log(Number(value) + 2)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
number
string
102
12
```

文字10与数值10看起来相近，类型不同。字符串加数值在这里形成拼接，显式Number转换后才算12。不要看到动态类型就省掉输入检查，第5章专门解释转换。

示例 **C04E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch04/C04E05/`。

```javascript
const values = [1, 2]
console.log(typeof values)
console.log(Array.isArray(values))
console.log(Array.isArray({ length: 2 }))
console.log(null === null)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
object
true
false
true
```

带length属性的普通对象不因此成为真正数组。===比较相等，第5章展开；这里用它识别确切的null。类型检查服务于操作前提，例如调用数组方法前要知道值确实是数组。

### 4.4 缺失状态怎么表达

未声明是没有建立相应名字；未初始化还包括声明建立但尚未执行初始化的阶段。undefined是明确的一种原始值；null也可作为业务上“明确没有”的值。对象缺失属性读出undefined，已有属性也可以存undefined，这两者不能只靠读取结果区分。

示例 **C04E06**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch04/C04E06/`。

```javascript
let note
const task = { title: '阅读', deadline: null, reminder: undefined }
console.log(note)
console.log(task.deadline)
console.log(task.missing)
console.log(Object.hasOwn(task, 'reminder'))
console.log(Object.hasOwn(task, 'missing'))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined
null
undefined
true
false
```

deadline为null表示本例约定的“没有截止日期”。reminder是存在但值为undefined的属性；missing根本不存在。`Object.hasOwn`用于检查自有属性是否存在，第12章详细说明。不要在不同接口里随意交换null和undefined而不说明契约。

### 4.5 从变量到任务记录

对象赋值不会自动复制全部内容。把同一个对象值交给两个变量，它们就能访问同一对象；通过一个变量修改属性，另一个能观察到。重新给其中一个let变量赋值，只改变这个绑定。

示例 **C04E07**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch04/C04E07/`。

```javascript
const original = { title: '阅读', done: false }
let other = original
other.done = true
console.log(original.done)
console.log(other === original)
other = { title: '练习', done: false }
console.log(original.title, other.title)
console.log(other === original)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
true
true
阅读 练习
false
```

先共享、再重绑的两个阶段分别观察。第13章才介绍复制；现在先不要使用“赋值等于深复制”的错误模型。可以画两个名字指向同一个记录，再把other的箭头移向另一记录；箭头仅表达共享关系，不是要求记忆某个真实内存地址。

**用关系图区分重新赋值与修改。** 下图的线表示“保存了同一个对象引用”，不是可读取的内存地址。

```text
let first = object      first ──┐
let second = first     second ──┴──→ { title: '阅读' }

second.title = '练习'   两个名字读取同一对象的新字段
second = { ... }       second ─────→ 新对象
                       first  ─────→ 原对象（不会被第二次赋值替换）
```

把本章共享对象例子的每次赋值都画成两格名字和对象节点，再核对输出。const只限制变量格是否能重新绑定；它不自动冻结右边对象。

### 4.6 动手练习与参考答案

**先独立回答。**

1. const声明的数组能push吗？

2. typeof null和typeof []分别是什么？

3. 两个变量共享对象后，给其中一个变量重新赋值，会替换另一个变量吗？

**参考答案与检查。**

1. 能，前提是数组可扩展；const只阻止该变量重新绑定。

2. 都为object；前者用value === null，后者用`Array.isArray`判断。

3. 不会；只修改该变量的绑定。

### 4.7 本章速查

| 场景         | 写法或工具                | 结果与边界                   |
| :----------- | :------------------------ | :--------------------------- |
| 需要重新赋值 | let                       | 不要求变量一直保持同一值类型 |
| 不重新绑定   | const                     | 仍可能修改对象内容           |
| 粗分类       | typeof value              | null和数组需补充检查         |
| 判断数组     | `Array.isArray(value)`    | 不靠length猜测               |
| 检查属性存在 | `Object.hasOwn(obj, key)` | 区分缺失与已存undefined      |

## 第5章 类型转换、相等与逻辑判断

本章把“看起来相同”与“程序认为相同”分开。转换不是输入校验，相等也不是只有一套规则。用小例子观察每次运算接收什么类型、返回什么值，再决定业务代码要采用哪条规则。

### 5.1 显式转换：主动说明意图

显式转换是在源码中写清转换动作。Number把可转换值转为数值，String形成文本，Boolean按真值规则形成布尔值。输入通常先是文本；数值转换结果可能是NaN，空文本也可能转成0，因此转换成功还不等于业务有效。

示例 **C05E01**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E01/`。

```javascript
console.log(Number('25'), Number(' 25 '))
console.log(Number(''), Number('   '))
console.log(Number('25分钟'))
console.log(String(25), String(null))
console.log(Boolean(0), Boolean('0'), Boolean('false'))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
25 25
0 0
NaN
25 null
false true true
```

Number不是“只读开头数字”：带分钟单位的整段文本不能直接变成Number。Boolean不解析文本false的语义，只判断该字符串是否是假值，所以非空文本false得到true。接收外部字符串时应先明确允许的格式。

示例 **C05E02**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E02/`。

```javascript
const input = '   '
const cleaned = input.trim()
const minutes = Number(cleaned)
console.log(cleaned.length === 0)
console.log(minutes)
console.log(cleaned.length > 0 && Number.isFinite(minutes))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
true
0
false
```

先trim检查空输入，再检查数值，可避免把空白当0接受。&&先按左侧真假决定是否计算右侧，第4节继续解释。`Number.isFinite`拒绝NaN和无穷；分钟数是否应为整数或正数仍需另一层约束。

### 5.2 隐式转换：运算符有自己的规则

隐式转换表示运算没有写出Number等调用，却按语言规则改变了参与求值的类型。+既可数值相加，也可字符串拼接；-等算术通常尝试数值转换。对象参与原始值运算时还会寻找转换行为，不应依靠复杂对象自动转值完成业务。

示例 **C05E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E03/`。

```javascript
console.log('10' + 2)
console.log('10' - 2)
console.log(1 + 2 + '3')
console.log('1' + 2 + 3)
console.log(null + 1, undefined + 1)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
102
8
33
123
1 NaN
```

加法从左向右求值：1+2先得3，再和字符串3拼成33；字符串1先与2拼成12，再与3拼成123。null在这次数值运算中转为0，undefined转为NaN；这不是说二者在所有场景中等价。

示例 **C05E04**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E04/`。

```javascript
const duration = {
  valueOf() {
    return 20
  },
  toString() {
    return '二十分钟'
  },
}
console.log(Number(duration))
console.log(String(duration))
console.log(duration + 5)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
20
二十分钟
25
```

对象的valueOf/toString展示转换入口。不同转换提示采用的尝试顺序不同，不能把“对象永远先toString”当通则；`Symbol.toPrimitive`等自定义规则在Symbol与对象进阶章节再讲。主线优先读取明确字段，而不是让整个记录隐式参与算术。

### 5.3 多种相等规则

严格相等===通常不跨类型转换；==执行抽象相等规则，在类型不同时可能转换。业务主线优先===和!==，需要特殊规则时明确说明。对象的===比较身份，而不是逐个比较内容。`Object.is`又在NaN、正负零上与===不同。

示例 **C05E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E05/`。

```javascript
console.log(0 === '0', 0 == '0')
console.log(null === undefined, null == undefined)
console.log(NaN === NaN, Object.is(NaN, NaN))
console.log(0 === -0, Object.is(0, -0))
console.log({ id: 1 } === { id: 1 })
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
false true
false true
false true
true false
false
```

本例的==用于识别旧代码，不建议靠记怪题写业务。两个对象字面量分别创建两个对象，即使字段一样，身份也不同。判断任务相同通常比较稳定ID，而不是把对象引用比较当业务相等。

示例 **C05E06**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E06/`。

```javascript
const items = [NaN, 0]
console.log(items.includes(NaN))
console.log(items.indexOf(NaN))
console.log(new Set([NaN, NaN, 0, -0]).size)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
true
-1
2
```

includes和Set成员采用SameValueZero：NaN可与NaN匹配，正负零视为相同；indexOf采用严格相等，因此找不到NaN。Set是去重集合，第18章展开；这里先观察相等规则会影响工具结果。

### 5.4 真值、短路与默认值

真假判断会把值转换为布尔意义。常见假值是undefined、null、false、正负零、0n、NaN、空字符串；浏览器还有`document.all`这一历史例外。空数组和空对象都是真值。&&、||返回某个操作数，不保证返回布尔值；??只在左边为null或undefined时用默认值。

示例 **C05E07**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E07/`。

```javascript
console.log(Boolean([]), Boolean({}))
console.log(0 || 30, 0 ?? 30)
console.log(false || true, false ?? true)
console.log('任务' && '可以保存')
console.log('' && '不会读取这个结果')
console.log(!'任务', !!'任务')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
true true
30 0
true false
可以保存

false true
```

如果0分钟是合法值，||会错误地把它替换成30；??则保留0。短路是只在必要时计算右侧：不只是结果不同，还会影响右侧函数是否执行。双叹号把真值结果转为明确布尔值。

### 5.5 优先级、括号与安全访问

优先级决定分组，求值还遵守相应运算符规则。条件表达式condition ? yes : no只计算被选择的分支。可选链?.在访问接收者为null/undefined时停止并返回undefined；它不是捕获所有错误的通用保险。

示例 **C05E08**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E08/`。

```javascript
const task = { owner: null, minutes: 0 }
console.log(task.owner?.name ?? '未分配')
console.log(task.minutes > 0 ? '有计划时长' : '未估算')
const format = undefined
console.log(format?.('x'))
console.log((null ?? false) || '后备文本')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
未分配
未估算
undefined
后备文本
```

可选调用只在目标nullish时跳过，非空但不可调用仍会TypeError。??不能未经括号直接与&&/||混写；用括号表达选择。链中某处访问或调用的真实异常不会被?.吞掉。

示例 **C05E09**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch05/C05E09/`。

```javascript
try {
  console.log(neverDeclaredTask?.title)
} catch (error) {
  console.log(error.name)
}
const task = { owner: null }
try {
  console.log((task.owner?.name).length)
} catch (error) {
  console.log(error.name)
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
ReferenceError
TypeError
```

可选链的根名字必须能被正常解析；根名字不存在仍是ReferenceError。括号结束前面的可选链后，继续对undefined读取length仍会TypeError。实际设计中只在业务允许缺失时使用可选链，必填字段应明确报错。

### 5.6 动手练习与参考答案

1. Number(" ")为什么不能代替“用户输入了数字”的检查？因为它得到0；还应先检查清理后文本非空，再检查数值与范围。

2. 任务0分钟应保留，用minutes || 30还是minutes ?? 30？选择??，同时另行校验允许的分钟范围。

3. 两个字段相同的对象===是否为true？不是；独立创建的对象身份不同。

4. 预测1 + "2" + 3。答案字符串123；第一个+已经进入拼接。

### 5.7 本章速查

| 场景         | 写法或工具               | 结果与边界                 |
| :----------- | :----------------------- | :------------------------- |
| 显式数值转换 | Number(text)             | 空白可能为0；失败可能NaN   |
| 普通相等     | === / !==                | 不自动跨类型转换           |
| 缺失默认值   | value ?? fallback        | 只替换null/undefined       |
| 安全访问     | value?.field             | 根名字需存在；不吞实际异常 |
| 布尔化       | Boolean(value) / !!value | 空数组、空对象都为true     |

## 第6章 数值、精度与数学工具

任务时长、计数和ID看起来都是数字，但它们的范围和精度要求不同。本章先解释Number的边界，再介绍BigInt。数值显示格式不会改变原值精度，精确求和也不会把二进制浮点变成十进制货币类型。

### 6.1 Number怎样表示数值

普通整数与小数都使用Number类型，核心表示采用IEEE 754双精度二进制浮点。安全整数范围为±(2^53−1)，范围以外可能无法区分相邻整数。NaN表示某类无效数值结果，Infinity表示无穷，负零在少数运算可观察。

示例 **C06E01**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E01/`。

```javascript
console.log(10, 0b1010, 0o12, 0xa)
console.log(1_000_000)
console.log(Number.MAX_SAFE_INTEGER)
console.log(2 ** 53 === 2 ** 53 + 1)
console.log(1 / 0, 0 / 0, 1 / -0)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
10 10 10 10
1000000
9007199254740991
true
Infinity NaN -Infinity
```

不同进制写法得到同一个十进制显示10；下划线只是字面量分隔符。2^53及其后相邻整数可能映射到同一Number，因此大ID从输入时就要选字符串或BigInt，不能先丢精度再补救。

### 6.2 算术、截断与余数

/执行除法，不会因为两侧写整数就自动变成整除。%是余数，结果符号与被除数相关，不能直接套用Python负数取模经验。`Math.trunc`向零截断，floor向负无穷，ceil向正无穷，round按自己的舍入规则处理中点。

示例 **C06E02**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E02/`。

```javascript
console.log(7 / 2, 7 % 2, -7 % 2)
console.log(Math.trunc(-2.8), Math.floor(-2.8), Math.ceil(-2.8))
console.log(Math.round(2.5), Math.round(-2.5))
let count = 1
console.log(count++, count)
console.log(++count, count)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
3.5 1 -1
-2 -3 -2
3 -2
1 2
3 3
```

count++先提供旧值再更新，++count先更新再提供新值。初学时把更新单独写成一行，更容易观察状态。对余数需要非负循环下标时可根据正模数m使用((n % m) + m) % m，仍需验证m为正。

示例 **C06E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E03/`。

```javascript
const minutes = 135
const hours = Math.floor(minutes / 60)
const rest = minutes % 60
console.log(hours, rest)
const position = -1
const size = 5
console.log(((position % size) + size) % size)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
2 15
4
```

本例前提是分钟数为非负整数，size为正整数。先明确前提，公式才不会在负时长或零模数场景被误用。小时与剩余分钟属于两个字段，不应把2.15误当2小时15分。

### 6.3 转换工具与检查工具

`Number.isNaN`只检查值本身是否为Number类型的NaN，不先转换；isFinite/isInteger/isSafeInteger也有明确范围。parseInt/parseFloat可读取文本开头的数值部分，与Number要求整段可转换不同。parseInt明确给10进制更易读。

示例 **C06E04**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E04/`。

```javascript
console.log(Number('12px'), parseInt('12px', 10))
console.log(parseFloat('3.5小时'))
console.log(parseInt('1e3', 10), Number('1e3'))
console.log(Number.isNaN('x'), Number.isNaN(Number('x')))
console.log(Number.isFinite(Infinity), Number.isInteger(3.0))
console.log(Number.isSafeInteger(2 ** 53))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
NaN 12
3.5
1 1000
false true
false true
false
```

如果业务要求输入完全是数值，parseInt返回12不表示12px是合法分钟输入。整段转换后还要检查有限、整数、安全范围和业务上下界。全局isNaN会先转换，容易与`Number.isNaN`混淆。

### 6.4 浮点误差与显示格式

0.1等十进制小数无法用有限二进制位精确表示。运算可能产生很小偏差，直接===比较计算结果有时不合需求。容差必须由量纲和精度要求决定，不把`Number.EPSILON`当适用于所有数量级的统一阈值。

示例 **C06E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E05/`。

```javascript
const total = 0.1 + 0.2
console.log(total)
console.log(total === 0.3)
console.log(Math.abs(total - 0.3) < 1e-12)
console.log(total.toFixed(2), typeof total.toFixed(2))
console.log(total)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
0.30000000000000004
false
true
0.30 string
0.30000000000000004
```

toFixed返回格式化字符串，最后一行说明原Number并没有变精确。若任务时长只允许整分钟，就存整数分钟；如果涉及财务计算，应使用明确的小单位或适当十进制方案，并根据业务舍入规则设计，而不是随意截去尾数。

示例 **C06E06**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E06/`。

```javascript
const taskMinutes = 25 + 35 + 40
console.log(taskMinutes)
console.log(Math.floor(taskMinutes / 60), taskMinutes % 60)
const a = 1e12 + 0.1
const b = 1e12 + 0.2
const tolerance = 0.11
console.log(Math.abs(a - b) <= tolerance)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
100
1 40
true
```

本例分别展示整数单位与业务容差，二者不是同一个技术。比较大数量级时，浮点间距与小数量级不同。正式数据格式必须写清单位，避免分钟数、秒数和毫秒数混算。

### 6.5 BigInt、Math与随机数

BigInt表示任意精度整数，但仍受可用内存限制；字面量带n，也可从完整整数字符串构造。BigInt不能直接与Number进行大多数混合算术，除法结果向零截断。Math函数通常面向Number。`Math.random`用于普通随机，不适合令牌等安全用途。

示例 **C06E07**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E07/`。

```javascript
const large = BigInt('9007199254740993')
console.log(String(large + 1n))
console.log(String(7n / 2n), String(-7n / 2n))
try {
  console.log(1n + 1)
} catch (error) {
  console.log(error.name)
}
console.log(Number.isSafeInteger(Number(large)))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
9007199254740994
3 -3
TypeError
false
```

先把已丢精度的Number交给BigInt无法恢复原整数，应从文本构造。转回Number前要评估范围；JSON也不直接序列化BigInt，第20章说明。Java的long是固定宽度，Python的普通int又有不同默认行为，不宜仅凭名字对照。

示例 **C06E08**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch06/C06E08/`。

```javascript
console.log(Math.abs(-5), Math.min(3, 1, 8), Math.max(3, 1, 8))
console.log(Math.sqrt(81), Math.pow(2, 3))
// 仅检查范围，不要求每次生成同一个数。
const die = Math.floor(Math.random() * 6) + 1
console.log(Number.isInteger(die) && die >= 1 && die <= 6)
if (typeof Math.sumPrecise === 'function') {
  console.log(Math.sumPrecise([1e16, 1, -1e16]))
} else {
  console.log('当前运行时未实现Math.sumPrecise')
}
console.log([1e16, 1, -1e16].reduce((sum, value) => sum + value, 0))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
5 1 8
9 8
true
当前运行时未实现Math.sumPrecise
0
```

骰子用[0,1)随机数缩放到[0,6)，取floor后加1；输出只检查范围。ES2026的`Math.sumPrecise`减少求和中间舍入造成的损失；支持它的环境中这一行得到1，未实现时明确显示提示。普通逐项累加得到0；它仍返回Number，不是十进制定点类型。最后一行reduce为累积操作，第14章系统解释，当前可先按“从0依次相加”理解。

### 6.6 动手练习与参考答案

**先独立回答。**

1. 135分钟分成小时与余分钟是多少？

2. 想拒绝12px，应该只用parseInt吗？

3. 9007199254740993这种ID先用Number再转BigInt能保真吗？

**参考答案与检查。**

1. 答案2小时15分钟；不能写作2.15小时。

2. 不应；整段转换、文本规则和数值范围都要检查。

3. 不能；应从原文本开始保留。

### 6.7 本章速查

| 场景     | 写法或工具                  | 结果与边界                   |
| :------- | :-------------------------- | :--------------------------- |
| 有限数值 | `Number.isFinite(x)`        | 拒绝NaN和正负Infinity        |
| 整数范围 | `Number.isSafeInteger(x)`   | 仅说明数值安全，不是业务合法 |
| 截断     | `Math.trunc(x)`             | 向零；不同于floor            |
| 格式化   | x.toFixed(digits)           | 返回字符串；不改变x          |
| 大整数   | BigInt(text)                | 与Number混算需明确转换       |
| 改善求和 | `Math.sumPrecise(iterable)` | ES2026；仍为Number结果       |

## 第7章 字符串、Unicode与文本处理

任务标题、提示和文件内容都是文本。文本的“长度”可能指字节、UTF-16码元、码点或用户感知字符。本章先掌握常用操作，再建立这些层次，避免中文和emoji使程序表现异常。

### 7.1 字面量、模板与不可变性

字符串可用单引号、双引号或反引号。引号本身不属于值；反斜杠引入转义，例如\n换行。反引号支持实际多行和${表达式}插值。字符串值不可原地改字符，方法通常返回新字符串。

示例 **C07E01**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E01/`。

```javascript
const title = '学习JavaScript'
const minutes = 25
console.log(`${title}：${minutes}分钟`)
console.log('第一行\n第二行')
console.log('路径片段：C:\\study')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
学习JavaScript：25分钟
第一行
第二行
路径片段：C:\study
```

源码中的\n被解析成一个换行字符；两个反斜杠表示一个实际反斜杠。模板里先计算表达式，再形成文本。展示路径仅是文本，不会创建该目录；真实路径规则在文件章节处理。

示例 **C07E02**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E02/`。

```javascript
const title = '  阅读  '
const cleaned = title.trim()
console.log(`[${title}]`)
console.log(`[${cleaned}]`)
console.log(title === cleaned)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
[  阅读  ]
[阅读]
false
```

trim返回新文本，不修改原title。把结果放进方括号是为了观察首尾空格；方括号只是本例显示标记。若忽略返回值只写title.trim()，下一次仍读取原文本。

### 7.2 索引、码元、码点和感知字符

字符串length和下标按UTF-16码元工作；某些码点需两个码元表示。码点是Unicode分配编号的单位，用户看到的一枚字符又可能由多个码点组合。for...of可按码点遍历；精细用户文本计数可用`Intl.Segmenter`按字素分段，第21章再系统讲国际化。

示例 **C07E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E03/`。

```javascript
const text = 'A😀'
console.log(text.length)
console.log(text.codePointAt(1))
console.log([...text].length)
console.log(text[99], text.at(-1)?.length)
console.log('é'.length, 'e\u0301'.length)
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
3
128512
2
undefined 1
1 2
```

A占1码元，emoji占2码元，因此length为3；展开按码点得到2项。at(-1)取最后一个码元，不保证取到完整emoji。[]越界返回undefined，不像Python单项越界抛IndexError。这里的展开语法在第13章再讲。

示例 **C07E04**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E04/`。

```javascript
const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' })
const text = 'e\u0301👨‍👩‍👧‍👦'
const segments = Array.from(segmenter.segment(text), (item) => item.segment)
console.log(segments.length)
console.log(segments.join(' / '))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
2
é / 👨‍👩‍👧‍👦
```

字素分段把组合的é和家庭emoji分别作为用户感知单位。本例要求运行环境提供相应Intl能力。标题长度限制应先说清采用哪种单位，不要用“JavaScript不支持中文”解释计数差异。`Array.from`把可迭代结果收集为数组，第11章展开。

### 7.3 查找、截取和替换

includes回答是否包含，indexOf给第一次位置或-1，slice按起止位置返回新字符串且不含结束位置。replace替换一次字符串匹配；replaceAll替换全部字符串匹配。原文本都不因此改变。

示例 **C07E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E05/`。

```javascript
const title = 'JavaScript入门：JavaScript练习'
console.log(title.includes('入门'), title.indexOf('不存在'))
console.log(title.slice(0, 10))
console.log(title.slice(-2))
console.log(title.replace('JavaScript', 'JS'))
console.log(title.replaceAll('JavaScript', 'JS'))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
true -1
JavaScript
练习
JS入门：JavaScript练习
JS入门：JS练习
```

indexOf的-1不能直接当真假判断：-1是真值而位置0是假值。slice允许负位置和超范围截断，仍按码元索引。replace若使用正则有额外规则，第22章专讲；不要将字符串替换误认成通用解析器。

### 7.4 拆分、拼接和显示工具

split把字符串拆成数组，join把数组元素连成字符串。startsWith/endsWith判断边界，padStart/padEnd帮助对齐，repeat重复文本。方法名看起来相似，接收者却可能是不同类型。

示例 **C07E06**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E06/`。

```javascript
const tags = 'js, node,web'.split(',')
console.log(tags.length)
console.log(tags.join(' | '))
console.log('task.mjs'.startsWith('task'), 'task.mjs'.endsWith('.mjs'))
console.log('7'.padStart(3, '0'))
console.log('='.repeat(5))
console.log('JavaScript'.toLowerCase())
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
3
js |  node | web
true true
007
=====
javascript
```

split不会替每一项自动trim，所以第二项仍有前导空格。第14章学map后可逐项清理。padStart按码元目标长度工作，不保证终端中中文与英文视觉宽度完全一致；显示对齐与字符计数是两个问题。

### 7.5 规范化与编码

规范化用于把某些不同码点序列转换到统一形式；它不等于忽略大小写或删除所有标点。UTF-8编码把字符串转为字节，TextEncoder/TextDecoder是宿主提供的Web兼容接口，并非ECMA-262语言对象。

示例 **C07E07**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E07/`。

```javascript
const composed = 'é'
const decomposed = 'e\u0301'
console.log(composed === decomposed)
console.log(composed.normalize('NFC') === decomposed.normalize('NFC'))
console.log('abc'.isWellFormed())
console.log('\uD800'.isWellFormed())
console.log('\uD800'.toWellFormed().codePointAt(0).toString(16))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
false
true
true
false
fffd
```

孤立高代理码元不是良构Unicode字符串；toWellFormed用替换字符修复。NFC规范化不是万能“相同文本判断”，业务仍需决定空白、大小写、地区和标点规则。

示例 **C07E08**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch07/C07E08/`。

```javascript
const text = '中A'
const bytes = new TextEncoder().encode(text)
console.log(text.length, bytes.length)
console.log(Array.from(bytes).join(','))
console.log(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
2 4
228,184,173,65
中A
```

中在UTF-8里占3字节，A占1字节，编码后为4字节；字符串length却是2码元。fatal: true让非法字节解码时抛错，不默默插替换字符。网络与文件要约定编码，不能把字节数当字符数。

### 7.6 动手练习与参考答案

**先独立回答。**

1. title.trim()后title为何仍有空格？

2. A😀的length是多少？

3. split(",")是否自动去除每项空白？

**参考答案与检查。**

1. 字符串不可变，需保存返回值。

2. 3码元；按码点展开为2项；感知字符计数要选择相应分段规则。

3. 不会，应对各项另外trim。

### 7.7 本章速查

| 场景     | 写法或工具                      | 结果与边界             |
| :------- | :------------------------------ | :--------------------- |
| 清理边界 | text.trim()                     | 返回新文本             |
| 查找     | includes / indexOf              | 后者未找到返回-1       |
| 截取     | slice(start, end)               | 不含end；按码元        |
| 全部替换 | replaceAll(search, replacement) | 注意正则参数的额外限制 |
| 连接数组 | items.join(separator)           | 方法属于数组           |
| 编码     | TextEncoder / TextDecoder       | 字节与字符串分开       |

## 第8章 条件判断与输入规则

条件决定程序选择哪条路径。本章仍用文件里提供的输入值练习规则，交互输入在浏览器和Node章节再接入。先让规则可以解释、可以独立检查，再接真实键盘输入。

### 8.1 if、else if和else

if把条件转成真假，满足时执行相应块；else if仅在前面未命中时继续检查；else处理剩余情况。窄条件应放在可能吞掉它的宽条件前。不要把赋值=误写成比较===。

示例 **C08E01**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch08/C08E01/`。

```javascript
const minutes = 90
if (minutes >= 60) {
  console.log('长任务')
} else if (minutes > 0) {
  console.log('短任务')
} else {
  console.log('尚未估算')
}
console.log('判断结束')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
长任务
判断结束
```

只有一个分支执行，最后的输出在if结构之外，总会继续执行。若把minutes > 0放前面，90已经命中，后面的>=60就失去区分机会。

示例 **C08E02**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch08/C08E02/`。

```javascript
const title = '  '
const minutes = 30
if (title.trim().length === 0) {
  console.log('标题不能为空')
} else {
  if (minutes > 0) {
    console.log('可以保存')
  } else {
    console.log('分钟数必须为正')
  }
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
标题不能为空
```

缩进帮助辨认else属于哪个if，花括号给出准确结构。本例先拒绝空标题，就不必继续判断分钟数。函数章节可用提前return减少嵌套。

### 8.2 switch和条件表达式

switch按严格相等规则匹配case；匹配后若没有break会继续执行后面的语句，称为贯穿。条件表达式适合简短的二选一值，不适合堆叠复杂流程。

示例 **C08E03**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch08/C08E03/`。

```javascript
const action = 'list'
switch (action) {
  case 'add':
    console.log('新增任务')
    break
  case 'list':
    console.log('列出任务')
    break
  default:
    console.log('未知命令')
}
console.log(action === 'list' ? '只读操作' : '其他操作')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
列出任务
只读操作
```

default处理未命中情况。switch不会自动把数字1转为字符串1去匹配；条件表达式只计算选中的分支。需要多个语句和错误处理时，普通if更清楚。

示例 **C08E04**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch08/C08E04/`。

```javascript
const level = 'warning'
switch (level) {
  case 'error':
  case 'warning':
    console.log('需要关注')
    break
  case 'info':
    console.log('普通信息')
    break
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
需要关注
```

这里两个空case有意共享处理逻辑，不是忘记break。维护代码时应让这种目的明显，避免非空case意外贯穿造成重复操作。

### 8.3 从文本到合法任务

输入校验分层：先确认类型，再清理文本，拒绝空内容，然后转换并检查数值，最后验证业务范围。比如预计时长要求1—1440的整数分钟；这项约定来自教学项目，不是JavaScript语言限制。

示例 **C08E05**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch08/C08E05/`。

```javascript
const titleInput = '  阅读模块  '
const minutesInput = '25'
if (typeof titleInput !== 'string' || typeof minutesInput !== 'string') {
  console.log('输入类型不正确')
} else {
  const title = titleInput.trim()
  const minutes = Number(minutesInput)
  if (title.length === 0 || minutesInput.trim().length === 0) {
    console.log('标题和分钟数都要填写')
  } else if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
    console.log('分钟数必须是1到1440的整数')
  } else {
    console.log(title, minutes)
  }
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
阅读模块 25
```

先做类型检查，才安全调用trim。`Number.isInteger`也会拒绝NaN和Infinity，所以该例不需要再重复isFinite。更严格的十进制文本格式可以另加规则；这里允许Number接受的完整数值表示，业务约定应说明这一点。

### 8.4 缺失与合法零值

默认值必须对应业务含义。0、false、空字符串不一定都是“没填”；null/undefined也可能有不同含义。用明确条件而不是一概||，让程序能保留用户真实选择。

示例 **C08E06**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch08/C08E06/`。

```javascript
const settings = { reminder: false, estimatedMinutes: 0, note: '' }
console.log(settings.reminder ?? true)
console.log(settings.estimatedMinutes ?? 30)
console.log(settings.note === '' ? '没有备注' : settings.note)
console.log(settings.missing ?? '未配置')
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
false
0
没有备注
未配置
```

本例规定0表示暂未估算、false表示主动关闭提醒、空备注可合法存在。若上一节的“必须1—1440分钟”适用于另一个入口，不能混淆两个契约；项目最终应统一规则或显式区分状态。

### 8.5 综合示例：任务优先级判定

把判定步骤写成互斥规则：无效输入拒绝；已完成显示完成；未完成且时长较长标记拆分；其他有效任务正常进行。先写规则表，再写条件，可以发现遗漏和重叠。

示例 **C08E07**，文件 `demo.mjs`，环境：Node.js。建议保存到：`js-study/examples/ch08/C08E07/`。

```javascript
const task = { title: '阅读异步章节', minutes: 90, done: false }
const validTitle = typeof task.title === 'string' && task.title.trim().length > 0
const validMinutes = Number.isInteger(task.minutes) && task.minutes >= 1 && task.minutes <= 1440
if (!validTitle || !validMinutes || typeof task.done !== 'boolean') {
  console.log('任务无效')
} else if (task.done) {
  console.log('已完成')
} else if (task.minutes >= 60) {
  console.log('建议拆成更小任务')
} else {
  console.log('可以直接开始')
}
```

在该例目录运行：

```powershell
node demo.mjs
```

预期输出：

```text
建议拆成更小任务
```

单独命名validTitle/validMinutes能解释条件，而不是把所有判断挤进一行。逐项替换为0、1440、1441、空白标题和字符串false，可以检查边界；字符串false不应当作布尔false接受。

### 8.6 动手练习与参考答案

1. 把分钟输入改成空白，本章校验会输出什么？答案：标题和分钟数都要填写。

2. switch中case 1能匹配字符串"1"吗？不能，匹配使用严格相等。

3. 给优先级例子设计边界：1、59、60、1440应合法；0、1441、小数、NaN应无效；done为字符串应无效。

### 8.7 本章速查

| 场景        | 写法或工具          | 结果与边界           |
| :---------- | :------------------ | :------------------- |
| 范围分支    | if / else if / else | 先考虑规则覆盖顺序   |
| 离散命令    | switch              | 严格匹配；明确break  |
| 选择一个值  | condition ? a : b   | 只计算被选中的分支   |
| 输入检查    | 类型→清理→转换→范围 | 每层有独立失败原因   |
| 保留false/0 | ??或明确条件        | 业务上可能是合法输入 |

## 第9章 循环与分步解决问题

一项任务可以用一条语句处理，一百项任务需要重复执行同一规则。循环不是把代码无限复制，而是在每轮检查条件、处理数据并推进状态。先用执行表预测，再运行；本章的小数组只用于观察遍历，第11章系统讲数组。

### 9.1 while与do...while

循环是根据条件重复执行代码块。while在每轮之前判断，所以可能一次也不执行；do...while先执行再判断，所以至少执行一次。循环要有能走向结束的状态变化。

示例 **C09E01**，目录 `js-study/examples/ch09/C09E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let remaining = 3
while (remaining > 0) {
  console.log(`还需${remaining}轮`)
  remaining -= 1
}
console.log('结束', remaining)
let count = 0
do {
  console.log('先执行', count)
  count += 1
} while (count < 0)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
还需3轮
还需2轮
还需1轮
结束 0
先执行 0
```

while例子的条件依次读取3、2、1、0；最后一次判断失败，不进入循环体。do例子即使初始判断会失败，也已经输出一次。忘记减少remaining会使条件一直为真，终端可能持续输出；Ctrl+C可以中断，但中断不是正确终止设计。

### 9.2 经典for循环

for把初始化、继续条件和更新放在同一位置。初始化执行一次；每轮先判断，成立才执行循环体，随后更新，再判断。停止值不包含在内是一种常见约定，不是所有循环的自动规则。

示例 **C09E02**，目录 `js-study/examples/ch09/C09E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let total = 0
for (let i = 1; i <= 3; i += 1) {
  total += i
  console.log(i, total)
}
for (let i = 4; i >= 0; i -= 2) console.log('倒数', i)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1 1
2 3
3 6
倒数 4
倒数 2
倒数 0
```

第一轮先让total从0变成1，再输出；第二轮从1变成3。边界由<=决定，若改成<就不包含3。反向循环的步长为负，条件也要配套；i>=0却不断加1不会自然结束。i用let声明，在循环外不能作为普通局部变量读取。

### 9.3 break、continue与嵌套

break结束当前所在循环；continue跳过本轮后续语句，转到下一轮。在for里仍会执行更新表达式。在while里若把状态推进放在continue之后，就可能跳过推进。嵌套循环应先分清每条语句属于哪一层。

示例 **C09E03**，目录 `js-study/examples/ch09/C09E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
for (let i = 0; i < 6; i += 1) {
  if (i === 1) continue
  if (i === 4) break
  console.log(i)
}
for (let day = 1; day <= 2; day += 1) {
  for (let slot = 1; slot <= 3; slot += 1) {
    if (slot === 2) break
    console.log(day, slot)
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
0
2
3
1 1
2 1
```

跳过1后继续处理2和3，到4时整个第一层循环结束。内层遇到slot为2的break只退出内层，因此下一天仍从slot为1开始。不需要为了减少一层缩进同时使用复杂标签跳转；新手先保持流程可追踪。

### 9.4 for...of与for...in初识

数组用方括号保存有顺序的多个值。for...of通常用来取得这些值；for...in枚举可枚举字符串属性键，可能包含继承属性，因此不要把它当成数组专用索引循环。键是文本，值可以是任意类型。

示例 **C09E04**，目录 `js-study/examples/ch09/C09E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const titles = ['阅读', '练习']
for (const title of titles) console.log('值', title)
for (const key in titles) console.log('键', key, typeof key)
titles.extra = '附加属性'
for (const key in titles) console.log('枚举', key)
for (const title of titles) console.log('仍按元素', title)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
值 阅读
值 练习
键 0 string
键 1 string
枚举 0
枚举 1
枚举 extra
仍按元素 阅读
仍按元素 练习
```

extra是数组对象上的额外属性，不是普通元素位置，数组的默认迭代不会把它当第三个元素。先明确“我要值还是键”，再选循环。可迭代协议在第23章展开；普通对象不能因为有几个字段就直接for...of。

### 9.5 典型问题拆解

累计需要一个初始值，计数需要明确哪些数据命中，查找需要表达未找到，范围问题需要检查空输入和最后一项。循环不变量是每轮都保持成立的事实，例如total始终等于已处理数据之和；它帮助你解释正确性。

示例 **C09E05**，目录 `js-study/examples/ch09/C09E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const values = [0, 15, -2, 30]
let total = 0
let positives = 0
let firstLarge = null
for (const value of values) {
  if (value > 0) {
    total += value
    positives += 1
  }
  if (firstLarge === null && value >= 20) firstLarge = value
}
console.log(total, positives, firstLarge)
let emptyTotal = 0
for (const value of []) emptyTotal += value
console.log('空输入', emptyTotal)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
45 2 30
空输入 0
```

先写“仅累计正数”的规则，0和负数就有确定处理方式。null表示尚未找到，不使用0作哨兵，因为0可能是合法结果。空输入保留加法单位元0；求最大值则不能随意用0初始化，因为所有数据可能为负。

### 9.6 动手练习与参考答案

1. 写出for例子的每轮i和total：答案为(1,1)、(2,3)、(3,6)，结束时i变为4后判断失败。
2. 求1到5的和。参考实现：`let sum = 0; for (let i = 1; i <= 5; i += 1) sum += i; console.log(sum)`；应为15。
3. 把while里的更新移到continue后会怎样？若该分支持续命中，更新永远不执行，可能死循环。

### 9.7 本章速查

| 场景     | 做法与返回    | 易错边界           |
| :------- | :------------ | :----------------- |
| 条件重复 | while；先判断 | 可能执行零次       |
| 至少一次 | do...while    | 执行后再判断       |
| 取元素   | for...of      | 对象需有迭代协议   |
| 结束本层 | break         | 不自动结束全部外层 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-iteration-statements)。

## 第10章 函数、参数与返回值

当标题清理、范围检查等逻辑多次出现，就适合把它们放进函数。函数把输入、处理、结果联系起来。先学普通函数和调用，不急着压缩成箭头；后续高阶函数是在同一模型上继续扩展。

### 10.1 定义与调用

函数是可以调用的一段行为。定义给行为命名，并不会立即执行函数体；调用才为本次执行建立形参和局部状态。形参写在定义处，实参写在调用处。函数声明和把函数表达式赋给变量都能创建函数。

示例 **C10E01**，目录 `js-study/examples/ch10/C10E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function cleanTitle(text) {
  console.log('正在处理')
  return text.trim()
}
console.log('定义完成')
console.log(cleanTitle(' 阅读 '))
const double = function (value) {
  return value * 2
}
console.log(double(6))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
定义完成
正在处理
阅读
12
```

先输出“定义完成”，因为前面的声明没有调用函数。cleanTitle的text只属于本次调用；下次可以传另一个字符串。double变量保存的是函数值，double(6)才是调用结果。函数表达式在初始化前不能像函数声明那样使用。

### 10.2 输出与返回分开

`console.log`把值显示给人；return把值交回调用者，并结束当前调用。一个函数可以显示又返回，但要有清楚契约。未执行带值return时，调用结果为undefined，终端出现输出并不意味着函数返回了那个值。

示例 **C10E02**，目录 `js-study/examples/ch10/C10E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function display(value) {
  console.log('显示', value)
}
function total(a, b) {
  return a + b
}
function label(minutes) {
  if (minutes === 0) return '暂不估时'
  return `${minutes}分钟`
}
const shown = display(3)
console.log('返回', shown)
console.log(total(2, 3) * 2)
console.log(label(0), label(25))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
显示 3
返回 undefined
10
暂不估时 25分钟
```

display的显示发生了，但返回值仍是undefined。total没有自己输出，调用者可以继续乘2。return后的同一调用路径不再执行；换行紧接return可能触发自动分号插入，所以返回表达式放在同一行或明确括号内。

### 10.3 参数数量与默认值

JavaScript普通函数不按形参数量自动拒绝调用。缺少的实参通常使形参得到undefined，多余实参仍被传入但不自动成为命名形参。默认参数只在值为undefined时使用，null不会触发。默认表达式在每次需要它时求值。

示例 **C10E03**，目录 `js-study/examples/ch10/C10E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let sequence = 0
function next() {
  sequence += 1
  return sequence
}
function label(title = '未命名', id = next()) {
  return `${id}:${title}`
}
console.log(label())
console.log(label(undefined))
console.log(label(null, 9))
function inspect(a, b) {
  console.log(a, b)
}
inspect(1)
inspect(1, 2, 3)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1:未命名
2:未命名
9:null
1 undefined
1 2
```

示例 **C10E04**，目录 `js-study/examples/ch10/C10E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function collect(value, items = []) {
  items.push(value)
  return items
}
console.log(JSON.stringify(collect('A')))
console.log(JSON.stringify(collect('B')))
const existing = []
console.log(collect('C', existing) === existing)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
["A"]
["B"]
true
```

每次没有提供items时都重新求值[]，所以A和B不共享默认数组；传入existing时则修改指定数组。Python默认参数常在定义时求值，不能套用那条经验。依赖前面形参的默认表达式可以成立，读取尚未初始化的后面形参则可能失败。

### 10.4 参数传递与副作用

传参传递的是值。原始值形参重新赋值不改变调用处变量；当值关联对象时，两边能访问同一对象，修改其属性会被双方看到。给形参换成另一个对象，仍只是改变本地形参。副作用是影响返回结果之外的可观察状态。

示例 **C10E05**，目录 `js-study/examples/ch10/C10E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function change(number, task) {
  number = 99
  task.done = true
  task = { done: false }
  console.log('函数内', number, task.done)
}
let count = 1
const original = { done: false }
change(count, original)
console.log('调用后', count, original.done)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
函数内 99 false
调用后 1 true
```

original仍指向原任务，而原任务的done已经修改。不要用“对象按引用传递”暗示函数可以替换调用者变量；关键是共享对象和局部重绑的区别。Java与Python对照也要分别按各自模型解释，而不是把术语当作结果证明。

### 10.5 契约、纯函数与递归导引

契约描述输入类型、有效范围、返回值和失败方式。纯函数在相同输入下给出相同结果，且不修改外部可观察状态；这让测试更容易。递归是函数调用自己，必须朝终止条件缩小问题，并考虑调用栈限制。

示例 **C10E06**，目录 `js-study/examples/ch10/C10E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function countMinutes(values) {
  let sum = 0
  for (const value of values) sum += value
  return sum
}
function factorial(n) {
  if (!Number.isInteger(n) || n < 0 || n > 10) return null
  if (n === 0) return 1
  return n * factorial(n - 1)
}
console.log(countMinutes([10, 20]), countMinutes([]))
console.log(factorial(4), factorial(-1))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
30 0
24 null
```

countMinutes的契约要求数组元素为合法数值；实际外部输入要增加校验。阶乘每次n减1，到0返回1，再逐层算回。此处限制到10是教学输入约定，不是JavaScript所有递归的统一上限。大规模线性递归通常用循环更易控制。

### 10.6 动手练习与参考答案

**先独立回答。**

1. 只在函数里`console.log(5)`，调用结果是什么？

2. `label(null, 9)`为什么不显示默认标题？

3. 给collect传入同一个数组两次会怎样？

**参考答案与检查。**

1. undefined。要交回数值应写return 5。

2. null不是undefined。

3. 会把两项加入该数组；默认数组每次新建不代表显式传入的数组被复制。

#### 10.6.1 独立练习：把输入变成可用的时长【阶段二检查】

题目：编写parseMinutes(text)，接受非空文本，得到0—1440的整数；拒绝空白、12px、小数和超范围输入。先自行实现，再对照下面参考。此题允许Number接受的完整数值表示，若业务只接受十进制数字，应另加格式规则。

示例 **C10E07**，目录 `js-study/examples/ch10/C10E07/`，环境：Node.js。文件 `demo.mjs`：

```javascript
function parseMinutes(text) {
  if (typeof text !== 'string' || text.trim() === '') throw new TypeError('请输入分钟文本')
  const value = Number(text)
  if (!Number.isInteger(value) || value < 0 || value > 1440) {
    throw new RangeError('分钟数需要0至1440的整数')
  }
  return value
}
console.log(parseMinutes(' 25 '), parseMinutes('0'), parseMinutes('1440'))
for (const text of [' ', '12px', '1.5', '1441']) {
  try {
    parseMinutes(text)
  } catch (error) {
    console.log(JSON.stringify(text), error.name)
  }
}
```

运行`node demo.mjs`，预期：

```text
25 0 1440
" " TypeError
"12px" RangeError
"1.5" RangeError
"1441" RangeError
```

检查方法：另试'-1'和null，应分别进入范围失败与类型失败。能说清为什么先检查空白，再转换和检查范围，才算掌握；把Number转换成功当作校验通过不算完成。

### 10.7 本章速查

| 场景       | 做法与返回        | 易错边界               |
| :--------- | :---------------- | :--------------------- |
| 返回结果   | return value      | 结束本次调用           |
| 默认参数   | name = expression | undefined才触发        |
| 减少副作用 | 返回新结果        | 共享嵌套对象仍要检查   |
| 递归       | 缩小问题直到基例  | 受调用栈和输入规模约束 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-function-definitions)。

## 第11章 数组与有序数据

数组适合保存多项有顺序的数据。本章不把每个方法当成孤立单词：每次都问“有没有改变原数组、返回了什么、位置是否变化”。任务的永久身份不能依赖容易变化的数组下标。

### 11.1 创建、索引与length

数组索引从0开始。length通常比最大有效索引大1，不等于所有自有属性的数量。读取不存在位置得到undefined；稀疏数组的缺项和显式存入undefined并不完全相同。

示例 **C11E01**，目录 `js-study/examples/ch11/C11E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const tasks = ['阅读', '练习']
console.log(tasks[0], tasks.length, tasks[5])
const sparse = new Array(3)
const explicit = [undefined, undefined, undefined]
console.log(sparse.length, 0 in sparse, 0 in explicit)
sparse[5] = '结束'
console.log(sparse.length)
tasks.length = 1
console.log(JSON.stringify(tasks))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
阅读 2 undefined
3 false true
6
["阅读"]
```

new Array(3)建立长度为3的缺项数组，不是包含数值3的一项数组。缩短length会删除越界元素，不是隐藏它们。初学主线优先用字面量和明确添加，减少稀疏行为带来的意外。

### 11.2 增删改查与返回值

push/unshift加入元素并返回新长度；pop/shift移除一个元素并返回该元素。splice在原数组替换范围并返回移除项；slice复制指定范围成新外层数组，结束下标不包含。

示例 **C11E02**，目录 `js-study/examples/ch11/C11E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const values = ['A', 'B']
console.log(values.push('C'))
console.log(values.pop())
console.log(values.unshift('开始'))
console.log(values.shift())
console.log(JSON.stringify(values.splice(1, 1, 'X', 'Y')))
console.log(JSON.stringify(values))
console.log(JSON.stringify(values.slice(0, 2)))
console.log(JSON.stringify(values.slice(-1)))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
3
C
3
开始
["B"]
["A","X","Y"]
["A","X"]
["Y"]
```

splice第二个参数是删除数量，slice第二个参数是结束位置，两者不能混用。空数组pop/shift返回undefined。原地方法返回长度或删除值，不表示返回新数组；把push结果重新赋给原变量会丢掉数组引用。

### 11.3 遍历和查找

for...of直接取值；entries给出位置和值的成对结果。includes回答是否包含，indexOf给出首次位置或-1。检查结果是否为-1，不能直接把下标当布尔值，因为首项位置0是假值。

示例 **C11E03**，目录 `js-study/examples/ch11/C11E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const values = ['A', 'B', 'A']
for (const pair of values.entries()) console.log(pair[0], pair[1])
console.log(values.includes('A'), values.indexOf('A'), values.indexOf('X'))
console.log([NaN].includes(NaN), [NaN].indexOf(NaN))
console.log([].includes('A'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
0 A
1 B
2 A
true 0 -1
true -1
false
```

includes使用SameValueZero，所以能找到NaN；indexOf使用严格相等比较的相关规则，NaN不会与自身匹配。对象元素比较身份，不自动递归比较字段。数组方法与迭代协议对缺项的处理并非总一致，第14章会通过回调继续观察。

### 11.4 创建、转换和二维数组

`Array.of`明确把参数作为元素；`Array.from`可以从可迭代或数组式数据生成数组。fill把同一个值写到多处，若该值是对象，多处会共享它。创建独立内层数组需要每轮重新建立。

示例 **C11E04**，目录 `js-study/examples/ch11/C11E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(JSON.stringify(Array.of(3)))
console.log(JSON.stringify(Array.from('JS')))
const bad = new Array(2).fill([])
bad[0].push('共享')
console.log(JSON.stringify(bad))
const good = []
for (let i = 0; i < 2; i += 1) good.push([])
good[0].push('独立')
console.log(JSON.stringify(good))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[3]
["J","S"]
[["共享"],["共享"]]
[["独立"],[]]
```

fill([])的[]只求值一次，两行都得到同一个数组。good在每轮执行[]，所以建立不同对象。`Array.from`的映射回调是另一种写法，等第14章理解回调后再用，不把压缩写法当成学习门槛。

### 11.5 位置与稳定ID

下标表达当前排列位置；删除或排序后位置会改变。ID是业务身份，应随记录保存。遍历时从前向后splice可能跳过移到当前位置的下一项；可以反向删除，或通过筛选生成新结果。

示例 **C11E05**，目录 `js-study/examples/ch11/C11E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const tasks = [
  { id: 10, title: 'A' },
  { id: 20, title: 'B' },
]
tasks.splice(0, 1)
console.log(tasks[0].id, tasks[0].title)
const numbers = [1, 2, 3, 4]
for (let i = numbers.length - 1; i >= 0; i -= 1) {
  if (numbers[i] % 2 === 0) numbers.splice(i, 1)
}
console.log(JSON.stringify(numbers))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
20 B
[1,3]
```

任务B从位置1移到0，ID仍为20。反向删除不会影响尚未访问的更小位置。不要把删除按钮上的“第几行”当作永久身份；界面和持久化项目都会使用明确ID。

### 11.6 动手练习与参考答案

**先独立回答。**

1. `[1,2].push(3)`返回什么？

2. 删除数组第0项后，原第1项在哪？

3. 如何创建两个独立空数组？

**参考答案与检查。**

1. 3，即新长度。

2. 位置0；它的业务ID无需变化。

3. 参考本章good循环；`[[], []]`也会分别求值两次。

### 11.7 本章速查

| 场景     | 做法与返回                | 易错边界            |
| :------- | :------------------------ | :------------------ |
| 范围复制 | slice(start,end)          | 新外层数组，end不含 |
| 原地替换 | splice(start,count,items) | 返回删除项          |
| 成员判断 | includes(value)           | 对象仍按身份        |
| 移除尾项 | pop()                     | 空数组返回undefined |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-array-objects)。

## 第12章 对象、属性与结构化记录

任务不只有标题，还包括时间、完成状态和标签。对象用有名字的属性组织这些信息。先学普通数据记录，再学方法；对象不是JSON文本，也不是自动拥有类型检查的数据表。

### 12.1 对象字面量和属性访问

对象字面量用花括号建立记录，属性由键和值组成。点访问适合固定标识符键；方括号会计算其中表达式，适合动态键和含空格的名字。嵌套对象仍是另一对象。

示例 **C12E01**，目录 `js-study/examples/ch12/C12E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const task = {
  title: '学习对象',
  minutes: 25,
  显示名称: '第一项',
  owner: { name: '小明' },
}
const key = 'minutes'
console.log(task.title, task[key], task['显示名称'])
console.log(task.owner.name)
console.log(task.key)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
学习对象 25 第一项
小明
undefined
```

task.key查找名为key的属性；task[key]先读变量key得到minutes，再找该属性。前者不会自动替换变量。嵌套路径中某一段不存在，继续点访问可能抛异常；可选链用于允许缺失的路径，不代替业务验证。

### 12.2 属性增删改查

读取缺失属性通常得到undefined；已存在但值为undefined是另一情况。`Object.hasOwn`只查自身，in还查原型链。delete删除属性，不是把属性值设置成undefined。

示例 **C12E02**，目录 `js-study/examples/ch12/C12E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const task = { title: '阅读', note: undefined }
console.log(task.note, task.missing)
console.log(Object.hasOwn(task, 'note'), Object.hasOwn(task, 'missing'))
console.log('toString' in task, Object.hasOwn(task, 'toString'))
task.minutes = 20
task.title = '复习'
delete task.note
console.log(JSON.stringify(task))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined undefined
true false
true false
{"title":"复习","minutes":20}
```

对象默认继承一些方法，所以in不总适合检查外部数据的必填字段。删除不存在的普通属性通常不会报错；不可配置属性在严格模式下删除可能失败。第17章再解释原型和描述符，当前先坚持自有字段校验。

### 12.3 对象遍历与顺序

`Object.keys`/values/entries分别返回自身可枚举字符串键、值和键值对组成的数组。fromEntries从键值对构造对象；重复键后者覆盖前者。枚举顺序有整数索引键等特殊规则，不把所有键都当插入顺序。

示例 **C12E03**，目录 `js-study/examples/ch12/C12E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const data = { b: 2, 10: '十', 2: '二', a: 1 }
console.log(JSON.stringify(Object.keys(data)))
console.log(JSON.stringify(Object.values({ x: 1, y: 2 })))
for (const pair of Object.entries({ x: 1, y: 2 })) console.log(pair[0], pair[1])
console.log(
  JSON.stringify(
    Object.fromEntries([
      ['a', 1],
      ['a', 3],
    ]),
  ),
)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
["2","10","b","a"]
[1,2]
x 1
y 2
{"a":3}
```

整数索引类键先按数值顺序出现，再处理其他字符串键。Symbol键不在这三个数组中，第18章介绍。需要任意键及更直接的插入顺序语义时考虑Map，而不是把普通对象改造成所有用途的容器。

### 12.4 方法、简写和动态键

属性可以保存函数，作为对象方法调用。变量名与属性名相同时可用简写；计算属性名在建立对象时求值。this先理解为本次方法调用的接收者，具体规则在第16章完整解释。

示例 **C12E04**，目录 `js-study/examples/ch12/C12E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const title = '函数也是值'
const field = 'minutes'
const task = {
  title,
  [field]: 20,
  describe() {
    return `${this.title}：${this.minutes}分钟`
  },
}
console.log(task.describe())
console.log(JSON.stringify(Object.keys(task)))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
函数也是值：20分钟
["title","minutes","describe"]
```

方法定义没有立即执行describe；task.describe()调用时，普通方法的this指向task。把它交给其他地方调用可能丢失接收者。方法会使对象包含行为，JSON序列化通常忽略函数，不能把它当作保存完整对象行为的方式。

### 12.5 模型约束与不可信键

JavaScript允许随时增加普通对象属性，业务模型却应规定允许哪些字段、类型和范围。外部键可能是constructor、**proto**等特殊名字；用自有字段白名单并避免把外部数据直接合并到配置对象。

示例 **C12E05**，目录 `js-study/examples/ch12/C12E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const allowed = ['title', 'minutes', 'done']
const input = JSON.parse('{"title":"阅读","minutes":20,"done":false,"extra":1}')
const unknown = []
for (const key of Object.keys(input)) if (!allowed.includes(key)) unknown.push(key)
console.log(JSON.stringify(unknown))
const counts = Object.create(null)
counts['__proto__'] = 1
console.log(Object.hasOwn(counts, '__proto__'), Object.getPrototypeOf(counts))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
["extra"]
true null
```

本例演示发现未知字段；正式接口应拒绝或有明确忽略策略，不默默改变约定。无原型对象减少继承属性干扰，但仍需要类型和业务校验。后续项目选择白名单记录，不接受任意字段注入。

### 12.6 动手练习与参考答案

**先独立回答。**

1. `task.name`和`task[key]`何时不同？

2. 缺失字段和值为undefined如何区分？

3. JSON解析成功能证明minutes为整数吗？

**参考答案与检查。**

1. 前者固定读取name，后者读取key变量给出的键。

2. `Object.hasOwn`。

3. 不能，还要检查类型、整数性和范围。

### 12.7 本章速查

| 场景     | 做法与返回               | 易错边界               |
| :------- | :----------------------- | :--------------------- |
| 自身字段 | `Object.hasOwn(obj,key)` | 不检查值是否合法       |
| 动态字段 | obj[key]                 | 先计算key表达式        |
| 键值数组 | `Object.entries(obj)`    | 自身、可枚举、字符串键 |
| 删除     | delete obj.key           | 与赋undefined不同      |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-object-objects)。

## 第13章 解构、展开与复制边界

解构和展开能减少重复访问，但它们不会自动完成深复制或数据校验。先画出名字指向哪些对象，再使用简写。本章每种复制都用嵌套修改验证，避免只看外层长得一样就认为相互独立。

### 13.1 解构读取与默认值

解构把结构中的值放进变量。数组按位置，对象按键；可以重命名和设置默认值。默认值只在取到undefined时启用。对null或undefined进行对象解构会失败。

示例 **C13E01**，目录 `js-study/examples/ch13/C13E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const [first, , third = '缺省'] = ['A', 'B']
const { title: name, note = '暂无', minutes = 25 } = { title: '阅读', note: null }
console.log(first, third)
console.log(name, note, minutes)
const {
  owner: { city },
} = { owner: { city: '杭州' } }
console.log(city)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
A 缺省
阅读 null 25
杭州
```

title:name把title属性保存到变量name，不会创建名为title的变量。note已有null，所以不采用默认文本。嵌套解构要求中间结构存在；面对不可信数据应先校验，不用复杂默认值掩盖结构错误。

### 13.2 rest与spread的不同位置

rest把剩余部分收集起来；spread把可展开内容分开提供。函数剩余参数必须在最后。调用和数组展开要求可迭代值；对象展开复制自身可枚举属性，二者要求不同。

示例 **C13E02**，目录 `js-study/examples/ch13/C13E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function sum(first, ...rest) {
  let total = first
  for (const value of rest) total += value
  return total
}
const values = [1, 2, 3]
console.log(sum(...values))
const [head, ...tail] = values
console.log(head, JSON.stringify(tail))
const { title, ...others } = { title: '阅读', minutes: 20, done: false }
console.log(title, JSON.stringify(others))
console.log(JSON.stringify({ ...'JS' }))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
6
1 [2,3]
阅读 {"minutes":20,"done":false}
{"0":"J","1":"S"}
```

rest和spread使用同样三个点，但根据位置表示收集或展开。展开非常大的数组到函数参数可能超过实现限制；求和可以直接循环，不用追求一次展开所有元素。字符串对象展开得到码元索引属性，不等于对象的业务字段。

### 13.3 别名、浅复制和覆盖顺序

赋值只复制值，两个名字可能关联同一个对象。展开和`Object.assign`通常只新建或修改外层，嵌套对象仍共享。后出现的同名字段覆盖前面的值。

示例 **C13E03**，目录 `js-study/examples/ch13/C13E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const original = { title: 'A', detail: { minutes: 20 } }
const alias = original
const copy = { ...original, title: 'B' }
copy.detail.minutes = 30
console.log(alias === original, copy === original)
console.log(original.title, original.detail.minutes)
const target = { x: 1 }
console.log(Object.assign(target, { x: 2, y: 3 }) === target)
console.log(JSON.stringify(target))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
true false
A 30
true
{"x":2,"y":3}
```

copy.title与original.title独立，但detail仍指向同一内层对象。`Object.assign`修改其第一个参数，并非总创建新对象；访问器、setter等也会影响复制行为。浅复制适合明确知道只修改外层字段的情况。

### 13.4 深复制与结构化克隆

structuredClone是浏览器和Node提供的结构化克隆能力，不属于ECMA-262核心函数。它能处理部分循环引用和内置类型，但不复制任意函数、DOM节点或完整类行为。JSON往返是格式转换，不能当通用深复制。

示例 **C13E04**，目录 `js-study/examples/ch13/C13E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const source = { when: new Date('2026-01-01T00:00:00.000Z'), nested: { n: 1 } }
source.self = source
const copy = structuredClone(source)
copy.nested.n = 9
console.log(source.nested.n, copy.nested.n, copy.self === copy)
console.log(copy.when instanceof Date)
try {
  structuredClone(() => 1)
} catch (error) {
  console.log(error.name)
}
console.log(JSON.stringify({ absent: undefined, number: NaN }))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1 9 true
true
DataCloneError
{"number":null}
```

克隆后的循环关系仍指向新图，而不是原对象。Date在结构化克隆后仍是Date；JSON会把它变成字符串，并可能丢字段或改变非有限数值。保存业务数据应定义数据格式，不依赖复制工具猜测你的意图。

### 13.5 不可变更新与冻结

不可变更新是把需要变化的各层重新建立，使旧数据保持可观察不变。`Object.freeze`限制对象自身属性的添加、删除与修改，不自动冻结整个嵌套图。const、freeze和深不可变是三个不同层面的约束。

示例 **C13E05**，目录 `js-study/examples/ch13/C13E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const old = { title: '阅读', detail: { minutes: 20 } }
const next = { ...old, detail: { ...old.detail, minutes: 30 } }
console.log(old.detail.minutes, next.detail.minutes)
const frozen = Object.freeze({ detail: { minutes: 20 } })
frozen.detail.minutes = 40
console.log(frozen.detail.minutes)
try {
  frozen.detail = {}
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
20 30
40
TypeError
```

只改minutes时需要新建detail和外层，不必复制不相关的大图。冻结外层依然允许修改内层对象。深冻结也需处理循环、内置类型等问题，不建议初学阶段编写“对所有值都完美”的通用深冻结函数。

### 13.6 动手练习与参考答案

1. `{...old}`能防止内层数组被修改吗？不能，仍共享。
2. `{note = "缺省"}`遇到null如何？保留null。
3. 要修改old.detail.minutes且保留旧值，参考13.5逐层展开；检查old和next分别显示20、30。

### 13.7 本章速查

| 场景     | 做法与返回           | 易错边界         |
| :------- | :------------------- | :--------------- |
| 解构默认 | name = default       | undefined才触发  |
| 数组展开 | [...iterable]        | 新外层，内层共享 |
| 对象复制 | {...obj}             | 自身可枚举属性   |
| 冻结     | `Object.freeze(obj)` | 浅层，非深不可变 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-destructuring-assignment)、[HTML标准：结构化数据](https://html.spec.whatwg.org/multipage/structured-data.html)。

## 第14章 回调、高阶函数与数据统计

函数也可以作为参数交给另一个函数。接收或返回函数的函数通常称为高阶函数；回调是交给对方按约定调用的函数。本章先用普通循环说明规则，再让数组方法负责遍历，始终追问返回值和是否修改原数据。

### 14.1 函数值、调用与箭头函数

传入show表示交付行为，传入show()表示先调用，再交付结果。箭头函数可省去短表达式的return；有花括号时需要明确return。它的this规则在第16章展开。

示例 **C14E01**，目录 `js-study/examples/ch14/C14E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function apply(value, action) {
  return action(value)
}
const double = (value) => value * 2
console.log(apply(4, double))
console.log(
  apply(4, (value) => {
    return value + 1
  }),
)
console.log(
  apply(4, (value) => {
    value + 1
  }),
)
const wrap = (title) => ({ title })
console.log(JSON.stringify(wrap('阅读')))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
8
5
undefined
{"title":"阅读"}
```

第三个回调有代码块却没有return，因此结果undefined。要简短返回对象字面量，用括号区分对象表达式与函数体。回调参数的含义由调用方约定，不是参数名决定；读方法文档时先看会传入什么。

### 14.2 遍历、筛选、转换和判断

map为每项计算新值；filter保留条件为真的原元素；forEach用于逐项执行，整体返回undefined。find返回首个命中值，findIndex返回位置；some/every在结果已确定时短路。

示例 **C14E02**，目录 `js-study/examples/ch14/C14E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const values = [1, 2, 3]
console.log(JSON.stringify(values.map((n) => n * 2)))
console.log(JSON.stringify(values.filter((n) => n > 1)))
console.log(
  values.find((n) => n > 1),
  values.findIndex((n) => n > 1),
)
console.log(
  values.some((n) => n > 2),
  values.every((n) => n > 0),
)
console.log([].some(Boolean), [].every(Boolean))
console.log(values.forEach(() => {}))
console.log(JSON.stringify(['10', '10', '10'].map((text) => parseInt(text, 10))))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[2,4,6]
[2,3]
2 1
true true
false true
undefined
[10,10,10]
```

空数组every为true，some为false：前者没有遇到反例，后者没有遇到正例。不要直接map(parseInt)，因为map传入的索引会被parseInt当进制参数。map/filter通常跳过稀疏缺项；回调中仍能修改共享对象，所以新数组不代表完全无副作用。

### 14.3 累积、flat和flatMap

reduce把当前累计结果与下一项合成新累计结果。提供初始值能定义空数组的行为；省略初始值且数组无可用元素会抛错。flat按指定深度展开数组，flatMap先映射再展开一层。

示例 **C14E03**，目录 `js-study/examples/ch14/C14E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log([10, 20].reduce((sum, n) => sum + n, 0))
console.log([].reduce((sum, n) => sum + n, 0))
try {
  ;[].reduce((sum, n) => sum + n)
} catch (error) {
  console.log(error.name)
}
console.log(JSON.stringify([1, [2, [3]]].flat()))
console.log(JSON.stringify(['A B', 'C'].flatMap((text) => text.split(' '))))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
30
0
TypeError
[1,2,[3]]
["A","B","C"]
```

reduce不一定更清楚。多步校验或需要提前退出时，普通循环往往更直观。每轮用展开复制越来越大的累计数组可能导致额外成本；选择表达形式时同时考虑可读性与数据规模。

### 14.4 排序、稳定性和非修改方法

sort默认按字符串形式排序并修改原数组。数值升序比较器常写(a,b)=>a-b，返回负、零、正表示先后关系。现代标准要求排序稳定，即比较相等时保留原相对顺序。toSorted等方法产生新数组。

示例 **C14E04**，目录 `js-study/examples/ch14/C14E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const numbers = [10, 2, 1]
console.log(JSON.stringify(numbers.toSorted()))
console.log(JSON.stringify(numbers.toSorted((a, b) => a - b)))
console.log(JSON.stringify(numbers))
console.log(JSON.stringify(numbers.toReversed()))
console.log(JSON.stringify(numbers.toSpliced(1, 1, 7)))
console.log(JSON.stringify(numbers.with(-1, 9)))
const items = [
  { id: 'A', n: 1 },
  { id: 'B', n: 1 },
]
console.log(
  items
    .toSorted((a, b) => a.n - b.n)
    .map((item) => item.id)
    .join(','),
)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[1,10,2]
[1,2,10]
[10,2,1]
[1,2,10]
[10,7,1]
[10,2,9]
A,B
```

默认排序的10会排在2前面；排序器需与业务类型匹配。比较器应保持一致，不要只返回true/false。非修改方法仍是浅复制；with索引越界会抛RangeError，而普通数组读取越界通常得到undefined。

### 14.5 分组和任务统计

统计前要明确口径：统计全部任务还是筛选后的任务、相同标签是否去重、空输入如何表示。`Object.groupBy`返回无原型对象并把分组键转换成属性键；Map.groupBy保存键本身，适合对象键等情况。

示例 **C14E05**，目录 `js-study/examples/ch14/C14E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const tasks = [
  { title: 'A', minutes: 10, done: false },
  { title: 'B', minutes: 20, done: true },
  { title: 'C', minutes: 30, done: false },
]
const pending = tasks.filter((task) => !task.done)
console.log(pending.reduce((sum, task) => sum + task.minutes, 0))
const groups = Object.groupBy(tasks, (task) => (task.done ? 'done' : 'open'))
console.log(Object.getPrototypeOf(groups) === null, groups.open.length)
const map = Map.groupBy(tasks, (task) => task.done)
console.log(map.get(false).length)
console.log(tasks.map((task) => task.title).join(','))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
40
true 2
2
A,B,C
```

filter里的任务对象仍来自原数组，修改pending[0].title会影响原记录。groupBy是分组，不是深复制或聚合求和。没有数据时不应把平均值计算成0/0再展示NaN；要约定“无数据”或其他明确结果。

### 14.6 动手练习与参考答案

1. map回调有花括号但无return会怎样？每项结果为undefined。
2. `[10,2].sort()`为何不是数值升序？默认按字符串；用数值比较器。
3. 过滤未完成任务并求分钟数，检查本章数据应为40，原tasks顺序和字段保持不变。

#### 14.6.1 独立练习：形成一份不改原数据的报告

题目：只统计未完成任务，按分钟从小到大生成标题列表，计算总分钟数，并证明原顺序未改变。输入如下参考实现中的三项记录；先写自己的版本再核对。

示例 **C14E06**，目录 `js-study/examples/ch14/C14E06/`，环境：Node.js。文件 `demo.mjs`：

```javascript
const tasks = [
  { id: 1, title: '模块', minutes: 30, done: false },
  { id: 2, title: '函数', minutes: 10, done: true },
  { id: 3, title: '数组', minutes: 20, done: false },
]
const selected = tasks.filter((task) => !task.done).toSorted((a, b) => a.minutes - b.minutes)
const total = selected.reduce((sum, task) => sum + task.minutes, 0)
console.log(selected.map((task) => task.title).join('、'))
console.log(total)
console.log(tasks.map((task) => task.id).join(','))
console.log([].reduce((sum, task) => sum + task.minutes, 0))
```

运行`node demo.mjs`，预期：

```text
数组、模块
50
1,2,3
0
```

把全部done改成true时，标题列表为空文本、总分钟为0、原ID顺序仍相同。若用sort改了原数组，或忘记reduce初值导致空输入失败，应先定位所用方法是否修改数据。

### 14.7 本章速查

| 场景       | 做法与返回                | 易错边界         |
| :--------- | :------------------------ | :--------------- |
| 映射       | map(callback)→数组        | 回调要返回新值   |
| 筛选       | filter(callback)→数组     | 保留原元素引用   |
| 累计       | reduce(callback, initial) | 空输入依赖初值   |
| 非修改排序 | toSorted(compare)         | 新外层，仍浅复制 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-array.prototype.map)。

## 第15章 作用域、提升与闭包

同名变量为什么有时互不影响，有时又被多个回调共同读取？作用域描述名字可见的范围，闭包把函数与它引用的外部绑定联系起来。本章通过不同调用与循环逐步观察，不把“提升”当成源码真的搬家。

### 15.1 词法作用域和遮蔽

词法作用域根据代码定义时的嵌套关系决定名字查找，而不是调用者临时有哪些变量。模块、函数和块能建立不同范围；内层同名绑定会遮蔽外层，不自动修改外层。

示例 **C15E01**，目录 `js-study/examples/ch15/C15E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const title = '模块'
function show() {
  const title = '函数'
  if (true) {
    const title = '代码块'
    console.log(title)
  }
  console.log(title)
}
function caller() {
  const title = '调用者'
  show()
}
caller()
console.log(title)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
代码块
函数
模块
```

show虽然从caller调用，却查找自己的定义环境，不读取caller的title。顶层.mjs变量属于模块，不会自动成为globalThis属性；浏览器经典脚本的某些全局行为不同，不能拿控制台经验概括全部文件。

### 15.2 提升、初始化和暂时性死区

执行前会建立某些绑定，但不同声明的初始化时机不同。var的函数/全局绑定常先初始化为undefined；let/const在执行到声明初始化前处于暂时性死区，读取会抛ReferenceError。提升是解释机制的简称，不是文本移动。

示例 **C15E02**，目录 `js-study/examples/ch15/C15E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(before)
var before = 3
try {
  console.log(later)
  let later = 4
} catch (error) {
  console.log(error.name)
}
console.log(declared())
function declared() {
  return '函数声明可先调用'
}
if (true) {
  var visible = 5
  let hidden = 6
}
console.log(visible)
try {
  console.log(hidden)
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined
ReferenceError
函数声明可先调用
5
ReferenceError
```

typeof一个真正未声明的名字可返回undefined，但读取处于暂时性死区的let绑定，即使用typeof也会抛错。同一作用域重复let声明通常是早期语法错误；错误程序应放在独立文件，不混进可正常运行例子。

### 15.3 闭包与独立状态

闭包是函数与其外部词法环境的关联。外层调用结束后，只要内部函数仍可到达，相关绑定就可能继续存在。多次调用工厂会建立不同环境；同一环境内多个函数可以共享状态。

示例 **C15E03**，目录 `js-study/examples/ch15/C15E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function makeCounter(start) {
  let count = start
  return function () {
    count += 1
    return count
  }
}
const a = makeCounter(0)
const b = makeCounter(10)
console.log(a(), a(), b(), a())
function makeReader() {
  let title = '旧'
  const read = () => title
  title = '新'
  return read
}
console.log(makeReader()())
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1 2 11 3
新
```

a的三次调用共享同一个count，b使用另一count。read调用时读取绑定当前值“新”，不是创建函数时把“旧”拍成快照。若需要固定一个值，可以建立新的局部绑定，仍需区分对象值是否共享。

### 15.4 循环里的绑定与延迟读取

用var建立多个回调时，它们往往共享同一循环绑定；等循环结束再调用，就读到最终值。for(let...)的相关规则为各轮提供不同绑定。问题的关键是读取时刻和绑定身份，而不是函数在数组里的位置。

示例 **C15E04**，目录 `js-study/examples/ch15/C15E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const oldCallbacks = []
for (var i = 0; i < 3; i += 1) oldCallbacks.push(() => i)
const newCallbacks = []
for (let j = 0; j < 3; j += 1) newCallbacks.push(() => j)
console.log(oldCallbacks.map((fn) => fn()).join(','))
console.log(newCallbacks.map((fn) => fn()).join(','))
function keep(value) {
  return () => value
}
console.log([keep(0), keep(1)].map((fn) => fn()).join(','))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
3,3,3
0,1,2
0,1
```

第一组都读到3，第二组依次0、1、2。用工厂函数每次接收值也能建立独立形参绑定。Python的for没有完全相同的每轮let机制，Java的Lambda捕获又有自己的限制；对照放在本概念之后理解。

### 15.5 封装、生命周期与引用保留

闭包可以只暴露允许的操作，让外部不能直接重绑内部变量。但被引用的大数据也可能因此保持可达；事件监听器、计时器或缓存长期持有函数时，要考虑清理。闭包不是自动的数据保密或持久化方案。

示例 **C15E05**，目录 `js-study/examples/ch15/C15E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function makeTask() {
  let done = false
  return {
    complete() {
      done = true
    },
    status() {
      return done
    },
  }
}
const task = makeTask()
console.log(task.status())
task.complete()
console.log(task.status(), task.done)
let retained = makeTask()
retained = null
console.log(retained)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
false
true undefined
null
```

外部只能通过方法读写本次done，task.done却是另一个普通属性。retained置null只移除这个引用，不证明垃圾回收立即发生，也不影响其他仍持有该对象的引用。浏览器事件和Node资源的解绑在后续章节实际练习。

### 15.6 动手练习与参考答案

**先独立回答。**

1. show从别的函数调用会改用调用者同名变量吗？

2. 把循环let改var再运行，回调结果为什么改变？

3. 闭包返回函数后会自动把数据写文件吗？

**参考答案与检查。**

1. 不会，按词法环境查找。

2. 共享最终绑定与每轮绑定不同。

3. 不会，仍是内存状态。

### 15.7 本章速查

| 场景     | 做法与返回       | 易错边界              |
| :------- | :--------------- | :-------------------- |
| 块级声明 | let/const        | 初始化前不能读取      |
| 词法查找 | 定义位置的外层   | 不按调用者变量查找    |
| 闭包     | 函数关联外部绑定 | 不是自动值快照        |
| 循环回调 | for(let...)      | 每轮绑定规则不同于var |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-environment-records)。

## 第16章 this、调用方式与函数绑定

this不是函数定义旁边最近的对象名。对普通函数，调用方式决定它如何取得接收者；箭头函数则沿词法环境取得this。先用严格模式模块观察普通调用，再依次改变调用形式。

### 16.1 普通调用与方法调用

本书.mjs在严格模式运行，普通函数直接调用时this为undefined。obj.method()以obj作为接收者。方法不天然属于某个固定对象；同一个函数可以临时作为不同对象的属性调用。

示例 **C16E01**，目录 `js-study/examples/ch16/C16E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function read() {
  return this?.title ?? '无接收者'
}
const a = { title: 'A', read }
const b = { title: 'B', read }
console.log(read(), a.read(), b.read())
console.log(this === undefined)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
无接收者 A B
true
```

最后一行是ESM顶层this，不是函数内this。浏览器经典脚本或非严格普通函数可能有不同表现，教学应写明环境。变量a只是这次调用的接收者来源，不是read创建时永久绑定的名字。

### 16.2 取出方法与回调转交

把方法保存到普通变量再调用，相当于普通函数调用；原对象不自动跟随。把它交给数组方法或定时器，也要读调用方规则。可以用包装函数明确安排接收者。

示例 **C16E02**，目录 `js-study/examples/ch16/C16E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const task = {
  title: '阅读',
  describe() {
    return this.title
  },
}
const detached = task.describe
try {
  console.log(detached())
} catch (error) {
  console.log(error.name)
}
const safely = () => task.describe()
console.log(safely())
console.log([1, 2].map(() => task.describe()).join(','))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
TypeError
阅读
阅读,阅读
```

detached函数体尝试读取undefined.title，因此抛TypeError。包装函数在实际执行时重新求值task.describe()，若task后来改变会使用当时对象；bind则在创建绑定函数时固定接收者，两种语义不同。

### 16.3 call、apply与bind

call立即以指定this和逐个参数调用；apply立即调用，但参数通过数组式对象提供；bind返回新函数，保存this及部分前置参数。bind本身不会执行函数体。

示例 **C16E03**，目录 `js-study/examples/ch16/C16E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function describe(prefix, suffix) {
  return `${prefix}${this.title}${suffix}`
}
const task = { title: '阅读' }
console.log(describe.call(task, '[', ']'))
console.log(describe.apply(task, ['(', ')']))
const bound = describe.bind(task, '任务：')
console.log(bound('。'))
console.log(bound.call({ title: '其他' }, '!'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[阅读]
(阅读)
任务：阅读。
任务：阅读!
```

绑定函数再次call也不能替换已绑定的this，但仍可以提供尚未绑定的参数。严格模式下call(null)不会把null变成全局对象。new调用绑定构造函数还有专门规则，日常业务不必混用来制造难题。

### 16.4 箭头函数的词法this与arguments

箭头函数不建立自己的this和arguments，会沿外层词法环境查找。它通常不能用new构造。对象字面量并不为箭头函数建立方法this，所以把所有方法改成箭头可能破坏语义。

示例 **C16E04**，目录 `js-study/examples/ch16/C16E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const wrong = { title: 'A', read: () => this?.title }
console.log(wrong.read())
const task = {
  title: 'B',
  makeReader() {
    return () => this.title
  },
}
const read = task.makeReader()
console.log(read(), read.call({ title: 'C' }))
function inspect() {
  return (() => arguments[0])()
}
console.log(inspect(7))
const Arrow = () => ({})
try {
  new Arrow()
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined
B B
7
TypeError
```

wrong的箭头沿模块环境读取this，不读取wrong。makeReader是普通方法，本次调用this为task，里面的箭头沿该环境读取它。箭头不适合需要动态接收者的方法；适合保留外层上下文的短回调。

### 16.5 new调用与构造返回规则

对可构造函数使用new，通常会创建对象、关联构造函数的prototype、以新对象作为this执行函数体。显式返回对象会替换默认实例；返回原始值通常不会。class会在下一章用更明确语法组织这件事。

示例 **C16E05**，目录 `js-study/examples/ch16/C16E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function Task(title) {
  this.title = title
  return 7
}
const a = new Task('阅读')
console.log(a.title, a instanceof Task)
function Other() {
  this.title = '忽略'
  return { title: '替换对象' }
}
const b = new Other()
console.log(b.title, b instanceof Other)
function Mark() {
  this.value = '构造调用'
}
const Bound = Mark.bind({ value: '不会作为新实例' })
console.log(new Bound().value)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
阅读 true
替换对象 false
构造调用
```

普通函数被new调用与直接调用不是同一种入口。构造函数返回另一个对象会影响原型检查，故业务上避免难以解释的返回规则。instanceof检查相关原型关系，不是对任何外部JSON进行完整模型验证的工具。

### 16.6 动手练习与参考答案

**先独立回答。**

1. 把方法取出为什么可能失败？

2. call能改变箭头函数的this吗？

3. bind后立刻执行了吗？

**参考答案与检查。**

1. 普通调用丢失原接收者。

2. 不能，箭头按词法环境取得。

3. 没有，它返回新函数；需要再调用。

### 16.7 本章速查

| 场景           | 做法与返回     | 易错边界           |
| :------------- | :------------- | :----------------- |
| 方法调用       | obj.method()   | 接收者是obj        |
| 立即指定接收者 | call/apply     | 普通函数规则       |
| 预先绑定       | bind返回新函数 | 不立即执行         |
| 箭头           | 词法this       | 不能当通用构造函数 |

本章参考：[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)。

## 第17章 原型、class与对象组织

前面用对象字面量保存一条任务。本章进一步回答：多条任务怎样共享行为，属性不存在时为什么还能读到方法，以及`class`究竟提供了什么组织方式。先运行例子观察属性来自哪里，再看构造过程；描述符和跨环境问题可以第二遍回读。

### 17.1 原型链与属性查找

对象可以关联另一个对象，后者称为它的原型。读取属性时先查自身，没找到再沿原型链向上找，直到原型为`null`。这是一条查找关系，不是把父对象的属性复制到子对象。`Object.create(proto)`创建一个以`proto`为原型的新对象；`Object.getPrototypeOf`检查关联。

示例 **C17E01**，目录 `js-study/examples/ch17/C17E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const common = { kind: '学习任务' }
const task = Object.create(common)
task.title = '原型'
console.log(task.title, task.kind)
console.log(Object.hasOwn(task, 'kind'))
console.log(Object.getPrototypeOf(task) === common)
// 自身同名属性遮蔽原型，但不修改原型。
task.kind = '选修任务'
console.log(task.kind, common.kind)
delete task.kind
console.log(task.kind)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
原型 学习任务
false
true
选修任务 学习任务
学习任务
```

读取`kind`会向上查找，给`task.kind`赋值在本例中建立自身属性。删除自身属性后，继承值重新可见。`in`检查原型链，`Object.hasOwn`只问自身；遍历外部数据通常更需要后者。原型上若有setter或不可写属性，赋值规则还会受描述符影响，不要把上述普通数据属性例子当成所有属性的通则。

### 17.2 构造函数和prototype

普通可构造函数有一个名为`prototype`的属性，`new`默认用它作为新实例的原型。函数自身的原型与函数的`prototype`属性是两件事。把方法放在后者上，多个实例能通过查找共享同一个函数。

示例 **C17E02**，目录 `js-study/examples/ch17/C17E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function Task(title) {
  this.title = title
}
Task.prototype.describe = function () {
  return `任务：${this.title}`
}
const a = new Task('阅读')
const b = new Task('练习')
console.log(a.describe())
console.log(a.describe === b.describe)
console.log(Object.getPrototypeOf(a) === Task.prototype)
console.log(Object.getPrototypeOf(Task) === Function.prototype)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
任务：阅读
true
true
true
```

`new Task`创建实例后，把实例作为`this`调用`Task`。`describe`中的`this`仍由调用方式决定，方法取出后不会自动记住实例。不要把函数的`prototype`画成函数自身向上查找的箭头；也不需要通过历史访问器`__proto__`修改关联。

### 17.3 class、字段、私有成员和访问器

`class`把构造和方法声明写在一起。`constructor`在构造时初始化，普通方法位于原型，实例字段属于实例。`static`成员属于类本身。`#`开头的私有元素由语言限制访问，字符串键`'#done'`不能访问真正的`#done`。getter像属性读取一样调用，setter像赋值一样调用，仍应保持行为明确。

示例 **C17E03**，目录 `js-study/examples/ch17/C17E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
class Task {
  #done = false
  static category = 'study'
  constructor(title) {
    this.title = title
  }
  complete() {
    this.#done = true
  }
  get status() {
    return this.#done ? '完成' : '待办'
  }
}
const task = new Task('阅读')
console.log(task.status, Task.category)
task.complete()
console.log(task.status)
console.log(Object.hasOwn(task, 'complete'), Object.hasOwn(task, 'title'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
待办 study
完成
false true
```

示例 **C17E04**，目录 `js-study/examples/ch17/C17E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
class Duration {
  #minutes = 0
  set minutes(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError('分钟必须是非负整数')
    }
    this.#minutes = value
  }
  get minutes() {
    return this.#minutes
  }
}
const duration = new Duration()
duration.minutes = 30
console.log(duration.minutes)
try {
  duration.minutes = -1
} catch (error) {
  console.log(error.name)
}
console.log(duration.minutes)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
30
RangeError
30
```

构造类必须用`new`；类体执行在严格模式中。私有字段和普通对象属性的机制不同，不会出现在`Object.keys`里；对象展开也不会复制私有状态。类声明在初始化前不能使用。访问器适合维护约束，但读取属性时偷偷进行网络请求会使代码难以理解。

### 17.4 继承、super与组合

`extends`建立类的继承关系，派生构造器必须在使用`this`之前调用`super()`。重写方法会遮蔽父类实现；`super.method()`保留父类方法访问方式。继承表达“是一种”，组合表达“使用某个能力”。只有需要稳定替换关系时才采用继承，不要为了复用几行代码建立很深的层级。

示例 **C17E05**，目录 `js-study/examples/ch17/C17E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
class Task {
  constructor(title) {
    this.title = title
  }
  describe() {
    return this.title
  }
}
class TimedTask extends Task {
  constructor(title, minutes) {
    super(title)
    this.minutes = minutes
  }
  describe() {
    return `${super.describe()}：${this.minutes}分钟`
  }
}
const task = new TimedTask('阅读', 20)
console.log(task.describe(), task instanceof Task)
// 组合：格式化器不是任务，而是任务显示时使用的能力。
const printer = { format: (value) => `【${value.title}】` }
console.log(printer.format(task))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
阅读：20分钟 true
【阅读】
```

JavaScript没有因为写了`extends`就获得Java式编译期字段类型检查。子类方法对外是否遵守父类约定，需要设计和测试。父类私有字段不能在子类中直接写名字访问；父类公开方法可以访问自己声明的私有字段。

### 17.5 描述符、可枚举性与身份边界【进阶回读】

属性描述符记录属性能否写、能否枚举、能否重新配置，或记录getter/setter。用`Object.defineProperty`创建属性时，省略的布尔标志默认是`false`，与普通对象字面量的常见标志不同。`instanceof`主要检查构造器对应的原型是否在链上，并不是万能类型验证。

示例 **C17E06**，目录 `js-study/examples/ch17/C17E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const task = { title: '阅读' }
Object.defineProperty(task, 'id', { value: 1, enumerable: false })
console.log(JSON.stringify(Object.keys(task)))
console.log(task.id)
console.log(Object.getOwnPropertyDescriptor(task, 'id').writable)
try {
  task.id = 2
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
["title"]
1
false
TypeError
```

示例 **C17E07**，目录 `js-study/examples/ch17/C17E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import vm from 'node:vm'
// 不同realm有各自的内置构造器；这里用Node沙箱制造独立环境。
const foreign = vm.runInNewContext('[1, 2]')
console.log(foreign instanceof Array)
console.log(Array.isArray(foreign))
console.log(Object.prototype.toString.call(foreign))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
false
true
[object Array]
```

realm可以先理解为一套独立全局环境和内置对象；浏览器iframe也可能形成这种边界。检查数组优先`Array.isArray`，检查外部业务记录仍需验证字段。`Object.prototype.toString`也可能受到`Symbol.toStringTag`影响，不能拿一个字符串标签替代完整的数据契约。

**原型关系回看。** 对本章普通Task构造函数创建的实例，可按下图追踪属性查找：

```text
实例task ──原型──→ Task.prototype ──原型──→ Object.prototype ──→ null
函数Task ──原型──→ Function.prototype
    │
    └─ 自身的prototype属性 ──→ Task.prototype
```

两条“原型”线与函数自己的prototype属性不是同一件事。找实例方法时沿第一行查找；把方法取出后this仍按第16章的调用规则决定。此图针对本章普通构造器，不把Proxy、跨realm和自定义原型链都简化为这一种形状。

### 17.6 动手练习与参考答案

**先独立回答。**

1. 预测：给实例新增一个与原型同名的属性，再删除它，原型中的值会变吗？

2. 修改第一例，让`common.kind`变为“复习”。

3. 为`Duration`试传`1.5`、`'30'`和`0`。

4. 为什么不能仅凭`foreign instanceof Array`拒绝外部数组？

**参考答案与检查。**

1. 答案：普通可写数据属性场景下不会；删除实例属性后读取重新沿原型查找。

2. 没有自身`kind`的任务随之读到“复习”，说明不是创建时复制。

3. 前两项被拒绝，`0`合法；最后成功值只在验证通过后修改。

4. 答案：构造器来自不同realm；用`Array.isArray`识别数组，再校验每个元素。

### 17.7 本章速查

| 场景     | 常用写法与返回                             | 边界                        |
| :------- | :----------------------------------------- | :-------------------------- |
| 查原型   | `Object.getPrototypeOf(obj)`返回对象或null | 不是构造函数的prototype属性 |
| 自有属性 | `Object.hasOwn(obj, key)`返回布尔值        | 与沿链检查的in不同          |
| 共享行为 | `class`实例方法或构造器prototype           | 方法取出后仍可能丢失this    |
| 定义属性 | `Object.defineProperty`返回原对象          | 省略的属性标志默认false     |
| 识别数组 | `Array.isArray(value)`返回布尔值           | 不验证元素内容              |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-ordinary-object-internal-methods-and-internal-slots)。

## 第18章 Map、Set、Symbol与弱引用

数组适合按位置组织，普通对象适合固定字段记录。本章学习“按键查找”和“是否出现过”两类需求，并解释为何缓存与垃圾回收不能靠猜测实现。Map/Set是主线；弱引用可以先认识责任边界。

### 18.1 Map与普通对象

Map是键值映射，键可以是对象等任意值。`set`设置并返回Map自身，`get`读取，`has`判断键是否存在，`delete`返回是否删到。读取不存在的键得到`undefined`，所以仅检查读取结果不能区分“没有键”和“已存undefined”。普通对象更适合约定字段的记录，不应把任意用户文本都当作它的属性。

示例 **C18E01**，目录 `js-study/examples/ch18/C18E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const owner = { name: '小明' }
const minutes = new Map([
  [owner, 20],
  ['unknown', undefined],
])
console.log(minutes.get(owner), minutes.has('unknown'), minutes.has('missing'))
console.log(minutes.get({ name: '小明' }))
minutes.set('reading', 30).set('reading', 40)
console.log(JSON.stringify([...minutes.keys()].map((key) => typeof key)))
console.log(minutes.delete('reading'), minutes.size)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
20 true false
undefined
["object","string","string"]
true 2
```

两个内容相同的新对象仍是不同键。Map按首次插入的键顺序迭代；覆盖已有键不会把它移到末尾。`map.x = 1`只建立普通属性，并未插入映射条目。Map的`size`是条目数，不能用`Object.keys(map).length`代替。

### 18.2 Set与去重及集合运算

Set保存不重复的值，常用`add`、`has`、`delete`、`clear`和`size`。Map/Set采用SameValueZero式键比较：NaN能与NaN对应，正负零视为同一键，对象仍按身份区分。Set去重保留首次插入顺序。集合运算适合标签覆盖、共同项和差异项。

示例 **C18E02**，目录 `js-study/examples/ch18/C18E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const tags = new Set(['js', 'web', 'js', NaN, NaN])
console.log(tags.size, tags.has(NaN))
console.log(JSON.stringify([...tags].map(String)))
const a = new Set(['js', 'web'])
const b = new Set(['web', 'test'])
console.log(JSON.stringify([...a.union(b)]))
console.log(JSON.stringify([...a.intersection(b)]))
console.log(JSON.stringify([...a.difference(b)]))
console.log(a.isSubsetOf(a.union(b)))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
3 true
["js","web","NaN"]
["js","web","test"]
["web"]
["js"]
true
```

上例的`union`、`intersection`、`difference`返回新Set，不原地修改`a`。还有对称差`symmetricDifference`、子集/超集与不相交判断；它们在ES2025纳入标准。旧环境可用遍历和`has`实现。集合运算的顺序细节以各方法规则为准，业务展示需要排序时应显式排序。

### 18.3 获取或插入与延迟默认值

计数器、分组和缓存经常先检查键，没有才建立默认值。ES2026为Map/WeakMap加入`getOrInsert`和`getOrInsertComputed`。前者接收已经求值的默认值，后者在缺键时调用计算函数。键存在但值是undefined时也属于“存在”，不会被默认值覆盖。

示例 **C18E03**，目录 `js-study/examples/ch18/C18E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const counts = new Map([['js', 2]])
let calls = 0
function makeDefault() {
  calls += 1
  return 0
}
if (typeof counts.getOrInsertComputed !== 'function') {
  console.log('环境尚不支持getOrInsertComputed')
} else {
  console.log(counts.getOrInsertComputed('js', makeDefault), calls)
  console.log(counts.getOrInsertComputed('web', makeDefault), calls)
  console.log(counts.getOrInsert('web', 99))
}
```

在本例目录执行：

```powershell
node demo.mjs
```

支持本节ES2026方法时，预期依次显示 `2 0`、`0 1`、`0`；不支持时输出提示。正式标准不保证任意已安装Node版本都实现，先检查实际运行环境。

示例 **C18E04**，目录 `js-study/examples/ch18/C18E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const values = new Map([['known', undefined]])
function getOrCreate(map, key, create) {
  if (!map.has(key)) map.set(key, create(key))
  return map.get(key)
}
console.log(getOrCreate(values, 'known', () => 7))
console.log(getOrCreate(values, 'new', (key) => key.length))
console.log(values.size)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined
3
2
```

第二例是旧写法的明确版本，用`has`避免把undefined误判为缺失。`map.get(key) ?? create()`则会替换null/undefined值，也不自动把结果存回Map。默认值若是昂贵操作，区分“计算后传入”和“缺键才计算”能避免多余工作；带副作用的计算函数还要考虑执行次数。

### 18.4 Symbol与协议键

Symbol原始值可用作唯一属性键。两个`Symbol('id')`的描述相同，值仍不同；`Symbol.for`按共享注册键取得Symbol。唯一键不会因为不出现在`Object.keys`中就成为安全的私有字段，反射工具仍能枚举。内置的`Symbol.iterator`等符号用于约定协议，第23章展开。

示例 **C18E05**，目录 `js-study/examples/ch18/C18E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const id = Symbol('id')
const another = Symbol('id')
const task = { title: '阅读', [id]: 7 }
console.log(id === another, Symbol.for('app') === Symbol.for('app'))
console.log(JSON.stringify(Object.keys(task)))
console.log(Reflect.ownKeys(task).length, task[id])
console.log(JSON.stringify(task))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
false true
["title"]
2 7
{"title":"阅读"}
```

Symbol值不能直接与字符串做`+`拼接，调试时显式`String(symbol)`。注册表中的Symbol适合跨模块约定同一键，不适合声称“绝对私有”。JSON默认不保存Symbol属性键，保存之前需要定义业务格式。

### 18.5 弱关联、弱引用与垃圾回收【进阶回读】

WeakMap可把附加信息关联到可弱持有的键而不单凭此关联阻止回收；普通对象是常见键，也允许符合条件的非注册Symbol。WeakSet用于弱成员关系。它们不可枚举，也没有size，因为程序不能观察一个稳定的全部活键清单。WeakRef是弱引用，FinalizationRegistry可登记清理提示，但回调不保证及时甚至一定执行。

示例 **C18E06**，目录 `js-study/examples/ch18/C18E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const meta = new WeakMap()
const task = { title: '阅读' }
meta.set(task, { visits: 1 })
console.log(meta.has(task), meta.get(task).visits)
console.log(meta.delete(task), meta.has(task))
try {
  meta.set('task', 1)
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
true 1
true false
TypeError
```

示例 **C18E07**，目录 `js-study/examples/ch18/C18E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const object = { title: '阅读' }
const weak = new WeakRef(object)
const registry = new FinalizationRegistry((label) => {
  // 这里只能辅助诊断，不能作为保存文件或释放业务锁的必要步骤。
  console.log(`回收提示：${label}`)
})
const token = {}
registry.register(object, 'task', token)
console.log(weak.deref() === object)
console.log(registry.unregister(token))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
true
true
```

第二例保持对象的强引用，随后主动取消登记，故不等待或预测回收。不能用WeakMap实现需要列出所有条目的任务仓库，也不能靠终结回调提交数据。文件、定时器和监听器仍需明确关闭、取消和解绑。

### 18.6 动手练习与参考答案

**先独立回答。**

1. 给Map存入`['a', undefined]`，怎样判断a存在？

2. 两个`{id:1}`放进Set会留下几个值？

3. 将获取默认值的旧函数改成按标签创建数组。

4. 能否用FinalizationRegistry保证程序退出前保存任务？

**参考答案与检查。**

1. 答案：`map.has('a')`，而不是判断`map.get('a') !== undefined`。

2. 答案：两个，因为对象身份不同；按字段去重需要自己定义键规则。

3. 同一标签连续两次返回同一数组，不同标签得到独立数组；创建回调只在缺键时运行。

4. 答案：不能；要在正常控制流中await保存并关闭资源。

### 18.7 本章速查

| 场景     | 常用写法与返回                           | 边界                   |
| :------- | :--------------------------------------- | :--------------------- |
| 查映射   | `map.get(key)`读取，`has`判断存在        | 值undefined不等于缺键  |
| 集合运算 | `union/intersection/difference`返回新Set | ES2025方法；对象按身份 |
| 默认值   | `getOrInsertComputed`缺键时计算          | ES2026；先核对实现支持 |
| 唯一键   | `Symbol(description)`返回新Symbol        | 描述相同不代表相等     |
| 弱关联   | `WeakMap.get/set/has/delete`             | 不能枚举，不预测回收   |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-map-objects)。

## 第19章 异常、错误边界与资源清理

错误处理不是把所有失败藏起来，而是让调用者知道发生了什么，并让资源和数据处在明确状态。前面已经见过内置TypeError；本章学习决定何时抛出、在哪里捕获，以及无论成功失败都该做什么。

### 19.1 返回缺失结果还是抛出异常

“没有找到任务”可能是正常查询结果，可以返回undefined；“标题不是文本”则违反了函数契约，可以抛出TypeError。要先规定失败含义，再选择返回值。若返回错误字符串与正常标题混在一起，调用者很难区分。throw会立即中断当前路径，向调用者传播。

示例 **C19E01**，目录 `js-study/examples/ch19/C19E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function findTask(tasks, id) {
  return tasks.find((task) => task.id === id)
}
function requireTitle(value) {
  if (typeof value !== 'string') throw new TypeError('标题必须是文本')
  const title = value.trim()
  if (title.length === 0) throw new RangeError('标题不能为空')
  return title
}
console.log(findTask([], 1))
console.log(requireTitle('  阅读  '))
try {
  requireTitle(20)
} catch (error) {
  console.log(error.name, error.message)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
undefined
阅读
TypeError 标题必须是文本
```

捕获之后继续执行，不代表原操作成功；调用者应给用户错误信息或采取恢复动作。JavaScript允许throw任意值，但业务代码优先抛Error对象以保留类型、信息和调用栈。返回值约定应在函数文档和测试中明确。

### 19.2 try、catch、finally的控制流

try只保护它执行期间的调用路径，catch接收被抛出的值，finally用于无论成功失败都要尝试的收尾。catch可处理后重新throw。finally中的return或throw会覆盖之前待返回的值或待传播的异常，通常应避免这种写法。

示例 **C19E02**，目录 `js-study/examples/ch19/C19E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function run(value) {
  try {
    console.log('尝试')
    if (value < 0) throw new RangeError('负数')
    return value * 2
  } catch (error) {
    console.log('捕获', error.name)
    return 0
  } finally {
    console.log('收尾')
  }
}
console.log('结果', run(-1))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
尝试
捕获 RangeError
收尾
结果 0
```

示例 **C19E03**，目录 `js-study/examples/ch19/C19E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
// 错误设计演示：finally中的return掩盖了原来的错误。
function hidesFailure() {
  try {
    throw new Error('真正失败')
  } finally {
    return '看似成功'
  }
}
console.log(hidesFailure())
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
看似成功
```

第二例不是推荐做法，它说明“finally一定要写return”是危险误解。若清理自身也失败，需要决定保留主错误、组合错误或记录附加原因；不要无意覆盖最初原因。异常发生在解析源文件之前时，文件内部的try也不能接管整个文件的语法解析失败。

### 19.3 Error、原因链和自定义错误

Error对象通常提供name、message和宿主提供的stack。stack的完整格式不是跨环境固定文本，示例只检查稳定部分。构造Error时传`cause`可保留原始失败；自定义错误通过继承Error命名，帮助上层按责任处理。ES2026的Error.isError可识别真正Error，避免单靠跨realm敏感的instanceof。

示例 **C19E04**，目录 `js-study/examples/ch19/C19E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
class DataError extends Error {
  constructor(message, cause) {
    super(message, { cause })
    this.name = 'DataError'
  }
}
try {
  try {
    JSON.parse('{')
  } catch (cause) {
    throw new DataError('任务数据无法读取', cause)
  }
} catch (error) {
  console.log(error.name, error.message)
  console.log(error.cause instanceof SyntaxError)
  console.log(typeof error.stack)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
DataError 任务数据无法读取
true
string
```

示例 **C19E05**，目录 `js-study/examples/ch19/C19E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const value = new Error('失败')
if (typeof Error.isError === 'function') {
  console.log(Error.isError(value), Error.isError({ name: 'Error' }))
} else {
  console.log('环境尚不支持Error.isError')
}
```

在本例目录执行：

```powershell
node demo.mjs
```

支持Error.isError时预期为 `true false`。伪造name字段不能创建真正的Error；不支持时显示明确提示，不把特性缺失当作业务失败。

只有当新一层补充了有用语境时才包装异常，否则直接重抛更清楚。错误信息不应包含密码或完整敏感文件。cause保存的是原对象，可供日志追踪，最终用户界面通常展示经过选择的简短信息。

### 19.4 把校验与程序缺陷分开

捕获范围越大，越容易把自身代码错误误报为“用户输入错误”。例如把JSON解析和后面几十行处理放在同一catch里，任何TypeError都可能被错误翻译。先在边界校验，局部捕获可预期失败，其他错误继续交给更外层。

示例 **C19E06**，目录 `js-study/examples/ch19/C19E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function parseMinutes(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new TypeError('请输入分钟数')
  }
  const value = Number(text)
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError('分钟必须是正整数')
  }
  return value
}
for (const input of ['20', '', '2.5']) {
  try {
    console.log(parseMinutes(input))
  } catch (error) {
    if (!(error instanceof TypeError || error instanceof RangeError)) throw error
    console.log(error.message)
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
20
请输入分钟数
分钟必须是正整数
```

这里的捕获紧贴我们自己定义的转换契约。若在catch里只写空花括号，程序看似继续运行，却丢失了失败信息。使用默认值恢复必须是业务允许的选择；写入失败后返回成功则会欺骗使用者。

### 19.5 资源清理和所有权

资源是需要主动释放的外部能力，例如文件句柄、定时器或事件监听器。创建资源的一方要明确谁负责清理。垃圾回收负责内存管理，不等于及时关闭外部资源。先用一个模拟资源观察try/finally，后面再替换为真实文件和监听器。

示例 **C19E07**，目录 `js-study/examples/ch19/C19E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function openResource() {
  console.log('打开')
  return {
    close() {
      console.log('关闭')
    },
  }
}
const resource = openResource()
try {
  console.log('处理')
  throw new Error('处理失败')
} catch (error) {
  console.log(error.message)
} finally {
  resource.close()
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
打开
处理
处理失败
关闭
```

若openResource在返回前失败，就没有成功取得资源，清理位置要随获取方式设计。异步关闭需要await，见第28章。显式资源管理using属于后续年度导读，本章主线使用清晰可追踪的try/finally。

### 19.6 动手练习与参考答案

1. “任务不存在”和“标题不是字符串”应一律抛同一种异常吗？参考答案：不应机械统一；先定义查询缺失是否正常，参数类型违反契约可用TypeError。
2. 修改19.2第一例传入2。检查顺序为“尝试”“收尾”“结果 4”，catch不执行。
3. 删除错误包装中的cause会损失什么？答案：失去从“读取失败”追到原始解析错误的直接链路。
4. 找出空catch、finally返回、把保存失败当成功三种设计的问题。检查：分别涉及信息丢失、覆盖控制流和错误业务状态。

### 19.7 本章速查

| 场景     | 常用写法与返回                  | 边界                           |
| :------- | :------------------------------ | :----------------------------- |
| 拒绝操作 | `throw new Error(message)`      | 优先Error对象而非裸字符串      |
| 局部处理 | `try/catch`                     | 只捕获有处理能力的失败         |
| 必做清理 | `try/finally`                   | finally中避免return/覆盖主异常 |
| 保留原因 | `new Error(message, { cause })` | 日志需筛除敏感信息             |
| 识别错误 | `Error.isError(value)`          | ES2026，检查环境支持           |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-try-statement)。

## 第20章 JSON、数据交换与边界校验

对象是内存中的结构，JSON是可以保存和交换的文本格式。它们看起来相似，但不能互相当成同一种东西。本章先完成对象到文本再到对象的往返，再处理损失、校验和大整数。

### 20.1 JSON与对象字面量

JSON全称JavaScript Object Notation，虽然名称包含JavaScript，却是语言无关的数据格式。JSON键必须用双引号，值仅允许对象、数组、字符串、数值、true、false、null；没有注释、undefined、函数或末尾逗号。不要用eval解析外部文本。

示例 **C20E01**，目录 `js-study/examples/ch20/C20E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const text = '{"title":"阅读","done":false,"minutes":20,"note":null}'
const task = JSON.parse(text)
console.log(typeof text, typeof task)
console.log(task.title, task.done, task.note === null)
try {
  JSON.parse("{'title':'阅读'}")
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
string object
阅读 false true
SyntaxError
```

文件扩展名.json只是标记，仍需按JSON语法解析。`JSON.parse`得到任意合法JSON顶层值，可能只是数字、null或数组，不保证是任务对象。Python用True/None表示的对象经json库转换，JSON文本仍写true/null；Java端也要按协议读取，不直接复制本语言字面量。

### 20.2 序列化、解析与转换回调

序列化是把内存数据编码成可传输表示，`JSON.stringify`返回文本或在某些顶层输入下返回undefined；反序列化是用`JSON.parse`读取文本。第三个stringify参数控制缩进。replacer可以选择/转换字段，reviver在解析期间转换结果，不代表完成业务校验。

示例 **C20E02**，目录 `js-study/examples/ch20/C20E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const task = { title: '阅读', minutes: 20, internal: '临时' }
const text = JSON.stringify(task, ['title', 'minutes'], 2)
console.log(text)
const restored = JSON.parse(text, (key, value) => (key === 'minutes' ? value + 5 : value))
console.log(restored.minutes, restored === task)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{
  "title": "阅读",
  "minutes": 20
}
25 false
```

回调会对结构中多个层级调用，根值对应空键；reviver返回undefined会删除对应属性。别在不清楚调用范围时批量把“像日期”的字符串改成Date。源对象和解析得到的新对象不是同一身份，即便字段值相同。

### 20.3 JSON往返会改变什么

JSON不能表示全部JavaScript值。对象属性中的undefined、函数和Symbol值通常被忽略，数组对应位置变成null；NaN和Infinity被编码成null。Date默认用toJSON产生时间字符串。BigInt和循环引用通常使stringify抛错。因此JSON往返不是通用深复制。

示例 **C20E03**，目录 `js-study/examples/ch20/C20E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(JSON.stringify({ a: undefined, b: NaN, c: () => 1 }))
console.log(JSON.stringify([undefined, Infinity, Symbol('x')]))
console.log(JSON.stringify(new Date('2026-01-01T00:00:00Z')))
for (const value of [
  1n,
  (() => {
    const x = {}
    x.self = x
    return x
  })(),
]) {
  try {
    JSON.stringify(value)
  } catch (error) {
    console.log(error.name)
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"b":null}
[null,null,null]
"2026-01-01T00:00:00.000Z"
TypeError
TypeError
```

示例 **C20E04**，目录 `js-study/examples/ch20/C20E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const original = { when: new Date('2026-01-01T00:00:00Z'), tags: new Set(['js']) }
const restored = JSON.parse(JSON.stringify(original))
console.log(typeof restored.when, JSON.stringify(restored.tags))
const saved = { when: original.when.toISOString(), tags: [...original.tags] }
const loaded = JSON.parse(JSON.stringify(saved))
console.log(loaded.when, loaded.tags[0])
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
string {}
2026-01-01T00:00:00.000Z js
```

第二例给出显式保存格式，读取时再验证并重建需要的类型。Map/Set默认没有可枚举的条目属性可让stringify自动保存。为BigInt统一保存十进制文本通常比偷偷改变全局原型行为更清楚。

### 20.4 解析成功之后继续校验

校验分两层：JSON解析确认文本语法，业务校验确认数据结构和约束。任务文件需要检查顶层格式版本、任务数组、每条记录的字段类型与范围、ID唯一性及未知字段策略。原始输入一旦失败，不应默默改成空列表再覆盖原文件。

示例 **C20E05**，目录 `js-study/examples/ch20/C20E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function readTasks(text) {
  const data = JSON.parse(text)
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('顶层必须是对象')
  }
  if (data.version !== 1 || !Array.isArray(data.tasks)) throw new TypeError('格式不支持')
  const ids = new Set()
  return data.tasks.map((task) => {
    if (task === null || typeof task !== 'object' || Array.isArray(task)) {
      throw new TypeError('任务必须是对象')
    }
    if (!Number.isSafeInteger(task.id) || task.id <= 0 || ids.has(task.id)) {
      throw new RangeError('任务ID无效或重复')
    }
    if (typeof task.title !== 'string' || task.title.trim() === '') {
      throw new TypeError('标题无效')
    }
    if (typeof task.done !== 'boolean') throw new TypeError('完成状态无效')
    ids.add(task.id)
    // 仅重建协议允许的字段，未知字段不进入内部记录。
    return { id: task.id, title: task.title.trim(), done: task.done }
  })
}
const good = '{"version":1,"tasks":[{"id":1,"title":" 阅读 ","done":false}]}'
console.log(JSON.stringify(readTasks(good)))
try {
  readTasks('{"version":1,"tasks":[{"id":1}]}')
} catch (error) {
  console.log(error.message)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[{"id":1,"title":"阅读","done":false}]
标题无效
```

这里选择“忽略未知字段、重建白名单”，有的协议会选择直接拒绝未知字段；两种都必须明确。Object类型判断必须排除null和数组。只验证第一条任务会放过后面的坏数据，检查应覆盖整个集合，再一次性接受。

### 20.5 来源文本与大整数精度

JSON数值文本可能超出Number安全整数范围。普通解析先得到Number，等reviver拿到这个数时精度可能已经丢失。ES2026为`JSON.parse`的原始值reviver提供来源上下文，可读取原数值文本；rawJSON/isRawJSON用于明确嵌入受限制的原始JSON值。它们需要核对运行环境支持，不能因此省去格式校验。

示例 **C20E06**，目录 `js-study/examples/ch20/C20E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let hasSource = false
JSON.parse('1', (key, value, context) => {
  hasSource = context?.source === '1'
  return value
})
if (!hasSource) {
  console.log('环境尚不支持JSON来源上下文')
} else {
  const data = JSON.parse('{"id":9007199254740993}', (key, value, context) =>
    key === 'id' ? BigInt(context.source) : value,
  )
  console.log(data.id.toString())
}
```

在本例目录执行：

```powershell
node demo.mjs
```

支持来源上下文时输出 `9007199254740993`；回调对对象、数组等复合值没有同样的source含义，不能无条件访问。

示例 **C20E07**，目录 `js-study/examples/ch20/C20E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
if (typeof JSON.rawJSON !== 'function') {
  console.log('环境尚不支持JSON.rawJSON')
} else {
  const raw = JSON.rawJSON('9007199254740993')
  console.log(JSON.isRawJSON(raw))
  console.log(JSON.stringify({ id: raw }))
  try {
    JSON.rawJSON('{"x":1}')
  } catch (error) {
    console.log(error.name)
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

支持时依次输出 `true`、`{"id":9007199254740993}`、`SyntaxError`。rawJSON只接收允许的原始JSON值文本，不是任意对象文本拼接器。

即使精确写出了大整数，接收方若按Number读取仍会丢精度。跨系统协议通常约定ID为字符串更便于兼容；来源文本功能适合必须保留现有数字协议且双方明确处理方式的场景。

### 20.6 动手练习与参考答案

**先独立回答。**

1. `JSON.parse('null')`成功能说明得到任务对象吗？

2. 预测`JSON.stringify({x: undefined})`与`JSON.stringify([undefined])`。

3. 在20.4输入中加入两条相同ID任务。

4. 大整数作为ID为何建议文本协议？

**参考答案与检查。**

1. 答案：不能，结果就是null，仍需结构检查。

2. 分别为`{}`与`[null]`。

3. 整个读取被拒绝；不要只保留第一条后宣布导入成功。

4. 答案：避免接收方语言或JSON库默认数值类型的精度差异，代价是明确进行格式校验。

### 20.7 本章速查

| 场景          | 常用写法与返回                           | 边界                            |
| :------------ | :--------------------------------------- | :------------------------------ |
| 转文本        | `JSON.stringify(value, replacer, space)` | 不是通用深复制                  |
| 读文本        | `JSON.parse(text, reviver)`              | 解析成功不代表数据合法          |
| 验证结构      | 类型、范围、唯一性和版本检查             | 全部通过再接受                  |
| 保存日期/集合 | 显式转为ISO文本/数组                     | 读取后校验并重建                |
| 大整数        | 优先明确字符串协议                       | 来源上下文和rawJSON为ES2026能力 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-json-object)。

## 第21章 日期、时间与国际化

“明天到期”是日历规则，“程序运行了多久”是时间测量，“现在”是一个时刻。把这些问题都当成一个日期字符串容易在时区和夏令时处出错。本章先建立单位与含义，再使用Date和Intl；不要求先掌握完整时区数据库。

### 21.1 时间戳、日期与时区

JavaScript的Date核心保存自1970-01-01T00:00:00Z起的毫秒数，称为时间戳。Z表示UTC基准，不是“没有时区”。同一个时刻可以在不同地区显示成不同日期。只有年月日的截止日期与一个全球确定时刻不是同一数据类型，应先问需求是哪一种。

示例 **C21E01**，目录 `js-study/examples/ch21/C21E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const instant = new Date('2026-01-01T00:00:00Z')
console.log(instant.getTime())
console.log(instant.toISOString())
const inShanghai = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})
console.log(inShanghai.format(instant))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1767225600000
2026-01-01T00:00:00.000Z
08:00
```

显示格式由地区规则决定，存储值不因显示而改变。不要把秒级Unix时间直接传给Date；先按协议乘1000。任务若只约定“2026-01-01当天”，可以先保存严格的年月日字符串，再明确到期判断采用哪个地区的日历。

### 21.2 Date创建、读取和无效值

Date可接收毫秒、标准日期时间字符串，或分开的年月日参数。多参数构造按本地时间解释，月份从0开始；`Date.UTC`使用UTC计算且月份也从0开始。无效Date对象仍是对象，但getTime返回NaN。解析非标准文本可能因实现而不同，应采用协议规定的ISO格式。

示例 **C21E02**，目录 `js-study/examples/ch21/C21E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const date = new Date(Date.UTC(2026, 0, 2, 3, 4, 5))
console.log(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
console.log(date.getUTCHours(), date.toISOString())
const bad = new Date('not-a-date')
console.log(Number.isNaN(bad.getTime()))
try {
  console.log(bad.toISOString())
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
2026 0 2
3 2026-01-02T03:04:05.000Z
true
RangeError
```

示例 **C21E03**，目录 `js-study/examples/ch21/C21E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
// 日期参数会规范化溢出，不能靠“成功构造”证明用户日期存在。
const normalized = new Date(Date.UTC(2026, 1, 30))
console.log(normalized.toISOString())
function isUtcDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}
console.log(isUtcDate(2026, 2, 30), isUtcDate(2026, 2, 28))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
2026-03-02T00:00:00.000Z
false true
```

第二例适用于这里的现代年份；`Date.UTC`对0—99的年份有历史解释规则，通用日期库应额外处理。`getMonth`和`getUTCMonth`也不能混用，前者读取本地分量，后者读取UTC分量。无偏移的日期时间字符串与带Z/偏移的文本有不同解释规则，协议应写清楚。

### 21.3 存储、比较、运算与夏令时

比较时刻可比较毫秒；两个Date对象用===比较的是身份。固定经过24小时是增加86400000毫秒，而本地日历上的“明天同一时刻”在夏令时切换时可能相差23或25小时。Date提供可变setter，修改前若还需要旧值，应先按getTime创建独立副本。

示例 **C21E04**，目录 `js-study/examples/ch21/C21E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const start = new Date('2026-01-01T00:00:00Z')
const end = new Date(start.getTime() + 90 * 60 * 1000)
console.log((end - start) / 60000)
console.log(start === new Date(start.getTime()))
console.log(start.getTime() === new Date(start.getTime()).getTime())
const copy = new Date(start.getTime())
copy.setUTCDate(copy.getUTCDate() + 1)
console.log(start.toISOString(), copy.toISOString())
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
90
false
true
2026-01-01T00:00:00.000Z 2026-01-02T00:00:00.000Z
```

ISO文本用相同规范化格式、同一偏移约定时可以按文本排序，但混合偏移或不完整格式不应这样比较。耗时测量优先用单调时钟performance.now；`Date.now`是墙上时钟，可能受系统校时影响，性能章节继续讨论。

### 21.4 Intl的显示、排序与分段

Intl是ECMAScript国际化能力集合，由ECMA-402规定。DateTimeFormat按地区和时区显示，NumberFormat格式化数值，Collator比较文字，Segmenter可按用户感知字符等粒度分段。格式化主要产生显示文本，不改变原数值，也不是通用解析器。

示例 **C21E05**，目录 `js-study/examples/ch21/C21E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const number = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
})
console.log(number.format(12.5))
const collator = new Intl.Collator('en', { sensitivity: 'base' })
console.log(collator.compare('A', 'a') === 0)
const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' })
const text = 'e\u0301😀'
console.log(text.length, [...segmenter.segment(text)].length)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
12.50
true
4 2
```

示例 **C21E06**，目录 `js-study/examples/ch21/C21E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const instant = new Date('2026-06-01T12:00:00Z')
const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const parts = Object.fromEntries(
  formatter
    .formatToParts(instant)
    .filter((part) => part.type !== 'literal')
    .map((part) => [part.type, part.value]),
)
console.log(`${parts.year}-${parts.month}-${parts.day}`)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
2026-06-01
```

自动化检查若需要协议文本，优先自行规定格式或用formatToParts取所需分量，不要硬拆本地化标点。不同运行环境的Unicode/CLDR数据升级可能影响文字排序和分段，尤其生僻组合；报告中记录实际环境，业务需要稳定排序时另定义确定键。

### 21.5 任务截止时间与可重复判断

依赖当前真实时间的例子每天可能得到不同结果。把“现在”作为参数传入，测试就能固定时刻。判断到期前先验证输入，明确等于截止时间算不算到期。本例约定存储带Z的完整时刻，等于截止时刻即到期。

示例 **C21E07**，目录 `js-study/examples/ch21/C21E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function isDue(task, nowMs) {
  const due = Date.parse(task.dueAt)
  if (!Number.isFinite(due) || !Number.isFinite(nowMs)) {
    throw new RangeError('时间无效')
  }
  return !task.done && due <= nowMs
}
const task = { done: false, dueAt: '2026-01-02T00:00:00Z' }
console.log(isDue(task, Date.parse('2026-01-01T00:00:00Z')))
console.log(isDue(task, Date.parse('2026-01-02T00:00:00Z')))
console.log(isDue({ ...task, done: true }, Date.parse('2026-01-03T00:00:00Z')))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
false
true
false
```

这里假定task已通过记录结构校验；本函数只关心到期规则。若允许任意日期字符串，还要严格校验协议格式，不能仅靠`Date.parse`。日历日期、重复日程和跨时区规则更复杂，后续Temporal导读提供另一种建模方向。

### 21.6 动手练习与参考答案

**先独立回答。**

1. 时间戳1767225600能直接当成本书Date毫秒参数吗？

2. 为什么`new Date(2026, 1, 30)`不一定报错？

3. 将到期规则改为“严格晚于截止时刻”。

4. 预测由2个码点构成的e加组合重音的length和感知字符数。

**参考答案与检查。**

1. 答案：不能；若协议单位是秒，先乘1000。

2. 答案：Date会规范化超范围分量，需反查年月日验证。

3. 把`due <= nowMs`改成`due < nowMs`，相等时应为false，并补该边界检查。

4. 在该例中length为2，Segmenter得到1个字素。

### 21.7 本章速查

| 场景     | 常用写法与返回                              | 边界                   |
| :------- | :------------------------------------------ | :--------------------- |
| 存时刻   | `date.toISOString()`返回UTC文本             | 无效Date会抛RangeError |
| 取时间戳 | `date.getTime()`返回毫秒                    | 无效日期返回NaN        |
| UTC分量  | `getUTCFullYear/getUTCMonth/getUTCDate`     | 月份从0开始            |
| 本地化   | `new Intl.DateTimeFormat(...).format(date)` | 显式指定地区与时区     |
| 稳定测试 | 把now作为参数传入                           | 分清等于边界是否到期   |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-date-objects)、[ECMAScript国际化API规范](https://402.ecma-international.org/)。

## 第22章 正则表达式与文本校验

正则表达式用一套模式描述文字规则，例如“两个大写字母后跟三位数字”。它适合局部格式匹配，不会自动理解业务。学习时先给出短而明确的输入集合，逐项验证，再扩大模式。

### 22.1 模式、字符类、量词与锚点

正则字面量写成`/模式/`，构造器写成`new RegExp(文本)`。字符类`[A-Z]`匹配一个范围内字符，量词`{2}`重复两次，`^`和`$`约束位置。若没有锚点，test只要在输入某处找到匹配即可。括号分组可用于提取和组合，点号通常匹配除行终止符之外的字符。

示例 **C22E01**，目录 `js-study/examples/ch22/C22E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const code = /^[A-Z]{2}\d{3}$/
for (const input of ['JS123', 'xJS123', 'JS12', 'js123']) {
  console.log(input, code.test(input))
}
const pair = /^(\w+):(\d+)$/
const match = pair.exec('task:20')
console.log(match[1], Number(match[2]))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
JS123 true
xJS123 false
JS12 false
js123 false
task 20
```

代码里的反斜杠是正则语法；构造器字符串还要先经过字符串转义，通常需写`'\d'`才产生正则的`\d`。`\w`和`\d`不是“所有语言的字母与数字”，按业务需求选择Unicode属性或显式范围。

### 22.2 标志、Unicode与匹配位置

标志i忽略大小写，g全局，m让锚点按行工作，s让点包含行终止符，u/v启用相应Unicode模式，y从lastIndex位置粘连匹配，d提供匹配索引。u与v互斥。Unicode属性转义和v集合表达可处理更明确的文字范围，仍不等于自然语言分词。

示例 **C22E02**，目录 `js-study/examples/ch22/C22E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(/^js$/i.test('JS'))
console.log(/^b$/m.test('a\nb\nc'))
console.log(/^a.b$/s.test('a\nb'))
console.log(/^\p{Letter}+$/u.test('学习JavaScript'))
const match = /(?<name>JS)(\d+)/d.exec('JS20')
console.log(JSON.stringify(match.indices[1]), match.groups.name)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
true
true
true
true
[0,2] JS
```

示例 **C22E03**，目录 `js-study/examples/ch22/C22E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const consonant = /^[[\p{ASCII}&&\p{Letter}]--[AEIOUaeiou]]$/v
console.log(consonant.test('b'), consonant.test('a'), consonant.test('中'))
const sticky = /\d+/y
sticky.lastIndex = 1
console.log(sticky.exec('x20y')[0], sticky.lastIndex)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
true false false
20 3
```

第二例的集合运算在v模式中使用，应避免把复杂集合直接复制到u模式。m改变锚点，不使点跨行；s改变点，不改变锚点。模式支持不确定时可用构造器在try/catch中检测，不支持的字面量可能使整个文件解析失败。

### 22.3 查找、提取与替换API

test返回是否匹配，exec返回匹配数组或null。字符串的match、matchAll、search和replace提供不同结果：matchAll返回可迭代匹配，正则参数需有g；replace可用函数计算替换，函数返回值成为新文本。字符串不会原地改变。

示例 **C22E04**，目录 `js-study/examples/ch22/C22E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const text = '阅读:20 练习:30'
const pattern = /(?<title>[^\s:]+):(?<minutes>\d+)/g
const tasks = [...text.matchAll(pattern)].map((match) => ({
  title: match.groups.title,
  minutes: Number(match.groups.minutes),
}))
console.log(JSON.stringify(tasks))
console.log(text.search(/练习/))
const changed = text.replace(/\d+/g, (digits) => String(Number(digits) + 5))
console.log(changed)
console.log(text)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[{"title":"阅读","minutes":20},{"title":"练习","minutes":30}]
6
阅读:25 练习:35
阅读:20 练习:30
```

命名分组提高规则可读性。若只是查找固定文本，includes或indexOf通常更直接；为了使用一个正则而引入复杂转义没有收益。替换字符串中`$1`等有特殊含义，替换函数则能明确返回字面文本。

### 22.4 lastIndex、动态模式与转义

带g/y的RegExp是有状态对象，test/exec可能读写lastIndex。把同一个全局正则当成多次独立校验器会出现交替结果。动态拼模式时，用户文本里的点、括号等不能直接当模式，ES2025的RegExp.escape可把文本安全转成模式片段。

示例 **C22E05**，目录 `js-study/examples/ch22/C22E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const pattern = /a/g
console.log(pattern.test('a'), pattern.lastIndex)
console.log(pattern.test('a'), pattern.lastIndex)
pattern.lastIndex = 0
console.log(pattern.test('a'))
const keyword = 'a.b'
const safe = new RegExp(RegExp.escape(keyword), 'u')
console.log(safe.test('a.b'), safe.test('axb'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
true 1
false 0
true
true false
```

示例 **C22E06**，目录 `js-study/examples/ch22/C22E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const input = 'ab'
// matchAll正确推进零长度匹配，避免手写exec循环原地停留。
const positions = [...input.matchAll(/(?=.)/gu)].map((match) => match.index)
console.log(JSON.stringify(positions))
const byConstructor = new RegExp('^\\d{2}$')
console.log(byConstructor.test('20'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[0,1]
true
```

RegExp.escape处理的是模式片段，不是HTML转义或SQL参数绑定。手写只替换几个元字符可能漏掉拼接边界。手写exec循环若模式可匹配空文本，需要正确推进索引并考虑Unicode；初学阶段优先matchAll。

### 22.5 格式规则、业务规则和性能边界

格式像“1—3位十进制数字”，业务规则像“分钟数1—180”。先限制输入长度，再匹配，再转换和检查范围。正则不是递归JSON解析器，也不适合独立校验完整HTML。某些嵌套量词在长失败输入上可能产生大量回溯，不要拿危险模式做性能挑战。

示例 **C22E07**，目录 `js-study/examples/ch22/C22E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function parseMinutes(text) {
  if (typeof text !== 'string' || text.length > 3 || !/^\d{1,3}$/.test(text)) {
    throw new TypeError('请输入1到3位数字')
  }
  const value = Number(text)
  if (value < 1 || value > 180) throw new RangeError('范围是1到180')
  return value
}
for (const input of ['20', '000', '181', '2x']) {
  try {
    console.log(parseMinutes(input))
  } catch (error) {
    console.log(error.message)
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
20
范围是1到180
范围是1到180
请输入1到3位数字
```

是否允许前导零应由协议决定，本例允许格式后再按数值范围判断。最短的正则不一定最好维护；把复杂业务规则拆成命名检查函数，能给出更具体的错误信息。

### 22.6 动手练习与参考答案

**先独立回答。**

1. `/a/`与`/^a$/`对`'cat'`的结果？

2. 用`/a/g`连续校验多个独立字符串为何有风险？

3. 将分钟上限改成240。

4. 用户搜索词是`[js]`，如何按字面搜索？

**参考答案与检查。**

1. 答案：前者true，后者false。

2. 答案：共享lastIndex；使用无g校验正则或每次明确重置。

3. 180、181、240接受，241和空文本拒绝；格式仍只允许1—3位数字。

4. 答案：固定文本可直接includes；确需正则时用RegExp.escape，而非直接拼接。

### 22.7 本章速查

| 场景     | 常用写法与返回                              | 边界                     |
| :------- | :------------------------------------------ | :----------------------- |
| 判断     | `regexp.test(text)`返回布尔值               | g/y会改变lastIndex       |
| 提取     | `regexp.exec(text)`返回匹配或null           | 先检查null再读分组       |
| 全部匹配 | `text.matchAll(/.../g)`返回迭代器           | 注意输入长度与消费成本   |
| 替换     | `text.replace(pattern, callback)`返回新文本 | 原字符串不修改           |
| 动态片段 | `RegExp.escape(text)`返回模式片段           | ES2025；不是通用安全转义 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-regexp-regular-expression-objects)。

## 第23章 迭代协议、生成器与惰性处理

本章是进阶内容，可以在完成主线项目后回读。for...of不是“数组专属循环”：只要对象遵守迭代协议就能提供一串值。学会协议后，才能解释一次性消费、提前清理和惰性处理。

### 23.1 可迭代对象和迭代器

可迭代对象提供`Symbol.iterator`方法，该方法返回迭代器。迭代器提供next方法，每次返回包含value和done的对象。done为true表示结束。可重复遍历需要每次产生独立迭代状态；返回自身的迭代器通常是一次性消费状态。

示例 **C23E01**，目录 `js-study/examples/ch23/C23E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const range = {
  [Symbol.iterator]() {
    let current = 1
    return {
      next() {
        return current <= 3 ? { value: current++, done: false } : { value: undefined, done: true }
      },
    }
  },
}
console.log(JSON.stringify([...range]))
console.log(JSON.stringify([...range]))
const iterator = range[Symbol.iterator]()
console.log(JSON.stringify(iterator.next()), JSON.stringify(iterator.next()))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[1,2,3]
[1,2,3]
{"value":1,"done":false} {"value":2,"done":false}
```

每次调用`Symbol.iterator`都新建current，所以两次展开独立。若把current放在外层，多个遍历可能互相影响。数组式对象只有length和数字键不代表可迭代；`Array.from`能处理两类输入，展开运算通常要求可迭代。

### 23.2 消费、提前退出与清理

for...of、展开和许多构造器会消费可迭代对象。循环提前break时，若迭代器提供return方法，协议会尝试关闭迭代器。生成器的finally也可借此执行清理，但不是说所有外部资源都会自动管理好，仍需看具体协议和所有权。

示例 **C23E02**，目录 `js-study/examples/ch23/C23E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const iterable = {
  [Symbol.iterator]() {
    let nextValue = 1
    return {
      next() {
        return { value: nextValue++, done: false }
      },
      return() {
        console.log('关闭迭代器')
        return { done: true }
      },
    }
  },
}
for (const value of iterable) {
  console.log(value)
  break
}
console.log(JSON.stringify(Array.from({ 0: 'a', 1: 'b', length: 2 })))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1
关闭迭代器
["a","b"]
```

无限序列不能直接全部展开，否则不会结束。手动调用next后不再使用，是否清理要由调用者决定；不要把for...of的提前关闭规则套到任意手工消费过程。

### 23.3 生成器、暂停和yield委托

function*定义生成器函数。调用它只创建生成器对象，函数体等next推动才开始。yield交出一个值并暂停，局部变量留在本次生成器状态里。yield*把另一个可迭代对象逐项委托出去，return则结束生成器。

示例 **C23E03**，目录 `js-study/examples/ch23/C23E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function* values() {
  console.log('开始')
  yield 1
  yield* [2, 3]
  return 9
}
const iterator = values()
console.log('已创建')
console.log(JSON.stringify(iterator.next()))
console.log(JSON.stringify(iterator.next()))
console.log(JSON.stringify(iterator.next()))
console.log(JSON.stringify(iterator.next()))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
已创建
开始
{"value":1,"done":false}
{"value":2,"done":false}
{"value":3,"done":false}
{"value":9,"done":true}
```

示例 **C23E04**，目录 `js-study/examples/ch23/C23E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function* counter() {
  try {
    let value = 0
    while (true) yield value++
  } finally {
    console.log('生成器收尾')
  }
}
for (const value of counter()) {
  console.log(value)
  if (value === 1) break
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
0
1
生成器收尾
```

for...of不收集done:true那一步的return值，第二例因此只显示yield的内容。同步生成器与async函数都可以“暂停”，但返回对象和驱动协议不同，不能互换。

### 23.4 迭代器辅助方法与惰性计算【进阶回读】

ES2025的Iterator全局及辅助方法让迭代器也能map/filter/take/toArray。map/filter/take通常延迟求值，真正next或toArray消费时才做工作；数组map会立即生成新数组。辅助迭代器会消费上游，不能重复从头读取同一个状态。

示例 **C23E05**，目录 `js-study/examples/ch23/C23E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let calls = 0
const stream = Iterator.from([1, 2, 3, 4])
  .map((value) => {
    calls += 1
    return value * 10
  })
  .filter((value) => value >= 20)
  .take(2)
console.log(calls)
console.log(JSON.stringify(stream.toArray()), calls)
console.log(JSON.stringify(stream.toArray()))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
0
[20,30] 3
[]
```

为了得到两个符合条件的结果，实际处理了1、2、3三项。take限制产出，不一定限制上游扫描次数。不要使用new Iterator直接创建普通实例；本书从`Iterator.from`或生成器获得可用对象。

### 23.5 顺序连接、一次消费和异常【进阶回读】

ES2026的`Iterator.concat`按顺序连接多个可迭代对象，不提前把全部内容做成数组。它适合把多个来源接成一条处理管线。若上游抛错，消费会失败；惰性并不隐藏错误，而是把发生时机移到消费阶段。

示例 **C23E06**，目录 `js-study/examples/ch23/C23E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
if (typeof Iterator.concat !== 'function') {
  console.log('环境尚不支持Iterator.concat')
} else {
  const joined = Iterator.concat([1, 2], new Set([3, 4]))
  console.log(JSON.stringify(joined.take(3).toArray()))
}
```

在本例目录执行：

```powershell
node demo.mjs
```

支持`Iterator.concat`时输出 `[1,2,3]`。take提前结束会按协议关闭其上游，不能把未用部分当成仍可重新开始的数组。

示例 **C23E07**，目录 `js-study/examples/ch23/C23E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function* source() {
  yield 1
  throw new Error('源数据失败')
}
const values = source().map((value) => value * 2)
console.log(values.next().value)
try {
  values.toArray()
} catch (error) {
  console.log(error.message)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
2
源数据失败
```

同步迭代器每次next立即交结果；异步迭代器的next返回Promise，见第28章。选择惰性主要为了控制消费和中间内存，不应为了代码短而让错误时机难以理解。

### 23.6 动手练习与参考答案

**先独立回答。**

1. 两次遍历同一个生成器对象会自动重来吗？

2. 将23.4中的take(2)改为take(1)。

3. 为什么不能把无限counter写成`[...counter()]`？

4. 生成器的return 9为何不出现在for...of中？

**参考答案与检查。**

1. 答案：不会；想重来应重新调用生成器函数创建对象。

2. 结果为[20]，map调用两次。

3. 答案：完整消费永不结束，可能耗尽资源。

4. 答案：循环只处理done:false的产出值。

### 23.7 本章速查

| 场景       | 常用写法与返回                       | 边界                     |
| :--------- | :----------------------------------- | :----------------------- |
| 产生迭代器 | `obj[Symbol.iterator]()`             | 返回对象必须有next       |
| 手动推进   | `iterator.next()`返回步骤对象        | done为true后已结束       |
| 声明生成器 | `function*`与`yield`                 | 调用创建对象，next才驱动 |
| 惰性管线   | `Iterator.from(...).map/filter/take` | ES2025；一次消费         |
| 连接来源   | `Iterator.concat(...)`               | ES2026；核对环境         |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-iterator-objects)。

## 第24章 模块、多文件与程序组织

当所有代码放在一个文件里，状态、规则和显示会互相缠绕。模块为每个文件建立明确接口。先用Node的.mjs完成两个文件，再看浏览器启动方式。浏览器页面结构暂作最小启动容器，第30章逐项解释HTML。

### 24.1 拆文件与模块私有状态

模块导出希望别人使用的名字，没导出的名字只在模块内部可直接访问。路径从导入文件的位置解析，不是从终端当前目录猜测。每个例子放在自己的目录，下面两个文件必须同时存在。

示例 **C24E01**，目录 `js-study/examples/ch24/C24E01/`，环境：Node.js。

文件 `title.mjs`：

```javascript
// 规则放在一个模块中，调用者只依赖公开函数。
const maxLength = 40
export function normalizeTitle(value) {
  if (typeof value !== 'string') throw new TypeError('标题必须是文本')
  const title = value.trim()
  if (title.length === 0 || title.length > maxLength) throw new RangeError('标题长度无效')
  return title
}
```

文件 `main.mjs`：

```javascript
import { normalizeTitle } from './title.mjs'
console.log(normalizeTitle('  阅读  '))
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
阅读
```

`./`说明同目录，扩展名在Node原生相对ESM导入中应明确写出。导入模块不会把它的所有内部变量变成当前文件变量。规范接口可让规则复用于CLI、页面和测试，避免复制校验代码。

### 24.2 导出、重命名与活绑定

命名导出用花括号导入，默认导出用无花括号的本地名字接收；本地可以重命名，模块也可再导出。ESM导入是对导出绑定的只读视图，调用者不能给导入名重新赋值，但导出方改变自身绑定时可看到更新。对象属性是否可变是另一层规则。

示例 **C24E02**，目录 `js-study/examples/ch24/C24E02/`，环境：Node.js。

文件 `counter.mjs`：

```javascript
console.log('模块初始化')
export let count = 0
export function increase() {
  count += 1
}
export default '计数模块'
```

文件 `main.mjs`：

```javascript
import label, { count, increase as add } from './counter.mjs'
import { increase } from './counter.mjs'
console.log(count)
add()
console.log(count)
// 同一URL解析到的同一模块不会因第二条import再初始化一次。
void label
void increase
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
模块初始化
0
1
```

示例 **C24E03**，目录 `js-study/examples/ch24/C24E03/`，环境：Node.js。

文件 `title.mjs`：

```javascript
export const title = '阅读'
```

文件 `index.mjs`：

```javascript
export { title as defaultTitle } from './title.mjs'
```

文件 `main.mjs`：

```javascript
import { defaultTitle } from './index.mjs'
console.log(defaultTitle)
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
阅读
```

这里的export let用于专门展示活绑定，业务接口通常通过函数维护状态更便于约束。导入执行次数以解析后的模块身份为准；给URL加不同查询参数等可能产生不同实例，不能简单断言“相同文件名永远只运行一次”。

### 24.3 Node.js的模块类型与内置模块

.mjs明确ESM，.cjs明确CommonJS；.js由所在包的type等加载规则判断。初学项目显式写`"type":"module"`，避免依赖语法检测。`package.json`是项目元数据JSON文件。`node:`前缀标记Node内置模块，不需要npm安装。

示例 **C24E04**，目录 `js-study/examples/ch24/C24E04/`，环境：Node.js。

文件 `package.json`：

```json
{ "private": true, "type": "module" }
```

文件 `main.js`：

```javascript
import path from 'node:path'
console.log(path.basename('/tasks/reading.txt'))
```

在本例目录执行：

```powershell
node main.js
```

预期输出：

```text
reading.txt
```

示例 **C24E05**，目录 `js-study/examples/ch24/C24E05/`，环境：Node.js。

文件 `value.cjs`：

```javascript
module.exports = { value: 42 }
```

文件 `main.cjs`：

```javascript
// 仅用于识别旧项目，主线仍使用ESM。
const { value } = require('./value.cjs')
console.log(value)
```

在本例目录执行：

```powershell
node main.cjs
```

预期输出：

```text
42
```

CommonJS用require和module.exports，不要在ESM里假定它们自动存在。`package.json`的type影响对应包范围，不是把全电脑.js都改成一种模式。模块文件位置用import.meta.url定位；当前工作目录由`process.cwd`取得，两者可不同。

### 24.4 浏览器模块与最小启动页面

浏览器通过`<script type="module">`加载ESM。它从HTTP URL读取文件，通常不接受Node内置模块或任意npm裸包名；需要URL、import map或构建工具解析。模块请求还受MIME和跨源规则影响。下面完整页面只做启动容器，显示结果由`main.mjs`写入。

#### 24.4.1 先准备共用静态服务【操作前置】

静态服务把目录中的文件按HTTP交给浏览器，页面模块才能按URL加载。先按步骤把它作为工具使用；不要求此时掌握服务内部的文件、网络和异步接口，第34—36章再解释原理。

在第2章创建的`js-study`学习根目录中新建`tools`子目录。把下面全部源码保存到`js-study/tools/serve-examples.mjs`，确认文件扩展名是`.mjs`。这份工具供本册浏览器例子共用；示例页面仍保存在各自目录中。

示例 **C24E06**，文件 `tools/serve-examples.mjs`，环境：Node.js。此文件位于学习根目录下的`tools/`，不是页面目录。

```javascript
// 仅在本机提供教学静态文件；文件、HTTP和异步细节在后续Node章节解释。
import { createServer } from 'node:http'
import { readFile, realpath } from 'node:fs/promises'
import { resolve, sep, extname } from 'node:path'

// --dir指定页面目录，--port指定端口。拒绝拼错或重复参数，避免悄悄启动到错误位置。
const options = new Map()
const args = process.argv.slice(2)
for (let index = 0; index < args.length; index += 2) {
  const key = args[index]
  const value = args[index + 1]
  if (!['--dir', '--port'].includes(key) || options.has(key) || !value || value.startsWith('--')) {
    throw new Error('用法：node tools/serve-examples.mjs --dir 页面目录 --port 3211')
  }
  options.set(key, value)
}
const portText = options.get('--port') ?? '3211'
if (!/^\d+$/.test(portText)) throw new Error('端口必须是0至65535的整数')
const port = Number(portText)
if (!Number.isInteger(port) || port > 65535) throw new Error('端口必须是0至65535的整数')
const root = await realpath(resolve(options.get('--dir') ?? '.'))
const types = {
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}
const server = createServer((request, response) => {
  void handle(request, response).catch((error) => {
    if (response.headersSent) return response.destroy()
    response.writeHead(['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 400)
    response.end('File unavailable')
  })
})
async function handle(request, response) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    return response.end()
  }
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  if (path === '/favicon.ico') {
    response.writeHead(204)
    return response.end()
  }
  const resource = path.endsWith('/') ? `${path}index.html` : path
  const file = await realpath(resolve(root, `.${resource}`))
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403)
    return response.end()
  }
  const type = types[extname(file)]
  if (!type) {
    response.writeHead(403)
    return response.end()
  }
  const data = await readFile(file)
  response.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(request.method === 'HEAD' ? undefined : data)
}
server.requestTimeout = 10000
server.headersTimeout = 5000
server.on('error', (error) => {
  console.error(
    error.code === 'EADDRINUSE'
      ? '端口已占用：先停止自己启动的旧服务，或显式选择另一端口；浏览器存储随来源区分。'
      : error.message,
  )
  process.exitCode = 1
})
server.listen(port, '127.0.0.1', () => {
  console.log(`示例目录：${root}`)
  console.log(`打开：http://127.0.0.1:${server.address().port}/`)
})
process.once('SIGINT', () => server.close())
```

打开终端并进入学习根目录。Windows PowerShell中，若沿用第2章的默认学习位置，可执行：

```powershell
Set-Location -LiteralPath "$env:USERPROFILE\js-study"
Get-Location
Test-Path -LiteralPath '.\tools\serve-examples.mjs'
```

最后一条应为`True`。若你选择了其他学习位置，进入自己的实际目录；macOS/Linux可用`cd "$HOME/js-study"`、`pwd`和`ls tools/serve-examples.mjs`核对。接下来先保存24.4.2的三个页面文件，再执行该节的启动命令。服务启动后会占用当前终端等待请求，这是正常状态；保留终端，去浏览器操作，结束时回到终端按Ctrl+C。

默认端口为3211，也可显式指定`--port 3211`。协议、主机和端口合称来源；浏览器本地存储按来源隔离。学习时统一使用`http://127.0.0.1:3211`，不要无意切成localhost或另一个端口。`--port 0`只用于需要系统分配空闲端口的独立检查，不用作持久化项目的默认启动方式。

#### 24.4.2 保存页面文件并启动【主线】

示例 **C24E07**，目录 `js-study/examples/ch24/C24E07/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>模块练习</title>
  </head>
  <body>
    <p id="result">加载中</p>
    <script type="module" src="./main.mjs"></script>
  </body>
</html>
```

文件 `message.mjs`：

```javascript
export const message = '模块已运行'
```

文件 `main.mjs`：

```javascript
import { message } from './message.mjs'
document.querySelector('#result').textContent = message
```

三个文件保存在`js-study/examples/ch24/C24E07/`。在`js-study`学习根目录的终端执行：

```powershell
node tools/serve-examples.mjs --dir examples/ch24/C24E07 --port 3211
```

终端应显示示例目录和`打开：http://127.0.0.1:3211/`。浏览器访问这个地址，页面应显示“模块已运行”。若显示“加载中”，打开开发者工具检查`main.mjs`及`message.mjs`请求；若终端提示端口已占用，先停止自己之前启动的服务，不自动换端口掩盖问题。结束时Ctrl+C。

模块脚本默认在文档解析后执行，不需要再加defer。import map可将裸名称映射到URL，但不是自动下载所有npm包的魔法。不要双击file://后以失败判断模块语法错误。

### 24.5 动态导入、JSON与循环依赖

`import()`是表达式，返回Promise；静态import声明在模块加载阶段建立依赖。import.meta提供宿主定义的模块元数据。JSON模块用导入属性声明格式，Node要求相应属性。循环依赖并非一律报错，但若在绑定初始化前读取，会遇到暂时性死区；优先抽出共同依赖。

示例 **C24E08**，目录 `js-study/examples/ch24/C24E08/`，环境：Node.js。

文件 `task.json`：

```json
{ "title": "阅读", "minutes": 20 }
```

文件 `format.mjs`：

```javascript
export const format = (task) => `${task.title} ${task.minutes}`
```

文件 `main.mjs`：

```javascript
import task from './task.json' with { type: 'json' }
const { format } = await import('./format.mjs')
console.log(format(task))
console.log(import.meta.url.endsWith('/main.mjs'))
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
阅读 20
true
```

这里先展示顶层await的最小效果：等待动态导入完成后再用结果；Promise/await将在第27—28章完整解释。不要把require返回值与import()的Promise当成同一种接口。JSON导入一般有模块缓存，不适合表示需要每次重新读取的可变任务文件，文件读取在Node章节讲。

### 24.6 动手练习与参考答案

**先独立回答。**

1. 改`title.mjs`内部maxLength会让`main.mjs`能直接访问它吗？

2. 为什么导入`./title`可能在工具里可用而Node原生ESM失败？

3. 将`main.js`的`package.json`改为type commonjs。

4. 浏览器显示“加载中”时先查什么？

**参考答案与检查。**

1. 答案：不会，未导出名字仍属于模块内部。

2. 答案：工具可提供扩展名补全，Node原生规则不同；主线写完整扩展名。

3. 静态import不能再按原项目约定运行；改回module，不靠试错混用。

4. 答案：控制台、请求状态、URL、MIME、模块路径与是否用HTTP，再查业务函数。

### 24.7 本章速查

| 场景     | 常用写法与返回                                | 边界                                        |
| :------- | :-------------------------------------------- | :------------------------------------------ |
| ESM文件  | `.mjs`，或`"type": "module"`范围内的`.js`     | 显式配置，避免猜测                          |
| 命名导出 | `export`与`import { name }`                   | 导入绑定不能重赋值                          |
| 内置模块 | `import { readFile } from 'node:fs/promises'` | 浏览器没有同名Node能力                      |
| 动态导入 | `import(url)`返回Promise                      | 与require同步返回不同                       |
| JSON模块 | `with { type: 'json' }`导入属性               | 导入属性值是字符串，Node JSON模块要求此属性 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-modules)、[Node.js v26.13.0：esm](https://nodejs.org/docs/v26.13.0/api/esm.html)、[HTML标准：脚本与事件循环](https://html.spec.whatwg.org/multipage/webappapis.html)。

## 第25章 阶段项目：模块化的内存任务管理器

这是第一份能独立运行的任务管理核心。范围刻意限定为内存：退出后数据消失，浏览器和文件保存留给后续阶段。先把字段和失败规则写清，再组合已有函数、数组、对象、模块和校验知识。

### 25.1 需求与数据契约

任务包含正整数ID、标题、0到1440的整数分钟、标签、布尔完成状态和UTC创建时间。数据包记录格式version与下一个ID。ID表示身份，不随排序变化。未知字段拒绝，空白标题拒绝，重复标签去重。

示例 **C25E01**，目录 `js-study/examples/ch25/C25E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const task = {
  id: 1,
  title: '阅读模块',
  minutes: 25,
  tags: ['基础'],
  done: false,
  createdAt: '2026-11-09T00:00:00.000Z',
}
const store = { version: 1, nextId: 2, tasks: [task] }
console.log(JSON.stringify(store))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"version":1,"nextId":2,"tasks":[{"id":1,"title":"阅读模块","minutes":25,"tags":["基础"],"done":false,"createdAt":"2026-11-09T00:00:00.000Z"}]}
```

这是教学模型，不是所有任务系统的通用标准。标题长度按UTF-16码元计算，最多200；最多1000项、每项最多20个标签。nextId必须大于全部已有ID，删除不回退它。格式版本用于以后迁移，不代表Node版本。

#### 25.1.1 先把状态变化展开【可运行的第一步】

先在一个短文件里观察“创建候选→加入列表→完成→删除→拒绝非法新增”。本例的入口暂时直接管理变量，下一节再将这些动作收拢为纯业务接口。字段沿用完整任务形状，标签暂固定为空数组，创建时间固定以便比较输出。

示例 **C25E02**，目录 `js-study/examples/ch25/C25E02/`，环境：Node.js。文件 `demo.mjs`：

```javascript
function makeTask(id, title, minutes) {
  if (typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 200) {
    throw new TypeError('标题无效')
  }
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 1440) {
    throw new RangeError('分钟无效')
  }
  return {
    id,
    title: title.trim(),
    minutes,
    tags: [],
    done: false,
    createdAt: '2026-11-09T00:00:00.000Z',
  }
}
let tasks = []
let nextId = 1
function append(title, minutes) {
  // 先让所有可能失败的校验完成，成功后才推进列表和ID。
  const candidate = makeTask(nextId, title, minutes)
  tasks = [...tasks, candidate]
  nextId += 1
}
console.log('空表', tasks.length, nextId)
append(' 阅读 ', 25)
append('复习', 0)
console.log('新增', tasks.map((task) => task.id).join(','), nextId)
tasks = tasks.map((task) => (task.id === 1 ? { ...task, done: true } : task))
console.log('完成', tasks[0].done, tasks[1].done)
const open = tasks.filter((task) => !task.done)
console.log(
  '未完成分钟',
  open.reduce((sum, task) => sum + task.minutes, 0),
)
tasks = tasks.filter((task) => task.id !== 1)
console.log('删除后', tasks[0].id, nextId)
try {
  append(' ', 5)
} catch (error) {
  console.log('拒绝', error.message)
}
console.log('失败后', tasks.length, nextId)
```

运行`node demo.mjs`，预期：

```text
空表 0 1
新增 1,2 3
完成 true false
未完成分钟 0
删除后 2 3
拒绝 标题无效
失败后 1 3
```

逐步检查：先读到空表日志；追踪两次append；查看map是否生成新的记录；查看filter删除后nextId为何不回退；最后确认失败没有吃掉ID。这个演算入口只覆盖所展示的输入，完整的未知字段、标签、时间和快照检查在下一节统一处理。

#### 25.1.2 再把入口动作映射到业务模块

| 刚观察的动作        | 下一节的正式接口             | 必须保留的条件                   |
| :------------------ | :--------------------------- | :------------------------------- |
| 建立空列表和ID      | `emptyStore()`               | 格式版本与nextId一起初始化       |
| 验证候选再新增      | `normalizeFields`、`addTask` | 不在校验成功前改变旧状态         |
| map完成、filter删除 | `editTask`、`removeTask`     | ID稳定，不存在的ID有明确失败     |
| filter后累计        | `selectTasks`、`summarize`   | 汇总当前筛选范围，不修改存储顺序 |

下一节完整模块按“错误类型→字段校验→整份快照→增删改→查询统计”排列。第一次只追踪emptyStore与addTask；运行成功后再追踪edit/remove和查询，不必一次记下全部辅助函数。

### 25.2 实现校验与增删改查

下面给出完整业务模块和入口。每次操作返回新外层状态；先校验再修改。InputError把业务错误与普通程序缺陷区分。辅助assert在这里是普通函数名，不是语言内置assert语句。

示例 **C25E03**，目录 `js-study/examples/ch25/C25E03/`，环境：Node.js。

文件 `task-core.mjs`：

```javascript
// 纯业务规则不访问DOM或磁盘，因此浏览器、命令行和服务端可以共同使用。
export class InputError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'InputError'
    this.status = status
  }
}

function assert(condition, message) {
  if (!condition) throw new InputError(message)
}

function exactKeys(value, keys, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label}必须是对象`)
  assert(
    Object.keys(value).every((key) => keys.includes(key)),
    `${label}含未知字段`,
  )
}

export function normalizeFields(value) {
  exactKeys(value, ['title', 'minutes', 'tags', 'done'], '任务字段')
  assert(typeof value.title === 'string', '标题必须是字符串')
  const title = value.title.trim()
  assert(title.length >= 1 && title.length <= 200, '标题需要1至200个UTF-16码元')
  assert(
    Number.isInteger(value.minutes) && value.minutes >= 0 && value.minutes <= 1440,
    '分钟数必须是0至1440的整数',
  )
  assert(typeof value.done === 'boolean', '完成状态必须是布尔值')
  assert(Array.isArray(value.tags) && value.tags.length <= 20, '标签必须是最多20项的数组')
  const tags = value.tags.map((tag) => {
    assert(typeof tag === 'string', '标签必须是字符串')
    const text = tag.trim()
    assert(text.length >= 1 && text.length <= 30, '每个标签需要1至30个UTF-16码元')
    return text
  })
  return { title, minutes: value.minutes, done: value.done, tags: [...new Set(tags)] }
}

export function emptyStore() {
  return { version: 1, nextId: 1, tasks: [] }
}

export function validateStore(value) {
  exactKeys(value, ['version', 'nextId', 'tasks'], '数据文件')
  assert(value.version === 1, '只支持version为1的数据格式')
  assert(Number.isSafeInteger(value.nextId) && value.nextId > 0, 'nextId必须是正安全整数')
  assert(Array.isArray(value.tasks) && value.tasks.length <= 1000, '任务数组最多1000项')
  const seen = new Set()
  const tasks = value.tasks.map((task) => {
    exactKeys(task, ['id', 'title', 'minutes', 'tags', 'done', 'createdAt'], '任务')
    assert(Number.isSafeInteger(task.id) && task.id > 0, '任务ID必须是正安全整数')
    assert(!seen.has(task.id), '任务ID不能重复')
    assert(task.id < value.nextId, 'nextId必须大于所有现有任务ID')
    seen.add(task.id)
    assert(typeof task.createdAt === 'string', 'createdAt必须是ISO时间字符串')
    const date = new Date(task.createdAt)
    assert(
      Number.isFinite(date.getTime()) && date.toISOString() === task.createdAt,
      'createdAt必须是规范的UTC ISO时间字符串',
    )
    const fields = normalizeFields({
      title: task.title,
      minutes: task.minutes,
      tags: task.tags,
      done: task.done,
    })
    return { id: task.id, ...fields, createdAt: task.createdAt }
  })
  return { version: 1, nextId: value.nextId, tasks }
}

export function addTask(store, input, now = new Date().toISOString()) {
  assert(store.tasks.length < 1000, '任务数量已达上限')
  assert(store.nextId < Number.MAX_SAFE_INTEGER, '任务ID已耗尽')
  const fields = normalizeFields(input)
  const task = { id: store.nextId, ...fields, createdAt: now }
  // 返回新数据，保留原store；持久化失败时调用者仍有未修改的旧状态。
  return validateStore({
    ...store,
    nextId: store.nextId + 1,
    tasks: [...store.tasks, task],
  })
}

export function editTask(store, id, patch) {
  exactKeys(patch, ['title', 'minutes', 'tags', 'done'], '修改字段')
  const task = store.tasks.find((item) => item.id === id)
  if (!task) throw new InputError('任务不存在', 404)
  const fields = normalizeFields({
    title: task.title,
    minutes: task.minutes,
    tags: task.tags,
    done: task.done,
    ...patch,
  })
  return {
    ...store,
    tasks: store.tasks.map((item) => (item.id === id ? { ...item, ...fields } : item)),
  }
}

export function removeTask(store, id) {
  if (!store.tasks.some((task) => task.id === id)) throw new InputError('任务不存在', 404)
  return { ...store, tasks: store.tasks.filter((task) => task.id !== id) }
}

export function selectTasks(store, { query = '', status = 'all', sort = 'id' } = {}) {
  assert(['all', 'open', 'done'].includes(status), '筛选状态无效')
  assert(['id', 'title', 'minutes'].includes(sort), '排序字段无效')
  assert(typeof query === 'string', '关键词必须是字符串')
  const keyword = query.trim().toLocaleLowerCase('zh-CN')
  const selected = store.tasks.filter((task) => {
    const matched = `${task.title} ${task.tags.join(' ')}`
      .toLocaleLowerCase('zh-CN')
      .includes(keyword)
    return matched && (status === 'all' || task.done === (status === 'done'))
  })
  return selected.toSorted((a, b) => {
    const result = sort === 'title' ? a.title.localeCompare(b.title, 'zh-CN') : a[sort] - b[sort]
    return result || a.id - b.id
  })
}

export function summarize(tasks) {
  return {
    total: tasks.length,
    done: tasks.filter((task) => task.done).length,
    minutes: tasks.reduce((sum, task) => sum + task.minutes, 0),
  }
}
```

文件 `demo.mjs`：

```javascript
import { emptyStore, addTask, editTask, removeTask } from './task-core.mjs'
let store = emptyStore()
store = addTask(
  store,
  { title: ' 阅读 ', minutes: 25, tags: ['JS'], done: false },
  '2026-11-09T00:00:00.000Z',
)
store = addTask(
  store,
  { title: '练习', minutes: 10, tags: [], done: false },
  '2026-11-09T00:00:00.000Z',
)
store = editTask(store, 1, { done: true })
store = removeTask(store, 2)
console.log(JSON.stringify(store))
try {
  editTask(store, 99, { done: true })
} catch (error) {
  console.log(error.name, error.status)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"version":1,"nextId":3,"tasks":[{"id":1,"title":"阅读","minutes":25,"done":true,"tags":["JS"],"createdAt":"2026-11-09T00:00:00.000Z"}]}
InputError 404
```

normalizeFields处理允许字段，validateStore验证整个快照，add/edit/remove实现操作。exactKeys先排除null与数组，再检查自有键白名单。修改不能更换ID或创建时间。返回新状态不代表全部嵌套对象深复制，因此接口仍要求调用者不要绕过核心任意修改记录。

### 25.3 查询、排序与统计

selectTasks先按关键词及完成状态筛选，再按指定字段生成排序结果；summarize对传入结果汇总。因此“共多少分钟”对应当前筛选范围。标题比较显式使用中文地区约定，同分时按ID，结果不依赖原显示行号。

示例 **C25E04**，目录 `js-study/examples/ch25/C25E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { emptyStore, addTask, selectTasks, summarize } from '../C25E03/task-core.mjs'
let store = emptyStore()
const instant = '2026-11-09T00:00:00.000Z'
for (const minutes of [30, 10, 20]) {
  store = addTask(store, { title: `练习${minutes}`, minutes, done: false, tags: ['JS'] }, instant)
}
const tasks = selectTasks(store, { query: 'JS', status: 'open', sort: 'minutes' })
console.log(tasks.map((task) => task.minutes).join(','))
console.log(JSON.stringify(summarize(tasks)))
console.log(JSON.stringify(summarize([])))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
10,20,30
{"total":3,"done":0,"minutes":60}
{"total":0,"done":0,"minutes":0}
```

本例明确复用前一例目录中已完整给出的`task-core.mjs`；复制源码时保留C25E03与本例的相邻目录关系。

查询不改原任务顺序；业务字段无合法值时应拒绝，不让任意sort参数访问对象的constructor等属性。平均值、标签多归属等统计若新增，先写清口径，不能只追加一个reduce就声称正确。

### 25.4 模块边界与显示层

业务模块只接收和返回JavaScript数据，不读process、不操作DOM、不写磁盘。入口负责取得输入和显示结果。这样同一业务规则才能在终端、网页和服务端复用；封装的目的在于责任清楚，而非增加文件数量。

示例 **C25E05**，目录 `js-study/examples/ch25/C25E05/`，环境：Node.js。

文件 `format.mjs`：

```javascript
export function formatTask(task) {
  return `${task.id}. ${task.title} / ${task.done ? '完成' : '待办'} / ${task.minutes}分钟`
}
```

文件 `demo.mjs`：

```javascript
import { formatTask } from './format.mjs'
console.log(formatTask({ id: 1, title: '学习模块', done: false, minutes: 20 }))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1. 学习模块 / 待办 / 20分钟
```

formatTask只形成文本，不决定是否输出。浏览器可以改用DOM渲染，服务端可以返回JSON，核心校验不必随显示方式复制。模块私有名字不从另一个文件直接读取，需要导出的才成为接口。

### 25.5 阶段验收与不修改输入

检查行为而非文件是否存在：旧快照不变、非法输入不产生任务、删除不复用ID、筛选不影响存储。本例用Node断言；完整测试组织会在第39章说明，当前把它理解为条件不满足就抛错的检查工具。

示例 **C25E06**，目录 `js-study/examples/ch25/C25E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
import { emptyStore, addTask, removeTask } from '../C25E03/task-core.mjs'
const old = emptyStore()
const fields = { title: '阅读', minutes: 0, tags: [], done: false }
const next = addTask(old, fields, '2026-11-09T00:00:00.000Z')
assert.equal(old.tasks.length, 0)
assert.equal(next.tasks[0].minutes, 0)
assert.throws(() => addTask(old, { ...fields, title: ' ' }))
const removed = removeTask(next, 1)
assert.equal(addTask(removed, fields).tasks[0].id, 2)
console.log('阶段检查通过')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
阶段检查通过
```

断言通过只说明这些输入和性质得到检查，不证明所有业务都无错误。创建时间可注入固定值使输出可预测。此时没有保存能力，重复启动入口会从emptyStore开始，读者应能解释这一现象。

#### 25.5.1 阶段三验收：自己设计操作顺序

先不看25.2入口，使用已保存的`task-core.mjs`写一个新入口：添加0分钟任务和25分钟任务；完成第2项；按open筛选；删除第1项后再添加一项；最后尝试空白标题。参考调用和检查如下。

示例 **C25E07**，目录 `js-study/examples/ch25/C25E07/`，环境：Node.js。文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
import {
  emptyStore,
  addTask,
  editTask,
  removeTask,
  selectTasks,
  summarize,
} from '../C25E03/task-core.mjs'
const fields = { title: '零分钟', minutes: 0, tags: [], done: false }
let store = addTask(emptyStore(), fields)
store = addTask(store, { ...fields, title: '阅读', minutes: 25 })
store = editTask(store, 2, { done: true })
assert.deepEqual(summarize(selectTasks(store, { status: 'open' })), {
  total: 1,
  done: 0,
  minutes: 0,
})
store = removeTask(store, 1)
store = addTask(store, { ...fields, title: '新任务' })
assert.equal(store.tasks.at(-1).id, 3)
const before = structuredClone(store)
assert.throws(() => addTask(store, { ...fields, title: ' ' }))
assert.deepEqual(store, before)
console.log('模块、规则、查询和失败保护检查通过')
```

本例复用25.2完整模块，保留两示例的相邻目录关系。运行`node demo.mjs`应显示最后一句，且没有断言失败。再把筛选条件改为done，预期总项数1、完成项数1、分钟25。能够独立增加这条检查，并解释0分钟合法、ID不回退和失败不改变旧状态，才能进入异步部分。

### 25.6 动手练习与参考答案

**先独立回答。**

1. 将分钟改成字符串"25"。

2. 删除任务1后新增一项，ID是否回到1？

3. 将显示改成“标题：分钟”，需要修改哪些文件？

**参考答案与检查。**

1. 核心拒绝，不能靠隐式转换接受。

2. 不会，继续使用nextId。

3. 只修改显示层，核心不应依赖显示文案。

### 25.7 本章速查

| 场景       | 做法与返回       | 易错边界                     |
| :--------- | :--------------- | :--------------------------- |
| 建立空状态 | emptyStore()     | version与nextId有约定        |
| 新增修改   | addTask/editTask | 返回新状态，可能抛InputError |
| 查询       | selectTasks      | 新外层结果                   |
| 汇总       | summarize        | 统计传入范围                 |

本章参考：[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)。

## 第26章 同步、异步、回调与定时器

同步调用按当前路径执行完才能继续；异步接口允许注册后续行为，当前代码先向前推进。并发是在一段时间内交错推进，和同时使用多个处理器的并行不同。本章先建立等待的模型，再引入Promise。

### 26.1 等待、阻塞与并发

等待网络时CPU不一定在计算；长循环则持续占用当前执行线程。异步接口不会自动把你写的耗时计算放到别的线程。不要用忙等模拟真实等待，那会阻塞其他任务。

示例 **C26E01**，目录 `js-study/examples/ch26/C26E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log('开始')
setTimeout(() => console.log('稍后通知'), 0)
console.log('注册后继续')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
开始
注册后继续
稍后通知
```

输出先有“注册后继续”，随后才执行定时回调。0表示不要求额外延迟，不代表现在立刻执行。当前调用栈未清空，定时回调不能随意插到普通同步语句中间。

### 26.2 回调不一定异步

回调只是传入的函数，是否异步取决于接收它的接口。map会在调用期间同步执行；setTimeout安排后续任务。注册时和执行时的外部变量值可能不同。

示例 **C26E02**，目录 `js-study/examples/ch26/C26E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let title = '旧标题'
console.log(
  [1, 2]
    .map((n) => {
      console.log('同步回调', n)
      return n * 2
    })
    .join(','),
)
setTimeout(() => console.log('延迟读取', title), 0)
title = '新标题'
console.log('当前同步代码结束')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
同步回调 1
同步回调 2
2,4
当前同步代码结束
延迟读取 新标题
```

map里的两个日志先于整体结果输出。定时回调闭包读取同一title绑定，因此看见“新标题”。如果要保存当时信息，可以在注册前建立需要的快照；对象快照还要考虑浅复制边界。

### 26.3 定时、重复与取消

setTimeout安排一次回调，clearTimeout取消尚未执行的计时；setInterval重复调度，clearInterval停止。实际执行受系统、事件循环和其他任务影响，定时不是高精度时钟。

示例 **C26E03**，目录 `js-study/examples/ch26/C26E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const cancelled = setTimeout(() => console.log('不应输出'), 100)
clearTimeout(cancelled)
let count = 0
const interval = setInterval(() => {
  count += 1
  console.log('提醒', count)
  if (count === 2) clearInterval(interval)
}, 5)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
提醒 1
提醒 2
```

本例只检查两次提醒，不把真实耗时写成固定毫秒数。异步回调持续时间长于间隔时要重新考虑重复策略，递归setTimeout可以在一次工作完成后安排下一次，但仍需取消与错误处理。浏览器返回的定时ID与Node返回对象不完全相同。

### 26.4 结果通过回调交回

外层函数调用结束时，未来数据尚未产生，不能靠回调中的return交回给外层调用者。Node传统接口常使用(error,result)约定：失败时提供error，成功时error为null。

示例 **C26E04**，目录 `js-study/examples/ch26/C26E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function later(value, callback) {
  setTimeout(() => {
    if (typeof value !== 'string') callback(new TypeError('需要文本'))
    else callback(null, value.trim())
  }, 0)
}
const returned = later(' 阅读 ', (error, result) => {
  if (error) {
    console.log(error.message)
    return
  }
  console.log('得到', result)
  return result
})
console.log('外层返回', returned)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
外层返回 undefined
得到 阅读
```

外层首先返回undefined，回调稍后显示“阅读”；回调自己的return只结束回调。约定要求避免同一操作多次调用完成回调，成功/失败只选一个。层层依赖会增加嵌套，Promise把结果和后续组合组织成统一接口。

### 26.5 异步错误边界

try只覆盖当前执行路径。注册定时器时的try不能捕获稍后回调抛出的异常；需要在实际执行处处理，或把失败交给可组合的结果机制。不要为了演示而让未处理异常使整本示例批量中断。

示例 **C26E05**，目录 `js-study/examples/ch26/C26E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
try {
  setTimeout(() => {
    try {
      throw new Error('回调里的失败')
    } catch (error) {
      console.log('回调处理', error.message)
    }
  }, 0)
  console.log('外层注册完成')
} catch (error) {
  console.log('外层捕获', error.message)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
外层注册完成
回调处理 回调里的失败
```

外层catch没有运行，因为当前注册过程没有抛错。后续Promise中的抛错会转换为拒绝，但也必须被调用者观察；异步不会免除错误处理责任。

### 26.6 动手练习与参考答案

**先独立回答。**

1. 回调是不是必然异步？

2. 定时0毫秒能打断当前循环吗？

3. 定时提醒不再需要时如何处理？

**参考答案与检查。**

1. 不是，map就是同步例子。

2. 不能；长同步循环会拖延回调。

3. 保留句柄并调用对应clear方法，同时清理相关资源。

### 26.7 本章速查

| 场景     | 做法与返回                 | 易错边界            |
| :------- | :------------------------- | :------------------ |
| 一次延迟 | setTimeout(callback,delay) | 延迟不是准点承诺    |
| 停止     | clearTimeout/clearInterval | 已执行效果不会撤销  |
| 传统回调 | callback(error,result)     | 应只结算一次        |
| 后续错误 | 在实际边界处理             | 注册处try不足以捕获 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-jobs)、[Node.js v26.13.0：timers](https://nodejs.org/docs/v26.13.0/api/timers.html)。

## 第27章 Promise与异步结果组合

Promise是表示某次操作最终结果的对象。它把成功值、失败原因和后续处理连接起来，不等于新线程，也不代表操作尚未启动。先画状态和链路，再使用简写。

### 27.1 状态、执行器与结算

Promise开始为pending，可最终fulfilled或rejected；settled表示已成功或失败。new Promise执行器同步调用，then注册的反应稍后处理。resolve另一个Promise可能锁定结果但暂时仍未settled。

示例 **C27E01**，目录 `js-study/examples/ch27/C27E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log('A')
const result = new Promise((resolve) => {
  console.log('执行器')
  resolve(3)
  resolve(9)
})
result.then((value) => console.log('结果', value))
console.log('B')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
A
执行器
B
结果 3
```

示例 **C27E02**，目录 `js-study/examples/ch27/C27E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let finish
const inner = new Promise((resolve) => {
  finish = resolve
})
const outer = new Promise((resolve, reject) => {
  resolve(inner)
  reject(new Error('已经锁定，不再生效'))
})
finish('内部完成')
console.log(await outer)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
内部完成
```

Promise结算只能朝一个最终结果推进；第二次resolve不覆盖第一次。执行器同步运行并不表示then同步执行。用new Promise包装已有Promise通常多余；不要把“异步工作”错误地写进async执行器后依赖其隐式返回。

### 27.2 链式返回与失败传播

then返回新的Promise。回调返回普通值使下一步得到该值，返回Promise则等待其结果；抛异常使链变为拒绝。catch可恢复为成功值或继续抛出。finally主要收尾，通常保留前面的结果，自己抛错则会改变结果。

示例 **C27E03**，目录 `js-study/examples/ch27/C27E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const value = await Promise.resolve(2)
  .then((n) => n * 3)
  .then((n) => Promise.resolve(n + 1))
  .finally(() => console.log('收尾'))
console.log(value)
const recovered = await Promise.resolve()
  .then(() => {
    throw new Error('失败')
  })
  .catch((error) => `恢复：${error.message}`)
console.log(recovered)
try {
  await Promise.resolve(1).finally(() => {
    throw new Error('清理失败')
  })
} catch (error) {
  console.log(error.message)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
收尾
7
恢复：失败
清理失败
```

catch返回文本之后，后续链已恢复成功；如果只是`console.log`后没有return，恢复值为undefined。finally不适合悄悄覆盖业务错误，清理失败应有明确策略。链中忘记return会让后续先运行、错误脱离原链。

### 27.3 all、allSettled、race与any

all需要全部成功，结果按输入顺序排列；allSettled等待每项结算；race采用第一个结算结果；any采用第一个成功值，全部拒绝时抛AggregateError。它们不自动取消尚在执行的其他操作。

示例 **C27E04**，目录 `js-study/examples/ch27/C27E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(JSON.stringify(await Promise.all([Promise.resolve('A'), 'B'])))
const settled = await Promise.allSettled([Promise.resolve(1), Promise.reject('坏数据')])
console.log(settled.map((item) => item.status).join(','))
console.log(await Promise.race([Promise.resolve('先结算'), new Promise(() => {})]))
console.log(await Promise.any([Promise.reject('失败'), Promise.resolve('成功')]))
try {
  await Promise.any([])
} catch (error) {
  console.log(error.name, error.errors.length)
}
console.log(JSON.stringify(await Promise.all([])))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
["A","B"]
fulfilled,rejected
先结算
成功
AggregateError 0
[]
```

空all与allSettled成功得到空数组，空any拒绝，空race持续pending。组合方法接收可迭代输入；它们观察已交给它们的任务，不会替你把任意函数数组全部调用。race的超时结果不等于取消底层网络请求。

### 27.4 withResolvers、try与旧写法

`Promise.withResolvers`把Promise和resolve/reject一起交回，适合需要在外部事件中完成的桥接。`Promise.try`调用函数并把同步返回或同步抛错统一为Promise结果；与`Promise.resolve`(fn())不同，后者的fn先在外面执行。

示例 **C27E05**，目录 `js-study/examples/ch27/C27E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const { promise, resolve } = Promise.withResolvers()
setTimeout(() => resolve('事件已完成'), 0)
console.log(await promise)
const old = new Promise((resolve) => resolve(4))
console.log(await old)
if (typeof Promise.try === 'function') {
  console.log(await Promise.try(() => 5))
  console.log(
    await Promise.try(() => {
      throw new Error('同步错误')
    }).catch((e) => e.message),
  )
} else {
  console.log('本环境尚无Promise.try')
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
事件已完成
4
5
同步错误
```

withResolvers在ES2024纳入，`Promise.try`在ES2025纳入；可用范围不等于首次年度。桥接接口仍需处理事件只触发一次、取消和资源释放。把API变短不会自动保证整个生命周期正确。

### 27.5 链路完整性与悬空拒绝

每个会失败的异步分支都应被返回、等待或明确捕获。悬空Promise是启动后没有被正确关联的工作；未处理拒绝可能导致宿主报警或退出。对已提供Promise接口的操作不再无意义包一层。

示例 **C27E06**，目录 `js-study/examples/ch27/C27E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function clean(text) {
  return Promise.resolve().then(() => {
    if (typeof text !== 'string') throw new TypeError('需要字符串')
    return text.trim()
  })
}
console.log(await clean(' 阅读 '))
try {
  await clean(null)
} catch (error) {
  console.log(error.name)
}
const chain = Promise.resolve(2).then((n) => {
  return Promise.resolve(n + 3)
})
console.log(await chain)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
阅读
TypeError
5
```

例子显式return内层Promise，使调用者能等待最终5。实际业务里若故意后台运行，需要记录错误、持有取消句柄并说明结束条件，不用void关键字就假定失败消失。

### 27.6 动手练习与参考答案

**先独立回答。**

1. Promise执行器何时运行？

2. catch返回0后下一步是成功还是失败？

3. race超时后网络一定停止吗？

**参考答案与检查。**

1. 构造时同步运行；then反应稍后调度。

2. 成功，值为0，除非catch自身又抛错。

3. 不一定，应配合支持取消的接口。

### 27.7 本章速查

| 场景     | 做法与返回    | 易错边界                 |
| :------- | :------------ | :----------------------- |
| 全部成功 | `Promise.all` | 输入顺序，失败不取消其余 |
| 全部结算 | allSettled    | 每项有状态               |
| 首个成功 | any           | 全失败为AggregateError   |
| 链式收尾 | finally       | 抛错可能覆盖原结果       |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-promise-objects)。

## 第28章 async/await、异步迭代与取消

async/await让Promise流程按较接近顺序代码的形式表达，但不会把异步变成同步阻塞。调用async函数时，它会开始执行，到挂起处让出控制，再通过Promise交付结果。

### 28.1 启动、挂起与恢复

async函数总是返回Promise。函数体先同步推进到首次实际挂起；await把后续处理安排到稍后，即使等待普通值，也不把后续语句直接塞在当前同步路径里执行。

示例 **C28E01**，目录 `js-study/examples/ch28/C28E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
async function work() {
  console.log('函数开始')
  await 0
  console.log('等待后')
  return 7
}
console.log('调用前')
const result = work()
console.log('调用后', result instanceof Promise)
console.log('最终值', await result)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
调用前
函数开始
调用后 true
等待后
最终值 7
```

这是与Python常见async def调用只创建协程对象的关键差异。await暂停当前async流程，不暂停所有JavaScript。其他已安排工作可以推进，但长同步代码仍会阻塞当前线程。

### 28.2 串行、并发和forEach陷阱

每轮await会让任务按轮次串行推进。先创建多个Promise，再`Promise.all`等待，可以让独立操作并发。forEach不等待回调返回的Promise，所以外层forEach结束不等于内部工作完成。

示例 **C28E02**，目录 `js-study/examples/ch28/C28E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
async function item(n) {
  await Promise.resolve()
  return n * 2
}
const serial = []
for (const n of [1, 2]) serial.push(await item(n))
console.log('串行', serial.join(','))
const concurrent = await Promise.all([1, 2].map(item))
console.log('并发结果', concurrent.join(','))
const done = []
const inputs = [1, 2]
inputs.forEach(async (n) => {
  done.push(await item(n))
})
console.log('forEach结束', done.length)
await Promise.resolve()
await Promise.resolve()
console.log('稍后', done.length)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
串行 2,4
并发结果 2,4
forEach结束 0
稍后 2
```

示例用可控微任务观察，不把真实耗时当固定输出。大量网络操作不能无限`Promise.all`：先限制并发批次或用固定数量工作者，考虑接口限流和内存。具有先后依赖的操作应串行，不为了“并发”破坏业务顺序。

### 28.3 异常、finally与顶层await

被等待的拒绝在await处表现为抛错，可用try/catch处理。finally等待异步清理后再离开。return await在局部try中可让拒绝被该catch捕获；直接return一个将来拒绝的Promise，拒绝可能越过这个同步边界。

示例 **C28E03**，目录 `js-study/examples/ch28/C28E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
async function protectedCall() {
  try {
    return await Promise.reject(new Error('业务失败'))
  } catch (error) {
    return `已处理：${error.message}`
  } finally {
    await Promise.resolve()
    console.log('完成清理')
  }
}
console.log(await protectedCall())
const moduleValue = await Promise.resolve('顶层等待完成')
console.log(moduleValue)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
完成清理
已处理：业务失败
顶层等待完成
```

顶层await在ESM中使用，会影响依赖模块的执行推进；不是CommonJS任意位置都能粘贴。不要在finally写不必要return掩盖原始错误。清理失败时是否覆盖原错误应有策略并保留原因链。

### 28.4 协作取消、超时与旧结果

Promise没有通用强制取消方法。AbortController创建控制器，signal传给支持它的操作，abort发出取消信号。操作必须主动响应、停止工作并清理监听；不支持signal的计算不会因此自动停止。

示例 **C28E04**，目录 `js-study/examples/ch28/C28E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    let timer
    const abort = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', abort)
      reject(signal.reason)
    }
    if (signal.aborted) {
      reject(signal.reason)
      return
    }
    timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      resolve('完成')
    }, ms)
    signal.addEventListener('abort', abort, { once: true })
  })
}
const controller = new AbortController()
const pending = wait(1000, controller.signal)
controller.abort(new Error('用户取消'))
try {
  await pending
} catch (error) {
  console.log(error.message)
}
console.log(await wait(0, new AbortController().signal))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
用户取消
完成
```

取消和完成两个分支都清理监听。真正请求还需要识别AbortError或signal.reason，别把用户取消当服务器坏了。搜索中即使取消旧请求，也可增加请求序号，仅允许最新序号更新界面，避免旧结果覆盖新输入。

### 28.5 异步迭代与Array.fromAsync

异步迭代器的next结果通过Promise交回。for await...of逐次等待下一项，适合分块数据。async generator通过async function\*建立。`Array.fromAsync`逐次收集，与`Promise.all`一次观察已创建任务的组合方式不同。

示例 **C28E05**，目录 `js-study/examples/ch28/C28E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
async function* titles() {
  yield await Promise.resolve('阅读')
  yield '练习'
}
for await (const title of titles()) console.log(title)
if (typeof Array.fromAsync === 'function') {
  console.log(JSON.stringify(await Array.fromAsync(titles(), (title) => title + '完成')))
} else {
  console.log('本环境尚无Array.fromAsync')
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
阅读
练习
["阅读完成","练习完成"]
```

生成器被逐次消费，不是创建时立即完成所有yield。提前break会触发相应关闭协议，资源仍要放进finally保证结束。`Array.fromAsync`已纳入ES2026，是否有原生实现仍应检测；收集无限流会永不结束或耗尽资源。

### 28.6 动手练习与参考答案

**先独立回答。**

1. 调用async函数会不会马上开始函数体？

2. 等待forEach能保证回调全部结束吗？

3. cancel信号能强制中断不检查signal的无限循环吗？

**参考答案与检查。**

1. 会，推进到首次挂起。

2. 不能，改用for...of逐次等待或`Promise.all`组合map结果。

3. 不能，需改变执行方式或任务设计。

#### 28.6.1 阶段四验收：旧查询晚到也不覆盖新结果

题目：同时启动“旧查询”和“新查询”，人为先交回新结果、再交回旧结果。最后展示必须仍是新结果。这里用手动完成的Promise控制顺序，不依赖某次网络或计时碰巧快慢。

示例 **C28E06**，目录 `js-study/examples/ch28/C28E06/`，环境：Node.js。文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
let latest = 0
let shown = ''
async function search(work) {
  const sequence = ++latest
  const value = await work
  if (sequence === latest) shown = value
}
let finishOld
let finishNew
const oldWork = new Promise((resolve) => {
  finishOld = resolve
})
const newWork = new Promise((resolve) => {
  finishNew = resolve
})
const oldSearch = search(oldWork)
const newSearch = search(newWork)
finishNew('新结果')
await newSearch
finishOld('旧结果')
await oldSearch
assert.equal(shown, '新结果')
console.log(shown)
```

运行`node demo.mjs`应显示“新结果”。独立排错：暂时去掉sequence判断，结果会变为“旧结果”且断言失败；恢复后通过。序号规则只决定谁能更新当前显示，不撤回后台已经完成的工作。真正的网络取消在第47章给出独立练习，两者不能互相替代。

### 28.7 本章速查

| 场景     | 做法与返回           | 易错边界           |
| :------- | :------------------- | :----------------- |
| 顺序等待 | for...of内await      | 有依赖时适用       |
| 组合并发 | `Promise.all(tasks)` | 需控制规模         |
| 协作取消 | AbortController      | 接口要支持信号     |
| 异步遍历 | for await...of       | 逐项等待，考虑清理 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-async-function-definitions)、[DOM标准](https://dom.spec.whatwg.org/#aborting-ongoing-activities)。

## 第29章 调用栈、任务、微任务与事件循环

事件循环把语言执行与宿主等待协调起来。理解它能解释为什么同步日志先出现、await后续稍后发生、页面可能卡住，以及Node与浏览器不能用同一张简化顺序表覆盖全部情形。

### 29.1 执行现场与调用栈

调用栈记录当前正在执行的函数调用。宿主可以安排计时、网络等活动，完成后把后续工作排入相应调度机制。任务和微任务是宿主协作的分类；不要把“所有异步”都画进一个FIFO队列。

示例 **C29E01**，目录 `js-study/examples/ch29/C29E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function inner() {
  console.log('内层')
}
function outer() {
  console.log('外层开始')
  inner()
  console.log('外层结束')
}
outer()
queueMicrotask(() => console.log('微任务'))
console.log('脚本末尾')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
外层开始
内层
外层结束
脚本末尾
微任务
```

inner调用期间外层尚未结束，inner返回后才继续外层。queueMicrotask排入稍后的微任务，不会打断inner。语言规范的Job与HTML事件循环有分工，Node也有自己的宿主调度层。

### 29.2 同步、Promise、await与微任务

Promise反应和await后续通过微任务类机制推进。当前同步路径结束后，宿主在相应检查点处理微任务；微任务还能继续安排微任务，因此并不是固定“每轮只执行一个”。

示例 **C29E02**，目录 `js-study/examples/ch29/C29E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log('同步1')
Promise.resolve().then(() => {
  console.log('Promise1')
  queueMicrotask(() => console.log('追加微任务'))
})
queueMicrotask(() => console.log('已排微任务'))
setTimeout(() => console.log('定时任务'), 0)
console.log('同步2')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
同步1
同步2
Promise1
已排微任务
追加微任务
定时任务
```

在本例的普通注册顺序下，Promise反应先于随后注册的微任务；反应中新排的微任务在已有项之后。不要通过“Promise比所有东西优先”背口诀，先画注册先后，再画执行时新增的项。

### 29.3 浏览器任务与渲染机会

浏览器还需要处理输入、布局与绘制。微任务检查点不等于绘制，任务结束后也不保证立刻绘制。requestAnimationFrame把回调安排在渲染更新相关阶段，适合视觉更新，不是高精度通用计时器。

示例 **C29E03**，目录 `js-study/examples/ch29/C29E03/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <meta charset="UTF-8" /><title>渲染观察</title>
  <button id="run">观察更新</button>
  <p id="result">尚未更新</p>
  <script type="module">
    const result = document.querySelector('#result')
    document.querySelector('#run').addEventListener('click', () => {
      result.textContent = '同步已修改DOM'
      queueMicrotask(() => console.log('微任务读取', result.textContent))
      requestAnimationFrame(() => console.log('动画回调读取', result.textContent))
    })
  </script>
</html>
```

操作：打开本页和开发者工具，点击按钮。文字变成“同步已修改DOM”，控制台能看到两次读取。这里检查DOM状态，不声称日志就证明像素已完成绘制。HTML与事件的细节在第30—32章展开。

DOM值修改可在同一同步路径立即读到，屏幕绘制是另一层工作。后台页面的动画回调可能节流或暂停；不要把它用于必须准时完成的后台业务。

### 29.4 Node调度与ESM上下文

Node有计时、轮询、check等阶段，`process.nextTick`还使用独立队列。它不是浏览器标准API。ESM模块执行本身与微任务推进有关，因此顶层nextTick和Promise的观察可能与CommonJS例子不同。

示例 **C29E04**，目录 `js-study/examples/ch29/C29E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log('ESM同步')
process.nextTick(() => console.log('nextTick'))
Promise.resolve().then(() => console.log('Promise反应'))
queueMicrotask(() => console.log('queueMicrotask'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
ESM同步
Promise反应
queueMicrotask
nextTick
```

示例 **C29E05**，目录 `js-study/examples/ch29/C29E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
```

运行：`node demo.mjs`。检查两个回调各执行一次。不要把顶层这两行的某一次相对顺序写成跨环境保证；从特定I/O回调注册时还有其上下文规则。

主线不依赖nextTick实现业务顺序。想表达数据依赖，用await或返回Promise；想让长计算不饿死I/O，不能只不断补充微任务。版本和加载模式是执行顺序题的必要条件，题目不交代就不应给绝对答案。

### 29.5 长任务、饥饿与测量

同步长循环会拖延任务和渲染；连续自我追加微任务也可能让宿主迟迟无法推进其他工作。把计算拆成受控批次、使用Worker或改变算法，比把函数加async关键字更有意义。

示例 **C29E06**，目录 `js-study/examples/ch29/C29E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let microtasks = 0
function next() {
  microtasks += 1
  if (microtasks < 3) queueMicrotask(next)
  else console.log('微任务批次', microtasks)
}
queueMicrotask(next)
setTimeout(() => console.log('宿主终于处理定时任务'), 0)
console.log('已安排')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
已安排
微任务批次 3
宿主终于处理定时任务
```

示例刻意设置三次上限，避免制造无限饥饿。真实耗时受设备和负载影响，性能测量要记录环境，不能从一次console计时就宣布优化有效。第41章再用性能工具观察。

**用执行阶段核对顺序。** 对本章普通浏览器调度示例，可先使用下面的简图；Node的nextTick与ESM差异仍按29.4节单独分析。

```text
执行当前同步代码 → 当前调用栈推进完
                          ↓
                   宿主执行微任务检查点
                   （新加入的微任务也可能继续执行）
                          ↓
             宿主获得推进其他任务或渲染的机会
                          ↓
                 选择并执行后续可运行工作
```

图中“机会”不表示每次都有渲染，也不保证定时器准点执行。分析一段代码时先标同步日志，再标安排了哪些回调与依赖；不要把所有宿主都套进一张固定队列顺序图。

### 29.6 动手练习与参考答案

**先独立回答。**

1. 微任务内新安排的微任务会自动等到“下一轮只一个”吗？

2. async函数中写十亿次同步循环会自动不卡页面吗？

3. 为什么Node顺序题要注明.mjs或.cjs？

**参考答案与检查。**

1. 不会，检查点会继续处理队列。

2. 不会。

3. 模块执行上下文可能影响nextTick与微任务的观察。

### 29.7 本章速查

| 场景     | 做法与返回                  | 易错边界           |
| :------- | :-------------------------- | :----------------- |
| 立即执行 | 当前调用栈                  | 先完成当前同步路径 |
| 微任务   | Promise反应、queueMicrotask | 连续追加可能饥饿   |
| 视觉更新 | requestAnimationFrame       | 不是准点后台计时   |
| Node专有 | `process.nextTick`          | 不能套用浏览器     |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-jobs)、[HTML标准：脚本与事件循环](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)、[Node.js官方文档](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)。

## 第30章 浏览器前置：HTML、CSS与页面加载

本章补足制作教学页面所需的网页基础，不假设已经学过HTML或CSS。HTML描述结构，CSS描述表现，JavaScript安排行为。语言、文档、渲染和网络是不同层次；页面不更新时要先找是哪一层失败。

### 30.1 网页、文件与URL

浏览器按URL取得资源。HTML是描述文档的标记语言，不是JavaScript代码；CSS是样式规则。元素是文档中的组成单元，通常有开始标签、内容和结束标签；属性写在开始标签中提供额外信息。

示例 **C30E01**，目录 `js-study/examples/ch30/C30E01/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <h1>学习清单</h1>
    <p>先读懂页面，再加入行为。</p>
    <button id="add">点击观察</button>
    <script type="module">
      document.querySelector('#add').addEventListener('click', () => console.log('按钮已点击'))
    </script>
  </body>
</html>
```

运行方式：在`js-study`学习根目录执行`node tools/serve-examples.mjs --dir examples/ch30/C30E01`，将目录改为当前示例目录；打开终端打印的本机URL。Ctrl+C停止。后续浏览器例子均可复用此命令。 点击按钮后控制台显示“按钮已点击”；没有打开控制台时页面看起来没有变化，这是本例约定。

HTML文件只是文本，浏览器解析后形成文档对象；源代码、DOM和最终像素不是同一对象。file://直接打开能运行一些简单页面，但模块、请求和来源限制会不同。学习项目统一用本机HTTP，避免把来源问题误判为语法错误。

### 30.2 最小文档、语义与表单

doctype声明现代HTML解析模式，lang说明主要语言，charset声明编码，viewport让移动布局按设备宽度工作。标题有层级；列表表达多项；label通过for关联输入框，button在表单中应明确type。

示例 **C30E02**，目录 `js-study/examples/ch30/C30E02/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <main>
      <h1>任务清单</h1>
      <ul>
        <li>认识标签</li>
        <li>填写表单</li>
      </ul>
      <form id="task-form">
        <label for="title">任务标题</label><input id="title" name="title" required />
        <button type="submit">提交</button>
      </form>
      <p id="result" role="status"></p>
    </main>
    <script type="module">
      document.querySelector('#task-form').addEventListener('submit', (event) => {
        event.preventDefault()
        document.querySelector('#result').textContent =
          '收到：' + document.querySelector('#title').value
      })
    </script>
  </body>
</html>
```

检查：点击“任务标题”文字能把焦点移到输入框。输入“阅读”后提交，页面显示“收到：阅读”。required为空时浏览器先提示；自定义业务校验仍需编写。

void元素如input没有结束标签；普通容器要正确闭合和嵌套。语义标签帮助浏览器和辅助技术理解结构，不意味着section会自动产生视觉样式。preventDefault用于阻止默认表单导航，第32章细讲事件。

### 30.3 CSS选择器、层叠和盒模型

CSS用选择器找到元素，再给属性赋值。类选择器以点开头，可被多个元素复用。盒模型包含内容、内边距、边框和外边距；box-sizing:border-box使设定宽度包含内边距与边框。层叠还受来源、优先级、顺序等规则影响。

示例 **C30E03**，目录 `js-study/examples/ch30/C30E03/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font: 16px/1.6 system-ui;
        background: #f4f5f3;
        color: #23352e;
      }
      .panel {
        max-width: 640px;
        margin: 32px auto;
        padding: 24px;
        background: white;
      }
      .muted {
        color: #52665d;
      }
      button {
        padding: 10px 16px;
      }
      [hidden] {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <main class="panel">
      <h1>可读的页面</h1>
      <p class="muted">样式不会替你改变任务数据。</p>
      <button id="toggle">切换提示</button>
      <p id="tip" hidden>这是提示</p>
    </main>
    <script type="module">
      document.querySelector('#toggle').addEventListener('click', () => {
        document.querySelector('#tip').hidden = !document.querySelector('#tip').hidden
      })
    </script>
  </body>
</html>
```

检查：主区域有内边距，正文与背景可分辨；缩小窗口仍可阅读；点击按钮交替显示/隐藏提示。

布局是表达内容关系，不需要每个元素都绝对定位。默认流、flex或grid按任务选择。隐藏元素不等于删除数据；使用hidden属性时注意CSS覆盖问题，本例给出明确规则。不要只靠颜色表达错误或完成状态。

### 30.4 脚本加载和文档就绪

经典外部脚本、defer、async与模块脚本有不同加载和执行规则。defer经典脚本在文档解析后按顺序执行；async在可执行时尽快运行，不保证原文顺序；模块默认具有延迟执行特征，顶层await还可能推迟模块完成。

示例 **C30E04**，目录 `js-study/examples/ch30/C30E04/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>模块加载</title>
    <script type="module" src="./main.mjs"></script>
  </head>
  <body>
    <p id="result">等待模块</p>
  </body>
</html>
```

文件 `main.mjs`：

```javascript
document.querySelector('#result').textContent = '模块已找到正文节点'
document.addEventListener('DOMContentLoaded', () => console.log('文档已解析'))
```

通过HTTP打开。页面应从“等待模块”变成“模块已找到正文节点”；控制台显示文档已解析。确认网络面板`main.mjs`请求成功且MIME正确。

DOMContentLoaded关注文档解析和相应延迟脚本，不代表所有图片都已完成。动态加载后才注册监听时，事件可能已经发生，可结合`document.readyState`判断。不能看见一张截图就断言所有异步资源均已就绪。

### 30.5 本地服务与开发者工具

共用静态服务的完整源码和首次保存步骤已在24.4节给出。运行时仍从`js-study`学习根目录执行命令，例如`node tools/serve-examples.mjs --dir examples/ch30/C30E01 --port 3211`；本节开始前先停止上一个页面目录的服务。保持同一来源有利于复现浏览器存储，不要看到端口被占用就反复启动新实例。

控制台Console看日志和异常，Elements看实际节点与样式，Network看请求、状态和响应。下面故意让模块路径出错，练习依据证据修复，而不是重新安装Node。

示例 **C30E05**，目录 `js-study/examples/ch30/C30E05/`，环境：浏览器。类型：故意错误；应按步骤修正。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>定位模块请求</title>
  </head>
  <body>
    <p id="result">等待模块</p>
    <script type="module" src="./missing.mjs"></script>
  </body>
</html>
```

文件 `main.mjs`：

```javascript
document.querySelector('#result').textContent = '模块路径已修正'
```

在学习根目录执行：

```powershell
node tools/serve-examples.mjs --dir examples/ch30/C30E05 --port 3211
```

打开`http://127.0.0.1:3211/`，页面保持“等待模块”。在Network中找到`missing.mjs`，应为404；控制台可能同时报告模块加载失败，文字随浏览器变化。将HTML中的`src`改成`./main.mjs`并保存，刷新后请求应为200、类型为JavaScript，页面显示“模块路径已修正”。若仍未更新，先确认编辑器保存位置、服务目录和当前URL。

静态服务只读取允许后缀的文件，并用真实路径检查目录边界；它是教学基础设施。Node HTTP与文件接口在第34—36章解释。排错顺序为：URL和目录→请求状态及MIME→控制台→DOM与样式。不能用一张页面截图证明模块请求、错误处理和交互都正确。

### 30.6 动手练习与参考答案

**先独立回答。**

1. 把node命令粘进HTML的script会启动服务器吗？

2. 模块脚本加载失败先查什么？

3. CSS隐藏提示会删除其文字数据吗？

**参考答案与检查。**

1. 不会，终端命令和JavaScript源码由不同入口解释。

2. Network的URL/状态/MIME，再看控制台与模块路径。

3. 不会，hidden主要影响呈现和可访问状态。

### 30.7 本章速查

| 场景     | 做法与返回               | 易错边界             |
| :------- | :----------------------- | :------------------- |
| 结构     | HTML元素与属性           | 不是JS语法           |
| 表现     | CSS选择器与声明          | 层叠、盒模型影响结果 |
| 模块入口 | script type=module       | 通过HTTP验证         |
| 排错     | Console/Elements/Network | 不同层看不同证据     |

本章参考：[HTML标准](https://html.spec.whatwg.org/multipage/)、[HTML标准：脚本](https://html.spec.whatwg.org/multipage/scripting.html)、[DOM标准](https://dom.spec.whatwg.org/)。

## 第31章 DOM与页面内容更新

DOM是文档对象模型（Document Object Model），用节点树表示页面。JavaScript通过接口读取或改变这棵树，浏览器再依据它呈现。节点不是原始HTML字符串，修改对象状态也不会自动调用你的渲染函数。

### 31.1 节点树与关系

元素、文本和文档都是节点。childNodes包含文本等节点，children只关注元素。源码里的换行空白也可能形成文本节点。parentElement、firstElementChild等接口帮助你明确沿哪一种关系查找。

示例 **C31E01**，目录 `js-study/examples/ch31/C31E01/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <ul id="list">
      <li>A</li>
      <li>B</li>
    </ul>
    <pre id="out"></pre>
    <script type="module">
      const list = document.querySelector('#list')
      document.querySelector('#out').textContent = JSON.stringify(
        {
          childNodes: list.childNodes.length,
          elements: list.children.length,
          first: list.firstElementChild.textContent,
          parent: list.parentElement.tagName,
        },
        null,
        2,
      )
    </script>
  </body>
</html>
```

检查页面JSON：elements为2、first为A，childNodes大于2，因为保留了换行文本节点。

不要把“第一个子节点”自动当“第一个li”。tagName在HTML文档中通常以大写表示，源码标签可小写。移动一个已有节点通常是改变其位置，不会自动复制出第二份。

### 31.2 选择器和集合

querySelector返回首个匹配元素或null，querySelectorAll返回静态NodeList。getElementsByClassName等接口常返回实时HTMLCollection，后续DOM变化能影响其内容。查找结果为null时继续访问属性会抛错。

示例 **C31E02**，目录 `js-study/examples/ch31/C31E02/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <div id="box"><p class="item">A</p></div>
    <pre id="out"></pre>
    <script type="module">
      const box = document.querySelector('#box')
      const staticList = document.querySelectorAll('.item')
      const liveList = document.getElementsByClassName('item')
      const added = document.createElement('p')
      added.className = 'item'
      added.textContent = 'B'
      box.append(added)
      document.querySelector('#out').textContent =
        `${staticList.length},${liveList.length},${document.querySelector('#missing')}`
    </script>
  </body>
</html>
```

检查：页面有A、B，结果为1,2,null。

静态集合不表示节点内容也被克隆，集合仍引用真实节点。遍历实时集合时删除元素可能使索引变化，先转成数组或反向处理。选择器语法错误与找不到元素不同：前者可抛SyntaxError，后者返回null。

### 31.3 创建、修改、属性和类

createElement建立元素，append加入节点，remove从树移除；textContent设置文本。HTML attribute是文档标记上的属性，DOM property是对象接口，两者常有关联但不总相同。dataset把data-\*映射为字符串字段。

示例 **C31E03**，目录 `js-study/examples/ch31/C31E03/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <div id="box"></div>
    <input id="field" value="初始" />
    <pre id="out"></pre>
    <script type="module">
      const item = document.createElement('p')
      item.textContent = '<strong>作为文本</strong>'
      item.classList.add('task')
      item.dataset.taskId = '7'
      document.querySelector('#box').append(item)
      const field = document.querySelector('#field')
      field.value = '当前'
      document.querySelector('#out').textContent =
        `${field.value}/${field.getAttribute('value')}/${item.dataset.taskId}`
    </script>
  </body>
</html>
```

检查：尖括号文本原样显示，不会变成加粗元素；结果为当前/初始/7。

输入框value属性表示当前值，getAttribute读取标记上的初始文本，不能当作永远相等。dataset取得的7仍是字符串，需要数值时显式转换并校验。classList适合表达状态，少在JavaScript中分散硬编码大量内联样式。

### 31.4 从状态到任务列表

渲染是根据当前数据建立或更新界面。先在内存中建立节点，再replaceChildren整体替换可以保持代码清楚。稳定ID放在dataset里用于业务定位，不能使用当前显示序号作永久ID。

示例 **C31E04**，目录 `js-study/examples/ch31/C31E04/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <p id="empty"></p>
    <ul id="tasks"></ul>
    <script type="module">
      const tasks = [
        { id: 10, title: '阅读', done: false },
        { id: 20, title: '练习', done: true },
      ]
      function render() {
        const nodes = tasks.map((task) => {
          const item = document.createElement('li')
          item.dataset.id = String(task.id)
          item.textContent = `${task.title}：${task.done ? '完成' : '待办'}`
          return item
        })
        document.querySelector('#tasks').replaceChildren(...nodes)
        document.querySelector('#empty').textContent = tasks.length ? '' : '暂无任务'
      }
      render()
    </script>
  </body>
</html>
```

检查：出现两行“阅读：待办”“练习：完成”，DOM里data-id分别10和20。

整体重绘容易解释，但可能丢焦点、光标和监听器；数据多或交互复杂时应局部更新，或在重绘后恢复必要状态。框架不在本书主线范围，本例让你先看见数据流本身。

### 31.5 安全文本与重复渲染

不可信文本应通过textContent等文本接口插入。innerHTML会解析标记，给不可信输入使用可能形成跨站脚本风险。这里是教学防护示例；真实应用还要结合来源策略、依赖与业务威胁模型。

示例 **C31E05**，目录 `js-study/examples/ch31/C31E05/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <button id="render">再次渲染</button>
    <ul id="list"></ul>
    <script type="module">
      const input = '<img src=x onerror=alert(1)>'
      function render() {
        const item = document.createElement('li')
        item.textContent = input
        document.querySelector('#list').replaceChildren(item)
      }
      document.querySelector('#render').addEventListener('click', render)
      render()
    </script>
  </body>
</html>
```

检查：显示img标记原文，不出现图片节点或弹窗；连续点击三次仍只有一条li。

把重复渲染写成append而不清理会不断叠加旧节点。只有确需解析可信模板且已按环境处理安全时才考虑HTML解析接口；简单文本显示无需引入复杂消毒库。

### 31.6 动手练习与参考答案

**先独立回答。**

1. querySelector无匹配返回什么？

2. 为什么childNodes比children多？

3. 重复调用本章渲染为何不重复？

**参考答案与检查。**

1. null。

2. 文本、注释等节点也可能计入。

3. replaceChildren替换已有子节点。

### 31.7 本章速查

| 场景     | 做法与返回               | 易错边界           |
| :------- | :----------------------- | :----------------- |
| 查找首项 | querySelector→元素或null | 选择器语法也要合法 |
| 静态集合 | querySelectorAll         | 后加元素不自动纳入 |
| 文本     | textContent              | 不解析用户标记     |
| 替换列表 | replaceChildren          | 会影响原节点与焦点 |

本章参考：[DOM标准](https://dom.spec.whatwg.org/)、[HTML标准](https://html.spec.whatwg.org/multipage/dom.html)。

## 第32章 事件、表单与用户交互

事件是浏览器报告某种发生情况的对象化机制。用户输入、点击或提交后，你的监听器读取状态、验证规则、更新数据和界面。先分清事件传播与默认行为，再实现完整交互。

### 32.1 监听器、函数身份与清理

addEventListener按事件类型注册函数，removeEventListener移除相同函数与相关捕获配置的监听。重新写一个外观相同的箭头函数并不是同一个函数。once可限制只处理一次，signal可把一组监听与取消生命周期关联。

示例 **C32E01**，目录 `js-study/examples/ch32/C32E01/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <button id="button">点击</button><button id="stop">停止监听</button>
    <p id="out">0</p>
    <script type="module">
      const button = document.querySelector('#button')
      let count = 0
      const show = () => {
        count += 1
        document.querySelector('#out').textContent = String(count)
      }
      button.addEventListener('click', show)
      document
        .querySelector('#stop')
        .addEventListener('click', () => button.removeEventListener('click', show))
      button.addEventListener('click', () => console.log('只响应一次'), { once: true })
    </script>
  </body>
</html>
```

检查：点击两次数字为2，而一次监听日志只出现一次；点停止后再次点击数字不变。

监听器注册不代表已经执行。移除只影响后续调用，不撤销已完成动作。页面组件反复挂载时，若保留旧监听器，可能形成重复操作和引用保留；为资源制定明确清理位置。

### 32.2 捕获、冒泡和事件委托

事件在树上有传播路径。event.target是原始目标，currentTarget是当前监听器所在对象。委托把监听器放在稳定父节点，通过closest识别子按钮，动态新增子节点也能工作。

示例 **C32E02**，目录 `js-study/examples/ch32/C32E02/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <ul id="list">
      <li>
        <button data-id="10">完成 <span>A</span></button>
      </li>
    </ul>
    <p id="out"></p>
    <script type="module">
      const list = document.querySelector('#list')
      list.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-id]')
        if (!button || !list.contains(button)) return
        document.querySelector('#out').textContent =
          `ID=${button.dataset.id}，监听于${event.currentTarget.id}`
      })
    </script>
  </body>
</html>
```

检查：点按钮文字内的A也识别ID=10；监听位置仍是list。

捕获监听用capture:true；stopPropagation阻止继续传播，不等于阻止默认导航或表单提交。委托需要考虑边界，避免closest找到父区域外的无关祖先。event.currentTarget在异步后未必保留你想象的值，需要时先保存。

### 32.3 默认行为、变化事件与中文输入

preventDefault阻止允许取消的默认动作；input在内容变化时触发，change常在提交变化后触发。中文输入法会经历composition过程，若每次中间输入都发请求，可能干扰候选文字或制造无效查询。

示例 **C32E03**，目录 `js-study/examples/ch32/C32E03/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <form id="form"><label for="name">标题</label><input id="name" /><button>提交</button></form>
    <p id="out"></p>
    <script type="module">
      const field = document.querySelector('#name')
      let composing = false
      field.addEventListener('compositionstart', () => {
        composing = true
      })
      field.addEventListener('compositionend', () => {
        composing = false
        show()
      })
      field.addEventListener('input', (event) => {
        if (!composing && !event.isComposing) show()
      })
      function show() {
        document.querySelector('#out').textContent = `当前：${field.value}`
      }
      document.querySelector('#form').addEventListener('submit', (event) => {
        event.preventDefault()
        show()
      })
    </script>
  </body>
</html>
```

检查：提交不刷新页面；中文输入完成后显示最终文字。不同输入法事件细节需在目标浏览器验证。

并非所有事件都能取消，passive监听也限制preventDefault。键盘快捷键要考虑文本编辑和输入法，不在全局粗暴拦截所有Enter。搜索可以用明确提交按钮开始，学习稳定后再增加防抖。

### 32.4 读取表单与分层校验

value通常是字符串，checked是布尔值；FormData按有name且符合提交条件的控件收集字段，重复名字可能出现多项。浏览器约束验证提高交互体验，但请求可被绕过，服务端必须重复验证。

示例 **C32E04**，目录 `js-study/examples/ch32/C32E04/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <form id="form">
      <label>标题 <input name="title" required maxlength="20" /></label>
      <label
        >分钟 <input name="minutes" type="number" required min="0" max="1440" value="25"
      /></label>
      <label><input name="done" type="checkbox" />已完成</label><button>检查</button>
    </form>
    <pre id="out"></pre>
    <script type="module">
      document.querySelector('#form').addEventListener('submit', (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const title = String(data.get('title') ?? '').trim()
        const minutes = Number(data.get('minutes'))
        const done = data.has('done')
        const valid =
          title.length > 0 && Number.isInteger(minutes) && minutes >= 0 && minutes <= 1440
        document.querySelector('#out').textContent = valid
          ? JSON.stringify({ title, minutes, done })
          : '输入不符合业务规则'
      })
    </script>
  </body>
</html>
```

检查：输入空白标题即使通过required的非空字符串条件，也会被trim后的规则拒绝；0分钟应允许。勾选后done为true。

FormData未勾选的复选框常不出现该键，不能直接把"on"文本当业务布尔状态。数值输入的step、min、max不代替`Number.isInteger`。更复杂结构要有明确错误位置，而不是只说“系统错误”。

### 32.5 完整添加流程和键盘操作

操作流程应有成功反馈、失败反馈、空状态和明确焦点。每次成功先更新数据，再渲染，最后准备下一次输入。异步保存时控制重复提交，同时保留失败后的用户输入以便修复。

示例 **C32E05**，目录 `js-study/examples/ch32/C32E05/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <form id="form">
      <label>任务 <input id="title" required /></label><button>添加</button>
    </form>
    <p id="status" role="status"></p>
    <ul id="list"></ul>
    <script type="module">
      const tasks = []
      const field = document.querySelector('#title')
      document.querySelector('#form').addEventListener('submit', (event) => {
        event.preventDefault()
        const title = field.value.trim()
        if (!title) {
          document.querySelector('#status').textContent = '请输入非空白标题'
          field.focus()
          return
        }
        tasks.push({ id: tasks.length + 1, title })
        document.querySelector('#list').replaceChildren(
          ...tasks.map((task) => {
            const li = document.createElement('li')
            li.textContent = task.title
            return li
          }),
        )
        document.querySelector('#status').textContent = '已添加任务'
        field.value = ''
        field.focus()
      })
    </script>
  </body>
</html>
```

检查：键盘Tab能到输入和按钮；Enter可提交；成功后焦点回到标题；空白不会产生新li。此例无删除，所以用长度加1不会复用ID，完整项目采用独立nextId。

界面状态与业务状态要分开：显示“已添加”不能替代真正写入。按钮disabled期间应展示保存状态，失败后恢复操作，不把用户文本清空。第40章组合成本地保存项目，第45章增加服务端持久化。

### 32.6 动手练习与参考答案

**先独立回答。**

1. 移除监听器为何需保存函数？

2. 阻止冒泡能阻止表单刷新吗？

3. 前端校验通过就不需要服务端校验吗？

**参考答案与检查。**

1. 函数对象身份必须匹配。

2. 不能，默认动作使用preventDefault。

3. 不成立，客户端请求可被绕过。

### 32.7 本章速查

| 场景     | 做法与返回       | 易错边界         |
| :------- | :--------------- | :--------------- |
| 监听     | addEventListener | 注册和执行分开   |
| 委托     | target.closest   | 还需限制所属区域 |
| 取消默认 | preventDefault   | 不等于停止传播   |
| 控件值   | value/checked    | 字符串和布尔分开 |

本章参考：[DOM标准](https://dom.spec.whatwg.org/)、[HTML标准：表单](https://html.spec.whatwg.org/multipage/forms.html)、[HTML标准：交互](https://html.spec.whatwg.org/multipage/interaction.html)。

## 第33章 浏览器存储、文件与页面状态

刷新页面后内存状态会消失，本地存储与文件交换让数据跨运行保留。持久化不止“写一行JSON”：读取可能失败、内容可能损坏、格式可能变化，覆盖旧数据必须有明确策略。

### 33.1 Web Storage和生命周期

localStorage按来源保存字符串，sessionStorage还按页面会话划分。来源由协议、主机和端口等构成；本机端口变化可能让你看到另一份存储。接口是同步的，可能因策略、配额或隐私环境而抛错。

示例 **C33E01**，目录 `js-study/examples/ch33/C33E01/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <button id="run">写入并读取</button>
    <pre id="out"></pre>
    <script type="module">
      document.querySelector('#run').addEventListener('click', () => {
        try {
          localStorage.setItem('js-handbook-demo', '25')
          const stored = localStorage.getItem('js-handbook-demo')
          document.querySelector('#out').textContent = `${stored}/${typeof stored}`
          localStorage.removeItem('js-handbook-demo')
        } catch (error) {
          document.querySelector('#out').textContent = `存储不可用：${error.name}`
        }
      })
    </script>
  </body>
</html>
```

检查：允许存储时显示25/string，示例随后只删除自己的演示键，不清空该来源所有存储。

getItem缺失返回null，不是undefined。不要用`localStorage.clear`清理本书一个例子，因为它可能删掉同来源其他数据。示例静态服务使用临时端口，每次重启地址可能变；要练刷新恢复，在同一服务进程和同一URL中操作。

### 33.2 JSON恢复、校验和损坏保护

恢复应先读文本，再解析，再验证结构和版本。缺失数据与损坏数据是两种情况：缺失可以开始空表，损坏应提示并保留，不能catch后立刻写空表覆盖。迁移要有来源版本、目标版本和失败回退。

示例 **C33E02**，目录 `js-study/examples/ch33/C33E02/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <button id="read">检查演示数据</button>
    <pre id="out"></pre>
    <script type="module">
      const key = 'js-handbook-validate'
      document.querySelector('#read').addEventListener('click', () => {
        localStorage.setItem(key, '{broken')
        const raw = localStorage.getItem(key)
        try {
          const data = JSON.parse(raw)
          if (data.version !== 1 || !Array.isArray(data.tasks)) throw new Error('结构不符合约定')
        } catch (error) {
          document.querySelector('#out').textContent =
            `拒绝恢复，原文仍为：${localStorage.getItem(key)}`
        }
      })
    </script>
  </body>
</html>
```

检查：显示原文{broken仍存在。只为演示创建本例专用键，完成后在控制台执行`localStorage.removeItem("js-handbook-validate")`清理。

正式应用不要主动制造坏数据；这里明确是错误路径演示。若需要用户重置，先给备份原文的机会，再由明确动作删除。解析成功还要验证每条任务字段、ID唯一性和上限。

### 33.3 多页面、URL和导航状态

URL与URLSearchParams处理地址和查询参数，避免手工拼接导致中文、空格或&混淆。history.replaceState可更新当前历史项而不重新加载。storage事件通常在同来源其他文档收到，不在执行写入的本页自己触发。

示例 **C33E03**，目录 `js-study/examples/ch33/C33E03/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <p id="out"></p>
    <button id="change">更新关键词</button>
    <script type="module">
      const url = new URL(location.href)
      document.querySelector('#out').textContent = url.searchParams.get('q') ?? '尚无关键词'
      document.querySelector('#change').addEventListener('click', () => {
        const next = new URL(location.href)
        next.searchParams.set('q', '中文 & JS')
        history.replaceState(null, '', next)
        document.querySelector('#out').textContent = next.searchParams.get('q')
      })
      window.addEventListener('storage', (event) => console.log('其他页面修改', event.key))
    </script>
  </body>
</html>
```

检查：点击后地址查询参数被编码，页面显示完整“中文 & JS”；刷新仍可从URL读回。另开同来源页面可观察storage通知。

history更新不等于把任务写入本地文件；地址适合筛选条件，不适合放密码和整份任务库。多标签同时编辑会有覆盖冲突，storage事件只是通知，不是事务或锁。

### 33.4 File、Blob和导入导出

File表示用户明确选择的文件；Blob表示二进制数据块。对象URL为Blob提供临时地址，使用后应revoke。文件扩展名和accept仅帮助选择，不保证内容合法；检查大小、编码、JSON与业务模型。

示例 **C33E04**，目录 `js-study/examples/ch33/C33E04/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <label>选择JSON <input id="file" type="file" accept=".json,application/json" /></label>
    <button id="export">导出演示</button>
    <pre id="out"></pre>
    <script type="module">
      document.querySelector('#file').addEventListener('change', async (event) => {
        const file = event.target.files[0]
        if (!file) return
        try {
          if (file.size > 1024 * 1024) throw new Error('文件超过1 MiB')
          const value = JSON.parse(await file.text())
          if (value === null || typeof value !== 'object' || Array.isArray(value))
            throw new Error('顶层应为对象')
          document.querySelector('#out').textContent = JSON.stringify(value, null, 2)
        } catch (error) {
          document.querySelector('#out').textContent = error.message
        }
      })
      document.querySelector('#export').addEventListener('click', () => {
        const url = URL.createObjectURL(
          new Blob([JSON.stringify({ version: 1, tasks: [] })], { type: 'application/json' }),
        )
        const link = document.createElement('a')
        link.href = url
        link.download = 'demo.json'
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      })
    </script>
  </body>
</html>
```

检查：导出得到`demo.json`；选择合法对象JSON能显示，坏JSON显示错误，超大文件拒绝；本例只预览，不写入任务存储。

file.text按相应文本解码处理，不是所有任意编码文件都能正确导入。导入确认前先校验整份数据；不能先清空现有表再逐条验证。对象URL不是文件系统绝对路径，浏览器也不会因得到一个路径字符串就允许任意读盘。

### 33.5 Cookie、IndexedDB与敏感数据

Cookie可随符合规则的HTTP请求发送，受域、路径、SameSite等限制；Web Storage主要由脚本显式读取，不自动成为HTTP请求体。IndexedDB提供异步结构化存储和事务，适合更复杂本地数据；本书主线不需要先掌握它。

示例 **C33E05**，目录 `js-study/examples/ch33/C33E05/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JavaScript教学示例</title>
  </head>
  <body>
    <p id="out"></p>
    <script type="module">
      const capabilities = {
        localStorage: typeof localStorage !== 'undefined',
        indexedDB: typeof indexedDB !== 'undefined',
        cookieEnabled: navigator.cookieEnabled,
      }
      document.querySelector('#out').textContent = JSON.stringify(capabilities)
      // 这里只检查入口是否存在；真正操作仍可能因权限和配额失败。
    </script>
  </body>
</html>
```

检查：页面显示当前浏览器能力布尔值，具体值允许随策略不同。没有创建Cookie或数据库。

接口存在不等于每次操作成功。localStorage不是保险箱，同来源脚本能访问它；HttpOnly Cookie不能由脚本读，但仍有其他安全边界。真实认证与敏感信息管理需专项设计，本书仅说明接口职责，不扩展为认证系统。

### 33.6 动手练习与参考答案

**先独立回答。**

1. getItem缺失返回什么？

2. 损坏JSON是否应该立即覆盖为空表？

3. 为什么改变本书静态服务来源后可能看不到旧localStorage？

**参考答案与检查。**

1. null。

2. 不应，保留原文并提供修复或明确重置。

3. 若手动换了端口、主机或协议，来源就不同；沿用固定3211端口时应验证同来源重启恢复。

### 33.7 本章速查

| 场景         | 做法与返回             | 易错边界       |
| :----------- | :--------------------- | :------------- |
| 保存文本     | `localStorage.setItem` | 同步，可能抛错 |
| 读缺失项     | getItem→null           | 与坏JSON不同   |
| 查询参数     | URLSearchParams        | 自动处理编码   |
| 临时下载地址 | createObjectURL/revoke | 使用后释放     |

本章参考：[HTML标准：Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)、[URL标准](https://url.spec.whatwg.org/)、[File API规范](https://w3c.github.io/FileAPI/)、[IndexedDB规范](https://w3c.github.io/IndexedDB/)。

## 第34章 Node.js、命令行与进程基础

本章把业务函数接到终端。命令行接口（Command-Line Interface，CLI）是用户通过命令和文本与程序交互的入口。前面已经学会模块和异步，这里才开始读取实际进程参数、循环接收输入和安排退出。

### 34.1 Node的能力边界

Node.js是JavaScript运行环境，提供进程、文件、网络等宿主能力。`node:`前缀表示Node内置模块，不需要从npm安装。浏览器与Node都实现部分Web API，但不能据此认为两者提供相同全局对象。

`globalThis`是跨环境访问全局对象的标准入口；它不保证任意属性都存在。下面先检查能力，再决定使用哪一种接口。

示例 **C34E01**，目录 `js-study/examples/ch34/C34E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { basename } from 'node:path'
console.log(typeof globalThis)
console.log(typeof document)
console.log(typeof fetch)
console.log(basename('task.mjs'))
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
object
undefined
function
task.mjs
```

`document`属于浏览器文档能力，在Node脚本中直接访问会得到ReferenceError；`typeof document`允许检查未声明名字。Node中的fetch不是从DOM得到的。文件、进程接口应显式导入，避免把业务核心与某个宿主绑死。

### 34.2 参数、配置、目录与输出

一个进程是操作系统正在执行的程序实例。`process.argv`是命令参数数组：前两项通常是Node可执行文件和入口文件，后面才是用户参数。环境变量是启动进程时传入的文本配置；缺失变量通常是undefined，不能直接当布尔值或端口数字。

当前工作目录（cwd）决定许多相对文件路径的解析；模块位置由模块URL确定。两者常常相同，但不是同一概念。标准输出交付正常结果，标准错误交付诊断；退出码0通常表示成功。

示例 **C34E02**，目录 `js-study/examples/ch34/C34E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const [action, title] = process.argv.slice(2)
console.log(JSON.stringify({ action, title }))
console.log(typeof process.env.PATH)
console.log(process.cwd() === process.cwd())
```

在该示例目录执行：

```powershell
node demo.mjs add "学习模块"
```

预期输出：

```text
{"action":"add","title":"学习模块"}
string
true
```

参数先由shell解析，再交给Node。带空格的标题要在命令中用引号包住。PATH名称在其他平台可能区分大小写；本例面向Windows。真实目录和可执行文件路径因电脑而异，所以没有把它们写成固定输出。

示例 **C34E03**，目录 `js-study/examples/ch34/C34E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const raw = process.env.TASK_LIMIT ?? '20'
const limit = Number(raw)
if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
  console.error('TASK_LIMIT必须为1到100的整数')
  process.exitCode = 2
} else {
  console.log(`最多显示${limit}项`)
}
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
最多显示20项
```

未设置TASK_LIMIT时使用20。PowerShell中可先执行`$env:TASK_LIMIT = "30"`再运行；撤销用`Remove-Item Env:TASK_LIMIT`。赋值字符串"false"仍是真值，不能用`Boolean(process.env.FLAG)`判断开关。`process.exitCode`设置最终退出状态，让已安排的正常收尾有机会完成。

### 34.3 读取终端输入并关闭接口

`node:readline/promises`按行读取输入并返回Promise。接口连着输入输出资源，结束时必须关闭。`question`适合逐问逐答；一次性管道输入更适合异步遍历整行。本例用后者，因此交互和重定向输入都能检查。

示例 **C34E04**，目录 `js-study/examples/ch34/C34E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { createInterface } from 'node:readline'
const input = createInterface({ input: process.stdin, crlfDelay: Infinity })
try {
  for await (const line of input) {
    const title = line.trim()
    if (title === 'q') break
    if (title === '') {
      console.log('标题不能为空')
      continue
    }
    console.log(`收到：${title}`)
  }
} finally {
  input.close()
}
```

在该示例目录执行：

```powershell
node demo.mjs
```

输入内容：

```text
学习Node

q
```

预期输出：

```text
收到：学习Node
标题不能为空
```

运行后逐行输入，q退出；输入结束也会结束循环。`crlfDelay: Infinity`使Windows的回车换行按一行处理。finally同时覆盖正常结束、break和异常，不把资源释放分散到多个分支。

需要逐问逐答时，可以使用下面的Promise接口。输入提示属于输出的一部分，自动检查时应与普通业务结果分开。

示例 **C34E05**，目录 `js-study/examples/ch34/C34E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
const input = createInterface({ input: stdin, output: stdout })
try {
  const title = (await input.question('任务标题：')).trim()
  console.log(title === '' ? '标题不能为空' : `准备添加：${title}`)
} finally {
  input.close()
}
```

在该示例目录执行：

```powershell
node demo.mjs
```

交互检查：输入“复习”并回车，随后出现“准备添加：复习”；只回车应提示空标题。不要在await之前关闭接口。

### 34.4 事件、信号与退出清理

EventEmitter是Node提供的事件发布器。监听器由`on`注册，`emit`按注册顺序同步调用；所以“事件”不自动等于“异步”。`once`只响应一次。特殊的error事件如果没有监听器，可能使程序抛出异常。

示例 **C34E06**，目录 `js-study/examples/ch34/C34E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { EventEmitter } from 'node:events'
const events = new EventEmitter()
const show = (title) => console.log(`保存：${title}`)
events.on('saved', show)
events.once('saved', () => console.log('首次保存'))
events.emit('saved', 'A')
events.emit('saved', 'B')
events.off('saved', show)
console.log(events.listenerCount('saved'))
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
保存：A
首次保存
保存：B
0
```

事件参数直接交给监听器。off需要传入同一个函数对象，重新写一个相同内容的箭头函数不能移除原监听。长期对象应明确监听器所有权，避免反复注册导致重复响应。

Ctrl+C通常触发SIGINT，但信号的具体行为受系统影响。收到退出请求时应停止接收新工作、等待已开始的保存，再自然退出。`exit`事件回调只能执行同步工作，不能在那里启动并期望完成异步写文件。下面用短计时任务演示等待模型，按Ctrl+C检查，而不是声称所有平台信号完全相同。

示例 **C34E07**，目录 `js-study/examples/ch34/C34E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { setTimeout } from 'node:timers/promises'
let stopping = false
process.once('SIGINT', () => {
  stopping = true
  console.log('将在当前任务后结束')
})
console.log('开始；可按Ctrl+C')
while (!stopping) {
  await setTimeout(300)
  console.log('一轮完成')
  stopping = true
}
console.log('已收尾')
```

在该示例目录执行：

```powershell
node demo.mjs
```

不按Ctrl+C时，一轮后退出；若在等待中中断，先提示将在当前任务后结束，再输出收尾。实际服务需为停机等待设置上限，不能无限挂住。这里没有调用`process.exit`，避免中断尚未完成的输出或保存。

### 34.5 命令行任务入口

入口负责解释用户意图，业务函数负责规则。这里先做单次命令：接收动作和标题，拒绝多余参数，输出结构化结果。它只创建内存数据，下一次进程不会自动看到本次任务；文件保存见第35章。

示例 **C34E08**，目录 `js-study/examples/ch34/C34E08/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function parseCommand(args) {
  if (args.length === 1 && args[0] === 'help') return { action: 'help' }
  if (args.length !== 2 || args[0] !== 'add') {
    throw new Error('用法：node demo.mjs add "标题"，或help')
  }
  const title = args[1].trim()
  if (title.length < 1 || title.length > 100) throw new Error('标题长度应为1到100')
  return { action: 'add', title }
}
try {
  const command = parseCommand(process.argv.slice(2))
  console.log(command.action === 'help' ? 'add：添加一项任务' : JSON.stringify(command))
} catch (error) {
  console.error(error.message)
  process.exitCode = 2
}
```

在该示例目录执行：

```powershell
node demo.mjs add 复习CLI
```

预期输出：

```text
{"action":"add","title":"复习CLI"}
```

函数先检查参数形状，再检查标题；错误不会伪装成成功结果。程序内部调用时可直接给parseCommand数组，不需要真正启动终端。正式项目入口应调用已有业务核心，而非在参数解析中重复实现增删改规则。

本章命令解析练习的标题上限100是局部约定；第25章完整任务模型的上限仍为200。将命令入口接到完整业务核心时应由同一套核心规则校验，不在两层长期维护不同的限制。

### 34.6 动手练习与参考答案

**先独立回答。**

1. 用`add ""`运行最后的程序。

2. 为什么不能在exit监听器里await写文件？

3. 把事件例子的once改成on。

4. 从其他目录运行入口，cwd会自动变成源码目录吗？

**参考答案与检查。**

1. 错误通道显示标题长度错误，退出码为2；PowerShell可在命令后查看`$LASTEXITCODE`。

2. 答案：退出阶段不会等待新安排的异步工作，应在进入退出阶段前完成保存。

3. 首次保存提示出现两次。

4. 不会；需要模块位置时用import.meta.url。

### 34.7 本章速查

| 场景     | 做法或返回值                          | 边界               |
| :------- | :------------------------------------ | :----------------- |
| 参数     | `process.argv`.slice(2)返回字符串数组 | 引号由shell处理    |
| 环境变量 | `process.env`.NAME为文本或undefined   | 转换后仍需校验     |
| 工作目录 | `process.cwd()`                       | 不等于模块目录     |
| 退出状态 | `process.exitCode` = 2                | 保留正常收尾机会   |
| 事件     | on/once/off/emit                      | emit同步调用监听器 |
| 终端输入 | readline接口                          | finally中close     |

## 第35章 文件、路径、二进制与流

文件输入输出（Input/Output，I/O）把内存状态连接到外部资源。本章从路径开始，再读写UTF-8文本，最后解释失败保存和分块处理。示例只在自己创建的临时目录工作，避免把练习误用到已有资料。

### 35.1 路径与文件URL

路径是文件的位置描述，不是文件本身。`resolve`按当前工作目录得到绝对路径，`join`按平台规则拼接片段；它们不会创建文件，也不会证明路径位于允许目录。文件URL采用URL语法，不能简单把pathname当作Windows路径。

示例 **C35E01**，目录 `js-study/examples/ch35/C35E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import path from 'node:path'
import { fileURLToPath } from 'node:url'
console.log(path.basename('tasks.json'))
console.log(path.extname('tasks.json'))
console.log(path.win32.join('C:\\data', 'tasks.json'))
console.log(path.basename(fileURLToPath(import.meta.url)))
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
tasks.json
.json
C:\data\tasks.json
demo.mjs
```

用win32接口可以在任何系统演示Windows路径；普通path按当前系统工作。源码中的反斜杠必须转义。fileURLToPath处理空格、百分号和平台路径细节；`new URL("./tasks.json", import.meta.url)`适合定位模块旁资源。

### 35.2 文件与目录操作

Promise版fs接口用await等待。`writeFile`默认以写入模式打开，已有文件会被替换，不是追加；`readFile`指定utf8才返回文本，否则返回Buffer。不存在、没有权限和路径指向目录是不同失败，不能统一当空任务。

示例 **C35E02**，目录 `js-study/examples/ch35/C35E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { mkdtemp, writeFile, readFile, readdir, rename, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const dir = await mkdtemp(join(tmpdir(), 'js-file-'))
try {
  const original = join(dir, 'first.txt')
  await writeFile(original, '学习文件\n', 'utf8')
  await rename(original, join(dir, 'saved.txt'))
  console.log((await readFile(join(dir, 'saved.txt'), 'utf8')).trim())
  console.log(JSON.stringify(await readdir(dir)))
} finally {
  await rm(dir, { recursive: true, force: true })
}
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
学习文件
["saved.txt"]
```

临时目录由mkdtemp生成，finally只删除这个本例拥有的目录。真实用户目录不要直接套用递归删除。await把创建、写入、重命名、读取排成依赖顺序；省掉await可能让读取先于写入完成。

示例 **C35E03**，目录 `js-study/examples/ch35/C35E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { readFile } from 'node:fs/promises'
try {
  await readFile(new URL('./definitely-missing.json', import.meta.url), 'utf8')
} catch (error) {
  if (error.code === 'ENOENT') console.log('没有初始化文件')
  else throw error
}
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
没有初始化文件
```

本例目录没有这个文件。只有ENOENT被解释为尚未初始化；EACCES等错误继续抛出。先exists再读取不能消除竞争，检查与使用之间文件仍可能改变，直接操作并处理具体错误更可靠。

### 35.3 文本、字节与数值视图

字符编码把文本转换成字节。UTF-8是编码规则，Base64和十六进制则是把已有字节表示成文本的方法，都不等于加密。Buffer是Node的字节容器，也是一种Uint8Array；ArrayBuffer描述底层缓冲区，DataView可指定字节序读取数值。

示例 **C35E04**，目录 `js-study/examples/ch35/C35E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const bytes = Buffer.from('中', 'utf8')
console.log(bytes.length)
console.log(bytes.toString('hex'))
console.log(bytes.toString('base64'))
console.log(Buffer.from(bytes.toString('base64'), 'base64').toString('utf8'))
const raw = new ArrayBuffer(4)
const view = new DataView(raw)
view.setUint16(0, 258, false)
console.log(view.getUint8(0), view.getUint8(1))
console.log(view.getUint16(0, true))
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
3
e4b8ad
5Lit
中
1 2
513
```

“中”占一个Unicode码点，但UTF-8占三个字节。大端写258得到字节1、2；用小端读同一两字节得到513。共享底层缓冲区的视图不是独立复制；处理协议必须约定编码、偏移、长度和字节序。ES2026 Uint8Array新编码方法见第43章。

### 35.4 保存失败时保护原文件

把新状态直接写入正式文件，写到一半失败就可能留下截断内容。较好的单进程方案是：先在内存中校验并序列化，写同目录临时文件，完成后重命名替换正式文件，失败则清理临时文件。

这减少读者看到半份JSON的机会，但不能无条件承诺断电不丢数据；目录同步、文件系统、杀毒软件、跨卷移动和多进程竞争都会影响保证。`flush:true`同步文件数据也不等于完整事务或目录持久性。

示例 **C35E05**，目录 `js-study/examples/ch35/C35E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { mkdtemp, writeFile, readFile, rename, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
async function saveJSON(file, value) {
  const text = JSON.stringify(value)
  const temporary = `${file}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, text, { encoding: 'utf8', flag: 'wx', flush: true })
    await rename(temporary, file)
  } finally {
    await rm(temporary, { force: true })
  }
}
const dir = await mkdtemp(join(tmpdir(), 'js-save-'))
try {
  const file = join(dir, 'tasks.json')
  await saveJSON(file, { version: 1, tasks: [] })
  console.log(await readFile(file, 'utf8'))
} finally {
  await rm(dir, { recursive: true, force: true })
}
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"version":1,"tasks":[]}
```

`JSON.stringify`先运行，所以循环引用等序列化错误不会碰正式文件。临时文件与正式文件同目录，避免主动跨卷移动；唯一名字加wx避免无意覆盖其他临时文件。rename失败会向调用者报告，不能悄悄退回“先删旧文件再重命名”。

示例 **C35E06**，目录 `js-study/examples/ch35/C35E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let tail = Promise.resolve()
function enqueue(work) {
  const current = tail.then(work)
  // 队列继续推进，但当前调用者仍能收到自己的失败。
  tail = current.catch(() => {})
  return current
}
const log = []
await Promise.all([
  enqueue(async () => {
    log.push('开始A')
    await Promise.resolve()
    log.push('完成A')
  }),
  enqueue(async () => {
    log.push('开始B')
    log.push('完成B')
  }),
])
console.log(log.join('→'))
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
开始A→完成A→开始B→完成B
```

排队范围应覆盖“读当前状态→检查→生成新状态→保存→提交内存”，而不只是最后writeFile，否则两个请求可能都从旧状态出发。这个队列只约束同一进程中的调用者，不协调多个Node进程，也没有数据库事务的隔离能力。

### 35.5 流、分块与背压【进阶】

流逐块消费数据，适合大文件和网络传输。可读流产生数据，可写流接收数据；背压是接收者来不及处理时让生产者减速的机制。pipeline负责连接、传播失败和关闭相关流，比手动监听多个data/error事件更易维护。

示例 **C35E07**，目录 `js-study/examples/ch35/C35E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { Readable, Transform, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
const collected = []
const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString('utf8').toUpperCase())
  },
})
const destination = new Writable({
  write(chunk, encoding, callback) {
    collected.push(chunk.toString('utf8'))
    callback()
  },
})
await pipeline(Readable.from(['learn', ' node']), upper, destination)
console.log(collected.join(''))
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
LEARN NODE
```

本例只处理ASCII块。任意UTF-8字符可能跨块，不能对每块独立toString后就认为无损；使用带解码状态的流解码器或正确接口。Node流与Web Streams有不同API，可用官方转换接口互操作；不能把getReader直接用于普通Node可读流。

### 35.6 动手练习与参考答案

**先独立回答。**

1. writeFile没有encoding参数且读取时也未指定utf8，得到什么？

2. 两个保存同时调用时，只把rename排队够吗？

3. 删除练习目录前为什么先用mkdtemp？

4. 流例子将upper改为传递原chunk。

**参考答案与检查。**

1. 答案：读取结果是Buffer。

2. 不够；若新数据都从旧内存计算，仍会丢更新，整个修改事务应排队。

3. 答案：确保清理的是本例创建的独立目录，减少误删。

4. 输出learn node。

### 35.7 本章速查

| 场景     | 做法或返回值                   | 边界                         |
| :------- | :----------------------------- | :--------------------------- |
| 路径拼接 | path.join/resolve              | 不创建文件、不授权路径       |
| 文本读取 | readFile(file, "utf8")返回文本 | 无encoding返回Buffer         |
| 写入     | await writeFile                | 默认替换；不可不等待地重叠写 |
| 替换     | 同目录临时文件再rename         | 不等于跨平台断电事务         |
| 二进制   | Buffer/Uint8Array/DataView     | 明确编码、偏移和字节序       |
| 流连接   | await pipeline                 | 传播失败并安排清理           |

## 第36章 使用Node.js建立本机HTTP服务

超文本传输协议（Hypertext Transfer Protocol，HTTP）约定客户端怎样发送请求、服务端怎样返回响应。浏览器是客户端之一，Node也能充当客户端。本章用回环地址127.0.0.1只在本机练习；不需要公网服务器，也不先安装Web框架。

### 36.1 请求、响应与第一个服务

客户端向地址和端口发起请求；服务监听端口，按请求生成响应。请求有方法、URL、标头和可选消息体；响应有状态码、标头和消息体。端口0让系统分配空闲端口，适合自动检查，真实用户访问时通常选择并展示一个固定端口。

下面的`server.mjs`是本章小型运行架：启动、执行检查、关闭。`createServer`的回调每个请求都会调用；监听中的服务会让Node保持运行。用Promise包装错误边界，是为了让异步handler的拒绝也能转成响应。

示例 **C36E01**，目录 `js-study/examples/ch36/C36E01/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `demo.mjs`：

```javascript
import { withServer } from './server.mjs'
await withServer(
  (req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('你好HTTP')
  },
  async (base) => {
    const response = await fetch(base)
    console.log(response.status)
    console.log(await response.text())
  },
)
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
200
你好HTTP
```

先listen成功，才发起请求；读完响应后finally关闭服务。本章先把fetch当作请求工具，第37章逐项解释它。下面每个例子都给齐`server.mjs`，各示例目录互不依赖。

想用浏览器观察，可将上例检查回调替换成真实服务入口。以下是完整独立文件，运行后在浏览器打开显示的地址，按Ctrl+C结束。

示例 **C36E02**，目录 `js-study/examples/ch36/C36E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { createServer } from 'node:http'
const server = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
  res.end('学习服务已启动')
})
server.on('error', (error) => console.error(`监听失败：${error.code}`))
server.listen(3036, '127.0.0.1', () => console.log('打开 http://127.0.0.1:3036'))
process.once('SIGINT', () => server.close())
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期：终端显示地址，页面显示“学习服务已启动”。端口被占用会报告EADDRINUSE；换端口后浏览器地址也要同步修改。127.0.0.1只监听IPv4回环，不把教学服务暴露到其他机器。

### 36.2 方法、路径、查询参数与路由

路由是“请求特征→处理函数”的选择规则。路径与查询字符串分开，`/tasks?done=true`的pathname仍是/tasks。没有匹配资源通常返回404；资源存在而方法不支持时返回405，并通过Allow列出当前支持的方法。不要所有错误都返回200。

示例 **C36E03**，目录 `js-study/examples/ch36/C36E03/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `demo.mjs`：

```javascript
import { withServer, json } from './server.mjs'
await withServer(
  (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname !== '/tasks') return json(res, 404, { error: '未找到' })
    if (req.method !== 'GET') {
      res.setHeader('allow', 'GET')
      return json(res, 405, { error: '方法不支持' })
    }
    const done = url.searchParams.get('done')
    json(res, 200, { done, tasks: [] })
  },
  async (base) => {
    const ok = await fetch(`${base}/tasks?done=false`)
    console.log(ok.status, await ok.text())
    const wrong = await fetch(`${base}/tasks`, { method: 'POST' })
    console.log(wrong.status, wrong.headers.get('allow'))
    await wrong.text()
  },
)
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
200 {"done":"false","tasks":[]}
405 GET
```

查询参数都是字符串；"false"不能直接按布尔值理解。setHeader必须在消息头发送前使用。end表示响应结束，不是结束整个Node进程。真实查询还应拒绝未知或重复参数，避免规则含糊。

### 36.3 读取请求体并拒绝过大或无效数据

网络数据可能分成很多块，收到一个data块不代表请求体完整。用for await按块读取，按字节累计大小，再解码和JSON解析。长度标头不能替代实际计数，因为客户端可能不提供或声明错误。

下面采用“超限后丢弃剩余数据、再返回413”的小型教学策略；这能保护缓冲内存，但不防无限慢速连接。真实服务还需设置请求超时和连接限制。异常码只在本模块内部使用，不把原始调用栈暴露给客户端。

示例 **C36E04**，目录 `js-study/examples/ch36/C36E04/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `body.mjs`：

```javascript
export async function readJSON(req, limit = 1024) {
  let size = 0
  let exceeded = false
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) exceeded = true
    if (!exceeded) chunks.push(chunk)
  }
  if (exceeded) throw Object.assign(new Error('请求过大'), { status: 413 })
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('JSON无效'), { status: 400 })
  }
}
```

文件 `demo.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { readJSON } from './body.mjs'
await withServer(
  async (req, res) => {
    try {
      if (!req.headers['content-type']?.startsWith('application/json')) {
        return json(res, 415, { error: '需要JSON' })
      }
      const value = await readJSON(req, 128)
      if (
        !value ||
        typeof value !== 'object' ||
        Array.isArray(value) ||
        typeof value.title !== 'string' ||
        value.title.trim() === ''
      ) {
        return json(res, 422, { error: '标题无效' })
      }
      json(res, 201, { title: value.title.trim() })
    } catch (error) {
      if (error.status) json(res, error.status, { error: error.message })
      else throw error
    }
  },
  async (base) => {
    for (const body of ['{"title":" 学HTTP "}', '{', '{"title":""}', 'x'.repeat(129)]) {
      const response = await fetch(base, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      })
      console.log(response.status, await response.text())
    }
  },
)
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
201 {"title":"学HTTP"}
400 {"error":"JSON无效"}
422 {"error":"标题无效"}
413 {"error":"请求过大"}
```

先检查媒体类型，再限制字节、解析语法、检查结构和业务。JSON本身合法并不证明value是任务对象。客户端断开时读取可能抛错；入口必须在外层捕获，不因一次请求失败产生未处理拒绝。

### 36.4 提供静态页面并保持路径边界

静态资源是直接返回的HTML、CSS或模块文件。把req.url直接拼接到磁盘路径会扩大读取范围。初学项目可以明确列出允许的URL和文件，不必一开始写通用文件服务器。内容类型决定浏览器怎样处理响应，模块应提供JavaScript媒体类型。

示例 **C36E05**，目录 `js-study/examples/ch36/C36E05/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `demo.mjs`：

```javascript
import { readFile } from 'node:fs/promises'
import { withServer, json } from './server.mjs'
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
])
await withServer(
  async (req, res) => {
    const route = files.get(new URL(req.url, 'http://localhost').pathname)
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return json(res, 405, { error: '仅支持GET' })
    }
    if (!route) return json(res, 404, { error: '未找到' })
    const [name, type] = route
    const content = await readFile(new URL(name, import.meta.url))
    res.writeHead(200, { 'content-type': type })
    res.end(content)
  },
  async (base) => {
    const page = await fetch(base)
    console.log(page.status, (await page.text()).includes('任务页'))
    const blocked = await fetch(`${base}/secret.txt`)
    console.log(blocked.status)
    await blocked.text()
  },
)
```

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <meta charset="utf-8" /><title>任务页</title>
  <h1 id="title">任务页</h1>
  <script type="module" src="/app.mjs"></script>
</html>
```

文件 `app.mjs`：

```javascript
document.querySelector('#title').textContent = '任务页已加载'
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
200 true
404
```

本例没有把任何用户字符串当文件名；即使请求其他路径，也只能得到404。浏览器页面与接口由同一服务提供时，可以用相对URL请求，减少跨源配置。

### 36.5 监听失败、异步失败与关闭

启动阶段和请求处理阶段是两种错误边界。监听失败可能是地址或端口不可用；请求中的异步失败需要明确转成错误响应。HTTP服务的关闭也应等待回调，避免测试结束后仍有监听端口。

示例 **C36E06**，目录 `js-study/examples/ch36/C36E06/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `demo.mjs`：

```javascript
import { withServer } from './server.mjs'
await withServer(
  async () => {
    await Promise.resolve()
    throw new Error('模拟业务失败')
  },
  async (base) => {
    const response = await fetch(base)
    console.log(response.status, await response.text())
  },
)
console.log('服务已关闭')
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
500 server error
服务已关闭
```

封装在Promise链里调用handler，因此同步throw和异步拒绝都进入同一catch。若已经开始发送内容，不能重新发送一套状态码；流式服务还需考虑直接销毁连接。向客户端返回稳定错误，详细原因留在服务端日志。

示例 **C36E07**，目录 `js-study/examples/ch36/C36E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { createServer } from 'node:http'
const first = createServer()
await new Promise((resolve) => first.listen(0, '127.0.0.1', resolve))
const second = createServer()
try {
  await new Promise((resolve, reject) => {
    second.once('error', reject)
    second.listen(first.address().port, '127.0.0.1', resolve)
  })
} catch (error) {
  console.log(error.code)
} finally {
  await new Promise((resolve) => first.close(resolve))
}
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
EADDRINUSE
```

本例主动让两个服务争用同一端口，错误是预期现象。端口0仍需在listen完成后才读取address。测试使用临时端口，手动项目使用固定端口时应给出友好提示。

### 36.6 动手练习与参考答案

**先独立回答。**

1. 将路由请求改为/tasks2。

2. 发送129字节的请求与空标题分别属于什么失败？

3. 为什么只catch `JSON.parse`不足以保护服务？

4. 为什么不能直接读取“项目目录+req.url”？

**参考答案与检查。**

1. 404，而不是空任务成功响应。

2. 答案：413体积限制；422业务数据无效。

3. 答案：读流、业务函数、文件操作都可能失败，入口要有总错误边界。

4. 答案：路径可能越界、带编码/查询参数，固定资源映射更容易检查。

### 36.7 本章速查

| 场景          | 做法或返回值               | 边界                       |
| :------------ | :------------------------- | :------------------------- |
| HTTP成功      | 200查询、201创建等         | 按实际语义选择             |
| 资源/方法错误 | 404／405；405必须附`Allow` | 方法表与实际路由一致       |
| 请求体        | 按字节限额、再解析和校验   | Content-Length不是完整防线 |
| 静态文件      | 固定URL到文件映射          | 给正确MIME                 |
| 启停          | 等待listen/close           | 处理error与异步拒绝        |

## 第37章 HTTP、Fetch与网络错误

本章把前章的本机服务当作可控制的练习对象。Fetch是由相关平台提供的网络接口，不属于ECMA-262语言本身。Node和浏览器都能提供fetch，但浏览器还执行同源策略等安全规则。

### 37.1 先观察请求和响应

统一资源定位符（URL）描述协议、主机、端口、路径和查询。读取响应时要分别看状态码、标头和正文。下面的`scenario.mjs`在每次练习时启动第36章同样的本机运行架，完成后关闭；全部文件随例给出，不依赖公网演示API。

示例 **C37E01**，目录 `js-study/examples/ch37/C37E01/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `scenario.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { setTimeout } from 'node:timers/promises'
export async function scenario(use) {
  await withServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/fail') return json(res, 503, { error: '稍后重试' })
    if (url.pathname === '/text') {
      res.end('不是JSON')
      return
    }
    if (url.pathname === '/slow') await setTimeout(150)
    if (url.pathname === '/echo') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      return json(res, 200, {
        method: req.method,
        text: Buffer.concat(chunks).toString('utf8'),
      })
    }
    json(res, 200, { tasks: [{ id: 1, title: '学习Fetch', done: false }] })
  }, use)
}
```

文件 `demo.mjs`：

```javascript
import { scenario } from './scenario.mjs'
await scenario(async (base) => {
  const response = await fetch(new URL('/tasks?done=false', base))
  console.log(response.status, response.ok)
  console.log(response.headers.get('content-type'))
  const value = await response.json()
  console.log(value.tasks[0].title)
})
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
200 true
application/json; charset=utf-8
学习Fetch
```

fetch的Promise完成时表示响应对象已经可用，不代表正文已全部读取。`response.json`又返回Promise。Content-Type有助于选择解析方式，但不是数据结构正确的证明。

### 37.2 构造请求与消费正文

Request描述待发送请求；Response描述响应。JSON请求需要自己序列化并声明媒体类型。请求方法GET通常没有请求体，查询条件放URLSearchParams更合适。响应正文通常只能消费一次；需要两份消费时应在读取前clone，且注意复制缓冲成本。

示例 **C37E02**，目录 `js-study/examples/ch37/C37E02/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `scenario.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { setTimeout } from 'node:timers/promises'
export async function scenario(use) {
  await withServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/fail') return json(res, 503, { error: '稍后重试' })
    if (url.pathname === '/text') {
      res.end('不是JSON')
      return
    }
    if (url.pathname === '/slow') await setTimeout(150)
    if (url.pathname === '/echo') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      return json(res, 200, {
        method: req.method,
        text: Buffer.concat(chunks).toString('utf8'),
      })
    }
    json(res, 200, { tasks: [{ id: 1, title: '学习Fetch', done: false }] })
  }, use)
}
```

文件 `demo.mjs`：

```javascript
import { scenario } from './scenario.mjs'
await scenario(async (base) => {
  const request = new Request(`${base}/echo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: '任务A' }),
  })
  const response = await fetch(request)
  const copy = response.clone()
  console.log(JSON.stringify(await response.json()))
  console.log(response.bodyUsed)
  console.log((await copy.text()).includes('任务A'))
})
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"method":"POST","text":"{\"title\":\"任务A\"}"}
true
true
```

服务返回回显对象，所以text字段里仍是请求JSON文本，才会看到转义引号。bodyUsed变true后不能再对原响应调用text；clone保留另一消费入口。大型响应不应为了日志随意克隆并完整缓冲。

### 37.3 分清网络、HTTP与数据失败

fetch通常不会因为HTTP 404或503而拒绝，它仍成功取得一个响应。网络无法建立、连接中断或取消可能导致拒绝；JSON解析错误发生在读取阶段；字段不满足任务格式属于业务校验失败。错误提示应对应真正阶段。

示例 **C37E03**，目录 `js-study/examples/ch37/C37E03/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `scenario.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { setTimeout } from 'node:timers/promises'
export async function scenario(use) {
  await withServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/fail') return json(res, 503, { error: '稍后重试' })
    if (url.pathname === '/text') {
      res.end('不是JSON')
      return
    }
    if (url.pathname === '/slow') await setTimeout(150)
    if (url.pathname === '/echo') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      return json(res, 200, {
        method: req.method,
        text: Buffer.concat(chunks).toString('utf8'),
      })
    }
    json(res, 200, { tasks: [{ id: 1, title: '学习Fetch', done: false }] })
  }, use)
}
```

文件 `demo.mjs`：

```javascript
import { scenario } from './scenario.mjs'
await scenario(async (base) => {
  const response = await fetch(`${base}/fail`)
  console.log('已收到响应', response.status, response.ok)
  if (!response.ok) console.log((await response.json()).error)
  try {
    const invalid = await fetch(`${base}/text`)
    await invalid.json()
  } catch (error) {
    console.log('解析失败', error instanceof SyntaxError)
  }
})
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
已收到响应 503 false
稍后重试
解析失败 true
```

不要把“catch执行”作为判断所有失败的唯一方式。调用者需要主动检查ok；再解析错误正文时仍可能失败，不能要求所有网关、代理或服务错误都返回同一种JSON。

示例 **C37E04**，目录 `js-study/examples/ch37/C37E04/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `scenario.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { setTimeout } from 'node:timers/promises'
export async function scenario(use) {
  await withServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/fail') return json(res, 503, { error: '稍后重试' })
    if (url.pathname === '/text') {
      res.end('不是JSON')
      return
    }
    if (url.pathname === '/slow') await setTimeout(150)
    if (url.pathname === '/echo') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      return json(res, 200, {
        method: req.method,
        text: Buffer.concat(chunks).toString('utf8'),
      })
    }
    json(res, 200, { tasks: [{ id: 1, title: '学习Fetch', done: false }] })
  }, use)
}
```

文件 `demo.mjs`：

```javascript
import { scenario } from './scenario.mjs'
function validateTasks(value) {
  if (
    !value ||
    !Array.isArray(value.tasks) ||
    value.tasks.some(
      (task) =>
        !task ||
        !Number.isSafeInteger(task.id) ||
        typeof task.title !== 'string' ||
        typeof task.done !== 'boolean',
    )
  )
    throw new TypeError('任务数据格式不符')
  return value.tasks
}
await scenario(async (base) => {
  const response = await fetch(base)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  console.log(validateTasks(await response.json()).length)
  try {
    validateTasks({ tasks: [{ id: '1' }] })
  } catch (error) {
    console.log(error.message)
  }
})
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1
任务数据格式不符
```

校验函数和请求分离，便于测试。本例只覆盖演示字段，正式模型还需ID范围、标题长度、重复ID等规则。网络数据和本地JSON都不能因为来源熟悉就省略边界校验。

### 37.4 来源、CORS与凭据

来源由协议、主机和端口组成。浏览器页面跨源读取受到同源策略限制；跨源资源共享（Cross-Origin Resource Sharing，CORS）由服务端响应标头授权读取，某些请求会先预检。Node没有浏览器页面来源模型，所以Node成功不证明浏览器可以读取。

`mode:"no-cors"`不是绕过限制的开关，它会限制请求并通常得到不可读取的opaque响应。携带cookie的跨源请求还涉及credentials、明确来源、服务端允许凭据和cookie自身属性；不能把Allow-Origin设置为通配符后就宣称凭据可用。

示例 **C37E05**，目录 `js-study/examples/ch37/C37E05/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `scenario.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { setTimeout } from 'node:timers/promises'
export async function scenario(use) {
  await withServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/fail') return json(res, 503, { error: '稍后重试' })
    if (url.pathname === '/text') {
      res.end('不是JSON')
      return
    }
    if (url.pathname === '/slow') await setTimeout(150)
    if (url.pathname === '/echo') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      return json(res, 200, {
        method: req.method,
        text: Buffer.concat(chunks).toString('utf8'),
      })
    }
    json(res, 200, { tasks: [{ id: 1, title: '学习Fetch', done: false }] })
  }, use)
}
```

文件 `demo.mjs`：

```javascript
import { scenario } from './scenario.mjs'
const first = new URL('http://127.0.0.1:3000/tasks')
const second = new URL('http://127.0.0.1:3001/tasks')
console.log(first.origin === second.origin)
await scenario(async (base) => {
  const response = await fetch(base)
  console.log(response.headers.get('access-control-allow-origin'))
  console.log(response.status)
})
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
false
null
200
```

本例用Node运行，所以服务没有CORS授权头仍能读取。浏览器验证时，可从另一端口页面请求同一接口，在网络面板看预检或CORS诊断；要复现需两个实际运行的来源。主线综合项目采用同源页面与API，不需要为了教学主动放宽跨源规则。

### 37.5 超时、取消与有限重试

超时是一种业务等待上限，取消需要底层操作协作。AbortController可以主动发送取消信号，AbortSignal.timeout生成超时信号。`Promise.race`只竞争结果，不会自动停止输掉的请求。重试应限制次数、增加间隔，并考虑操作是否幂等；创建任务不能盲目重试导致重复创建。

示例 **C37E06**，目录 `js-study/examples/ch37/C37E06/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `scenario.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { setTimeout } from 'node:timers/promises'
export async function scenario(use) {
  await withServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/fail') return json(res, 503, { error: '稍后重试' })
    if (url.pathname === '/text') {
      res.end('不是JSON')
      return
    }
    if (url.pathname === '/slow') await setTimeout(150)
    if (url.pathname === '/echo') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      return json(res, 200, {
        method: req.method,
        text: Buffer.concat(chunks).toString('utf8'),
      })
    }
    json(res, 200, { tasks: [{ id: 1, title: '学习Fetch', done: false }] })
  }, use)
}
```

文件 `demo.mjs`：

```javascript
import { scenario } from './scenario.mjs'
await scenario(async (base) => {
  try {
    await fetch(`${base}/slow`, { signal: AbortSignal.timeout(10) })
  } catch (error) {
    console.log(error.name === 'TimeoutError' || error.name === 'AbortError')
  }
  const controller = new AbortController()
  controller.abort()
  try {
    await fetch(base, { signal: controller.signal })
  } catch (error) {
    console.log(error.name)
  }
})
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
true
AbortError
```

先取消再请求会直接拒绝；超时的具体名称按信号和实现而异，本例只核对属于预期取消类别。服务端可能已经接到请求并继续执行，因此取消客户端等待并不等于回滚服务端状态。

示例 **C37E07**，目录 `js-study/examples/ch37/C37E07/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `scenario.mjs`：

```javascript
import { withServer, json } from './server.mjs'
import { setTimeout } from 'node:timers/promises'
export async function scenario(use) {
  await withServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/fail') return json(res, 503, { error: '稍后重试' })
    if (url.pathname === '/text') {
      res.end('不是JSON')
      return
    }
    if (url.pathname === '/slow') await setTimeout(150)
    if (url.pathname === '/echo') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      return json(res, 200, {
        method: req.method,
        text: Buffer.concat(chunks).toString('utf8'),
      })
    }
    json(res, 200, { tasks: [{ id: 1, title: '学习Fetch', done: false }] })
  }, use)
}
```

文件 `demo.mjs`：

```javascript
import { scenario } from './scenario.mjs'
import { setTimeout } from 'node:timers/promises'
async function getWithRetry(url, attempts = 2) {
  for (let index = 0; index < attempts; index++) {
    const response = await fetch(url)
    if (response.ok) return response.json()
    await response.arrayBuffer()
    if (response.status !== 503 || index === attempts - 1) {
      throw new Error(`HTTP ${response.status}，尝试${index + 1}次`)
    }
    await setTimeout(10 * (index + 1))
  }
}
await scenario(async (base) => {
  try {
    await getWithRetry(`${base}/fail`)
  } catch (error) {
    console.log(error.message)
  }
})
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
HTTP 503，尝试2次
```

本函数只示范GET及503的有限重试，不是通用网络库；网络错误此处直接抛出。每次失败消费正文后再继续，避免闲置连接资源。界面还需请求序号或取消旧请求，防止旧搜索结果覆盖新搜索结果。

### 37.6 动手练习与参考答案

**先独立回答。**

1. fetch收到404会自动进入catch吗？

2. 为什么取消添加任务请求后仍可能看到新增数据？

3. 对同一响应先json后text，应该成功吗？

4. 把503重试次数改为1。

**参考答案与检查。**

1. 不会，先检查response.ok。

2. 答案：请求可能已到服务端，取消等待不撤销已执行操作。

3. 通常不能；正文已消费。需要先clone或只读取一次。

4. 错误显示尝试1次。

### 37.7 本章速查

| 场景     | 做法或返回值                                 | 边界               |
| :------- | :------------------------------------------- | :----------------- |
| 请求     | `fetch(url, options)`返回`Promise<Response>` | HTTP失败不自动拒绝 |
| 正文     | await `response.json`/text                   | 通常一次消费       |
| HTTP检查 | response.ok表示200至299                      | 仍需业务校验       |
| 取消     | signal: controller.signal                    | 不回滚服务端       |
| CORS     | 浏览器授权读取机制                           | no-cors不是绕过    |
| 重试     | 限次数、限范围、考虑幂等                     | 不盲重试创建       |

## 第38章 npm、依赖与工程工具

包是可以分发的一组代码和元数据；包管理器负责获取依赖并记录关系。Node负责运行，npm负责管理包，这两者有各自版本。前面的内置模块练习不需要npm安装，本章在独立目录学习工具链，避免把工具堆成第一行程序的前提。

### 38.1 package.json、脚本与依赖分类

`package.json`描述项目名字、版本、模块类型、运行脚本和依赖。JSON不能写注释，不能在最后一项后留多余逗号。运行时依赖供程序运行使用；开发依赖供开发、检查和构建使用，但分类不改变包代码是否值得信任。

示例 **C38E01**，目录 `js-study/examples/ch38/C38E01/`，环境：Node.js。

文件 `package.json`：

```json
{
  "name": "js-package-lesson",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": { "demo": "node demo.mjs" }
}
```

文件 `demo.mjs`：

```javascript
console.log('准备学习npm')
```

在该示例目录执行：

```powershell
npm run demo
```

预期输出：

```text
准备学习npm
```

在项目目录执行`npm run demo`时，npm读取scripts.demo并启动node。`private:true`可减少误发包；它不等于访问控制。项目版本1.0.0是本项目版本，不是Node版本。

命令第一次显示的脚本标题、npm提示会随版本变化；上面的固定业务结果是“准备学习npm”。可先运行`node --version`与`npm --version`分别检查，不根据其中一个推断另一个。

### 38.2 安装、锁文件与可重复运行

`npm install`根据项目清单解析依赖，并生成或更新`package-lock.json`；锁文件记录具体解析结果及完整性信息。`npm ci`要求已经有匹配的锁文件，按锁文件执行干净安装，并会清理原node_modules。它不能用来添加单个依赖，也不会帮你修复清单与锁文件不一致。

示例 **C38E02**，目录 `js-study/examples/ch38/C38E02/`，环境：Node.js。

文件 `package.json`：

```json
{
  "name": "js-lock-lesson",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": { "check": "node demo.mjs" }
}
```

文件 `demo.mjs`：

```javascript
console.log('模块类型明确')
```

在该示例目录执行：

```powershell
npm install
npm ci
npm run check
```

此例没有外部依赖，先`npm install`建立锁文件，再`npm ci`复现。预期检查：产生`package-lock.json`，`npm run check`成功输出“模块类型明确”。不要用自己的猜测手写第三方依赖完整性哈希。

node_modules通常可以从清单和锁文件重新获取，不应把它当作唯一资料备份。锁文件提高可重复性，但操作系统、Node、原生扩展、安装脚本和外部服务仍会影响结果。离线环境不能假定第一次安装一定成功。

### 38.3 版本范围、项目Node约定与升级

语义化版本常写成主版本.次版本.补丁版本：主版本可能不兼容，次版本增加兼容功能，补丁修复兼容问题，但最终仍需看变更说明。固定版本减少自动漂移；`^`、`~`等范围允许更新的跨度不同，0.x还有更保守的规则。

依赖范围和Node运行版本是两件事。项目可以用.nvmrc约定版本，用engines说明支持范围，再通过启动检查给出直接错误。第2章讲安装和切换；此处只管理项目约定。nvm-sh按shell选择版本，当前nvm-windows实现与旧版也有差异，不能把其中一种行为套给所有工具。

示例 **C38E03**，目录 `js-study/examples/ch38/C38E03/`，环境：Node.js。

文件 `package.json`：

```json
{
  "name": "js-runtime-contract",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=26 <27" },
  "scripts": { "check": "node demo.mjs" }
}
```

文件 `.nvmrc`：

```text
26.13.0
```

文件 `demo.mjs`：

```javascript
const major = Number(process.versions.node.split('.')[0])
if (major !== 26) throw new Error('请切换到Node.js 26')
console.log('目标Node主版本已匹配')
```

在该示例目录执行：

```powershell
node --version
npm run check
```

预期输出：

```text
目标Node主版本已匹配
```

先按第2章切到26.13.0再运行。nvm-sh可在项目目录执行`nvm install`、`nvm use`读取.nvmrc；nvm-windows按其当前版本的.nvmrc支持使用，fnm可执行`fnm install`、`fnm use`读取.nvmrc，或显式执行`fnm use 26.13.0`。管理器命令按实际选择分别使用，切换后都用`node --version`核对。engines通常属于提示，不会自动安装Node；启动脚本显式拒绝错误主版本。

升级流程：阅读官方发布说明→更新项目约定和依赖→重新安装→运行测试与构建→提交清单和锁文件。多版本切换后，全局包可能不在新版本路径中；优先项目本地工具，避免在每个Node版本中重复装一套不可追踪的全局工具。

### 38.4 本地命令、npm exec与安装脚本

`npm run`会把本地node_modules/.bin加入脚本命令查找路径，因此scripts里的vite通常指向项目版本。`npm exec`或npx在本地没有命令时可能获取包并执行，不是“纯查询命令”。包安装还可能执行生命周期脚本，应确认来源、名字、许可证和维护状态，避免拼写相近包。

示例 **C38E04**，目录 `js-study/examples/ch38/C38E04/`，环境：Node.js。

文件 `package.json`：

```json
{
  "name": "js-script-args",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": { "say": "node demo.mjs" }
}
```

文件 `demo.mjs`：

```javascript
console.log(`本地脚本${process.argv[2] ?? '无参数'}`)
```

在该示例目录执行：

```powershell
npm run say -- "可以传参"
```

预期输出：

```text
本地脚本可以传参
```

执行`npm run say -- "可以传参"`，双横线后参数转交给脚本。命令和可执行代码来自哪里要能说明；学习例子不用全局安装来掩盖本地缺失依赖。

检查第三方包时可以运行`npm view 包名 version engines license repository`，但返回的信息仍应与官方项目核对。`npm audit`提供已知漏洞线索，不是代码安全证明；不要不读变更说明就执行可能跨主版本的强制修复。敏感令牌不写入`package.json`、源码或公开仓库。

### 38.5 检查、格式化与构建的职责

静态检查器分析代码规则，格式化工具统一排版，构建工具组织模块和输出资源。三者都不能代替行为测试。Vite为开发提供模块服务与更新，为构建生成资源；它不自动让所有最新内置API在旧浏览器存在。转译处理语法，polyfill补部分运行时能力，两者边界不同。

下面固定Vite 8.3.5作为工具练习版本，满足本书Node 26环境。它是独立练习，不改变第45章无第三方依赖的综合项目。

示例 **C38E05**，目录 `js-study/examples/ch38/C38E05/`，环境：Node.js。

文件 `package.json`：

```json
{
  "name": "js-vite-lesson",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "devDependencies": { "vite": "8.3.5" }
}
```

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <meta charset="utf-8" /><title>Vite练习</title>
  <p id="result"></p>
  <script type="module" src="/main.mjs"></script>
</html>
```

文件 `main.mjs`：

```javascript
document.querySelector('#result').textContent = '构建工具已工作'
```

在该示例目录执行：

```powershell
npm install
npm run build
npm run dev
```

运行`npm install`后执行`npm run dev`，打开终端显示地址，页面显示“构建工具已工作”；`npm run build`应生成dist。开发端口可能被占用而变化，以终端为准。固定版本不表示它永远是最新工具版本。

下面展示不依赖额外共享配置包的ESLint平面配置。安装命令固定ESLint 10.0.0、Prettier 3.6.2，目的是复现本例，而非要求所有项目采用同一版本。配置中显式写sourceType，示范“规则检查”和“排版检查”分别执行。

示例 **C38E06**，目录 `js-study/examples/ch38/C38E06/`，环境：Node.js。

文件 `package.json`：

```json
{
  "name": "js-quality-lesson",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "lint": "eslint demo.mjs",
    "format:write": "prettier --write demo.mjs",
    "format": "prettier --check demo.mjs"
  },
  "devDependencies": {
    "eslint": "10.0.0",
    "prettier": "3.6.2"
  }
}
```

文件 `eslint.config.mjs`：

```javascript
export default [
  {
    files: ['**/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: { 'no-undef': 'error', eqeqeq: ['error', 'always'] },
  },
]
```

文件 `.prettierrc.json`：

```json
{
  "semi": false,
  "singleQuote": true,
  "endOfLine": "lf"
}
```

文件 `demo.mjs`：

```javascript
const count = 2
if (count === 2) {
  // 业务代码在后续练习补充；这里仅检查语法和排版。
}
```

在该示例目录执行：

```powershell
npm install
npm run lint
npm run format:write
npm run format
```

先安装工具并运行lint，再用format:write将示例文件整理为配置要求的格式，最后format只检查而不修改。endOfLine设为lf，明确统一换行；Windows编辑器保存的CRLF文件在修正前可能报告格式差异，这与JavaScript语法错误不同。预期：lint不报告未定义变量；修正后的格式检查退出码为0，耗时和显示文字以实际工具为准。若安装环境不满足工具要求，先检查Node与工具官方engines，不靠忽略错误继续执行。

### 38.6 动手练习与参考答案

**先独立回答。**

1. 没有锁文件直接`npm ci`会怎样？

2. engines能自动帮你切Node吗？

3. 为什么本地工具比单纯全局工具更适合共享项目？

4. 如果Vite构建成功，能否保证旧浏览器支持Map新方法？

**参考答案与检查。**

1. 答案：失败；先通过`npm install`建立并检查锁文件。

2. 不能；第2章的管理器负责选择运行时，启动检查负责发现不一致。

3. 答案：版本记录在项目中，其他人可以按锁文件获取。

4. 不能，构建与运行时API兼容要分开检查。

### 38.7 本章速查

| 场景            | 做法或返回值              | 边界                           |
| :-------------- | :------------------------ | :----------------------------- |
| 清单            | `package.json`            | JSON无注释                     |
| 首次安装/改依赖 | `npm install`             | 可能更新锁文件                 |
| 按锁文件安装    | `npm ci`                  | 清理node_modules，要求清单匹配 |
| 本地脚本        | `npm run` 名称 -- 参数    | 工具版本来自项目               |
| Node约定        | .nvmrc、engines、启动检查 | 管理器行为按版本区分           |
| 质量/构建       | lint、format、build、test | 各自保证不同事项               |

本章参考：[npm文档](https://docs.npmjs.com/)、[Vite指南](https://vite.dev/guide/)、[ESLint配置说明](https://eslint.org/docs/latest/use/configure/)、[Prettier 3.6.2：命令行](https://github.com/prettier/prettier/blob/3.6.2/docs/cli.md)。

## 第39章 调试、自动化测试与行为验证

测试是可重复地执行操作并检查可观察结果；调试是追踪一次执行发生了什么。断言把“应该如此”写成可以失败的检查。本章用Node内置测试工具，不先引入第三方框架；界面测试与单元测试各有覆盖边界。

### 39.1 复现、断点与调用栈

遇到问题先记输入、预期、实际和环境，再缩成最小复现。断点让程序在指定行暂停；单步进入函数、跨过调用、跳出当前函数帮助观察状态。调用栈显示当前函数从哪里被调用，不保证每个异步上下文都像同步调用那样完整显示。

示例 **C39E01**，目录 `js-study/examples/ch39/C39E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function totalMinutes(tasks) {
  let total = 0
  for (const task of tasks) {
    const minutes = Number(task.minutes)
    if (!Number.isFinite(minutes)) throw new TypeError('分钟数不是有限数值')
    total += minutes
  }
  return total
}
console.log(totalMinutes([{ minutes: '20' }, { minutes: 10 }]))
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
30
```

先用两项输入复现，再在Number转换和total累加处设断点。若错误程序使用total += task.minutes，字符串可能造成拼接；只看最后输出容易错过第一次状态变成文本的位置。日志也会改变时序和成本，复杂问题应结合断点。

### 39.2 浏览器与Node调试入口

浏览器在Sources面板选择模块并设断点，Network面板查看请求、状态和正文，Console面板检查异常。Node可通过Inspector协议连接调试器，`--inspect-brk`在用户代码开始前暂停。调试端口有控制程序的能力，只在本机使用，不暴露到公网。

示例 **C39E02**，目录 `js-study/examples/ch39/C39E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const tasks = [{ title: '调试', minutes: 15 }]
function summary(items) {
  debugger
  return items.map((item) => `${item.title}:${item.minutes}`).join(',')
}
console.log(summary(tasks))
```

在该示例目录执行：

```powershell
node --inspect-brk demo.mjs
```

执行`node --inspect-brk demo.mjs`后，按终端提示使用支持Inspector的编辑器或浏览器连接。继续后会在debugger处暂停，观察items和调用栈；再继续输出调试:15。普通`node demo.mjs`没有连接调试器时，debugger通常不会暂停。

### 39.3 node:test与严格断言

测试用例描述一个行为和判断。`node:test`提供test；`node:assert/strict`提供严格相等、深度结构比较和异常检查。测试名称应说明输入条件及期望行为，避免只有“测试1”。运行器会汇总通过、失败和耗时；耗时和部分格式不是固定输出。

示例 **C39E03**，目录 `js-study/examples/ch39/C39E03/`，环境：Node.js。

文件 `task.mjs`：

```javascript
export function cleanTitle(value) {
  if (typeof value !== 'string') throw new TypeError('标题必须是文本')
  const title = value.trim()
  if (title.length < 1 || title.length > 100) throw new RangeError('标题长度应为1到100')
  return title
}
export function addTask(tasks, id, title) {
  if (!Number.isSafeInteger(id) || id < 1 || tasks.some((task) => task.id === id)) {
    throw new RangeError('ID无效或重复')
  }
  return [...tasks, { id, title: cleanTitle(title), done: false }]
}
```

文件 `task.test.mjs`：

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanTitle, addTask } from './task.mjs'
test('标题去掉首尾空白', () => {
  assert.equal(cleanTitle(' A '), 'A')
})
test('拒绝非文本和空标题', () => {
  assert.throws(() => cleanTitle(1), TypeError)
  assert.throws(() => cleanTitle('   '), RangeError)
})
test('添加返回新数组且保留原数组', () => {
  const original = []
  assert.deepEqual(addTask(original, 1, 'A'), [{ id: 1, title: 'A', done: false }])
  assert.deepEqual(original, [])
})
```

在该示例目录执行：

```powershell
node --test task.test.mjs
```

执行后应全部通过；统计和耗时随环境变化。严格断言不把"1"当1；deepEqual比较数据结构，不能用它证明两个对象拥有同一身份。throws接收函数，传`cleanTitle(1)`会在断言接管之前先抛错。

示例 **C39E04**，目录 `js-study/examples/ch39/C39E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
const first = { id: 1 }
const second = { id: 1 }
assert.deepEqual(first, second)
assert.notEqual(first, second)
assert.throws(() => assert.equal('1', 1))
console.log('结构、身份与类型检查通过')
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
结构、身份与类型检查通过
```

断言表达的是行为契约，不能只复制实现的每一步。对纯函数重点检查输入输出与是否修改；对文件模块检查失败时原文件是否保留；对HTTP模块检查状态码和返回内容。

### 39.4 异步、边界与隔离

异步测试必须返回或await真正的Promise，否则测试可能已经结束，后续失败才发生。文件测试用独立临时目录，网络测试用端口0；不能假设当前工作目录没有用户文件。时间与随机值最好从参数传入，让测试能控制。

示例 **C39E05**，目录 `js-study/examples/ch39/C39E05/`，环境：Node.js。

文件 `async.test.mjs`：

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'
async function load(value) {
  if (value < 0) throw new RangeError('不能为负')
  return value * 2
}
function createdAt(clock = Date.now) {
  return new Date(clock()).toISOString()
}
test('异步正常和拒绝路径', async () => {
  assert.equal(await load(2), 4)
  await assert.rejects(() => load(-1), RangeError)
})
test('时钟通过参数控制', () => {
  assert.equal(
    createdAt(() => Date.UTC(2026, 0, 1)),
    '2026-01-01T00:00:00.000Z',
  )
})
```

在该示例目录执行：

```powershell
node --test async.test.mjs
```

检查：异步拒绝被正确捕获，固定时钟产生2026-01-01；不依赖机器此刻时间。不要写assert.throws(async ()=>...)来检查Promise拒绝，应使用assert.rejects。

示例 **C39E06**，目录 `js-study/examples/ch39/C39E06/`，环境：Node.js。

文件 `file.test.mjs`：

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
test('UTF-8任务文件可往返', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'js-test-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const file = join(dir, 'tasks.json')
  const tasks = [{ id: 1, title: '测试', done: false }]
  await writeFile(file, JSON.stringify(tasks), 'utf8')
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), tasks)
})
```

在该示例目录执行：

```powershell
node --test file.test.mjs
```

检查：测试结束后临时目录已清理，写入与读取使用同一编码。真实保存模块还应通过可注入失败或受控路径错误验证旧数据保护，不能只测试写成功。

### 39.5 单元、集成与浏览器检查

单元测试检查一个局部规则，集成测试检查多个模块连接，端到端测试从用户入口完成流程。Node里检查纯函数通过，不说明DOM事件、焦点、存储权限或浏览器CORS也通过。静态语法检查更不能代替运行检查。

示例 **C39E07**，目录 `js-study/examples/ch39/C39E07/`，环境：Node.js。

文件 `server.mjs`：

```javascript
import { createServer } from 'node:http'
export async function withServer(handler, use) {
  const server = createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(() => {
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
        if (!res.writableEnded) res.end('server error')
      })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    await use(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
export function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}
```

文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
import { withServer, json } from './server.mjs'
await withServer(
  (req, res) => json(res, 200, { ready: true }),
  async (base) => {
    const response = await fetch(base)
    const value = await response.json()
    assert.equal(response.status, 200)
    assert.equal(value.ready, true)
    console.log(response.status, value.ready)
  },
)
```

在该示例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
200 true
```

本例连接真实本机HTTP和Fetch，属于小型集成检查，不依赖公网。浏览器阶段应另外实际点击、输入、刷新、导入损坏文件并观察控制台。端到端工具可在后续学习时引入，工具依赖和浏览器下载需要独立记录。

### 39.6 动手练习与参考答案

**先独立回答。**

1. 把cleanTitle的trim删除。

2. 异步测试不await assert.rejects是否可靠？

3. 给100和101字符标题分别写测试。

4. 纯函数测试通过后至少做哪些页面检查？

**参考答案与检查。**

1. 去空白测试失败，能直接定位契约被破坏。

2. 不可靠；应把Promise纳入测试生命周期。

3. 100个A应成功，101个A应抛RangeError。

4. 答案：输入/提交、删除、刷新恢复、错误提示、键盘焦点及无控制台异常。

### 39.7 本章速查

| 场景     | 做法或返回值                 | 边界                 |
| :------- | :--------------------------- | :------------------- |
| 调试     | 断点、变量、调用栈           | 先复现再改           |
| 普通断言 | equal/deepEqual/throws       | 区分身份、结构、类型 |
| 异步断言 | await assert.rejects         | 不用throws替代       |
| 运行测试 | `node --test` 文件           | 等待所有异步工作     |
| 隔离     | 临时目录、临时端口、固定时钟 | 清理自己拥有的资源   |
| 验证层次 | 静态、单元、集成、端到端     | 分别说明覆盖范围     |

## 第40章 阶段项目：可保存数据的浏览器任务管理器

本项目把前面的模块、DOM、表单、JSON和存储组合起来。静态服务只负责提供页面文件，任务保存在浏览器localStorage；第45章才把保存职责移到Node服务端。四个源文件完整给出，按本章列出的文件名保存后，即可从项目入口运行。

### 40.1 页面、任务契约和运行方式

沿用第25章任务格式，增加标题/分钟/标签表单、完成勾选、编辑删除、搜索、状态过滤、排序和统计。操作区和结果区有对应标签，错误与空状态使用文本说明。导入会整体替换现有数据，因此必须预览后确认。

#### 40.1.1 先完成一个可运行的小页面

完整项目的编辑、筛选和导入较多。先运行下面的小页面，只连接已经学过的业务核心、表单、完成/删除与保存；再按40.3的检查点扩展到完整入口。

本例复用第25章25.2节已完整给出的`task-core.mjs`，不重写另一套标题和分钟规则。页面放在学习根目录的`projects/browser-tasks-start/`，模块导入位置从该文件向上回到学习根目录，再进入第25章示例。启动时服务整个学习根目录，才能读取同一目录边界内的共享模块。

示例 **C40E01**，目录 `js-study/projects/browser-tasks-start/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>任务页面第一步</title>
  </head>
  <body>
    <h1>任务页面第一步</h1>
    <form id="form">
      <label>标题 <input id="title" required maxlength="200" /></label>
      <label
        >分钟 <input id="minutes" type="number" min="0" max="1440" step="1" value="25" required
      /></label>
      <button>添加</button>
    </form>
    <p id="message" role="status"></p>
    <ul id="tasks"></ul>
    <script type="module" src="./app.mjs"></script>
  </body>
</html>
```

文件 `app.mjs`：

```javascript
import {
  emptyStore,
  validateStore,
  addTask,
  editTask,
  removeTask,
} from '../../examples/ch25/C25E03/task-core.mjs'
const form = document.querySelector('#form')
const title = document.querySelector('#title')
const minutes = document.querySelector('#minutes')
const list = document.querySelector('#tasks')
const message = document.querySelector('#message')
const key = 'javascript-study-starter-v1'
let state = emptyStore()
let blocked = false
try {
  const raw = localStorage.getItem(key)
  if (raw !== null) state = validateStore(JSON.parse(raw))
} catch (error) {
  blocked = true
  message.textContent = '读取失败，保留原数据并停止保存：' + error.message
}
function render() {
  list.replaceChildren(
    ...state.tasks.map((task) => {
      const row = document.createElement('li')
      row.append(`#${task.id} ${task.title} ${task.minutes}分钟 `)
      for (const [action, text] of [
        ['toggle', task.done ? '恢复待办' : '完成'],
        ['delete', '删除'],
      ]) {
        const button = document.createElement('button')
        button.type = 'button'
        button.dataset.action = action
        button.dataset.id = String(task.id)
        button.textContent = text
        row.append(button)
      }
      return row
    }),
  )
}
function commit(next) {
  if (blocked) throw new Error('请先保留并修复原存储，不继续覆盖')
  localStorage.setItem(key, JSON.stringify(next))
  state = next
  render()
  message.textContent = '已保存，共' + state.tasks.length + '项'
}
form.addEventListener('submit', (event) => {
  event.preventDefault()
  try {
    commit(
      addTask(state, {
        title: title.value,
        minutes: Number(minutes.value),
        tags: [],
        done: false,
      }),
    )
    form.reset()
  } catch (error) {
    message.textContent = error.message
  }
})
list.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]')
  if (!button) return
  const id = Number(button.dataset.id)
  try {
    const task = state.tasks.find((item) => item.id === id)
    commit(
      button.dataset.action === 'delete'
        ? removeTask(state, id)
        : editTask(state, id, { done: !task.done }),
    )
  } catch (error) {
    message.textContent = error.message
  }
})
render()
```

在`js-study`学习根目录执行：

```powershell
node tools/serve-examples.mjs --dir . --port 3211
```

打开`http://127.0.0.1:3211/projects/browser-tasks-start/`。按顺序检查：初始空表→添加“阅读”0分钟→点击完成后按钮变为“恢复待办”→再添加一项并删除→刷新→停止服务后同命令重启，剩余任务恢复。空白标题应被拒绝；失败后不多出任务或推进ID。

阅读顺序也是搭建顺序：先看render如何显示数据，再看submit如何把表单转成字段，接着看commit为何先保存，最后看事件委托如何把ID交回业务核心。它使用独立存储键，不会覆盖下方完整项目的数据。保存失败时的恢复区、编辑表单、筛选、导入预览将在完整版本中补齐。

#### 40.1.2 完整版本的文件与界面

示例 **C40E02**，目录 `js-study/projects/browser-tasks/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>学习任务管理器</title>
    <link rel="stylesheet" href="./styles.css" />
    <script type="module" src="./app.mjs"></script>
  </head>
  <body>
    <main class="workspace">
      <header class="page-header">
        <h1>学习任务管理器</h1>
        <p>把下一步写清楚，完成后再向前。</p>
      </header>
      <p id="message" class="message" role="status" aria-live="polite">正在读取任务……</p>
      <section class="editor" aria-labelledby="editor-heading">
        <h2 id="editor-heading">添加任务</h2>
        <form id="task-form">
          <div class="field field-title">
            <label for="title">任务标题</label>
            <input id="title" name="title" required maxlength="200" autocomplete="off" />
          </div>
          <div class="field">
            <label for="minutes">预计分钟数</label>
            <input
              id="minutes"
              name="minutes"
              type="number"
              min="0"
              max="1440"
              step="1"
              value="25"
              required
            />
          </div>
          <div class="field field-title">
            <label for="tags">标签，用中文或英文逗号分隔</label>
            <input id="tags" name="tags" autocomplete="off" />
          </div>
          <div class="form-actions">
            <button id="save" type="submit" data-mutate>添加任务</button>
            <button id="cancel-edit" type="button" class="secondary" hidden>取消编辑</button>
          </div>
        </form>
      </section>
      <section aria-labelledby="list-heading">
        <div class="section-heading">
          <h2 id="list-heading">任务清单</h2>
          <p id="summary"></p>
        </div>
        <form id="filters" class="filters" role="search">
          <div class="field field-title">
            <label for="query">搜索标题或标签</label><input id="query" name="q" type="search" />
          </div>
          <div class="field">
            <label for="status">完成状态</label
            ><select id="status">
              <option value="all">全部</option>
              <option value="open">待完成</option>
              <option value="done">已完成</option>
            </select>
          </div>
          <div class="field">
            <label for="sort">排序</label
            ><select id="sort">
              <option value="id">添加顺序</option>
              <option value="title">标题</option>
              <option value="minutes">预计分钟数</option>
            </select>
          </div>
          <button type="submit" class="secondary">查询</button>
        </form>
        <p id="empty" class="empty" hidden>当前没有符合条件的任务。可以添加任务或调整筛选。</p>
        <ul id="tasks" class="task-list"></ul>
      </section>
      <section class="data-tools" aria-labelledby="data-heading">
        <h2 id="data-heading">保存与交换</h2>
        <p>操作成功后保存在当前来源的localStorage。导入会整体替换现有任务，请先导出备份。</p>
        <div class="tool-actions">
          <button id="export" type="button" class="secondary">导出 JSON</button>
          <label for="import-file">选择 JSON 文件（最多4 MiB）</label>
          <input id="import-file" type="file" accept=".json,application/json" data-mutate />
        </div>
        <div id="import-preview" class="import-preview" hidden>
          <p id="import-description"></p>
          <button id="confirm-import" type="button" class="danger" data-mutate>
            确认替换现有任务
          </button>
          <button id="cancel-import" type="button" class="secondary">取消导入</button>
        </div>
      </section>
      <section id="recovery" hidden aria-labelledby="recovery-heading">
        <h2 id="recovery-heading">恢复损坏数据</h2>
        <p>当前停止所有保存。先复制下方原文到独立文本文件，再决定是否重置。</p>
        <label for="raw-data">原始存储文本</label
        ><textarea id="raw-data" rows="6" readonly></textarea>
        <button id="reset-storage" type="button" class="danger">确认清除损坏数据并重新开始</button>
      </section>
      <footer>浏览器本地版 · 数据属于当前协议、主机与端口</footer>
    </main>
  </body>
</html>
```

完整项目文件还包括下三节给出的样式、业务模块和入口。把四个文件保存在同一个`js-study/projects/browser-tasks/`目录。先停止旧静态服务，在`js-study`学习根目录执行：

```powershell
node tools/serve-examples.mjs --dir projects/browser-tasks --port 3211
```

打开`http://127.0.0.1:3211/`。添加任务后先刷新，再停止服务并以同一命令重启；仍用同一协议、主机和端口访问，任务应恢复。端口被占用时先定位自己启动的实例，不自动换端口。确需换来源时，先在旧来源导出，再在新来源导入确认；浏览器存储本身不会跟随服务目录迁移。

HTML通过相对路径加载模块和样式，适合该独立项目目录。表单required和范围限制先帮助用户输入，业务模块再次校验；不能只靠浏览器属性保证导入文件合法。界面不会自动同步其他标签页的修改，本项目约定单标签操作。

### 40.2 业务核心与界面表现

共享核心完整沿用第25章已逐步讲解的纯函数与数据契约，以下再次给全，便于按完整项目保存；没有另立一套规则。样式只负责清楚表达状态，不承担校验或保存。正常新增不复用ID；导入则恢复文件声明的完整ID空间。

示例 **C40E03**，目录 `js-study/projects/browser-tasks/`，环境：浏览器与Node共享模块。

文件 `task-core.mjs`：

```javascript
// 纯业务规则不访问DOM或磁盘，因此浏览器、命令行和服务端可以共同使用。
export class InputError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'InputError'
    this.status = status
  }
}

function assert(condition, message) {
  if (!condition) throw new InputError(message)
}

function exactKeys(value, keys, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label}必须是对象`)
  assert(
    Object.keys(value).every((key) => keys.includes(key)),
    `${label}含未知字段`,
  )
}

export function normalizeFields(value) {
  exactKeys(value, ['title', 'minutes', 'tags', 'done'], '任务字段')
  assert(typeof value.title === 'string', '标题必须是字符串')
  const title = value.title.trim()
  assert(title.length >= 1 && title.length <= 200, '标题需要1至200个UTF-16码元')
  assert(
    Number.isInteger(value.minutes) && value.minutes >= 0 && value.minutes <= 1440,
    '分钟数必须是0至1440的整数',
  )
  assert(typeof value.done === 'boolean', '完成状态必须是布尔值')
  assert(Array.isArray(value.tags) && value.tags.length <= 20, '标签必须是最多20项的数组')
  const tags = value.tags.map((tag) => {
    assert(typeof tag === 'string', '标签必须是字符串')
    const text = tag.trim()
    assert(text.length >= 1 && text.length <= 30, '每个标签需要1至30个UTF-16码元')
    return text
  })
  return { title, minutes: value.minutes, done: value.done, tags: [...new Set(tags)] }
}

export function emptyStore() {
  return { version: 1, nextId: 1, tasks: [] }
}

export function validateStore(value) {
  exactKeys(value, ['version', 'nextId', 'tasks'], '数据文件')
  assert(value.version === 1, '只支持version为1的数据格式')
  assert(Number.isSafeInteger(value.nextId) && value.nextId > 0, 'nextId必须是正安全整数')
  assert(Array.isArray(value.tasks) && value.tasks.length <= 1000, '任务数组最多1000项')
  const seen = new Set()
  const tasks = value.tasks.map((task) => {
    exactKeys(task, ['id', 'title', 'minutes', 'tags', 'done', 'createdAt'], '任务')
    assert(Number.isSafeInteger(task.id) && task.id > 0, '任务ID必须是正安全整数')
    assert(!seen.has(task.id), '任务ID不能重复')
    assert(task.id < value.nextId, 'nextId必须大于所有现有任务ID')
    seen.add(task.id)
    assert(typeof task.createdAt === 'string', 'createdAt必须是ISO时间字符串')
    const date = new Date(task.createdAt)
    assert(
      Number.isFinite(date.getTime()) && date.toISOString() === task.createdAt,
      'createdAt必须是规范的UTC ISO时间字符串',
    )
    const fields = normalizeFields({
      title: task.title,
      minutes: task.minutes,
      tags: task.tags,
      done: task.done,
    })
    return { id: task.id, ...fields, createdAt: task.createdAt }
  })
  return { version: 1, nextId: value.nextId, tasks }
}

export function addTask(store, input, now = new Date().toISOString()) {
  assert(store.tasks.length < 1000, '任务数量已达上限')
  assert(store.nextId < Number.MAX_SAFE_INTEGER, '任务ID已耗尽')
  const fields = normalizeFields(input)
  const task = { id: store.nextId, ...fields, createdAt: now }
  // 返回新数据，保留原store；持久化失败时调用者仍有未修改的旧状态。
  return validateStore({
    ...store,
    nextId: store.nextId + 1,
    tasks: [...store.tasks, task],
  })
}

export function editTask(store, id, patch) {
  exactKeys(patch, ['title', 'minutes', 'tags', 'done'], '修改字段')
  const task = store.tasks.find((item) => item.id === id)
  if (!task) throw new InputError('任务不存在', 404)
  const fields = normalizeFields({
    title: task.title,
    minutes: task.minutes,
    tags: task.tags,
    done: task.done,
    ...patch,
  })
  return {
    ...store,
    tasks: store.tasks.map((item) => (item.id === id ? { ...item, ...fields } : item)),
  }
}

export function removeTask(store, id) {
  if (!store.tasks.some((task) => task.id === id)) throw new InputError('任务不存在', 404)
  return { ...store, tasks: store.tasks.filter((task) => task.id !== id) }
}

export function selectTasks(store, { query = '', status = 'all', sort = 'id' } = {}) {
  assert(['all', 'open', 'done'].includes(status), '筛选状态无效')
  assert(['id', 'title', 'minutes'].includes(sort), '排序字段无效')
  assert(typeof query === 'string', '关键词必须是字符串')
  const keyword = query.trim().toLocaleLowerCase('zh-CN')
  const selected = store.tasks.filter((task) => {
    const matched = `${task.title} ${task.tags.join(' ')}`
      .toLocaleLowerCase('zh-CN')
      .includes(keyword)
    return matched && (status === 'all' || task.done === (status === 'done'))
  })
  return selected.toSorted((a, b) => {
    const result = sort === 'title' ? a.title.localeCompare(b.title, 'zh-CN') : a[sort] - b[sort]
    return result || a.id - b.id
  })
}

export function summarize(tasks) {
  return {
    total: tasks.length,
    done: tasks.filter((task) => task.done).length,
    minutes: tasks.reduce((sum, task) => sum + task.minutes, 0),
  }
}
```

此模块由页面入口导入，不是单独双击的页面。所有函数和字段与第25章一致，目的是让本项目源码可以独立复制运行。

示例 **C40E04**，目录 `js-study/projects/browser-tasks/`，环境：浏览器样式。

文件 `styles.css`：

```css
/* 使用普通表单和列表，视觉层不改变教学代码的职责。 */
:root {
  color-scheme: light;
  font:
    16px/1.6 system-ui,
    sans-serif;
  color: #172d38;
  background: #f3f5f4;
  accent-color: #205c4a;
}
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
[hidden] {
  display: none !important;
}
::selection {
  background: #d2e9dd;
  color: #172d38;
}
.workspace {
  width: min(100% - 32px, 1000px);
  margin: 40px auto;
  padding: 36px;
  background: #fff;
}
.page-header {
  border-bottom: 1px solid #c9d4d1;
  padding-bottom: 24px;
}
h1 {
  margin: 0 0 8px;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  line-height: 1.25;
}
h2 {
  margin: 0 0 18px;
  font-size: 1.25rem;
}
p {
  margin: 0 0 12px;
}
.page-header p,
footer {
  color: #52656b;
}
section {
  margin-top: 36px;
}
.message {
  min-height: 2.5em;
  margin: 20px 0 0;
  padding: 8px 12px;
  background: #edf4f0;
}
.message[data-kind='error'] {
  color: #8e2323;
  background: #fff0ed;
}
#task-form {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 18px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-size: 0.9rem;
  font-weight: 600;
}
input,
select,
button {
  font: inherit;
}
input,
select {
  width: 100%;
  padding: 9px 10px;
  color: #172d38;
  background: #fff;
  border: 1px solid #82958f;
  border-radius: 4px;
  caret-color: #205c4a;
}
button {
  min-height: 44px;
  padding: 8px 16px;
  border: 1px solid #205c4a;
  border-radius: 4px;
  color: #fff;
  background: #205c4a;
  cursor: pointer;
}
button:hover {
  background: #153f33;
}
button.secondary {
  color: #234d40;
  background: #fff;
}
button.secondary:hover {
  background: #edf4f0;
}
button.danger {
  color: #8e2323;
  border-color: #ab5c54;
  background: #fff;
}
button.danger:hover {
  background: #fff0ed;
}
button:disabled,
input:disabled {
  opacity: 0.6;
  cursor: wait;
}
:focus-visible {
  outline: 3px solid #246eaa;
  outline-offset: 3px;
}
.form-actions,
.tool-actions {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 12px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}
#summary {
  color: #36584d;
  font-variant-numeric: tabular-nums;
}
.filters {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 130px 150px auto;
  align-items: end;
  gap: 12px;
}
.task-list {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}
.task-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid #d7dfdc;
}
.task-check {
  display: flex;
  align-items: center;
  min-height: 44px;
}
.task-check input {
  width: 20px;
  height: 20px;
}
.task-copy {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.task-copy strong {
  display: block;
  font-weight: 650;
}
.task-row.is-done strong {
  text-decoration: line-through;
  color: #52656b;
}
.task-meta {
  color: #52656b;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}
.task-actions {
  display: flex;
  gap: 12px;
  margin-left: 12px;
}
.empty {
  margin-top: 24px;
  padding: 24px 0;
  color: #52656b;
}
.data-tools {
  border-top: 1px solid #c9d4d1;
  padding-top: 28px;
}
.tool-actions input {
  width: auto;
  max-width: 100%;
}
.import-preview {
  margin-top: 20px;
  padding: 16px;
  background: #fff5e9;
}
footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #d7dfdc;
  font-size: 0.875rem;
}
@media (max-width: 700px) {
  .workspace {
    width: 100%;
    margin: 0;
    padding: 24px 18px;
  }
  #task-form,
  .filters {
    grid-template-columns: 1fr;
  }
  .section-heading {
    display: block;
  }
  .task-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .task-actions {
    width: 100%;
    margin-left: 34px;
  }
}

textarea {
  width: 100%;
  font: inherit;
}
```

保存为项目根目录`styles.css`；窄屏会把表单和筛选排列为单列。

核心返回新状态，显示层读取结果生成节点。normalizeFields在客户端用于尽早提示，但这是教学复用，不表示可以信任外部数据；读取本地JSON仍通过validateStore逐字段检查。

### 40.3 完整入口、保存顺序与损坏保护

入口先读取存储，只有文本解析和结构校验都通过才恢复。缺失键表示新用户；损坏或权限失败则阻止保存，显示原文或恢复说明。每次修改先计算next，setItem成功后才把state替换为next。

#### 40.3.1 按功能检查点阅读完整入口

下面完整`app.mjs`采用与刚才小页面相同的业务核心。API适配层暂时仍调用本地函数与localStorage，保持与未来HTTP版本相同的接口形状，不意味着本地存储变成异步磁盘。

| 检查点           | 先阅读的函数或状态                      | 页面操作与预期                            |
| :--------------- | :-------------------------------------- | :---------------------------------------- |
| 空表与恢复       | 初始化、`validateStore`、`blocked`      | 空表可添加；坏JSON停止保存并展示恢复区    |
| 新增与校验       | submit监听、`normalizeFields`           | 中文标题和0分钟可保存，空白和非法分钟失败 |
| 完成、编辑、删除 | 列表事件委托、`editingId`               | 编辑已完成项后仍完成；删除以ID定位        |
| 搜索与统计       | `refresh`、`selectTasks`、`render`      | 状态和关键词筛选后统计对应当前结果        |
| 保存后提交       | `api`、`mutate`                         | 保存失败显示错误，旧内存仍可解释          |
| 导出与导入       | `candidate`、`importSequence`、确认按钮 | 未确认不替换；坏文件保留原表              |
| 跨运行恢复       | 初始化和固定来源                        | 同一来源刷新、停服再开仍恢复              |

可以每完成一行就操作页面，并在相应函数设置断点。完整文件必须保存齐才运行；此表不是让你把函数随意复制成不完整片段。每个状态变量只有明确责任：editingId标识正在编辑谁，candidate是尚未提交的导入快照，busy限制重复保存，latestRequest与importSequence拒绝过期的读取结果。

```text
外部输入 → 类型/格式/业务校验 → 候选状态
                                  │
                          尝试保存 ├─ 失败：旧state不变，展示错误
                                  └─ 成功：提交state → 渲染
读取失败 → blocked恢复区 → 用户保留原文 → 明确确认后重置
```

#### 40.3.2 完整app.mjs

示例 **C40E05**，目录 `js-study/projects/browser-tasks/`，环境：浏览器。

文件 `app.mjs`：

```javascript
import {
  normalizeFields,
  validateStore,
  emptyStore,
  addTask,
  editTask,
  removeTask,
  selectTasks,
  summarize,
} from './task-core.mjs'

const form = document.querySelector('#task-form')
const title = document.querySelector('#title')
const minutes = document.querySelector('#minutes')
const tags = document.querySelector('#tags')
const list = document.querySelector('#tasks')
const message = document.querySelector('#message')
const query = document.querySelector('#query')
const status = document.querySelector('#status')
const sort = document.querySelector('#sort')
const preview = document.querySelector('#import-preview')
let editingId = null
let editingTask = null
let shownTasks = []
let candidate = null
let importSequence = 0
let busy = false
let latestRequest = 0
let readingController

function say(text, isError = false) {
  message.textContent = text
  message.dataset.kind = isError ? 'error' : 'success'
}

const STORAGE_KEY = 'javascript-study-tasks-v1'
let state = emptyStore()
let blocked = false
try {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw !== null) state = validateStore(JSON.parse(raw))
} catch (error) {
  blocked = true
  document.querySelector('#recovery').hidden = false
  try {
    document.querySelector('#raw-data').value = localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    document.querySelector('#raw-data').value = '存储访问被浏览器策略阻止，请先恢复存储权限。'
  }
}

async function api(path, { body, method = 'GET' } = {}) {
  if (blocked) throw new Error('本地数据无效或存储不可用：保存已停止，请检查恢复区')
  const url = new URL(path, location.href)
  if (method === 'GET' && url.pathname === '/api/store') return structuredClone(state)
  if (method === 'GET' && url.pathname === '/api/tasks') {
    const tasks = selectTasks(state, {
      query: url.searchParams.get('q') ?? '',
      status: url.searchParams.get('status') ?? 'all',
      sort: url.searchParams.get('sort') ?? 'id',
    })
    return { tasks, summary: summarize(tasks) }
  }
  let next
  if (method === 'PUT' && url.pathname === '/api/store') next = validateStore(body)
  else if (method === 'POST' && url.pathname === '/api/tasks') next = addTask(state, body)
  else {
    const matched = /^\/api\/tasks\/([1-9]\d*)$/.exec(url.pathname)
    if (!matched) throw new Error('操作不存在')
    const id = Number(matched[1])
    if (method === 'PATCH') next = editTask(state, id, body)
    else if (method === 'DELETE') next = removeTask(state, id)
    else throw new Error('操作不支持')
  }
  // 先保存再提交内存；配额失败时保留旧任务，界面显示失败而非假成功。
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  state = next
  return { saved: true }
}
document.querySelector('#reset-storage').addEventListener('click', async () => {
  if (!window.confirm('已自行备份原文？确认后清除本项目损坏数据。')) return
  try {
    localStorage.removeItem(STORAGE_KEY)
    state = emptyStore()
    blocked = false
    document.querySelector('#recovery').hidden = true
    await refresh()
    say('已重置，可重新添加任务')
  } catch (error) {
    say(error.message, true)
  }
})

function setBusy(value) {
  busy = value
  for (const control of document.querySelectorAll(
    '[data-mutate], #task-form input, #cancel-edit',
  )) {
    control.disabled = value
  }
}

function button(text, action, id, className = 'secondary') {
  const element = document.createElement('button')
  element.type = 'button'
  element.textContent = text
  element.className = className
  element.dataset.action = action
  element.dataset.id = String(id)
  element.dataset.mutate = ''
  element.disabled = busy
  return element
}

function render(tasks, summary) {
  shownTasks = tasks
  const nodes = tasks.map((task) => {
    const row = document.createElement('li')
    row.className = `task-row${task.done ? ' is-done' : ''}`
    const label = document.createElement('label')
    label.className = 'task-check'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = task.done
    checkbox.dataset.action = 'toggle'
    checkbox.dataset.id = String(task.id)
    checkbox.dataset.mutate = ''
    checkbox.disabled = busy
    checkbox.setAttribute('aria-label', `完成任务：${task.title}`)
    label.append(checkbox)
    const copy = document.createElement('div')
    copy.className = 'task-copy'
    const heading = document.createElement('strong')
    // 用户输入只作为文本，不能变成HTML标签执行。
    heading.textContent = task.title
    const meta = document.createElement('span')
    meta.className = 'task-meta'
    meta.textContent = `#${task.id} · ${task.minutes}分钟 · ${task.tags.join('、') || '无标签'}`
    copy.append(heading, meta)
    const actions = document.createElement('div')
    actions.className = 'task-actions'
    actions.append(button('编辑', 'edit', task.id), button('删除', 'delete', task.id, 'danger'))
    row.append(label, copy, actions)
    return row
  })
  list.replaceChildren(...nodes)
  document.querySelector('#empty').hidden = tasks.length !== 0
  document.querySelector('#summary').textContent =
    `${summary.total}项 · 已完成${summary.done}项 · 共${summary.minutes}分钟`
}

async function refresh() {
  const sequence = ++latestRequest
  readingController?.abort()
  readingController = new AbortController()
  const parameters = new URLSearchParams({
    q: query.value,
    status: status.value,
    sort: sort.value,
  })
  history.replaceState(null, '', `?${parameters}`)
  try {
    const payload = await api(`/api/tasks?${parameters}`, {
      signal: readingController.signal,
    })
    if (sequence === latestRequest) render(payload.tasks, payload.summary)
  } catch (error) {
    if (error.name !== 'AbortError' && sequence === latestRequest) say(error.message, true)
  }
}

function clearEditor() {
  editingId = null
  editingTask = null
  form.reset()
  document.querySelector('#editor-heading').textContent = '添加任务'
  document.querySelector('#save').textContent = '添加任务'
  document.querySelector('#cancel-edit').hidden = true
}

async function mutate(work, success) {
  if (busy) return
  setBusy(true)
  say('正在保存……')
  try {
    await work()
    say(success)
    await refresh()
  } catch (error) {
    say(error.message, true)
    await refresh()
  } finally {
    setBusy(false)
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  if (busy) return
  try {
    const old = editingTask
    const fields = normalizeFields({
      title: title.value,
      minutes: Number(minutes.value),
      tags: tags.value
        .split(/[,，]/u)
        .map((tag) => tag.trim())
        .filter(Boolean),
      done: old?.done ?? false,
    })
    const id = editingId
    void mutate(
      async () => {
        await api(id === null ? '/api/tasks' : `/api/tasks/${id}`, {
          method: id === null ? 'POST' : 'PATCH',
          // 编辑只提交表单管理的字段，保留期间可能改变的完成状态。
          body:
            id === null
              ? fields
              : { title: fields.title, minutes: fields.minutes, tags: fields.tags },
        })
        clearEditor()
      },
      id === null ? '已添加任务' : '已保存修改',
    ).finally(() => title.focus())
  } catch (error) {
    say(error.message, true)
  }
})

document.querySelector('#cancel-edit').addEventListener('click', clearEditor)
list.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]')
  if (!control || busy) return
  const id = Number(control.dataset.id)
  const task = shownTasks.find((item) => item.id === id)
  if (!task) return
  if (control.dataset.action === 'edit') {
    editingId = id
    editingTask = structuredClone(task)
    title.value = task.title
    minutes.value = String(task.minutes)
    tags.value = task.tags.join('，')
    document.querySelector('#editor-heading').textContent = `编辑任务 #${id}`
    document.querySelector('#save').textContent = '保存修改'
    document.querySelector('#cancel-edit').hidden = false
    title.focus()
  } else if (control.dataset.action === 'delete') {
    void mutate(async () => {
      await api(`/api/tasks/${id}`, { method: 'DELETE' })
      if (editingId === id) clearEditor()
    }, '已删除任务')
  } else if (control.dataset.action === 'toggle') {
    void mutate(
      () =>
        api(`/api/tasks/${id}`, {
          method: 'PATCH',
          body: { done: !task.done },
        }),
      task.done ? '已恢复为待完成' : '已完成任务',
    )
  }
})

document.querySelector('#filters').addEventListener('submit', (event) => {
  event.preventDefault()
  void refresh()
})
for (const select of [status, sort]) select.addEventListener('change', () => void refresh())

document.querySelector('#export').addEventListener('click', async () => {
  try {
    const state = await api('/api/store')
    const objectUrl = URL.createObjectURL(
      new Blob([JSON.stringify(state, null, 2)], {
        type: 'application/json',
      }),
    )
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = 'learning-tasks.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    say('已生成JSON下载文件')
  } catch (error) {
    say(error.message, true)
  }
})

document.querySelector('#import-file').addEventListener('change', async (event) => {
  const sequence = ++importSequence
  candidate = null
  preview.hidden = true
  const file = event.target.files[0]
  if (!file) return
  try {
    if (file.size > 4 * 1024 * 1024) throw new Error('文件超过4 MiB上限')
    const parsed = validateStore(JSON.parse(await file.text()))
    if (sequence !== importSequence) return
    candidate = parsed
    document.querySelector('#import-description').textContent =
      `文件含${candidate.tasks.length}项任务。确认后会整体替换现有任务。`
    preview.hidden = false
  } catch (error) {
    if (sequence === importSequence) say(`导入未执行：${error.message}`, true)
  }
})

function clearImport() {
  importSequence += 1
  candidate = null
  preview.hidden = true
  document.querySelector('#import-file').value = ''
}
document.querySelector('#cancel-import').addEventListener('click', clearImport)
document.querySelector('#confirm-import').addEventListener('click', () => {
  if (!candidate) return
  const selected = candidate
  void mutate(async () => {
    await api('/api/store', { method: 'PUT', body: selected })
    clearEditor()
    clearImport()
  }, '已导入并保存任务')
})

const initial = new URL(location.href).searchParams
query.value = initial.get('q') ?? ''
status.value = ['all', 'open', 'done'].includes(initial.get('status'))
  ? initial.get('status')
  : 'all'
sort.value = ['id', 'title', 'minutes'].includes(initial.get('sort')) ? initial.get('sort') : 'id'
await refresh()
if (message.textContent === '正在读取任务……') say('任务已读取；可以开始添加')
```

该文件依赖本章完整给出的`index.html`、`styles.css`、`task-core.mjs`，运行项目页面而非把模块当网页打开。成功操作后刷新同一URL，任务应恢复。

此版本保留与未来网络接口相似的api适配边界，但内部只调用本地函数与localStorage。async形式让界面层保持同一调用契约，不代表localStorage变成非阻塞。多标签同时写入仍可能覆盖，单进程文件队列也不能解决浏览器多标签事务问题。

### 40.4 导入导出、格式版本与拒绝策略

导出取得完整快照，包括version、nextId和tasks。导入先检查4 MiB上限，再解析、校验整份数据并预览数量；只有点击确认才保存替换。异步读文件用序号排除旧文件结果，避免用户快速换文件后导入上一份。

示例 **C40E06**，目录 `js-study/examples/ch40/C40E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { emptyStore, validateStore } from '../../../projects/browser-tasks/task-core.mjs'
const raw = JSON.stringify(emptyStore())
console.log(JSON.stringify(validateStore(JSON.parse(raw))))
try {
  validateStore({ version: 2, nextId: 1, tasks: [] })
} catch (error) {
  console.log(error.message)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"version":1,"nextId":1,"tasks":[]}
只支持version为1的数据格式
```

本例明确复用本章完整项目的`task-core.mjs`；相对路径从examples/ch40/当前例目录回到`js-study`学习根目录。

当前仅支持version为1，不猜测如何解释未来版本。迁移应独立编写从旧格式到新格式的纯函数，验证成功后才提交，不为了“兼容”忽略未知字段或丢失原始记录。不要把下载动作当作已经备份成功到用户指定位置，恢复区要求用户自行保留原文。

### 40.5 阶段验收与边界清单

验收时既检查界面又检查持久化语义。添加后能看见不够，还要刷新恢复；非法导入后旧任务仍在；清空筛选应重新出现原记录。存储被禁用时要展示失败而不是悄悄退回不持久化状态。

示例 **C40E07**，目录 `js-study/examples/ch40/C40E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
import { emptyStore, addTask, validateStore } from '../../../projects/browser-tasks/task-core.mjs'
const state = addTask(
  emptyStore(),
  { title: '检查恢复', minutes: 0, tags: [], done: false },
  '2026-11-09T00:00:00.000Z',
)
const restored = validateStore(JSON.parse(JSON.stringify(state)))
assert.deepEqual(restored, state)
assert.throws(() => validateStore({ ...state, nextId: 1 }))
assert.equal(state.tasks.length, 1)
console.log('快照往返与失败保护检查通过')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
快照往返与失败保护检查通过
```

浏览器检查步骤：添加两项→完成一项→按状态筛选→编辑已完成项且保留完成状态→导出→删除→导入确认→刷新。另测空白标题、0分钟、坏JSON、重复ID、取消导入和恢复区；键盘Tab应能到达所有主要动作。

#### 40.5.1 阶段五验收：独立完成一次恢复与排错

先自行写一张检查记录，逐项记输入、预期和实际，不把“界面看起来正常”作为全部结论。

| 任务       | 输入或操作                    | 通过标准                        |
| :--------- | :---------------------------- | :------------------------------ |
| 正常保存   | 添加“复习模块”、0分钟         | 列表与统计正确，刷新恢复        |
| 跨运行恢复 | Ctrl+C后用同命令重启3211端口  | 同一URL仍恢复，不重新初始化空表 |
| 业务失败   | 输入空白标题、负数或小数      | 旧任务、nextId和存储快照不变    |
| 导入失败   | 使用坏JSON或重复ID的测试文件  | 不提交替换，原任务仍在          |
| 明确恢复   | 导出→删除一项→导入预览→确认   | 文件声明的快照整体恢复          |
| 键盘操作   | 用Tab定位表单、按钮与导入确认 | 焦点可见，主要操作可达          |

参考排错：若同来源重启仍为空，先比较协议、主机、端口和存储键，再检查是否处于隐私模式、存储被清理或被策略阻止。先保留已有原文；不要通过无条件写空表来“修复”。通过后再进入Node文件与HTTP综合项目。

### 40.6 动手练习与参考答案

**先独立回答。**

1. 固定3211端口重启后任务应怎样？

2. setItem失败前能否先改state？

3. 导入应何时删除旧任务？

**参考答案与检查。**

1. 同一来源下应恢复。若手动换成localhost、另一端口或协议，可能看到空表；先回原来源检查，不能立刻断定数据被删。

2. 不宜，否则界面与磁盘/存储状态分离；本实现先保存再提交。

3. 整份数据验证后，由明确确认操作整体替换，而非逐条校验时先清空。

### 40.7 本章速查

| 场景   | 做法与返回                                                               | 易错边界                       |
| :----- | :----------------------------------------------------------------------- | :----------------------------- |
| 启动   | `node tools/serve-examples.mjs --dir projects/browser-tasks --port 3211` | 从学习根目录运行，保持同一来源 |
| 保存   | setItem后更新state                                                       | 失败保留旧内存                 |
| 坏数据 | blocked恢复区                                                            | 不自动覆盖                     |
| 导入   | 整份校验+确认                                                            | 整体替换会改变ID空间           |

本章参考：[HTML标准：Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)、[DOM标准](https://dom.spec.whatwg.org/)、[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)。

## 第41章 安全、性能与故障排查

正确程序需要在不可信输入和失败环境下保持可解释。安全与性能都从明确边界开始：数据从哪里来、谁可以修改、资源何时释放、瓶颈有没有证据。本章提供教学检查方法，不把几个片段当成完整生产安全方案。

### 41.1 外部数据与验证边界

终端、URL、文件、浏览器存储和HTTP请求都能带来不符合约定的数据。解析只验证格式，业务校验验证含义。客户端校验改善体验；服务端或持久化边界必须再次检查，不能因来自本机就信任。

示例 **C41E01**，目录 `js-study/examples/ch41/C41E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function checkMinutes(value) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 1440) {
    throw new TypeError('需要0到1440的整数分钟')
  }
  return value
}
for (const value of [0, 25, '25', NaN, Infinity, -1]) {
  try {
    console.log('接受', checkMinutes(value))
  } catch (error) {
    console.log('拒绝', String(value))
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
接受 0
接受 25
拒绝 25
拒绝 NaN
拒绝 Infinity
拒绝 -1
```

边界选择是否转换也应明确。表单输入可先Number转换再交核心；JSON接口要求number时就拒绝文本。限制大小、数量和深度也属于输入策略，避免“合法JSON”无限耗尽内存。

### 41.2 常见风险与最小权限

XSS来自把不可信内容作为可执行页面内容；原型污染来自不受控地写入对象原型相关结构；路径穿越来自把外部路径拼接成任意文件访问。动态eval/Function会执行代码，不是JSON解析替代品。

示例 **C41E02**，目录 `js-study/examples/ch41/C41E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const allowed = new Set(['title', 'minutes'])
const input = JSON.parse('{"title":"阅读","__proto__":{"admin":true}}')
const safe = Object.create(null)
for (const key of Object.keys(input)) {
  if (allowed.has(key)) safe[key] = input[key]
}
console.log(JSON.stringify(safe), {}.admin)
const routes = new Map([
  ['/app.mjs', 'public/app.mjs'],
  ['/', 'public/index.html'],
])
console.log(routes.get('/../../secret') ?? '拒绝未知路径')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"title":"阅读"} undefined
拒绝未知路径
```

这只是白名单思想演示，真实路径防护还需规范化与真实路径边界检查，项目静态文件采用固定映射。机密不要硬编码在前端包；环境变量也不是加密存储。第三方包会执行代码，应检查来源和安装脚本，而不是看到audit无告警就认定安全。

### 41.3 竞态、泄漏和写入冲突

竞态是结果依赖未控制的交错顺序。典型例子是旧请求晚返回覆盖新结果、两个写操作都从旧快照计算、监听器重复注册。取消、序号检查、单进程队列和生命周期清理分别处理不同问题。

示例 **C41E03**，目录 `js-study/examples/ch41/C41E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let latest = 0
const output = []
async function load(label, wait) {
  const version = ++latest
  await wait
  if (version === latest) output.push(label)
}
let releaseOld
const old = load(
  '旧结果',
  new Promise((resolve) => {
    releaseOld = resolve
  }),
)
const fresh = load('新结果', Promise.resolve())
await fresh
releaseOld()
await old
console.log(output.join(','))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
新结果
```

序号只保护当前显示目标，不撤销已经发生的服务端修改。写入队列只保证同一个仓储实例内操作排序，不提供多进程锁。监听器与定时器须由创建它们的对象负责取消，不能指望垃圾回收替你执行必须完成的业务收尾。

### 41.4 测量后优化

复杂度描述输入增大时工作量如何增长，不等于某台机器的实际毫秒。性能面板、performance.now、内存快照帮助区分CPU、I/O、布局和保留对象。先测量再修改，保持输入与环境可比。

示例 **C41E04**，目录 `js-study/examples/ch41/C41E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import { performance } from 'node:perf_hooks'
const values = Array.from({ length: 1000 }, (_, i) => i)
const start = performance.now()
const sum = values.reduce((total, value) => total + value, 0)
const duration = performance.now() - start
console.log(sum, Number.isFinite(duration), duration >= 0)
const lookup = new Set(values)
console.log(lookup.has(999), lookup.has(-1))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
499500 true true
true false
```

这里只检查计时结果有效，不输出伪造的固定耗时。Set建立有成本，单次查找不一定更快；频繁查找时需连同构建和内存一起评估。浏览器长任务还会影响输入和绘制，不能只优化一个脱离真实页面的小循环。

### 41.5 最小复现与排查顺序

最小复现保留触发问题所需的最少输入、文件和步骤。按环境、入口、模块、数据、执行顺序、宿主能力逐层排查，比随机换版本有效。记录预期和实际，并区分确定输出和可变因素。

示例 **C41E05**，目录 `js-study/examples/ch41/C41E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(
  JSON.stringify(
    {
      node: process.version,
      v8: process.versions.v8,
      platform: process.platform,
      arch: process.arch,
      hasFromAsync: typeof Array.fromAsync === 'function',
      hasSumPrecise: typeof Math.sumPrecise === 'function',
    },
    null,
    2,
  ),
)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{
  "node": "v26.13.0",
  "v8": "14.6.202.34-node.40",
  "platform": "win32",
  "arch": "x64",
  "hasFromAsync": true,
  "hasSumPrecise": false
}
```

出现缺少新方法时先查看能力探测，不因为书写“ES2026”就假定实现齐全。报告中可以保存实际路径和版本，公开分享前移除私密目录、令牌和用户数据。复现用测试文件，不在原始任务库上反复试破坏操作。

### 41.6 动手练习与参考答案

**先独立回答。**

1. `JSON.parse`成功能证明数据可信么？

2. 单进程队列能保证两个独立Node进程安全写同一文件吗？

3. 一次计时缩短能证明优化有效吗？

**参考答案与检查。**

1. 不能，它只解决格式解析。

2. 不能。

3. 不能，需要同条件重复和真实负载证据。

### 41.7 本章速查

| 场景       | 做法与返回          | 易错边界         |
| :--------- | :------------------ | :--------------- |
| 校验       | 格式+类型+范围+业务 | 放在信任边界     |
| 请求竞争   | 取消+序号           | 不撤销已提交写入 |
| 持久化竞争 | 仓储队列            | 单实例保证       |
| 性能       | 先测再改            | 记录环境与负载   |

本章参考：[Node.js官方文档](https://nodejs.org/en/learn/getting-started/security-best-practices)、[OWASP：DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)、[OWASP：Prototype Pollution Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)、[Node.js v26.13.0：perf_hooks](https://nodejs.org/docs/v26.13.0/api/perf_hooks.html)。

## 第42章 ES5至ES2023：现代JavaScript怎样形成

版本章用于建立地图，不要求重新背一套语法。前面已经在稳定主线中使用许多现代特性，这里解释它们首次进入哪个年度标准，旧写法如何表达相同需求，以及哪些改写会改变行为。所有对照均在当前环境演示，不冒称已在历史引擎运行。

### 42.1 年度标准、引擎和宿主版本

ES5在2009年发布，ES5.1在2011年修订；ES6即ES2015，此后按年度命名。Node版本不是ES版本，浏览器版本也不是语言标准编号。某方法在Node26可以调用，不等于它首次在ES2026引入。

示例 **C42E01**，目录 `js-study/examples/ch42/C42E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const years = new Map([
  [5, 2009],
  [5.1, 2011],
  [6, 2015],
])
console.log('ES6对应', years.get(6))
console.log('当前Node', process.version)
console.log('支持可选链语法示例', { a: null }.a?.name ?? '缺失')
console.log('是否有精确求和', typeof Math.sumPrecise === 'function')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
ES6对应 2015
当前Node v26.13.0
支持可选链语法示例 缺失
是否有精确求和 false
```

旧语法能在新环境运行，只能证明当前兼容；要宣称某历史运行时可用，需在该运行时验证，或明确依据规范/兼容资料。浏览器DOM、Fetch、Node文件接口不按ECMA-262年度统一编号，另查各自宿主文档。

#### 42.1.1 首次正式收录年度索引

下表记录首次进入年度标准的时间，实际引擎可能在更早版本试验实现。详细旧新写法与行为变化在42.2—42.5和第43章给出；表格用于定位，不代替示例讲解。年度说明依据[ECMAScript固定版规范的历次修订介绍](https://262.ecma-international.org/17.0/#sec-intro)和[TC39完成提案清单](https://github.com/tc39/proposals/blob/main/finished-proposals.md)。

| 首次正式年度 | 重点变化                                                                                       | 本册主要位置             | 迁移时先检查                             |
| :----------- | :--------------------------------------------------------------------------------------------- | :----------------------- | :--------------------------------------- |
| ES5，2009    | 严格模式、JSON、对象描述符与数组高阶方法                                                       | 第14、17、20章与42.2     | 严格模式约束和属性标志                   |
| ES2015       | let/const、箭头、class、模块、Promise、Map/Set                                                 | 第4、10、15—18、24、27章 | 块级绑定、this与宿主模块实现             |
| ES2016       | 指数运算、`Array.includes`                                                                     | 第6、11章与42.3          | includes的相等规则                       |
| ES2017       | async/await、`Object.values`/entries、字符串填充                                               | 第7、12、28章            | await不等于新建线程                      |
| ES2018       | 对象rest/spread、异步迭代、`Promise.finally`和正则增强                                         | 第13、22、23、27—28章    | 浅复制、清理和异步消费                   |
| ES2019       | flat/flatMap、`Object.fromEntries`、可选catch绑定、稳定排序要求                                | 第12、14、19章           | 默认排序规则仍非数值排序                 |
| ES2020       | BigInt、可选链、??、allSettled、动态import、globalThis                                         | 第5、6、24、27章         | 缺失边界、数值类型与异步返回             |
| ES2021       | 逻辑赋值、replaceAll、数值分隔符、`Promise.any`、弱引用相关API                                 | 第5—7、18、27章          | 副作用次数、AggregateError和回收不确定性 |
| ES2022       | class字段/私有成员/静态块、at、`Object.hasOwn`、Error.cause、顶层await                         | 第11、12、17、19、24章   | 声明位置、身份与宿主加载条件             |
| ES2023       | findLast/findLastIndex、数组非修改方法等                                                       | 第11、14章与42.5         | 新外层不代表深复制                       |
| ES2024       | 分组、withResolvers、可调整/转移缓冲区、正则v及规范化文本工具                                  | 43.1                     | 缓冲区分离和分组返回类型                 |
| ES2025       | 迭代器辅助方法、Set运算、JSON模块/导入属性、RegExp.escape、`Promise.try`、Float16              | 43.2                     | 新语法解析、宿主支持与半精度边界         |
| ES2026       | Map获取或插入、Error.isError、sumPrecise、fromAsync、`Iterator.concat`、字节编码和JSON来源文本 | 43.3—43.4                | 年度收录与当前实现支持分别核对           |

Node特有文件、HTTP和测试API的历史应查对应Node文档的History与Stability，不使用ECMAScript年度替它们编号。浏览器DOM、Fetch和Web Storage也各有宿主标准。旧写法可继续有效，不因为出现新API就自动“已废弃”；真正弃用与移除要有对应宿主的版本说明。

### 42.2 ES5和ES2015的基础变化

ES5引入严格模式、JSON、若干数组方法和对象描述符等能力；ES2015扩充块级声明、箭头、解构、模板、默认/rest参数、class、模块、Promise、集合、Symbol及迭代。它们是不同机制，不能一概称为“语法糖”。

示例 **C42E02**，目录 `js-study/examples/ch42/C42E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
// ES5风格：普通函数、var和循环。仅用于识别历史写法。
var oldValues = [1, 2, 3]
var oldResult = oldValues.map(function (n) {
  return n * 2
})
// ES2015风格：const和箭头；此回调不依赖this，所以结果相同。
const newResult = [1, 2, 3].map((n) => n * 2)
console.log(JSON.stringify(oldResult), JSON.stringify(newResult))
const { title = '未命名' } = { title: '阅读' }
function label(prefix, ...words) {
  return `${prefix}${words.join('、')}`
}
console.log(label('任务：', title, '练习'))
class Task {
  constructor(title) {
    this.title = title
  }
}
console.log(new Task('类').title)
console.log([...new Set([1, 1, 2])].join(','))
console.log(new Map([['a', 1]]).get('a'), typeof Symbol('id'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[2,4,6] [2,4,6]
任务：阅读、练习
类
1,2
1 symbol
```

示例 **C42E03**，目录 `js-study/examples/ch42/C42E03/`，环境：Node.js。

文件 `value.mjs`：

```javascript
export const value = 3
```

文件 `main.mjs`：

```javascript
import { value } from './value.mjs'
function* numbers() {
  yield value
  yield value + 1
}
console.log([...numbers()].join(','))
console.log(await Promise.resolve(value))
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
3,4
3
```

示例 **C42E04**，目录 `js-study/examples/ch42/C42E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const object = {}
Object.defineProperty(object, 'title', { value: 'ES5', enumerable: true })
console.log(JSON.stringify(object))
try {
  object.title = '不可写'
} catch (error) {
  console.log(error.name)
}
console.log(
  [1, 2, 3]
    .filter(function (n) {
      return n > 1
    })
    .join(','),
)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"title":"ES5"}
TypeError
2,3
```

对照模块里的Promise与生成器属于ES2015，但入口使用的顶层await属于ES2022，不能把整个文件标成ES2015可直接运行。此处正是“每个特性分别标版本”的例子。var改let可能改变作用域，普通函数改箭头可能改变this/arguments/new，迁移不能只批量替换字符串。

### 42.3 ES2016至ES2019

以下表记录常用正式新增，旧写法与新写法围绕同一输入观察。标准库方法更新与宿主新增API要分开。

| 年度   | 代表变化                                                                  |
| :----- | :------------------------------------------------------------------------ |
| ES2016 | 幂运算、`Array.includes`                                                  |
| ES2017 | async/await、`Object.values`/entries、描述符集合、字符串补齐              |
| ES2018 | 对象rest/spread、异步迭代、`Promise.finally`、正则增强                    |
| ES2019 | flat/flatMap、fromEntries、trimStart/trimEnd、可省catch绑定、稳定排序要求 |

示例 **C42E05**，目录 `js-study/examples/ch42/C42E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(Math.pow(2, 3), 2 ** 3)
console.log([1, 2].indexOf(2) !== -1, [1, 2].includes(2))
console.log('7'.padStart(3, '0'), '7'.padEnd(3, '0'))
console.log(JSON.stringify(Object.values({ a: 1 })), JSON.stringify(Object.entries({ a: 1 })))
console.log(Object.getOwnPropertyDescriptors({ a: 1 }).a.enumerable)
async function get() {
  return await Promise.resolve(4)
}
console.log(await get())
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
8 8
true true
007 700
[1] [["a",1]]
true
4
```

示例 **C42E06**，目录 `js-study/examples/ch42/C42E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const data = { a: 1, b: 2 }
const { a, ...rest } = data
console.log(a, JSON.stringify({ ...rest, c: 3 }))
async function* values() {
  yield 1
  yield 2
}
for await (const value of values()) console.log(value)
await Promise.resolve().finally(() => console.log('finally'))
const matched = /(?<word>JS)./s.exec('JS\n')
console.log(matched.groups.word, /\p{Letter}/u.test('中'), /(?<=A)B/.test('AB'))
console.log(JSON.stringify([[1], [2]].flat()), JSON.stringify(['a b'].flatMap((s) => s.split(' '))))
console.log(JSON.stringify(Object.fromEntries([['a', 1]])))
console.log(' x '.trimStart().length, ' x '.trimEnd().length)
try {
  JSON.parse('{')
} catch {
  console.log('可省catch变量')
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1 {"b":2,"c":3}
1
2
finally
JS true true
[1,2] ["a","b"]
{"a":1}
2 2
可省catch变量
```

includes和indexOf并非在所有输入都等价：NaN就是差异。对象展开和`Object.assign`对setter等行为也不同。正则新语法需要解析器支持；不能仅在运行时检查RegExp.prototype就让不支持的正则字面量安全解析。

### 42.4 ES2020至ES2022

ES2020加入BigInt、可选链、空值合并、动态import、import.meta、globalThis、allSettled等；ES2021加入逻辑赋值、replaceAll、`Promise.any`、数字分隔符和弱引用能力；ES2022加入class字段/私有成员/静态块等、顶层await、at、hasOwn、错误cause和正则d。

示例 **C42E07**，目录 `js-study/examples/ch42/C42E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const input = { count: 0, owner: null }
console.log(input.owner?.name ?? '未设置')
console.log(input.count || 10, input.count ?? 10)
console.log(String(9007199254740993n), typeof globalThis)
console.log((await Promise.allSettled([Promise.reject('失败')]))[0].status)
let value = null
value ??= 5
value &&= 7
let empty = ''
empty ||= '默认'
console.log(value, empty, 1_000)
console.log('a-a'.replaceAll('-', '/'))
console.log(await Promise.any([Promise.reject('x'), Promise.resolve('ok')]))
const held = {}
const weak = new WeakRef(held)
console.log(weak.deref() === held, typeof FinalizationRegistry)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
未设置
10 0
9007199254740993 object
rejected
7 默认 1000
a/a
ok
true function
```

示例 **C42E08**，目录 `js-study/examples/ch42/C42E08/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
class Task {
  #done = false
  title = '任务'
  static count = 0
  static {
    this.count = 1
  }
  finish() {
    this.#done = true
  }
  get done() {
    return this.#done
  }
  static owns(value) {
    return #done in value
  }
}
const task = new Task()
task.finish()
console.log(task.title, task.done, Task.count, Task.owns(task))
console.log([1, 2].at(-1), Object.hasOwn(task, 'title'))
const error = new Error('上层', { cause: new Error('底层') })
console.log(error.cause.message)
console.log(JSON.stringify(/a/d.exec('cat').indices[0]))
console.log(await Promise.resolve('顶层await'))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
任务 true 1 true
2 true
底层
[1,2]
顶层await
```

??只替换null/undefined，不像||吞掉0；这类迁移会改变业务结果。BigInt的n后缀和class私有语法不能用普通函数polyfill让旧解析器理解。WeakRef不可依赖何时回收，保持held引用的例子只演示接口，不证明回收策略。

### 42.5 ES2023与兼容迁移

ES2023提供findLast/findLastIndex和非修改数组操作等改进，并允许部分非注册Symbol用于弱关联。主线关注数组更新，让原数据保留。迁移先查行为契约，再查语法和依赖，不把CommonJS当作已从Node移除。

示例 **C42E09**，目录 `js-study/examples/ch42/C42E09/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const values = [1, 3, 2, 3]
console.log(
  values.findLast((n) => n > 2),
  values.findLastIndex((n) => n > 2),
)
console.log(JSON.stringify(values.toSorted((a, b) => a - b)))
console.log(JSON.stringify(values.toReversed()))
console.log(JSON.stringify(values.toSpliced(1, 1, 9)))
console.log(JSON.stringify(values.with(0, 8)))
console.log(JSON.stringify(values))
const symbol = Symbol('weak key')
const map = new WeakMap([[symbol, '可用']])
console.log(map.get(symbol))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
3 3
[1,2,3,3]
[3,2,3,1]
[1,9,2,3]
[8,3,2,3]
[1,3,2,3]
可用
```

旧写法常用slice后sort等实现新外层结果，但对稀疏数组、访问器和通用性等边界不一定逐项等价。迁移测试覆盖空数组、NaN、共享对象、回调this、模块加载副作用和异常传播。Annex B保留的Web兼容行为不代表新代码推荐继续使用。

### 42.6 动手练习与参考答案

**先独立回答。**

1. ES2015模块能证明Node当年已经无条件支持ESM吗？

2. 把||改?

3. 本章对照在Node26运行能证明ES5引擎兼容吗？

**参考答案与检查。**

1. 不能，语言标准和Node实现进度不同。

2. ?会改变什么？0、false和空字符串不再被替换。

3. 不能，本章没有进行历史运行时验证。

### 42.7 本章速查

| 场景     | 做法与返回        | 易错边界                 |
| :------- | :---------------- | :----------------------- |
| 版本名   | ES6=ES2015        | Node版本另记             |
| 首次纳入 | 按固定年度规范    | 不以当前可用反推         |
| 语法迁移 | 检查this/作用域等 | 不做纯文本替换           |
| 兼容测试 | 真实目标引擎      | 新引擎跑旧写法不足以证明 |

本章参考：[ECMAScript 2026语言规范：对应条款](https://262.ecma-international.org/17.0/#sec-intro)、[Ecma标准：ECMA-262](https://ecma-international.org/publications-and-standards/standards/ecma-262/)、[Node.js v26.13.0：esm](https://nodejs.org/docs/v26.13.0/api/esm.html)。

## 第43章 ES2024至ES2026、提案状态与升级

本章是全书版本基线的核对中心。正式标准、已完成待收录提案、实现支持和API稳定级别各有含义。标准新增API即使在较旧引擎早已实现，也仍按首次年度记录；较新运行时也可能缺少某项正式API。

### 43.1 ES2024的分组、Promise和二进制增强

ES2024纳入`Object.groupBy`/Map.groupBy、`Promise.withResolvers`、可调整/转移缓冲区、正则v、字符串良构检查和Atomics.waitAsync等。下例按输入观察返回结构和缓冲区转移，不把字节所有权变化当复制。

示例 **C43E01**，目录 `js-study/examples/ch43/C43E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const records = [{ done: false }, { done: true }, { done: false }]
console.log(Object.groupBy(records, (x) => (x.done ? 'done' : 'open')).open.length)
console.log(Map.groupBy(records, (x) => x.done).get(false).length)
const { promise, resolve } = Promise.withResolvers()
resolve('已结算')
console.log(await promise)
const buffer = new ArrayBuffer(4, { maxByteLength: 8 })
buffer.resize(6)
console.log(buffer.byteLength, buffer.resizable)
const moved = buffer.transfer()
console.log(buffer.byteLength, moved.byteLength)
console.log(/^[\p{ASCII}&&\p{Letter}]+$/v.test('JS'))
console.log('\ud800'.isWellFormed(), '\ud800'.toWellFormed() === '\ufffd')
console.log(typeof Atomics.waitAsync)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
2
2
已结算
6 true
0 6
true
false true
function
```

transfer会使原缓冲区分离，原视图也受影响。正则v和u不能同时设置。共享缓冲区和waitAsync只有满足宿主安全条件才可用；本例仅检查waitAsync入口，真正共享并发在选修章说明。

### 43.2 ES2025的迭代器、集合与文本增强

ES2025纳入迭代器辅助方法、Set集合运算、JSON模块与导入属性、RegExp.escape/修饰符/重复命名组、`Promise.try`及Float16相关能力。导入属性的宿主支持还要单独检查，不能混用旧import assertions语法。

示例 **C43E02**，目录 `js-study/examples/ch43/C43E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(
  Iterator.from([1, 2, 3])
    .filter((n) => n > 1)
    .map((n) => n * 2)
    .toArray()
    .join(','),
)
const a = new Set([1, 2])
const b = new Set([2, 3])
console.log([...a.union(b)].join(','), [...a.intersection(b)].join(','))
console.log([...a.difference(b)].join(','), [...a.symmetricDifference(b)].join(','))
console.log(
  a.isSubsetOf(new Set([1, 2, 3])),
  a.isSupersetOf(new Set([1])),
  a.isDisjointFrom(new Set([9])),
)
console.log(new RegExp(RegExp.escape('a.b')).test('a.b'))
console.log(/(?i:a)b/.test('Ab'))
console.log(/(?<x>a)|(?<x>b)/.exec('b').groups.x)
console.log(await Promise.try(() => 7))
console.log(new Float16Array([1.5])[0], Math.f16round(1.1))
const view = new DataView(new ArrayBuffer(2))
view.setFloat16(0, 1.5)
console.log(view.getFloat16(0))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
4,6
1,2,3 2
1 1,3
true true true
true
true
b
7
1.5 1.099609375
1.5
```

示例 **C43E03**，目录 `js-study/examples/ch43/C43E03/`，环境：Node.js。

文件 `data.json`：

```json
{ "title": "JSON模块" }
```

文件 `main.mjs`：

```javascript
import data from './data.json' with { type: 'json' }
console.log(data.title)
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
JSON模块
```

重复命名组并不意味着任意同路径重复都合法，主要处理可互斥分支等允许情形。RegExp.escape不是简单给标点前加反斜杠，具体转义规则要遵循规范。Float16适合明确需要半精度存储的场景，不是金额精确十进制。

### 43.3 ES2026的获取或插入、错误和求和

ES2026新增Map/WeakMap的getOrInsert与getOrInsertComputed、Error.isError、`Math.sumPrecise`等。getOrInsert的普通实参先求值，Computed回调仅在需要插入时计算。Error.isError检查错误品牌，不依赖某个realm的instanceof。

示例 **C43E04**，目录 `js-study/examples/ch43/C43E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const map = new Map([['known', 1]])
let calls = 0
function compute() {
  calls += 1
  return 9
}
console.log(map.getOrInsert('known', compute()), calls)
console.log(map.getOrInsertComputed('known', compute), calls)
console.log(map.getOrInsertComputed('new', compute), calls)
const key = {}
const weak = new WeakMap()
console.log(weak.getOrInsertComputed(key, () => 3))
console.log(Error.isError(new Error('失败')), Error.isError({ name: 'Error' }))
if (typeof Math.sumPrecise === 'function') console.log(Math.sumPrecise([1e20, 1, -1e20]))
else console.log('本环境尚无Math.sumPrecise；不以普通reduce冒充相同精度保证')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1 1
1 1
9 2
3
true false
本环境尚无Math.sumPrecise；不以普通reduce冒充相同精度保证
```

本书目标Node26.13中`Math.sumPrecise`尚不可用，故明确输出检测分支；标准已收录与该实现未提供可以同时成立。旧Map写法要用has区分已有undefined与缺键，不能单靠get(...) ?? 默认值替代新方法的全部语义。

### 43.4 ES2026的数据交换和迭代增强

ES2026还纳入`Array.fromAsync`、`Iterator.concat`、Uint8Array的Base64/十六进制转换、JSON解析来源文本和原始JSON能力。这些解决不同边界：等待收集、顺序连接、字节编码与数值文本保真。

示例 **C43E05**，目录 `js-study/examples/ch43/C43E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
async function* values() {
  yield 1
  yield 2
}
console.log(JSON.stringify(await Array.fromAsync(values(), (n) => n * 2)))
console.log(
  Iterator.concat([1, 2], new Set([3]))
    .toArray()
    .join(','),
)
const bytes = new Uint8Array([72, 105])
console.log(bytes.toBase64(), bytes.toHex())
console.log(Uint8Array.fromBase64('SGk=').join(','), Uint8Array.fromHex('4869').join(','))
const target = new Uint8Array(2)
console.log(target.setFromBase64('SGk=').written, target.setFromHex('4869').written)
const text = JSON.stringify({ n: JSON.rawJSON('9007199254740993') })
const restored = JSON.parse(text, (key, value, context) =>
  key === 'n' ? BigInt(context.source) : value,
)
console.log(String(restored.n), JSON.isRawJSON(JSON.rawJSON('1')))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
[2,4]
1,2,3
SGk= 4869
72,105 72,105
2 2
9007199254740993 true
```

普通`JSON.parse`先把数字转Number，超安全整数可能已经丢精度；reviver来源文本允许从原始字面文本恢复。rawJSON只能表示规范允许的原始JSON值文本，不是插入任意代码的逃生口。字节转Base64不是字符编码，中文文本先用明确字符编码取得字节。

### 43.5 状态矩阵、兼容方案和升级步骤

TC39阶段为0、1、2、2.7、3、4：从构想到设计、验证、实现经验与完成。Stage4完成后还要记录纳入哪个年度；浏览器实现或Node稳定级别不是同一维度。Temporal和显式资源管理当前完成清单预期2027，列选修，不归ES2026年度。

示例 **C43E06**，目录 `js-study/examples/ch43/C43E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const report = {
  node: process.version,
  languageMethods: {
    sumPrecise: typeof Math.sumPrecise === 'function',
    fromAsync: typeof Array.fromAsync === 'function',
    getOrInsert: typeof Map.prototype.getOrInsert === 'function',
  },
  laterYearFeatures: {
    temporal: typeof Temporal !== 'undefined',
    disposableStack: typeof DisposableStack !== 'undefined',
  },
}
console.log(JSON.stringify(report, null, 2))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{
  "node": "v26.13.0",
  "languageMethods": {
    "sumPrecise": false,
    "fromAsync": true,
    "getOrInsert": true
  },
  "laterYearFeatures": {
    "temporal": true,
    "disposableStack": true
  }
}
```

polyfill能在一定前提下补充库方法，不能让旧解析器直接读懂新语法；转译也不自动补全部运行时API。升级步骤：固定版本→核对Node/引擎/依赖→阅读弃用和移除说明→运行测试与目标环境示例→验证回退。Node27当前Alpha属于发布线状态，不当作稳定主线。禁止把“旧写法仍可用”误写成“已废弃”，也不把实验API当作稳定。

#### 43.5.1 正式年度、实现与条件分开记录

本书固定Node.js 26.13.0环境；下表的支持只表示该基线，不表示这些API首次在Node 26出现。浏览器的品牌和版本各自变化，运行下一例记录当前能力，再决定兼容方案。

| 特性                                 | 首次正式年度／状态             | Node 26.13.0                         | 使用条件与旧写法差异                                          |
| :----------------------------------- | :----------------------------- | :----------------------------------- | :------------------------------------------------------------ |
| Set集合运算、Iterator辅助方法        | ES2025正式                     | 可用，无额外参数                     | 旧环境可遍历实现；迭代器辅助方法具有惰性与一次消费语义        |
| JSON模块与导入属性                   | ES2025正式                     | 可用，无额外参数                     | `.mjs`中使用`with { type: 'json' }`；宿主加载规则另查         |
| Map.getOrInsert/Computed             | ES2026正式                     | 可用，无额外参数                     | 旧写法用has区分已存undefined，注意默认表达式何时求值          |
| Error.isError                        | ES2026正式                     | 可用，无额外参数                     | instanceof对跨realm敏感；不能用名字字符串充当错误品牌         |
| `Math.sumPrecise`                    | ES2026正式                     | 缺失，示例给检测分支                 | 普通reduce不具有相同精度保证；不静默冒充替代                  |
| `Array.fromAsync`、`Iterator.concat` | ES2026正式                     | 可用，无额外参数                     | 等待收集与惰性连接的消费方式不同                              |
| Uint8Array编码、JSON来源文本         | ES2026正式                     | 可用，无额外参数                     | 字节编码不是文本字符编码，大整数应保留来源文本或明确文本协议  |
| Temporal、显式资源管理               | Stage4，预期纳入2027；本书选修 | 基线已提供相应能力，语法独立文件运行 | 实现先于年度收录不改变年度归属；旧解析器不能靠if跳过using解析 |

TC39的Stage4表示提案流程完成，年度标准是另一个时间点；Node的Experimental等稳定级别由Node文档定义。Java术语“预览／孵化”不能直接当作JavaScript所有特性的通用分类。若某宿主要求实验参数，必须为该具体实现写出参数和版本，本表不把未知条件猜成默认可用。

#### 43.5.2 在自己的Node和浏览器记录能力

示例 **C43E07**，目录 `js-study/examples/ch43/C43E07/`，环境：Node.js或浏览器。文件 `report.mjs`：

```javascript
let sourceText = false
JSON.parse('1', (key, value, context) => {
  if (key === '') sourceText = context?.source === '1'
  return value
})
const report = {
  getOrInsert: typeof Map.prototype.getOrInsert === 'function',
  errorIsError: typeof Error.isError === 'function',
  sumPrecise: typeof Math.sumPrecise === 'function',
  fromAsync: typeof Array.fromAsync === 'function',
  concat: typeof globalThis.Iterator?.concat === 'function',
  bytesFromHex: typeof Uint8Array.fromHex === 'function',
  jsonSourceText: sourceText,
}
const text = JSON.stringify(report, null, 2)
if (typeof document === 'undefined') console.log(text)
else document.querySelector('#report').textContent = text
```

Node中运行`node report.mjs`。在本书固定基线中，sumPrecise为false，其余列出的能力为true；主动更换运行时后应记录实际结果，不修改检测代码来迎合书中值。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>检查浏览器语言能力</title>
  </head>
  <body>
    <h1>当前浏览器的能力</h1>
    <pre id="report">等待模块</pre>
    <script type="module" src="./report.mjs"></script>
  </body>
</html>
```

从学习根目录运行`node tools/serve-examples.mjs --dir examples/ch43/C43E07 --port 3211`，打开打印的URL。浏览器结果不必与Node相同；true仅证明该入口在当前环境存在，不能据此推导精度、全部边界或其他浏览器也通过。新语法需像第44章一样使用独立文件验证解析，方法存在性检测不能替代它。

### 43.6 动手练习与参考答案

**先独立回答。**

1. Node有Temporal能证明Temporal属于ES2026吗？

2. `Math.sumPrecise`缺失时reduce求和能无说明替代吗？

3. getOrInsert已有键时compute()还调用吗？

**参考答案与检查。**

1. 不能，实现可以提前提供。

2. 不能，两者精度保证不同。

3. 作为实参先求值会调用；Computed回调按缺键需要执行。

### 43.7 本章速查

| 场景     | 做法与返回       | 易错边界               |
| :------- | :--------------- | :--------------------- |
| 年度标准 | 固定版ECMA-262   | 不使用滚动草案偷换年度 |
| 完成提案 | Stage4           | 年度归属另核对         |
| 实现检测 | typeof API       | 语法支持还需解析测试   |
| 兼容方案 | 转译/补库/改设计 | 不保证自动补全语义     |

本章参考：[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)、[TC39提案流程](https://tc39.es/process-document/)、[TC39完成提案清单](https://github.com/tc39/proposals/blob/main/finished-proposals.md)、[Node.js发布计划](https://github.com/nodejs/Release)、[Node.js v26.13.0：deprecations](https://nodejs.org/docs/v26.13.0/api/deprecations.html)。

## 第44章 元编程、Worker与后续标准导读

本章为【选修】，不是完成综合项目的前置。元编程让程序拦截自身操作；Worker让计算在其他执行上下文推进；后续标准导读帮助你读懂新代码。每项能力都增加边界，不为了“高级”把简单业务改成复杂机制。

### 44.1 Proxy与Reflect

Proxy为目标对象设置操作拦截器，Reflect提供相应底层操作的函数形式。代理有自身身份，并须遵守目标不变量。拦截属性读取不代表可以绕过冻结属性、私有字段或任意宿主对象的内部规则。

示例 **C44E01**，目录 `js-study/examples/ch44/C44E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const target = { title: '阅读' }
const proxy = new Proxy(target, {
  set(object, key, value, receiver) {
    if (key === 'title' && typeof value !== 'string') throw new TypeError('需要文本')
    return Reflect.set(object, key, value, receiver)
  },
})
proxy.title = '练习'
console.log(target.title, proxy === target)
try {
  proxy.title = 3
} catch (error) {
  console.log(error.name)
}
const frozen = Object.freeze({ n: 1 })
const wrong = new Proxy(frozen, {
  get() {
    return 2
  },
})
try {
  console.log(wrong.n)
} catch (error) {
  console.log(error.name)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
练习 false
TypeError
TypeError
```

Reflect不是“自动修复代理”，而是可明确转发默认操作。私有字段检查与实际接收者有关，把class实例简单包一层可能失效。业务校验优先写在清楚的入口，不默认对每个对象使用Proxy。

### 44.2 Node与浏览器Worker

Worker有独立执行环境，通过消息传递协作。它适合可独立计算的CPU工作，不是普通I/O等待的默认替代。Node Worker需要node:worker_threads；浏览器Worker不能直接操作DOM，页面负责呈现结果。

示例 **C44E02**，目录 `js-study/examples/ch44/C44E02/`，环境：Node.js。

文件 `worker.mjs`：

```javascript
import { parentPort, workerData } from 'node:worker_threads'
let total = 0
for (let i = 1; i <= workerData; i += 1) total += i
parentPort.postMessage(total)
```

文件 `main.mjs`：

```javascript
import { Worker } from 'node:worker_threads'
const result = await new Promise((resolve, reject) => {
  const worker = new Worker(new URL('./worker.mjs', import.meta.url), { workerData: 10 })
  worker.once('message', resolve)
  worker.once('error', reject)
  worker.once('exit', (code) => {
    if (code !== 0) reject(new Error(`退出码${code}`))
  })
})
console.log(result)
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
55
```

示例 **C44E03**，目录 `js-study/examples/ch44/C44E03/`，环境：浏览器。

文件 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <meta charset="UTF-8" /><title>Worker</title>
  <button id="run">计算</button>
  <p id="out"></p>
  <script type="module" src="./main.mjs"></script>
</html>
```

文件 `worker.mjs`：

```javascript
self.addEventListener('message', (event) => {
  let total = 0
  for (let i = 1; i <= event.data; i += 1) total += i
  self.postMessage(total)
})
```

文件 `main.mjs`：

```javascript
document.querySelector('#run').addEventListener('click', () => {
  const worker = new Worker('./worker.mjs', { type: 'module' })
  worker.addEventListener(
    'message',
    (event) => {
      document.querySelector('#out').textContent = event.data
      worker.terminate()
    },
    { once: true },
  )
  worker.addEventListener(
    'error',
    () => {
      document.querySelector('#out').textContent = '计算失败'
      worker.terminate()
    },
    { once: true },
  )
  worker.postMessage(10)
})
```

通过本书静态服务打开，点击计算显示55；成功或错误后终止Worker。

创建Worker有启动和通信成本，55这样的微小计算只是教学，实际不值得开线程。真实长期服务应复用受限工作池、处理取消/超时/异常退出，不能为每次鼠标移动无限创建线程。

### 44.3 结构化克隆、转移与共享

消息通常用结构化克隆。可转移缓冲区交出所有权后原缓冲区分离；SharedArrayBuffer让不同上下文访问同一内存，竞争操作需用Atomics或正确协议。浏览器共享内存还需要安全上下文和隔离等条件。

示例 **C44E04**，目录 `js-study/examples/ch44/C44E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const source = new ArrayBuffer(4)
new Uint8Array(source)[0] = 7
const copied = structuredClone(source)
console.log(source.byteLength, new Uint8Array(copied)[0])
const moved = structuredClone(source, { transfer: [source] })
console.log(source.byteLength, moved.byteLength)
const shared = new Int32Array(new SharedArrayBuffer(4))
console.log(Atomics.add(shared, 0, 2), Atomics.load(shared, 0))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
4 7
0 4
0 2
```

Atomics.add返回修改前的值，load取得当前值。这个单线程例子只解释接口，不模拟完整并发协议。浏览器不能仅因为typeof SharedArrayBuffer存在就跳过隔离检查；本书静态服务不配置共享内存隔离，主线不依赖它。

### 44.4 Temporal的日期与时间模型

Temporal区分无时区日期、精确时刻、带时区日期时间等概念。PlainDate适合生日和日历日期；Instant适合日志时刻；ZonedDateTime包含时区解释。当前列后续年度特性，Node可能先行提供，旧环境需独立评估polyfill。

示例 **C44E05**，目录 `js-study/examples/ch44/C44E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
if (typeof Temporal === 'undefined') {
  console.log('本环境没有Temporal，请阅读接口说明并单独选择兼容方案')
} else {
  const date = Temporal.PlainDate.from('2026-11-09')
  console.log(date.add({ days: 1 }).toString())
  const instant = Temporal.Instant.from('2026-11-09T00:00:00Z')
  console.log(instant.toZonedDateTimeISO('Asia/Shanghai').hour)
  console.log(date.toString())
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
2026-11-10
8
2026-11-09
```

add返回新值，原date不改变。日历增加一天不同于在所有时区都增加固定毫秒数。与Date对照时先说明你的数据究竟是日历日期还是精确时刻，不能因为新API更丰富就无计划更换存储格式。

### 44.5 显式资源管理与传统finally

using在离开作用域时调用`Symbol.dispose`；await using等待`Symbol.asyncDispose`等异步释放协议。DisposableStack/AsyncDisposableStack帮助组合清理，通常按后进先出释放。它们属于后续年度导读，不能混写为ES2026正式语法。

示例 **C44E06**，目录 `js-study/examples/ch44/C44E06/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
// 此独立选修文件要求解析器支持using语法；旧引擎不能靠if检测跳过解析。
{
  using resource = {
    [Symbol.dispose]() {
      console.log('释放同步资源')
    },
  }
  console.log('使用中')
}
{
  await using resource = {
    async [Symbol.asyncDispose]() {
      await Promise.resolve()
      console.log('释放异步资源')
    },
  }
  console.log('异步资源使用中')
}
{
  using stack = new DisposableStack()
  stack.defer(() => console.log('先登记后释放'))
  stack.defer(() => console.log('后登记先释放'))
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
使用中
释放同步资源
异步资源使用中
释放异步资源
后登记先释放
先登记后释放
```

示例 **C44E07**，目录 `js-study/examples/ch44/C44E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const resource = {
  close() {
    console.log('传统清理')
  },
}
try {
  console.log('传统使用')
} finally {
  resource.close()
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
传统使用
传统清理
```

在支持的目标环境中运行选修文件可观察退出作用域后的清理；在旧环境，解析器会在执行前拒绝新语法，所以必须隔离文件或使用明确转译。清理与垃圾回收不同，前者是必须执行的资源协议。释放失败与原异常组合有专门规则，业务中不应无条件吞掉。

### 44.6 动手练习与参考答案

**先独立回答。**

1. Proxy是否等于目标对象？

2. 转移ArrayBuffer后原缓冲区还能按原长度读写吗？

3. 旧引擎能用if(false)包住using来免解析吗？

**参考答案与检查。**

1. 不是，身份不同且有不变量。

2. 不能，它已分离。

3. 不能，需隔离或转译。

### 44.7 本章速查

| 场景     | 做法与返回                | 易错边界           |
| :------- | :------------------------ | :----------------- |
| 拦截     | Proxy+Reflect             | 保留目标不变量     |
| 独立计算 | Worker                    | 有启动和通信成本   |
| 共享内存 | SharedArrayBuffer+Atomics | 浏览器有隔离条件   |
| 确定释放 | using/await using         | 与GC和年度归属分开 |

本章参考：[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)、[Node.js v26.13.0：worker_threads](https://nodejs.org/docs/v26.13.0/api/worker_threads.html)、[HTML标准：Worker](https://html.spec.whatwg.org/multipage/workers.html)、[Temporal提案文档](https://tc39.es/proposal-temporal/docs/)、[显式资源管理提案](https://github.com/tc39/proposal-explicit-resource-management)、[TC39完成提案清单](https://github.com/tc39/proposals/blob/main/finished-proposals.md)。

## 第45章 综合项目：浏览器与Node.js协作的学习任务管理器

本项目把完整学习路线接起来：浏览器负责交互，Node负责HTTP与文件，纯业务模块负责共同规则。
它是本机单用户工具，不提供账号、数据库和公网部署。先在临时数据目录练习，再保存自己的任务。
本章按职责给出全部必要源文件，请在`js-study/projects/task-manager/`按同样结构保存文件；项目无第三方运行依赖。

### 45.1 需求、架构和运行方式

完整功能包括添加、编辑、完成切换、删除、关键词/状态过滤、排序、分钟统计、JSON导入导出。
任务采用version=1快照，ID在正常新增/删除过程中不复用。导入是恢复文件中完整状态，需明确确认。

```text
浏览器表单 → 共享校验 → Fetch → HTTP路由 → 共享业务规则 → 仓储队列 → JSON文件
                    页面渲染 ← JSON响应 ← 保存成功后提交状态

task-manager/
  package.json
  .nvmrc
  cli.mjs
  shared/task-core.mjs
  server/task-repository.mjs
  server/http-app.mjs
  server/main.mjs
  public/index.html
  public/styles.css
  public/app.mjs
  test/task-core.test.mjs
  test/server.test.mjs
```

先在终端进入完整项目目录，执行以下命令。npm脚本调用当前命令搜索路径中的Node，
所以版本管理器切换后仍要验证`node --version`，不因`package.json`写了engines就假定自动安装。

```powershell
node --version
npm --version
npm test
npm start
```

打开打印的回环地址，默认http://127.0.0.1:3210。按Ctrl+C停止。
数据默认相对当前工作目录保存到data/tasks.json，不是相对任意源码文件。
首次没有文件时开始空表；已有文件损坏则拒绝启动，要求保留并修复原文件。

示例 **C45E01**，文件 `package.json`，完整项目目录 `js-study/projects/task-manager/`。

```json
{
  "name": "javascript-study-task-manager",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=26.13.0 <27" },
  "scripts": {
    "start": "node server/main.mjs",
    "test": "node --test",
    "cli": "node cli.mjs"
  }
}
```

engines表达项目版本期望，脚本组织入口；没有dependencies，因此运行项目不需要下载第三方库。

示例 **C45E02**，文件 `.nvmrc`，完整项目目录 `js-study/projects/task-manager/`。

```text
26.13.0
```

本文件只含期望Node版本。nvm-sh、当前nvm-windows和fnm的读取／切换方式见第2章；不要用过去版本管理器的行为推断当前版本。

端口和文件可以在启动前显式指定，设置只影响当前终端及其子进程：

```powershell
$env:PORT = '3211'
$env:TASK_FILE = 'D:\learning\tasks.json'
node server/main.mjs
```

macOS/Linux：

```bash
PORT=3211 TASK_FILE="$PWD/data/tasks.json" node server/main.mjs
```

端口0由系统分配，用于测试；真实端口、绝对路径与时间是可变结果，不在书里伪造固定值。

### 45.2 数据与接口契约

标题去两端空白后1—200个UTF-16码元，分钟0—1440整数，done必须为布尔值；
每项最多20个标签，每个标签1—30个UTF-16码元；快照最多1000项。
创建时间使用规范UTC ISO字符串。未知字段、重复ID、非法nextId和未知格式版本拒绝。

| 请求                 | 成功结果               | 失败边界          |
| :------------------- | :--------------------- | :---------------- |
| GET /api/tasks       | tasks和当前筛选summary | 非法状态或排序400 |
| POST /api/tasks      | 新任务，201            | 非法字段400       |
| PATCH /api/tasks/ID  | 更新后任务，200        | 不存在404         |
| DELETE /api/tasks/ID | 无内容204              | 不存在404         |
| GET /api/store       | 完整快照200            | 读取失败500       |
| PUT /api/store       | 导入项数200            | 整份校验失败400   |

客户端和服务端共享规则，但各自入口仍要执行校验。不能因为前端导入过同一个模块就信任网络请求。

示例 **C45E03**，文件 `shared/task-core.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
// 纯业务规则不访问DOM或磁盘，因此浏览器、命令行和服务端可以共同使用。
export class InputError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'InputError'
    this.status = status
  }
}

function assert(condition, message) {
  if (!condition) throw new InputError(message)
}

function exactKeys(value, keys, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label}必须是对象`)
  assert(
    Object.keys(value).every((key) => keys.includes(key)),
    `${label}含未知字段`,
  )
}

export function normalizeFields(value) {
  exactKeys(value, ['title', 'minutes', 'tags', 'done'], '任务字段')
  assert(typeof value.title === 'string', '标题必须是字符串')
  const title = value.title.trim()
  assert(title.length >= 1 && title.length <= 200, '标题需要1至200个UTF-16码元')
  assert(
    Number.isInteger(value.minutes) && value.minutes >= 0 && value.minutes <= 1440,
    '分钟数必须是0至1440的整数',
  )
  assert(typeof value.done === 'boolean', '完成状态必须是布尔值')
  assert(Array.isArray(value.tags) && value.tags.length <= 20, '标签必须是最多20项的数组')
  const tags = value.tags.map((tag) => {
    assert(typeof tag === 'string', '标签必须是字符串')
    const text = tag.trim()
    assert(text.length >= 1 && text.length <= 30, '每个标签需要1至30个UTF-16码元')
    return text
  })
  return { title, minutes: value.minutes, done: value.done, tags: [...new Set(tags)] }
}

export function emptyStore() {
  return { version: 1, nextId: 1, tasks: [] }
}

export function validateStore(value) {
  exactKeys(value, ['version', 'nextId', 'tasks'], '数据文件')
  assert(value.version === 1, '只支持version为1的数据格式')
  assert(Number.isSafeInteger(value.nextId) && value.nextId > 0, 'nextId必须是正安全整数')
  assert(Array.isArray(value.tasks) && value.tasks.length <= 1000, '任务数组最多1000项')
  const seen = new Set()
  const tasks = value.tasks.map((task) => {
    exactKeys(task, ['id', 'title', 'minutes', 'tags', 'done', 'createdAt'], '任务')
    assert(Number.isSafeInteger(task.id) && task.id > 0, '任务ID必须是正安全整数')
    assert(!seen.has(task.id), '任务ID不能重复')
    assert(task.id < value.nextId, 'nextId必须大于所有现有任务ID')
    seen.add(task.id)
    assert(typeof task.createdAt === 'string', 'createdAt必须是ISO时间字符串')
    const date = new Date(task.createdAt)
    assert(
      Number.isFinite(date.getTime()) && date.toISOString() === task.createdAt,
      'createdAt必须是规范的UTC ISO时间字符串',
    )
    const fields = normalizeFields({
      title: task.title,
      minutes: task.minutes,
      tags: task.tags,
      done: task.done,
    })
    return { id: task.id, ...fields, createdAt: task.createdAt }
  })
  return { version: 1, nextId: value.nextId, tasks }
}

export function addTask(store, input, now = new Date().toISOString()) {
  assert(store.tasks.length < 1000, '任务数量已达上限')
  assert(store.nextId < Number.MAX_SAFE_INTEGER, '任务ID已耗尽')
  const fields = normalizeFields(input)
  const task = { id: store.nextId, ...fields, createdAt: now }
  // 返回新数据，保留原store；持久化失败时调用者仍有未修改的旧状态。
  return validateStore({
    ...store,
    nextId: store.nextId + 1,
    tasks: [...store.tasks, task],
  })
}

export function editTask(store, id, patch) {
  exactKeys(patch, ['title', 'minutes', 'tags', 'done'], '修改字段')
  const task = store.tasks.find((item) => item.id === id)
  if (!task) throw new InputError('任务不存在', 404)
  const fields = normalizeFields({
    title: task.title,
    minutes: task.minutes,
    tags: task.tags,
    done: task.done,
    ...patch,
  })
  return {
    ...store,
    tasks: store.tasks.map((item) => (item.id === id ? { ...item, ...fields } : item)),
  }
}

export function removeTask(store, id) {
  if (!store.tasks.some((task) => task.id === id)) throw new InputError('任务不存在', 404)
  return { ...store, tasks: store.tasks.filter((task) => task.id !== id) }
}

export function selectTasks(store, { query = '', status = 'all', sort = 'id' } = {}) {
  assert(['all', 'open', 'done'].includes(status), '筛选状态无效')
  assert(['id', 'title', 'minutes'].includes(sort), '排序字段无效')
  assert(typeof query === 'string', '关键词必须是字符串')
  const keyword = query.trim().toLocaleLowerCase('zh-CN')
  const selected = store.tasks.filter((task) => {
    const matched = `${task.title} ${task.tags.join(' ')}`
      .toLocaleLowerCase('zh-CN')
      .includes(keyword)
    return matched && (status === 'all' || task.done === (status === 'done'))
  })
  return selected.toSorted((a, b) => {
    const result = sort === 'title' ? a.title.localeCompare(b.title, 'zh-CN') : a[sort] - b[sort]
    return result || a.id - b.id
  })
}

export function summarize(tasks) {
  return {
    total: tasks.length,
    done: tasks.filter((task) => task.done).length,
    minutes: tasks.reduce((sum, task) => sum + task.minutes, 0),
  }
}
```

核心不依赖DOM、process或磁盘。validateStore返回规范数据，操作函数计算候选新状态；持久化由仓储承担。

示例 **C45E04**，文件 `cli.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
import { resolve } from 'node:path'
import { openRepository } from './server/task-repository.mjs'
import { addTask, editTask, removeTask, selectTasks } from './shared/task-core.mjs'

const [command = 'help', ...args] = process.argv.slice(2)
const help = '用法：node cli.mjs list | add 标题 分钟 | done ID | delete ID'
try {
  if (command === 'help') {
    console.log(help)
  } else {
    // CLI与HTTP服务不要同时打开同一数据文件；本例只保证单进程串行写入。
    const repository = await openRepository(resolve(process.env.TASK_FILE ?? 'data/tasks.json'))
    if (command === 'list' && args.length === 0) {
      const tasks = selectTasks(await repository.read())
      for (const task of tasks)
        console.log(
          `${task.id}\t${task.done ? '已完成' : '待完成'}\t${task.minutes}\t${task.title}`,
        )
      if (tasks.length === 0) console.log('暂无任务')
    } else if (command === 'add' && args.length === 2 && args[1].trim() !== '') {
      const state = await repository.transact((old) =>
        addTask(old, {
          title: args[0],
          minutes: Number(args[1]),
          tags: [],
          done: false,
        }),
      )
      console.log(`已添加任务：${state.tasks.at(-1).id}`)
    } else if (
      ['done', 'delete'].includes(command) &&
      args.length === 1 &&
      /^[1-9]\d*$/.test(args[0])
    ) {
      const id = Number(args[0])
      if (!Number.isSafeInteger(id)) throw new Error('ID超出安全整数范围')
      await repository.transact((old) =>
        command === 'done' ? editTask(old, id, { done: true }) : removeTask(old, id),
      )
      console.log(command === 'done' ? '已完成任务' : '已删除任务')
    } else {
      throw new Error(help)
    }
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
```

这是同一业务核心的终端入口。先停止HTTP服务再用CLI访问同一文件，避免多进程覆盖。新增输出的ID以实际结果为准，不能假定永远从1开始。

命令行检查：

```powershell
node cli.mjs add '理解闭包' 25
node cli.mjs list
node cli.mjs done 1
node cli.mjs delete 1
```

在新文件中，依次会得到“已添加任务：1”、任务列表、完成提示与删除提示；
已有数据时请使用新增返回的实际ID。标题中空格需要shell引号，不属于实际标题的引号不会交给Node。

### 45.3 文件仓储、HTTP与服务生命周期

写操作在同一个仓储实例内排队：每次从最新快照计算，验证后写同目录临时文件、sync、关闭并rename。
替换成功才提交内存状态；写失败交回调用者，队列仍可处理后续操作。
这减少半写风险，但不提供多进程锁、断电后的目录持久性或跨设备同步保证。

示例 **C45E05**，文件 `server/task-repository.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
import { mkdir, open, readFile, rename, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { emptyStore, validateStore } from '../shared/task-core.mjs'

async function writeSnapshot(file, state) {
  await mkdir(dirname(file), { recursive: true })
  const temporary = `${file}.${randomUUID()}.tmp`
  let handle
  try {
    handle = await open(temporary, 'wx')
    await handle.writeFile(`${JSON.stringify(state, null, 2)}\n`, 'utf8')
    await handle.sync()
    await handle.close()
    handle = undefined
    // 临时文件和目标在同一目录；替换成功后才提交内存状态。
    await rename(temporary, file)
  } finally {
    await handle?.close()
    await rm(temporary, { force: true })
  }
}

export async function openRepository(file, { write = writeSnapshot } = {}) {
  const absolute = resolve(file)
  let state
  try {
    state = validateStore(JSON.parse(await readFile(absolute, 'utf8')))
  } catch (error) {
    if (error.code === 'ENOENT') state = emptyStore()
    else
      throw new Error('任务文件无法读取或内容无效；请保留原文件并修复后重试', {
        cause: error,
      })
  }
  let tail = Promise.resolve()
  return {
    async read() {
      await tail
      // 调用者不能越过仓储接口修改内部状态。
      return structuredClone(state)
    },
    transact(change) {
      const operation = tail.then(async () => {
        const next = validateStore(change(structuredClone(state)))
        await write(absolute, next)
        state = next
        return structuredClone(state)
      })
      // 一次保存失败不使以后所有操作永久失败；失败仍交给本次调用者处理。
      tail = operation.catch(() => {})
      return operation
    },
  }
}
```

read返回结构化克隆，调用者不能越过接口直接修改内部状态。transact失败时旧state保持，catch只用于恢复队列，不吞掉本次调用的拒绝。

示例 **C45E06**，文件 `server/http-app.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import {
  InputError,
  addTask,
  editTask,
  removeTask,
  selectTasks,
  summarize,
  validateStore,
} from '../shared/task-core.mjs'

const staticFiles = new Map([
  ['/', ['../public/index.html', 'text/html; charset=utf-8']],
  ['/app.mjs', ['../public/app.mjs', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['../public/styles.css', 'text/css; charset=utf-8']],
  ['/shared/task-core.mjs', ['../shared/task-core.mjs', 'text/javascript; charset=utf-8']],
])

function methodNotAllowed(response, methods) {
  response.setHeader('Allow', methods.join(', '))
  throw new InputError('此资源不支持该请求方法', 405)
}

function json(response, status, value) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(value))
}

async function readJson(request) {
  if (request.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
    throw new InputError('请求体需要application/json', 415)
  }
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size <= 4194304) chunks.push(chunk)
  }
  if (size > 4194304) throw new InputError('请求体超过4 MiB上限', 413)
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new InputError('请求体不是合法JSON')
  }
}

export function createTaskServer(repository) {
  const server = createServer((request, response) => {
    void handle(request, response).catch((error) => {
      if (response.headersSent) return response.destroy()
      const status = error instanceof InputError ? error.status : 500
      const message =
        status === 500 ? '保存或读取失败，请稍后重试；旧数据未被主动清空' : error.message
      json(response, status, { error: message })
    })
  })
  server.requestTimeout = 10000
  server.headersTimeout = 5000

  async function handle(request, response) {
    const port = server.address().port
    const origins = [`http://127.0.0.1:${port}`, `http://localhost:${port}`]
    const origin = `http://${request.headers.host}`
    if (!origins.includes(origin)) throw new InputError('Host不在本机允许范围', 403)
    if (request.headers.origin && !origins.includes(request.headers.origin)) {
      throw new InputError('拒绝来自其他来源的请求', 403)
    }
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    )
    const url = new URL(request.url, origin)
    const method = request.method
    if (url.pathname === '/favicon.ico' && method === 'GET') {
      response.writeHead(204)
      return response.end()
    }

    if (url.pathname === '/api/tasks' && method === 'GET') {
      const state = await repository.read()
      const tasks = selectTasks(state, {
        query: url.searchParams.get('q') ?? '',
        status: url.searchParams.get('status') ?? 'all',
        sort: url.searchParams.get('sort') ?? 'id',
      })
      return json(response, 200, { tasks, summary: summarize(tasks) })
    }
    if (url.pathname === '/api/store' && method === 'GET') {
      return json(response, 200, await repository.read())
    }
    if (url.pathname === '/api/tasks' && method === 'POST') {
      const fields = await readJson(request)
      const state = await repository.transact((old) => addTask(old, fields))
      return json(response, 201, state.tasks.at(-1))
    }
    if (url.pathname === '/api/store' && method === 'PUT') {
      const state = validateStore(await readJson(request))
      await repository.transact(() => state)
      return json(response, 200, { imported: state.tasks.length })
    }
    const matched = /^\/api\/tasks\/([1-9]\d*)$/.exec(url.pathname)
    if (matched) {
      const id = Number(matched[1])
      if (!Number.isSafeInteger(id)) throw new InputError('任务ID超出安全整数范围')
      if (method === 'PATCH') {
        const patch = await readJson(request)
        const state = await repository.transact((old) => editTask(old, id, patch))
        return json(
          response,
          200,
          state.tasks.find((task) => task.id === id),
        )
      }
      if (method === 'DELETE') {
        await repository.transact((old) => removeTask(old, id))
        response.writeHead(204)
        return response.end()
      }
      return methodNotAllowed(response, ['PATCH', 'DELETE'])
    }
    if (url.pathname.startsWith('/api/')) {
      const allowed =
        url.pathname === '/api/tasks'
          ? ['GET', 'POST']
          : url.pathname === '/api/store'
            ? ['GET', 'PUT']
            : null
      if (allowed) return methodNotAllowed(response, allowed)
      throw new InputError('接口不存在', 404)
    }
    const resource = staticFiles.get(url.pathname)
    if (!resource) throw new InputError('页面或文件不存在', 404)
    if (method !== 'GET' && method !== 'HEAD') return methodNotAllowed(response, ['GET', 'HEAD'])
    const content = await readFile(new URL(resource[0], import.meta.url))
    response.writeHead(200, { 'Content-Type': resource[1], 'Cache-Control': 'no-store' })
    response.end(method === 'HEAD' ? undefined : content)
  }
  return server
}
```

请求体上限4 MiB，静态资源用白名单映射，设置超时和内容类型。405附带该资源的Allow方法表；不要只检查状态码。Host/Origin限制减少本机浏览器跨源访问风险，不等于完整认证。协议依据：[HTTP Semantics：405](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.5.6)。

示例 **C45E07**，文件 `server/main.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
import { resolve } from 'node:path'
import { openRepository } from './task-repository.mjs'
import { createTaskServer } from './http-app.mjs'

const port = Number(process.env.PORT ?? 3210)
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT必须为0至65535的整数')
const file = resolve(process.env.TASK_FILE ?? 'data/tasks.json')
const repository = await openRepository(file)
const server = createTaskServer(repository)
server.on('error', (error) => {
  console.error(`服务启动失败：${error.code ?? error.message}`)
  process.exitCode = 1
})
server.listen(port, '127.0.0.1', () => {
  console.log(`学习任务管理器：http://127.0.0.1:${server.address().port}`)
  console.log(`任务文件：${file}`)
})
// close停止接收新请求，并等待已建立连接上的请求结束。
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () =>
    server.close((error) => {
      if (error) process.exitCode = 1
    }),
  )
}
```

启动前加载仓储，损坏文件导致明确失败；只绑定127.0.0.1。关闭时停止接收新请求并等待已有请求结束，不用`process.exit`强行切断写入。

#### 45.3.1 先单独跑通后端链路

先保存45.2—45.3给出的shared与server文件。暂不操作浏览器，运行下面入口依次检查新增、完成、方法失败和重新读取文件。它使用自己创建的临时目录与系统分配端口，退出时关闭服务再清理，不碰真实任务库。

示例 **C45E08**，目录 `js-study/examples/ch45/C45E08/`，环境：Node.js。文件 `demo.mjs`：

```javascript
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import { openRepository } from '../../../projects/task-manager/server/task-repository.mjs'
import { createTaskServer } from '../../../projects/task-manager/server/http-app.mjs'
const dir = await mkdtemp(join(tmpdir(), 'js-task-walkthrough-'))
const file = join(dir, 'tasks.json')
const repository = await openRepository(file)
const server = createTaskServer(repository)
try {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}`
  const added = await fetch(base + '/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '后端链路', minutes: 0, tags: [], done: false }),
  })
  const task = await added.json()
  console.log('新增', added.status, task.id)
  const edited = await fetch(base + `/api/tasks/${task.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: '{"done":true}',
  })
  console.log('完成', (await edited.json()).done)
  const rejected = await fetch(base + `/api/tasks/${task.id}`, { method: 'POST' })
  console.log('方法', rejected.status, rejected.headers.get('allow'))
  await rejected.text()
  const reopened = await openRepository(file)
  const restored = await reopened.read()
  console.log('恢复', restored.tasks.length, restored.tasks[0].done)
} finally {
  if (server.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
      server.closeAllConnections()
    })
  }
  await rm(dir, { recursive: true, force: true })
}
```

本例明确复用本章完整项目文件，按前言的目录关系保存。运行`node demo.mjs`应输出：

```text
新增 201 1
完成 true
方法 405 PATCH, DELETE
恢复 1 true
```

逐步断点：请求体先到readJson；字段交给addTask；transact从最新状态计算并保存；成功后HTTP返回；另一个仓储只读取已写文件以检查恢复。若新增失败，先查状态与正文，不跳到页面CSS排错。先让这条链路成立，再接下一节的浏览器入口。

#### 45.3.2 保存成功与失败的状态顺序

```text
HTTP/CLI提交修改函数 → 排队等待旧操作 → 从最新state计算next → validateStore
                                                           │
                                     写临时文件 → sync/close → rename
                                                           │
                           失败：原state保留 ←──────────────┤
                           成功：state = next，返回独立快照 ┘
```

队列处理的是整次读改写，不只把rename排队。read等待队列后返回克隆，避免界面越过仓储修改内部对象；失败交给当前调用者，但恢复后的tail允许下一项继续。该设计只覆盖一个仓储实例，不能推断两个独立进程安全共享同一文件。

### 45.4 浏览器界面、请求和状态

表单读取后先做同一套字段校验，保存期间限制重复操作。请求查询有取消与序号保护，
防止旧响应覆盖新筛选。编辑保留任务原完成状态，改变筛选不会误把隐藏任务重置为未完成。
用户标题通过textContent渲染；导入先验证和预览，再由独立按钮确认替换。

示例 **C45E09**，文件 `public/index.html`，完整项目目录 `js-study/projects/task-manager/`。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>学习任务管理器</title>
    <link rel="stylesheet" href="/styles.css" />
    <script type="module" src="/app.mjs"></script>
  </head>
  <body>
    <main class="workspace">
      <header class="page-header">
        <h1>学习任务管理器</h1>
        <p>把下一步写清楚，完成后再向前。</p>
      </header>
      <p id="message" class="message" role="status" aria-live="polite">正在读取任务……</p>
      <section class="editor" aria-labelledby="editor-heading">
        <h2 id="editor-heading">添加任务</h2>
        <form id="task-form">
          <div class="field field-title">
            <label for="title">任务标题</label>
            <input id="title" name="title" required maxlength="200" autocomplete="off" />
          </div>
          <div class="field">
            <label for="minutes">预计分钟数</label>
            <input
              id="minutes"
              name="minutes"
              type="number"
              min="0"
              max="1440"
              step="1"
              value="25"
              required
            />
          </div>
          <div class="field field-title">
            <label for="tags">标签，用中文或英文逗号分隔</label>
            <input id="tags" name="tags" autocomplete="off" />
          </div>
          <div class="form-actions">
            <button id="save" type="submit" data-mutate>添加任务</button>
            <button id="cancel-edit" type="button" class="secondary" hidden>取消编辑</button>
          </div>
        </form>
      </section>
      <section aria-labelledby="list-heading">
        <div class="section-heading">
          <h2 id="list-heading">任务清单</h2>
          <p id="summary"></p>
        </div>
        <form id="filters" class="filters" role="search">
          <div class="field field-title">
            <label for="query">搜索标题或标签</label><input id="query" name="q" type="search" />
          </div>
          <div class="field">
            <label for="status">完成状态</label
            ><select id="status">
              <option value="all">全部</option>
              <option value="open">待完成</option>
              <option value="done">已完成</option>
            </select>
          </div>
          <div class="field">
            <label for="sort">排序</label
            ><select id="sort">
              <option value="id">添加顺序</option>
              <option value="title">标题</option>
              <option value="minutes">预计分钟数</option>
            </select>
          </div>
          <button type="submit" class="secondary">查询</button>
        </form>
        <p id="empty" class="empty" hidden>当前没有符合条件的任务。可以添加任务或调整筛选。</p>
        <ul id="tasks" class="task-list"></ul>
      </section>
      <section class="data-tools" aria-labelledby="data-heading">
        <h2 id="data-heading">保存与交换</h2>
        <p>操作成功后由本机服务保存。导入会整体替换现有任务，请先导出备份。</p>
        <div class="tool-actions">
          <button id="export" type="button" class="secondary">导出 JSON</button>
          <label for="import-file">选择 JSON 文件（最多4 MiB）</label>
          <input id="import-file" type="file" accept=".json,application/json" data-mutate />
        </div>
        <div id="import-preview" class="import-preview" hidden>
          <p id="import-description"></p>
          <button id="confirm-import" type="button" class="danger" data-mutate>
            确认替换现有任务
          </button>
          <button id="cancel-import" type="button" class="secondary">取消导入</button>
        </div>
      </section>
      <footer>本机单用户教学项目 · Node.js 与浏览器共享 JavaScript 业务规则</footer>
    </main>
  </body>
</html>
```

原生表单、label、语义区块和状态消息让页面可用键盘操作。源码无需外部字体、图片或CDN。

示例 **C45E10**，文件 `public/styles.css`，完整项目目录 `js-study/projects/task-manager/`。

```css
/* 使用普通表单和列表，视觉层不改变教学代码的职责。 */
:root {
  color-scheme: light;
  font:
    16px/1.6 system-ui,
    sans-serif;
  color: #172d38;
  background: #f3f5f4;
  accent-color: #205c4a;
}
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
[hidden] {
  display: none !important;
}
::selection {
  background: #d2e9dd;
  color: #172d38;
}
.workspace {
  width: min(100% - 32px, 1000px);
  margin: 40px auto;
  padding: 36px;
  background: #fff;
}
.page-header {
  border-bottom: 1px solid #c9d4d1;
  padding-bottom: 24px;
}
h1 {
  margin: 0 0 8px;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  line-height: 1.25;
}
h2 {
  margin: 0 0 18px;
  font-size: 1.25rem;
}
p {
  margin: 0 0 12px;
}
.page-header p,
footer {
  color: #52656b;
}
section {
  margin-top: 36px;
}
.message {
  min-height: 2.5em;
  margin: 20px 0 0;
  padding: 8px 12px;
  background: #edf4f0;
}
.message[data-kind='error'] {
  color: #8e2323;
  background: #fff0ed;
}
#task-form {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 18px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-size: 0.9rem;
  font-weight: 600;
}
input,
select,
button {
  font: inherit;
}
input,
select {
  width: 100%;
  padding: 9px 10px;
  color: #172d38;
  background: #fff;
  border: 1px solid #82958f;
  border-radius: 4px;
  caret-color: #205c4a;
}
button {
  min-height: 44px;
  padding: 8px 16px;
  border: 1px solid #205c4a;
  border-radius: 4px;
  color: #fff;
  background: #205c4a;
  cursor: pointer;
}
button:hover {
  background: #153f33;
}
button.secondary {
  color: #234d40;
  background: #fff;
}
button.secondary:hover {
  background: #edf4f0;
}
button.danger {
  color: #8e2323;
  border-color: #ab5c54;
  background: #fff;
}
button.danger:hover {
  background: #fff0ed;
}
button:disabled,
input:disabled {
  opacity: 0.6;
  cursor: wait;
}
:focus-visible {
  outline: 3px solid #246eaa;
  outline-offset: 3px;
}
.form-actions,
.tool-actions {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 12px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}
#summary {
  color: #36584d;
  font-variant-numeric: tabular-nums;
}
.filters {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 130px 150px auto;
  align-items: end;
  gap: 12px;
}
.task-list {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}
.task-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid #d7dfdc;
}
.task-check {
  display: flex;
  align-items: center;
  min-height: 44px;
}
.task-check input {
  width: 20px;
  height: 20px;
}
.task-copy {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.task-copy strong {
  display: block;
  font-weight: 650;
}
.task-row.is-done strong {
  text-decoration: line-through;
  color: #52656b;
}
.task-meta {
  color: #52656b;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}
.task-actions {
  display: flex;
  gap: 12px;
  margin-left: 12px;
}
.empty {
  margin-top: 24px;
  padding: 24px 0;
  color: #52656b;
}
.data-tools {
  border-top: 1px solid #c9d4d1;
  padding-top: 28px;
}
.tool-actions input {
  width: auto;
  max-width: 100%;
}
.import-preview {
  margin-top: 20px;
  padding: 16px;
  background: #fff5e9;
}
footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #d7dfdc;
  font-size: 0.875rem;
}
@media (max-width: 700px) {
  .workspace {
    width: 100%;
    margin: 0;
    padding: 24px 18px;
  }
  #task-form,
  .filters {
    grid-template-columns: 1fr;
  }
  .section-heading {
    display: block;
  }
  .task-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .task-actions {
    width: 100%;
    margin-left: 34px;
  }
}
```

样式按任务层级安排间距，窄屏改为单列；完成状态不只靠颜色，焦点有可见轮廓。

#### 45.4.1 从已有页面切换到HTTP入口

第40章的DOM、表单、编辑和导入交互保留；主要变化是api调用Fetch、保存职责移到服务端。以下按一次“添加任务”串起完整入口：

1. submit阻止默认导航，读取表单，normalizeFields先帮助用户发现错误。
2. mutate设置busy并显示保存状态；api把字段序列化成JSON，等待HTTP响应。
3. 服务端重复校验并在仓储保存；客户端只在响应成功后清理编辑器。
4. refresh读取当前筛选结果；render创建节点，用户文本只交给textContent。
5. 保存失败则显示错误并重新查询，避免把“请求结束”误当“保存成功”。

接着分别检查：编辑时只PATCH表单负责的字段，完成状态不因旧表单快照被重置；快速查询靠AbortController与序号避免旧结果覆盖；导入候选在确认前不PUT；导出获取完整快照而非当前筛选列表。每个分支都可以在同一个已保存完整入口中设断点观察，不需要先背下全部代码。

#### 45.4.2 完整app.mjs

示例 **C45E11**，文件 `public/app.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
import { normalizeFields, validateStore } from '/shared/task-core.mjs'

const form = document.querySelector('#task-form')
const title = document.querySelector('#title')
const minutes = document.querySelector('#minutes')
const tags = document.querySelector('#tags')
const list = document.querySelector('#tasks')
const message = document.querySelector('#message')
const query = document.querySelector('#query')
const status = document.querySelector('#status')
const sort = document.querySelector('#sort')
const preview = document.querySelector('#import-preview')
let editingId = null
let editingTask = null
let shownTasks = []
let candidate = null
let importSequence = 0
let busy = false
let latestRequest = 0
let readingController

function say(text, isError = false) {
  message.textContent = text
  message.dataset.kind = isError ? 'error' : 'success'
}

async function api(path, { body, ...options } = {}) {
  const response = await fetch(path, {
    ...options,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (response.status === 204) return null
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error ?? `请求失败：${response.status}`)
  return payload
}

function setBusy(value) {
  busy = value
  for (const control of document.querySelectorAll(
    '[data-mutate], #task-form input, #cancel-edit',
  )) {
    control.disabled = value
  }
}

function button(text, action, id, className = 'secondary') {
  const element = document.createElement('button')
  element.type = 'button'
  element.textContent = text
  element.className = className
  element.dataset.action = action
  element.dataset.id = String(id)
  element.dataset.mutate = ''
  element.disabled = busy
  return element
}

function render(tasks, summary) {
  shownTasks = tasks
  const nodes = tasks.map((task) => {
    const row = document.createElement('li')
    row.className = `task-row${task.done ? ' is-done' : ''}`
    const label = document.createElement('label')
    label.className = 'task-check'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = task.done
    checkbox.dataset.action = 'toggle'
    checkbox.dataset.id = String(task.id)
    checkbox.dataset.mutate = ''
    checkbox.disabled = busy
    checkbox.setAttribute('aria-label', `完成任务：${task.title}`)
    label.append(checkbox)
    const copy = document.createElement('div')
    copy.className = 'task-copy'
    const heading = document.createElement('strong')
    // 用户输入只作为文本，不能变成HTML标签执行。
    heading.textContent = task.title
    const meta = document.createElement('span')
    meta.className = 'task-meta'
    meta.textContent = `#${task.id} · ${task.minutes}分钟 · ${task.tags.join('、') || '无标签'}`
    copy.append(heading, meta)
    const actions = document.createElement('div')
    actions.className = 'task-actions'
    actions.append(button('编辑', 'edit', task.id), button('删除', 'delete', task.id, 'danger'))
    row.append(label, copy, actions)
    return row
  })
  list.replaceChildren(...nodes)
  document.querySelector('#empty').hidden = tasks.length !== 0
  document.querySelector('#summary').textContent =
    `${summary.total}项 · 已完成${summary.done}项 · 共${summary.minutes}分钟`
}

async function refresh() {
  const sequence = ++latestRequest
  readingController?.abort()
  readingController = new AbortController()
  const parameters = new URLSearchParams({
    q: query.value,
    status: status.value,
    sort: sort.value,
  })
  history.replaceState(null, '', `?${parameters}`)
  try {
    const payload = await api(`/api/tasks?${parameters}`, {
      signal: readingController.signal,
    })
    if (sequence === latestRequest) render(payload.tasks, payload.summary)
  } catch (error) {
    if (error.name !== 'AbortError' && sequence === latestRequest) say(error.message, true)
  }
}

function clearEditor() {
  editingId = null
  editingTask = null
  form.reset()
  document.querySelector('#editor-heading').textContent = '添加任务'
  document.querySelector('#save').textContent = '添加任务'
  document.querySelector('#cancel-edit').hidden = true
}

async function mutate(work, success) {
  if (busy) return
  setBusy(true)
  say('正在保存……')
  try {
    await work()
    say(success)
    await refresh()
  } catch (error) {
    say(error.message, true)
    await refresh()
  } finally {
    setBusy(false)
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  if (busy) return
  try {
    const old = editingTask
    const fields = normalizeFields({
      title: title.value,
      minutes: Number(minutes.value),
      tags: tags.value
        .split(/[,，]/u)
        .map((tag) => tag.trim())
        .filter(Boolean),
      done: old?.done ?? false,
    })
    const id = editingId
    void mutate(
      async () => {
        await api(id === null ? '/api/tasks' : `/api/tasks/${id}`, {
          method: id === null ? 'POST' : 'PATCH',
          // 编辑只提交表单管理的字段，保留期间可能改变的完成状态。
          body:
            id === null
              ? fields
              : { title: fields.title, minutes: fields.minutes, tags: fields.tags },
        })
        clearEditor()
      },
      id === null ? '已添加任务' : '已保存修改',
    ).finally(() => title.focus())
  } catch (error) {
    say(error.message, true)
  }
})

document.querySelector('#cancel-edit').addEventListener('click', clearEditor)
list.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]')
  if (!control || busy) return
  const id = Number(control.dataset.id)
  const task = shownTasks.find((item) => item.id === id)
  if (!task) return
  if (control.dataset.action === 'edit') {
    editingId = id
    editingTask = structuredClone(task)
    title.value = task.title
    minutes.value = String(task.minutes)
    tags.value = task.tags.join('，')
    document.querySelector('#editor-heading').textContent = `编辑任务 #${id}`
    document.querySelector('#save').textContent = '保存修改'
    document.querySelector('#cancel-edit').hidden = false
    title.focus()
  } else if (control.dataset.action === 'delete') {
    void mutate(async () => {
      await api(`/api/tasks/${id}`, { method: 'DELETE' })
      if (editingId === id) clearEditor()
    }, '已删除任务')
  } else if (control.dataset.action === 'toggle') {
    void mutate(
      () =>
        api(`/api/tasks/${id}`, {
          method: 'PATCH',
          body: { done: !task.done },
        }),
      task.done ? '已恢复为待完成' : '已完成任务',
    )
  }
})

document.querySelector('#filters').addEventListener('submit', (event) => {
  event.preventDefault()
  void refresh()
})
for (const select of [status, sort]) select.addEventListener('change', () => void refresh())

document.querySelector('#export').addEventListener('click', async () => {
  try {
    const state = await api('/api/store')
    const objectUrl = URL.createObjectURL(
      new Blob([JSON.stringify(state, null, 2)], {
        type: 'application/json',
      }),
    )
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = 'learning-tasks.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    say('已生成JSON下载文件')
  } catch (error) {
    say(error.message, true)
  }
})

document.querySelector('#import-file').addEventListener('change', async (event) => {
  const sequence = ++importSequence
  candidate = null
  preview.hidden = true
  const file = event.target.files[0]
  if (!file) return
  try {
    if (file.size > 4 * 1024 * 1024) throw new Error('文件超过4 MiB上限')
    const parsed = validateStore(JSON.parse(await file.text()))
    if (sequence !== importSequence) return
    candidate = parsed
    document.querySelector('#import-description').textContent =
      `文件含${candidate.tasks.length}项任务。确认后会整体替换现有任务。`
    preview.hidden = false
  } catch (error) {
    if (sequence === importSequence) say(`导入未执行：${error.message}`, true)
  }
})

function clearImport() {
  importSequence += 1
  candidate = null
  preview.hidden = true
  document.querySelector('#import-file').value = ''
}
document.querySelector('#cancel-import').addEventListener('click', clearImport)
document.querySelector('#confirm-import').addEventListener('click', () => {
  if (!candidate) return
  const selected = candidate
  void mutate(async () => {
    await api('/api/store', { method: 'PUT', body: selected })
    clearEditor()
    clearImport()
  }, '已导入并保存任务')
})

const initial = new URL(location.href).searchParams
query.value = initial.get('q') ?? ''
status.value = ['all', 'open', 'done'].includes(initial.get('status'))
  ? initial.get('status')
  : 'all'
sort.value = ['id', 'title', 'minutes'].includes(initial.get('sort')) ? initial.get('sort') : 'id'
await refresh()
if (message.textContent === '正在读取任务……') say('任务已读取；可以开始添加')
```

api处理HTTP状态与JSON，mutate控制保存生命周期，render只把数据转成节点。查询失败不应伪装为零任务；服务端失败会显示恢复提示。

### 45.5 测试、故障演练和验收

下列测试使用临时目录和系统分配端口，不修改你的真实任务库。业务测试检查非法类型、
零分钟、修改/删除、复制边界、重复ID和格式；服务测试检查恢复、请求失败、并发写入、损坏文件、
保存失败注入、静态资源边界和来源限制。

示例 **C45E12**，文件 `test/task-core.test.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  addTask,
  editTask,
  emptyStore,
  removeTask,
  selectTasks,
  summarize,
  validateStore,
} from '../shared/task-core.mjs'

const fields = { title: ' 学习闭包 ', minutes: 25, tags: ['基础', '基础'], done: false }
const instant = '2026-11-09T00:00:00.000Z'

test('新增清理标题和标签，并保留输入状态', () => {
  const old = emptyStore()
  const next = addTask(old, fields, instant)
  assert.deepEqual(old, emptyStore())
  assert.equal(next.tasks[0].title, '学习闭包')
  assert.deepEqual(next.tasks[0].tags, ['基础'])
  assert.equal(next.tasks[0].createdAt, instant)
  assert.equal(next.nextId, 2)
})

test('非法字段逐项拒绝，允许合法零分钟', () => {
  for (const patch of [
    { title: ' ' },
    { minutes: NaN },
    { minutes: Infinity },
    { minutes: '25' },
    { minutes: -1 },
    { minutes: 1.5 },
    { minutes: 1441 },
    { done: 0 },
    { tags: 'js' },
    { tags: [''] },
    { tags: [1] },
    { unknown: true },
  ])
    assert.throws(() => addTask(emptyStore(), { ...fields, ...patch }, instant))
  assert.equal(addTask(emptyStore(), { ...fields, minutes: 0 }, instant).tasks[0].minutes, 0)
})

test('修改、完成、删除和不存在ID', () => {
  const initial = addTask(emptyStore(), fields, instant)
  const edited = editTask(initial, 1, { title: '函数', done: true })
  assert.equal(initial.tasks[0].done, false)
  assert.equal(edited.tasks[0].done, true)
  assert.equal(removeTask(edited, 1).tasks.length, 0)
  assert.throws(() => editTask(initial, 99, { done: true }), /不存在/u)
  assert.throws(() => removeTask(initial, 99), /不存在/u)
  assert.throws(() => editTask(initial, 1, { id: 7 }), /未知字段/u)
})

test('过滤、排序和统计不修改原顺序', () => {
  let store = addTask(emptyStore(), fields, instant)
  store = addTask(store, { title: '测试', minutes: 10, tags: ['工程'], done: true }, instant)
  assert.deepEqual(
    selectTasks(store, { sort: 'minutes' }).map((task) => task.id),
    [2, 1],
  )
  assert.deepEqual(
    store.tasks.map((task) => task.id),
    [1, 2],
  )
  assert.equal(selectTasks(store, { query: '基础', status: 'open' }).length, 1)
  assert.deepEqual(summarize(store.tasks), { total: 2, done: 1, minutes: 35 })
  assert.deepEqual(summarize([]), { total: 0, done: 0, minutes: 0 })
  assert.throws(() => selectTasks(store, { sort: 'constructor' }))
})

test('导入拒绝损坏结构、未知版本、重复ID和非法nextId', () => {
  const valid = addTask(emptyStore(), fields, instant)
  for (const invalid of [
    null,
    [],
    { ...valid, version: 2 },
    { ...valid, nextId: 1 },
    { ...valid, tasks: [...valid.tasks, valid.tasks[0]] },
    { ...valid, tasks: [{ ...valid.tasks[0], createdAt: '昨天' }] },
    { ...valid, tasks: [{ ...valid.tasks[0], done: 'false' }] },
    JSON.parse('{"version":1,"nextId":1,"tasks":[],"__proto__":{}}'),
  ])
    assert.throws(() => validateStore(invalid))
  assert.deepEqual(validateStore(JSON.parse(JSON.stringify(valid))), valid)
})

test('删除不会复用ID，达到ID边界后停止新增', () => {
  let store = addTask(emptyStore(), fields, instant)
  store = removeTask(store, 1)
  assert.equal(addTask(store, fields, instant).tasks[0].id, 2)
  assert.throws(() =>
    addTask({ ...emptyStore(), nextId: Number.MAX_SAFE_INTEGER }, fields, instant),
  )
})
```

在项目根目录执行`node --test test/task-core.test.mjs`。应有6项测试通过；具体耗时随机器变化。

示例 **C45E13**，文件 `test/server.test.mjs`，完整项目目录 `js-study/projects/task-manager/`。

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import { openRepository } from '../server/task-repository.mjs'
import { createTaskServer } from '../server/http-app.mjs'
import { addTask } from '../shared/task-core.mjs'

const fields = { title: '模块', minutes: 30, tags: [], done: false }

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'js-manual-test-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const file = join(dir, 'tasks.json')
  const repository = await openRepository(file)
  const server = createTaskServer(repository)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
        server.closeIdleConnections()
      }),
  )
  return { dir, file, repository, url: `http://127.0.0.1:${server.address().port}` }
}

function send(url, method, body, headers = {}) {
  return fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

test('HTTP正常流程、排序、导出、修改、删除与重启恢复', async (t) => {
  const { url, file } = await fixture(t)
  assert.equal((await send(`${url}/api/tasks`, 'POST', fields)).status, 201)
  assert.equal((await send(`${url}/api/tasks/1`, 'PATCH', { done: true })).status, 200)
  const list = await (await fetch(`${url}/api/tasks?status=done`)).json()
  assert.equal(list.tasks.length, 1)
  assert.deepEqual(list.summary, { total: 1, done: 1, minutes: 30 })
  const exported = await (await fetch(`${url}/api/store`)).json()
  assert.equal(exported.nextId, 2)
  const reopened = await openRepository(file)
  assert.equal((await reopened.read()).tasks[0].done, true)
  assert.equal((await send(`${url}/api/tasks/1`, 'DELETE')).status, 204)
  assert.equal((await (await fetch(`${url}/api/tasks`)).json()).tasks.length, 0)
})

test('请求体和输入异常有明确状态，失败不会清空旧数据', async (t) => {
  const { url } = await fixture(t)
  await send(`${url}/api/tasks`, 'POST', fields)
  assert.equal((await send(`${url}/api/tasks`, 'POST', { ...fields, minutes: -1 })).status, 400)
  assert.equal((await send(`${url}/api/tasks/999`, 'PATCH', { done: true })).status, 404)
  assert.equal((await send(`${url}/api/store`, 'PUT', { version: 9 })).status, 400)
  assert.equal((await send(`${url}/api/tasks/1`, 'POST', {})).status, 405)
  assert.equal((await fetch(`${url}/api/missing`)).status, 404)
  assert.equal((await fetch(`${url}/api/tasks?sort=unknown`)).status, 400)
  const malformed = await fetch(`${url}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  })
  assert.equal(malformed.status, 400)
  const wrongType = await fetch(`${url}/api/tasks`, { method: 'POST', body: 'a' })
  assert.equal(wrongType.status, 415)
  const oversized = await fetch(`${url}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: ' '.repeat(4194305),
  })
  assert.equal(oversized.status, 413)
  assert.equal((await (await fetch(`${url}/api/tasks`)).json()).tasks.length, 1)
})

test('并发新增在仓储内排队，无重复ID或丢失更新', async (t) => {
  const { url, file } = await fixture(t)
  const responses = await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      send(`${url}/api/tasks`, 'POST', { ...fields, title: `任务${i}` }),
    ),
  )
  assert.ok(responses.every((response) => response.status === 201))
  const state = JSON.parse(await readFile(file, 'utf8'))
  assert.equal(state.tasks.length, 20)
  assert.equal(new Set(state.tasks.map((task) => task.id)).size, 20)
  assert.equal(state.nextId, 21)
})

test('损坏磁盘文件拒绝启动并保持原内容', async (t) => {
  const { dir } = await fixture(t)
  const file = join(dir, 'broken.json')
  await writeFile(file, '{broken', 'utf8')
  await assert.rejects(openRepository(file), /保留原文件/u)
  assert.equal(await readFile(file, 'utf8'), '{broken')
})

test('模拟保存失败：内存回滚，后续操作可恢复', async (t) => {
  const { dir } = await fixture(t)
  let fail = true
  const repository = await openRepository(join(dir, 'injected.json'), {
    async write(file, state) {
      if (fail) throw new Error('模拟磁盘写入失败')
      await writeFile(file, JSON.stringify(state), 'utf8')
    },
  })
  await assert.rejects(repository.transact((old) => addTask(old, fields)))
  assert.equal((await repository.read()).tasks.length, 0)
  fail = false
  assert.equal((await repository.transact((old) => addTask(old, fields))).tasks[0].id, 1)
})

test('静态资源白名单、来源限制、响应安全头与导入恢复', async (t) => {
  const { url } = await fixture(t)
  const page = await fetch(url)
  assert.equal(page.status, 200)
  assert.match(page.headers.get('content-type'), /text\/html/u)
  assert.equal(page.headers.get('x-content-type-options'), 'nosniff')
  for (const path of ['/server/main.mjs', '/data/tasks.json', '/package.json']) {
    assert.equal((await fetch(`${url}${path}`)).status, 404)
  }
  assert.equal(
    (await fetch(`${url}/api/tasks`, { headers: { Origin: 'https://other.example' } })).status,
    403,
  )
  await send(`${url}/api/tasks`, 'POST', fields)
  const exported = await (await fetch(`${url}/api/store`)).json()
  await send(`${url}/api/tasks/1`, 'DELETE')
  assert.equal((await send(`${url}/api/store`, 'PUT', exported)).status, 200)
  assert.equal((await (await fetch(`${url}/api/tasks`)).json()).tasks[0].title, '模块')
})

test('不支持的方法返回405和准确Allow，旧任务不变', async (t) => {
  const { url } = await fixture(t)
  await send(`${url}/api/tasks`, 'POST', fields)
  for (const [path, method, allow] of [
    ['/api/tasks', 'DELETE', 'GET, POST'],
    ['/api/tasks/1', 'POST', 'PATCH, DELETE'],
    ['/api/store', 'POST', 'GET, PUT'],
    ['/', 'PATCH', 'GET, HEAD'],
  ]) {
    const response = await fetch(`${url}${path}`, { method })
    assert.equal(response.status, 405)
    assert.equal(response.headers.get('allow'), allow)
    assert.match((await response.json()).error, /方法/u)
  }
  assert.equal((await (await fetch(`${url}/api/tasks`)).json()).tasks.length, 1)
})
```

在项目根目录执行`node --test test/server.test.mjs`。应有7项测试通过；整个项目`npm test`合计13项。

综合检查清单：

1. 添加标题含中文的任务，分钟数为0仍能保存；空白标题、负数和小数被拒绝。
2. 标为完成后编辑标题，完成状态保留；按状态筛选，再清除筛选能找回记录。
3. 停止并重启同一数据文件的服务，任务仍在；浏览器刷新不产生重复任务。
4. 导出JSON，删除一项，再导入预览并确认，恢复文件声明的快照。
5. 在复制出来的测试文件中制造坏JSON，启动应失败，原坏文件仍保留；不要在真实库上演练。
6. 执行自动测试，观察20个并发新增均成功且ID不重复；这只证明单仓储进程中的检查范围。
7. 停止服务后再操作页面，应显示请求失败；恢复服务后可重试，不把失败当成功。

运行时如端口占用，改PORT或停止你自己启动的旧实例，不强制终止未知程序。
此项目没有处理跨进程写锁、用户权限、公网TLS和数据库事务，不能不加设计直接用于多人公网环境。

#### 45.5.1 阶段六验收：从成功保存到失败恢复

独立完成以下顺序：在新测试数据文件添加0分钟任务；编辑标题并切换完成；导出；停止并重启服务；确认任务恢复；用错误字段请求接口；导入损坏副本；最后重新执行正常新增。每次失败都核对旧任务和nextId未被破坏。不要在真实任务库制造坏数据。

自动测试负责可重复的业务和HTTP检查，浏览器验收还要覆盖表单、焦点、筛选、导入预览与错误提示。提交个人练习前，应能独立解释三个问题：哪一层拒绝了输入、保存何时完成、为什么失败后队列还可继续。若只能复制文件运行而不能定位这些位置，回到45.3的后端入口和45.4的调用步骤重新追踪。

### 45.6 动手练习与参考答案

**先独立回答。**

1. 给“未完成分钟数”加统计。

2. 把请求体改为5 MiB。

3. 为什么失败后队列还能使用？

4. 两个独立服务指向同一文件安全吗？

**参考答案与检查。**

1. 先filter(!task.done)，再summarize，明确与当前筛选范围的关系；不要修改原任务。

2. 接口返回413，旧数据和nextId不改变。

3. tail保存的是本次operation.catch后的完成链，而调用者取得原operation，因此能观察失败且后续可继续。

4. 不安全，仓储队列只存在各自进程内；应引入进程锁或数据库事务等设计，而非简单加await。

### 45.7 本章速查

| 目标       | 入口           | 边界                   |
| :--------- | :------------- | :--------------------- |
| 网页运行   | `npm start`    | 默认3210，仅回环       |
| 自动检查   | `npm test`     | 临时目录与端口         |
| 终端操作   | `node cli.mjs` | 不与服务同时写同一文件 |
| 文件配置   | TASK_FILE      | 相对工作目录解析       |
| 恢复数据   | JSON导入确认   | 整体替换，先备份       |
| 保存一致性 | transact排队   | 单仓储实例，无多进程锁 |

本章参考：[Node.js文档](https://nodejs.org/docs/v26.13.0/api/)、[DOM Standard](https://dom.spec.whatwg.org/)、[Fetch Standard](https://fetch.spec.whatwg.org/)。

## 第46章 JavaScript与Java、Python系统对照

本章在已经理解JavaScript之后辨认迁移差异，不要求同时学三门语言。对照使用Java21和Python3.12以上常见写法，不把某语言的术语直接套到另一语言。源码文件彼此独立，先只运行JavaScript即可。

### 46.1 执行、类型与缺失值

JavaScript和Python的名字可重新关联不同类型的值；Java变量的声明类型在编译期有约束，Object变量可以关联不同子类型，但声明类型并没有随之改变。JavaScript有null和undefined，Python通常以None表达缺失，Java引用可为null。

示例 **C46E01**，目录 `js-study/examples/ch46/C46E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
let value = 1
value = '一'
console.log(typeof value)
console.log(typeof null, typeof undefined)
console.log(1 === '1')
```

文件 `demo.py`：

```python
value = 1
value = '一'
print(type(value).__name__)
print(None is None)
print(1 == '1')
```

文件 `Demo.java`：

```java
public class Demo {
  public static void main(String[] args) {
    Object value = 1;
    value = "一";
    System.out.println(value.getClass().getSimpleName());
    String text = null;
    System.out.println(text == null);
    System.out.println(1 == Integer.parseInt("1"));
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
string
object undefined
false
```

对照示例可跳过。Java按JDK21：在同目录运行javac -encoding UTF-8 --release 21 Demo.java，再运行java Demo；Python按3.12及以上：python demo.py。下面“预期输出”针对JavaScript `demo.mjs`，各语言自己的结果按其代码和下述检查说明核对。 Python应显示str、True、False；Java显示String、true、true，最后一行进行了显式解析，并非跨类型字符串比较。

JavaScript中typeof null为object是历史行为，不能据此认为null可访问属性。三种语言的数值范围、真假值、相等和转换不同：不要因为Python空列表为假，就假定JavaScript空数组也是假。Java的boolean条件不接受任意对象作为条件。

### 46.2 容器、相等与共享

JavaScript数组、Python列表和Java List都能保存多项，但类型约束、长度变化与方法返回不同。JS普通对象不是Java Map的逐字对应物，Map更接近显式映射。浅复制只新建外层是跨语言常见边界。

示例 **C46E02**，目录 `js-study/examples/ch46/C46E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const old = [{ n: 1 }]
const copy = [...old]
copy[0].n = 9
console.log(old[0].n, old === copy, old[0] === copy[0])
console.log([1, 2] === [1, 2])
```

文件 `demo.py`：

```python
old = [{'n': 1}]
copy = old.copy()
copy[0]['n'] = 9
print(old[0]['n'], old is copy, old[0] is copy[0])
print([1, 2] == [1, 2])
```

文件 `Demo.java`：

```java
import java.util.*;
public class Demo {
  public static void main(String[] args) {
    List<Map<String,Integer>> old = new ArrayList<>();
    old.add(new HashMap<>(Map.of("n", 1)));
    List<Map<String,Integer>> copy = new ArrayList<>(old);
    copy.get(0).put("n", 9);
    System.out.println(old.get(0).get("n") + " " + (old == copy) + " " + (old.get(0) == copy.get(0)));
    System.out.println(List.of(1,2).equals(List.of(1,2)));
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
9 false true
false
```

对照示例可跳过。Java按JDK21：在同目录运行javac -encoding UTF-8 --release 21 Demo.java，再运行java Demo；Python按3.12及以上：python demo.py。下面“预期输出”针对JavaScript `demo.mjs`，各语言自己的结果按其代码和下述检查说明核对。 Python为9 False True及True；Java为9 false true及true。JS最后为false，数组严格相等比较身份；其他两例使用各自内容相等操作。

不要说“全部容器相等都比较内容”，也不要说“三种语言复制都完全一样”。Java equals取决于类型契约，Python自定义类型可改变**eq**，JS的Map/Set另有相等规则。参数传递还应区分修改共享对象与重绑形参，第10章已用JS观察。

### 46.3 函数、默认参数和作用域

JS默认表达式在调用需要时求值；Python默认参数常在def执行时求值；Java没有同样的默认实参语法，常通过重载或配置对象表达。闭包与循环绑定也不同，不能机械翻译短写法。

示例 **C46E03**，目录 `js-study/examples/ch46/C46E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function collect(item, values = []) {
  values.push(item)
  return values
}
console.log(JSON.stringify(collect('A')))
console.log(JSON.stringify(collect('B')))
const callbacks = []
for (let i = 0; i < 3; i += 1) callbacks.push(() => i)
console.log(callbacks.map((fn) => fn()).join(','))
```

文件 `demo.py`：

```python
def bad(item, values=[]):
    values.append(item)
    return values
def good(item, values=None):
    if values is None:
        values = []
    values.append(item)
    return values
print(bad('A'))
print(bad('B'))
print(good('C'))
print([callback() for callback in [lambda: i for i in range(3)]])
```

文件 `Demo.java`：

```java
import java.util.*;
import java.util.function.IntSupplier;
public class Demo {
  static List<String> collect(String item) { return collect(item, new ArrayList<>()); }
  static List<String> collect(String item, List<String> values) { values.add(item); return values; }
  public static void main(String[] args) {
    System.out.println(collect("A"));
    System.out.println(collect("B"));
    List<IntSupplier> callbacks = new ArrayList<>();
    for (int i=0; i<3; i++) { final int copy=i; callbacks.add(() -> copy); }
    for (IntSupplier callback: callbacks) System.out.print(callback.getAsInt());
    System.out.println();
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
["A"]
["B"]
0,1,2
```

对照示例可跳过。Java按JDK21：在同目录运行javac -encoding UTF-8 --release 21 Demo.java，再运行java Demo；Python按3.12及以上：python demo.py。下面“预期输出”针对JavaScript `demo.mjs`，各语言自己的结果按其代码和下述检查说明核对。 Python故意展示bad第二次变成含A、B，good不共享默认列表，闭包结果为[2,2,2]；Java重载各次新建列表，回调显示012。

Python坏例子明确是错误设计演示，不要复制进正式项目。Java捕获的局部变量需满足final或有效final约束，因此显式建立copy。JS let每轮绑定是该循环的语言规则，而不是所有语言for的普遍行为。

### 46.4 对象、模块和错误

JS原型链、Java类/接口体系和Python类型模型有不同约束。JavaScript的class不引入Java式静态类型系统，Python实例方法的self也不是JS所有调用中this的同一规则。模块是组织接口与执行的单位，不是文件名相同就自动兼容。

示例 **C46E04**，目录 `js-study/examples/ch46/C46E04/`，环境：Node.js。

文件 `task.mjs`：

```javascript
export class Task {
  constructor(title) {
    if (typeof title !== 'string' || !title.trim()) throw new Error('标题无效')
    this.title = title.trim()
  }
  label() {
    return this.title
  }
}
```

文件 `main.mjs`：

```javascript
import { Task } from './task.mjs'
console.log(new Task(' 阅读 ').label())
try {
  new Task(' ')
} catch (error) {
  console.log(error.message)
}
```

文件 `task_model.py`：

```python
class Task:
    def __init__(self, title):
        if not isinstance(title, str) or not title.strip():
            raise ValueError('标题无效')
        self.title = title.strip()
    def label(self):
        return self.title
```

文件 `demo.py`：

```python
from task_model import Task
print(Task(' 阅读 ').label())
try:
    Task(' ')
except ValueError as error:
    print(error)
```

文件 `Demo.java`：

```java
public class Demo {
  static class Task {
    private final String title;
    Task(String title) { if (title == null || title.isBlank()) throw new IllegalArgumentException("标题无效"); this.title=title.strip(); }
    String label() { return title; }
  }
  public static void main(String[] args) {
    System.out.println(new Task(" 阅读 ").label());
    try { new Task(" "); } catch (IllegalArgumentException error) { System.out.println(error.getMessage()); }
  }
}
```

在本例目录执行：

```powershell
node main.mjs
```

预期输出：

```text
阅读
标题无效
```

对照示例可跳过。Java按JDK21：在同目录运行javac -encoding UTF-8 --release 21 Demo.java，再运行java Demo；Python按3.12及以上：python demo.py。下面“预期输出”针对JavaScript `main.mjs`，各语言自己的结果按其代码和下述检查说明核对。 三种入口均显示阅读、标题无效。Java这里用嵌套类演示契约，不把它称为Python或JS的等价模块系统。

异常分类、检查型异常、资源清理语法、导入执行时机也不同。先明确各自的契约，再对照拼写；本章Java/Python片段只帮助迁移，不替代对应语言完整手册。

### 46.5 异步启动和资源模型

JS async调用会开始推进并返回Promise；Python async def常先产生协程对象，需await或调度；Java Future/CompletableFuture表示另一套任务结果机制。它们都能交付未来结果，但启动、取消、线程与错误边界不能等同。

示例 **C46E05**，目录 `js-study/examples/ch46/C46E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
async function work() {
  console.log('开始')
  await 0
  console.log('恢复')
  return 7
}
console.log('调用前')
const result = work()
console.log('调用后')
console.log(await result)
```

文件 `demo.py`：

```python
import asyncio
async def work():
    print('开始')
    await asyncio.sleep(0)
    print('恢复')
    return 7
async def main():
    print('调用前')
    result = work()
    print('调用后')
    print(await result)
asyncio.run(main())
```

文件 `Demo.java`：

```java
import java.util.concurrent.*;
public class Demo {
  public static void main(String[] args) throws Exception {
    CompletableFuture<Integer> result = CompletableFuture.completedFuture(3).thenApply(n -> n + 4);
    System.out.println(result.get());
    System.out.println("此例不宣称创建了新线程");
  }
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
调用前
开始
调用后
恢复
7
```

对照示例可跳过。Java按JDK21：在同目录运行javac -encoding UTF-8 --release 21 Demo.java，再运行java Demo；Python按3.12及以上：python demo.py。下面“预期输出”针对JavaScript `demo.mjs`，各语言自己的结果按其代码和下述检查说明核对。 Python先显示调用前、调用后，进入await后才显示开始、恢复、7；JS开始出现在调用后之前。Java显示7和说明文字，thenApply不自动代表新线程。

Java阻塞get会等待线程，JS await让出当前async流程，Python await推进协程协作；资源管理必须按各自机制收尾。不要把“异步”当成任何CPU工作都会自动并行的承诺。

### 46.6 动手练习与参考答案

**先独立回答。**

1. Python默认列表共享的经验能套到JS默认[]吗？

2. JS数组===为什么与Python列表==结果不同？

3. Java CompletableFuture.thenApply一定另开线程吗？

**参考答案与检查。**

1. 不能，两者求值时机不同。

2. JS该操作比较身份，Python列表通常逐项比较内容。

3. 不一定，需看具体调度接口和完成时机。

### 46.7 本章速查

| 场景     | 做法与返回         | 易错边界                 |
| :------- | :----------------- | :----------------------- |
| 默认参数 | JS调用需要时求值   | 不同于Python常见默认求值 |
| 接收者   | JS看调用方式       | self和this勿机械替换     |
| 数组相等 | JS严格相等看身份   | 内容比较需明确规则       |
| 异步     | 分别观察启动与调度 | 不能统一叫线程           |

本章参考：[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)、[Python官方教程](https://docs.python.org/3/tutorial/)、[Python asyncio任务文档](https://docs.python.org/3/library/asyncio-task.html)、[Java 21：CompletableFuture](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html)。

## 第47章 分层练习、典型案例与参考答案

练习按基础、数据、机制、应用、算法分层。先自己写预期和实现，再阅读答案，最后更换边界输入。算法为选修，不能代替程序组织、错误处理和可运行项目；每题给出能核对的结果。

### 47.1 基础：输入、范围和函数

题目：把分钟文本转换为0—1440整数，拒绝空白、负数、小数、非数值和无穷。先区分空文本，再转换，再检查；不能让Number空文本得到0从而错误通过。

示例 **C47E01**，目录 `js-study/examples/ch47/C47E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function parseMinutes(text) {
  if (typeof text !== 'string' || text.trim() === '') return null
  const value = Number(text)
  return Number.isInteger(value) && value >= 0 && value <= 1440 ? value : null
}
for (const text of ['0', '25', ' ', '-1', '1.5', 'NaN', 'Infinity']) {
  console.log(JSON.stringify(text), parseMinutes(text))
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
"0" 0
"25" 25
" " null
"-1" null
"1.5" null
"NaN" null
"Infinity" null
```

答案接受0和25，其余返回null。这里选择“错误值”接口；若改为异常，应连调用者一起调整。Number也接受某些进制格式，若题目只允许十进制数字文本，再增加正则语法规则，不把范围校验当作格式校验。

### 47.2 数据：去重、分组与稳定排序

题目：对任务按标签筛选，标题排序并统计分钟，保留输入数据。空结果统计为0。重复标签只算一次成员关系，不能因为一条任务有两个相同标签而重复计分钟。

示例 **C47E02**，目录 `js-study/examples/ch47/C47E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const tasks = [
  { id: 1, title: 'B', minutes: 20, tags: ['JS', 'JS'] },
  { id: 2, title: 'A', minutes: 10, tags: ['JS'] },
  { id: 3, title: 'C', minutes: 30, tags: ['其他'] },
]
function report(tag) {
  const selected = tasks
    .filter((task) => new Set(task.tags).has(tag))
    .toSorted((a, b) => a.title.localeCompare(b.title, 'en') || a.id - b.id)
  return {
    ids: selected.map((task) => task.id),
    minutes: selected.reduce((n, task) => n + task.minutes, 0),
  }
}
console.log(JSON.stringify(report('JS')))
console.log(JSON.stringify(report('不存在')))
console.log(tasks.map((task) => task.id).join(','))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
{"ids":[2,1],"minutes":30}
{"ids":[],"minutes":0}
1,2,3
```

答案ID为2、1，分钟30；不存在标签得到空ID和0分钟，原顺序仍1、2、3。标题相等用ID决定顺序，让测试契约更明确。所选对象仍与原数组共享，不应在报告过程中修改字段。

### 47.3 机制：转换、this和异步排错

题目：解释下列代码的输出，逐项指出调用方式、默认值和执行时刻。不要只背日志顺序；修改一个条件再运行，验证规则仍能解释结果。

示例 **C47E03**，目录 `js-study/examples/ch47/C47E03/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
console.log(0 || 9, 0 ?? 9, [] === [])
const task = {
  title: '阅读',
  read() {
    return this.title
  },
}
const read = task.read.bind(task)
console.log(read())
let value = '旧'
Promise.resolve().then(() => console.log(value))
value = '新'
console.log('同步完成')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
9 0 false
阅读
同步完成
新
```

答案依次是9 0 false、阅读、同步完成、新。||把0当假值，??保留0；两个数组身份不同；bind保留接收者；Promise反应稍后读取更新后的绑定。若去掉bind直接read()，严格模块中会抛TypeError。

### 47.4 应用：迁移、取消与联调

题目：把version=0的纯标题数组迁移成version=1任务表。先完整验证，再生成稳定ID，不能迁移到一半就覆盖旧存储。创建时间由参数传入，使结果可测试。

示例 **C47E04**，目录 `js-study/examples/ch47/C47E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function migrate(value, now) {
  if (value?.version !== 0 || !Array.isArray(value.titles)) throw new Error('不支持的旧格式')
  if (!value.titles.every((title) => typeof title === 'string' && title.trim().length > 0))
    throw new Error('旧标题无效')
  const tasks = value.titles.map((title, index) => ({
    id: index + 1,
    title: title.trim(),
    minutes: 0,
    tags: [],
    done: false,
    createdAt: now,
  }))
  return { version: 1, nextId: tasks.length + 1, tasks }
}
const old = { version: 0, titles: [' 阅读 ', '练习'] }
const next = migrate(old, '2026-11-09T00:00:00.000Z')
console.log(next.nextId, next.tasks[0].title, old.version)
try {
  migrate({ version: 0, titles: ['A', ' '] }, '')
} catch (error) {
  console.log(error.message)
}
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
3 阅读 0
旧标题无效
```

本题只负责旧格式转换，提交保存前还要调用完整validateStore检查标题上限、时间、数量等当前契约。取消请求题可重用第28章，接口联调题可重用第45章测试，不另造一套不一致任务规则。

#### 47.4.1 独立练习：取消等待不等于撤回服务端工作

题目：等待服务器确认请求已经到达，再取消客户端等待，最后放行服务器继续完成。分别检查客户端失败和服务端完成，不根据一次取消异常猜测数据一定回滚。

示例 **C47E05**，目录 `js-study/examples/ch47/C47E05/`，环境：Node.js。文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
let arrived
let release
let completed
const started = new Promise((resolve) => {
  arrived = resolve
})
const gate = new Promise((resolve) => {
  release = resolve
})
const finished = new Promise((resolve) => {
  completed = resolve
})
const server = createServer((request, response) => {
  arrived()
  void gate.then(() => {
    response.end('服务端完成')
    completed()
  })
})
try {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const controller = new AbortController()
  const pending = fetch(`http://127.0.0.1:${server.address().port}/`, {
    signal: controller.signal,
  })
  const rejected = assert.rejects(pending, (error) => error.name === 'AbortError')
  await started
  controller.abort()
  await rejected
  console.log('客户端等待已取消')
  release()
  await finished
  console.log('服务端工作仍完成')
} finally {
  release()
  await new Promise((resolve) => {
    server.close(resolve)
    server.closeAllConnections()
  })
}
```

运行`node demo.mjs`，预期依次显示“客户端等待已取消”“服务端工作仍完成”。如果业务需要撤回修改，必须另行定义撤销协议与服务端行为；AbortSignal仅取消等待不能提供这个保证。这里服务器只返回文本，不写业务文件。

#### 47.4.2 独立练习：区分HTTP失败、JSON失败与字段失败

题目：同一个读取函数面对503、坏JSON和结构错误，能否给出对应阶段的提示？下面用受控本机服务提供固定输入，先写自己的分类逻辑，再运行参考。

示例 **C47E06**，目录 `js-study/examples/ch47/C47E06/`，环境：Node.js。文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
const server = createServer((request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname
  response.setHeader('Content-Type', 'application/json')
  if (path === '/http') {
    response.statusCode = 503
    response.end('{"error":"稍后再试"}')
  } else if (path === '/json') response.end('{broken')
  else if (path === '/data') response.end('{"tasks":null}')
  else response.end('{"tasks":[]}')
})
async function load(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('HTTP失败：' + response.status)
  let value
  try {
    value = await response.json()
  } catch (cause) {
    throw new Error('JSON解析失败', { cause })
  }
  if (!Array.isArray(value.tasks)) throw new Error('字段校验失败：tasks需要数组')
  return value.tasks
}
try {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}`
  for (const [path, message] of [
    ['/http', 'HTTP失败：503'],
    ['/json', 'JSON解析失败'],
    ['/data', '字段校验失败：tasks需要数组'],
  ]) {
    await assert.rejects(load(base + path), (error) => error.message === message)
    console.log(message)
  }
  assert.deepEqual(await load(base + '/ok'), [])
  console.log('正常空列表')
} finally {
  await new Promise((resolve) => {
    server.close(resolve)
    server.closeAllConnections()
  })
}
```

运行`node demo.mjs`应依次输出三条对应失败提示和“正常空列表”。再停止服务，重新调用已关闭地址时会在网络阶段失败；不要统一显示“JSON有问题”。本例仅验证演示字段，正式任务仍使用完整validateStore规则。

### 47.5 算法选修：栈、队列、链表与查找

栈后进先出，队列先进先出；数组shift可能移动元素，大量队列操作可用头指针。链表通过节点引用连接，随机定位不是数组索引。二分查找要求有序输入；选择排序方法前说明复杂度与输入规模。

示例 **C47E07**，目录 `js-study/examples/ch47/C47E07/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const stack = []
stack.push('A', 'B')
console.log(stack.pop())
const queue = []
let head = 0
queue.push('A', 'B')
console.log(queue[head++], queue[head++])
const list = { value: 'A', next: { value: 'B', next: null } }
for (let node = list; node !== null; node = node.next) console.log(node.value)
function binarySearch(values, target) {
  let low = 0
  let high = values.length - 1
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2)
    if (values[mid] === target) return mid
    if (values[mid] < target) low = mid + 1
    else high = mid - 1
  }
  return -1
}
console.log(binarySearch([1, 3, 5, 7, 9], 5), binarySearch([], 5))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
B
A B
A
B
2 -1
```

示例 **C47E08**，目录 `js-study/examples/ch47/C47E08/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
function insertionSort(input) {
  const values = [...input]
  for (let i = 1; i < values.length; i += 1) {
    const value = values[i]
    let j = i - 1
    while (j >= 0 && values[j] > value) {
      values[j + 1] = values[j]
      j -= 1
    }
    values[j + 1] = value
  }
  return values
}
const input = [3, 1, 2, 1]
console.log(insertionSort(input).join(','), input.join(','))
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
1,1,2,3 3,1,2,1
```

二分查找每轮缩小范围，比较次数量级O(log n)，但输入无序时答案无保证。链表遍历与线性搜索O(n)。插入排序最坏O(n²)，相等时不越过可保持稳定；日常应用优先使用平台排序，算法练习用于理解而不是替换所有内置方法。头指针队列也要适时释放已消费元素，避免长期保留内存。

### 47.6 动手练习与参考答案

**先独立回答。**

1. parseMinutes是否应接受"1e2"？

2. 二分查找返回-1能证明数据有序吗？

3. 迁移中发现一条坏标题，是否保存前面已转好的记录？

**参考答案与检查。**

1. 当前Number规则接受100；若需求限制纯十进制数字，增加格式检查并新增测试。

2. 不能，有序是调用前提。

3. 不保存，整份验证失败，旧数据保留。

### 47.7 本章速查

| 场景   | 做法与返回   | 易错边界             |
| :----- | :----------- | :------------------- |
| 预测题 | 先写值与原因 | 只背日志顺序不足     |
| 数据题 | 说明统计范围 | 重复标签别重复计     |
| 应用题 | 验证后提交   | 不先清空旧数据       |
| 算法题 | 声明输入前提 | 复杂度不等于实际耗时 |

本章参考：[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)。

## 第48章 速查、阶段验收与官方资料

速查用于回到已学概念，不代替第一次理解。本章按语言机制、内置对象、宿主能力和工具命令分类，避免把Node文件模块、浏览器DOM和语言标准混成同一套能力。阶段验收以能独立完成的动作衡量，不强制安排固定学习天数。

### 48.1 语法与语言机制速查

优先用const表达不重新绑定的名字，需要重新赋值再用let。选择函数形式要看this和构造需求，不只看代码行数。

| 场景      | 写法              | 重点                 |
| :-------- | :---------------- | :------------------- |
| 声明      | const / let       | const不深冻结对象    |
| 缺失默认  | value ?? fallback | 只替换null/undefined |
| 条件/循环 | if、for、for...of | 键和值分开           |
| 函数      | function、箭头    | this和arguments不同  |
| 模块      | import/export     | 明确ESM配置          |
| 异步      | async/await       | 等待不等于并行线程   |

示例 **C48E01**，目录 `js-study/examples/ch48/C48E01/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const settings = { count: 0 }
const count = settings.count ?? 10
let total = 0
for (const value of [count, 2]) total += value
async function result() {
  return total
}
console.log(await result())
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
2
```

遇到表达式先按求值顺序分析，再看状态和宿主。声明是否可见、值是否已初始化、对象是否共享，是排错时比“代码看起来一样”更有用的三个问题。

### 48.2 内置对象与宿主API速查

表中明确返回与修改行为；同名概念不代表跨环境可用。

| 需要          | 工具                   | 返回与修改                 |
| :------------ | :--------------------- | :------------------------- |
| 清理文本      | trim/replace           | 新字符串                   |
| 数组映射/筛选 | map/filter             | 新外层数组，共享元素可存在 |
| 原地添加      | push                   | 修改数组，返回长度         |
| 非修改排序    | toSorted               | 新外层数组                 |
| 映射与集合    | Map/Set                | 明确键和相等规则           |
| 交换文本      | `JSON.parse`/stringify | 格式转换，仍需校验         |
| 页面文本      | textContent            | 浏览器DOM，安全文本        |
| 网络          | fetch                  | 宿主接口，检查HTTP状态     |
| 文件          | node:fs/promises       | Node专有，需处理I/O失败    |

示例 **C48E02**，目录 `js-study/examples/ch48/C48E02/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const source = [3, 1, 2]
const sorted = source.toSorted((a, b) => a - b)
console.log(source.join(','), sorted.join(','))
console.log(JSON.stringify({ total: sorted.reduce((n, x) => n + x, 0) }))
console.log(typeof document, typeof fetch)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
3,1,2 1,2,3
{"total":6}
undefined function
```

查看某方法时至少核对输入、返回、是否修改、异常与环境。标准库不是把所有API都装在一个包里；宿主文档是解释DOM、Fetch和Node能力的必要来源。

### 48.3 开发命令、版本与多版本管理

运行与工具命令要在正确终端和目录执行。nvm-windows当前2.x与旧1.x、nvm-sh以及fnm的机制不同，详细安装、Shell初始化与切换见第2章，不混用各工具命令。

| 目的        | 命令或配置                                 | 检查                                  |
| :---------- | :----------------------------------------- | :------------------------------------ |
| 版本来源    | `node --version`；`npm --version`          | 再查Get-Command或`command -v`         |
| 脚本        | `node demo.mjs`                            | 源码保存且目录正确                    |
| 项目约定    | .nvmrc／.node-version、engines             | 按所选管理器读取；配置不等于已切换    |
| fnm版本选择 | `fnm use`；`fnm current`                   | 先完成Shell初始化，再核对Node真实路径 |
| 安装依赖    | `npm install / npm ci`                     | ci需要相符锁文件                      |
| 测试        | `node --test / npm test`                   | 失败退出码要处理                      |
| 本书页面    | `node tools/serve-examples.mjs --dir` 目录 | 从`js-study`学习根目录运行            |

示例 **C48E03**，目录 `js-study/examples/ch48/C48E03/`，环境：Node.js。

文件 `check-environment.mjs`：

```javascript
console.log(
  JSON.stringify(
    {
      node: process.version,
      v8: process.versions.v8,
      executable: process.execPath,
      module: import.meta.url.endsWith('.mjs'),
      sumPrecise: typeof Math.sumPrecise === 'function',
    },
    null,
    2,
  ),
)
```

在本例目录执行：

```powershell
node check-environment.mjs
```

预期输出：

```text
{
  "node": "v26.13.0",
  "v8": "14.6.202.34-node.40",
  "executable": "<本机Node可执行文件绝对路径>",
  "module": true,
  "sumPrecise": false
}
```

execPath和工作目录随本机变化，输出只作为自己排错记录。版本切换后重开终端或刷新shim状态的具体要求按管理器版本处理，再运行真实入口验证；全局安装包未必随Node版本自动共享。不要运行多个管理器后靠反复改PATH碰运气。

### 48.4 阶段能力验收

验收入口分散在实际学习节点，下面用于回到对应任务，不用最后一个小函数代表全部阶段。

| 阶段           | 本册验收位置   | 要能独立证明的结果                   |
| :------------- | :------------- | :----------------------------------- |
| 一：文件与错误 | 3.5.1          | 从文件、行号和错误类别定位并修正     |
| 二：数据与函数 | 10.6.1、14.6.1 | 转换不代替校验，报告不修改原数据     |
| 三：模块与规则 | 25.5.1         | ID稳定、非法操作不改变旧状态         |
| 四：异步       | 28.6.1、47.4.1 | 旧结果不覆盖新结果，取消不冒充撤回   |
| 五：浏览器保存 | 40.5.1         | 同来源刷新与重启恢复，坏导入保留原表 |
| 六：综合工程   | 45.5.1         | 真实保存、重启、失败恢复与自动测试   |

下面cleanTitle只是最小断言热身，不替代整张验收表。

示例 **C48E04**，目录 `js-study/examples/ch48/C48E04/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
import assert from 'node:assert/strict'
function cleanTitle(value) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error('标题无效')
  return value.trim()
}
assert.equal(cleanTitle(' 阅读 '), '阅读')
assert.throws(() => cleanTitle(' '))
assert.throws(() => cleanTitle(null))
console.log('能运行、能解释、能拒绝非法输入')
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
能运行、能解释、能拒绝非法输入
```

如果只能运行却不能解释某行为什么修改旧对象，就回第13章；如果异步顺序靠猜，回第26—29章；若重启后数据丢失，查保存路径、来源、失败处理与实际文件。验收不要求把选修元编程和算法全部背熟。

### 48.5 官方资料与后续路线

语言问题查固定年度规范和TC39流程；浏览器问题查WHATWG；Node问题查目标版本API和发布记录；工具问题查对应官方项目。MDN可作易读导航，但正式年度归属以规范和提案完成记录核对。

示例 **C48E05**，目录 `js-study/examples/ch48/C48E05/`，环境：Node.js。

文件 `demo.mjs`：

```javascript
const routes = new Map([
  ['类型和语法', 'ECMA-262固定年度规范'],
  ['页面与事件', 'HTML与DOM Standard'],
  ['请求与跨源', 'Fetch Standard'],
  ['文件和服务', '目标Node API文档'],
  ['版本切换', '当前版本管理器官方文档'],
])
for (const [question, source] of routes) console.log(`${question} → ${source}`)
```

在本例目录执行：

```powershell
node demo.mjs
```

预期输出：

```text
类型和语法 → ECMA-262固定年度规范
页面与事件 → HTML与DOM Standard
请求与跨源 → Fetch Standard
文件和服务 → 目标Node API文档
版本切换 → 当前版本管理器官方文档
```

完成主线后按目标选择：想改善类型协作学TypeScript；想做复杂界面再学Vue/React；想做长期服务继续数据库、认证、日志和部署；想优化计算继续算法与Worker。不要同时引入所有工具，把每一项新依赖放到具体需求中。

参考链接：

- [ECMA-262 — ECMAScript language specification](https://ecma-international.org/publications-and-standards/standards/ecma-262/)
- [ECMAScript 2026 Language Specification](https://262.ecma-international.org/17.0/)
- [ECMAScript Internationalization API Specification](https://402.ecma-international.org/)
- [The TC39 Process](https://tc39.es/process-document/)
- [TC39 Finished Proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)
- [HTML Standard](https://html.spec.whatwg.org/)
- [DOM Standard](https://dom.spec.whatwg.org/)
- [Fetch Standard](https://fetch.spec.whatwg.org/)
- [URL Standard](https://url.spec.whatwg.org/)
- [Node.js v26.13.0 Documentation](https://nodejs.org/docs/v26.13.0/api/)
- [Node.js Release Working Group](https://github.com/nodejs/Release)
- [npm Documentation](https://docs.npmjs.com/)
- [NVM for Windows Documentation](https://docs.nvm-windows.com/)
- [nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- [Fast Node Manager (fnm)](https://github.com/Schniz/fnm)
- [fnm v1.39.0 Commands](https://github.com/Schniz/fnm/blob/v1.39.0/docs/commands.md)
- [fnm v1.39.0 Configuration](https://github.com/Schniz/fnm/blob/v1.39.0/docs/configuration.md)
- [Vite Guide](https://vite.dev/guide/)
- [ESLint Documentation](https://eslint.org/docs/latest/)

### 48.6 动手练习与参考答案

**先独立回答。**

1. 项目写了.nvmrc能证明已用该版本吗？

2. 查询语法和查询Fetch是否同一标准？

3. 是否必须读完选修才能做项目？

**参考答案与检查。**

1. 不能，需`node --version`和`process.execPath`。

2. 不是，分别看ECMA-262和Fetch/宿主文档。

3. 不必，先完成主线阶段验收，再按需要回读。

### 48.7 本章速查

| 场景     | 做法与返回           | 易错边界         |
| :------- | :------------------- | :--------------- |
| 先查环境 | 版本、来源、目录     | 不要只看配置     |
| 再查数据 | 格式、类型、业务     | 解析不等于校验   |
| 再查顺序 | 同步、等待、状态提交 | 不要猜回调时刻   |
| 后续学习 | 由需求选择工具       | 不同时堆满技术栈 |

本章参考：[ECMAScript 2026语言规范](https://262.ecma-international.org/17.0/)、[TC39提案流程](https://tc39.es/process-document/)、[Node.js v26.13.0：api](https://nodejs.org/docs/v26.13.0/api/)、[nvm-windows官方文档](https://docs.nvm-windows.com/)、[nvm-sh官方文档](https://github.com/nvm-sh/nvm)、[fnm官方文档](https://github.com/Schniz/fnm)。
