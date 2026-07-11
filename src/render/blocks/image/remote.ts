import { AntiSSRFPolicy, PolicyConfigOptions } from "@microsoft/antissrf";

import type { IncomingHttpHeaders } from "node:http";
import { remoteImageUrlSchema } from "./schema";
import { request } from "node:https";

export type RemoteImageFetchOptions = {
  maxBytes: number;
  timeoutMs: number;
};

export class RemoteImageFetchError extends Error {
  constructor(message: string, options: { cause?: unknown } = {}) {
    super(
      message,
      options.cause !== undefined ? { cause: options.cause } : undefined,
    );

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

const createAntiSSRFPolicy = () => {
  const policy = new AntiSSRFPolicy(PolicyConfigOptions.ExternalOnlyLatest);

  policy.allowPlainTextHttp = false;
  policy.addXFFHeader = false;

  return policy;
};

const antiSSRFHttpsAgent = createAntiSSRFPolicy().getHttpsAgent({
  keepAlive: false,
});

const getContentLength = (headers: IncomingHttpHeaders) => {
  const value = headers["content-length"];
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (rawValue === undefined) {
    return undefined;
  }

  const contentLength = Number(rawValue.trim());

  if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
    throw new RemoteImageFetchError(
      "Remote image response included an invalid Content-Length header.",
    );
  }

  return contentLength;
};

const isRedirectStatus = (statusCode: number) =>
  statusCode >= 300 && statusCode < 400;

const isSuccessStatus = (statusCode: number) =>
  statusCode >= 200 && statusCode < 300;

export const fetchRemoteImage = async (
  url: string,
  options: RemoteImageFetchOptions,
): Promise<Buffer> => {
  const validatedUrl = remoteImageUrlSchema.parse(url);

  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let receivedBytes = 0;
    let settled = false;

    const settle = (error: Error | undefined, data?: Buffer) => {
      if (settled) {
        return;
      }

      settled = true;

      if (error !== undefined) {
        reject(error);
        return;
      }

      resolve(data ?? Buffer.alloc(0));
    };

    const req = request(
      validatedUrl,
      {
        agent: antiSSRFHttpsAgent,
        headers: {
          accept: "image/*,*/*;q=0.8",
        },
        method: "GET",
        signal: AbortSignal.timeout(options.timeoutMs),
      },
      (res) => {
        const statusCode = res.statusCode ?? 0;

        if (isRedirectStatus(statusCode)) {
          res.resume();
          settle(
            new RemoteImageFetchError(
              "Remote image redirects are not allowed.",
            ),
          );
          return;
        }

        if (!isSuccessStatus(statusCode)) {
          res.resume();
          settle(
            new RemoteImageFetchError(
              `Remote image request failed with HTTP status ${statusCode}.`,
            ),
          );
          return;
        }

        try {
          const contentLength = getContentLength(res.headers);

          if (contentLength !== undefined && contentLength > options.maxBytes) {
            res.resume();
            settle(
              new RemoteImageFetchError(
                `Remote image response must not exceed ${options.maxBytes} bytes.`,
              ),
            );
            return;
          }
        } catch (error) {
          res.resume();
          settle(
            error instanceof Error
              ? error
              : new RemoteImageFetchError(
                  "Failed to validate remote image response headers.",
                  { cause: error },
                ),
          );
          return;
        }

        res.on("data", (chunk: Buffer) => {
          receivedBytes += chunk.byteLength;

          if (receivedBytes > options.maxBytes) {
            settle(
              new RemoteImageFetchError(
                `Remote image response must not exceed ${options.maxBytes} bytes.`,
              ),
            );
            req.destroy();
            res.destroy();
            return;
          }

          chunks.push(chunk);
        });

        res.on("end", () => {
          settle(undefined, Buffer.concat(chunks));
        });

        res.on("error", (error) => {
          settle(
            new RemoteImageFetchError("Failed to read remote image response.", {
              cause: error,
            }),
          );
        });
      },
    );

    req.on("error", (error) => {
      const isTimeout = error.name === "AbortError";

      settle(
        isTimeout
          ? new RemoteImageFetchError(
              `Timed out fetching remote image after ${options.timeoutMs} ms.`,
              { cause: error },
            )
          : new RemoteImageFetchError("Failed to fetch remote image.", {
              cause: error,
            }),
      );
    });

    req.end();
  });
};
