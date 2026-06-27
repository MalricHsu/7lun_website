---
slug: deployChoose
title: 從架構底層看懂四大部署平台
authors: [7lun]
tags: [GitHub Pages, Vercel, Render, Cloudflare Pages]
date: 2026-04-08
---
### 前言

第一次部署網站時，我查了很多教學，幾乎都推薦用 GitHub Pages。但真正開始部署自己的專案後，才發現一個問題：不同專案適合的平台其實不一樣，卻很少有人解釋背後的原因。

後來深入了解才知道，這四個平台本來就是為了不同的使用情境而設計。它們底層的架構不同，也直接影響能提供的功能、適合的專案類型，以及後續可能遇到的成本與限制。

這篇文章會從平台架構開始介紹，整理四個平台的差異、各自的優缺點，以及實際部署時常遇到的限制與成本考量。另外，也會補充一些部署過程中常見但不容易理解的專有名詞，希望能幫助你在選擇平台時，更清楚知道哪一個才適合自己的專案。

{/* truncate */}

#### 本文涵蓋：
- 各平台底層架構與技術選型
- 隱藏限制與成本引爆點
- 專有名詞白話解析（CDN、Serverless、Cold Start、Edge Function 等）
- 選平台情境對照表


### 一、GitHub Pages：最單純，但也最受限

#### 底層在做什麼

GitHub Pages 背後是依賴 Fastly 這類 CDN 服務來分發靜態檔案。過去它高度綁定 Jekyll 這個靜態網站產生器，但現在已經全面轉向整合 **GitHub Actions**。

這代表：只要你能寫出正確的 Action 腳本，任何框架（React、Vue）都能打包後部署上去。但這也是它最大的限制，你能部署上去的，**只有打包後的靜態檔案**，完全沒有資料庫或後端運算能力。

#### CI/CD 體驗

CI/CD 部分完全依賴 GitHub Actions，優點是高度客製化；缺點是沒有像 Vercel 那種「開箱即用」的 PR 預覽環境。你需要自己寫腳本，甚至搭配其他工具才能實現。

#### 隱藏限制

- **流量限制**：每月有 100GB 的頻寬軟限制（Soft Limit），超過雖然不一定立刻停用，但會收到警告。
- **開源限制**：免費帳號的 Repo **必須是 Public**，才能免費使用 GitHub Pages。若要部署私有庫，需要升級 GitHub Pro 或 Team 方案。

#### 適合用在

個人履歷、開源專案說明文件、靜態部落格。

> 參考：[GitHub Pages 官方文件](https://docs.github.com/en/pages) ／ [使用量與限制](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#usage-limits)


### 二、Vercel：開發體驗業界標竿，但商用成本要算清楚

#### 底層在做什麼

Vercel 本質上是建立在 AWS 和 Cloudflare 之上的「高級封裝」。它把你的前端專案拆解成三個部分：

- 靜態資源 → 丟上全球 CDN
- API 路由 → 轉換成 AWS Lambda（Serverless）
- Middleware → 轉換成 Edge Functions（邊緣運算）

理解這件事很重要。Vercel 並不是「幫你租一台伺服器」，而是把你的程式碼轉譯成不同形式，分散部署在各種雲端基礎設施上。

#### CI/CD 體驗

這是 Vercel 最強的地方。只要發布一個 PR，Vercel 幾秒內就會生成一個獨立的預覽網址，甚至支援團隊直接在預覽頁面上留言（Comment on Preview）。對於需要讓 PM 或設計師 review 畫面的團隊來說，這個功能幾乎沒有替代品。

#### 隱藏成本

- **冷啟動（Cold Start）**：因為 Serverless 的特性，API 一段時間沒被呼叫就會進入「休眠」。下次有人呼叫時，需要幾百毫秒到幾秒的「重新開機」時間。對於要求超低延遲的場景，這是個大問題。
- **團隊席位費極貴**：免費版（Hobby）只限個人非商業用途。一旦升級 Pro（商用），每個團隊成員每月 **$20 USD**。人數多起來，費用會很快超出預期。
- **附加服務費**：圖片最佳化（Image Optimization）、頻寬超標費用在流量暴增時非常可觀。

#### 適合用在

Next.js / React 專案、需要極速全球 CDN 與絕佳 SEO 的電商前端。

> 參考：[Vercel 官方文件](https://vercel.com/docs) ／ [方案與定價](https://vercel.com/pricing) ／ [Serverless Functions](https://vercel.com/docs/functions/serverless-functions) ／ [Edge Functions](https://vercel.com/docs/functions/edge-functions)


### 三、Render：最接近「自己租主機」的現代替代方案

#### 底層在做什麼

Render 主要託管在 AWS 和 GCP 上，但和 Vercel 的「無伺服器」方向完全不同，走的是**容器化（Container-native）** 架構。

你只要提供一個 `Dockerfile`，Render 就幫你建立成一個**常駐執行的容器**。這個差異很關鍵——常駐容器代表可以：

- 跑長連線（WebSocket、遊戲伺服器）
- 執行背景任務（Background Workers）
- 保持連線到資料庫，不需要每次請求都重新建立

同時 Render 也支援微服務架構，你可以建立內部 API 伺服器與資料庫，它們透過 Render 的私有網路溝通，完全不暴露在公開網際網路上。

#### 隱藏限制

- **免費版會「睡覺」**：免費的 Web Service 只要閒置 15 分鐘就會休眠，下次有人訪問時，喚醒時間可能長達 **30 秒到 1 分鐘**。對使用者體驗影響極大。有些開發者會寫腳本每 10 分鐘 Ping 它一次防止休眠，但這有違規風險。
- **編譯時間限制**：免費方案每月只有 **500 分鐘的 Build 時間**，對大型專案來說容易耗盡。

#### 適合用在

全端應用程式、需要連接資料庫的 API 伺服器、爬蟲程式、Discord 機器人。

> 參考：[Render 官方文件](https://render.com/docs) ／ [免費方案限制](https://render.com/docs/free#free-web-services) ／ [PostgreSQL 資料庫](https://render.com/docs/databases)


### 四、Cloudflare Pages：頻寬無上限，但底層完全不一樣

#### 底層在做什麼

Cloudflare Pages 不是部署在某個雲端廠商的機器上，而是**直接部署在 Cloudflare 遍布全球 300 多個城市的邊緣節點**上。

更關鍵的是，它的 Pages Functions 底層不是傳統的 Node.js 容器，也不是 AWS Lambda，而是基於 **V8 Isolates** 引擎。

這個技術選型帶來一個其他平台都比不上的優勢：**幾乎 0ms 的冷啟動時間**。V8 Isolates 是 Chrome 瀏覽器用來跑 JavaScript 的超快引擎，啟動速度極快，完全沒有傳統 Serverless 的冷啟動問題。

#### 隱藏限制

這個架構最大的痛點是 **Node.js 相容性問題**。因為底層是 V8 Isolates 而不是標準的 Node.js 環境，某些依賴 Node.js 原生模組（如 `fs`、`path`、特定加密庫）的後端套件無法直接運行，需要尋找替代方案或使用 Polyfill。

另外，免費版的函數 CPU 運算時間限制在 **10ms 以內**（付費版為 50ms）。這代表你不能在邊緣節點做太複雜的資料處理，只適合輕量的 API 轉發或資料庫讀寫。

#### 適合用在

高流量靜態網站、極度重視載入速度與安全性的全球化專案。

> 參考：[Cloudflare Pages 官方文件](https://developers.cloudflare.com/pages/) ／ [Pages Functions](https://developers.cloudflare.com/pages/functions/) ／ [V8 Isolates 原理](https://developers.cloudflare.com/workers/reference/how-workers-works/)


### 五、進階規格比較表

| 比較維度 | GitHub Pages | Vercel | Render | Cloudflare Pages |
|---|---|---|---|---|
| **底層運行環境** | 靜態 CDN | Serverless + Edge | Container（Docker 常駐容器） | Edge（V8 Isolates 邊緣運算） |
| **後端 / API 支援** | 完全不支援 |  Serverless / 邊緣函數 |  支援完整後端常駐伺服器 | 邊緣函數（Workers） |
| **WebSocket / 長連線** |  不支援 |  不支援 |  完美支援 |  不支援 |
| **冷啟動延遲** | 無（純靜態） | 中等（約 0.5s～2s） | 嚴重（免費版喚醒需 30s+） | **極低（0ms）** |
| **資安與防禦** | 基礎保護 | 良好（內建基礎 WAF） | 良好 | **頂級（企業級 WAF 與 DDoS 防護）** |
| **商用成本引爆點** | 幾乎沒有 | 團隊人數增加、附加功能用量 | 伺服器規格升級（RAM / CPU） | 複雜運算需轉移架構 |
| **平台綁定風險** | 低（靜態檔案可帶走） | **高**（深度使用特有 Edge 功能） | 低（標準 Docker，可搬家） | **高**（深度綁定專屬資料庫生態） |
| **CI/CD 自動化體驗** | 需手動撰寫 GitHub Actions | **極致**（自動 PR 預覽、一鍵 Rollback） | 佳（PR 預覽需付費） | 佳（支援無限 PR 預覽網址） |


### 六、專有名詞白話解析

這些詞在各平台的文件和介紹裡會一直出現，但大多數教學都假設你已經懂了。整理在這裡備查。

#### 部署與自動化

**CI/CD（持續整合與持續部署）**

以前工程師要把網站上線，需要手動打包、連線伺服器、覆蓋舊檔案。CI/CD 是把這個流程自動化的概念——你只要把程式碼 Push 到 GitHub，系統就自動測試、打包並更新到正式網站。

> 📖 [GitHub Actions 文件](https://docs.github.com/en/actions)

**PR（Pull Request）**

團隊合作時，工程師寫完一段新功能，提出「合併請求」，讓其他人審查程式碼。Vercel 的「PR 預覽」讓這個功能更強大——新功能在正式上線前，先產生一個臨時網址，讓 PM 或 QA 直接點進去測試。


#### 雲端架構

**PaaS（Platform as a Service / 平台即服務）**

就像租一間「水電裝潢都弄好」的店面。你只需要把商品（程式碼）擺進去就能開始營業，不用自己蓋房子（管底層作業系統、安全性修補）。Render 就是一種 PaaS。

> [什麼是 PaaS（AWS 說明）](https://aws.amazon.com/what-is/paas/)

**Docker / Container（容器化）**

把程式碼、需要的套件、設定檔全部打包成一個「標準規格的貨櫃」。不管把它搬到哪台電腦或哪個雲端平台，執行結果都一模一樣。再也不會發生「在我電腦上明明就可以跑啊」的問題。

> [Docker 入門指南](https://docs.docker.com/get-started/overview/)

**Serverless（無伺服器）**

其實還是有伺服器，只是**你不需要管它**。傳統租主機是包月制，不管有沒有流量都要付錢；Serverless 則是「有人觸發你的 API，系統才瞬間啟動一小塊運算資源」，用完立刻回收。省錢，但代價是冷啟動問題。

> [Serverless 概念（Cloudflare Learning）](https://www.cloudflare.com/learning/serverless/what-is-serverless/)

**Cold Start（冷啟動）**

Serverless 為了省資源，沒人用時會進入「休眠」。當突然有訪客進來，系統需要「重新開機」，這段讓使用者覺得卡頓的等待時間就是冷啟動。從幾百毫秒到幾十秒不等，取決於平台。


#### 速度與效能

**CDN（Content Delivery Network / 內容傳遞網路）**

全球的「物流發貨中心」。如果你的主機在美國，台灣的使用者連線過去會很慢。CDN 在全球各地建立節點，把靜態資源複製到離使用者最近的位置。台灣使用者就從台灣節點抓資料，載入速度瞬間提升。

> [什麼是 CDN（Cloudflare）](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)

**Edge Computing（邊緣運算 / Edge Functions）**

CDN 的進階版。原本 CDN 只能放「靜態圖片」，邊緣運算讓後端程式碼也能直接在離使用者最近的全球節點上執行。使用者根本不用連回遠在美國的主機，在台灣的節點就直接算好資料回傳。

> [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions) ／ [Cloudflare Workers](https://developers.cloudflare.com/workers/)

**V8 Isolates**

Google Chrome 用來執行 JavaScript 的超快引擎。Cloudflare 把它拿來跑後端程式，因為它啟動時間幾乎是 0 毫秒，直接解決了 Serverless 的冷啟動問題。

> [How Workers Works（Cloudflare）](https://developers.cloudflare.com/workers/reference/how-workers-works/)


#### 其他重要概念

**WebSocket / 長期連線**

傳統網頁是「一問一答」：使用者點一下，伺服器給一次資料。WebSocket 則是雙方建立一條「不中斷的雙向水管」，伺服器可以隨時主動把新資料推給使用者。常用於即時聊天室、股票看盤、多人連線遊戲。

> 📖 [WebSocket API（MDN 中文）](https://developer.mozilla.org/zh-TW/docs/Web/API/WebSockets_API)

**WAF（網頁應用程式防火牆）& DDoS（分散式阻斷服務攻擊）**

DDoS 是駭客操控大量中毒電腦同時湧入你的網站，把伺服器塞爆癱瘓。WAF 是站在網站前面的「高階保全」，負責過濾掉惡意的攻擊指令。

> 📖 [什麼是 DDoS（Cloudflare）](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/) ／ [什麼是 WAF（Cloudflare）](https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/)

**Vendor Lock-in（平台綁定 / 供應商鎖定）**

如果你用了太多某個平台的獨家功能，導致程式碼完全迎合它，未來想搬家時幾乎要全部重寫，這就是平台綁定風險。Vercel 和 Cloudflare 的專屬功能都有這個問題，選用時要先想清楚。

> 📖 [Vendor Lock-in（Wikipedia）](https://en.wikipedia.org/wiki/Vendor_lock-in)



### 七、心得

比較到最後，我發現選平台其實沒有絕對的好壞，而是看你的專案需求。只要先想清楚下面三件事，通常就能很快做出選擇。

#### 1. 專案需要後端嗎？

如果只是靜態網站，像是作品集、部落格或形象網站，GitHub Pages 或 Cloudflare Pages 就已經足夠；但如果需要 API、資料庫或長時間運行的服務，就需要能部署後端的平台，例如 Render。

#### 2. 你比較在意開發體驗，還是長期成本？

如果重視部署流程、CI/CD、PR Preview 等開發體驗，Vercel 依然是非常成熟的選擇，尤其適合團隊協作。不過在商業團隊中，也要將每位成員的席位費納入長期成本考量。

#### 3. 專案流量與部署環境有哪些需求？

如果預期流量較高，或希望有完善的 CDN 與 DDoS 防護，Cloudflare Pages 的免費頻寬與全球網路會是很大的優勢。但如果後端需要依賴 Node.js 原生執行環境，則要先確認是否與 Cloudflare Workers 的執行模型相容。

#### 最後與AI討論後整理成一張情境對照表：

| 情境 | 推薦平台 | 理由 |
|---|---|---|
| 純靜態 HTML、個人履歷、部落格 | **GitHub Pages** 或 **Cloudflare Pages** | 最單純 / 速度最快 |
| React / Vue / Next.js，追求極致 SEO 與開發體驗 | **Vercel** | 設定最少，開箱即用 |
| 傳統後端、需連接資料庫、跑爬蟲或做聊天室 | **Render** | 取代自己租主機的最佳方案 |
| 海量流量、重視資安防護、想體驗零冷啟動邊緣運算 | **Cloudflare Pages** | 頻寬免費且防禦力無人能敵 |


### 資料來源

- [GitHub Pages 官方文件](https://docs.github.com/en/pages)
- [Vercel 官方文件](https://vercel.com/docs)
- [Render 官方文件](https://render.com/docs)
- [Cloudflare Pages 官方文件](https://developers.cloudflare.com/pages/)
- [Docker 入門指南](https://docs.docker.com/get-started/)
- [MDN — WebSocket API](https://developer.mozilla.org/zh-TW/docs/Web/API/WebSockets_API)
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/)