import type { SatoriPreviewFactory } from "../../../../routes/preview/types";
import { AreaChartLayout } from "./component";

const createPreview: SatoriPreviewFactory = (width) => ({
  title: "Area chart",
  examples: [
    {
      element: (
        <AreaChartLayout
          width={width}
          block={{
            type: "areaChart",
            xLabels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
            series: {
              label: "Temperature",
              values: [19, 20.5, 22, 23.5, 22.8, 21.5],
            },
            yMin: 18,
            yMax: 25,
          }}
        />
      ),
    },
  ],
});

export default createPreview;
