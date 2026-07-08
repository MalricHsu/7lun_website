---
title: React｜React Hook Form
sidebar_position: 7
tags: [React, 知識點筆記]
date: 2025-12-30
slug: react/react-hook-form
---

### 一、React Hook Form 解決那些問題

#### 1. React 受控元件 (Controlled Component)

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

- 將上面 5 個痛點，用 React 實作一個完整的表單：

  ```jsx
  import { useState, useRef } from "react";

  function ControlledForm() {
    // 痛點 1：每個欄位都要開一個 useState
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAgree, setIsAgree] = useState(false);
    const [gender, setGender] = useState("");

    // 痛點 4：驗證錯誤要自己另外管理一份 state
    const [errors, setErrors] = useState({});

    // 用來觀察「打一個字，整個元件重新渲染幾次」
    const renderCount = useRef(0);
    renderCount.current += 1;
    console.log("ControlledForm 渲染次數：", renderCount.current);

    const validate = () => {
      const newErrors = {};
      if (!username) newErrors.username = "請輸入使用者名稱";
      if (!email) newErrors.email = "請輸入 Email";
      if (!password) newErrors.password = "請輸入密碼";
      else if (password.length < 6) newErrors.password = "密碼至少需 6 個字元";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        console.log({ username, email, password, isAgree, gender });
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        {/* 痛點 2：每個欄位都要寫一次 onChange */}
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <p>{errors.username}</p>

        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <p>{errors.email}</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>{errors.password}</p>

        {/* 痛點 3：checkbox 看的是 checked，不是 value，這裡如果手滑寫成
            onChange={(e) => setIsAgree(e.target.value)}，拿到的會是字串 "on"，
            不是 boolean，是很常見的手誤 */}
        <input
          type="checkbox"
          checked={isAgree}
          onChange={(e) => setIsAgree(e.target.checked)}
        />
        我同意服務條款

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">請選擇</option>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>

        <button type="submit">送出</button>
      </form>
    );
  }
  ```

  :::note
  **痛點 5** 怎麼看出來：打開 `console.log`，隨便在任一個欄位打一個字，會看到 `渲染次數` 一直往上跳——因為 `username`、`email`、`password`...每一個 state 改變，都會讓 `ControlledForm` 整個重新執行一次。欄位少沒感覺，但這個表單如果擴到 20 個欄位，每打一個字就要重新算 20 個欄位 + 錯誤訊息，使用者就會感覺得到卡頓。這正是 RHF 想解決的問題：它把值的追蹤搬到表單外部（uncontrolled 的概念），打字時不會逼整個表單重新渲染。
  :::

#### 3. React Hook Form 的解法：把「登記」和「彙整」分開

- 想像你在辦一場活動報名：如果每個欄位都要你各自問「你叫什麼名字」「Email 多少」，再自己抄到小本子上（每個欄位一個 `useState` + `onChange`），效率很差，欄位一多就會亂。
- React Hook Form 比較像現場直接放一張「報名表」：你把 `{...register("欄位名稱")}` 貼在每個 `input` 上，等於告訴 RHF「這格也幫我登記」。表單送出時，你不用一格一格去問，直接跟 RHF 要一份彙整好的「報名結果」（`handleSubmit(onSubmit)`），資料就整理好了。
- 換句話說：**不要每個欄位都自己顧，而是把欄位「註冊」給 RHF 統一管理，最後送出時一次拿到乾淨的資料。**

#### 4. React Hook Form 的定位

- 官方首頁把自己定位成一套小型、無額外依賴的表單函式庫，訴求是用較少程式碼處理驗證，並降低不必要的重新渲染、減少驗證計算量、加快掛載速度。
- 總結來說，對於**欄位多、驗證規則多的表單**，用 RHF 通常比純 `useState` 表單好維護，而且效能更好（因為輸入時不會逼整個表單重新渲染）。

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

#### 4. `useForm` 更多常用解構屬性

- `register`、`watch`、`handleSubmit` 之外，實務上還會常用到這幾個：

- **`formState` 不是只有 `errors`**，通常會一起解構出來：

  ```jsx
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid, touchedFields },
  } = useForm();
  ```

  | 屬性 | 用途 |
  | --- | --- |
  | `errors` | 驗證沒過的錯誤訊息 |
  | `isSubmitting` | 送出中的狀態，`onSubmit` 是 async function 時 RHF 會自動追蹤，適合拿來做按鈕的 loading / disabled 效果 |
  | `isDirty` | 表單「有沒有被使用者改過」，常用來控制「未儲存離開」的提示，或決定送出按鈕要不要 disable |
  | `isValid` | 目前所有欄位是否都通過驗證，適合拿來即時控制送出按鈕能不能按 |
  | `touchedFields` | 哪些欄位「被使用者碰過」（focus 過又 blur），常搭配 `mode: "onBlur"` 判斷要不要顯示錯誤訊息，避免使用者還沒碰欄位就先看到一堆紅字 |

- **`control`：不是拿來「用」，而是拿來「傳」**，傳給 `useWatch`，或是搭配非原生 input 元件（例如 UI 套件的 DatePicker、Select）時要用的 `Controller`：

  ```jsx
  const { control } = useForm();

  // 傳給 useWatch
  const city = useWatch({ control, name: "city" });
  ```


- `register` 只能綁在原生 `<input>` / `<select>` 這種有 `ref` 的元素上；第三方 UI 套件的元件通常沒辦法直接吃 `register`，這時就要用 `<Controller control={control} name="..." render={...} />` 包一層。

- **`setValue`：在程式碼裡直接改欄位的值**，不用透過使用者手動輸入

- **`reset`：把表單重設回 `defaultValues`**，常見情境是送出成功後清空表單，或是點「取消」按鈕還原：

  ```jsx
    const { reset } = useForm();

    const onSubmit = async (data) => {
      await submitApi(data);
      reset(); // 送出成功後清空表單
    };
  ```


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

#### 3. 實戰：連動下拉選單（縣市 → 區域）

- 常見情境：**第二個下拉選單的選項，要看第一個下拉選單選了什麼。** 例如選了「新北市」，區域選單才會出現板橋區、三重區這些選項。
- 這種情境一定要靠 `watch` 或 `useWatch`，因為 `register` 只負責收資料、跑驗證，不會讓你在 render 過程中「即時知道另一個欄位現在是什麼」，想根據 A 欄位的值決定 B 欄位要 render 什麼選項，就是本節這兩個工具存在的意義。

- **版本一：`watch`（表單就這兩個選單，直接用最方便）**

  ```jsx
  import { useEffect } from "react";
  import { useForm } from "react-hook-form";

  const cityData = {
    新北市: ["板橋區", "三重區", "中和區", "永和區"],
    台北市: ["大安區", "信義區", "中山區"],
  };

  function AddressForm() {
    const {
      register,
      watch,
      setValue,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: { city: "", district: "" },
    });

    // 監聽 city 目前的值，拿去查對應的區域清單
    const city = watch("city");
    const districts = cityData[city] || [];

    // city 一改變，就把 district 清空，避免殘留上一個縣市選過的區域
    useEffect(() => {
      setValue("district", "");
    }, [city, setValue]);

    const onSubmit = (data) => console.log(data);

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("city", { required: "請選擇縣市" })}>
          <option value="">請選擇縣市</option>
          {Object.keys(cityData).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <p>{errors.city?.message}</p>

        <select
          {...register("district", { required: "請選擇區域" })}
          disabled={!city} // 沒選縣市前，區域選單先鎖住
        >
          <option value="">請選擇區域</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <p>{errors.district?.message}</p>

        <button type="submit">送出</button>
      </form>
    );
  }
  ```

  :::note
  - 這裡多了一個還沒介紹過的方法：`setValue`，它是 `useForm` 回傳的另一個工具，用來**在程式碼裡直接改欄位的值**，不用透過使用者手動輸入。`register` 只顧得到「使用者自己打字/點選」這條路徑，但「縣市改了，我要順手清空區域」這件事不是使用者去動 `district` 欄位，是開發者用邏輯去改的，這種情況只能靠 `setValue`。
  


  - 第三個參數可以再細調行為：

    ```jsx
    setValue("district", "板橋區", {
      shouldValidate: true, // 改完順便觸發這個欄位的驗證
      shouldDirty: true,    // 讓 RHF 認定這個欄位「被改過」
      shouldTouch: true,    // 讓 RHF 認定這個欄位「被碰過」
    });
    ```

  - 預設三個都是 `false`，所以單純 `setValue("district", "")` 只是悄悄改值，不會觸發驗證，也不會讓 `isDirty` 之類的狀態知道欄位變了。這個例子如果不清空，使用者選了「新北市 → 板橋區」又把縣市改成「台北市」，`district` 裡會殘留一個不屬於台北市選項的髒值，送出的資料就是錯的，所以這步不能省。
  :::

- **版本二：`useWatch`（表單很大，把這組相依欄位拆成子元件，避免拖累其他欄位）**

  - 這個案例裡，第二個 select 本來就得跟著 city 一起重新渲染，`watch` 跟 `useWatch` 在這點上沒差別。**`useWatch` 的價值要在「表單裡還有其他跟地址無關的欄位」時才會出現**：把 city + district 包成一個子元件，city 改變時只有這個子元件重新渲染，姓名、Email 這些不相干的欄位不會被拖著一起重繪。

  ```jsx
  import { useEffect } from "react";
  import { useForm, useWatch } from "react-hook-form";

  const cityData = {
    新北市: ["板橋區", "三重區", "中和區", "永和區"],
    台北市: ["大安區", "信義區", "中山區"],
  };

  // 子元件：把「縣市 + 區域」這組相依欄位包起來，自己訂閱、自己重新渲染
  function CityDistrictSelect({ control, register, setValue }) {
    const city = useWatch({ control, name: "city" });
    const districts = cityData[city] || [];

    useEffect(() => {
      setValue("district", "");
    }, [city, setValue]);

    return (
      <>
        <select {...register("city", { required: "請選擇縣市" })}>
          <option value="">請選擇縣市</option>
          {Object.keys(cityData).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select {...register("district", { required: "請選擇區域" })} disabled={!city}>
          <option value="">請選擇區域</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </>
    );
  }

  function BigForm() {
    const { register, control, setValue, handleSubmit } = useForm({
      defaultValues: { username: "", email: "", city: "", district: "" },
    });

    const onSubmit = (data) => console.log(data);

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 這兩個欄位跟地址無關，city 改變時完全不會被拖著重新渲染 */}
        <input type="text" placeholder="姓名" {...register("username")} />
        <input type="email" placeholder="Email" {...register("email")} />

        <CityDistrictSelect control={control} register={register} setValue={setValue} />

        <button type="submit">送出</button>
      </form>
    );
  }
  ```

#### 4. 該用哪個？

| 方法 | 重新渲染範圍 | 適合情境 |
| --- | --- | --- |
| `watch` | 呼叫它的整個元件 | 表單簡單、欄位不多，做輕量的條件渲染 |
| `useWatch` | 只有使用它的那個 hook / 子元件 | 表單欄位多、想做即時預覽，或監聽邏輯想抽離主表單 |

- 簡單判斷法：**表單小就用 `watch` 圖方便；表單大、或監聽的東西會頻繁變動（例如即時字數統計、即時預覽、上面的縣市/區域連動），就把它拆成子元件用 `useWatch`。**


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



### 七、實戰：步道後台登入表單

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


### 八、參考資源

- [React Hook Form 官方文件 — useForm](https://react-hook-form.com/docs/useform)
- [React Hook Form 官方文件 — register](https://react-hook-form.com/docs/useform/register)
- [React Hook Form 官方文件 — handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit)
- [React Hook Form 官方文件 — watch](https://react-hook-form.com/docs/useform/watch)
- [React Hook Form 官方文件 — useWatch](https://react-hook-form.com/docs/usewatch)
- [React Hook Form 官方文件 — setValue](https://react-hook-form.com/docs/useform/setvalue)
- [React Hook Form 官方文件 — formState](https://react-hook-form.com/docs/useform/formstate)
- [React 官方文件 — `<input>`](https://react.dev/reference/react-dom/components/input)
- [React 官方文件 — `<select>`](https://react.dev/reference/react-dom/components/select)
- [MDN Web Docs — `<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [MDN Web Docs — `<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)