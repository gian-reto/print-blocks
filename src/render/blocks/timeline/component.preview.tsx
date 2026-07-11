import type { SatoriPreviewFactory } from "../../../routes/preview/types";
import { TimelineLayout } from "./component";

const createPreview: SatoriPreviewFactory = (width) => ({
  title: "Timeline",
  examples: [
    {
      element: (
        <TimelineLayout
          width={width}
          block={{
            type: "timeline",
            items: [
              { label: "09:00", description: "Build started" },
              { label: "09:04", description: "Tests passed" },
              {
                label: "09:07",
                description:
                  "Deployed to production with a zero-downtime rollout and health checks across all regions",
              },
              {
                label: "09:10",
                description:
                  "Cleaned up old build artifacts and temporary files",
              },
            ],
          }}
        />
      ),
    },
    {
      element: (
        <TimelineLayout
          width={width}
          block={{
            type: "timeline",
            items: [
              { label: "a1b2c3d", description: "Add chart preview route" },
              {
                label: "d4e5f6a",
                description: "Fix printer transport timeout handling",
              },
              {
                label: "f7a8b9c",
                description: "Document Satori-backed receipt blocks",
              },
            ],
          }}
        />
      ),
    },
  ],
});

export default createPreview;
