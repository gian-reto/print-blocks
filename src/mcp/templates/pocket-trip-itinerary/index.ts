import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A compact multi-day itinerary with key travel events, booking details, contacts, maps, and scannable references.",
  id: "pocket-trip-itinerary",
  instructions,
  tags: ["travel", "itinerary", "timeline", "qrcode", "barcode"],
  template,
  title: "Pocket trip itinerary",
} as const satisfies PrintTemplate;
