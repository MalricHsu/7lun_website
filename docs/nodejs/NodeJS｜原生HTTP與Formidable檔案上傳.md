---
title: NodeJS｜ 原生HTTP與Formidable檔案上傳
sidebar_position: 4
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-06-27
---

:::warning
- 本文使用使用原生 `node:http` + `formidable v3`，不依賴 `Express`，手刻一個檔案上傳 server。
:::


### 一、Formidable套件

#### 1. 主要解決情境

- 瀏覽器上傳檔案時，HTTP request 的 `Content-Type` 是 `multipart/form-data`。這種格式會把檔案內容切成多個區塊（part），夾雜著欄位名稱、檔名、MIME type 等 metadata 一起傳送。

- 原生 Node.js 的 `req` 只是一個 stream，你拿到的是一串`原始 bytes`，沒辦法直接知道哪裡是檔案內容、哪裡是欄位名稱。

- formidable 就是幫你做這件事：

  ```
  [瀏覽器] ──multipart/form-data──> [Node.js req stream]
                                          ↓
                                     formidable 解析
                                          ↓
                            fields（文字欄位）+ files（檔案）
  ```

- 圖解
  ![formidable解析流程](/img/node04-1.png)
#### 2. 核心概念

- formidable 的運作分兩層：
  - **Stream層（上傳時）**：邊接收 bytes、邊即時解析，不是等全部收完才處理
  - **解析層（解析時）**：把解析好的結果整理成 `fields` 和 `files` 物件，交給你的 `callback`

- 這也是為什麼它有兩種錯誤路徑，兩層各自可能出錯（後面會說明）。

### 二、formidable 怎麼用

#### 1. 常用語法速查（v3）

  | 語法 | 說明 |
  |------|------|
  | `const { formidable } = require("formidable")` | v3 用 named import 引入 |
  | `formidable({ uploadDir, maxFileSize, keepExtensions })` | 建立解析器 |
  | `uploadDir` | 上傳的檔案要存到哪個目錄 |
  | `maxFileSize` | 允許的最大檔案大小（bytes） |
  | `keepExtensions: true` | 存檔時保留原始副檔名 |
  | `form.parse(req, (err, fields, files) => {})` | 解析請求 |
  | `files.欄位名稱[0]` | v3 每個欄位是陣列，取第一個檔案 |
  | `file.originalFilename` | 原始檔名 |
  | `file.size` | 檔案大小（bytes） |
  | `file.filepath` | formidable 存到磁碟的實際暫存路徑 |
  | `file.mimetype` | 檔案類型（如 `image/jpeg`） |

#### 2. 引入與建立解析器

  ```javascript
  // v3 用 named import
  const { formidable } = require("formidable");

  const form = formidable({
    uploadDir: "/tmp/uploads",  // 檔案暫存到哪個資料夾
    maxFileSize: 5 * 1024 * 1024, // 最大允許幾 bytes（這裡是 5MB）
    keepExtensions: true,         // 保留原始副檔名（.jpg、.png…）
  });
  ```

#### 3. 解析請求

  ```javascript
  form.parse(req, (error, fields, files) => {
    // error：解析失敗原因
    // fields：文字欄位（如 <input type="text">）
    // files：上傳的檔案
  });
  ```

#### 4. files 的結構

- v3 開始，同名欄位統一包成陣列：

  ```javascript
  // 前端 <input type="file" name="file" />
  const file = files.file[0]; // 永遠是陣列，單檔取第一個

  // 前端 <input type="file" name="image" multiple />
  const images = files.image; // 多檔是陣列，可以 forEach
  ```

#### 5. 兩種錯誤路徑

- formidable 有兩層，兩層各自可能出錯：

  ```
  stream 層出錯（如網路中斷）→ 觸發 error 事件 → form.on("error")
  解析層出錯（如超過大小限制）→ 進入 callback 的 error 參數
  ```

- 但實際上，`form.parse()` 的 callback error 是 **formidable** 內部訂閱 `error` 事件後轉接給你的，所以兩者收到的是同一個` error`。

- 定位上應該這樣分工：

  | | `form.on("error")` | `form.parse()` callback error |
  |---|---|---|
  | 定位 | 監控 / 副作用 | 主要錯誤回應 |
  | 適合做什麼 | 記 log、刪暫存檔 | 送 HTTP 錯誤回應給 client |

#### 6. formidable 不負責的事

- 壓縮 / 轉檔（要另外用 `sharp` 等套件處理）
- 驗證檔案類型（要自己檢查 `mimetype`）
- 永久儲存（只是暫存，後續要自己移動或刪除）

### 三、實際範例

#### 1. 專案架構

  ```
  請求進來
    └─ createUploadServer()   建立 http.Server、確保上傳目錄存在
         └─ router()          依 method + url 分派路由
              └─ handleUpload()        formidable 解析 multipart
                   ├─ parseFileMetadata()   整理 file 物件成乾淨的 metadata
                   └─ formatUploadLog()     產出 log 字串
  ```

- 路由規格：

  | method | url | 對應處理 |
  |--------|-----|---------|
  | POST | `/coaches/avatar` | `handleUpload` |
  | 其他 | 任意 | 回 404 |

- 檔案 index.js

#### 2. 各任務拆解

- **任務一：`getUploadConfig()`**

  - 從 `process.env` 讀設定，提供預設值，讓後續所有函式透過 `config` 取得設定，不直接讀 env。

  ```javascript
  function getUploadConfig() {
    const uploadDir = process.env.UPLOAD_DIR || "/tmp";
    const maxFileSize = (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;
    const gymName = process.env.GYM_NAME || "未命名健身房";
    return { uploadDir, maxFileSize, gymName };
  }
  ```

  :::note 
    - env 讀進來的都是字串，用 `Number()` 轉型後再做數學運算。
    - `maxFileSize` 單位是 bytes，所以 MB 要乘 `1024 * 1024`。
  :::

- **任務二：`getFileExtension()`**

  - 從檔名取副檔名，一律回小寫。

  ```javascript
  function getFileExtension(filename) {
    const dotIndex = filename.lastIndexOf(".");
    if (dotIndex === -1) return "";
    return filename.slice(dotIndex).toLowerCase();
  }
  ```

  :::note
    - 用 `lastIndexOf(".")` 只取最後一個點，處理 `archive.tar.gz` → `.gz`。
    - 沒有點（如 `README`）回空字串 `""`。
  :::

- **任務三：`parseFileMetadata()`**

  - 吃 formidable 的 file 物件，整理成乾淨的 metadata 供後續使用。

  ```javascript
  function parseFileMetadata(file) {
    return {
      filename: file.originalFilename,
      sizeKB: Math.round(file.size / 1024),
      ext: getFileExtension(file.originalFilename),
    };
  }
  ```

  - 這裡用到了 formidable file 物件的 `originalFilename` 和 `size`，搭配任務二的 `getFileExtension` 取副檔名。

- **任務四：`formatUploadLog()`**

  - 吃 `metadata + config`，產出一行 log 字串。

  ```javascript
  function formatUploadLog(meta, config) {
    return `[${config.gymName}] Uploaded ${meta.filename} (${meta.sizeKB} KB) → ${config.uploadDir}`;
  }
  // [FitClub] Uploaded leo.jpg (245 KB) → /tmp/uploads
  ```

- **任務五：`router()` + `handleUpload()`**

  - `router` 只看 method + url，把請求分派給對應的 handler。

  - `handleUpload` 是核心：建立 formidable、處理兩種錯誤路徑、成功後回傳 JSON。

  - 這裡應用了第二節的分工概念：`form.on("error")` 只記 log，回應統一交給 `form.parse()` 的 callback 處理。

  ```javascript
  function router(req, res, config) {
    const handleUpload = (req, res, config) => {
      const form = formidable({
        uploadDir: config.uploadDir,
        maxFileSize: config.maxFileSize,
        keepExtensions: true,
      });

      // 監控副作用：記 log、未來可加清暫存檔邏輯
      form.on("error", (error) => {
        console.log(error);
      });

      // 主要回應邏輯
      form.parse(req, (error, fields, files) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error.message }));
          return;
        }
        const file = files.file && files.file[0];
        if (!file) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "No file uploaded" }));
          return;
        }

        const meta = parseFileMetadata(file);
        console.log(formatUploadLog(meta, config));

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          filename: meta.filename,
          sizeKB: meta.sizeKB,
          ext: meta.ext,
          savedPath: file.filepath,
        }));
      });
    };

    const handleNotFound = (req, res) => {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    };

    if (req.url === "/coaches/avatar" && req.method === "POST") {
      handleUpload(req, res, config);
    } else {
      handleNotFound(req, res);
    }
  }
  ```

- **任務六：`createUploadServer()`**

  - 建立 server，確保上傳目錄存在後回傳 server instance。

  ```javascript
  function createUploadServer(config) {
    if (!fs.existsSync(config.uploadDir)) {
      fs.mkdirSync(config.uploadDir, { recursive: true });
    }
    const server = http.createServer((req, res) => {
      router(req, res, config);
    });
    return server;
  }
  ```

  :::note
    - `recursive: true` 讓 `mkdirSync` 可以一次建立多層目錄（如 `/tmp/uploads/gym`）。
    - 這裡只回傳 server，不呼叫 `server.listen()`，那是 `app.js` 的責任，職責分離。
  :::

### 四、資料來源

- [formidable - npm 官方頁面](https://www.npmjs.com/package/formidable)
- [NodeJs第二週講義](https://hackmd.io/-TBlkBMKTl-oUa_T6QYDAA?view=)
- [六角學院 Day 5 每日任務](https://hackmd.io/7MEEiyr_Szi65frJn17seg)
- [六角學院範例題目](https://github.com/hexschool/node-js-week2-2026)