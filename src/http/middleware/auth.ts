import type { MiddlewareHandler } from "hono";
import { createErrorResponseBody } from "../response";
import status from "http-status";
import { timingSafeEqual } from "node:crypto";

const hasValidBearerToken = (
  authorizationHeader: string | undefined,
  apiToken: string,
) => {
  const prefix = "Bearer ";

  if (
    authorizationHeader === undefined ||
    !authorizationHeader.startsWith(prefix)
  ) {
    return false;
  }

  const suppliedToken = Buffer.from(authorizationHeader.slice(prefix.length));
  const expectedToken = Buffer.from(apiToken);

  return (
    suppliedToken.length === expectedToken.length &&
    timingSafeEqual(suppliedToken, expectedToken)
  );
};

export const auth =
  (apiToken: string): MiddlewareHandler =>
  async (c, next) => {
    if (!hasValidBearerToken(c.req.header("authorization"), apiToken)) {
      return c.json(
        createErrorResponseBody("Unauthorized"),
        status.UNAUTHORIZED,
      );
    }

    await next();
  };
