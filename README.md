# 7lun 的程式手冊

> 將設計稿轉化為直覺介面，記錄前端開發的生存軌跡。

一個以 [Docusaurus v3](https://docusaurus.io/) 建構的個人技術網站，採「報紙／編輯風」視覺設計，用來整理前端學習筆記、記錄專案開發歷程，以及展示個人作品集。

🌐 **網站連結**：[https://7lun-website.vercel.app](https://7lun-website.vercel.app)

---

## 目錄

- [網站內容](#網站內容)
- [語法手冊分類](#語法手冊分類)
- [特色](#特色)
- [技術棧](#技術棧)
- [專案結構](#專案結構)
- [本地開發](#本地開發)
- [部署](#部署)

---

## 網站內容

| 頁面 | 說明 |
|------|------|
| 首頁 | 個人介紹、技能索引、作品預覽、最新筆記、合作回饋 |
| 語法手冊 | HTML / CSS / JavaScript / React / Vue / Node.js 學習筆記 |
| 生存日誌 | 前端專案開發紀錄（blog） |
| 專案作品 | 個人與團隊作品展示 |

---

## 語法手冊分類

| 分類 | 篇數 |
|------|------|
| HTML / CSS | 18 |
| JavaScript | 17 |
| React | 4 |
| Vue.js | 2 |
| Node.js | 2 |
| Git | 規劃中 |

> 文章 frontmatter 加上 `date: YYYY-MM-DD` 即會被「最新筆記」外掛收錄，顯示在首頁目錄區。

---

## 特色

- **編輯風視覺**：報紙刊頭式 Navbar（每日自動帶當天日期 + 期數 No.7）、雙線分隔、暖咖啡色系（主色 `#6f4e37`）
- **客製文章排版**：建立日期 dateline、置中欄寬、暖底程式碼區塊、內文超連結加粗
- **最新筆記外掛**：建置期掃描 docs frontmatter，自動取最新 3 篇顯示於首頁
- **響應式設計**：手機 / 平板 / 桌機皆有針對性 RWD 調整
- **字體**：標題 Noto Serif TC，內文 Noto Sans TC

---

## 技術棧

- **框架**：[Docusaurus v3](https://docusaurus.io/)（v3.10）
- **語言**：JavaScript / MDX / CSS
- **部署**：Vercel（同時保留 GitHub Pages 部署設定）
- **字體**：Noto Sans TC / Noto Serif TC

---

## 專案結構

```
.
├── docs/                  # 語法手冊筆記（依分類資料夾，含 _category_.json）
├── blog/                  # 生存日誌 / 專案作品文章
├── plugins/
│   └── recent-docs/       # 自製外掛：抓取最新筆記
├── src/
│   ├── pages/             # 首頁（index.js + index.module.css）
│   ├── components/        # ManualIndex、HomepageFeatures
│   ├── theme/             # swizzle 客製：Navbar 刊頭、DocItem dateline、DocCard、BlogListPage
│   ├── css/custom.css     # 全站主題與排版
│   └── clientModules/     # 前端載入時執行的腳本
├── static/img/            # 圖片資源（logo、og-image、文章配圖）
├── docusaurus.config.js   # 站台設定（標題、外掛、navbar、prism 主題等）
└── NOTES.md               # 客製重點檔案地圖（開發筆記）
```

> 想快速找到某個客製功能改在哪個檔案，可參考根目錄的 [`NOTES.md`](./NOTES.md)。

---

## 本地開發

```bash
# 安裝套件
npm install

# 啟動開發伺服器（http://localhost:3000）
npm start

# 建置生產版本到 build/
npm run build

# 本機預覽 build 結果
npm run serve

# 清除快取（排版／設定改了卻沒更新時）
npm run clear
```

---

## 部署

網站部署於 Vercel，推送至預設分支後會自動建置上線。

若要改用 GitHub Pages 部署（推送到 `gh-pages` 分支）：

```bash
GIT_USER=MalricHsu npm run deploy
```

執行後會自動建置並推送，稍等幾分鐘即可看到更新。
