---
title: JS｜JavaScript Promise
sidebar_position: 18
tags: [JavaScript, 知識點筆記]
date: 2026-06-22
slug: javascript/js-promise
---

### 一、非同步的定義

- JavaScript 執行程式碼時，預設是**一行一行往下跑**。但有些事情需要等待——例如跟伺服器要資料、讀取檔案——這些操作不知道什麼時候才會完成，所以不能讓程式「卡在那裡等」。

- 這種「發出請求、繼續做別的事、等結果回來再處理」的模式，就叫做**非同步（Async）**。

### 二、從 Callback 到 Promise

#### 1. 傳統 Callback 的問題

- 以前處理非同步，會把「完成後要做什麼」寫成函式傳進去（叫做 callback）。一個步驟還好，但步驟一多，就會一層套一層往右縮排，這就叫做 **Callback Hell（回呼地獄）**：

  ```js
  // 先取得使用者，成功後再取得他的訂單，成功後再取得商品
  getUser(function(user) {
    getOrder(user.id, function(order) {
      getProduct(order.id, function(product) {
        console.log(product);
        // 還要繼續的話，繼續往右縮排...
      });
    });
  });
  ```

- 程式碼越來越難讀、難維護。Promise 就是為了解決這個問題而出現的。

#### 2. 什麼是 Promise？

- Promise 是一個**代表「未來某個時間點會有結果」的物件**。

- 你可以把它想成：去餐廳點餐後拿到的**號碼牌**。
  - 拿到號碼牌的當下，餐點還沒好 → **pending（等待中）**
  - 廚房叫號，餐點做好了 → **fulfilled（成功）**
  - 食材不夠做不了，服務生來告訴你 → **rejected（失敗）**

- 一旦變成成功或失敗，就**不會再改變**。

#### 3. Promise 的三種狀態

  | 狀態 | 說明 |
  |------|------|
  | **pending（等待中）** | 還在處理，結果未知 |
  | **fulfilled（成功）** | 完成了，有結果值可以用 |
  | **rejected（失敗）** | 出錯了，有錯誤訊息 |

### 三、Promise 的基本方法

#### 1. `.then()` — 成功時要做什麼

  ```js
  fetch('https://jsonplaceholder.typicode.com/users', { method: 'GET' })
    .then(function(response) {
      // 伺服器有回應了，但要再解析成 JSON 才能用
      return response.json();
    })
    .then(function(data) {
      // 這裡才是真正可以用的資料
      console.log(data);
    });
  ```

  :::note

  - `.then()` 執行完之後，會回傳一個全新的 Promise，所以才可以一直 `.then().then()` 串下去。

  :::

#### 2. `.catch()` — 失敗時要做什麼

  ```js
    fetch('https://jsonplaceholder.typicode.com/users', { method: 'GET' })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      // 上面任何一個步驟出錯，都會跳到這裡
      console.error('發生錯誤：', error);
    });
  ```

#### 3. `.finally()` — 不管成功或失敗都會執行

  ```js
  showSpinner(); // 顯示讀取動畫

  fetch('https://jsonplaceholder.typicode.com/users', { method: 'GET' })
    .then(function(response) { return response.json(); })
    .then(function(data) { renderData(data); })
    .catch(function(error) { showError(error); })
    .finally(function() {
      hideSpinner(); // 成功或失敗都一定會跑到這裡
    });
  ```

### 四、Promise 鏈

- 因為 `.then()` 每次都回傳一個新的 Promise，就可以把多個步驟串成一條鏈，不用再層層巢狀。

- 以下用「判斷成績 → 給予獎勵或處罰」來示範 Promise 鏈怎麼運作：

  ```js
  // 第一步：判斷是否及格（用 setTimeout 模擬需要等待的非同步操作）
  function checkScore(score) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (score >= 60) {
          resolve(score);                            // 及格 → 把分數往下傳
        } else {
          reject(new Error('不及格，需要留校察看')); // 不及格 → 直接跳到 .catch()
        }
      }, 1000); // 模擬審核需要 1 秒
    });
  }

  // 第二步：及格後，根據分數給不同的獎勵
  function getReward(score) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        if (score >= 80) {
          resolve('優等獎勵：明天免上第一堂課 🎉');
        } else {
          resolve('及格獎勵：今天可以早退一小時 👏');
        }
      }, 1000);
    });
  }

  // 把兩個步驟串起來
  checkScore(85)                    // ← 改這裡的數字試試看
    .then(function(score) {
      return getReward(score);      // 及格 → 進入獎勵判斷
    })
    .then(function(reward) {
      console.log('恭喜！', reward);
    })
    .catch(function(error) {
      console.log('很抱歉，', error.message); // 不及格 → 跳到這裡
    });

  // 輸入 85 → 恭喜！優等獎勵：明天免上第一堂課 🎉
  // 輸入 65 → 恭喜！及格獎勵：今天可以早退一小時 👏
  // 輸入 45 → 很抱歉，不及格，需要留校察看
  ```

  :::warning

  `.then()` 裡面記得要 **`return`** 下一個步驟。如果沒有 `return`，下一個 `.then()` 收到的值會是 `undefined`。

  :::

- `fetch()` 也是 Promise
  - `fetch()` 打 API 跟上面的成績範例是完全一樣的模式：`fetch()` 本身就回傳一個 Promise，成功就進 `.then()`，失敗就進 `.catch()`，中間也可以一路串下去。

### 五、async / await — Promise 的語法糖

- `async/await` 是 Promise 的**語法糖**，意思是它底層還是 Promise，只是寫法上更像一般的逐行程式碼，讓人更好讀。

  ```js
  // Promise 鏈寫法
  checkScore(85)
    .then(function(score)  { return getReward(score); })
    .then(function(reward) { console.log(reward); })
    .catch(function(error) { console.log(error.message); });

  // async / await 等價寫法，結果完全一樣
  async function main() {
    try {
      const score  = await checkScore(85); // 等這行完成，才繼續下一行
      const reward = await getReward(score);
      console.log(reward);
    } catch (error) {
      console.log(error.message);          // 任一步驟失敗都會跳到這裡
    }
  }

  main();
  ```

  :::note

  - 函式前面加 `async`，裡面才能用 `await`
  - `await` 的意思是「**等這一行的 Promise 完成後，再繼續往下**」

  :::

### 六、同時處理多個 Promise

- 有時候多個操作彼此不相依，可以同時發出、一起等，比一個一個等快很多。

  ```js
  //  一個等完才發下一個，假設每個都要 1 秒，總共等 3 秒
  const score1 = await checkScore(85); // 等 1 秒
  const score2 = await checkScore(65); // 再等 1 秒
  const score3 = await checkScore(45); // 再等 1 秒

  //  三個同時發出，只等最慢的那個，總共約 1 秒
  const results = await Promise.all([
    checkScore(85),
    checkScore(65),
    checkScore(45),
  ]);
  ```

#### 1. `Promise.all()` — 全部成功才繼續

- 三個同時跑，全部成功才給你結果。**只要有一個失敗，就立刻整個失敗**，其他的結果也不要了。

  ```js
  Promise.all([
    checkScore(85),
    checkScore(70),
    checkScore(90),
  ])
    .then(function(scores) {
      console.log('全班都及格了！分數：', scores); // [85, 70, 90]
    })
    .catch(function(error) {
      console.log('有人不及格：', error.message);  // 只要一個不及格就跳到這
    });
  ```

#### 2. `Promise.allSettled()` — 全部跑完，各自告訴你結果

- 不管成功或失敗，都等全部跑完，每一個結果都告訴你。適合「就算部分失敗也要繼續，最後再統計誰成功誰失敗」的情境。

  ```js
  const students = [
    { name: '小明', score: 85 },
    { name: '小華', score: 45 },
    { name: '小美', score: 72 },
  ];

  Promise.allSettled(
    students.map(function(student) {
      return checkScore(student.score);
    })
  ).then(function(results) {
    results.forEach(function(result, index) {
      const name = students[index].name;
      if (result.status === 'fulfilled') {
        console.log(`✅ ${name}：及格（${result.value} 分）`);
      } else {
        console.log(`❌ ${name}：${result.reason.message}`);
      }
    });
  });

  // ✅ 小明：及格（85 分）
  // ❌ 小華：不及格，需要留校察看
  // ✅ 小美：及格（72 分）

  // 如果改用 Promise.all()，小華一不及格就整個失敗，
  // 連小明和小美的結果都拿不到了。
  ```

#### 3. `Promise.race()` — 誰先結束就用誰（不分成敗）

- 只要有一個 Promise 率先結束（不管成功或失敗），就直接採用那個結果。最常用來設定**逾時機制**：

  ```js
  function timeout(ms) {
    return new Promise(function(_, reject) {
      setTimeout(function() {
        reject(new Error(`超過 ${ms / 1000} 秒沒有回應`));
      }, ms);
    });
  }

  Promise.race([
    fetch('https://jsonplaceholder.typicode.com/users', { method: 'GET' }).then(r => r.json()),
    timeout(5000), // 超過 5 秒就失敗
  ])
    .then(function(data) { console.log(data); })
    .catch(function(error) { console.log(error.message); });
  ```

#### 4. `Promise.any()` — 誰先成功就用誰

- 只要有一個成功就採用。**跟 `race()` 的差別是：失敗不算**，就算某個先失敗了，還是繼續等其他的。全部失敗才算真的失敗。

  ```js
  Promise.any([
    fetch('https://server-a.com/data', { method: 'GET' }).then(r => r.json()),
    fetch('https://server-b.com/data', { method: 'GET' }).then(r => r.json()),
    fetch('https://server-c.com/data', { method: 'GET' }).then(r => r.json()),
  ])
    .then(function(data) { console.log('最快回來的資料：', data); })
    .catch(function(error) { console.log('三個伺服器全掛了：', error); });
  ```

#### 5. 四種方法一覽

  | 方法 | 白話說明 | 適合情境 |
  |------|----------|----------|
  | `Promise.all()` | 全部成功才繼續，一個失敗就整個失敗 | 所有資料都要才能繼續 |
  | `Promise.allSettled()` | 全部跑完，各自回報結果 | 批次操作，要知道每一個各自的結果 |
  | `Promise.race()` | 誰先結束（不論成敗）就用誰 | 設定逾時機制 |
  | `Promise.any()` | 誰先成功就用誰，全失敗才算失敗 | 多個來源取同一份資料 |

### 七、常見錯誤

| 錯誤 | 說明 |
|------|------|
| `.then()` 裡忘記 `return` | 下一個 `.then()` 拿不到值，結果是 `undefined` |
| 沒有 `.catch()` | 出錯了卻沒人處理，程式靜悄悄失敗 |
| `await` 寫在 `async` 函式外 | 直接報語法錯誤 |
| 用 `Promise.all` 但不能接受任何失敗 | 改用 `Promise.allSettled` |

### 八、資料來源

- [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN — Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN — How to use promises](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises)
- [MDN — Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN — Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN — Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [MDN — Promise.any()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
