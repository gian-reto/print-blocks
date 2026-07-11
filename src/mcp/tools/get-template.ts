import { getPrintTemplateInfo, printTemplates } from "../templates";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createMarkdownToolResult } from "./helpers";
import { z } from "zod";

export const registerGetTemplateTool = (server: McpServer) => {
  server.registerTool(
    "get_template",
    {
      title: "Get a print template",
      description:
        "Return Markdown instructions and a JSON code block for one print template by id. Templates can be customized (or ignored entirely, if you want to build a print job from scratch or there's no suitable template).",
      inputSchema: z
        .object({
          id: z
            .union(printTemplates.map((template) => z.literal(template.id)))
            .describe("Template id returned by list_templates."),
        })
        .strip(),
      annotations: {
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
    },
    ({ id }) => {
      const template = getPrintTemplateInfo(id);
      const { markdown, ...templateInfo } = template;

      return createMarkdownToolResult(markdown, {
        ok: true,
        message:
          "Template loaded. The Markdown content includes instructions followed by a JSON code block containing the template in the shape accepted by the `print` tool.",
        templateInfo,
      });
    },
  );
};
