import { describe, expect, it } from "vitest";
import {
  Barcode,
  Br,
  Cut,
  Image,
  Line,
  Printer,
  QRCode,
  render,
  Row,
  Text,
} from "react-thermal-printer";
import {
  type Image as ImageData,
  transforms,
} from "@react-thermal-printer/image";
import type { ReactNode } from "react";
import { renderPrintJob, type PrinterRenderOptions } from "./render-print-job";
import type { PrintBlock } from "./blocks/schema";
import { whitePixelPngBase64 } from "../test/fixtures/image";
import sharp from "sharp";

const options: PrinterRenderOptions = {
  type: "epson",
  width: 48,
  characterSet: "pc437_usa",
};

const readImageBase64 = async (src: string): Promise<ImageData> => {
  const image = Buffer.from(src, "base64");
  const { data, info } = await sharp(image)
    .toColorspace("srgb")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    data: new Uint8Array(data),
    width: info.width,
    height: info.height,
  };
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
  it("renders barcode blocks", async () => {
    const blocks: PrintBlock[] = [
      {
        type: "barcode",
        format: "CODE128",
        content: "{B1234567890",
        align: "center",
        hriPosition: "bottom",
        hriFont: "A",
        width: 3,
        height: 100,
      },
    ];

    await expectRender(
      blocks,
      <Barcode
        type="CODE128"
        content="{B1234567890"
        align="center"
        hriPosition="bottom"
        hriFont="A"
        width={3}
        height={100}
      />,
    );
  });

  it("renders br blocks", async () => {
    const blocks: PrintBlock[] = [{ type: "br" }];

    await expectRender(blocks, <Br />);
  });

  it("renders image blocks", async () => {
    const rgbToBlack = ({
      r,
      g,
      b,
      a,
    }: {
      r: number;
      g: number;
      b: number;
      a: number;
    }) => a > 0 && (r + g + b) / 3 < 230;

    const blocks: PrintBlock[] = [
      {
        type: "image",
        src: whitePixelPngBase64,
        align: "center",
        transforms: [transforms.floydSteinberg],
        rgbToBlack,
      },
    ];

    await expectRender(
      blocks,
      <Image
        src={whitePixelPngBase64}
        align="center"
        transforms={[transforms.floydSteinberg]}
        rgbToBlack={rgbToBlack}
        reader={({ props: { src } }) => readImageBase64(src)}
      />,
    );
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

  it("renders text blocks", async () => {
    const blocks: PrintBlock[] = [{ type: "text", content: "Hello" }];

    await expectRender(blocks, <Text>Hello</Text>);
  });
});
