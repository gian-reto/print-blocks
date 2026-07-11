import { describe, expect, it } from "vitest";
import { Br, Cut, Line, Printer, render, Text } from "react-thermal-printer";
import type { ReactNode } from "react";
import { renderPrintJob, type PrinterRenderOptions } from "./render-print-job";
import type { PrintBlock } from "./blocks/schema";

const options: PrinterRenderOptions = {
  type: "epson",
  width: 48,
  characterSet: "pc437_usa",
};

const expectRender = async (blocks: PrintBlock[], children: ReactNode) => {
  const actual = await renderPrintJob(blocks, options);
  const expected = await render(
    <Printer {...options}>
      {children}
      <Cut />
    </Printer>,
  );

  expect(Array.from(actual)).toStrictEqual(Array.from(expected));
};

describe("renderPrintJob", () => {
  it("renders text blocks", async () => {
    const blocks: PrintBlock[] = [{ type: "text", content: "Hello" }];

    await expectRender(blocks, <Text>Hello</Text>);
  });

  it("renders br blocks", async () => {
    const blocks: PrintBlock[] = [{ type: "br" }];

    await expectRender(blocks, <Br />);
  });

  it("renders line blocks", async () => {
    const blocks: PrintBlock[] = [{ type: "line", character: "=" }];

    await expectRender(blocks, <Line character="=" />);
  });
});
