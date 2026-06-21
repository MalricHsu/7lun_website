---
title: Vue｜Vue 介紹
sidebar_position: 1
tags: [Vue]
date: 2026-04-15
---

### 一、Vue 是什麼？

- Vue 是一個**漸進式框架（Progressive Framework）**，由 Evan You 開發。 
- **「漸進式」** 的意思是：可以只用一小部分功能嵌入既有頁面，也可以拿來建構完整的大型 SPA（單頁應用），不強迫一開始就要用全套架構。

- 核心理念：**資料驅動畫面（Data-driven View）**，資料變了，畫面自動跟著更新，開發者不用手動操作 DOM。
- 官方體系完整：路由（Vue Router）、狀態管理（Pinia）、建構工具（Vite）都是官方規劃好的標準答案，整合度高。

### 二、透過 CDN 把 Vue 匯入 HTML

- 正式專案會用 Vite 建構，但 Vue 也可以直接用 `<script>` 標籤匯入 CDN，在單一 `.html` 檔案裡體驗，不用 `npm install`。

#### 1. 最簡單的範例

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <title>Vue CDN Demo</title>
</head>
<body>

  <div id="app">
    <p>你按了 {{ count }} 次</p>
    <button @click="count++">+1</button>
  </div>

  <!-- 只需要這一個 script -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

  <script>
    const { createApp, ref } = Vue

    createApp({
      setup() {
        const count = ref(0)
        return { count }
      }
    }).mount('#app')
  </script>

</body>
</html>
```

:::note

**跟 React CDN 最大的不同：只需要一個 script。** 不用另外載入 Babel，因為 `vue.global.js` 這個「完整版（full build）」本身就內建了 template 編譯器，可以在瀏覽器執行階段，直接把 `<div id="app">` 裡的 HTML 內容當作 template 字串解析、編譯成渲染函式——這種寫法叫做 **in-DOM template**。

:::

#### 2. 這個 script 在做什麼

<table width="100%">
  <thead>
    <tr>
      <th width="30%">內容</th>
      <th width="70%">作用</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Vue.createApp(options)</code></td>
      <td>建立一個應用實例，<code>options</code> 裡放 <code>setup()</code>、<code>data()</code>、<code>methods</code> 等選項</td>
    </tr>
    <tr>
      <td><code>.mount('#app')</code></td>
      <td>把這個應用「掛載」到指定的 DOM 元素上，Vue 會接管這個元素底下的內容</td>
    </tr>
    <tr>
      <td><code>Vue.ref</code> / <code>Vue.reactive</code></td>
      <td>CDN 版本一樣有 Composition API，從全域的 <code>Vue</code> 物件解構出來用</td>
    </tr>
    <tr>
      <td>內建 template 編譯器</td>
      <td>負責把 HTML 字串（不管是寫在 JS 裡的 <code>template</code> 選項，還是直接寫在 DOM 裡）即時編譯成渲染函式</td>
    </tr>
  </tbody>
</table>

- 也可以把 template 寫在 JS 字串裡，而不是依賴 DOM 裡現成的 HTML：

  ```js
  createApp({
    template: `<p>你按了 {{ count }} 次</p><button @click="count++">+1</button>`,
    setup() {
      const count = Vue.ref(0)
      return { count }
    }
  }).mount('#app')
  ```

  兩種寫法效果一樣，差別只在 template 字串是放在 HTML 裡讓 Vue 去讀，還是直接寫死在 JS 裡。

#### 3. 幾個要注意的細節

- **`vue.global.js` vs `vue.global.prod.js`**：development 版（沒有 `.prod`）會有額外的警告訊息，正式環境應該換成 `vue.global.prod.js`，檔案更小、不印警告。
- **沒有 `.vue` 單檔元件（SFC）支援**：CDN 方式無法直接使用 `<template>` / `<script setup>` / `<style scoped>` 這種 `.vue` 檔案語法，因為 SFC 需要建構工具（Vite）在開發階段先編譯成 JS。CDN 方式只能用純 JS 物件（`setup()`、`data()`、`methods` 等選項）搭配字串或 in-DOM template。
- **效能**：瀏覽器當下即時編譯 template 比建構工具預先編譯慢，只適合學習、Demo，正式專案不建議。
- **多個元件**：CDN 方式也能定義多個元件再組合，用 `app.component('MyComponent', { ... })` 註冊，但寫起來比 SFC 檔案分散很多。

#### 4. 跟正式專案（Vite + SFC）的差異

<table width="100%">
  <thead>
    <tr>
      <th></th>
      <th>CDN 方式</th>
      <th>Vite + .vue SFC</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>安裝</strong></td>
      <td>不用 npm install，直接 <code>&lt;script&gt;</code></td>
      <td>需要 <code>npm create vue@latest</code></td>
    </tr>
    <tr>
      <td><strong>Template 編譯時機</strong></td>
      <td>瀏覽器執行當下即時編譯（慢）</td>
      <td>開發時預先編譯（快）</td>
    </tr>
    <tr>
      <td><strong>檔案組織</strong></td>
      <td>全部擠在一個 HTML / JS 物件裡</td>
      <td>每個元件一個 <code>.vue</code> 檔案，結構清楚</td>
    </tr>
    <tr>
      <td><strong><code>&lt;script setup&gt;</code> 語法糖</strong></td>
      <td>不支援</td>
      <td>支援</td>
    </tr>
    <tr>
      <td><strong>適合場景</strong></td>
      <td>學習、Demo、單一 HTML 試玩</td>
      <td>正式專案開發</td>
    </tr>
  </tbody>
</table>

:::tip

簡單說：CDN 方式拿來「先感受一下 Vue 長什麼樣子」很方便，而且比 React CDN 少一個 Babel 步驟；但真正開發專案還是要用 Vite + SFC。

:::

### 三、Template 語法

- Vue 用接近原生 HTML 的 **Template** 語法描述畫面，搭配特殊的「指令（Directive）」來處理動態邏輯。

  ```html
  <template>
    <div>
      <p v-if="isLoggedIn">歡迎回來，{{ username }}</p>
      <p v-else>請先登入</p>

      <ul>
        <li v-for="item in items" :key="item.id">{{ item.text }}</li>
      </ul>

      <button @click="handleClick">點我</button>
    </div>
  </template>
  ```

- 常用指令：

  <table width="100%">
    <thead>
      <tr>
        <th width="30%">指令</th>
        <th width="70%">作用</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&#123;&#123; &#125;&#125;</code></td>
        <td>文字插值，把 JS 變數印到畫面上</td>
      </tr>
      <tr>
        <td><code>v-bind</code> / <code>:</code></td>
        <td>綁定屬性，例如 <code>:src="imgUrl"</code></td>
      </tr>
      <tr>
        <td><code>v-on</code> / <code>@</code></td>
        <td>綁定事件，例如 <code>@click="handleClick"</code></td>
      </tr>
      <tr>
        <td><code>v-if</code> / <code>v-else</code> / <code>v-show</code></td>
        <td>條件渲染</td>
      </tr>
      <tr>
        <td><code>v-for</code></td>
        <td>列表渲染，務必搭配 <code>:key</code></td>
      </tr>
      <tr>
        <td><code>v-model</code></td>
        <td>表單雙向綁定</td>
      </tr>
    </tbody>
  </table>

:::note

**理解重點**：Template 在編譯階段就會被轉換成渲染函式，Vue 的編譯器能預先分析出「哪段畫面依賴哪個資料」，這對效能有直接幫助。

:::

### 四、Component 與 Single File Component（.vue 檔案）

- Vue 的元件通常寫成 `.vue` 檔案，把畫面、邏輯、樣式放在同一個檔案裡：

    ```vue
    <template>
      <div>
        <p>哈囉，{{ name }}</p>
        <button @click="$emit('close')">關閉</button>
      </div>
    </template>

    <script setup>
    defineProps({
      name: String
    })
    defineEmits(['close'])
    </script>

    <style scoped>
    p {
      color: #333;
    }
    </style>
    ```

- `<template>`：畫面結構
- `<script setup>`：邏輯（Composition API 的簡寫語法）
- `<style scoped>`：樣式，`scoped` 確保樣式只作用在這個元件內，不會外漏影響其他元件

:::tip

Props 是父層傳給子層的資料，**唯讀**；子層要跟父層溝通，用 `emit` 觸發自訂事件（上面範例的 `defineEmits(['close'])`）。

:::

### 五、Reactivity：ref 與 reactive

- 這是 Vue 3 最核心的機制，用 **Composition API** 的 `ref()` 和 `reactive()` 來建立「響應式資料」。

```js
import { ref, reactive } from 'vue'

const count = ref(0)        // 包裝單一原始值，存取要用 .value
const user = reactive({     // 包裝物件，可以直接存取屬性
  name: '7lun',
  age: 26
})

function increment() {
  count.value++  // 在 <script> 裡要加 .value
  user.age++     // reactive 不用加 .value  
}
```

```html
<template>
  <!-- 在 template 裡不用寫 .value，Vue 會自動處理 -->
  <button @click="increment">{{ count }}</button>
</template>
```

- **關鍵概念**：Vue 3 底層用 JavaScript 的 **Proxy** 包裝資料，當畫面去「讀取」某個 reactive 資料時，Vue 會記錄下「這段畫面依賴這個資料」；之後這個資料一旦被「寫入」新值，Vue 就能精準地只更新「真正用到它」的那塊 DOM，**不需要重新執行整個 component 函式**。

#### 1. ref 跟 reactive 的差別：

<table width="100%">
  <thead>
    <tr>
      <th width="20%"></th>
      <th width="40%"><code>ref()</code></th>
      <th width="40%"><code>reactive()</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>適用對象</strong></td>
      <td>任何型別（數字、字串、物件都可以）</td>
      <td>只能是物件、陣列</td>
    </tr>
    <tr>
      <td><strong>存取方式</strong></td>
      <td><code>.value</code></td>
      <td>直接存取屬性</td>
    </tr>
    <tr>
      <td><strong>解構後</strong></td>
      <td>容易失去響應性（需要 <code>toRefs</code>）</td>
      <td>同樣容易失去響應性</td>
    </tr>
  </tbody>
</table>

- 實務上大多直接用 `ref()`，比較一致、不容易踩坑。

### 六、computed 與 watch

#### 1. computed：有快取的衍生值

```js
import { computed } from 'vue'

const firstName = ref('Mal')
const lastName = ref('ric')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

- `computed` 算出來的值會被快取，只有依賴的資料（`firstName`、`lastName`）改變時才會重新計算，適合用在「**由其他資料推導出來**」的值。

#### 2. watch / watchEffect：觀察資料變化執行副作用

```js
import { watch, watchEffect } from 'vue'

watch(count, (newValue, oldValue) => {
  console.log(`count 從 ${oldValue} 變成 ${newValue}`)
})

watchEffect(() => {
  console.log('count 現在是', count.value)
})
```

- `watch`：明確指定要觀察哪個資料來源，可以拿到新舊值
- `watchEffect`：自動追蹤函式內用到的所有 reactive 資料，不用手動指定來源，元件初始化時就會先執行一次

### 七、生命週期 Hooks

#### 1. Composition API 用函式的方式註冊生命週期

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('元件掛載完成，DOM 已經存在')
})

onUnmounted(() => {
  console.log('元件即將卸載，清理計時器、監聽器等')
})
```

- 常用的有 `onMounted`（掛載後）、`onUpdated`（畫面更新後）、`onUnmounted`（卸載前，適合清理副作用）。

### 八、生態系

<table width="100%">
  <thead>
    <tr>
      <th width="40%">用途</th>
      <th width="60%">套件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>路由</td>
      <td>Vue Router</td>
    </tr>
    <tr>
      <td>全域狀態管理</td>
      <td>Pinia</td>
    </tr>
    <tr>
      <td>全端框架（SSR、檔案路由等）</td>
      <td>Nuxt 3 、Nuxt4</td>
    </tr>
    <tr>
      <td>建構工具</td>
      <td>Vite</td>
    </tr>
  </tbody>
</table>

- 這些都是官方維護或官方推薦的標準答案，版本之間的搭配相容性也由官方把關，整合起來比較省心。

### 九、適合什麼樣的專案？

- 官方生態整合度高，路由、狀態管理、建構工具都有「標準答案」，不太需要自己評估套件選擇。
- Template 語法接近原生 HTML，對前端新手或從後端轉前端的人較容易上手。
- 中文社群與文件資源豐富。
- 漸進式特性讓它也適合「在既有專案裡局部導入」，不一定要整個重寫。

### 十、延伸學習資源

- 官方文件：[vuejs.org](https://vuejs.org)（有完整繁體中文翻譯）