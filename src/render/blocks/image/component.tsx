import type { ComponentProps } from "react";
import { Image } from "react-thermal-printer";
import type { ImageBlock } from "./schema";
import type { Image as ImageData } from "@react-thermal-printer/image";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";
import sharp from "sharp";

type ImageProps = ComponentProps<typeof Image>;

const reader: NonNullable<ImageProps["reader"]> = async ({
  props: { src },
}): Promise<ImageData> => {
  const image = Buffer.from(src, "base64");
  const { data, info } = await sharp(image)
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

export const renderImageBlock = (block: ImageBlock) => {
  const props: ImageProps = { ...omitUndefined(omit(["type"])(block)), reader };

  return <Image {...props} />;
};
