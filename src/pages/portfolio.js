import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

function PortfolioHeader() {
  return (
    <div className="container" style={{ padding: "4rem 1rem" }}>
      <h1 className={styles.sectionTitle} style={{ textAlign: "left" }}>7Lun專案作品集</h1>
      <p className={styles.description} style={{ textAlign: "left", lineHeight: "1.8" }}>
        這裡紀錄了我從零開始，一步步打磨出的專案成果。
        不只是程式碼的堆疊，更是解決問題、提升使用者體驗的實戰軌跡。
      </p>
    </div>
  );
}

export default function PortfolioPage() {
   const projects = [
    {
      title: "伴你在日常",
      category: "電商主題",
      desc: "專為家庭照顧者與專業人員打造的輔具電商平台。我們透過清楚的分類與友善設計，化解輔具選購的資訊焦慮。以「陪伴」為核心，期盼讓家人安全舒適，也讓照顧者擁有更多餘裕。",
      link: "/blog/withyourlife-project",
      img: require("@site/static/img/lifewithyou.png").default,
      tags: ["Vite", "Bootstrap 5", "SCSS", "GSAP", "leaflet", "Git", "GitHub"],
      github: "https://github.com/Duncanin/with_your_life",
      demo: "https://duncanin.github.io/with_your_life/"
    },
    {
      title: "YeStep 每一步，找回生活的呼吸",
      category: "檢索主題",
      desc: "以「把 Yes 變成 Step」為核心精神的步道資訊平台。專為忙碌上班族與親子家庭設計，鼓勵大眾跨出探索自然的第一步。透過直覺的檢索體驗，陪伴你走入山林，找回身心療癒的寧靜。",
      link: "/blog/yestep-project",
      img: require("@site/static/img/yestep.png").default,
      tags: ["Vite", "React", "JavaScript", "Bootstrap 5", "SCSS", "Swiper", "Lottie", "Chart.js", "Axios", "Git", "GitHub"],
      github: "https://github.com/MalricHsu/yestep",
      demo: "https://malrichsu.github.io/yestep/#/"
    },
  ];

  return (
    <Layout title="專案作品" description="7lun 的前端專案展示">
      <main className={styles.mainContainer} style={{ paddingTop: "0" }}>
        <PortfolioHeader />
        <div className="container">
          <div className={styles.projectFlexContainer}>
            {projects.map((project, idx) => (
              <Link
                key={idx}
                to={project.link}
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
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.desc}</p>
                  <div className={styles.tagGroup}>
                    {project.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className={styles.projectLinkText}>
                    查看專案細節 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
