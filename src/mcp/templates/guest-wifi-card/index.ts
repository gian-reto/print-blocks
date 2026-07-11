import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A guest welcome card with readable Wi-Fi credentials, a scan-to-connect QR code, and useful stay information.",
  id: "guest-wifi-card",
  instructions,
  tags: ["wifi", "guest", "welcome", "token", "qrcode"],
  template,
  title: "Guest welcome and Wi-Fi card",
} as const satisfies PrintTemplate;
