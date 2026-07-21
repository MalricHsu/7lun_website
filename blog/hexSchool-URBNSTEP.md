---
slug: hexSchool-URBNSTEP
title: URBNSTEP 從手刻切版到 Vue 3 專案開發
authors: [7lun]
tags: [project, Vue , 六角學院]
date: 2026-07-02
---
### 前言

上一篇紀錄的是用 **Nuxt 4** 完成部落格切版，主要在理解 SSR 與 Nuxt 專案架構。這次則是把原本手刻的靜態切版作品，重新用 **Vue 3 SPA** 改造成一個真正能運作的電商網站：**URBNSTEP**。

前一版只有 HTML、CSS 的靜態畫面，沒有登入、資料來源與互動邏輯。這次的目標，是把它從「只有畫面」推進到「真的有功能」：會員可以註冊登入、商品資料從 API 取得，收藏清單也能依照登入狀態同步更新。

這篇會整理 URBNSTEP 的技術選型、功能實作，以及開發過程中遇到的問題，作為這次從 **靜態切版** 走向 **Vue SPA 專案開發** 的紀錄。



- **Live Demo**：[**URBNSTEP**](https://urbnstep.vercel.app/)
- **GitHub（前端 Vue3 SPA）**：[**URBNSTEP GitHub Repo**](https://github.com/MalricHsu/urbnstep)
- **GitHub（後端api JsonServer）**：[**URBNSTEP API GitHub Repo**](https://github.com/MalricHsu/urbnstep_api)
- **使用技術**：`Vue 3` / `Composition API` / `Vite` / `Vue Router` / `Pinia` / `axios` / `js-cookie` / `手刻scss` / `Bootstrap Icons` / `Swiper`
- **後端**：`json-server` + `json-server-auth`（部署於 Render）
- **專案時程**：2026.06.22 ~ 2026.07.02
- **網站部署**：Vercel（前端）／ Render（後端）
- **Figma**：[**URBNSTEP鞋子電商**](https://www.figma.com/design/CYjKvZQo3db8xYCp6DCkKj/%E5%85%AD%E8%A7%92%EF%BD%9C%E9%9E%8B%E5%AD%90%E9%9B%BB%E5%95%86-W3%E3%80%81W4-%EF%BC%88student-ver.%EF%BC%89?node-id=12008-13570&t=MQQJPwUikDB6dT0b-1)

{/* truncate */}

### 一、將手刻切版重做成 Vue 版本

這份切版原本是六角學院切版班的作業，主要用 HTML、CSS 還原電商網站的設計稿。當時重點放在畫面細節、版面結構與 RWD，雖然已經有電商網站的外觀，但本質上仍然是靜態作品。

後來回頭看覺得有點可惜：頁面都做出來了，卻沒有註冊登入、商品資料串接，也沒有真正能運作的收藏功能。所以這次決定用 **Vue 3 SPA** 重新實作，補上會員登入、商品 API、收藏清單同步等功能，讓它從「看起來像電商」變成「真的有基本互動流程」的前端專案。

後端則使用 `json-server` 搭配 `json-server-auth`，快速取得 `/register`、`/login` 這類驗證端點，把練習重點放在前端串接與登入流程。部署上採前後端分離，前端放 Vercel，後端 json-server 放 Render。


### 二、 登入狀態不只要記得，API 請求也要帶得出去

登入狀態要「跨重整還記得」這件事，其實在上一個 React 專案（YeStep）就處理過——當時用 `js-cookie` 把 token 存 7 天，`dispatch` 到 Redux 的 `authSlice`，這兩件事在同一個 reducer 裡一起完成。這次搬到 Vue 版本，Pinia 的 `setAuth()` 除了做同樣的「存 store 狀態、寫 cookie」，還多了一步：直接在同一個 function 裡把 token 設進 axios 的全域授權 header。

這一步在 React 那邊完全沒有出現。回頭查了當時建立 axios 實例的 `server/api.js`，也只單純設定了 `baseURL`，沒有攔截器（interceptor），也沒有預設的 Authorization header：

```js
import axios from 'axios'
export const TrailsApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
})
```

也就是說，React 版本的 axios 實例本身並不負責「自動幫請求帶上 token」這件事。`authSlice` 只處理登入狀態與 cookie，`api.js` 則只設定 `baseURL`，兩邊之間並沒有建立一個把 token 掛到請求 header 的機制。

這次改成 Vue 3 + Pinia 後，我把這段流程集中處理在 auth store 裡。`setAuth()` 會在登入成功後儲存狀態、寫入 cookie，並同步設定 `axios.defaults.headers.common.Authorization`；而 `initAuth()` 則會在頁面重新整理後，從 cookie 取回 token，再重新把它掛回 axios 的全域授權 header。

這樣設定之後，只要之後都是用同一個 axios 去打 API，它就會自動把 token 一起帶出去，不用每次呼叫 API 時都自己手動加上 Authorization。
這次讓我比較有感的是：把 token 存進 cookie 或 store，只是代表前端「記得這個使用者登入過」；但真正打 API 的時候，還是要把 token 放進請求裡，後端才會知道這個使用者是誰。

回頭找到當時真的呼叫收藏 API 的地方，證實了這個猜測：

```jsx
const token = Cookies.get('accessToken')
const [trailsRes, favRes] = await Promise.all([
  TrailsApi.get('/trails', { params: { _limit: 9999 } }),
  TrailsApi.get('/favorites', {
    params: { userId: user.id, _limit: 9999 },
    headers: { Authorization: `Bearer ${token}` },
  }),
])
```

React 版本的做法，是在需要授權的 API 被呼叫時，才臨時從 cookie 讀出 token，然後手動組成 Authorization header，放進這一次的請求裡。而且這個 token 是直接從 cookie 讀取，不是從 Redux store 拿。

這樣寫功能上沒有問題，API 一樣可以成功帶 token。只是如果專案裡有很多地方都需要呼叫會員相關 API，每個地方就都要重複一次「讀 cookie、組 header、送出請求」的流程。久了之後，登入驗證相關邏輯就會散落在不同的 API 呼叫點，比較不容易集中管理。

這次 Vue 版本則是換了一種做法：在 `setAuth()` 和 `initAuth()` 裡先把 token 設定到 axios 的全域 Authorization header。這樣之後只要用同一個 axios 發請求，就會自動帶上 token，不需要每個 API 都自己手動組 header。

所以這次回頭比較兩邊程式碼後，我才注意到一個架構上的差異：React 版本是「每次需要時再各自處理」，Vue 版本則是「登入初始化時先集中處理好」。這兩種做法不一定誰對誰錯，只是前者比較分散，後者比較集中，也讓我更清楚知道登入狀態和 API 授權 header 之間的關係。


### 三、權限控管：React 是元件包裝，Vue 是路由攔截

這次比較陌生的地方，是權限控管要怎麼在 Vue 裡實作。
在上一個 React 專案 YeStep 裡，我用的是元件包裝的方式：

```jsx
// React：ProtectedRoute 是一個包裝元件
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.auth.isLogin)

  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
```
使用時，只要把需要保護的頁面包起來：

```jsx
<ProtectedRoute>
  <Member />
</ProtectedRoute>
```

它的概念其實很直覺：`ProtectedRoute` 本身也是一個元件，只是它會根據 Redux 裡的登入狀態，決定要渲染原本的頁面，還是導向登入頁。
也就是說，在 React 版本裡，權限控管比較像是「**元件要不要被渲染**」的問題。它走的是 React 很常見的宣告式思路：畫面要長什麼樣子，都由元件根據狀態決定。

到了 Vue Router，做法就不太一樣。
Vue Router 的權限控管通常會放在路由層處理，也就是在頁面真正進入之前先攔截：

```js
// Vue：beforeEach 是全域導航守衛，不是元件
router.beforeEach((to) => {
  const isLogin = !!Cookies.get('token')

  // 需登入卻未登入 > 導到登入頁，並記住原本要去的頁面
  if (to.meta.requiresAuth && !isLogin) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 已登入卻想進登入 / 註冊頁 > 導回首頁
  if (to.meta.guestOnly && isLogin) {
    return { name: 'index' }
  }
})
```

`beforeEach` 是 Vue Router 的全域導航守衛。每一次路由切換前，它都會先執行一次，並透過 `next()` 決定這次導航要不要放行。
所以在 Vue 版本裡，權限控管不是等元件開始渲染後才判斷，而是在「準備進入頁面之前」就先處理完。
哪些頁面需要登入，則是寫在路由設定的 `meta` 裡：

```js
{
  path: '/collection',
  name: 'collection',
  component: () => import('../views/ProductCollectionView.vue'),
  meta: {
    requiresAuth: true,
    title: '我的收藏',
  },
}
```
:::info
這裡的 `meta` 可以把它想成 Vue Router 幫每個路由準備的一個自訂資料袋。裡面可以放自己定義的資料，例如 `requiresAuth`、`guestOnly`、`title`，之後就能在導航守衛裡透過 `to.meta.xxx` 讀出來使用。
它跟 HTML `<head>` 裡的 `<meta>` 標籤不是同一件事。路由裡的 `meta` 純粹是給程式邏輯判斷用的資料，不會直接出現在網頁原始碼裡。
:::


這次回頭比對 React 版 YeStep 的路由設定，也發現一個以前沒有特別處理的地方。
YeStep 當時只有 `/member` 被 `ProtectedRoute` 包起來，其他頁面都是開放的。這樣的設計本身沒問題，因為瀏覽步道、查看詳細頁本來就不需要登入，只有進入會員中心或執行收藏動作時才需要驗證身分。

不過 React 版本沒有做「反向保護」。也就是說，已經登入的人一樣可以直接打開 `/login` 或 `/register`，路由本身不會阻擋。
這次 Vue 版本則多補了一層 `guestOnly`。登入頁和註冊頁會被標記成只給未登入使用者進入，如果使用者已經登入，`beforeEach` 就會直接把他導回首頁。

```js
{
  path: '/login',
  name: 'login',
  component: () => import('../views/LoginView.vue'),
  meta: {
    guestOnly: true,
    title: '會員登入',
  },
}
```
一開始我也想在 `beforeEach` 裡直接讀 Pinia 的 auth store，靠 `isLogin` 判斷使用者有沒有登入。但後來發現，這樣在頁面重新整理時可能會有時序問題。因為 Pinia 的狀態是存在這一次網頁執行中的資料。當頁面重新整理時，整個 Vue app 會重新啟動，Pinia store 也會重新建立。這時候 store 裡的登入狀態可能還沒來得及從 cookie 還原，但路由守衛已經先開始判斷這個頁面能不能進入了。cookie 則不一樣。只要 token 有存進 cookie，就算頁面重新整理，它也還會留在瀏覽器裡。所以在路由守衛這種「一進頁面就要立刻判斷」的地方，直接讀 cookie 會比較穩定。

**簡單來說，Pinia 比較像是給畫面和元件使用的登入狀態；cookie 則是頁面重整後，仍然能拿來判斷使用者是否登入的依據。**

這也跟 `initAuth()` 要解決的問題有關：

```js
// main.js
app.use(createPinia())     // ① 先啟用 Pinia
app.use(router)            // ② 再掛路由
useAuthStore().initAuth()  // ③ 從 cookie 還原 token，並補回 axios header
app.mount('#app')          // ④ 最後掛載
```

頁面重整後，cookie 裡的 token 還在，但 Pinia store 和 axios 設定都會重新開始。也就是說，前端雖然可以從 cookie 找回 token，但 axios 不會自動知道：「這個 token 等一下要放進 API 請求的 header 裡。」

所以 `initAuth()` 的工作，就是在 app 掛載前，先從 cookie 取回 token，重新更新登入狀態，並把 token 補回 axios 的 `Authorization` header。這樣後續發送需要授權的 API 時，axios 才會自動帶上 token，不會出現畫面看起來已登入，但實際打 API 卻因為沒帶 token 而拿到 `401` 的情況。

比較下來，這次最大的收穫不是單純學會怎麼用 cookie，而是更清楚理解同一個「權限控管」需求，在 React 和 Vue 裡的處理位置其實不太一樣。

React 版本是用 `ProtectedRoute` 把需要保護的頁面包起來，讓元件根據登入狀態決定要顯示原本的頁面，還是導向登入頁。Vue 版本則是用 `beforeEach` 在路由切換前先攔截，先判斷使用者能不能進入目標頁面。

兩邊都需要靠 cookie 保存跨重整後仍然存在的 token，但實作的切入點不同：React 比較像是在元件層判斷，Vue 則是在路由層攔截。這次才比較清楚感覺到，從 React 換到 Vue，不只是語法換掉而已，很多功能背後的思考方式也會跟著改變。



### 四、 功能實作重點

#### 1. Pinia：比 Redux Toolkit 更直覺的狀態管理

上一個 React 專案 YeStep 用的是 Redux Toolkit，這次改用 Pinia，最明顯的差別是寫法簡單很多。Redux Toolkit 還是需要透過 slice、reducer、dispatch 來管理狀態；Pinia 則是直接在一個 store 裡放 state，並寫操作 state 的 function，不需要再另外拆 action type 或 reducer。對我來說，Pinia 比較直覺，尤其在寫 auth store 和 favorites store 時，比較不容易被狀態管理本身的架構卡住。

#### 2. 跨 store 同步：登入後更新收藏清單

這次比較需要釐清的是 auth store 和 favorites store 之間的關係。登入成功後，auth store 只負責處理登入狀態，不會直接去抓收藏資料。收藏清單的更新，是由 Nav 元件用 `watch` 監聽 `authStore.isLogin`。當狀態從未登入變成已登入時，再呼叫 `favoriteStore.fetchFavorites()`，把該會員的收藏清單抓回來。這樣的做法讓兩個 store 不用直接互相依賴，而是透過元件來負責「登入後要做什麼事」。對我來說，這也是這次比較明顯感受到 `watch` 用途的地方。

#### 3. 商品與收藏

商品列表 `GET /products` 不需要登入，任何使用者都可以瀏覽。但收藏功能會綁定會員的 `memberId`，所以必須登入後才能新增或取消收藏。
這次收藏功能是用 Pinia 的同一個 store 集中管理。Nav 上的收藏數量、商品頁的愛心圖示、收藏頁的清單，三個地方都共用同一份 `favorites` 狀態。只要執行一次 `addFavorite` 或 `removeFavorite`，這三個地方就會一起更新，不需要每個頁面各自重新打 API。

抓收藏清單的程式如下：

```js
// 目前會員的收藏（_expand=product 一併帶出商品資料）
const fetchFavorites = async () => {
  const authStore = useAuthStore()

  if (!authStore.isLogin) {
    favorites.value = []
    return
  }

  try {
    const res = await axios.get(`${url}/favorites`, {
      params: {
        memberId: authStore.memberId,
        _expand: 'product',
      },
    })

    // 過濾掉對應商品已不存在的收藏，避免後續讀取 product 時出錯
    favorites.value = res.data.filter((item) => item.product)
  } catch (error) {
    console.error(error)
  }
}
```

這裡的 `_expand=product` 是 `json-server` 的語法，不是 axios 或 Vue 的功能。
每筆收藏資料原本只會存 `productId`。加上 `_expand=product` 後，`json-server` 會根據 `productId` 找到對應的商品資料，並把完整商品物件一起放進回傳結果裡。這樣前端就可以直接使用 `fav.product.name`、`fav.product.price`，不用再另外打一支 `/products/:id` API 來拼資料。

另外，程式裡也加了一層防呆：

```js
favorites.value = res.data.filter((item) => item.product)
```

這行是為了避免商品資料已經被刪掉，但收藏資料還留著。當 `_expand` 找不到對應商品時，`item.product` 會是空的，如果前端直接渲染就可能出錯，所以先把這類資料過濾掉。

商品頁的愛心狀態則是透過 `computed` 讀取 store：

```js
const isFavorite = computed(() => favoriteStore.isFavorite(props.id))
```
這樣商品是否已收藏，會直接跟著 Pinia 裡的 `favorites` 狀態變化。當使用者收藏或取消收藏後，愛心圖示會自動更新，不需要手動刷新畫面。


### 五、 踩雷紀錄

這次的坑其實不多，CSS 是自己手刻的 SCSS，沒有框架 class 誤用的問題；大部分工作也就是基礎的 API 串接、生命週期、Vue 指令的使用，比較需要繼續熟悉的反而是 `watch` 的語法。真正卡住、算得上「踩雷」的地方，集中在部署階段的環境變數。

#### 部署三連坑：一路踩到才真的搞懂環境變數

這三個問題其實是同一件事，分三次才踩完：

| # | 坑 | 真相 |
|---|---|---|
| 1 | 線上一直出現 `/undefined/newProduct` 404 | `VITE_API_URL` 是 build 時就寫死的；`.env.production` 被 `.gitignore` 排除，Vercel build 時讀不到 |
| 2 | 在 Render 設了環境變數，前端還是壞的 | 設錯平台——`VITE_API_URL` 是前端打包時要用的變數，要設在 Vercel，不是後端所在的 Render |
| 3 | 改完 Vercel 的變數，重整網頁還是沒用 | Vite 的環境變數是 build 時寫死進 JS 檔的，改完要**重新 Deploy** 才會生效，單純重整網頁沒有意義 |

一開始只看到 404，直覺反應是「後端沒設好」，所以先跑去 Render 補了變數，結果當然沒用；後來才想到問題出在前端 build 的階段，改到 Vercel 後台，卻又因為沒有重新部署卡了一次。三個問題疊在一起，才真正把「Vite 環境變數 build 時寫死」這件事刻進腦子裡。

### 六、 查文件補齊的知識點

除了部署踩的坑，開發過程中還有幾個原本不熟悉、透過查文件或問 AI 補起來的地方——這些比較算是知識缺口，

#### 1. 切頁後的捲動位置

從商品列表捲到很下面才點進詳細頁，發現新頁面預設會停在跟上一頁一樣的捲動位置，而不是自動回到頂端。查了 Vue Router 文件才知道要自己加 `scrollBehavior`：

```js
const router = createRouter({
  // ...
  scrollBehavior() {
    return { top: 0 }
  },
})
```

#### 2. `document.title` 不等於 SEO

一開始不確定 `meta.title` + `afterEach` 統一寫入 `document.title` 這個做法，跟「做 SEO」之間的關係，查了文件、也問了 AI 才搞懂：這個做法主要是 UX，包含瀏覽器分頁標題、書籤預設名稱、瀏覽紀錄。但因為是 SPA，`document.title` 是 JS 在瀏覽器端才改的，不執行 JS 的爬蟲或社群分享預覽（像 Line、Facebook）只會讀到 `index.html` 裡固定寫死的 `<title>`，看不到動態切換後的內容。真正的 SEO 還需要另外補 `<meta name="description">`、Open Graph 這些靜態就存在於 HTML 裡的標籤。

這部分是這次自己第一次動手做，上一個 React 專案的 SEO 設定是隊友處理的，這次算是第一次真正搞懂 `document.title` 跟 SEO 之間的界線在哪裡。

### 七、跟 Nuxt 專案比起來：重新認識生命週期與 watch

做完這個 Vue SPA 專案後，回頭比較上一次 Nuxt 專案，最大的差異其實不是技術難度，而是「**資料什麼時候該抓**」這件事，這次需要自己想得更清楚。

在 Nuxt 裡，`useAsyncData`、`useFetch` 會幫忙處理資料取得、SSR 渲染和 hydration 的流程。很多資料抓取的時機，框架已經先幫你設計好了。但這次是純 Vue 3 SPA，沒有 Nuxt 這一層幫忙判斷，所以什麼時候抓資料、什麼時候重新抓資料，都要自己透過生命週期和 `watch` 處理。

最明顯的例子是商品詳細頁。這個頁面會根據路由參數 `:id` 抓不同商品資料。如果只在 `onMounted` 裡打一次 API，第一次進頁面時沒有問題；但當同一個元件切換到另一個商品 id 時，畫面不一定會更新，因為元件本身沒有重新掛載，`onMounted` 也不會再執行一次。

所以這種情況就需要用 `watch` 監聽 `props.id`：

```js
watch(
  () => props.id,
  () => fetchProduct(),
  { immediate: true }
)
```

這裡的 `immediate: true` 是讓 `watch` 一開始就先執行一次，所以它同時處理了兩件事：第一次進頁面時抓資料，以及後續 `props.id` 改變時重新抓資料。

這次比較清楚感受到，`onMounted` 和 `watch` 的用途其實不一樣。`onMounted` 適合處理「**   元件剛出現時只做一次**」的事情；`watch` 則適合處理「**某個資料改變時，要重新執行**」的情況。

以前在 Nuxt 裡，很多資料流的時機被框架包起來了，感覺比較不明顯。這次回到純 Vue SPA，反而更直接感受到生命週期和 `watch` 的差別，也更清楚知道它們不能互相取代。


### 八、 心得

#### 1. 同一個需求，在不同框架裡會有不同解法

這次比較明顯的感受是，登入權限控管在 React 和 Vue 裡的處理方式很不一樣。React 版本是用 `ProtectedRoute` 把需要保護的頁面包起來，根據登入狀態決定要顯示原本的頁面，還是導向登入頁。Vue 版本則是用 `beforeEach` 在路由切換前先攔截，判斷使用者能不能進入目標頁面。兩邊要解的問題一樣，都是「未登入時不能進入特定頁面」，但處理的位置不同。這讓我意識到，換框架不只是換語法，也要重新理解這個功能在框架裡應該放在哪一層處理。

#### 2. 純 SPA 要自己想清楚資料什麼時候更新

跟 Nuxt 專案相比，Vue SPA 需要自己處理更多資料更新的時機。Nuxt 有 `useAsyncData` 這類 API，會幫忙處理一些資料取得和頁面渲染的流程。但在純 Vue SPA 裡，像是什麼時候用 `onMounted` 抓資料、什麼時候用 `watch` 監聽狀態變化，都要自己拆清楚。如果沒有想清楚，就很容易遇到畫面沒有更新、資料還沒準備好，或是同一支 API 被重複呼叫的問題。

#### 3. `watch` 還需要繼續練熟

這次用到很多 `watch`，例如監聽路由參數變化、登入狀態改變後更新收藏清單，都是靠 `watch` 串起來的。以前比較常把資料抓取放在 `onMounted`，但這次發現，很多情況不是「頁面載入時抓一次」就結束，而是要根據狀態變化重新處理資料。像是什麼時候該加 `immediate: true`、要監聽單一資料還是多個資料來源，這些都還需要繼續練習。這次算是先知道 `watch` 很重要，接下來要讓自己更熟悉它的使用時機。


### 九、 總結

從上一個 Nuxt SSR 專案，到這次把手刻切版重做成有登入、有資料、有收藏邏輯的 Vue SPA，最大的收穫是重新確認了一件事：

> **框架幫你處理掉的地方，往往也是最容易被忽略、但最值得回頭搞懂的地方。**

這次的登入機制，是上一個 Nuxt 部落格專案完全沒有碰到的部分。像是 cookie、axios header 之間該怎麼分工，都是這次重新建立起來的理解，跟有沒有 SSR 沒有直接關係。

真正讓我感受到「少了框架幫忙兜底」的地方，反而是 `onMounted` 和 `watch` 的使用時機。因為純 Vue SPA 不會自動幫我決定資料什麼時候該抓、什麼時候該重新抓，所以這次更清楚理解到：`onMounted` 負責元件出現時做一次，`watch` 則負責在資料變化時重新處理。

這份紀錄，也算是把自己從靜態切版走到可互動專案的過程整理下來。希望能幫到同樣正在練習把畫面作品，慢慢做成真正能運作網站的人。

