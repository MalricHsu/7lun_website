---
title: Vue｜ Vue 元件概念
sidebar_position: 5
tags: [Vue, JavaScript, 知識點筆記]
date: 2026-05-04
slug: vue/vue-component-concepts
---


### 一、元件與 Props / Emits 架構

![Vue 元件課程架構圖](/img/vue03-1.svg)
- [元件傳遞範例](https://play.vuejs.org/#eNqlVltvG0UU/iujDSiJlLXdEAe0JFFDCVKQKBEJAoQrdbwztive3RnNzPpSyy8gVFGB4IUXhBBCQipv5SIBon/HafvEX+DMzN68sUxFX5Kdc59zznyfZ96xEI1RSr3AO9A0FhHW9KiTIHRA2AgxctjxsBAdD4URVgpOIU80ZgmVHc/aZZa5WvJxoQBVHhKN/B6XoN/qyZTpHcQSQifb8A9ZwZtYY0gSDOkUjKyyEqaWI+TRkhLUt7AkVQFCAYv778sIzG2Chjt2vJqVZjqihZE9XbMRkoWljT1dswl5mujCxp7qNjcxIb6QnKShsRzghET0mJALDtXXrJvVuzfh8mVLm0tjqqrzryUTOKpQMqGRojoVIGGx4FKjGZK0h+bQfx6jTViBzdcLnWlnpmg0zcGsiNF3Epi/0qhWPDpEbrAXpoHb6PAIzUxFzjimSuE+BaO7V588XPzx6+LRffTSrHSYo8WDHxaf/fT0t8dPPv/56d8P7kIqhHBEpd7KvLdBNC8LKLYGosI9tj42DjYnQnaKAdqExY3o5o4T2rEFaLedne2IAtRuZWe3H+A10FqooNlkZmVSCbOMm+M99dEH0XnjUtD+prGfW69aPi5x0q8nvFFLuPtcCc/O43vxh+w/Eiot8bhLpZzWku7Vkt54rqRvnb4TD/YHDZH0XbyVSYdszGrp2v/rjhenx/ujvbhyx05yx4z5oOk2NttePY3MIoNPhjyuojEjemCu1nrZbkuMJ34u2221xCSTyj5LAtRCONXcigS8Q5b0wWzfGtmtagBwubiEKXg70wD1IupimA9/LLEIkPm7FNd/rRIDgMnFMB4mZwv2y1VXJHX2CHX5xFfsnpV1uSRU+iByoaAB2aW9HU8ruHiP9RuXiicA0zaBAcFYMHgg7wrN4EV0vCAfFCB2FPHx21amZUqzYYDPgIbDFfJLBWgbwMeZpIrKEcBbodNwUQroZNQn57fpBL4LZQxgZgBzjfI9qniUmhqd2RupQQ5gj8LOVntqgQe6caFOJpomKr+UKbTcxY4HQHRrzdXLcl9p7GVLNYcu5iC2mucKZjE0UvAarCoKlAwNI2XssWTpg9TX3LBjgCOD6Rl/rCJG69DlZFqlx0F7WZ/7Xz36/er77xZff/nk4S//PP52NnOvD83nB81Bu/QXNXc7gKPFp389++JH52dfqPUz0L/W7eqbP5/d/8q52Ydcd8NoAFALXhuVRnQ1DBbdDCMWDoEb6YhaHoR1P3NUZwpaRveDJn5h7iK0B1AAKYTayQ4nMdOqTmg5XwDvCgVcUfHbskuTQ9S5lrB9dskypKtIMpy7ncaAtlaSIV0hmRvgypNRW0mezNYFBGV6kvN/x7uznVuXrTI0un14ZOuyMbZqTjv2Gu5nCvg7qKhjJQLAEJRYyDQ8bsM5iAHMExMED5IRtEEIyZDIoo/EhKUKuCMDKD6isgcvM0ADRghNSpSrrP4SFO+2HdYVCNqNeDhcgksDuTkSV6KZd+FCrQbn8nFk+ApUYNDT8Gtjty1pXMkC0bTmcQ611Qiw6C7AGktY6BoRsCSCMfrlbapgnhcKfcThsC9hL4gPRMCh2Rut1qvdXs9qc1EvO5tafByxPnQlhDdD5bphWGtCQ/iJYTAvQAlP6DWymP8LM2X4Aw==)

### 二、Vue 元件概念

#### 1. 從組裝電腦理解元件化

- [組裝電腦範例](https://play.vuejs.org/#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)

- 你要組裝一台電腦，會挑選 CPU、主機板、記憶體、顯卡等零件，再把它們組裝起來成為一台完整的電腦。
- **組電腦的思維，正好就是元件化開發的核心邏輯：** 把複雜系統拆成多個職責單一、可獨立運作的零件，再透過標準化的介面組裝起來。
- **關鍵特質：** 獨立、可重用、可組合。

  | 面向 | 電腦硬體 | Vue 元件 |
  |------|---------|---------|
  | 基本單位 | CPU、主機板、記憶體 | Button、Card、Modal |
  | 功能性質 | 每個硬體有獨立功能 | 每個元件有獨立功能 |
  | 重用性 | 硬體可以重複使用 | 元件可以重複使用 |
  | 組合方式 | 組裝成完整電腦 | 組合成完整網頁 |

#### 2. 資料傳輸機制

- 硬體之間透過介面（USB、HDMI）傳遞訊號；Vue 元件之間則透過 **Props** 與 **Emit** 傳遞資料。

- 硬體訊號流：

  | 方向 | 路徑 |
  |------|------|
  | 輸入 | 鍵盤 → USB → 主機板 → CPU |
  | 輸出 | 螢幕 ← HDMI ← 顯卡 ← 主機板 |

- Vue 元件資料流 —— **單向數據流原則：** 資料只能由父往子（**Props**）傳；子層若要影響父層，必須透過事件（**Emit**）通知，不能直接修改父層資料。

  | 方向 | 機制 | 路徑 |
  |------|------|------|
  | 向內傳遞資料 | **Props** | 父元件 → 子元件 |
  | 向外傳遞事件 | **Emit** | 子元件 → 父元件 |

#### 3. 為什麼要使用元件

- 元件化不是一開始就要做的事，而是當程式碼出現以下情況時的解決方案：
  - **程式碼過長** —— 單一檔案太肥，難以維護
  - **重複使用需求** —— 相同 UI 結構在多處出現
  - **邏輯職責拆分** —— 不同功能應由獨立元件處理
  - **路由頁面切分** —— 搭配 Vue Router 時，每個頁面就是一個元件

  :::note
  - **判斷時機：** 不是「先拆元件再寫」，而是「寫到一個程度發現需要拆」才拆。
  :::

#### 4. 元件建構起手式

- 建立一個新元件的標準流程，共四個步驟：
  - **建立新檔案** —— 在 `components/` 資料夾下新增 `.vue` 檔
  - **撰寫 `<template>`** —— 加入基本 HTML 結構
  - **在父層 `import`** —— 引入元件
  - **呈現在畫面上** —— 透過標籤使用該元件

#### 5. 元件四大特性

  | 特性 | 說明 |
  |------|------|
  | **狀態獨立** | 每個元件管理自己的內部狀態，互不干擾 |
  | **封裝** | 內部實作細節對外隱藏，只透過 Props/Emit 溝通 |
  | **可重複使用** | 一次撰寫，可在多處引用 |
  | **Props 支援** | 接受外部傳入的參數，讓元件具備彈性 |

### 三、元件資料傳遞

#### 1. Props 和 Emit 基本介紹

- 在 Vue 中，元件是獨立的單位，每個元件有自己的資料和狀態，**彼此預設是隔離的**。但實際開發時，父子元件需要溝通：
  - 父層想把資料「**傳進**」子層 → 用 **Props**
  - 子層想把事件「**通知**」父層 → 用 **Emit**
- **單向數據流：**資料只能父 → 子，反過來必須**透過事件**，這是 Vue 的核心原則。

#### 2. Props：外到內（父 → 子）

- [Props 範例](https://play.vuejs.org/#eNqlVd+LG0Uc/1eGPSR3kM2m8XLKmh7UWuEE6+FVVIwPm53ZZC67M8PMbH405ElELIq++CIiIgj6puiDYv+du7ZP/gt+Z2Y3u9mGtLQvyX5///7MyrslRGeWEy/0BppkIo00OR0yhAaYzhDFN4deJMTQQ3EaKQVUzJmOKCNy6Fm9QrMUSz7fCEBUukQzP+ES5IeJzKluI8owWRzBH7KMtyIdQZBwSpagZIU1N40YMU+3hCC+HUmMQk11SkDBuuxYyjgVksYV21KGHfOc6Q3bUoZNs7Gfy3QjAPoDCQGDejoB5FNVGWx1ri4uv7ZUgFSxpEIjRXQugEMzwaVGKyRJgtbQEp6hFkyl9cZGZit0gk5gCDM1Ix8yGInSVR/RTePm8BMTf+USsq0IUQtGmZJW2zFtI0LU6xe07UCI+t2CdoWD1URrocIgoKYXuYRWZcH8WH38YXrRuRRk3DL6a2vViMdlxMbNgDcaAXvPFfD8IruffUSfEVBpGc1HRMplI+hxI+iN5wr69tm72eRk0hFs7PztDDqlc9oI13+hGu+d3TqZHWe1Gofs0yOY8SBwC1Msj16mZo/AprhFl9GcYj0xpXVfARuEsmjhl7xetysWBVeOKQtRF0W55pYlIowpG4PaiVWCsOAdTtn5xVTB6i5DlKTE+TAf/lxGIkTmd8uv/3rNB5yq82EsTMwu7JfLbhPU6SM04gtf0fuWN+ISE+kDy7mCBhRFe21PKyg8oePOpeIMgMsGMLCQCZoS+Z7QFC5i6IXloADD0pTP37E8LXNSDANsJiSe7uBfKsCfED7OJVFEzgAwNjINhRKACiO+c3GXLOB7I8w4zg3q7BG+TxRPc5OjU3szZxjSrunZbM/s3UM37qk7C02YKosyiVa7OPQAB27vKb1K99XOcbFUa+hiiSG7kX+DtaBVIT2sKgqVjA1GF7C4pekb8NTcvBdhlBpwLUB411NhDUYcL+sPxqS/LS/tr3//6/rHH66+/frRr3/89/D71cpdH1qvB8GkX9mLhrkdwOnVZ/88+epnZ2cv1NoZ5N1rdv3d30+++MaZ2UNumkVoAlALVge1Row0DPb06sFPV5//8vjPh4++/O3xvw8GQfTSjwMmCRz7ueRCNR+Jmuhw5XDpQktYnrYDpLt5BqjYdmhUEAUUOb31kQ39NM4gODZBsIUb8wTZvXLnCXghFgiWmWJ0gDEurtherowwzRXgbnHcfEZkAlsdognFmLAKIWprswVjvb7DiQ36jFIeT7egxsBViWI1b2annKvdwFYtVoFNAKMGeczb1On1JclqUcCb1jwrYaruAZbEOdijCcvQAFHKUhiVX1VTB8IyUehjFE/HEuaFfQBRDs0+6HZfGyWJlZaspKBNLn6U0jF0JSZME7lvGFYbkxieZ4MXIWKckaeAdv0/YTlmYg==)

- 概念：Props 是父元件傳遞給子元件的「**參數**」，讓子元件可以根據不同資料呈現不同內容。
- 使用步驟：
  - 父層在使用子元件時，用 `:屬性名="資料"` 綁定
  - 子層用 `defineProps()` 宣告要接收的參數
  - 子層 template 內可直接使用 `props.屬性名`
- 重要規則：
  - **單向數據流：** 子層不能直接修改 props 的值
  - **HTML 屬性一律小寫：** JS 端用 `userName`，HTML 端要寫 `:user-name`
  - 建議定義 `type` 和 `required`，讓型別更明確
- 範例：卡片元件 → **結果：** 子層卡片元件顯示出父層傳入的標題和內容。

  - **父層 `Parent.vue`**

    ```vue
    <script setup>
    import Card from './components/Card.vue'

    const cardTitle = '今日特餐'
    const cardContent = '招牌牛肉麵 NT$180'
    </script>

    <template>
      <Card :title="cardTitle" :content="cardContent" />
    </template>
    ```

  - **子層 `Card.vue`**

    ```vue
    <script setup>
    const props = defineProps({
      title: { type: String, required: true },
      content: { type: String, default: '' }
    })
    </script>

    <template>
      <div class="card">
        <h3>{{ props.title }}</h3>
        <p>{{ props.content }}</p>
      </div>
    </template>
    ```

#### 3. Emit：內到外（子 → 父）

- 概念：當子元件內部發生事件（例如按鈕被點擊、輸入框內容改變），需要通知父層處理時，就用 **Emit** 把事件「**發射**」出去。
- 使用步驟：
  - 子層用 `defineEmits()` 宣告會發出哪些事件
  - 子層在需要時呼叫 `emit('事件名', 參數)`
  - 父層用 `@事件名="處理函式"` 監聽
- 口訣 —— **前內後外：**
  - 寫 `@emit-text="applyText"` 時：
    - **前面**（`emit-text`）是 **內部（子層）** 發出的事件名
    - **後面**（`applyText`）是 **外部（父層）** 的處理函式
- 範例：子層通知父層更新標題 → **結果：** 在子層輸入框打字並按下按鈕，父層的標題就會更新。

  - **父層 `Parent.vue`**

    ```vue
    <script setup>
    import { ref } from 'vue'
    import Card from './components/Card.vue'

    const title = ref('原始標題')

    const applyText = (newText) => {
      if (!newText) return
      title.value = newText
    }
    </script>

    <template>
      <p>父層標題:{{ title }}</p>
      <Card @emit-text="applyText" />
    </template>
    ```

  - **子層 `Card.vue`**

    ```vue
    <script setup>
    import { ref } from 'vue'

    const emit = defineEmits(['emit-text'])
    const text = ref('')

    const send = () => {
      emit('emit-text', text.value)
    }
    </script>

    <template>
      <div>
        <input v-model="text" placeholder="輸入新標題..." />
        <button @click="send">套用到父層</button>
      </div>
    </template>
    ```

- Emit 事件觸發完整流程 8 步驟：
  -  **渲染階段：** 父層渲染 `<Card @emit-text="applyText" />`，Vue 登記事件監聽器
  - **子層初始化：** 建立 `emit`、`text`、`send` 函式
  -  **使用者輸入：** 在 input 打字，`text.value` 即時更新
  - **點擊觸發：** 點按鈕進入 `send()`
  - **子層發射事件：** `emit('emit-text', text.value)` 同步把資料交給父層
  - **父層接收處理：** 父層 `applyText(newText)` 執行，更新 `title.value`
  - **標記更新：** Vue 標記要重新渲染，排入下一個 tick
  - **畫面更新完成：** DOM 更新，新標題顯示在畫面上

#### 4. Props vs Emit 對照速查

  | 比較項目 | Props | Emit |
  |---------|-------|------|
  | **方向** | 外 → 內（父 → 子） | 內 → 外（子 → 父） |
  | **用途** | 傳遞資料 | 通知事件 |
  | **宣告方式** | `defineProps()` | `defineEmits()` |
  | **使用方式** | `props.屬性名` | `emit('事件名', 參數)` |
  | **父層綁定** | `:屬性名="資料"` | `@事件名="處理函式"` |
  | **可否修改** | 子層**不可**修改 | 子層**主動**觸發 |

### 四、跨層元件溝通

#### 1. 關於 Provide / Inject

- Props 和 Emit 雖然方便，但有個痛點 —— **只能在父子之間傳遞**。
- 當元件層級很深時，例如：

  ```
  App
   └── Layout
        └── Sidebar
             └── UserMenu
                  └── Avatar  ← 想用 App 的使用者資料
  ```

- 如果用 Props 一層層傳下去，中間的 `Layout`、`Sidebar`、`UserMenu` 明明用不到，卻得負責轉手，這種現象叫 **Props Drilling（逐層鑽透）**，維護起來很痛苦。
- **Provide / Inject** 就是解法：讓**祖先元件直接把資料提供給任意層級的後代**，中間元件不用管。

#### 2. 核心概念

- 可以想像成祖先把資料「廣播」出去，任何層級的後代都能「接收」，不需要中間人轉發。

  | 角色 | 動作 | 函式 |
  |------|------|------|
  | **祖先元件** | 提供資料 | `provide()` |
  | **後代元件** | 注入使用 | `inject()` |

#### 3. 基本用法

- 使用步驟：
  - 祖先層 `import { provide } from 'vue'`，並用 `provide('鍵名', 資料)` 提供
  - 後代層 `import { inject } from 'vue'`，並用 `inject('鍵名')` 接收
  - 兩端的「鍵名」必須一致

- 範例：祖父傳資料給孫子 → **結果：** 孫子層直接拿到祖父的資料，中間的父層完全不用參與。

  - **祖父層 `Grandparent.vue`**

    ```vue
    <script setup>
    import { provide } from 'vue'
    import Parent from './Parent.vue'

    provide('userName', '小明')
    provide('theme', 'dark')
    </script>

    <template>
      <Parent />
    </template>
    ```

  - **父層 `Parent.vue`（中間層，什麼都不用做）**

    ```vue
    <script setup>
    import Child from './Child.vue'
    </script>

    <template>
      <Child />
    </template>
    ```

  - **孫子層 `Child.vue`**

    ```vue
    <script setup>
    import { inject } from 'vue'

    const userName = inject('userName')
    const theme = inject('theme')
    </script>

    <template>
      <p>使用者:{{ userName }}</p>
      <p>主題:{{ theme }}</p>
    </template>
    ```

#### 4. 傳遞響應式資料

- 如果想讓後代的資料**跟著祖先變動**，要用 `ref` 或 `reactive` 包起來再 provide。
- **結果：** 祖先按按鈕，後代畫面同步更新。

  - **祖先層**

    ```vue
    <script setup>
    import { ref, provide } from 'vue'

    const count = ref(0)
    provide('count', count)

    const addCount = () => count.value++
    </script>

    <template>
      <button @click="addCount">祖先 +1</button>
    </template>
    ```

  - **後代層**

    ```vue
    <script setup>
    import { inject } from 'vue'

    const count = inject('count')
    </script>

    <template>
      <p>後代看到的數字:{{ count }}</p>
    </template>
    ```

#### 5. 設定預設值

- 如果擔心後代被獨立使用、找不到祖先的資料，可以給 `inject` 第二個參數當預設值，這樣即使祖先沒提供，後代也不會壞掉。

  ```js
  // 找不到 userName 時，預設為「訪客」
  const userName = inject('userName', '訪客')
  ```

#### 6. Symbol 作為鍵名

- 當應用變大時，字串鍵名可能撞名。可以用 `Symbol` 確保唯一性。

  - **建立共用 keys 檔 `injectKeys.js`**

    ```js
    export const userKey = Symbol('user')
    export const themeKey = Symbol('theme')
    ```

  - **祖先層**

    ```js
    import { provide } from 'vue'
    import { userKey } from './injectKeys'

    provide(userKey, { name: '小明', age: 20 })
    ```

  - **後代層**

    ```js
    import { inject } from 'vue'
    import { userKey } from './injectKeys'

    const user = inject(userKey)
    ```

#### 7. 什麼時候該用 Provide / Inject

- 適合使用的情境：
  - 跨多層元件共用資料（主題、語系、使用者資訊）
  - 全域設定、權限資訊
  - 取代頻繁的 Props Drilling
- 不適合使用的情境：
  - 父子元件直接溝通 → 用 **Props / Emit** 就好
  - 跨多個無關元件的全域狀態 → 用 **Pinia** 等狀態管理工具更合適
  - 簡單的單次資料傳遞 → 別過度設計

#### 8. Props / Emit / Provide / Inject 對照

  | 機制 | 方向 | 適用範圍 | 特性 |
  |------|------|---------|------|
  | **Props** | 父 → 子 | 直接父子層 | 傳資料、單向 |
  | **Emit** | 子 → 父 | 直接父子層 | 通知事件 |
  | **Provide** | 祖先 → 後代 | 任意層級後代 | 提供資料 |
  | **Inject** | 後代接收 | 任意層級後代 | 取得資料 |

### 五、點餐系統作業

#### App.vue

  ```vue
  <template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-12 mb-3">
          <h2 class="h2">餐點管理工具</h2>
          <hr />
        </div>
        <div class="col-md-4">
          <List :drinks="drinks" @add-cart="addCart" />
        </div>
        <div class="col-md-8">
          <Cart
            :carts="carts"
            :total="total"
            :description="description"
            @create-order="createOrder"
            @delete-item="deleteItem"
            @update-qty="updateQty"
            @update-description="updateDescription"
          />
        </div>
      </div>
      <hr />
      <div class="row justify-content-center">
        <div class="col-8">
          <Order :orders="orders" />
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { computed, ref } from "vue";
  import List from "./components/List.vue";
  import Cart from "./components/Cart.vue";
  import Order from "./components/Order.vue";

  const data = [
    {
      id: 1,
      name: "珍珠奶茶",
      description: "香濃奶茶搭配QQ珍珠",
      price: 50,
    },
    {
      id: 2,
      name: "冬瓜檸檬",
      description: "清新冬瓜配上新鮮檸檬",
      price: 45,
    },
    {
      id: 3,
      name: "翡翠檸檬",
      description: "綠茶與檸檬的完美結合",
      price: 55,
    },
    {
      id: 4,
      name: "四季春茶",
      description: "香醇四季春茶，回甘無比",
      price: 45,
    },
    {
      id: 5,
      name: "阿薩姆奶茶",
      description: "阿薩姆紅茶搭配香醇鮮奶",
      price: 50,
    },
    {
      id: 6,
      name: "檸檬冰茶",
      description: "檸檬與冰茶的清新組合",
      price: 45,
    },
    {
      id: 7,
      name: "芒果綠茶",
      description: "芒果與綠茶的獨特風味",
      price: 55,
    },
    {
      id: 8,
      name: "抹茶拿鐵",
      description: "抹茶與鮮奶的絕配",
      price: 60,
    },
  ];

  const drinks = ref(data);
  const carts = ref([]);
  const orders = ref({});
  const description = ref("");

  const addCart = (drink) => {
    const existDrink = carts.value.find((item) => item.id === drink.id);
    if (existDrink) {
      if (existDrink.quantity < 10) {
        existDrink.quantity += 1;
      } else {
        alert("飲料最多只能點10杯");
      }
    } else {
      carts.value.push({
        ...drink,
        quantity: 1,
      });
    }
    console.log("目前購物車內容:", carts.value);
  };

  const updateQty = (id, newQuantity) => {
    const update = carts.value.find((item) => item.id === id);
    if (update) {
      update.quantity = newQuantity;
    }
  };

  const deleteItem = (id) => {
    carts.value = carts.value.filter((item) => item.id !== id);
  };

  const total = computed(() => {
    return carts.value.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  });

  const updateDescription = (value) => {
    description.value = value;
  };

  const createOrder = () => {
    orders.value = {
      id: new Date().getTime(),
      carts: [...carts.value],
      description: description.value,
      total: total.value,
    };
    carts.value = [];
    description.value = "";
  };
  console.log(orders.value);
  </script>
  ```

#### List.vue

  ```vue
  <template>
    <div class="list-group">
      <a
        v-for="drink in drinks"
        :key="drink.id"
        @click.prevent="addCart(drink)"
        href="#"
        class="list-group-item list-group-item-action"
        ><div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ drink.name }}</h5>
          <small>$ {{ drink.price }}</small>
        </div>
        <p class="mb-1">{{ drink.description }}</p></a
      >
    </div>
  </template>
  <script setup>
  import { defineProps, defineEmits } from "vue";
  const props = defineProps({
    drinks: Array,
  });
  const emits = defineEmits(["add-cart"]);

  const addCart = (drink) => {
    emits("add-cart", drink);
  };
  </script>
  ```

#### Cart.vue

  ```vue
  <template>
    <table class="table">
      <thead>
        <tr>
          <th scope="col" width="50">操作</th>
          <th scope="col">品項</th>
          <th scope="col">描述</th>
          <th scope="col" width="90">數量</th>
          <th scope="col">單價</th>
          <th scope="col">小計</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cart in carts" :key="cart.id">
          <td>
            <button
              @click.prevent="deleteItem(cart.id)"
              type="button"
              class="btn btn-sm"
            >
              x
            </button>
          </td>
          <td>{{ cart.name }}</td>
          <td>
            <small>{{ cart.description }}</small>
          </td>
          <td>
            <select
              class="form-select"
              :value="cart.quantity"
              @change="updateQty(cart.id, $event)"
            >
              <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
            </select>
          </td>
          <td>{{ cart.price }}</td>
          <td>{{ cart.price * cart.quantity }}</td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="carts.length === 0"
      class="alert alert-primary text-center"
      role="alert"
    >
      請選擇商品
    </div>
    <div v-else class="text-end mb-3">
      <h5>
        總計: <span>$ {{ total }}</span>
      </h5>
    </div>
    <textarea
      class="form-control mb-3"
      rows="3"
      placeholder="備註"
      :value="description"
      @input="updateDescription($event)"
    ></textarea>
    <div class="text-end">
      <button @click.prevent="createOrder" class="btn btn-primary">送出</button>
    </div>
  </template>
  <script setup>
  import { defineProps, defineEmits } from "vue";
  const props = defineProps({
    carts: Array,
    total: Number,
    description: String,
  });
  const emits = defineEmits([
    "delete-item",
    "create-order",
    "update-qty",
    "update-description",
  ]);
  const deleteItem = (id) => {
    emits("delete-item", id);
  };
  const createOrder = () => {
    emits("create-order");
  };
  const updateQty = (id, event) => {
    emits("update-qty", id, parseInt(event.target.value));
  };
  const updateDescription = (event) => {
    emits("update-description", event.target.value);
  };
  </script>
  ```

#### Order.vue

  ```vue
  <template>
    <div v-if="!orders.id" class="alert alert-secondary text-center" role="alert">
      尚未建立訂單
    </div>
    <div v-else class="card">
      <div class="card-body">
        <div class="card-title">
          <h5>訂單</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">品項</th>
                <th scope="col">數量</th>
                <th scope="col">小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders.carts" :key="order.id">
                <td>{{ order.name }}</td>
                <td>{{ order.quantity }}</td>
                <td>{{ order.price * order.quantity }}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-end">
            備註: <span>{{ orders.description }}</span>
          </div>
          <div class="text-end">
            <h5>
              總計: <span>$ {{ orders.total }}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { defineProps } from "vue";
  const props = defineProps({ orders: Object });
  </script>
  ```

### 六、資料來源
- [第三週講義](https://hackmd.io/1EDcX6WsQc2VIzs9zJ5Dtg)
- [助教講義](https://chalk-freedom-ec6.notion.site/2516ab47eb488001b0dff7d3ef5bb719)
- [作業](https://malrichsu.github.io/vue-component-practice/)