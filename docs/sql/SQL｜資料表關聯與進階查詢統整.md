---
title: SQL｜資料表關聯與進階查詢統整
sidebar_position: 3
tags: [PostgreSQL, SQL, 資料庫, 知識點筆記]
date: 2026-07-20
slug: sql-table-relations
---

### 一、為什麼要拆成多張資料表

#### 1. 單一資料表的問題

- 真實系統（會員、教練、課程、報名）的資料庫由多張表組成。如果把所有資料塞在同一張表，同一筆資料會重複出現在多列：

  | user_name | coach_name | coach_specialty | course_title |
  | --- | --- | --- | --- |
  | Alice | 王教練 | 重訓 | 核心重訓 |
  | Alice | 陳教練 | 有氧 | 全身燃脂 |
  | Bob | 王教練 | 重訓 | 核心重訓 |
  | Charlie | 林教練 | 瑜珈 | 晨間瑜珈 |
  | Charlie | 王教練 | 重訓 | 核心重訓 |

- 王教練的「重訓」重複出現三次。教練改名或換專長時要同時修改多筆，漏改一筆資料就不一致。

#### 2. 拆成多張表

- 每筆資料只存一次，再用 `id` 互相連接：

  ```sql
  courses.coach_id → coaches.id
  ```

- 王教練的資料只存在 `coaches` 表一次，所有課程透過 `coach_id` 指向它，改一筆就全部生效。

#### 3. 從欄位角度分析

- 拿到一張大表時，逐欄問「這個欄位是描述誰的？」：
  - 訂單表裡的客戶姓名、電話、地址是「客戶」的屬性，同一位客戶下多筆訂單就會重複，應拆出客戶表。
  - 掛號表裡的姓名、身分證字號、生日是「病患」的屬性，應拆出病患表。

:::note
**重複出現的一組欄位，就是該獨立成表的訊號。**
:::

### 二、主鍵與外來鍵

#### 1. 定義

- **主鍵（Primary Key，PK）**：每張表裡每筆資料的唯一識別，通常是 `id`，不可重複、不可為 `NULL`。
- **外來鍵（Foreign Key，FK）**：指向另一張表某筆資料 `id` 的欄位，用來建立關聯。
  - 例如 `courses.coach_id = 2`，代表這堂課的教練是 `coaches` 表裡 `id = 2` 的那位。

#### 2. 建表語法

- 用 `SERIAL` 讓主鍵自動遞增、用 `FOREIGN KEY ... REFERENCES` 宣告外來鍵：

  ```sql
  -- 部門資料表（一方）
  CREATE TABLE teams (
      id SERIAL PRIMARY KEY,   -- 部門編號，主鍵；SERIAL 自動遞增
      name VARCHAR(50)         -- 部門名稱
  );

  -- 員工資料表（多方，持有外來鍵）
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,   -- 員工編號，主鍵
      name VARCHAR(50),
      salary INTEGER,
      team_id INTEGER,         -- 部門編號，外來鍵
      FOREIGN KEY (team_id) REFERENCES teams(id)  -- 宣告關聯
  );

  INSERT INTO teams (name) VALUES ('開發部'), ('人事部');

  INSERT INTO users (name, salary, team_id) VALUES
      ('張小明', 45000, 1),
      ('王大明', 48000, 1),
      ('李小華', 52000, 2),
      ('陳小玉', 55000, 2),
      ('林小豪', 47000, 1);
  ```

:::warning
宣告 `FOREIGN KEY` 之後，插入一筆 `team_id = 5` 的員工（但 `teams` 表沒有 id 5）會直接報錯，這是資料庫在保護關聯完整性。反過來說，修改 `teams` 的部門名稱不影響員工表，因為員工存的是 id 不是名稱，這正是拆表的好處。
:::

### 三、資料表關聯類型

#### 1. 規劃流程：兩個方向各問一次

- 從欄位角度、用兩個方向分析：
  - 以「員工」角度：一個員工屬於 **1** 個部門。
  - 以「部門」角度：一個部門有 **多** 個員工。
  - → 部門與員工是「一對多」，外來鍵放在多的那一方（`users.team_id`）。

| 關係 | 範例 | 實作方式 |
| --- | --- | --- |
| 一對多 | 一位教練 → 多堂課 | `courses.coach_id` 外來鍵指向 `coaches.id` |
| 多對多 | 多位學員 ↔ 多堂課 | 中間表 `enrollments`，同時存 `user_id` 與 `course_id` |

#### 2. 多對多需要中間表

- 一位學員可以報多堂課，一堂課也可以有多位學員。只在 `users` 或 `courses` 其中一張表加外來鍵，都無法完整記錄這種關係。
- 解法是建立中間表（關聯表）`enrollments`，每一筆只記兩個外來鍵，也就是 `user_id`（誰）與 `course_id`（報了哪堂課），一筆就代表一個「報名關係」：

  | id | user_id | course_id |
  | --- | --- | --- |
  | 1 | 1 | 1 |
  | 2 | 1 | 3 |
  | 3 | 2 | 2 |

:::info
**辨識關聯類型的口訣：**
- 兩邊各問一次「一個 A 對應幾個 B？」。
  - 兩邊都答「一個」→ 一對一；
  - 一邊「一個」一邊「多個」→ 一對多，外來鍵放多的那方；
  - 兩邊都「多個」→ 多對多，開中間表。
:::

### 四、順著外來鍵查詢

#### 1. 兩步查法（還不用 JOIN）

- 在學 `JOIN` 之前，可以把跨表查詢拆成兩步：先查外來鍵的值，再拿值去查另一張表：

  ```sql
  -- 想知道「王教練（id = 2）負責哪些課程」

  -- 步驟一：到 courses 表，找出 coach_id = 2 的所有課程
  SELECT * FROM courses WHERE coach_id = 2;

  -- 步驟二：到 coaches 表確認 id = 2 是哪位教練
  SELECT * FROM coaches WHERE id = 2;
  ```

#### 2. 順著中間表追多對多

  ```sql
  -- Charlie（user_id = 3）報了哪些課
  SELECT * FROM enrollments WHERE user_id = 3;

  -- 晨間瑜珈（course_id = 1）有誰報名
  SELECT * FROM enrollments WHERE course_id = 1;
  ```

- 這種查法能運作，但每個問題都要下兩、三條查詢，這就是 `JOIN` 要解決的問題。

### 五、JOIN 合併查詢

#### 1. JOIN 的用途

- `JOIN` 依照指定的外來鍵關係，在一條語句內把多張表合併成一張結果：

  ```sql
  -- 之前要兩步：
  SELECT * FROM courses WHERE coach_id = 2;
  SELECT * FROM coaches WHERE id = 2;

  -- 現在一步搞定：
  SELECT courses.title, coaches.name
  FROM courses
  INNER JOIN coaches
      ON courses.coach_id = coaches.id;
  ```

- `ON` 指定兩張表怎麼對應：「哪個欄位相等時才算同一筆關聯資料」。這裡是 `courses.coach_id = coaches.id`。

#### 2. 資料表別名

- 表名太長時用 `AS`（或直接空格）取別名，讓查詢簡潔：

  ```sql
  SELECT c.title AS course_title, co.name AS coach_name
  FROM courses c                -- c 是 courses 的別名
  INNER JOIN coaches co
      ON c.coach_id = co.id;
  ```

#### 3. INNER JOIN

- 只保留兩張表**都對得上**的資料列，任一邊找不到對應的列會被捨棄。實戰中 80%～90% 的情境都用它：

  ```sql
  SELECT c.title, co.name AS coach_name
  FROM courses c
  INNER JOIN coaches co
      ON c.coach_id = co.id;
  ```

  | title | coach_name |
  | --- | --- |
  | 晨間瑜珈 | 林教練 |
  | 核心重訓 | 王教練 |
  | 全身燃脂 | 王教練 |
  | 夜間有氧 | 陳教練 |

- **多表 INNER JOIN**：每加一張表就再加一行 `INNER JOIN`。查多對多時通常從中間表出發：

  ```sql
  -- 所有報名記錄：學員姓名 + 課程名稱
  SELECT u.name AS user_name, c.title AS course_title
  FROM enrollments e                            -- 從中間表出發
  INNER JOIN users u ON e.user_id = u.id        -- 接上學員
  INNER JOIN courses c ON e.course_id = c.id;   -- 接上課程
  ```

#### 4. LEFT JOIN

- 保留**左表**（`FROM` 後面那張）的所有資料列；右表沒對到的欄位補 `NULL`。
- 典型用途：找出「沒有關聯資料」的列，例如還沒報名任何課程的學員：

  ```sql
  SELECT u.name, e.course_id
  FROM users u                     -- users 是左表，每位學員都會出現
  LEFT JOIN enrollments e
      ON u.id = e.user_id;
  ```

  | name | course_id |
  | --- | --- |
  | Alice | 1 |
  | Alice | 3 |
  | Bob | 2 |
  | Charlie | 1 |
  | Charlie | 2 |
  | Charlie | 4 |
  | Diana | NULL |

- Diana 從未報名，`INNER JOIN` 會直接把她丟掉，`LEFT JOIN` 則保留她並在 `course_id` 補 `NULL`，這個 `NULL` 就是「找出未報名學員」的線索。

#### 5. RIGHT JOIN 與 FULL JOIN

| 類型 | 說明 |
| --- | --- |
| `RIGHT JOIN` | 保留右表所有資料，左表沒對到補 `NULL`（方向與 LEFT 相反） |
| `FULL JOIN` | 兩邊全保留，沒對到的一律補 `NULL` |

- 為了看出差異，把 `coaches` 與 `courses` 各補一筆「對不到另一邊」的資料：
  - `coaches` 新增「鄭教練（id = 4）」，但他還沒開任何課 → 右表有、左表對不到。
  - `courses` 新增「戶外攀岩（id = 5, coach_id = NULL）」，還沒指派教練 → 左表有、右表對不到。

    ```sql
    INSERT INTO coaches VALUES (4, '鄭教練', '游泳');       -- 沒有對應課程
    INSERT INTO courses VALUES (5, '戶外攀岩', NULL);       -- 沒有對應教練
    ```

- **RIGHT JOIN**：保留右表（`coaches`）的每一列，即使左表沒有對應的課程也會出現，`courses` 欄位補 `NULL`：

  ```sql
  SELECT c.title AS course_title, co.name AS coach_name
  FROM courses c
  RIGHT JOIN coaches co
      ON c.coach_id = co.id;
  ```

  | course_title | coach_name |
  | --- | --- |
  | 晨間瑜珈 | 林教練 |
  | 核心重訓 | 王教練 |
  | 全身燃脂 | 王教練 |
  | 夜間有氧 | 陳教練 |
  | NULL | 鄭教練 |

  - 鄭教練沒開課，但因為在右表（`coaches`）所以被保留，`course_title` 補 `NULL`；「戶外攀岩」在左表且對不到教練，被捨棄。
  - `RIGHT JOIN` 其實可以改寫成把左右表對調的 `LEFT JOIN`，結果相同，所以實戰上大多只用 `LEFT JOIN`。

- **FULL JOIN**：左右兩表沒對到的列**全部保留**，各自缺的那邊補 `NULL`：

  ```sql
  SELECT c.title AS course_title, co.name AS coach_name
  FROM courses c
  FULL JOIN coaches co
      ON c.coach_id = co.id;
  ```

  | course_title | coach_name |
  | --- | --- |
  | 晨間瑜珈 | 林教練 |
  | 核心重訓 | 王教練 |
  | 全身燃脂 | 王教練 |
  | 夜間有氧 | 陳教練 |
  | 戶外攀岩 | NULL |
  | NULL | 鄭教練 |

  - 「戶外攀岩」（有課無教練）與「鄭教練」（有教練無課）兩邊的孤兒列都被保留，這是 `INNER` / `LEFT` / `RIGHT` 都做不到的。
  - 典型用途：對帳。想找出「兩邊資料對不起來」的缺口時（哪些課沒教練、哪些教練沒課），`FULL JOIN` 一次抓出兩種。

:::note
`RIGHT JOIN` 與 `FULL JOIN` 實戰較少見，理解概念即可；主力是 `INNER JOIN` 與 `LEFT JOIN`。`RIGHT JOIN` 幾乎都能用對調表的 `LEFT JOIN` 取代，`FULL JOIN` 則在需要同時檢查兩邊未匹配資料時才用得上。
:::

### 六、PostgreSQL 常用函式

#### 1. COALESCE 取代 NULL

- `NULL` 代表「沒有資料」，不是空字串 `''` 也不是 `0`。
- `COALESCE` 依序掃描參數，回傳第一個不是 `NULL` 的值，常用來給替代文字：

  ```sql
  SELECT name, COALESCE(avatar, '尚未上傳') AS avatar_url
  FROM members;
  -- avatar 是 NULL 的會員會顯示「尚未上傳」，而不是空白
  ```

#### 2. 字串函式

| 函式 | 用途 | 範例 |
| --- | --- | --- |
| `UPPER(str)` | 轉大寫 | `UPPER('alice')` → `'ALICE'` |
| `LENGTH(str)` | 取字元長度 | `LENGTH('hello')` → `5` |
| `SPLIT_PART(str, delimiter, n)` | 依分隔符切字串取第 n 段 | `SPLIT_PART('alice@gmail.com', '@', 2)` → `'gmail.com'` |

  ```sql
  SELECT
      UPPER(name) AS upper_name,
      LENGTH(email) AS email_length,
      SPLIT_PART(email, '@', 2) AS domain   -- 以 @ 切開取第 2 段 = 網域
  FROM members;
  ```

#### 3. 日期與數字處理

- `EXTRACT` 從日期時間欄位取出指定部分：

  ```sql
  SELECT
      id,
      EXTRACT(YEAR FROM created_at) AS order_year,
      EXTRACT(MONTH FROM created_at) AS order_month
  FROM orders;
  ```

- `ROUND(col, n)` 四捨五入到 n 位小數：

  ```sql
  SELECT id, ROUND(amount, 0) AS rounded_amount FROM orders;
  -- 1250.75 → 1251
  ```

- `EXTRACT(EPOCH FROM ...)` 取兩個時間戳的**總秒數差**，除以 60 得分鐘數；`::int` 把結果轉整數：

  ```sql
  SELECT
      id,
      (EXTRACT(EPOCH FROM (paid_at - created_at)) / 60)::int AS minutes_to_pay
  FROM orders
  WHERE status = 'paid';   -- 只有已付款的訂單才有 paid_at
  ```

#### 4. CASE 條件式

- SQL 的 if-else，把欄位值轉成易讀標籤：

  ```sql
  SELECT
      id,
      CASE status
          WHEN 'paid'      THEN '已付款'
          WHEN 'pending'   THEN '待付款'
          WHEN 'cancelled' THEN '已取消'
          ELSE '未知'                     -- 全部不符合時的保底
      END AS status_label
  FROM orders;
  ```

- 依序比對 `WHEN`，符合就輸出對應的 `THEN` 值，都不符合走 `ELSE`。

### 七、GROUP BY 分組與聚合

#### 1. GROUP BY 的概念

- 報表常見的需求是「每個類別賣了多少」、「每位會員消費幾筆」這類**摘要**資料。
- `GROUP BY` 把相同欄位值的列合併成一組，聚合函數對每組各自計算，**每組只回傳一列**：

  ```sql
  -- 沒有 GROUP BY：回傳 7 列（每筆訂單一列）
  SELECT * FROM orders;

  -- 加上 GROUP BY：依 category 分組，回傳 3 列（每個類別一列）
  SELECT category, COUNT(*) AS order_count
  FROM orders
  GROUP BY category;
  ```

#### 2. 搭配聚合函數

  ```sql
  SELECT
      category,
      COUNT(*) AS order_count,
      SUM(amount) AS total_amount,
      AVG(amount) AS avg_amount
  FROM orders
  GROUP BY category;
  ```

:::note
`AVG` 預設可能有較多小數位，實務上建議搭配 `ROUND(AVG(col), 2)` 控制精度。
:::

#### 3. WHERE 與 HAVING 的差異

- `WHERE` 在分組**前**篩「資料列」，`HAVING` 在分組**後**篩「群組」，執行順序：

  ```sql
  WHERE → GROUP BY → HAVING → SELECT
  ```

  ```sql
  -- WHERE：先排除非 paid 的列，剩下的才分組加總（篩的是「列」）
  SELECT category, SUM(amount) AS paid_total
  FROM orders
  WHERE status = 'paid'
  GROUP BY category;

  -- HAVING：先分組統計，再丟掉筆數不足的群組（篩的是「組」）
  SELECT status, COUNT(*) AS order_count
  FROM orders
  GROUP BY status
  HAVING COUNT(*) >= 2;   -- pending 只有 1 筆，整組被篩掉
  ```

:::warning
聚合條件不能寫在 `WHERE`。`WHERE COUNT(*) >= 2` 會報錯，因為 `WHERE` 執行時還沒分組，根本沒有 `COUNT(*)` 可以比。凡是條件裡出現聚合函數（`COUNT`、`SUM`、`AVG`…），一律寫在 `HAVING`。
:::

### 八、子查詢

#### 1. 什麼是子查詢

- 有些查詢條件本身需要**另一段 SELECT 的結果**才算得出來，例如「找出金額等於最高金額的訂單」，最高金額要先查過才知道。
- 子查詢（Subquery）：括號內的 SELECT 先跑完，把結果交給外層使用：

  ```sql
  SELECT id, amount
  FROM orders
  WHERE amount = (SELECT MAX(amount) FROM orders);
  -- 內層先算出 3200.00，外層再用這個值篩選
  ```

#### 2. 放在 WHERE

- 最常見的用法，搭配 `IN`、`NOT IN` 或 `=`：

  ```sql
  -- IN：找出有下過訂單的會員
  SELECT name FROM members
  WHERE id IN (SELECT DISTINCT member_id FROM orders);

  -- NOT IN：找出從未下過訂單的會員
  SELECT name FROM members
  WHERE id NOT IN (SELECT DISTINCT member_id FROM orders);
  ```

:::warning
`= (SELECT ...)` 的子查詢必須只回傳「一個值」，若回傳多列會報錯；多值情境改用 `IN`。
:::

#### 3. 放在 SELECT

- 在欄位清單裡加子查詢，對每一列額外算出一個欄位：

  ```sql
  -- 每筆訂單金額，並附上全體平均金額
  SELECT
      id,
      amount,
      (SELECT ROUND(AVG(amount), 0) FROM orders) AS overall_avg
  FROM orders;
  -- 每列的 overall_avg 都是同一個值（整體平均）
  ```

- 子查詢對每一列各執行一次，所以只適合回傳單一值的場合。

#### 4. 放在 FROM：衍生表（Derived Table）

- 圖解

  ![衍生表](/img/sql03-1.png)

- 前面兩種子查詢回傳的是「一個值」或「一組值」。放在 `FROM` 的子查詢不一樣：它回傳的是**一整張表**（多列多欄），可以被外層當成一般資料表來 `JOIN`、篩選、再聚合。
- 依 PostgreSQL 官方文件，`FROM` 子句的資料來源不一定是實體資料表，也可以是子查詢、`JOIN` 結果，或這些的複雜組合；這種由子查詢臨時產生、供外層使用的表就叫**衍生表（derived table）**。

- **為什麼需要它**：`GROUP BY` 只能分組聚合一次，但有些需求要「先聚合、再對聚合結果做進一步處理」。例如「找出平均消費超過 1000 的會員姓名」，得先算出每人的平均（第一步聚合），再拿平均值去篩選並接上姓名（第二步）。單一層 SQL 做不到，就把第一步包成衍生表：

  ```sql
  SELECT m.name, t.avg_amount
  FROM members m
  JOIN (
      SELECT member_id, ROUND(AVG(amount), 0) AS avg_amount
      FROM orders
      GROUP BY member_id
  ) t ON m.id = t.member_id     -- t 是衍生表，可以像真的資料表一樣被 JOIN
  WHERE t.avg_amount > 1000;
  ```

  - 內層（衍生表 `t`）先算出每位會員的平均消費：

    | member_id | avg_amount |
    | --- | --- |
    | 1 | 2225 |
    | 2 | 830 |
    | 3 | 450 |
    | 4 | 2100 |

  - 外層再把 `t` 當一般資料表，`JOIN members` 補上姓名、用 `WHERE t.avg_amount > 1000` 篩掉平均不足的人：

    | name | avg_amount |
    | --- | --- |
    | Alice | 2225 |
    | Diana | 2100 |

  - Bob（830）與 Charlie（450）未超過 1000 被篩掉；Eve 沒有訂單，衍生表裡沒有她，`JOIN` 後也不會出現。

- **對聚合結果再聚合**：衍生表也能包一層聚合，讓外層再算一次。例如「每位會員的平均消費，全部平均起來是多少」：

  ```sql
  SELECT ROUND(AVG(avg_amount), 0) AS avg_of_avg
  FROM (
      SELECT member_id, AVG(amount) AS avg_amount
      FROM orders
      GROUP BY member_id
  ) t;                          -- 外層對衍生表的 avg_amount 再取一次平均
  ```

  - 這種「聚合的聚合」沒辦法只靠一層 `GROUP BY` 完成，必須先用衍生表把第一層結果固定下來。

:::warning
放在 `FROM` 的衍生表**必須加別名**（上例的 `t`），否則報錯。這是 PostgreSQL 的規定：官方文件說明，依 SQL 標準子查詢必須提供表別名；PostgreSQL 16 起才放寬為可省略，但仍建議一律加上，以維持相容性與可讀性。
:::

:::note
衍生表 vs. `WITH`（CTE）：把子查詢寫在 `FROM` 裡容易讓語句變長、巢狀變深。同樣的需求也可以用 `WITH 名稱 AS (...)`（Common Table Expression）先命名一段查詢，再於主查詢引用，通常更好讀。兩者概念相通，`WITH` 可視為「具名的衍生表」，屬後續進階主題。
:::


### 九、資料來源

- [Week 6：PostgreSQL 資料庫基礎概念 2](https://hackmd.io/@hexschool/r1HCjk8Nfe)
- [Day 22 - 資料表關聯：主鍵、外鍵與順著外鍵查詢](https://hackmd.io/0CcO2FaJQQW0iHTjl8KWKg?view)
- [Day 23 - JOIN 將拆分的資料表關聯起來](https://hackmd.io/@hex-course/HyF_ytIzfg)
- [Day 24 - 使用 PostgreSQL 函式將資料加工](https://hackmd.io/@hex-course/SyCGCYLMzg)
- [Day 25 - GROUP BY 分組與聚合](https://hackmd.io/@hex-course/B1qc97dGfl)
- [Day 26 - 子查詢：把一段 SELECT 放進另一段 SQL](https://hackmd.io/@hex-course/SyV-lEdfGg)
- [PostgreSQL 官方文件：7.2. Table Expressions（衍生表定義與別名規定）](https://www.postgresql.org/docs/current/queries-table-expressions.html)