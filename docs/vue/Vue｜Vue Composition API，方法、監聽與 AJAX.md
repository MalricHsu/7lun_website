---
title: Vue｜Vue Composition API，方法、監聽與 AJAX
sidebar_position: 4
tags: [Vue ,JavaScript ,"知識點筆記"]
date: 2026-05-02
slug: /docs/vue/vue-composition-api
---

### 一、Vue3 Composition API 應用架構

  ![Vue3 Composition API 應用架構](/img/vue02-1.png)

### 二、computed（計算屬性）vs watch（監聽器）

#### 1. computed（計算屬性）

- **定義**：基於已有的響應式資料（例如 `ref` 或 `reactive`），經過計算後**衍生出一個新的值**。
- **核心特性**：具備 **快取（Cache）機制** 。只有當它所 **「依賴」的資料** 發生改變時，`computed` 才會重新執行計算。如果依賴的資料沒有變動，無論你在模板中呼叫它多少次，它都會直接回傳上一次計算好的快取結果，藉此節省效能。
- **限制**：必須是**同步**操作，且一定要有 `return` 回傳值。

#### 2. watch（監聽器）

- **定義**：用來**觀察（監聽）特定的響應式**資料，當該資料發生變化時，觸發特定的**副作用函式（Side Effects）**。
- **核心特性**：**不具備快取機制**。只要被監聽的資料一改變，就會執行你設定好的回呼函式（Callback function）。它通常用來執行「因為資料改變而必須去做的其他事情」，而不是用來產生要在畫面上顯示的新值。
- **優勢**：可以執行**非同步**操作（例如：呼叫後端 API、設定 `setTimeout`、操作 DOM 或 LocalStorage）。
- **基本結構：** `watch(監聽目標, (新值, 舊值) => { 執行的動作 }, { 選項 })`

#### 3. watchEffect（進階監聽器）

- **定義：** 立即執行傳入的函式，並在此過程中**自動追蹤**所有被用到的響應式資料。當這些資料發生變化時，該函式會重新執行。
- **核心特性：**
  - **自動依賴追蹤：** 你不需要像 `watch` 那樣明確指定監聽對象（例如 `count`）。只要你在 `watchEffect` 的區塊內讀取了某個響應式變數，它就會自動將其納入監聽清單。
  - **立即執行（Eager）：** 不同於 `watch` 預設是惰性的（資料變了才跑），`watchEffect` 在被建立時會**立刻執行一次**，以便收集依賴。
  - **不提供舊值（Old Value）：** 由於它是自動追蹤所有依賴，它不像 `watch` 能精準提供「某個變數」改變前後的對比。
- **優勢：**
  - **程式碼更簡潔：** 當一個副作用函式依賴於多個變數時，用 `watchEffect` 可以省去寫一大串監聽對象的麻煩。
  - **非同步支援：** 同樣可以用來處理 API 呼叫等副作用。
  - **清理機制（onCleanup）：** 提供了一個方便的方式來清除過期的非同步請求或定時器。
- **基本結構：** `watchEffect( (onCleanup) => { 執行的動作 }, { 選項 } )`

#### 4. computed 與 watch 比較表

<table width="100%">
  <thead>
    <tr>
      <th width="15%">特性</th>
      <th width="28%">computed（計算屬性）</th>
      <th width="28%">watch（偵聽器）</th>
      <th width="29%">watchEffect（進階偵聽器）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>核心用途</strong></td>
      <td><strong>產生新值</strong>。將現有資料加工成新的唯讀資料。</td>
      <td><strong>執行副作用</strong>。當特定資料改變時，執行特定動作。</td>
      <td><strong>同步追蹤</strong>。自動追蹤函式內所有依賴並執行副作用。</td>
    </tr>
    <tr>
      <td><strong>依賴追蹤</strong></td>
      <td><strong>自動</strong>。用到誰就監聽誰。</td>
      <td><strong>手動</strong>。必須明確指定監聽對象。</td>
      <td><strong>自動</strong>。函式內讀取到誰就監聽誰。</td>
    </tr>
    <tr>
      <td><strong>快取機制</strong></td>
      <td><strong>有</strong>。依賴沒變，就不會重新計算。</td>
      <td><strong>無</strong>。只要監聽對象變了就執行。</td>
      <td><strong>無</strong>。只要依賴變了就執行。</td>
    </tr>
    <tr>
      <td><strong>執行時機</strong></td>
      <td>只有在<strong>讀取值</strong>且依賴變動時執行。</td>
      <td><strong>惰性</strong>。預設資料變了才跑（除非設定 <code>immediate</code>）。</td>
      <td><strong>立即執行</strong>。建立時會先跑一次以收集依賴。</td>
    </tr>
    <tr>
      <td><strong>新舊值對比</strong></td>
      <td>不支援。</td>
      <td><strong>支援</strong>。可同時取得 <code>newValue</code> 與 <code>oldValue</code>。</td>
      <td>不支援。</td>
    </tr>
    <tr>
      <td><strong>非同步處理</strong></td>
      <td><strong>不允許</strong>。必須是同步運算。</td>
      <td><strong>支援</strong>。適合呼叫 API。</td>
      <td><strong>支援</strong>。適合呼叫 API。</td>
    </tr>
    <tr>
      <td><strong>回傳值</strong></td>
      <td><strong>必須有 return</strong>。回傳一個 Ref。</td>
      <td>通常無回傳值。</td>
      <td>通常無回傳值。</td>
    </tr>
  </tbody>
</table>


### 三、程式碼範例（Vue 3 Composition API）

#### 1. computed 範例：計算全名與購物車總價

- 適合用在需要根據基礎資料，即時算出畫面要顯示的結果時。
- [computed 範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/OPbPrGP)

  ```vue
  <template>
    <div>
      <p>全名: {{ fullName }}</p>
      <p>總金額: ${{ total }}</p>
      
      <button @click="quantity++">增加數量</button>
    </div>
  </template>

  <script setup>
  import { ref, computed } from 'vue';

  // 基礎資料
  const firstName = ref('John');
  const lastName = ref('Doe');
  const price = ref(100);
  const quantity = ref(3);

  // 1. 字串拼接：只要 firstName 或 lastName 改變，fullName 就會自動更新
  const fullName = computed(() => {
    return `${firstName.value} ${lastName.value}`;
  });

  // 2. 數值計算：只要 price 或 quantity 改變，total 就會自動更新
  const total = computed(() => {
    return price.value * quantity.value;
  });
  </script>
  ```

#### 2. watch 範例：監聽搜尋關鍵字並模擬 API 請求

- 適合用在資料改變時，需要去後端拿資料或執行其他邏輯的狀況。
- [watch 範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/xbRbmvJ)

  ```vue
  <template>
    <div>
      <input v-model="searchQuery" placeholder="請輸入搜尋關鍵字..." />
      <p>{{ searchResult }}</p>
    </div>
  </template>

  <script setup>
  import { ref, watch } from 'vue';

  const searchQuery = ref('');
  const searchResult = ref('等待搜尋中...');

  // 監聽 searchQuery 這個 ref
  // 當使用者輸入內容導致 searchQuery 改變時，就會執行這個函式
  watch(searchQuery, (newValue, oldValue) => {
    console.log(`搜尋字詞從 ${oldValue} 變成了 ${newValue}`);
    
    searchResult.value = '載入中...';
    
    // 模擬非同步的 API 請求 (computed 無法做這件事)
    setTimeout(() => {
      if (newValue) {
        searchResult.value = `找到關於「${newValue}」的 10 筆結果`;
      } else {
        searchResult.value = '請輸入關鍵字';
      }
    }, 1000);
  });
  </script>
  ```

#### 3. watchEffect 範例：監聽搜尋關鍵字並模擬 API 請求

- [watchEffect 範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/JoboQKd)

  ```vue
  <template>
    <div class="search-container">
      <h2>🔍 產品搜尋 (watchEffect)</h2>
      
      <input 
        v-model="searchQuery" 
        placeholder="請輸入關鍵字（例如：iPhone）..."
        class="search-input"
      />

      <div v-if="isLoading" class="status">正在搜尋中...</div>

      <ul v-if="searchResults.length">
        <li v-for="(item, index) in searchResults" :key="index">
          {{ item }}
        </li>
      </ul>
      
      <p v-else-if="searchQuery && !isLoading">找不到相關結果</p>
    </div>
  </template>

  <script setup>
  import { ref, watchEffect } from 'vue';

  const searchQuery = ref('');
  const searchResults = ref([]);
  const isLoading = ref(false);

  watchEffect((onCleanup) => {
    // 當搜尋框為空，重設狀態
    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      isLoading.value = false;
      return;
    }

    isLoading.value = true;

    // 模擬 API 請求
    const timer = setTimeout(() => {
      searchResults.value = [
        `✨ ${searchQuery.value} 的熱銷推薦`,
        `📦 ${searchQuery.value} 相關配件`,
        `🔥 ${searchQuery.value} 二手出清`
      ];
      isLoading.value = false;
    }, 800);

    // 重要：當使用者繼續輸入時，清除上一個計時器，避免 API 噴發
    onCleanup(() => {
      clearTimeout(timer);
    });
  });
  </script>

  <style scoped>
  .search-container { padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
  .search-input { width: 100%; padding: 8px; margin-bottom: 10px; }
  .status { color: #666; font-style: italic; }
  </style>
  ```


### 四、進階使用方法 — computed

#### 1. getter & setter

- [getter & setter 範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/qEqEgOL)
- 可以將 `computed` 拆分成以下兩個行為來看：
  - `getter` 是 `computed` 屬性的一部分，負責返回計算結果，當原本的資料發生變化時，會自動重新計算並返回新的結果。
  - `setter` 則是另一個函數，它允許我們設置 `computed` 屬性的值，並自動更新原本的資料。
  - 可以看到下面的範例，建立了兩個變數 `firstName`、`lastName` 並且計算出 `fullName`，當 `fullName` 重新被設置時，同時也會更新 `firstName`、`lastName`。

  ```vue
  <template>
    <div>
      <p>First Name: {{ firstName }}</p>
      <p>Last Name: {{ lastName }}</p>
      <p>Full Name: {{ fullName }}</p>
      <input v-model="fullName" />
    </div>
  </template>

  <script setup>
  import { ref, computed } from 'vue';

  const firstName = ref('John');
  const lastName = ref('Doe');

  const fullName = computed({
    //取值時執行：組合名字
    get() {
      return `${firstName.value} ${lastName.value}`;
    },
    //賦值時執行：當你執行 fullName.value = 'Jane Smith' 時觸發
    set(newValue) {
      const names = newValue.split(' ');
      firstName.value = names[0];
      lastName.value = names.length > 1 ? names[names.length - 1] : '';
    }
  });
  </script>
  ```


### 五、進階使用方法 — watch

#### 1. 監聽單一

- 當輸入框發生變化時，會即時的驗證輸入的內容，並且顯示出錯誤。
- [監聽單一範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/ZYBYwOr)

  ```vue
  <template>
    <div>
      <form>
        <div class="mb-2">
          <label for="email">購買人Email：</label>
          <input id="email" v-model="email" />
          <span v-if="emailError">{{ emailError }}</span>
        </div>
        <button class="btn btn-primary" type="submit">送出</button>
      </form>
    </div>
  </template>

  <script setup>
  import { ref, watch } from "vue";

  const email = ref("");
  const emailError = ref("");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  watch(email, (newValue) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newValue)) {
      emailError.value = "請輸入正確的格式";
    } else {
      emailError.value = "";
    }
  });
  </script>

  <style>
  span {
    color: red;
    font-size: 0.8em;
  }
  </style>
  ```

#### 2. 監聽多項目

- 可以使用一個 `watch` 搭配陣列的方式來監聽多個欄位。
- [監聽多項目範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/qEqEgqg)

  ```vue
  <template>
    <div>
      <form>
        <div class="mb-2">
          <label for="username">購買人姓名：</label>
          <input id="username" v-model="username" />
          <span v-if="usernameError">{{ usernameError }}</span>
        </div>
        <div class="mb-2">
          <label for="email">購買人Email：</label>
          <input id="email" v-model="email" />
          <span v-if="emailError">{{ emailError }}</span>
        </div>
        <div class="mb-2">
          <label for="phone">購買人電話：</label>
          <input id="phone" v-model="phone" />
          <span v-if="phoneError">{{ phoneError }}</span>
        </div>
        <button class="btn btn-primary" type="submit">送出</button>
      </form>
    </div>
  </template>

  <script setup>
  import { ref, watch } from 'vue';

  const username = ref('');
  const email = ref('');
  const phone = ref('');
  const usernameError = ref('');
  const emailError = ref('');
  const phoneError = ref('');

  watch([username, email, phone], ([newUsername, newEmail, newPhone]) => {
    if (newUsername.length < 3) {
      usernameError.value = '需要正確的輸入名稱';
    } else {
      usernameError.value = '';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      emailError.value = '需要正確的輸入 email 格式';
    } else {
      emailError.value = '';
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(newPhone)) {
      phoneError.value = '需要正確的輸入電話號碼';
    } else {
      phoneError.value = '';
    }
  });
  </script>

  <style>
  span {
    color: red;
    font-size: 0.8em;
  }
  </style>
  ```

#### 3. 深層監聽（deep）

- [深層監聽範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/RNoNvpN)
- **預設的 `watch`（沒有 `deep`）就像是「社區管理員」：** 管理員只在乎「這塊土地上是不是換了一棟新房子」。如果你只是在房子裡**把沙發從紅色換成藍色**，管理員站在門外根本不知道，所以他**不會**觸發通知。
- **加上 `deep: true` 的 `watch` 就像是「屋內的監視器」：** 你開啟了深度監聽，就像在每個房間都裝了監視器。現在只要有人在屋內**移動了一張椅子、換了一個燈泡**，就算外觀還是同一棟房子，監視器也立刻會發現並觸發通知！

#### 4. 即時監聽（immediate）

- [即時監聽範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/pvNvGPd)
- 在 Vue 裡面，`watch` 預設是「懶惰的（Lazy）」。這代表當元件剛載入、或是 `watch` 剛被建立的時候，它**不會馬上執行**你寫好的回呼函式（Callback）。它會默默在一旁等待，**直到監聽的資料發生「第一次改變」時**，它才會開始工作。
- 但如果你加上了 `{ immediate: true }`，就是在告訴 `watch`：**「不要等了！現在元件一載入，你就先拿著目前的初始資料，立刻去執行一次動作，之後資料有變動再繼續執行。」**

#### 5. 監聽 reactive 物件內的「特定屬性」

- 如果你用 `reactive` 宣告了一個物件，你**不能**直接寫 `watch(state.count, ...)`，必須改成一個**回傳該值的箭頭函式（`getter`）**。

  ```js
  import { reactive, watch } from 'vue';

  const state = reactive({
    count: 0,
    name: 'Vue'
  });

  // 必須寫成 () => state.count
  watch(() => state.count, (newVal, oldVal) => {
    console.log('count 改變了:', newVal);
  });
  ```

#### 6. 篩選範例

- [篩選範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/yyVyZov)

  ```vue
  <template>
    <div class="search-container">
      <h3>商品搜尋系統</h3>

      <input v-model="keyword" type="text" placeholder="請輸入商品名稱..." />

      <p v-if="isLoading" style="color: gray">
        ⏳ 正在搜尋伺服器資料中，請稍候...
      </p>

      <ul v-else>
        <li v-for="item in results" :key="item.id" v-if="results.length > 0">
          {{ item.name }}
        </li>
        <li v-else style="color: red">找不到符合的商品。</li>
      </ul>
    </div>
  </template>

  <script setup>
  import { ref, watch } from "vue";

  // 1. 假資料庫
  const mockDatabase = [
    { id: 1, name: "MacBook Pro 14吋" },
    { id: 2, name: "MacBook Air M2" },
    { id: 3, name: "iPhone 15 Pro" },
    { id: 4, name: "iPad Air 5" },
    { id: 5, name: "AirPods Pro 2" }
  ];

  const keyword = ref(""); // 搜尋字
  const results = ref([]); // 搜尋結果
  const isLoading = ref(false); // 載入狀態

  // 2. 直接在 watch 裡面用 setTimeout
  watch(
    keyword,
    (newKeyWord) => {
      isLoading.value = true;
      results.value = [];

      setTimeout(() => {
        if (!newKeyWord) {
          results.value = mockDatabase;
        } else {
          results.value = mockDatabase.filter((item) =>
            item.name.toLowerCase().includes(newKeyWord.toLowerCase())
          );
        }
        isLoading.value = false;
      }, 1000);
    },
    { immediate: true }
  );
  </script>
  ```


  ### 六、進階使用方法 — watchEffect

  - [watchEffect 篩選範例 Codepen](https://codepen.io/mfyvqhsn-the-bold/pen/vEyEqyx)

  ```vue
  <template>
    <div class="filter-container">
      <h2>🛒 產品篩選器</h2>

      <div class="controls">
        <label>類別：</label>
        <select v-model="filter.category">
          <option value="全部">全部</option>
          <option value="手機">手機</option>
          <option value="電腦">電腦</option>
        </select>

        <label>最高預算：${{ filter.maxPrice }}</label>
        <input type="range" v-model.number="filter.maxPrice" min="0" max="50000" step="1000" />
      </div>

      <hr />

      <div class="product-list">
        <div v-for="product in displayedProducts" :key="product.id" class="product-item">
          <strong>{{ product.name }}</strong> - 
          <span>${{ product.price }}</span>
          <small>({{ product.category }})</small>
        </div>
        <p v-if="displayedProducts.length === 0">沒有符合條件的產品</p>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, reactive, watchEffect } from 'vue';

  const allProducts = [
    { id: 1, name: 'iPhone 15', category: '手機', price: 29000 },
    { id: 2, name: 'MacBook Air', category: '電腦', price: 32000 },
    { id: 3, name: 'iPad Air', category: '平板', price: 18000 },
    { id: 4, name: 'Pixel 8', category: '手機', price: 21000 },
    { id: 5, name: 'ROG Laptop', category: '電腦', price: 45000 },
  ];

  const filter = ref({
    category: '全部',
    maxPrice: 50000
  });

  const displayedProducts = ref([]);

  // watchEffect 會自動收集 filter.category 與 filter.maxPrice 作為依賴
  watchEffect(() => {
    displayedProducts.value = allProducts.filter(item => {
      const matchCategory = filter.value.category === '全部' || item.category === filter.value.category;
      const matchPrice = item.price <= filter.value.maxPrice;
      return matchCategory && matchPrice;
    });
  });
  </script>

  <style scoped>
  .filter-container { padding: 20px; font-family: sans-serif; }
  .controls { display: flex; gap: 20px; align-items: center; margin-bottom: 20px; }
  .product-item { padding: 10px; border-bottom: 1px solid #eee; }
  </style>
  ```


### 七、Vue 3（Composition API）生命週期

  ![Vue 3 生命週期](/img/vue02-2.png)

- **`onMounted`** 和 **`onUnmounted`** 是一對在實務上經常搭配使用的組合。
  - **`onMounted`**：此時 DOM 已經掛載完成，可以用來**設定事件監聽**或**啟動定時器**。
  - **`onUnmounted`**：組件被銷毀時執行，非常重要的工作是**清理資源**（例如：移除事件監聽器、清除 `setInterval` / `setTimeout`），以避免記憶體洩漏。

#### 1. 範例一：簡單計時器

```vue
<template>
  <div class="timer-box">
    <h3>計時器範例</h3>
    <p>已經過了：{{ seconds }} 秒</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const seconds = ref(0);
let timerId = null; // 用來儲存定時器的 ID

// 🟢 掛載階段：組件渲染到畫面上後執行
onMounted(() => {
  console.log('組件已掛載 (onMounted)！準備啟動定時器...');
  
  // 啟動定時器：每 1000 毫秒 (1秒) 將秒數 +1
  timerId = setInterval(() => {
    seconds.value++;
    console.log(`目前秒數: ${seconds.value}`);
  }, 1000);
});

// 🔴 銷毀階段：組件從畫面上被移除時執行
onUnmounted(() => {
  console.log('組件已卸載 (onUnmounted)！正在清理資源...');
  
  // 清除定時器
  // 如果不在這裡清除，就算這個組件已經不在畫面上，計時器還是會一直在背景偷跑，導致「記憶體洩漏」或報錯！
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
});
</script>
```

#### 2. 範例二：監聽全域事件（Window / Document 監聽器）

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';

const handleScroll = () => {
  console.log('目前視窗滾動高度:', window.scrollY);
};

onMounted(() => {
  // 組件掛載後，開始監聽全域的滾動事件
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // 組件卸載時，務必將該事件移除！
  window.removeEventListener('scroll', handleScroll);
});
</script>
```

#### 3. 範例三：初始化第三方套件（圖表、地圖、輪播圖）

```vue
<template>
  <div ref="chartRef" style="width: 400px; height: 300px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts'; // 假設我們引入了 ECharts

const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  // 此時 div 已經出現在畫面上，可以交給第三方套件去渲染了
  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption({ /* ...圖表設定... */ });
});

onUnmounted(() => {
  // 離開時，呼叫第三方套件的 API 來徹底銷毀實例，釋放記憶體
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>
```

#### 4. 生命週期應用場景統整

<table width="100%">
  <thead>
    <tr>
      <th width="18%">應用場景</th>
      <th width="27%">onMounted（建立/訂閱）</th>
      <th width="27%">onUnmounted（清除/取消）</th>
      <th width="28%">⚠️ 若未清理的後果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>定時器</strong></td>
      <td>啟動 <code>setInterval</code> 或 <code>setTimeout</code></td>
      <td>執行 <code>clearInterval</code> 或 <code>clearTimeout</code></td>
      <td>計時器在背景持續執行，消耗效能（記憶體洩漏）</td>
    </tr>
    <tr>
      <td><strong>全域事件監聽</strong></td>
      <td><code>window.addEventListener</code>（如 scroll, resize）</td>
      <td><code>window.removeEventListener</code></td>
      <td>切換頁面後仍會觸發舊組件的邏輯，導致錯誤</td>
    </tr>
    <tr>
      <td><strong>第三方套件</strong></td>
      <td>初始化實例（如 ECharts, Google Maps, Swiper）</td>
      <td>呼叫銷毀方法（如 <code>chart.dispose()</code>）</td>
      <td>DOM 雖消失，但記憶體中的套件實例未釋放</td>
    </tr>
    <tr>
      <td><strong>WebSocket</strong></td>
      <td>建立連線並監聽訊息</td>
      <td>關閉連線 <code>socket.close()</code></td>
      <td>伺服器連線數被無效佔用，浪費網路資源</td>
    </tr>
    <tr>
      <td><strong>自定義 Bus</strong></td>
      <td>訂閱全域事件（如 <code>mitt.on</code>）</td>
      <td>取消訂閱（<code>mitt.off</code>）</td>
      <td>重複訂閱導致同一個事件觸發多次邏輯</td>
    </tr>
  </tbody>
</table>

:::note

`onMounted` 與 `onUnmounted` 務必成對使用。在 `onMounted` 中建立的任何監聽、訂閱或定時器，都應該在 `onUnmounted` 中清理，避免記憶體洩漏。

:::


### 八、Todo 註冊、登入、驗證

```vue
<template>
  <div class="container mt-5">
    <h2>TodoList待辦清單</h2>
    <hr />
    <div v-if="user.nickname">
      <p>歡迎{{ user.nickname }}登入</p>
      <p>您的UID {{ user.uid }}</p>
    </div>
    <div v-else>
      <p>請先登入</p>
    </div>
    <h3>註冊</h3>
    <br />
    <label for="email1" class="me-2">Email</label>
    <input type="email" id="email1" v-model="signUpField.email" />
    <br />
    <br />
    <label for="password1" class="me-2">Password</label>
    <input type="text" id="password1" v-model="signUpField.password" />
    <br />
    <br />
    <label for="nickname" class="me-2">Nickname</label>
    <input type="text" id="nickname" v-model="signUpField.nickname" />
    <br />
    <br />
    <button type="button" @click="signUp">註冊</button>
    <br />
    <br />
    <div v-if="signUpRef.uid">
      <p>狀態：{{ signUpRef.status ? "註冊成功" : "註冊失敗" }}</p>
      <p>您的UID：{{ signUpRef.uid }}</p>
    </div>
    <div v-if="signUpRef.error">
      <p>註冊失敗：{{ signUpRef.error }}</p>
    </div>
    <br />
    <br />
    <h3>登入</h3>
    <br />
    <label for="email2" class="me-2">Email</label>
    <input type="email" id="email2" v-model="signInField.email" />
    <br />
    <br />
    <label for="password2" class="me-2">Password</label>
    <input type="text" id="password2" v-model="signInField.password" />
    <br />
    <br />
    <button type="button" @click="signIn">登入</button>
    <br />
    <br />
    <div v-if="signInRef.token">
      <p>狀態：{{ signInRef.status ? "註冊成功" : "註冊失敗" }}</p>
      <p>您的姓名：{{ signInRef.nickname }}</p>
      <p>您的token：{{ signInRef.token }}</p>
    </div>
    <div v-if="signInRef.error">
      <p>登入失敗：{{ signInRef.error }}</p>
    </div>

    <br />
    <br />
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const usersApi = "https://todolist-api.hexschool.io/users";
const signUpField = ref({
  email: "",
  password: "",
  nickname: "",
});

const signUpRef = ref({});

const signUp = async () => {
  try {
    const res = await axios.post(`${usersApi}/sign_up`, signUpField.value);
    console.log(res);
    const { status, uid } = res.data;
    signUpRef.value = { status, uid };
  } catch (error) {
    console.log(error);
    signUpRef.value = { error: error.message };
  }
};

const signInField = ref({
  email: "",
  password: "",
});
const signInRef = ref({});

const signIn = async () => {
  try {
    const res = await axios.post(`${usersApi}/sign_in`, signInField.value);
    console.log(res);
    const { nickname, status, exp, token } = res.data;
    signInRef.value = {
      nickname,
      status,
      exp: new Date(exp * 1000).toUTCString(),
      token,
    };
    document.cookie = `Hex=${token}; expires=${exp} GMT; path=/`;
  } catch (error) {
    console.log(error);
    signInRef.value = { error: error.message };
  }
};

const user = ref({
  nickname: "",
  status: "",
  uid: "",
});
onMounted(async () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)Hex\s*\=\s*([^;]*).*$)|^.*$/,
    "$1",
  );
  try {
    const res = await axios.get(`${usersApi}/checkout`, {
      headers: { Authorization: token },
    });
    console.log(res);
    user.value = res.data;
  } catch (error) {
    console.log(error);
    user.value = error.message;
  }
});
</script>
```

### 九、資料來源
- [第二週講義](https://hackmd.io/3nx1b0V3RV-KCNHGWftH_g)