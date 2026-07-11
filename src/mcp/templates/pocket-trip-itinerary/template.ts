import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Pocket Trip Itinerary",
      align: "center",
      bold: true,
      size: { width: 2, height: 2 },
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Traveler" },
      right: { content: "John Doe" },
    },
    {
      type: "row",
      left: { content: "Trip" },
      right: { content: "Zurich to Paris" },
    },
    {
      type: "row",
      left: { content: "Dates" },
      right: { content: "18-20 Jul 2026" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "token",
      title: "BOOKING REFERENCE",
      content: "TRIP-4827",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Schedule",
      align: "center",
      bold: true,
    },
    {
      type: "timeline",
      items: [
        {
          label: "18 Jul 07:10",
          description: "Train IC 1 departs Zurich HB, platform 14",
        },
        {
          label: "18 Jul 11:38",
          description: "Arrive at Gare de Lyon and take the metro to the hotel",
        },
        {
          label: "18 Jul 15:00",
          description: "Hotel check-in on Rue de Rivoli",
        },
        {
          label: "19 Jul 10:30",
          description: "Museum reservation, arrive 15 minutes early",
        },
        {
          label: "20 Jul 16:22",
          description: "Return train departs from Gare de Lyon",
        },
      ],
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Hotel" },
      right: { content: "Hotel Central" },
    },
    {
      type: "row",
      left: { content: "Emergency" },
      right: { content: "+41 44 555 01 01" },
    },
    {
      type: "br",
    },
    {
      type: "qrcode",
      content: "https://example.com/trips/TRIP-4827/map",
      align: "center",
      model: "model2",
      cellSize: 4,
      correction: "M",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Scan for maps and reservation details.",
      align: "center",
    },
    {
      type: "br",
    },
    {
      type: "barcode",
      format: "CODE128",
      content: "{BTRIP4827",
      align: "center",
      hriPosition: "bottom",
      width: 2,
      height: 72,
    },
  ],
} as const satisfies PrintRequest;
