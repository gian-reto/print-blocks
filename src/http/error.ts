import type { $ZodError } from "zod/v4/core";
import type { HttpStatusCode } from "./types";

export class ApiError extends Error {
  readonly code: HttpStatusCode;
  readonly zodError: $ZodError | undefined;

  constructor(
    code: HttpStatusCode,
    message: string,
    options: { cause?: unknown; zodError?: $ZodError } = {},
  ) {
    super(message, options);

    this.code = code;
    this.name = this.constructor.name;
    this.zodError = options.zodError;

    // Capture the stack trace, excluding this constructor.
    Error.captureStackTrace(this, this.constructor);
  }
}
