---
title: Git｜遠端數據庫與分支
sidebar_position: 2
tags: [Git, GitHub, 知識點筆記]
date: 2026-07-14
slug: remote-and-branch
---

### 一、本地與遠端數據庫

#### 1. 這在解決什麼問題？

- [上一份筆記](./Git｜環境建置與基礎操作.md)的所有操作都發生在**自己的電腦**（本地數據庫，Local Repository）。但只存在本地有兩個風險：
    - 電腦壞掉，整個專案連同歷史紀錄一起陪葬。
    - 沒辦法跟別人協作。
- 所以需要一個放在雲端的**遠端數據庫（Remote Repository）**，本地與遠端透過推送（push）與拉取（pull）保持同步。

     ![Git遠端數據庫與分支](/img/git02-1.png)

:::note
**比喻**：本地 repo 是你電腦裡的 Word 檔，遠端 repo 是雲端硬碟上的備份。差別是 Git 同步的不只是檔案，而是**整包版本歷史**。
:::

#### 2. 常見的遠端託管服務

| 服務 | 特色 |
| --- | --- |
| **GitHub** | 最大宗、開源社群的中心，求職作品集首選 |
| **Bitbucket** | Atlassian 家的，跟 Jira / Sourcetree 整合佳，早期以免費私有 repo 聞名 |
| **GitLab** | 內建完整 CI/CD，企業常自架 |


### 二、git remote add：把本地接上遠端

- 情境：專案已經在本地 `git init` 並 commit 了一些版本，現在要推上 GitHub。
- **Step 1** 在 GitHub 上建立一個空的 repo（不要勾選 README，保持全空最單純）。
- **Step 2** 回到終端機，把遠端網址登記進本地 repo：

    ```bash
    git remote add origin https://github.com/帳號/repo名稱.git
    #              ↑遠端的代稱  ↑遠端的實際網址

    git remote -v   # 確認登記結果，會列出 fetch / push 兩行
    ```

:::note
**origin 是什麼？**：只是遠端網址的**代稱（暱稱）**，因為每次都打完整網址太痛苦。它是慣例上的預設名字，不是保留字，你要取名叫 `github` 也行，但別跟慣例作對。
:::

- **Step 3** 第一次推送：

    ```bash
    git push -u origin main
    # -u（--set-upstream）：記住「main 對應 origin/main」這組關係
    # 之後只要打 git push / git pull 就好，不用再寫全名
    ```

:::warning
**master vs main 的斷層**<br/>
本地 `git init` 出來的預設分支名稱目前**仍然是 `master`**（要等 Git 3.0 才會改成 `main`），但 GitHub 從 2020 年起預設就是 `main`，所以新手常遇到「本地是 master、遠端是 main，push 對不起來」。一勞永逸的解法是設定一次：

```bash
git config --global init.defaultBranch main   # 之後 init 都直接用 main
git branch -m master main                     # 已經 init 成 master 的專案，改名補救
```
:::

:::note
**第一次 push 會要求認證**<br/>
GitHub 從 2021 年起**不接受用帳號密碼**做 HTTPS 推送。第一次 push 時會跳出認證流程，現在的標準做法是 **Git Credential Manager** 開瀏覽器授權登入（Git for Windows 內建，授權一次就記住）；替代方案是 Personal Access Token（PAT）或 SSH 金鑰。卡在密碼輸入不過的話，幾乎都是這個原因。
:::


### 三、git clone：clone遠端數據庫

#### 1. 跟 remote add 差在哪？

- 兩個指令是**相反方向**的起手式：

    | 情境 | 用哪個 |
    | --- | --- |
    | 專案**先存在本地**，要推上雲端 | `git init` → `git remote add` → `git push` |
    | 專案**先存在遠端**（接手別人專案、換電腦） | `git clone` 一行搞定 |

- clone 的用法：

    ```bash
    git clone https://github.com/帳號/repo名稱.git
    ```

- `clone` 會自動做完三件事：下載完整專案與**全部歷史紀錄**、自動設定好 `origin`、自動建立追蹤關係。所以 clone 下來的專案可以直接 push / pull，不需要再 remote add。

:::note
Clone ≠ 下載 ZIP。GitHub 頁面上的「Download ZIP」只有**檔案**，沒有 `.git`，等於失憶版專案；clone 拿到的是完整的數據庫。
:::

### 四、git push 與 git pull：同步的日常

#### 1. push：把本地版本推上遠端

- 建立好追蹤關係後，一行搞定：

    ```bash
    git push          # 把本地 commit 推上 origin
    ```

#### 2. pull：把遠端更新拉下來

- 反方向同理：

    ```bash
    git pull          # 抓取遠端的新 commit 並合併進本地
    ```

- `git pull` 實際上是兩個動作的合體：`git fetch`（下載）＋ `git merge`（合併）。

#### 3. 協作的黃金習慣

- **push 被拒絕（rejected）怎麼辦？**
    - 當**遠端有你本地沒有的 commit**（例如隊友先推了），你的 push 會被拒絕。解法固定是先 `git pull` 把遠端的新東西拉下來合併，再 `git push`。
    - **口訣：**「先拉再推」。每天開工先 `git pull`，下班前 `git push`，衝突機率會小很多。


### 五、分支（Branch）與 HEAD

#### 1. 這在解決什麼問題？

- 情境：網站已經上線，你正在開發新功能寫到一半，這時線上突然發現緊急 bug。如果只有一條版本線，你會被卡死，因為新功能寫一半不能 commit 上去，bug 又不能不修。
- **分支**讓你從某個版本「開一條平行世界」：新功能在 `feature` 分支慢慢做，bug 在另一條分支修完先上線，兩邊互不干擾，最後再合併。

#### 2. HEAD 是什麼？

- `HEAD` 是一個指標，代表「**你現在站在哪個版本上**」。平常 HEAD 跟著分支走，分支又指向最新的 commit：

     ![GitHEAD](/img/git02-2.png)

#### 3. git checkout：移動 HEAD

- 基本用法：

    ```bash
    git checkout <commit編號>   # 把 HEAD 移到某個歷史版本（時光機）
    git checkout main           # 回到 main 分支的最新狀態
    ```


#### 4. detached HEAD（斷頭狀態）
- 直接 checkout 到某個 commit 編號時，HEAD 脫離了分支，Git 會警告 `detached HEAD`。這個狀態下適合「純觀光」看看舊版本長怎樣；如果在這裡 commit，切走之後那些 commit 會變成孤兒。想從舊版本繼續開發，正確做法是**從那裡開一條新分支**。

  ![GitHEAD](/img/git02-6.png)

  ![GitHEAD](/img/git02-7.png)



### 六、git branch：建立分支

- 常用指令：

     ![建立分支](/img/git02-3.png)

- Git 的分支只是一個**指向某個 commit 的指標**（一個 40 字元的參照），不是複製整份專案。所以開分支幾乎零成本，該開就開。

- **`git switch`：`git checkout` 的現代分身**
    - Git 2.23 之後把 `checkout` 的兩個職責拆開：切分支用 `git switch`、還原檔案用 `git restore`
    - 對照：
        - `git switch feature-login` = `git checkout feature-login`
        - `git switch -c feature-login` = `git checkout -b feature-login`
    - 本筆記以 checkout 為主，但看到 switch 要知道是同一件事。

- **分支命名慣例**
    - `feature/login` 開發新功能、`fix/cart-quantity` 修 bug；主分支 `main` 保持隨時可上線的乾淨狀態，**不要直接在 main 上開發**。


### 七、git merge：分支合併

#### 1. 基本觀念

- 合併的方向很重要：**先站到要「留下來」的分支上，再把別的分支合進來**。

    ```bash
    git checkout main          # 先回到 main
    git merge feature-login    # 把 feature-login 的成果合併進 main
    ```

:::note
**口訣**<br/>
**「站在家門口，把人迎進來。」** merge 後面接的是「被合併進來」的分支。
:::

#### 2. 快轉模式（Fast-forward）

- 如果開了分支之後，**main 完全沒有新 commit**，歷史長這樣：

    ```
    C1 ── C2 ── C3 ── C4   ← feature
           ↑
          main
    ```

- 此時合併不需要「合」任何東西，Git 只要把 `main` 的指標**往前快轉**到 C4 就完成了，不會產生新的 commit：

   ![](/img/git02-4.png)

#### 3. 非快轉模式（三方合併）

   ![Git分支合併](/img/git02-5.png)

:::note
快轉 vs 非快轉不用背，判斷標準只有一個：**分岔了沒？** 沒分岔就快轉，分岔了就產生 merge commit。
:::

#### 4. 合併後的收尾

- 合併完成後刪除分支，保持整潔：

    ```bash
    git branch -d feature-login
    # -d 只刪得掉「已合併」的分支；-D 強制刪除（未合併也砍，慎用）
    ```


### 八、分支情境演練

- 完整走一次日常開發流程：

    ```bash
    # 1. 從 main 開新分支做功能
    git checkout main
    git pull                          # 確保 main 是最新的
    git checkout -b feature/navbar

    # 2. 開發、提交（可以多個 commit）
    git add .
    git commit -m "新增導覽列結構"
    git add .
    git commit -m "新增導覽列 RWD 樣式"

    # 3. 功能完成，合併回 main
    git checkout main
    git merge feature/navbar

    # 4. 收尾
    git branch -d feature/navbar
    git push
    ```

:::note
這套「**開分支 → 開發 → 合併 → 刪分支**」的循環就是日常肌肉記憶。
:::


### 九、參考資源

- [本地與遠端數據庫簡介（六角學院）](https://w3c.hexschool.com/git/f9b1882c)
- [git remote add - 添加遠端數據庫](https://w3c.hexschool.com/git/fd426d5a)
- [Bitbucket 服務介紹](https://w3c.hexschool.com/git/5cd94b2c)
- [git clone - 克隆遠端數據庫](https://w3c.hexschool.com/git/6bc20f81)
- [git push - 推送](https://w3c.hexschool.com/git/7b64aa34)
- [git pull - 下載同步更新](https://w3c.hexschool.com/git/3a1a8767)
- [git checkout 移動 HEAD 指標](https://w3c.hexschool.com/git/9a164fbe)
- [分支建立（git branch）](https://w3c.hexschool.com/git/a8ee6eee)
- [分支合併（git merge）](https://w3c.hexschool.com/git/450914e9)
- [分支合併（快轉模式）](https://w3c.hexschool.com/git/cad9887)
- [分支合併（非快轉模式）](https://w3c.hexschool.com/git/4ac1e4e1)
- [分支情境演練](https://w3c.hexschool.com/git/2746fbf9)