// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "All dashboards",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],

  // Site-wide stylesheet (must @import observablehq:default.css to keep the theme).
  style: "custom-style.css",

  globalStylesheets: [
    "https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Text:ital@0;1&display=swap"
  ],

  // The path to the source root.
  root: "src",
  // header: "", // what to show in the header (HTML)
  sidebar: false, // whether to show the sidebar
  toc: false, // whether to show the table of contents
  pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: false, // activate search
  linkify: true, // convert URLs in Markdown to links
  typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
  footer: () => {
    return `
      <div class="footer">
        <a href="https://www.linkedin.com/in/vasilybelousov" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/vasilybels" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    `;
  }
,
  pages: [
    {name: "SONYC visualizations", path: "/sonyc"}, 
  ]
};
