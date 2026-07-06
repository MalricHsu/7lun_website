---
title: JS｜JavaScript 繼承與原型鏈
sidebar_position: 13
tags: [JavaScript, 知識點筆記]
date: 2025-04-25
slug: /docs/javascript/js-inheritance-prototype-chain
---

### 前言、繼承與原型鏈

- **JavaScript 就只有一個建構子：物件**。
- 每個物件都有一個連著其他**原型**（prototype）的私有屬性（private property）物件。
- **原型物件也有著自己的原型**，於是原型物件就這樣鏈結，直到撞見 `null` 為止：`null` 在定義裡沒有原型、也是**原型鏈**（prototype chain）的最後一個鏈結。

### 一、從物件開始說起

在 JavaScript 裡，我們最常看到的**資料結構之一就是物件 (object)**。
它可以儲存資料，也可以放函式作為方法：

```js
const person = {
  name: "小明",
  sayHi: function() {
    console.log("嗨! 我是 + this.name);
  }
};

person.sayHi(); // 嗨！我是小明
```

這樣的寫法有一個**小缺點：如果你要建立很多人，就要重複寫很多次！**

```js
const person1 = { name: "Alice", sayHi() {...} };
const person2 = { name: "Bob", sayHi() {...} };
```

即使這兩個人的`sayHi`方法一模一樣，他們在**記憶體中仍是不同的函式**。

### 二、讓程式更有效率：建構函式 (Constructor Function)

此時，我們能有一個「模板」就幫我們快速建立多個相似的物件。所以可以使用「建構函式」：

```js
function Person(name) {
  this.name = name;
  this.sayHi = function() {
    console.log("Hi! I'm " + this.name);
  };
}
const a = new Person("Alice");
const b = new Person("Bob");

a.sayHi(); // Hi! I'm Alice
b.sayHi(); // Hi! I'm Bob
```

:::note

`new` 關鍵字幫我們做了幾件事：

1. 建立一個新的空物件 `{}`
2. 把這個物件的 `__proto__` 屬性連接到 `Person.prototype`
3. 把函式中的 `this` 指向那個新物件
4. 自動回傳這個物件

但這樣還是不夠好，如果你仔細看：

```js
console.log(a.sayHi === b.sayHi); // false
```

- 雖然`a`和`b`都有`sayHi()` 方法，但它們其實是**不同的函式實體**。
- **代表每建立一個新的人，就要重新複製一次函式**。這樣做雖然可行，但**浪費記憶體**。
:::



### 三、把方法放在 prototype 上

JavaScript 提供了一個特性：**每個建構函式都有一個 `prototype` 物件**，可以放要讓所有**實例共用**的**屬性**或**方法**。

```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = function() {
  console.log("Hi! I'm " + this.name);
};

const a = new Person("Alice");
const b = new Person("Bob");

a.sayHi(); // Hi! I'm Alice
b.sayHi(); // Hi! I'm Bob

此時：

console.log(a.sayHi === b.sayHi); // true

-> 意思是所有的 Person 實例都共用同一個 sayHi() 方法。
```

### 四、原型鏈的運作機制

當你呼叫 `a.sayHi()` 時，

JavaScript 會這樣找這個方法：

1. 先看 `a` 自己有沒有 `sayHi()`
2. 沒有的話，沿著 `__proto__` 去找
3. 找到 `Person.prototype` 裡的 `sayHi()`
4. 執行它

這個沿著原型往上找的過程，稱為 **原型鏈 (prototype chain)**。

簡單概念圖：

```js
a (實例 instance)
 ├─ name: "Alice"
 └─ __proto__ → Person.prototype
                    └─ sayHi()
```

### 五、prototype 與 **proto** 的關係

這兩個常常讓人搞混。

| 名稱 | 屬於誰 | 作用 |
| --- | --- | --- |
| **prototype** | 屬於**建構函式** | 定義要給實例共用的方法或屬性 |
| **proto** | 屬於**實例** | 指向建構函式的 prototype |

```js
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function() {
  console.log("Hi! I'm " + this.name);
};

const a = new Person("Alice");

他們的關係：
a.__proto__ === Person.prototype  // true

```

### 六、繼承的概念（用另一個建構函式接續）

假設我們有另一種角色叫 `Student`，它除了 `name` 外，還有 `school`。

:::tip

先來解釋：`Function.prototype.call()` 

當我們在做**建構式繼承**時（例如 Student 想繼承 Person），我們希望「Student 也能擁有 Person 建構式裡面定義的屬性」。

:::

```js
function Person(name) {
  this.name = name;
}

function Student(name, school) {
  this.name = name;
  this.school = school;
}
```

這樣雖然可以運作，但問題是：如果`Person`建構式裡面有更多屬性要設定（例如 age、gender、id...），那`Student`就要重複寫一次所有的東西，很沒效率。

為了有效率，我們可以這樣做…

```js
Person.call(this, name);
-----

function Student(name, school) {
  Person.call(this, name); // -> 這行最重要！
  this.school = school;
}

意思是：
立刻執行 Person(),並且把 this 指向 Student 的新實例

換句話說，
當 new Student("Tom", "NTU") 被執行時：

1️⃣ JS 幫你建立一個新的空物件 {}
2️⃣ 這個物件被指定給 Student 函式裡的 this
3️⃣ 執行 Person.call(this, name) 時，
　→ this 指的是「Student 的那個新物件」
　→ 所以 Person 會幫那個物件加上 name 屬性
4️⃣ 再執行 this.school = school
5️⃣ 最後回傳這個物件

```

接著，我們繼續…

希望 `Student` 能「繼承」 `Person` 的功能：

```js
function Person(name) {
  this.name = name;
}

function Student(name, school) {
  Person.call(this, name); // 繼承屬性
  this.school = school;
}

// 建立原型鏈
Student.prototype = Object.create(Person.prototype);  //讓 Student 的原型（prototype）連接到 Person 的原型
Student.prototype.constructor = Student;  //修正 constructor 屬性，指回正確的建構式,原本會指向Person

// 新增自己的方法
Student.prototype.study = function() {
  console.log(`${this.name} is studying at ${this.school}`);
};

const s = new Student("Tom", "NTU");

s.sayHi();  // Hi! I'm Tom
s.study();  // Tom is studying at NTU

```

:::tip

結果

- `Student` 的實例可以使用 `Person.prototype` 上的方法
- 也可以有自己專屬的方法
:::

### 七、多層繼承：在兩個建構式之間插入一層

有時候，我們不只是想從 A 繼承到 C，中間還希望有一層 B 來「加一些共用功能」→ 這就是「**多層繼承**」。

#### 1. 目標結構

```js
Person → Employee → Manager
```

- `Person`：擁有基礎屬性與方法
- `Employee`：繼承 `Person`，並新增與工作相關的屬性
- `Manager`：繼承 `Employee`，再加上管理的能力
#### 2. 建立最基礎的建構式 Person

```js
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function() {
  console.log(`Hi! I'm ${this.name}`);
};
```

#### 3. 第二層建構式 Employee（繼承 Person）

```js
function Employee(name, job) {
  // 繼承 Person 的屬性
  Person.call(this, name);
  this.job = job;
}

// 繼承 Person 的方法
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

Employee.prototype.work = function() {
  console.log(`${this.name} is working as a ${this.job}`);
};

```

#### 4. 第三層建構式 Manager（繼承 Employee）

```js
function Manager(name, job, department) {
  // 繼承 Employee 的屬性
  Employee.call(this, name, job);
  this.department = department;
}

// 繼承 Employee 的方法（同時也間接繼承 Person）
Manager.prototype = Object.create(Employee.prototype);
Manager.prototype.constructor = Manager;

Manager.prototype.manage = function() {
  console.log(`${this.name} is managing the ${this.department} department`);
};

```

#### 5. 使用這三層建構式

```js
const m1 = new Manager("Tom", "Developer", "Frontend");

m1.sayHi();   // 來自 Person
m1.work();    // 來自 Employee
m1.manage();  // 來自 Manager

//Hi! I'm Tom
//Tom is working as a Developer
//Tom is managing the Frontend department
```

#### 6. 觀察原型鏈結構

```js
m1
 └─ __proto__ → Manager.prototype
                      └─ __proto__ → Employee.prototype
                                              └─ __proto__ → Person.prototype
                                                                  └─ __proto__ → Object.prototype

```

- `m1` 可以一路往上找到：

  - `manage()`（自己）
  - `work()`（Employee）
  - `sayHi()`（Person）

### 資料來源

- [MDN 繼承與原型鏈](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)
- [IThome JavaScript 繼承與原型鏈](https://ithelp.ithome.com.tw/m/articles/10289866)