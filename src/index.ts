import { loadConfig, loadEnvFile } from "./config";

import { createApp } from "./app";
import { packageInfo } from "./util/package-info";
import { serve } from "@hono/node-server";

loadEnvFile();

const config = loadConfig();
const app = createApp({ config });

const server = serve(
  {
    fetch: app.fetch,
    hostname: config.host,
    port: config.port,
  },
  (info) => {
    console.info(
      `${packageInfo.name} (v${packageInfo.version}) listening on http://${info.address}:${info.port}`,
    );
  },
);

const gracefulShutdown = () => {
  server.close((error) => {
    if (error !== undefined) {
      console.error(error);
      process.exit(1);
    }

    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
