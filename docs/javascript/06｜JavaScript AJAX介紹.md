---
title: 06｜ JavaScript AJAX介紹
sidebar_position: 7
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-10-17
---

- [課程講義](https://liberating-turtle-5a2.notion.site/AJAX-5ccd9e611e4c4d0daaa586d7d5bdcb61)

### 一、網路請求（Network Request）

- 在 JavaScript 中，網路請求指的是**從前端（瀏覽器）發送請求到伺服器**，並取得或傳送資料的過程。

#### 1. HTTP 協議與請求規範

- 當 Client 端發送請求到伺服器時，必須遵守 HTTP 協議的規範，以確保請求能被伺服器正確處理並返回回應。
- **請求方法 (Request Methods)**：常見的 HTTP 方法如下：
  - `GET`：**從後端取得資料**，通常用於查詢或讀取資訊，不會變更伺服器上的資料。
  - `POST`：提交資料到後端，**通常用於建立新資源或提交表單資料**（資料包含在 Request Body 中）。
  - `PUT`：修改後端資料，用於**更新整筆資料**。
  - `PATCH`：修改後端資料，用於**更新資料裡的部分欄位內容**。
  - `DELETE`：刪除後端資料，用於**移除指定資源**。
- **狀態碼 (Status Code)**：用以判斷請求結果的狀態代碼：
  - **2XX 系列**：請求成功。
    - `200 OK`：請求成功。
    - `201 Created`：資源建立成功（常用於 POST、PUT 回應）。
  - **3XX 系列**：重新導向。
  - **4XX 系列**：客戶端錯誤。
    - `401 Unauthorized`：未取得授權（如未提供 token）。
    - `404 Not Found`：找不到資源（通常是路徑 URL 寫錯）。
  - **5XX 系列**：伺服器端錯誤。

#### 2. 客戶端與伺服器資料交換的過程

![網路請求交換流程](/img/截圖 2025-10-18 凌晨2.10.19.png)

- **以「進入 Google 頁面」為例**：

  ![Google首頁載入過程](/img/截圖 2025-10-18 凌晨2.13.44.png)

- **課程範例**：網頁載入時總共向伺服器發送 4 次資源請求：

  ```html
  <!DOCTYPE html>
  <html lang="ZH">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>2025JS直播</title>
    </head>
    <body>
      <img
        src="https://www.google.com.tw/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png"
        alt="google"
      />
      <h2>我是h2標籤</h2>
      <ul>
        <li>我是li喔</li>
      </ul>
      <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
      <script src="all.js"></script>
    </body>
  </html>
  ```

  ![網頁資源請求分析](/img/截圖 2025-10-18 下午4.17.09.png)

---

### 二、AJAX（Asynchronous JavaScript and XML）

- AJAX 即「非同步的 JavaScript 與 XML 技術」，是一種讓**網頁在不重新載入整個頁面**情況下，就能與伺服器交換資料並進行**局部更新**的技術。

#### 1. 同步與非同步概念

- **同步 (Synchronous)**：程式一行一行照順序執行。前一件事沒做完，後一件事就必須「等」。
  - *生活比喻*：排隊買飲料，前一位不結完帳，下一位就不能點。

  ```js
  console.log("A");
  console.log("B");
  console.log("C");
  //   輸出結果：
  //   A
  //   B
  //   C
  ```

  ![同步執行流程圖](/img/截圖 2025-10-18 下午3.56.54.png)

- **非同步 (Asynchronous)**：不需等待前一個任務完成即可繼續執行。耗時長的操作（如 API 請求）在背景執行，其他程式會先執行。
  - *生活比喻*：點飲料後拿號碼牌，在等待叫號時可以滑手機，不用乾等。

  ```js
  console.log("A");

  setTimeout(() => {
    console.log("B");
  }, 2000);

  console.log("C");
  //   輸出結果：
  //   A
  //   C
  //   B
  ```

  ![非同步執行流程圖](/img/截圖 2025-10-18 下午3.59.00.png)

  :::tip 非同步的優缺點
  - **優點**：程式執行不會互相卡住，網頁載入體驗更好。
  - **缺點**：有時難以預期哪一個非同步操作會先完成，需要特別的語法來控制流程。
  :::

#### 2. AJAX 的三種實作方式

- 任何在背景透過 **JavaScript 非同步交換資料** 的方式皆統稱為 AJAX。

  ```
  AJAX（非同步資料交換）
  │
  ├─ XMLHttpRequest（早期寫法）
  │
  ├─ Fetch API（現代原生標準）
  │
  └─ Axios（第三方封裝套件）
  ```

- **XMLHttpRequest**：最原始、傳統的 AJAX 寫法。

  ```js
  //   1. 建立連線物件
  const xhr = new XMLHttpRequest();
  
  //   2. 設定請求方法與目標 URL
  xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
  
  //   3. 設定資料載入完成時的回呼函式
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);  //  伺服器回傳的是字串，需手動解析為 JSON 物件
      console.log("XMLHttpRequest 回傳：", data);
    } else {
      console.log("發生錯誤，狀態碼：", xhr.status);
    }
  };
  
  //   4. 發送請求
  xhr.send();
  ```
  - 🟢 **優點**：相容性最廣，幾乎所有瀏覽器都支援。
  - 🔴 **缺點**：語法繁瑣，且需手動轉換與解析 JSON 資料。

- **Fetch API**：ES6 推出的瀏覽器原生標準方式，基於 Promise 設計。

  ```js
  fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(response => {
      if (!response.ok) throw new Error("網路錯誤");
      return response.json();  //  自動將資料解析為 JSON
    })
    .then(data => console.log("Fetch 回傳：", data))
    .catch(error => console.log("錯誤：", error));
  ```
  - 🟢 **優點**：語法簡潔、原生支援 Promise 鏈式寫法。
  - 🔴 **缺點**：不會自動對 HTTP 404 或 500 錯誤進行 `reject`，需要額外手動判斷 `response.ok`。

- **Axios**：目前實務上最受歡迎的第三方封裝套件，語法直覺且功能強大。
  - 需先載入 Axios CDN 連結：
    ```html
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    ```
  - 發送 GET 請求範例：
    ```js
    axios.get("https://jsonplaceholder.typicode.com/posts/1")
      .then(res => {
        console.log("回傳：", res.data);
      })
      .catch(err => {
        console.log("錯誤：", err);
      });
    ```
  - 🟢 **優點**：自動進行 JSON 轉換、預設拋出 HTTP 錯誤碼、支援 `async/await`，並且提供攔截器（Interceptors）等進階設定。
  - 🔴 **缺點**：非瀏覽器原生，需額外載入套件檔案。

#### 3. 課程實作範例（AJAX + forEach + innerHTML）

- 從政府 Open Data 取得環保標章商店資料，並動態渲染至網頁畫面上：

  ```js
  const list = document.querySelector(".list");
  const url = "https://data.moenv.gov.tw/api/v2/gp_p_01?api_key=e75b1660-e564-4107-aad5-a8be1f905dd9&limit=1000&sort=ImportDate%20desc&format=JSON";

  let greenStore = [];

  //   發送 axios 請求
  axios.get(url).then((res) => {
    greenStore = res.data.records;
    renderData();
  });

  //   渲染畫面
  function renderData() {
    let template = "";
    greenStore.forEach((store) => {
      template += `<li>${store.storename}</li>`;
    });
    list.innerHTML = template;
  }
  ```

---

### 三、延伸：非同步處理的演進（Callback → Promise → Async/Await）

#### 1. Callback（回呼函式）

- **概念**：在早期的 JavaScript 中，非同步操作都是靠傳入「回呼函式（Callback）」來處理的。當背景任務完成後，才去執行該回呼函式。

  ```js
  function getData(callback) {
    setTimeout(() => {
      console.log("資料取得完成");
      callback("這是伺服器回傳的資料");
    }, 1000);
  }

  getData((data) => {
    console.log("收到資料：", data);
  });

  //   執行順序：
  //   1. 呼叫 getData() -> 在背景等待 1 秒。
  //   2. 1 秒後印出「資料取得完成」，並執行 callback()。
  //   3. callback() 印出「收到資料：這是伺服器回傳的資料」。
  ```

- **問題**：**Callback Hell（回呼地獄）**。當有多個非同步流程需要依序執行時，會產生嚴重的巢狀結構，使程式碼極難維護。

  ```js
  getData((data1) => {
    getData((data2) => {
      getData((data3) => {
        console.log("全部完成", data1, data2, data3);
      });
    });
  });
  ```

#### 2. Promise

- **概念**：Promise 是 ES6 新增的解決方案，代表一個「未來才會完成的結果」。它有三種狀態：
  - `pending`：執行中（尚未完成）。
  - `fulfilled`：成功（呼叫 `resolve()`）。
  - `rejected`：失敗（呼叫 `reject()`）。

  ```js
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true; 
      if (success) {
        resolve("任務完成，這是結果資料");
      } else {
        reject("出錯了！");
      }
    }, 1000);
  });

  //   接收結果：使用 then() 與 catch()
  myPromise
    .then((result) => {
      console.log("成功：", result);
    })
    .catch((error) => {
      console.log("失敗：", error);
    });
  ```

- **優化後的非同步載入（鏈式 then）**：

  ```js
  function getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("資料取得完成");
        resolve("這是伺服器回傳的資料");
      }, 1000);
    });
  }

  //   鏈式呼叫，避免巢狀縮排
  getData()
    .then((data1) => {
      console.log("第 1 筆", data1);
      return getData();
    })
    .then((data2) => {
      console.log("第 2 筆", data2);
      return getData();
    })
    .then((data3) => {
      console.log("第 3 筆", data3);
    })
    .catch((err) => {
      console.error("出錯了", err);
    });
  ```

#### 3. Async / Await

- **概念**：Async/Await 是 Promise 的語法糖，讓非同步的程式碼看起來就像「同步」一樣直覺好讀。

  ```js
  function getData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("資料取得完成");
        resolve("這是伺服器回傳的資料");
      }, 1000);
    });
  }

  async function fetchAll() {
    console.log("開始請求資料...");
    const data1 = await getData();
    const data2 = await getData();
    const data3 = await getData();
    console.log("全部完成", data1, data2, data3);
  }

  fetchAll();
  ```

- **錯誤處理 (try...catch)**：

  ```js
  async function fetchData() {
    try {
      const data = await getData();
      console.log(data);
    } catch (error) {
      console.error("出錯了", error);
    }
  }
  ```

#### 4. 三種非同步處理方式比較表

| 比較項目 | Callback | Promise | Async/Await |
| --- | --- | --- | --- |
| **可讀性** | 容易流於階梯狀巢狀結構 | 鏈式結構大幅改善 | 最佳，極接近同步程式碼 |
| **錯誤處理** | 每一層皆需手動處理 | 使用 `.catch()` 集中處理 | 使用 `try...catch` 最直覺 |
| **流程控制** | 依賴回呼函式 | 依賴 `.then()` 串接 | 使用 `await` 暫停執行 |
| **適用情境** | 簡單、單一層級的任務 | 中等複雜度的流程串接 | 大規模、複雜的非同步流程 |

---

### 四、參考資料

- [維基百科 - AJAX](https://zh.wikipedia.org/zh-tw/AJAX)
- [Axios GitHub Repository](https://github.com/axios/axios)
- [IT 邦幫忙 - 理解 JavaScript 非同步](https://ithelp.ithome.com.tw/articles/10304139)