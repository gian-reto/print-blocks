import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createToolResult } from "./helpers";
import { getPrintTemplateSummaries } from "../templates";

export const registerListTemplatesTool = (server: McpServer) => {
  server.registerTool(
    "list_templates",
    {
      title: "List print templates",
      description: "List available print template ids and short descriptions.",
      annotations: {
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
    },
    () =>
      createToolResult({
        ok: true,
        message:
          "Templates listed. Call `get_template` with a template id to retrieve Markdown instructions and the template's JSON structure. Templates are optional starting points; you may ignore them and submit any custom print request that matches the schema.",
        templates: getPrintTemplateSummaries(),
      }),
  );
};
