---
title: NodeJS｜ Express 概念及用法
sidebar_position: 5
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-07-03
slug: nodejs-express-concepts
---


### 一、Express 起手式

#### 1.為什麼不直接用原生 `http` 模組就好？

- 用原生 `http` 模組寫伺服器時，每一條路由都要自己判斷 `req.method` 跟 `req.url`，路由一多，程式碼就會變成一長串 `if/else`：

  ```javascript
  // 原生 http：要自己判斷方法跟路徑
  const http = require('http');
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('首頁');
    }
  });
  ```

- Express 把「判斷方法 + 判斷路徑」這件事封裝起來，讓你直接用語意化的方法名稱寫路由：

  ```javascript
  const express = require('express');
  const app = express(); // 建立應用程式實例,之後所有東西都圍繞著它展開

  app.get('/', (req, res) => {
    res.send('首頁');
  });

  app.listen(3000, () => console.log('伺服器啟動中'));
  ```

#### 2. 對應 HTTP 方法的路由方法

  ```javascript
  app.get('/members', (req, res) => { ... });        // 讀取
  app.post('/members', (req, res) => { ... });         // 新增
  app.put('/members/:id', (req, res) => { ... });      // 更新
  app.delete('/members/:id', (req, res) => { ... });   // 刪除
  ```

#### 3. `res` 常用語法

| 語法 | 說明 |
| --- | --- |
| `res.send(內容)` | 送出文字或 HTML |
| `res.json(物件)` | 送出 JSON，自動設定正確的 Content-Type |
| `res.status(狀態碼)` | 設定 HTTP 狀態碼，通常會串接其他方法 |
| `res.status(狀態碼).json(物件)` | 最常見的寫法 |

```javascript
res.status(201).json({ status: 'success', message: '建立成功' });
res.status(404).json({ status: 'error', message: '找不到資源' });
```

### 二、URL 結構、`req.params`、`req.query`

#### 1. 一個網址是怎麼組成的

- 在深入 `req.params`、`req.query` 之前，先看懂網址長什麼樣子。以 `https://www.google.com/search?q=hello` 為例：

  | 組成 | 範例 | 說明 |
  | --- | --- | --- |
  | 傳輸協定 Protocol | `http://` / `https://` | HTTPS 是加密版本 |
  | 子網域 Subdomain | `www` | 可自訂，如 `api.`、`blog.` |
  | 網域 Domain | `google.com` | 透過 DNS 解析成伺服器 IP |
  | 埠號 Port | 省略（預設 443） | 服務的門牌號碼，開發時常見 `localhost:3000` |
  | 路徑 Path | `/search` | 後端依此決定執行哪段程式碼 |
  | 查詢參數 Query String | `?q=hello` | `key=value` 格式，多個用 `&` 串接 |

- 這個結構決定了 `req.params` 對應**路徑（Path）**、`req.query` 對應**查詢參數（Query String）**，這是兩者最根本的差異，後面會用一張表對照。

#### 2. 動態路徑：`req.params`

- 當路徑中需要帶入「動態值」（例如某個會員的 ID），用 `:參數名稱` 佔位：

  ```javascript
  app.get('/members/:id', (req, res) => {
    const memberId = req.params.id;
    res.status(200).json({ status: 'success', data: { id: memberId } });
  });
  // GET /members/42 → req.params.id = '42'
  ```

- 也可以同時有多個動態段落：

  ```javascript
  app.get('/coaches/:coachId/courses/:courseId', (req, res) => {
    const { coachId, courseId } = req.params;
    res.status(200).json({ coachId, courseId });
  });
  // GET /coaches/3/courses/7 → coachId: '3', courseId: '7'
  ```

  :::note
  **判斷原則**：如果這個值是「找出哪一筆資料」的必要資訊（缺了它這條路由就沒意義），用 `req.params`。
  :::

#### 3. 篩選查詢：`req.query`

- 用於**非必要、可省略**的附加資訊，像是篩選條件、排序、分頁：

  ```javascript
  app.get('/members', (req, res) => {
    const role = req.query.role;
    const limit = req.query.limit;
    res.status(200).json({ status: 'success', filter: { role, limit } });
  });
  // GET /members?role=coach&limit=10
  // → req.query.role = 'coach', req.query.limit = '10'
  ```

  :::warning
  **重點提醒**：`req.query` 取出來的值一律是**字串**，要拿去做數字運算前記得 `Number()` 轉型。
  :::

#### 4. `req.params` vs `req.query` 對照

| | `req.params` | `req.query` |
| --- | --- | --- |
| 對應 URL 哪一段 | 路徑（Path） | 查詢字串（Query String） |
| 是否必要 | 通常必要（缺了路由就對不上） | 通常可省略（用來篩選） |
| 範例 | `/members/:id` | `/members?role=coach` |

- 有了這兩個工具，你已經能寫出「能動態回應不同請求」的路由。

### 三、RESTful 設計原則與狀態碼

#### 1. RESTful 核心：用 URL 表示資源，用方法表示動作

| HTTP 方法 | 路徑 | 用途 |
| --- | --- | --- |
| `GET` | `/members` | 取得所有會員列表 |
| `GET` | `/members/:id` | 取得單一會員資料 |
| `POST` | `/members` | 新增一位會員 |
| `PUT` | `/members/:id` | 更新指定會員完整資料 |
| `DELETE` | `/members/:id` | 刪除指定會員 |

:::note
URL 只放名詞（資源），動作交給 HTTP 方法表達。避免寫成 `/getMembers`、`/deleteUser/3` 這種把動詞塞進路徑的寫法。慣例上，代表「一群資源」的路徑用**複數名詞**（`/members` 而不是 `/member`）。
:::

:::info
**補充一個實務上觀念：冪等性（Idempotent）**：`GET`、`PUT`、`DELETE` 都是「冪等」的，意思是同一個請求重複送好幾次，結果都一樣（例如刪同一筆資料兩次，結果都是「這筆資料不存在」）；但 `POST` 不是冪等的，重複送就會建立出好幾筆重複資料。這也是為什麼「新增」一定要用 `POST`，而不是圖方便用 `GET` 硬做。
:::

#### 2. 用狀態碼把「發生了什麼事」講清楚

| 狀態碼 | 名稱 | 使用時機 |
| --- | --- | --- |
| `200` | OK | 請求成功，有回傳資料（GET、PUT） |
| `201` | Created | 資源建立成功（POST 新增後） |
| `204` | No Content | 成功但無回傳內容（常用於 DELETE） |
| `400` | Bad Request | 請求格式錯誤或缺少必要參數 |
| `404` | Not Found | 找不到指定資源 |

  ```javascript
  app.post('/members', (req, res) => {
    res.status(201).json({ status: 'success', message: '會員新增成功' });
  });

  app.get('/members/:id', (req, res) => {
    const member = null; // 假設查無此人
    if (!member) {
      return res.status(404).json({ status: 'error', message: '找不到此會員' });
    }
  });

  app.delete('/members/:id', (req, res) => {
    res.status(204).end();
  });
  ```

  :::note
  即使同樣是 `200`，實際意義也會因方法而略有不同，`GET` 的 `200` 代表「資源被成功取出並放進回應內容」，`POST` 的 `200`（或更常見的 `201`）代表「動作成功執行」。這也是為什麼新增資源時業界慣例回 `201` 而不是 `200`，讓前端一眼就能分辨「這是新建立的東西」。
  :::

### 四、Middleware 概念、運作機制、常用套件、路由模組化

#### 1. Middleware 是什麼

- Middleware（中介函式）是一個 `(req, res, next)` 三個參數的函式，Express 會依照你掛載的**順序**依序執行。每一棒處理完有兩種解決模式
  - 呼叫 `next()` 把請求交給下一棒
  - 或是自己送出回應結束流程。

  ```
  請求進入
  ↓
  [Middleware 1] → next()
  ↓
  [Middleware 2] → next()
  ↓
  [路由 handler] → res.json() 送出回應
  ```

  ```javascript
  const logMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // 一定要呼叫,否則請求會卡住,前端會一直等不到回應
  };

  app.use(logMiddleware); // 全域掛載,所有請求都會先經過它
  ```

#### 2. `app.use()` 這個 "use" 是什麼

- `app.use()` 做的事情，用一句話講：**把一個函式「登記」進 Express 內部的一份處理清單裡，而不是馬上執行它。**

  ```javascript
  app.use(middlewareA);
  app.use(middlewareB);
  app.get('/members', routeHandler);
  ```

- 這三行程式碼執行完之後，可以想像 Express 內部維護了一份清單：

  ```
  [ middlewareA, middlewareB, routeHandler(綁定 GET + /members) ]
  ```

- 這份清單在你呼叫 `app.use()`／`app.get()` 的當下就固定順序了，跟請求什麼時候進來完全無關。等到真的有請求打進來，Express 才會從頭開始，依序檢查清單裡每一項「符不符合這次請求」，符合就執行。以 `GET /members` 為例：

  ```
  第 1 項 middlewareA
    → app.use() 註冊,沒指定路徑,預設是 '/',什麼路徑都符合
    → 執行,裡面呼叫了 next() → 繼續往下一項

  第 2 項 middlewareB
    → 同樣什麼路徑都符合 → 執行 → 呼叫 next() → 繼續往下一項

  第 3 項 routeHandler
    → app.get('/members', ...) 註冊,要求「方法是 GET」+「路徑剛好是 /members」
    → 這次請求剛好符合,執行,裡面呼叫 res.json(...) 送出回應
    → 結束,不會再往下找
  ```

- 這就是為什麼掛載順序這麼重要——**`app.use()` 註冊的東西如果沒指定路徑，是「來者不拒」，每個請求都會先經過它，排在清單越前面就越早跑到。**

- **`app.get` 其實跟 `app.use` 走同一套機制，差別只在「篩選條件」**：`app.get(path, handler)` 可以想成是 Express 幫你在 `app.use()` 上多加了兩個篩選條件——「方法必須是 GET」、「路徑必須完全相符」。單純的 `app.use(handler)` 沒有這兩個限制，所以它是清單裡「守備範圍最大」的一種，也因此適合拿來做 log、解析 JSON、驗證身份這類**每條路由都要跑的共通邏輯**，而不是拿來回傳某個資源的最終資料。

  <table>
    <thead>
      <tr>
        <th></th>
        <th><code>app.get(path, handler)</code></th>
        <th><code>app.use(handler)</code> / <code>app.use(path, handler)</code></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>攔截哪些 HTTP 方法</td>
        <td>只有 GET</td>
        <td>全部方法（GET/POST/PUT/DELETE...）</td>
      </tr>
      <tr>
        <td>路徑比對方式</td>
        <td>完全相符</td>
        <td>前綴比對（開頭符合就算）</td>
      </tr>
      <tr>
        <td>用途</td>
        <td>處理「某個資源」的最終回應</td>
        <td>處理「多條路由共用」的前置邏輯</td>
      </tr>
    </tbody>
  </table>

- 指定路徑的 `app.use('/api', handler)` 是「前綴比對」，而且會把符合的前綴「切掉」：

  ```javascript
  app.use('/api', middleware);

  // 以下這些路徑都會被攔到,因為都是「/api 開頭」
  // GET  /api
  // GET  /api/members
  // POST /api/members/5
  ```

  :::note
  **進階知識點**：Express 官方文件把 Middleware 分成五種：application-level（用 `app.use()` 掛的）、router-level（用 `router.use()` 掛的）、內建（如 `express.json()`）、第三方（如 `cors()`）、以及 error-handling middleware（專門處理錯誤，函式簽名固定要有 **四個參數** `(err, req, res, next)`，Express 會自動把它跟一般 middleware 區分開來。
  :::

#### 3. 常用的內建／第三方 Middleware

- **`express.json()` 解析 JSON 請求內容**

  - 前端用 `POST`／`PUT` 送 JSON 資料時，如果沒掛這個 Middleware，`req.body` 會是 `undefined`。

    ```javascript
    app.use(express.json()); // 掛載後 req.body 才能正確取得資料

    app.post('/members', (req, res) => {
      console.log(req.body); // { name: '王小明', age: 28 }
      res.status(201).json({ status: 'success', data: req.body });
    });
    ```

- **`cors()` 解決跨域問題**

  - 瀏覽器基於「同源政策（Same-Origin Policy）」，前端（如 `localhost:5173`）呼叫不同來源的後端（如 `localhost:3000`）預設會被擋下，這就是 CORS 問題。用第三方套件 [cors](https://www.npmjs.com/package/cors) 讓後端在回應裡加上正確的 Header（`Access-Control-Allow-Origin`）來允許請求。

    ```javascript
    const cors = require('cors');
    app.use(cors()); // 預設允許所有來源,開發階段使用
    ```

  :::note 
    **補充**：某些請求（例如帶自訂 Header、或方法不是單純的 GET/POST）瀏覽器會先自動發出一個 `OPTIONS` 方法的「預檢請求（preflight request）」，問伺服器「等一下這個跨域請求你允許嗎？」，伺服器答應了才會真正送出原本的請求。如果你在瀏覽器的 Network 分頁看到一個多出來的 `OPTIONS` 請求，這就是原因，而 `cors()` 套件會自動幫你處理好這個預檢流程，不用手動寫。
  :::

#### 4. 掛載順序決定一切

- Middleware 的執行順序**跟你寫程式碼的順序完全一致**，一定要在路由定義**之前**先掛好所需的 Middleware：

  ```javascript
  const express = require('express');
  const cors = require('cors');
  const app = express();

  // 先掛 Middleware,再定義路由
  app.use(cors());
  app.use(express.json());

  app.post('/members', (req, res) => {
    // 這裡 cors() 已經生效 → 不會被瀏覽器擋
    // express.json() 已經生效 → req.body 有資料
    res.status(201).json({ status: 'success', data: req.body });
  });
  ```

#### 5. `express.Router()` 模組化

- 有了 Middleware 之後，一支 `app.js` 裡的內容會越來越多。當路由本身也越來越多支，全部塞在同一個檔案會難以維護：

  ```javascript
  // ❌ 反例：所有路由都擠在 app.js
    app.get('/members', ...);
    app.post('/members', ...);
    app.get('/coaches', ...);
    app.post('/coaches', ...);
    // ... 越來越多
  ```

- 解法是用 `express.Router()` 把每一種資源的路由拆成獨立檔案：

  ```
  project/
  ├── app.js              ← 只負責掛載 Middleware 與各個路由模組
  └── routes/
      ├── members.js       ← 所有 /members 相關路由
      └── coaches.js        ← 所有 /coaches 相關路由
  ```

- **步驟一：建立路由檔案（`routes/members.js`）**

  ```javascript
  const express = require('express');
  const router = express.Router();

  // 這裡的路徑,是「掛載前綴」接上去之後的路徑
  router.get('/', (req, res) => {
    res.status(200).json({ status: 'success', data: '所有會員' });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(200).json({ status: 'success', data: `會員 ${id}` });
  });

  module.exports = router; // 匯出路由實例
  ```

- **步驟二：在 `app.js` 掛載路由（指定路徑前綴）**

  ```javascript
  const membersRouter = require('./routes/members');

  app.use('/members', membersRouter); // 掛載到 /members 前綴
  ```

- 路徑前綴合併規則整理成表：

  | router 內部路徑 | 掛載前綴 | 實際對應 URL |
  | --- | --- | --- |
  | `router.get('/')` | `/members` | `GET /members` |
  | `router.get('/:id')` | `/members` | `GET /members/:id` |

  :::info 
    **好處**：路由檔案不需要知道自己被掛在哪個前綴下。日後若要把 `/members` 改成 `/api/v1/members`，只需要改 `app.js` 那一行 `app.use('/members', ...)`，路由檔案完全不用動——這正是 `app.use()` 前綴比對特性帶來的彈性。
  :::


### 五、綜合實戰：健身房會員管理 API

#### 1. 專案結構總覽

```text
node-js-week3-2026/
├── app.js                          # 組裝 app：掛 middleware + 掛 router，最後 export（不啟動）
├── server.js                       # 啟動點：require app 後才 app.listen()
├── routes/
│   ├── members.js                  # 會員 CRUD（GET / POST / PUT / DELETE）
│   └── uploadImage.js              # 圖片上傳（formidable 解析 multipart）
├── fixtures/
│   ├── members.json                # 4 筆初始會員資料
│   ├── sample.jpg                  # 測試用圖片
│   └── swagger.json                # Swagger API 文件
├── .env.example           # 環境變數範例
└── package.json
```

- **初始資料 `fixtures/members.json`：**

  ```json
  [
    { "id": 1, "name": "小華", "level": "VIP" },
    { "id": 2, "name": "小美", "level": "normal" },
    { "id": 3, "name": "阿強", "level": "VIP" },
    { "id": 4, "name": "小明", "level": "normal" }
  ]
  ```

#### 2. 把 app 跟 server 分開

- **`app.js`** 只負責「組裝」——掛 middleware、掛 router，然後 `module.exports = app`，**它自己不呼叫 `app.listen()`**
- **真正的啟動 `app.listen(PORT)` 放在 `server.js`。**

#### 3. 任務一：初始化 state + helper 函式（`routes/members.js` 開頭）

- 尚未接資料庫前，用 JavaScript 陣列做 in-memory 儲存。把「篩選」「驗證」兩段重複邏輯抽成 helper，讓後面的路由 handler 保持乾淨：

  ```javascript
  const express = require("express");
  const initialMembers = require("../fixtures/members.json");

  // 複製一份初始資料，不直接改動被 require 進來的外部陣列
  const members = [...initialMembers];
  let nextId = 5; // 初始有 4 筆(id 1~4)，下一個新增從 5 開始

  // helper：依 query.level 篩選；沒帶 level 就回全部
  const filterByQuery = (list, query) => {
    if (!query.level) return list;
    return list.filter((item) => item.level === query.level);
  };

  // helper：驗證 body 有沒有 name、level；能擋 null / undefined / {}
  const validateBody = (body) => {
    if (!body || !body.name || !body.level) {
      return { valid: false, error: "缺 Name 或 Level" };
    }
    return { valid: true };
  };

  const router = express.Router();
  ```

  :::note
  為什麼要 `const members = [...initialMembers]`（複製一份）而不是直接用 `initialMembers`？因為 `require` 進來的 JSON 是共用的模組快取，**直接對它 `push`／`splice` 會污染到原始資料**，所以要複製一份才能安全地增刪改。
  :::

#### 4. 任務二：GET 讀取（列表 + 單筆）

    ```javascript
    // GET /members  → 200 + 會員陣列（可用 ?level=VIP 篩選）
    router.get("/", (req, res) => {
      const filterMembers = filterByQuery(members, req.query); // 用到 req.query
      return res.status(200).json(filterMembers);
    });

    // GET /members/:id  → 200 + 單一會員，或 404
    router.get("/:id", (req, res) => {
      const { id } = req.params;                                // 用到 req.params
      const findMember = members.find((item) => item.id === Number(id)); // 記得 Number() 轉型
      if (!findMember) {
        return res.status(404).json({ error: "會員不存在" });
      }
      return res.status(200).json(findMember);
    });
    ```
    
  :::note
  這裡剛好把第二節的 `req.query`（篩選，選填）跟 `req.params`（找特定一筆，必要）兩個觀念都用上了。
  :::

#### 5. 任務三：POST 新增（含驗證）

```javascript
// POST /members  → 201 + 新會員，或 400（驗證失敗）
router.post("/", (req, res) => {
  const body = req.body;                       // 靠 express.json() 才有值
  const validateMember = validateBody(body);
  if (!validateMember.valid) {
    return res.status(400).json({ error: validateMember.error });
  }
  const newMember = {
    id: nextId,
    name: String(body.name),                   // 防禦性轉型，避免傳進非字串
    level: String(body.level),
  };
  members.push(newMember);
  nextId++;                                    // id 用掉了才遞增
  return res.status(201).json(newMember);
});
```

#### 6. 任務四：PUT 更新 + DELETE 刪除

```javascript
// PUT /members/:id  → 200 + merge 後的會員，或 404
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const memberIndex = members.findIndex((item) => item.id === id);
  if (memberIndex === -1) {
    return res.status(404).json({ error: "會員不存在" });
  }
  // spread 合併：req.body 放後面，用來覆蓋舊欄位
  // 例：PUT /members/1 body { level: 'normal' } → name 會被保留，只有 level 被更新
  members[memberIndex] = {
    ...members[memberIndex],
    ...req.body,
  };
  return res.status(200).json(members[memberIndex]);
});

// DELETE /members/:id  → 204 無 body，或 404
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const memberIndex = members.findIndex((item) => item.id === id);
  if (memberIndex === -1) {
    return res.status(404).json({ error: "會員不存在" });
  }
  members.splice(memberIndex, 1);
  return res.status(204).end();                // 204 不帶 body，用 .end() 結束
});

module.exports = router;
```
:::tip
PUT 用 `...members[memberIndex]` 在前、`...req.body` 在後，這個順序就是「部分更新（partial update）」的關鍵：舊資料先鋪底，新資料只覆蓋有傳的欄位，沒傳的欄位（例如 `name`）自動保留。
:::

#### 7. 任務五：POST /uploadImage 圖片上傳

- `express.json()` 只能解析 JSON，遇到檔案上傳的 `multipart/form-data` 需要另外的套件（這裡用 `formidable`）：

  ```javascript
  const express = require("express");
  const fs = require("node:fs");
  const { formidable } = require("formidable");

  const uploadDir = process.env.UPLOAD_DIR || "/tmp/uploads";
  const maxFileSize = (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

  fs.mkdirSync(uploadDir, { recursive: true }); // 確保上傳目錄存在

  const router = express.Router();

  router.post("/", (req, res) => {
    const form = formidable({ uploadDir, maxFileSize, keepExtensions: true });
    form.parse(req, (error, field, files) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (!files || !files.image) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      // 注意：formidable v3 的 files.image 是陣列，要判斷後取 [0]
      let file = files.image;
      if (Array.isArray(file)) {
        file = file[0];
      }
      return res.status(200).json({
        filename: file.originalFilename,
        sizeKB: Math.round(file.size / 1024),
        savedPath: file.filepath,
      });
    });
  });

  module.exports = router;
  ```

#### 8. 任務六：`app.js` 組裝（middleware 順序是重點）

```javascript
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const membersRouter = require("./routes/members");
const uploadImageRouter = require("./routes/uploadImage");
const swaggerDoc = require("./fixtures/swagger.json");

const app = express();

// 順序很重要：middleware 一定要在 router 之前
app.use(cors());                 // 1. 解跨域
app.use(express.json());          // 2. 解析 JSON body（否則 req.body 是 undefined）
app.use("/members", membersRouter);        // 3. 掛會員路由
app.use("/uploadImage", uploadImageRouter); // 4. 掛上傳路由
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc)); // 5. Swagger 文件頁

// 注意：這裡不呼叫 app.listen()，交給 server.js
module.exports = app;
```

- 對應的 `server.js`（啟動點）：

  ```javascript
  require("dotenv").config();
  const app = require("./app");

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
    console.log(`📘 Swagger UI: http://localhost:${PORT}/docs`);
  });
  ```

  :::info
  呼應第四節：`cors()` 跟 `express.json()` 這兩個 middleware 為什麼一定要放在路由前面？因為 Express 是「照掛載順序」依序執行清單的，如果 `express.json()` 掛在路由後面，請求跑到路由 handler 時 `req.body` 都還沒被解析好，就會是 `undefined`。
  :::

#### 9. CRUD + 上傳 各方法對應狀態碼速查

| 方法與路徑 | 情境 | 成功狀態碼 | 失敗狀態碼 |
| --- | --- | --- | --- |
| `GET /members` | 取得列表(可篩選) | 200 | — |
| `GET /members/:id` | 取得單筆 | 200 | 404(會員不存在) |
| `POST /members` | 新增 | 201 | 400(缺 name/level) |
| `PUT /members/:id` | 部分更新 | 200 | 404(會員不存在) |
| `DELETE /members/:id` | 刪除 | 204(無 body) | 404(會員不存在) |
| `POST /uploadImage` | 上傳圖片 | 200 | 400(沒帶檔案) / 500(解析錯誤) |


## 資料來源

**課程原始講義**

- [Day 7 - Express 框架入門](https://hackmd.io/hmdYIyjOQ_uXvxjmjXj59g?view)
- [Day 8 - 網址規則、req.params 與 req.query](https://hackmd.io/efl34vvNRUahl-zs5andDQ?view)
- [Day 9 - Middleware 概念與應用](https://hackmd.io/8Nbuef24QLeW2Uy68MTZxw?view)
- [Day 10 - Router 拆分與模組化](https://hackmd.io/8h-HH5WvSeClpuzKCLtFFA?view)
- [Day 11 - CRUD 實作與資料驗證](https://hackmd.io/gMFdvWuCRR21CWDcQI5rSw?view)
- [第三週作業 repo — 健身房會員管理 API](https://github.com/MalricHsu/node-js-week3-2026)

**補充查證資料**

- [Express 官方文件 — Routing](https://expressjs.com/en/guide/routing/)
- [Express 官方文件 — Using middleware](https://expressjs.com/en/guide/using-middleware/)
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [MDN — Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN — Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [cors — npm 套件文件](https://www.npmjs.com/package/cors)
- [RESTful API 資源命名慣例](https://restfulapi.net/resource-naming/)