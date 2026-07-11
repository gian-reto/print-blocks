import { PrintError } from "./error";
import type { PrintTransport } from "./types";
import { packageInfo } from "../util/package-info";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

export type CupsPrintTransportOptions = {
  printerName: string | undefined;
  timeoutMs: number;
  jobTitle?: string;
};

export const createCupsPrintTransport = (
  options: CupsPrintTransportOptions,
): PrintTransport => ({
  print: (data) => submitPrintJob(data, options),
});

/**
 * Submit print data to CUPS.
 *
 * @returns A {@link Promise} that resolves when the print job is successfully
 * submitted, or rejects if submission fails.
 */
const submitPrintJob = (
  data: Uint8Array,
  options: CupsPrintTransportOptions,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const args = [
      ...(options.printerName ? ["-d", options.printerName] : []),
      "-o",
      "raw",
      "-t",
      options.jobTitle ?? `${packageInfo.name}-${randomUUID()}`,
      "-",
    ];
    const child = spawn("lp", args, {
      env: process.env,
      stdio: "pipe",
    });

    const stderrChunks: Buffer[] = [];
    let timedOut = false;
    let settled = false;

    const settle = (error?: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);

      if (error !== undefined) {
        reject(error);
        return;
      }

      resolve();
    };

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, options.timeoutMs);

    child.stdout.resume();

    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });

    child.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        settle(
          new PrintError("CUPS lp command was not found", {
            cause: error,
          }),
        );
        return;
      }

      settle(
        new PrintError("Failed to start CUPS lp command.", {
          cause: error,
        }),
      );
    });

    child.on("close", (code: number | null) => {
      const stderr = Buffer.concat(stderrChunks).toString("utf8").trim();

      if (timedOut) {
        settle(
          new PrintError("Timed out while submitting print job to CUPS", {
            stderr,
          }),
        );
        return;
      }

      if (code !== 0) {
        settle(
          new PrintError("CUPS rejected the print job", {
            stderr,
          }),
        );
        return;
      }

      settle();
    });

    child.stdin.on("error", (error: Error) => {
      settle(
        new PrintError("Failed to write print data to CUPS", {
          cause: error,
        }),
      );
    });

    child.stdin.end(Buffer.from(data));
  });
};
