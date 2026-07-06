---
title: Vue｜ Vue Router 觀念
sidebar_position: 6
tags: [Vue, JavaScript, 知識點筆記]
date: 2026-05-07
slug: /docs/vue/vue-router-concepts
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
- **注意：** Vue 官方建議用 `XxxView.vue` 來命名頁面元件，跟一般的小元件（例如 `Button.vue`）做區隔，這不是強制規定。
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
- 範例：
    
  `router/index.js`：
    
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

#### 3. 動態路由（Dynamic Routes）

- 當路徑中有「變數」時使用。最經典的例子：商品詳情頁、使用者個人頁。不可能為每個 ID 都寫一個 `.vue` 檔，所以用動態路由——**同一個元件，根據 URL 參數顯示不同內容**。
    
  ```text
  /user/1   → 顯示 ID 為 1 的使用者
  /user/2   → 顯示 ID 為 2 的使用者
  /user/999 → 顯示 ID 為 999 的使用者
  ```

#### 4. 動態路由完整實作範例

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
  - **注意：** 這裡 `<RouterLink :to="...">` 用了動態綁定（前面加冒號），這樣 `to` 的值才能用模板字串組出來。
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
    - 解決方法有兩種：
      1. 用 `watch` 監聽 `route.params`（上面範例的做法，最常見）
      2. 在 `<RouterView>` 加 `:key="$route.fullPath"`，強迫每次路徑變化都重建元件（簡單但效能略差）
  :::

#### 5. 補充：路由參數 vs 查詢字串

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
    
- 拆解一下：
  - `:pathMatch` → 參數名稱（你可以自己取名）
  - `(.*)*` → 正則表達式，匹配任意字元任意次數

  :::warning
  - **注意：**這條規則一定要放在 routes 陣列的**最後一個**，因為它什麼都會匹配，放前面其他路由就吃不到了。
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

### 八、參考資源

- [Vue Router 官方中文文件](https://router.vuejs.org/)
- [HTML5 History 模式部署說明](https://router.vuejs.org/zh/guide/essentials/history-mode.html)
- [Catch-all 404 路由](https://router.vuejs.org/guide/essentials/dynamic-matching#Catch-all-404-Not-found-Route)
- [randomuser.me API（動態路由練習用）](https://randomuser.me/)
- [第四週講義](https://hackmd.io/@hexschool/rJ4_48Ytlg)
- [助教講義](https://chalk-freedom-ec6.notion.site/2516ab47eb488001b0dff7d3ef5bb719)
