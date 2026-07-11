import { renderSatoriImage, satoriFontFamilies } from "../../satori";

import type { BlockRenderContext } from "../context";
import type { TimelineBlock } from "./schema";

const contentColor = "black";

type TimelineLayoutProps = {
  block: TimelineBlock;
  width: number;
};

type TimelineMarkerProps = {
  isLast: boolean;
};

const TimelineMarker = ({ isLast }: TimelineMarkerProps) => {
  const markerSize = 10;

  return (
    <div
      style={{
        alignItems: "center",
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        width: 28,
        marginTop: 9,
        marginBottom: -20,
      }}
    >
      <div
        style={{
          backgroundColor: contentColor,
          borderRadius: markerSize / 2,
          height: markerSize,
          width: markerSize,
        }}
      />
      {!isLast && (
        <div
          style={{
            backgroundColor: contentColor,
            flexGrow: 1,
            width: 2,
          }}
        />
      )}
    </div>
  );
};

export const TimelineLayout = ({ block, width }: TimelineLayoutProps) => {
  const fontSize = 22;
  const lineHeight = 1.25;

  return (
    <div
      style={{
        color: contentColor,
        display: "flex",
        flexDirection: "column",
        padding: "8px 0",
        rowGap: 10,
        width,
      }}
    >
      {block.items.map((item, index) => (
        <div
          key={index}
          style={{
            alignItems: "stretch",
            columnGap: 8,
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              fontFamily: satoriFontFamilies.geistMono,
              fontSize,
              fontWeight: 500,
              lineHeight,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </div>
          <TimelineMarker isLast={index === block.items.length - 1} />
          <div
            style={{
              display: "flex",
              flex: 1,
              fontFamily: satoriFontFamilies.geistMono,
              fontSize,
              fontWeight: 400,
              lineHeight,
              wordBreak: "break-word",
            }}
          >
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export const renderTimelineBlock = (
  block: TimelineBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: <TimelineLayout block={block} width={context.printerDotWidth} />,
  });
