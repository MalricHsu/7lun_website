---
title: 第三堂 RWD 響應式網頁
sidebar_position: 12
tags: [CSS, HTML, 課程筆記]
---

- [課程講義](https://hackmd.io/FW2VFU2fR_KfWRPeIXKSkQ)
- [助教講義](https://chalk-freedom-ec6.notion.site/2296ab47eb48809ca668e3137108eafd?pvs=74)

### 一、RWD 基本環境建立

- viewport 設定

  ```
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  ```

- CSS media Queries 語法

  ```css
  /* 針對螢幕寬度大於等於 600px 的裝置 */
  @media (min-width: 600px) {
    body {
      background-color: lightblue;
    }
  }
  ```

### 二、權重覆蓋遊戲

- HTML 標籤：1 分
- class 選擇器：10 分
- ID 選擇器：100 分
- inline style：1000 分
- !important：10000 分

### 三、寬度與單位配置

- max-width：運用在 圖片與 HTML 標籤上（如 Container）
- 利用 % 來定義寬度
- box-sizing

  ```css
  img {
    max-width: 100%;
    height: auto;
  }
  ```

  ```css
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  ```

- [圖片技巧](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Element/picture)

  ```html
  <picture>
    <!-- 當螢幕寬度少於600px時，替換圖片 -->
    <source srcset="./images/M2.png" media="(max-width: 992px)" />
    <!-- 預設圖片，通常是桌面版本 -->
  </picture>
  ```

### 四、斷點規劃+大網站設計範例

- 常見斷點設計：[Bootstrap-layout-containers](https://getbootstrap.com/docs/5.3/layout/containers/)
  - Ｑ：為什麼沒有設計更小的斷點呢？
  - Ａ：因為手機型號太多，更小的情況下通常都是直接用單欄呈現，然後再針對 “特定族群” 另外定義（如果必要）
- 特定族群：
  - iPhone 15, 16 Pro Max - **440px (視專案族群)**
    | 裝置 | Viewport 寬度（CSS px） |
    | ----------------- | ----------------------- |
    | iPhone 15 | **393px** |
    | iPhone 15 Plus | **430px** |
    | iPhone 15 Pro | **393px** |
    | iPhone 15 Pro Max | **430px** |
    | iPhone 16 | **393px** |
    | iPhone 16 Pro | **402px** |
    | iPhone 16 Pro Max | **440px** |
- 如果是 PC 做到手機的話，語法就會有點像是這樣：

  ```
  * {
    box-sizing: border-box;
  }

  .container {
    max-width: 960px;
  }
  .header {
    height: 80px;
  }
  .column-3 {
    width: 33%;
    padding-left: 20px;
    padding-right: 20px;
  }
  @media(max-width: 768px){
    .header {
      height: auto;
    }
    .column-3 {
      width: 50%;
    }
  }
  @media(max-width: 576px){
    .column-3 {
      width: 100%;
    }
  }

  ```
