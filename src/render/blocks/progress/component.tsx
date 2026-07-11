import type { BlockRenderContext } from "../context";
import type { ProgressBlock } from "./schema";
import { renderSatoriImage } from "../../satori";

const contentColor = "black";

type ProgressLayoutProps = {
  block: ProgressBlock;
  width: number;
};

const getProgressRatio = (block: ProgressBlock) => block.value / block.max;

const ProgressBar = ({
  block,
}: {
  block: Extract<ProgressBlock, { variant: "bar" }>;
}) => (
  <div
    style={{
      border: `2px solid ${contentColor}`,
      display: "flex",
      height: 24,
      overflow: "hidden",
      width: "100%",
    }}
  >
    <div
      style={{
        backgroundColor: contentColor,
        height: "100%",
        width: `${getProgressRatio(block) * 100}%`,
      }}
    />
  </div>
);

const ProgressSteps = ({
  block,
}: {
  block: Extract<ProgressBlock, { variant: "steps" }>;
}) => {
  const filledSteps = Math.floor(getProgressRatio(block) * block.steps);
  const stepSize = 24;

  return (
    <div
      style={{
        columnGap: 4,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 4,
        width: "100%",
      }}
    >
      {Array.from({ length: block.steps }, (_, index) => {
        const isFilled = index < filledSteps;

        return (
          <div
            key={index}
            style={{
              ...(isFilled ? { backgroundColor: contentColor } : {}),
              border: `2px solid ${contentColor}`,
              borderRadius: block.style === "circles" ? stepSize / 2 : 0,
              height: stepSize,
              width: stepSize,
            }}
          />
        );
      })}
    </div>
  );
};

export const ProgressLayout = ({ block, width }: ProgressLayoutProps) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      padding: "8px 0",
      width,
    }}
  >
    {block.variant === "steps" ? (
      <ProgressSteps block={block} />
    ) : (
      <ProgressBar block={block} />
    )}
  </div>
);

export const renderProgressBlock = (
  block: ProgressBlock,
  context: BlockRenderContext,
) =>
  renderSatoriImage({
    context,
    element: <ProgressLayout block={block} width={context.printerDotWidth} />,
  });
