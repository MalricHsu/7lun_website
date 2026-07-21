---
title: Vue｜Vue 基礎概念及指令
sidebar_position: 2
tags: [Vue , "知識點筆記"]
date: 2026-04-21
slug: vue-basics-and-directives
---

### 一、基本指令

- 學習 Vue.js，最核心的入門點就是掌握它的**指令（Directives）**。這些指令是帶有 `v-` 前綴的特殊屬性，負責將數據響應式地應用到 DOM 上。

- 圖表

  ![ 基本指令 ](/img/vue01-1.png)

- **內容渲染指令**：用於控制 HTML 標籤內的內容顯示。
  - **`v-text`**：設置標籤的文本內容，會覆蓋原有的內容（類似原生 JS 的 `innerText`）。
  - **`v-html`**：將數據作為 HTML 插入，能解析標籤。**注意：** 僅在可信內容上使用，防止 XSS 攻擊。
  - **`{{  }}` (插值表達式)**：最常用的方式，可以在文本中嵌入變數，不會覆蓋整個標籤。
- **雙向數據綁定**
  - **`v-model`**：主要用於表單元素（input、textarea、select），實現數據與視圖的**雙向同步**。當輸入框內容改變，變數會同步更新；反之亦然。
- **屬性綁定與事件監聽**：這是 Vue 與使用者互動的基礎。
  - **`v-on`**：監聽 DOM 事件並觸發對應的 JavaScript 邏輯。
      - **簡寫**：`@`。例如 `@click="handleClick"`。
      - **修飾符**：如 `@click.stop`（阻止冒泡）、`@submit.prevent`（阻止預設行為）。
  - **`v-bind`**：動態綁定 HTML 屬性（如 `src`, `href`, `class`, `style`）。
      - **簡寫**：`:` (冒號)。例如 `:src="imageUrl"`。
- **條件渲染**：根據表達式的真假來決定元素的顯示或隱藏。
  - **`v-if` / `v-else-if` / `v-else`**：這是 **「真正」的條件渲染**。如果條件為假，元素會直接從 DOM 樹中被銷毀；條件為真時再重新創建。
  - **`v-show`**：**僅切換 CSS 的 `display: none` 屬性**。元素始終存在於 DOM 中。
    - **開發建議：** 如果需要頻繁切換顯示狀態，用 `v-show` 效能更好；如果運行時條件不太會改變，用 `v-if` 更省記憶體。
    
    ```html
    <template>
      <div id="app">
         <button @click="isBoxVisible = !isBoxVisible">
            {{ isBoxVisible ? '點我隱藏' : '點我顯示' }}
          </button>
         <div v-show="isBoxVisible" class="box">
            你好！我是用 v-show 控制的區塊。
         </div>
      </div>
    </template>

    <script setup>
     import { ref } from 'vue';
     const isBoxVisible = ref(true);
    </script>

    <style scoped>
      /* 這裡可以放您的 .box 樣式 */
     .box{
       display:none;
      }
    </style>
    ```
    
5. **列表渲染**
- **`v-for`**：基於一個數組或對象來循環渲染列表。
    - **語法**：`v-for="(item, index) in list" :key="item.id"`
    - **重要**：使用 `v-for` 時**必須**綁定一個唯一的 `:key`，這能幫助 Vue 的 Diff 算法精準定位更新，提升效能。

### 三、Vue 內容渲染

-  [Vue 內容渲染 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/gbwydVd?editors=1010)
-  資料呈現於畫面上 
  - `{{  }}`：使用雙大括號中間可直接插入元件資料或者任何表達式內容來呈現。
  - `v-text`：與前者相同，同時可運用在標籤上。
  - `v-once`：綁定的標籤僅會輸出一次資料於畫面上，往後的更新將不會再做更動。
  - `v-html`：可同時輸出 HTML 結構，在使用上要特別注意：**請只對可信內容使用 HTML 插值，絕不要對用戶提供的內容使用插值。（XSS 攻擊）**，詳細說明可參考：[v-html 指令](https://cn.vuejs.org/api/built-in-directives.html#v-html)


### 四、v-model 雙向綁定

- [Vue V-Modal 基礎操作 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/gbwyBoy)
-  說明：用於表單的資料與元件產生雙向綁定 
-  注意：`v-model` 會忽略所有表單元素的 `value`、`checked`、`selected` 特性的初始值而總是將 Vue 實例的數據作為數據來源。需透過 JavaScript 在元件的 `data` 選項中宣告初始值。
-  `v-model` 修飾符：此修飾符是搭配 `v-model` 使用，與 `v-on` 的觸發器略有不同，用來延遲觸發、改變型別、修飾字串等等
    - `lazy`：避免持續性觸發，可以在編輯完後才觸發資料更新（使用 change 的形式進行同步）
        - `v-model` 後方加上 `.lazy` 修飾符
        - 當 `input` 編輯時，無法直接修改畫面上的值，需要離開 `input` 時才會觸發
    - `number`：限制只有數值型別的資料才能寫入，以下範例中的 number 資料會是以 `number` 型別傳入，無法透過該 `input` 套用其它資料型別。
        - 無論 `input` type 為何，`input` 預設所傳入的型別為字串
        - 可以使用 `.number` 的修飾符，確保用戶所輸入的為純數值
    - `trim`：修飾掉首尾的空白
        - 用戶在輸入文字時，可能會在結尾補上空白，使用 `.trim` 修飾符則會移除結尾的空白字元


### 五、v-model 表單運用

- [Vue V-Model 表單運用 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/emdoPQE)
- `v-model` 除了用在 input 上以外，所有的表單項目也都可套用。
- 如 `select`、`checkbox`、`textarea` 皆可，不同的項目應用方式略有不同。
    - `select`：作為 Select 的選項可以直接使用 option 標籤中的 value，或是透過 `v-for` 搭配元件內的 data 產生多個 `option`，兩者都是同樣以 value 作為資料來源。
        - `select` 所綁定的 `v-model` 其值來自於 `<option></option>` 內的 value
        - `value` 可以使用自行撰寫或使用 `v-for` 搭配 Vue Data 來呈列
    - `Checkbox` 與 `Radio`
        - 預設來說，`checkbox` 是作為一個資料的 true or false。
        - 當 input checkbox 沒有設定 value 時，預設是作為 `v-model` 對應屬性的 true or false
        - 也可做為多個選向，將資料綁定到同一個陣列內。
        - `checkbox` 是多選選項，如果多個 input checkbox 的 `v-model` 是對應同一個 data，並且有設定 value 時，則是將該 data 視為一個陣列，核取的選項則為陣列內的值
    - `Radio` 則是單一選項範例重點：
        - `radio` 則是單一選項
        - 如果多個 input radio 的 `v-model` 是對應同一個 data 時，該 `v-model` 的值則是核取的 radio 選項

### 六、v-on：事件觸發器

- [Vue 事件觸發器 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/bNwJXwv?editors=1010)
- 事件觸發器：可以用 v-on 指令監聽網頁上的事件（如同純 JS 的 DOM 事件），並在觸發時運行一些 Vue 的方法。
  - 直接操作元件內的資料
      - v-on 是觸發器，click 是觸發的方法
      - HTML 中的 v-on:click 可以直接操作 data 內的資料
  - 運作元件內的 methods
      - v-on:click 內可以直接帶入方法，此方法來自於 Vue 中的 methods
      - 傳入的方法也同樣可以帶入參數
- 事件修飾符：HTML 中本身有預設的事件，如 `a` 的預設事件則是跳制特定連結，而事件修飾符可以增加或移除事件，完整的事件修飾可參考。
  - prevent
      - prevent 加入到 v-on:click 後方，即可移除 a 連結的預設事件（不會開啟新頁）
      - 移除預設事件後會執行觸發器內的事件
  - v-on:submit.prevent：移除預設的 HTML 事件
      - 表單送出時會對 action 中的網址進行 post，prevent 加入到 v-on:submit 後方時則不會進行 post
      - 移除預設事件後會執行觸發器內的事件
- 按鍵修飾符：除了移除事件外，也可以在觸發器上增加額外的事件監聽，如 Enter、Key（按下特定案鍵） 等等
      - 針對 input 標籤額外增加按鍵修飾符，按下特定按鍵時則會運行 methods 中的方法
      - methods 的方法只有特定按鍵才能觸發，如：enter、keyup.a …
- 縮寫：
      - v-on 可以使用 @ 縮寫  `<button @click="onClick">A</button>`


### 七、v-bind

- [Vue 動態屬性 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/vEXMQEq)
- 說明：動態地綁定 HTML 屬性，將資料傳遞到元素上。
- 縮寫：`:`
- 動態屬性
    - `:` 是 v-bind 的縮寫
    - v-bind 可以使用各種 JS 的表達式
    - 可以傳入 data 內的資料
    - input 中可以使用 `:value` 動態屬性傳入 data 內的值或是任何 JS 表達式的結果
    - `:src` 也同樣道理可傳入 data 內的網址來呈現圖片
- 綁定 Class
    - 綁定樣式，參考文件 [Class 與 Style綁定](https://cn.vuejs.org/guide/essentials/class-and-style#class-and-style-bindings)
    - 可以透過 `:class` 的物件綁定並動態切換 Class，物件的屬性為 className，後方的值是表達式結果，如果為真值則會套用該 className。
    - `:class` 可以使用動態切換 className
    - `"{rotate: isTransform}"` 物件中的前者為 className 名稱，後者為判斷式，當為真值時則啟用前者的 className
    - 可以透過動態切換 `isTransform` 的 `true` or `false` 來決定是否套用 `rotate`
- 綁定的物件也不需要撰寫在模板內，在 data 內定義同樣可運作：
   - 同樣的邏輯也可直接寫於 data 內，優點是可以同時定義更多的 className 而不造成 HTML 的混亂
- 可使用陣列操作，同時為同一個元素賦予多個樣式
    - 如果傳入的是陣列，則可以直接啟用該 className
    - 透過 checkbox 的切換，則可以操作陣列內的多個值
- 行內樣式
    - Style 也同樣可以使用動態屬性的方式傳入，但要特別注意 class 的名稱要使用小駝峰
    - 可以透過 :style 的方式傳入樣式
    - 傳入時，樣式的屬性名稱需要使用小駝峰的方式撰寫
    - `{ backgroundColor: 'red' }` 前者為 CSS 的屬性，後者為該屬性的值


:::note 
易混淆觀念：動態屬性 VS 靜態屬性（ex: `:src` vs `src`）
- **靜態屬性**
  - 無法進行運算
  - 型別一律是字串
- **動態屬性**
  - 可以傳入任何表達式結果，如：
    - `true`, `false` vs `'true'`
    - `1` vs `'1'`
  - 可以傳入 Vue 的 data
:::




### 八、v-if, v-else, v-else-if, v-show

- [Vue 條件渲染 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/qEawLOd)
- `v-if` 用於條件的方式渲染一個區塊，當指令的內容回傳為真值時會產生結構內容。
    - 當 v-if 的結果為真值時，則會置入該區塊的結構內容
    - v-else, v-else-if 則為 v-if 的延伸運用，會延續著 v-if 的結構後方
- `v-show` 與 `v-if` 同樣是用來切換物件的呈現，但兩者有很大的差異：
    - `v-if` 會 **完整移除 DOM 元素**，使其從 HTML 結構上消失。當使用此方法切換 Vue 元件時，元件的生命週期會重新計算。
    - `v-show` 是將物件 **加上 `display: none`*，讓物件從視覺上不可見。
    - 此方法運行結果與上述相同，但元素是套用 `display: none` 作為顯示上的切換。
- `v-if`、`v-show` 怎麼選擇？
    - 當元件生命週期需要在顯示時重新計算，則可以使用 `v-if`，如果則否可用 `v-show`。
    - 當元件隱藏時，同時需要完整移除 DOM 結構，也可使用 v-if
    - v-if 與 v-for 則有另外的衝突問題，會在 v-for 詳細說明。
    - 請使用開發者工具檢視畫面上的「成功、失敗」區塊，可以發現是使用 `display: none` 的方式隱藏，而不是移除整個 DOM 結構。


### 九、v-for

- [Vue 列表渲染 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/raMboeg)
- `v-for` 可以針對一組陣列或物件進行渲染，指令中會使用 `(item, key) in array` 的語法，其中：
    - item：陣列迭代的元素別名，名稱可自訂
    - key：如果是陣列則為該迭代的索引位置，如果是物件則為該迭代的物件屬性
    - array：陣列或資料的來源
- v-for 的結構為 `v-for="(item, key) in array"`
    - 無論是陣列、物件都可以使用 v-for
    - 陣列的索引為 `0, 1, 2...`，物件索引則為屬性名稱
- v-for 注意事項
    - 由於 v-for 在運作上是採用快速替換的形式。因此，有部分元素會沒有完整的被替換，可參考以下範例：
    - 情境：當 input 輸入內容後，按下反轉陣列時：
        - 如果沒有 key 時，則 input 位置不會被同時更動
        - 當有加上 key 時，input 位置會與原本的資料內容位置一起變動
        - **新版的 Vue 相關開發工具中，都會強烈建議加上 `key`。**
    - 範例最下方有一個反轉陣列的按鈕，按下後會反轉上方的結構
    - 試著輸入一些內容，並反轉整個結構
    - 注意元素中是否有 key 屬性，這會影響到是否能夠 input 是否有隨著結構反轉
- 當渲染陣列資料卻不便產生新的標籤時，可以搭配 `<template>` 標籤做使用，此方法即可在產生 DOM 結構時不產生額外的標籤。另外 `template` 標籤也同樣可用於 `v-for` 上
    - 可以使用 `template` 標籤替代原有的 HTML 標籤，而 `template` 標籤是不會被輸出的。
- 為了避免不要的錯誤，Vue.js 的規範中建議不要將 v-for 與 v-if 混合使用。搭配進階工具如 Vue Cli 及 ESLint 時，兩者混合使用會跳出錯誤。
    - 盡可能將 v-if 與 v-for 用不同的標籤呈現



### 十、TodoList實作
 - [VueTodoList](https://play.vuejs.org/#eNqlV1tvE0cU/ivDPjkSuy4hvAQ7ohceqKq2aqO+YB423rE9sDftzOaiyBJtSUswgaqXUEhogDaUgkiqFEEaCPyXyrt2nuAn9MzMXmYdk1LxkGR35ly+c/vOZl571/eN6RBr41qFYce3TYYnai5CFYtMo7ptUlqtaXXPZSZxcYAcpo/VNCEBMq3RTMSZEhev1n64iSY9y/uIUIaizbvd3dXe5oXu806l3BpN9BLtQ7qO4uU/ozu/REvno9uXkK6nhlXnxPVDpjcDL/QR94Joy7S8GZ06GRDQEFLpG0Jszsegy/Asq2n5cWqz4QWOzqMKPFu9h/jruOXZFg5Aqv+g03+2HS2sd5/+2n9+t7vT2bu1YBiGqjGtO56F7SG+TpzDc6FvYJcJY6Zl8bzkEuUc/FTImOdm6KaYi+BH9wPimMEc8md5btOYpDC8n6jbpH5ONZ1ZREliMw9lqZXmtwwJzooYCChKUaKL1/q37+0rSmtMrfZRWe3LqLt7q3fjQry9EC1vQJHHUvHQzsRtaIb/rKBNksZQC5Vr6gT6E1l6w8az6GxIGWnMiRJCgvUpzGYwdpFpk6YrJKleF5kv1grqzisFyULERfwvhUTmEuNQs0TAIFauqyS2Qn0zL1WD6scgiPl5YczgPYDa7UqZC6lKeb4PLrkXMhsGTacYQrN48fkpdZCD9VG15n6AfTPAvO4l7noEUHRfbMQ//j1Q6zfzZ5luE8ZbOlP9QG9jVnQTXby/d/23IW7UtuJvNilU93U15UlLqiWfnZBhC/lzvMegaKSRlIQaNnabrIWq1Sp6p9DuvZWNaHEp3vo+Xl1UpxW9WruyOARRpRzaxabvPbnXf7Y5lIkSCNgibBI4UnRGzo1mYOUNjaa8AMhDnzEDl7hNtb8LhApK+pRnzRWCqLSOFSUYYTaWOckN/rN69eX2VSSLrcYKw3dsoOeGkygTw1toD3GvDMI+Dh24G06kA0I5N2apG2psgCnBXIMETpEti4x5UEvTsF7HlM/1awmz4GGid2enf3/pf41NNp4HejHdOrYTJ9HV5fjxxTcYGoWZs+f0qVJWdjS80npAfIYoZqEPJ8TxvYCheRTgBmqjRuA5qKbBdq9px7l8uYx6nfPxQqe3cbv33Tc1F4KALS1Iq8qVSpBvbQRkkws+c8nNaY5jXgIj1jg6clg+c+Vx8NLfetJbXInWH9c0cdMWvxWF0QGFaPMB+iLEsD5W4/WHqVbNPcP9pwjSvklACHPcGMcpFFJr4rUtVSHM5LPi0lr/693UVrIlwVRpBFUnJDbSQKVD3IgxbdohNhis3NLICHhjYeAeR2Br78sX0cJSdOkWfAj0/tiJHl7rbm8J34KSpJ4f0paEJwG6eAZ9AHUqjRhNzCaJA0+FBOzzKePnEUgReQloeXBw2k5jk/RbjC1naR6eIOosRClBXAv2ZrUAugGHp/h5qcSJWKjwByA4QbHJGkwwKYrUhxbHJWHzMDrCBTJ48c5y9NV1yaYpPGVZ7ceXcUMa8DyCbyyxo9uiAHHnSX/rZnf7fPfpbv+vb+Pl6y+fXZZV6a08iq+sxyuPos5P0ZW16PeObHAFj5zuIh5l/oe0QxGQoKzBvni7vA44GJLh08LsGbBblBVy+xOW5Gl7AfpTRhrfeBA9/Bm2mdo4goIGMpFxVDERw3xIU/BtI1hnQjusMSoy2TTOUs+FfyGEKqdXxyc2Dj7xGQEvNW08JQL4VrVtb+ZDccaCECczATotXD835PwsneVnNe3TAFMcTAOXZXfMDGC45PXJzz8WqyW7hNUT2iB9wOVnmHp2yDFKsfdC1wLYipxAe0rQKizfSXpyFj43aRoUB5pznWDa9w8IPYd71BhL2K6ttf8FHHzLJQ==)

```vue
<template>
  <div class="container mt-4">
    <h2 class="mb-4">📝 TodoList 實作範例</h2>
    
    <!-- 新增區塊 -->
    <div class="input-group mb-4 shadow-sm">
      <input
        type="text"
        class="form-control"
        placeholder="請輸入代辦事項..."
        v-model="text"
        @keyup.enter="addTodo"
      />
      <button class="btn btn-primary px-4" type="button" @click="addTodo">
        新增
      </button>
    </div>
    <hr />

    <!-- 列表區塊 -->
    <h4 class="mb-3">📌 你的清單</h4>
    <ul class="list-group mb-4 shadow-sm">
      <li 
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="todo in todos" 
        :key="todo.id"
      >
        <span class="fs-5">{{ todo.text }}</span>
        <div>
          <button class="btn btn-outline-secondary btn-sm me-2" @click="prepareTodo(todo)">修改</button>
          <button class="btn btn-outline-danger btn-sm" @click="deleteTodo(todo)">刪除</button>
        </div>
      </li>
      <li class="list-group-item text-center text-muted py-3" v-if="todos.length === 0">
        目前沒有代辦事項 🎉
      </li>
    </ul>

    <!-- 編輯區塊 -->
    <div v-if="editTemp.id" class="card shadow-sm border-warning">
      <div class="card-body">
        <h5 class="card-title text-warning">✏️ 修改代辦事項</h5>
        <div class="input-group mt-3">
          <input 
            type="text" 
            class="form-control" 
            v-model="editTemp.text" 
            @keyup.enter="confirmTodo"
          />
          <button class="btn btn-success" type="button" @click="confirmTodo">確認</button>
          <button class="btn btn-secondary" type="button" @click="cancelTodo">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 狀態管理
const text = ref("");
const todos = ref([
  {
    id: 1,
    text: "買牛奶",
  },
  {
    id: 2,
    text: "寫 Vue 作業",
  }
]);

const editTemp = ref({
  id: "",
  text: "",
});

// 新增功能
const addTodo = () => {
  if (!text.value.trim()) return; // 避免加入空字串
  todos.value.push({
    id: new Date().getTime(),
    text: text.value.trim(),
  });
  text.value = "";
};

// 刪除功能
const deleteTodo = (todo) => {
  const index = todos.value.findIndex((item) => item.id === todo.id);
  todos.value.splice(index, 1);
};

// 準備編輯
const prepareTodo = (todo) => {
  editTemp.value = { ...todo }; // 拷貝一份資料，避免直接更動原始狀態
};

// 確認編輯
const confirmTodo = () => {
  if (!editTemp.value.text.trim()) return;
  const index = todos.value.findIndex((item) => item.id === editTemp.value.id);
  todos.value[index] = editTemp.value;
  editTemp.value = {}; // 清空編輯暫存區
};

// 取消編輯
const cancelTodo = () => {
  editTemp.value = {};
};
</script>
```

### 十一、資料來源
- [第一週講義](https://hackmd.io/o-BW3WhjRWOJjCUfqJ4YJg)