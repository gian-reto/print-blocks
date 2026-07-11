import type { PrintBlock } from "./schema";
import { renderBrBlock } from "./br";
import { renderTextBlock } from "./text";
import { unreachable } from "../../util/unreachable";

export const renderBlock = (block: PrintBlock) => {
  switch (block.type) {
    case "br":
      return renderBrBlock(block);

    case "text":
      return renderTextBlock(block);

    default:
      return unreachable(block, "Unknown block type");
  }
};
