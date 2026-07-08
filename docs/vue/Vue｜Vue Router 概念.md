---
title: Vue｜ Vue Router 觀念
sidebar_position: 6
tags: [Vue, JavaScript, 知識點筆記]
date: 2026-05-07
slug: vue/vue-router-concepts
---

### 一、Router 架構

![Vue Router 架構圖](/img/vue04-1.svg)

### 二、Router 定義

- 在傳統的多頁網站（MPA）中，每點一個連結瀏覽器就會重新跟伺服器拿一個 HTML 檔，整個畫面會閃一下重新載入。這種方式的缺點是 **體驗不連貫，** 每次切頁都要等伺服器、重新下載 CSS/JS、重新建立狀態。
- **SPA（Single Page Application，單頁應用）則是把整個網站打包成一個 HTML**，所有「換頁」其實都是 JavaScript 在做的事：**根據網址不同，動態切換要顯示的元件**。畫面不會整個刷新，狀態（例如登入資訊、購物車）也能保留。
- **Vue Router 就是 Vue 官方提供的「網址 ↔ 元件」對照工具**，幫我們把 URL 跟要渲染的 Vue 元件綁在一起。

#### 1. 什麼是路由（Routing）

- **路由就是「網址」對應到「要顯示哪個元件」的對照表**。
- 可以想像成一本電話簿：

  | 網址（Key） | 對應元件（Value） |
  | --- | --- |
  | `/` | HomeView.vue |
  | `/about` | AboutView.vue |
  | `/login` | LoginView.vue |
  | `/todo` | TodoView.vue |

- 當使用者在網址列輸入 `/about`，Vue Router 翻一下路由表，找到對應的 `AboutView.vue`，再透過 `<RouterView />` 把它渲染出來。

#### 2. 專案初始化

- 使用 Vite 建立 Vue 專案，過程中會問你要不要加 Vue Router，勾選 Yes 就會自動建立好基本架構：

  ```bash
  npm create vite@latest
  ```

- 如果是現有專案要後補 Router：

  ```bash
  npm install vue-router@4
  ```

- 建立後的關鍵檔案結構大致如下：

  ```text
  src/
  ├── views/              # 頁面元件放這裡（一個路由對應一個檔案）
  │   ├── HomeView.vue
  │   └── AboutView.vue
  ├── router/
  │   └── index.js        # 路由配置中心
  ├── App.vue             # 放 <RouterView /> 的最外層
  └── main.js             # 註冊 router 到 Vue 實例
  ```

  :::note
  **注意：** Vue 官方建議用 `XxxView.vue` 來命名頁面元件，跟一般的小元件（例如 `Button.vue`）做區隔，這不是強制規定。
  :::

### 三、CreateWeb 兩種選擇模式

- Vue Router 提供兩種模式，**部署環境決定該用哪一種**。

#### 1. createWebHistory

- 優點：網址乾淨、漂亮，沒有 `#` 符號
- 缺點：當使用者直接在這個網址重新整理（F5），瀏覽器會真的去跟伺服器要 `/about` 這個資源，但伺服器根本沒這個檔案（你只有 `index.html`），就會 404。所以這個模式**需要伺服器額外設定**，把所有未匹配的請求都導回 `index.html`。

  ```text
  https://example.com/about
  https://example.com/user/123
  ```

- 範例 → **無法直接部署到 GitHub Pages**，因為 GitHub Pages 是**靜態託管**，不能改伺服器設定。

  ```js
  import { createRouter, createWebHistory } from 'vue-router'

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), 
    //  import.meta.env.BASE_URL
    // 是 Vite 內建的環境變數，代表這個 App 目前部署所在的根目錄路徑，值是由 vite.config.js 裡的 base 這個設定決定的。
    routes: [/* ... */]
  })
  ```

#### 2. createWebHashHistory（Hash 模式）

- 特徵：網址帶 `#` 符號，`#` 後面的部分對瀏覽器來說屬於「錨點」，不會被當成真的路徑送給伺服器，所以**不管使用者怎麼重新整理都不會 404**。
- 如果你的部署平台是 Vercel、Netlify、Cloudflare Pages，它們有內建 SPA fallback，可以放心用 `createWebHistory`；但只要是 GitHub Pages 或一般靜態空間，**直接用 Hash 模式最省事**。

  ```text
  https://example.com/#/about
  https://example.com/#/user/123
  ```

- 範例 → **要部署到 GitHub Pages，請務必用這個模式。**

  ```js
  import { createRouter, createWebHashHistory } from 'vue-router'

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [/* ... */]
  })
  ```

### 四、新增路由的三步驟

#### 1. 開新頁面檔案

- 在 `src/views/` 底下建立 `AboutView.vue`：

  ```vue
  <template>
    <div>
      <h1>關於我們</h1>
      <p>這裡是 About 頁面</p>
    </div>
  </template>
  ```

#### 2. 在路由表註冊

- 打開 `src/router/index.js`，把這個頁面加進 routes 陣列：

  ```js
  import { createRouter, createWebHashHistory } from 'vue-router'
  import HomeView from '../views/HomeView.vue'

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView
      },
      {
        path: '/about',
        name: 'about',
        // 用 import() 做動態載入（懶載入），打包後會分檔
        component: () => import('../views/AboutView.vue')
      }
    ]
  })

  export default router
  ```

#### 3. 放上連結

- 在 `App.vue` 或任何元件裡放 `<RouterLink>`，再用 `<RouterView />` 指定渲染位置：

  ```vue
  <template>
    <nav>
      <RouterLink to="/">首頁</RouterLink>
      <RouterLink to="/about">關於</RouterLink>
    </nav>

    <!-- 路由匹配到的元件會渲染在這裡 -->
    <RouterView />
  </template>
  ```

  :::note
  - **注意：**`<RouterLink>` 看起來很像 `<a>`，但它**不會真的觸發瀏覽器重新載入**，而是攔截點擊事件，由 Vue Router 內部處理跳轉，所以「不要用 `<a href="/about">` 來做頁面內導覽」，那樣會整頁刷新，失去 SPA 的意義。
  :::

#### 4. 靜態 import vs 動態 import

- 注意上面 HomeView 是直接 `import`，AboutView 是用 `() => import()` 動態載入。差別：
  - **靜態 import**：打包時全部塞進主 bundle，首次載入較慢但切頁瞬間
  - **動態 import**（懶載入）：切到那個路由才下載對應的 JS 檔，首次載入快、但切頁時可能有極短延遲
- **建議**：首頁用靜態 import（讓首屏快），其他頁面用動態 import。專案大了之後差異很明顯。

### 五、路由的結構

#### 1. 基本路由（一對一）

- 一個 path 對應一個元件。

#### 2. 巢狀路由（Nested Routes）

- **主要用途：** 版型重複利用。
- 想像一個會員中心，左側有固定的選單（個人資料、訂單、設定），右側內容區會根據選的項目換內容。如果用基本路由，每個頁面都要重寫一次選單，巢狀路由就是解決這個問題。
- 範例： `router/index.js`：

  ```js
  {
    path: '/member',
    component: () => import('../views/MemberLayout.vue'),
    children: [
      {
        path: 'profile',           // 對應網址 /member/profile
        component: () => import('../views/member/Profile.vue')
      },
      {
        path: 'orders',            // 對應網址 /member/orders
        component: () => import('../views/member/Orders.vue')
      },
      {
        path: 'settings',          // 對應網址 /member/settings
        component: () => import('../views/member/Settings.vue')
      }
    ]
  }
  ```

- 父層元件 `MemberLayout.vue` 要再放一個 `<RouterView />` 給子路由用：

  ```vue
  <template>
    <div class="member-layout">
      <aside class="sidebar">
        <RouterLink to="/member/profile">個人資料</RouterLink>
        <RouterLink to="/member/orders">我的訂單</RouterLink>
        <RouterLink to="/member/settings">帳號設定</RouterLink>
      </aside>

      <main class="content">
        <!-- 子路由元件會渲染在這裡 -->
        <RouterView />
      </main>
    </div>
  </template>
  ```

  :::note
  - **觀念釐清：**巢狀路由的關鍵不是「網址有沒有斜線」，而是「**版型有沒有共用**」。如果兩個頁面長相完全不同，硬做巢狀反而綁手綁腳。判斷依據：畫面上是不是有一塊區域**完全一樣**？有，就用巢狀；沒有，就基本路由各自獨立。
  :::

#### 3. 巢狀路由進階應用：前台／後台雙 Layout

- **情境：** 專案通常會同時有「前台」（給一般使用者逛的頁面，例如首頁、商品頁）跟「後台」（給管理者用的頁面，例如商品管理、訂單管理）。這兩塊的導覽列、版面配置、甚至驗證邏輯通常完全不同，後台可能要側邊選單＋登入驗證，前台則是上方導覽列＋一般瀏覽。
- **常見的錯誤做法：** 把所有頁面塞在同一層路由，然後在 `App.vue` 裡用 `v-if` 判斷目前路徑是不是 `/admin` 開頭，再決定要顯示哪個導覽列。條件會越疊越多，`App.vue` 變成什麼都要管的巨型元件。
- **正確做法：** 把「前台 Layout」跟「後台 Layout」各自當成一個**父層路由**，本身不對應任何實際內容頁面，只負責放共用的外觀骨架（導覽列／側邊欄＋`<RouterView />`），底下再用 `children` 掛各自的頁面。這跟上面「會員中心」的巢狀路由觀念完全一樣，只是把它套用在「整個網站的最外層」。

  :::note
  **判斷依據延伸：**巢狀路由的關鍵是「版型有沒有共用」。前台、後台各自的頁面群組內部有共用版型（同一份導覽列／側邊欄），但前台跟後台彼此之間**沒有**共用版型，所以要拆成兩個各自獨立的父層路由，而不是全部塞進同一個父層。
  :::

- **Step 1：建立兩個 Layout 元件**

  `layouts/FrontLayout.vue`（前台外觀）：

  ```vue
  <template>
    <div class="front-layout">
      <header class="front-header">
        <RouterLink to="/">首頁</RouterLink>
        <RouterLink to="/products">商品列表</RouterLink>
      </header>

      <main>
        <!-- 前台各頁面會渲染在這裡 -->
        <RouterView />
      </main>

      <footer>© 2026 我的商店</footer>
    </div>
  </template>
  ```

  `layouts/AdminLayout.vue`（後台外觀）：

  ```vue
  <template>
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <RouterLink to="/admin/dashboard">儀表板</RouterLink>
        <RouterLink to="/admin/products">商品管理</RouterLink>
        <RouterLink to="/admin/orders">訂單管理</RouterLink>
      </aside>

      <main class="admin-content">
        <!-- 後台各頁面會渲染在這裡 -->
        <RouterView />
      </main>
    </div>
  </template>
  ```

- **Step 2：`router/index.js` 把兩個 Layout 各自當父層路由**

  ```js
  import { createRouter, createWebHashHistory } from 'vue-router'

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        component: () => import('../layouts/FrontLayout.vue'), // 前台外觀
        children: [
          {
            path: '',
            name: 'home',
            component: () => import('../views/front/HomeView.vue')
          },
          {
            path: 'products',
            name: 'products',
            component: () => import('../views/front/ProductsView.vue')
          },
          {
            path: 'products/:id',
            name: 'product-detail',
            component: () => import('../views/front/ProductDetail.vue')
          }
        ]
      },
      {
        path: '/admin',
        component: () => import('../layouts/AdminLayout.vue'), // 後台外觀
        meta: { requiresAuth: true }, // 權限，掛在父層，子路由會繼承
        children: [
          {
            path: '',
            redirect: '/admin/dashboard' // 進 /admin 自動導向儀表板
          },
          {
            path: 'dashboard',
            name: 'admin-dashboard',
            component: () => import('../views/admin/Dashboard.vue')
          },
          {
            path: 'products',
            name: 'admin-products',
            component: () => import('../views/admin/ProductList.vue')
          },
          {
            path: 'orders',
            name: 'admin-orders',
            component: () => import('../views/admin/OrderList.vue')
          }
        ]
      },
      {
        // 404 一定要放最後
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
      }
    ]
  })

  export default router
  ```

  :::note
  - **關於 meta 繼承：** Vue Router 官方文件說明 `route.meta` 是「從父層到子層做非遞迴合併（non-recursive merge）」後的結果。所以只要把 `requiresAuth: true` 掛在 `/admin` 這個父層路由上，底下所有子路由（`dashboard`、`products`、`orders`……）在 `to.meta.requiresAuth` 都能直接讀到 `true`，不用每個子路由都重複寫一次。
  :::

- **Step 3：`App.vue` 完全不用判斷式，交給路由表決定**

  ```vue
  <template>
    <RouterView />
  </template>
  ```

  :::warning
  - **重要觀念：**`App.vue` 應該保持極簡，只放最外層的 `<RouterView />`，**不要**在這裡寫 `v-if (route.path.startsWith('/admin'))` 之類的判斷式去手動切版型。是「路由表」在決定目前要套用哪個 Layout（前台走 `FrontLayout`，後台走 `AdminLayout`），`App.vue` 本身不需要知道現在是前台還是後台。這樣以後如果要再加第三種 Layout（例如手機版、行銷活動頁），只要在 `routes` 裡多開一個父層就好，`App.vue` 完全不用動。
  :::

- **Step 4：後台登入驗證（搭配全域守衛）**

  ```js
  router.beforeEach((to) => {
    const isLogin = !!Cookies.get('token')
    if (to.meta.requiresAuth && !isLogin) {
      // 沒登入就導回登入頁，並記住原本要去哪
      return {
        path: '/admin/login',
        query: { redirect: to.fullPath }
      }
    }
  })
  ```

  :::note
  - 注意 `/admin/login` 通常要**獨立在 `/admin` 這個父層之外**（或明確設成 `meta: { requiresAuth: false }` 覆蓋掉），不然使用者連登入頁都進不去，會卡在無窮迴圈。
  :::

#### 4. 動態路由（Dynamic Routes）

- 當路徑中有「變數」時使用。最經典的例子：商品詳情頁、使用者個人頁。不可能為每個 ID 都寫一個 `.vue` 檔，所以用動態路由——**同一個元件，根據 URL 參數顯示不同內容**。

  ```text
  /user/1   → 顯示 ID 為 1 的使用者
  /user/2   → 顯示 ID 為 2 的使用者
  /user/999 → 顯示 ID 為 999 的使用者
  ```

#### 5. 動態路由完整實作範例

- Step 1：定義路由   `router/index.js`：

  ```js
  import { createRouter, createWebHashHistory } from 'vue-router'

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        component: () => import('../views/HomeView.vue')
      },
      {
        // :id 是動態參數，任何值都會匹配
        // 例如 /user/1、/user/abc、/user/hello 都會進來
        path: '/user/:id',
        name: 'user',
        component: () => import('../views/UserView.vue')
      }
    ]
  })

  export default router
  ```

- Step 2：建立首頁，放幾個連結  `views/HomeView.vue`：

  ```vue
  <template>
    <div>
      <h1>選擇一位使用者</h1>
      <ul>
        <li v-for="n in 5" :key="n">
          <RouterLink :to="`/user/${n}`">使用者 #{{ n }}</RouterLink>
        </li>
      </ul>
    </div>
  </template>
  ```

  :::note
  **注意：** 這裡 `<RouterLink :to="...">` 用了動態綁定（前面加冒號），這樣 `to` 的值才能用模板字串組出來。
  :::

- Step 3：動態頁面接收參數、發 API   `views/UserView.vue`：

  ```vue
  <template>
    <div class="user-page">
      <RouterLink to="/">← 回首頁</RouterLink>

      <h1>使用者編號：{{ id }}</h1>

      <div v-if="loading">載入中...</div>

      <div v-else-if="person" class="profile">
        <img :src="person.picture.large" :alt="person.name.first" />
        <h2>
          {{ person.name.first }} {{ person.name.last }}
        </h2>
        <p>📧 {{ person.email }}</p>
        <p>📍 {{ person.location.country }}</p>
        <p>🎂 {{ person.dob.age }} 歲</p>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'

  const route = useRoute()
  const person = ref(null)
  const loading = ref(false)

  // 取得網址上的 :id 參數
  const id = route.params.id

  // 把抓資料邏輯獨立出來
  const fetchUser = async (userId) => {
    loading.value = true
    try {
      const res = await axios.get(
        `https://randomuser.me/api/?seed=${userId}`
      )
      person.value = res.data.results[0]
    } catch (err) {
      console.error('取得使用者失敗：', err)
    } finally {
      loading.value = false
    }
  }

  // 第一次進頁面時抓
  onMounted(() => {
    fetchUser(id)
  })

  // ⚠️ 重要：監聽 params 變化
  // 當使用者從 /user/1 切到 /user/2，元件不會重新建立
  // 所以要手動監聽參數變化、重新抓資料
  watch(
    () => route.params.id,
    (newId) => {
      if (newId) fetchUser(newId)
    }
  )
  </script>
  ```

  :::warning
  - **重要觀念：**動態路由「**切換相同元件、不同參數**」時，元件**不會重新 mount**。顧名思義，從 `/user/1` 換到 `/user/2`，`onMounted` 只會在第一次跑，不會再跑第二次。
  - 解決方法：使用 `watch` 監聽 `route.params`
  :::

#### 6. 補充：路由參數 vs 查詢字串

| 類型 | 範例網址 | 取得方式 | 用途 |
| --- | --- | --- | --- |
| **params**（路由參數） | `/user/123` | `route.params.id` | 識別資源（必要的） |
| **query**（查詢字串） | `/search?keyword=vue&page=2` | `route.query.keyword` | 篩選、分頁（可選的） |

- **口訣：params 是「這是誰」，query 是「怎麼篩」。**

  ```vue
  <script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()

  // 假設網址是 /user/123?tab=posts&page=2
  console.log(route.params.id)      // '123'
  console.log(route.query.tab)      // 'posts'
  console.log(route.query.page)     // '2'
  </script>
  ```

### 六、useRoute vs useRouter

#### 1. useRoute

- 讀取「當前路由的狀態」→ **被動讀資料：** 可以拿到 path、params、query、name、meta

  ```js
  import { useRoute } from 'vue-router'

  const route = useRoute()
  console.log(route.path)        // '/user/123'
  console.log(route.params)      // { id: '123' }
  console.log(route.query)       // { tab: 'posts' }
  console.log(route.fullPath)    // '/user/123?tab=posts'
  console.log(route.name)        // 'user'
  ```

#### 2. useRouter

- 操作「路由實例」 → **主動做事：** push 跳頁、replace 換頁、go 上下頁、back 返回

  ```js
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // 跳頁（會留下歷史紀錄，可以按返回鍵回來）
  router.push('/about')

  // 用 name 跳頁（推薦，path 改了也不會壞）
  router.push({ name: 'user', params: { id: 5 } })

  // 帶 query
  router.push({ path: '/search', query: { keyword: 'vue' } })

  // 替換目前頁面（不留歷史紀錄，例如登入後不想讓使用者按返回回到 login）
  router.replace('/dashboard')

  // 上下頁
  router.back()         // 等於瀏覽器返回鍵
  router.forward()      // 等於瀏覽器前進鍵
  router.go(-2)         // 往前兩頁
  ```

  :::note
  - **記憶口訣：**`useRoute` 是「**路**」，走的哪條路，看資訊用，`useRouter` 是走路的人，做動作用。
  :::

- 範例：登入後自動跳轉

  ```vue
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'

  const router = useRouter()
  const email = ref('')
  const password = ref('')

  const login = async () => {
    try {
      const res = await axios.post('/api/login', {
        email: email.value,
        password: password.value
      })
      localStorage.setItem('token', res.data.token)

      // 登入成功，用 replace 而不是 push
      // 這樣使用者按返回鍵不會又回到登入頁
      router.replace('/dashboard')
    } catch (err) {
      alert('登入失敗')
    }
  }
  </script>
  ```

### 七、404 與預設導向

#### 1. 404 頁面：捕捉所有未匹配的網址

- Vue Router 4 用 `pathMatch` 正則來捕捉所有沒命中的路徑：

  ```js
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
  ```

- **把 `/:pathMatch(.*)*` 拆成三段來看：**

  | 片段 | 意思 |
  | --- | --- |
  | `:pathMatch` | 參數名稱，你可以自己取名（例如改叫 `:catchAll` 也可以），之後在 `route.params.pathMatch` 取值 |
  | `(.*)` | 自訂正則，**匹配任意字元、任意次數**（包含 `/`），所以不管網址後面接什麼都會中 |
  | 結尾的 `*` | 這是「重複參數（repeatable params）」修飾符，不是正則的一部分，代表這個參數**可以出現零次或多次** |

- **結尾那個 `*` 為什麼重要？** 它會把匹配到的路徑，依 `/` 拆成一個**陣列**存進 `route.params.pathMatch`：

  ```text
  網址：/not/found
  → route.params.pathMatch === ['not', 'found']
  ```

  如果寫成 `/:pathMatch(.*)`（結尾沒有 `*`），`pathMatch` 會是**單一字串** `'not/found'`。差別在於：之後如果要用 `name` 加 `params` 反查／組出網址（例如 `router.resolve({ name: 'NotFound', params: { pathMatch: ['not', 'found'] } })`），沒有結尾 `*` 的版本會把陣列裡的 `/` 編碼成 `%2F`，組出來的網址會是錯的；加了 `*` 才會正確組回 `/not/found`。

  :::note
  - **實務結論：** 寫 404 catch-all 路由時，`/:pathMatch(.*)*` 結尾的 `*` **建議一定要加**，除非你確定完全不會用 `name` 反查這條路由。
  :::

  :::warning
  - 這條規則一定要放在 routes 陣列的**最後一個**，因為它什麼都會匹配，放前面其他路由就吃不到了。
  :::

#### 2. 預設導向（重新導向）

- **例如使用者輸入根目錄 `/`，想自動跳到 `/home`**：

  ```js
  {
    path: '/',
    redirect: '/home'
  }
  ```

- 或者把所有未知網址導回首頁（不要 404 頁）：

  ```js
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
  ```

### 八、導航守衛（Navigation Guards）

- **守衛在解決什麼問題：** 換頁的當下，攔截這次跳轉，決定「允許跳轉」、「取消跳轉」還是「改跳去別的地方」。
- 最常見的用途：登入驗證、離開頁面前確認未儲存的變更、進頁面前先打 API 拿資料。
- 守衛依作用範圍分三層，觸發時機不同：

  | 層級 | 寫在哪裡 | 用途 |
  | --- | --- | --- |
  | 全域守衛 | `router.beforeEach` / `router.beforeResolve` / `router.afterEach` | 整個 App 共用，例如全站登入驗證 |
  | 路由層級守衛 | 路由設定裡的 `beforeEnter` | 只套用在特定路由 |
#### 1. 全域守衛：`router.beforeEach`

```js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    // 直接 return 一個路由位置，等同於導向那裡
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  }
  // 什麼都不 return，代表允許這次導航
})
```

  :::note
  - **寫法演進：** Vue Router 4 建議直接 `return` 結果（`false` 取消導航、路由物件表示改導向、什麼都不 return 就是放行），比較不容易漏寫 `next()` 而卡住畫面。舊寫法（常見於較早期教學）是用回呼參數 `next()`：
    ```js
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && !localStorage.getItem('token')) {
        next('/admin/login')
      } else {
        next() // 一定要呼叫，忘記寫畫面就會卡住不動
      }
    })
    ```
    兩種寫法 Vue Router 4 都支援，新專案建議用 `return` 寫法。
  :::

#### 2. 路由層級守衛：`beforeEnter`

- 只想針對「單一路由」做檢查，不想影響全站，就掛在該路由的設定上：

  ```js
  {
    path: 'orders/:id',
    component: () => import('../views/admin/OrderDetail.vue'),
    beforeEnter: (to) => {
      // 例如：檢查訂單 id 格式合不合法
      if (!/^\d+$/.test(to.params.id)) {
        return '/admin/orders' // 格式不對就導回列表
      }
    }
  }
  ```

### 九、使用者體驗細節

#### 1. 捲動位置控制（scrollBehavior）

- 預設情況下，SPA 換頁不會像傳統網站自動捲回頂部，需要自己在 `createRouter` 加上 `scrollBehavior`：

  ```js
  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        // 按瀏覽器上一頁/下一頁時，恢復離開時的捲動位置
        return savedPosition
      }
      if (to.hash) {
        // 網址帶錨點（例如 /about#team），捲到對應元素
        return { el: to.hash, behavior: 'smooth' }
      }
      // 其他情況：換頁一律捲回頂部
      return { top: 0 }
    }
  })
  ```

  :::note
  - `scrollBehavior` 只有在使用 `createWebHistory` / `createWebHashHistory`（瀏覽器支援 `history.pushState`）時才會生效。
  :::

#### 2. 保留元件狀態（keep-alive）

- 情境：從商品列表頁點進商品詳情，再按上一頁回列表，如果列表每次都重新打 API、捲動位置也重置，體驗會很差。可以用 `<KeepAlive>` 把元件快取起來，不要每次都重新建立：

  ```vue
  <template>
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </template>
  ```

  :::warning
  **注意：** 不是每個頁面都適合被快取。像表單頁被 `KeepAlive` 快取，使用者填到一半離開又回來、欄位內容還在，通常是好事；但如果是「訂單成功頁」這種一次性頁面被快取住，反而會顯示過期的舊資料。需要更細緻的控制，可以搭配 `<KeepAlive :include="[...]">` 指定只快取特定元件名稱。
  :::

### 十、動態標題（document.title）與 SEO meta

- 情境：瀏覽器分頁標題應該跟著目前頁面變化（例如「商品管理 － 我的後台」，而不是永遠顯示 `index.html` 裡的預設標題），對 SEO、書籤、多分頁辨識都有幫助。

- **Step 1：在路由的 `meta` 上定義標題**

  ```js
  {
    path: 'dashboard',
    name: 'admin-dashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { title: '儀表板' }
  }
  ```

- **Step 2：用 `router.afterEach` 統一更新 `document.title`**

  ```js
  router.afterEach((to) => {
    document.title = to.meta.title
      ? `${to.meta.title} － 我的後台`
      : '我的後台'
  })
  ```

  :::note
  - **為什麼用 `afterEach` 而不是 `beforeEach`：**`afterEach` 是導航**確定成功**之後才觸發，不需要呼叫 `next()`，也不會不小心卡住換頁流程；`beforeEach` 則是換頁前的守衛，主要拿來做「能不能跳轉」的判斷，兩者職責不同。
  - 如果標題要更細緻（例如商品詳情頁要顯示商品名稱），可以在頁面元件內用 `document.title = res.data.title` 動態覆蓋，或是把資料存進 `route.meta` 再讀出來。
  :::

### 十一、參考資源

- [Vue Router 官方中文文件](https://router.vuejs.org/)
- [Vue Router — Nested Routes（巢狀路由官方說明）](https://router.vuejs.org/guide/essentials/nested-routes)
- [Vue Router — Route Meta Fields（meta 欄位合併規則，前台／後台驗證會用到）](https://router.vuejs.org/guide/advanced/meta.html)
- [Vue Router — Navigation Guards（導航守衛官方說明）](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Vue Router — Composition API（onBeforeRouteLeave／onBeforeRouteUpdate）](https://router.vuejs.org/guide/advanced/composition-api.html)
- [Vue Router — Scroll Behavior（捲動位置官方說明）](https://router.vuejs.org/guide/advanced/scroll-behavior)
- [Vue Router — RouterView slot / Transitions（換頁動畫、keep-alive 官方說明）](https://router.vuejs.org/guide/advanced/router-view-slot)
- [Vue Router — Migrating from Vue 2（:pathMatch(.*)* 修飾符的官方解釋）](https://router.vuejs.org/guide/migration/)
- [HTML5 History 模式部署說明](https://router.vuejs.org/zh/guide/essentials/history-mode.html)
- [Catch-all 404 路由](https://router.vuejs.org/guide/essentials/dynamic-matching#Catch-all-404-Not-found-Route)
- [CoreUI：How to create nested routes in Vue（多層巢狀 Layout／Dashboard 範例）](https://coreui.io/answers/how-to-create-nested-routes-in-vue/)
- [randomuser.me API（動態路由練習用）](https://randomuser.me/)
- [第四週講義](https://hackmd.io/@hexschool/rJ4_48Ytlg)
- [助教講義](https://chalk-freedom-ec6.notion.site/2516ab47eb488001b0dff7d3ef5bb719)