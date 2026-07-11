import type { PrintBlock } from "./schema";
import { renderBrBlock } from "./br";
import { renderLineBlock } from "./line";
import { renderQrCodeBlock } from "./qrcode";
import { renderRowBlock } from "./row";
import { renderTextBlock } from "./text";
import { unreachable } from "../../util/unreachable";

export const renderBlock = (block: PrintBlock) => {
  switch (block.type) {
    case "br":
      return renderBrBlock(block);

    case "line":
      return renderLineBlock(block);

    case "qrcode":
      return renderQrCodeBlock(block);

    case "row":
      return renderRowBlock(block);

    case "text":
      return renderTextBlock(block);

    default:
      return unreachable(block, "Unknown block type");
  }
};
