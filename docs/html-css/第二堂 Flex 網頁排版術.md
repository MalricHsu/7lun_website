---
title: 第二堂 Flex 網頁排版術
sidebar_position: 11
tags: [CSS, HTML, 課程筆記]
---

- [課程講義](https://hackmd.io/yVyF8dSvSr6L7P_ya0GQxw)

### 一、Flex 介紹

1. 為什麼要使用 Flex？
   - 傳統區塊元素的問題
   - 解決更複雜的排版需求
2. Flex 基礎觀念
   - Flex 外層容器介紹，直接寫個小範例
     - 內元件要有效果，就要在外容器加上 display:flex
     - 每個 HTML 標籤，能同時擁有內元件跟外容器身份
   - Flex 主軸與交錯軸觀念([測試工具](https://codepen.io/Wcc723/pen/YzbxBxp))
3. 交錯軸對齊：align-items，畫四張圖軸線圖解釋
   - Flex 裡還可以包 Flex
     - [時光屋範例 Jason Wang](https://codepen.io/JW750625/pen/oNXQyWK)
     - [hexschool](https://www.hexschool.com/)
   - margin 在 Flex 中的神奇運用方式
   - **口訣：**
     1. 先專注在主軸的走向
     2. **Flex 一次只解決單向問題**（當遇到相簿等巢狀格式，請一層一層處理）

### 二、外容器常用語法

- Emmet 教學：[https://docs.emmet.io/cheat-sheet/](https://docs.emmet.io/cheat-sheet/)
- **口訣：先專注在主軸的走向**
- 決定軸線：flex-direction (互動詢問)
  - 1.**row**
  - 2.row-reverse
  - 3.column
  - 4.column-reverse
- 主軸對齊：justify-content (開始代入範例)
  - **1.flex-start (預設)**
  - 2.center
  - 3.flex-end
  - 4.space-between
  - 5.space-around
  - 6.space-evenly
- 換行屬性：flex-wrap
  - 1.**nowrap(預設)**
  - 2.wrap
- 交錯軸單行對齊：align-item
  - 1.flex-start
  - 2.center
  - 3.flex-end
  - 4.**stretch(預設)**
  - 5.baseline
- 交錯軸多行對齊屬性：[align-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-content)
- margin. `|[box1][box2]←(margin-right: auto 吸收剩餘空間)→[box3]|`

### 三、網站範例觀看

- [Apple - justify-content](https://www.apple.com/tw/shop/buy-mac/macbook-pro/16-%E5%90%8B)
- [蝦皮](https://shopee.tw/)

### 四、Flex 補充資源

- [圖解：CSS Flex 屬性一點也不難](https://wcc723.github.io/css/2017/07/21/css-flex/)
- [卡斯伯完整 Flex 影音教學](https://www.youtube.com/watch?v=88ymaHaStoQ)
