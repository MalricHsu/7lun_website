---
title: SQL｜SQL 基礎到進階指令統整
sidebar_position: 1
tags: [PostgreSQL, SQL, 資料庫, 知識點筆記]
date: 2026-05-09
slug: sql-introduction
---

### 一、關聯式資料庫基本概念

- 一個實際系統（例如社群平台）會產生大量資料，需要有系統地儲存與管理。

- SQL（Structured Query Language，結構化查詢語言）是操作關聯式資料庫的語言，常見資料庫系統包含 PostgreSQL、MySQL、Microsoft SQL Server 與 Oracle。

- 關聯式資料庫以「資料表」為核心，每張資料表包含三個核心概念：
  - **資料表（Table）**：同一類資料的集合，例如會員、商品、部門。
  - **欄位（Column）**：資料的屬性與型別，例如姓名、Email、價格。
  - **資料列（Row）**：一筆完整記錄，例如一位會員或一項商品。

- 實際系統通常會拆成多張資料表，彼此透過關聯串接。例如社群平台可拆成：
  - `users`：會員
  - `posts`：貼文
  - `comments`：留言
  - `photos`：照片

### 二、建立資料表

#### 1. CREATE TABLE 語法

- 在資料庫中建立一張表的基本語法：

  ```sql
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      age INTEGER,
      created_at TIMESTAMP
  );
  ```

- SQL 指令通常以分號 `;` 結束。

#### 2. 常見資料型別

| 型別 | 用途 | 範例 |
| --- | --- | --- |
| `INTEGER` | 整數、ID、年齡、數量 | `age INTEGER` |
| `VARCHAR(n)` | 最長為 n 個字元的字串 | `name VARCHAR(50)` |
| `TIMESTAMP` | 日期與時間 | `created_at TIMESTAMP` |
| `DECIMAL(p,s)` | 精確小數，適合金額 | `price DECIMAL(10,2)` |
| `BOOLEAN` | 真／假狀態 | `is_active BOOLEAN` |
| `JSON` | 彈性 JSON 結構 | `settings JSON` |

:::note
金額欄位應使用 `DECIMAL`，而不是 `FLOAT` 或 `DOUBLE`，避免浮點數計算誤差導致金額對不上。
:::

### 三、CRUD：新增、查詢、修改、刪除

#### 1. 四種基本操作對照

- CRUD 對應四種基本資料操作：

  | 操作 | SQL | 意義 |
  | --- | --- | --- |
  | Create | `INSERT` | 新增資料 |
  | Read | `SELECT` | 查詢資料 |
  | Update | `UPDATE` | 修改資料 |
  | Delete | `DELETE` | 刪除資料 |

#### 2. INSERT 新增資料

- 新增單筆：

  ```sql
  INSERT INTO users (name, email, age)
  VALUES ('張小明', 'xiaoming@gmail.com', 25);
  ```

- 一次新增多筆：

  ```sql
  INSERT INTO users (name, email, age) VALUES
      ('張小明', 'a@gmail.com', 25),
      ('王小美', 'b@gmail.com', 30);
  ```

#### 3. SELECT 查詢資料

- 查詢指定欄位：

  ```sql
  SELECT name, email
  FROM users;
  ```

- 使用 `AS` 設定查詢結果的別名：

  ```sql
  SELECT
      name AS 姓名,
      email AS 電子郵件
  FROM users;
  ```

#### 4. UPDATE 修改資料

- 修改指定欄位值：

  ```sql
  UPDATE products
  SET price = 4500
  WHERE name = 'AirPods';
  ```

- 修改既有數值（例如增加庫存）：

  ```sql
  UPDATE products
  SET stock = stock + 10
  WHERE name = 'AirPods';
  ```

:::warning
`UPDATE` 若省略 `WHERE`，會修改整張表的所有資料列。實務上建議先用相同條件執行一次 `SELECT` 確認範圍，再執行 `UPDATE`。
:::

#### 5. DELETE 刪除資料

- 刪除單一條件：

  ```sql
  DELETE FROM products
  WHERE name = 'AirPods';
  ```

- 多重條件刪除：

  ```sql
  DELETE FROM products
  WHERE stock = 0
    AND status = 'inactive';
  ```

:::warning
`DELETE` 若省略 `WHERE`，會刪除整張表的所有資料列，同樣建議先用 `SELECT` 確認再執行。
:::

### 四、WHERE 條件篩選

#### 1. 基本結構

- `SELECT` 查詢時，用 `WHERE` 只取出符合特定條件的資料：

  ```sql
  SELECT 欄位
  FROM 資料表
  WHERE 篩選條件;
  ```

- 例如查詢 3C 商品：

  ```sql
  SELECT name, price
  FROM products
  WHERE category = '3C';
  ```

:::note
SQL 的邏輯執行順序可先理解為：`FROM`（決定資料來源）→ `WHERE`（篩選資料）→ `SELECT`（決定輸出欄位）。
:::

#### 2. 比較運算子

| 運算子 | 意義 | 範例 |
| --- | --- | --- |
| `=` | 等於 | `price = 100` |
| `<>` 或 `!=` | 不等於 | `status <> 'inactive'` |
| `>` | 大於 | `price > 100` |
| `<` | 小於 | `stock < 50` |
| `>=` | 大於等於 | `price >= 100` |
| `<=` | 小於等於 | `price <= 100` |

```sql
SELECT name, stock
FROM products
WHERE stock < 50;
```

#### 3. 邏輯運算子

```sql
-- 兩個條件都成立
SELECT name, price, stock
FROM products
WHERE status = 'active'
  AND category = '3C';

-- 任一條件成立
SELECT name, status, stock
FROM products
WHERE status = 'inactive'
   OR stock = 0;
```

:::note
混用 `AND`、`OR` 時，建議加括號明確表達條件優先順序：

```sql
WHERE category = '3C'
  AND (status = 'inactive' OR stock = 0)
```
:::

#### 4. 集合與範圍

```sql
-- 含頭含尾
WHERE price BETWEEN 500 AND 1000

-- 在指定集合中
WHERE category IN ('3C', '配件')

-- 不在指定集合中
WHERE name NOT IN ('充電線', '手機殼', '螢幕保護貼')
```

### 五、主鍵與外來鍵

#### 1. 主鍵（Primary Key，PK）

- 每張資料表應有主鍵。
- 值必須唯一且不可為 `NULL`。
- 通常命名為 `id`。
- 建立後不應任意修改。

#### 2. 外來鍵（Foreign Key，FK）

- 用來參照另一張表的主鍵。
- 多筆資料可以使用相同外來鍵。
- 外來鍵可允許 `NULL`，表示尚未建立關聯。
- 通常命名為 `被參照資料表_id`，例如 `team_id`。

```sql
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    salary INTEGER,
    team_id INTEGER,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

### 六、NULL 與 COALESCE

#### 1. NULL 的特性

- `NULL` 表示未知或沒有值，不等於 `0`，也不等於空字串 `''`。

- 判斷 `NULL` 必須使用 `IS NULL` 或 `IS NOT NULL`：

  ```sql
  SELECT *
  FROM users
  WHERE team_id IS NULL;
  ```

:::warning
不能寫成 `team_id = NULL`，因為 `NULL` 無法用 `=` 比較，這樣寫的結果永遠不會是 `TRUE`。
:::

#### 2. COALESCE 取代 NULL

- `COALESCE` 會由左到右回傳第一個不是 `NULL` 的值：

  ```sql
  SELECT
      name,
      COALESCE(team_name, '待分配') AS team_name,
      COALESCE(salary, 0) AS salary
  FROM users;
  ```

### 七、去除重複與聚合函數

#### 1. DISTINCT 去除重複

```sql
SELECT DISTINCT team_name
FROM users;
```

#### 2. 聚合函數

| 函數 | 用途 |
| --- | --- |
| `COUNT(*)` | 計算資料列數量 |
| `SUM(column)` | 加總 |
| `AVG(column)` | 平均值 |
| `MAX(column)` | 最大值 |
| `MIN(column)` | 最小值 |

```sql
SELECT
    COUNT(*) AS 員工數,
    AVG(salary) AS 平均薪資,
    SUM(salary) AS 總薪資,
    MAX(salary) AS 最高薪資,
    MIN(salary) AS 最低薪資
FROM users;
```

:::note
多數聚合函數會忽略 `NULL`。例如 `COUNT(salary)` 只計算 `salary` 非 `NULL` 的資料列，而 `COUNT(*)` 計算所有資料列，兩者結果可能不同。
:::

### 八、SERIAL 與 UUID

#### 1. 兩種主鍵產生方式比較

| 特性 | `SERIAL` | `UUID` |
| --- | --- | --- |
| 格式 | 遞增整數 | 128-bit 識別碼 |
| 可讀性 | 高 | 低 |
| 儲存空間 | 較小 | 較大 |
| 可預測性 | 容易預測 | 難以預測 |
| 適用情境 | 單一資料庫、內部 ID | 分散式系統、公開識別碼 |

```sql
-- SERIAL
id SERIAL PRIMARY KEY

-- PostgreSQL UUID（使用 pgcrypto）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

:::note
在 PostgreSQL 中，`gen_random_uuid()` 通常搭配 `pgcrypto` 擴充套件使用。若採用 `uuid-ossp`，則常見函數是 `uuid_generate_v4()`。
:::

### 九、JOIN 資料表關聯

#### 1. JOIN 的用途

- `JOIN` 用來依關聯條件組合多張資料表，把兩張表的資料「串」在一起：

  ```sql
  SELECT
      users.name AS 姓名,
      users.salary AS 薪資,
      teams.name AS 部門名稱
  FROM users
  INNER JOIN teams
      ON users.team_id = teams.id;
  ```

#### 2. 常見 JOIN 類型

- `INNER JOIN`：只保留兩邊成功配對的資料。
- `LEFT JOIN`：保留左表全部資料，右表未配對欄位為 `NULL`。
- `RIGHT JOIN`：保留右表全部資料。
- `FULL OUTER JOIN`：兩表資料都保留，未配對處為 `NULL`。

- 若想顯示尚未分配部門的員工，應使用 `LEFT JOIN`，並搭配 `COALESCE` 處理顯示文字：

  ```sql
  SELECT
      users.name,
      COALESCE(teams.name, '未分配') AS team_name
  FROM users
  LEFT JOIN teams
      ON users.team_id = teams.id;
  ```

### 十、ORDER BY 與 LIMIT

#### 1. 排序與筆數限制

- `ORDER BY` 控制排序方向，`LIMIT` 限制回傳筆數：

  ```sql
  -- 薪資由低到高
  SELECT name, salary
  FROM users
  ORDER BY salary ASC;

  -- 薪資最高的 5 人
  SELECT name, salary
  FROM users
  ORDER BY salary DESC
  LIMIT 5;
  ```

  - `ASC`：由小到大，預設排序方式。
  - `DESC`：由大到小。
  - `LIMIT`：限制回傳筆數。

### 十一、GROUP BY 分組統計

#### 1. GROUP BY 基本用法

- `GROUP BY` 先將資料分組，再搭配聚合函數計算每組結果：

  ```sql
  SELECT
      teams.name AS 部門,
      COUNT(*) AS 人數,
      SUM(users.salary) AS 總薪資,
      AVG(users.salary) AS 平均薪資,
      MAX(users.salary) AS 最高薪資,
      MIN(users.salary) AS 最低薪資
  FROM users
  INNER JOIN teams
      ON users.team_id = teams.id
  GROUP BY teams.name;
  ```

:::note
`SELECT` 中沒有使用聚合函數的欄位，通常都必須出現在 `GROUP BY` 中。
:::

#### 2. HAVING 篩選分組結果

- 若要篩選分組後的統計結果，使用 `HAVING`：

  ```sql
  SELECT team_id, COUNT(*) AS 人數
  FROM users
  GROUP BY team_id
  HAVING COUNT(*) >= 3;
  ```

:::info
`WHERE` 與 `HAVING` 的差異：`WHERE` 是在分組「前」篩選資料列，`HAVING` 是在分組「後」篩選統計結果。
:::

### 十二、子查詢

#### 1. 什麼是子查詢

- 子查詢是在另一個 SQL 指令中執行的查詢，可解決「需要先算出一個值，再用這個值做條件」的問題。

#### 2. 常見用法

- 查詢高於平均薪資的員工：

  ```sql
  SELECT name, salary
  FROM users
  WHERE salary > (
      SELECT AVG(salary)
      FROM users
  );
  ```

- 顯示每位員工與平均薪資的差距：

  ```sql
  SELECT
      name,
      salary,
      salary - (SELECT AVG(salary) FROM users) AS 與平均差距
  FROM users;
  ```

- `INSERT` 搭配子查詢：

  ```sql
  INSERT INTO users (name, email, salary, team_id)
  VALUES (
      '新同事',
      'new@gmail.com',
      50000,
      (SELECT id FROM teams WHERE name = '開發部')
  );
  ```

:::warning
子查詢也能搭配 `UPDATE`、`DELETE` 使用，但務必確認子查詢回傳的資料筆數符合外層語法需求（例如單一值 vs. 多筆結果）。
:::


### 十三、資料來源
[PostgreSQL 資料庫教學](https://gamma.app/docs/SQL--23heyix4r93u5u0?mode=doc)
