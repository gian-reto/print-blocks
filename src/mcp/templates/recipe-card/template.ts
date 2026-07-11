import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Lemon Herb Pasta",
      align: "center",
      bold: true,
      size: { width: 2, height: 2 },
    },
    {
      type: "text",
      content: "2 servings, Prep 10 min, Cook 15 min",
      align: "center",
    },
    {
      type: "br",
    },
    {
      type: "token",
      title: "COOKING SETTING",
      content: "SIMMER / 12 MIN",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Ingredients",
      align: "center",
      bold: true,
    },
    {
      type: "row",
      left: { content: "Spaghetti" },
      right: { content: "200 g" },
    },
    {
      type: "row",
      left: { content: "Lemon" },
      right: { content: "1" },
    },
    {
      type: "row",
      left: { content: "Olive oil" },
      right: { content: "2 tbsp" },
    },
    {
      type: "row",
      left: { content: "Parmesan" },
      right: { content: "40 g" },
    },
    {
      type: "row",
      left: { content: "Fresh herbs" },
      right: { content: "1 handful" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Method",
      align: "center",
      bold: true,
    },
    {
      type: "timeline",
      items: [
        {
          label: "1",
          description: "Boil the pasta in salted water until just tender",
        },
        {
          label: "2",
          description:
            "Warm olive oil, lemon zest, and half the herbs in a wide pan",
        },
        {
          label: "3",
          description:
            "Toss in the drained pasta with a splash of cooking water",
        },
        {
          label: "4",
          description:
            "Finish with lemon juice, Parmesan, and the remaining herbs",
        },
      ],
    },
    {
      type: "br",
    },
    {
      type: "qrcode",
      content: "https://example.com/recipes/lemon-herb-pasta",
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
      content: "Scan for the full recipe.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
