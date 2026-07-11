import {
  registerGetInfoTool,
  registerGetTemplateTool,
  registerListTemplatesTool,
  registerPrintTool,
} from "./tools";

import type { AppConfig } from "../config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PrintRequestSchema } from "../render/blocks/schema";
import type { PrintTransport } from "../print/types";
import { createMcpPrintRequestSchema } from "./helpers";
import { packageInfo } from "../util/package-info";

type CreatePrintBlocksMcpServerOptions = {
  config: AppConfig;
  printRequestSchema: PrintRequestSchema;
  transport: PrintTransport;
};

export const createPrintBlocksMcpServer = ({
  config,
  printRequestSchema,
  transport,
}: CreatePrintBlocksMcpServerOptions) => {
  const mcpPrintRequestSchema = createMcpPrintRequestSchema(printRequestSchema);

  const server = new McpServer({
    name: packageInfo.name,
    version: packageInfo.version,
  });

  registerGetInfoTool(server, config);
  registerGetTemplateTool(server);
  registerListTemplatesTool(server);
  registerPrintTool(server, {
    config,
    inputSchema: mcpPrintRequestSchema,
    transport,
  });

  return server;
};
