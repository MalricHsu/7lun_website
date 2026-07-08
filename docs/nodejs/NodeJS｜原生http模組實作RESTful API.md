---
title: NodeJS｜ 原生http模組實作RESTful API
sidebar_position: 2
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-05-18
slug: nodejs/nodejs-http-restful-api
---

- 使用 Node.js 原生 `http` 模組實作 Todo List RESTful API，沒有使用 Express，目的是搞懂底層的 request / response 怎麼運作。

### 一、專案結構

```
├── server.js        # 主程式：建立 HTTP server、處理路由
└── errorHandle.js   # 共用的錯誤處理函式
```

### 二、使用到的模組

  | 模組 | 用途 |
  | --- | --- |
  | `http` | Node.js 內建，建立 HTTP server |
  | `uuid` (`v4`) | 產生不重複的 todo `id`（需 `npm install uuid`） |
  | `./errorHandle` | 自己拆出來的錯誤回應模組，避免重複寫 |

### 三、API 路由設計（RESTful）

- RESTful 的核心精神：**用「HTTP method + URL」表達操作對象與動作**，而不是把動作塞在 URL 裡（例如 `/getTodos`、`/deleteTodo` 都是不好的設計）。

  | 方法 | 路徑 | 功能 | 狀態碼 |
  | --- | --- | --- | --- |
  | `GET` | `/todos` | 取得所有代辦事項 | 200 |
  | `POST` | `/todos` | 新增一筆代辦事項 | 200 / 400 |
  | `DELETE` | `/todos` | 刪除全部代辦事項 | 200 |
  | `DELETE` | `/todos/:id` | 刪除單筆代辦事項 | 200 / 400 |
  | `PATCH` | `/todos/:id` | 修改單筆代辦事項 | 200 / 400 |
  | `OPTIONS` | `/` | CORS 預檢請求 | 200 |
  | 其他 | 任意 | 404 not found | 404 |

### 四、CORS 設定

- 每一個回應的 header 都要加上 CORS 相關欄位，瀏覽器才會允許跨來源請求：

  ```js
  const header = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };
  ```

- 重點：
  - `Allow-Origin: *` 代表允許所有來源（正式環境建議改成指定網域）。
  - `Allow-Methods` 要把你支援的方法都列出來，特別是 `PATCH`、`DELETE` 這類「非簡單請求」。
  - 瀏覽器在送 `PATCH`、`DELETE` 等請求前會先送一個 `OPTIONS` 預檢請求，所以 server 一定要處理 `OPTIONS`。

### 五、讀取 request body 的關鍵觀念

- Node.js 原生 `http` 的 request body **是「串流（stream）」**，不是一次就拿到完整資料，要這樣讀：

  ```js
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;  //  資料一塊一塊進來，先累積起來
  });
  req.on("end", () => {
    //   全部接收完才能 JSON.parse
    const data = JSON.parse(body);
    //   ...處理邏輯放這裡
  });
  ```

  :::warning
  所有需要用到 body 的邏輯（`POST`、`PATCH`）一定要寫在 `req.on("end", ...)` 裡面，因為在 `end` 之前 body 還不完整。而 `GET`、`DELETE` 通常沒有 body，可以直接回應，不用等 `end`。
  :::

### 六、各路由實作重點

#### 1. GET `/todos`：取得全部
- 直接回傳 `todos` 陣列即可，最單純。

  ```js
  if (req.url == "/todos" && req.method == "GET") {
    res.writeHead(200, header);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      }),
    );
    res.end();
  }
  ```

#### 2. POST `/todos`：新增
- 重點是「**title 不能是 undefined**」，否則就算錯誤資料：

  ```js
  else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        console.log(title);
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          //   回 200 success
          res.writeHead(200, header);
          res.write(JSON.stringify({ status: "success", data: todos }));
          res.end();
        } else {
          errorHandle(res);  //  title 缺失
        }
      } catch (error) {
        errorHandle(res);  //  JSON 格式錯誤
      }
    });
  }
  ```

- 兩種錯誤都要處理：
  - **欄位缺失**（`title === undefined`）。
  - **JSON 格式錯誤**（`JSON.parse` 會丟 exception，要用 `try/catch` 包起來）。

#### 3. DELETE `/todos`：刪除全部
- 小技巧：用 `todos.length = 0` 清空陣列，不要寫成 `todos = []`（後者會破壞原本的 reference，指向新的位置，非原本的位置）。

  ```js
  else if (req.url == "/todos" && req.method == "DELETE") {
    todos.length = 0;  //  清空陣列，指向同一個 todos
    res.writeHead(200, header);
    res.write(
      JSON.stringify({
        status: "success",
        message: "刪除成功",
        data: todos,
      }),
    );
    res.end();
  }
  ```

#### 4. DELETE `/todos/:id`：刪除單筆
- 重點：用 `findIndex` 找到資料位置，再用 `splice` 移除。

  ```js
  else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();  //  從 URL 取出 id
    const index = todos.findIndex((element) => element.id == id);
    console.log(id, index);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, header);
      res.write(
        JSON.stringify({
          status: "success",
          message: "刪除單筆代辦事項",
          data: todos,
        }),
      );
      res.end();
    } else {
      errorHandle(res);  //  找不到該 id
    }
  }
  ```

#### 5. PATCH `/todos/:id`：修改
- 和 POST 一樣需要讀 body，再加上找 id 的邏輯。

  ```js
  else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        const todo = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex((element) => element.id == id);
        console.log(id, todo);
        if (todo !== undefined && index !== -1) {
          todos[index].title = todo;  //  直接覆寫 title
          //   回 200
          res.writeHead(200, header);
          res.write(
            JSON.stringify({
              status: "success",
              message: "修改單筆代辦事項",
              data: todos,
            }),
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  }
  ```

- 兩個條件要同時成立：**body 有 title** 且 **id 存在**。

#### 6. OPTIONS：CORS 預檢

- 回 200 + header 就好，不用 body：

  ```js
  else if (req.url == "/" && req.method == "OPTIONS") {
    res.writeHead(200, header);
    res.end();
  }
  ```

#### 7. 其他路由：404
- 最後一個 `else` 兜底，回 404 not found。

  ```js
  else {
    res.writeHead(404, header);
    res.write(
      JSON.stringify({
        status: "false",
        message: "not found 404",
      }),
    );
    res.end();
  }
    ```

### 七、錯誤處理模組（errorHandle.js）

- 把錯誤回應抽出來變成共用函式，因為它在很多地方都會用到（POST 缺欄位、PATCH 找不到 id、DELETE 找不到 id…）：

  ```js
  function errorHandle(res) {
    const header = { /*  ...同上的 CORS header...  */ };
    res.writeHead(400, header);
    res.write(JSON.stringify({
      status: false,
      message: "發生錯誤，欄位未填寫正確或無此todo Id",
    }));
    res.end();
  }
  module.exports = errorHandle;
  ```

- 統一回 **400 Bad Request**，並用 `module.exports` 匯出給 `server.js` 用。

### 八、HTTP 狀態碼速記

  | 狀態碼 | 意義 | 在這支 API 何時使用 |
  | --- | --- | --- |
  | 200 | OK，成功 | 所有成功的操作 |
  | 400 | Bad Request，客戶端資料錯誤 | 欄位缺失、JSON 格式錯、找不到 id |
  | 404 | Not Found，路由不存在 | 沒對應到任何 if/else if |

### 九、啟動 server

```js
const server = http.createServer(requestListen);
server.listen(8080);
```

- 跑起來後可以用 Postman 或 `curl` 測試：

  ```bash
  #   取得全部
  curl http://localhost:8080/todos

  #   新增
  curl -X POST http://localhost:8080/todos \
    -H "Content-Type: application/json" \
    -d '{"title":"買牛奶"}'

  #   修改
  curl -X PATCH http://localhost:8080/todos/<id> \
    -H "Content-Type: application/json" \
    -d '{"title":"買豆漿"}'

  #   刪除單筆
  curl -X DELETE http://localhost:8080/todos/<id>

  #   全部清空
  curl -X DELETE http://localhost:8080/todos
  ```

### 十、重點整理

- **RESTful** ＝ HTTP method 表達動作 + URL 表達資源。
- 原生 `http` 讀 body 是 **stream**，要 `data` + `end` 兩個事件配合。
- `JSON.parse` 一定要 `try/catch`，否則格式錯誤會直接讓 server 掛掉。
- CORS 不只要設 `Allow-Origin`，還要處理 `OPTIONS` 預檢。
- 把重複的邏輯（錯誤回應）抽成模組，code 才會乾淨。

### 十一、資料來源

- [Todolist RESTful API 設計心智圖](https://whimsical.com/todolist-restful-api-23MP3VDDa36quRCXUL4hEi)  