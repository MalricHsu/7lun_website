const path = require("path");
const fs = require("fs");
const globby = require("globby");
const matter = require("gray-matter");

/**
 * 本地外掛：建置期掃描 docs/ frontmatter，
 * 挑出有 `date`（或 last_update.date）的最新 N 篇，
 * 透過 setGlobalData 提供給首頁「最新筆記」區。
 *
 * id 的算法刻意與 @docusaurus/plugin-content-docs 對齊：
 *   相對 docs 目錄、去副檔名、posix 斜線。
 */
module.exports = function recentDocsPlugin(context, options) {
  const { docsDir = "docs", limit = 3 } = options || {};
  const absDocsDir = path.resolve(context.siteDir, docsDir);

  return {
    name: "recent-docs",

    async loadContent() {
      const files = await globby(["**/*.md", "**/*.mdx"], {
        cwd: absDocsDir,
        absolute: true,
      });

      const entries = [];
      for (const file of files) {
        const { data } = matter(fs.readFileSync(file, "utf8"));
        const dateVal =
          data.date || (data.last_update && data.last_update.date);
        if (!dateVal) continue; // 沒日期 → 不列入「最新筆記」

        const id = path
          .relative(absDocsDir, file)
          .replace(/\\/g, "/")
          .replace(/\.mdx?$/, "");

        entries.push({
          id,
          title: data.title || id.split("/").pop(),
          date: String(dateVal),
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
      }

      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
      return { recent: entries.slice(0, limit) };
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData({ recent: content.recent });
    },
  };
};
