import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import authorPic from "../../static/img/author.png";
import lifewithyou from "../../static/img/lifewithyou.png";
import yestep from "../../static/img/yestep.png";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// --- 介紹區 (About Me) ---
function AboutMe() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <h1 className={styles.greeting}>Hi, 我是 7Lun</h1>
            <h5 className={styles.subGreeting}>收錄我開發的軌跡</h5>
            <p className={styles.description}>
              我擅長把抽象的需求，拆解成清晰且容易理解的結構，
              讓程式碼不只是能運作，也能被人讀懂與維護。
              在這樣的開發思維下，目前主力於 <strong>React 生態系</strong> 與 <strong>Vite 開發流程</strong>，同時也正在探索自學 <strong>Vue 框架</strong>。
              <br />
              <br />
              我用「語法手冊」提煉語法重點，用「生存日誌」記錄每一次卡關與突破。
              這裡不只是學習筆記，更是我將踩坑經驗轉化為成長的軌跡。
            </p>
            <div className={styles.actionButtons}>
              <Link className={styles.navBtn} to="/about">
                關於我
              </Link>
              <Link className={styles.navBtn} to="/blog">
                生存日誌
              </Link>
              <Link className={styles.navBtn} to="/docs/intro">
                語法手冊
              </Link>
            </div>
          </div>
          <div className={styles.avatarWrapper}>
            <img src={authorPic} alt="7Lun" className={styles.avatarImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 技能區 (Skills) ---
function Skills() {
  const skills = {
    base: [
      {
        title: "HTML",
        desc: "熟練 HTML5 語意化結構，建立清晰且具邏輯的頁面骨架。",
      },
      {
        title: "CSS / SCSS",
        desc: "運用 SCSS 管理樣式結構與層級，搭配 Bootstrap 建構穩定且具擴展性的響應式介面，確保網頁在各種裝置上皆有良好顯示效果。",
      },
      {
        title: "JavaScript",
        desc: "熟悉 ES6+ 語法，能處理複雜資料邏輯，提升程式碼可讀性與維護性。",
      },
    ],

    frameworks: [
      {
        title: "React",
        desc: "具備 SPA 架構開發經驗，透過組件化思維建立可重用 UI 模組；熟悉 React Hook Form 表單驗證與 Redux Toolkit 狀態管理，維持複雜 UI 的資料流清晰與可預測性。",
      },
      {
        title: "Vue",
        desc: "熟悉 Composition API 與 setup 語法，掌握 ref / reactive 響應式資料、computed / watch、props / emit 等核心機制；目前正實作個人專案，並同步學習 Pinia 狀態管理。",
      },
    ],

    tools: [
      {
        title: "Vite",
        desc: "熟悉現代化前端建構工具，能快速建立開發環境並優化專案打包與開發流程。",
      },
      {
        title: "Mock API",
        desc: "使用 JSON Server 建立 Mock API 環境，支援前後端分離開發流程。",
      },
      {
        title: "API Integration",
        desc: "可使用 Axios 串接 RESTful API，處理資料請求、錯誤處理與前端狀態回饋。",
      },
    ],

    collaboration: [
      {
        title: "Code Quality",
        desc: "透過 ESLint 建立一致的程式碼風格與品質標準，提升團隊協作效率。",
      },
      {
        title: "Git / GitHub",
        desc: "熟悉 Git Flow、分支管理與 Pull Request 協作流程，確保專案開發紀錄清晰。",
      },
      {
        title: "AI Collaboration",
        desc: "探索 AI Agent 協作開發流程，利用 AI 工具輔助需求拆解、除錯與開發效率提升。",
      },
    ],
  };

  return (
    <section className={styles.skillsSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>技能 Skill</h2>

        {/* Core Skills */}
        <div className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>Core <span>核心技術</span></h3>
          <div className={styles.skillFlexContainer}>
            {skills.base.map((skill, idx) => (
              <div key={`base-${idx}`} className={`${styles.skillCard} ${styles.baseCard}`}>
                <h4 className={styles.skillName}>{skill.title}</h4>
                <p className={styles.skillDesc}>{skill.desc}</p>
              </div>
            ))}
          </div>
          <div className={`${styles.skillFlexContainer} ${styles.frameworkRow}`}>
            {skills.frameworks.map((skill, idx) => (
              <div key={`fw-${idx}`} className={`${styles.skillCard} ${styles.frameworkCard}`}>
                <h4 className={styles.skillName}>{skill.title}</h4>
                <p className={styles.skillDesc}>{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>Tools <span>開發工具</span></h3>
          <div className={styles.skillFlexContainer}>
            {skills.tools.map((skill, idx) => (
              <div key={`tools-${idx}`} className={styles.skillCard}>
                <h4 className={styles.skillName}>{skill.title}</h4>
                <p className={styles.skillDesc}>{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration */}
        <div className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>Collaboration <span>團隊協作</span></h3>
          <div className={styles.skillFlexContainer}>
            {skills.collaboration.map((skill, idx) => (
              <div key={`collab-${idx}`} className={styles.skillCard}>
                <h4 className={styles.skillName}>{skill.title}</h4>
                <p className={styles.skillDesc}>{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// --- 作品區 (Portfolio) ---
function Portfolio() {
  const projects = [
    {
      title: "伴你在日常",
      category: "電商主題",
      desc: "專為家庭照顧者與專業人員打造的輔具電商平台。我們透過清楚的分類與友善設計，化解輔具選購的資訊焦慮。以「陪伴」為核心，期盼讓家人安全舒適，也讓照顧者擁有更多餘裕。",
      link: "/blog/withyourlife-project",
      img: lifewithyou,
      tags: ["Vite", "Bootstrap 5", "SCSS", "GSAP", "leaflet", "Git", "GitHub"],
      github: "https://github.com/Duncanin/with_your_life",
      demo: "https://duncanin.github.io/with_your_life/"
    },
    {
      title: "YeStep 每一步，找回生活的呼吸",
      category: "檢索主題",
      desc: "以「把 Yes 變成 Step」為核心精神的步道資訊平台。專為忙碌上班族與親子家庭設計，鼓勵大眾跨出探索自然的第一步。透過直覺的檢索體驗，陪伴你走入山林，找回身心療癒的寧靜。",
      link: "/blog/yestep-project",
      img: yestep,
      tags: ["Vite", "React", "JavaScript", "Bootstrap 5", "SCSS", "Swiper", "Lottie", "Chart.js", "Axios", "Git", "GitHub"],
      github: "https://github.com/MalricHsu/yestep",
      demo: "https://yestep.onrender.com/"
    },
  ];

  return (
    <section className={styles.portfolioSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>專案 Project</h2>
        <div className={styles.projectFlexContainer}>
          {projects.map((project, idx) => (
            <div
              key={idx}
              className={styles.projectItemCard}
            >
              <div className={styles.projectImageWrapper}>
                <img
                  src={project.img}
                  alt={project.title}
                  className={styles.projectImg}
                />
              </div>
              <div className={styles.projectContent}>
                <span className={styles.projectCategory}>{project.category}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>{project.desc}</p>
                <div className={styles.tagGroup}>
                  {project.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.projectFooter}>
                  <div className={styles.projectLinks}>
                    <Link to={project.github} className={styles.textLink}>
                      GitHub
                    </Link>
                    <span className={styles.separator}>|</span>
                    <Link to={project.demo} className={styles.textLink}>
                      Demo
                    </Link>
                  </div>
                  <Link to={project.link} className={styles.readMoreLink}>
                    <span className={styles.readMoreHint}>開發紀錄</span>
                    <i className={`bi bi-arrow-up-right ${styles.readMoreArrow}`}></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 評價區 (Testimonials) ---
function Testimonials() {
  const reviews = [
    {
      name: "伴你在日常／YeStep 專案協作夥伴",
      role: "組員 - 登登登",
      text: "7lun 是個非常積極且熱愛分享交流的夥伴，善於規劃、統合，在專題合作中多虧有他，團隊才有更高的凝聚力和向心力。"
    },
    {
      name: "伴你在日常／YeStep 專案協作夥伴",
      role: "組員 - 蛋白",
      text: "七倫是個充滿熱情且積極的組員，可以感受到他善於組織與推動專案進度的能力，常常在專案有進展時就會開始思考並規劃下一個階段。有時候他對自己要求較高，甚至會忙到影響身體狀況，作為一起合作的組員，希望他未來在持續成長的同時，能夠更輕鬆地享受寫程式的過程！不要再熬夜熬這麼兇了喔！"
    },
    {
      name: "伴你在日常／YeStep 專案協作夥伴",
      role: "組員 - Katie",
      text: "在專題合作的過程中，七倫是一位非常積極且認真的夥伴。他在專案中常常會主動關注進度，也會提前思考整體架構，例如部署或環境設定等技術層面的規劃，並樂於和大家分享自己研究到的內容。在團隊合作上，他擅長組織與統整，也常主動推動討論與專案進度，讓團隊在合作過程中能保持良好的節奏與凝聚力。在討論事情時節奏偏效率導向，也關心組員們的狀態。同時他對自己的要求也相當高，對專題投入許多心力。"
    },
    {
      name: "YeStep 專案協作夥伴",
      role: "組員 - うさぎ兔",
      text: "和他合作的時候，可以感受到他對學習非常認真，也會主動追蹤專案進度。在技術面上常常會提前思考整體架構，例如部署或環境設定，也很樂於分享自己研究到的東西。在討論事情時，他的節奏通常比較直接、效率導向，會希望事情能快速推進。相處熟悉之後其實很好聊天，也常能讓團隊討論的氣氛變得輕鬆。"
    },
  ];

  return (
    <section style={{ backgroundColor: "transparent", padding: "5rem 0", overflow: "hidden" }}>
      <style>
        {`
          .testimonial-swiper {
            padding-bottom: 3rem !important;
          }
          .testimonial-swiper .swiper-wrapper {
            transition-timing-function: linear !important;
            align-items: stretch;
          }
          .swiper-pagination-bullet {
            background-color: var(--ifm-color-primary) !important;
            opacity: 0.2;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
            width: 24px;
            border-radius: 4px;
            transition: width 0.3s ease;
          }
          .review-card-inner {
            background-color: #fff;
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(111, 78, 55, 0.08);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            cursor: grab;
          }
          .review-card-text {
            font-size: 1.05rem;
            color: var(--ifm-color-emphasis-800);
            line-height: 1.8;
            margin-bottom: 2rem;
            font-style: italic;
            text-align: justify;
          }
          @media (max-width: 768px) {
            .review-card-inner {
              padding: 1.8rem 1.5rem;
            }
            .review-card-text {
              font-size: 0.95rem;
              line-height: 1.6;
              margin-bottom: 1.5rem;
            }
          }
        `}
      </style>
      <div className="container">
        <h2 className={styles.sectionTitle} style={{ textAlign: "center", marginBottom: "3rem" }}>專案合作回饋</h2>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          speed={8000}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="testimonial-swiper"
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} style={{ height: "auto" }}>
              <div className="review-card-inner">
                <div>
                  <div style={{ color: "var(--ifm-color-primary)", fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.2, lineHeight: 1 }}>
                    <i className="bi bi-quote"></i>
                  </div>
                  <p className="review-card-text">
                    "{review.text}"
                  </p>
                </div>
                <div style={{ borderTop: "1px solid rgba(111,78,55,0.1)", paddingTop: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--ifm-color-primary)", fontSize: "1.1rem", fontWeight: "bold" }}>{review.name}</h4>
                  <span style={{ fontSize: "0.9rem", color: "var(--ifm-color-emphasis-600)" }}>{review.role}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="7lun 的程式手冊" description={siteConfig.tagline}>
      <main className={styles.mainContainer}>
        <AboutMe />
        <Skills />
        <Portfolio />
        <Testimonials />
      </main>
    </Layout>
  );
}
