import { createToolResult, supportedBlockTypes } from "./helpers";

import type { AppConfig } from "../../config";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { packageInfo } from "../../util/package-info";

export const registerGetInfoTool = (server: McpServer, config: AppConfig) => {
  server.registerTool(
    "get_info",
    {
      title: "Get printer information",
      description:
        "Return the configured printer settings, service limits, supported block types, and template usage guidance.",
      annotations: {
        idempotentHint: true,
        openWorldHint: false,
        readOnlyHint: true,
      },
    },
    () =>
      createToolResult({
        ok: true,
        message: `Printer information loaded.

          # How to use

          Submit print jobs using the \`print\` tool, providing a JSON body that conforms to:

          \`\`\`json
          {
            "blocks": [
              // Array of blocks to print, consult schema for details.
            ]
          }
          \`\`\`

          - You can include any combination of supported block types and as many blocks as needed in a single print job, up to the configured limits. The thermal printer will automatically cut the paper after each print job.
          - Templates are available, and are solid starting points you can build upon. Use \`list_templates\` to list template ids and descriptions first, then call \`get_template\` with a template id to view its instructions and JSON contents.
          - Use the \`print\` tool to submit an actual print job. If there are any errors in the supplied JSON, the entire Zod error tree will be included in the response to help you figure out which fields need to be adjusted.`,
        server: {
          name: packageInfo.name,
          version: packageInfo.version,
        },
        printer: {
          name: config.printerName ?? null,
          type: config.printerType,
          width: config.printerWidth,
          characterSet: config.printerCharacterSet,
        },
        limits: {
          maxBlocksPerPrintJob: config.maxBlocksPerPrintJob,
          maxTextCharsPerBlock: config.maxTextCharsPerBlock,
          maxRequestBodyBytes: config.maxRequestBodyBytes,
        },
        supportedBlocks: [...supportedBlockTypes],
      }),
  );
};
