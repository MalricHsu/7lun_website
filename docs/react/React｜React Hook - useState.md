---
title: React｜React Hook - useState
sidebar_position: 2
tags: [React, 知識點筆記]
date: 2025-12-10
---

### 一、語法結構拆解：變數 vs.方法

        ```jsx
        const [state, setState] = useState(initialValue);
        ```

<table width="100%">
  <thead>
    <tr>
      <th width="10%">組成部分</th>
      <th width="20%">角色定位</th>
      <th width="70%">詳細定義</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong><code>state</code></strong></td>
      <td><strong>變數 (Data)</strong><br/><em>當下的畫面狀態</em></td>
      <td><strong>這是一個變數</strong>，這是 React 給你的<strong>「這一幀 (Frame)」的資料快照。</strong>在同一次渲染中，<strong>它是唯讀的 (Read-only)，</strong>你不能直接修改它（如 <code>state = 5</code> 是無效的）<strong>。它代表了使用者目前看到的樣子</strong>。</td>
    </tr>
    <tr>
      <td><strong><code>setState</code></strong></td>
      <td><strong>方法 (Method)</strong><br/><em>通知 React 更新的遙控器</em></td>
      <td><strong>這是一個函式</strong>。它的作用不只是「改值」，更重要的是<strong>「觸發 React 重新渲染 (Re-render)」</strong>。呼叫它等於告訴 React：「資料變了，請用新的資料重新畫一次畫面！」</td>
    </tr>
    <tr>
      <td><strong><code>initialValue</code></strong></td>
      <td><strong>初始值</strong></td>
      <td>只有在 <strong>Component 第一次 被建立（Mount）時才會用到</strong>。之後的每一次重新渲染，React 都會忽略這個值，改用內部的最新狀態。</td>
    </tr>
  </tbody>
</table>
- **一句話總結**：我們透過呼叫 **`setState` (方法)** 來通知系統，系統會在下一次渲染時提供最新的 **`state` (變數)** 給我們使用。

### 二、運作機制：為什麼需要「方法」來改「變數」？

#### 1. 在一般 JavaScript 中，我們習慣 `x = x + 1` 直接修改變數。但在 React 中，這行不通，因為：
    - **單向資料流**：React 需要知道數據何時變動，才能去更新 DOM。
    - **排程更新**：**`setState` 是一個請求，而非立即指令**。
#### 2. 流程圖解
    1. **呼叫方法**：你執行 `setState(newValue)`。
    2. **React 接收**：React 收到通知，將這次更新加入排程（Update Queue）。
    3. **重新計算**：React 找出哪些 Component 需要更新。
    4. **產生新變數**：React 再次執行你的 Component function，這次 `useState` 回傳的是**新的 state 值**。
    5. **更新畫面**：React 比較新舊結果，修改瀏覽器的 DOM。

### 三、`setState` 的兩種使用模式

#### 1. 模式 A：直接取代 (Direct Update)
    - **語法**：`setState(newValue)`
    - **意義**：告訴 React「不管之前是多少，把狀態變成這個值」。
    - **限制**：如果新的值是根據舊的值算出來的（例如 `count + 1`），在快速連續點擊或非同步情況下，可能會讀到舊的 `state` 變數快照，導致計算錯誤。
#### 2. 模式 B：功能性更新 (Functional Update / Callback)
    - **語法**：`setState(prev => prev + 1)`
    - **意義**：告訴 React「請去內部資料庫拿**最新的值**，代入這個公式計算」。
    - **優勢**：
        - 確保拿到的 `prev` 絕對是最新版（即使在閉包或非同步中）。
        - 解決「批次更新 (Batching)」帶來的覆蓋問題。
    - 批次更新 (Batching)
        - **效能優化**：React 會把短時間內的多個 `setState` 合併成一次 Render，避免畫面不必要的頻繁閃爍。
        - **這就是為什麼你需要 Callback**：因為在同一次 Batch 中，State 變數的值還沒變，只有透過 Callback 才能在隊列中拿到中間產生的值。

### 四、關鍵避坑指南

#### 1. State 是不可變的 (Immutable) → `state` 變數在當次 Render 中是常數。
    - React 是透過**比較 記憶體位置 (Reference)** 來決定要不要重新渲染。
    - **不可變性 (Immutable)**：絕對不要直接修改 state (例如 `state.push` 或 `state.value = 1`)，React 會以為資料沒變而不更新畫面。
        - **錯誤**：`user.name = "Tom"` (React 不知道你改了，畫面不會變)。
    - **正確做法**：必須產生一個**新的**物件或陣列。
        - **正確**：`setUser({ ...user, name: "Tom" })` (用 `setState` 方法傳入一個全新的物件，觸發更新)。 → 「先複製一個新的物件並修改好資料，然後把這個**全新的物件**交給 React，告訴它：**『請把舊的整份換掉，用這份新的取代它』**。」
#### 2. 非同步的錯覺
    - 呼叫 `setState` 後，下一行程式碼讀到的 `state` **還是舊的**。
    
        ```jsx
        import { useState } from 'react';

        const Example = () => {
          const [count, setCount] = useState(0);

          const handleClick = () => {
            // 直接使用 count + 1 來更新狀態
            setCount(count + 1); 
            
            // 印出 count 來驗證你的觀念
            console.log(count); 
            // 你的觀念完全正確：這裡印出來的還是 0 (舊值)。
            // 因為 count 是一個常數 (const)，在這次函式執行結束前，
            // 它絕對不會變。你就算呼叫一萬次 setCount，當下的 count 依然是舊的那張快照（Snapshot）。
          };

          return (
            <>
              <div>{count}</div>
              <button type="button" onClick={handleClick}>+1</button>
            </>
          );
        };

        export default Example;
        ```
    
        :::note
        
        **觀念**：`setState` 就像寄出一封信，你不能寄信後馬上打開郵筒期待看到回信，要等郵差（React）跑完流程。
        
        :::
    - 要取得「最新的值」，取決於你的**目的**是什麼。
    - 通常有兩種解決方案：
        - 情境一：我只是要在「同一個函式」裡馬上用到這個新值 → 解法：不要依賴 State，使用「區域變數 (Local Variable)」
            :::info
            
            **觀念**：State 是給「畫面渲染」用的。如果你在函式內部的邏輯馬上就要用，直接用你自己宣告的變數即可。
            
            :::
        
            ```jsx
            const handleClick = () => {
            // 1. 先把新值算好，存成一個普通的變數
            const nextCount = 5; 
            // 或者如果是累加： const nextCount = count + 1;
            
            // 2. 把這個變數拿去更新 State (通知 React 之後要重畫)
            setCount(nextCount);
            
            // 3. 同時直接用這個變數做後續的事 (API 請求、Log 等)
            console.log(nextCount); // 這裡印出來就是 5 了！
            
            // 假設你要馬上送出 API
            // fetchData(nextCount); // 這樣傳出去的資料才會是正確的
            };
            ```
        
        - 情境二：我想監聽 State 變更後，自動執行某件事 → 解法：使用 `useEffect`
            - 如果你是希望「當 count 真的變成 5 並且畫面更新之後，再執行 log」，那你應該使用 `useEffect` 勾子 (Hook)。
            - 這就像是告訴 React：「等全部更新完、畫面畫好之後，再執行這段程式碼」。
            
            ```jsx
            // 這個 useEffect 放在 component 內層 (但在 handleClick 外面)
            useEffect(() => {
            // 只有當 count 變更完成，且畫面 Render 完後，這裡才會執行
            console.log("畫面更新了，最新的 count 是：", count); 
            }, [count]); // 👈 依賴陣列：告訴 React 只要 count 變了就執行這裡
            
            const handleClick = () => {
            setCount(5);
            // 這裡不需要寫 console.log，上面的 useEffect 會自動觸發
            };
            ```
        
        - 總結建議
            - 如果你是要 **「計算完馬上用」** (例如：算完成績馬上送給後端)：**請用方法一 (區域變數)**。
            - 如果你是要 **「觀察資料變化」** (例如：數字變了就自動儲存到 LocalStorage)：**請用方法二 (`useEffect`)**。
#### 3. 初始化的效能優化
    - 如果 `initialValue` 需要經過複雜計算（例如讀取 LocalStorage 或做大運算），請改傳**函式**給 `useState`。
    - **直接傳值**：`useState(heavyComputation())`  →  **每次 Render** 都會算一次（浪費效能）。
    - **傳入函式**：`useState(() => heavyComputation())` →  **只有第一次 Render** 會執行。
    
        ```jsx
        // 這樣寫，複雜運算只會跑一次 (Lazy Initialization)
        const [state, setState] = useState(() => heavyCalculation());
        ```