import type { BlockRenderContext } from "./context";
import type { PrintBlock } from "./schema";
import { renderAreaChartBlock } from "./chart/area";
import { renderBarChartBlock } from "./chart/bar";
import { renderBarcodeBlock } from "./barcode";
import { renderBrBlock } from "./br";
import { renderImageBlock } from "./image";
import { renderLineBlock } from "./line";
import { renderLineChartBlock } from "./chart/line";
import { renderProgressBlock } from "./progress";
import { renderQrCodeBlock } from "./qrcode";
import { renderRowBlock } from "./row";
import { renderStackedAreaChartBlock } from "./chart/stacked-area";
import { renderTextBlock } from "./text";
import { renderTimelineBlock } from "./timeline";
import { renderTokenBlock } from "./token";
import { unreachable } from "../../util/unreachable";

export const renderBlock = (block: PrintBlock, context: BlockRenderContext) => {
  switch (block.type) {
    case "areaChart":
      return renderAreaChartBlock(block, context);

    case "barChart":
      return renderBarChartBlock(block, context);

    case "barcode":
      return renderBarcodeBlock(block);

    case "br":
      return renderBrBlock(block);

    case "image":
      return renderImageBlock(block, context);

    case "line":
      return renderLineBlock(block);

    case "lineChart":
      return renderLineChartBlock(block, context);

    case "progress":
      return renderProgressBlock(block, context);

    case "qrcode":
      return renderQrCodeBlock(block);

    case "row":
      return renderRowBlock(block);

    case "stackedAreaChart":
      return renderStackedAreaChartBlock(block, context);

    case "text":
      return renderTextBlock(block);

    case "timeline":
      return renderTimelineBlock(block, context);

    case "token":
      return renderTokenBlock(block, context);

    default:
      return unreachable(block, "Unknown block type");
  }
};
