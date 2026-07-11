import { createRoute, type OpenAPIHono } from "@hono/zod-openapi";
import type { AppConfig } from "../config";
import type { PrintRequestSchema } from "../render/blocks/schema";
import { ApiError } from "../http/error";
import { auth, requireJsonContentType } from "../http/middleware";
import {
  createErrorResponseBody,
  createErrorResponseConfig,
  createJsonResponseConfig,
} from "../http/response";
import type { PrintTransport } from "../print/types";
import { bodyLimit } from "hono/body-limit";
import status from "http-status";
import { PrintError } from "../print/error";
import { renderPrintRequest } from "../print/print-job";

type RegisterPrintRouteOptions = {
  config: AppConfig;
  printRequestSchema: PrintRequestSchema;
  transport: PrintTransport;
};

export const registerPrintRoute = (
  app: OpenAPIHono,
  { config, printRequestSchema, transport }: RegisterPrintRouteOptions,
) => {
  const route = createRoute({
    method: "post",
    path: "/print",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: printRequestSchema,
          },
        },
      },
    },
    responses: {
      [status.OK]: createJsonResponseConfig("Print job accepted."),
      [status.BAD_REQUEST]: createErrorResponseConfig("Invalid request."),
      [status.INTERNAL_SERVER_ERROR]: createErrorResponseConfig(
        "Render or print failure.",
      ),
      [status.REQUEST_ENTITY_TOO_LARGE]: createErrorResponseConfig(
        "Request body too large.",
      ),
      [status.UNAUTHORIZED]: createErrorResponseConfig("Unauthorized."),
      [status.UNSUPPORTED_MEDIA_TYPE]: createErrorResponseConfig(
        "Unsupported content type.",
      ),
    },
    security: [
      {
        Bearer: [],
      },
    ],
  });

  app.use(
    route.getRoutingPath(),
    auth(config.apiToken),
    bodyLimit({
      maxSize: config.maxRequestBodyBytes,
      onError: (c) =>
        c.json(
          createErrorResponseBody(
            `Request body must not exceed ${config.maxRequestBodyBytes} bytes.`,
          ),
          status.REQUEST_ENTITY_TOO_LARGE,
        ),
    }),
    requireJsonContentType(),
  );

  app.openapi(route, async (c) => {
    const request = c.req.valid("json");
    let data: Uint8Array;

    // Render the print job to raw data.
    try {
      data = await renderPrintRequest(request.blocks, config);
    } catch (error) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to render print job.",
        {
          cause: error,
        },
      );
    }

    // Send the rendered print job to the printer.
    try {
      await transport.print(data);
    } catch (error) {
      if (error instanceof PrintError) {
        if (error.stderr !== undefined && error.stderr.length > 0) {
          console.error("CUPS print error:", error.stderr);
        }
      }

      throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to print job.", {
        cause: error,
      });
    }

    return c.json({ ok: true }, status.OK);
  });
};
