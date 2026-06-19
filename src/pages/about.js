import React from "react";
import Layout from "@theme/Layout";
import timelineStyles from "./about.module.css";
import authorPic from "../../static/img/author.png";

const timelineData = [
  {
    title: "從理解問題開始",
    content: [
      "我不是一開始就走在前端開發路上的人。大學期間，我接觸商業管理與組織運作相關領域，之後也曾進入財務金融相關碩士班就讀。這些背景雖然不是直接從程式開發開始，卻讓我習慣在面對一件事情時，先去理解它背後的目的、流程，以及真正需要被解決的問題。",
      "後來，我參與政府標案、數位轉型與產品專案相關工作，從文件整理、流程訪談、系統導入、教育訓練，到協助釐清使用者遇到的問題，逐漸累積了與需求、產品及使用者溝通的經驗。",
      "也就是在這些過程中，我慢慢發現，比起單純完成一項任務，我更喜歡理解：「為什麼需要這個功能？」以及「它能不能真的讓使用者的操作變得更順利？」"
    ]
  },
  {
    title: "第一次走進數位產品的現場",
    content: [
      "在參與數位發展部 T 大使計畫期間，我於叡揚資訊進行實習，接觸 CRM 顧客管理系統、NetZero 零碳雲與 KM 知識管理系統等企業產品。",
      "實習後期，我實際參與旅行社導入 CRM 系統的過程，從需求規劃、流程訪談、資料盤查、系統設定，到最後進行教育訓練，跟著團隊一步一步將系統帶進使用者原本的工作流程中。",
      "那段經驗讓我第一次真正理解，一個產品的價值，不只是功能做得多完整，而是它能不能符合使用者的習慣、減少原本的困擾，並在日常工作中發揮作用。",
      "對我而言，這也是一個重要的起點：我開始對數位產品如何被規劃、如何被使用，以及如何透過技術解決實際問題，產生越來越多的興趣。"
    ]
  },
  {
    title: "從 PM 到前端的轉折",
    content: [
      "後來，在新創公司擔任 PM 的過程中，我更直接地接觸到產品與開發團隊之間的協作。",
      "當使用者或客服端提出問題時，我會先協助釐清情境、進行初步排查，再視問題內容與 QA、RD 團隊溝通。同時，我也參與需求訪談、產品規格整理、PRD 撰寫、操作文件製作，以及市場與競品分析，協助將模糊的需求轉化成團隊能夠理解與執行的內容。",
      "因為當時 RD 與 QA 團隊經常需要處理許多任務，我開始希望自己能多理解一些技術邏輯，先替他們排除部分問題，也減少來回確認的時間。",
      "但在一次次追查問題的過程裡，我漸漸產生了更多好奇：畫面上的互動是怎麼完成的？資料為什麼有時候無法正確顯示？一個寫在需求文件中的功能，又是如何真正被做出來的？",
      "慢慢地，我發現自己不只想描述功能應該長什麼樣子，也想親手參與它被實現的過程。",
      "於是，我開始學習前端開發。"
    ]
  },
  {
    title: "把想法變成看得見的畫面",
    content: [
      "我的前端學習，從線上課程開始。透過約 80.5 小時的全端網頁開發課程，我從 HTML、CSS 與 JavaScript 建立基礎，接著投入九個月的前端開發密集培訓，逐步學習如何將設計、互動與資料整合成一個完整的網頁應用。",
      "剛開始接觸程式時，很多事情都不容易。可能只是一個版面配置，卻怎麼調整都無法符合預期；也可能是一段錯誤訊息，需要花上許多時間理解它究竟在提醒什麼。",
      "不過，也正是這些反覆嘗試的過程，讓我越來越喜歡開發。當一個畫面終於正確呈現、一個互動功能真的能被操作，或是一個困擾很久的問題成功解開時，我會感受到一種很踏實的成就感：原來那些原本只停留在想法中的內容，真的可以透過自己的雙手一步一步完成。"
    ]
  },
  {
    title: "帶著產品視角寫程式",
    content: [
      "目前，我以 React 作為主要的前端技術方向，熟悉 React Router、Redux Toolkit、React Hook Form，也能依照 Figma 設計稿，運用 Bootstrap 5 與 Sass 完成頁面實作與樣式整理。",
      "在學習與專案開發過程中，我也曾使用 JSON Server 建立模擬後端 API，完成資料串接與網站部署，並持續接觸 Vue 3 與 Node.js，希望能更完整地理解前後端之間的合作方式。",
      "過去擔任 PM 的經驗，也影響了我寫程式的方式。在開始實作前，我會習慣先整理需求、思考使用者的操作情境，並確認這個功能真正想解決的問題。",
      "對我來說，前端不只是把畫面刻出來，而是在需求、設計與技術之間找到連結，讓使用者可以自然地完成他想做的事情。"
    ]
  },
  {
    title: "在團隊中一起完成作品",
    content: [
      "在前端培訓期間，我曾兩度擔任專案組長，與團隊完成步道檢索平台 YeStep 與長照輔具資訊平台 伴你在日常。",
      "在專案中，我不只參與功能開發，也協助討論需求方向、安排任務、追蹤進度與整合成果。這些經驗讓我理解，完成一個作品不只是每個人各自寫好自己的程式，而是團隊能不能在過程中保持溝通，並一起確認做出來的內容是否符合最初想解決的問題。",
      "我很喜歡這種從模糊想法開始，經過討論、調整與實作，最後慢慢形成完整作品的過程。它也讓我更加確定，自己希望成為一位不只具備開發能力，也能理解需求並與團隊合作的前端工程師。"
    ]
  },
  {
    title: "用技術讓工作更順一點",
    content: [
      "除了網站開發，我也喜歡思考如何透過工具改善日常工作流程。",
      "過去，我曾使用 Google Apps Script、Slack Workflow Builder 與 Google Workspace 建立內部自動化工具，協助團隊減少重複性作業，也曾參與任務時程管理與進度追蹤。",
      "這些經驗讓我發現，技術不一定要做成大型平台才有價值。有時候，一個更順暢的流程、一個減少人工操作的小工具，就能真實地改善使用者或團隊每天的工作方式。",
      "而這也是我學習前端時很在意的事情：我希望自己做出來的內容，不只是可以運作，而是真的能替某個人解決問題。"
    ]
  },
  {
    title: "把學習變成自己的累積",
    content: [
      "在開發與學習過程中，我也會使用 NotebookLM、Claude Code、Codex 等 AI 工具，協助整理資料、釐清問題、除錯與撰寫技術文件。",
      "不過，對我而言，AI 更像是一位協作夥伴，而不是直接替我完成所有事情的捷徑。我會先整理需求與流程，再參考工具提供的方向，最後自行閱讀、測試與調整，確保自己理解每一段程式碼正在處理什麼。",
      "我也喜歡把學習過程整理成筆記。那些曾經讓我困惑的觀念、卡住許久的 bug，以及某一刻終於理解的瞬間，對我來說都不是失敗，而是成為開發者過程中，很重要的成長痕跡。"
    ]
  },
  {
    title: "我想成為的開發者",
    content: [
      "我希望自己成為一位懂得溝通、能理解需求，也能透過前端技術將想法實現的開發者。",
      "從 PM 走向前端，對我來說並不是完全重新開始，而是把過去累積的需求理解、流程整理與團隊協作能力，帶進新的技術旅程中。",
      "未來，我期望能結合產品視角與前端開發能力，打造不只具備良好畫面與互動，也真正能解決使用者問題、適合長期維護的產品。",
      "而現在，我正在這條路上持續前進，把曾經只能協助描述的想法，慢慢變成自己也能親手完成的作品。"
    ]
  }
];

export default function About() {
  return (
    <Layout title="關於我" description="了解更多關於 7Lun 的故事">
      <main style={{ backgroundColor: "#fdfbf7", paddingBottom: "4rem", minHeight: "100vh" }}>
        <div className="container">
          
          {/* Header 區塊：照片與簡短開場白 */}
          <div className={timelineStyles.introSection}>
            <img
              src={authorPic}
              alt="7Lun"
              className={timelineStyles.introAvatar}
            />
            <div className={timelineStyles.introContent}>
              <h1 className={timelineStyles.introTitle}>你好，我是 7Lun。</h1>
              <p className={timelineStyles.introText}>
                喜歡在開發中探索可能，<br />
                並記錄下那些豁然開朗的瞬間。
              </p>
            </div>
          </div>

          {/* 時間軸主體 */}
          <div className={timelineStyles.timelineContainer} style={{ marginTop: "3rem" }}>
            {timelineData.map((item, index) => {
              const positionClass = index % 2 === 0 ? timelineStyles.leftItem : timelineStyles.rightItem;
              return (
                <div key={index} className={`${timelineStyles.timelineItem} ${positionClass}`}>
                  <div className={timelineStyles.timelineDot}></div>
                  <div className={timelineStyles.timelineContent}>
                    <h3 className={timelineStyles.timelineTitle}>{item.title}</h3>
                    {item.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className={timelineStyles.timelineText}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 結尾字樣 */}
          <div style={{ textAlign: "center", marginTop: "4rem", color: "#6f4e37", fontSize: "1.3rem", fontWeight: "600", letterSpacing: "2px" }}>
            ── 繼續路途上 ──
          </div>

        </div>
      </main>
    </Layout>
  );
}
