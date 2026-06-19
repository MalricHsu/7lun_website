---
slug: yestep-project
title: YeStep 每一步，找回生活的呼吸
authors: [7lun]
tags: [project, react]
date: 2026-05-23
---

### 前言

一個以「把 Yes 變成 Step」為核心精神的整合性步道檢索平台，將分散的步道資訊收斂到單一介面，讓使用者依地區、難度、行走時間與景觀類型快速篩選，把「想出去走走」的念頭，轉化為實際可行的行程規劃。

- **Live Demo**：[**YeStep**](https://yestep.onrender.com/)
- **GitHub**：[**GitHub Repo**](https://github.com/MalricHsu/yestep)
- **使用技術**：Vite / React / React Router / Redux Toolkit / Bootstrap 5 / Sass / Axios / JSON Server / JavaScript / Swiper / Lottie / Chart.js / Git / GitHub
- **團隊角色**：組長 / 前端開發(React) / API 模擬與部署(JSON Server)
- **專案管理**：Notion / GitHub / Discord
- **專案時程**：2025.10.15 ~ 2026.02.28
- **網站部署**：OnRender

{/* truncate */}

### 一、 主題發想

組隊初期討論主題時，組員中有一位是親子家庭使用者，分享她在尋找適合帶孩子走的步道時，常面臨資訊分散的問題：步道資料散落在政府網站、登山部落格與社群論壇之間，難以一次比較難度、路程與適合對象。我們以此為起點延伸思考目標客群，發現這個痛點不只存在於親子家庭——對忙碌的上班族、尋求身心療癒的使用者而言，「想走出去」與「實際成行」之間，往往卡在資訊整合度不足這道門檻。

YeStep 因此定位為一個整合性步道檢索平台，將分散的資訊收斂到單一介面，讓使用者依地區、難度、行走時間與景觀類型快速篩選，把「想出去走走」的念頭，轉化為實際可行的行程規劃。

### 二、 專案協作方式

整個專案歷時約 5 個月，採每週一次 75~90 分鐘的固定會議追蹤進度，並使用 Notion 管理專案進度與文件，透過 Git / GitHub 進行版本控制與協作開發。

### 三、 使用者故事

延續上個專案驗證有效的 MVP 思維，我們在開發前先盤點所有頁面，把「首頁、檢索頁、檢索詳細頁、主題活動頁」設定為核心必做項目，會員中心則列為選做。考量到上個專案最終成果偏向靜態切版展示，這次我們設定的核心目標是「讓網站真的動起來」——不只要切版完成，還要串接 API、有實際的篩選、搜尋與跳轉邏輯。會員中心在團隊餘力下也順利完成。

在功能權限上，我們依使用者狀態設計兩個層級：一般使用者可瀏覽所有步道資訊、使用篩選與搜尋，會員則額外擁有收藏步道、修改個人資料等功能。考量到「想收藏才願意註冊」是更自然的轉換動機，我們設計了一條漸進式的引導流程，未登入使用者點擊收藏時，會先彈出提示導向登入頁。若還沒有帳號，再進一步引導至註冊頁。讓註冊這件事從「先註冊才能用」，變成「因為想用所以註冊」。

針對三類目標使用者：忙碌上班族、親子家庭、尋求療癒的人。檢索頁採取多維度篩選設計，包含地區、難度、行走時間與景觀類型。不同族群可以用不同組合，找到真正適合自己的路線。

### 四、 網站地圖與 Wireframe

網站地圖、流程圖與 Wireframe 由團隊在 Miro 上共同繪製。過程中由組內具 UI/UX 經驗的組員協助，把跨頁會重複使用的元件（如卡片）統一定義出來，讓後續切版時大家有共同的設計依據，也減少重工的成本。

- 🔗 [Miro Wireframe](https://miro.com/app/board/uXjVJqXihk4=/?share_link_id=113737613315)

<div align="center">
  <small style={{ color: '#888' }}><i> YeStep網站地圖</i></small>
</div>

![網站地圖](/img/yestep網站地圖.png)

<div align="center">
  <small style={{ color: '#888' }}><i> YeStep檢索詳細頁流程圖</i></small>
</div>

![檢索詳細頁流程圖](/img/yestep詳細流程圖.png)

<div align="center">
  <small style={{ color: '#888' }}><i> 檢索詳細 Wireframe 線框圖</i></small>
</div>

![檢索詳細頁 Wireframe](/img/yestep詳細頁線稿圖.png)

設計過程中最有印象的取捨，是首頁主視覺 Banner 的呈現方式。最後決定做成「影片」與「步道圖片輪播(Swiper)」之間的切換式設計，讓使用者可以依當下的瀏覽心情，選擇喜歡的方式探索網站。

### 五、 UI 設計稿

線稿完成後，團隊將整體想法與品牌方向整理出來，邀請專業 UI/UX 設計師協作，在 Figma 上產出完整的視覺設計稿，包含色票、字體規範、元件樣式與各頁面的高保真畫面。設計師加入後，介面從「能用」進階到「符合品牌氛圍」，也讓後續切版有了清楚一致的依據。

### 六、 專案架構

```text
yestep/
├── public/                  # 靜態資源
│   └── logo.png
├── src/
│   ├── assets/
│   │   ├── images/          # 圖片資源（依頁面分類）
│   │   ├── scss/            # 樣式檔案
│   │   │   ├── _variables.scss
│   │   │   ├── _variables-dark.scss
│   │   │   ├── base/        # 基礎樣式
│   │   │   ├── components/  # 元件樣式
│   │   │   ├── layout/      # 佈局樣式
│   │   │   ├── page/        # 頁面樣式
│   │   │   ├── util/        # 工具樣式
│   │   │   └── all.scss     # 樣式進入點
│   │   └── videos/          # 影片資源
│   ├── components/          # 共用元件（24 個）
│   │   ├── Nav.jsx          # 導覽列
│   │   ├── Footer.jsx       # 頁尾
│   │   ├── HeroSwiper.jsx   # Hero 輪播
│   │   ├── PopularTrails.jsx # 熱門步道
│   │   ├── SearchBar.jsx    # 搜尋列
│   │   ├── TrailCard.jsx    # 步道卡片
│   │   └── ...
│   ├── data/                # 靜態資料
│   ├── pages/               # 頁面元件
│   │   ├── Home.jsx         # 首頁
│   │   ├── TrailSearchPage.jsx # 步道搜尋
│   │   ├── TrailDetail.jsx  # 步道詳情
│   │   ├── TrailTag.jsx     # 步道分類
│   │   ├── Theme.jsx        # 主題活動
│   │   ├── Member.jsx       # 會員中心
│   │   ├── Login.jsx        # 登入
│   │   ├── Register.jsx     # 註冊
│   │   ├── ProtectedRoute.jsx # 路由守衛
│   │   └── NotFound404.jsx  # 404 頁面
│   ├── server/              # API 設定
│   │   └── api.js
│   ├── slices/              # Redux Slices
│   │   ├── authSlice.js     # 認證狀態
│   │   └── infoSlice.js     # 資訊狀態
│   ├── utils/               # 工具函式
│   │   ├── error.js         # 錯誤處理
│   │   └── formatNumber.js  # 數字格式化
│   ├── App.jsx              # 根元件
│   ├── main.jsx             # 應用進入點
│   ├── router.jsx           # 路由設定
│   └── store.js             # Redux Store
├── db.json                  # JSON Server 資料庫
├── server.cjs               # API 伺服器設定
├── index.html               # HTML 進入點
├── vite.config.js           # Vite 設定
├── package.json
└── .env                     # 環境變數
```

### 七、 個人負責開發項目

#### 1. 路由系統

使用 React Router 在 `router.jsx` 中集中管理所有路由配置，並依照頁面是否需要登入權限進行分層。

**ProtectedRoute — 路由守衛**

路由守衛這個概念課程中有帶，但當時還不太熟悉實際的應用情境，因此我主動詢問 AI、釐清它的運作原理後再實作出來。

具體做法是建立一個 `ProtectedRoute` 包裝元件：在元件內讀取 Redux 的登入狀態，未登入就用 `<Navigate>` 自動導向登入頁，登入後才渲染原本的子元件。

```jsx
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
```

在 router 設定中只需要把需要保護的頁面用 `<ProtectedRoute>` 包起來，就能達到統一的權限控管，不需要在每個頁面內各自寫驗證邏輯。

#### 2. 假資料 API 建置與部署

考量到課程主軸是前端、團隊裡也沒有後端組員，為了讓專案能真正串接 API 而不是寫死資料，我主動承擔了模擬後端的建置與部署工作。

**假資料來源與整理**

組員從政府 Open Data 平台找到合適的步道 API，我們以此為基礎做資料轉換，保留需要的欄位、移除不必要的內容，並依照前端使用情境補上自訂的 key value（例如收藏狀態、自訂標籤等）。

**Node.js 伺服器建置**

- 使用 `json-server` 作為資料庫與伺服器核心。
- 使用 `json-server-auth` 作為權限驗證中間件，讓 API 支援 `POST /register`、`POST /login` 並自動生成 JWT token。
- 設計自訂的 middleware 解決 CORS 跨網域存取問題，並將 API 伺服器部署到 Render 平台上。

#### 3. 狀態管理與全域訊息系統

**authSlice — 會員登入狀態管理**

使用 Redux Toolkit 的 `authSlice` 統一管理會員狀態。串接登入 API 成功後，將伺服器回傳的 `accessToken` 與 `user` 資料透過 `dispatch` 更新至全域 State，並同時將 Token 存入 Cookie 中（7 天效期），讓使用者在關閉瀏覽器後重開，仍能保持登入狀態。

**infoSlice + Toast 元件 — 全域訊息系統**

設計一套全域 Toast 通知機制，讓任何元件都可以透過 `dispatch(createMessage({ text, type }))` 觸發畫面右上角的提示訊息。訊息類型分為「成功」與「錯誤」兩種，分別對應收藏成功、API 連線失敗等情境。

這套架構讓「狀態變化 → 視覺呈現」完全解耦，後續任何新功能需要彈出提示時，只要一行 `dispatch` 就能完成。

#### 4. 專案基礎建置與全域樣式

延續上個專案使用 Bootstrap 5 + Sass 的經驗，這次依照設計師提供的 Figma 設計稿，將整套設計系統落地為 SCSS 變數，建立全網站共用的設計依據。主要包含：

- **色票系統**：依設計稿規範定義品牌主色與中性色階變數。
- **字級系統**：自訂排版 class，統一全網站的文字層級與字重。
- **元件樣式**：自訂圓角、間距與按鈕樣式，搭配 Bootstrap 既有 utility class 使用。

#### 5. 頁面切版與功能

**5-1. 登入 / 註冊頁**

完整實作登入與註冊流程，搭配 `react-hook-form` 處理表單驗證。

**登入流程**：

1. 透過 `js-cookie` 將 token 存入 Cookie（7 天效期）
2. `dispatch` 至 Redux 更新登入狀態
3. 透過 `infoSlice` 顯示「歡迎回來，OOO」的成功訊息
4. 透過 `location.state` 記住登入前的來源頁面，讓使用者登入後自動回到原本想去的位置
5. 錯誤訊息依錯誤類型分類顯示（如帳號密碼錯誤 vs 伺服器連線失敗）

**5-2. 步道檢索詳細頁 (TrailDetail)**

詳細頁是整個專案中功能最密集的頁面，整合了 API 串接、收藏狀態管理、相關推薦、動態跳轉與 RWD 等多個面向。

**1. 資料載入策略：Promise.all 並行請求**

詳細頁進入時需要載入三筆資料：當前步道的詳細資訊、同系統的相關推薦、其他系統的相關推薦。改用 `Promise.all` 讓三支 API 同時發出請求，總等待時間以最慢的一支為準，能顯著縮短頁面首屏載入時間。

```javascript
const [detailRes, centralRes, allRes] = await Promise.all([
  TrailsApi.get(`/trails/${id}`),
  TrailsApi.get("/trails?trail_system_like=中央山脈"),
  TrailsApi.get("/trails"),
]);
```

**2. 相關推薦：分類隨機抽取**

推薦邏輯設計成兩種類型分開呈現：

- **中央山脈脊梁國家步道系統**：與當前步道屬於同一山脈系統，提供「延伸體驗」。
- **其他步道系統**：跳脫當前山脈系統，提供「探索選項」。

兩類資料各自從 API 結果中隨機抽取 3 筆，避免每次進詳細頁都看到一模一樣的推薦。

```javascript
const getRandomTrails = (arr, count = 3) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
```

**3. 收藏功能與狀態管理**

收藏按鈕點擊後，依據使用者的「狀態」與「按鈕狀態」進行不同的流程處理：

1. **未登入**：彈出 Toast 訊息提醒「請先登入才能收藏」，並延遲 1.5 秒自動跳轉至登入頁。
2. **已登入，未收藏**：向伺服器發送 `POST` 請求，成功後更新收藏狀態，並彈出「收藏成功」Toast。
3. **已登入，已收藏**：向伺服器發送 `DELETE` 請求，成功後解除收藏狀態，並彈出「已取消收藏」Toast。

**4. Tag 標籤連動跳轉**

步道詳細頁中包含多個分類 Tag。使用者點擊任一 Tag 時，會透過 React Router 帶著查詢參數跳轉到標籤頁，自動檢索並列出所有包含該標籤的步道。

**5-3. 步道標籤頁 (TrailTag)**

專門處理從詳細頁點擊 Tag 跳轉過來的檢索結果。

使用 `useSearchParams` 監聯網址上的 `trail_tags` 參數，當參數改變時觸發 `useEffect` 重新向 API 發送請求。

開發時遇到一個有趣的技術問題：`trail_tags` 欄位在 JSON 檔案中是陣列格式，而 `json-server` 的預設 query 語法無法正確比對。最終使用 `_like` 模糊查詢解決：

```javascript
if (searchParams.get("trail_tags")) {
  const tagValue = searchParams.get("trail_tags");
  queryName = `trail_tags_like=${tagValue}`;
} else {
  queryName = searchParams.toString();
}
```

**5-4. 404 頁面**

當使用者輸入不存在的路由時，會導向設計友好的 404 頁面，搭配 Lottie 動畫，提供回到首頁的引導按鈕。

### 八、 專案心得與挑戰

#### 1. 組長角色的延續與深化

這是我第二次擔任組長，延續上個專案驗證有效的 MVP 思維：先聚焦核心功能、確保準時上線，再評估加值功能。最終不只完成核心頁面，連原本列為選做的會員中心也順利上線。

這次團隊狀態比第一次複雜：原本一位組員因孩子受傷退出開發，另一位找到切版工作後時間變少，同時新加入一位有 UI/UX 經驗的前端。我在分工時讓對 React 還不熟悉的組員專注於切版任務，框架相關的問題則透過 AI 協作來補足。

到了專案中後期，我會主動 review 組員的 code，確認狀態管理的串接邏輯一致，也順手把部分重複的程式碼重構成可重用的元件。這個過程讓我從「只負責自己的頁面」變成「對整個專案結構有掌握度」，是這次組長角色最大的進化。

> **領導不是把所有事情扛起來，而是讓每個人都能在自己擅長的位置發揮。**

#### 2. AI 協作的個人方法論

這次專案大量使用 AI 輔助開發，是我們能在 1~1.5 個月內完成的關鍵之一。我自己的習慣是先想好需求、再跟 AI 討論該用什麼語法或寫法比較合適，最後自己寫過一遍。

例如收藏功能的多狀態流程設計，我先把使用者狀態與對應行為釐清，再跟 AI 討論技術實作。又例如 ProtectedRoute 與 `location.state` 記住來源頁面，都是在我設定好需求後，請 AI 補上我還不熟悉的實作細節。

> **AI 給的是技術選項，但設計什麼樣的流程、解決什麼樣的問題，還是必須來自開發者自己的思考。**

#### 3. 跨領域探索：意外點燃對後端的興趣

這個專案最意料之外的收穫，是因為要建置假資料 API 而踏進了後端的領域。實作過程中為了搭配登入驗證、處理部署環境的差異、理解 middleware 順序，逐漸接觸到 Node.js 的基礎知識。這段跨領域的探索結束後，我發現自己對後端的興趣比想像中強，因此後續報名了 Node.js 的課程。

#### 4. 技術挑戰回顧

- **Promise.all 並行請求**：原本三支 API 串行打的版本載入速度偏慢，改用 Promise.all 同時發出後首屏時間縮短不少。
- **收藏功能的狀態流程設計**：在一個按鈕裡處理未登入 / 未收藏 / 已收藏三種狀態，是最複雜的互動設計。先把流程畫出來再寫程式，比直接動手寫快很多。
- **JSON Server 陣列欄位查詢的小坑**：標籤頁的 `trail_tags` 欄位是陣列，一般 query 抓不到資料，最終找到 `_like` 模糊查詢的解法。

> **寫 code 之前先把邏輯想清楚，可以省下很多 debug 時間。**

#### 5. 專題發表簡報

- 🔗 [20260301 專題發表簡報](https://canva.link/047sh39ujhqcjlf)
