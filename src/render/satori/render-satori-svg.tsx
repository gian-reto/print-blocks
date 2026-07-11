import type { BlockRenderContext } from "../blocks/context";
import type { ReactNode } from "react";
import { getSatoriFonts } from "./fonts";
import satori from "satori";

export type RenderSatoriSvgOptions = {
  context: BlockRenderContext;
  element: ReactNode;
};

export const renderSatoriSvg = async ({
  context,
  element,
}: RenderSatoriSvgOptions) =>
  await satori(element, {
    fonts: await getSatoriFonts(),
    pointScaleFactor: 1,
    width: context.printerDotWidth,
  });
