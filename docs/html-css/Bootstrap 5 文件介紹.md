---
title: Bootstrap 5 文件介紹
sidebar_position: 8
tags: [CSS, 知識點筆記]
---

### 一、**CSS Variables**

```css
//設定全域變數
:root {
  --primary: #69f0ae;
}
.box {
  width: 100px;
  height: 100px;
  padding: 20px;
  border: 1px solid #eee;
}

.bg-primary {
  background-color: var(--primary);
}

//設定區域變數
 .local {
  --primary: orange;
}
```

```html
<div class="box bg-primary"></div>
=> 會顯示#69f0ae 顏色

<div class="local">
  => 會顯示orange 顏色 因為被包住在local
  <div class="box bg-primary"></div>
</div>
```

### 二、**rem 單位**

| 單位  | 參考對象           | 是否會被繼承層級影響 | 使用時機                                         |
| ----- | ------------------ | -------------------- | ------------------------------------------------ |
| `em`  | 當前元素的字體大小 | 會                   | 元素要隨父元素變化時適合使用                     |
| `rem` | 根元素的字體大小   | 不會                 | 全站統一尺寸設定時最穩定（跟隨著HTML的字體大小） |

### **三、系統預設字體**

### **四、CSS Reset 做了什麼？**

1. 會套用BS5預設字體、字體大小、行間距等等
2. 套用box-sizing:border-box
3. 套用list等其他標準Normalize樣式
4. BS5所釋出的變數色彩

### 五、文字運用

1. Bootstrap 5 Typography 排版總整理

| **分類**               | **說明與範例**               | **使用方式**                                                                    |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| **標題 Headings**      | 標準標題元素                 | `<h1>~<h6>` 或 `<p class="h1">~<p class="h6">`                                  |
| **小標題 `small`**     | 副標題文字，呈現灰色與小字體 | `<h1>Title <small class="text-muted">subtitle</small></h1>`                     |
| **顯示標題 `Display`** | 比 h1~h6 更大的標題          | `<h1 class="display-1">Display 1</h1>` ~ `<h1 class="display-6">Display 6</h1>` |
| **前導段落 `Lead`**    | 突出段落，常用於開頭說明     | `<p class="lead">This is a lead paragraph.</p>`                                 |

1. 文字大小－px值

| **類型**         | **Class / 標籤** | **字體大小（`rem`）** | **約略像素（px）** |
| ---------------- | ---------------- | --------------------- | ------------------ |
| **顯示標題**     | `.display-1`     | `5rem`                | `80px`             |
|                  | `.display-2`     | `4.5rem`              | `72px`             |
|                  | `.display-3`     | `4rem`                | `64px`             |
|                  | `.display-4`     | `3.5rem`              | `56px`             |
|                  | `.display-5`     | `3rem`                | `48px`             |
|                  | `.display-6`     | `2.5rem`              | `40px`             |
| **標準標題**     | `<h1>`           | `2.5rem`              | `40px`             |
|                  | `<h2>`           | `2rem`                | `32px`             |
|                  | `<h3>`           | `1.75rem`             | `28px`             |
|                  | `<h4>`           | `1.5rem`              | `24px`             |
|                  | `<h5>`           | `1.25rem`             | `20px`             |
|                  | `<h6>`           | `1rem`                | `16px`             |
| **標題樣式類別** | `.h1` ~ `.h6`    | 同 `<h1>` ~ `<h6>`    | 同上               |
| **字體大小類別** | `.fs-1`          | `2.5rem`              | `40px`             |
|                  | `.fs-2`          | `2rem`                | `32px`             |
|                  | `.fs-3`          | `1.75rem`             | `28px`             |
|                  | `.fs-4`          | `1.5rem`              | `24px`             |
|                  | `.fs-5`          | `1.25rem`             | `20px`             |
|                  | `.fs-6`          | `1rem`                | `16px`             |

1. 行內文本元素（Inline Text Elements）

| **類別**     | **效果說明**                        | **HTML 範例與說明**                                                      |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------ |
| `mark`       | 標記文字（黃色背景）                | `<mark>highlighted</mark>`                                               |
| `del`        | 刪除文字（常用）                    | `<del>deleted text</del>`                                                |
| `s`          | 刪除文字（較不常用）                | `<s>no longer accurate</s>`                                              |
| `ins`        | 插入文字（底線）                    | `<ins>addition</ins>`                                                    |
| `u`          | 底線文字（較不常用）                | `<u>underlined</u>`                                                      |
| `small`      | 小字體                              | `<small>fine print</small>`                                              |
| `strong`     | 粗體                                | `<strong>bold</strong>`                                                  |
| `em`         | 斜體                                | `<em>italic</em>`                                                        |
| `abbr`       | 縮寫提示，滑鼠懸停會顯示 title 文字 | `<abbr title="attribute">attr</abbr>` 會顯示attribute                    |
| `initialism` | 小字體縮寫（縮小的縮寫）            | `<abbr class="initialism" title="HyperText Markup Language">HTML</abbr>` |

- abbr 與 initialism 的圖片

1. 引用區塊（Blockquote）

| **類型**     | **說明與用法**                                      | **範例程式碼**                                                                   |
| ------------ | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| **基本引用** | 使用 `<blockquote>` 包住文字                        | `<blockquote class="blockquote">A quote</blockquote>`                            |
| **引用來源** | 使用 `<figure>` + `<figcaption>` 排版來源文字       | `<figure><blockquote>...</blockquote><figcaption>—Someone</figcaption></figure>` |
| **對齊**     | 可加上 `.text-center` 或 `.text-end` 等類別改變對齊 | `<blockquote class="blockquote text-end">...</blockquote>`                       |

1. 列表（List）

| **類型**         | **說明與用法**                                                              | **範例程式碼**                                                        |
| ---------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **無樣式列表**   | 移除預設點與縮排，僅作用於第一層                                            | `<ul class="list-unstyled"><li>Item</li></ul>`                        |
| **行內列表**     | 列表橫向排列(都排在一排），需同時使用 `.list-inline` 與 `.list-inline-item` | `<ul class="list-inline"><li class="list-inline-item">Item</li></ul>` |
| **描述型列表**   | 使用 `<dl>` + `<dt>` + `<dd>` 定義關係 dl代表一行，dt代表標題，dd代表內容   | `<dl><dt>Term</dt><dd>Definition</dd></dl>`                           |
| **描述截斷項目** | 長字截斷顯示省略號，需加上 `.text-truncate`                                 | `<dt class="text-truncate">Truncated term is truncated</dt>`          |

- dl dt dd 的用法 ＋ 描述截斷項目

### 六、**圖片**

1. 響應式圖片（Responsive Image）

| 功能       | 類別         | 說明                                                                     |
| ---------- | ------------ | ------------------------------------------------------------------------ |
| 響應式圖片 | `.img-fluid` | 讓圖片寬度隨容器變化，自動縮放；包含 `max-width: 100%` 和 `height: auto` |

1. 圓角與縮略圖

| 類別              | 說明                                     |
| ----------------- | ---------------------------------------- |
| `.rounded`        | 通用圓角（會套用 border-radius）         |
| `.rounded-circle` | 圓形（須為正方形圖片）                   |
| `.img-thumbnail`  | 加上 1px 灰色邊框 + 圓角（預設縮圖樣式） |

1. 圖片對齊方式:使用 Float + clearfix（讓文字環繞圖片）

| 類別           | 說明                                  |
| -------------- | ------------------------------------- |
| `.float-start` | 圖片靠左，文字繞右                    |
| `.float-end`   | 圖片靠右，文字繞左                    |
| `.clearfix`    | 浮動清除，確保容器不塌陷 → 要放在外層 |

- 範例

```html
<div class="clearfix">
  <p>段落文字會繞過圖片。</p>
</div>
```

1. 使用文字對齊類別（圖片為 block 元素時）

| 類別               | 說明                  |
| ------------------ | --------------------- |
| `.text-start`      | 圖片靠左（預設）      |
| `.text-center`     | 圖片置中              |
| `.text-end`        | 圖片靠右              |
| `.mx-auto d-block` | 讓 block 圖片水平置中 |

- 範例
  `.text-center` 放在外層 `<div>`，可讓內部圖片或文字一起置中。
  ```html
  <div class="text-center"></div>
  ```
  ```html

  ```

1. 圖片 `<figure>` 與 `<figcaption>` 使用整理

| **元素**           | **用途說明**                                                                     |
| ------------------ | -------------------------------------------------------------------------------- |
| **`<figure>`**     | 包裹圖片及其說明，用來呈現 **圖片、圖表、插圖等有主題內容的媒體**                |
| **`<figcaption>`** | 寫在 `<figure>` 裡面，用來描述上方圖片的說明文字                                 |
| **優點**           | 語意清晰、有助於可及性（Accessibility）、可用 Bootstrap 輔助類別進一步美化與對齊 |

### 七、表格

1. 基本表格

| **功能**   | **類別** | **說明**                   |
| ---------- | -------- | -------------------------- |
| 基本表格   | `.table` | 最基本的表格樣式           |
| 不繼承樣式 | 無類別   | 巢狀表格不會繼承父表格樣式 |

1. 表格情境樣式（列/儲存格著色） ⇒ 可套用在 `<tr>` 或 `<td>` 上

| **類別**           | **用途說明**           |
| ------------------ | ---------------------- |
| `.table-primary`   | 藍色                   |
| `.table-secondary` | 灰色                   |
| `.table-success`   | 綠色                   |
| `.table-danger`    | 紅色                   |
| `.table-warning`   | 黃色                   |
| `.table-info`      | 淺藍色                 |
| `.table-light`     | 淺灰                   |
| `.table-dark`      | 深灰                   |
| `.table-active`    | 強調目前所在列或儲存格 |

1. 表格樣式修飾 ⇒ 可**同時組合**使用：例如 `.table table-striped table-hover`

| **類別**            | **說明**                      |
| ------------------- | ----------------------------- |
| `.table-striped`    | 條紋列                        |
| `.table-hover`      | 滑入效果                      |
| `.table-bordered`   | 全部邊框                      |
| `.table-borderless` | 無邊框                        |
| `.table-sm`         | 壓縮版（儲存格 padding 減半） |

1. 對齊與垂直對齊
   - 使用 [`vertical-alignment`](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align) 通用類別改變元素的對齊。請注意，垂直對齊僅影響 **inline、inline-block、inline-table、和 table** 元素。

   | 類別                     | 說明         |
   | ------------------------ | ------------ |
   | `.align-top`             | 垂直頂部對齊 |
   | `.align-middle`          | 垂直置中     |
   | `.align-bottom`          | 垂直底部對齊 |
   | `.text-start/end/center` | 水平對齊     |

2. 表格結構元件 ⇒ `.table-light` / `.table-dark` 可套用在 `<thead>`、`<tfoot>`

| **元素**    | **用途說明**                                 |
| ----------- | -------------------------------------------- |
| `<thead>`   | 表頭，可搭配 `.table-light` 或 `.table-dark` |
| `<tbody>`   | 表格主體                                     |
| `<tfoot>`   | 表尾                                         |
| `<caption>` | 表格標題，可加 `.caption-top` 放在上方       |

- **可以使用 `.caption-top` 將 `<caption>` 放在表格的最頂端**

1. 巢狀表格

| **特性**         | **說明**                             |
| ---------------- | ------------------------------------ |
| 樣式不繼承       | 子表格不會套用父表格的樣式與變數     |
| 建議樣式獨立設定 | 子表格需自行加上 `.table` 及其他樣式 |

1. 響應式表格（水平卷軸）

| **類別**                | **說明**                    |
| ----------------------- | --------------------------- |
| `.table-responsive`     | 所有寬度皆有滾動效果        |
| `.table-responsive-sm`  | 斷點為 `≥576px` 開始不滾動  |
| `.table-responsive-md`  | 斷點為 `≥768px` 開始不滾動  |
| `.table-responsive-lg`  | 斷點為 `≥992px` 開始不滾動  |
| `.table-responsive-xl`  | 斷點為 `≥1200px` 開始不滾動 |
| `.table-responsive-xxl` | 斷點為 `≥1400px` 開始不滾動 |
