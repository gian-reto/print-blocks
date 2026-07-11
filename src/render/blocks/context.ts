export type BlockRenderContext = {
  printerDotWidth: number;
};

const printerDotsPerTextColumn = 12;

export const getPrinterDotWidth = (printerTextWidth: number) =>
  printerTextWidth * printerDotsPerTextColumn;
