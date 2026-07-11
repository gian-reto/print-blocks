import { StreamableHTTPTransport } from "@hono/mcp";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { AppConfig } from "../config";
import type { PrintRequestSchema } from "../render/blocks/schema";
import type { PrintTransport } from "../print/types";
import { auth } from "../http/middleware";
import { bodyLimit } from "hono/body-limit";
import { createPrintBlocksMcpServer } from "../mcp/server";
import { createHash } from "node:crypto";
import { rateLimiter } from "hono-rate-limiter";

type RegisterMcpRouteOptions = {
  config: AppConfig;
  printRequestSchema: PrintRequestSchema;
  transport: PrintTransport;
};

const createRateLimitKey = (authorizationHeader: string | undefined) => {
  if (authorizationHeader === undefined) {
    return "anonymous";
  }

  return createHash("sha256").update(authorizationHeader).digest("hex");
};

export const registerMcpRoute = (
  app: OpenAPIHono,
  { config, printRequestSchema, transport }: RegisterMcpRouteOptions,
) => {
  if (!config.exposeMcp) {
    return;
  }

  if (config.mcpToken === undefined) {
    throw new Error("MCP_TOKEN is required when EXPOSE_MCP is enabled.");
  }

  const mcpServer = createPrintBlocksMcpServer({
    config,
    printRequestSchema,
    transport,
  });
  const mcpTransport = new StreamableHTTPTransport();

  app.use(
    "/mcp",
    rateLimiter({
      windowMs: 60_000,
      limit: 60,
      standardHeaders: "draft-7",
      keyGenerator: (c) => createRateLimitKey(c.req.header("authorization")),
    }),
    auth(config.mcpToken),
    bodyLimit({ maxSize: config.maxRequestBodyBytes }),
  );

  app.all("/mcp", async (c) => {
    if (!mcpServer.isConnected()) {
      await mcpServer.connect(mcpTransport);
    }

    return (await mcpTransport.handleRequest(c)) ?? c.body(null, 204);
  });
};
