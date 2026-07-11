import type { PrintBlock } from "./schema";
import { renderTextBlock } from "./text";
import { unreachable } from "../../util/unreachable";

export const renderBlock = (block: PrintBlock) => {
  switch (block.type) {
    case "text":
      return renderTextBlock(block);

    default:
      unreachable(block.type, `Unsupported block type: ${block.type}`);
  }
};
