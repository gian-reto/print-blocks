import { defineConfig } from "vitest/config";
import devServer from "@hono/vite-dev-server";
import { loadEnv } from "vite";
import nodeAdapter from "@hono/vite-dev-server/node";

const parsePort = (value: string | undefined) => {
  const port = Number.parseInt(value ?? "3000", 10);
  return Number.isFinite(port) && port >= 1 && port <= 65535 ? port : 3000;
};

const isAppSourceFile = (file: string) => {
  const normalizedFile = file.replaceAll("\\", "/");

  return (
    normalizedFile.includes("/src/") || normalizedFile.includes("/assets/")
  );
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      devServer({
        adapter: nodeAdapter,
        entry: "src/dev.ts",
        injectClientScript: true,
        handleHotUpdate: ({ file, server }) => {
          if (!isAppSourceFile(file)) {
            return;
          }

          server.moduleGraph.invalidateAll();
          server.hot.send({ type: "full-reload" });

          return [];
        },
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
