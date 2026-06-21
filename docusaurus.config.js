// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "記錄前端開發的生存軌跡。",
  tagline: "",
  favicon: "img/logo.png",
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;700&display=swap",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
  ],
  clientModules: [require.resolve("./src/clientModules/scrollHandler.js")],

  future: {
    v4: true,
  },

  // Vercel 部署設定
  url: "https://7lun-website.vercel.app",
  baseUrl: "/",

  organizationName: "MalricHsu",
  projectName: "7lun-workspace",
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: "ignore",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "zh-Hant",
    locales: ["zh-Hant"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
        },
        blog: {
          showReadingTime: true,
          onInlineTags: "warn",
          blogSidebarTitle: "最近文章",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  plugins: [["./plugins/recent-docs", { docsDir: "docs", limit: 3 }]],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/og-image.png",
      colorMode: {
        disableSwitch: true,
        defaultMode: "light",
      },
      navbar: {
        title: "7lun 的程式手冊",
        hideOnScroll: false,
        items: [
          { to: "/about", label: "關於7lun", position: "right" },
          { to: "/portfolio", label: "專案作品", position: "right" },
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "right",
            label: "語法手冊",
          },
          { to: "/blog", label: "生存日誌", position: "right" },
          {
            href: "https://github.com/MalricHsu",
            position: "right",
            className: "header-github-link",
            label: "GitHub",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            items: [
              { label: "關於7lun", to: "/about" },
              { label: "專案作品", to: "/portfolio" },
              { label: "語法手冊", to: "/docs/intro" },
              { label: "生存日誌", to: "/blog" },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 7lun 的程式手冊.`,
      },
      prism: {
        theme: prismThemes.github,
      },
    }),
};

export default config;
