---
title: Font 字體介紹
sidebar_position: 3
tags: [CSS, 知識點筆記]
---

### 一、**系統字體介紹**

1. **字體分類**
   - `serif` 歐文襯線字體（中文稱：明體）：中文在末端會有凸起的裝飾線，英文則是在頭尾皆有額外的裝飾線

   - `sans-serif` 歐文無襯線字體（中文稱：黑體）：無論中英文皆沒有任何裝飾線

   - 系統上也都有包含預設襯線與無襯線所預設的中英文字體：`cursive`、`fantasy`、`monospace`，但這些字體就並非有完全對應的中英文，**實作上還是以襯線與無襯線兩種為主**。

### **二、必要熟悉的系統字體**

1. **Windows ：使用人數最多的桌面作業系統（80%）**
   - 英文字體：在過去是使用 Arial，這款是仿造 Mac OS 的 Helvetica 字體所製作而成的，**現在則是使用 [Segoe UI](https://zh.wikipedia.org/wiki/Segoe)。**
   - 中文字體：**微軟正黑體**，相當經典的黑體字，缺點是**只有單一字重**，缺乏較粗或較細的字體。
   - **Windows 系統預設的中文字體是「新細明體」**

2. **Mac OS / iOS：**
   - 英文字體：過去是使用 Helvetica Neue 的經典字體，**現在無論是 iOS 或 Mac OS 均是使用 [San Francisco](https://github.com/supermarin/YosemiteSanFranciscoFont)**，這款字體不會直接出現於繪圖軟體之中，需要另外安裝。
   - 中文字體：現在是使用**蘋方字體**，**這款是少見包含「多個字重」的中文系統字體（5 種）**，設計運用上自然能有更多的發揮空間。

3. **Android：**
   - 英文字體：[\*\*Roboto](https://fonts.google.com/specimen/Roboto)** ，這一款字體運用上也是非常靈活，擁有 **6 種字體且均另有斜體（italic，共 12 種）\*\*。
   - 中文字體：資料上顯示有兩款 Droidsansfallback 及 [Noto Sans](https://www.google.com/get/noto/)。 → Noto Sans 是 Google 與 Adobe 公司共同研發的開源字體，包含 7 種常用字重並且幾乎包含所有中文字，號稱最不會缺字的字體庫，**目前是設計師必備的中文字體**。

### 三、基本用法

1. font-family 可以設定一種字體或多種不同的字體，**每種字體間用半形逗號「,」**隔開。
2. 字體名稱時**不用加上雙引號**，但**如果你的字體名稱中間空格，就一定要加上雙引號**。

3.  **generic-family 這個專有名詞**，翻譯成中文就是「**通用字**」，也就是在作業系統中完全找不到對應字體預設會顯示的字體，因此通用字**會寫在 font-family 的最後面**，作為最終的選項。
4. 常用的通用字有五種，分別是 ***sans-serif ( 無襯線體 )、serif ( 襯線體 )、monospace ( 等寬體 )、cursive ( 手寫體 ) 和 fantasy ( 幻想體 )***

### 四、字體載入方式

- 微軟正黑體 會跟 Apple的 蘋方 相似

1. [如何載入 Google Fonts?](https://hackmd.io/@Yo5GrExxRfClh2IThnFHhQ/SygAkXnO8)
2. [Mac 內建字體列表](https://zh.wikipedia.org/zh-tw/MacOS%E5%AD%97%E4%BD%93%E5%88%97%E8%A1%A8)
3. [Windows 內建字體列表](https://zh.wikipedia.org/wiki/Microsoft_Windows%E5%AD%97%E5%9E%8B%E5%88%97%E8%A1%A8)
4. [Microsoft JhengHei](https://zh.wikipedia.org/wiki/%E5%BE%AE%E8%BB%9F%E6%AD%A3%E9%BB%91%E9%AB%94)
