---
title: 09｜ JavaScript DOM + API 整合實作
sidebar_position: 10
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-11-07
---

- [課程講義](https://liberating-turtle-5a2.notion.site/DOM-API-3ff8b47047e94275a99a5adfa9c1c95e)

### 一、期末專案試煉：待辦事項 TodoList

#### 1. TodoList（純前端）

- 實作基本 HTML 結構：
  ```html
  <input type="text" class="txt" placeholder="請輸入待辦事項">
  <input type="button" class="save" value="儲存待辦">
  <ul class="list"></ul>
  ```

- 實作 JavaScript 互動邏輯：
  ```js
  const txt = document.querySelector('.txt');
  const save = document.querySelector('.save');
  const list = document.querySelector('.list');

  let data = [];

  //   畫面渲染方法
  function renderData() {
    let str = '';
    data.forEach(function (item, index) {
      str += `<li>${item.content} <input class="delete" type="button" data-num="${index}" value="刪除待辦"></li>`;
    });
    list.innerHTML = str;
  }

  //   新增待辦功能
  save.addEventListener('click', function(e) {
    if (txt.value == "") {
      alert("請輸入內容");
      return;
    }
    let obj = {};
    obj.content = txt.value;
    data.push(obj);
    renderData();
    txt.value = "";             //  清空輸入框
  });

  //   刪除待辦功能（事件代理/委派）
  list.addEventListener("click", function(e) {
    if (e.target.getAttribute("class") !== "delete") {
      return;
    }
    let num = e.target.getAttribute("data-num");
    console.log(num);
    data.splice(num, 1);
    alert("刪除成功！");
    renderData();
  });
  ```

  :::note 
     因為 `obj` 物件宣告在新增待辦的函式（Function Scope）內部，每次觸發 click 事件時都會宣告一個全新的物件，所以不會產生重新賦值或多個項目共用同一個物件參考地址的問題。
  :::

#### 2. 純前端與 API 版本的差異

- **純前端版本**：
  - **特點**：所有資料皆直接儲存在瀏覽器端的記憶體變數中（`let data = []`）。
  - **缺點**：一旦網頁重整、關閉或更換裝置，儲存的資料即完全消失。
  - **優點**：不需伺服器端支援，執行速度極快，便於快速製作 Demo 雛形。

- **接 API 版本（前後端分離）**：
  - **特點**：前端依舊使用 JavaScript 渲染畫面，但資料的增刪查改是經由 API（HTTP 請求）向後端伺服器交換，並保存在資料庫中。
  - **優點**：資料可永久保存、多裝置共用，且能進行身分驗證與資料安全保護。
  - **缺點**：開發架構較複雜，且受網路延遲及伺服器狀態影響。

- **版本特性比較表**：

  | 功能面向 | 純前端 | 接 API 版本 |
  | --- | --- | --- |
  | **資料儲存位置** | 瀏覽器記憶體（或本地 localStorage） | 後端資料庫（如 MySQL, MongoDB） |
  | **資料持久化** | ❌ 網頁重整或關閉後資料即消失 | ✅ 永久保存於資料庫中 |
  | **多裝置同步** | ❌ 僅能在當下瀏覽器端單機使用 | ✅ 不同裝置皆可透過帳號取得最新資料 |
  | **安全性機制** | ❌ 無從驗證權限 | ✅ 可在 API Gateway 與後端驗證權限 |
  | **開發複雜度** | 簡單，僅需前端語法 | 中等，需處理非同步請求與錯誤狀態 |
  | **適用場景** | 快速概念驗證（PoC）、小作品 | 實際商業專案、多人協作系統 |


### 二、HTML5 自訂資料屬性

- 在開發網頁時，時常需要在 HTML 元素上暫存一些自訂資料以供 JavaScript 或 CSS 使用。
- 為了避免自訂非標準屬性引發瀏覽器相容問題，HTML5 引入了 **`data-*` 屬性**，其中 `*` 可自由替換為小寫的自訂名稱：

  ```html
  <div data-自訂名稱="值"></div>
  <div data-num="3" id="product" data-id="123" data-name="Laptop" data-price="499.99"></div>
  ```

#### 1. JavaScript 取得 data-* 資料

- **方式一：使用 `dataset` 物件**：
  `dataset` 是 DOM 提供的屬性，可將元素上的 `data-*` 轉換成物件鍵值對（自動將連字號 `-` 轉換成小駝峰命名法）。

  ```js
  const product = document.getElementById("product");

  //   轉換對照：HTML 的 data-id → JS 的 dataset.id
  console.log(product.dataset.id);     //  "123"
  console.log(product.dataset.name);   //  "Laptop"
  console.log(product.dataset.price);  //  "499.99"
  ```

- **方式二：使用 `getAttribute()`**：
  若不習慣使用 `dataset`，亦可使用標準 DOM 屬性方法來取得完整的屬性名稱。

  ```js
  console.log(product.getAttribute("data-id"));    //  "123"
  console.log(product.getAttribute("data-name"));  //  "Laptop"
  console.log(product.getAttribute("data-price")); //  "499.99"
  ```

#### 2. JavaScript 修改 data-* 資料

- **方式一：修改 dataset 物件屬性**：
  ```js
  product.dataset.price = "599.99";
  console.log(product.dataset.price);  //  "599.99"
  ```

- **方式二：調用 `setAttribute()`**：
  ```js
  product.setAttribute("data-price", "599.99");
  console.log(product.getAttribute("data-price"));  //  "599.99"
  ```

#### 3. 實際使用場景與注意事項

- **優點**：不需建立全域變數，能將狀態與資料直接綁定在對應的 HTML 元素上，利於 DOM 事件代理取得目標 ID。

:::warning

  不論原先在 HTML 內寫的是數字還是布林值，經由 `dataset` 取得的資料型別**皆會被自動轉換為「字串」**。若後續有計算需求，請務必先使用 `Number()` 或 `parseInt()` 進行型別轉換。
:::



### 三、最終任務流程圖（接 API 版本）

- 期末專案的前後端非同步流程如下：

    <img src="/img/js09-1.png" alt="最終任務流程圖" />


### 四、JS 核心知識點回顧與關聯

- 整個 JS 直播班的學習進程與知識點：

1. **變數與基礎型別**：定義資料的基本單位。
   - *延伸知識*：變數作用域、提升（Hoisting）與 TDZ。
2. **流程判斷與控制**：設計程式的分支邏輯。
   - *延伸知識*：邏輯短路求值、三元運算子、真值與假值。
3. **陣列與物件**：將同性質或單一實體的資料予以結構化。
   - *延伸知識*：記憶體傳址（Pass by Reference）、深拷貝與淺拷貝。
4. **函式設計**：減少重覆程式碼，建立重複呼叫的邏輯模組。
   - *延伸知識*：箭頭函式與傳統函式之 `this` 指向差異。
5. **資料處理**：利用 `forEach`, `map`, `filter` 等方法批量處理資料。
   - *延伸知識*：高階陣列方法之回傳值與中斷特點。
6. **AJAX 非同步請求**：前端不重整網頁與伺服器進行資料傳遞。
   - *延伸知識*：Promise 與 Async/Await 的演進。
7. **套件整合**：利用 Object 靜態方法處理並轉換資料格式，將其與如 C3.js 套件進行整合。
   - *延伸知識*：Swiper, Leaflet 等前端常見套件。
8. **第三方線上服務串接**：利用 API 驗證機制與 Headers 來存取敏感或商業資料。
   - *延伸知識*：CORS 跨網域設定、Token 與 API Key 的安全性。


### 五、參考資料

- [Miro 板 - 期末專案設計流程](https://miro.com/app/board/uXjVJuDhaLY=/?share_link_id=840726311024)
- [HTML5 自訂屬性 data-* 使用教學](https://pjchender.dev/html/html-data-attribute/)
- [Hexschool 期中/期末試煉 HackMD 說明頁面](https://hackmd.io/sYlcUD-wTimN0NsPrfGH1w?view)
