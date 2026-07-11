import { describe, expect, it } from "vitest";

import { loadConfig } from "./config";

const apiToken = "12345678901234567890123456789012";

describe("loadConfig", () => {
  it("applies defaults around required API_TOKEN", () => {
    const config = loadConfig({
      API_TOKEN: apiToken,
    });

    expect(config).toMatchObject({
      host: "0.0.0.0",
      port: 3000,
      printerName: undefined,
      printerType: "epson",
      printerWidth: 48,
      printerDotWidth: 576,
      printerCharacterSet: "pc437_usa",
      printTimeoutMs: 15_000,
      allowRemoteImageUrls: false,
      maxRequestBodyBytes: 10 * 1024 * 1024,
      maxBlocksPerPrintJob: 50,
      maxTextCharsPerBlock: 5_000,
      maxRemoteImageBytes: 5 * 1024 * 1024,
      maxImageInputPixels: 25_000_000,
      remoteImageTimeoutMs: 5_000,
    });
  });

  it("parses numeric environment variables", () => {
    const config = loadConfig({
      API_TOKEN: apiToken,
      PORT: "8787",
      PRINTER_WIDTH: "42",
      PRINTER_DOT_WIDTH: "384",
      PRINT_TIMEOUT_MS: "5000",
      MAX_BLOCKS_PER_PRINT_JOB: "10",
      MAX_REQUEST_BODY_BYTES: "2048",
      MAX_TEXT_CHARS_PER_BLOCK: "100",
      MAX_REMOTE_IMAGE_BYTES: "1024",
      MAX_IMAGE_INPUT_PIXELS: "1000000",
      REMOTE_IMAGE_TIMEOUT_MS: "2500",
    });

    expect(config).toMatchObject({
      port: 8787,
      printerWidth: 42,
      printerDotWidth: 384,
      printTimeoutMs: 5_000,
      maxRequestBodyBytes: 2048,
      maxBlocksPerPrintJob: 10,
      maxTextCharsPerBlock: 100,
      maxRemoteImageBytes: 1024,
      maxImageInputPixels: 1_000_000,
      remoteImageTimeoutMs: 2_500,
    });
  });

  it("parses the remote image URL feature flag", () => {
    const config = loadConfig({
      API_TOKEN: apiToken,
      ALLOW_REMOTE_IMAGE_URLS: "true",
    });

    expect(config.allowRemoteImageUrls).toBe(true);
  });

  it("rejects short API tokens", () => {
    expect(() => loadConfig({ API_TOKEN: "short" })).toThrow();
  });
});
