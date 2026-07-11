import { isSupportedImageFormat, supportedImageFormats } from "./formats";

import type { BlockRenderContext } from "../context";
import type { ComponentProps } from "react";
import type { Image } from "react-thermal-printer";
import type { ImageBlock } from "./schema";
import type { Image as ImageData } from "@react-thermal-printer/image";
import { ImageRenderError } from "./error";
import sharp from "sharp";

type ImageProps = ComponentProps<typeof Image>;

export type CreateImageReaderOptions = {
  context: BlockRenderContext;
  fit?: ImageBlock["fit"];
  maxWidth?: ImageBlock["maxWidth"];
  readImageData: () => Buffer | Promise<Buffer>;
  withoutEnlargement?: ImageBlock["withoutEnlargement"];
};

export const createImageReader = ({
  context,
  fit = sharp.fit.inside,
  maxWidth,
  readImageData,
  withoutEnlargement = true,
}: CreateImageReaderOptions): NonNullable<ImageProps["reader"]> => {
  return async (): Promise<ImageData> => {
    let data: Buffer;
    let info: sharp.OutputInfo;

    try {
      const image = await readImageData();
      const sharpImage = sharp(image, {
        limitInputPixels: context.imageSource.maxImageInputPixels,
      });
      const metadata = await sharpImage.metadata();

      if (!isSupportedImageFormat(metadata.format)) {
        throw new ImageRenderError(
          "IMAGE_UNSUPPORTED_FORMAT",
          `Unsupported image format: ${metadata.format}. Supported image formats are: ${supportedImageFormats.join(", ")}.`,
        );
      }

      const renderedImage = await sharpImage
        .resize({
          // Use `maxWidth` as a percentage of the printer width. Defaults to
          // 100% if it is not specified.
          width: Math.round(
            (context.printerDotWidth * (maxWidth ?? 100)) / 100,
          ),
          fit,
          withoutEnlargement,
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
      // Image transforms follow the browser ImageData contract and rely on
      // clamped channel writes.
      data: new Uint8ClampedArray(data) as unknown as ImageData["data"],
      height: info.height,
      width: info.width,
    };
  };
};
