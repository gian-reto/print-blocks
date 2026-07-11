export type BlockRenderContext = {
  imageSource: {
    maxImageInputPixels: number;
    maxRemoteImageBytes: number;
    remoteImageTimeoutMs: number;
  };
  printerDotWidth: number;
};
