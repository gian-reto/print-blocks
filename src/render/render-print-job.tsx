import { Fragment } from "react";
import type { CharacterSet, PrinterType } from "react-thermal-printer";
import { Cut, Printer, render } from "react-thermal-printer";
import { renderBlock } from "./blocks";
import type { PrintBlock } from "./blocks/schema";

export type PrinterRenderOptions = {
  type: PrinterType;
  width: number;
  characterSet: CharacterSet;
};

export const renderPrintJob = async (
  blocks: PrintBlock[],
  options: PrinterRenderOptions,
): Promise<Uint8Array> => {
  const receipt = (
    <Printer
      type={options.type}
      width={options.width}
      characterSet={options.characterSet}
    >
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block)}</Fragment>
      ))}
      <Cut />
    </Printer>
  );

  return await render(receipt);
};
