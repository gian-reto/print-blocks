export class PrintError extends Error {
  readonly stderr: string | undefined;

  constructor(
    message: string,
    options: { cause?: unknown; stderr?: string } = {},
  ) {
    super(
      message,
      options.cause !== undefined ? { cause: options.cause } : undefined,
    );

    this.name = this.constructor.name;
    this.stderr = options.stderr;

    // Capture the stack trace, excluding this constructor.
    Error.captureStackTrace(this, this.constructor);
  }
}
