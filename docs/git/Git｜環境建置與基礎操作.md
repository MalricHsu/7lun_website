---
title: Git｜環境建置與基礎操作
sidebar_position: 1
tags: [Git, 版本控制, 知識點筆記]
date: 2026-07-13
slug: basics
---

### 一、什麼是 Git？什麼是版本控制？

#### 1. 沒有版本控制的世界

- 寫專案時最常見的災難現場：

    ![沒有版本控制](/img/git01-1.png)

- 這種土法煉鋼的備份方式有三個致命問題：
    - **不知道每個版本改了什麼**：檔名只能寫日期，看不出「這版修了什麼 bug」。
    - **無法還原到某個精確時間點**：只能靠人腦記憶去翻檔案。
    - **多人協作直接崩潰**：兩個人同時改同一份檔案，最後只能手動比對合併。

#### 2. Git 的解法

- Git 是一套**分散式版本控制系統（Distributed Version Control System）**，它把每一次的變更記錄成一個「版本（commit）」，讓你可以：
    - 查看每個版本改了什麼、誰改的、什麼時候改的
    - 隨時切換回任何一個歷史版本
    - 多人平行開發，最後再合併

:::note
**比喻：Git 就像遊戲存檔**<br/>
打魔王前先存檔，打輸了讀檔重來。commit 就是存檔點，隨時可以回到任何一個存檔繼續玩。差別在於 Git 的存檔點可以無限多個，而且每個存檔都有留言註記。
:::

- 「分散式」的意思是：每個開發者的電腦上都有**完整的版本歷史**，不像早期的 SVN 要連上中央伺服器才能運作。斷網也能 commit，這是 Git 的一大優勢。


### 二、安裝 Git

#### Step 1：確認是否已安裝 Git

- 先開啟終端機：

    - **Windows**：Git Bash、PowerShell 或命令提示字元（CMD）
    - **Mac**：Terminal

- 輸入：

    ```bash
    git --version
    ```

- 如果看到類似以下結果，就代表已安裝完成，可以直接跳到下一章。

    ```bash
    git version 2.x.x
    ```

- 如果出現找不到 `git` 的訊息，再依照下面步驟安裝。


#### Step 2：安裝 Git

##### Windows

- 推薦使用 **winget**（Windows 內建套件管理工具），一行指令即可安裝最新版 Git。

    ```bash
    winget install --id Git.Git -e --source winget
    ```

- 如果不想使用指令，也可以到 Git 官方網站下載安裝程式。

>  下載完成後一路按 **Next**，使用預設設定即可。

- 安裝完成後，系統會一併安裝 **Git Bash**，建議之後都使用 Git Bash 執行 Git 指令，與 Mac、Linux 的操作方式一致。


##### Mac

- 如果剛剛執行 `git --version` 時沒有安裝 Git，可以選擇以下任一方式。

- **方式一：安裝 Xcode Command Line Tools（推薦）**

    ```bash
    xcode-select --install
    ```

- 系統會跳出安裝視窗，依照提示完成即可。

- **方式二：使用 Homebrew 安裝**

    ```bash
    brew install git
    ```

#### Step 3：確認安裝成功

- 安裝完成後，再次輸入：

    ```bash
    git --version
    ```

- 如果看到版本號，例如：

    ```bash
    git version 2.52.0
    ```

- 就代表 Git 已成功安裝。

:::tip

**Windows：使用 Git Bash**
**Mac：使用 Terminal**

之後所有 Git 指令都可以直接照著操作，兩個平台幾乎沒有差異。
:::

### 三、終端機基本操作

- Git 指令都在終端機裡下，所以要先會「用指令移動位置」。
- 先講前提：**Git 指令本身跨平台完全相同**，但下面這些「終端機指令」是 Unix 系指令，本表以 **Windows 用 Git Bash、Mac 用 Terminal** 為前提，這樣兩邊的操作才會完全一致。

    ![終端機基本操作](/img/git01-2.png)

:::note
**1. 如果你用的是 PowerShell 或 CMD**<br/>
- PowerShell 大部分能通（`ls`、`cd`、`pwd`、`mkdir`、`clear` 都有內建別名），但 `touch` 沒有；傳統 CMD 差最多：`ls` 要改 `dir`、`clear` 要改 `cls`、`pwd` 和 `touch` 都沒有對應指令。這就是筆記建議 Windows 一律用 **Git Bash** 的原因：跟 Mac / Linux 的指令習慣完全一致，教學文件也不用兩套記法。

**2. 口訣**<br/>
- **pwd 問我在哪、ls 看有什麼、cd 移動腳步。** 迷路了就先 `pwd` 再 `ls`，永遠找得到路。

**3. 小技巧**<br/>
- 打指令時按 **Tab** 可以自動補完檔名 / 資料夾名；按 **↑** 可以叫出上一個指令，不用重打。
:::


### 四、git config：設定姓名與 Email

#### 1. 設定原因

- 每一個 commit 都會記錄「**是誰做的**」。Git 靠的就是你設定的姓名和 Email，沒設定的話第一次 commit 會直接報錯。

#### 2. 設定方式

- 用 `--global` 讓這台電腦上所有專案共用同一組設定：

    ![設定 git 姓名與信箱](/img/git01-3.png)

:::warning
Email 建議填**跟 GitHub 帳號相同的信箱**，這樣推上 GitHub 後，commit 紀錄才會正確連結到你的帳號頭像與貢獻牆（綠格子）。
:::

- 如果某個專案想用不同身分（例如公司專案用公司信箱），在那個專案資料夾內把 `--global` 拿掉即可，區域設定會覆蓋全域設定：

    ```bash
    git config user.email "company@example.com"  # 只影響目前這個專案
    ```


### 五、git init：建立數據庫

#### 1. 這在做什麼？

- `git init` 會在目前資料夾底下建立一個隱藏的 `.git` 資料夾，**所有版本紀錄都存在裡面**。從這一刻起，這個資料夾就是一個「Git 數據庫（repository，常簡稱 repo）」。
 
   ![建立git數據庫](/img/git01-4.png)

:::warning
- 千萬**不要手動刪改 `.git` 資料夾**，刪掉等於整個版本歷史直接蒸發。
- `git init` **一個專案只需要做一次**，不要在已經是 repo 的資料夾裡再 init 一次，更不要在 repo 裡面又包一層 repo。
:::


### 六、git add、git commit：提交版本

#### 1. 先搞懂三個區域

- 這是 Git 最核心的心智模型，後面所有指令都建立在這上面：

    ![Git的三個區域](/img/git01-7.png)

:::note
**比喻：超商寄包裹**<br/>
- **工作目錄**＝你家，東西隨便放、隨便改。
- **暫存區**＝打包好的紙箱，決定「這次要寄哪些東西」。
- **commit**＝把箱子交給店員，貼上單號正式寄出，從此有紀錄可查。
- **口訣：`git add` 是裝箱，`git commit` 是寄出。**
:::

#### 2. 實際操作

- 日常最常用的一組指令：

  ![Commit 流程圖](/img/git01-5.png)

#### 3. commit 訊息怎麼寫？

- commit 訊息是寫給**三個月後的自己**和隊友看的，原則：

    ![Commit 訊息](/img/git01-6.png)

:::note
養成習慣：**一個 commit 只做一件事**。「新增登入頁」和「修正頁尾連結」拆成兩個 commit，之後要還原或追查問題才有辦法精準定位。
:::



### 七、Git 檔案追蹤機制

#### 1. 檔案的四種狀態

- `git status` 看到的訊息，其實就是在告訴你檔案處於哪個狀態：

| 狀態 | 意思 | git status 顯示 |
| --- | --- | --- |
| Untracked | 新檔案，Git 還不認識它 | `Untracked files`（紅字） |
| Modified | 已追蹤的檔案被修改了 | `Changes not staged`（紅字） |
| Staged | 已加入暫存區，等待 commit | `Changes to be committed`（綠字） |
| Committed | 已提交進數據庫 | `nothing to commit, working tree clean` |

- 流程走一遍：

     ![狀態轉換流程圖](/img/git01-8.png)

:::note
**口訣**：**紅字代表 Git 在等你 add，綠字代表在等你 commit。** 看顏色就知道下一步。
:::

#### 2. .gitignore：叫 Git 忽略某些檔案

- 有些東西**不該**進版本控制：套件資料夾、環境變數、系統雜物。在專案根目錄建立 `.gitignore`：

    ![gitignore](/img/git01-9.png)

:::warning
`.gitignore` 只對「**還沒被追蹤**」的檔案有效。如果 `node_modules` 已經不小心 commit 過了，要先 `git rm -r --cached node_modules` 解除追蹤，再 commit 一次才會生效。
:::



### 八、Sourcetree：圖形化介面工具

- Sourcetree 是 Atlassian 出的免費 GUI 工具，把指令變成按鈕與圖表：
    - **File status**：等同 `git status` + `git add`，用勾選的方式暫存檔案。
    - **History**：等同 `git log`，用視覺化線圖看分支與版本演進。
    - Commit、Push、Pull 都有對應按鈕。



### 九、GitHub Pages：把靜態網站放上線

#### 1. 這在解決什麼問題？

- 切好的版面想給別人看，總不能叫對方來你電腦看。GitHub Pages 提供**免費的靜態網站託管**，把 repo 裡的 HTML/CSS/JS 直接變成一個可公開瀏覽的網址。

#### 2. 設定流程

- 步驟：
    - 把專案推上 GitHub。
    - 進入 repo 的 **Settings → Pages**。
    - **Source** 選擇分支（通常是 `main`）與目錄（通常是 `/root`），按 Save。
    - 等待約 1～2 分鐘，網址格式為：

    ```
    https://<帳號名稱>.github.io/<repo名稱>/
    ```

:::warning
**常見雷點**<br/>
- 首頁檔名必須是 **`index.html`**，且建議放在根目錄；HTML 內的資源路徑用**相對路徑**（`./css/style.css`），用絕對路徑（`/css/style.css`）上線後會因為多了一層 repo 名稱而全部 404。
:::



### 十、參考資源

- [Git 是什麼？版本控制是什麼？（六角學院）](https://w3c.hexschool.com/git/bda25014)
- [在 Windows 上安裝 Git 流程](https://w3c.hexschool.com/git/3f9497cd)
- [在 Mac 上安裝 Git 流程](https://w3c.hexschool.com/git/fd6f6be)
- [終端機操作分享](https://w3c.hexschool.com/git/8dc4619b)
- [config 設定姓名、Email](https://w3c.hexschool.com/git/8a39ab5)
- [git init - 建立數據庫](https://w3c.hexschool.com/git/7ca21e02)
- [git add、git commit - 提交版本](https://w3c.hexschool.com/git/b9be5b1e)
- [git 檔案追蹤機制](https://w3c.hexschool.com/git/3236f0ec)
- [Sourcetree 軟體操作教學](https://w3c.hexschool.com/git/7b1d0997)
- [GitHub Pages - 建立靜態網站](https://w3c.hexschool.com/git/21756c99)