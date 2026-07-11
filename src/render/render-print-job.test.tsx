import { describe, expect, it } from "vitest";
import {
  Br,
  Cut,
  Line,
  Printer,
  QRCode,
  render,
  Row,
  Text,
} from "react-thermal-printer";
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

  it("renders qrcode blocks", async () => {
    const blocks: PrintBlock[] = [
      {
        type: "qrcode",
        content: "https://example.com",
        align: "center",
        model: "model2",
        cellSize: 4,
        correction: "M",
      },
    ];

    await expectRender(
      blocks,
      <QRCode
        content="https://example.com"
        align="center"
        model="model2"
        cellSize={4}
        correction="M"
      />,
    );
  });

  it("renders row blocks", async () => {
    const blocks: PrintBlock[] = [
      {
        type: "row",
        left: { content: "Item", bold: true },
        center: { content: "x2" },
        right: { content: "1.00", size: { width: 2, height: 1 } },
        gap: 1,
      },
    ];

    await expectRender(
      blocks,
      <Row
        left={<Text bold>Item</Text>}
        center={<Text>x2</Text>}
        right={<Text size={{ width: 2, height: 1 }}>1.00</Text>}
        gap={1}
      />,
    );
  });
});
