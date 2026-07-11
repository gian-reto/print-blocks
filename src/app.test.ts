import { describe, expect, it } from "vitest";

import type { AppConfig } from "./config";
import type { PrintTransport } from "./print/types";
import { createApp } from "./app";
import status from "http-status";

const apiToken = "12345678901234567890123456789012";

const config: AppConfig = {
  host: "127.0.0.1",
  port: 3000,
  printerName: "receipt-printer",
  printerType: "epson",
  printerWidth: 48,
  printerCharacterSet: "pc437_usa",
  printTimeoutMs: 15_000,
  apiToken,
  exposeDocs: true,
  exposeLlmsTxt: true,
  exposeMcp: false,
  mcpToken: undefined,
  maxRequestBodyBytes: 10 * 1024 * 1024,
  maxBlocksPerPrintJob: 50,
  maxTextCharsPerBlock: 5_000,
};

const createRecordingTransport = () => {
  const jobs: Uint8Array[] = [];
  const transport: PrintTransport = {
    print: async (data) => {
      jobs.push(data);
    },
  };

  return { jobs, transport };
};

const printRequest = (body: unknown, token = apiToken) => ({
  method: "POST",
  headers: {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
  },
  body: JSON.stringify(body),
});

describe("app", () => {
  it("prints valid requests", async () => {
    const { jobs, transport } = createRecordingTransport();
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: transport,
    });

    const response = await app.request(
      "/print",
      printRequest({
        blocks: [{ type: "text", content: "Hello", align: "center" }],
      }),
    );

    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(response.status).toBe(status.OK);
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.length).toBeGreaterThan(0);
  });

  it("rejects requests without bearer auth", async () => {
    const { jobs, transport } = createRecordingTransport();
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: transport,
    });

    const response = await app.request("/print", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ blocks: [{ type: "text", content: "Hello" }] }),
    });

    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { message: "Unauthorized" },
    });
    expect(response.status).toBe(status.UNAUTHORIZED);
    expect(jobs).toHaveLength(0);
  });

  it("rejects requests without a JSON content type", async () => {
    const { jobs, transport } = createRecordingTransport();
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: transport,
    });

    const response = await app.request("/print", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ blocks: [{ type: "text", content: "Hello" }] }),
    });

    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: {
        message: "Request must conform to Content-Type: application/json",
      },
    });
    expect(response.status).toBe(status.UNSUPPORTED_MEDIA_TYPE);
    expect(jobs).toHaveLength(0);
  });

  it("returns validation issues for invalid payloads", async () => {
    const { jobs, transport } = createRecordingTransport();
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: transport,
    });

    const response = await app.request(
      "/print",
      printRequest({ blocks: [{ type: "text", content: "" }] }),
    );
    const body = await response.json();

    expect(response.status).toBe(status.BAD_REQUEST);
    expect(body).toMatchObject({
      ok: false,
      error: {
        // We expect a Zod error tree, but the exact structure is not important
        // for this test.
        issues: {
          errors: expect.anything(),
          properties: expect.anything(),
        },
      },
    });
    expect(jobs).toHaveLength(0);
  });

  it("rejects requests that exceed the configured body size limit", async () => {
    const { jobs, transport } = createRecordingTransport();
    const app = createApp({
      config: { ...config, maxRequestBodyBytes: 64 },
      enableRequestLogging: false,
      printTransport: transport,
    });

    const response = await app.request(
      "/print",
      printRequest({ blocks: [{ type: "text", content: "x".repeat(128) }] }),
    );

    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { message: "Request body must not exceed 64 bytes." },
    });
    expect(response.status).toBe(status.REQUEST_ENTITY_TOO_LARGE);
    expect(jobs).toHaveLength(0);
  });

  it("serves an unauthenticated health endpoint", async () => {
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: createRecordingTransport().transport,
    });

    const response = await app.request("/healthz");

    expect(response.status).toBe(status.OK);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("serves OpenAPI JSON", async () => {
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: createRecordingTransport().transport,
    });

    const response = await app.request("/openapi.json");
    const document = await response.json();

    expect(response.status).toBe(status.OK);
    expect(document.paths).toHaveProperty("/print");
    expect(document.paths).toHaveProperty("/healthz");
    expect(document.components.securitySchemes.Bearer).toMatchObject({
      type: "http",
      scheme: "bearer",
    });
  });

  it("serves the Scalar API reference", async () => {
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: createRecordingTransport().transport,
    });

    const response = await app.request("/docs");
    const body = await response.text();

    expect(response.status).toBe(status.OK);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(body).toContain("Print Blocks API Reference");
    expect(body).toContain("/openapi.json");
  });

  it("serves LLM-friendly API documentation", async () => {
    const app = createApp({
      config,
      enableRequestLogging: false,
      printTransport: createRecordingTransport().transport,
    });

    const response = await app.request("/llms.txt");
    const body = await response.text();

    expect(response.status).toBe(status.OK);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain("Print Blocks API");
    expect(body).toContain("/print");
  });
});
