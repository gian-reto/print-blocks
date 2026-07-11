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
  getPointLabels,
  renderChartFrame,
  renderChartGridLines,
  renderChartPatternDefs,
} from "../layout";
import { area as createArea, line as createLine } from "d3-shape";
import { renderSatoriImage } from "../../../satori";

import type { AreaChartBlock } from "./schema";
import type { BlockRenderContext } from "../../context";

type AreaChartLayoutProps = {
  block: AreaChartBlock;
  width: number;
};

export const AreaChartLayout = ({ block, width }: AreaChartLayoutProps) => {
  const pointCount = block.series.values.length;
  const labels = getPointLabels(block.xLabels, pointCount);
  const yTicks = createChartYTicks({
    includeZero: true,
    values: block.series.values,
    yMax: block.yMax,
    yMin: block.yMin,
  });
  const legendItems = [
    {
      label: block.series.label,
      sample: {
        index: 0,
        kind: "fill" as const,
      },
    },
  ];

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
          values: block.series.values,
          yMax: block.yMax,
          yMin: block.yMin,
        });
        const [domainMin = 0, domainMax = 1] = yScale.domain();
        const baselineValue = Math.min(Math.max(0, domainMin), domainMax);
        const baseline = yScale(baselineValue);
        const xLabels = createVisibleXAxisLabels({
          dimensions,
          labels,
          xForIndex: (index) => xScale(index),
        });
        const area = createArea<number>()
          .x((_, index) => xScale(index))
          .y0(baseline)
          .y1((value) => yScale(value));
        const line = createLine<number>()
          .x((_, index) => xScale(index))
          .y((value) => yScale(value));
        const lineStyle = getChartLineStyle(0);

        return (
          <>
            <ChartPlotSvg dimensions={dimensions}>
              {renderChartPatternDefs({ count: 1 })}
              {renderChartGridLines({ dimensions, ticks: yTicks, yScale })}
              <path
                d={area(block.series.values) ?? ""}
                fill={getChartPatternFill(0)}
                stroke="none"
              />
              <path
                d={line(block.series.values) ?? ""}
                fill="none"
                stroke={chartInkColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={lineStyle.strokeWidth}
              />
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

export const renderAreaChartBlock = (
  block: AreaChartBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: <AreaChartLayout block={block} width={context.printerDotWidth} />,
  });
