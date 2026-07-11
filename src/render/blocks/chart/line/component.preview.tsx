import { LineChartLayout } from "./component";
import type { SatoriPreviewFactory } from "../../../../routes/preview/types";

const createPreview: SatoriPreviewFactory = (width) => ({
  title: "Line chart",
  examples: [
    {
      element: (
        <LineChartLayout
          width={width}
          block={{
            type: "lineChart",
            xLabels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25"],
            series: [
              { label: "API", values: [120, 140, 110, 180, 165, 130] },
              { label: "DB", values: [80, 90, 95, 130, 120, 105] },
            ],
            yMin: 0,
            yMax: 200,
          }}
        />
      ),
    },
  ],
});

export default createPreview;
