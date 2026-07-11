import { renderSatoriImage, satoriFontFamilies } from "../../satori";

import type { BlockRenderContext } from "../context";
import type { HeatmapBlock } from "./schema";
import { floydSteinbergDither } from "./dither";

const contentColor = "black";
const grayscaleLightestChannel = 226;
const heatmapBucketCount = 5;

type HeatmapLayoutProps = {
  block: HeatmapBlock;
  width: number;
};

const getHeatmapMaxValue = (block: HeatmapBlock) =>
  Math.max(
    0,
    ...block.values
      .flatMap((row) => row)
      .filter((value): value is number => value !== null),
  );

const getHeatmapBucket = (value: number, maxValue: number) => {
  if (maxValue <= 0) {
    return 0;
  }

  const maxBucket = heatmapBucketCount - 1;

  return Math.max(
    0,
    Math.min(maxBucket, Math.round((value / maxValue) * maxBucket)),
  );
};

const getGrayscaleFill = (percentage: number) => {
  const progress = Math.max(0, Math.min(1, percentage / 100));
  const darkness = progress ** 2;
  const channel = Math.round(grayscaleLightestChannel * (1 - darkness));

  return `rgb(${channel}, ${channel}, ${channel})`;
};

const getHeatmapBucketFill = (bucket: number) =>
  getGrayscaleFill((bucket / (heatmapBucketCount - 1)) * 100);

const getHeatmapFill = (value: number, maxValue: number) =>
  getHeatmapBucketFill(getHeatmapBucket(value, maxValue));

const formatHeatmapValue = (value: number) => {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return Number(value.toFixed(2)).toString();
};

const HeatmapCell = ({
  maxValue,
  size,
  value,
}: {
  maxValue: number;
  size: number;
  value: number | null;
}) => {
  if (value === null) {
    return <div style={{ height: size, width: size }} />;
  }

  return (
    <div
      style={{
        backgroundColor: getHeatmapFill(value, maxValue),
        height: size,
        width: size,
      }}
    />
  );
};

const HeatmapLegend = ({ maxValue }: { maxValue: number }) => (
  <div
    style={{
      alignItems: "center",
      columnGap: 4,
      display: "flex",
      flexDirection: "row",
      fontFamily: satoriFontFamilies.geistMono,
      fontSize: 16,
      marginTop: 8,
    }}
  >
    <div style={{ display: "flex" }}>0</div>
    <div
      style={{
        columnGap: 2,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {Array.from({ length: heatmapBucketCount }, (_, bucket) => (
        <div
          key={bucket}
          style={{
            backgroundColor: getHeatmapBucketFill(bucket),
            height: 12,
            width: 12,
          }}
        />
      ))}
    </div>
    <div style={{ display: "flex" }}>{formatHeatmapValue(maxValue)}</div>
  </div>
);

export const HeatmapLayout = ({ block, width }: HeatmapLayoutProps) => {
  const columnCount = block.labels.length;
  const gap = 16;
  const maxValue = getHeatmapMaxValue(block);
  const outerPadding = 8;
  const availableWidth = width - outerPadding * 2;
  const cellSize = Math.floor(
    (availableWidth - gap * (columnCount - 1)) / columnCount,
  );

  return (
    <div
      style={{
        alignItems: "center",
        color: contentColor,
        display: "flex",
        flexDirection: "column",
        padding: `8px ${outerPadding}px`,
        rowGap: 8,
        width,
      }}
    >
      <div
        style={{
          alignItems: "center",
          columnGap: gap,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {block.labels.map((label, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: satoriFontFamilies.geistMono,
                fontSize: 16,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: gap,
        }}
      >
        {block.values.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              columnGap: gap,
              display: "flex",
              flexDirection: "row",
            }}
          >
            {row.map((value, columnIndex) => (
              <HeatmapCell
                key={columnIndex}
                maxValue={maxValue}
                size={cellSize}
                value={value}
              />
            ))}
          </div>
        ))}
      </div>
      <HeatmapLegend maxValue={maxValue} />
    </div>
  );
};

export const renderHeatmapBlock = (
  block: HeatmapBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: <HeatmapLayout block={block} width={context.printerDotWidth} />,
    transforms: [floydSteinbergDither],
  });
