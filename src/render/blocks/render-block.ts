import type { BlockRenderContext } from "./context";
import type { PrintBlock } from "./schema";
import { renderBarcodeBlock } from "./barcode";
import { renderBrBlock } from "./br";
import { renderImageBlock } from "./image";
import { renderLineBlock } from "./line";
import { renderQrCodeBlock } from "./qrcode";
import { renderRowBlock } from "./row";
import { renderTextBlock } from "./text";
import { renderTokenBlock } from "./token";
import { unreachable } from "../../util/unreachable";

export const renderBlock = (block: PrintBlock, context: BlockRenderContext) => {
  switch (block.type) {
    case "barcode":
      return renderBarcodeBlock(block);

    case "br":
      return renderBrBlock(block);

    case "image":
      return renderImageBlock(block, context);

    case "line":
      return renderLineBlock(block);

    case "qrcode":
      return renderQrCodeBlock(block);

    case "row":
      return renderRowBlock(block);

    case "text":
      return renderTextBlock(block);

    case "token":
      return renderTokenBlock(block, context);

    default:
      return unreachable(block, "Unknown block type");
  }
};
