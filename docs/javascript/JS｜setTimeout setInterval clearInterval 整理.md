---
title: JS｜setTimeout setInterval clearInterval 整理
sidebar_position: 15
tags: [JavaScript, 知識點筆記]
date: 2026-04-26
---

### 一、setTimeout / setInterval  / clearInterval

- `setTimeout()` — 延遲執行一次：在指定的時間（毫秒）後，**執行一次函式**。
    - 語法：
    
      ```js
      setTimeout(callback, delay, arg1, arg2, ...)
      
      callback：要執行的函式
      delay：延遲的時間（毫秒，1000ms = 1秒）
      arg1, arg2...：傳入 callback 的參數（可選）
      ```
    
    - 範例：因為 `setTimeout` 是「非同步」的，主程式不會等它執行完才繼續。
    
      ```js
      console.log("開始");
      
      setTimeout(function() {
        console.log("2秒後執行");
      }, 2000);
      
      console.log("結束");
      
      開始
      結束
      2秒後執行
      ```
    
- `setInterval()` — 重複執行：每隔固定時間，就**重複執行一次函式**，直到被手動停止。
    - 語法：
    
      ```js
      setInterval(callback, delay, arg1, arg2, ...)
      
      callback：要執行的函式
      delay：延遲的時間（毫秒，1000ms = 1秒）
      arg1, arg2...：傳入 callback 的參數（可選）
      ```
    
    - 範例：搭配 `clearInterval()` 來停止重複執行。
    
      ```js
      let count = 0;
      
      let timer = setInterval(function() {
        count++;
        console.log(`目前次數：${count}`);
        if (count === 5) {
          clearInterval(timer);
          console.log("停止重複");
        }
      }, 1000);
      
      目前次數：1
      目前次數：2
      目前次數：3
      目前次數：4
      目前次數：5
      停止重複
      ```
    
- `clearInterval()` 與 `clearTimeout()` — 停止計時：兩者都用來「取消」先前設定的計時器。
    - 比較
    
        | 停止對象 | 使用方法 |
        | --- | --- |
        | `setTimeout()` | `clearTimeout(timerId)` |
        | `setInterval()` | `clearInterval(timerId)` |
    
    b. 範例
    
            ```js
            let timer = setTimeout(() => {
              console.log("這段文字不會出現");
            }, 3000);
            
              clearTimeout(timer);
            ```
    

### 二、三種比較

| 名稱 | 功能 | 是否重複 | 停止方式 |
| --- | --- | --- | --- |
| `setTimeout()` | 延遲執行一次 |  否 | `clearTimeout()` |
| `setInterval()` | 每隔固定時間重複執行 |  是 | `clearInterval()` |
| `clearInterval()` | 停止 `setInterval()` | — | — |

### 資料來源

- [迴圈](https://hackmd.io/rFfFV4jmSEGxuzp6Gq_ubQ)
- [while 語法筆記](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/while)
- [for 語法筆記](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/for)
- [for...in 語法筆記](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/for...in)
- [for...of 語法筆記](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)