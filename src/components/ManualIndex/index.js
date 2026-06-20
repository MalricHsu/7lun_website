import React from "react";
import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./styles.module.css";

// 分類：folder = docs 下的資料夾名（用來判斷有無文章）；slug = 分類索引頁網址
const CATEGORIES = [
  { folder: "html-css", slug: "html--css", title: "HTML / CSS" },
  { folder: "javascript", slug: "javascript", title: "JavaScript" },
  { folder: "react", slug: "react", title: "React" },
  { folder: "vue", slug: "vuejs", title: "Vue" },
  { folder: "nodejs", slug: "nodejs", title: "Node.js" },
  { folder: "git", slug: "git", title: "Git" },
];

export default function ManualIndex() {
  const docsData = usePluginData("docusaurus-plugin-content-docs", "default");
  const version = docsData && docsData.versions && docsData.versions[0];
  const docs = (version && version.docs) || [];

  // 只要該資料夾底下有任何一篇文件，就視為「有文章」
  const hasArticles = (folder) =>
    docs.some((d) => d.id.startsWith(`${folder}/`));

  return (
    <>
      <div className={styles.header}>
        <span className={styles.kicker}>語法手冊 ・ HANDBOOK</span>
        <h1 className={styles.h1}>語法手冊</h1>
        <div className={styles.lead}>
          這裡記錄了我在前端開發過程中的技術積累與實戰心得。從基礎語法到框架應用，將那些踩過的坑與解法，淬鍊成隨時可查閱的知識庫。
        </div>
      </div>

      <ul className={styles.list}>
        {CATEGORIES.map((c, i) => {
          const num = String(i + 1).padStart(2, "0");
          const filled = hasArticles(c.folder);
          return (
            <li key={c.folder} className={styles.item}>
              {filled ? (
                <Link className={styles.row} to={`/docs/category/${c.slug}`}>
                  <span className={styles.num}>{num}</span>
                  <span className={styles.main}>
                    <span className={styles.title}>{c.title}</span>
                  </span>
                  <span className={styles.arrow}>→</span>
                </Link>
              ) : (
                <div className={`${styles.row} ${styles.rowDisabled}`}>
                  <span className={styles.num}>{num}</span>
                  <span className={styles.main}>
                    <span className={styles.title}>{c.title}</span>
                  </span>
                  <span className={styles.soon}>文章待更新</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className={styles.end}>
        — 持續更新中，每學到新東西就會在這裡留下足跡 —
      </div>
    </>
  );
}
