---
title: HTML基本介紹
sidebar_position: 1
tags: [HTML, 知識點筆記]
---


### 一、HTML基本介紹

1. **HTML**（HyperText Markup Language，超文本標記語言）是打造網頁的基石，不屬於「**程式語言**」。它表述並定義網頁的內容。
   - 伴隨著描述網頁外觀：CSS(Cascading Style Sheets)
   - 伴隨著功能性的程式語言：JS（JavaScript）
2. 「超文本」（HyperText）是**指從某個網頁連到其他網頁的連結，不管它連結到站內或站外**。藉由撰寫與上載網頁到網際網路中，就參與了全球資訊網（World Wide Web) 這個資訊系統。
3. HTML標籤包含：
   - 起始標籤（opening tag） → 某些HTML標籤只有 Openning tag
   - 結束標籤（closing tag）
   - 內容（content）
   - 元素（element）

### 二、常用的HTML標籤

```text
<div></div>          區塊內容
<h1>~<h6>            標題
<p></p>              段落
<ul></ul>            列表
    <ol></ol>        有序列表
    <li></li>        無序列表
  圖片上傳
<a href="">          超連結
<span></span>        行內元素
<input>              輸入元素
<button></button>    按鈕元素
<form></form>        表單元素
<table>、<thead>、<tbody>、<tr>、<td>、<th>    表格元素
<header>、<nav>、<main>、<section>、<footer>   語意化標籤
```

### 三、Block vs Inline Elements 區塊級元素 vs 行內元素

1. block elements：會在頁面中產生一個可見區塊，自動換行。舉例：標題、段落、列表、導航選單、頁尾
2. inline elements：不會自動換行，常嵌在 block 元素中。舉例：`<a>、<span>`

### 四、表格製作

1. 首先要先使用`<table>、<tr>、<th>、<td>`標籤
   - `<tr>`:建構每一行。
   - `<th>`:定義每一行表格中的標題。
   - `<td>`:定義實際的數據。
2. colspan （column span）屬性定義表格單元格應跨越的列數。
3. rowspan 則定義表格單元格應跨越的行數。

### 五、表單製作

1. 前端的HTML表單內資料通常會被傳送到後端伺服器，而伺服器把收到的資料存放到資料庫後，再回傳一個回應給客戶端。
2. `<form>`標籤的"action"屬性定義了在 HTML 文檔中提交表單時將表單數據發送到何處。

   ```html
   <form action="" method="get"></form>
   ```

   - 此處的method有五種方法可以後端連接：get、post、put、patch、delete

3. `<lable>`用來對表單欄位加上標籤說明文字，提升可讀性與可及性（特別是對輔助工具如螢幕閱讀器）。

   ```html
   <lable for=""></label>
   ```

   - 此處的"for"屬性＝對應輸入欄位的input的"id"

4. `button`若放在`form`標籤裡面，type預設為`submit`

### 六、input標籤的屬性介紹

1. `<input>` 是 HTML 裡面用來建立使用者輸入欄位的元素。可以讓使用者輸入文字、數字、密碼、上傳檔案、選擇日期等等。是「單一標籤元素」（self-closing），通常寫成 <input />。
2. 基本語法：`<input type="text”>`
3. 常見屬性介紹：
   - `type` 決定輸入的資料型態，例如：text、number、password、email、file、date
   - `placeholder` 顯示在輸入框內的提示文字，例如：`placeholder="請輸入姓名"`
   - `value` 預設的輸入值，例如：`value="Hello"`
   - `name` 資料送出時的參數名稱，例如：`name="username"`
   - `required` 必填欄位，沒填不能送出
   - `disabled` 讓欄位變成不可輸入（灰色）
   - `readonly` 只能看不能改，但可以被送出
   - `maxlength` 限制最多可以輸入幾個字
   - `minlength` 限制最少可以輸入幾個字
   - `radio`用來讓使用者在一組選項中只能選擇一個

### 七、其他標籤屬性介紹

1. `select` 是一種**下拉式表單**元件，讓使用者從清單中選擇一個或多個選項。
   - 使用方法：舉例：選擇"所在縣市"，需要設定`label`及`select`
   - 注意：要記得要寫好label的for因為接下來會對應著select的name，如此一來才可以綁住

   ```html
   <label for="city">縣市</label>
   <select name="city" id="city">
     <option value="台北市">台北市</option>
     <option value="新北市">新北市</option>
     <option value="桃園市">桃園市</option>
     <option value="台中市">台中市</option>
     <option value="台南市">台南市</option>
     <option value="高雄市">高雄市</option>
   </select>
   ```

2. Datalist 是一種建議輸入選單，搭配 `<input>` 使用，提供輸入提示選項，但不會限制使用者只能選擇建議項目。

   ```html
   <label for="area">縣市</label>
   <input list="area-list" type="text" id="area" name="area" />
   <datalist id="area-list">
     <option value="台北市">台北市</option>
     <option value="新北市">新北市</option>
     <option value="桃園市">桃園市</option>
     <option value="台中市">台中市</option>
     <option value="台南市">台南市</option>
     <option value="高雄市">高雄市</option>
   </datalist>
   ```

- 使用方法：舉例：選擇"所在縣市"，需要設定`label`、`select`及`datalist`
- `datalist`設定id是為了連接到`input`

1. `<br>`換行標籤：插入一個換行符，讓文字跳到下一行 → 在不想使用 `<p>`卻需要換行的地方使用，如詩句、地址等。
2. `<hr>`水平線標籤：插入一條水平線，代表主題或段落的分隔。
