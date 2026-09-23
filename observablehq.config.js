// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Vasily's Projects",

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

  // The path to the source root.
  root: "src",
  // header: "", // what to show in the header (HTML)
  sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: false, // activate search
  linkify: true, // convert URLs in Markdown to links
  typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
  footer: () => {
    return `
      <div class="footer">
        <span>Vasily Belousov</span>
        <a href="https://www.linkedin.com/in/vasilybelousov" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/vasilybels" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.are.na/vasily-belousov/channels" target="_blank" rel="noopener noreferrer">Are.na</a>
      </div>
    `;
  }
,
  pages: [
    {name: "NYC Sound Pollution Analysis", path: "/sonyc"}, 
  ]
};
