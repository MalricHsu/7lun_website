---
title: 03｜JavaScript 陣列與物件資料處理
sidebar_position: 4
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-10-01
---

- [課程講義](https://liberating-turtle-5a2.notion.site/1fa913ef20fb4689bbcf12f48fea2b97)

### 一、陣列 Array

- 陣列是一種可以**存放多個值的容器**，這些值可以是任意型別（數字、字串、布林值、物件、甚至其他陣列）。
- JavaScript 中的 **`Array`** 全域物件被用於建構陣列；陣列為高階（high-level）、似列表（list-like）的物件。

#### 1. 陣列寫法

- 定義陣列與指定位置賦值：

  ```js
  let fruits = ["apple", "banana", "cherry"];
  console.log(fruits);  //  ["apple", "banana", "cherry"]

  //   指定位置賦予值
  fruits[5] = "grava";  //  ["apple", "banana", "cherry", "undefined", "grava"]
  ```

#### 2. 陣列屬性

- 長度與索引：

  ```js
  //   長度 (Length)：陣列中元素的數量
  console.log(fruits.length);  //  3

  //   索引 (Index)：陣列中每個元素都有一個位置編號，從 0 開始
  console.log(fruits[0]);  //  "apple"
  console.log(fruits[2]);  //  "cherry"

  //   取得陣列最後一個值
  fruits[fruits.length - 1];  //  "cherry"
  ```

#### 3. 陣列方法（新增、刪除）

- 新增與刪除元素：

  ```js
  let arr = [1, 2, 3];

  //   增加元素
  //   push() -> 在最後面加
  arr.push(4);
  console.log(arr);  //  [1, 2, 3, 4]

  //   unshift() -> 在最前面加
  arr.unshift(0);
  console.log(arr);  //  [0, 1, 2, 3, 4]

  //   刪除元素
  //   pop() -> 刪除最後面
  arr.pop();
  console.log(arr);  //  [0, 1, 2, 3]

  //   shift() -> 刪除最前面
  arr.shift();
  console.log(arr);  //  [1, 2, 3]

  //   增加或刪除元素
  //   splice() -> 指定位置新增/刪除/取代元素
  arr.splice(2, 1, "a");  //  在索引第 2 個後面刪除 1 個元素，並新增 "a" 元素
  console.log(arr);  //  [1, 2, "a"]
  ```

#### 4. `push` 的使用方法

- `push()` 方法會添加一個 or 多個元素至陣列的末端，並且回傳陣列的新長度。

  ```js
  const data = [];
  console.log(data.push('hi'));  //  1
  console.log(data);  //  ["hi"]
  ```

#### 5. 陣列常見方法

- **查詢元素**：
  ```js
  let arr = ["apple", "banana", "cherry", "banana"];

  //   indexOf() -> 找元素位置，找不到回傳 -1
  console.log(arr.indexOf("banana"));  //  1
  console.log(arr.indexOf("orange"));  //  -1

  //   includes() -> 是否存在元素
  console.log(arr.includes("cherry"));  //  true
  console.log(arr.includes("grape"));   //  false

  //   find() -> 找符合條件的第一個元素
  let firstLong = arr.find(fruit => fruit.length > 5);  //  尋找陣列中第一個大於五個字的元素
  console.log(firstLong);  //  "banana"

  //   findIndex() -> 找符合條件的第一個索引
  let firstLongIndex = arr.findIndex(fruit => fruit.length > 5);  //  尋找陣列中第一個大於五個字的索引
  console.log(firstLongIndex);  //  1
  ```

- **轉換陣列**：
  ```js
  let arr2 = ["red", "blue", "green"];

  //   join() -> 陣列變字串
  console.log(arr2.join("-"));  //  "red-blue-green"

  //   toString() -> 陣列變字串
  console.log(arr2.toString());  //  "red,blue,green"

  //   split() -> 字串變陣列（此為字串方法）
  let str = "a,b,c";
  let arrFromStr = str.split(",");
  console.log(arrFromStr);  //  ["a", "b", "c"]
  ```

- **迭代與處理元素**：
  ```js
  let nums = [1, 2, 3, 4, 5];

  //   forEach() -> 逐一操作元素，不會回傳（可用於陣列內的值累加）
  nums.forEach(n => console.log(n * 2));  //  2 4 6 8 10

  //   map() -> 逐一操作元素，並回傳新陣列
  let doubled = nums.map(n => n * 2);
  console.log(doubled);  //  [2, 4, 6, 8, 10]

  //   filter() -> 過濾並回傳符合條件的元素組成之新陣列
  let even = nums.filter(n => n % 2 === 0);
  console.log(even);  //  [2, 4]

  //   reduce() -> 累加或累計結果
  let sum = nums.reduce((acc, n) => acc + n, 0);
  console.log(sum);  //  15

  //   some() -> 檢查是否有任一元素符合條件
  console.log(nums.some(n => n > 3));  //  true

  //   every() -> 檢查是否全部元素符合條件
  console.log(nums.every(n => n > 0));  //  true
  ```

- **排序與翻轉**：
  ```js
  let arr3 = [3, 1, 4, 2];

  //   sort() -> 排序 
  arr3.sort((a, b) => a - b);  //  由小到大
  console.log(arr3);  //  [1, 2, 3, 4]
  arr3.sort((a, b) => b - a);  //  由大到小
  console.log(arr3);  //  [4, 3, 2, 1]

  //   reverse() -> 翻轉陣列
  arr3.reverse();
  console.log(arr3);  //  [1, 2, 3, 4]
  ```

- **複製與合併**：
  ```js
  let arr4 = [1, 2, 3];
  let arr5 = [4, 5, 6];

  //   slice() -> 複製一段陣列，不改原陣列
  let subArr = arr4.slice(1, 3);
  console.log(subArr);  //  [2, 3]

  //   concat() → 合併陣列
  let combined = arr4.concat(arr5);
  console.log(combined);  //  [1, 2, 3, 4, 5, 6]
  ```


### 二、物件 (Object)

- 物件是一種**用來存放多個資料的容器**，資料以 **「鍵（key）–值（value）」** 配對的形式存在，可以用來描述「一個實體的屬性與功能」。
- 物件是一批 **相關的數據** 或者 **功能**（通常包含了幾個變數及函式，當它們包含在物件中時被稱做「屬性」（properties）或「函式」（methods））。

#### 1. 物件寫法

- 宣告物件範例：

  ```js
  let person = {
    name: "Tom",
    age: 18,
    isStudent: true
  };
  ```

#### 2. 物件取值及新增物件

- 讀取、修改、新增與刪除屬性：

  ```js
  let person = { name: "Tom", age: 18 };

  //   讀取
  console.log(person.name);    //  "Tom"
  console.log(person["age"]);  //  18

  //   修改
  person.age = 19;
  person["name"] = "Jerry";
  console.log(person);  //  { name: "Jerry", age: 19 }

  //   新增屬性
  person.gender = "male";
  console.log(person);  //  { name: "Jerry", age: 19, gender: "male" }

  //   刪除屬性
  delete person.age;
  console.log(person);  //  { name: "Jerry", gender: "male" }
  ```

#### 3. 物件屬性存取方法

- 屬性存取方式比較表：

  | 存取方式 | 語法 | 適用情況 | 範例 |
  | ---   | --- | --- | --- |
  | **點記法 `.`** | `obj.key` | 屬性名稱**固定、合法識別字**（字母、數字、_，不能數字開頭） | `person.name` → "Tom" |
  | **方括號 `[]`** | `obj["key"]` | 屬性名稱包含**空格、特殊字元、數字開頭，或用字串** | `person["home city"]` → "Taipei" |
  | **變數動態存取** | `obj[varName]` | 屬性名稱存在於變數中，需要動態讀取或設定 | `let key = "score"; person[key] = 100;` → 新增 `score` 屬性 |

- 各存取方式之程式碼範例：

  ```js
  let person = {
    name: "Tom",
    age: 18,
    "home city": "Taipei",
    1: "one"
  };

  //   點記法存取
  console.log(person.name);  //  Tom
  person.gender = "male";    //  新增 gender 屬性

  //   方括號存取（適合特殊屬性名稱，需要加單或雙引號）
  console.log(person["home city"]);  //  Taipei
  console.log(person[1]);            //  "one"
  person["score"] = 100;             //  新增 score 屬性

  //   變數動態存取
  let key = "hobby";
  person[key] = "reading";           //  新增 hobby 屬性
  console.log(person[key]);          //  reading

  //   課程範例說明
  const obj = { myName: 'yinmin' };
  let name = 'myName';
  console.log(obj[name]);  //  'yinmin'
  //   name 是變數，值是 "myName"
  //   等同於 obj["myName"] -> 取得 "yinmin"
  //   重點：方括號內可以是變數或字串，會去對應物件中尋找符合屬性
  ```

#### 4. 物件迭代（for...in）

- `for...in` 迭代的是鍵（key），**鍵永遠是字串**。
- 迭代取到的值 (`obj[key]`) **保持原本**型別，**不會因為迭代而改變型別**。

  ```js
  //   遍歷物件鍵值說明
  for (let key in obj) {
    //   key 會依序取得物件的每個屬性名稱
    console.log(key, obj[key]);  //  key 為每次迴圈的屬性名稱（字串）; obj[key] 則是該鍵對應的值
  }

  //   實用舉例
  let person = {
    name: "Tom",
    age: 18,
    gender: "male"
  };

  for (let key in person) {
    console.log(key, person[key]);
  }
  //   name string      "Tom"
  //   age string        18
  //   gender string    "male"
  ```

### 三、陣列與物件的差別

- 陣列與物件屬性比較表：

  | 項目 | 陣列 Array | 物件 Object |
  | --- | --- | --- |
  | **用途** | 用來存放**有順序的資料集合** | 用來存**放鍵值對（key-value）的資料** |
  | **索引/鍵** | 使用**數字索引**（0, 1, 2...） | 使用字串或符號作為鍵 |
  | **順序** | **有順序**，可用索引訪問 | 無固定順序（ES6 之後大部分情況依照新增順序） |



### 四、陣列與物件使用時機

1. **陣列使用時機**：當資料需要使用`大量`且`同性質`的資料時。
2. **物件使用時機**：需要描述一個東西對應的各個特徵與行為時。

- 課程程式碼範例：

  ```js
  //   範例一：前鎮區有兩戶人家，第一戶爸爸叫 Tom、兒子叫 Mark，第二戶爸爸叫 John、兒子叫 Jack
  let data = [
    {
      fatherName: "Tom",
      sonName: "Mark"
    },
    {
      fatherName: "John",
      sonName: "Jack"
    }
  ];

  //   範例二：一個水果攤有 2 種水果，香蕉有 8 個，蘋果有 10 個
  let fruitStandData = [
    {
      fruitName: 'banana',
      num: 8
    },
    {
      fruitName: 'apple',
      num: 10
    }
  ];

  //   範例三：Mark 有間旅館，房型有單人房與雙人房，並提供游泳服務
  let hotelData = {
    items: [
      {
        normalDayPrice: 1380,
        holidayPrice: 1500,
        name: "單人房"
      },
      {
        normalDayPrice: 1380,
        holidayPrice: 1500,
        name: "雙人房"
      }
    ],
    swimming: true,
    boss: "Mark"
  };
  ```


### 五、陣列、物件與 JSON 整合運用

#### 1. JSON 基本概念

- **JSON**（JavaScript Object Notation）是一種**輕量級資料交換格式**。
- 用於**前後端或 API 之間傳遞資料**。
- **好處**：簡單、可讀性高、**容易轉換成 JavaScript 物件或陣列**。

  ```json
  {
    "name": "Tom",
    "age": 18,
    "hobbies": ["reading", "swimming"]
  }
  ```

  ```js
  let obj = JSON.parse(jsonString);  //  字串 轉 物件/陣列
  let jsonStr = JSON.stringify(obj);  //  物件/陣列 轉 字串
  ```

#### 2. 解析與操作 JSON

- 學會解析 JSON → 取得資料 → 放進陣列或物件 → 用 JavaScript 操作。
- 推薦輔助工具：**JSON Editor Online**，可以將得到的資料格式化並預覽。



### 六、延伸：物件淺拷貝與深拷貝

#### 1. 概念

| 名稱 | 概念 | 特性 |
| --- | --- | --- |
| **淺拷貝 (Shallow Copy)** | **只拷貝物件的第一層屬性** | 如果屬性**值是物件或陣列，仍然共用同一個參考地址** |
| **深拷貝 (Deep Copy)** | **拷貝整個物件（所有層級）** | 無論多少層，拷貝後完全獨立，修改不影響原物件 |

#### 2. 淺拷貝先備知識

- **`Object.assign()`**：將**一個或多個來源物件**的屬性，複製到**目標物件**。**只會複製第一層屬性，內層物件仍然共用參考**。

  ```js
  //   語法
  Object.assign(target, ...sources);  //  target為目標物件，sources可包含多個來源物件

  //   範例
  let obj1 = { a: 1, b: { c: 2 } };
  let obj2 = Object.assign({}, obj1);

  console.log(obj2);      //  { a: 1, b: { c: 2 } }

  //   修改第一層屬性
  obj2.a = 10;
  console.log(obj1.a);    //  1 -> 第一層屬性不共用
  console.log(obj2.a);    //  10

  //   修改第二層屬性
  obj2.b.c = 20;
  console.log(obj1.b.c);  //  20 -> 第二層物件共用
  ```

- **展開運算子 (`...`)**：用來**展開物件或陣列的所有可列舉屬性/元素**。對物件使用時，**也是一種淺拷貝**。

  ```js
  //   語法
  let newObj = { ...oldObj }; 

  //   範例
  let obj1 = { x: 1, y: { z: 2 } };
  let obj2 = { ...obj1 };

  console.log(obj2);      //  { x: 1, y: { z: 2 } }

  //   修改第一層屬性
  obj2.x = 10;
  console.log(obj1.x);    //  1 -> 第一層會被修改
  console.log(obj2.x);    //  10 

  //   修改第二層屬性
  obj2.y.z = 20;
  console.log(obj1.y.z);  //  20 -> 第二層共用
  ```

#### 3. 淺拷貝範例

- **淺拷貝只複製第一層**，**內部物件仍指向同一個參考地址**：

  ```js
  let original = { 
    name: "Tom",
    info: { age: 18, city: "Taipei" }
  };

  //   方法 1: Object.assign
  let shallow1 = Object.assign({}, original);

  //   方法 2: 展開運算子
  let shallow2 = { ...original };

  //   修改第一層屬性
  shallow1.name = "Amy";
  console.log(original.name);  //  "Tom" -> 第一層屬性互不影響

  //   修改第二層屬性
  shallow1.info.age = 20;
  console.log(original.info.age);  //  20 -> 第二層屬性共用同一個物件參考
  ```

#### 4. 深拷貝先備知識

- **`JSON.parse(JSON.stringify(obj))`** 是一種 **快速深拷貝（Deep Copy）** 的技巧。
- `JSON.stringify(obj)`：將物件或陣列 **轉成 JSON 字串**。
- `JSON.parse(jsonStr)`：將 JSON 字串 **轉回 JavaScript 物件，這個新的物件完全獨立於原物件**。

  ```js
  let obj = { name: "Tom", age: 18 };
  let jsonStr = JSON.stringify(obj);
  console.log(jsonStr);  //  '{"name":"Tom","age":18}'

  let newObj = JSON.parse(jsonStr);
  console.log(newObj);  //  { name: "Tom", age: 18 }
  ```

#### 5. 深拷貝範例

- **深拷貝會複製所有層級**，修改新物件完全不影響原物件：

  ```js
  let original = { 
    name: "Tom",
    info: { age: 18, city: "Taipei" }
  };

  //   JSON 方式深拷貝
  let deep1 = JSON.parse(JSON.stringify(original));

  //   修改第二層屬性
  deep1.info.age = 20;
  console.log(original.info.age);  //  18 -> 深拷貝後二者互不影響
  ```

#### 6. 淺拷貝 vs 深拷貝

  | 特性 | 淺拷貝 Shallow Copy | 深拷貝 Deep Copy |
  | --- | --- | --- |
  | **拷貝層級** | **只拷貝第一層** | **拷貝所有層級** |
  | **共用內部物件** | **會共用** | **不會共用** |
  | **常用方法** | `Object.assign({}, obj)` / `{ ...obj }` | `JSON.parse(JSON.stringify(obj))` / `structuredClone(obj)` |
  | **適用範圍** | 層級簡單的物件 | 多層物件或陣列需要完全獨立 |
  | **特性說明** | 快速，但內層物件仍共用同一參考 | 安全獨立，但需注意效能或特殊值（如函式、Symbol 無法用 JSON 方式複製） |



### 七、參考資料

- [MDN Array 文件](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN Array.prototype.push()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
- [MDN Object basics](https://developer.mozilla.org/zh-TW/docs/Learn_web_development/Core/Scripting/Object_basics)