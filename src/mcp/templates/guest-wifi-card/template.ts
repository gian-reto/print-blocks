import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Welcome to Cedar House",
      align: "center",
      bold: true,
      size: { width: 2, height: 2 },
    },
    {
      type: "text",
      content: "Guest Wi-Fi",
      align: "center",
      bold: true,
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "row",
      left: { content: "Network" },
      right: { content: "Cedar Guest" },
    },
    {
      type: "row",
      left: { content: "Security" },
      right: { content: "WPA2" },
    },
    {
      type: "br",
    },
    {
      type: "token",
      title: "PASSWORD",
      content: "welcome-home-2026",
    },
    {
      type: "br",
    },
    {
      type: "qrcode",
      content: "WIFI:T:WPA;S:Cedar Guest;P:welcome-home-2026;;",
      align: "center",
      model: "model2",
      cellSize: 5,
      correction: "M",
    },
    {
      type: "text",
      content: "Scan to connect",
      align: "center",
      bold: true,
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "row",
      left: { content: "Help" },
      right: { content: "+41 44 555 01 01" },
    },
    {
      type: "row",
      left: { content: "Check-out" },
      right: { content: "11:00" },
    },
    {
      type: "text",
      content: "Make yourself at home!",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
