---
title: React｜React 介紹
sidebar_position: 1
tags: [React]
date: 2025-12-01
---

### 一、React 是什麼？

- React 是一個 **UI 函式庫（Library）**，專注在「畫面」這一層，不像完整框架那樣內建路由、狀態管理等功能，這些都要另外搭配套件。但業界習慣上還是把它跟其他前端框架並列稱呼。
  - 由 Meta（Facebook）開發與維護
  - 核心理念：`UI = f(state)`，畫面是「狀態」的函式，狀態變了，畫面就重新計算
  - 函式庫（Library）vs 框架（Framework）的差別：框架通常會幫你規定好整套架構（路由怎麼寫、狀態怎麼管理），函式庫則只負責一件事，其他自己選擇搭配，這也是 React 生態系套件選擇特別多的原因。

### 二、透過 CDN 把 React 匯入 HTML

- 實際開發 React 專案通常會用 Vite 之類的建構工具，但如果只是想快速試玩、或在一個單純的 `.html` 檔案裡體驗 React，可以直接用 `<script>` 標籤匯入 CDN，不需要 `npm install`、不需要建構流程。

#### 1. 需要匯入哪些東西

- 用 CDN 跑 React，最少需要三個 `<script>`：

  ```html
  <!DOCTYPE html>
  <html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>React CDN Demo</title>
  </head>
  <body>

    <div id="root"></div>

    <!-- 1. React 核心：提供 createElement、useState 這些 API -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>

    <!-- 2. ReactDOM：負責把 React 元件渲染到真實 DOM -->
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- 3. Babel Standalone：讓瀏覽器能即時編譯 JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <script type="text/babel">
      function App() {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <p>你按了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
          </div>
        );
      }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    </script>

  </body>
  </html>
  ```

#### 2. 三個 script 各自在做什麼

<table width="100%">
  <thead>
    <tr>
      <th width="30%">Script</th>
      <th width="70%">作用</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>react.development.js</code></td>
      <td>React 核心套件，提供 <code>React.useState</code>、<code>React.createElement</code> 等 API，但不負責把畫面畫到瀏覽器上</td>
    </tr>
    <tr>
      <td><code>react-dom.development.js</code></td>
      <td>專門處理「畫到瀏覽器」這件事，提供 <code>ReactDOM.createRoot()</code>、<code>.render()</code></td>
    </tr>
    <tr>
      <td><code>@babel/standalone</code></td>
      <td>瀏覽器原生看不懂 JSX，這個套件會在執行期把 <code>&lt;script type="text/babel"&gt;</code> 裡的 JSX 即時編譯成瀏覽器看得懂的 <code>React.createElement()</code> 呼叫</td>
    </tr>
  </tbody>
</table>

:::note

**為什麼 React 跟 ReactDOM 要分開兩個套件？**
因為 React 本身只負責「描述畫面長怎樣」這個邏輯層，跟「畫到哪裡」是分開的——除了瀏覽器，React 也能透過 react-native 畫到手機 App，所以核心邏輯（React）跟渲染目標（ReactDOM / React Native）被拆成不同套件。

:::

#### 3. 幾個要注意的細節

- **`<script>` 順序很重要**：React、ReactDOM 要先載入，Babel 也要在使用 JSX 的那段 `<script>` 之前載入，否則會出現 `React is not defined` 之類的錯誤。
- **`type="text/babel"`**：只要是寫了 JSX 的 `<script>` 標籤，type 一定要設成 `text/babel`，不然瀏覽器會直接用一般 JS 解析，遇到 `<div>` 這種語法會直接報錯。
- **效能警告**：用 Babel Standalone 是在「瀏覽器執行當下」即時編譯 JSX，速度比建構工具（Vite）慢很多，console 也會印出警告，只適合學習/Demo，正式專案不要這樣做。
- **development 版 vs production 版**：`react.development.js` 檔名有 development，正式環境應該換成 `react.production.min.js`，development 版會多很多錯誤檢查、警告訊息，檔案也比較大。
- **CDN 來源**：除了 unpkg.com，也常看到用 cdn.jsdelivr.net，效果一樣，差別只在 CDN 服務商不同。

#### 4. 跟正式專案（Vite）的差異

<table width="100%">
  <thead>
    <tr>
      <th></th>
      <th>CDN 方式</th>
      <th>Vite 建構工具</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>安裝</strong></td>
      <td>不用 npm install，直接 <code>&lt;script&gt;</code></td>
      <td>需要 <code>npm create vite@latest</code></td>
    </tr>
    <tr>
      <td><strong>JSX 編譯時機</strong></td>
      <td>瀏覽器執行當下即時編譯（慢）</td>
      <td>開發時用 esbuild 預先編譯（快）</td>
    </tr>
    <tr>
      <td><strong>適合場景</strong></td>
      <td>學習、Demo、單一 HTML 試玩</td>
      <td>正式專案開發</td>
    </tr>
    <tr>
      <td><strong>模組化</strong></td>
      <td>沒有 import/export 模組系統</td>
      <td>完整 ES Module 支援</td>
    </tr>
  </tbody>
</table>

:::tip

簡單說：CDN 方式是拿來「先感受一下 React 長什麼樣子」，真正開發專案還是要用 Vite 這類建構工具。

:::

### 三、JSX：把畫面寫進 JavaScript

- React 用 JSX 來描述畫面，長得像 HTML，但其實是 JavaScript 的語法糖，編譯後會變成 `React.createElement()` 呼叫。

  ```jsx
  function Hello({ name }) {
    return <h1>Hello, {name}!</h1>;
  }
  ```

- 因為 JSX 本質上就是 JavaScript，所以條件渲染、列表渲染都直接用 JS 語法處理：

  ```jsx
  function List({ items }) {
    return (
      <ul>
        {items.map(item => <li key={item.id}>{item.text}</li>)}
      </ul>
    );
  }
  ```

:::note

**理解重點**：JSX 沒有獨立的模板語法或指令，能寫的東西就是 JS 能做的事。

:::

### 四、Component 與 Props

- 一個 Component 通常就是一個函式（Function Component），回傳 JSX。
- Props 是父層傳給子層的資料，唯讀，子層不能直接修改。

  ```jsx
  function Greeting({ name, onClose }) {
    return (
      <div>
        <p>哈囉，{name}</p>
        <button onClick={onClose}>關閉</button>
      </div>
    );
  }
  ```

### 五、State 與 Hooks

#### 1. useState：管理元件內部的資料

  ```jsx
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }
  ```

- **關鍵概念**：呼叫 `setCount` 之後，React 會讓這個 component 整個函式重新執行一次，產生新的 JSX，再跟舊的虛擬 DOM 比對差異，才更新真實畫面。也就是說，元件函式裡沒有「持續存在」的變數，每次 render 都是全新的一次呼叫。
- 這也是為什麼會有「閉包陷阱（stale closure）」這種坑——如果在非同步函式或計時器裡直接讀取 state，拿到的可能是「呼叫當下那次 render」的舊值，而不是最新值。

#### 2. useEffect：處理副作用

  ```jsx
  useEffect(() => {
    console.log('count 改變了:', count);
    return () => console.log('清除上一次的副作用');
  }, [count]); // 依賴陣列
  ```

- **依賴陣列 `[count]`**：只有 count 改變時才會重新執行。
- **空陣列 `[]`**：只在元件掛載（mount）時執行一次，常用來模擬 `componentDidMount`。
- **沒有第二個參數**：每次 render 都會執行（要小心，容易造成無限迴圈或效能問題）。
- 回傳的函式是「清除函式」，會在下一次 effect 執行前、或元件卸載（unmount）時被呼叫。

### 六、為什麼需要 Virtual DOM？

直接操作真實 DOM 很慢，因為每次改動瀏覽器都要重新計算版面、重繪畫面。React 的做法是：

1. 用一般的 JavaScript 物件（Virtual DOM）描述「畫面應該長什麼樣子」。
2. state 改變時，重新算出一份新的 Virtual DOM。
3. 拿新舊兩份 Virtual DOM 做「diff」比對差異。
4. 只把真正變動的部分一次性（batch）更新到真實 DOM。

:::info

`key` 在列表渲染中非常重要：它讓 diff 演算法知道「這個元素對應的是哪一筆資料」，避免重新排序、新增、刪除列表項目時畫面渲染錯亂或效能變差。

:::

### 七、生態系

React 本身只管畫面，其他能力要自己搭配套件：

<table width="100%">
  <thead>
    <tr>
      <th>用途</th>
      <th>常見套件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>路由</td>
      <td>React Router</td>
    </tr>
    <tr>
      <td>全域狀態管理</td>
      <td>Redux / Zustand / Jotai</td>
    </tr>
    <tr>
      <td>全端框架（SSR、檔案路由等）</td>
      <td>Next.js</td>
    </tr>
    <tr>
      <td>建構工具</td>
      <td>Vite</td>
    </tr>
  </tbody>
</table>

- **特色**是「選擇多、沒有官方標準答案」，需要依專案規模自己評估搭配。

### 八、延伸學習資源

- 官方文件：[react.dev](https://react.dev)（新版文件以 Hooks 為主，品質很高）
