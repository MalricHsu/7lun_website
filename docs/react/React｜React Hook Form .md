---
title: React｜React Hook Form
sidebar_position: 7
tags: [React, 知識點筆記]
date: 2025-12-30
slug: /docs/react/react-hook-form
---

### 一、為什麼需要 React Hook Form

#### 1. 原生 React 表單

- React 官方文件說明，當 `input` 的值交給 `value`（或 checkbox/radio 交給 `checked`）控制時，這個欄位就變成「受控元件」，欄位顯示什麼，完全由 React state 說了算，因此一定要搭配 `onChange` 把使用者輸入同步回 state，不然畫面就會卡住不動。

    ```jsx
    function ControlledInput() {
    const [email, setEmail] = useState("");

    return (
        <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
    );
    }
    ```
- 邏輯很直覺：**畫面看 state，state 又聽 onChange 的話**。問題是這套邏輯要「每個欄位」都重複一次。

#### 2. 受控元件的痛點

- 每個欄位都要開一個 `useState`。
- 每個欄位都要寫一次 `onChange`。
- checkbox / radio / select 資料型態各自不同，容易搞混（checkbox 看的是 `checked`，不是 `value`）。
- 驗證錯誤訊息要自己另外管理一份 state。
- 表單一大，每次打字都觸發整個表單重新渲染。

#### 3. React Hook Form 的解法：把「登記」和「彙整」分開

- 想像你在辦一場活動報名：如果每個欄位都要你各自問「你叫什麼名字」「Email 多少」，再自己抄到小本子上（每個欄位一個 `useState` + `onChange`），效率很差，欄位一多就會亂。
- React Hook Form 比較像現場直接放一張「報名表」：你把 `{...register("欄位名稱")}` 貼在每個 `input` 上，等於告訴 RHF「這格也幫我登記」。表單送出時，你不用一格一格去問，直接跟 RHF 要一份彙整好的「報名結果」（`handleSubmit(onSubmit)`），資料就整理好了。
- 換句話說：**不要每個欄位都自己顧，而是把欄位「註冊」給 RHF 統一管理，最後送出時一次拿到乾淨的資料。**

#### 4. React Hook Form 的定位

- 官方首頁把自己定位成一套小型、無額外依賴的表單函式庫，訴求是用較少程式碼處理驗證，並降低不必要的重新渲染、減少驗證計算量、加快掛載速度。
- 白話講：欄位多、驗證規則多的表單，用 RHF 通常比純 `useState` 表單好維護，而且效能更好（因為輸入時不會逼整個表單重新渲染）。


### 二、安裝與 useForm 核心

#### 1. 安裝

```bash
npm install react-hook-form
```

#### 2. `useForm` 三大件

| 語法 | 用途 |
| --- | --- |
| `register("欄位名稱")` | 把 input / select 註冊給 RHF，讓它追蹤欄位值、驗證規則 |
| `handleSubmit(onSubmit)` | 送出前先跑驗證，通過才把整理好的資料丟給 `onSubmit` |
| `formState: { errors }` | 驗證沒過時，錯誤訊息會出現在這裡 |

#### 3. 基本範例

```jsx
import { useForm } from "react-hook-form";

function BasicForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="firstName">名字</label>
      <input id="firstName" {...register("firstName")} />

      <label htmlFor="lastName">姓氏</label>
      <input id="lastName" {...register("lastName")} />

      <button type="submit">送出</button>
    </form>
  );
}

export default BasicForm;
```

:::note
`handleSubmit` 是「驗證的守門員」：先跑完 `register` 裡設定的驗證規則，全部通過才會呼叫你傳進去的 `onSubmit(data)`；只要有一個欄位沒過，`onSubmit` 根本不會被呼叫，錯誤會直接寫進 `formState.errors`。
:::


### 三、defaultValues：設定初始值

```jsx
const { register, handleSubmit } = useForm({
  defaultValues: {
    firstName: "John",
    lastName: "Doe",
    category: "frontend",
    isChecked: true,
    gender: "男",
    like: ["炒麵"],
  },
});
```

:::note
如果之後要判斷表單「有沒有被改過」（`formState.isDirty`），官方文件建議一定要在 `useForm` 裡把**所有欄位**的 `defaultValues` 都補齊，RHF 才有一個完整的基準可以比較，不然 `isDirty` 的判斷會不準。
:::

### 四、各類表單元素寫法

#### 1. 文字 / Email

```jsx
<input type="text" {...register("username")} />
<input type="email" {...register("email")} />
```

#### 2. 下拉選單 select

```jsx
<select {...register("category")}>
  <option value="">請選擇分類</option>
  <option value="frontend">前端</option>
  <option value="backend">後端</option>
  <option value="fullstack">全端</option>
</select>
```

#### 3. checkbox：單選 vs 多選

- **單一 checkbox**：適合「是否同意」這種 true / false 情境，送出的資料是 boolean。

```jsx
<label>
  <input type="checkbox" {...register("isAgree")} />
  我同意服務條款
</label>
```

- **多選 checkbox**：多個欄位共用同一個 `name`，RHF 會自動彙整成陣列。

```jsx
<label><input type="checkbox" {...register("like")} value="鍋燒意麵" />鍋燒意麵</label>
<label><input type="checkbox" {...register("like")} value="炒麵" />炒麵</label>
<label><input type="checkbox" {...register("like")} value="漢堡" />漢堡</label>
```

:::warning
checkbox 的關鍵是 `checked`，不是 `value`，這點跟受控元件的觀念一樣。單一 checkbox 送出的是 `true/false`；多選 checkbox（同名）送出的是字串陣列，兩種資料型態完全不同，寫驗證邏輯時容易搞混。
:::

#### 4. radio 單選

```jsx
<label><input type="radio" {...register("gender")} value="男" />男</label>
<label><input type="radio" {...register("gender")} value="女" />女</label>
```

#### 5. 各類型送出資料一覽

| 元件 | 送出資料型態 | 範例 |
| --- | --- | --- |
| text / email | string | `"abc@mail.com"` |
| select | string | `"frontend"` |
| checkbox（單一） | boolean | `true` |
| checkbox（多選同名） | array | `["鍋燒意麵", "炒麵"]` |
| radio | string | `"男"` |


### 五、監聽表單目前值：watch 與 useWatch
 
- 這兩個工具都是「拿到表單目前的值」，但**觸發重新渲染的範圍完全不一樣**，這是兩者最關鍵的差異，也是選哪個的判斷依據。
#### 1. `watch`：直接問，但整個表單元件都會跟著重新渲染
 
- `watch` 是 `useForm` 回傳的方法，在元件內直接呼叫就能拿到指定欄位（或全部欄位）目前的值。
- 因為它底層是靠元件內部的 state 去驅動更新，所以**每次監聽的值變動，整個呼叫 `watch` 的元件都會重新渲染**，欄位不多、表單簡單時完全沒感覺，適合拿來做「根據某個欄位值，決定要不要顯示另一個欄位」這種輕量的條件渲染。
    ```jsx
    import { useForm } from "react-hook-form";
    
    function WatchExample() {
    const { register, watch, handleSubmit } = useForm({
        defaultValues: { paymentMethod: "cash" },
    });
    
    // 直接呼叫 watch，拿到 paymentMethod 目前的值
    const paymentMethod = watch("paymentMethod");
    
    const onSubmit = (data) => console.log(data);
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("paymentMethod")}>
            <option value="cash">現金</option>
            <option value="card">信用卡</option>
        </select>
    
        {/* 根據 watch 到的值，決定要不要顯示卡號欄位 */}
        {paymentMethod === "card" && (
            <input type="text" placeholder="請輸入卡號" {...register("cardNumber")} />
        )}
    
        <button type="submit">送出</button>
        </form>
    );
    }
    ```
 
    :::note
    上面這個例子裡，只要 `paymentMethod` 改變，`WatchExample` 整個元件（包含 `select`、之後可能加的其他欄位）都會重新渲染一次。表單小的話沒差，但如果這個表單有二三十個欄位，使用者每打一個字，全部欄位都要跟著重新算一次，就會感覺得到卡頓。
    :::
 
#### 2. `useWatch`：把監聽邏輯搬到別的地方，重新渲染只發生在那裡
 
- `useWatch` 是獨立的 hook，需要搭配 `useForm` 給的 `control` 一起用。它的重點不是「拿到值」這件事本身，而是**把「監聽 → 重新渲染」這個副作用隔離到另一個地方**（通常是抽成子元件），不會牽連到主表單元件。
- 做法通常是：主表單負責 `register` 欄位跟 `handleSubmit`，即時預覽 / 條件渲染的部分抽成一個小元件，讓它自己用 `useWatch` 訂閱，重新渲染就只發生在這個小元件裡。
    ```jsx
    import { useForm, useWatch } from "react-hook-form";
    
    // 子元件：專門負責即時預覽，重新渲染只會發生在這裡
    function LivePreview({ control }) {
    const username = useWatch({ control, name: "username" });
    return <p>目前輸入：{username}</p>;
    }
    
    function UseWatchExample() {
    const { register, control, handleSubmit } = useForm({
        defaultValues: { username: "" },
    });
    
    const onSubmit = (data) => console.log(data);
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("username")} />
    
        {/* 監聽邏輯被隔離在 LivePreview，UseWatchExample 本身不會因為打字而重新渲染 */}
        <LivePreview control={control} />
    
        <button type="submit">送出</button>
        </form>
    );
    }
    ```
 
    :::note
    這裡的關鍵是 `LivePreview` 拆成獨立元件、自己呼叫 `useWatch`。使用者每打一個字，重新渲染的只有 `LivePreview`，`UseWatchExample`（外層表單本身）完全不受影響。這就是官方文件說「`useWatch` 能把重新渲染隔離在 hook 層級」的實際樣子。
    :::
 
#### 3. 該用哪個？
 
| 方法 | 重新渲染範圍 | 適合情境 |
| --- | --- | --- |
| `watch` | 呼叫它的整個元件 | 表單簡單、欄位不多，做輕量的條件渲染 |
| `useWatch` | 只有使用它的那個 hook / 子元件 | 表單欄位多、想做即時預覽，或監聽邏輯想抽離主表單 |
 
- 簡單判斷法：**表單小就用 `watch` 圖方便；表單大、或監聽的東西會頻繁變動（例如即時字數統計、即時預覽），就把它拆成子元件用 `useWatch`。**


### 六、驗證機制

#### 1. 基礎驗證規則

`register` 的第二個參數可以直接寫驗證規則，官方文件列出的常用規則包含 `required`、`minLength`、`maxLength`、`pattern`、`validate`。

```jsx
<input
  type="text"
  {...register("username", {
    required: "請輸入使用者名稱",
  })}
/>
<span>{errors.username?.message}</span>
```

#### 2. 驗證時機 mode

RHF 預設是「送出時才驗證」，可以用 `mode` 調整：

| mode | 說明 |
| --- | --- |
| `onSubmit` | 預設值，送出時才驗證 |
| `onChange` | 使用者輸入時即時驗證 |
| `onBlur` | 欄位失去焦點時驗證 |
| `all` | change 和 blur 都會驗證 |

#### 3. 進階驗證範例

```jsx
// 密碼長度
<input
  type="password"
  {...register("password", {
    required: "密碼是必填項目",
    minLength: { value: 6, message: "密碼長度至少需為 6 個字元" },
    maxLength: { value: 12, message: "密碼長度不得超過 12 個字元" },
  })}
/>

// Email 格式
<input
  type="email"
  {...register("email", {
    required: "Email 是必填項目",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "請輸入有效的 Email 格式",
    },
  })}
/>

// 自訂驗證 validate
<input
  type="text"
  {...register("nickname", {
    required: "請輸入暱稱",
    validate: (value) => value !== "admin" || "暱稱不能使用 admin",
  })}
/>
```

:::note
`validate` 是逃生口：只要規則不是單純的 required / minLength / pattern 能表達的（例如「兩次密碼要一致」「不能跟目前帳號重複」），就用 `validate` 寫一個回傳 `true` 或錯誤訊息字串的函式。
:::


### 七、實戰：步道後台登入表單（接上 React Router 筆記）

- 在《React｜React Router》筆記的「九、進階應用：前台／後台雙 Layout」裡，`RequireAuth.jsx` 沒登入時會這樣導去登入頁：

```jsx
return <Navigate to="/admin/login" replace state={{ from: location }} />;
```

- 這裡的 `AdminLogin.jsx` 就是負責接住這個登入頁，用 React Hook Form 收帳密、驗證，登入成功後再靠 React Router 的 `useNavigate` 導回使用者原本想去的頁面。**分工很清楚：RHF 只管表單本身（收資料＋驗證），路由的事完全交給 React Router。**

```jsx
// pages/admin/AdminLogin.jsx
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from; // RequireAuth 傳過來的「原本要去的頁面」

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // 之後接真的登入 API，例如：
      // const res = await axios.post("/admin/login", data);
      // localStorage.setItem("token", res.data.token);

      console.log("登入資料：", data);
      localStorage.setItem("token", "fake-token"); // 先用假 token 串流程

      // 有 from 就回原本要去的頁面，沒有就回後台首頁
      navigate(from?.pathname || "/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("登入失敗", err);
    }
  };

  return (
    <div className="admin-login">
      <h1>後台登入</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="account">帳號</label>
          <input
            id="account"
            type="text"
            {...register("account", { required: "請輸入帳號" })}
          />
          <p>{errors.account?.message}</p>
        </div>

        <div>
          <label htmlFor="password">密碼</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: { value: 6, message: "密碼至少需 6 個字元" },
            })}
          />
          <p>{errors.password?.message}</p>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
```

:::note
`isSubmitting` 是 `formState` 內建的另一個狀態，`onSubmit` 是 async function 時，RHF 會自動幫你追蹤「送出中」的狀態，很適合拿來做按鈕的 loading / disabled 效果，不用自己再開一個 `useState` 管。
:::


### 八、常見錯誤整理

1. **`errors` 拼成 `erros`**——`formState: { errors }` 拼字要對，這種筆誤很容易編譯過但拿不到值。
2. **`register` 展開語法位置錯誤**——`{...register("username")}` 要整包放在標籤屬性裡，不能拆開寫。
3. **`button` 沒明確寫 `type`**——表單裡的按鈕預設是 `submit`，如果只是想要一個「取消」按鈕，一定要寫 `type="button"`，不然會誤觸表單送出。
4. **checkbox 單選跟多選搞混**——單一 checkbox 資料是 `boolean`，多個同名 checkbox 資料是 `array`，寫驗證或初始值時要對應正確型態（參考本篇「四、5. 各類型送出資料一覽」）。
5. **select 的預設值建議放 `defaultValues`**，不要混用原生 `selected`，統一交給 RHF 管理比較不容易出現「畫面跟 state 對不起來」的狀況。



### 九、參考資源

- [React Hook Form 官方文件 — useForm](https://react-hook-form.com/docs/useform)
- [React Hook Form 官方文件 — register](https://react-hook-form.com/docs/useform/register)
- [React Hook Form 官方文件 — handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit)
- [React Hook Form 官方文件 — watch](https://react-hook-form.com/docs/useform/watch)
- [React Hook Form 官方文件 — useWatch](https://react-hook-form.com/docs/usewatch)
- [React Hook Form 官方文件 — formState](https://react-hook-form.com/docs/useform/formstate)
- [React 官方文件 — `<input>`](https://react.dev/reference/react-dom/components/input)
- [React 官方文件 — `<select>`](https://react.dev/reference/react-dom/components/select)
- [MDN Web Docs — `<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [MDN Web Docs — `<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)