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
  getAllSeriesValues,
  getChartLineStyle,
  getPointLabels,
  renderChartFrame,
  renderChartGridLines,
} from "../layout";
import { line as createLine } from "d3-shape";
import { omitUndefined } from "../../../../util/omit-undefined";
import { renderSatoriImage } from "../../../satori";

import type { BlockRenderContext } from "../../context";
import type { LineChartBlock } from "./schema";

type LineChartLayoutProps = {
  block: LineChartBlock;
  width: number;
};

export const LineChartLayout = ({ block, width }: LineChartLayoutProps) => {
  const pointCount = block.series[0]?.values.length ?? 0;
  const labels = getPointLabels(block.xLabels, pointCount);
  const yValues = getAllSeriesValues(block.series);
  const yTicks = createChartYTicks({
    values: yValues,
    yMax: block.yMax,
    yMin: block.yMin,
  });
  const legendItems =
    block.series.length > 1
      ? block.series.map((series, index) => ({
          label: series.label,
          sample: {
            kind: "line" as const,
            style: getChartLineStyle(index),
          },
        }))
      : undefined;

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
          plotHeight: dimensions.plotHeight,
          values: yValues,
          yMax: block.yMax,
          yMin: block.yMin,
        });
        const xLabels = createVisibleXAxisLabels({
          dimensions,
          labels,
          xForIndex: (index) => xScale(index),
        });
        const line = createLine<number>()
          .x((_, index) => xScale(index))
          .y((value) => yScale(value));

        return (
          <>
            <ChartPlotSvg dimensions={dimensions}>
              {renderChartGridLines({ dimensions, ticks: yTicks, yScale })}
              {block.series.map((series, index) => {
                const style = getChartLineStyle(index);

                return (
                  <path
                    {...omitUndefined({
                      strokeDasharray: style.strokeDasharray,
                    })}
                    d={line(series.values) ?? ""}
                    fill="none"
                    key={series.label}
                    stroke={chartInkColor}
                    strokeLinecap="round"
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

export const renderLineChartBlock = (
  block: LineChartBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: <LineChartLayout block={block} width={context.printerDotWidth} />,
  });
