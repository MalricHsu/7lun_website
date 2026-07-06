---
title: Nuxt｜Nuxt 4 第一次開發紀錄
sidebar_position: 1
tags: [Nuxt,Vue, JavaScript, 開發知識點]
date: 2026-06-25
slug: /docs/nuxt/nuxt4-first-dev-log
---


> 本文件整理首次開發 Nuxt 4 專案 過程中所接觸到的 Vue 3 / Nuxt 4 核心知識，包含各項技術的用途、實際應用情境、常見寫法與注意事項。內容聚焦於框架觀念與通用開發知識，不綁定特定專案，可作為後續開發、複習與面試時的快速參考。與部落格專案相關的實作紀錄、檔案結構、功能開發流程、問題排查與踩坑經驗，請參閱 [Nuxt 4 部落格開發紀錄](/blog/hexSchool-2026)。


### 一、為什麼用 Nuxt 而不是 Vite

- Vite + Vue 預設是 SPA（單頁應用）模式，也就是整個網站由瀏覽器端的 JavaScript 負責渲染。

#### 1.SPA（Vite + Vue）

- **特性**
  - 畫面在前端生成：初始 HTML 幾乎只有 `<div id="app">`，所有畫面都靠 JS 生成
  - 路由在前端處理：使用 Vue Router，頁面切換本質是 component 切換，不會重新載入 HTML
  - 資料在 client 端抓取：API request 在瀏覽器端發生
- **限制**
  - SEO 較弱：搜尋引擎初次抓到的是空 HTML，內容依賴 JS 才出現
  - 首屏載入較慢：需先下載 JS → 執行 → 才顯示畫面
  - 社群分享需額外處理：OG meta 通常需自行處理或搭配 SSR
  - 沒有內建後端：API 需另外建立（Node / Express / Nest）

#### 2.SSR（Nuxt）

- Nuxt 建立在 Vue 之上，但採用 SSR（Server-Side Rendering），也可以混合 CSR。
- **伺服器先產生 HTML**：使用者進來時，伺服器已經把畫面與資料渲染完成
- **再由前端接管（Hydration）**：Vue 在 client 端接手互動行為
- **內建全端能力**：`server/` 可直接寫 API（Nitro），前後端同專案

#### 3.比較
    | 項目 | Vite + Vue（SPA） | Nuxt（SSR / Hybrid） |
    |------|------------------|----------------------|
    | 渲染方式 | 瀏覽器生成畫面 | 伺服器先生成 HTML |
    | 首屏速度 | 較慢 | 較快 |
    | SEO | 較弱 | 很強 |
    | 路由 | 手動 Vue Router | 檔案自動路由 |
    | 後端能力 | 無（需外接） | 內建 Nitro API |
    | 適合場景 | 後台 / 工具 / SPA | 官網 / 部落格 / 電商 |

:::note
**一句話記法**：Vite（SPA）先載 JS，再生成畫面；Nuxt（SSR）先生成畫面，再送到瀏覽器。
:::


### 二、SSR 心智模型

- 常見誤會：「有些元件在伺服器渲染、有些在瀏覽器渲染」。
  - **錯。** 
- 正確的是：
    - **整頁先在伺服器跑一次（產出 HTML），送到瀏覽器畫出來，然後同一批元件在瀏覽器再跑一次接管它（hydration 水合）。**

- 生命週期：

    ```
    伺服器端：把整頁元件執行一次 → 產出 HTML 字串 → 送到瀏覽器
                                                ↓
    瀏覽器：先把那串 HTML 畫出來（使用者馬上看到畫面，但還不能互動）
                                                ↓
    瀏覽器：再把「同一批元件」執行一次，接管這些 HTML → 變成可互動（hydration）
    ```

- 所以 `Nav`、`Footer`、`blog/[id]`、`Subscription`... 等，每一個都是「**伺服器跑一次、瀏覽器再跑一次**」，不是二選一。這也是 SSR 對 SEO 有利的原因：爬蟲一進來就拿到完整 HTML 內容，不必等 JS 執行。

#### 1. `<ClientOnly>` 是唯一例外

- 包在 `<ClientOnly>` 裡的東西**跳過伺服器那一次**，只在瀏覽器渲染。所以像 Swiper 這種套件，不是「它在 client、別人在 server」，而是「**它只在 client；別人 server + client 都跑**」。

#### 2. 「程式碼在哪裡執行」對照表

<table width="100%">
  <thead>
    <tr>
      <th width="40%">程式碼位置</th>
      <th width="30%">伺服器會跑嗎</th>
      <th width="30%">瀏覽器會跑嗎</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>&lt;script setup&gt;</code> 最外層（<code>ref</code> 初始化、<code>console.log</code>、<code>useAsyncData</code>）</td>
      <td>✅ 會</td>
      <td>✅ 會（hydration 那次）</td>
    </tr>
    <tr>
      <td><code>useAsyncData</code> / <code>useFetch</code> 抓資料</td>
      <td>✅ 抓（結果塞進 HTML payload）</td>
      <td>❌ 不重抓（直接用 payload）</td>
    </tr>
    <tr>
      <td><code>onMounted</code></td>
      <td>❌ 不會</td>
      <td>✅ 只在這裡跑</td>
    </tr>
    <tr>
      <td>事件處理函式（<code>@click</code>、<code>submitForm</code>）</td>
      <td>❌ 不會</td>
      <td>✅ 使用者操作時</td>
    </tr>
    <tr>
      <td><code>&lt;ClientOnly&gt;</code> 內的元件</td>
      <td>❌ 跳過</td>
      <td>✅ 只在這裡</td>
    </tr>
  </tbody>
</table>

- 由這張表可推得幾個重點：
    - 在 setup 最外層的 `console.log` 會在**伺服器終端機**印一次、**瀏覽器 console** 再印一次。
    - 表單送出的 `axios` 在事件處理函式裡 → **伺服器不會執行到**，所以用相對路徑就安全。
    - 要碰 `window` / `document` / `localStorage` 時，放 `onMounted` 或包 `<ClientOnly>`（這些**瀏覽器**專屬 API 在**伺服器**不存在）。


### 三、Hydration 與 Hydration Mismatch

- **Hydration 時**，Vue 會拿「伺服器送來的 HTML」對照「瀏覽器重跑後算出的 DOM」，**兩者必須一致**，否則 console 會噴 `Hydration node mismatch`，畫面可能閃爍或行為異常。
- **常見成因：**
    - 伺服器／瀏覽器算出不同結果（例如用到 `Date.now()`、亂數、`window` 寬度）。
    - 第三方套件在瀏覽器初始化後**改動了 DOM 結構**（輪播、圖表、地圖這類最常見）。
- **解法：** 會改 DOM 的視覺套件包 `<ClientOnly>`；需要亂數／時間／視窗寬度的初始畫面，把那段邏輯放進 `onMounted` 之後再執行。


### 四、檔案路由

- 傳統要手寫一份 router 設定表，網站一大就難維護。Nuxt 改用「**檔案結構即路由**」，一看資料夾就知道有哪些頁。
    | 檔案 | 網址 | 說明 |
    |---|---|---|
    | `pages/index.vue` | `/` | 首頁 |
    | `pages/about.vue` | `/about` | 一般頁 |
    | `pages/blog/index.vue` | `/blog` | 資料夾首頁 |
    | `pages/blog/[id].vue` | `/blog/1` | 動態路由（單一參數） |
    | `pages/[...slug].vue` | 任意路徑 | catch-all（萬用） |

- **取得動態參數：**
    ```js
    const route = useRoute();
    console.log(route.params.id);   // 網址 /blog/1 → "1"
    console.log(route.path);        // "/blog/1"
    console.log(route.query.page);  // 網址 ?page=2 → "2"
    ```

### 五、Layouts（版型）

- 每頁都有 Nav、Footer，如果每頁重寫一遍，改一個地方要改很多檔。Layout 把「共用外框」抽出來，頁面只負責中間的內容。

    ```vue
    <!-- layouts/default.vue -->
    <template>
        <Nav />
        <slot />     <!-- 頁面內容會塞進這個位置 -->
        <Footer />
    </template>
    ```

    ```vue
    <!-- app.vue -->
    <template>
        <NuxtLayout>      <!-- 套用 layout -->
            <NuxtPage />    <!-- 目前頁面 -->
        </NuxtLayout>
    </template>
    ``` 

- **某頁要用不同版型：**

    ```js
    // pages/contact.vue
    definePageMeta({ layout: "no-footer" });  // 用 layouts/no-footer.vue
    ```
    :::note  
    沒指定 layout 的頁自動用 `default`；想完全不用 layout 寫 `definePageMeta({ layout: false })`；`<slot />` 是 Vue 的插槽，意思是「把外層包進來的內容放這裡」。
    :::

### 六、自動匯入

- 少寫 import，程式更乾淨。Nuxt 在背後維護一份「哪些東西可以直接用」的索引。

### 七、資料取得：useFetch / useAsyncData / $fetch / axios

- 先記關鍵觀念，所有差別都從這裡來：

    - SSR 時頁面會在**伺服器先抓一次資料、算好 HTML**。
    - `useFetch` / `useAsyncData` 會把伺服器抓到的結果「**塞進 HTML 一起送給瀏覽器（payload）**」，瀏覽器接手後**不再抓第二次**。
    - `$fetch` / `axios` 單獨用**不會**做這件事 → 在 setup 中用會「伺服器抓一次、瀏覽器又抓一次」，浪費且可能 hydration 不一致。

    <table width="100%">
      <thead>
        <tr>
          <th></th>
          <th>它是什麼</th>
          <th>setup 中（SSR）</th>
          <th>事件處理函式中</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong><code>useAsyncData(key, fn)</code></strong></td>
          <td>跑任意 async function 並做 SSR 傳遞 + 去重</td>
          <td>✅ 最適合</td>
          <td>❌ 不是設計來這樣用</td>
        </tr>
        <tr>
          <td><strong><code>useFetch(url)</code></strong></td>
          <td><code>useAsyncData</code> + <code>$fetch</code> 的懶人包，專打 HTTP API</td>
          <td>✅ 適合</td>
          <td>❌</td>
        </tr>
        <tr>
          <td><strong><code>$fetch(url)</code></strong></td>
          <td>底層 fetch 工具（ofetch），<strong>不做</strong> SSR 傳遞</td>
          <td>⚠️ 會雙抓</td>
          <td>✅ 最適合</td>
        </tr>
        <tr>
          <td><strong><code>axios</code></strong></td>
          <td>第三方套件，功能同 <code>$fetch</code>，但<strong>不懂 Nuxt SSR</strong>、體積較大</td>
          <td>⚠️ 同上</td>
          <td>✅ 可用，但非必要</td>
        </tr>
      </tbody>
    </table>

#### 1. 怎麼用 useFetch

    ```js
    // 最簡單
    const { data: service } = await useFetch("/api/service");

    // 完整回傳
    const { data, pending, error, refresh } = await useFetch("/api/service");
    // data    = 資料（ref）
    // pending = 是否載入中
    // error   = 錯誤
    // refresh = 手動重抓的函式
    ```

- **常用參數：**

    ```js
    const { data } = await useFetch("/api/blogs", {
    default: () => [],              // 資料還沒來時的預設值（避免 null）
    lazy: true,                     // 不卡住頁面切換，背景載入
    transform: (res) => res.items,  // 先處理資料再回傳
    });
    ```
    - 三個選項各自的意思：
        - `default: () => []`：資料還沒回來前，`data.value` 預設是 `null`，這樣模板跑 `v-for` 會出錯。設成 `[]` 就讓它先是空陣列，不會炸掉。
        - `lazy: true`：預設是「資料沒抓完不讓你換頁」。加了 `lazy` 就是「先讓你進頁面，資料背景繼續載」，畫面不會卡住。
        - `transform: (res) => res.items`： API 回傳的是 `{ items: [...], total: 10 }` 這種結構，但你只想要裡面的 `items`，這個就是先幫你取出來再存進 `data`，不用之後再寫 `data.value.items`。

- **自訂抓取邏輯用 `useAsyncData`：**

    ```js
    // 第一個參數是「唯一 key」（快取用），第二個是抓取函式
    const { data: blogs } = await useAsyncData("blog-list", () =>
    queryCollection("blog").all()
    );
    ```
    - `queryCollection` 是 Nuxt Content 提供的工具，直接去讀你專案裡的 `.md` 檔，不會發出網路請求。
    - 但因為它是非同步的，Nuxt 不知道怎麼幫它做 SSR 傳遞，所以要包進 `useAsyncData`。
    - 第一個參數 `"blog-list"` 是一個**自訂名稱（key）**，Nuxt 用這個做快取：同一個 key 只抓一次，不會重複執行。
    - 第二個參數就是你要跑的非同步函式。

#### 2. `$fetch` 與 `axios` 的回傳差異（換寫時注意）

    - `axios`：回應在 `res.data`；非 2xx 會 throw，錯誤訊息在 `error.response.data.message`。
    - `$fetch`：直接回 `res`（沒有 `.data`）；非 2xx 也會 throw，錯誤訊息在 `error.data.message`。

#### 3. 什麼時候還是要 onMounted

- `onMounted` 是給「**一定要在瀏覽器、DOM 準備好才能做的事**」：

    ```js
    onMounted(() => {
    new Swiper(".swiper", { /* ... */ });   // 香草版套件初始化
    // 讀 window/document 尺寸、addEventListener 等
    });
    ```

#### 4. 注意

- `useFetch`／`useAsyncData` 要 `await`（在 `<script setup>` 最外層可用 top-level await）。
- `data` 是 ref，`<script>` 內存取要 `.value`，模板自動解包。

    :::note
    **一句話記法**：「進頁面就要、且要給瀏覽器重用的資料」用 `useFetch` / `useAsyncData`；「使用者觸發的一次性動作」用 `$fetch` / `axios`。
    :::

### 八、伺服器 API（Server Routes）

- 有些事不能在前端做：保護機密（API key、資料庫密碼不能進前端）、驗證不能只信前端（前端可被繞過）、整合第三方（寄信、金流）。Nuxt 內建 Nitro，`server/` 直接寫後端，不用另開專案。

    ```js
    // server/api/send-contact.post.js  （.post = 只接受 POST）
    export default defineEventHandler(async (event) => {
    const body = await readBody(event);           // 讀前端送來的資料
    const result = contactSchema.safeParse(body); // 後端再驗一次
    if (!result.success) {
        throw createError({ statusCode: 400, message: "資料錯誤" });
    }
    // ……寄信 / 存 DB……
    return { success: true, message: "已送出" };   // 回傳給前端
    });
    ```

- **前端呼叫：**

    ```js
    const res = await axios.post("/api/send-contact", formData);
    console.log(res.data.message);  // "已送出"
    ```

    :::note
    **一句話記法**：
    - 檔名決定方法（`.get.js`、`.post.js`、`.put.js`、`.delete.js`）
    - 動態路由 `server/api/blog/[id].get.js` 用 `getRouterParam(event, "id")` 取參數；取得 query 用 `getQuery(event)`；`readBody`、`createError`、`getQuery` 都是 Nitro 自動匯入。
    :::


### 九、Shared 目錄（前後端共用）

- 表單驗證要做兩次：**前端驗**（即時提示使用者）+ **後端驗**（防繞過）。如果兩邊各寫一份規則，容易不一致。把規則寫一份放 `shared/`，兩邊共用。

    ```js
    // shared/utils/schema.js
    import { z } from "zod";
    export const contactSchema = z.object({ /* 規則 */ });
    ```

- 前端元件：直接用 `contactSchema`（自動匯入）。
- 伺服器 API：也直接用 `contactSchema`（自動匯入）。

    :::info
    只能放「**前後端都能跑的純邏輯**」（zod、純函式、常數）。不能放只有伺服器有的東西（`readBody`、`process.env`、`fs`）→ 那種留 `server/utils/`。
    :::

### 十、Nuxt Content（用 Markdown 寫部落格）

- 文章內容如果寫死在 JS 陣列裡，又長又難維護。Nuxt Content 讓你**像寫筆記一樣用 `.md` 檔寫文章**，支援標題、表格、圖片，還能自動產生路由。適用「自己寫稿、git 管理」的部落格；若要「後台讓使用者線上新增」，則要改用資料庫。

1. **定義 collection（`content.config.ts`）：**

   ```js
   export default defineContentConfig({
     collections: {
       blog: defineCollection({
         type: "page",            // page = 對應網址
         source: "blog/**/*.md",
         schema: z.object({       // frontmatter 欄位型別
           image: z.string(),
           categories: z.array(z.string()),
           date: z.string(),
         }),
       }),
     },
   });
   ```

2. **寫文章（`content/blog/1.md`，檔名即網址 `/blog/1`）：**

   ```md
   ---
   title: 文章標題
   categories: [UIUX 設計]
   date: "2025-10-16"
   ---

   ## 內文
   正文...
   ```

3. **撈資料（各種查法）：**

   ```js
   queryCollection("blog").all();                       // 全部
   queryCollection("blog").path("/blog/1").first();     // 單篇（依路徑）
   queryCollection("blog").where("categories", "LIKE", "%UIUX%").all();  // 條件
   queryCollection("blog").order("date", "DESC").limit(3).all();         // 排序+取前 3
   ```

4. **渲染內文：**

   ```vue
   <ContentRenderer v-if="blog" :value="blog" />
   ```

    :::note
    - **元件用** `queryCollection("blog")` 與 **伺服器Route** 要 `queryCollection(event, "blog")`（**簽名不同**）。
    - 渲染出的 HTML 樣式要用 `:deep()` 才套得到。
    :::

### 十一、SEO（useHead / useSeoMeta）

- 每頁瀏覽器分頁標題、Google 搜尋結果、社群分享預覽都要能各自設定，對 SEO 與使用者體驗很重要。

    ```js
    // 只設標題
    useHead({ title: "服務項目" });

    // 設 SEO（標題 + 描述 + 社群預覽）
    useSeoMeta({
    title: "服務項目",
    description: "提供品牌設計、網頁設計與前端開發服務。",
    ogTitle: "服務項目 | Nelson Blog",
    ogImage: "https://.../og.png",
    });
    ```
- **全域樣板（`nuxt.config.ts`）：**

    ```js
    app: {
    head: {
        htmlAttrs: { lang: "zh-Hant" },      // 語言（SEO/無障礙必備）
        titleTemplate: "%s | Nelson Blog",   // %s 代入各頁 title
        title: "Nelson Blog",                 // 沒設 title 的頁用這個
        link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
    },
    ```

#### 1. useSeoMeta 參數說明

- 每個參數會被轉成對應的 `<meta>` 標籤，出現在不同地方：

    | 參數 | 產生的標籤 | 作用 / 顯示在哪 |
    |---|---|---|
    | `title` | `<title>` + `<meta property="og:title">` | 分頁標題、搜尋結果標題、分享卡片標題 |
    | `description` | `<meta name="description">` | Google 搜尋結果標題底下的摘要 |
    | `ogType` | `<meta property="og:type">` | 內容類型：`website`（一般頁）/ `article`（文章） |
    | `ogSiteName` | `<meta property="og:site_name">` | 分享卡片上的網站名稱 |
    | `ogImage` | `<meta property="og:image">` | 分享到 FB / LINE 的預覽縮圖（建議 1200×630） |
    | `twitterCard` | `<meta name="twitter:card">` | 卡片樣式：`summary_large_image`（大圖）/ `summary`（小圖） |
    | `ogUrl` | `<meta property="og:url">` | 這頁的標準網址 |
    | `ogLocale` | `<meta property="og:locale">` | 語系，如 `zh_TW` |
    | `robots` | `<meta name="robots">` | 是否讓搜尋引擎收錄，如 `index, follow` |

- **什麼是 OG（Open Graph）？** `og:` 開頭的是 Facebook 制定、現在 LINE / Discord / Slack 通用的標準。貼連結到這些平台時，它們會去抓 `og:*` 標籤組成「分享預覽卡片」（縮圖 + 標題 + 描述）。沒有 `og:*`，貼連結就只是一條乾巴巴的網址。

- `useSeoMeta` 的好處：你設 `title` / `description`，它會**自動補上對應的 `og:title` / `og:description`**，不用手動寫兩份。

#### 2. 動態頁（文章詳情）— 用箭頭函式讓它響應式

    ```js
    useSeoMeta({
    title: () => blog.value?.title,
    description: () => blog.value?.description || blog.value?.title,
    ogType: "article",
    ogImage: () => blog.value?.image,   // 用文章封面當分享圖
    });
    ```

#### 3. 注意

- 動態頁要用**箭頭函式** `() => blog.value?.title`，資料回來才會更新（SSR 也正確）。
- 首頁記得給自己的 title，否則套用預設會變「Nelson Blog | Nelson Blog」。
- 分享預覽要部署到**正式網域**才抓得到（localhost 抓不到）；可用 opengraph.xyz 測試。


### 十二、Pinia（跨元件共用狀態）

- 有些狀態要**很多元件共用**（登入狀態、全域通知）。如果用 props 一層一層往下傳，會變成「props 地獄」。Pinia 提供一個「全域倉庫」，任何元件都能直接讀寫。頁面內自己用的狀態（表單欄位、開關）用 `ref` 就好，不用 Pinia。

- **安裝：** `npm i pinia @pinia/nuxt`，在 `nuxt.config` 的 `modules` 加 `@pinia/nuxt`。
-  **建 store（`app/stores/toast.js`）：**

   ```js
   export const useToastStore = defineStore("toast", () => {
     const toasts = ref([]);                       // state
     const success = (msg) => {                    // action
       toasts.value.push({ id: Date.now(), type: "success", msg });
     };
     return { toasts, success };                   // 要用的才 return
   });
   ```

-  **使用：**

   ```js
   const toast = useToastStore();
   toast.success("成功！");      // 呼叫 action（不是 toast.success = "..."）
   console.log(toast.toasts);    // 讀 state
   ```

### 十三、Zod（資料驗證）

- 手寫一堆 `if (!name) ... if (!email.includes("@")) ...` 又長又容易漏。Zod 用「宣告式 schema」一次定義所有規則，還能回傳清楚的錯誤訊息，前後端共用。

    ```js
    import { z } from "zod";

    const contactSchema = z.object({
    name: z.string().min(2, "請輸入姓名"),
    phone: z.string().regex(/^09\d{8}$/, "手機格式不正確"),
    email: z.string().email("email 格式不正確"),
    age: z.number().min(18).optional(),   // 選填
    });
    ```

- **驗證（用 safeParse，不會丟錯）：**

    ```js
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
    // 取出所有錯誤訊息
    const msgs = result.error.issues.map((i) => i.message).join("、");
    console.log(msgs);
    } else {
    console.log(result.data);   // 驗證通過、型別正確的資料
    }
    ```

- **常用規則：**

    ```js
    z.string().min(2).max(20)
    z.string().email()
    z.string().url()
    z.string().regex(/.../)
    z.number().min(0).max(100)
    z.boolean()
    z.array(z.string())
    z.enum(["a", "b"])
    z.object({ /* ... */ })
    .optional()        // 可不填
    .default("值")     // 預設值
    ```

#### 注意（重要差別）

- `safeParse` 回傳 `{ success, data | error }`，**不會丟例外**；`parse` 失敗會直接 throw，中斷程式。表單驗證一律用 `safeParse`。
- 錯誤在 `result.error.issues`（陣列，每個有 `.message`）。
- `issues[0].message` 只顯示第一個錯誤；要一次顯示全部用 `issues.map(i => i.message).join("、")`。


### 十四、資料來源

- 本文件整理自個人開發過程的三份筆記
- [Nuxt 官方文件](https://nuxt.com/docs)
- [Vue 3 官方文件](https://vuejs.org)
- [Zod 官方文件](https://zod.dev)
- [Pinia 官方文件](https://pinia.vuejs.org)