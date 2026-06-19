---
sidebar_position: 1
slug: /intro
title: 語法手冊
hide_title: true
---

<div style={{ padding: '2rem 0', borderBottom: '1px solid var(--ifm-color-emphasis-200)', marginBottom: '2rem' }}>
  <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)', marginBottom: '1rem' }}>語法手冊</h1>
  <p style={{ fontSize: '1.1rem', color: 'var(--ifm-color-emphasis-700)', maxWidth: '800px', lineHeight: '1.6' }}>
    這裡記錄了我在前端開發過程中的技術積累與實戰心得。<br />
    從基礎語法到框架應用，將那些踩過的坑與解法，淬鍊成隨時可查閱的知識庫。
  </p>
</div>

<style>
{`
  .intro-card {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    padding: 1.5rem;
    border: 1px solid var(--ifm-color-emphasis-200);
    border-radius: 8px;
    background-color: var(--ifm-card-background-color);
    text-decoration: none !important;
    color: inherit !important;
    transition: all 0.3s ease;
  }
  .intro-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(111, 78, 55, 0.1);
    border-color: var(--ifm-color-primary);
  }
  .intro-card div > span:first-child {
    transition: color 0.3s ease;
  }
`}
</style>

<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <li>
    <a href="/7lun-workspace/docs/category/html--css" className="intro-card">
      <div style={{ fontSize: '1.75rem', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>
        <i className="bi bi-filetype-html"></i>
      </div>
      <div>
        <span style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', display: 'block' }}>HTML / CSS</span>
        <span style={{ margin: 0, display: 'block', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>網頁基礎結構與樣式，包含切版技巧、RWD 響應式設計、Flexbox、Grid 佈局等實戰筆記。</span>
      </div>
    </a>
  </li>

  <li>
    <a href="/7lun-workspace/docs/category/javascript" className="intro-card">
      <div style={{ fontSize: '1.75rem', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>
        <i className="bi bi-filetype-js"></i>
      </div>
      <div>
        <span style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', display: 'block' }}>JavaScript</span>
        <span style={{ margin: 0, display: 'block', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>語法核心概念、DOM 操作、非同步處理 (Promise/async)、ES6+ 特性與常用陣列方法。</span>
      </div>
    </a>
  </li>

  <li>
    <a href="/7lun-workspace/docs/category/react" className="intro-card">
      <div style={{ fontSize: '1.75rem', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>
        <i className="bi bi-filetype-jsx"></i>
      </div>
      <div>
        <span style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', display: 'block' }}>React</span>
        <span style={{ margin: 0, display: 'block', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>元件生命週期、Hooks 原理與應用、狀態管理 (Redux/Context)、React Router 路由設定。</span>
      </div>
    </a>
  </li>

  <li>
    <a href="/7lun-workspace/docs/category/vue" className="intro-card">
      <div style={{ fontSize: '1.75rem', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>
        <i className="bi bi-layers"></i>
      </div>
      <div>
        <span style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', display: 'block' }}>Vue.js</span>
        <span style={{ margin: 0, display: 'block', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>自學 Vue 3 的心路歷程，包含 Composition API、響應式原理、生命週期與元件間的溝通。</span>
      </div>
    </a>
  </li>

  <li>
    <a href="/7lun-workspace/docs/category/nodejs" className="intro-card">
      <div style={{ fontSize: '1.75rem', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>
        <i className="bi bi-server"></i>
      </div>
      <div>
        <span style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', display: 'block' }}>Node.js</span>
        <span style={{ margin: 0, display: 'block', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>後端基礎概念、Express 框架實作、RESTful API 設計、CORS 處理與資料庫串接。</span>
      </div>
    </a>
  </li>

  <li>
    <a href="/7lun-workspace/docs/category/git" className="intro-card">
      <div style={{ fontSize: '1.75rem', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>
        <i className="bi bi-git"></i>
      </div>
      <div>
        <span style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', display: 'block' }}>Git</span>
        <span style={{ margin: 0, display: 'block', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>版本控制核心指令、分支合併策略、衝突解決、GitHub 協作流程與版本回退技巧。</span>
      </div>
    </a>
  </li>
</ul>

<div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', color: 'var(--ifm-color-emphasis-500)', fontSize: '0.9rem', letterSpacing: '1px' }}>
  — 持續更新中，每學到新東西就會在這裡留下足跡 —
</div>
