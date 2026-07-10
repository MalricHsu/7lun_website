---
title: NodeJS｜ Swagger API文件實務筆記
sidebar_position: 7
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-07-08
slug: swagger-openapi-guide
---


### 一、前言
- Swagger 常被用來泛稱 API 文件工具；實際上，**OpenAPI** 是描述 API 的標準格式，**Swagger UI** 則是把這份規格變成可閱讀、可測試網頁的工具。

- 這份筆記分成兩個情境：
  - 若專案已提供 API 文件，如何閱讀與測試。
  - 若專案尚未提供 API 文件（一般開發流程），如何建立與維護。

### 二、OpenAPI 是什麼

#### 1. 問題：API 文件原本怎麼寫

- 在還沒有 OpenAPI 之前，API 文件常見的做法：
  - 用純文字、Word 或 Confluence 手寫描述 endpoint、參數、回應格式。
  - 文件與程式碼分開維護，程式改了、文件忘了改。
  - 前端、後端、測試人員對同一支 API 的認知容易不一致，例如欄位名稱、必填與否、成功狀態碼。

- OpenAPI 想解決的，就是「用一份機器可讀、格式統一的規格，取代自由格式的文字說明」。

#### 2. OpenAPI 的定義

- **OpenAPI Specification**（簡稱 OpenAPI 或 OAS）是一份用來描述 RESTful API 的標準格式，以 JSON 或 YAML 撰寫。
- 一份 OpenAPI 文件通常包含：

    | 項目 | 說明 |
    | --- | --- |
    | `paths` | API 有哪些路徑與 HTTP method，例如 `/auth/login` 的 `POST`。 |
    | `parameters` | 路徑、query string、header 需要哪些輸入值。 |
    | `requestBody` | request body 的資料格式、型別與必填欄位。 |
    | `responses` | 各 HTTP 狀態碼會回傳什麼格式的資料。 |
    | `components/schemas` | 可重複使用的資料結構定義，例如 `User`、`Order`。 |
    | `securitySchemes` | 這支 API 用什麼方式驗證身份，例如 Bearer JWT、API Key。 |

  :::note
  OpenAPI 是「規格」，是一份文件格式標準；Swagger UI、Swagger Editor 這些工具，都是依照這份規格運作的軟體，不是規格本身。
  :::

- 目前常見版本是 **OpenAPI 2.0**（舊稱 Swagger 2.0）與 **OpenAPI 3.x**（最新為 3.2.0）。這份筆記後續範例採用的是 OpenAPI 3.0。

#### 3. OpenAPI 檔案長什麼樣子

- 以 JSON 為例，一份最小可運作的 OpenAPI 文件大致長這樣：

  ```json
      {
      "openapi": "3.0.0",
      "info": {
        "title": "My API",
        "version": "1.0.0"
      },
      "paths": {
        "/auth/login": {
          "post": {
            "summary": "登入並取得 JWT",
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "required": ["email", "password"],
                    "properties": {
                      "email": { "type": "string", "example": "amy@gym.com" },
                      "password": { "type": "string", "example": "1q2w3e4r" }
                    }
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "登入成功，回傳 JWT",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/LoginResponse"
                    }
                  }
                }
              },
              "401": {
                "description": "帳密錯誤",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ErrorResponse"
                    }
                  }
                }
              }
            }
          }
        },
        "/auth/me": {
          "get": {
            "summary": "取得目前登入者資料",
            "security": [{ "bearerAuth": [] }],
            "responses": {
              "200": {
                "description": "成功取得個人資料",
                "content": {
                  "application/json": {
                    "schema": { "$ref": "#/components/schemas/User" }
                  }
                }
              },
              "401": {
                "description": "尚未帶 token 或 token 無效",
                "content": {
                  "application/json": {
                    "schema": { "$ref": "#/components/schemas/ErrorResponse" }
                  }
                }
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "User": {
            "type": "object",
            "properties": {
              "id": { "type": "integer", "example": 1 },
              "email": { "type": "string", "example": "amy@gym.com" }
            }
          },
          "LoginResponse": {
            "type": "object",
            "properties": {
              "token": {
                "type": "string",
                "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              },
              "user": { "$ref": "#/components/schemas/User" }
            }
          },
          "ErrorResponse": {
            "type": "object",
            "properties": {
              "error": { "type": "string", "example": "帳號或密碼錯誤" }
            }
          }
        },
        "securitySchemes": {
          "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
          }
        }
      }
    }
  ```

- 同樣的內容也能用 YAML 撰寫，意義完全相同。

:::warning 
OpenAPI 文件本身只是一份 JSON/YAML 檔案，直接打開只會看到原始文字。要變成人類可讀、可以按按鈕測試的網頁，需要靠 Swagger UI 這類工具讀取並渲染它。
:::

#### 4. OpenAPI 能做什麼、周邊生態系

- 因為 OpenAPI 是機器可讀格式，除了「顯示文件」之外，還能：

  - **產生互動文件**：Swagger UI、Redoc。
  - **產生 client SDK / server stub**：例如 `openapi-generator`，可依規格自動產生 TypeScript、Java 等語言的 API 呼叫程式碼。
  - **產生 mock server**：前端可以在後端完成前，先依規格假資料開發。
  - **自動化測試**：驗證實際 API 回應是否符合規格定義的格式與狀態碼。
  - **API Gateway / 版本控管**：許多雲端服務可直接匯入 OpenAPI 文件設定路由與權限。

### 二、先分清楚兩種情境的差異

#### 1. 情境對照

| 情境 | 文件從哪裡來 | 開發者主要工作 |
| --- | --- | --- |
| 若已提供 API 文件 | 專案內已有 `fixtures/swagger.json`（或等效規格檔） | 依文件完成 API，並用 UI 測試結果。 |
| 若尚未提供 API 文件 | 團隊自行建立並維護 OpenAPI 文件 | 先定 API 契約，或由程式註解產生規格，再持續讓文件與程式同步。 |

- 若專案已提供 `swagger.json`，代表它已經是 API 的規格來源，因此不需要重新產生 Swagger；要做的是依照它寫對應的 `routes/auth.js` 與 middleware，並用 `/docs` 驗證自己的實作是否符合規格。

### 三、Swagger UI 說明及應用

#### 1. 安裝與環境變數

```bash
npm install
cp .env.example .env
```

#### 2. 啟動伺服器與開啟頁面

```bash
npm start
```

在瀏覽器開啟：

```text
// 伺服器預設使用 3000 埠；若 `server.js` 或環境變數設定了其他埠，網址中的埠號也要一併調整。

http://localhost:3000/docs
```

#### 3. Swagger UI 畫面介紹

1. Endpoint 列表：
- Swagger UI 會依照 API 路徑列出可操作的 endpoint，例如：

  - `POST /auth/register`：註冊管理員。
  - `POST /auth/login`：登入並取得 JWT。
  - `GET /auth/me`：取得目前登入者資料。

2. 點開 endpoint 後的區塊：

- 點開任一 endpoint 後，通常可以看到：

  | 區塊 | 用途 |
  | --- | --- |
  | Summary / Description | API 的簡短用途與補充說明。 |
  | Parameters | URL 路徑、query string 或 header 的輸入欄位。 |
  | Request body | 要放進 HTTP body 的資料格式與範例。 |
  | Responses | 各 HTTP 狀態碼可能回傳的資料格式。 |
  | Schema | 欄位型別、必填欄位與巢狀資料結構。 |

- 先閱讀 request body 的 `required` 欄位與 responses 的狀態碼，再開始串接，能避免欄位名稱或回傳格式不一致。

- 圖解
   ![Swagger UI 畫面](/img/node07-2.png)

3. 用 Try it out 測試 API：

- 操作步驟
- 每個 endpoint 都能直接從 Swagger UI 發送請求：

  - **點開 endpoint**：選擇想測試的路由。
  - **按 Try it out**：切換成可編輯模式。
  - **輸入 request body**：在可編輯欄位中貼上或修改 JSON。
  - **按 Execute**：送出請求。
  - **查看結果**：在下方確認實際送出的 Request URL、curl 指令、HTTP status code 與 Response body。

- 註冊範例：

  ```json
  {
    "email": "amy@gym.com",
    "password": "1q2w3e4r"
  }
  ```

- 登入範例：

  ```json
  {
    "email": "leo@gym.com",
    "password": "1q2w3e4r"
  }
  ```

4. 注意事項：

- 若後端的使用者資料是 in-memory array（練習或作業專案常見做法），重新啟動 Node.js 伺服器後，執行期間新註冊的帳號就不會保留。

5. 測試需要 JWT 的 API：

- 操作步驟

- `GET /auth/me` 是受保護的路由，需帶 `Authorization` header：

  - **執行登入**：先呼叫 `POST /auth/login`。
  - **複製 token**：從成功回應的 `token` 欄位複製 JWT。
  - **開啟 Authorize**：按 Swagger UI 頁面上方的 **Authorize**。
  - **貼上 token**：在 `bearerAuth` 的輸入欄貼上 token，按 **Authorize** 後關閉視窗。
  - **測試受保護路由**：開啟 `GET /auth/me`，按 **Try it out** 與 **Execute**。

6. Header 組成方式：

- 此專案的安全機制是 HTTP Bearer Token。Swagger UI 通常會自動組成：

    ```text 
    Authorization: Bearer <你的 JWT token>
    ```

7. 若畫面要求完整值，再自行輸入 `Bearer ` 加上 token。請以實際送出的 Request Headers 為準，避免重複帶入 `Bearer`。

- 圖解
   ![Swagger UI 畫面](/img/node07-3.png)

### 四、常見 HTTP 狀態碼

#### 1. 狀態碼對照表

| 狀態碼 | 含義 | 常見情境 |
| --- | --- | --- |
| `200` | 請求成功 | 成功取得個人資料。 |
| `201` | 已建立資源 | 成功註冊帳號。 |
| `400` | 請求資料有誤 | 缺少 email/password，或 email 已存在。 |
| `401` | 尚未驗證或驗證失敗 | 帳密錯誤、未帶 token、token 無效或過期。 |
| `404` | 找不到路由 | 請求了未定義的網址。 |
| `500` | 伺服器內部錯誤 | 程式執行時發生未處理的例外。 |

### 五、有提供 API 文件的專案運作方式

#### 1. 各角色說明

- **OpenAPI**：描述 API 的標準格式。此範例採用 OpenAPI 3.0。
- **Swagger UI**：讀取 OpenAPI 文件後，提供人類可閱讀且可測試的網頁介面。
- **swagger-ui-express**：在 Express 專案中掛載 Swagger UI 的套件。
- **`fixtures/swagger.json`**：此範例實際的 API 規格來源。

#### 2. app.js 掛載設定

```js
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./fixtures/swagger.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
```

- 這表示 `/docs` 網頁不是自行掃描 `routes/auth.js` 後產生的；它是把既有的 `swagger.json` 渲染出來。當 API 的路徑、欄位、驗證方式或回應格式變更時，應同步更新 `fixtures/swagger.json`，避免文件和實作不一致。

### 五、一般專案沒有提供 API 文件

- 一般專案不是「API 寫完才補一份文件」，而是把 OpenAPI 當作前後端溝通的 API 契約。
- 常見有兩種工作流程。

#### 1. 流程 A：設計優先（Design-first）

- 適合前後端分工、多人協作或需要先確認規格的專案。

  - **釐清需求**：後端、前端與產品人員先討論需求，例如「使用者可以建立訂單」。
  - **撰寫 OpenAPI 文件**：定義 path、method、請求欄位、回應格式、錯誤狀態碼與驗證規則。
  - **文件檢視**：將文件放進 Swagger Editor、SwaggerHub、Stoplight 或專案中的 YAML/JSON 檔案。
  - **前後端平行開發**：前端可依文件先串 mock server 或建立型別；後端再依文件實作 controller、service 與資料庫操作。
  - **CI 驗證**：在 CI 中驗證 OpenAPI 格式，並測試實際 API 回應是否符合規格。

- 例如，先決定建立訂單的契約：

  ```yaml
  paths:
  /orders:
    post:
      summary: 建立訂單
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [items, shippingAddress]
              properties:
                items:
                  type: array
                  minItems: 1
                  items:
                    type: object
                    required: [productId, quantity]
                    properties:
                      productId:
                        type: integer
                        example: 101
                      quantity:
                        type: integer
                        minimum: 1
                        example: 2
                shippingAddress:
                  type: string
                  example: 台北市大安區羅斯福路 100 號
                note:
                  type: string
                  example: 請於下午時段配送
      responses:
        '201':
          description: 訂單建立成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    example: 5001
                  status:
                    type: string
                    example: pending
                  totalAmount:
                    type: integer
                    example: 1580
                  items:
                    type: array
                    items:
                      type: object
                      properties:
                        productId:
                          type: integer
                        quantity:
                          type: integer
                  createdAt:
                    type: string
                    format: date-time
                    example: '2026-07-11T10:30:00Z'
        '400':
          description: 輸入資料錯誤
        '401':
          description: 尚未登入
  ```

- 接著後端應實作 `POST /orders`，而不是自行把路徑改成 `/createOrder` 或將成功狀態碼改成 `200`。若需求真的改了，先更新契約並通知使用者，再同步修改程式。

#### 2. 流程 B：程式優先（Code-first）

- 適合既有後端專案，或由後端先完成 API 的小型團隊。開發者在路由或 controller 附近寫 OpenAPI 註解，透過工具掃描註解產生規格，再交給 Swagger UI 顯示。

- Express 常見組合為：

  ```bash
  npm install swagger-jsdoc swagger-ui-express
  ```

- 建立 Swagger 設定，例如 `config/swagger.js`：

  ```js
  const swaggerJSDoc = require("swagger-jsdoc");

  module.exports = swaggerJSDoc({
    definition: {
      openapi: "3.0.0",
      info: { title: "My API", version: "1.0.0" },
    },
    apis: ["./routes/*.js"],
  });
  ```

- 在路由檔加入註解：

  ```js
  /**
   * @openapi
   * /orders:
   *   post:
   *     summary: 建立訂單
   *     responses:
   *       201:
   *         description: 訂單建立成功
   */
  router.post("/orders", createOrder);
  ```

  :::warning 
  - 要用區塊註解` /** */`，不能用`//`：swagger-jsdoc 只解析 JSDoc 風格的區塊註解，單行` //@openapi` 掃不到，整段內容會被當成一般註解忽略。
  - 標籤要全小寫 @openapi（或舊版慣用的 @swagger）：寫成 @openApi、@OpenAPI 都抓不到，因為 `swagger-jsdoc 是用固定字串比對關鍵字，不是不分大小寫比對。
  :::

- 語法寫對之後，判斷「這支 API 會不會出現在 `/docs`」只看兩個條件：
  - 這段區塊註解有沒有寫在該路由正上方。
  - 這個檔案有沒有落在 `config/swagger.js` 的 apis 這個 glob 範圍內（例如 `./routes/*.js`）。

- 只要兩者都成立，swaggerJsdoc() 在伺服器啟動時就會自動掃到、合併進最後那份規格——不需要手動回頭修改 `config/swagger.js`。之後每多寫一支 API，就是在對應的路由上方重複這個動作而已。

- 最後和前面範例一樣掛載 UI：

  ```js
  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./config/swagger");

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  ```

- 此流程的重點是：文件雖然由註解產生，仍要在修改路由時同步調整註解。程式優先不代表文件會自動知道你的驗證規則、錯誤回應或商業邏輯。

- 圖解
  ![Swagger API文件實務流程](/img/node07-1.png)

### 六、實務上該選哪一種

| 狀況 | 較適合的方式 | 原因 |
| --- | --- | --- |
| 專案已提供 `swagger.json` | 直接依既有規格實作 | 規格已由既有文件定義。 |
| 前後端分開開發 | 設計優先 | 前端可先依契約開發，不必等待後端完成。 |
| 既有 Express API 想補文件 | 程式優先 | 能把註解與路由放在一起維護。 |
| 需要對外提供 API、版本控管嚴格 | 設計優先 | 更容易做審查、mock、SDK 產生與破壞性變更管理。 |
| 只有少量內部 endpoint | 靜態 YAML/JSON 或程式註解皆可 | 依團隊習慣選擇，重點是保持同步。 |

- 文件是 API 的契約。前端、後端與測試人員都應以同一份 OpenAPI 規格確認資料格式與預期行為。

### 七、資料來源

**官方規格與文件**

- [OpenAPI Initiative 官方網站](https://www.openapis.org/)
- [OpenAPI Specification（spec.openapis.org）](https://spec.openapis.org/)
- [Learn OpenAPI — OpenAPI Documentation](https://learn.openapis.org/)
- [OpenAPI Specification — Wikipedia（沿革與版本歷史）](https://en.wikipedia.org/wiki/OpenAPI_Specification)

**套件文件**

- [swagger-ui-express — npm](https://www.npmjs.com/package/swagger-ui-express)
- [swagger-jsdoc — npm](https://www.npmjs.com/package/swagger-jsdoc)