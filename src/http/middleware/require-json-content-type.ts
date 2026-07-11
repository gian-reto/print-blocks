import type { MiddlewareHandler } from "hono";
import { createErrorResponseBody } from "../response";
import status from "http-status";

const hasJsonContentType = (contentType: string | undefined) =>
  contentType?.split(";", 1)[0]?.trim().toLowerCase() === "application/json";

export const requireJsonContentType =
  (): MiddlewareHandler => async (c, next) => {
    if (c.req.method !== "POST") {
      await next();
      return;
    }

    if (!hasJsonContentType(c.req.header("content-type"))) {
      return c.json(
        createErrorResponseBody(
          "Request must conform to Content-Type: application/json",
        ),
        status.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    await next();
  };
