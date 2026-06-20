---
title: 04｜ JavaScript 函式設計
sidebar_position: 5
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-10-03
---

- [課程講義](https://liberating-turtle-5a2.notion.site/16977469126b416598ade83af8d9df17)
- [助教講義](https://chalk-freedom-ec6.notion.site/27a6ab47eb4880d6bf11d72de65cf6ff)

### 一、函式 (Function)

- **函式**：是一段可重複使用的程式碼，能夠 **接收輸入、處理資料、回傳結果**。

- 一個函式本身就是一段 JavaScript 程序，包含用於執行某一個任務或計算的語法。**要呼叫某一個函式之前，你必需先在這個函式欲執行的 scope 中定義它**。

#### 1. 功能
- 函式的名稱。
- 包圍在括號 `()` 中，並由逗號區隔的參數列表。
- 包圍在大括號 `{}` 中，用於定義函式功能的 JavaScript 語句。

#### 2. 函式語法

```js
//   函式宣告
function 函式名稱() {
  console.log('函式');
}
//   函式呼叫（執行）
函式名稱();

//   範例
function callNum() {
  console.log('呼叫一號');
}
callNum();
```

#### 3. 函式參數（Parameters）
- **定義**：參數是函式宣告時設定的變數，用來 **接收外部傳入的資料**。
- **功能**：**作為函式與外部環境溝通的管道**，讓函式能處理不同的資料，提升彈性。

```js
//   單一參數
function greet(name) {
  return `Hello, ${name} !`;
}
console.log(greet("Tom"));  //  Hello, Tom!
console.log(greet("Amy"));  //  Hello, Amy!

//   多個參數
function sum(a, b) {
  return a + b;
}
console.log(sum(3, 5));  //  8
console.log(sum(10, 20));  //  30
```

#### 4. `return` 和 `console.log` 功能及差異
- **`return`**
  - **定義**：用來 **從函式中回傳值給外部**。
  - **作用**：
    - 將計算結果或資料傳出函式。
    - **結束函式執行（`return` 後函式不再繼續執行）**。
    - `return` 的結果可以 **存入變數、作為其他運算或傳給其他函式使用**。

    ```js
    function sum(a, b) {
      return a + b;  //  回傳結果給外部
    }

    let result = sum(3, 5);
    console.log(result);  //  8
    ```

- **`console.log`**
  - **定義**：用來 **在控制台顯示訊息**。
  - **作用**：
    - 幫助開發者檢查資料或程式執行狀態。
    - **只輸出，不會傳回值**。

    ```js
    function sum(a, b) {
      console.log(a + b);  //  印出結果，但不回傳
    }

    let result = sum(3, 5);
    console.log(result);  //  undefined
    ```

#### 5. 差別整理

| 功能 | return | console.log |
| --- | --- | --- |
| **作用** | **回傳值給外部** | **在控制台印出訊息** |
| **使用場合** | 需要函式結果、計算、傳值 | 調試、檢查資料 |
| **是否改變輸出** | **可以，函式有回傳值** | **不會，函式仍回傳 undefined** |
| **可用於其他運算** | **可以** | **不可以** |

#### 6. if 與 function 結合使用
- **直接寫 if 的話，Js 裡只會執行一次**。

  ```js
  function addNum(num1, num2) {
    if (2 > 1) {
      return num1 + num2;  //  如果 2>1 為真值，就回傳此結果，後續程式都不會跑
    } else {
      return 100;
    }
  }
  addNum(1, 2);  //  3
  ```

#### 7. 課堂練習

```js
const bmiStatesData = {
  overThin: {
    state: "過輕",
    color: "藍色"
  },
  normal: {
    state: "正常",
    color: "紅色"
  }
};
//   input
checkBmiStates("overThin");
checkBmiStates("normal");


function checkBmiStates(status) {
  return `你的體重${bmiStatesData[status].state}，指數為${bmiStatesData[status].state}`;
}

console.log(checkBmiStates("overThin"));
console.log(checkBmiStates("normal"));

//   output
//   你的體重過輕，指數為藍色
//   你的體重正常，指數為紅色
```

### 二、延伸：傳統函式與箭頭函式的差異

#### 1. 傳統函式 (Traditional Function) vs 箭頭函式 (Arrow Function)

| 特性 | 傳統函式 (Traditional Function) | 箭頭函式 (Arrow Function) |
| --- | --- | --- |
| **定義方式** | 使用 `function` 關鍵字 | 使用 `=>` 箭頭語法 |
| **this** | 動態綁定，依呼叫方式而定 | 靜態綁定，指向函式定義時的外層作用域 |
| **arguments 物件** | 有，可存取所有傳入參數 | 沒有，需用剩餘參數 `...args` |
| **能否作為建構式** | 可用 `new` 建立物件 | 不能用作建構式 |
| **語法簡潔度** | 一般，較長 | 簡短，適合小函式或回呼 |
| **適用場合** | 需要動態 `this`、建構子、或複雜邏輯 | 小型函式、回呼函式、保留外層 `this` |

#### 2. 語法差異

```js
//   傳統函式
function add(a, b) {
  return a + b;  //  return 明確寫出
}

//   箭頭函式
const addArrow = (a, b) => a + b;
//   如果函式只有一個表達式，會自動 return
```

#### 3. this 綁定

```js
const obj = {
  name: "Alice",
  greetTraditional: function() {
    console.log(this.name);
    //   傳統函式的 this 指向呼叫者 obj
  },
  greetArrow: () => {
    console.log(this.name);
    //   箭頭函式的 this 綁定外層（這裡是全域），所以 undefined
  }
};

obj.greetTraditional();  //  Alice
obj.greetArrow();  //  undefined
```

#### 4. arguments 物件
- **`arguments`** 是 **傳統函式（function）內部自動生成的一個類陣列物件（array-like object）**，用來存取函式 **呼叫時傳入的所有參數**。
  - 只存在傳統函式內。
  - 類陣列：有索引和 `length`，但不是完整的 Array，不能直接使用 Array 的方法。
  - 包含函式呼叫時傳入的所有參數。
- **剩餘參數** 是 **ES6 提供的語法**，**用來將函式中不確定數量的參數收集成一個真正的陣列**。
  - 可以取代 `arguments` ：適用於箭頭函式或傳統函式。
  - 是一個真正的 Array：可以使用所有 Array 方法。
  - 必須放在最後一個參數：一個函式只能有一個剩餘參數。

```js
//   傳統函式
function sumTraditional() {
  console.log(arguments);
}
sumTraditional(1, 2, 3);  //  [1, 2, 3]

//   箭頭函式沒有 arguments，需要用剩餘參數 ...args
const sumArrow = (...args) => {
  console.log(args);
};
sumArrow(1, 2, 3);  //  [1, 2, 3]
```

#### 5. 建構式使用
- **建構式（Constructor Function）：** 在 JavaScript 中，**建構式是一種特殊用法的函式，通常用來「建立物件的模板」**。配合 `new` 關鍵字使用時，會 **自動建立並回傳一個新物件**。
- 使用規則：
  - **函式名稱通常首字母大寫**（慣例，方便辨識是建構式）。
  - **呼叫時要搭配 `new`**，否則只是一般函式。
  - **在函式內使用 `this`**，`this` 會指向新建立的物件。

### 三、參考資料
- [MDN Functions Guide](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)