---
title: Position 定位
sidebar_position: 20
tags: [CSS, 知識點筆記]
---

### 一、五種定位模式總覽

| **值**     | **是否脫離文件流** | **參考基準**               |
| ---------- | ------------------ | -------------------------- |
| `static`   | ❌ 否              | 預設，無效果               |
| `relative` | ❌ 否（保留空間）  | 自身原始位置               |
| `absolute` | ✅ 是              | 最近的非 `static` 祖先元素 |
| `fixed`    | ✅ 是              | 視窗（viewport）           |
| `sticky`   | ❌ 否（條件性）    | 最近的滾動容器             |

### 二、五種定位模式介紹

1. **`static`**
   - 預設值，所有元素的初始狀態
   - `top / right / bottom / left / z-index` **全部無效**
     ```css
     /* 等同於沒設 */
     .box {
       position: static;
     }
     ```
2. **`relative`**
   - **相對自身原始位置**偏移，但原來的空間**仍然保留**
   - 常用來當 `absolute` 子元素的**定位錨點**
     ```css
     .parent {
       position: relative; /* 建立定位上下文 */
     }
     ```
3. **`absolute`**
   - 完全脫離文件流，**不佔空間**
   - 以最近的 **非 `static` 祖先元素** 為基準定位
   - 若找不到，則相對 `<html>` 根元素
     ```css
     .parent {
       position: relative;
     }
     .child {
       position: absolute;
       top: 0;
       right: 0; /* 貼在 .parent 右上角 */
     }
     ```
   - ⚠️ **常見陷阱**：忘記設父層 `position: relative`，導致元素跑到非預期位置。
4. **`fixed`**
   - **相對視窗（viewport）定位**，完全脫離文件流
   - 滾動頁面時**位置不變**
   - 適用：navbar、懸浮按鈕、cookie 提示
     ```css
     .navbar {
       position: fixed;
       top: 0;
       left: 0;
       width: 100%;
     }
     ```
   - ⚠️ **父層有 `transform` 或 `filter` 時，`fixed` 會改以該父層為基準（行為異常）**。
5. **`sticky`**
   - 平時如 `relative`，滾動到**指定閾值後**變成 `fixed`
   - **必須指定** `top / bottom / left / right` 其中一個才有效
   - 受父層高度限制，超出父層後停止吸附
     ```css
     .header {
       position: sticky;
       top: 0; /* 滾到距視窗頂端 0px 時固定 */
     }
     ```
   - ⚠️ 父層設了 `overflow: hidden / auto / scroll`，sticky 會**失效**。

### 三、`top / right / bottom / left` 偏移規則

- **`static`** → **無效**
- **`relative`** → **相對自身原位置偏移**
- **`absolute / fixed`** → 相對定位容器的**邊緣**
- 正值往內縮，負值往外推

### 四、`z-index` 堆疊順序

- 只對 **非 `static`** 的元素有效
- 數值越大越在上層
- 不同**堆疊上下文（Stacking Context）**之間 z-index 互相獨立
  ```css
  .modal {
    position: fixed;
    z-index: 1000;
  }
  ```

### 五、常見應用場景

| 場景                | 建議用法                         |
| ------------------- | -------------------------------- |
| 固定導覽列          | `position: fixed`                |
| 吸頂標題            | `position: sticky`               |
| 元素內的角標、Badge | 父層 `relative`，子層 `absolute` |
| 全螢幕遮罩          | `position: fixed; inset: 0;`     |
| Tooltip / Dropdown  | 父層 `relative`，子層 `absolute` |

### 六、速查小技巧

```css
/* 完全置中（absolute 元素）*/
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 撐滿父層（absolute）*/
.full {
  position: absolute;
  inset: 0; /* 等同 top/right/bottom/left: 0 */
}
```

### 七、記憶口訣

- **static** → 靜止不動
- **relative** → 相對自己
- **absolute** → 找非 static 的爸爸
- **fixed** → 釘在視窗
- **sticky** → 滾到才黏住
