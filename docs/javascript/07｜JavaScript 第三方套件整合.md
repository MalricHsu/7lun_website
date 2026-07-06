---
title: 07｜ JavaScript 第三方套件整合
sidebar_position: 8
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-10-24
slug: /docs/javascript/js-third-party-packages
---

- [課程講義](https://liberating-turtle-5a2.notion.site/JS-d0e3ec63b81a41d3838e52eb9db79266)
- [助教講義](https://chalk-freedom-ec6.notion.site/2966ab47eb48803ebb10ddedd35e55f2?source=copy_link)

### 一、C3.js 圖表套件

#### 1. 環境安裝與載入順序

- 實務上都會載入 CDN 或下載到專案本地端，以便控制版本。
- **步驟一**：載入 C3 CSS 樣式表。
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css">
  ```
- **步驟二**：載入 D3.js 與 C3.js（**注意載入順序**，C3.js 依賴 D3.js 的模組，故 D3.js 必須先載入）。
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
  ```

#### 2. C3.js 基礎使用範例

- 在 HTML 中建立圖表進入點：
  ```html
  <div id="chart"></div>
  ```
- 在 JavaScript 中進行圖表設定與生成：
  ```js
  const chart = c3.generate({    //  宣告 chart 變數並調用生成方法
    bindto: '#chart',            //  綁定 HTML 中的元素
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]                          //  存放圖表資料的陣列
    }
  });
  ```
- *進階設定參考*：[JS直播第五週範例一：C3.js Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/gbPzKeZ?editors=1010)

#### 3. 網頁開發常見第三方套件

- 開發網頁時常整合的套件類別：
  - **AJAX 請求**：`axios`
  - **圖表繪製**：`c3`、`d3`、`chart.js`
  - **分頁處理**：`pagination`
  - **輪播圖**：`swiper`
  - **地圖整合**：`leaflet`、`Google Maps API`
  - **動畫特效**：`aos`、`wow`、`gsap` (適合複雜的時間軸動畫控制)
  - **瀑布流版型**：`masonry`
  - **3D 視覺化**：`three.js`
  - **日曆/月曆**：`fullcalendar`
  - **時間格式處理**：`moment.js`、`dayjs`
  - **彈跳對話視窗**：`sweetalert2`
  - **表單驗證**：`validate.js`、`vee-validate`
  - **代碼風格檢查**：`eslint`
  - **多國語系**：`i18next`

### 二、資料處理（Object 靜態方法）

#### 1. 整合資料的重要性

- 使用第三方套件時，最具挑戰性的部分往往不是套件本身，而是**資料格式的整合**。
- 工程師的價值在於能夠將後端回傳的原始資料（Raw Data），整理成套件所要求的格式（如二維陣列或特定的鍵值對物件）。

#### 2. Object 屬性提取方法比較表

<table>
  <colgroup>
    <col width="20%" />
    <col width="25%" />
    <col width="30%" />
    <col width="25%" />
  </colgroup>
  <thead>
    <tr>
      <th>方法</th>
      <th>回傳內容</th>
      <th>回傳型態</th>
      <th>範例結果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Object.keys(obj)</code></td>
      <td>取得所有<strong>屬性名稱（key）</strong></td>
      <td>陣列 <code>[]</code></td>
      <td><code>["name", "age"]</code></td>
    </tr>
    <tr>
      <td><code>Object.values(obj)</code></td>
      <td>取得所有<strong>屬性值（value）</strong></td>
      <td>陣列 <code>[]</code></td>
      <td><code>["Tom", 25]</code></td>
    </tr>
    <tr>
      <td><code>Object.entries(obj)</code></td>
      <td>取得所有<strong>屬性鍵值對（key-value pair）</strong></td>
      <td>巢狀陣列 <code>[[key, value]]</code></td>
      <td><code>[["name", "Tom"], ["age", 25]]</code></td>
    </tr>
  </tbody>
</table>

#### 3. 語法與回傳格式

- 傳入一個物件，回傳一個陣列：

  ```js
  Object.keys(物件);
  Object.values(物件);
  Object.entries(物件);
  ```

#### 4. 屬性提取共同範例

- 同一個使用者物件的提取結果：

  ```js
  const user = {
    name: "Tom",
    age: 25,
    city: "Taipei"
  };

  console.log(Object.keys(user));
  //   ["name", "age", "city"]

  console.log(Object.values(user));
  //   ["Tom", 25, "Taipei"]

  console.log(Object.entries(user));
  //   [["name", "Tom"], ["age", 25], ["city", "Taipei"]]
  ```

#### 5. 各方法個別詳解與實務應用

- **`Object.keys()`**：
  ```js
  const car = { brand: "Tesla", model: "Model 3", year: 2025 };
  console.log(Object.keys(car)); 
  //   ["brand", "model", "year"]
  ```
  - **實務應用**：判斷物件是否為空物件：
    ```js
    const data = {};
    if (Object.keys(data).length === 0) {
      console.log("物件是空的");
    }
    ```

- **`Object.values()`**：
  ```js
  const product = { name: "Keyboard", price: 999, stock: 30 };
  console.log(Object.values(product));
  //   ["Keyboard", 999, 30]
  ```
  - **實務應用**：搭配 `reduce` 快速計算數值總和：
    ```js
    const scores = { Mary: 90, John: 80, Bob: 70 };
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    console.log(total);  //  240
    ```

- **`Object.entries()`**：
  ```js
  const fruit = { apple: 30, banana: 20, orange: 15 };
  console.log(Object.entries(fruit));
  //   [["apple", 30], ["banana", 20], ["orange", 15]]
  ```
  - **實務應用**：搭配陣列解構與 `for...of` 迴圈：
    ```js
    for (const [key, value] of Object.entries(fruit)) {
      console.log(`${key} 庫存：${value}`);
    }
    //   apple 庫存：30
    //   banana 庫存：20
    //   orange 庫存：15
    ```

#### 6. 實作練習一：累加計算地區數量

- 將原始資料依地區統計加總：
  - *練習連結*：[JS直播第五週範例二 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/azdGjoq?editors=0011)

  ```js
  let total = {};

  data.forEach((item) => {
    const area = item["區別"];
    if (!total[area]) {
      total[area] = 1;
    } else {
      total[area] += 1;
    }
  });

  console.log(total);
  //   {
  //     "鹽埕區": 13,
  //     "阿蓮區": 5,
  //     "路竹區": 20,
  //     "湖內區": 8,
  //     ...
  //   }
  ```

#### 7. 實作練習二：動態渲染地區人數列表

- 使用 `Object.keys` 或 `Object.entries` 處理並渲染：
  - *練習連結*：[JS直播第五週範例三-透過資料關聯，做物件取值 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/VYexBKg?editors=1011)

  ```js
  //   寫法一：使用 Object.keys
  const totalObj = { 高雄: 2, 台北: 1, 台中: 1 };
  const list = document.querySelector(".list");
  const array = Object.keys(totalObj);
  let str = "";

  array.forEach((item) => {
    console.log(`${item}有${totalObj[item]}人`);
    str += `<li>${item}有${totalObj[item]}人</li>`;
  });
  list.innerHTML = str;

  //   寫法二：使用 Object.entries (更簡潔)
  console.clear();
  let str2 = "";
  const numArr = Object.entries(totalObj);

  numArr.forEach((item) => {
    console.log(`${item[0]}有${item[1]}人`);
    str2 += `<li>${item[0]}有${item[1]}人</li>`;
  });
  list.innerHTML = str2;
  ```

#### 8. 實作練習三：轉換為物件陣列

- 將 `{高雄: 2, 台北: 1}` 轉換為 `[{area: "高雄", num: 2}]`：
  - *練習連結*：[JS直播第五週範例四-重組陣列資料 I Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/ZYQojKa?editors=0011)

  ```js
  const totalObj = { 高雄: 2, 台北: 1, 台中: 1 };
  let numArr = Object.keys(totalObj);
  let numObj = [];

  numArr.forEach((item) => {
    numObj.push({
      area: item,
      num: totalObj[item]
    });
  });
  console.log(numObj);
  ```

#### 9. 實作練習四：轉換為雙維度鍵值對陣列

- 將物件屬性轉換為 C3.js 或其他套件常用的二維陣列形式：
  - *練習連結*：[JS直播第五週範例五-重組陣列資料 II-為 C3.js 所用 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/GgodBBp?editors=1111)

  ```js
  const totalObj = { 高雄: 2, 台北: 1, 台中: 1 };
  const totalArr = Object.entries(totalObj);
  const newArr = [];

  totalArr.forEach((item) => {
    newArr.push([item[0], item[1]]);
  });

  console.log(newArr);
  //   [["高雄", 2], ["台北", 1], ["台中", 1]]
  ```



### 三、延伸實作：串接打卡資料並使用 C3.js 繪製折線圖

- 實作題連結：[JS直播第五週實作題：串接每日任務打卡資料 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/EaPLpGO?editors=1011)

#### 1. 實作程式碼

- **HTML**：
  ```html
  <h2>串接每日任務打卡資料</h2>
  <div id="chart"></div>
  ```

- **JavaScript**：
  ```js
  let data = {};
  const url = "https://raw.githubusercontent.com/hexschool/js-training/refs/heads/main/2025-checkin-data.json";

  //   發送 axios 請求並渲染圖表
  axios.get(url).then((res) => {
    data = res.data.stats;
    getDate(data);
    getCount(data);
    renderChart();
  });

  //   取出時間軸資料
  function getDate(data) {
    let DateArray = ["x"];
    data.forEach((item) => {
      DateArray.push(item.date);
    });
    return DateArray;
  }

  //   取出每日打卡次數資料
  function getCount(data) {
    let CountArray = ["每日打卡數"];
    data.forEach((item) => {
      CountArray.push(item.count);
    });
    return CountArray;
  }

  //   配置並渲染 C3 圖表
  function renderChart() {
    const chart = c3.generate({
      bindto: "#chart",
      data: {
        x: "x",
        columns: [getDate(data), getCount(data)]
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%Y-%m-%d"
          }
        }
      }
    });
  }
  ```

---

### 四、參考資料

- [C3.js 官方 Getting Started 指南](https://c3js.org/gettingstarted.html)
- [MDN Object.keys() 文件](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)