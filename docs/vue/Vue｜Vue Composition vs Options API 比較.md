---
title: Vue｜Vue Composition vs Options API 比較
sidebar_position: 3
tags: [Vue , JavaScript , 知識點筆記]
date: 2026-04-26
---

### 一、了解 Options API

- Options API 是 Vue 2 時代的主要寫法，也是許多人最先接觸 Vue 的方式。它把元件的邏輯分成多個「選項物件」來組織：

  ```js
  export default {
    data() {
      return {
        count: 0,
        username: '7lun'
      }
    },
    computed: {
      doubleCount() {
        return this.count * 2
      }
    },
    methods: {
      increment() {
        this.count++
      }
    },
    mounted() {
      console.log('元件掛載完成')
    }
  }
  ```

- 特色：
  - 每種功能有固定位置：資料放 `data`、計算屬性放 `computed`、方法放 `methods`、生命週期直接寫在選項裡。
  - 透過 `this` 存取元件實例上的所有資料與方法。
  - 結構清晰、入門容易，適合簡單的元件。

### 二、了解 Composition API

- Composition API 是 Vue 3 引入的新寫法，讓開發者可以用**函式**的方式組織邏輯，不再受限於選項物件的固定結構。

  ```vue
  <script setup>
  import { ref, computed, onMounted } from 'vue'

  const count = ref(0)
  const username = ref('7lun')

  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  onMounted(() => {
    console.log('元件掛載完成')
  })
  </script>
  ```

- 特色：
  - 使用 `ref()`、`reactive()` 建立響應式資料，用 `computed()`、`watch()` 等函式處理衍生邏輯。
  - 生命週期改用 `onMounted()`、`onUnmounted()` 等函式註冊。
  - 搭配 `<script setup>` 語法糖，程式碼更簡潔，不需要 `return`。
  - **同一個功能的邏輯可以集中寫在一起**，而不是分散到 `data`、`methods`、`computed` 等不同區塊。

### 三、核心差異比較

<table width="100%">
  <thead>
    <tr>
      <th width="20%">比較項目</th>
      <th width="40%">Options API</th>
      <th width="40%">Composition API</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>程式碼組織</strong></td>
      <td>按選項類型分組（data、methods、computed…）</td>
      <td>按功能邏輯分組，相關程式碼集中在一起</td>
    </tr>
    <tr>
      <td><strong>存取方式</strong></td>
      <td>透過 <code>this</code> 存取所有屬性與方法</td>
      <td>直接使用變數，不需要 <code>this</code></td>
    </tr>
    <tr>
      <td><strong>TypeScript 支援</strong></td>
      <td>型別推導有限，<code>this</code> 的型別不易推斷</td>
      <td>友好，變數都有明確的型別</td>
    </tr>
    <tr>
      <td><strong>邏輯複用</strong></td>
      <td>Mixins（容易命名衝突、來源不明）</td>
      <td>Composables（函式組合，來源清晰）</td>
    </tr>
    <tr>
      <td><strong>學習門檻</strong></td>
      <td>較低，結構固定易理解</td>
      <td>稍高，需理解響應式原理與閉包</td>
    </tr>
    <tr>
      <td><strong>適合場景</strong></td>
      <td>簡單元件、快速原型</td>
      <td>複雜元件、大型專案、需要邏輯複用</td>
    </tr>
  </tbody>
</table>

### 四、同一個功能的寫法對比

- 以一個「計數器 + 使用者名稱」的元件為例，觀察兩種寫法在程式碼組織上的差異：

#### 1. Options API 寫法

  ```vue
  <template>
    <div>
      <p>{{ username }} 已按了 {{ count }} 次</p>
      <p>雙倍：{{ doubleCount }}</p>
      <button @click="increment">+1</button>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        count: 0,
        username: '7lun'
      }
    },
    computed: {
      doubleCount() {
        return this.count * 2
      }
    },
    methods: {
      increment() {
        this.count++
      }
    },
    watch: {
      count(newVal) {
        console.log('count 變成', newVal)
      }
    },
    mounted() {
      console.log('元件已掛載')
    }
  }
  </script>
  ```

#### 2. Composition API 寫法

  ```vue
  <template>
    <div>
      <p>{{ username }} 已按了 {{ count }} 次</p>
      <p>雙倍：{{ doubleCount }}</p>
      <button @click="increment">+1</button>
    </div>
  </template>

  <script setup>
  import { ref, computed, watch, onMounted } from 'vue'

  // --- 計數器功能 ---
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  watch(count, (newVal) => {
    console.log('count 變成', newVal)
  })

  // --- 使用者資訊 ---
  const username = ref('7lun')

  // --- 生命週期 ---
  onMounted(() => {
    console.log('元件已掛載')
  })
  </script>
  ```

:::note

注意 Composition API 的寫法中，「計數器」相關的 `count`、`doubleCount`、`increment`、`watch` 全都集中在一起，不再分散到 `data`、`computed`、`methods`、`watch` 四個不同的區塊。當元件邏輯變得複雜，這個優勢會更加明顯。

:::

### 五、邏輯複用：Mixins vs Composables

- 在大型專案中，我們經常需要在多個元件間**共用邏輯**。這是兩種 API 最顯著的差異之一。

#### 1. Options API 的做法：Mixins

```js
// mixins/useCounter.js
export const counterMixin = {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

```vue
<script>
import { counterMixin } from '@/mixins/useCounter'

export default {
  mixins: [counterMixin],
  // 如果這裡也定義了 count 或 increment，會產生衝突！
}
</script>
```

- Mixins 的問題：
  - **命名衝突**：多個 mixin 可能定義相同名稱的 `data` 或 `methods`，覆蓋行為不直觀。
  - **來源不明**：在 template 中使用 `{{ count }}` 時，很難追溯它來自哪個 mixin。
  - **隱式依賴**：mixin 內部可能依賴元件的特定 `data` 或 `methods`，耦合度高。

#### 2. Composition API 的做法：Composables

  ```js
  // composables/useCounter.js
  import { ref } from 'vue'

  export function useCounter(initialValue = 0) {
    const count = ref(initialValue)
    
    function increment() {
      count.value++
    }

    return { count, increment }
  }
  ```

  ```vue
  <script setup>
  import { useCounter } from '@/composables/useCounter'

  const { count, increment } = useCounter(10)
  // 來源清楚、不會命名衝突、可以重新命名
  const { count: count2, increment: increment2 } = useCounter(0)
  </script>
  ```

- Composables 的優勢：
  - **來源清晰**：所有變數都是顯式引入，一眼就知道從哪裡來。
  - **無命名衝突**：可以用解構重新命名。
  - **可傳參數**：像一般函式一樣接收參數，更有彈性。
  - **天然支援 TypeScript**：回傳值的型別自動推導。

:::tip

Vue 官方推薦 Composable 函式以 `use` 為前綴命名（如 `useCounter`、`useFetch`），這是社群約定俗成的慣例，也方便辨識。

:::

### 六、this 的差異

- Options API 大量依賴 `this` 來存取元件實例。但 `this` 在 JavaScript 中的行為本身就是常見的混淆來源。

  ```js
  // Options API — this 的陷阱
  export default {
    data() {
      return { count: 0 }
    },
    mounted() {
      // ✅ 正常函式，this 指向元件實例
      setTimeout(function () {
        this.count++ // ❌ 這裡的 this 已經不是元件實例了！
      }, 1000)

      // 必須改用箭頭函式
      setTimeout(() => {
        this.count++ // ✅ 箭頭函式繼承外層的 this
      }, 1000)
    }
  }
  ```

  ```js
  // Composition API — 沒有 this 的問題
  import { ref, onMounted } from 'vue'

  const count = ref(0)

  onMounted(() => {
    setTimeout(() => {
      count.value++ // 直接用變數，不需要 this
    }, 1000)
  })
  ```

  :::note

  Composition API 完全不使用 `this`，所有資料和方法都是普通的 JavaScript 變數與函式，避免了 `this` 指向錯誤的問題。

  :::

### 七、什麼時候該用哪種？

<table width="100%">
  <thead>
    <tr>
      <th width="50%">適合使用 Options API</th>
      <th width="50%">適合使用 Composition API</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>剛接觸 Vue、正在學習基礎概念</td>
      <td>已有 Vue 基礎、準備進入中大型專案</td>
    </tr>
    <tr>
      <td>元件邏輯簡單、不需要複用</td>
      <td>元件邏輯複雜、需要拆分與複用</td>
    </tr>
    <tr>
      <td>維護 Vue 2 舊專案</td>
      <td>新專案開發、搭配 TypeScript</td>
    </tr>
    <tr>
      <td>團隊成員對函式式寫法不熟悉</td>
      <td>追求更好的程式碼組織與可測試性</td>
    </tr>
  </tbody>
</table>

:::tip

Vue 3 同時支援兩種 API，甚至可以在同一個專案中混用。但 Vue 官方文件（從 Vue 3.2 起）已經以 Composition API + `<script setup>` 作為預設範例，這也是目前社群的主流趨勢。

:::

### 八、總結

- **Options API** 像是一個「表格」：每種東西有固定的欄位，看起來整齊，但當邏輯變複雜時，同一個功能的程式碼會被拆散到不同欄位，維護困難。
- **Composition API** 像是一個「筆記本」：你可以按照主題自由組織內容，同一個功能的所有邏輯寫在一起，更容易閱讀與維護。
- 對於新專案，建議直接學習 Composition API + `<script setup>`，這是 Vue 3 的最佳實踐。
