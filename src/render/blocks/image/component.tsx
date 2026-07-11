import type { BlockRenderContext } from "../context";
import type { ComponentProps } from "react";
import { Image } from "react-thermal-printer";
import type { ImageBlock } from "./schema";
import { ImageRenderError } from "./error";
import { createImageReader } from "./reader";
import { fetchRemoteImage } from "./remote";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";

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

export const renderImageBlock = (
  block: ImageBlock,
  context: BlockRenderContext,
) => {
  const props: ImageProps = {
    ...omitUndefined(
      omit(["data", "fit", "maxWidth", "type", "url", "withoutEnlargement"])(
        block,
      ),
    ),
    reader: createImageReader({
      context,
      fit: block.fit,
      maxWidth: block.maxWidth,
      readImageData: () => readImageData(block, context),
      withoutEnlargement: block.withoutEnlargement,
    }),
    // The `Image` component requires a `src` prop, but it is unused by the custom reader.
    src: "",
  };

  return <Image {...props} />;
};
