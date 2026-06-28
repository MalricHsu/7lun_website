import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./index.module.css";
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from "../constants";
import authorPic from "../../static/img/author.png";
import lifewithyou from "../../static/img/lifewithyou.png";
import yestep from "../../static/img/yestep.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// --- 共用：欄目小標 + 襯線標題 + 細線 ---
function SectionKicker({ kicker, title, center = false, right = false }) {
  return (
    <div
      className={`${styles.sectionHeader} ${center ? styles.sectionHeaderCenter : ""} ${right ? styles.sectionHeaderRight : ""}`}
    >
      <span className={styles.kicker}>{kicker}</span>
      <h2 className={styles.editorialTitle}>{title}</h2>
    </div>
  );
}

// --- 介紹區 (About Me) ---
function AboutMe() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <div className={styles.aboutContent}>
          <figure className={styles.avatarWrapper}>
            <img src={authorPic} alt="7Lun" className={styles.avatarImage} />
          </figure>
          <div className={styles.aboutText}>
            <span className={styles.aboutKicker}>
              — TAIPEI, TAIWAN (R.O.C) —
            </span>
            <h1 className={styles.greeting}>7Lun</h1>
            <h5 className={styles.subGreeting}>JUNIOR-FRONT-END DEVELOPER</h5>
            <p className={styles.description}>
              專注 <strong>Vue</strong> 和 <strong>React</strong> 開發，熟悉
              <strong>JavaScript 生態系</strong>與 <strong>Vite 流程</strong>
              。擅長拆解需求，打造清晰易維護的架構。
              <br />
              <br />
              這裡是我寫下的開發篇章：用「Notes」沉澱知識，用「Blog」記錄踩坑與突破。
            </p>
            <div className={styles.actionButtons}>
              <Link className={styles.heroLink} to="/about">
                關於 About ↗
              </Link>
              <Link className={styles.heroLink} to="/blog">
                部落格 Blog ↗
              </Link>
              <Link className={styles.heroLink} to="/docs/intro">
                語法 Notes ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 技能區 (Skills) → 報紙索引清單 ---
function Skills() {
  const groups = [
    {
      en: "Vue",
      zh: "Vue 生態",
      items: ["Vue 3", "Composition API", "Vue Router", "Nuxt 4"],
      desc: "持續深耕 Vue 生態系與實作。",
    },
    {
      en: "React",
      zh: "React 生態",
      items: ["React", "React Router", "Redux Toolkit", "React Hook Form"],
      desc: "具備 SPA 專案開發經驗，熟悉元件設計與狀態管理。",
    },
    {
      en: "Frontend",
      zh: "前端開發",
      items: ["HTML5", "CSS3", "SCSS", "JavaScript", "RWD"],
      desc: "能獨立完成 Figma 設計稿切版、響應式介面開發與 API 串接。",
    },
    {
      en: "Workflow",
      zh: "開發流程",
      items: ["Git", "GitHub", "Vite", "Vercel", "Render", "AI Tools"],
      desc: "熟悉版本控制、部署流程與 AI 輔助開發。",
    },
  ];

  return (
    <section className={styles.skillsSection}>
      <div className="container">
        <SectionKicker kicker="專業技能 ・ SKILLS" title="技能 Skills" />
        <div className={styles.skillStack}>
          {groups.map((g) => (
            <div key={g.en} className={styles.skillBlock}>
              <div className={styles.skillBlockHead}>
                <h3 className={styles.skillBlockTitle}>{g.en}</h3>
                <span className={styles.skillBlockZh}>{g.zh}</span>
              </div>
              <p className={styles.skillBlockNames}>
                {/* 項目內空格改不斷行空格，避免窄螢幕在項目中間斷行留孤字 */}
                {g.items
                  .map((it) => it.replace(/ /g, String.fromCharCode(160)))
                  .join(" ・ ")}
              </p>
              <p className={styles.skillBlockDesc}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 作品區 (Portfolio) → 編輯風卡片 + 作品集連結 ---
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
      demo: "https://duncanin.github.io/with_your_life/",
    },
    {
      title: "YeStep 每一步，找回生活的呼吸",
      category: "檢索主題",
      desc: "以「把 Yes 變成 Step」為核心精神的步道資訊平台。專為忙碌上班族與親子家庭設計，鼓勵大眾跨出探索自然的第一步。透過直覺的檢索體驗，陪伴你走入山林，找回身心療癒的寧靜。",
      link: "/blog/yestep-project",
      img: yestep,
      tags: [
        "Vite",
        "React",
        "JavaScript",
        "Bootstrap 5",
        "SCSS",
        "Swiper",
        "Lottie",
        "Chart.js",
        "Axios",
        "Git",
        "GitHub",
      ],
      github: "https://github.com/MalricHsu/yestep",
      demo: "https://yestep.onrender.com/",
    },
  ];

  return (
    <section className={styles.portfolioSection}>
      <div className="container">
        <SectionKicker
          kicker="團隊協作作品 ・ PORTFOLIO"
          title="專案 Projects"
        />
        <div className={styles.featureGrid}>
          {projects.map((project, idx) => (
            <article key={idx} className={styles.featureCard}>
              <div className={styles.featureImageWrap}>
                <img
                  src={project.img}
                  alt={project.title}
                  className={styles.featureImg}
                />
              </div>
              <div className={styles.featureBody}>
                <span className={styles.featureCategory}>
                  {project.category}
                </span>
                <h3 className={styles.featureTitle}>{project.title}</h3>
                <p className={styles.featureDesc}>{project.desc}</p>
                <div className={styles.featureTags}>
                  {project.tags.map((tag, i) => (
                    <span key={i} className={styles.featureTag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.featureLinks}>
                  <Link to={project.github} className={styles.featureLink}>
                    GitHub Repo ↗
                  </Link>
                  <span className={styles.featureSep}>・</span>
                  <Link to={project.demo} className={styles.featureLink}>
                    Demo ↗
                  </Link>
                  <span className={styles.featureSep}>・</span>
                  <Link to={project.link} className={styles.featureLink}>
                    開發紀錄 ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.seeAllRow}>
          <Link to="/portfolio" className={styles.seeAllLink}>
            查看完整作品集 →
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- 最新文章 (Latest Notes) → 編輯風編號目錄 ---
function useDocPermalinkMap() {
  const docsData = usePluginData("docusaurus-plugin-content-docs", "default");
  const map = {};
  const version = docsData && docsData.versions && docsData.versions[0];
  if (version && Array.isArray(version.docs)) {
    for (const d of version.docs) {
      map[d.id] = d.path; // docs-plugin 產生的 permalink（中文檔名已正確編碼）
    }
  }
  return map;
}

function LatestNotes() {
  const data = usePluginData("recent-docs");
  const permalinks = useDocPermalinkMap();
  const recent = (data && data.recent) || [];

  const formatDate = (s) => {
    const d = new Date(s);
    if (isNaN(d)) return s;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <section className={styles.skillsSection}>
      <div className="container">
        <SectionKicker kicker="本期文章 ・ CONTENTS" title="最新札記 Notes" />

        {recent.length === 0 ? (
          <p className={styles.contentsEmpty}>筆記整理中，敬請期待。</p>
        ) : (
          <>
            <ol className={styles.contentsList}>
              {recent.map((note, i) => {
                const href = permalinks[note.id] || "/docs/intro";
                return (
                  <li key={note.id} className={styles.contentsItem}>
                    <Link to={href} className={styles.contentsRow}>
                      <span className={styles.contentsNum}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.contentsMain}>
                        <h3 className={styles.contentsTitle}>{note.title}</h3>
                        {note.tags && note.tags.length > 0 && (
                          <span className={styles.contentsTags}>
                            {note.tags.slice(0, 3).map((t) => (
                              <span key={t} className={styles.contentsTag}>
                                {t}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className={styles.contentsDate}>
                        {formatDate(note.date)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <div className={styles.seeAllRow}>
              <Link to="/docs/intro" className={styles.seeAllLink}>
                查看全部 →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// --- 評價區 (Testimonials) → 編輯風引文卡 ---
function Testimonials() {
  const reviews = [
    {
      name: "伴你在日常／YeStep 專案協作夥伴",
      role: "組員 - 登登登",
      text: "7lun 是個非常積極且熱愛分享交流的夥伴，善於規劃、統合，在專題合作中多虧有他，團隊才有更高的凝聚力和向心力。",
    },
    {
      name: "伴你在日常／YeStep 專案協作夥伴",
      role: "組員 - 蛋白",
      text: "七倫是個充滿熱情且積極的組員，可以感受到他善於組織與推動專案進度的能力，常常在專案有進展時就會開始思考並規劃下一個階段。有時候他對自己要求較高，甚至會忙到影響身體狀況，作為一起合作的組員，希望他未來在持續成長的同時，能夠更輕鬆地享受寫程式的過程！不要再熬夜熬這麼兇了喔！",
    },
    {
      name: "伴你在日常／YeStep 專案協作夥伴",
      role: "組員 - Katie",
      text: "在專題合作的過程中，七倫是一位非常積極且認真的夥伴。他在專案中常常會主動關注進度，也會提前思考整體架構，例如部署或環境設定等技術層面的規劃，並樂於和大家分享自己研究到的內容。在團隊合作上，他擅長組織與統整，也常主動推動討論與專案進度，讓團隊在合作過程中能保持良好的節奏與凝聚力。在討論事情時節奏偏效率導向，也關心組員們的狀態。同時他對自己的要求也相當高，對專題投入許多心力。",
    },
    {
      name: "YeStep 專案協作夥伴",
      role: "組員 - うさぎ兔",
      text: "和他合作的時候，可以感受到他對學習非常認真，也會主動追蹤專案進度。在技術面上常常會提前思考整體架構，例如部署或環境設定，也很樂於分享自己研究到的東西。在討論事情時，他的節奏通常比較直接、效率導向，會希望事情能快速推進。相處熟悉之後其實很好聊天，也常能讓團隊討論的氣氛變得輕鬆。",
    },
  ];

  return (
    <section
      style={{
        backgroundColor: "transparent",
        padding: "5rem 0",
        overflow: "hidden",
      }}
    >
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
            width: 22px;
            height: 2px;
            border-radius: 0;
            background-color: var(--ifm-color-primary) !important;
            opacity: 0.25;
            transition: opacity 0.3s ease, width 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
            width: 36px;
          }
          .review-card-inner {
            margin: 0;
            background-color: #fdfbf7;
            padding: 2.2rem 2rem;
            border: 1px solid rgba(111, 78, 55, 0.15);
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            height: 100%;
            cursor: grab;
          }
          .review-card-inner::before {
            content: "\\201C";
            font-family: "Noto Serif TC", serif;
            font-size: 3.5rem;
            color: #e1cbad;
            line-height: 0.6;
            display: block;
            margin-bottom: 0.5rem;
          }
          .review-card-text {
            font-family: "Noto Serif TC", serif !important;
            font-size: 1.05rem;
            color: #5d4037;
            line-height: 1.9;
            margin-bottom: 1.5rem;
            text-align: justify;
          }
          .review-card-byline {
            margin-top: auto;
            border-top: 1px solid rgba(111, 78, 55, 0.15);
            padding-top: 1rem;
          }
          .review-card-name {
            display: block;
            margin: 0 0 0.25rem 0;
            color: #6f4e37;
            font-size: 1.05rem;
            font-weight: bold;
          }
          .review-card-role {
            font-size: 0.85rem;
            color: #a88b75;
          }
          @media (max-width: 768px) {
            .review-card-inner {
              padding: 1.8rem 1.5rem;
            }
            .review-card-text {
              font-size: 0.95rem;
              line-height: 1.7;
              margin-bottom: 1.2rem;
            }
          }
        `}
      </style>
      <div className="container">
        <SectionKicker kicker="合作區 ・ TESTIMONIALS" title="反饋 Feedback" />

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
              <figure className="review-card-inner">
                <blockquote className="review-card-text">
                  {review.text}
                </blockquote>
                <figcaption className="review-card-byline">
                  <span className="review-card-name">{review.name}</span>
                  <span className="review-card-role">{review.role}</span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout title={PAGE_TITLES.home} description={PAGE_DESCRIPTIONS.home}>
      <main className={styles.mainContainer}>
        <AboutMe />
        <Skills />
        <Portfolio />
        <LatestNotes />
        <Testimonials />
      </main>
    </Layout>
  );
}
