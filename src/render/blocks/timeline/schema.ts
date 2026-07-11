import { z } from "@hono/zod-openapi";

export const minTimelineItems = 2;
export const maxTimelineItems = 16;
export const maxTimelineLabelChars = 24;
export const maxTimelineDescriptionChars = 160;

const nonBlankString = (message: string) =>
  z.string().refine((value) => value.trim().length > 0, {
    message,
  });

const timelineItemSchema = z
  .object({
    label: nonBlankString("Timeline label must not be blank.")
      .max(maxTimelineLabelChars)
      .openapi({ example: "09:00" }),
    description: nonBlankString("Timeline description must not be blank.")
      .max(maxTimelineDescriptionChars)
      .openapi({ example: "Build started" }),
  })
  .strip();

export const createTimelineBlockSchema = (_maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("timeline").openapi({ example: "timeline" }),
      items: z
        .array(timelineItemSchema)
        .min(minTimelineItems)
        .max(maxTimelineItems)
        .openapi({
          example: [
            { label: "09:00", description: "Build started" },
            { label: "09:04", description: "Tests passed" },
          ],
        }),
    })
    .strip()
    .openapi("TimelineBlock");

export type TimelineBlock = z.infer<
  ReturnType<typeof createTimelineBlockSchema>
>;
