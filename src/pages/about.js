import React from "react";
import Layout from "@theme/Layout";
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from "../constants";
import timelineStyles from "./about.module.css";
import aboutVisual from "@site/static/img/about.png";

// 轉職路徑時間線（5 個關鍵里程碑，可再自行微調）
const timelineData = [
  {
    title: "從理解問題開始",
    text: "起點不在程式，而在商管與財金。這讓我習慣先理解一件事的目的，與真正要解決的問題。",
  },
  {
    title: "走進數位產品的現場",
    text: "從叡揚實習導入 CRM，到新創擔任 PM 做需求訪談與 PRD——我學會：產品的價值在於能不能融入使用者的習慣。",
  },
  {
    title: "從 PM 轉向前端",
    text: "一次次追問題，讓我想親手把功能做出來。於是從線上課程到九個月密集培訓，正式踏進前端。",
  },
  {
    title: "在團隊中完成作品",
    text: "兩度擔任專案組長，與團隊完成 YeStep 與伴你在日常，體會溝通與「解決對的問題」比各自寫好程式更重要。",
  },
  {
    title: "現在，帶著產品視角寫程式",
    text: "以 React Vue 為主，動手前先釐清需求與情境，把過去的產品思維帶進每一行程式。",
  },
];

// 目前專注的技術（名稱 + 一行說明）
const TECH_STACK = [
  {
    name: "React",
    desc: "熟悉 React Router、Redux Toolkit。",
  },
  { name: "Vue 3", desc: "持續深化 Composition API 與 Nuxt 生態。" },
  {
    name: "Node.js",
    desc: "理解前後端協作，完成串接與部署。",
  },
];

export default function About() {
  return (
    <Layout title={PAGE_TITLES.about} description={PAGE_DESCRIPTIONS.about}>
      <main className={timelineStyles.aboutMain}>
        <div className="container">
          {/* 頁首 */}
          <header className={timelineStyles.pageHeader}>
            <span className={timelineStyles.kicker}>關於我 ・ ABOUT</span>
            <h1 className={timelineStyles.pageTitle}>關於我</h1>
          </header>

          {/* 開場 + 主視覺：文字壓在圖片左側留白 */}
          <section className={timelineStyles.hero}>
            <div className={timelineStyles.heroText}>
              <h2 className={timelineStyles.sectionTitle}>
                從理解問題開始，走向前端開發
              </h2>
              <p className={timelineStyles.openingText}>
                我是 7Lun，一位從 PM
                轉職的前端工程師。過去在商業管理、數位產品與專案管理的經驗，讓我習慣先理解「為什麼需要這個功能」，再動手解決。
                現在，我把這份對需求與使用者的理解帶進前端開發——用程式，把想法變成看得見、也用得順的畫面。
              </p>
            </div>
            <img
              className={timelineStyles.heroImg}
              src={aboutVisual}
              alt="關於我 ・ 主視覺插圖"
            />
          </section>

          {/* 轉職路徑 */}
          <section className={timelineStyles.block}>
            <h2 className={timelineStyles.sectionTitle}>我的轉職路徑</h2>
            <div className={timelineStyles.story}>
              {timelineData.map((item, index) => (
                <section key={index} className={timelineStyles.chapter}>
                  <span className={timelineStyles.chapterMarker} />
                  <div className={timelineStyles.chapterHead}>
                    <span className={timelineStyles.chapterNum}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={timelineStyles.chapterTitle}>
                      {item.title}
                    </h3>
                  </div>
                  <p className={timelineStyles.chapterText}>{item.text}</p>
                </section>
              ))}
            </div>
          </section>

          {/* 專注技術 */}
          <section className={timelineStyles.block}>
            <h2 className={timelineStyles.sectionTitle}>我現在專注的技術</h2>
            <div className={timelineStyles.techBlocks}>
              {TECH_STACK.map((tech) => (
                <div key={tech.name} className={timelineStyles.techBlock}>
                  <h3 className={timelineStyles.techName}>{tech.name}</h3>
                  <p className={timelineStyles.techDesc}>{tech.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 我想做的事 */}
          <section className={timelineStyles.block}>
            <h2 className={timelineStyles.sectionTitle}>我想做的事</h2>
            <p className={timelineStyles.closingText}>
              用產品視角理解需求，
              <br />
              用前端技術實作畫面與互動，
              <br />
              做出能真正改善使用者流程的產品。
            </p>
          </section>

          <div className={timelineStyles.storyEnd}>── 繼續路途上 ──</div>
        </div>
      </main>
    </Layout>
  );
}
