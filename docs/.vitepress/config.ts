import { defineConfig } from "vitepress";

export default defineConfig({
  base: process.env.VITEPRESS_BASE ?? "/",
  title: "print-blocks",
  description:
    "Print structured documents on ESC/POS thermal printers over HTTP or MCP.",
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Blocks", link: "/blocks/" },
      { text: "API", link: "/api" },
      { text: "MCP", link: "/mcp" },
      {
        text: "GitHub",
        link: "https://github.com/gian-reto/print-blocks",
      },
    ],
    outline: [2, 3],
    search: {
      provider: "local",
    },
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting started", link: "/guide/getting-started" },
            { text: "Core concepts", link: "/guide/core-concepts" },
            { text: "Configuration", link: "/guide/configuration" },
          ],
        },
      ],
      "/blocks/": [
        {
          text: "Block reference",
          items: [{ text: "Overview", link: "/blocks/" }],
        },
        {
          text: "Text and layout",
          items: [
            { text: "Text", link: "/blocks/text" },
            { text: "Row", link: "/blocks/row" },
            { text: "Line", link: "/blocks/line" },
            { text: "Line break", link: "/blocks/br" },
          ],
        },
        {
          text: "Codes and media",
          items: [
            { text: "Barcode", link: "/blocks/barcode" },
            { text: "QR code", link: "/blocks/qr-code" },
            { text: "Image", link: "/blocks/image" },
          ],
        },
        {
          text: "Status and structure",
          items: [
            { text: "Token", link: "/blocks/token" },
            { text: "Progress", link: "/blocks/progress" },
            { text: "Timeline", link: "/blocks/timeline" },
          ],
        },
        {
          text: "Data visualization",
          items: [
            { text: "Heatmap", link: "/blocks/heatmap" },
            { text: "Line chart", link: "/blocks/line-chart" },
            { text: "Area chart", link: "/blocks/area-chart" },
            { text: "Bar chart", link: "/blocks/bar-chart" },
            {
              text: "Stacked area chart",
              link: "/blocks/stacked-area-chart",
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/gian-reto/print-blocks",
      },
    ],
  },
});
