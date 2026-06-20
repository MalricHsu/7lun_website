---
title: 08｜ JavaScript RESTful API
sidebar_position: 9
tags: [JavaScript, 課程筆記, 知識點筆記]
date: 2025-10-31
---

- [課程講義](https://liberating-turtle-5a2.notion.site/API-5ed897eb14b743ba84502a85b5451e27)
- [助教講義](https://chalk-freedom-ec6.notion.site/29f6ab47eb488009aa39e926dc633f4e)

### 一、API 介紹

- **API (Application Programming Interface) 應用程式介面** 是一種整個資料交換的規範或協議。
- 這些協議規定了「**功能的入口**」、「**如何發送請求**」以及「**如何處理回應**」。API 是一種「**溝通橋樑**」，讓不同程式或系統之間可以互相「**說話**」。

#### 1. 微波爐的概念比喻

- 我們不需知道微波爐內部是如何加熱的，只需透過操作面板的指令（即 API），就可以使微波爐進行加熱。

![微波爐介面比喻](/img/截圖 2025-10-31 晚上11.47.08.png)

#### 2. API 端點、請求與回應

- 開發時，我們需要在**端點（Endpoint，即 API 的網址）**發送**請求（Request）**，並接收伺服器傳回的**回應（Response）**結果。
- **API 文件**：資料交換的使用說明書，提供規範的文字說明版本。

![API文件基本格式1](/img/截圖 2025-10-31 晚上11.51.49.png)

![API文件基本格式2](/img/截圖 2025-10-31 晚上11.52.25.png)

#### 3. 運作整體流程

- 前後端資料交換流程：

  ```
  [ 前端 ] 
     ↓  發送請求 (Request)
  [ API 端點（Endpoint） ]
     ↓  處理邏輯 / 查資料庫
  [ 回傳回應 (Response) ]
  ```

#### 4. 餐廳服務生比喻

- 餐廳的角色對照：

| 角色 | 對應意義 |
| --- | --- |
| **你（客人）** | 前端（瀏覽器端/使用者） |
| **服務生** | API |
| **廚房** | 後端（伺服器） |

- **流程說明**：
  1. 客人向服務生點「牛排」（發送請求）。
  2. 服務生（API）將你的需求轉達給廚房。
  3. 廚房（伺服器）煮好牛排後交給服務生（處理資料）。
  4. 服務生再將牛排送回給你（回傳回應）。
  - **你不用知道廚房具體怎麼煮，只需透過服務生（API）就能得到牛排（結果）。**

#### 5. 常見 API 設計風格：RESTful API

- 最普遍的 API 設計風格為 **RESTful API**，通常透過 **HTTP 方法** 進行資料操作溝通。

| 方法 | 功能 | 範例 |
| --- | --- | --- |
| `GET` | 取得資料 | 取得商品列表 |
| `POST` | 新增資料 | 新增購物車項目 |
| `PUT` / `PATCH` | 修改資料 | 更新使用者個人資料 |
| `DELETE` | 刪除資料 | 刪除某一筆留言 |

#### 6. API 文件的基本結構

- API 文件如同程式世界的說明書，指引你前往哪個網址、傳送什麼格式的資料、並取得何種回應。
  - **Endpoint（端點）**：連線的 API 網址。
    ```
    https://api.example.com/users
    ```
  - **Method（方法）**：對伺服器進行的 HTTP 動作。
  - **Request（請求內容）**：傳給伺服器的資料，可能包含在 URL 參數、Request Body 或 Headers 中。
    ```json
    POST /users
    Content-Type: application/json

    {
      "name": "Bob",
      "email": "Bob@example.com"
    }
    ```
  - **Response（回應內容）**：伺服器回傳的資料（通常為 JSON 格式）。
    ```json
    {
      "id": 101,
      "name": "Bob",
      "email": "Bob@example.com",
      "createdAt": "2025-10-31T23:00:00Z"
    }
    ```
  - **Status Codes（狀態碼）**：表示本次請求的執行結果：

| 狀態碼 | 意義 |
| --- | --- |
| `200` | ✅ 成功取得或處理 |
| `201` | ✅ 成功新增資源 |
| `400` | ❌ 客戶端請求錯誤 |
| `401` | ❌ 未授權（缺少 Token / API Key） |
| `404` | ❌ 找不到此資源或路徑 |
| `500` | ❌ 伺服器內部錯誤 |

#### 7. 實際 API 文件範例

- **2021 前端/UI 問卷調查 API**：
  - **Endpoint (端點)**：
    - `frontend_data.json`：[點此連結](https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json)
    - `ui_data.json`：[點此連結](https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/ui_data.json)
  - **Method (方法)**：`GET`
  - **資料格式**：JSON
  
  ![問卷調查API文件範例](/img/截圖 2025-11-01 凌晨12.16.04.png)

- **TDX 運輸資料流通平台 API**：
  - **Endpoint (端點)**：`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24top=30&%24format=JSON`
  - **網址參數**（問號 `?` 後的查詢字串）：
    ```
    %24top=30      => 取前 30 筆資料
    &              => 串接符號
    %24format=JSON => 指定回傳格式為 JSON

    //   註：%24 為 $ 字元的編譯編碼。解碼後即為 $top 與 $format
    ```
  - **Method (方法)**：`GET`
  - **資料格式**：JSON
  
  ![TDX景點API文件範例](/img/截圖 2025-11-01 凌晨12.22.49.png)

- **NEWS 新聞 API**：
  - **Endpoint (端點)**：`https://newsapi.org/v2/everything?q=tesla&from=2025-09-30&sortBy=publishedAt&apiKey=API_KEY`
  - **網址參數**：
    ```
    q=tesla            => 搜尋關鍵字為 tesla
    &from=2025-09-30   => 限制日期自 2025-09-30 起
    &sortBy=publishedAt=> 依發佈時間排序
    &apiKey=API_KEY    => 帶入申請的 API 金鑰
    ```
  - **Method (方法)**：`GET`
  - **資料格式**：JSON
  
  ![NEWS_API文件範例](/img/截圖 2025-11-01 凌晨12.29.49.png)

- **Google Maps API**：功能強大且資訊多，文件結構較複雜，需詳細閱讀其開發文件。
  
  ![GoogleMap_API文件範例](/img/截圖 2025-11-01 凌晨12.32.09.png)

- **最終專案任務 API**：使用 Swagger 服務建置的 API 文件。
  
  ![最終任務API文件範例](/img/截圖 2025-11-01 凌晨12.34.18.png)

#### 8. API 串接權限的四種分類

- 依安全性與限流分為：
  1. **無限制、免驗證**：可在瀏覽器端 (JS) 直接讀取使用，不需申請帳號（如：政府的開放資料 Open Data）。
  2. **需金鑰、非敏感**：可在瀏覽器端 (JS) 讀取使用，但需申請帳號取得金鑰，常有限流控制（如：Google Maps API）。
  3. **限後端、免驗證**：因流量考量或跨網域限制，限伺服器後端讀取，不需帳號。
  4. **限後端、需驗證**：安全性最高。因涉及敏感資料（如個資、金流），必須限制在後端讀取，且需帶金鑰驗證（如：News API）。
     - **跨網域資源共享 (CORS)**：若要允許瀏覽器端直接存取，Response Headers 中必須包含 `Access-Control-Allow-Origin: *`。

#### 9. API Key（金鑰）的特點

- **定義**：API Key 是發送請求端在 API 服務上的身份識別。
- **特點**：

| 項目 | 說明 |
| --- | --- |
| **用途** | 驗證「是哪一個應用程式」在調用此 API。 |
| **形式** | 一串固定的長英數字（如 `ABCD1234xyz890TOKEN`）。 |
| **安全性** | 長期有效且通常固定不變（除非手動重新整理/撤銷）。 |
| **傳送方式** | 包含在 URL 參數或 Request Headers 中。 |

  ```js
  //   在 Headers 中夾帶 API Key 範例
  axios.get("https://api.weather.com/v1/data/", {
    headers: {
      "api-key": "YOUR_API_KEY"
    }
  })
    .then(res => console.log(res.data));
  ```

#### 10. Token（令牌）的特點

- **定義**：Token 是伺服器驗證特定使用者身分與存取權限的憑證，通常在登入成功後由伺服器發給客戶端。
- **特點**：

| 項目 | 說明 |
| --- | --- |
| **用途** | 驗證「是哪一個使用者」有權限進行特定操作。 |
| **形式** | 加密過的 JSON Web Token（如 `eyJhbGciOiJIUzI1NiIsInR5cCI6...`）。 |
| **安全性** | 時效性強，有過期時間限制（如 1 小時或 24 小時）。 |
| **傳送方式** | 通常放在 HTTP Headers 的 Authorization 欄位中。 |
| **生成方式** | 經由登入驗證（輸入帳密）或使用 API Key 向伺服器交換取得。 |

  ```js
  //   在 Headers 中夾帶 Token 範例
  axios.get("https://api.example.com/user/info", {
    headers: {
      "Authorization": "Bearer YOUR_ACCESS_TOKEN"
    }
  })
    .then(res => console.log(res.data));
  ```

#### 11. API Key 與 Token 的差別

- **對比總結**：

| 比較項目 | API Key | Token |
| --- | --- | --- |
| **主要用途** | 識別並授權「應用程式」 | 驗證「使用者身分與其操作權限」 |
| **生成方式** | 手動建立於開發者控制台後台 | 登入後由伺服器動態簽發 |
| **有效期限** | 通常永久有效 | 具時效性（過期後需以 Refresh Token 重新取得） |
| **安全性** | 較低 | 較高（可細分權限與失效時間） |

- **生活化比喻**：
  - **API Key** 就像是餐廳的「**會員卡**」：讓商家識別你是哪一位客戶，但不能帶你進入限制區域。
  - **Token** 就像是飯店的「**房卡**」：通過登記登入後取得的臨時通行證，既有特定房門開門權限，也有期限。

#### 12. API 資料中 ID 的必要性

- 為了**避免資料名稱衝突**。如同身分證字號，每一個資料項目（產品、會員、訂單）都應配有唯一的 `id`，以便在進行資料查詢、修改或刪除時，能準確定位特定資源。

---

### 二、最終任務 API 使用流程與範例

#### 1. 產品相關 API（客戶端）

- **取得產品列表**：
  ```js
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/test/products")
    .then((res) => {
      console.log(res.data.products);
    });
  ```
- **Response 回應結構**：
  ```json
  {
    "status": true,
    "products": [
      {
        "category": "產品分類 (String)",
        "image": "產品圖片 (String)",
        "id": "產品 ID (String)",
        "title": "產品名稱 (String)",
        "origin_price": 2000,
        "price": 1500
      }
    ]
  }
  ```

#### 2. 購物車相關 API（客戶端）

- **取得、加入、編輯與刪除購物車內容**：

  ```js
  //   取得購物車列表
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/test/carts")
    .then((res) => {
      console.log(res.data.carts);
    });
    
  //   加入產品到購物車
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/test/carts", {
    data: {
      productId: "產品 ID (String)",
      quantity: 1
    }
  })
    .then((res) => {
      console.log(res.data.carts);
    });
    
  //   編輯購物車內產品數量
  axios.patch("https://livejs-api.hexschool.io/api/livejs/v1/customer/test/carts", {
    data: {
      productId: "產品 ID (String)",
      quantity: 2
    }
  })
    .then((res) => {
      console.log(res.data.carts);
    });
    
  //   清空購物車（全部產品）
  axios.delete("https://livejs-api.hexschool.io/api/livejs/v1/customer/test/carts")
    .then((res) => {
      console.log(res.data.carts);
    });
    
  //   刪除購物車內單一特定產品
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/test/carts/${id}`)
    .then((res) => {
      console.log(res.data.carts);
    });
  ```

#### 3. 訂單相關 API（客戶端）

- **送出購買訂單**：

  ```js
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/test/orders", {
    "data": {
      "user": {
        "name": "六角學院",
        "tel": "07-5313506",
        "email": "hexschool@hexschool.com",
        "address": "高雄市六角學院路",
        "payment": "Apple Pay"
      }
    }
  })
    .then((res) => {
      console.log(res.data.orders);
    });
  ```

#### 4. 訂單相關 API（管理端）

- **管理者取得、修改及刪除訂單**：

  ```js
  //   取得訂單列表
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/test/orders", {
    headers: {
      authorization: token
    }
  })
    .then((res) => {
      console.log(res.data.orders);
    });
    
  //   修改訂單狀態（已付款/未付款）
  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/test/orders", {
    "data": {
      "id": "訂單 ID (String)",
      "paid": true
    }
  }, {
    headers: {
      authorization: token
    }
  })
    .then((res) => {
      console.log(res.data.orders);
    });
  
  //   刪除全部訂單
  axios.delete("https://livejs-api.hexschool.io/api/livejs/v1/admin/test/orders", {
    headers: {
      authorization: token
    }
  })
    .then((res) => {
      console.log(res.data.orders);
    });
    
  //   刪除特定單一訂單
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/test/orders/${id}`, {
    headers: {
      authorization: token
    }
  })
    .then((res) => {
      console.log(res.data.orders);
    });
  ```

#### 5. Axios 通用配置結構

- Axios 通用設定語法：

  ```js
  axios({
    method: "get",                //  HTTP 方法 (get, post, put, patch, delete)
    url: "https://example.com",   //  API 網址
    data: {},                     //  要傳送的資料（POST / PUT / PATCH 時才需要放在 Body 中）
    params: {},                   //  URL 查詢參數 (Query String)
    headers: {},                  //  自訂標頭 (如 Authorization 驗證資訊)
  })
    .then((res) => {
      console.log(res.data);      //  取得伺服器回傳之資料
    })
    .catch((err) => {
      console.error(err);         //  錯誤捕獲與處理
    });
  ```

---

### 三、參考資料

- [Miro 板 - API 開發流程](https://miro.com/app/board/uXjVJDlDOTE=/)
- [維基百科 - 應用程式介面 (API)](https://zh.wikipedia.org/wiki/%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E6%8E%A5%E5%8F%A3)