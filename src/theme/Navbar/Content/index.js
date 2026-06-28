import React, { useEffect, useState } from "react";
import Content from "@theme-original/Navbar/Content";
import SearchBar from "@theme/SearchBar";
import styles from "./styles.module.css";

// 期數固定；日期每天自動帶當天
const ISSUE = "No.7";

export default function ContentWrapper(props) {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(new Date())
    );
  }, []);

  return (
    <>
      <span className={styles.ribbonDate}>{dateStr}</span>
      <span className={styles.ribbonIssue}>{ISSUE}</span>
      {/* 桌機：搜尋放在刊頭 NO.7 旁（樣式見 custom.css .navbar-ribbon-search） */}
      <span className="navbar-ribbon-search">
        <SearchBar />
      </span>
      <Content {...props} />
    </>
  );
}
