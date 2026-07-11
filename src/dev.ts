import { createApp } from "./app";
import { loadConfig, loadEnvFile } from "./config";

loadEnvFile();

const config = loadConfig();
const app = createApp({ config });

export default app;
