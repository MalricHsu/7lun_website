---
title: CSS｜格線系統
sidebar_position: 8
tags: [CSS, HTML, 知識點筆記]
date: 2025-06-17
slug: css-grid-system
---

### 一、格線系統原理

什麼是「格線系統（Grid System）」？簡單來說，就像是蓋房子時打的地基格子，它幫助我們**把網頁畫面有規律地切割**，讓裡面的文字、圖片可以對齊得整整齊齊。尤其在做 RWD 響應式網頁時，更是不可或缺的排版利器。

一套完整的格線系統，通常由三個核心角色組成，它們必須**層層包覆**才能發揮作用：

#### 1. 容器（Container）——「限制範圍與置中」
- **目的**：決定整個網站內容的「最大寬度」，並讓內容乖乖待在畫面正中間，不會因為螢幕太大而無限向左右延伸。
- **原理**：
  - 設定 `max-width`（例如 1296px）。
  - 設定 `margin: 0 auto` 達到水平置中效果。
  - **重要細節**：必須設定左右 `padding`（通常是 12px ），這樣當使用者用很小的手機看時，文字才不會直接貼死在螢幕最邊緣。

#### 2. 列（Row）——「負責換行與抵銷留白」
- **目的**：作為欄（Column）的專屬外包裝，讓裡面的欄位能夠橫向並排。
- **原理**：
  - 設定 `display: flex` 與 `flex-wrap: wrap`，讓欄位能並排且自動換行。
  - **魔法屬性（負外距）**：因為內部的 Column 會有左右 `padding` 來製造間距，這會導致最左邊和最右邊的 Column 無法和 Container 的邊緣切齊。所以 Row 必須設定**負的左右 margin**（例如 `margin: 0 -15px`），把那多出來的留白「抵銷」掉，達成完美的切齊效果。

#### 3. 欄（Column）——「決定寬度比例與間距」
- **目的**：決定裡面的內容要佔畫面的幾分之幾。
- **原理**：
  - **12 欄制**：業界最愛把畫面切成 12 等份（因為 12 可以被 2、3、4、6 整除，非常好用）。
  - 設定百分比寬度：例如想要佔一半就是 `.col-6`（寬度 50%），佔三分之一就是 `.col-4`（寬度 33.3333%）。
  - **製造溝槽（Gutter）**：利用左右的 `padding`（例如 `padding: 0 15px`）往內推，當兩個 Column 並排時，就會自動形成 30px 的完美間距。

::::info
**💡 總結口訣**
外層 `Container` 置中包全部 ➜ 中層 `Row` 負外距抵銷留白 ➜ 內層 `Column` 百分比切等份並用 Padding 撐開間隔！
::::

### 二、實作

#### 1. HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>格線系統</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <div class="container">
      <main class="main">
        <h2>標題</h2>
        <div class="row">
          <div class="col-3 mb-20">
            <aside class="sidebar">
              <h2>這邊是側邊欄</h2>
              <p>這是側邊欄的文字</p>
            </aside>
          </div>
          <div class="col-9 mb-20">
            <section class="content">
              <h2>內容區域</h2>
              <p>這是內容區域的文字</p>
            </section>
          </div>
        </div>
      </main>
      <div class="product-section">
        <h2>產品區域</h2>
        <div class="row">
          <div class="col-4 mb-20">
            <div class="product-card h-100">
              <h3>產品名稱</h3>
              <p>這是產品的描述。</p>
            </div>
          </div>
          <div class="col-4 mb-20">
            <div class="product-card h-100">
              <h3>產品名稱</h3>
              <p>
                這是產品的描述。 Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Consectetur, laboriosam assumenda saepe alias
                sit quibusdam tenetur magni dolores cum inventore.
              </p>
            </div>
          </div>
          <div class="col-4 mb-20">
            <div class="product-card h-100">
              <h3>產品名稱</h3>
              <p>這是產品的描述。</p>
            </div>
          </div>
          <div class="col-4 mb-20">
            <div class="product-card h-100">
              <h3>產品名稱</h3>
              <p>
                這是產品的描述。 Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Consectetur, laboriosam assumenda saepe alias
                sit quibusdam tenetur magni dolores cum inventore.
              </p>
            </div>
          </div>
          <div class="col-4 mb-20">
            <div class="product-card h-100">
              <h3>產品名稱</h3>
              <p>這是產品的描述。</p>
            </div>
          </div>
          <div class="col-4 mb-20">
            <div class="product-card h-100">
              <h3>產品名稱</h3>
              <p>
                這是產品的描述。 Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Consectetur, laboriosam assumenda saepe alias
                sit quibusdam tenetur magni dolores cum inventore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

#### 2. CSS

```css
body {
  background-color: #f5f5f5;
}

* {
  box-sizing: border-box;
}

/* 容器：定位 */
/* 因為row加上了margin所以有了負值，會產生x軸，所以再加上padding抵銷 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
}

/* 因為col加了padding 所以導致與上面的h2標題沒有對齊 所以要再加上margin抵銷掉 */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
}

/* 格線系統 */
/* 所有的col選起來 */
/* 內容要向內推擠所以要加padding */
[class*="col-"] {
  padding-left: 10px;
  padding-right: 10px;
}

/* column 計算方式 100/12*3 */

.col-1 {
  width: 8.33333%;
}
.col-2 {
  width: 16.66666%;
}
.col-3 {
  width: 25%;
}
/* 五位數比較精確 */
.col-4 {
  width: 33.33333%;
}
.col-5 {
  width: 41.66666%;
}
.col-6 {
  width: 50%;
}
.col-7 {
  width: 58.33333%;
}
.col-8 {
  width: 66.66666%;
}
.col-9 {
  width: 75%;
}
.col-10 {
  width: 83.33333%;
}
.col-11 {
  width: 91.66666%;
}
.col-12 {
  width: 100%;
}
.h-100 {
  height: 100%;
}

.mb-20 {
  margin-bottom: 20px;
}

/* 內容 */
.sidebar {
  padding: 1rem;
  background-color: #fff;
}

.content {
  padding: 1rem;
  background-color: #fff;
}

.product-card {
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #ccc;
}

@media screen and (max-width: 768px) {
  [class*="col-"] {
    width: 100%;
  }
}
```
