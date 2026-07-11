import {
  CartesianChartFrame,
  ChartPlotSvg,
  ChartXAxisLabels,
  ChartYAxisLabels,
  chartInkColor,
  createChartYScale,
  createChartYTicks,
  createVisibleXAxisLabels,
  formatChartValue,
  getMaxValue,
  renderChartFrame,
  renderChartGridLines,
} from "../layout";
import { scaleBand } from "d3-scale";
import { renderSatoriImage } from "../../../satori";

import type { BarChartBlock } from "./schema";
import type { BlockRenderContext } from "../../context";

type BarChartLayoutProps = {
  block: BarChartBlock;
  width: number;
};

export const BarChartLayout = ({ block, width }: BarChartLayoutProps) => {
  const labels = block.items.map((item) => item.label);
  const values = block.items.map((item) => item.value);
  const maxValue = Math.max(getMaxValue(values), 1);
  const yTicks = createChartYTicks({
    includeZero: true,
    values,
    yMax: block.yMax ?? maxValue,
    yMin: 0,
  });

  return (
    <CartesianChartFrame
      width={width}
      xLabels={labels}
      yLabels={yTicks.map(formatChartValue)}
    >
      {(dimensions) => {
        const yScale = createChartYScale({
          includeZero: true,
          plotHeight: dimensions.plotHeight,
          values,
          yMax: block.yMax ?? maxValue,
          yMin: 0,
        });
        const xScale = scaleBand<string>()
          .domain(labels)
          .range([0, dimensions.plotWidth])
          .padding(0.24);
        const xLabels = createVisibleXAxisLabels({
          dimensions,
          labels,
          xForIndex: (index) => {
            const label = labels[index] ?? "";

            return (xScale(label) ?? 0) + xScale.bandwidth() / 2;
          },
        });

        return (
          <>
            <ChartPlotSvg dimensions={dimensions}>
              {renderChartGridLines({ dimensions, ticks: yTicks, yScale })}
              {block.items.map((item) => {
                const x = xScale(item.label) ?? 0;
                const y = yScale(item.value);
                const height = dimensions.plotHeight - y;

                return (
                  <rect
                    fill={chartInkColor}
                    height={height}
                    key={item.label}
                    width={xScale.bandwidth()}
                    x={x}
                    y={y}
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

export const renderBarChartBlock = (
  block: BarChartBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: <BarChartLayout block={block} width={context.printerDotWidth} />,
  });
