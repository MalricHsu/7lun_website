---
title: 網站LOGO圖片取代文字方法
sidebar_position: 4
tags: [CSS, 知識點筆記]
---

### 一、前言：

- 由於想要讓網站的Logo圖片可以被搜尋引擎搜尋到，因此在Logo的圖片上設定h1的標籤，但若將h1標籤有寫字會影響排版，故會利用以下的語法，將文字隱藏起來

  ```css
  text-indent:101% ;    // 是 CSS 語法的縮排或凸排的語法，概念就跟 Word 的首字凸排或縮排一樣。
  overflow: hidden ;    // 當元素超出範圍時，元素就隱藏
  white-space: nowrap;  // 因為文字到達元素最大範圍時，通常會自動換行，但是這邊設置強制不讓他換行。
  ```
