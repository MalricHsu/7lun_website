---
title: Sass 介紹
sidebar_position: 6
tags: [CSS, 知識點筆記]
---

### 一、Sass定義

1. **英文全稱：Syntactically Awesome Stylesheets**，是一種**將CSS視為程式語言的網頁開發技術**。 Sass的特點在於支援**設定變數、函數、import語法、nested語法**等等，使得網頁開發者可以快速的寫出高相容性、跨瀏覽器的CSS程式碼。Sass也被包含在許多熱門的library當中。例如，Bootstrap內部的大量程式碼是由scss文件編譯而成。
2. 在文字編輯器當中寫的**scss文件不能直接被網頁瀏覽器讀取**。
   - **Sass編譯器將scss文件編譯成CSS文件後，才能夠被HTML文件用來套用樣式**
3. 若scss文件有bug，則無法成功編譯出CSS文件。每次更新scss文件後，都需要重新編譯出相對應的新CSS文件。
4. [Sass 維基百科](https://sass-lang.com/)

### 二、Sass的使用方式

1. **變數**：Sass支援定義變數。變數以美元符號（$）作為開頭。變數用冒號（:）賦值。
   - 支援四種資料類型：
     - 數值（可包括單位）
     - 字串
     - 顏色
     - 布林類型
   - 舉例：Sass 提供 `darken($color, $amount)` 與 `lighten($color, $amount)` 函數，分別用於按比例降低或提升顏色的亮度。

     ```scss
     $blue: #3bbfce;
     $margin: 16px;

     .content-navigation {
       border-color: $blue;
       color: darken($blue, 10%);
     }

     .border {
       padding: $margin / 2;
       margin: $margin / 2;
       border-color: $blue;
     }
     ```

2. **巢狀語法**：可更加清晰地表示元素之間的關係

   ```scss
   table.hl {
     margin: 2em 0;
     td.ln {
       text-align: right;
     }
   }

   li {
     font: {
       family: serif;
       weight: bold;
       size: 1.3em;
     }
   }
   ```

3. **混入-Mixin**：可以定義一組樣式，並且可以在其他地方重複使用。**當需要多次使用一段相似的樣式時，使用 mixin 可以提高代碼的重用性**。

   ```scss
   @mixin button-style($color) {
     padding: 10px 20px;
     background-color: $color;
     color: white;
     border-radius: 5px;
   }

   .btn-primary {
     @include button-style($primary-color);
   }
   ```

4. **繼承**：CSS3支援[DOM](https://zh.wikipedia.org/wiki/DOM)層次，但是不支援樣式的繼承。Sass語言通過@extend關鍵詞實現了繼承功能。

   ```scss
   .error {
     border: 1px #f00;
     background: #fdd;
   }
   .error.intrusion {
     font-size: 1.3em;
     font-weight: bold;
   }

   .badError {
     @extend .error;
     border-width: 3px;
   }
   ```

### 三、整理方式

1. **SMACSS**：是一種 CSS 的結構與命名「規範」，目的是讓大型或持續擴充的前端專案在撰寫樣式時更加有組織、易於維護、模組化。它不是一套工具，而是一套**設計原則與分類方法**。

   a. SMACSS 將 CSS 分為五大類：

   | 類型       | 說明                                                                  |
   | ---------- | --------------------------------------------------------------------- |
   | **Base**   | 基本樣式，如 `body`, `a`, `h1`，這些通常是 reset 或 normalize。       |
   | **Layout** | 結構相關樣式，像是 `header`, `footer`, `sidebar`，用來做區塊分區。    |
   | **Module** | 功能模組，例如 `card`, `button`, `carousel`，通常是可重複使用的元件。 |
   | **State**  | 狀態類型，例如 `.is-active`, `.is-hidden`，用來表示元件的狀態變化。   |
   | **Theme**  | 主題樣式（非必要），可用來切換顏色主題或風格外觀。                    |

   b. SMACSS 的優點
   - 可擴展性好，適合大型團隊
   - 結構分明，樣式不易混亂
   - 好維護，容易針對特定功能區做修改
   - 和 BEM 等其他命名規範可搭配使用

2. **OOCSS**：主張把 **CSS 的撰寫方式「物件化」**，像在寫程式一樣，將樣式抽離成可重用的元件。
   a. **分離結構與外觀：**將「佈局結構」與「視覺樣式」拆開，避免樣式耦合太深。

   ```scss
   // 結構：設定寬高、margin、padding 等
   .media {
     display: flex;
     align-items: flex-start;
   }

   // 外觀：設定顏色、背景、邊框等
   .avatar {
     border-radius: 50%;
     border: 1px solid #ccc;
   }
   ```

   b. **分離容器與內容**：樣式應該只關注元件本身，而不是依賴它放在哪裡（不靠容器做出樣式）。

   ```scss
   .btn {
     padding: 0.5em 1em;
     background-color: blue;
     color: white;
   }

   .sidebar .btn {
     // ❌ 不推薦：過度依賴容器
   }
   ```

   c. OOCSS 的優點
   - 提高 **元件可重用性**
   - 減少重複樣式、CSS 文件變輕
   - 更容易與 JavaScript 搭配操作
   - 易於團隊協作

3. 比較模式

   | 架構方法   | 重點                   | 適合情境               |
   | ---------- | ---------------------- | ---------------------- |
   | **OOCSS**  | 將樣式模組化為「物件」 | 追求高重用性的元件庫   |
   | **SMACSS** | 分類與組織整體架構     | 適合大型團隊合作       |
   | **BEM**    | 清楚的命名規則         | 避免樣式衝突與層級混亂 |
