---
title: JS｜JavaScript 陳述式vs 表達式
sidebar_position: 16
tags: [JavaScript, 知識點筆記]
date: 2025-12-25
slug: javascript/js-statements-vs-expressions
---

### 一、陳述式 vs  表達式 比較

- **表達式 (Expression)** 是為了「拿到一個值」，而 **陳述式 (Statement)** 是為了「做一件特定的事」。

- 表格比較
    <table>
      <thead>
        <tr>
          <th><strong>特徵</strong></th>
          <th><strong>表達式 (Expression)</strong></th>
          <th><strong>陳述式 (Statement)</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>目的</strong></td>
          <td><strong>產出值</strong> (Produce a value)</td>
          <td><strong>執行動作</strong> (Perform an action)</td>
        </tr>
        <tr>
          <td><strong>口語比喻</strong></td>
          <td>像是一個「單字」或「片語」<br/>(例如：蘋果、3個、大於)</td>
          <td>像是一個「完整的句子」或「命令」<br/>(例如：把蘋果吃掉、如果下雨就撐傘)</td>
        </tr>
        <tr>
          <td><strong>能否放在等號右邊？</strong></td>
          <td><strong>可以</strong></td>
          <td><strong>不行</strong></td>
        </tr>
        <tr>
          <td><strong>範例</strong></td>
          <td><code>1 + 1</code><br/><code>a &gt; b</code><br/><code>run()</code></td>
          <td><code>if (...) &#123; ... &#125;</code><br/><code>let a;</code><br/><code>for (...) &#123; ... &#125;</code></td>
        </tr>
      </tbody>
    </table>

- 變數測試法
    
    - 這是分辨兩者最強大的方法。請試著把那段程式碼**塞給一個變數**：  `const x = ( 你的程式碼 )` 
        - 如果程式**能跑**，那它就是**表達式**。
        - 如果程式**報錯**，那它通常是**陳述式**

    - 表達式 (Expression) 的例子：這些都可以賦值給變數，因為它們會「回傳結果」。
    

      ```js
      // 純數值與運算
      100            // 這是表達式 (值: 100)
      1 + 2          // 這是表達式 (值: 3)
      
      // 邏輯判斷
      a > 10         // 這是表達式 (值: true/false)
      
      // 函式呼叫
      myFunc()       // 這是表達式 (值: 函式的 return 值或 undefined)
      
      // 三元運算子 (if 的表達式版)
      true ? 1 : 2   // 這是表達式 (值: 1)
      
      // 函式表達式 (Function Expression)
      function() {}  // 這是表達式 (產生一個函式物件)
      
      // 把函式物件這個「值」，存進變數 sayHi
      const sayHi = function() {
        console.log("Hi");
      };
      ```
      
  - 陳述式 (Statement) 的例子：這些不能賦值給變數，因為它們是「結構」或「命令」。
      
      ```js
      // if 判斷
      if (true) { }   // 錯誤：const x = if(true)...
      
      // 迴圈
      for (;;) { }    // 錯誤：const x = for(;;)...
      
      // 變數宣告
      let a = 1;      // 錯誤：const x = let a = 1... (這是宣告動作)
      
      // 區塊
      { console.log(a) } // 錯誤：const x = { ... } (這裡會被誤判為物件，但在語法結構上區塊不能這樣賦值)
      ```
      
- 一個容易混淆的特例：賦值表達式 →   賦值 (`=`)本身是一個表達式
      
      ```js
      let a;
      let b;
      
      // 這行之所以成立，是因為 (b = 5) 是一個表達式
      // 它執行完後會「回傳 5」，然後再把 5 賦值給 a
      a = (b = 5); 
      
      console.log(a); // 5
      console.log(b); // 5
      ```
      
- **總結**
    
    :::tip
    
    看到一段程式碼，問自己：**「它會吐出一個值給我嗎？」**
        - 會 → **表達式** (Expression)
        - 不會，它只是在控制流程或宣告變數 → **陳述式** (Statement)
    
    :::
