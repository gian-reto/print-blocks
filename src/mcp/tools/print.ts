import {
  createToolResult,
  simplePrintRequestExample,
  type McpPrintRequestSchema,
} from "./helpers";

import type { AppConfig } from "../../config";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PrintError } from "../../print/error";
import type { PrintTransport } from "../../print/types";
import { renderPrintRequest } from "../../print/print-job";

type RegisterPrintToolOptions = {
  config: AppConfig;
  inputSchema: McpPrintRequestSchema;
  transport: PrintTransport;
};

export const registerPrintTool = (
  server: McpServer,
  { config, inputSchema, transport }: RegisterPrintToolOptions,
) => {
  server.registerTool(
    "print",
    {
      title: "Print content to a thermal printer",
      description:
        "Renders the given print instructions to ESC/POS bytes and prints them on a thermal printer. Make sure to follow the request schema. If there is an error, the Zod error tree will be included in the response to help you figure out which fields need to be adjusted. Simple example: " +
        simplePrintRequestExample,
      inputSchema,
    },
    async (input) => {
      let data: Uint8Array;

      try {
        data = await renderPrintRequest(input.blocks, config);
      } catch {
        return createToolResult(
          {
            ok: false,
            printed: false,
            error: {
              message: "Failed to render print job.",
            },
            message:
              "The print request was valid, but rendering it to ESC/POS bytes failed. This means the request was well-formed and passed schema validation, but some part of the content likely couldn't be translated into printer commands. This is usually solved by simplifying the print request, e.g. using less complex characters or images.",
          },
          { isError: true },
        );
      }

      try {
        await transport.print(data);
      } catch (error) {
        return createToolResult(
          {
            ok: false,
            printed: false,
            error: {
              message: "Failed to print job.",
              ...(error instanceof PrintError && error.stderr
                ? { stderr: error.stderr }
                : {}),
            },
            message:
              "The print request rendered successfully, but submitting it to the configured printer failed. This likely means the printer is not properly configured or connected on the server side. Retrying the same request might be successful, but if the issue persists, you should probably give up trying to print for the moment.",
          },
          { isError: true },
        );
      }

      return createToolResult({
        ok: true,
        printed: true,
        blockCount: input.blocks.length,
        renderedBytes: data.length,
        message:
          "Print job rendered correctly and was submitted to the configured printer successfully.",
      });
    },
  );
};
