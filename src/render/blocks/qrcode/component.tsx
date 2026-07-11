import type { ComponentProps } from "react";
import { QRCode } from "react-thermal-printer";
import type { QrCodeBlock } from "./schema";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";

type QRCodeProps = ComponentProps<typeof QRCode>;

export const renderQrCodeBlock = (block: QrCodeBlock) => {
  const props: QRCodeProps = omitUndefined(omit(["type"])(block));

  return <QRCode {...props} />;
};
