import type { CharacterSet, PrinterType } from "react-thermal-printer";
import { Cut, Printer, render } from "react-thermal-printer";

import { Fragment } from "react";
import type { PrintBlock } from "./blocks/schema";
import { renderBlock } from "./blocks";

export type PrinterRenderOptions = {
  type: PrinterType;
  width: number;
  printerDotWidth: number;
  characterSet: CharacterSet;
  imageSource: {
    maxImageInputPixels: number;
    maxRemoteImageBytes: number;
    remoteImageTimeoutMs: number;
  };
};

export const renderPrintJob = async (
  blocks: PrintBlock[],
  options: PrinterRenderOptions,
): Promise<Uint8Array> => {
  const blockRenderContext = {
    imageSource: options.imageSource,
    printerDotWidth: options.printerDotWidth,
  };

  const receipt = (
    <Printer
      type={options.type}
      width={options.width}
      characterSet={options.characterSet}
    >
      {blocks.map((block, index) => (
        <Fragment key={index}>
          {renderBlock(block, blockRenderContext)}
        </Fragment>
      ))}
      <Cut />
    </Printer>
  );

  return await render(receipt);
};
