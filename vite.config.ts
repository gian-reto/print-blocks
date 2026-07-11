import devServer from "@hono/vite-dev-server";
import nodeAdapter from "@hono/vite-dev-server/node";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const parsePort = (value: string | undefined) => {
  const port = Number.parseInt(value ?? "3000", 10);
  return Number.isFinite(port) && port >= 1 && port <= 65535 ? port : 3000;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      devServer({
        adapter: nodeAdapter,
        entry: "src/dev.ts",
        injectClientScript: false,
      }),
    ],
    server: {
      host: env.HOST ?? "0.0.0.0",
      port: parsePort(env.PORT),
    },
    ssr: {
      external: ["react", "react-dom"],
    },
    build: {
      copyPublicDir: false,
      emptyOutDir: true,
      outDir: "dist",
      ssr: "src/index.ts",
      target: "node24",
      rollupOptions: {
        output: {
          entryFileNames: "index.js",
        },
      },
    },
    test: {
      environment: "node",
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  };
});
