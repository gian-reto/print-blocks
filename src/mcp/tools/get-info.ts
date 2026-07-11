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
          // General limits
          maxBlocksPerPrintJob: `You can include up to ${config.maxBlocksPerPrintJob} blocks in a single print job.`,
          maxImageInputPixels: `The maximum number of pixels supported in a single \`image\` block is ${config.maxImageInputPixels}.`,
          maxRequestBodyBytes: `The maximum size for a print job request body (including encoded image bytes) is ${config.maxRequestBodyBytes} bytes.`,
          maxTextCharsPerBlock: `The maximum number of characters supported in a single \`text\` block is ${config.maxTextCharsPerBlock}.`,

          // Remote image URLs
          allowExternalImageUrls: config.allowRemoteImageUrls
            ? // Both base64-encoded image data and external image URLs are supported.
              `External image URLs are allowed in \`image\` blocks, so you can decide whether to send base64-encoded image data directly, or just an URL that will be fetched by the server.
            
            For an image block with a remote image URL, provide the \`"url"\` field:

            \`\`\`json
            {
              "type": "image",
              "url": "https://example.com/image.png"
              // ...other image block fields
            }
            \`\`\`

            For an image block with base64-encoded image data, provide the \`"data"\` field instead:

            \`\`\`json
            {
              "type": "image",
              "data": "base64-encoded-image-data"
              // ...other image block fields
            }
            \`\`\`
            
            Note:

            - Base64-encoded image data is generally preferred if you have the means to prepare and encode the image data beforehand, and most common formats are supported. 
            - Image URLs are supported for convenience, but are subject to additional restrictions, which means some non-standard URLs might be rejected.`
            : // Only base64-encoded image data is supported.
              `External image URLs are not allowed. To include images in print jobs, provide base64-encoded image data directly in the \`"data"\` field of \`image\` blocks.
            
            \`\`\`json
            {
              "type": "image",
              "data": "base64-encoded-image-data"
              // ...other image block fields
            }
            \`\`\`
            
            The server supports most common image formats.`,
          ...(config.allowRemoteImageUrls
            ? {
                maxRemoteImageBytes: `The maximum size for images loaded from remote URLs in an \`image\` block is ${config.maxRemoteImageBytes} bytes.`,
                remoteImageTimeoutMs: `The timeout for fetching images from remote URLs in an \`image\` block is ${config.remoteImageTimeoutMs} milliseconds.`,
              }
            : {}),
        },
        supportedBlocks: [...supportedBlockTypes],
      }),
  );
};
