import type { SatoriPreviewFactory } from "../../../../routes/preview/types";
import { BarChartLayout } from "./component";

const createPreview: SatoriPreviewFactory = (width) => ({
  title: "Bar chart",
  examples: [
    {
      element: (
        <BarChartLayout
          width={width}
          block={{
            type: "barChart",
            items: [
              { label: "Mon", value: 12 },
              { label: "Tue", value: 18 },
              { label: "Wed", value: 9 },
              { label: "Thu", value: 24 },
              { label: "Fri", value: 16 },
              { label: "Sat", value: 7 },
              { label: "Sun", value: 11 },
            ],
          }}
        />
      ),
    },
  ],
});

export default createPreview;
