import React from "react";
import PrimaryMenu from "@theme-original/Navbar/MobileSidebar/PrimaryMenu";
import SearchBar from "@theme/SearchBar";

// 手機：在漢堡選單最上方（關於 About 之上）插入搜尋框
// 樣式見 custom.css .navbar-drawer-search
export default function PrimaryMenuWrapper(props) {
  return (
    <>
      <div className="navbar-drawer-search">
        <SearchBar />
      </div>
      <PrimaryMenu {...props} />
    </>
  );
}
