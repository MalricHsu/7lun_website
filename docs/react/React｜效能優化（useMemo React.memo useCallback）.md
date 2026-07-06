---
title: React｜效能優化（useMemo React.memo useCallback）
sidebar_position: 5
tags: [React, 知識點筆記]
date: 2025-12-22
slug: /docs/react/react-performance-optimization
---

### 一、三者總結比較

#### 1. 表格統整
    
<table width="100%">
  <thead>
    <tr>
      <th width="15%">特性</th>
      <th width="28%">useMemo</th>
      <th width="28%">useCallback</th>
      <th width="29%">React.memo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>類型</strong></td>
      <td>React Hook</td>
      <td>React Hook</td>
      <td>HOC (高階元件)</td>
    </tr>
    <tr>
      <td><strong>快取對象</strong></td>
      <td><strong>「值」</strong> (Value)<br/>(物件、陣列、計算結果)</td>
      <td><strong>「函式」</strong> (Function)<br/>(函式定義本身)</td>
      <td><strong>「元件」</strong> (Component)<br/>(渲染後的 UI)</td>
    </tr>
    <tr>
      <td><strong>回傳內容</strong></td>
      <td>執行函式後的<strong>結果</strong></td>
      <td>未執行的<strong>函式本身</strong></td>
      <td>一個被優化過的<strong>元件</strong></td>
    </tr>
    <tr>
      <td><strong>主要用途</strong></td>
      <td>1. 節省複雜運算時間<br/>2. 固定物件記憶體位置</td>
      <td>1. 固定函式記憶體位置<br/>2. 配合 React.memo 使用</td>
      <td>防止子元件因父元件更新而無效渲染</td>
    </tr>
    <tr>
      <td><strong>更新時機</strong></td>
      <td>依賴陣列改變時 ➔ <strong>重算</strong></td>
      <td>依賴陣列改變時 ➔ <strong>重造函式</strong></td>
      <td>Props 改變時 ➔ <strong>重繪元件</strong></td>
    </tr>
  </tbody>
</table>

#### 2. 三者核心比較

- `useMemo`  **(記憶「資料」)**
  - **定義**：`const cachedValue = useMemo(fn, deps)`
  - **它做什麼**：它會執行 `fn`，並把**結果**存起來。
  - **什麼時候用**：
    - **昂貴計算**：例如 `filter` 一個幾萬筆的陣列，不希望每次 render 都重跑迴圈。
    - **參照相等性**：你要傳一個「物件」或「陣列」給子元件，且子元件有用 `React.memo`。你需要保證這個物件的記憶體位置不變。

- `useCallback` **(記憶「函式」)**
  - **定義**：`const cachedFn = useCallback(fn, deps)`
  - **它做什麼**：它**不會**執行 `fn`，它只是把這個函式定義存起來，保證記憶體位置不變。
  - **什麼時候用**：
    - **傳函式給子元件**：你要傳一個 `onClick` 或 `onChange` 給子元件，且子元件有用 `React.memo`。如果你不用 `useCallback`，每次父元件 render，這個函式都會被視為「新的」，導致子元件的優化失效。
    - **useEffect 的依賴**：當某個函式被放在 `useEffect` 的依賴陣列中時。

- `React.memo` **(記憶「畫面」)**
  - **定義**：`const MemoComponent = React.memo(Component)`
  - **它做什麼**：它是元件的守門員。父元件更新時，它會對比新舊 `props`。
  - **什麼時候用**：
    - **純展示元件**：給一樣的資料，畫面就長得一樣。
    - **重渲染成本高**：元件內部 DOM 很複雜。
    - **父元件更新頻繁**：父元件常動，但此子元件的資料其實很少變。

### 二、什麼時候一起用？

- 這是面試或實務最常考的場景：**「父元件傳遞東西給子元件」**。
- 為了達到極致的效能優化，這三個通常是連鎖反應：

#### 1. 優化條件

- **子元件 (Child)**：
  - 為了不被父元件重繪波及，必須用 **`React.memo`** 包起來。
  - *條件*：只有當傳進來的 Props (物件或函式) 記憶體位置不變時，`React.memo` 才會生效。
- **父元件 (Parent)**：
  - 為了讓子元件的 `React.memo` 生效，父元件必須保證傳下去的東西「記憶體位置不變」。
  - 如果傳的是**物件/陣列** ➔ 用 **`useMemo`** 鎖住。
  - 如果傳的是**函式** ➔ 用 **`useCallback`** 鎖住。

#### 2. 程式碼範例

    ```jsx
    import React, { useState, useMemo, useCallback } from 'react';

    // 1. 子元件
    // 職責：負責渲染大量資料，很耗效能。
    // 優化：使用 React.memo 包起來。
    // 條件：只有當 props (items 或 onItemClick) 真的改變時，才允許重繪。
    const BigProductList = React.memo(({ items, onItemClick }) => {
      console.log("🔥 列表重新渲染了！ (打字時不應該看到這行)");
      
      return (
        <ul>
          {items.map(item => (
            <li key={item.id} onClick={() => onItemClick(item.id)}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      );
    });

    
    // 2. 父元件 (App)
    // 職責：管理所有狀態。
    export default function App() {
      // 狀態 A：與列表無關的狀態 (例如使用者的留言輸入) -> 更新頻率高
      const [inputText, setInputText] = useState("");

      // 狀態 B：列表資料相關的狀態 (例如篩選條件) -> 更新頻率低
      const [filterPrice, setFilterPrice] = useState(100);
      
      // 模擬原始資料
      const allProducts = [
        { id: 1, name: "筆電", price: 30000 },
        { id: 2, name: "滑鼠", price: 500 },
        { id: 3, name: "鍵盤", price: 2000 },
        // ... 假設這裡還有幾千筆資料
      ];

      // 關鍵步驟 1：使用 useMemo 鎖定「資料」 (Props: items)
      // 如果不用 useMemo，每次 setInputText 導致 App 重繪時，
      // visibleProducts 都會變成一個「全新的陣列」(記憶體位置改變)。
      // 這會導致 React.memo 認為 props 變了，優化失效。
      const visibleProducts = useMemo(() => {
        // 假設這裡有很複雜的篩選邏輯
        return allProducts.filter(product => product.price > filterPrice);
      }, [filterPrice]); // 只有當「篩選價格」改變時，才產出新陣列

      
      // 關鍵步驟 2：使用 useCallback 鎖定「函式」 (Props: onItemClick)
      // 如果不用 useCallback，每次 setInputText 導致 App 重繪時，
      // handleClick 都會變成一個「全新的函式」(記憶體位置改變)。
      // 這同樣會導致 React.memo 認為 props 變了，優化失效。
      const handleClick = useCallback((id) => {
        console.log("點擊了產品 ID:", id);
      }, []); // 空陣列表示這個函式永遠不會變

      return (
        <div style={{ padding: 20 }}>
          <h3>效能優化組合技範例</h3>
          
          {/* 區域 A：快速打字區 */}
          <div style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc' }}>
            <p>1. 快速打字區 (更新這裡不該觸發下方列表渲染)</p>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="在這裡打字..." 
            />
            <span> 你輸入了: {inputText}</span>
          </div>

          <hr />

          {/* 區域 B：控制列表的篩選器 */}
          <button onClick={() => setFilterPrice(prev => prev + 100)}>
            2. 調整篩選價格 (目前 > {filterPrice})
          </button>

          {/* 區域 C：大數據列表 */}
          {/* 我們把鎖定好的資料 (visibleProducts) 和 函式 (handleClick) 傳進去 */}
          <BigProductList 
            items={visibleProducts} 
            onItemClick={handleClick} 
          />
        </div>
      );
    }
    ```

#### 3. 為什麼這三個缺一不可？ (拆解分析)

- 讓我們試著**拿掉其中一個**，看看會發生什麼災難：

- 如果只拿掉 `useMemo`？
  - **狀況**：我在 Input 打字 ➔ App 重繪 ➔ 執行篩選邏輯 ➔ 產生一個**新的** `visibleProducts` 陣列（雖然內容一樣，但它是新陣列）。
  - **結果**：`BigProductList` 發現 `props.items` 的記憶體位置變了 ➔ **`React.memo` 擋不住，列表被迫重繪。**

- 如果只拿掉 `useCallback`？
  - **狀況**：我在 Input 打字 ➔ App 重繪 ➔ 定義 `const handleClick = ...` ➔ 產生一個**新的** 函式位置。
  - **結果**：`BigProductList` 發現 `props.onItemClick` 的記憶體位置變了 ➔ **`React.memo` 擋不住，列表被迫重繪。**

- 如果只拿掉 `React.memo`？
  - **狀況**：我在 Input 打字 ➔ App 重繪 ➔ React 預設行為是「父元件重繪，子元件無條件跟著重繪」。
  - **結果**：不管你 `useMemo` 或 `useCallback` 做得多好，列表都會直接重繪。

#### 4. 結論：什麼時候要這三個一起用？

- 當你滿足以下 **三個條件** 時，就是「三種」登場的時候：
  - **有一個「重型」子元件**：渲染很慢，你想用 `React.memo` 保護它。
  - **父元件會「頻繁」更新**：例如有 Input 打字、滑鼠移動、Timer 讀秒，會導致父元件一直重繪。
  - **父元件需要傳「物件/陣列/函式」給子元件**：你需要用 `useMemo` (資料) 和 `useCallback` (函式) 來保持這些 Props 的穩定，才不會讓 `React.memo` 破功。
