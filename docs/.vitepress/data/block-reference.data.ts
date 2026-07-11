import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { createPrintRequestSchema } from "../../../src/render/blocks/schema";
import { defaultPrintRequestSchemaOptions } from "../../../src/config";
import { defineLoader } from "vitepress";

type OpenApiSchema = {
  $ref?: string;
  allOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
  default?: unknown;
  description?: string;
  enum?: unknown[];
  example?: unknown;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  format?: string;
  items?: OpenApiSchema;
  maximum?: number;
  maxItems?: number;
  maxLength?: number;
  minimum?: number;
  minItems?: number;
  minLength?: number;
  nullable?: boolean;
  oneOf?: OpenApiSchema[];
  pattern?: string;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  type?: string;
};

export type BlockReferenceField = {
  description?: string;
  details: string[];
  fields: BlockReferenceField[];
  name: string;
  required: boolean;
  type: string;
  variants: BlockReferenceVariant[];
};

export type BlockReferenceVariant = {
  fields: BlockReferenceField[];
  label: string;
};

export type BlockReference = {
  componentName: string;
  example: Record<string, unknown>;
  fields: BlockReferenceField[];
  variants: BlockReferenceVariant[];
};

export type BlockReferenceData = {
  blocks: Record<string, BlockReference>;
};

const blockDefinitions = [
  { componentName: "TextBlock", page: "text", type: "text" },
  { componentName: "RowBlock", page: "row", type: "row" },
  { componentName: "LineBlock", page: "line", type: "line" },
  { componentName: "BrBlock", page: "br", type: "br" },
  { componentName: "BarcodeBlock", page: "barcode", type: "barcode" },
  { componentName: "QrCodeBlock", page: "qr-code", type: "qrcode" },
  { componentName: "ImageBlock", page: "image", type: "image" },
  { componentName: "TokenBlock", page: "token", type: "token" },
  { componentName: "ProgressBlock", page: "progress", type: "progress" },
  { componentName: "TimelineBlock", page: "timeline", type: "timeline" },
  { componentName: "HeatmapBlock", page: "heatmap", type: "heatmap" },
  {
    componentName: "LineChartBlock",
    page: "line-chart",
    type: "lineChart",
  },
  {
    componentName: "AreaChartBlock",
    page: "area-chart",
    type: "areaChart",
  },
  {
    componentName: "BarChartBlock",
    page: "bar-chart",
    type: "barChart",
  },
  {
    componentName: "StackedAreaChartBlock",
    page: "stacked-area-chart",
    type: "stackedAreaChart",
  },
] as const;

const getReferencedSchemaName = (ref: string) => ref.split("/").at(-1);

const mergeSchemas = (schemas: OpenApiSchema[]): OpenApiSchema =>
  schemas.reduce<OpenApiSchema>(
    (merged, schema) => ({
      ...merged,
      ...schema,
      properties: {
        ...merged.properties,
        ...schema.properties,
      },
      required: Array.from(
        new Set([...(merged.required ?? []), ...(schema.required ?? [])]),
      ),
    }),
    {},
  );

const resolveSchema = (
  schema: OpenApiSchema,
  components: Record<string, OpenApiSchema>,
  resolving = new Set<string>(),
): OpenApiSchema => {
  let resolvedSchema = schema;

  if (schema.$ref !== undefined) {
    const name = getReferencedSchemaName(schema.$ref);

    if (name === undefined || resolving.has(name)) {
      return schema;
    }

    const referencedSchema = components[name];

    if (referencedSchema === undefined) {
      throw new Error(
        `OpenAPI schema reference does not exist: ${schema.$ref}`,
      );
    }

    resolvedSchema = resolveSchema(
      referencedSchema,
      components,
      new Set([...resolving, name]),
    );
  }

  if (resolvedSchema.allOf === undefined) {
    return resolvedSchema;
  }

  const { allOf, ...schemaWithoutAllOf } = resolvedSchema;

  return mergeSchemas([
    schemaWithoutAllOf,
    ...allOf.map((item) => resolveSchema(item, components, resolving)),
  ]);
};

const formatValue = (value: unknown) => JSON.stringify(value) ?? String(value);

const getSchemaType = (
  schema: OpenApiSchema,
  components: Record<string, OpenApiSchema>,
): string => {
  const resolvedSchema = resolveSchema(schema, components);

  if (resolvedSchema.enum?.length === 1) {
    return formatValue(resolvedSchema.enum[0]);
  }

  const alternatives = resolvedSchema.oneOf ?? resolvedSchema.anyOf;

  if (alternatives !== undefined) {
    return Array.from(
      new Set(alternatives.map((item) => getSchemaType(item, components))),
    ).join(" | ");
  }

  if (resolvedSchema.type === "array") {
    const itemType =
      resolvedSchema.items === undefined
        ? "unknown"
        : getSchemaType(resolvedSchema.items, components);

    return `array<${itemType}>`;
  }

  if (resolvedSchema.type === undefined && resolvedSchema.nullable) {
    return "null";
  }

  const type = resolvedSchema.type ?? "object";

  return resolvedSchema.nullable ? `${type} | null` : type;
};

const getDetails = (schema: OpenApiSchema): string[] => {
  const details: string[] = [];

  if (schema.enum !== undefined && schema.enum.length > 1) {
    details.push(`Allowed: ${schema.enum.map(formatValue).join(", ")}`);
  }
  if (schema.default !== undefined) {
    details.push(`Default: ${formatValue(schema.default)}`);
  }
  if (schema.minimum !== undefined) {
    details.push(
      schema.exclusiveMinimum
        ? `Greater than: ${schema.minimum}`
        : `Minimum: ${schema.minimum}`,
    );
  }
  if (schema.maximum !== undefined) {
    details.push(
      schema.exclusiveMaximum
        ? `Less than: ${schema.maximum}`
        : `Maximum: ${schema.maximum}`,
    );
  }
  if (schema.minLength !== undefined) {
    details.push(`Minimum length: ${schema.minLength}`);
  }
  if (schema.maxLength !== undefined) {
    details.push(`Maximum length: ${schema.maxLength}`);
  }
  if (schema.minItems !== undefined) {
    details.push(`Minimum items: ${schema.minItems}`);
  }
  if (schema.maxItems !== undefined) {
    details.push(`Maximum items: ${schema.maxItems}`);
  }
  if (schema.format !== undefined) {
    details.push(`Format: ${schema.format}`);
  }
  if (schema.pattern !== undefined) {
    details.push(`Pattern: ${schema.pattern}`);
  }

  return details;
};

const getVariantLabel = (
  schema: OpenApiSchema,
  index: number,
  components: Record<string, OpenApiSchema>,
) => {
  const resolvedSchema = resolveSchema(schema, components);

  for (const propertyName of ["variant", "type"]) {
    const property = resolvedSchema.properties?.[propertyName];

    if (property?.enum?.length === 1) {
      return `${propertyName}: ${formatValue(property.enum[0])}`;
    }
  }

  return `Variant ${index + 1}`;
};

const getNestedSchema = (
  schema: OpenApiSchema,
  components: Record<string, OpenApiSchema>,
) => {
  const resolvedSchema = resolveSchema(schema, components);

  return resolvedSchema.type === "array" && resolvedSchema.items !== undefined
    ? resolveSchema(resolvedSchema.items, components)
    : resolvedSchema;
};

const createFields = (
  schema: OpenApiSchema,
  components: Record<string, OpenApiSchema>,
): BlockReferenceField[] => {
  const resolvedSchema = resolveSchema(schema, components);
  const requiredFields = new Set(resolvedSchema.required ?? []);

  return Object.entries(resolvedSchema.properties ?? {}).map(
    ([name, propertySchema]) => {
      const resolvedPropertySchema = resolveSchema(propertySchema, components);
      const nestedSchema = getNestedSchema(propertySchema, components);

      return {
        ...(resolvedPropertySchema.description === undefined
          ? {}
          : { description: resolvedPropertySchema.description }),
        details: getDetails(resolvedPropertySchema),
        fields: createFields(nestedSchema, components),
        name,
        required: requiredFields.has(name),
        type: getSchemaType(propertySchema, components),
        variants: createVariants(nestedSchema, components),
      };
    },
  );
};

const createVariants = (
  schema: OpenApiSchema,
  components: Record<string, OpenApiSchema>,
): BlockReferenceVariant[] => {
  const resolvedSchema = resolveSchema(schema, components);
  const alternatives = resolvedSchema.oneOf ?? resolvedSchema.anyOf;

  if (alternatives === undefined) {
    return [];
  }

  const objectAlternatives = alternatives.filter((alternative) => {
    const resolvedAlternative = resolveSchema(alternative, components);
    return (
      resolvedAlternative.type === "object" ||
      resolvedAlternative.properties !== undefined
    );
  });

  if (objectAlternatives.length !== alternatives.length) {
    return [];
  }

  return objectAlternatives.map((alternative, index) => ({
    fields: createFields(alternative, components),
    label: getVariantLabel(alternative, index, components),
  }));
};

const getGeneratedComponents = () => {
  const schema = createPrintRequestSchema(defaultPrintRequestSchemaOptions);
  const registry = new OpenAPIRegistry();
  registry.register("PrintRequest", schema);
  const generated = new OpenApiGeneratorV3(
    registry.definitions,
  ).generateComponents() as {
    components?: {
      schemas?: Record<string, OpenApiSchema>;
    };
  };
  const components = generated.components?.schemas;

  if (components === undefined) {
    throw new Error(
      "The print request schema did not generate OpenAPI components.",
    );
  }

  return components;
};

const getBlockExamples = (components: Record<string, OpenApiSchema>) => {
  const printRequestSchema = components.PrintRequest;

  if (printRequestSchema === undefined) {
    throw new Error(
      `The generated PrintRequest component is missing. Generated components: ${Object.keys(
        components,
      ).join(", ")}`,
    );
  }

  const resolvedRequestSchema = resolveSchema(printRequestSchema, components);
  const rawBlocksSchema = resolvedRequestSchema.properties?.blocks;
  const blocksSchema =
    rawBlocksSchema === undefined
      ? undefined
      : resolveSchema(rawBlocksSchema, components);
  const example = blocksSchema?.example;

  if (!Array.isArray(example)) {
    throw new Error("The PrintRequest blocks example is missing.");
  }

  return new Map(
    example.map((block) => {
      if (
        typeof block !== "object" ||
        block === null ||
        !("type" in block) ||
        typeof block.type !== "string"
      ) {
        throw new Error("The PrintRequest example contains an invalid block.");
      }

      return [block.type, block as Record<string, unknown>];
    }),
  );
};

const validateGeneratedBlocks = (
  components: Record<string, OpenApiSchema>,
  examples: Map<string, Record<string, unknown>>,
) => {
  const documentedComponents = new Set<string>(
    blockDefinitions.map(({ componentName }) => componentName),
  );
  const documentedTypes = new Set<string>(
    blockDefinitions.map(({ type }) => type),
  );
  const undocumentedComponents = Object.keys(components).filter(
    (name) => name.endsWith("Block") && !documentedComponents.has(name),
  );
  const undocumentedExamples = Array.from(examples.keys()).filter(
    (type) => !documentedTypes.has(type),
  );

  if (undocumentedComponents.length > 0 || undocumentedExamples.length > 0) {
    throw new Error(
      `Blocks are missing documentation: ${[
        ...undocumentedComponents,
        ...undocumentedExamples,
      ].join(", ")}`,
    );
  }
};

const validateBlockPages = (watchedFiles: string[]) => {
  const normalizedFiles = watchedFiles.map((file) =>
    file.replaceAll("\\", "/"),
  );
  const missingPages = blockDefinitions.filter(
    ({ page }) =>
      !normalizedFiles.some((file) => file.endsWith(`/docs/blocks/${page}.md`)),
  );

  if (missingPages.length > 0) {
    throw new Error(
      `Missing block documentation pages: ${missingPages
        .map(({ page }) => page)
        .join(", ")}`,
    );
  }
};

declare const data: BlockReferenceData;
export { data };

export default defineLoader({
  watch: [
    "../../../src/config.ts",
    "../../../src/render/blocks/**/schema.ts",
    "../../blocks/*.md",
  ],
  load(watchedFiles): BlockReferenceData {
    validateBlockPages(watchedFiles);

    const components = getGeneratedComponents();
    const examples = getBlockExamples(components);
    validateGeneratedBlocks(components, examples);
    const blocks = Object.fromEntries(
      blockDefinitions.map(({ componentName, type }) => {
        const schema = components[componentName];
        const example = examples.get(type);

        if (schema === undefined) {
          throw new Error(
            `The generated ${componentName} component is missing.`,
          );
        }
        if (example === undefined) {
          throw new Error(`The generated example for ${type} is missing.`);
        }

        return [
          type,
          {
            componentName,
            example,
            fields: createFields(schema, components),
            variants: createVariants(schema, components),
          },
        ];
      }),
    );

    return { blocks };
  },
});
