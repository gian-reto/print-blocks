export type BlockRenderContext = {
  imageSource: {
    maxImageInputPixels: number;
    maxRemoteImageBytes: number;
    remoteImageTimeoutMs: number;
  };
  printerDotWidth: number;
};

const printerDotsPerTextColumn = 12;

export const getPrinterDotWidth = (printerTextWidth: number) =>
  printerTextWidth * printerDotsPerTextColumn;
