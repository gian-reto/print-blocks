import BlockReference from "./components/BlockReference.vue";
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("BlockReference", BlockReference);
  },
} satisfies Theme;
