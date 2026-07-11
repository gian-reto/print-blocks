import { renderSatoriImage, satoriFontFamilies } from "../../satori";

import type { BlockRenderContext } from "../context";
import type { TokenBlock } from "./schema";

const paperColor = "white";
const contentColor = "black";

export const TokenLayout = ({ block }: { block: TokenBlock }) => (
  <div
    style={{
      backgroundColor: paperColor,
      color: contentColor,
      display: "flex",
      flexDirection: "column",
      paddingTop: 12,
      width: "100%",
    }}
  >
    <div
      style={{
        alignItems: "center",
        backgroundColor: paperColor,
        border: `2px dashed ${contentColor}`,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 92,
        padding: "28px 20px 24px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          left: 0,
          position: "absolute",
          right: 0,
          top: -12,
        }}
      >
        <div
          style={{
            backgroundColor: paperColor,
            color: contentColor,
            display: "flex",
            fontFamily: satoriFontFamilies.geistSans,
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1,
            padding: "2px 20px",
            textAlign: "center",
          }}
        >
          {block.title}
        </div>
      </div>
      <div
        style={{
          color: contentColor,
          display: "flex",
          fontFamily: satoriFontFamilies.geistMono,
          fontSize: 28,
          fontWeight: 400,
          justifyContent: "center",
          lineHeight: 1.18,
          textAlign: "center",
          wordBreak: "break-all",
        }}
      >
        {block.content}
      </div>
    </div>
  </div>
);

export const renderTokenBlock = (
  block: TokenBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: <TokenLayout block={block} />,
  });
