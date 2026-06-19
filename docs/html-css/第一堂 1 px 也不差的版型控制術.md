---
title: 第一堂 1 px 也不差的版型控制術
sidebar_position: 10
tags: [CSS, HTML, 課程筆記]
---

- [課程講義](https://hackmd.io/uEK09rOdQFq5TlBFKOAFBg)
- [助教講義](https://chalk-freedom-ec6.notion.site/2236ab47eb48802c9f4bd60b0b70ef01?pvs=74)

### 一、建立環境

- CSS Reset
  - MeyerWeb：[https://meyerweb.com/eric/tools/css/reset/](https://meyerweb.com/eric/tools/css/reset/)
  - Normalize：[https://github.com/necolas/normalize.css/blob/master/normalize.css](https://github.com/necolas/normalize.css/blob/master/normalize.css)
- 插件安裝
  - [Live Server](https://hackmd.io/QpfYS3cwTl2NMU7bUqFNxw?view)

### 二、切版變成神速的容器觀念

- 範例設計稿：[Figma](https://www.figma.com/design/ZQn0etbtIsCrmkHqFeeLKo/%E5%88%87%E7%89%88%E7%9B%B4%E6%92%AD%E7%8F%AD---%E7%9B%B4%E6%92%AD%E6%95%99%E6%9D%90?node-id=0-1&t=XjWPehxHQRuEh7sc-1)
- 網頁可以切分為容器與內容
- 範例網站：[MDN](https://developer.mozilla.org/zh-TW/)、[Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/)、[Shopify](https://themes.shopify.com/?locale=zh-TW)
- 介紹的重點包含：
- 標籤介紹
  - h1 ~ h5，html 5 規則中，每個區塊能有多個 h1
  - ul、li
  - Header
  - Footer
  - Nav
  - Section
- **什麼是容器，什麼是內容**
  - 容器目的在定位
  - 內容目的在呈現主體
- 補充介紹：容器、內容、裝飾
- 語意標籤：
  - 讓電腦讀懂你的 Code
  - 增加開發者可讀性
  - ~~SEO~~
- 口訣：使用容器定位，再塞進內容

### 三、切版變成神速的常見誤區

- 容器寬度：背景也要設計
  - 限制寬
  - 滿寬（通常用在背景上）
- **滿版式網頁與 CSS 選擇器設計**
  - [蝦皮](https://shopee.tw/)
  - [IT 鐵人邦](https://ithelp.ithome.com.tw/)
  - [Apple](https://www.apple.com/tw/)
  - [範例程式碼](https://codepen.io/liao/pen/yLYyYaZ)
- CSS Framework
  - [Bootstrap](https://getbootstrap.com/docs/5.3/layout/containers/)
  - [Tailwind UI](https://tailwindui.com/components/application-ui/layout/containers)

### 四、切版變成神速的區塊與行內元素概念

- display: block、inline 概念複習
  - 問題哪些元素是 行內元素
    1. div
    2. **span**
    3. **i**
    4. p
    5. ul
    6. li
    7. **a**
- 行距設定：line-height 的高度影響
  - 全局設定技巧：
    - 一般為1.5 行高
    - 標題可以是 1.2 行高（常見
- margin、padding
- 圖片距離分享
  - 向下會多 3px
  - `img { vertical-align: middle }`

### 五、常見錯誤

- **常看到寫死高度與寬度**
- **上下 margin、padding 推擠用 %**
- **不拆內容與容器！**
  - 口訣：使用容器定位，再塞進內容

### 六、常見問題

- class 名稱順序，共用的 class 性質放自訂的 class 名稱後面，例如：`<div class="profile container">`
- **避免以寫死容器高**
- 圖片可以設定 `display: block;`
