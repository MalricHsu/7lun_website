---
title: React｜React Hook - useEffect
sidebar_position: 3
tags: [React, 知識點筆記]
date: 2025-12-15
slug: react/react-hook-useeffect
---

### 一、useEffect 大綱

- 把 `useEffect` 想像成一個「自動化管理員」
    - **任務 (Effect)**：你告訴管理員：「當這間房子（組件）蓋好後，幫我訂閱報紙、連上網路。」
    - **觸發條件 (Deps)**：你給管理員一個清單：「如果『住戶人數』變了，就要重新調整網路設定。」
    - **打掃 (Cleanup)**：你立下規矩：「在你做新的設定之前，或是房子要被拆除（沒人住）之前，一定要把舊的合約退掉，不然我會一直被扣款（記憶體洩漏）。」


:::note

**總結：useEffect 是用來處理「畫面畫完之後」要做的雜事，並且負責在「重做」或「離開」時把雜事清理乾淨。**

:::

### 二、useEffect 核心定義

#### 1. 什麼是 useEffect？
    - 在 React 中，元件（Component）本質上是一個**純函式（Pure Function）**，它的唯一工作就是接收資料（Props/State），然後回傳畫面（JSX）。
    - **`useEffect`** 是 React 提供的一個 Hook，用來處理那些「**不屬於單純畫面渲染**」的工作。
#### 2. 名詞解釋：
    - **Side Effect (副作用)**：
        - **定義**：指在函式執行過程中，對「函式外部」的環境造成了影響，或是與外部世界進行了互動。
        - **白話文**：除了「計算並回傳 JSX」以外的所有行為。
        - **範例**：
            - **資料獲取 (Data Fetching)**：打 API 跟後端拿資料。
            - **訂閱 (Subscription)**：建立 WebSocket 連線或 `addEventListener`。
            - **DOM 操作**：手動更改 `document.title`。
    - **Render (渲染)**：
        - **定義**：React 呼叫組件函式，計算出新的畫面結構（Virtual DOM）的過程。
        - **時機**：當 Props 或 State 改變時，React 就會重新 Render。

### 三、語法結構

#### 1. `useEffect` 接收兩個參數，每一個參數都有特定的學術定義與功能。
    
      ```jsx
      useEffect(setup, dependencies?);
      ```
- 參數一：Setup Function (執行函式 / 副作用函式)
        - **定義**：這是你寫「副作用邏輯」的地方。
        - **語法習慣**：通常使用 **匿名箭頭函式** `() => { ... }`。
        - `useEffect` 可以直接用 `async` 開頭？
            - **絕對不行**
            - React 的規定：`useEffect` 的第一個參數，只能回傳 **「一般函式 (Cleanup Function)」** 或者 **「什麼都不回傳 (undefined)」**。
            - Async 的特性：只要你在函式前面加了 `async`，這個函式執行後**一定會回傳一個 `Promise` 物件**。
            - 但是可以在useEffect的內部定義一個 async 函式，然後馬上呼叫它。
        - **執行時機**：
            - 當元件**掛載 (Mount)** 完成後。
            - 當**依賴陣列 (Dependency Array)** 內的數值改變，觸發**更新 (Update)** 後。
            - **回傳值 (Return Value)**：這個函式可以回傳另一個函式，稱為 **Cleanup Function (清除函式)**。
- 參數二：Dependency Array (依賴陣列) `[]`
        - **定義**：一個陣列，裡面放著所有「該副作用所依賴的變數」。
        - **作用**：React 會使用 **淺層比較 (Shallow Comparison)** 來檢查陣列裡的數值是否跟上一次不一樣。
            - 如果不一樣 👉 **執行** Setup Function。
            - 如果一樣 👉 **跳過**，不執行。
            - **若省略此參數**：代表「不依賴任何特定變數」，因此**每次渲染 (Render)** 都會執行（效能最差）。
#### 2. 程式結構與範例解釋：
    
      ```jsx
      useEffect(() => {
        // A. 【執行區】：畫面渲染後執行
        console.log('副作用執行');
      
        // B. 【清除區】：(可選) 組件卸載或依賴改變前執行
        return () => {
          console.log('清除副作用');
        };
      
      }, [dependencies]); // C. 【依賴陣列】：決定何時觸發
      ```
- 觸發時機 → **依賴陣列決定**
  -  空陣列 `[]` (Mount Only)
            - **時機：** 組件「出生」(Mount) 時執行 **1 次**。之後不管怎麼更新都不會跑。
            - **用途：** 初始設定、API 呼叫。
        
        ```jsx
        useEffect(() => {
          console.log('元組掛載完畢 (只出現一次)');
        }, []);
        ```
  -  有特定變數 `[count]` (On Change)
        
        - **時機：** 元件出生時執行 1 次 **+** 當 `count` 的數值改變時再執行。
        - **用途：** 監聽資料變化並做出反應 (如：搜尋、儲存)。
        
        ```jsx
        const [count, setCount] = useState(0);
        
        useEffect(() => {
          // 第一次載入會跑，之後每次 count 變了也會跑
          console.log(`Count 更新為：${count}`);
        }, [count]);
        ```
  -   **⚠️危險** 不寫陣列 (Every Render)
        
        - **時機：** **每次** 組件重新渲染 (Re-render) 都會執行。
        - **用途：** 極少使用，通常是用來 Debug 或特殊用途。容易造成效能問題。
            
            ```jsx
            useEffect(() => {
              console.log('我每次 Render 完都會出現，很煩');
            }); // <--- 注意！這裡沒有陣列
            ```
            

### 四、生命週期與觸發時機

- 透過控制依賴陣列，我們可以模擬組件的生命週期：

#### 1. Mount (掛載)

- **定義**：組件**第一次**被建立並插入 DOM 的時刻。
- **寫法**：`useEffect(..., [])` (空陣列)
- **邏輯**：空陣列永遠不會變，所以 React 只在出生時執行一次。
- **用途：API 請求、初始化設定。**

#### 2. Update (更新)

- **定義**：組件因資料改變而重新渲染。
- **寫法**：`useEffect(..., [count])` (陣列內有變數)
- **邏輯**：只要 `count` 數值改變，React 判定依賴更新，再次執行副作用。
- **用途：當搜尋條件改變時重新撈取資料。**

#### 3. Unmount (卸載)

- **定義**：組件從 DOM 中被**完全移除**的時刻。
- **React 觸發場景**：
    - 路由切換（換頁）。
    - **條件渲染 (Conditional Rendering)** 變為 false。
        - 範例：`{ showBox && <Box /> }`。
        - 當 `showBox` 從 `true` 變 `false`，`<Box />` 組件就會 Unmount。
- **邏輯**：觸發 Cleanup Function 進行最後清理。

### 五、清除機制

- **這是 `useEffect` 最重要但也最容易被忽略的部分。**

#### 1. 什麼是 Cleanup Function？

- **寫法**：`useEffect` 內部 `return` 的那個函式。
- **目的**：**防止 Memory Leak (記憶體洩漏) 與 Race Condition (競態條件)**。
#### 2. 什麼是 Memory Leak (記憶體洩漏)？
    - **定義**：程式不再需要的記憶體（如計時器、事件監聽器），卻沒有被釋放，導致佔用資源。
    - **後果**：網頁變慢、卡頓，甚至當機。

#### 3. 清除函式的執行時機 (黃金規則)

- React 會在以下兩個時間點執行清除：
    - **Before Re-run (重跑之前)：依賴變數改變，React 準備執行新的副作用前，會先清除上一次的副作用。**
    - **Unmount (卸載時)：組件要消失時，執行最後一次清理。**
#### 4. 以 setTimeout 為解釋範例＋程式範例：
    - **情境：** 假設我們做一個「快閃訊息 (Flash Message)」，這個訊息會在 3 秒後自動消失。
    - **為什麼需要清除？**
        - 如果使用者在 3 秒還沒到的時候就切換頁面（元件被銷毀），但計時器 (`setTimeout`) 還在背景倒數。時間一到，它會嘗試去執行 `setShow(false)`。這時 React 會報錯，因為你試圖去更新一個已經不存在的元件狀態（這是記憶體洩漏的一種）。
    
    ```jsx
    import React, { useState, useEffect } from 'react';
    
    const FlashMessage = () => {
      const [show, setShow] = useState(true);
    
      useEffect(() => {
        // 1. Setup: 設定計時器
        // setTimeout 會回傳一個獨一無二的 ID (例如: 123)
        const timerId = setTimeout(() => {
          console.log('時間到！隱藏訊息');
          setShow(false);
        }, 3000);
    
        // 2. Cleanup: 清除計時器
        // 如果元件在 3 秒內被銷毀，React 會先執行這一行
        return () => {
          console.log('元件卸載，清除計時器 ID:', timerId);
          clearTimeout(timerId); // 使用原本的 ID 來取消
        };
      }, []);
    
      if (!show) return null;
    
      return (
        <div style={{ background: 'yellow', padding: '10px' }}>
          ⚠️ 這是一條會在 3 秒後消失的訊息
        </div>
      );
    };
    ```
    
#### 5. 以原生 JavaScript vs React 程式碼比較
    1. 原生 JavaScript 範例
        - 在這個範例中，我們建立兩個按鈕，一個用來「開始監聽」，一個用來「清除監聽」。
        - **核心重點：你必須傳入「同一個函式參考 (Function Reference)」才能成功移除。**
    
        ```html
        
        <body>
            <h2>Window Resize 監聽器測試</h2>
        
            <button id="startBtn"> 開始監聽 (Setup)</button>
            <button id="stopBtn"> 清除監聽 (Cleanup)</button>
        
            <div id="status">
                目前狀態：<span id="statusText">未開始</span><br>
                視窗寬度：<span id="widthDisplay">-</span>
            </div>
        
            <script>
                // --- 1. 定義共用的處理函式 (關鍵！) ---
                // 必須定義在外面，不能寫在 addEventListener 裡面當匿名函式
                function handleResize() {
                    const width = window.innerWidth;
                    document.getElementById('widthDisplay').innerText = width + 'px';
                    console.log('正在執行 handleResize... 寬度:', width);
                }
        
                // 取得 DOM 元素
                const startBtn = document.getElementById('startBtn');
                const stopBtn = document.getElementById('stopBtn');
                const statusText = document.getElementById('statusText');
        
                // --- 2. 綁定「開始按鈕」事件 ---
                startBtn.addEventListener('click', () => {
                    console.log('>>> 啟動監聽器');
                    statusText.innerText = "監聽中... (請嘗試拉動視窗)";
                    statusText.style.color = "green";
                    
                    // 加入監聽器
                    window.addEventListener('resize', handleResize);
                });
        
                // --- 3. 綁定「清除按鈕」事件 ---
                stopBtn.addEventListener('click', () => {
                    console.log('>>> 清除監聽器');
                    statusText.innerText = "已停止監聽 (拉動視窗不會有反應)";
                    statusText.style.color = "red";
                    
                    // 移除監聽器 (清除機制)
                    // 傳入的 handleResize 必須與上面是同一個
                    window.removeEventListener('resize', handleResize);
                });
            </script>
        ```
    
    b. React 範例
    
    - 在 React 中，我們通常使用 `useEffect` Hook 來處理副作用。**Cleanup Function** 就是 `useEffect` 回傳的那個函式。
    - **重要觀念：`addEventListener` 和 `removeEventListener` 就像是「註冊名單」。你要刪除名字時，必須指名道姓（提供原本那個函式的記憶體位置），不能只提供一個長得很像的新函式 → 所以要提前的把這拉出做成函數**
    
      ```jsx
      import React, { useState, useEffect } from 'react';
      
      const WindowTracker = () => {
        const [windowWidth, setWindowWidth] = useState(window.innerWidth);
      
        useEffect(() => {
          // --- 1. Setup (掛載時執行) ---
          const handleResize = () => {
            console.log('Resizing...');
            setWindowWidth(window.innerWidth);
          };
      
          window.addEventListener('resize', handleResize);
      
          // --- 2. Cleanup Mechanism (卸載時執行) ---
          // React 會在元件「被銷毀 (Unmount)」之前，
          // 自動執行這個 return 出來的函式
          return () => {
            console.log('Cleaning up listener...');
            window.removeEventListener('resize', handleResize);
          };
        }, []); // 空陣列代表只在掛載時執行一次 Setup，卸載時執行一次 Cleanup
      
        return (
          <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h2>視窗寬度追蹤器</h2>
            <p>目前寬度: {windowWidth}px</p>
            <p><i>如果這個元件被隱藏或銷毀，監聽器也會自動被移除。</i></p>
          </div>
        );
      };
      
      export default WindowTracker;
      ```
    

### 六、名詞解釋

| **名詞** | **英文** | **解釋** | **對應語法/位置** |
| --- | --- | --- | --- |
| **副作用** | Side Effect | 跟渲染無關的操作 (API/監聽) | `useEffect` 的主體函式 |
| **依賴陣列** | Dependency Array | 控制執行時機的開關 | 第二個參數 `[]` |
| **掛載** | Mount | 組件出生 (只跑一次) | `[]` 為空 |
| **更新** | Update | 資料變更 (重跑) | `[變數]` |
| **卸載** | Unmount | 組件死亡 (被移除) | 條件渲染 false 或換頁 |
| **清除函式** | Cleanup Function | 打掃環境、防記憶體洩漏 | `return () => { ... }` |
