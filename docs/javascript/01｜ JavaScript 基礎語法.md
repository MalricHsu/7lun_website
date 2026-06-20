---
title: 01｜ JavaScript 基礎語法
sidebar_position: 1
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-09-24
---

一、前端三劍客：**HTML（架構）**、**CSS（樣式）**、**JavaScript（動態互動）** ⇒ 共同讓網頁完整運作

二、JavaScript運行地方 ：**瀏覽器**、Node.js

三、變數：在運作JavaScript時，我們需要定義變數，來儲存資料和進行運算

1. 宣告變數語法：let（可以重新賦值）、const（不可以重新賦值）、var

```jsx
let a = 1 // 宣告a，並賦予值1

// 拆解
先 let a;
後 a = 1;

// 宣告時需注意

1. 宣告變數並且賦值
let a = 1 ;
console.log(a); // 會顯示 1

2. 只有宣告變數
let b ;
console.log(b); // 會顯示 undefined

3. 沒有宣告變數，直接console.log()
console.log(c); // 會顯示 is not defined
```

1. 宣告變數須知：
    1. 語意要清楚（讓其他人看到程式碼可以清楚了解）
    2. 小駝峰命名（例如：className）
    3. 以名詞命名為主（布林可以已is、has開頭）
    4. 不可以數字開頭
    5. 不可以符號開頭（$、＿除外）
    6. 不可使用JS保留字
2. 變數做運算
    1. 加 `+`、減 `-`、乘 `*`、除 `/`、取餘數 `%`
    
    ```jsx
    //後綴 先賦值後運算(實務上較常見)
    
    let a = 1 ; 
    let b = a++ ;
    //拆解
    先將b賦值a => b = a = 1
    再將a做運算 => a = a+1 => a=2
    
    console.log(a,b) // 2,1
    
    //前綴 先運算後賦值
    
    let a = 1 ; 
    let b = ++a;
    //拆解
    先將a做運算 a = a+1 => 2
    再將b賦值 b = a = 2
    
    console.log(a,b) // 2,2
    ```
    
    b. 字串、數字、布林相加：
    
    ```jsx
    let a = 1;
    let b = "2";
    console.log(a+b); // "12" => typeof string 
    
    let c = 3;
    let d = "4";
    console.log(a*b); // 12 => typeof number 
    
    let e = 5;
    let f = 6;
    console.log(e*f); // 30 => typeof number 
    
    let g = true;  // 1
    let h = false; // 0
    console.log(g+h); // 1 =>  typeof number 
    ```
    
    c. 運算子的優先序 Operator precedence (或稱優先性)：MDN 文件
    
    - `*` 運算子的優先序大於 `+` 運算子，所以會先執行 `*` 的計算，再執行 `+`。
    - `==` 運算子的優先序大於 `||` 運算子 ，所以會先執行 `==` 的比較，再執行 `||`。
3. **賦值運算子**
    1. 賦值 `=`、加法賦值`+=`、減法賦值`-=`、乘法賦值`*=`、除法賦值 `/=`、餘數賦值`%=`

四、變數型別

1. 分成兩種：**原始型別（Primitive Type）**、**物件型別（Object Type）**
2. 原始型別有：
    1. Number  數字  ⇒ 1、120
    2. String   字串 ⇒ “Hello World” ⇒ 需要注意：前後的引號需要相同，需統一為‘單引號’或“雙引號”
    3. Boolean  布林 ⇒ true、false 
    4. Undefined 未定義 ⇒ 有宣告但未賦予值
    5. Null 空值 ⇒ 有宣告有賦值但值被清空  ⇒ 需要注意：console.log(typeof null ) ⇒ 會印出 object的型別（因為JS官方認定的錯誤，更改會產生一些問題，所以會印出 object）
    6. Symbol 符號（ES6新增）
    7. BigInt 大整數（ES6新增）
3. 物件型別：
    1. Array  陣列 ⇒ 一種**有順序的資料集合**，用來存放多個值，通常用來存放**相同屬性/性質**的資料，方便管理 
    
    ```jsx
    let colors = ["red","blue","green"]
    console.log(colors[1]) => "blue"
    
    //可以使用索引的方式，將值從陣列中取出
    ```
    
    b. Object  物件 ⇒ 一種**以「鍵值對」（key-value pair）形式**儲存資料的結構
    
    ```jsx
    let car = {
      brand: "Toyota",
      year: 2020,
      owner: {
        name: "Bob",
        license: "AB1234"
      }
    };
    console.log(car.owner.name); //"Bob"
    
    //取值的方式
    
    1. 點計法: 在變數的後面加一個"."，再看看我們要哪一個值，選擇它的key 
    2. 中括號記法: 如果key為數字或不符合識別字規則，我們可以透過變數後面加上["key"],取出值
    ```
    

五、原始型別傳值 vs 物件型別傳址

1. **原始型別傳值**：將**原始值複製一份**，**放到新的記憶體上給新變數用**
    1. 程式碼
    
    ```jsx
    let a = 1;
    let b = a;
    b = 2
    
    console.log(a,b) // 1,2
    ```
    
    b. 圖解
    
    !截圖 2025-09-28 凌晨1.44.05.png
    
2. **物件型別傳址**：將**原變數參考的記憶體位置給到新變數 ⇒ 陷阱：需要注意是否有在重新賦值**
    
    ```jsx
    let colorA = ["red","blue","green"];
    let colorA = colorB;
    colorB.push("black")
    
    console.log(colorA,colorB) // ["red","blue","green","black"] ["red","blue","green","black"]
    ```
    
    1. 範例一
    
    b. 圖解
    
    !截圖 2025-09-28 凌晨1.44.33.png
    
    c. 範例二
    
    ```jsx
    let colorA = ["red","blue","green"];
    let colorB = colorA;
    colorB =["black"] //重新賦予新陣列
    
    console.log(colorA,colorB) // ["red","blue","green"] ["black"]
    ```
    
    d. 圖解