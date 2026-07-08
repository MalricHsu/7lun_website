---
title: JS｜JavaScript 四種迴圈比較
sidebar_position: 14
tags: [JavaScript, 知識點筆記]
date: 2026-04-26
slug: javascript/js-loop-comparison
---

### 前言、迴圈

- 在學習 JavaScript 的過程中，「**迴圈**」是非常重要的基礎概念之一。
- 無論是**處理資料**、**重複執行任務**，或是**操作陣列與物件**，迴圈都是不可或缺的工具。
- JavaScript 提供了多種不同形式的迴圈語法，包括：`while`、`for`、`for...in`、`for...of`。
- 它們的語法結構與使用場景略有不同，理解每一種的特性與差異，能讓我們在程式設計時更靈活地選擇合適的寫法。

### 一、while

1. 概念：`while` 迴圈會在每次執行前先檢查條件：條件為 `true` 則執行區塊、為 `false` 則停止。適合「**重複直到滿足某條件**」的情境，特別是**當你不知道需要執行幾次**時。
2. 語法：
    
    ```js
    while (條件) {
      // 重複執行的內容
    }
    ```
    
3. 範例-簡單計數：
    
    ```js
    let i = 0;
    while (i < 5) {
      console.log(i);
      i++; // 必須更新，否則會無限迴圈
    }
    
    // 執行順序：
    // 1. 先檢查條件
    // 2. 若為true，執行區塊
    // 3. 執行完後在回去再檢查條件
    // 4. 若為false，就結束 
    ```
    
4. 範例-從使用者輸入重複詢問：
    
    ```js
    // 假設 getUserAnswer() 會回傳 'y' 或 'n'
    let answer;
    while ((answer = getUserAnswer()) !== 'n') {
      doSomething();
    }
    ```
    
5. 常見錯誤
    - **忘記更新變數（導致無限迴圈）**。
    - 條件一開始就是 `false`（迴圈體一次都不會執行）。
6. While 迴圈的另一種寫法  →  `do...while`
    
    ```js
    let i = 0;
    do {
      console.log(i);
      i++;
    } while (i < 5);
    ```
    

### 二、for

1. 概念：`for` 最適合用於「**已知或可推估次數**」的迴圈。語法把初始化、條件與更新放在一行，閱讀性與結構性好。
2. 語法：
    
    ```js
    for (初始值; 條件; 更新表達式) {
      // 重複執行內容
    }
    ```
    
3. 範例-計算 1 到 10 的總和：
    
    ```js
    let sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += i;
    }
    console.log(sum); // 55
    ```
    
4. 範例-遍歷陣列（傳統索引方式）：
    
    ```js
    const arr = ['a', 'b', 'c'];
    for (let i = 0; i < arr.length; i++) {
      console.log(i, arr[i]);
    }
    
    // "a" 0
    // "b" 1
    // "c" 2
    ```
    
5. 常見錯誤
    - 在 `for` 的條件中寫錯比較式，或忘記 `i++` 導致無限迴圈。
    - 使用 `var` 造成迴圈外仍可存取該變數（可能是 bug）——通常建議用 `let`。
6. 建議
    - 若只需要讀取陣列的值，`for...of` 可讀性更好；若需要索引或反向迭代，傳統 `for` 更靈活。

### 三、for...in

1. 概念：`for...in` 用來 **遍歷物件（Object）的可列舉屬性（enumerable properties）**，每次迭代會**產生屬性名稱（key）**。
2. 語法：
    
    ```js
    for (let key in 物件) {
      // key 是屬性名稱
      // 物件[key] 是對應的值
    }
    ```
    
3. 範例-遍歷物件：
    
    ```js
    const person = { name: 'Amy', age: 30 };
    for (let key in person) {
      console.log(key, person[key]);
    }
    // name  Amy
    // age 30
    ```
    
4. `for...in`是**針對物件的屬性（key）**，不適合陣列。 → 會取出索引字串`"0"`,`"1"`,`"2"`
5. 範例（不建議，但常見誤用）
    
    ```js
    let arr = [10, 20, 30];
    for (let i in arr) {
      console.log(i); 
    }
    // 取出索引 "0"、"1"、"2"
    ```
    
6. 避免遍歷繼承屬性  →  若要只遍歷自有屬性，可結合 `hasOwnProperty`：
    
    ```js
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      // 處理 key
    }
    ```
    

### 四、for...of

1. 概念：`for...of` 用於**遍歷「可迭代物件（iterable）」的值（value）**。常用於**陣列、字串、Map、Set、arguments、TypedArray** 以及自訂的可迭代物件。
2. 語法：
    
    ```js
    for (let value of 可迭代物件) {
      // value 是每個元素的值
    }
    ```
    
3. 範例-陣列：
    
    ```js
    const arr = [10, 20, 30];
    for (let num of arr) {
      console.log(num);
    }
    // 10
    // 20
    // 30
    ```
    
4. 範例-字串：
    
    ```js
    for (let ch of 'Hi') {
      console.log(ch);
    }
    // H
    // i
    ```
    
5. 範例-Map：
    
    ```js
    const maps = new Map([[1, 'a'], [2, 'b']]);
    for (let [key, value] of maps) console.log(key, value);
    // 1 "a"
    // 2 "b"
    ```
    

### 五、for...in 與  for...of  的差別

1. `for...in` 取**鍵/索引**，`for...of` 取**值**。
2. `for...in` 適合**物件**屬性；`for...of` 適合**陣列、字串**
3. `for...of`無法直接用在一般物件
    
    ```js
    const obj = {a: 1, b: 2};
    for (let v of obj) { /* TypeError: obj is not iterable */ }
    ```
    
4. 若要遍歷物件的值，可搭配 `Object.keys()`、`Object.values()` 或 `Object.entries()`：
    
    ```js
    for (let key of Object.keys(obj)) console.log(key);
    for (let value of Object.values(obj)) console.log(value);
    for (let [key, value] of Object.entries(obj)) console.log(key, value);
    ```
    
5. `for...in` vs `for...of` 
    
    | 比較點 | for...in | for...of |
    | --- | --- | --- |
    | 迭代對象 | 物件 (Object) | 可迭代物件 (Array, String, Map, Set...) |
    | 取出 | key (屬性名稱或索引) | value (值本身) |
    | 用於陣列 |  取索引 (不建議) |  取值 (建議) |
    | 用於物件 |  可以 |  不行 |
    | 實務用途 | 物件屬性遍歷 | 陣列 / 字串迭代 |

### 六、四種迴圈比較

| 類型 | 適用對象 | 取出內容 | 是否可用於物件 | 常見用途 |
| --- | --- | --- | --- | --- |
| `while` | 任意條件 | 自定義 | 可（若條件設計得當） | 不確定次數的重複動作 |
| `for` | 數值控制 | 自定義 |  可（間接） | 固定次數的重複執行 |
| `for...in` | 物件 | 屬性名稱(key) | 可 | 讀取物件屬性 |
| `for...of` | 可迭代物件 | 值(value) | 非迭代物件 | 讀取陣列、字串、Set、Map 的值 |

### 參考資料

- [MDN - while](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/while)
- [MDN - for](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/for)
- [MDN - for...in](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/for...in)
- [MDN - for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
