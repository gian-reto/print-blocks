import type { $ZodError, $ZodErrorTree } from "zod/v4/core";

import type { ResponseConfig } from "@asteasolutions/zod-to-openapi";
import { z } from "@hono/zod-openapi";

// Success

const okResponseSchema = z
  .object({
    ok: z.literal(true).openapi({ example: true }),
  })
  .openapi("OkResponse");

export const createJsonResponseConfig = (
  description: string,
  schema: z.ZodType = okResponseSchema,
): ResponseConfig => ({
  description,
  content: {
    "application/json": {
      schema,
    },
  },
});

// Error

const errorResponseSchema = z
  .object({
    ok: z.literal(false).openapi({ example: false }),
    error: z.object({
      message: z.string().openapi({ example: "Request body is invalid" }),
      issues: z.looseObject({}).optional(),
    }),
  })
  .openapi("ErrorResponse");

export const createErrorResponseConfig = (
  description: string,
): ResponseConfig => createJsonResponseConfig(description, errorResponseSchema);

type ApiErrorBody = {
  ok: false;
  error: {
    message: string;
    issues?: $ZodErrorTree<unknown>;
  };
};

export const createErrorResponseBody = (
  message: string,
  zodError?: $ZodError,
): ApiErrorBody => ({
  ok: false,
  error: {
    message,
    ...(zodError ? { issues: z.treeifyError(zodError) } : {}),
  },
});
