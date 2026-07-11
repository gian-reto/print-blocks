import { describe, expect, it } from "vitest";

import { createPrintRequestSchema } from "../../../render/blocks/schema";
import { template } from "./template";

const createSchema = () =>
  createPrintRequestSchema({
    allowRemoteImageUrls: false,
    maxBlocksPerPrintJob: template.blocks.length,
    maxTextCharsPerBlock: 100,
  });

describe("monthly site energy template", () => {
  it("validates against the print request schema", () => {
    const result = createSchema().safeParse(template);

    expect(result.success).toBe(true);
  });
});
