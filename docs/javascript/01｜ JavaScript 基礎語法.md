---
title: 01｜ JavaScript 基礎語法
sidebar_position: 1
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-09-24
---

- [課程講義](https://liberating-turtle-5a2.notion.site/JavaScript-0ee8318f421f4ca0b855f26d5602cd77)

### 一、前言

- 前端三劍客：**HTML（架構）**、**CSS（樣式）**、**JavaScript（動態互動）**（前端三者共同讓網頁完整運作）
- JavaScript 運行地方：**瀏覽器**、**Node.js**

### 二、變數

- 在運作 JavaScript 時，我們需要定義變數，來儲存資料和進行運算

#### 1. 宣告變數語法

- `let`（可以重新賦值）、`const`（不可以重新賦值）、`var`（已不建議使用，但仍會在舊網站中看到）

  ```js
  let a = 1;        //    宣告 a，並賦予值 1
  ```

- 拆解：先 `let a;` → 後 `a = 1;`
- 宣告時需注意：

  ```js
  //   1. 宣告變數並且賦值
  let a = 1;
  console.log(a);  // 會顯示 1

  //   2. 只有宣告變數
  let b;
  console.log(b);  // 會顯示 undefined

  //   3. 沒有宣告變數，直接 console.log()
  console.log(c);  // 會顯示 is not defined
  ```

#### 2. 宣告變數須知

- 語意要清楚（讓其他人看到程式碼可以清楚了解）
- 小駝峰命名（例如：`className`）
- 以名詞命名為主（布林可以用 `is`、`has` 開頭）
- 不可以數字開頭
- 不可以符號開頭（`$`、`_` 除外）
- 不可使用 JS 保留字

#### 3. 變數做運算

- **算術運算子**：加 `+`、減 `-`、乘 `*`、除 `/`、取餘數 `%`
- **後綴（Postfix）**：先賦值後運算（實務上較常見）

  ```js
  let a = 1;
  let b = a++;
  //   拆解：
  //   先將 b 賦值 a => b = a = 1
  //   再將 a 做運算 => a = a + 1 => a = 2

  console.log(a, b);  //  2, 1
  ```

- **前綴（Prefix）**：先運算後賦值

  ```js
  let a = 1;
  let b = ++a;
  //   拆解：
  //   先將 a 做運算 a = a + 1 => 2
  //   再將 b 賦值 b = a = 2

  console.log(a, b);  //  2, 2
  ```

- **字串、數字、布林相加**

  ```js
  let a = 1;
  let b = "2";
  console.log(a + b);  //  "12" => typeof string

  let c = 3;
  let d = "4";
  console.log(c * d);  //  12 => typeof number

  let e = 5;
  let f = 6;
  console.log(e * f);  //  30 => typeof number

  let g = true;   //  1
  let h = false;  //  0
  console.log(g + h);  //  1 => typeof number
  ```

- **運算子的優先序（Operator Precedence）**
  - 參考：[MDN 文件](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Operator_precedence)
  - `*` 的優先序大於 `+`，所以會先執行 `*` 的計算，再執行 `+`
  - `==` 的優先序大於 `||`，所以會先執行 `==` 的比較，再執行 `||`

#### 4. 賦值運算子

- 賦值 `=`、加法賦值 `+=`、減法賦值 `-=`、乘法賦值 `*=`、除法賦值 `/=`、餘數賦值 `%=`

### 三、變數型別

- 分成兩種：**原始型別（Primitive Type）**、**物件型別（Object Type）**

#### 1. 原始型別

| 型別 | 說明 | 範例 |
| --- | --- | --- |
| `Number` | 數字 | `1`、`120` |
| `String` | 字串（前後引號需相同，統一用 `'單引號'` 或 `"雙引號"`） | `"Hello World"` |
| `Boolean` | 布林 | `true`、`false` |
| `Undefined` | 未定義（有宣告但未賦予值） | `undefined` |
| `Null` | 空值（有宣告有賦值但值被清空） | `null` |
| `Symbol` | 符號（ES6 新增） | — |
| `BigInt` | 大整數（ES6 新增） | — |


:::warning 

`typeof null` 會印出 `"object"`，這是 JS 官方認定的歷史錯誤，因更改會產生向下相容問題，所以一直保留。

:::

#### 2. 物件型別

- **Array 陣列**：一種**有順序的資料集合**，用來存放多個值，通常用來存放**相同屬性／性質**的資料

  ```js
  let colors = ["red", "blue", "green"];
  console.log(colors[1]);  //  "blue"

  //   可以使用索引的方式，將值從陣列中取出
  ```

- **Object 物件**：一種**以「鍵值對」（key-value pair）形式**儲存資料的結構

  ```js
  let car = {
    brand: "Toyota",
    year: 2020,
    owner: {
      name: "Bob",
      license: "AB1234",
    },
  };
  console.log(car.owner.name);  //  "Bob"
  ```

- 取值的方式：
  - **點記法**：變數後面加 `.`，再選擇 key，例如 `car.brand`
  - **中括號記法**：key 為數字或不符合識別字規則時，用 `["key"]` 取值，例如 `car["brand"]`

### 四、原始型別傳值 vs 物件型別傳址

#### 1. 原始型別傳值（Pass by Value）

- 將**原始值複製一份**，**放到新的記憶體上給新變數用**

  ```js
  let a = 1;
  let b = a;
  b = 2;

  console.log(a, b);  //  1, 2
  ```
  
   ![傳值](/img/js01-1.png)

#### 2. 物件型別傳址（Pass by Reference）

- 將**原變數參考的記憶體位置給到新變數**


  :::note

  需要注意是否有在**重新賦值**。

  :::


- **範例一：共用同一個參考**

  ```js
  let colorA = ["red", "blue", "green"];
  let colorB = colorA;
  colorB.push("black");

  console.log(colorA, colorB);
  //  ["red", "blue", "green", "black"]  ["red", "blue", "green", "black"]
  ```

  ![傳址](/img/js01-2.png)


- **範例二：重新賦值會斷開參考**

  ```js
  let colorA = ["red", "blue", "green"];
  let colorB = colorA;
  colorB = ["black"];  //  重新賦予新陣列

  console.log(colorA, colorB);
  //  ["red", "blue", "green"]  ["black"]
  ```

  ![傳址](/img/js01-3.png)



### 五、延伸：var、let、const 的差異

> Q：為什麼 `let`、`const` 要取代 `var`？`var` 有哪些缺點？

#### 1. 基本差異

| 關鍵字 | 範圍（Scope） | 可否重新賦值 | 可否重複宣告 | 提升（Hoisting） |
| --- | --- | --- | --- | --- |
| `var` | 函式範圍（Function Scope） | 可以 | 可以在同一範圍內重複宣告 | 會提升，自動初始化為 `undefined` |
| `let` | 區塊範圍（Block Scope） | 可以 | 不可以在同一區塊內重複宣告 | 會提升，但**不會初始化** |
| `const` | 區塊範圍（Block Scope） | 不可以 | 不可以 | 會提升，但**不會初始化** |

#### 2. 名詞解釋

| 名詞 | 說明 |
| --- | --- |
| **函式範圍（Function Scope）** | 變數的作用範圍**限定在整個函式內** |
| **區塊範圍（Block Scope）** | 變數的作用範圍限定在**最近的一對 `{}` 大括號內** |
| **提升（Hoisting）** | 在 JavaScript 執行程式碼之前，**所有的宣告（`var`、`function`）會被提升到它們所在作用域的最前面** |
| **暫時性死區（TDZ）** | 對於 `let` 和 `const`，變數雖然被「提升」到作用域頂端，但**在宣告前不能使用** |

#### 3. 範例說明

- **var 問題 1：作用域是函式範圍**，容易導致變數意外「洩漏」到外層

  ```js
  if (true) {
    var x = 10;
  }
  console.log(x);  //  10 —— 這個 x 在 if 外也能用！
  ```

- **let / const 解決：區塊範圍**

  ```js
  if (true) {
    let y = 20;
    const z = 30;
  }
  console.log(y);  //  ReferenceError: y is not defined
  console.log(z);  //  ReferenceError: z is not defined
  ```

- **var 問題 2：可以重複宣告**

  ```js
  var a = 1;
  var a = 2;
  console.log(a);  //  2
  ```

- **let / const 解決：不能重複宣告**

  ```js
  let b = 1;
  let b = 2;
  //  SyntaxError: Identifier 'b' has already been declared
  ```

- **var 問題 3：提升（Hoisting）會自動初始化為 `undefined`**

  ```js
  console.log(c);
  var c = 5;
  //  undefined
  ```

- **let / const 解決：暫時性死區（TDZ），宣告前不能使用**

  ```js
  console.log(d);
  let d = 5;
  //  ReferenceError: Cannot access 'd' before initialization
  ```