import type { BlockRenderContext } from "../context";
import type { ComponentProps } from "react";
import { Image } from "react-thermal-printer";
import type { ImageBlock } from "./schema";
import type { Image as ImageData } from "@react-thermal-printer/image";
import { ImageRenderError } from "./error";
import { fetchRemoteImage } from "./remote";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";
import sharp from "sharp";

type ImageProps = ComponentProps<typeof Image>;

const readImageData = async (
  block: ImageBlock,
  context: BlockRenderContext,
): Promise<Buffer> => {
  if (block.data !== undefined) {
    return Buffer.from(block.data, "base64");
  }

  if (block.url !== undefined) {
    return await fetchRemoteImage(block.url, {
      maxBytes: context.imageSource.maxRemoteImageBytes,
      timeoutMs: context.imageSource.remoteImageTimeoutMs,
    });
  }

  throw new ImageRenderError(
    "IMAGE_SOURCE_MISSING",
    "Image block must include data or url.",
  );
};

const createReader = (
  block: ImageBlock,
  context: BlockRenderContext,
): NonNullable<ImageProps["reader"]> => {
  return async (): Promise<ImageData> => {
    let data: Buffer;
    let info: sharp.OutputInfo;

    try {
      const image = await readImageData(block, context);
      const renderedImage = await sharp(image, {
        limitInputPixels: context.imageSource.maxImageInputPixels,
      })
        .resize({
          width: context.printerDotWidth,
          fit: block.fit,
          withoutEnlargement: block.withoutEnlargement,
        })
        .toColorspace("srgb")
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      data = renderedImage.data;
      info = renderedImage.info;
    } catch (error) {
      if (error instanceof ImageRenderError) {
        throw error;
      }

      throw new ImageRenderError(
        "IMAGE_SHARP_PROCESSING_ERROR",
        error instanceof Error
          ? error.message
          : "Sharp failed to process the image.",
        { cause: error },
      );
    }

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
    ...omitUndefined(
      omit(["data", "fit", "type", "url", "withoutEnlargement"])(block),
    ),
    reader: createReader(block, context),
    // The `Image` component requires a `src` prop, but since we're using a
    // custom `reader`, it won't actually be used.
    src: "",
  };

  return <Image {...props} />;
};
