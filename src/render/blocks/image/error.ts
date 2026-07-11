export type ImageRenderErrorCode =
  | "IMAGE_SOURCE_MISSING"
  | "IMAGE_SHARP_PROCESSING_ERROR"
  | "REMOTE_IMAGE_FETCH_FAILED"
  | "REMOTE_IMAGE_INVALID_RESPONSE"
  | "REMOTE_IMAGE_REDIRECT_REJECTED"
  | "REMOTE_IMAGE_REQUEST_FAILED"
  | "REMOTE_IMAGE_TIMEOUT"
  | "REMOTE_IMAGE_TOO_LARGE";

export class ImageRenderError extends Error {
  readonly code: ImageRenderErrorCode;
  readonly detail: string | undefined;

  constructor(
    code: ImageRenderErrorCode,
    message: string,
    options: { cause?: unknown; detail?: string } = {},
  ) {
    super(
      message,
      options.cause !== undefined ? { cause: options.cause } : undefined,
    );

    this.name = this.constructor.name;
    this.code = code;
    this.detail = options.detail;

    Error.captureStackTrace(this, this.constructor);
  }
}
