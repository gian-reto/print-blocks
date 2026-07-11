import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Coffee Shop",
      align: "center",
      bold: true,
    },
    {
      type: "text",
      content: "Order #1042",
      align: "center",
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "row",
      left: { content: "Espresso" },
      right: { content: "3.50" },
    },
    {
      type: "row",
      left: { content: "Croissant" },
      right: { content: "4.20" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "row",
      left: { content: "Total", bold: true },
      right: { content: "7.70", bold: true },
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Thank you for your visit!",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
