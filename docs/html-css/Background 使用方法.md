---
title: Background 使用方法
sidebar_position: 2
tags: [CSS, 知識點筆記]
---

### 一、背景語法

    ```css
    background-image:url("輸入圖片位置或網址")  //**在背景插入圖片時，需要設定“高度”**
    width:350px;
    height:70px;
    background-color:#000;
    background-repeat:no-repeat;  //預設是repeat
    background-size: containe; //盡可能大地等比例縮放圖像
    background-position:center; //背景圖像的初始位置
    ```

### 二、語法的意思

1. **background-color**

- **用途**：設定 HTML 元素的背景顏色。
- **值**：可使用顏色名稱（如 `red`）、十六進位色碼（如 `#ff0000`）、RGB/RGBA、HSL/HSLA，或關鍵字。
- **常見關鍵字**：
  - `transparent`：背景完全透明。

2. **background-image**

- **用途**：在元素上**設置一個或多個背景**圖像。

  ```css
  background-image: url("bg1.jpg"), url("bg2.png");
  ```

3. **background-size**

- **用途**：定義背景圖像的大小。
- **常見值**：
  - `auto`（預設值）：使用圖像原始大小。
  - `cover`：**等比例縮放填滿整個容器**，可能會裁剪。
  - `contain`：**等比例縮放圖像使其完全顯示**，可能留白。

4. **background-position**

- **用途**：設定背景圖像的初始顯示位置。
- **常見值**：
  - 關鍵字：`left`、`center`、`right`、`top`、`bottom`
  - 也可使用百分比或像素：

    ```css
    background-position: 50% 50%; /* 正中央 */
    background-position: 10px 20px;
    ```

5. **background-repeat**

- **用途**：設定背景圖像是否重複。
- **常見值**：
  - `repeat`（預設值）：重複水平與垂直方向。
  - `no-repeat`：不重複。
  - `repeat-x` / `repeat-y`：只水平 / 垂直重複。

6. **background（Shorthand 縮寫）**

- **用途**：一次設定所有背景相關屬性。⇒ 沒有順序之分
- **屬性順序（可省略部分）**：

  ```css
  background: <color> <image> <position> <size> <repeat>;
  ```

7. **圖片問題**

- 當圖片因為高度限制而**被裁切或跑版**時，可以使用：`object-fit: cover`

  ```css
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
  ```
