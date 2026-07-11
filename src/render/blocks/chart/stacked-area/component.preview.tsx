import type { SatoriPreviewFactory } from "../../../../routes/preview/types";
import { StackedAreaChartLayout } from "./component";

const createPreview: SatoriPreviewFactory = (width) => ({
  title: "Stacked area chart",
  examples: [
    {
      element: (
        <StackedAreaChartLayout
          width={width}
          block={{
            type: "stackedAreaChart",
            xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            series: [
              { label: "Solar", values: [5, 8, 7, 6, 9, 10, 8] },
              { label: "Grid", values: [4, 3, 6, 5, 2, 1, 3] },
              { label: "Battery", values: [1, 2, 2, 4, 3, 2, 1] },
              { label: "Backup", values: [0, 1, 2, 1, 0, 0, 2] },
            ],
          }}
        />
      ),
    },
  ],
});

export default createPreview;
