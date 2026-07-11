import {
  registerHealthRoute,
  registerOpenApiRoute,
  registerPrintRoute,
} from "./routes";

import { ApiError } from "./http/error";
import type { AppConfig } from "./config";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { PrintTransport } from "./print/types";
import { createCupsPrintTransport } from "./print/cups";
import { createErrorResponseBody } from "./http/response";
import { createPrintRequestSchema } from "./render/blocks";
import { logger } from "hono/logger";
import status from "http-status";

export type CreateAppOptions = {
  config: AppConfig;
  printTransport?: PrintTransport;
  enableRequestLogging?: boolean;
};

export const createApp = ({
  config,
  enableRequestLogging = true,
  printTransport,
}: CreateAppOptions) => {
  const transport =
    printTransport ??
    createCupsPrintTransport({
      printerName: config.printerName,
      timeoutMs: config.printTimeoutMs,
    });
  const printRequestSchema = createPrintRequestSchema({
    maxBlocksPerPrintJob: config.maxBlocksPerPrintJob,
    maxTextCharsPerBlock: config.maxTextCharsPerBlock,
  });

  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          createErrorResponseBody(
            "Request body did not match the print request schema.",
            result.error,
          ),
          status.BAD_REQUEST,
        );
      }

      return undefined;
    },
  });

  if (enableRequestLogging) {
    app.use(logger());
  }
  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  registerPrintRoute(app, {
    config,
    printRequestSchema,
    transport,
  });
  registerHealthRoute(app);
  registerOpenApiRoute(app, config);

  app.onError((error, c) => {
    console.error(error);

    if (error instanceof ApiError) {
      return c.json(
        createErrorResponseBody(error.message, error.zodError),
        error.code,
      );
    }

    return c.json(
      createErrorResponseBody("Unexpected server error."),
      status.INTERNAL_SERVER_ERROR,
    );
  });

  return app;
};
