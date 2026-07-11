import { HeatmapLayout } from "./component";
import type { SatoriPreviewFactory } from "../../../routes/preview/types";

const createPreview: SatoriPreviewFactory = (width) => ({
  title: "Heatmap",
  examples: [
    {
      element: (
        <HeatmapLayout
          width={width}
          block={{
            type: "heatmap",
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: [
              [null, 1, 0, 2, 3, 4, 5],
              [0, 2, 1, null, 3, 5, 4],
              [1, 3, 2, 0, 4, null, 5],
            ],
          }}
        />
      ),
    },
    {
      element: (
        <HeatmapLayout
          width={width}
          block={{
            type: "heatmap",
            labels: ["00", "03", "06", "09", "12", "15", "18", "21"],
            values: [
              [0, 1, 2, 4, 5, 4, 2, 1],
              [1, 2, 3, 5, 6, 5, 3, 2],
              [0, null, 2, 3, 4, 3, 2, 0],
              [1, 1, 2, 4, 6, 5, 4, 2],
            ],
          }}
        />
      ),
    },
  ],
});

export default createPreview;
