---
title: NodeJS｜ 模組化與 SRP 核心概念
sidebar_position: 3
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-06-22
slug: nodejs/nodejs-modules-and-srp
---

### 一、為什麼需要模組化？

- 想像你把所有程式碼（讀檔、驗證、寄信、資料庫存取）全部塞進同一個 `app.js`，幾個月後再回來看，就像找一根針在稻草堆裡。

- **模組化**的核心概念：
  - 把特定功能的程式碼抽出來，寫成獨立的檔案
  - 用 `module.exports` **匯出**，用 `require()` **匯入**
  - 讓每個檔案只做一件事，結構清晰、好維護

  ```
  專案資料夾/
  ├── app.js          ← 主程式，負責串接流程
  └── fileManager.js  ← 自訂模組，負責檔案操作
  ```

### 二、fs/promises — 非同步檔案操作

#### 1. 三種寫法比較

- Node.js 處理檔案讀寫，歷經三個演進階段：

  <table>
    <thead>
      <tr>
        <th width="30%">寫法</th>
        <th width="25%">優點</th>
        <th width="45%">缺點</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>同步 <code>readFileSync</code></td>
        <td>直覺、由上往下執行</td>
        <td><strong>會卡住伺服器</strong>，大檔案時所有使用者都要等</td>
      </tr>
      <tr>
        <td>非同步 Callback <code>readFile</code></td>
        <td>效能好，不卡伺服器</td>
        <td>多步驟時會形成<strong>回呼地獄</strong>（程式碼不斷往右縮排）</td>
      </tr>
      <tr>
        <td><strong>fs/promises + async/await</strong></td>
        <td>效能好 + 程式碼乾淨</td>
        <td>無</td>
      </tr>
    </tbody>
  </table>

- **同步範例（不推薦用在伺服器上）：**
  ```javascript
  const fs = require('fs');
  const data = fs.readFileSync('./file.txt', 'utf-8');  // 讀完才繼續
  console.log(data);
  ```

- **Callback 非同步（舊版，有回呼地獄問題）：**
  ```javascript
  const fs = require('fs');
  fs.readFile('./file.txt', 'utf-8', (err, data) => {
    console.log(data); // 後印出
  });
  console.log('我先印出！'); // 先印出
  ```

- **fs/promises + async/await（推薦）：**
  ```javascript
  // 注意：引入路徑是 'fs/promises'，不是 'fs'
  const fs = require('fs/promises');

  async function handleFile() {
    try {
      // await 讓程式等待這行完成，才繼續往下
      await fs.writeFile('./test.txt', '這是寫入的文字');
      console.log('1. 寫入成功！');

      const data = await fs.readFile('./test.txt', 'utf-8');
      console.log('2. 讀到的內容：', data);

    } catch (err) {
      // 發生任何錯誤（找不到檔案等），都會跳到這裡
      console.error('發生錯誤：', err.message);
    }
  }

   handleFile();
  ```

  :::note

  **關鍵觀念：**<br/>
  - `async` 宣告這個函式是「非同步函式」，內部才可以使用 `await`。<br/>
  - `await` 讓這一行「等待完成」後才繼續往下，讀起來像同步，執行起來不卡伺服器。

  :::

#### 2. 常用 API 整理

- 建立資料夾 — `fs.mkdir`

  ```javascript
  const fs = require('fs/promises');

  async function createFolder() {
    try {
      
      // recursive: true → 就算上層目錄不存在，也自動幫你建立
      await fs.mkdir('./logs', { recursive: true });
      
      console.log('資料夾建立成功！');
    } catch (err) {
      console.error('建立失敗：', err.message);
    }
  }
  ```

  :::note
  **`recursive: true` 是什麼？**
  - `recursive` 是「遞迴」的意思，代表「一層一層往下處理」。
  - 以 `fs.mkdir('./logs/june')` 為例，若 logs 還不存在，Node.js 預設會直接報錯。
  - 加上 `{ recursive: true }` 後，會從最上層開始依序自動建立每一層，直到目標資料夾建立完成。
  - 另外，若資料夾已存在，加了這個選項也不會報錯。
  :::


- 寫入檔案 — `fs.writeFile` / `fs.appendFile`

  ```javascript
  try {
    // writeFile：覆蓋寫入（若檔案存在，舊內容會被蓋掉；若不存在，自動建立）
    await fs.writeFile('./logs/test.txt', '第一行文字\n');

    // appendFile：附加寫入（接續原有內容往後貼）
    await fs.appendFile('./logs/test.txt', '這是新加的第二行文字\n');

    console.log('完成！');
  } catch (err) {
    console.error('失敗：', err.message);
  }
  ```

  | 方法 | 效果 |
  |------|------|
  | `writeFile` | 全部覆蓋（清空後重寫）|
  | `appendFile` | 附加在尾端 |

- 讀取檔案 — `fs.readFile`

  ```javascript
  try {
    // 記得加上 'utf-8'，否則會讀出看不懂的 Buffer 原始二進位資料
    const content = await fs.readFile('./logs/test.txt', 'utf-8');
    console.log('內容：\n', content);
  } catch (err) {
    console.error('讀取失敗：', err.message);
  }
  ```

- 重新命名或移動檔案 — `fs.rename`

  ```javascript
  try {
    // 改名：test.txt → report.txt
    await fs.rename('./logs/test.txt', './logs/report.txt');

    // 移動：只要改變前半段路徑即可（兼具「剪下貼上」效果）
    // await fs.rename('./logs/report.txt', './archive/report.txt');

    console.log('重新命名成功！');
  } catch (err) {
    console.error('失敗：', err.message);
  }
  ```

### 三、單一職責原則（SRP）

#### 1. 核心概念
- **「一個函式（或模組），只負責一件事。」**
- 換句話說：讓它需要被修改的理由只有一個。



- 把很多功能堆在同一個函式裡，會導致：
  - 程式碼越來越長，難以閱讀
  - 改 A 功能時，不小心壞掉 B 功能（牽一髮動全身）
  - 測試和除錯變得非常困難

#### 2. 錯誤示範 vs 正確示範

- **違反 SRP — 一個函式管三件事：**

  ```javascript
  const fs = require('fs/promises');

  // 這個函式同時做了：格式檢查、檔案寫入、記錄 Log
  // 任何一個部分需要修改，都要動到整個函式，風險極高
  async function registerUser(userData) {
    // 職責一：格式檢查
    if (!userData.email.includes('@')) {
      console.error('Email 格式錯誤');
      return;
    }

    try {
      // 職責二：寫入檔案
      await fs.writeFile('./users.json', JSON.stringify(userData));

      // 職責三：記錄 Log
      const log = `[LOG] ${userData.email} 於 ${new Date().toISOString()} 註冊\n`;
      await fs.appendFile('./activity.log', log);

      console.log('註冊成功');
    } catch (err) {
      console.error('操作失敗');
    }
  }
  ```

- ** 符合 SRP — 每個函式只做一件事：**

  ```javascript
  const fs = require('fs/promises');

  // 專家一：只負責「驗證」
  function validateEmail(email) {
    return email.includes('@');
  }

  // 專家二：只負責「儲存資料」
  async function saveUserData(userData) {
    await fs.writeFile('./users.json', JSON.stringify(userData));
  }

  // 專家三：只負責「記錄 Log」
  async function logActivity(message) {
    const log = `[LOG] ${message} - ${new Date().toISOString()}\n`;
    await fs.appendFile('./activity.log', log);
  }

  // 主流程：只負責「指揮調度」，自己不跳下去做雜事
  async function registerUser(userData) {
    if (!validateEmail(userData.email)) {
      console.error('Email 格式錯誤');
      return;
    }

    try {
      await saveUserData(userData);
      await logActivity(`使用者 ${userData.email} 註冊成功`);
      console.log('註冊成功');
    } catch (err) {
      console.error('註冊流程失敗');
    }
  }
  ```

  :::note

  **判斷準則：**
  描述函式功能時，如果需要用「**而且**」來連接，例如「驗證**而且**寫入**而且**記錄 Log」，就代表它違反了 SRP，需要拆分。

  :::

### 四、觀念總整理

| 概念 | 一句話記住 |
|------|-----------|
| **模組化** | 把程式碼依功能拆成不同檔案，用 `module.exports` + `require` 串接 |
| **fs/promises** | Node.js 讀寫檔案的現代寫法，搭配 `async/await` 兼顧效能與可讀性 |
| **try...catch** | 預防程式因錯誤崩潰，出錯時優雅地處理，而非直接當機 |
| **單一職責原則** | 一個函式只做一件事，讓修改範圍最小化，降低「改 A 壞 B」的風險 |

### 五、資料來源
- [NodeJS｜模組化](https://hackmd.io/LZCbpJ2LQpSA_X-IZUActw?view)
- [NodeJS｜SRP 核心概念](https://hackmd.io/ZPqNRjY-TUiW7SJ5uiLkBw?view)

