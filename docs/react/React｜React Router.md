---
title: React｜React Router
sidebar_position: 6
tags: [React, 知識點筆記]
date: 2025-12-26
slug: react-router
---

### 一、核心觀念

#### 1. 為什麼要有前端路由？ (SPA vs MPA)

- **MPA (多頁式應用 - 傳統)**：
    - **運作**：每次點擊連結，瀏覽器向伺服器發送請求，**重新下載整個 HTML 頁面**。
    - **缺點**：畫面會閃爍（白屏），速度慢。
- **SPA (單頁式應用 - React)**：
    - **運作**：整個網站其實只有 **一個 HTML (index.html)**。
    - **React Router 的角色**：它是一個「騙過瀏覽器」的守門員。當你點擊連結時，它**攔截**了瀏覽器的請求，直接在本地用 JavaScript 把舊的 Component 拿掉，換上新的 Component。
    - **優點**：畫面切換是「瞬間」的，沒有白屏，體驗像 App。

#### 2. URL as the Single Source of Truth

- **「網址是唯一的真理」**。
- **不要**用 `useState` 去記「現在在哪一頁」或是「現在搜尋什麼」。
- **要**看 URL 是什麼，就渲染什麼。
- **好處**：使用者複製網址給朋友，朋友看到的搜尋結果會跟你一模一樣。

#### 3. 設定路由四步驟

- 準備 React Router 環境 → 從 `react-router-dom` 取出 `BrowserRouter` 或者 `HashRouter`
- 定義對應的元件
- 將元件配對到路由
- 加上對應的連結 → 從 `react-router-dom` 取出 `Link`

### 二、路由模式

#### 1. 比較表格
    
| **模式** | **組件** | **URL 外觀** | **原理** | **使用情境** |
| --- | --- | --- | --- | --- |
| **Browser** | `<BrowserRouter>` | `/trails` | History API | **標準首選**。網址乾淨漂亮。但**部署時 Server 需設定** (Redirect all to `index.html`)，否則重整會 404。<br />**→ 伺服器可以自行控制** |
| **Hash** | `<HashRouter>` | `/#/trails` | `window.location.hash` | **部署救星**。網址帶有 `#`。因為 Server 不會讀取 `#` 後的內容，所以**不需要設定 Server**。適合 GitHub Pages。<br />**→ 伺服器不能自行控制** |

#### 2. 實作範例（main.jsx）
    
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
// 依照你的部署環境選擇：
import { HashRouter } from "react-router-dom"; 
// import { BrowserRouter } from "react-router-dom"; 
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  // 這裡包覆最外層，整個 App 啟用路由功能
  <HashRouter>
    <App />
  </HashRouter>
);
```

### 三、JSX 基礎路由結構

- 這是最直觀的寫法，在 `App.jsx` 定義路徑與元件的對應關係。

#### 1. 核心機制

- **`<Routes>`**：就像 Switch 語句，它會負責找出**最匹配**網址的那個 Route。
- **Path `*`** ：捕捉所有「未定義」的路徑，用來做 404 頁面。

#### 2. 實作範例（App.jsx）
    
```jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TrailList from "./pages/TrailList";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* 1. 首頁: path="/" */}
        <Route path="/" element={<Home />} />
        
        {/* 2. 一般頁面 */}
        <Route path="/trails" element={<TrailList />} />
        
        {/* 3. Wildcard (萬用字元): 處理 404 頁面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
```

### 四、巢狀路由與 Outlet (Nested Routes)

- 這是解決 **「共用版型 (Shared Layout)」** 的核心技術。

#### 1. 圖解：想像一個「相框」

- **Parent (Layout)** 是相框的外殼 (Navbar + Footer)。
- **Outlet** 是相框中間的玻璃區域。
- **Child 是照片。切換網址時，我們只換照片，不換相框**。

#### 2. 實作範例

- **Step 1: 定義巢狀結構 (App.jsx)**
    
  ```jsx
  <Routes>
    {/* 父層：Layout */}
    <Route path="/" element={<Layout />}>
      
      {/* 子層：這些會塞進 Layout 的 Outlet 裡 */}
      <Route index element={<Home />} /> {/* index 代表預設顯示 */}
      <Route path="trails" element={<Trails />} />
      <Route path="profile" element={<Profile />} />
      
    </Route>
  </Routes>
  ```
    
- **Step 2: 父層挖洞 (Layout.jsx)**
    
  ```jsx
  import { Outlet } from "react-router-dom";
  import { useState } from "react";
  
  function Layout() {
    // 假設這是從 API 拿到的使用者資料
    const [user, setUser] = useState([]);
  
    return (
      <div className="layout">
        <nav>Sidebar / Header</nav>
        
        <main>
          {/* 1. Outlet 是子頁面的顯示位置 */}
          {/* 2. context 是傳遞給子頁面的資料通道 (傳遞資料) */}
          <Outlet context={user} />
        </main>
        
        <footer>Footer</footer>
      </div>
    );
  }
  ```
    
- **Step 3: 子層接收資料 (Trails.jsx)**
    
  ```jsx
  //取出從父層中Outlet 透過 context 的資料
  import { useOutletContext } from "react-router-dom";
  
  function Trails() {
    // 透過 hook 直接拿到父層傳下來的資料
    const user = useOutletContext();
    
    return <h1>歡迎回來，{user}</h1>;
  }
  ```

### 五、動態路由 (Dynamic Routes & useParams)

#### 1. 使用情境

- 當頁面結構相同，但資料內容根據 ID 不同時。例如步道詳情頁。

#### 2. 運作機制

- **`:trailId`**：這是一個變數佔位符。
- 網址 `/trails/101`  →  `trailId` 變成 `"101"`。 
  
  :::note
  - **注意：** 要記得取出來的資料是字串，如果需要數字需要加上 `parseInt`。
  :::

#### 3. 實作範例

- **路由定義**
    
  ```jsx
  <Route path="/trails/:trailId" element={<TrailDetail />} />
  ```
    
- **組件讀取**
    
  ```jsx
  // useParams：抓取網址（URL）上的動態參數
  import { useParams } from "react-router-dom";
  
  function TrailDetail() {
    // 這裡的變數名稱必須跟 Route 定義的一模一樣
    const { trailId } = useParams();
    
    // 拿到 ID 後，通常會在這裡打 API
    // useEffect(() => { fetchTrail(trailId) }, [trailId])
  
    return <h1>正在瀏覽步道 ID: {trailId}</h1>;
  }
  ```

### 六、導覽系統 (Link, NavLink & useNavigate)

- 在 React Router 中，我們**絕對不使用** HTML 原生的 `<a href="...">` 標籤，因為它會導致瀏覽器向伺服器重新請求頁面（畫面會閃爍、狀態會重置）。我們改用以下三種方式：

#### 1. 基礎連結 (`Link`) - 最常用的跳轉

- 這是 React Router 最基本的組件，用來取代 `<a>` 標籤。
- **功能**：改變網址，切換組件，但**不重新整理頁面**。
- **使用情境**：任何普通的連結，例如「閱讀更多」、「回到首頁」、卡片點擊。
    
  ```jsx
  import { Link } from "react-router-dom";
  
  function HomePage() {
    return (
      <div>
        <h1>歡迎來到步道系統</h1>
        {/* 錯誤寫法: 會導致頁面刷新 (Full Page Reload) */}
        <a href="/trails">看步道列表 (Bad)</a>
  
        <br />
  
        {/* 正確寫法: SPA 內部切換，無刷新 */}
        <Link to="/trails">看步道列表 (Good)</Link>
      </div>
    );
  }
  ```

#### 2. 導覽列 (`NavLink`) - 自動高亮狀態

- 這是 `Link` 的**增強版**。它會**隨時檢查「我指向的路徑」是否等於「瀏覽器目前的網址」**。
- **功能**：如果網址匹配，它會自動收到 `isActive = true` 的狀態。
- **使用情境**：**導覽列 (Navbar)**、側邊欄 (Sidebar)、分頁籤 (Tabs)。讓使用者知道「我現在在哪一頁」。
    
  ```jsx
  import { NavLink } from "react-router-dom";
  
  function Navbar() {
    return (
      <nav>
        <NavLink 
          to="/trails" 
          // className 屬性接收一個函式
          // 參數包含 isActive (布林值)
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
          
          // style 屬性也可以接收函式
          style={({ isActive }) => ({ 
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "red" : "black"
          })}
        >
          步道列表
        </NavLink>
      </nav>
    );
  }
  ```

#### 3. 程式化導覽 (`useNavigate`) - 邏輯跳轉

- 前面兩個都是要使用者「點擊」才會跳轉。但有時候我們需要在**程式碼執行完畢後**自動跳轉。
- **功能**：透過 JavaScript 函式控制路由。
- **使用情境**：**登入成功後**自動跳轉、**表單送出後**跳轉、**計時結束後**跳轉、**回上一頁**按鈕。
    
  ```jsx
  import { useNavigate } from "react-router-dom";
  
  function LoginPage() {
    // 1. 取得 navigate 函式
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      // ... (假設這裡執行了 API 登入請求) ...
      
      // 2. 登入成功，跳轉到首頁 (或是 dashboard)
      navigate("/dashboard");
      
      // 進階: 如果不希望使用者按「上一頁」回到登入頁，可加上 replace: true
      // navigate("/dashboard", { replace: true });
    };
    
    const handleBack = () => {
      // 3. 數字 -1 代表回上一頁 (相當於瀏覽器的 Back 按鈕)
      navigate(-1); 
    };
  
    return (
      <div>
        <button onClick={handleLogin}>登入</button>
        <button onClick={handleBack}>回上一頁</button>
      </div>
    );
  }
  ```

#### 4. 比較表格
    
| **組件 / Hook** | **用途** | **是否會刷新頁面** | **適合情境** |
| --- | --- | --- | --- |
| **`<a href>`** | 傳統連結 | **會** | **連去外部網站** (如 Google, Facebook) |
| **`<Link>`** | SPA 連結 | 不會  | 網站內部的一般連結 (閱讀更多、Logo) |
| **`<NavLink>`** | 狀態連結 | 不會  | **選單、導覽列** (需要顯示紅字/底線時) |
| **`useNavigate`** | 程式跳轉 | 不會 | **函數內部** (登入後、表單送出後) |

### 七、網址參數搜尋 (Search Params + Axios + useEffect)

#### 1. 核心邏輯流

- **Input 輸入** → 更新 **網址** (**`setSearchParams`**)。
- **網址改變** → 觸發 **`useEffect`**。
- **`useEffect`** → 呼叫 **API** (`axios`)。
- **API 回傳** → 更新 **State** → 畫面重繪。

#### 2. `useSearchParams` 的用法

- `const [searchParams, setSearchParams] = useSearchParams();`  →  他是一種方法
- 取出資料： `searchParams.get("query")`
- 寫入資料： `setSearchParams({query : "animal"})`

#### 3. 完整實作
    
```jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import List from "../components/List";

export default function AlbumSearch() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const accessId = process.env.REACT_APP_UNSPLASH_ACCESS;
  const api = "https://api.unsplash.com/search/photos";
  
  useEffect(() => {
    if (search !== "") {
      (async () => {
        const response = await axios.get(
          `${api}?client_id=${accessId}&query=${search}`
        );
        const result = response.data.results;
        console.log(result);
        setList(result);
      })();
    }
  }, [accessId, search]);

  // useEffect(() => {
  //   console.log(searchParams.get("query"));
  // }, []);

  useEffect(() => {
    setSearch(searchParams.get("query")); //取出網址的值
  }, [searchParams]);
  
  return (
    <>
      <p>這是搜尋頁面 {search}</p>
      <input
        type="text"
        className="form-control mb-3"
        defaultValue={search}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            // setSearch(e.target.value);
            setSearchParams({ query: e.target.value });
          }
        }}
      />
      <List list={list} />
    </>
  );
}
```

### 八、現代架構：物件式路由 (Plain Object Router)

- 這是 React Router v6.4+ 推薦的架構。雖然功能跟 JSX 一樣，但它將「路由設定」與「UI」完全分離，讓 `App.jsx` 回歸單純的版型角色。

#### 1. 架構轉變

- **舊 (JSX)**：`App.jsx` 管理 `<Routes>`。
- **新 (Object)**：`router.js` 管理路由，`App.jsx` 只是最外層的 Layout。
    
![物件式路由架構](/img/react06-1.png)
    
#### 2. 實作範例

- **Step 1: `App.jsx` (變身為 Layout)**
  
  它不再包含 `<Routes>`，只負責挖洞 (`Outlet`)。
    
  ```jsx
  // App.jsx
  import { Outlet } from "react-router-dom";
  import Navbar from "./components/Navbar";
  import Footer from "./components/Footer";
  
  function App() {
    return (
      <div className="app">
        <Navbar /> {/* 全站共用 */}
        
        {/* 這裡是重點：子頁面會渲染在這個洞裡 */}
        <Outlet /> 
        
        <Footer /> {/* 全站共用 */}
      </div>
    );
  }
  export default App;
  ```
    
- **Step 2: `router.js` (路由指揮官)**
  
  這裡引入 `App` 並把它設為根路徑 (`/`) 的 Element。
    
  ```jsx
  // router.js
  import { createHashRouter } from "react-router-dom";
  import App from "./App"; // 引入 Layout
  import Home from "./pages/Home";
  import TrailSearchPage from "./pages/TrailSearchPage";
  import TrailDetail from "./pages/TrailDetail";
  
  const router = createHashRouter([
    {
      path: "/",
      element: <App />, // 設定 App 為最外層容器
      children: [
        {
          index: true, // 當網址是 / 時
          element: <Home />,
        },
        {
          path: "search", // 當網址是 /search 時
          element: <TrailSearchPage />,
        },
        {
          path: "trails/:trailId", // 當網址是 /trails/123 時
          element: <TrailDetail />,
        }
      ]
    },
    {
      path: "*",
      element: <div>404 Not Found</div>
    }
  ]);
  
  export default router;
  ```
    
- **Step 3: `main.jsx` (入口)**
    
  ```jsx
  // main.jsx
  import React from "react";
  import ReactDOM from "react-dom/client";
  import { RouterProvider } from "react-router-dom";
  import router from "./router"; // 引入設定檔
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    // 注入路由設定
    <RouterProvider router={router} />
  );
  ```

  ### 九、進階應用：前台／後台雙 Layout
 
  #### 1. 情境與正確做法
 
  - **情境：** 專案通常會同時有「前台」（一般使用者逛的頁面，例如首頁、步道列表）跟「後台」（管理者用的頁面，例如步道管理、會員管理）。這兩塊的導覽列、版面配置、甚至驗證邏輯通常完全不同。
  - **常見的錯誤做法：** 全部頁面共用同一個 `App.jsx` Layout，再用 `if (location.pathname.startsWith('/admin'))` 這種判斷式去切換要顯示哪個導覽列，條件會越疊越多。
  - **正確做法：** React Router 官方把「本身沒有實際內容、只負責提供共用外觀的父層路由」稱為 **Layout Route**（對應地，「沒有 path、直接繼承父層網址」的子路由叫 **Index Route**）。前台跟後台各自建立一個 Layout Route，底下再掛各自的 `children`，這跟前面「相框」的巢狀路由概念完全一樣，只是套用在整個網站的最外層，前台跟後台**分屬兩個不同的相框**，彼此不共用。

  #### 2. Step 1：建立兩個 Layout 元件（各自的 Outlet 母版）
 
  - `layouts/FrontLayout.jsx`（前台外觀）：
    ```jsx
    import { Outlet, Link } from "react-router-dom";
  
    function FrontLayout() {
      return (
        <div className="front-layout">
          <header className="front-header">
            <Link to="/">首頁</Link>
            <Link to="/trails">步道列表</Link>
          </header>
  
          <main>
            {/* 前台各頁面會渲染在這裡 */}
            <Outlet />
          </main>
  
          <footer>© 2026 我的步道網站</footer>
        </div>
      );
    }
  
    export default FrontLayout;
    ```
 
  - `layouts/AdminLayout.jsx`（後台外觀）：
    ```jsx
    import { Outlet, NavLink } from "react-router-dom";
  
    function AdminLayout() {
      return (
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <NavLink to="/admin/dashboard">儀表板</NavLink>
            <NavLink to="/admin/trails">步道管理</NavLink>
            <NavLink to="/admin/members">會員管理</NavLink>
          </aside>
  
          <main className="admin-content">
            {/* 後台各頁面會渲染在這裡 */}
            <Outlet />
          </main>
        </div>
      );
    }
  
    export default AdminLayout;
    ```
 
  #### 3. Step 2：`router.js` 把兩個 Layout 各自掛成最上層
 
  ```jsx
  // router.js
  import { createHashRouter, Navigate } from "react-router-dom";
  import FrontLayout from "./layouts/FrontLayout";
  import AdminLayout from "./layouts/AdminLayout";
  import Home from "./pages/Home";
  import TrailList from "./pages/TrailList";
  import Dashboard from "./pages/admin/Dashboard";
  import AdminTrails from "./pages/admin/AdminTrails";
  import AdminMembers from "./pages/admin/AdminMembers";
  import NotFound from "./pages/NotFound";
 
  const router = createHashRouter([
    {
      path: "/",
      element: <FrontLayout />, // 前台外觀
      children: [
        { index: true, element: <Home /> },
        { path: "trails", element: <TrailList /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />, // 後台外觀
      children: [
        // 進 /admin 自動導向 /admin/dashboard
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "trails", element: <AdminTrails /> },
        { path: "members", element: <AdminMembers /> },
      ],
    },
    {
      // 404 一定要放最後
      path: "*",
      element: <NotFound />,
    },
  ]);
 
  export default router;
  ```
 
  :::note
  - **跟前台／後台的 Vue Router 版本對照：** 概念完全一樣（父層路由對應一個 Layout 元件，底下掛 `children`），差別只在 React Router 用 `<Outlet />` 取代 Vue 的 `<RouterView />`。
  :::
  #### 4. Step 3：後台加上登入驗證
 
  - React Router **沒有**像 Vue Router 那樣的全域 `beforeEach` 守衛，官方建議的作法是：寫一個「本身不畫任何畫面、只負責判斷通不通過」的元件，通過就渲染 `<Outlet />` 放行，不通過就用 `<Navigate>` 導去登入頁——這其實也是一種 Layout Route，只是它的「外觀」是空的。
  - `components/RequireAuth.jsx`：

    ```jsx
    import { Navigate, Outlet, useLocation } from "react-router-dom";
  
    function RequireAuth() {
      const location = useLocation();
      const token = localStorage.getItem("token");
  
      if (!token) {
        // 沒登入：導去登入頁，並用 state 記住原本要去哪，登入後可以導回來
        return <Navigate to="/admin/login" replace state={{ from: location }} />;
      }
  
      // 有登入：放行，渲染底下實際掛的子路由
      return <Outlet />;
    }
  
    export default RequireAuth;
    ```
 
  - 把它疊在 `AdminLayout` 外面（Layout Route 可以像這樣一層包一層）：
    ```jsx
    // router.js（節錄）
    {
      path: "/admin",
      element: <RequireAuth />, // 第一層：先檢查有沒有登入
      children: [
        {
          element: <AdminLayout />, // 第二層：通過驗證才會渲染後台外觀
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "trails", element: <AdminTrails /> },
            { path: "members", element: <AdminMembers /> },
          ],
        },
        // /admin/login 放在 RequireAuth 檢查之外，否則使用者連登入頁都進不去
        { path: "login", element: <AdminLogin /> },
      ],
    }
    ```
 
    :::warning
    - 在這個寫法中，`/admin/login` 雖然被放在 `/admin` 的 `children` 裡，但實際上它不應該被 `RequireAuth` 擋住。
    - 常見做法有兩種：
      1. 在 `RequireAuth` 裡另外判斷目前路徑是否為登入頁，若是 `/admin/login` 就直接放行。
      2. 將登入頁移到 `/admin` 父層之外，例如改成 `/admin-login`。

    這裡把登入頁放在 `children` 中，主要是為了示範 Layout Route 可以多層嵌套。實務開發時，還是要依照專案需求調整路由結構，避免使用者在未登入狀態下被重複導向，造成無窮迴圈。
    :::

    :::note
      - 登入成功後，也可以導回使用者原本想進入的頁面。
      - 做法是在 `AdminLogin.jsx` 中使用 `useLocation()` 讀取 `RequireAuth` 傳進來的 `state.from`，登入成功後再執行：
        ```jsx
        navigate(from?.pathname || '/admin/dashboard', { replace: true })
        ```
      - 這樣如果使用者原本是想進入後台某個頁面，登入後就會回到原本的目標頁面；如果沒有來源頁面，則預設導向 `/admin/dashboard`。
    :::
  

  ### 十、參考資源
 
  - [React Router 官方文件](https://reactrouter.com/)
  - [React Router — Main Concepts（Index Route／Layout Route 官方定義）](https://reactrouter.com/6.30.3/start/concepts)
  - [React Router — Routing（物件式路由、layout 函式）](https://reactrouter.com/start/framework/routing)