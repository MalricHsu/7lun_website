---
title: NodeJS｜全域物件與執行環境
sidebar_position: 1
tags: [NodeJs, JavaScript, 知識點筆記]
date: 2026-05-02
---

### 一、核心定義與環境

- 在 JavaScript 中，無論在哪個**執行環境（Runtime）**，都存在一個**全域物件（Global Object）**，它是所有全域變數和函式的頂層容器。
    1. **`window`**：專屬於**瀏覽器環境**。它既是全域物件，也代表了**瀏覽器**的一個視窗或標籤頁。
    2. **`global`**：專屬於 **Node.js 環境**。它是 Node.js 執行程序中的頂層物件，用於提供**伺服器端**的基礎功能。

### 二、環境對比表
- 比較表

  | **特性** | **瀏覽器 (window)** | **Node.js (global)** |
  | --- | --- | --- |
  | **主要角色** | 網頁介面、視窗控制 | 伺服器端環境、系統資源管理 |
  | **DOM / BOM** | 支援 (`document`, `navigator`) | 不支援 (ReferenceError) |
  | **底層系統存取** | 限制 (安全性考量) | 支援 (`process`, `fs`, `Buffer`) |
  | **宣告行為** | **`var` 宣告會綁定到 `window`** | **`var` 宣告僅限於該模組(檔案)** |
  | **常見 API** | `alert()`, `localStorage`, `fetch` | `__dirname`, `__filename`, `require` |

### 三、重要行為差異：全域污染與模組化

- 這是開發中最容易出錯的地方：
    - **在瀏覽器中**：如果你在 Script 的最外層寫 `var score = 100;`，你可以透過 `window.score` 存取它。這容易導致不同腳本間的變數互相覆蓋。
    - **在 Node.js 中**：Node.js 強制執行「模組化」。你在檔案 A 中寫的 `var score = 100;` 僅屬於檔案 A。`global.score` 會是 `undefined`。若要建立真正的全域變數，必須顯式寫成 `global.score = 100;`。