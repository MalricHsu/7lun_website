# 7lun 的程式手冊

> 將設計稿轉化為直覺介面，記錄前端開發的生存軌跡。

一個以 Docusaurus 建構的個人技術網站，用來整理前端學習筆記、記錄專案開發歷程，以及展示個人作品集。

🌐 **網站連結**：[https://MalricHsu.github.io/7lun-workspace/](https://MalricHsu.github.io/7lun-workspace/)

---

## 網站內容

| 頁面 | 說明 |
|------|------|
| 首頁 | 個人介紹、技能總覽、作品預覽 |
| 關於我 | 學習歷程與開發理念 |
| 語法手冊 | HTML / CSS / JavaScript / Vue 學習筆記 |
| 生存日誌 | 前端專案開發紀錄 |
| 專案作品 | 個人與團隊作品展示 |

---

## 技術棧

- **框架**：[Docusaurus v3](https://docusaurus.io/)
- **語言**：JavaScript / MDX / CSS
- **部署**：GitHub Pages
- **字體**：Noto Sans TC / Noto Serif TC

---

## 本地開發

```bash
# 安裝套件
npm install

# 啟動開發伺服器
npm start

# 建置生產版本
npm run build
```

## 部署

```bash
GIT_USER=MalricHsu npm run deploy
```

執行後會自動建置並推送到 `gh-pages` 分支，稍等幾分鐘即可在網站看到更新。
