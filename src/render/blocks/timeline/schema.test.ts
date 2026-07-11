import {
  createTimelineBlockSchema,
  maxTimelineDescriptionChars,
  maxTimelineItems,
  maxTimelineLabelChars,
  minTimelineItems,
} from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createTimelineBlockSchema(11);

const createTimelineItem = (index: number) => ({
  label: `T${index}`,
  description: `Step ${index}`,
});

describe("timeline block schema", () => {
  it("accepts and strips extra fields from valid timeline blocks", () => {
    const result = createSchema().parse({
      type: "timeline",
      items: [
        { label: "09:00", description: "Build started", unknown: true },
        { label: "09:04", description: "Tests passed" },
      ],
      unknown: true,
    });

    expect(result).toEqual({
      type: "timeline",
      items: [
        { label: "09:00", description: "Build started" },
        { label: "09:04", description: "Tests passed" },
      ],
    });
  });

  it("accepts the maximum timeline item count", () => {
    const result = createSchema().parse({
      type: "timeline",
      items: Array.from({ length: maxTimelineItems }, (_, index) =>
        createTimelineItem(index),
      ),
    });

    expect(result.items).toHaveLength(maxTimelineItems);
  });

  it("rejects too few timeline items", () => {
    const result = createSchema().safeParse({
      type: "timeline",
      items: Array.from({ length: minTimelineItems - 1 }, (_, index) =>
        createTimelineItem(index),
      ),
    });

    expect(result.success).toBe(false);
  });

  it("rejects too many timeline items", () => {
    const result = createSchema().safeParse({
      type: "timeline",
      items: Array.from({ length: maxTimelineItems + 1 }, (_, index) =>
        createTimelineItem(index),
      ),
    });

    expect(result.success).toBe(false);
  });

  it("rejects blank labels", () => {
    const result = createSchema().safeParse({
      type: "timeline",
      items: [
        { label: "   ", description: "Build started" },
        { label: "09:04", description: "Tests passed" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects blank descriptions", () => {
    const result = createSchema().safeParse({
      type: "timeline",
      items: [
        { label: "09:00", description: "\n\t" },
        { label: "09:04", description: "Tests passed" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects labels over the fixed label limit", () => {
    const result = createSchema().safeParse({
      type: "timeline",
      items: [
        {
          label: "L".repeat(maxTimelineLabelChars + 1),
          description: "Build started",
        },
        { label: "09:04", description: "Tests passed" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects descriptions over the fixed description limit", () => {
    const result = createSchema().safeParse({
      type: "timeline",
      items: [
        {
          label: "09:00",
          description: "D".repeat(maxTimelineDescriptionChars + 1),
        },
        { label: "09:04", description: "Tests passed" },
      ],
    });

    expect(result.success).toBe(false);
  });
});
