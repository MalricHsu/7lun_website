---
title: Vue｜Vue Pinia 狀態管理
sidebar_position: 7
tags: [Vue, Pinia, JavaScript, 知識點筆記]
date: 2026-07-08
slug: vue/pinia-concepts
---


### 一、狀態管理

#### 1. 先理解「狀態（State）」 

- **狀態就是應用程式在某個當下的資料**。
- 例如：
  - 使用者「有沒有登入」、登入者是誰
  - 購物車裡「有哪些商品」、各買幾件
  - 目前是深色還是淺色主題
  - API 資料「載入中 / 成功 / 失敗」
- 在單一元件裡，狀態就是元件自己的 `ref` / `reactive`，自己管理、自己使用，完全沒問題。**真正的麻煩出現在「多個元件要共用同一份資料」的時候。**

#### 2. 沒有狀態管理工具時的痛點

- 假設「使用者登入資訊」要給導覽列、個人頁、留言區同時使用，會遇到：
  - **Props 逐層下傳（props drilling）**：資料在最上層，要一路 `props` 傳到深層子元件，中間每一層即使用不到也得幫忙接手再往下傳。
  - **事件逐層上冒（emit 地獄）**：深層子元件想改資料，得一路 `emit` 往上傳回持有資料的那一層才能改。
  - **兄弟元件無法直接溝通**：兩個沒有父子關係的元件想共享資料，只能把狀態「提升」到共同父層，再往下傳給雙方。
  - **真相來源分散（no single source of truth）**：同一份資料的副本散在很多元件裡，不知道誰才是正確的那一份，難維護、難除錯。

  ![WithoutPinia](/img/vue07-2.png)

#### 3. 狀態管理工具做的事

- 把「跨元件共享的狀態」抽出來，集中放到一個獨立的地方，稱為**Store**。任何元件都能直接讀寫，不必再靠 props / emit 層層接力。

  ![WithPinia](/img/vue07-3.png)

- 核心價值：
  - **單一真相來源（Single Source of Truth）**：資料只有一份，集中管理
  - **任意元件直接存取**：不受元件樹層級限制
  - **可預測的資料流**：誰改了資料、怎麼改的，都有跡可循（搭配 devtools 更清楚）

### 二、為什麼選擇 Pinia？

#### 1. 從 Vuex 到 Pinia

- Vue 早期的官方方案是 **Vuex**。Vuex 概念偏多：同步修改要走 `mutations`、非同步走 `actions`、改資料要 `commit`，樣板程式碼（boilerplate）多，TypeScript 支援也不理想。
- **Pinia 是 Vue 現在官方推薦的狀態管理工具**，把 Vuex 的心智負擔大幅簡化。

  | 對比 | Vuex | Pinia |
  | --- | --- | --- |
  | 修改狀態 | 必須透過 mutations + commit | 直接改，或用 action |
  | 概念數量 | state / getters / mutations / actions | state / getters / actions（少一層） |
  | TypeScript | 支援較弱 | 原生完整支援 |
  | 寫法 | Options 為主 | 支援 Composition API，和 `<script setup>` 一致 |
  | 模組化 | modules 巢狀設定繁瑣 | 每個 Store 天然獨立，自動 code splitting |

#### 2. 什麼時候該用？什麼時候不用？

- **該用**：跨多個元件共享、或需要持久保存的狀態。例如登入狀態、購物車、全域 UI 主題、快取 API 資料。
- **不用**：只有單一元件、或單純父子之間用到的區域狀態。用元件自己的 `ref` 就好。

  :::note
  **官方提醒：** 並非所有狀態都要放進 Store。硬把區域狀態塞進 Store，只會增加不必要的複雜度。判斷依據很簡單：這份資料**有沒有跨出元件的邊界被別人用到**？沒有，就留在元件裡。
  :::

### 三、核心三要素：State / Getters / Actions

![Pinia Store 架構與資料流](/img/vue07-1.svg)

- Pinia 的 Store 就三個組成。用 Composition API 的角度，可以一一對應到你已經熟悉的東西：

  | 概念 | Composition API 對應 | 一句話理解 | 角色比喻 |
  | --- | --- | --- | --- |
  | **State** | `ref()` / `reactive()` | 資料本身 | 名詞（資料是什麼） |
  | **Getters** | `computed()` | 從 state 算出來的衍生資料 | 形容詞（資料算出來的樣子） |
  | **Actions** | 一般 `function` | 修改 state / 商業邏輯 | 動詞（對資料做什麼） |

  :::tip
  **記憶口訣：** State 是名詞、Getter 是形容詞、Action 是動詞。整個 Store 就是「用動詞去改名詞，形容詞自動跟著算出來」。
  :::

#### 1. State — 資料本身

- 對應 Composition API 的 **`ref()`**（最常用）或 `reactive()`。
- 代表 Store「目前的資料」，是整個 Store 的核心。
- **具響應性**：任何元件讀取後，只要 state 一變，用到它的畫面會自動更新。
- 在元件中若要「解構後仍保持響應性」，必須透過 `storeToRefs`。

  ```js
  const count = ref(0)
  const user = ref(null)
  const items = ref([])
  ```

#### 2. Getters — 衍生 / 計算狀態

- 對應 Composition API 的 **`computed()`**。
- 它**不是新的資料**，而是「從現有 state 算出來的結果」。
- **自動快取**：只有它依賴的 state 改變時才會重新計算，否則直接回傳上次結果，效能好。

  :::note
  **為什麼要用 getter，而不是自己存一個 state？**
  以「購物車總金額」為例。如果你另外開一個 `totalPrice` 的 state，那麼每次商品增減都得「記得手動更新」它，一旦漏掉就會不同步。用 getter 則是「從 items 動態算出來」，永遠正確、不會忘記更新。

  ```js
  // 另存一份 state → 容易忘記同步
  const totalPrice = ref(0) // 每次改 items 都得手動改這個…

  // 用 getter 動態衍生 → 永遠跟 items 一致
  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )
  ```
  :::

#### 3. Actions — 操作 / 方法

- 對應一般的 **`function`**（在 Setup Store 裡就是普通函式）。
- 負責「**修改 state**」以及執行「**商業邏輯**」。
- **可同步、可非同步**：非同步（`async`）最常見於串接 API。

  :::note
  **為什麼把邏輯放進 action，而不是寫在元件裡？** 元件只負責 UI（顯示、點擊），資料「怎麼變」的邏輯集中在 Store。好處是同一段邏輯多個元件共用、方便單獨測試、日後維護只改一個地方。
  :::

  ```js
  // 同步：修改 state
  function increment() {
    count.value++
  }

  // 非同步：串 API 後更新 state
  async function fetchProducts() {
    isLoading.value = true
    try {
      const res = await axios.get('/api/products')
      products.value = res.data
    } finally {
      isLoading.value = false
    }
  }
  ```

#### 4. 三者如何協作

 ![Pinia Store 架構與資料流](/img/vue07-4.png)

### 四、安裝與環境建置

- 安裝：

  ```bash
  npm install pinia
  ```

- 在 `main.js` 中註冊：

  ```js
  import { createApp } from 'vue'
  import { createPinia } from 'pinia'
  import App from './App.vue'

  const pinia = createPinia()
  const app = createApp(App)

  app.use(pinia)
  app.mount('#app')
  ```

- **命名慣例**：
  - Store 檔案放在 `src/stores/` 資料夾（複數）
  - Store 名稱使用 `useXxxStore` 格式（如 `useUserStore`、`useCartStore`）
  - `defineStore()` 第一個參數的 ID 必須唯一（如 `'user'`、`'cart'`）


- 建立檔案 `stores/counter.js`：

  ```js
  import { ref, computed } from 'vue'
  import { defineStore } from 'pinia'

  export const useCounterStore = defineStore('counter', () => {
    // state → ref
    const count = ref(0)
    const name = ref('計數器')

    // getters → computed
    const doubleCount = computed(() => count.value * 2)

    // actions → function
    function increment() {
      count.value++
    }

    function reset() {
      count.value = 0
    }

    // 必須 return 出去才能在元件中使用
    return { count, name, doubleCount, increment, reset }
  })
  ```

  :::warning
  **一定要 return：** Setup Store 是靠「你 return 了什麼，外面就能用什麼」。忘記把某個 state 或 action 放進 return，元件就完全讀不到它，而且不會報錯，很難察覺。
  :::

### 五、在元件中使用 Store

#### 1. 方法一：透過 Store 實例直接存取

  ```vue
  <script setup>
  import { useCounterStore } from '@/stores/counter'

  const counterStore = useCounterStore()
  </script>

  <template>
    <p>{{ counterStore.count }} / {{ counterStore.doubleCount }}</p>
    <button @click="counterStore.increment">++</button>
  </template>
  ```

#### 2. 方法二：使用 `storeToRefs` 解構

  ```vue
  <script setup>
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'

  const counterStore = useCounterStore()

  // 非函式的值(state、getters)需要用 storeToRefs 保持響應性
  const { count, doubleCount } = storeToRefs(counterStore)

  // 函式(actions)直接解構即可
  const { increment, reset } = counterStore
  </script>

  <template>
    <p>{{ count }} / {{ doubleCount }}</p>
    <button @click="increment">++</button>
    <button @click="reset">重置</button>
  </template>
  ```

  :::warning
  **最容易踩的雷：** 直接 `const { count } = counterStore` 會讓 `count` **失去響應性**（變成解構當下那一刻的死值，之後 store 再怎麼變畫面都不動）。state / getters 一定要透過 `storeToRefs`；actions 因為是函式，直接解構沒問題。
  :::

  :::note
  **記憶口訣：** 資料（state / getters）走 `storeToRefs`，方法（actions）直接拿。
  :::

#### 3. 基礎範例：跨元件共享狀態

  ```js
  // stores/user.js
  import { ref } from 'vue'
  import { defineStore } from 'pinia'

  export const useUserStore = defineStore('user', () => {
    const name = ref('小明')
    return { name }
  })
  ```

  ```vue
  <!-- App.vue(父元件,顯示) -->
  <script setup>
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/stores/user'
  import NameInput from '@/components/NameInput.vue'

  const userStore = useUserStore()
  const { name } = storeToRefs(userStore)
  </script>

  <template>
    <h1>你好,{{ name }}</h1>
    <NameInput />
  </template>
  ```

  ```vue
  <!-- components/NameInput.vue(子元件,輸入) -->
  <script setup>
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const { name } = storeToRefs(userStore)
  </script>

  <template>
    <input type="text" v-model="name" />
  </template>
  ```

  :::note
  父子元件透過同一個 Store 共享 `name`，子元件輸入時父元件的標題會即時更新，完全不需要 props 或 emit。這就是 Store 最直接的價值。
  :::

### 六、State 操作的多種方式
 
- 修改 state 有三種常見寫法，由簡到繁：直接改、`$patch` 物件形式、`$patch` 函式形式。先看全貌，再逐一拆解。

  ```js
  const counterStore = useCounterStore()
 
  // 1. 直接修改(最常用、最直覺)
  counterStore.count++
  counterStore.name = '新名稱'
 
  // 2. $patch 物件形式:批次「設值」
  counterStore.$patch({
    count: counterStore.count + 1,
    name: '新名稱'
  })
 
  // 3. $patch 函式形式:複雜邏輯、陣列操作
  counterStore.$patch((state) => {
    state.items.push({ id: 1, name: '商品' })
    state.count++
  })
 
  // 4. $reset():僅 Options Store 內建
  counterStore.$reset()  // ❌ Setup Store 沒有,需自行實作
  ```
 
#### 1. 直接修改（最直覺）
 
- 拿到 store 實例後，把 state 當一般變數改即可。單一、少量的修改都用這種。
  ```js
  counterStore.count++
  counterStore.name = '新名稱'
  counterStore.items.push({ id: 1, name: '商品' })  // 陣列也能直接操作
  ```
 
- 缺點：如果一次要改很多個值，就是「一行一次變更」，會觸發多次響應。
#### 2. `$patch` 是什麼？為什麼需要它
 
- **`$patch` 的核心概念：把「多個修改」打包成「一次變更」。**
- 當你一口氣要改好幾個 state，用連續賦值會被記成很多筆獨立變更；`$patch` 則把它們**合併成單一一次**。好處有二：
  - **效能**：只觸發一次響應更新，不是改幾個值就更新幾次。
  -  **可追蹤**：devtools 裡是一筆乾淨紀錄。
  ```js
  // 直接改：這是「兩次」獨立變更 → $subscribe 觸發兩次
  counterStore.count++
  counterStore.name = '新名稱'
 
  // $patch：整包算「一次」變更 → $subscribe 觸發一次
  counterStore.$patch({ count: counterStore.count + 1, name: '新名稱' })
  ```
 
#### 3. `$patch` 物件形式：單純「設值」
 
- 傳一個**物件**進去，Pinia 會把裡面的 key 對應更新到 state 上。適合「把某幾個值設成某個值」。
  ```js
  counterStore.$patch({
    count: counterStore.count + 1,
    name: '新名稱'
  })
  ```
#### 4. `$patch` 函式形式：複雜邏輯 / 陣列操作
 
- 傳一個**函式**進去，**Pinia 會自動把整包 state 當參數丟給你**，讓你在裡面用一般 JavaScript 語法（`push`、`++`、`if`）盡情操作。
  ```js
  counterStore.$patch((state) => {
    state.items.push({ id: 1, name: '商品' })
    state.count++
  })
  ```
 
  :::note
  **`state` 參數：** 它就是「這個 store 自己的所有資料」，由 Pinia 傳進來。所以在函式內：
  - `state.count` 等同 `counterStore.count`
  - `state.items` 等同 `counterStore.items`
  - `state` 只是參數名（叫 `s`、`store` 都行），重點是 Pinia 幫你把資料塞進來了，你直接對它操作即可。
  :::
  :::tip
  **物件形式 vs 函式形式，怎麼選？**
  - 只是「把某幾個值設成某值」→ **物件形式**（簡潔）。
  - 牽涉**陣列操作、依賴當前值、需要 `if` 判斷**等複雜邏輯 → **函式形式**（能用原生 JS 寫法）。
  :::
#### 5. 實務範例：$patch 到底改了什麼
 
- **關鍵觀念：`$patch` 只動你指定的部分。** 它**不是把整個 store 換掉**，而是「你提到哪個就改哪個，其他原封不動」，這叫**部分更新（merge）**。用兩個情境看實際的值怎麼變。
- **範例一（物件形式）：設定頁一次儲存多個欄位**
  ```js
  // stores/settings.js
  export const useSettingsStore = defineStore('settings', () => {
    const nickname = ref('小明')
    const theme = ref('light')
    const notify = ref(true)
    const email = ref('ming@test.com')   // 這次沒動它
    return { nickname, theme, notify, email }
  })
  ```
 
  ```vue
  <script setup>
  import { useSettingsStore } from '@/stores/settings'
  const settings = useSettingsStore()
 
  function saveSettings() {
    settings.$patch({
      nickname: '大明',
      theme: 'dark',
      notify: false
    })
  }
  </script>
  ```
 
  - 改變前後對照：
    | state | 改之前 | 呼叫 `saveSettings()` 之後 |
    | --- | --- | --- |
    | `nickname` | `'小明'` | `'大明'` 改變 |
    | `theme` | `'light'` | `'dark'` 改變 |
    | `notify` | `true` | `false` 改變 |
    | `email` | `'ming@test.com'` | `'ming@test.com'` ⬅ **沒提到，不變** |
  - 三個值在「一次變更」裡同時更新，畫面只刷新一次。`email` 因為沒放進 `$patch`，完全不受影響。
  
- **範例二（函式形式）：一鍵加購組合（含陣列操作）**
 
   ```vue
  <script setup>
  import { useCartStore } from '@/stores/cart'
  const cart = useCartStore()
 
  // product 由使用者點的按鈕帶進來
  function addToCart(product) {
    cart.$patch((state) => {
      const existing = state.items.find(i => i.id === product.id)
      if (existing) {
        existing.quantity++                             // 已存在 → 數量 +1
      } else {
        state.items.push({ ...product, quantity: 1 })   // 新的 → 推進去
      }
      state.lastUpdated = Date.now()
    })
  }
  </script>
 
  <template>
    <div v-for="product in productList" :key="product.id">
      {{ product.name }}
      <button @click="addToCart(product)">加入購物車</button>
    </div>
  </template>
  ``
 
- 若是「組合包」內容由後端決定，就先打 API 再一次加入：
  ```js
  async function addBundle(bundleId) {
    const res = await axios.get(`/api/bundles/${bundleId}`)
    const products = res.data.items   // 組合內容由後端回傳
 
    cart.$patch((state) => {
      products.forEach(p => state.items.push({ ...p, quantity: 1 }))
      state.lastUpdated = Date.now()
    })
  }
  ```
 
  :::note
  **實戰：這段邏輯通常會收進 action，而不是寫在元件裡**。而且一旦搬進 action，`$patch` 常常就不需要了，因為 action 本身就是一個語意完整的操作單位，直接改 state 即可：
  ```js
  // stores/cart.js
  export const useCartStore = defineStore('cart', () => {
    const items = ref([])
    const lastUpdated = ref(null)
 
    function addToCart(product) {
      const existing = items.value.find(i => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        items.value.push({ ...product, quantity: 1 })
      }
      lastUpdated.value = Date.now()   // 沒用 $patch,直接改
    }
 
    return { items, lastUpdated, addToCart }
  })
  ```
 
  ```vue
  <!-- 元件只要一行 -->
  <button @click="cart.addToCart(product)">加入購物車</button>
  ```
 
  所以 `$patch` 真正的高頻場景，其實是「表單一次送出多欄位」，而不是加購這類已經封裝進 action 的操作。
  :::

#### 6. `$reset()`：把 state 歸零
 
- Options Store 有內建的 `$reset()` 能一鍵還原成初始值；**Setup Store 沒有，要自己實作**：
  ```js
  export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
 
    function $reset() {
      count.value = 0
    }
 
    return { count, $reset }
  })
  ```
 
  ```vue
  <template>
    <div>
      <h2>計數器: {{ count }}</h2>
      <button @click="increment">+1</button>
      <button @click="$reset">重置</button>
    </div>
  </template>
  ```
 


### 七、Getters 實務範例

- Getters 在 Setup Store 中就是 `computed()`，會自動快取結果。

  ```js
  export const useCartStore = defineStore('cart', () => {
    const items = ref([
      { id: 1, name: '蘋果', price: 30, quantity: 2 },
      { id: 2, name: '香蕉', price: 20, quantity: 5 }
    ])

    // 總商品數
    const totalCount = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    // 總金額
    const totalPrice = computed(() =>
      items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    )

    // 是否為空
    const isEmpty = computed(() => items.value.length === 0)

    // 帶參數的 getter(回傳函式)
    const getItemById = computed(() => {
      return (id) => items.value.find(item => item.id === id)
    })

    return { items, totalCount, totalPrice, isEmpty, getItemById }
  })
  ```

- 在元件中使用帶參數的 getter：

  ```vue
  <template>
    <p>{{ cartStore.getItemById(1)?.name }}</p>
  </template>
  ```

  :::note
  **帶參數的 getter 不會快取。** 一般 getter 有快取，但「回傳函式」的 getter（像上面的 `getItemById`）因為每次呼叫參數可能不同，等於每次都重算，這是正常的取捨。
  :::

### 八、Actions 實務範例

#### 1. 同步 Action

  ```js
  export const useCartStore = defineStore('cart', () => {
    const items = ref([])

    function addItem(product) {
      const existing = items.value.find(item => item.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        items.value.push({ ...product, quantity: 1 })
      }
    }

    function removeItem(id) {
      items.value = items.value.filter(item => item.id !== id)
    }

    return { items, addItem, removeItem }
  })
  ```

#### 2. 非同步 Action（API 串接）

  ```js
  import { ref } from 'vue'
  import { defineStore } from 'pinia'
  import axios from 'axios'

  export const useProductStore = defineStore('product', () => {
    const products = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    async function fetchProducts() {
      isLoading.value = true
      error.value = null
      try {
        const res = await axios.get('/api/products')
        products.value = res.data
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return { products, isLoading, error, fetchProducts }
  })
  ```

- 在元件中使用：

  ```vue
  <script setup>
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useProductStore } from '@/stores/product'

  const productStore = useProductStore()
  const { products, isLoading, error } = storeToRefs(productStore)

  onMounted(() => {
    productStore.fetchProducts()
  })
  </script>

  <template>
    <div v-if="isLoading">載入中...</div>
    <div v-else-if="error">錯誤:{{ error }}</div>
    <ul v-else>
      <li v-for="p in products" :key="p.id">{{ p.name }}</li>
    </ul>
  </template>
  ```

  :::note
  **把 `isLoading`、`error` 也放進 Store：** 這樣任何元件都能共用同一份載入 / 錯誤狀態，不用每個頁面各自維護一份，是很常見的作法。
  :::

### 九、Store 之間互相引用

- 實務上常見「購物車 Store」需要引用「使用者 Store」的情境。

  ```js
  // stores/user.js
  import { ref, computed } from 'vue'
  import { defineStore } from 'pinia'

  export const useUserStore = defineStore('user', () => {
    const userId = ref(null)
    const isLoggedIn = computed(() => !!userId.value)

    function login(id) {
      userId.value = id
    }

    return { userId, isLoggedIn, login }
  })
  ```

  ```js
  // stores/cart.js
  import { ref } from 'vue'
  import { defineStore } from 'pinia'
  import { useUserStore } from './user'

  export const useCartStore = defineStore('cart', () => {
    const items = ref([])

    function checkout() {
      // 在 Store 內部呼叫其他 Store
      const userStore = useUserStore()

      if (!userStore.isLoggedIn) {
        alert('請先登入')
        return
      }

      console.log(`使用者 ${userStore.userId} 結帳`)
    }

    return { items, checkout }
  })
  ```

  :::warning
  **要在函式內部呼叫另一個 Store，不要放在檔案頂層。** 頂層執行的時機 Pinia 可能還沒安裝完成；寫在 action（函式）裡才保證取得到實例。這跟路由守衛裡「`usexxxStore()` 要寫在 `beforeEach` 內部」是同一個道理。
  :::

### 十、在 Store 中使用其他 Composition API

- Setup Store 的最大優勢：可以直接使用 `useRouter`、`useRoute`、`useI18n` 等 composable。

  ```js
  import { ref } from 'vue'
  import { defineStore } from 'pinia'
  import { useRouter } from 'vue-router'

  export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const token = ref(null)

    function logout() {
      token.value = null
      localStorage.removeItem('token')
      router.push('/login')   // 直接在 Store 中導航
    }

    return { token, logout }
  })
  ```

  :::note
  這是 Setup Store 相對 Options Store 的明顯優勢：composable 直接拿來用，不必再繞一層。登入 / 登出後在 Store 內直接導頁，就是最常見的例子。
  :::

### 十一、實戰範例：購物車

- 完整的購物車 Store，整合 state、getters、actions。

  ```js
  // stores/cart.js
  import { ref, computed } from 'vue'
  import { defineStore } from 'pinia'

  export const useCartStore = defineStore('cart', () => {
    // State
    const items = ref([])

    // Getters
    const totalCount = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    const totalPrice = computed(() =>
      items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    )

    const isEmpty = computed(() => items.value.length === 0)

    // Actions
    function addItem(product) {
      const existing = items.value.find(item => item.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        items.value.push({ ...product, quantity: 1 })
      }
    }

    function removeItem(id) {
      items.value = items.value.filter(item => item.id !== id)
    }

    function updateQuantity(id, quantity) {
      const item = items.value.find(item => item.id === id)
      if (item) {
        if (quantity <= 0) {
          removeItem(id)
        } else {
          item.quantity = quantity
        }
      }
    }

    function clearCart() {
      items.value = []
    }

    return {
      items,
      totalCount,
      totalPrice,
      isEmpty,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }
  })
  ```

- 元件使用：

  ```vue
  <script setup>
  import { storeToRefs } from 'pinia'
  import { useCartStore } from '@/stores/cart'

  const cartStore = useCartStore()
  const { items, totalCount, totalPrice, isEmpty } = storeToRefs(cartStore)
  const { addItem, removeItem, updateQuantity, clearCart } = cartStore

  // 範例:加入商品
  function handleAdd() {
    addItem({ id: 1, name: '蘋果', price: 30 })
  }
  </script>

  <template>
    <div>
      <h2>購物車({{ totalCount }} 件)</h2>

      <div v-if="isEmpty">購物車是空的</div>

      <ul v-else>
        <li v-for="item in items" :key="item.id">
          {{ item.name }} - ${{ item.price }}
          <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          <button @click="removeItem(item.id)">移除</button>
        </li>
      </ul>

      <p>總金額:${{ totalPrice }}</p>
      <button @click="clearCart">清空購物車</button>
    </div>
  </template>
  ```

### 十二、實戰範例：使用者登入驗證

#### 1. Auth Store

  ```js
  // stores/auth.js
  import { ref, computed } from 'vue'
  import { defineStore } from 'pinia'
  import { useRouter } from 'vue-router'
  import axios from 'axios'

  export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    // State
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    // Getters
    const isLoggedIn = computed(() => !!token.value)
    const userName = computed(() => user.value?.name || '訪客')

    // Actions
    async function login(email, password) {
      try {
        const res = await axios.post('/api/login', { email, password })

        token.value = res.data.token
        user.value = res.data.user

        // 儲存 token
        localStorage.setItem('token', token.value)

        // 設定 axios 預設 header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

        // 導向首頁
        router.push('/')
      } catch (err) {
        throw new Error(err.response?.data?.message || '登入失敗')
      }
    }

    function logout() {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }

    async function fetchUserInfo() {
      if (!token.value) return
      try {
        const res = await axios.get('/api/user/me')
        user.value = res.data
      } catch (err) {
        logout()  // token 失效時自動登出
      }
    }

    return {
      user,
      token,
      isLoggedIn,
      userName,
      login,
      logout,
      fetchUserInfo
    }
  })
  ```

#### 2. 路由守衛

  ```js
  // router/index.js
  import { createRouter, createWebHistory } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      // {
      //   path: '/profile',
      //   component: ProfileView,
      //   meta: { requiresAuth: true }   // 加上 meta 標記此頁需要登入
      // }
    ]
  })

  router.beforeEach((to) => {
    // 必須在守衛內部呼叫 store,不能放在檔案頂層
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      return '/login'   // 未登入 → 導向登入頁
    }
    // 什麼都不 return → 放行
  })

  export default router
  ```

  :::note
  這裡採 Vue Router 4 建議的 `return` 寫法（`return 路由` 表示改導向、`return false` 取消、什麼都不 return 就放行），比舊式的 `next()` 回呼更不容易漏寫而卡住畫面。詳見 Vue Router 導航守衛筆記。
  :::

#### 3. 登入頁面元件

  ```vue
  <script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const email = ref('')
  const password = ref('')
  const errorMsg = ref('')

  async function handleLogin() {
    try {
      await authStore.login(email.value, password.value)
    } catch (err) {
      errorMsg.value = err.message
    }
  }
  </script>

  <template>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="密碼" />
      <button type="submit">登入</button>
      <p v-if="errorMsg">{{ errorMsg }}</p>
    </form>
  </template>
  ```


### 十三、參考資源

- [Pinia 官方文件（繁中）](https://pinia.vuejs.org/zh/)
- [Pinia — 何時該使用 Store](https://pinia.vuejs.org/zh/core-concepts/)
- [Pinia — State（$patch 官方說明）](https://pinia.vuejs.org/zh/core-concepts/state.html)