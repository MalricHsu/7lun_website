---
slug: hexSchool-2026
title: 用 Nuxt 4 部落格開發
authors: [7lun]
tags: [project,Vue , Nuxt , 六角學院]
date: 2026-06-24
---

### 前言

繼上一個 React 專案之後，這次我用 Nuxt 4 完成六角學院 2026 軟體工程師體驗營的部落格設計稿切版。和過去做 SPA 的經驗最大的不同，是這次必須正面理解 SSR（伺服器端渲染）——也因此開始真正理解 Nuxt 與 Vue 在執行流程上的差異，以及開發時需要注意的細節。

這篇文章主要整理本次使用 Nuxt 開發的學習歷程，內容涵蓋實作過程中的技術選型、遇到的問題與解法，以及對 SSR 開發模式的理解與反思，希望能為未來的自己留下完整紀錄，同時也提供給有類似需求的開發者作為參考。

另外也附上開發期間整理的基礎知識筆記 [**開發時記錄下來的基礎知識點筆記**](/docs/nuxt/Nuxt｜Nuxt%204%20第一次開發紀錄)

- **Live Demo**：[**HexSchool2026 - Nelson Blog**](https://hex-blog-nu.vercel.app/)
- **GitHub**：[**GitHub Repo**](https://github.com/MalricHsu/hex-blog)
- **使用技術**：`Nuxt 4` / `Vue 3` / `@nuxt/content` / `Pinia` / `Bootstrap 5` / `Sass` / `Zod` / `Axios` / `Swiper`
- **專案時程**：2026.06.15 ~ 2026.06.24
- **網站部署**：Vercel

{/* truncate */}

### 一、 為什麼選擇使用 Nuxt

我過去主要使用 React 搭配 Vite 開發專案，因此這次體驗營其實也可以選擇用熟悉的技術完成。不過考量到自己一直沒有正式接觸過 Nuxt，因此決定把這次專案當成學習機會，嘗試使用 Vue 生態系中的全端框架來完成整個部落格網站。

實際開發後才發現，Nuxt 並不只是幫 Vue 加上一些便利功能而已。它最大的特色在於內建 **SSR（Server-Side Rendering）** 能力，讓頁面能先在伺服器完成渲染後再傳送給瀏覽器。雖然這次選擇 Nuxt 的原因不是為了解決 SEO 問題，但在理解 SSR 的過程中，也開始認識到它在搜尋引擎優化、首屏載入速度以及使用者體驗上的優勢。

除此之外，Nuxt 還提供檔案式路由、自動匯入以及 Nitro 內建後端等功能，讓前後端開發能整合在同一個專案中。對於第一次接觸 Nuxt 的我來說，這些功能雖然提升了開發效率，但也讓我必須重新理解程式究竟是在伺服器執行，還是在瀏覽器執行。

而這其中最重要、也最容易讓人混淆的，就是 SSR 的運作模式。因此在正式開始切版與功能開發之前，我先花了一些時間理解 Nuxt 的執行流程，以及它與一般前端 SPA 應用之間的差異。


### 二、 理解 Nuxt SSR 的執行流程

我一開始對於 SSR 有個錯誤的想像，以為是「有些元件在伺服器渲染、有些在瀏覽器渲染」。後來才發現完全不是這樣。

正確的模型是：**整頁先在伺服器跑一次，產出 HTML，送到瀏覽器畫出來；然後同一批元件在瀏覽器再跑一次，接管那串 HTML，讓它變成可以互動的頁面。**

```
伺服器：整頁元件執行一次 → 產出 HTML → 送到瀏覽器
                                    ↓
瀏覽器：先把 HTML 畫出來（使用者馬上看到，但還不能互動）
                                    ↓
瀏覽器：再把「同一批元件」跑一次，接管這些 HTML → 變成可互動
```

最後那個「接管」的動作有個專門名稱叫 **Hydration（水合）** ，是借用化學的比喻，把乾燥的靜態 HTML「加水」活化成有生命力、能互動的頁面。

理解這個模型後，很多事情就說得通了：Nav、Footer、文章頁......每個元件都是 **「伺服器跑一次、瀏覽器再跑一次」**，不是二選一。這也是 SSR 對 SEO 有利的原因——爬蟲一進來就拿到完整 HTML。

這裡整理我自己常回頭參考的對照表，記住「哪些程式碼會在伺服器跑」非常重要：

| 程式碼位置 | 伺服器會跑 | 瀏覽器會跑 |
|---|---|---|
| `<script setup>`  | 會 | 會（水合那次） |
| `useFetch` / `useAsyncData` | 會，抓資料 | 不會，不重抓 |
| `onMounted` | 不會 | 只會在這裡 |
| 事件處理函式（`@click`） | 不會 | 會，使用者操作時 |
| `<ClientOnly>` 內的元件 | 不會，跳過 | 只會在這裡 |

### 三、 開發前 Nuxt 幫你做好哪些事

理解 SSR 的執行流程後，就正式開始切版與功能開發。這個階段最大的感受是：Nuxt 幫開發者省下了不少基礎設置的時間，讓我能更專注在畫面與功能實作上。

最有感的是檔案式路由。以前接觸 React 時，需要額外規劃與維護路由設定；在 Nuxt 中則是直接透過 `pages/` 目錄建立頁面，例如 `pages/index.vue` 對應首頁，`pages/blog/[id].vue` 對應文章詳細頁。只要建立檔案，路由就會自動產生，開發體驗相當直覺。

版型管理則透過 Layouts 處理。我將網站共用的 Header、Footer 抽到 `layouts/default.vue`，各頁面只需要關注自己的內容。若特定頁面需要不同版型，也能透過 `definePageMeta()` 指定其他 Layout，避免在每個頁面重複撰寫相同結構。

另一個讓我印象深刻的是自動匯入機制。無論是 `components/` 裡的元件、Vue 提供的 Composition API，或是自己撰寫的 `composables/`，都不需要手動 `import`。雖然方便，但也因此踩到一個小坑：Pinia 的 Store 必須放在 `stores/` 目錄下才能被自動偵測，如果誤命名成 `store/`，Nuxt 就不會自動匯入。另外新增這類特殊目錄後，有時需要重新啟動開發伺服器，Nuxt 才會重新建立索引。

> 順帶一提，這次使用的是 Nuxt 4。和許多 Nuxt 3 教學不同，Nuxt 4 預設將前端程式碼集中在 `app/` 目錄下，例如 `app/pages`、`app/components`、`app/layouts` 等。因此在查資料時，如果看到教學中的 `pages/` 位於專案根目錄，需要先確認版本差異，避免照著操作卻找不到對應位置。


### 四、 透過 Markdown 管理文章資料

骨架搭好後，下一步就是放入文章內容。

一開始我沒有打算把文章資料寫在 JavaScript 陣列裡，因為內容一多不但難維護，也失去了部落格「寫文章」的感覺。因此我選擇使用 `@nuxt/content`，把每篇文章都獨立寫成 Markdown 檔案，讓內容與程式碼分離。

在 Nuxt 中，只要建立 `content/blog/1.md` 這類檔案，就能像平常寫筆記一樣使用 Markdown 撰寫文章，支援標題、圖片、表格、程式碼區塊等常見格式。同時還能搭配 Frontmatter 存放文章資訊，例如日期、分類、封面圖片等。

為了讓這些欄位有型別檢查，我先在 `content.config.ts` 中定義 collection 與 schema：

```ts
import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**/*.md",
      schema: z.object({
        description: z.string().optional(),
        image: z.string(),
        categories: z.array(z.string()),
        date: z.string(),
        dateFormatted: z.string(),
        views: z.number(),
        shares: z.number(),
      }),
    }),
  },
});
```

這段設定的作用是告訴 Nuxt：`blog` collection 底下的每篇文章都必須符合這個資料結構。如果 Frontmatter 少了必要欄位，或型別不符合定義，開發階段就能提早發現問題。

部落格`index`頁面資料，透過 `queryCollection()` 查詢：

```js
const { data: blogs } = await useAsyncData("blog-list", () =>
  queryCollection("blog").all()
);
```

取得資料後，就能在頁面中渲染文章列表；而部落格詳細頁則可以透過 `<ContentRenderer>` 將 Markdown 內容轉換成 HTML 顯示。

對於個人部落格來說，這種模式很適合。文章本質上就是 Markdown 檔案，可以直接用 Git 版控，不需要另外架設資料庫或後台系統。如果未來要做成多人使用、可在線上發文的平台，再改用資料庫會比較合適。

這裡先埋下一個伏筆：雖然平常開發時一切正常，但後來部署到 Vercel 時卻遇到了一個意料之外的問題。追查後才發現，`@nuxt/content` 底層其實使用了 SQLite，而這也成了整個部署過程中最值得記錄的一個坑。


### 五、理解 Nuxt 的資料取得模式

這一段是整個專案中我覺得最值得搞懂的地方。

剛接觸 Nuxt 時，我一直分不清 `useAsyncData`、`useFetch`、`$fetch` 和 `axios` 到底差在哪。後來才發現，答案其實都跟 SSR 有關。

在 Nuxt 中，頁面第一次載入時會先由伺服器執行一次，產生包含資料的 HTML 後再傳給瀏覽器。因此最大的差異不是「**能不能抓到資料**」，而是「**抓到的資料能不能被瀏覽器重用**」。

`useAsyncData` 與 `useFetch` 會在 SSR 階段取得資料，並把結果一起傳給瀏覽器。等到 Hydration 時，瀏覽器直接使用這份資料，不需要再次發送請求。

但如果在 `<script setup>` 中直接使用 `$fetch` 或 `axios`，Nuxt 不會幫忙傳遞資料，因此同一段程式碼可能在伺服器執行一次、瀏覽器再執行一次，造成重複請求。

理解這個差異後，四種工具的定位就變得很清楚：

| 工具               | 頁面載入時（SSR） | 按鈕事件中 | 特點                       |
| ---------------- | ---------- | ----- | ------------------------ |
| `useAsyncData()` |  推薦       | 不適用     | 支援 SSR，可執行任何非同步邏輯        |
| `useFetch()`     |  推薦       | 不適用     | `useAsyncData` 的 API 封裝版 |
| `$fetch()`       | 不建議     | 推薦  | 單純發送請求，不處理 SSR 資料傳遞      |
| `axios`          | 不建議     | 可用  | 第三方套件，與 Nuxt SSR 無整合     |

我後來的理解其實很簡單：

> **進頁面就要顯示的資料，用 `useAsyncData()` 或 `useFetch()`；使用者操作後才需要發送的請求，用 `$fetch()` 或 `axios`。**

實際套用到這次專案：

* 文章列表頁使用 `useAsyncData()`
* 文章詳細頁使用 `useAsyncData()`
* 其他透過 API 取得的頁面資料使用 `useFetch()`
* 聯絡表單送出使用 `axios`

例如文章資料是透過 `queryCollection()` 查詢 Markdown，因此使用 `useAsyncData()`：

```js
const { data: blogs } = await useAsyncData("blog-list", () =>
  queryCollection("blog").all()
);
```

而如果是單純向 API 取得資料：

```js
const { data } = await useFetch("/api/posts");
```

直接使用 `useFetch()` 會更簡潔。

另外，如果專案同時使用 `axios` 和 `$fetch`，還要注意兩者回傳格式並不相同。

```js
// axios
const res = await axios.post(...);

console.log(res.data);
```

```js
// $fetch
const res = await $fetch(...);

console.log(res);
```

錯誤處理的寫法也不同：

```js
// axios
error.response.data.message;
```

```js
// $fetch
error.data.message;
```

這個差異看起來不大，但我在撰寫聯絡表單錯誤訊息時就因此踩過一次坑，花了一點時間才發現是兩套 API 的設計不同。


### 六、建立前後端共用的表單驗證機制

聯絡表單是這次專案中第一個完整串起前端、後端與 API 的功能，也是我第一次在 Nuxt 裡實際體驗全端開發的流程。

實作過程中，我學到一個很重要的觀念：

> **表單驗證應該同時存在於前端與後端。**

前端驗證的目的，是讓使用者能立即看到錯誤訊息，提升操作體驗；後端驗證則是最後一道防線，因為任何人都可以直接呼叫 API，繞過前端檢查。

問題在於，如果前後端各自維護一套驗證規則，很容易出現不一致的情況：例如前端更新了規則，但後端沒有同步，或反過來導致行為不一致。

因此我選擇把驗證邏輯集中管理，並用 Zod 來定義 schema：

```js
// shared/utils/schema.js
export const contactSchema = z.object({
  name: z.string().min(2, "請輸入姓名"),
  phone: z.string().regex(/^09\d{8}$/, "手機號碼格式不正確"),
  email: z.string().email("請輸入正確格式"),
  note: z.string().optional(),
});
```

Zod 採用宣告式寫法，可以一次描述所有驗證規則，比起手動寫一堆 `if` 判斷更清楚，也讓驗證邏輯集中在同一個地方，後續維護成本更低。

驗證時使用 `safeParse()`：

```js
const result = contactSchema.safeParse(formData);
```

它不會像 `parse()` 一樣在失敗時直接拋錯，而是 **回傳一個結果物件** ，包含 `success` 與 `error`，讓程式可以自行決定後續處理方式。對於表單這種「使用者本來就可能輸入錯誤」的場景特別適合。

前端送出邏輯如下：

```js
const submitForm = async () => {
  
  const result = contactSchema.safeParse({
    name: name.value,
    phone: phone.value,
    email: email.value,
    note: note.value,
  });
  
  const result = contactSchema.safeParse(formData);

  if (!result.success) {
    toast.error(
      result.error.issues.map((i) => i.message).join("、")
    );
    return;
  }

  const res = await axios.post(
    "/api/send-contact",
    result.data
  );

  toast.success(res.data.message);
};
```

後端同樣使用這份 schema 再驗證一次：

```js
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = contactSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues
        .map((i) => i.message)
        .join("、"),
    });
  }

  return {
    success: true,
    message: "已送出",
  };
});
```

這樣即使有人跳過前端直接呼叫 API，也仍然會被後端驗證擋下來。

另外在錯誤處理上也有幾個 Nuxt 的細節：

* `createError()` 要使用 `message`
* HTTP 狀態碼要使用數字，例如 `400`
* 前端接收錯誤時，可透過 `error.data.message` 取得後端回傳訊息

這些看似小細節，如果寫錯不一定會立刻報錯，但實際上會花不少時間在 debug。

回頭看這個功能，雖然只是簡單的聯絡表單，但卻完整串起了 Nuxt 的全端流程：共用驗證邏輯、前端表單、Server API 與錯誤處理都在同一個專案內完成，不需要額外拆成前後端兩個系統。


### 七、SSR 開發中的踩雷紀錄

功能都完成後，在測試與部署階段遇到幾個 SSR 專屬的問題。回頭看，其實都可以用前面那張「程式碼在哪裡執行」的表來解釋。


#### 1. Swiper 輪播的 hydration mismatch

首頁打開時，Console 出現一整排紅字：`Hydration node mismatch`。
這個錯誤的意思是：伺服器先產生了一份 HTML，但瀏覽器接手後重新渲染時，兩邊的結果不一樣。
Swiper 剛好會在瀏覽器初始化時「自己改 DOM 結構」，例如加入 `swiper-wrapper`、`swiper-pagination` 這些元素。

**結果就變成：兩邊不一致 → hydration mismatch。**

* **伺服器輸出的 HTML（沒有 Swiper 結構）**
* **瀏覽器初始化後的 DOM（被 Swiper 改過）**

**解法很直接：用 `<ClientOnly>` 包起來。**

```vue id="c1"
<ClientOnly>
  <IndexSwiperBlog />
</ClientOnly>
```

意思是：這個元件只在瀏覽器渲染，伺服器直接跳過。這樣就不會出現兩邊畫面不同的問題。


#### 2. 伺服器沒有 window

第二種錯誤是很經典的：`window is not defined`。
原因是 Nuxt 在 SSR 時會先在「伺服器」執行一次程式碼，而伺服器沒有瀏覽器 API，所以像這些都不存在：

* `window`
* `document`
* `localStorage`

例如：

```js id="c2"
localStorage.getItem("token")
```

在 SSR 階段會直接報錯。

解法有幾種：

* 放進 `onMounted()`（等瀏覽器載入後才執行）
* 用 `<ClientOnly>`
* 或判斷是否在 client 環境

另外像 `Date.now()`、`Math.random()` 這種「每次都會變的值」，也不建議放在 setup 最外層，否則伺服器和瀏覽器算出來不同，也可能導致畫面不一致。


#### 3. 部署與 @nuxt/content 的 SQLite

最後一個問題出現在部署。
這次使用 `@nuxt/content` 來管理 Markdown，它底層使用 SQLite 來儲存與查詢文章資料。
在本機開發時一切正常，但部署到 Vercel 時要理解一件事：

> **Vercel 這種 serverless 環境，和「永遠開著的伺服器」不一樣。**

但實際情況是，這次專案沒有因此壞掉，原因在於 Nuxt Content 的運作方式：

 - 在 build 階段，Nuxt 會先讀取 `content/` 的 Markdown 檔案，整理成可查詢的資料結構
 - 並且在需要的頁面進行 prerender（預先產生 HTML）

所以大多數頁面在上線後，其實是「直接使用 build 時已經準備好的內容」，而不是每次請求都即時去查 SQLite。


#### 實務結論

這一段踩坑後，我得到一個很簡單的理解方式：

* 只要會用到 `window` / `document` / 第三方會動 DOM 的套件（像 Swiper）
  → 幾乎都要注意 SSR，必要時用 `<ClientOnly>`
* 不確定會不會 SSR 出問題的程式
  → 就先想「伺服器會不會也跑一次？」
* `@nuxt/content` 在部署時的重點不是「完全不查資料庫」
  → 而是「Nuxt 會在 build 階段先把內容準備好，讓 runtime 盡量不用即時查」


SSR 最大的坑其實不是 bug 很難修，而是：**你以為只有瀏覽器會跑的程式，其實伺服器也跑了一次**


### 八、 Nuxt 中的 SEO 實作紀錄

在 Nuxt 裡，我是直接把 SEO 設定放在 `app.vue`，用 `useSeoMeta` 先把整個網站的預設資訊補齊。Nuxt 會自動把這些設定轉成 HTML 的 meta tags，包含 Open Graph（LINE、Facebook 分享時的預覽卡片）以及 Twitter Card。

```js id="seo1"
useSeoMeta({
  description:
    "Nelson 的設計與前端作品集，分享 UIUX 設計、網頁設計與前端開發的實務經驗。",
  ogType: "website",
  ogSiteName: "Nelson Blog",
  ogImage:
    "https://github.com/hexschool/2022-web-layout-training/blob/main/2026-web-camp/index_person.png?raw=true",
  twitterCard: "summary_large_image",
});
```

這一層設定的概念其實是「全站預設值」，像是網站名稱、描述、分享圖片。之後每一頁如果沒有特別設定，就會先套用這一份。
這樣做的好處是，不需要每一個頁面都重複寫 SEO，而是先在最上層建立一個基準。

也可以把它理解成：**`app.vue` 做的是「網站的預設 SEO」，而不是「每一頁的 SEO」**。

真正需要變動的是動態頁，例如文章頁，SEO 會跟著資料變化，所以要用函式寫法：

```js id="seo2"
useSeoMeta({
  title: () => blog.value?.title,
  description: () => blog.value?.description,
  ogImage: () => blog.value?.image,
});
```

這樣 Nuxt 才會在資料載入後重新更新 meta，避免一開始就寫死。


> **整體來看，Nuxt 的 SEO 模型其實很直覺：**
> **先在 `app.vue` 設一個「全站預設」，再在需要的頁面「覆蓋成動態內容」。**


做完這一步之後會有一個很明顯的感受：**Nuxt 不只是幫你做 SSR，也把 SEO 這一層的基礎流程一起整理好了。**

### 九、 專案心得

#### 1. 觀念先行，比急著寫 code 更省時間

這次最大的體會是：文章裡遇到的幾個坑——Swiper、window、雙重抓取——追根究柢其實都來自同一件事：沒有先搞清楚「哪些程式碼會在伺服器執行」。

一旦把 SSR 的心智模型和那張執行對照表建立起來，很多問題其實不用查文件，自己就能推得出來。

> **框架的規則看起來很多，但背後通常只有一條主線。先抓住主線，細節才不會變成死記。**


#### 2. 遇到 hydration mismatch 不需要慌

這個錯誤大多來自兩種情況：使用了時間、亂數、視窗寬度等「會變動的值」，或是第三方套件在瀏覽器動態改 DOM。
對應方式其實很固定：

* 會動 DOM 的元件 → 用 `<ClientOnly>`
* 只該在瀏覽器跑的邏輯 → 放進 `onMounted`

> **理解原因之後，這個原本看起來很嚇人的紅字，其實只是 SSR 中最容易處理的一類問題。**


#### 3. 驗證一定要前後端一起做

前端負責體驗，後端負責安全，這兩者不能只選一邊。
這次用 `shared/` 搭配 Zod 共用 schema，是我覺得最乾淨的做法，也避免了「前後端規則不同步」的問題。

> **安全性永遠不能只依賴前端，因為前端一定可以被繞過。**


### 十、總結

從 React 的 SPA 開發，到這次第一次完整做 SSR 專案，最大的收穫其實只有一件事：

> **開始真正理解「程式碼在哪裡執行」。**

Nuxt 一開始會讓人覺得規則很多，但當 SSR 這條主線建立起來之後，剩下的其實就是查文件和補細節。

這次從零到部署的完整過程，也讓我更清楚一件事：
- 不是框架變難了，而是以前沒有看見它真正運作的方式。
- 希望這份紀錄可以幫正在學 Nuxt 的人，少踩一些我踩過的坑。


