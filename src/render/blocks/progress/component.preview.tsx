import type { SatoriPreviewFactory } from "../../../routes/preview/types";
import { ProgressLayout } from "./component";

const createPreview: SatoriPreviewFactory = (width) => ({
  title: "Progress",
  examples: [
    {
      element: (
        <ProgressLayout
          width={width}
          block={{
            type: "progress",
            variant: "bar",
            value: 67,
            max: 100,
          }}
        />
      ),
    },
    {
      element: (
        <ProgressLayout
          width={width}
          block={{
            type: "progress",
            variant: "steps",
            value: 4,
            max: 10,
            steps: 10,
            style: "squares",
          }}
        />
      ),
    },
    {
      element: (
        <ProgressLayout
          width={width}
          block={{
            type: "progress",
            variant: "steps",
            value: 6,
            max: 8,
            steps: 8,
            style: "circles",
          }}
        />
      ),
    },
  ],
});

export default createPreview;
