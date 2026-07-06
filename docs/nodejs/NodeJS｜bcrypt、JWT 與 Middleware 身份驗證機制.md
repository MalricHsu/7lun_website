---
title: NodeJS｜Bcrypt、JWT 與 Middleware 身份驗證機制
sidebar_position: 6
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-07-06
---

### 一、Bcrypt 雜湊密碼

#### 1. 為什麼密碼不能明碼儲存

- 資料庫一旦外洩（被入侵、備份流出、內部人員誤操作），明碼密碼會直接曝光。而多數使用者在不同網站重複使用同一組密碼，等於一次外洩、全網淪陷。因此後端的鐵則是：**伺服器永遠不該知道使用者的原始密碼**，資料庫裡只能存「經過雜湊處理」的結果。

#### 2. 雜湊（Hash）不是加密（Encrypt）

- 雜湊是一種**單向函式**，把任意長度的輸入轉換成固定長度的輸出，且無法從輸出反推回原始輸入。它有四個重要特性：

    | 特性 | 說明 |
    | --- | --- |
    | 不可逆 | 無法從雜湊值反推原始密碼 |
    | 固定長度輸出 | 無論輸入多長，輸出長度固定 |
    | 雪崩效應 | 輸入只要有微小變動，輸出就會產生巨大差異 |
    | 相同輸入相同輸出 | 相同密碼永遠產生相同雜湊值 |

- 跟加密比較會更清楚兩者的差異：

    | | 雜湊 Hash | 加密 Encrypt |
    | --- | --- | --- |
    | 方向 | 單向，不可逆 | 雙向，可用金鑰解回原文 |
    | 用途 | 密碼儲存、完整性驗證 | 傳輸保密（如 HTTPS） |
    | 驗證方式 | 把輸入重新雜湊一次，比對結果 | 解密後比對 |

- 密碼要的是 **「不可逆」** ，連工程師拿到資料庫也還原不出原始密碼，所以用**雜湊**而不是加密。驗證登入時不是「解開」儲存值，而是把使用者這次輸入的密碼 **再雜湊一次** ，看結果是否一致。

- 最後一個特性（相同輸入相同輸出）會衍生一個問題：如果兩個用戶密碼相同，資料庫裡的雜湊值也會一模一樣。駭客可以預先建立「常見密碼 → 雜湊值」的對照表（[彩虹表](https://zh.wikipedia.org/zh-tw/%E5%BD%A9%E8%99%B9%E8%A1%A8)，Rainbow Table）來反查，讓雜湊保護失效，這正是下一段 salt 要解決的問題。

- 雜湊跟加密的比較圖表

   ![jsonwebtoken解析流程](/img/nodejs06-6.png)

#### 3. 一般雜湊還不夠：salt 與 cost factor

- 單純用 **SHA-256** 之類的快速雜湊還有兩個弱點：一是前面提到的彩虹表攻擊，二是**算得太快**——快速雜湊每秒可以被暴力嘗試數十億次。

- bcrypt 針對這兩點各給一個解法：
    - **salt（鹽）**：每次雜湊前隨機產生一段字串混入密碼，所以即使兩個人密碼相同，存進資料庫的雜湊值也完全不同，彩虹表直接失效。salt 會包含在最終的雜湊字串裡，比對時 bcrypt 自己會取出來用，不需要另外儲存。
    - **cost factor（成本因子）**：控制運算重複的輪數，設 `10` 代表 2^10 = 1024 輪。它讓雜湊「刻意變慢」，對單次登入的使用者只是幾十毫秒，對要嘗試上億次的攻擊者卻是天文數字的時間成本。

- 可以用一支小腳本實際驗證 salt 的效果——同一組密碼雜湊兩次，結果完全不同：

    ```javascript
    // bcrypt-demo.js
    const bcrypt = require('bcrypt');

    async function main() {
    const hash = await bcrypt.hash('1q2w3e4r', 10);
    console.log('hash：', hash);

    const again = await bcrypt.hash('1q2w3e4r', 10);
    console.log('同密碼再洗一次一樣嗎？', hash === again); // false（每次 salt 不同）

    console.log('compare 對的密碼：', await bcrypt.compare('1q2w3e4r', hash)); // true
    console.log('compare 錯的密碼：', await bcrypt.compare('wrong', hash));    // false
    }

    main();
    ```

- 執行 **`hash === again`** 印出 **`false`**，正是 salt 在發揮作用的直接證據，因為雜湊結果每次都不一樣，但兩個都能被各自對應的明文 **`compare`** 出 **`true`**。


#### 4. bcrypt 兩個核心方法

```javascript
const bcrypt = require('bcrypt');

// 註冊：把明碼變成雜湊值再存
const salt = await bcrypt.genSalt(10);            // 產生 salt（cost factor = 10）
const hashed = await bcrypt.hash(password, salt); // 雜湊，結果類似 $2b$10$N9qo8uLO...

// 登入：比對「這次輸入的明碼」與「資料庫的雜湊值」
const isMatch = await bcrypt.compare(inputPassword, user.password);
// true = 密碼正確；false = 密碼錯誤
```

- 注意 **`compare`** 不是 **「解密後比對」**，而是內部把 `inputPassword` 用同一份 salt 重新雜湊一次，看結果是否等於儲存值。

#### 5. 為什麼一定要用 async/await

- 這裡有兩層原因：一層是 bcrypt 的特性，另一層是 JavaScript 的語言機制。

    - **bcrypt 是刻意設計得很慢的運算，同步版本會卡死整台伺服器。**
        - cost factor 為 10 時，一次雜湊約需數十到上百毫秒。Node.js 的主執行緒（Event Loop）是單執行緒的，如果用同步版本 `bcrypt.hashSync()`，這段時間內整個伺服器動彈不得，**所有其他使用者的請求都無法處理**。假設同時 100 人註冊、每人卡 100ms，最後一個人要等 10 秒。
        - 非同步版本 `bcrypt.hash()` 會把運算丟到背景的執行緒池（libuv thread pool）執行，主執行緒立刻被釋放繼續接其他請求，算完再透過 Promise 通知結果。**伺服器情境下永遠用非同步版本。**

    - **非同步函式回傳的是 Promise，不用 await 拿不到真正的值。**

        ```javascript
        const hashed = bcrypt.hash(password, salt); // ❌ 沒有 await
        console.log(hashed); // Promise { <pending> }，不是雜湊字串，存進資料庫的會是垃圾
        ```

- 而且這段流程有嚴格的先後依賴：要**先有 salt 才能 hash**、要**先有 hash 結果才能存檔或回傳**。`await` 的意義就是「等這個 Promise 完成、取出真正的值，再往下走」，讓有順序依賴的非同步程式碼寫起來像同步一樣直觀：

        ```javascript
        async function hashPassword(password) {
        const salt = await bcrypt.genSalt(10);            // 等 salt 產生完
        const hashed = await bcrypt.hash(password, salt); // 等雜湊算完
        return hashed;                                    // 這時才是真正的字串
        }
        ```

  :::note
  **一句話總結：用非同步是為了不阻塞伺服器，用 await 是為了正確拿到非同步的結果並維持執行順序。**
  :::

- 圖解

  ![bcrypt解析流程1](/img/nodejs06-4.png)

  ![bcrypt解析流程2](/img/nodejs06-5.png)


### 二、JWT：無狀態的身份憑證

#### 1. 問題的源頭：HTTP 是無狀態的

- 每個 HTTP 請求都是獨立的，伺服器天生不記得「上一個請求是誰發的」。登入成功後，後續請求必須有辦法證明「我就是剛剛登入的那個人」。

#### 2. 兩種解法：Session vs JWT

- **Session（有狀態）**：登入成功後，伺服器在自己這邊（記憶體）建一筆紀錄「session id abc123 = 使用者 1 號」，把 session id 放進 cookie 給前端；之後每個請求伺服器都要拿 id 去查那份紀錄。**缺點**：伺服器要維護狀態。一旦服務水平擴展成多台機器，A 機器發的 session B 機器查不到，還得額外做 session 共享。

- **JWT（無狀態）**：將 **「身份資料」** 直接放進 Token 交給前端保管，**伺服器什麼都不存**。任何一台機器只要有 secret，就能獨立驗證 Token 是否合法。

  :::note
  - Ｑ：前端自己保管，怎麼防止竄改（例如把 userId 改成別人的）？
  - Ａ：**簽名**。
  :::

#### 3. JWT 的三段結構與簽名原理

- 一個 JWT 長這樣（用 `.` 分成三段）：

  ```
  eyJhbGciOiJIUzI1NiJ9 . eyJ1c2VySWQiOjEsImV4cCI6MTcyMH0 . SflKxwRJSMeKKF2QT4fwpM
          Header                    Payload                     Signature
  ```

  | 區段 | 內容 | 性質 |
  | --- | --- | --- |
  | Header | 演算法與類型，如 `{ "alg": "HS256", "typ": "JWT" }` | Base64URL 編碼，公開可讀 |
  | Payload | 身份資料（userId、email）與宣告（exp 過期時間、iat 簽發時間） | Base64URL 編碼，公開可讀 |
  | Signature | 用 secret 對「Header.Payload」計算出的 HMAC-SHA256 值 | 防偽鋼印 |

- 三個關鍵認知：

  - **Base64 是編碼不是加密**：Payload 任何人都解得開、看得到，所以 **絕對不能放密碼等敏感資料**。
  - **簽名保證的是「不可竄改」而非「不可讀」**。只要 Payload 被改動任何一個字元，伺服器重新計算出的簽名就對不上第三段，驗證直接失敗。
  - **沒有 secret 就偽造不出合法簽名**。secret 只存在伺服器端（環境變數），是整套機制的命脈。

- 所以 JWT 的本質是：**一份「內容公開、但無法竄改」的身份憑證**。伺服器不需要記得發過哪些 Token，只要能確認簽名是自己蓋的，就能信任裡面的內容。

#### 4. 登入流程：Token 是怎麼發出來的

- 用 `jsonwebtoken` 套件簽發：

  ```javascript
  const jwt = require('jsonwebtoken');
  const SECRET = process.env.JWT_SECRET; // 只有伺服器知道

  const token = jwt.sign(
    { userId: user.id, email: user.email }, // Payload：最小必要的身份資訊
    SECRET,                                  // 簽名用的鑰匙
    { expiresIn: '7d' }                      // 有效期限，會寫進 Payload 的 exp
  );
  ```

- **完整登入流程逐步拆解**：

  ![jsonwebtoken解析流程](/img/nodejs06-1.png)

- **類比**：登入像是在健身房櫃檯核對身份後拿到一條「防偽手環」（Token）。之後進出各設施只要出示手環，工作人員檢查手環是真的（驗簽名）、沒過期（exp）就放行，不必每次回櫃檯重新核對身份，櫃檯也不用登記今天發過哪些手環。`expiresIn` 就是手環的效期，過期就得重新登入換一條新的。


### 三、JWT 驗證與自訂 Auth Middleware

#### 1. Token 放哪裡：Authorization Header 與 Bearer

- 慣例是放在請求的 `Authorization` header，前面加上 `Bearer `（持有者）前綴：

  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.SflKxw...
  ```

- 在 Express 裡透過 `req.headers.authorization` 讀取，拿到的是**包含 `Bearer ` 前綴的完整字串**。

#### 2. authMiddleware：兩階段檢查

- 驗證邏輯抽成一個 middleware，掛在需要保護的路由前面。它其實做了**兩階段檢查**，各自擋掉不同的非法請求：

  ```javascript
  const jwt = require('jsonwebtoken');
  const SECRET = process.env.JWT_SECRET;

  function authMiddleware(req, res, next) {
    // 第一階段：檢查是否有Token以及格式是否正確
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: '未提供 Token' });
    }
    const token = authHeader.split(' ')[1];

    // 第二階段：jwt.verify 密碼驗證
    try {
      const decoded = jwt.verify(token, SECRET); // 失敗會「拋出錯誤」而不是回傳 false
      req.user = decoded;                        // 把身份資訊掛到 req 上
      next();                                    // 放行給下一層
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Token 無效或已過期' });
    }
  }
  ```

- **第一階段**擋兩種請求：
  - 完全沒帶 header 的（`!authHeader`）、格式不對的（沒有 `Bearer ` 前綴）。
  - `split(' ')[1]` 是用空格把字串切成 `['Bearer', 'eyJ...']`，取索引 1 得到純 Token。注意這裡用 `return` 直接結束、**不呼叫 next()**，請求到此為止。

#### 3. jwt.verify 內部做了什麼

- `jwt.verify(token, SECRET)` 的內部流程：

  - 把 Token 用 `.` 切成三段。
  - 拿 Header + Payload 兩段，用伺服器手上的 SECRET **重新計算一次簽名**。
  - 與 Token 第三段的簽名比對，對不上代表內容被改過、或這個 Token 是用別的 secret 簽的（偽造），拋出 `JsonWebTokenError: invalid signature`。
  - 簽名合法後，再檢查 Payload 的 `exp` 是否早於現在時間，過期則拋出 `TokenExpiredError: jwt expired`。
  - 全部通過，回傳解碼後的 Payload 物件（就是當初 `jwt.sign` 放進去的 `{ userId, email }` 加上 `iat`、`exp`）。

- 關鍵設計：**verify 失敗是「拋出錯誤」而不是「回傳 false」**，所以必須包 `try...catch`，否則未捕獲的例外會讓伺服器直接掛掉。

- 圖表解釋

   ![jwt.verify解析流程](/img/nodejs06-2.png)
   
   ![jwt.verify解析流程](/img/nodejs06-3.png)


#### 4. req.user 與 next()：驗證通過之後

  ```javascript
  req.user = decoded;
  next();
  ```

- `req` 物件在同一個請求的整條 middleware 鏈中是**同一個物件**。把 decoded 掛上去後，後面的路由 handler 直接用 `req.user.userId` 就能知道「現在是誰」，不必重新解一次 Token：

  ```javascript
  app.get('/profile', authMiddleware, (req, res) => {
    // 能走到這裡，代表 authMiddleware 已放行，req.user 一定存在
    res.json({ status: 'success', data: req.user });
  });
  ```

- 而 `next()` 是把控制權交給下一層，middleware 若既不呼叫 `next()` 也不回應，請求會永遠掛著直到 timeout。

#### 5. 為什麼失敗都回 401（與 403 的區別）

- **401 Unauthorized**：「你是誰我無法確認」——沒帶 Token、Token 無效、Token 過期都屬於這類。前端收到 401 的標準處理是導回登入頁。
- **403 Forbidden**：「我知道你是誰，但你沒有權限做這件事」，例如一般會員想呼叫管理員 API。

### 四、Middleware 三種類型與錯誤處理機制

> 🚪 **機場通關比喻**：報到 → 安檢 → 海關 → 登機門，每一關都是一個守門員——能攔你、能放行（`next()`），一個 request 從進來到得到回應，就是依序被 Express 丟過每一關 `app.use(...)` 的過程。

#### 1. 三種類型總覽

| 類型 | 掛法 | 作用範圍 | 例子 |
| --- | --- | --- | --- |
| 應用層級 | `app.use(fn)` / `app.use(路徑, fn)` | 所有（或特定前綴的）請求 | `express.json()`、`cors()`、log 紀錄 |
| 路由層級 | `app.get(路徑, fn, handler)` 或掛在 `router` 上 | 只有特定路由 | `authMiddleware`、參數驗證 |
| 錯誤處理 | `app.use((err, req, res, next) => {})` | 接住 `next(err)` 丟出的錯誤 | 統一錯誤回應格式 |

```javascript
// 應用層級：每個請求都會經過
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 路由層級：只保護這條路由
app.get('/profile', authMiddleware, (req, res) => { ... });

// 錯誤處理：四個參數，放在所有路由之後
app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', message: err.message });
});
```

#### 2. 錯誤是怎麼「流」到最後那個 err 的

- 以測試路由為例，把整條錯誤的旅程拆開：

  ```javascript
  app.get('/error-test', (req, res, next) => {
    next(new Error('這是一個測試錯誤'));
  });

  // ...其他路由...

  app.use((err, req, res, next) => {
    res.status(500).json({ status: 'error', message: err.message });
  });
  ```

- **第 1 步：`new Error('這是一個測試錯誤')`** 建立一個 Error 物件，身上有 `.message`（傳入的字串）和 `.stack`（錯誤堆疊）。此時它只是一個普通物件，還沒有任何「錯誤處理」發生。

- **第 2 步：`next(err)` 是關鍵開關。** Express 的規則：

  - `next()` 不帶參數 = 「正常，交給下一層」
  - `next(任何東西)` 帶了參數 = 「出事了，切換到錯誤模式」

- 一旦進入錯誤模式，Express 會**跳過後面所有一般的路由與 middleware（包含 404 catch-all）**，直接往下找第一個「四參數」的函式。

- **第 3 步：Express 怎麼認出誰是錯誤處理器？** 純粹看**函式的參數數量**（JavaScript 可用 `fn.length` 讀到）。四個參數 `(err, req, res, next)` 就是錯誤處理器，**三個參數就是一般 middleware**。這就是為什麼四個參數缺一不可，就算用不到 `next` 也得寫著佔位，少一個 Express 就把它當普通 middleware，`next(err)` 會直接略過它。

- **第 4 步：同一個物件被傳到底。** 你在路由裡 `next(err)` 傳的那個 Error 物件，就是錯誤處理 middleware 收到的 `err`，一路被 Express 原封不動傳遞過來。所以 `err.message` 讀出來就是當初 `new Error()` 時給的 `'這是一個測試錯誤'`，最後組成 500 回應。

  ```
  new Error('...') → next(err) → Express 切換錯誤模式，跳過一般路由
                              → 找到第一個四參數函式
                              → 把同一個 err 物件塞進第一個參數
                              → err.message 就是當初傳入的字串
  ```

#### 3. 擺放順序

- **擺放順序決定一切**：Express 依註冊順序逐一比對，所以固定的架構是：

  ```javascript
  app.use(express.json());        // 1. 應用層級（前置處理）放最前
  app.get('/login', ...);         // 2. 各路由（含路由層級 middleware）
  app.get('/profile', authMiddleware, ...);

  app.use((req, res) => {         // 3. 404：所有路由都沒比對到才會走到這
    res.status(404).json({ status: 'error', message: '找不到此路由' });
  });

  app.use((err, req, res, next) => { // 4. 錯誤處理：整個 app 的最後一道安全網
    res.status(500).json({ status: 'error', message: err.message });
  });
  ```

- 404 handler 之所以能當「找不到路由」用，是因為它放在所有路由之後，正常請求早就被前面的路由接走了，能流到這裡的必然是沒人認領的請求。而 `next(err)` 的搜尋是「從當前位置往下找四參數函式」，錯誤處理放在最末端，才能保證**任何位置**拋出的錯誤都找得到它。也因為錯誤模式會跳過一般 middleware，`next(err)` 不會被 404 handler 攔截。



### 五、實戰整合

#### 1. 專案結構與五個任務總覽

```
node-js-week4-2026/
├── app.js                     # 任務五：組裝 app
├── server.js                  # 啟動點
├── middlewares/
│   └── verifyToken.js         # 任務一：JWT 守門員
├── routes/
│   └── auth.js                # 任務二～四：register / login / me
├── fixtures/
│   ├── users.json             
│   └── swagger.json           # API 規格文件（不需更動）
└── .env                      # 填入 JWT_SECRET
```


| 任務 | 檔案 / 路由 |
| --- | --- | 
| 任務一：JWT 守門員 | `middlewares/verifyToken.js` | 
| 任務二：註冊 | `POST /auth/register` | 
| 任務三：登入 | `POST /auth/login` | 
| 任務四：取得個人資料 | `GET /auth/me`（掛 `verifyToken`） | 
| 任務五：組裝 app | `app.js` | 

#### 2. 任務一：verifyToken 

```javascript
// middlewares/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "false", message: "請先登入" });
  }
  const token = authHeader.split(" ")[1];
  try {
    // 把解出來的資料放進 req.user
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: "false", message: "Token 無效或已過期" });
  }
};

module.exports = verifyToken;
```

- 兩階段檢查（格式 → `jwt.verify`）、`try...catch` 接住驗證失敗、成功才 `req.user = decoded` + `next()`。

#### 3. 任務二、三：register 與 login 完整實作

```javascript
// routes/auth.js（節錄）
const users = [...initialUsers]; // 複製 fixtures，不動到原始陣列
let nextId = initialUsers.length + 1;

// 把「產生 salt + hash」包成一個小函式方便重複使用
const handler = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ status: "false", message: "email 或 password 沒有填寫" });

  const existEmail = users.some((user) => user.email === email);
  if (existEmail)
    return res
      .status(400)
      .json({ status: "false", message: "email已經有人使用過" });

  const hashPassword = await handler(password);
  const newUser = { id: nextId, email: email, password: hashPassword };
  users.push(newUser);
  nextId++;
  return res.status(201).json({ status: "success", message: "註冊成功" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user)
    return res.status(401).json({ status: "false", message: "帳號或密碼錯誤" });

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword)
    return res.status(401).json({ status: "false", message: "帳號或密碼錯誤" });

  // 確認有找到 email、密碼有打對，才給他 token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
  return res.status(200).json({ status: "success", token });
});
```

- **`handler` 把 `genSalt` + `hash` 包成一個函式**：這裡多做了一層封裝，之後如果要重複用（例如「修改密碼」功能也要 hash），就不用重寫一次。
- **`nextId` 用獨立變數遞增，而不是 `users.length + 1`**：這是比較嚴謹的寫法，如果之後允許刪除使用者，`users.length + 1` 會產生重複 id，用獨立計數器遞增才不會出這個問題。
- **`login` 的兩個失敗分支（email 找不到、密碼比對失敗）回傳同一句「帳號或密碼錯誤」**

#### 4. 任務四：/auth/me 完整實作

```javascript
router.get("/me", verifyToken, (req, res) => {
  return res.status(200).json({ status: "success", user: req.user });
});
```

- `verifyToken` 掛在路徑跟 handler 中間，通過驗證後 `req.user` 已經是 `verifyToken` 塞進去的 decoded payload，直接回傳即可。

#### 5. 任務五：app.js 組裝順序

```javascript
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const authRouter = require("./routes/auth");
const swaggerDoc = require("./fixtures/swagger.json");

const app = express();

app.use(cors());          // 1. 跨域
app.use(express.json());  // 2. 解析 JSON body，之後 req.body 才讀得到值

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc)); // 3. Swagger UI（repo 已預先提供）

app.use("/auth", authRouter); // 4. /auth router：掛上 register、login、me 三支路由

app.use((req, res, next) => {       // 5. 404 守門員（三個參數，但沒有呼叫 next，一樣不算錯誤處理器）
  return res.status(404).json({ status: "false", message: "無此路由資訊" });
});

app.use((err, req, res, next) => {  // 6. 錯誤處理守門員（四個參數，一定要放最後）
  res.status(500).json({ err: err.name, message: err.message });
});

module.exports = app; // 不呼叫 app.listen()，交給 server.js
```


### 六、參考資料

- HackMD「助教天團」課程講義：Day 12 密碼安全與 bcrypt、Day 13 JWT 概念與簽發、Day 14 JWT 驗證與自訂 Middleware、Day 15 Middleware 三種類型
- HackMD「六角學院」課程講義：Week 4 — Node.js 進階操作（Cookie / Header / Axios，含 middleware 深入與 bcrypt/JWT 整合實戰）
- [hexschool/node-js-week4-2026](https://github.com/hexschool/node-js-week4-2026)：官方 Week 4 作業骨架 repo（README 任務規格、Swagger 文件、16 項 Jest 測試）
- [MalricHsu/node-js-week4-2026](https://github.com/MalricHsu/node-js-week4-2026)：本筆記第五節程式碼的實際來源（已完成 5 個任務的版本）
- [bcrypt - npm](https://www.npmjs.com/package/bcrypt)：cost factor 與 API 官方說明
- [jsonwebtoken - npm](https://www.npmjs.com/package/jsonwebtoken)：`sign` / `verify` 參數與錯誤類型（TokenExpiredError、JsonWebTokenError）
- [JWT.io](https://jwt.io/)：可互動解析 JWT 三段結構的官方工具
- [Express 官方文件 - Error Handling](https://expressjs.com/en/guide/error-handling.html)：`next(err)` 機制與四參數錯誤處理器
- [Express 官方文件 - Using middleware](https://expressjs.com/en/guide/using-middleware.html)：middleware 類型與掛載順序
- [MDN - HTTP 狀態碼](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status)：401 與 403 的語意區別