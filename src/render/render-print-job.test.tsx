import { describe, expect, it } from "vitest";
import { Br, Cut, Printer, render, Text } from "react-thermal-printer";
import { renderPrintJob } from "./render-print-job";
import type { PrintBlock } from "./blocks/schema";

describe("renderPrintJob", () => {
  it("renders text blocks and appends a cut command", async () => {
    const blocks: PrintBlock[] = [{ type: "text", content: "Hello" }];
    const options = {
      type: "epson" as const,
      width: 48,
      characterSet: "pc437_usa" as const,
    };

    const actual = await renderPrintJob(blocks, options);
    const expected = await render(
      <Printer type="epson" width={48} characterSet="pc437_usa">
        <Text>Hello</Text>
        <Cut />
      </Printer>,
    );

    expect(Array.from(actual)).toEqual(Array.from(expected));
  });

  it("renders br blocks", async () => {
    const blocks: PrintBlock[] = [{ type: "br" }];
    const options = {
      type: "epson" as const,
      width: 48,
      characterSet: "pc437_usa" as const,
    };

    const actual = await renderPrintJob(blocks, options);
    const expected = await render(
      <Printer type="epson" width={48} characterSet="pc437_usa">
        <Br />
        <Cut />
      </Printer>,
    );

    expect(Array.from(actual)).toEqual(Array.from(expected));
  });
});
