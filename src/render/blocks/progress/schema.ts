import { z } from "@hono/zod-openapi";

export const maxProgressSteps = 32;

const progressValueSchema = z.number().min(0).openapi({ example: 67 });

const progressMaxSchema = z.number().positive().openapi({
  example: 100,
});

const progressStepsSchema = z
  .number()
  .int()
  .min(1)
  .max(maxProgressSteps)
  .openapi({ example: 10 });

const progressStepStyleSchema = z
  .enum(["squares", "circles"])
  .openapi({ example: "circles" });

type ProgressValueBounds = {
  max: number;
  value: number;
};

const validateProgressValueBounds = (
  block: ProgressValueBounds,
  ctx: z.RefinementCtx,
) => {
  if (block.value <= block.max) {
    return;
  }

  ctx.addIssue({
    code: "custom",
    message: "Progress value must be less than or equal to max.",
    path: ["value"],
  });
};

const progressBaseSchema = z.object({
  // Block config.
  type: z.literal("progress").openapi({ example: "progress" }),
  max: progressMaxSchema,
  value: progressValueSchema,
});

const progressBarBlockSchema = progressBaseSchema
  .extend({
    variant: z.literal("bar").openapi({ example: "bar" }),
  })
  .strict()
  .superRefine(validateProgressValueBounds);

const progressStepsBlockSchema = progressBaseSchema
  .extend({
    variant: z.literal("steps").openapi({ example: "steps" }),
    steps: progressStepsSchema,
    style: progressStepStyleSchema,
  })
  .strict()
  .superRefine(validateProgressValueBounds);

export const createProgressBlockSchema = (_maxTextCharsPerBlock: number) =>
  z
    .discriminatedUnion("variant", [
      progressBarBlockSchema,
      progressStepsBlockSchema,
    ])
    .openapi("ProgressBlock");

export type ProgressBlock = z.infer<
  ReturnType<typeof createProgressBlockSchema>
>;
