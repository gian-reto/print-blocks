import {
  createPrintBlockSchema,
  type PrintRequestSchema,
} from "../render/blocks/schema";
import { packageInfo } from "../util/package-info";

type SchemaWithDef = {
  def: {
    options?: readonly SchemaWithDef[];
    shape?: {
      type?: {
        value?: unknown;
      };
    };
  };
};

const getBlockTypeValues = (schema: SchemaWithDef): string[] => {
  const typeValue = schema.def.shape?.type?.value;

  if (typeof typeValue === "string") {
    return [typeValue];
  }

  return schema.def.options?.flatMap(getBlockTypeValues) ?? [];
};

// Derive supported block types from the print block schema to ensure
// consistency with actual supported blocks.
export const supportedBlockTypes = Array.from(
  new Set(
    createPrintBlockSchema({
      allowRemoteImageUrls: true,
      maxTextCharsPerBlock: 1,
    }).def.options.flatMap((option) => getBlockTypeValues(option)),
  ),
);

export const simplePrintRequestExample = JSON.stringify(
  {
    blocks: [
      {
        type: "text",
        content: `Hello from ${packageInfo.name}`,
        align: "center",
        bold: true,
      },
    ],
  },
  null,
  2,
);

export const createMcpPrintRequestSchema = (
  printRequestSchema: PrintRequestSchema,
) =>
  printRequestSchema.describe(
    `Print request object. Must include a top-level blocks array. Each block must include a type discriminator. Supported block types are: ${supportedBlockTypes.join(", ")}. Example: ${simplePrintRequestExample}`,
  );

export type McpPrintRequestSchema = ReturnType<
  typeof createMcpPrintRequestSchema
>;

export const createToolResult = (
  data: Record<string, unknown>,
  options: { isError?: boolean } = {},
) => {
  const message = typeof data.message === "string" ? data.message : undefined;
  const text = message
    ? `${message}\n\n${JSON.stringify(data, null, 2)}`
    : JSON.stringify(data, null, 2);

  return {
    content: [
      {
        type: "text" as const,
        text,
      },
    ],
    structuredContent: data,
    ...(options.isError ? { isError: true } : {}),
  };
};

export const createMarkdownToolResult = (
  markdown: string,
  structuredContent: Record<string, unknown>,
  options: { isError?: boolean } = {},
) => ({
  content: [
    {
      type: "text" as const,
      text: markdown,
    },
  ],
  structuredContent,
  ...(options.isError ? { isError: true } : {}),
});
