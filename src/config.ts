import { config as loadDotenv } from "dotenv";
import type { CharacterSet, PrinterType } from "react-thermal-printer";
import { z } from "zod";

const printerTypeValues = [
  "epson",
  "star",
] as const satisfies readonly PrinterType[];

const printerCharacterSetValues = [
  "pc437_usa",
  "pc850_multilingual",
  "pc860_portuguese",
  "pc863_canadian_french",
  "pc865_nordic",
  "pc851_greek",
  "pc853_turkish",
  "pc857_turkish",
  "pc737_greek",
  "iso8859_7_greek",
  "wpc1252",
  "pc866_cyrillic2",
  "pc852_latin2",
  "slovenia",
  "pc858_euro",
  "pc874_thai",
  "pc720_arabic",
  "wpc775_baltic_rim",
  "pc855_cyrillic",
  "pc861_icelandic",
  "pc862_hebrew",
  "pc864_arabic",
  "pc869_greek",
  "iso8859_2_latin2",
  "iso8859_15_latin9",
  "pc1098_farsi",
  "pc1118_lithuanian",
  "pc1119_lithuanian",
  "pc1125_ukrainian",
  "wpc1250_latin2",
  "wpc1251_cyrillic",
  "wpc1253_greek",
  "wpc1254_turkish",
  "wpc1255_hebrew",
  "wpc1256_arabic",
  "wpc1257_baltic_rim",
  "wpc1258_vietnamese",
  "kz1048_kazakhstan",
  "japan",
  "korea",
  "china",
  "hk_tw",
] as const satisfies readonly CharacterSet[];

export type AppConfig = {
  // Server
  host: string;
  port: number;

  // Printer
  printerCharacterSet: CharacterSet;
  printerDotWidth: number;
  printerName: string | undefined;
  printerType: PrinterType;
  printerWidth: number;
  printTimeoutMs: number;

  // API
  apiToken: string;
  exposeDocs: boolean;
  exposeLlmsTxt: boolean;
  exposeMcp: boolean;
  mcpToken: string | undefined;

  // Limits and features
  allowRemoteImageUrls: boolean;
  maxBlocksPerPrintJob: number;
  maxImageInputPixels: number;
  maxRemoteImageBytes: number;
  maxRequestBodyBytes: number;
  maxTextCharsPerBlock: number;
  remoteImageTimeoutMs: number;
};

const emptyStringToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

const booleanFromEnv = (defaultValue: boolean) =>
  z.preprocess((value) => {
    const normalizedValue = emptyStringToUndefined(value);

    if (normalizedValue === undefined) {
      return defaultValue;
    }

    if (typeof normalizedValue !== "string") {
      return normalizedValue;
    }

    const booleanString = normalizedValue.trim().toLowerCase();

    if (["1", "true", "yes", "on"].includes(booleanString)) {
      return true;
    }

    if (["0", "false", "no", "off"].includes(booleanString)) {
      return false;
    }

    return normalizedValue;
  }, z.boolean());

const integerFromEnv = (defaultValue: number) =>
  z.preprocess((value) => {
    const normalizedValue = emptyStringToUndefined(value);
    return normalizedValue === undefined
      ? defaultValue
      : Number(normalizedValue);
  }, z.number().int().positive());

const portFromEnv = z.preprocess((value) => {
  const normalizedValue = emptyStringToUndefined(value);
  return normalizedValue === undefined ? 3000 : Number(normalizedValue);
}, z.number().int().min(1).max(65535));

const optionalStringFromEnv = z.preprocess(
  emptyStringToUndefined,
  z.string().min(1).optional(),
);

const stringFromEnv = (defaultValue: string) =>
  z.preprocess(
    (value) => emptyStringToUndefined(value) ?? defaultValue,
    z.string().min(1),
  );

const envSchema = z
  .object({
    // Server
    HOST: stringFromEnv("0.0.0.0"),
    PORT: portFromEnv,

    // Printer
    PRINT_TIMEOUT_MS: integerFromEnv(15_000),
    PRINTER_CHARACTER_SET: z.preprocess(
      (value) => emptyStringToUndefined(value) ?? "pc437_usa",
      z.enum(printerCharacterSetValues),
    ),
    PRINTER_DOT_WIDTH: integerFromEnv(576),
    PRINTER_NAME: optionalStringFromEnv,
    PRINTER_TYPE: z.preprocess(
      (value) => emptyStringToUndefined(value) ?? "epson",
      z.enum(printerTypeValues),
    ),
    PRINTER_WIDTH: integerFromEnv(48),

    // API
    API_TOKEN: z.string().min(32),
    EXPOSE_DOCS: booleanFromEnv(false),
    EXPOSE_LLMS_TXT: booleanFromEnv(false),
    EXPOSE_MCP: booleanFromEnv(false),
    MCP_TOKEN: optionalStringFromEnv,

    // Limits and features
    ALLOW_REMOTE_IMAGE_URLS: booleanFromEnv(false),
    MAX_BLOCKS_PER_PRINT_JOB: integerFromEnv(50),
    MAX_IMAGE_INPUT_PIXELS: integerFromEnv(25_000_000),
    MAX_REMOTE_IMAGE_BYTES: integerFromEnv(5 * 1024 * 1024),
    MAX_REQUEST_BODY_BYTES: integerFromEnv(10 * 1024 * 1024),
    MAX_TEXT_CHARS_PER_BLOCK: integerFromEnv(5_000),
    REMOTE_IMAGE_TIMEOUT_MS: integerFromEnv(5_000),
  })
  .superRefine((env, ctx) => {
    if (!env.EXPOSE_MCP) {
      return;
    }

    if (env.MCP_TOKEN === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "MCP_TOKEN is required when EXPOSE_MCP is enabled.",
        path: ["MCP_TOKEN"],
      });
      return;
    }

    if (env.MCP_TOKEN.length < 32) {
      ctx.addIssue({
        code: "custom",
        message: "MCP_TOKEN must contain at least 32 characters.",
        path: ["MCP_TOKEN"],
      });
    }
  })
  .passthrough();

export const loadEnvFile = () => {
  loadDotenv({ override: false });
};

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => {
  const parsedEnv = envSchema.parse(env);

  return {
    // Server
    host: parsedEnv.HOST,
    port: parsedEnv.PORT,

    // Printer
    printerCharacterSet: parsedEnv.PRINTER_CHARACTER_SET,
    printerDotWidth: parsedEnv.PRINTER_DOT_WIDTH,
    printerName: parsedEnv.PRINTER_NAME,
    printerType: parsedEnv.PRINTER_TYPE,
    printerWidth: parsedEnv.PRINTER_WIDTH,
    printTimeoutMs: parsedEnv.PRINT_TIMEOUT_MS,

    // API
    apiToken: parsedEnv.API_TOKEN,
    exposeDocs: parsedEnv.EXPOSE_DOCS,
    exposeLlmsTxt: parsedEnv.EXPOSE_LLMS_TXT,
    exposeMcp: parsedEnv.EXPOSE_MCP,
    mcpToken: parsedEnv.MCP_TOKEN,

    // Limits and features
    allowRemoteImageUrls: parsedEnv.ALLOW_REMOTE_IMAGE_URLS,
    maxBlocksPerPrintJob: parsedEnv.MAX_BLOCKS_PER_PRINT_JOB,
    maxImageInputPixels: parsedEnv.MAX_IMAGE_INPUT_PIXELS,
    maxRemoteImageBytes: parsedEnv.MAX_REMOTE_IMAGE_BYTES,
    maxRequestBodyBytes: parsedEnv.MAX_REQUEST_BODY_BYTES,
    maxTextCharsPerBlock: parsedEnv.MAX_TEXT_CHARS_PER_BLOCK,
    remoteImageTimeoutMs: parsedEnv.REMOTE_IMAGE_TIMEOUT_MS,
  };
};
