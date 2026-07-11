import type { SatoriPreviewFactory } from "../../../routes/preview/types";
import { TokenLayout } from "./component";

const createPreview: SatoriPreviewFactory = () => ({
  title: "Token",
  examples: [
    {
      element: (
        <TokenLayout
          block={{
            type: "token",
            title: "Coupon code",
            content: "LOREM IPSUM",
          }}
        />
      ),
    },
    {
      element: (
        <TokenLayout
          block={{
            type: "token",
            title: "Recovery code",
            content: "LOREM IPSUM ".repeat(7),
          }}
        />
      ),
    },
  ],
});

export default createPreview;
