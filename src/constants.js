// ============================================================
// 全站文字集中管理：要改標題時，只改這個檔案即可。
// （此檔僅放純字串，不要 import React / JSX，
//  這樣 docusaurus.config.js 也能安全引用。）
// ============================================================

// 全站品牌名稱（分頁標題後綴、導覽列、頁尾版權）
export const SITE_TITLE = "7LUN CHAPTER";

// 各頁面的瀏覽器分頁標題
// 格式會自動變成「頁面標題 | 7LUN Chapter」
export const PAGE_TITLES = {
  home: "首頁 Home", // 首頁
  about: "關於 About", // 關於頁
  portfolio: "作品 Portfolio", // 作品頁
};

// 各頁面的 SEO 描述（搜尋結果／分享連結用的 meta description）
export const PAGE_DESCRIPTIONS = {
  home: "前端工程師 7Lun 的作品集與技術筆記，專注 React、Vue 開發 —— Every project starts a new chapter.", // 首頁
  about: "從 PM 到前端工程師，7Lun 的轉職歷程與開發故事。", // 關於頁
  portfolio:
    "7Lun 的前端作品集：團隊協作與獨立開發成果，涵蓋 React、Vue 與 Nuxt。", // 作品頁
};
