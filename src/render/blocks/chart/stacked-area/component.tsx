import {
  CartesianChartFrame,
  ChartPlotSvg,
  ChartXAxisLabels,
  ChartYAxisLabels,
  chartInkColor,
  createChartYScale,
  createChartYTicks,
  createPointXScale,
  createVisibleXAxisLabels,
  formatChartValue,
  getChartLineStyle,
  getChartPatternFill,
  getMaxValue,
  getPointLabels,
  getStackedTotals,
  renderChartFrame,
  renderChartGridLines,
  renderChartPatternDefs,
} from "../layout";
import {
  area as createArea,
  line as createLine,
  stack as createStack,
} from "d3-shape";
import { renderSatoriImage } from "../../../satori";

import type { BlockRenderContext } from "../../context";
import type { StackedAreaChartBlock } from "./schema";

type StackedAreaChartLayoutProps = {
  block: StackedAreaChartBlock;
  width: number;
};

type StackRow = Record<string, number>;

export const StackedAreaChartLayout = ({
  block,
  width,
}: StackedAreaChartLayoutProps) => {
  const pointCount = block.series[0]?.values.length ?? 0;
  const labels = getPointLabels(block.xLabels, pointCount);
  const totals = getStackedTotals(block.series);
  const maxTotal = Math.max(getMaxValue(totals), 1);
  const yTicks = createChartYTicks({
    includeZero: true,
    values: totals,
    yMax: block.yMax ?? maxTotal,
    yMin: 0,
  });
  const legendItems = block.series.map((series, index) => ({
    label: series.label,
    sample: {
      index,
      kind: "fill" as const,
    },
  }));

  return (
    <CartesianChartFrame
      legendItems={legendItems}
      reserveFirstXAxisLabelGutter
      width={width}
      xLabels={labels}
      yLabels={yTicks.map(formatChartValue)}
    >
      {(dimensions) => {
        const xScale = createPointXScale(pointCount, dimensions.plotWidth);
        const yScale = createChartYScale({
          includeZero: true,
          plotHeight: dimensions.plotHeight,
          values: totals,
          yMax: block.yMax ?? maxTotal,
          yMin: 0,
        });
        const xLabels = createVisibleXAxisLabels({
          dimensions,
          labels,
          xForIndex: (index) => xScale(index),
        });
        const stackKeys = block.series.map((_, index) => String(index));
        const rows: StackRow[] = Array.from(
          { length: pointCount },
          (_, pointIndex) =>
            Object.fromEntries(
              block.series.map((series, seriesIndex) => [
                String(seriesIndex),
                series.values[pointIndex] ?? 0,
              ]),
            ),
        );
        const layers = createStack<StackRow>().keys(stackKeys)(rows);
        const area = createArea<[number, number]>()
          .x((_, index) => xScale(index))
          .y0((point) => yScale(point[0]))
          .y1((point) => yScale(point[1]));
        const line = createLine<[number, number]>()
          .x((_, index) => xScale(index))
          .y((point) => yScale(point[1]));

        return (
          <>
            <ChartPlotSvg dimensions={dimensions}>
              {renderChartPatternDefs({ count: block.series.length })}
              {renderChartGridLines({ dimensions, ticks: yTicks, yScale })}
              {layers.map((layer, index) => (
                <path
                  d={area(layer as Array<[number, number]>) ?? ""}
                  fill={getChartPatternFill(index)}
                  key={`fill:${block.series[index]?.label ?? index}`}
                  stroke="none"
                />
              ))}
              {layers.map((layer, index) => {
                const style = getChartLineStyle(index);

                return (
                  <path
                    d={line(layer as Array<[number, number]>) ?? ""}
                    fill="none"
                    key={`line:${block.series[index]?.label ?? index}`}
                    stroke={chartInkColor}
                    strokeLinejoin="round"
                    strokeWidth={style.strokeWidth}
                  />
                );
              })}
              {renderChartFrame({ dimensions })}
            </ChartPlotSvg>
            <ChartYAxisLabels
              dimensions={dimensions}
              scale={yScale}
              ticks={yTicks}
            />
            <ChartXAxisLabels
              dimensions={dimensions}
              labels={xLabels.labels}
              rotated={xLabels.rotated}
            />
          </>
        );
      }}
    </CartesianChartFrame>
  );
};

export const renderStackedAreaChartBlock = (
  block: StackedAreaChartBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: (
      <StackedAreaChartLayout block={block} width={context.printerDotWidth} />
    ),
  });
