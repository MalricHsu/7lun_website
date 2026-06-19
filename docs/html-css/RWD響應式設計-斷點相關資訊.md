---
title: RWD響應式設計-斷點相關資訊
sidebar_position: 5
tags: [CSS, HTML, 知識點筆記]
---

### 一、Mobile-first vs Desktop-first

1. **手機優先（Mobile-first）**
   - 特點：
     - **基礎樣式為手機尺寸**
     - 使用 `min-width` 媒體查詢，逐步擴展至平板、桌機
     - 近年主流做法，因為使用者多數使用手機上網
2. **桌機優先（Desktop-first）**
   - 特點：
     - **基礎樣式為桌機尺寸**
     - 使用 `max-width` 媒體查詢，逐步縮減至平板、手機
     - 過去較常見，現今較少採用

### 二、斷點規劃

1. 先要有個認知，響應式無法讓所有螢幕解析度都最佳化
2. 遵循80/20法則，先兼容熱門瀏覽器

### 三、查詢市場螢幕相關數據連結

1. [螢幕市場趨勢](https://gs.statcounter.com/screen-resolution-stats)
2. [Viewport Sizes 服務網站介紹](https://yesviz.com/)
