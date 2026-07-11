import type { AppConfig } from "../config";
import type { PrintBlock } from "../render/blocks/schema";
import { renderPrintJob } from "../render/render-print-job";

export const renderPrintRequest = async (
  blocks: PrintBlock[],
  config: AppConfig,
): Promise<Uint8Array> =>
  await renderPrintJob(blocks, {
    type: config.printerType,
    width: config.printerWidth,
    printerDotWidth: config.printerDotWidth,
    characterSet: config.printerCharacterSet,
    imageSource: {
      maxImageInputPixels: config.maxImageInputPixels,
      maxRemoteImageBytes: config.maxRemoteImageBytes,
      remoteImageTimeoutMs: config.remoteImageTimeoutMs,
    },
  });
