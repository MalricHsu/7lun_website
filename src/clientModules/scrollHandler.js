import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

if (ExecutionEnvironment.canUseDOM) {
  let ticking = false;

  const updateNavbar = () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      // 實作遲滯現象 (Hysteresis) 以解決閃退無限迴圈
      // 當往下捲動超過 100px 才縮小，回到頂端低於 10px 才放大
      // 這樣即使縮小改變了網頁高度，也不會立刻觸發「低於閾值」的判斷
      if (window.scrollY > 100) {
        navbar.classList.add("navbar--shrunk");
      } else if (window.scrollY <= 10) {
        navbar.classList.remove("navbar--shrunk");
      }
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}
