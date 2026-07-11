import type { CSSProperties, ReactNode } from "react";
import { extent, max, min } from "d3-array";

import type { ScaleLinear } from "d3-scale";
import { format } from "d3-format";
import { omitUndefined } from "../../../util/omit-undefined";
import { satoriFontFamilies } from "../../satori";
import { scaleLinear } from "d3-scale";

export type ChartSeries = {
  label: string;
  values: number[];
};

export type ChartDimensions = {
  height: number;
  plotHeight: number;
  plotLeft: number;
  plotTop: number;
  plotWidth: number;
  width: number;
  xAxisLabelTop: number;
  xAxisLabelWidth: number;
  yAxisLabelWidth: number;
};

export type ChartLegendSample =
  | {
      kind: "line";
      style: ChartLineStyle;
    }
  | {
      index: number;
      kind: "fill";
    };

export type ChartLegendItem = {
  label: string;
  sample: ChartLegendSample;
};

export type ChartLineStyle = {
  strokeDasharray?: string;
  strokeWidth: number;
};

type CartesianChartFrameProps = {
  children: (dimensions: ChartDimensions) => ReactNode;
  legendItems?: ChartLegendItem[] | undefined;
  reserveFirstXAxisLabelGutter?: boolean | undefined;
  width: number;
  xLabels: string[];
  yLabels: string[];
};

type ChartAxisLabel = {
  key: string;
  label: string;
  x: number;
};

type ChartXAxisLabelsProps = {
  dimensions: ChartDimensions;
  labels: ChartAxisLabel[];
  rotated: boolean;
};

type ChartYAxisLabelsProps = {
  dimensions: ChartDimensions;
  scale: ScaleLinear<number, number>;
  ticks: number[];
};

type ChartAxesProps = {
  dimensions: ChartDimensions;
  ticks: number[];
  yScale: ScaleLinear<number, number>;
};

type ChartFrameProps = {
  dimensions: ChartDimensions;
};

type ChartPlotSvgProps = {
  children: ReactNode;
  dimensions: ChartDimensions;
};

type CreateChartDimensionsOptions = {
  legendItems?: ChartLegendItem[] | undefined;
  reserveFirstXAxisLabelGutter?: boolean | undefined;
  width: number;
  xLabels: string[];
  yLabels: string[];
};

type CreateVisibleXAxisLabelsOptions = {
  dimensions: ChartDimensions;
  labels: string[];
  xForIndex: (index: number) => number;
};

type CreateYScaleOptions = {
  includeZero?: boolean | undefined;
  plotHeight: number;
  values: number[];
  yMax?: number | undefined;
  yMin?: number | undefined;
};

export const chartInkColor = "black";
export const chartPaperColor = "white";

const chartBottomPadding = 8;
const chartLeftPadding = 4;
const chartAxisStrokeWidth = 2;
const chartGridLineStrokeWidth = 2;
const chartLegendColumns = 3;
const chartLegendGap = 18;
const chartLegendItemGap = 18;
const chartLegendRowHeight = 20;
const chartLegendSwatchHeight = 16;
const chartRightPadding = 6;
const chartTopPadding = 6;
const chartValueFormat = format(".3~g");
const xAxisAverageCharacterWidth = 10;
const xAxisLabelGap = 10;
const xAxisLabelFontSize = 16;
const xAxisLabelHorizontalWidth = 56;
const xAxisLabelPadding = 4;
const xAxisLabelRotationRadians = Math.PI / 4;
const xAxisMinRotatedLabelWidth = 12;
const yAxisAverageCharacterWidth = 10;
const yAxisLabelGap = 4;
const yAxisLabelFontSize = 16;
const yAxisMinLabelWidth = 24;

const chartLineStrokeWidth = 2;
const chartPlotEdgePadding = chartLineStrokeWidth / 2;

const lineStyles: ChartLineStyle[] = [
  { strokeWidth: chartLineStrokeWidth },
  { strokeDasharray: "10 6", strokeWidth: chartLineStrokeWidth },
  { strokeDasharray: "2 5", strokeWidth: chartLineStrokeWidth },
  { strokeDasharray: "10 4 2 4", strokeWidth: chartLineStrokeWidth },
];

export const getChartLineStyle = (index: number): ChartLineStyle =>
  lineStyles[index % lineStyles.length] ?? lineStyles[0]!;

export const getChartPatternId = (index: number) => `chart-pattern-${index}`;

export const getChartPatternFill = (index: number) =>
  `url(#${getChartPatternId(index)})`;

export const formatChartValue = (value: number) => chartValueFormat(value);

export const getPointLabels = (labels: string[] | undefined, count: number) =>
  labels ?? Array.from({ length: count }, (_, index) => String(index + 1));

export const getChartYDomain = ({
  includeZero = false,
  values,
  yMax,
  yMin,
}: Omit<CreateYScaleOptions, "plotHeight">): [number, number] => {
  const [extentMin, extentMax] = extent(values);
  let domainMin = yMin ?? extentMin ?? 0;
  let domainMax = yMax ?? extentMax ?? 1;

  if (includeZero) {
    domainMin = yMin ?? Math.min(domainMin, 0);
    domainMax = yMax ?? Math.max(domainMax, 0);
  }

  if (domainMin === domainMax) {
    const padding = Math.abs(domainMin || 1) * 0.1;

    return [domainMin - padding, domainMax + padding];
  }

  return [domainMin, domainMax];
};

export const createChartYScale = ({
  includeZero,
  plotHeight,
  values,
  yMax,
  yMin,
}: CreateYScaleOptions) => {
  const domain = getChartYDomain({ includeZero, values, yMax, yMin });

  return scaleLinear().domain(domain).nice(4).range([plotHeight, 0]);
};

export const createChartYTicks = ({
  includeZero,
  values,
  yMax,
  yMin,
}: Omit<CreateYScaleOptions, "plotHeight">) =>
  scaleLinear()
    .domain(getChartYDomain({ includeZero, values, yMax, yMin }))
    .nice(4)
    .ticks(4);

export const createPointXScale = (count: number, plotWidth: number) =>
  scaleLinear()
    .domain([0, Math.max(count - 1, 1)])
    .range([0, plotWidth]);

export const getAllSeriesValues = (series: ChartSeries[]) =>
  series.flatMap((item) => item.values);

export const getStackedTotals = (series: ChartSeries[]) => {
  const pointCount = series[0]?.values.length ?? 0;

  return Array.from({ length: pointCount }, (_, pointIndex) =>
    series.reduce((total, item) => total + (item.values[pointIndex] ?? 0), 0),
  );
};

export const getMaxValue = (values: number[]) => max(values) ?? 0;

export const getMinValue = (values: number[]) => min(values) ?? 0;

const getRotatedXAxisLabelHeight = (labelWidth: number) =>
  Math.ceil(
    labelWidth * Math.sin(xAxisLabelRotationRadians) +
      xAxisLabelFontSize * Math.cos(xAxisLabelRotationRadians) +
      xAxisLabelPadding,
  );

const getFirstRotatedXAxisLabelGutterWidth = (labelWidth: number) =>
  Math.ceil(labelWidth * Math.sin(xAxisLabelRotationRadians));

const createChartDimensions = ({
  legendItems,
  reserveFirstXAxisLabelGutter = false,
  width,
  xLabels,
  yLabels,
}: CreateChartDimensionsOptions): ChartDimensions => {
  const legendRowCount =
    legendItems === undefined
      ? 0
      : Math.ceil(legendItems.length / chartLegendColumns);
  const legendHeight =
    legendRowCount === 0
      ? 0
      : legendRowCount * chartLegendRowHeight + chartLegendGap;
  const plotTop = chartTopPadding + legendHeight;
  const longestYAxisLabelLength = Math.max(
    0,
    ...yLabels.map((label) => label.length),
  );
  const yAxisTickLabelWidth = Math.max(
    yAxisMinLabelWidth,
    longestYAxisLabelLength * yAxisAverageCharacterWidth + yAxisLabelGap,
  );
  const basePlotLeft = chartLeftPadding + yAxisTickLabelWidth;
  const basePlotWidth = Math.max(120, width - basePlotLeft - chartRightPadding);
  const rotateXAxisLabels = shouldRotateXAxisLabels({
    labelCount: xLabels.length,
    plotWidth: basePlotWidth,
  });
  const shouldReserveFirstXAxisLabelGutter =
    rotateXAxisLabels && reserveFirstXAxisLabelGutter;
  const firstXAxisLabelWidth = shouldReserveFirstXAxisLabelGutter
    ? Math.max(
        xAxisMinRotatedLabelWidth,
        (xLabels[0]?.length ?? 0) * xAxisAverageCharacterWidth,
      )
    : 0;
  const firstXAxisLabelGutterWidth = shouldReserveFirstXAxisLabelGutter
    ? getFirstRotatedXAxisLabelGutterWidth(firstXAxisLabelWidth)
    : 0;
  const yAxisLabelWidth = Math.max(
    yAxisTickLabelWidth,
    firstXAxisLabelGutterWidth,
  );
  const plotLeft = chartLeftPadding + yAxisLabelWidth;
  const plotHeight = 156;
  const plotWidth = Math.max(120, width - plotLeft - chartRightPadding);
  const longestXAxisLabelLength = Math.max(
    0,
    ...xLabels.map((label) => label.length),
  );
  const xAxisLabelWidth = rotateXAxisLabels
    ? Math.max(
        xAxisMinRotatedLabelWidth,
        longestXAxisLabelLength * xAxisAverageCharacterWidth,
      )
    : xAxisLabelHorizontalWidth;
  const xAxisHeight = rotateXAxisLabels
    ? getRotatedXAxisLabelHeight(xAxisLabelWidth)
    : 24;
  const xAxisLabelTop = plotTop + plotHeight + xAxisLabelGap;
  const height = xAxisLabelTop + xAxisHeight + chartBottomPadding;

  return {
    height,
    plotHeight,
    plotLeft,
    plotTop,
    plotWidth,
    width,
    xAxisLabelTop,
    xAxisLabelWidth,
    yAxisLabelWidth,
  };
};

export const shouldRotateXAxisLabels = ({
  labelCount,
  plotWidth,
}: {
  labelCount: number;
  plotWidth: number;
}) => labelCount > 4 || plotWidth / Math.max(labelCount, 1) < 56;

export const createVisibleXAxisLabels = ({
  dimensions,
  labels,
  xForIndex,
}: CreateVisibleXAxisLabelsOptions) => {
  const rotated = shouldRotateXAxisLabels({
    labelCount: labels.length,
    plotWidth: dimensions.plotWidth,
  });
  const labelSlotWidth = rotated ? 38 : 58;
  const maxVisibleLabels = Math.max(
    2,
    Math.floor(dimensions.plotWidth / labelSlotWidth),
  );
  const step = Math.max(1, Math.ceil(labels.length / maxVisibleLabels));
  const visibleLabels = labels.flatMap((label, index) => {
    const shouldShow = index % step === 0 || index === labels.length - 1;

    return shouldShow
      ? [
          {
            key: `${index}:${label}`,
            label,
            x: xForIndex(index),
          },
        ]
      : [];
  });

  return {
    labels: visibleLabels,
    rotated,
  };
};

const chartRootStyle = (dimensions: ChartDimensions): CSSProperties => ({
  backgroundColor: chartPaperColor,
  color: chartInkColor,
  display: "flex",
  fontFamily: satoriFontFamilies.geistMono,
  height: dimensions.height,
  position: "relative",
  width: dimensions.width,
});

const chartPlotSvgStyle = (dimensions: ChartDimensions): CSSProperties => ({
  height: dimensions.plotHeight + chartPlotEdgePadding * 2,
  left: dimensions.plotLeft - chartPlotEdgePadding,
  position: "absolute",
  top: dimensions.plotTop - chartPlotEdgePadding,
  width: dimensions.plotWidth + chartPlotEdgePadding * 2,
});

export const ChartPlotSvg = ({ children, dimensions }: ChartPlotSvgProps) => {
  const height = dimensions.plotHeight + chartPlotEdgePadding * 2;
  const width = dimensions.plotWidth + chartPlotEdgePadding * 2;

  return (
    <svg
      height={height}
      style={chartPlotSvgStyle(dimensions)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <g
        transform={`translate(${chartPlotEdgePadding}, ${chartPlotEdgePadding})`}
      >
        {children}
      </g>
    </svg>
  );
};

export const CartesianChartFrame = ({
  children,
  legendItems,
  reserveFirstXAxisLabelGutter,
  width,
  xLabels,
  yLabels,
}: CartesianChartFrameProps) => {
  const dimensions = createChartDimensions({
    legendItems,
    reserveFirstXAxisLabelGutter,
    width,
    xLabels,
    yLabels,
  });

  return (
    <div style={chartRootStyle(dimensions)}>
      {legendItems !== undefined ? (
        <ChartLegend dimensions={dimensions} items={legendItems} />
      ) : null}
      {children(dimensions)}
    </div>
  );
};

const ChartLegend = ({
  dimensions,
  items,
}: {
  dimensions: ChartDimensions;
  items: ChartLegendItem[];
}) => {
  const rows = Array.from(
    { length: Math.ceil(items.length / chartLegendColumns) },
    (_, rowIndex) =>
      items.slice(
        rowIndex * chartLegendColumns,
        rowIndex * chartLegendColumns + chartLegendColumns,
      ),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        left: dimensions.plotLeft,
        position: "absolute",
        top: chartTopPadding,
        width: dimensions.width - dimensions.plotLeft - chartRightPadding,
      }}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: chartLegendItemGap,
            height: chartLegendRowHeight,
          }}
        >
          {row.map((item, index) => (
            <div
              key={`${rowIndex}:${index}:${item.label}`}
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: 6,
                height: chartLegendRowHeight,
              }}
            >
              <ChartLegendSample sample={item.sample} />
              <div
                style={{
                  display: "flex",
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ChartLegendSample = ({ sample }: { sample: ChartLegendSample }) => {
  if (sample.kind === "line") {
    return (
      <svg height={14} viewBox="0 0 36 14" width={36}>
        <line
          {...omitUndefined({
            strokeDasharray: sample.style.strokeDasharray,
          })}
          stroke={chartInkColor}
          strokeLinecap="round"
          strokeWidth={sample.style.strokeWidth}
          x1={2}
          x2={34}
          y1={7}
          y2={7}
        />
      </svg>
    );
  }

  const patternId = `legend-${getChartPatternId(sample.index)}`;

  return (
    <svg height={20} viewBox="0 0 36 20" width={36}>
      {renderChartPatternDefs({
        count: sample.index + 1,
        offset: 2,
        prefix: "legend-",
      })}
      <rect
        fill={`url(#${patternId})`}
        height={chartLegendSwatchHeight}
        stroke={chartInkColor}
        strokeWidth={2}
        width={32}
        x={2}
        y={2}
      />
    </svg>
  );
};

export const renderChartPatternDefs = ({
  count,
  offset = 0,
  prefix = "",
}: {
  count: number;
  offset?: number;
  prefix?: string;
}) => (
  <defs>
    {Array.from({ length: count }, (_, index) => {
      const patternIndex = index % 4;
      const id = `${prefix}${getChartPatternId(index)}`;

      return (
        <pattern
          height={8}
          id={id}
          key={id}
          patternUnits="userSpaceOnUse"
          width={8}
          x={offset}
          y={offset}
        >
          <rect fill={chartPaperColor} height={8} width={8} />
          {patternIndex === 0 ? (
            <path d="M0 8 L8 0" stroke={chartInkColor} strokeWidth={2} />
          ) : null}
          {patternIndex === 1 ? (
            <path d="M0 4 H8" stroke={chartInkColor} strokeWidth={2} />
          ) : null}
          {patternIndex === 2 ? (
            <path d="M4 0 V8" stroke={chartInkColor} strokeWidth={2} />
          ) : null}
          {patternIndex === 3 ? (
            <g>
              <path d="M0 0 L8 8" stroke={chartInkColor} strokeWidth={2} />
            </g>
          ) : null}
        </pattern>
      );
    })}
  </defs>
);

export const renderChartGridLines = ({
  dimensions,
  ticks,
  yScale,
}: ChartAxesProps) => {
  const gridLineStartX = chartAxisStrokeWidth / 2;
  const xAxisY = dimensions.plotHeight;

  return (
    <g>
      {ticks.map((tick) => {
        const y = yScale(tick);

        if (y >= xAxisY) {
          return null;
        }

        return (
          <line
            key={tick}
            stroke={chartInkColor}
            strokeDasharray="3 5"
            strokeOpacity={1}
            strokeWidth={chartGridLineStrokeWidth}
            x1={gridLineStartX}
            x2={dimensions.plotWidth}
            y1={y}
            y2={y}
          />
        );
      })}
    </g>
  );
};

export const renderChartFrame = ({ dimensions }: ChartFrameProps) => {
  const xAxisY = dimensions.plotHeight;
  const yAxisX = 0;

  return (
    <g>
      <line
        stroke={chartInkColor}
        strokeWidth={chartAxisStrokeWidth}
        x1={0}
        x2={dimensions.plotWidth}
        y1={xAxisY}
        y2={xAxisY}
      />
      <line
        stroke={chartInkColor}
        strokeWidth={chartAxisStrokeWidth}
        x1={yAxisX}
        x2={yAxisX}
        y1={0}
        y2={dimensions.plotHeight}
      />
    </g>
  );
};

export const ChartYAxisLabels = ({
  dimensions,
  scale,
  ticks,
}: ChartYAxisLabelsProps) => (
  <>
    {ticks.map((tick) => (
      <div
        key={tick}
        style={{
          display: "flex",
          fontSize: yAxisLabelFontSize,
          justifyContent: "flex-end",
          left: chartLeftPadding,
          lineHeight: 1,
          position: "absolute",
          top: dimensions.plotTop + scale(tick) - yAxisLabelFontSize / 2,
          width: dimensions.yAxisLabelWidth - yAxisLabelGap,
        }}
      >
        {formatChartValue(tick)}
      </div>
    ))}
  </>
);

export const ChartXAxisLabels = ({
  dimensions,
  labels,
  rotated,
}: ChartXAxisLabelsProps) => {
  const labelWidth = rotated
    ? dimensions.xAxisLabelWidth
    : xAxisLabelHorizontalWidth;
  const getLabelLeft = (label: ChartAxisLabel) => {
    const unclampedLeft = dimensions.plotLeft + label.x - labelWidth;
    const maxLeft = dimensions.width - chartRightPadding - labelWidth;

    if (rotated) {
      return Math.min(unclampedLeft, maxLeft);
    }

    return Math.min(Math.max(chartLeftPadding, unclampedLeft), maxLeft);
  };

  return (
    <>
      {labels.map((label) => (
        <div
          key={label.key}
          style={{
            display: "flex",
            fontSize: xAxisLabelFontSize,
            justifyContent: rotated ? "flex-end" : "center",
            left: getLabelLeft(label),
            lineHeight: 1,
            position: "absolute",
            textAlign: rotated ? "right" : "center",
            top: dimensions.xAxisLabelTop,
            width: labelWidth,
            ...(rotated
              ? { transform: "rotate(-45deg)", transformOrigin: "100% 50%" }
              : {}),
          }}
        >
          {label.label}
        </div>
      ))}
    </>
  );
};
