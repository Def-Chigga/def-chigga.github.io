---
title: Vue 代码风格指南
date: 2025-10-01
categories: [前端]
tags: [Vue, 代码规范]
---

# Vue 代码风格指南

## 目录

- [1. 前言](#_1-前言)
- [2. 基本规范](#_2-基本规范)
- [3. 模板规范](#_3-模板规范)
- [4. 脚本规范](#_4-脚本规范)
- [5. 样式规范](#_5-样式规范)
- [6. 组合式 API 规范](#_6-组合式-api-规范)
- [7. 性能优化规范](#_7-性能优化规范)
- [8. TypeScript 集成](#_8-typescript-集成)
- [9. 测试规范](#_9-测试规范)

## 1. 前言

### 1.1 文档目的

本规范基于 Vue 官方风格指南、eslint-plugin-vue 规则、业界最佳实践和现代 Vue 3 技术趋势制定，旨在为企业级 Vue 项目提供统一的代码标准，确保代码质量、可维护性、可读性和团队协作效率。

### 1.2 适用范围

适用于所有使用 Vue 2/3 的新项目及现有项目重构。所有前端开发人员必须遵守本规范。

### 1.3 原则说明

- **一致性**：统一团队代码风格和模式
- **可维护性**：编写易于理解和修改的代码
- **性能优化**：遵循 Vue 性能最佳实践
- **现代特性**：合理使用 Vue 3 新特性
- **渐进式**：平衡严格规则与实际项目需求

## 2. 基本规范

### 2.1 组件命名

**规则：** 组件名应该始终是多个单词的（根组件 `App` 和 Vue 内置组件除外），使用 PascalCase 命名法。遵循 `vue/multi-word-component-names` 规则。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<!-- 单文件组件名: MyComponent.vue -->
export default {
  name: 'MyComponent'
}

<!-- 错误示例 ❌ -->
<!-- 单文件组件名: myComponent.vue -->
export default {
  name: 'myComponent'
}
```

### 2.2 组件文件命名

**规则：** 单文件组件文件名应该始终使用 PascalCase 或 kebab-case。遵循 `vue/component-name-in-template-casing` 规则。

**示例：**

```bash
# 正确示例 ✅
components/
|- MyComponent.vue    # PascalCase
|- my-component.vue   # kebab-case

# 错误示例 ❌
components/
|- myComponent.vue    # 驼峰不一致
```

### 2.3 完整单词的组件名

**规则：** 组件名应该倾向于完整单词而不是缩写。遵循 `vue/no-abbreviations` 原则。

**示例：**

```bash
# 正确示例 ✅
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue

// 错误示例 ❌
components/
|- SdSettings.vue
|- UProfOpts.vue
```

### 2.4 紧密耦合的组件命名

**规则：** 和父组件紧密耦合的子组件应该以父组件名作为前缀命名。遵循 `vue/component-options-name-casing` 规则。

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

### 2.5 组件名中的单词顺序

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

### 2.6 顶级元素顺序

**规则：** 单文件组件应该总是让 `<template>`、`<script>` 和 `<style>` 标签的顺序保持一致。且 `<style>` 要放在最后。遵循 `vue/block-order` 规则。

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

## 3. 模板规范

### 3.1 组件标签大小写

**规则：** 在单文件组件、字符串模板和 JSX 中，组件标签应该使用 PascalCase；在 DOM 模板中使用 kebab-case。遵循 `vue/component-name-in-template-casing` 规则。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<!-- 单文件组件中 -->
<MyComponent/>
<my-component></my-component> <!-- DOM模板中 -->

<!-- 错误示例 ❌ -->
<myComponent/> <!-- 混合大小写 -->
```

### 3.2 自闭合组件

**规则：** 在单文件组件、字符串模板和 JSX 中没有内容的组件应该是自闭合的，但在 DOM 模板里永远不要这样做。遵循 `vue/html-self-closing` 规则。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<!-- 单文件组件、字符串模板和 JSX中 -->
<MyComponent />

<!-- DOM模板中 -->
<my-component></my-component>

<!-- 错误示例 ❌ -->
<!-- 单文件组件、字符串模板和 JSX中 -->
<MyComponent></MyComponent>
```

### 3.3 v-for 设置键值

**规则：** 总是为 v-for 设置 key 值，且不要使用索引作为 key。遵循 `vue/require-v-for-key` 规则。

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

### 3.4 避免 v-if 和 v-for 共用

**规则：** 永远不要把 v-if 和 v-for 同时用在同一个元素上。遵循 `vue/no-use-v-if-with-v-for` 规则。

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

### 3.5 模板表达式简化

**规则：** 组件模板应该只包含简单的表达式，复杂的表达式应该重构为计算属性或方法。遵循 `vue/no-complex-expressions-in-template` 原则。

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

### 3.6 指令缩写

**规则：** 指令缩写(用 `:` 表示 `v-bind:`、用 `@` 表示 `v-on:` 和用 `#` 表示 `v-slot:`)。遵循 `vue/v-bind-style` 和 `vue/v-on-style` 规则。

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

### 3.7 Prop / Emit 传递

**规则：** 在模板和 JSX 中应该始终使用 kebab-case。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<WelcomeMessage greeting-text="hi" @on-message="onMessage" />

<!-- 错误示例 ❌ -->
<WelcomeMessage greetingText="hi" @onMessage="onMessage" />
```

### 3.8 Ref 命名

**规则：** 驼峰 `camelCaseRef` 命名。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<input ref="inputRef" />
<UserProfile ref="userProfileRef" />

<!-- 错误示例 ❌ -->
<input ref="input" />
<UserProfile ref="UserProfileRef" />
```

### 3.9 避免使用 v-html

**规则：** 谨慎使用 v-html，确保内容安全，防止 XSS 攻击。遵循 `vue/no-v-html` 规则。

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

## 4. 脚本规范

### 4.1 组件结构顺序

**规则：** 组件选项应该有统一的顺序。遵循 `vue/order-in-components` 规则。

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

### 4.2 Prop 定义

**规则：**

1. 在声明 Prop 的时候，其命名应该始终使用 camelCase。

2. Prop 定义应该尽量详细，至少指定其类型。遵循 `vue/require-prop-types` 和 `vue/require-default-prop` 规则。

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

### 4.3 Emit 定义

**规则：** 定义所有发出的事件，使用 camel-case 命名。遵循 `vue/require-explicit-emits` 规则。

**示例：**

```vue
<script>
export default {
  // 正确示例 ✅
  emits: [
    'update-model',
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

### 4.4 计算属性

**规则：** 计算属性应该只做计算而没有任何副作用，避免直接修改计算属性值。遵循 `vue/no-side-effects-in-computed-properties` 规则。

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

### 4.5 避免重复键值

**规则：** 不允许重复的键值。遵循 `vue/no-dupe-keys` 规则。

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

## 5. 样式规范

### 5.1 作用域样式

**规则：** 对于应用来说，顶级 App 组件和布局组件中的样式可以是全局的，但是其它所有组件都应该是有作用域的。遵循 `vue/scoped-padding` 原则。

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

### 5.2 CSS 模块化

**规则：** 使用 BEM 或 CSS Modules 等方法实现样式模块化。遵循 `vue/component-class-pattern` 原则。

**示例：**

```vue
<template>
  <div :class="$style.card">
    <div :class="$style.header">
      <h3 :class="$style.title">Title</h3>
    </div>
  </div>
</template>

<style module>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
}

.header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.title {
  margin: 0;
  font-size: 18px;
}
</style>
```

## 6. 组合式 API 规范

### 6.1 setup 语法糖

**规则：** 使用 `<script setup>` 语法糖提高代码简洁性。遵循 `vue/prefer-define-options` 规则。

**示例：**

```vue
<!-- 正确示例 ✅ -->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: String,
})

const emit = defineEmits(['updateMessage'])

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
  emits: ['updateMessage'],
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

### 6.2 组合式函数

**规则：** 组合式函数应该以 "use" 开头，返回响应式数据和方法。遵循 `vue/use-function-pattern` 原则。

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

### 6.3 避免 Ref 作为操作数

**规则：** 不允许使用 `ref()` 包装的值作为操作数。遵循 `vue/no-ref-as-operand` 规则。

**示例：**

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

// 正确示例 ✅
const goodValue = count.value + 1

// 错误示例 ❌
const badValue = count + 1
</script>
```

## 7. 性能优化规范

### 7.1 组件懒加载

**规则：** 对路由组件和大型组件使用懒加载。遵循 `vue/prefer-async-component` 原则。

**示例：**

```javascript
// 正确示例 ✅
const Home = () => import('./views/Home.vue')

const HeavyComponent = defineAsyncComponent(() => import('./components/HeavyComponent.vue'))

// 错误示例 ❌
import Home from './views/Home.vue' // 路由组件

import HeavyComponent from './components/HeavyComponent.vue' // 大型组件
```

### 7.2 列表渲染优化

**规则：** 大型列表使用虚拟滚动，避免同时渲染大量 DOM 元素。遵循 `vue/prefer-virtual-list` 原则。

**示例：**

```vue
<template>
  <!-- 正确示例 ✅ -->
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
  >
    <template #default="{ item }">
      <div class="item">
        {{ item.name }}
      </div>
    </template>
  </RecycleScroller>

  <!-- 错误示例 ❌ - 渲染万级列表 -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

## 8. TypeScript 集成

### 8.1 组合式 API 与 TypeScript

以下示例中的多种写法为并列选项，实际使用时任选一种，不要在同一组件中重复声明同名变量。

#### 为组件 Props 标注类型

**使用 `<script setup>`：**

```vue
<script setup lang="ts">
// 运行时声明
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number,
})

// 基于类型的声明
const props = defineProps<{
  foo: string
  bar?: number
}>()

// 使用接口
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

#### Props 默认值

使用响应式解构或 `withDefaults`：

```vue
<script setup lang="ts">
interface Props {
  msg?: string
  labels?: string[]
}

// 响应式解构 (Vue 3.5+)
const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()

// 使用 withDefaults
const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two'],
})
</script>
```

#### 为组件 Emits 标注类型

```vue
<script setup lang="ts">
// 运行时声明
const emit = defineEmits(['change', 'update'])

// 基于选项
const emit = defineEmits({
  change: (id: number) => {
    return true // 验证通过
  },
  update: (value: string) => {
    return true // 验证通过
  },
})

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+ 简化语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

#### 响应式类型

**ref()：**

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

// 自动类型推导
const year = ref(2020) // Ref<number>

// 显式指定类型
const year = ref<string | number>('2020')

// 使用 Ref 类型
const year: Ref<string | number> = ref('2020')
```

**reactive()：**

```ts
import { reactive } from 'vue'

// 自动推导
const book = reactive({ title: 'Vue 3 指引' }) // { title: string }

// 使用接口
interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

**computed()：**

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// 自动推导
const double = computed(() => count.value * 2) // ComputedRef<number>

// 显式指定
const double = computed<number>(() => {
  // 必须返回 number
  return count.value * 2
})
```

#### 为事件处理函数标注类型

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` 隐式地标注为 `any` 类型
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

#### Provide / Inject

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 提供值

const foo = inject(key) // string | undefined

// 注入默认值
const foo = inject<string>('foo', 'default') // string

// 强制转换类型
const foo = inject(key) as string
```

#### 模板引用

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

// 自动推断 (Vue 3.5+)
const el = useTemplateRef('inputRef')

// 显式类型
const el = useTemplateRef<HTMLInputElement>('inputRef')
</script>

<template>
  <input ref="inputRef" />
</template>
```

#### 组件模板引用

为了获取导入组件的实例类型，我们需要先通过 `typeof` 获取其类型，然后使用 TypeScript 的内置 `InstanceType` 工具提取其实例类型：

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

如果组件的具体类型无法获得，或者你并不关心组件的具体类型，那么可以使用 `ComponentPublicInstance`。这只会包含所有组件都共享的属性，比如 `$el`。

```vue
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```

### 8.2 选项式 API 与 TypeScript

#### 定义组件

使用 `defineComponent()` 包装组件以启用类型推导：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用类型推导
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null,
  },
  mounted() {
    this.name // string | undefined
    this.id // number | string | undefined
    this.msg // string
    this.metadata // any
  },
})
```

#### 复杂 Props 类型

使用 `PropType` 工具类型标注复杂类型：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      type: Object as PropType<Book>,
      required: true,
    },
    callback: Function as PropType<(id: number) => void>,
  },
  mounted() {
    this.book.title // string
    this.book.year // number
  },
})
```

#### 为组件的 emits 标注类型

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // 执行运行时校验
      return payload.bookName.length > 0
    },
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123, // 类型错误
      })

      this.$emit('non-declared-event') // 类型错误
    },
  },
})
```

#### 计算属性类型

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!',
    }
  },
  computed: {
    // 自动推导
    greeting() {
      return this.message + '!'
    },

    // 显式标注
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      },
    },
  },
})
```

#### 事件处理函数类型

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    },
  },
})
```

### 8.3 类型扩展

#### 扩展环境变量

```ts
// src/vite-env.d.ts
interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

#### 扩展全局属性

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

#### 扩展自定义选项

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

## 9. 测试规范

### 9.1 单元测试

**规则：** 为组件编写单元测试，覆盖主要功能和边界情况。遵循 `vue/require-test- coverage` 原则。

**示例：**

```javascript
// ExampleComponent.spec.js
import { mount } from '@vue/test-utils'
import ExampleComponent from './ExampleComponent.vue'

describe('ExampleComponent', () => {
  it('renders correctly with props', () => {
    const wrapper = mount(ExampleComponent, {
      props: {
        title: 'Test Title',
        count: 5,
      },
    })

    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('5')
  })

  it('emits submit event when button clicked', async () => {
    const wrapper = mount(ExampleComponent)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted().submit).toBeTruthy()
  })
})
```
