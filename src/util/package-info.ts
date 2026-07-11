import packageJson from "../../package.json" with { type: "json" };

export const packageInfo = {
  name: packageJson.name,
  version: packageJson.version,
} as const;
