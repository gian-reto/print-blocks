import { config as loadDotenv } from "dotenv";
import type { CharacterSet, PrinterType } from "react-thermal-printer";
import { z } from "zod";

export const printerTypeValues = [
  "epson",
  "star",
] as const satisfies readonly PrinterType[];

export const characterSetValues = [
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
  host: string;
  port: number;
  printerName: string | undefined;
  printerType: PrinterType;
  printerWidth: number;
  printerCharacterSet: CharacterSet;
  printTimeoutMs: number;
  apiToken: string;
  maxBlocksPerPrintJob: number;
  maxTextCharsPerBlock: number;
};

const emptyStringToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

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
    HOST: stringFromEnv("0.0.0.0"),
    PORT: portFromEnv,
    PRINTER_NAME: optionalStringFromEnv,
    PRINTER_TYPE: z.preprocess(
      (value) => emptyStringToUndefined(value) ?? "epson",
      z.enum(printerTypeValues),
    ),
    PRINTER_WIDTH: integerFromEnv(48),
    PRINTER_CHARACTER_SET: z.preprocess(
      (value) => emptyStringToUndefined(value) ?? "pc437_usa",
      z.enum(characterSetValues),
    ),
    PRINT_TIMEOUT_MS: integerFromEnv(15_000),
    API_TOKEN: z.string().min(32),
    MAX_BLOCKS_PER_PRINT_JOB: integerFromEnv(50),
    MAX_TEXT_CHARS_PER_BLOCK: integerFromEnv(5_000),
  })
  .passthrough();

export const loadEnvFile = () => {
  loadDotenv({ override: false });
};

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => {
  const parsedEnv = envSchema.parse(env);

  return {
    host: parsedEnv.HOST,
    port: parsedEnv.PORT,
    printerName: parsedEnv.PRINTER_NAME,
    printerType: parsedEnv.PRINTER_TYPE,
    printerWidth: parsedEnv.PRINTER_WIDTH,
    printerCharacterSet: parsedEnv.PRINTER_CHARACTER_SET,
    printTimeoutMs: parsedEnv.PRINT_TIMEOUT_MS,
    apiToken: parsedEnv.API_TOKEN,
    maxBlocksPerPrintJob: parsedEnv.MAX_BLOCKS_PER_PRINT_JOB,
    maxTextCharsPerBlock: parsedEnv.MAX_TEXT_CHARS_PER_BLOCK,
  };
};
