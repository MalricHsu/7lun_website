---
title: Git｜衝突處理、版本還原與多人協作
sidebar_position: 3
tags: [Git, GitHub, 知識點筆記]
date: 2026-07-15
slug: conflict-reset-collaboration
---

### 一、衝突（Conflict）是什麼？

#### 1. 這在解決什麼問題？

- merge 大多時候 Git 會自動合併成功，但有一種情況它無能為力：**兩條分支改了同一個檔案的同一個地方**。Git 不知道該聽誰的，於是把決定權丟回給你——這就是衝突。

- 衝突不是壞掉、不是錯誤，是 Git 在說：「這兩段我不敢幫你選，你自己挑。」**衝突是協作的日常，不用怕它。**


#### 2. 衝突長什麼樣子

- 發生衝突時，Git 會把兩邊的內容都寫進檔案，用標記包起來：

    ```html
    <<<<<<< HEAD
    <h1>歡迎光臨我的網站</h1>
    =======
    <h1>Welcome to My Website</h1>
    >>>>>>> feature/en-title
    ```

- 標記的意思：

    | 標記 | 意思 |
    | --- | --- |
    | `<<<<<<< HEAD` 到 `=======` | **你目前所在分支**的版本 |
    | `=======` 到 `>>>>>>>` | **被合併進來那條分支**的版本 |


### 二、本地分支衝突處理

- 解衝突的流程固定四步：

     ![衝突](/img/git03-1.png)

- 常見雷點：
    - 解決衝突後，記得確認 `<<<<<<< HEAD`、`=======`、`>>>>>>>` 等衝突標記是否已經全部刪除。若未清理乾淨就直接 commit，這些標記可能會原封不動地出現在程式碼，甚至顯示在網頁上。
    - VS Code 會在衝突區塊上方提供 Accept Current Change、Accept Incoming Change、Accept Both Changes 等選項，雖然可以快速處理衝突，但點選前仍要先確認兩邊程式碼的差異與保留內容，不要在不了解影響的情況下直接全選其中一邊。
    - 如果衝突處理到一半，發現想重新進行合併，可以執行：`git merge --abort`

### 三、遠端協作分支衝突

- 多人協作最常見的劇本：你和隊友都改了 `index.html`，隊友先推上去了。

    ```bash
    git push
    # ! [rejected]  main -> main (fetch first)
    # push 被拒絕：遠端有你沒有的 commit

    git pull
    # CONFLICT (content): Merge conflict in index.html
    # pull 把遠端的 commit 拉下來合併時，撞到你本地的修改 → 衝突
    ```

- 接下來的解法**跟本地衝突一模一樣**：開檔案 → 挑內容 → 刪標記 → `add` → `commit` → 最後 `git push` 推上去。


- **降低衝突機率的習慣**：開工前先 `git pull` 讓本地保持最新；commit 小顆一點、push 勤快一點，累積越久炸越大；分工時盡量避免兩個人長時間改同一支檔案。


### 四、還原檔案：git checkout、git clean

#### 1. 丟棄已追蹤檔案的修改

- 情境：改了半天發現越改越爛，想讓檔案回到上次 commit 的樣子。

    ```bash
    git checkout -- index.html   # 丟棄 index.html 的修改
    git checkout -- .            # 丟棄所有已追蹤檔案的修改
    ```
- 這個動作**沒有後悔藥**。被丟棄的修改從來沒進過 Git，reflog 也救不回來，執行前務必確認。


:::note
新版 Git 提供語意更清楚的 `git restore index.html`，效果相同。`checkout` 身兼「切分支」和「還原檔案」兩職，`--` 就是用來告訴 Git「後面接的是檔案不是分支」。
:::

#### 2. 清除未追蹤的檔案：git clean

- `checkout` 管不到 Untracked 的新檔案，要用 `clean`：

    ```bash
    git clean -n   # dry run：先「預覽」會刪掉哪些檔案（必做！）
    git clean -f   # 真的刪除未追蹤檔案
    git clean -fd  # 連未追蹤的資料夾一起刪
    ```


- **口訣**：**改壞的用 checkout 丟、多餘的用 clean 掃。** clean 之前一定先 `-n` 看一眼。
 

### 五、git reset：還原版本

#### 1. 這在解決什麼問題？

- commit 已經送出去了才發現：訊息打錯、檔案 add 錯、或整個方向做錯，想把版本退回去。

    ```bash
    git reset HEAD^          # 退回上一個版本（^ 代表往前一個）
    git reset HEAD~3         # 退回三個版本前
    git reset <commit編號>    # 退回指定版本
    ```

#### 2. 三種模式的差別

- reset 退版本時，那些「被退掉的 commit 的變更內容」要何去何從？三種模式差在這裡：

    | 模式 | 退掉的變更去哪了 | 使用情境 |
    | --- | --- | --- |
    | `--soft` | 保留在**暫存區**（綠字） | 只想重打 commit 訊息、合併幾個小 commit |
    | `--mixed`（預設） | 保留在**工作目錄**（紅字） | 想重新整理要 add 哪些檔案 |
    | `--hard` | **直接蒸發** | 整段不要了，砍掉重練 |

:::note
**比喻：把寄出的包裹追回來**<br/>
- `--soft` 是包裹追回，但**還裝在箱子裡**（暫存區），重貼標籤就能再寄；`--mixed` 是包裹追回並**拆箱**，東西散回你家（工作目錄），重新整理再裝；`--hard` 是包裹追回**直接銷毀**，東西沒了。
- 口訣：**soft 留箱、mixed 拆箱、hard 燒箱。**
:::

- 最常見的實戰：上一個 commit 訊息打錯。

    ```bash
    git reset --soft HEAD^
    git commit -m "正確的訊息"
    ```

:::warning
- 已經 push 出去的 commit **不要用 reset 退**。你本地退了，遠端還在，隊友的歷史會跟你打架。公開歷史要撤銷，改用 `git revert`（產生一個「反向 commit」來抵銷，不竄改歷史）。
- **reset 修自己的草稿，revert 撤公開的紀錄。**
:::

### 六、git reflog：還原大招

#### 1. 這在解決什麼問題？

- Git 有一本秘密日記 `reflog`，記錄 **HEAD 的每一次移動**（commit、checkout、reset、merge 全都記）。所謂「消失」的 commit 其實還在數據庫裡，只是沒有指標指著它。

    ```bash
    git reflog
    # a1b2c3d HEAD@{0}: reset: moving to HEAD~3   ← 剛剛的手滑
    # f4e5d6c HEAD@{1}: commit: 完成購物車功能     ← 想救回來的版本

    git reset --hard f4e5d6c   # 直接跳回那個版本，救回來了
    ```

#### 2. reflog 的限制

- reflog 只存在於本機，記錄的是這台電腦上 HEAD 與各分支指標的移動紀錄，不會隨著 clone、push 或 pull 傳到其他電腦。

- 這些紀錄也不會永久保留。一般情況下，reflog 會在一段時間後過期並由 Git 清理，常見預設約為 90 天，因此它比較像暫時的救援紀錄，而不是長期備份。

- 另外，reflog 只能找回曾經建立過 commit 的內容。若修改從未 commit，就被 git checkout --、git restore 或 git clean 清除，通常很難再救回。

- 所以 reflog 是急救工具，不是備份機制；而「勤 commit」的真正意義，就是替每個重要進度留下可追溯、可還原的節點。


### 七、GitHub Flow：多人協作與 Pull Request

#### 1. 這在解決什麼問題？

- 前面學的 merge 是「自己合自己的」。團隊協作時不能大家都直接往 main 塞 commit，沒人審核、品質失控。**GitHub Flow** 是一套極簡的協作規則，核心精神只有一句話：

> **main 永遠保持可部署的狀態，所有變更都透過 Pull Request 進入 main。**

#### 2. 什麼是 Pull Request（PR）？

- PR 字面意思是「**請求對方把我的分支拉（合併）進去**」。它不只是合併按鈕，更是一個**審核與討論的頁面**：改了哪些檔案、diff 一覽無遺、隊友可以逐行留言、要求修改、最後批准合併。

#### 3. GitHub Flow 完整流程

    ![gitflow](/img/git03-2.png)


- **PR 的目的**：改動範圍小、審起來快，PR 描述寫清楚「動機」，不要只寫「更新程式碼」；被要求修改不是被打槍，是團隊在幫你的程式碼品質把關。


### 參考資源

- [本地分支衝突（六角學院）](https://w3c.hexschool.com/git/921e90ff)
- [遠端協作分支衝突](https://w3c.hexschool.com/git/b0c9a9a4)
- [git checkout、git clean - 還原檔案](https://w3c.hexschool.com/git/1b44e53)
- [git reset - 還原版本](https://w3c.hexschool.com/git/dba36bc5)
- [git reset - 影片教學](https://w3c.hexschool.com/git/b5a740c8)
- [git reflog - 還原大招](https://w3c.hexschool.com/git/10bf7677)
- [GitHub Flow 介紹](https://w3c.hexschool.com/git/cad4551b)
- [GitHub Flow 線上實際演練](https://w3c.hexschool.com/git/bcce3d47)