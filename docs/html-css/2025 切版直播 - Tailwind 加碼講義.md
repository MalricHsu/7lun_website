---
title: 2025 切版直播 - Tailwind 加碼講義
sidebar_position: 18
tags: [CSS, 課程筆記]
---

課程講義: https://casper-wang.notion.site/2025-Tailwind-25e2a065e9db80678780c2bfcb668305

### 一、環境準備

Tailwind 可以安裝插件：https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss

載入 Tailwind，可參考官方說明https://tailwindcss.com/docs/installation/using-vite

使用切版班範例介紹

切版班 Vite 範例：[https://hackmd.io/V3v9hW9dTlOwFvVA6ycfLg?view](https://hackmd.io/V3v9hW9dTlOwFvVA6ycfLg?view)

> Tailwind 可以安裝到各種 Vite 環境上

### 二、基本知識

### 1. Tailwind 都是透過 class 組成

- 示範文字調整
- 示範 flex
- .container → 類似於 Bootstrap Container，但少了更多的細節的設置
- 示範組成一個卡片

### 2. 狀態類型

可以使用 :hover、:focus 等不同來值接標示狀態樣式

示範：

- 按鈕
- input

### 三、響應式

https://tailwindcss.com/docs/responsive-design

### 1. 中斷點

| **Breakpoint prefix** | **Minimum width** | **CSS**                               |
| --------------------- | ----------------- | ------------------------------------- |
| **`sm`**              | 40rem *(640px)*   | **`@media (width >= 40rem) { ... }`** |
| **`md`**              | 48rem *(768px)*   | **`@media (width >= 48rem) { ... }`** |
| **`lg`**              | 64rem *(1024px)*  | **`@media (width >= 64rem) { ... }`** |
| **`xl`**              | 80rem *(1280px)*  | **`@media (width >= 80rem) { ... }`** |
| **`2xl`**             | 96rem *(1536px)*  | **`@media (width >= 96rem) { ... }`** |

> 避免直接下 sm:bg-green-400 的 class
> 而是需要先使用 `bg-green-400` 作為預設值

```html
<div
  class="
  w-24 h-10 bg-red-500
  md:w-32 md:h-16 md:bg-green-500
  lg:w-40 lg:h-20 lg:bg-blue-500
  xl:w-36 xl:h-24 xl:bg-purple-500
"
></div>
```

### 2. 排版系統

**採用 Grid layout 的架構**

- 什麼是 grid layout，簡單來說：
  - 採用面的方式進行定義 → 二維（行與列）
  - 由外層定義排版的形式

```jsx
<div class="grid grid-cols-3 gap-4">
  <div class="bg-blue-300">1</div>
  <div class="bg-blue-300">2</div>
  <div class="bg-blue-300">3</div>
</div>
```

- grid 定義 grid layout
- grid-cols-3 採用三欄排版
- gap 間隔為 4 spacer

> 注意，部分語法如 [subgrid](https://tailwindcss.com/docs/grid-template-rows#implementing-a-subgrid) 可能會有[瀏覽器版本](https://caniuse.com/css-subgrid)限制 （2023
> CSS Grid 中的 `subgrid` 是一個相對較新的功能，它允許一個網格項目成為子網格，並繼承其父網格的軌道（tracks）。
> 主要用途：繼承父網格的軌道結構
>
> - 子網格可以使用父網格的行或列軌道
> - 不需要重新定義網格尺寸，自動對齊父網格

**融合 12-columns 的概念**

```jsx
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-4 bg-blue-300">1</div>
  <div class="col-span-8 bg-blue-300">2</div>
</div>
```

- grid-cols-12 外層定義 12 欄
- col-span-4 內層套用指定欄數

```html
<div class="grid grid-cols-12 gap-4">
  <div class="col-start-4 col-span-3 bg-blue-300">1</div>
  <div class="col-span-3 bg-blue-300">2</div>
</div>
```

- 注意：這不是 flex，所以不能採用 justify-center 方式置中，而需要另外計算

**混用中斷點**

可以使用 sm:grid-cols-2 lg:grid-cols-4 的方是進行不同中斷點的套用

### 3. flex 開發（不使用格線

你可以從 Grid 跟 flex 中選擇使用一種方法，作為你的排版方法

```jsx
<div class="flex flex-wrap gap-4 justify-center">
  <div class="w-1/3 h-40 bg-amber-400"></div>
  <div class="w-1/3 h-40 bg-green-400"></div>
  <div class="w-1/3 h-40 bg-green-400"></div>
  <div class="w-1/3 h-40 bg-green-400"></div>
</div>
```

### 四、環境說明

### **JIT**（Just-In-Time） 編譯模式

- 有使用到的 class 才會進行編譯，如果沒用到，則不會編譯它
- 可以即時編譯你任何享用的屬性
  - 範例：
  ```jsx
  bg-[#e96060] -> *bg-\[\#e96060\]*
  ```
  > 補充：CSS 中其實不能有 `[]` 、 `:` 這種寫法，Tailwind 會使用跳脫字元來加入至 CSS 檔案中

### Tailwind @ 專屬語法

- **@theme** → 設定主題變數，自動生 utility
- **@layer** → 決定放在哪個層級（base, components, utilities）
- **@utility** → 新增自己的工具 class
- **@apply** → 把多個 utility 打包進一個 class

### 定義主題變數 @theme

文件介紹：[https://tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme)

- 延伸說明
  ```jsx
  /* static 表示不可更改變數 */
  @theme static {
    --base-spacer: 16px;
  }

  @theme {
    /* 定義原有色彩、定義新色彩 */
    --color-blue: green;
    --color-primary: #00cc99;
    --color-secondary: var(--secondary-color);

    /* 修改預設值 */
    --spacing: 8px;

    /* 混用計算規則 */
    --text-h1: calc(var(--base-spacer) * 2 + 3px );

    /* 顏色定義 - 手動：精準 */
    --color-primary-50: #eff6ff;
    --color-primary-100: #dbeafe;
    --color-primary-200: #bfdbfe;
    --color-primary-300: #93c5fd;
    --color-primary-400: #60a5fa;
    --color-primary-500: #3b82f6;
    --color-primary-600: #2563eb;
    --color-primary-700: #1d4ed8;
    --color-primary-800: #1e40af;
    --color-primary-900: #1e3a8a;
    --color-primary-950: #172554;

    /* 顏色定義 - HSL：方便 h色相、s飽和度、l明度 */
    /* 參考網站：https://color.adobe.com/zh/create/color-wheel */
    --color-primary: 193deg;
    --color-primary-100: hsl(var(--color-primary), 95%, 95% );
    --color-primary-200: hsl(var(--color-primary), 85%, 85% );
    --color-primary-300: hsl(var(--color-primary), 75%, 75% );
    --color-primary-400: hsl(var(--color-primary), 65%, 65% );
    --color-primary-500: hsl(var(--color-primary), 55%, 55% );
    --color-primary-600: hsl(var(--color-primary), 45%, 45% );
    --color-primary-700: hsl(var(--color-primary), 35%, 35% );
    --color-primary-800: hsl(var(--color-primary), 25%, 25% );
    --color-primary-900: hsl(var(--color-primary), 15%, 15% );
    --color-primary-950: hsl(var(--color-primary), 5%, 5% );
  }
  ```
- 快速產出的提詞
  ```jsx
  我需要你協助依據 Tailwind 4 的規則，產出一系列的色票
  我會指定名稱、色調強度、顏色
  接下來請你回覆如下的格式：
  ```
  --color-[color-name]: [Origin RGB color];
  --color-[color-name]-50: [RGB color];
  --color-[color-name]-100: [RGB color];
  --color-[color-name]-200: [RGB color];
  --color-[color-name]-300: [RGB color];
  --color-[color-name]-400: [RGB color];
  --color-[color-name]-500: [RGB color];
  --color-[color-name]-600: [RGB color];
  --color-[color-name]-700: [RGB color];
  --color-[color-name]-800: [RGB color];
  --color-[color-name]-900: [RGB color];
  ```

  名稱：primary
  色調強度：400
  顏色：#00cc99
  ```
  > 注意，色彩強度有多種規則，在此並沒有特別定義
  > 如果需要採用，可另外加入相關提詞，如： HSL 多維度調整（Tailwind CSS 方式）、Material Design 3 HCT 色彩系統

### 關於 Layer 的介紹

> 就算是相同的 class，都可以定義在 base、component、Utilities 下，但因為優先權不同，就會有各自合適的位置

**定義基礎樣式 @layer base**

- 範例
  ```css
  @layer base {
    h1 {
      @apply text-4xl font-bold leading-tight mb-6;
    }
    h2 {
      @apply text-3xl font-bold leading-tight mb-5;
    }
    h3 {
      @apply text-2xl font-bold leading-tight mb-4;
    }

    p {
      @apply text-base mb-2;
    }
  }
  ```

**定義元件 @layer component**

- 範例
  ```css
  @layer components {
    .btn {
      @apply px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 cursor-pointer;
    }
  }
  ```

**定義新的 Utility - @layer Utilities**

可以參考 Bootstrap 中 [helpers](https://getbootstrap.com/docs/5.3/helpers/color-background/) 的定義方式

- 範例
  ```jsx
  @layer utilities {
    /* 相對於原本的 utilities，他可以包多個屬性 */
    .bg-text-primary {
      @apply bg-primary-600 text-white;
    }
    .stretch-link {
      &::after {
        @apply absolute top-0 left-0 right-0 bottom-0 z-10;
        content: '';
      }
    }
  }
  ```

### @**utility 與 @layer utilities 的差異**

```jsx
@layer utilities {
  /* bg-text-primary 不包含各種狀態、中斷點等 */
  .bg-text-primary {
    @apply bg-primary-600 text-white;
  }
}
```

改為使用 @**utility 則會包含各種狀態**

```jsx
@utility bg-text-secondary {
  @apply bg-secondary text-white;
}
```

### 五、實戰

### 專案建構流程

1. 安裝環境（廢話
2. 定義規範（@theme
3. 套用 @layer base
4. 開始開發（持續優化
   1. 開發中，思考是否需要額外增加 utilities
   2. 是否有樣式需要定義成元件
      1. class 太長
      2. 有豐富的狀態

不要硬把 Tailwind 用成傳統 CSS 項目，而是順著它的 utility-first 流程，在 Tailwind 中不建議以下的做法：

- 不建議：過度使用 `@apply` 指令（官方僅有暗示，但沒有說不可以）
  ```css
  /* ❌ 錯誤做法 - 失去 Tailwind 的優勢 */
  .button {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500;
  }

  .card {
    @apply bg-white shadow-lg rounded-lg p-6 mb-4;
  }
  ```
  ```html
  <!-- ✅ 正確做法 - 直接使用 utility classes -->
  <button
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    按鈕
  </button>
  ```
- 不建議：直接使用數值而不使用設計系統
  ```html
  <!-- ❌ 錯誤做法 - 任意數值 -->
  <div class="text-[17px] leading-[23px] tracking-[0.02em] text-[#333333]">
    <!-- ✅ 正確做法 - 使用設計系統 -->
    <div class="text-lg leading-normal tracking-wide text-gray-800"></div>
  </div>
  ```
- 不建議：不使用語義化的顏色命名
  ```css
  /* ❌ 錯誤做法 - 綁定特定顏色 */
  @theme {
    --color-red-500: 239 68 68;
    --color-green-500: 34 197 94;
  }
  ```
  ```css
  /* ✅ 正確做法 - 語義化命名 */
  @theme {
    --color-danger-500: 239 68 68;
    --color-success-500: 34 197 94;
    --color-primary-500: 59 130 246;
  }
  ```
- **不建議：在產品環境中使用 CDN**
- **不建議：與其他 CSS 框架混用**

Utility-First 的相關概念：

- [https://tailwindcss.com/docs/styling-with-utility-classes#managing-duplication](https://tailwindcss.com/docs/styling-with-utility-classes#managing-duplication)
  多利用其他語言的方法，來管理樣式

### 六、為什麼 AI 時代，Tailwind 具備一定優勢

- **AI 痛點**：上下文長度有限，處理分散、多層級樣式困難，修改需追溯上下文。
- **Bootstrap 限制**：依賴 SCSS 編譯與覆蓋，AI 難獨立直接生成與客製。
- **Tailwind 優勢**：utility-first 讓樣式直寫 HTML，AI 可即時生成與調整。
