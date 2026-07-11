import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A receipt-style layout with a header, separators, line items, and a total row.",
  id: "receipt",
  instructions,
  tags: ["receipt", "row", "line"],
  template,
  title: "Receipt",
} as const satisfies PrintTemplate;
