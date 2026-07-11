import type { SatoriPreview } from "../../../routes/preview/types";
import { TokenLayout } from "./component";

const preview = {
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
} satisfies SatoriPreview;

export default preview;
