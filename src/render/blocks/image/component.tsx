import type { BlockRenderContext } from "../context";
import type { ComponentProps } from "react";
import { Image } from "react-thermal-printer";
import type { ImageBlock } from "./schema";
import type { Image as ImageData } from "@react-thermal-printer/image";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";
import sharp from "sharp";

type ImageProps = ComponentProps<typeof Image>;

const createReader = (
  block: ImageBlock,
  context: BlockRenderContext,
): NonNullable<ImageProps["reader"]> => {
  return async ({ props: { src } }): Promise<ImageData> => {
    const image = Buffer.from(src, "base64");
    const { data, info } = await sharp(image)
      .resize({
        width: context.printerDotWidth,
        fit: block.fit,
        withoutEnlargement: block.withoutEnlargement,
      })
      .toColorspace("srgb")
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    return {
      data: new Uint8Array(data),
      width: info.width,
      height: info.height,
    };
  };
};

export const renderImageBlock = (
  block: ImageBlock,
  context: BlockRenderContext,
) => {
  const props: ImageProps = {
    ...omitUndefined(omit(["fit", "type", "withoutEnlargement"])(block)),
    reader: createReader(block, context),
  };

  return <Image {...props} />;
};
