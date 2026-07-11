import type { ComponentProps, ReactNode } from "react";

import type { BlockRenderContext } from "../blocks/context";
import { Image } from "react-thermal-printer";
import { createImageReader } from "../blocks/image/reader";
import { omitUndefined } from "../../util/omit-undefined";
import { renderSatoriSvg } from "./render-satori-svg";

type ImageProps = ComponentProps<typeof Image>;

export type RenderSatoriImageOptions = {
  align?: ImageProps["align"];
  context: BlockRenderContext;
  element: ReactNode;
  rgbToBlack?: ImageProps["rgbToBlack"];
  transforms?: ImageProps["transforms"];
};

export const renderSatoriImage = ({
  align,
  context,
  element,
  rgbToBlack,
  transforms,
}: RenderSatoriImageOptions) => {
  const props: ImageProps = {
    ...omitUndefined({
      align,
      rgbToBlack,
      transforms,
    }),
    reader: createImageReader({
      context,
      readImageData: async () =>
        Buffer.from(await renderSatoriSvg({ context, element }), "utf8"),
    }),
    // The `Image` component requires a `src` prop, but it is unused by the
    // custom reader.
    src: "",
  };

  return <Image {...props} />;
};
