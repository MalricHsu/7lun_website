---
title: 05｜ JavaScript DOM 文件物件模型介紹
sidebar_position: 6
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-10-08
---

- [課程講義](https://liberating-turtle-5a2.notion.site/3f479ce9e35f40869a9962b7b803f38e)
- [助教講義](https://chalk-freedom-ec6.notion.site/2876ab47eb4880afad58f8c7d2cf4c16)

### 一、DOM (Document Object Model) 文件物件模型

- DOM 是瀏覽器把 **HTML 文件**解析成一個可以被程式操作的物件模型。
- **簡單說**：**DOM 就像是一棵樹（Tree）**，每個 **HTML 標籤**都是一個**節點（Node）**，程式**可以透過 JavaScript 操作**這些節點以動態改變網頁內容、樣式或結構。
- **MDN 定義**：將文件的結構（例如代表網頁的 HTML）表示在記憶體中，以此連接網頁到腳本或程式設計語言（通常是指 JavaScript）。

   ![DOM 節點樹狀圖](/img/js05-1.png)

#### 1. 常用的 DOM 方法與屬性

- 常見屬性與選取方法比較表：

  <table>
    <colgroup>
      <col style={{width: '20%'}} />
      <col style={{width: '50%'}} />
      <col style={{width: '30%'}} />
    </colgroup>
    <thead>
      <tr>
        <th>方法 / 屬性</th>
        <th>說明</th>
        <th>範例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>getElementById()</code></td>
        <td>透過 id 選取元素（HTMLCollection）</td>
        <td><code>document.getElementById('myDiv')</code></td>
      </tr>
      <tr>
        <td><code>getElementsByClassName()</code></td>
        <td>透過 class 選取元素集合（HTMLCollection）</td>
        <td><code>document.getElementsByClassName('item')</code></td>
      </tr>
      <tr>
        <td><code>getElementsByTagName()</code></td>
        <td>透過標籤選取元素集合（HTMLCollection）</td>
        <td><code>document.getElementsByTagName('p')</code></td>
      </tr>
      <tr>
        <td><code>querySelector()</code></td>
        <td>CSS 選擇器選取第一個元素</td>
        <td><code>document.querySelector('.item')</code></td>
      </tr>
      <tr>
        <td><code>querySelectorAll()</code></td>
        <td>CSS 選擇器選取<strong>所有</strong>符合元素（NodeList）</td>
        <td><code>document.querySelectorAll('div.item')</code></td>
      </tr>
      <tr>
        <td><code>innerHTML</code></td>
        <td>取得或修改 HTML 內容</td>
        <td><code>{"div.innerHTML = '<p>Hello</p>'"}</code></td>
      </tr>
      <tr>
        <td><code>textContent</code></td>
        <td>取得或修改文字內容</td>
        <td><code>div.textContent = 'Hello'</code></td>
      </tr>
      <tr>
        <td><code>style</code></td>
        <td>修改元素樣式</td>
        <td><code>div.style.color = 'red'</code></td>
      </tr>
      <tr>
        <td><code>classList</code></td>
        <td>操作 class</td>
        <td><code>div.classList.add('active')</code></td>
      </tr>
    </tbody>
  </table>

- **DOM 選取回傳類型範例圖**：
  - `getElementById()`：

    ![getElementById 回傳範例](/img/js05-2.png)

  - `getElementsByClassName()`：

    ![getElementsByClassName 回傳範例](/img/js05-3.png)

  - `getElementsByTagName()`：

    ![getElementsByTagName 回傳範例](/img/js05-4.png)

  - `querySelectorAll()`：

    ![querySelectorAll 回傳範例](/img/js05-5.png)

#### 2. NodeList 屬性與靜態/動態分類

- **NodeList** 是**一組節點（Node）的集合**，為 DOM 方法回傳的一種「類陣列物件（array-like）」。
- 常見回傳 NodeList 的方法：`document.querySelectorAll()`、`childNodes`。
- 包含：元素節點（Element nodes）、文字節點或註解節點。
- 特性：可以用索引取值、有 `length` 屬性、可迭代（可以使用 `for...of` 或 `forEach`）。

    ```js
    const nodes = document.querySelectorAll('p');
    console.log(nodes[0]);  //  第一個 <p> 元素

    console.log(nodes.length);

    nodes.forEach(node => {
      console.log(node.textContent);
    });
    ```

- **靜態 NodeList**：抓取時「拍一張快照」，**之後 DOM 怎麼變動，NodeList 內容不會跟著變動**。
  - `querySelectorAll` 只抓當下的節點快照，後續 DOM 變動不會影響它。

    ```html
    <body>
      <div id="container">
        <p>第一段</p>
        <p>第二段</p>
      </div>
    </body>
    ```

    ```js
    //   抓取 <p> 元素（靜態 NodeList）
    const staticList = document.querySelectorAll('#container p');
    console.log(staticList.length);  //  2

    //   在 DOM 中新增一個 <p>
    const newP = document.createElement('p');
    newP.textContent = '第三段';
    document.getElementById('container').appendChild(newP);

    console.log(staticList.length);  //  2 —— 不會變，因為是靜態 NodeList
    ```

- **動態 NodeList**：抓取時會「綁住 DOM」，**DOM 變動後，NodeList 會即時更新**。
  - `childNodes` 綁住 DOM，DOM 變動時 NodeList 自動更新。

    ```html
      <div id="container">
        <!-- 換行空白 -->
        <p>第一段</p>
        <!-- 換行空白 -->
        <p>第二段</p>
      <!-- 換行 -->
    </div>

    <button id="add">新增段落</button>
    ```

    ```js
    const container = document.getElementById('container');
    //   childNodes 取得的是 NodeList（動態）
    const dynamicList = container.childNodes;
    console.log(dynamicList.length);  //  5（包含文字節點，換行空白也算）

    //   新增按鈕事件
    document.getElementById('add').addEventListener('click', () => {
      const newP = document.createElement('p');
      newP.textContent = '新段落';
      container.appendChild(newP);

      console.log(dynamicList.length);  //  點一次 +1 -> NodeList 自動更新，具體值視換行空白與文字節點而定
      console.log(dynamicList);         //  可以看到新增的 <p> 節點
    });
    ```

- **NodeList 靜態 vs 動態比較**：

  | 特性 | 靜態 NodeList | 動態 NodeList |
  | --- | --- | --- |
  | **方法舉例** | `querySelectorAll` | `childNodes` |
  | **變動反映** | 不會 | 會即時更新 |
  | **用途** | 取得當下固定元素快照 | 隨時同步 DOM 的變化 |
  | **性能** | 較快，因為只是快照 | 稍慢，需要持續追蹤 DOM 變化 |

#### 3. HTMLCollection 屬性與特點

1. **HTMLCollection** 是一種類陣列（array-like）物件，用來**表示一組 HTML 元素節點**。
2. 常見回傳 HTMLCollection 的方法：`getElementById()`、`getElementsByClassName()`、`getElementsByTagName()`。
3. **只包含元素節點（Element nodes）**，不包含文字節點或註解節點。
4. 特性：可以用索引取值、有 `length` 屬性，且具有**動態更新**特性。

    ```html
    <div id="container">
      <p class="text">第一段</p>
      <p class="text">第二段</p>
    </div>
    ```

    ```js
    //   取得 class 為 text 的元素集合
    const collection = document.getElementsByClassName('text');

    console.log(collection.length);  //  2
    console.log(collection[0].textContent);  //  "第一段"

    //   動態更新
    const newP = document.createElement('p');
    newP.className = 'text';
    newP.textContent = '第三段';
    document.getElementById('container').appendChild(newP);

    console.log(collection.length);  //  3 -> 自動更新
    ```

#### 4. NodeList、HTMLCollection、Array 比較表

  | 特性 | NodeList（節點清單） | HTMLCollection（HTML集合） | Array（陣列） |
  | --- | --- | --- | --- |
  | **範例來源** | `querySelectorAll`、`childNodes` | `getElementsByTagName`、`getElementsByClassName` | 自定義或經由轉換所得 |
  | **類型** | 類陣列物件 | 類陣列物件 | 真正陣列 |
  | **靜態/動態** | 靜態 (`querySelectorAll`) 或 動態 (`childNodes`) | 動態（即時更新） | 靜態（內容不會與 DOM 自動同步） |
  | **可索引** | ✅ 可以用 `[0]`、`[1]` | ✅ 可以用 `[0]`、`[1]` | ✅ 可以用 `[0]`、`[1]` |
  | **length 屬性** | ✅ | ✅ | ✅ |
  | **forEach** | ✅（現代瀏覽器支援） | ❌（必須轉陣列才能使用 forEach） | ✅ |
  | **陣列方法** | ❌（必須轉為陣列） | ❌（必須轉為陣列） | ✅（可使用 map/filter 等） |
  | **轉陣列方法** | `Array.from(nodelist)` | `Array.from(htmlCollection)` | — |

#### 5. `textContent` 屬性與操作

- **特性**：
  - 只會處理文字節點，不包含 HTML 標籤。
  - 讀取時：取得元素及所有子元素內的文字。
  - 修改時：**會覆蓋原本內容**，包括子元素。
  - 特性：安全、效能佳。

    ```html
    <div id="demo1">
      Hello <span>World</span>!
    </div>
    ```

    ```js
    const div = document.getElementById('demo1');

    console.log(div.textContent);  //  "Hello World!"

    div.textContent = "新的文字內容";
    console.log(div.textContent);  //  "新的文字內容"
    //   原本的 <span> 標籤已被移除
    ```

#### 6. `innerHTML` 屬性與操作

- **特性**：
  - 讀取時：會包含內部的 HTML 標籤。
  - 修改時：可以插入並解析 HTML 結構。
  - 可以操作 HTML 結構，但需注意安全性（防範 XSS 跨網站指令碼攻擊）。

    ```html
    <div id="demo2">
      Hello <span>World</span>!
    </div>
    ```

    ```js
    const div2 = document.getElementById('demo2');

    console.log(div2.innerHTML);  //  "Hello <span>World</span>!"

    div2.innerHTML = "新的 <b>HTML</b> 內容";
    console.log(div2.innerHTML);  //  "新的 <b>HTML</b> 內容"
    //   <b> 標籤被解析並新增
    ```

#### 7. textContent vs innerHTML 差別比較

  | 屬性 | 取得內容 | 修改內容 | 是否保留 HTML 標籤 | 安全性 | 使用情境 |
  | --- | --- | --- | --- | --- | --- |
  | `textContent` | 只取文字 | 覆蓋文字，移除子元素 | 不保留標籤 | 高 | 僅修改純文字，避免注入 HTML |
  | `innerHTML` | 文字 + HTML | 覆蓋並解析 HTML 結構 | 保留標籤 | 中（需防範 XSS） | 需要插入 HTML 結構時 |

#### 8. 屬性與 Class 操作方法

- **`getAttribute()`**：取得 HTML 元素的屬性值。

  ```html
  <a id="link" href="https://example.com">點我</a>
  ```

  ```js
  const link = document.querySelector('#link');
  console.log(link.getAttribute('href'));  //  "https://example.com"
  ```

- **`setAttribute()`**：設定 HTML 元素的屬性值。

  ```html
  <a id="link">點我</a>
  ```

  ```js
  const link = document.querySelector('#link');
  link.setAttribute('href', 'https://openai.com');
  link.setAttribute('target', '_blank');  //  新增 target 屬性
  ```

- **`classList`**：方便操作元素的 `class` 屬性。
  - 提供多種方法操作 class，比直接改 `element.className` 更方便、直觀。

    | 方法 | 說明 | 範例 |
    | --- | --- | --- |
    | `add()` | 新增 class | `el.classList.add('active')` |
    | `remove()` | 移除 class | `el.classList.remove('hidden')` |
    | `toggle()` | 有該 class 就移除，沒有就新增 | `el.classList.toggle('open')` |
    | `contains()` | 檢查是否包含某 class | `el.classList.contains('active')` |
    | `replace()` | 替換 class | `el.classList.replace('old', 'new')` |

      ```html
      <div id="box" class="red"></div>
      ```

    ```js
      const box = document.querySelector('#box');

      box.classList.add('big');         //  class = "red big"
      box.classList.remove('red');      //  class = "big"
      box.classList.toggle('hidden');   //  class = "big hidden"
      console.log(box.classList.contains('big'));  //  true
    ```

#### 9. DOM 節點選取關係圖

- 節點選取補充說明圖（由六角助教提供）：

  ![DOM 節點選取補充圖 1](https://i.imgur.com/RrS6WV4.jpg)

  ![DOM 節點選取補充圖 2](https://i.imgur.com/uwRBkET.jpg)



### 二、JavaScript 的事件（Event）

- 事件是使用者與網頁互動時發生的事情（如點擊、滾動或鍵盤輸入）。
- 事件可以由使用者操作產生，或是來自 API 處理非同步任務所觸發。

#### 1. 常見的事件類型

- 使用者行為與事件名稱對照：

  | 使用者行為 | 對應事件名稱 |
  | --- | --- |
  | 點擊元素 | `click` |
  | 表單送出 | `submit` |
  | 輸入框改變 | `change` |
  | 網頁載入完成 | `load` |
  | 視窗滾動 | `scroll` |
  | 鍵盤按下 | `keydown` |
  | 鍵盤放開 | `keyup` |
  | 滑鼠移入元素 | `mouseover` |
  | 滑鼠移出元素 | `mouseout` |

#### 2. 使用方法（addEventListener）

- 監聽語法：

  ```js
  element.addEventListener(eventName, handler, useCapture);
  //   eventName: 事件名稱（字串）
  //   handler: 事件發生時執行的函式
  //   useCapture: 可省略，控制事件傳遞階段（true=捕獲階段，false=冒泡階段）
  ```

- 使用範例：

  ```js
  const btn = document.querySelector(".myBtn");
  btn.addEventListener("click", function () {
    alert("你按了一下");
  });
  ```

#### 3. event 物件常見屬性與方法

  | 屬性/方法名稱 | 功能 |
  | --- | --- |
  | `e.type` | 事件類型（如 `"click"`） |
  | `e.target` | 事件的目標元素（誰被點擊就指向誰） |
  | `e.currentTarget` | 當前執行事件的元素（監聽器綁定在哪個元素就指向誰） |
  | `e.preventDefault()` | 阻止預設行為（例如防止表單預設送出重新整理） |
  | `e.stopPropagation()` | 阻止事件冒泡（防止事件往外傳遞給父層） |

- 事件目標對比範例：

  ```html
  <div id="outer">
    <button id="inner">點我</button>
  </div>
  ```

  ```js
  const outer = document.getElementById("outer");
  outer.addEventListener("click", function (e) {
    console.log("target:", e.target);                  //  target: <button id="inner">點我</button>
    console.log("currentTarget:", e.currentTarget);    //  currentTarget: <div id="outer">...</div>
  });
  ```

#### 4. nodeName 屬性的用途與規則

- `nodeName` 是 DOM 節點的屬性，用來**回傳節點的大寫名稱**。
- 每個 DOM 節點都有一種類型，而 `nodeName` 會顯示其節點標籤大寫形式。

  ```html
  <div id="container">
    <p>Hello <strong>World</strong></p>
  </div>
  ```

  ```js
  const div = document.querySelector("#container");
  console.log(div.nodeName);  //  "DIV"

  const strong = div.querySelector("strong");
  console.log(strong.nodeName);  //  "STRONG"
  ```


### 三、陣列迭代方法 forEach

- `forEach` 是 Array 物件的方法，用來「逐一」**執行陣列中每個元素的動作**。

#### 1. 基本用法

- 巡覽陣列元素：

  ```js
  const array = [1, 2, 3, 4, 5];
  array.forEach(function(item) {
    console.log(item);
  });
  //   1
  //   2
  //   3
  //   4
  //   5
  ```

#### 2. 語法與參數說明

- `forEach` 參數配置：

  ```js
  array.forEach(function(元素值, 索引值, 原始陣列) {
    //   每次執行的動作
  });

  let data = [3, 30, 100];
  data.forEach(function(item, index, ary) {
    console.log(item, index, ary);
  });
  //   3 0 [3, 30, 100]
  //   30 1 [3, 30, 100]
  //   100 2 [3, 30, 100]
  ```

#### 3. 常見應用情境

- **數字累加**：

  ```js
  let data = [3, 30, 100];
  let total = 0;

  data.forEach(function(item) {
    total += item;
  });
  //   最後 total 為 133
  ```

- **物件陣列屬性累加**：

  ```js
  let data = [
    { num: 10 },
    { num: 30 },
    { num: 100 }
  ];

  let total = 0;
  data.forEach(function(item) {
    total += item.num;
  });
  //   最後 total 為 140
  ```

- **條件篩選與計數**：

  ```js
  let data = [
    { name: "Tom", gender: "male" },
    { name: "John", gender: "male" },
    { name: "Jerry", gender: "male" },
    { name: "Mary", gender: "female" },
    { name: "Jane", gender: "female" }
  ];

  let maleNum = 0;
  data.forEach((item) => {
    if (item.gender === "male") {
      maleNum += 1;
    }
  });
  console.log(`男生有 ${maleNum} 位`);  //  男生有 3 位
  ```



### 四、延伸：高階陣列方法

- 高階陣列方法是指以更高層次（通常以函式為基礎）來處理陣列的操作，取代傳統的 `for` 迴圈。

#### 1. 常見高階陣列方法比較表

  | 方法 | 功能 | 是否回傳新陣列 | 是否可中斷 | 常見用途 |
  | --- | --- | --- | --- | --- |
  | `forEach()` | 逐一執行動作 | 否 | 否 | 執行副作用（如：顯示、修改） |
  | `map()` | 轉換每個元素 | 是 | 否 | 資料轉換並產生新陣列 |
  | `filter()` | 過濾符合條件的元素 | 是 | 否 | 篩選資料並產生新陣列 |
  | `find()` | 找出第一個符合條件的元素 | 否（單一值） | 可中斷 | 搜尋單一資料 |
  | `some()` | 檢查是否「有任一」符合條件 | 否（回傳布林） | 可中斷 | 條件成立判斷 |
  | `every()` | 檢查是否「全部」符合條件 | 否（回傳布林） | 可中斷 | 全部驗證 |
  | `reduce()` | 累加或彙整成一個結果 | 否（回傳單一值） | 否 | 累計與統計 |
  | `sort()` | 排序（會改變原陣列） | 否 | 可中斷 | 排序資料 |

#### 2. 常見方法個別介紹與範例

- **`map()` — 轉換陣列**：
  ```js
  const nums = [1, 2, 3];
  const doubled = nums.map(num => num * 2);
  console.log(doubled);  //  [2, 4, 6]
  ```

- **`filter()` — 篩選資料**：
  ```js
  const nums = [1, 2, 3, 4, 5];
  const even = nums.filter(num => num % 2 === 0);
  console.log(even);  //  [2, 4]
  ```

- **`find()` — 找出第一個符合條件的元素**：
  ```js
  const users = [
    { name: 'Amy', age: 20 },
    { name: 'Bob', age: 30 }
  ];
  const result = users.find(user => user.age > 25);
  console.log(result);  //  { name: 'Bob', age: 30 }
  ```

- **`some()` & `every()` — 回傳布林值**：
  ```js
  const scores = [80, 90, 60];
  console.log(scores.some(s => s < 70));   //  true（任一元素低於 70）
  console.log(scores.every(e => e >= 60));  //  true（全部元素皆大於等於 60）
  ```

- **`reduce()` — 累加、彙整結果**：
  ```js
  const nums = [1, 2, 3, 4];
  const sum = nums.reduce((acc, cur) => acc + cur, 0);
  console.log(sum);  //  10
  ```

- **`sort()` — 排序（改變原陣列）**：
  ```js
  const nums = [3, 1, 4, 2];
  nums.sort((a, b) => a - b);
  console.log(nums);  //  [1, 2, 3, 4]
  ```


### 五、參考資料

- [Hexschool 期中試煉說明](https://hackmd.io/sYlcUD-wTimN0NsPrfGH1w)
- [MDN Document Object Model](https://developer.mozilla.org/zh-TW/docs/Web/API/Document_Object_Model)
- [MDN Event API](https://developer.mozilla.org/zh-TW/docs/Web/API/Event)
- [ES6 原生陣列方法介紹](https://www.casper.tw/javascript/2017/06/29/es6-native-array/)
