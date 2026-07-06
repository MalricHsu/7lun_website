---
title: 02｜ JavaScript 流程判斷與控制
sidebar_position: 2
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-09-26
slug: /docs/javascript/js-control-flow
---

- [課程講義](https://liberating-turtle-5a2.notion.site/528970238a6948a6b78cb0006a17ef04)
- [助教講義](https://chalk-freedom-ec6.notion.site/26e6ab47eb48807198fbe94f1a2ff64c)

### 一、比較運算子

- 用來比較兩邊的運算元，**會回傳一個「布林值」**
- 大於 `>`、大於等於 `>=`、小於 `<`、小於等於 `<=`
- 等於 `==`、`===`
- 不等於 `!=`、`!==`
- 兩個等於與三個等於的差異：
  - **寬鬆相等**：`==` 和 `!=`，先將兩邊的運算元轉型為相同型別，再做比較
  - **嚴格相等**：`===` 和 `!==`，會先比較型別，再比較值

  :::tip
  建議都使用**嚴格相等**，避免強制轉型發生預期外情況。
  :::

### 二、邏輯運算子

- 用來做邏輯判斷，`&&` 和 `||` 會回傳值本身，`!` 會回傳布林值

- **`&&` 且（AND）**：假如 `運算式1` 可以被轉換成 false，回傳 `運算式1`；否則回傳 `運算式2`。**兩個運算元都是 true 時才會回傳 true**

  ```js
  let a1 = true && true;       //  t && t  回傳 true
  let a2 = true && false;      //  t && f  回傳 false
  let a3 = false && 3 == 4;    //  f && f  回傳 false
  let a4 = "Cat" && "Dog";     //  t && t  回傳 Dog
  let a5 = "Cat" && false;     //  t && f  回傳 false
  ```

- **`||` 或（OR）**：假如 `運算式1` 可以被轉換成 true，回傳 `運算式1`；否則回傳 `運算式2`。**兩個運算元有任一個是 true 時就會回傳 true**

  ```js
  let o1 = true || true;       //  t || t  回傳 true
  let o2 = true || false;      //  t || f  回傳 true
  let o3 = false || 3 == 4;    //  f || f  回傳 false
  let o4 = "Cat" || "Dog";     //  t || t  回傳 Cat
  let o5 = false || "Cat";     //  f || t  回傳 Cat
  let o6 = "Cat" || false;     //  t || f  回傳 Cat
  ```

- **`!` 不是（NOT）**：假如運算元能被轉換成 true，回傳 `false`；否則回傳 `true`

  ```js
  let n1 = !true;    //  !t  回傳 false
  let n2 = !false;   //  !f  回傳 true
  let n3 = !"Cat";   //  !t  回傳 false
  ```

### 三、流程判斷語法

- 條件式成立才會執行 `{}` 裡面的程式碼

#### 1. `if` 如果

  ```js
  if (條件) {
    //  條件為真值時，執行此區塊的指令
  }
  ```

#### 2. `if ... else` 如果...否則

  ```js
  if (條件) {
    //  條件為真值時，執行此區塊的指令
  } else {
    //  條件為假值時，執行此區塊的指令
  }
  ```

#### 3. `if ... else if ... else` 如果...如果...否則

  ```js
  if (條件1) {
    //  條件1 為真值時，執行此區塊的指令
  } else if (條件2) {
    //  條件2 為真值時，執行此區塊的指令
  } else {
    //  以上都不符合時，執行此區塊的指令
  }
  ```

#### 4. 情境拆解

- `if` 常用在**如果、假如、是否、判斷**的情境上
- 步驟一：定義程式目的
- 步驟二：設定初始資料狀態
- 步驟三：依照目的進行**任務拆解**

- [流程圖](https://zh.wikipedia.org/zh-tw/%E6%B5%81%E7%A8%8B%E5%9B%BE)：  

  ![流程判斷](/img/js02-1.png)

#### 5. 課程程式範例

- 小明去參加歌手握手會，到門口時，守衛問他說，有沒有帶入場券，小明亮出入場券後進入了會場，隨後想排隊跟歌手握手時，又被第二個守衛擋住，問他說，他有沒有買 5000 張以上 DVD？但因為小明只有買 3000 張 DVD，小明只好忍痛離開，並下定決心要將這過程記錄下來，下次一定要握到手！

  ```js
  let hasTicket = false;
  let hasBuyDVD = 0;
  hasTicket = true;
  hasBuyDVD = 3000;

  if (hasTicket) {
    console.log("可以入場");
    if (hasBuyDVD > 5000) {
      console.log("可以握手");
    } else {
      console.log("不可以握手");
    }
  } else {
    console.log("不可以入場");
  }
  ```


### 四、延伸：三元運算子與邏輯運算的短路性質

#### 1. 名詞解釋

| 名詞 | 說明 |
| --- | --- |
| **三元運算子（Ternary Operator）** | 一種**條件運算符**，用來根據**條件判斷選擇兩個值中的其中一個**，是 JS 中唯一有三個操作數的運算子 |
| **短路性質（Short-Circuit Evaluation）** | 在邏輯運算中，如果**運算結果已經可以確定，後面的運算式就不會被計算** |

#### 2. 三元運算子（Ternary Operator）

- 語法：

  ```js
  condition(條件) ? exprIfTrue(true 執行) : exprIfFalse(false 執行)
  ```

- 程式範例：

  ```js
  let age = 20;
  let canVote = (age >= 18) ? "Yes" : "No";
  console.log(canVote);  //  "Yes"
  ```

- 有**短路性質**，只有符合條件的分支會被計算，另一個分支完全不會執行

  ```js
  //  範例一：x = 5，條件為 false
  let x = 5;
  let result = (x > 10) ? expensiveFunction() : "Too small";
  //  x > 10 為 false，expensiveFunction() 根本不會被呼叫

  //  範例二：x = 15，條件為 true
  let x = 15;
  let result = (x > 10) ? expensiveFunction() : "Too small";
  //  x > 10 為 true，會輸出 100 且印出 "這個函式被呼叫了"

  function expensiveFunction() {
    console.log("這個函式被呼叫了");
    return 100;
  }
  ```

#### 3. 邏輯運算的短路性質（Short-Circuit Evaluation）

- 在 JavaScript 中，`&&`（AND）和 `||`（OR）都有短路特性

- **AND `&&` 的規則**：「全部都成立」，只要有一個 false，就不用看後面的了

  ```js
  function a() { console.log("a"); return true; }
  function b() { console.log("b"); return false; }

  a() && b();  //  "a" 先印，a() 回傳 true，b() 也要執行 → 印 "b"
  b() && a();  //  "b" 先印，b() 回傳 false → 短路，不執行 a()

  //  解釋：
  //  b() && a()
  //  b() = false → 整個結果一定 false → 短路，不執行 a()
  ```

- **OR `||` 的規則**：「至少一個成立」，只要有一個 true，就不用看後面的了

  ```js
  function a() { console.log("a"); return true; }
  function b() { console.log("b"); return false; }

  a() || b();  //  a() 回傳 true → 短路，不執行 b() → 只印 "a"
  b() || a();  //  b() 回傳 false → 需要看 a() → 先印 "b"，再印 "a"

  //  解釋：
  //  a() || b()
  //  a() = true → 結果一定 true → 短路，不執行 b()
  ```

#### 4. 三元運算子 vs 邏輯運算短路性質

- **三元運算子**：只會**計算符合條件的那一個分支**
- **邏輯運算短路**：**根據第一個運算子結果，有時第二個運算根本不會被計算**
- 程式範例：

  ```js
  let user = null;

  //  用三元運算子
  let name = user ? user.name : "Guest";
  //  user 為 null 視為 false，選擇 "Guest"

  //  用邏輯運算短路（&& 與 || 結合）
  let name2 = (user && user.name) || "Guest";
  //  user = null 視為 false，第一部分為 false
  //  false || "Guest"，OR 只要有一個 true 即可，故選擇 "Guest"

  //  單純用 && 看結果（短路特性）
  let name3 = user && user.name;
  //  user = null 為 false，不符合 AND 雙方皆要為 true
  //  短路，user.name 不會計算，最終顯示 null

  console.log(name);    //  "Guest"
  console.log(name2);   //  "Guest"
  console.log(name3);   //  null
  ```

- 小細節補充：
  - **假值 ≠ false**，假值包括：`false`、`0`、`""`、`null`、`undefined`、`NaN`
  - `&&` 和 `||` 並不會自動把結果轉成布林值，它們會**返回原始值**
  - 如果想把結果變成布林值，可以在變數前面加上 `!!`


### 五、資料來源
- [MDN 邏輯運算子](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Expressions_and_operators#%E9%82%8F%E8%BC%AF%E9%81%8B%E7%AE%97%E5%AD%90)