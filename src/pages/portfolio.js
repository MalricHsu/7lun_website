import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

function SectionKicker({ kicker, title }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.kicker}>{kicker}</span>
      <h2 className={styles.editorialTitle}>{title}</h2>
    </div>
  );

}

function ProjectCard({ project }) {
  return (
    <article className={styles.featureCard}>
      <div className={styles.featureImageWrap}>
        <img
          src={project.img}
          alt={project.title}
          className={styles.featureImg}
        />
      </div>
      <div className={styles.featureBody}>
        <span className={styles.featureCategory}>{project.category}</span>
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
          {project.github && (
            <>
              <Link to={project.github} className={styles.featureLink}>
                GitHub Repo ↗
              </Link>
              <span className={styles.featureSep}>・</span>
            </>
          )}
          {project.demo && (
            <>
              <Link to={project.demo} className={styles.featureLink}>
                Demo ↗
              </Link>
              <span className={styles.featureSep}>・</span>
            </>
          )}
          <Link to={project.link} className={styles.featureLink}>
            開發紀錄 ↗
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PortfolioPage() {
  // 團隊合作作品
  const teamProjects = [
    {
      title: "伴你在日常",
      category: "電商主題",
      desc: "專為家庭照顧者與專業人員打造的輔具電商平台。我們透過清楚的分類與友善設計，化解輔具選購的資訊焦慮。以「陪伴」為核心，期盼讓家人安全舒適，也讓照顧者擁有更多餘裕。",
      link: "/blog/withyourlife-project",
      img: require("@site/static/img/lifewithyou.png").default,
      tags: ["Vite", "Bootstrap 5", "SCSS", "GSAP", "leaflet", "Git", "GitHub"],
      github: "https://github.com/Duncanin/with_your_life",
      demo: "https://duncanin.github.io/with_your_life/",
    },
    {
      title: "YeStep 每一步，找回生活的呼吸",
      category: "檢索主題",
      desc: "以「把 Yes 變成 Step」為核心精神的步道資訊平台。專為忙碌上班族與親子家庭設計，鼓勵大眾跨出探索自然的第一步。透過直覺的檢索體驗，陪伴你走入山林，找回身心療癒的寧靜。",
      link: "/blog/yestep-project",
      img: require("@site/static/img/yestep.png").default,
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
      demo: "https://malrichsu.github.io/yestep/#/",
    },
  ];

  // 個人作品（之後新增：依上方格式填入物件即可）
  const personalProjects = [{
      title: "HexSchool 2026 - Nelson Blog",
      category: "部落格主題",
      desc: "使用 Nuxt 4 開發部落格專案，從 SSR 架構、資料取得到 SEO 設計，完整實作並紀錄開發過程中的踩雷與解法細節，都記錄在部落格中",
      link: "/blog/hexSchool-2026",
      img: require("@site/static/img/hexschool-2026.png").default,
      tags: ["Nuxt 4", "Vue 3", "@nuxt/content", "Pinia", "Bootstrap 5", "Sass", "Zod", "Axios", "Swiper"],
      github: "https://github.com/MalricHsu/hex-blog",
      demo: "https://hex-blog-nu.vercel.app/",
    },];

  return (
    <Layout title="專案作品" description="7lun 的前端專案展示">
      <main className={styles.mainContainer}>
        <div className="container">
          <header className={styles.pageHeader}>
            <span className={styles.kicker}>作品集 ・ PORTFOLIO</span>
            <h1 className={styles.pageTitle}>專案作品集</h1>
            <p className={styles.pageLead}>
              這裡紀錄了我從團隊協作到獨立開發的專案成果。不只是程式碼的堆疊，更是解決問題、提升使用者體驗的實戰軌跡。
            </p>
          </header>

          <section className={styles.portfolioGroup}>
            <SectionKicker kicker="團隊協作 ・ TEAM" title="團隊合作作品" />
            <div className={styles.featureGrid}>
              {teamProjects.map((project, idx) => (
                <ProjectCard key={idx} project={project} />
              ))}
            </div>
          </section>

          <section className={styles.portfolioGroup}>
            <SectionKicker kicker="個人專案 ・ PERSONAL" title="個人作品" />
            {personalProjects.length === 0 ? (
              <p className={styles.contentsEmpty}>個人作品準備中，敬請期待。</p>
            ) : (
              <div className={styles.featureGrid}>
                {personalProjects.map((project, idx) => (
                  <ProjectCard key={idx} project={project} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}
