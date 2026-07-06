---
title: React｜React Hook - useRef
sidebar_position: 4
tags: [React, 知識點筆記]
date: 2025-12-20
slug: /docs/react/react-hook-useref
---

### 一、useRef 大綱

- `useRef` 是一個 **「在組件重新渲染時，資料不會消失」且「修改資料時，不會觸發畫面重新渲染」** 的神奇盒子；它回傳的物件永遠長這樣：`{ current: ... }`。


### 二、useRef 核心定義

- 把 React 組件當作一個 JavaScript 函數，那麼 `useRef` 在底層做了什麼？
#### 1. 它只是一個普通的 JavaScript 物件
    - 當你呼叫 `useRef(0)` 時，React 其實只做了一件非常簡單的事，它回傳了一個**純 JavaScript 物件**給你 → **這個物件沒有任何魔法 getter 或 setter，它就是一個單純的容器。**
    
        ```jsx
        const ref = useRef(0)
        console.log(ref)
        
        // { current:0 }
        ```
    

#### 2. 它是「逃脫 React 渲染流」的記憶體

- 在 React 中，當元件重新渲染（Re-render）時，函數內所有的普通變數（`let`, `const`）都會被重置、重新宣告。但 `useRef` 創造的這個物件，被 React 保存在一個特殊的記憶體位置。

- 第一次渲染： React 建立這個 `{ current: ... }` 物件。
- 第二次渲染： React **不會** 建立新的，而是把 **「同一個物件實體 (Reference)」** 再次還給你。
- **這就是為什麼它叫 `useRef` ，它給你的是對同一個記憶體位址的引用 (Reference)。**

#### 3. 三種變數的生存法則比較

<table width="100%">
  <thead>
    <tr>
      <th width="15%">變數類型</th>
      <th width="25%">普通變數 (let/const)</th>
      <th width="25%">狀態 (useState)</th>
      <th width="25%">引用 (useRef)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>存在位置</strong></td>
      <td>函數內部 (Local Scope)</td>
      <td><strong>React 內部狀態庫</strong></td>
      <td><strong>React 內部記憶體庫</strong></td>
    </tr>
    <tr>
      <td><strong>重新渲染後</strong></td>
      <td><strong>死亡，被重置</strong></td>
      <td>活著，保持最新值</td>
      <td>活著，保持最新值</td>
    </tr>
    <tr>
      <td><strong>修改時</strong></td>
      <td>無感</td>
      <td><strong>觸發重新渲染</strong> (畫面更新)</td>
      <td><strong>不觸發渲染</strong> (靜默更新)</td>
    </tr>
    <tr>
      <td><strong>比喻</strong></td>
      <td>寫在黑板上的字 (下課就擦掉)</td>
      <td>電視畫面 (一換台大家都看得到)</td>
      <td>口袋裡的筆記本 (自己改，沒人知道)</td>
    </tr>
  </tbody>
</table>

#### 4. 為什麼要透過 `.current`？

- 既然它是一個物件 `{ current: ... }`，你就必須遵守 JavaScript 的規則。
    - 想拿值：必須寫 `ref.current`
    - 想存值：必須寫 `ref.current = 新值`
- **這也是為什麼它能不觸發渲染的原因。因為你修改的是物件裡面的屬性，而不是物件本身的參考位址，React 根本偵測不到這個物件變了，自然就不會去更新畫面**

### 三、useRef 實戰用法

#### 1. 直接操作 DOM (抓取元素)
    - 這是 `useRef` 最基礎也最重要的功能。雖然 React 建議透過 State 控制畫面，但有些瀏覽器原生的功能（如：播放影片、繪圖 Canvas、強制聚焦輸入框、捲動視窗），React 無法直接做到，這時就需要用 `ref` 當作橋樑，去抓取 HTML 上的真實節點。
    - 什麼時候用？
        - 管理焦點 (Focus)，例如點按鈕後游標跳到輸入框。
        - 文字選取、媒體播放控制 (Video/Audio)。
        - 計算元素尺寸或位置 (getBoundingClientRect)。

    ```jsx
    import { useRef } from 'react';

    function DOMExample() {
    // 1. 建立一個空的 ref
    const inputRef = useRef(null);

    const handleFocus = () => {
        // 3. 透過 .current 拿到真實的 DOM，直接呼叫原生的 focus() 方法
        inputRef.current?.focus();
        
        // 甚至可以直接修改原生樣式 (雖不建議頻繁這麼做)
        inputRef.current.style.backgroundColor = "#f0f0f0";
    };

    return (
        <div>
        {/* 2. 把 ref 綁定到 HTML 標籤上 */}
        <input ref={inputRef} type="text" placeholder="點擊按鈕來聚焦我" />
        <button onClick={handleFocus}>聚焦輸入框</button>
        </div>
    );
    }
    ```

#### 2. 儲存資料但不更新畫面 (傳參考)
    - 將 `useRef` 當作「靜默的容器」使用。
    - 當你用 `useState` 存資料，React 只要看到資料變了，就會大叫「重畫畫面！」；但用 `useRef` 存資料，React **完全不在乎**，資料變了畫面依然靜悄悄。
    - 什麼時候用？
        - **計時器 ID (Timer ID)：** 這是最經典的例子。ID 變了不需要使用者看到，只是為了之後能清除它。
        - **開關標記 (Flag)：** 例如紀錄 `isMounted` (組件是否還活著)。
        - **快取數據：** 存一些不需要顯示在 UI 上的暫存資料。
    
        ```jsx
        import { useState, useRef } from 'react';
        
        function TimerExample() {
        const [count, setCount] = useState(0);
        
        // 使用 ref 來存計時器的 ID
        // 如果用 useState 存 ID，每次設定 ID 都會導致多餘的渲染
        const timerIdRef = useRef(null);
        
        const startTimer = () => {
            // 防止重複點擊
            if (timerIdRef.current) return;
        
            timerIdRef.current = setInterval(() => {
            setCount(c => c + 1);
            }, 1000);
        };
        
        const stopTimer = () => {
            // 從 ref 取出 ID 來停止計時
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        };
        
        return (
            <div>
            <h1>計數: {count}</h1>
            <button onClick={startTimer}>開始</button>
            <button onClick={stopTimer}>暫停</button>
            </div>
        );
        }
        ```
    
#### 3. 用法三：紀錄「上一次」的值 (Previous State)
    - React 的 `useState` 總是給你「現在」的值。如果你想知道數值變更「前」是多少（例如：為了比較新舊值，判斷股票是漲是跌），你需要自己把舊的值存起來。因為 `ref` 的更新是同步且立即的，它非常適合用來做這種「歷史紀錄」。
    - 什麼時候用？
        - 比較 Props 或 State 的變化。
        - 需要顯示「舊值 vs 新值」的場景。
    
    ```jsx
    import { useState, useEffect, useRef } from 'react';
    
    function PreviousStateExample() {
      const [count, setCount] = useState(0);
      
      // 專門用來存「上一次」的 count
      const prevCountRef = useRef();
    
      useEffect(() => {
        // 渲染「後」執行：把現在的 count 存進 ref
        // 這樣下一次渲染時，ref 裡面的就是「舊」的了
        prevCountRef.current = count;
      }, [count]);
    
      return (
        <div>
          <h2>現在: {count}</h2>
          {/* 這裡讀取出來的，是上一次 useEffect 存進去的值 */}
          <h3>之前: {prevCountRef.current}</h3>
          
          <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
      );
    }
    ```
    
#### 4. 用法四：解決閉包陷阱 (讀取最新值)
- 在某些非同步操作（如 `setTimeout` 或事件監聽）中，函數會「記住」它被建立當下的變數環境（閉包），導致讀到舊的 State。
    **由於 `ref` 是一個物件參考 (Reference)，它的記憶體位址不變，所以無論何時讀取 `ref.current`，都能穿透閉包，拿到當下最新的值。**
- 什麼時候用？
        - 在 `setTimeout` 或 `setInterval` 裡面需要拿最新的 State。
        - 在複雜的 Event Listener 中避免依賴陣列 (Dependency Array) 的問題。
    
    ```jsx
    import { useState, useRef, useEffect } from 'react';
    
    function StaleClosureExample() {
      const [text, setText] = useState("初始文字");
      
      // 隨時同步最新的 text 到 ref 中
      const textRef = useRef(text);
    
      useEffect(() => {
        textRef.current = text;
      }, [text]);
    
      const handleAlert = () => {
        setTimeout(() => {
          // ❌ 如果這裡寫 alert(text)，會顯示 3 秒前按下按鈕時的舊文字
          // ✅ 寫 alert(textRef.current)，會顯示現在輸入框裡最新的文字
          alert('3秒後的最新值: ' + textRef.current);
        }, 3000);
      };
    
      return (
        <div>
          <input value={text} onChange={e => setText(e.target.value)} />
          <button onClick={handleAlert}>3秒後 Alert</button>
        </div>
      );
    }
    ```
