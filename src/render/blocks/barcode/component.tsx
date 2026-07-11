import { Barcode } from "react-thermal-printer";
import type { BarcodeBlock } from "./schema";
import type { ComponentProps } from "react";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";

type BarcodeProps = Omit<ComponentProps<typeof Barcode>, "type">;

export const renderBarcodeBlock = (block: BarcodeBlock) => {
  const props: BarcodeProps = omitUndefined(omit(["format", "type"])(block));

  return <Barcode {...props} type={block.format} />;
};
