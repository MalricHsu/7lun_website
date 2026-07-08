---
title: JS｜Chrome 開發者工具的常見錯誤
sidebar_position: 3
tags: [JavaScript, 知識點筆記]
date: 2025-09-28
slug: javascript/js-chrome-devtools-errors
---

### 一、Chrome 開發者工具的常見錯誤排解

在開發 JavaScript 時，瀏覽器的控制台（Console）是我們最常使用的除錯工具。當程式碼出錯時，Chrome DevTools 會印出不同類型的錯誤，以下整理了最常見的四種錯誤類型與其排除方式：

#### 1. SyntaxError（語法結構錯誤）

- 這類型錯誤通常是**語法結構**錯誤。
- 遇到這類型錯誤建議透過**文字編輯器**除錯，以 VSCode 來說，通常會直接跳出紅色的錯誤提示。

- **常見錯誤訊息**：
  - `Uncaught SyntaxError: Unexpected identifier`：
    - **原因**：在物件結構中缺少了逗點 `,`。
    - **排解方法**：除了透過 VSCode 查看外，也可以直接透過 Chrome Console 連結至 Source 頁面查看錯誤行數，並檢查該行前後文是否有語法結構上的錯誤。
    - **範例**：
      ```js
      let user = {
        name: 'Bob'  //  缺少逗點
        age: 20
      };
      ```
  - `Uncaught SyntaxError: Unexpected end of input`：
    - **原因**：預期的結束（通常是缺少了結尾的 `}` 或 `]` 等閉合符號）。
    - **排解方法**：建議在撰寫程式碼時盡可能維持正確的縮排，將程式排整齊後比較容易正確找到漏掉的結尾符號。
    - **範例**：
      ```js
      function greet() {
        console.log('Hello');
      //   缺少結尾的 }
      ```
  - `Uncaught SyntaxError: Unexpected token '}'`：
    - **原因**：未預期的符號 `}`，表示程式碼中多了多餘的結尾符號。
    - **排解方法**：檢查括號是否成對，盡可能將程式碼排整齊且維持首尾符號的一致。
    - **範例**：
      ```js
      if (true) {
        console.log('Hello');
      }
      }  //  多餘的 }
      ```
  - `Uncaught SyntaxError: Identifier 'a' has already been declared`：
    - **原因**：識別符號（在此指的是變數）已經被宣告過。
    - **排解方法**：請避免重複宣告同一個變數。在 ES6 中，`let` 和 `const` 都禁止重複宣告。
    - **範例**：
      ```js
      let a = 1;
      let a = 2;  //  重複宣告變數 a
      ```

#### 2. ReferenceError（找不到參考）

- 此類型錯誤通常是指**「參考」找不到**。
- 當出現這類型錯誤時，文字編輯器**不一定**會出現錯誤（通常需要安裝 ESLint 等 Linter 才會提示），所以時常會在瀏覽器執行階段才會看到這類型錯誤。

- **常見錯誤訊息**：
  - `Uncaught ReferenceError: a is not defined`：
    - **原因**：由於變數 `a` 未定義（宣告），所以在取用該變數時會出現未定義的提示。
    - **排解方法**：只要預先定義此變數即可。
    - **範例**：
      ```js
      console.log(a);  //  未定義變數 a 就直接取用
      ```

#### 3. TypeError（型別錯誤）

- 屬於**型別上**的錯誤。
- 文字編輯器同樣不會預先提示有錯，必須在執行環境執行時才會看到。

- **常見錯誤訊息**：
  - `Uncaught TypeError: Cannot read property 'a' of undefined`：
    - **原因**：在 `undefined` 或 `null` 的值下，無法查找到特定的屬性。
    - **排解方法**：確認該變數是否已正確賦予物件值，或使用選擇性串連（Optional Chaining `?.`）安全地讀取屬性。
    - **範例**：
      ```js
      let user;
      console.log(user.name);  //  user 為 undefined，無法讀取其屬性 name
      ```
  - `Uncaught TypeError: console.log(...) is not a function`：
    - **原因**：這段程式碼中看起來會是立即函式（IIFE）的錯誤，但卻出現了 `console.log(...) is not a function`。此錯誤主要是因為**缺少分號**，導致瀏覽器將兩段程式碼合併為一行執行。
    - **排解方法**：在 `console.log(...)` 結尾加上分號 `;`。
    - **範例**：
      ```js
      console.log('Hello')  //  缺少分號
      (function() {
        //   ...
      })()
      //   實際會被解析為：console.log('Hello')(function(){...})()
      ```

#### 4. RangeError（超出範圍錯誤）

- 建立了超過長度的陣列，或過度地執行函式（產生過多執行堆疊 / Stack Overflow）所造成的錯誤。
- 這類型錯誤需要重新檢視程式碼的邏輯，是否會造成過度的硬體資源消耗（記憶體或運算資源）。

:::warning 除錯重點

需重新檢視邏輯，如果必要可先刪除或註解部分程式碼，先找出錯誤的片段後再進行除錯。

:::

- **常見錯誤訊息**：
  - `Uncaught RangeError: Maximum call stack size exceeded`：
    - **原因**：函式呼叫時會產生一個執行堆疊，如果堆疊的過程中超過最大數量則會产生錯誤（例如：在函式內無限呼叫自己，沒有遞迴終止條件）。
    - **排解方法**：檢查遞迴函式是否有正確的終止/跳出條件。
    - **範例**：
      ```js
      function count() {
        count();  //  無限遞迴呼叫自己，造成堆疊溢位 (Stack Overflow)
      }
      count();
      ```

### 二、資料來源

- [JavaScript 警告視窗的解法](https://www.casper.tw/development/2020/09/16/chrome-js-alert/)
- [MDN - JavaScript 錯誤](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Errors)