---
title: NodeJS｜ Express 入門
sidebar_position: 5
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-07-01
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

### 五、綜合實戰：完整 CRUD + 資料驗證

把前四節的內容全部串起來，完成一支具備資料驗證的完整 API。尚未接資料庫前，先用 JavaScript 陣列做 in-memory 儲存（重啟伺服器資料會清空，適合練邏輯）。

#### 1. Helper 函式：把重複邏輯抽出來

  ```javascript
  // 以 id 搜尋資料,找不到回傳 undefined
  function findById(list, id) {
    return list.find(item => item.id === Number(id));
  }

  // 驗證必填欄位是否齊全,回傳缺少的欄位陣列
  function validateFields(body, requiredFields) {
    return requiredFields.filter(field => !body[field]);
  }
  ```

#### 2. 完整範例（以 courses 為例）

  ```javascript
  // routes/courses.js
  const express = require('express');
  const router = express.Router();

  let courses = [
    { id: 1, name: '瑜伽入門', price: 1200 },
    { id: 2, name: '重訓基礎', price: 1500 },
  ];
  let nextId = 3;

  function findById(list, id) {
    return list.find(item => item.id === Number(id));
  }
  function validateFields(body, requiredFields) {
    return requiredFields.filter(field => !body[field]);
  }

  router.get('/', (req, res) => {
    res.status(200).json({ status: 'success', data: courses });
  });

  router.get('/:id', (req, res) => {
    const course = findById(courses, req.params.id);
    if (!course) {
      return res.status(404).json({ status: 'error', message: '找不到此課程' });
    }
    res.status(200).json({ status: 'success', data: course });
  });

  router.post('/', (req, res) => {
    const missingFields = validateFields(req.body, ['name', 'price']);
    if (missingFields.length > 0) {
      return res.status(400).json({ status: 'error', message: `缺少必填欄位：${missingFields.join(', ')}` });
    }
    const newCourse = { id: nextId++, name: req.body.name, price: req.body.price };
    courses.push(newCourse);
    res.status(201).json({ status: 'success', data: newCourse });
  });

  router.put('/:id', (req, res) => {
    const course = findById(courses, req.params.id);
    if (!course) {
      return res.status(404).json({ status: 'error', message: '找不到此課程' });
    }
    const missingFields = validateFields(req.body, ['name', 'price']);
    if (missingFields.length > 0) {
      return res.status(400).json({ status: 'error', message: `缺少必填欄位：${missingFields.join(', ')}` });
    }
    course.name = req.body.name;
    course.price = req.body.price;
    res.status(200).json({ status: 'success', data: course });
  });

  router.delete('/:id', (req, res) => {
    const index = courses.findIndex(item => item.id === Number(req.params.id));
    if (index === -1) {
      return res.status(404).json({ status: 'error', message: '找不到此課程' });
    }
    courses.splice(index, 1);
    res.status(204).end();
  });

  module.exports = router;
  ```

  ```javascript
  // app.js
  const express = require('express');
  const cors = require('cors');
  const coursesRouter = require('./routes/courses');

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/courses', coursesRouter);

  app.listen(3000, () => console.log('伺服器啟動中：http://localhost:3000'));
  ```

#### 3. CRUD 各方法對應狀態碼速查

| 方法 | 情境 | 成功狀態碼 | 失敗狀態碼 |
| --- | --- | --- | --- |
| `GET /` | 取得列表 | 200 | — |
| `GET /:id` | 取得單筆 | 200 | 404（找不到） |
| `POST /` | 新增 | 201 | 400（欄位缺失） |
| `PUT /:id` | 更新 | 200 | 404 / 400 |
| `DELETE /:id` | 刪除 | 204 | 404（找不到） |


### 六、資料來源


- [Express 框架入門](https://hackmd.io/hmdYIyjOQ_uXvxjmjXj59g?view)
- [網址規則、req.params 與 req.query](https://hackmd.io/efl34vvNRUahl-zs5andDQ?view)
- [Middleware 概念與應用](https://hackmd.io/8Nbuef24QLeW2Uy68MTZxw?view)
- [Router 拆分與模組化](https://hackmd.io/8h-HH5WvSeClpuzKCLtFFA?view)
- [CRUD 實作與資料驗證](https://hackmd.io/gMFdvWuCRR21CWDcQI5rSw?view)


- [Express 官方文件 — Routing](https://expressjs.com/en/guide/routing/)
- [Express 官方文件 — Using middleware](https://expressjs.com/en/guide/using-middleware/)
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [MDN — Cross-Origin Resource Sharing （CORS）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN — Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [cors（npm 套件文件）](https://www.npmjs.com/package/cors)
- [RESTful API 資源命名慣例](https://restfulapi.net/resource-naming/)