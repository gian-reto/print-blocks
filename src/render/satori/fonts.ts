import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Font, FontStyle, FontWeight } from "satori";

export const satoriFontFamilies = {
  geistMono: "Geist Mono",
  geistPixelCircle: "Geist Pixel Circle",
  geistPixelGrid: "Geist Pixel Grid",
  geistPixelLine: "Geist Pixel Line",
  geistPixelSquare: "Geist Pixel Square",
  geistPixelTriangle: "Geist Pixel Triangle",
  geistSans: "Geist Sans",
} as const;

type FontWeightDefinition = {
  suffix: string;
  weight: FontWeight;
};

type GeistFontDefinition = {
  family: string;
  path: readonly string[];
  style: FontStyle;
  weight: FontWeight;
};

const fontRoot = ["assets", "fonts", "geist"] as const;

const fontWeights: FontWeightDefinition[] = [
  { suffix: "Thin", weight: 100 },
  { suffix: "ExtraLight", weight: 200 },
  { suffix: "Light", weight: 300 },
  { suffix: "Regular", weight: 400 },
  { suffix: "Medium", weight: 500 },
  { suffix: "SemiBold", weight: 600 },
  { suffix: "Bold", weight: 700 },
  { suffix: "ExtraBold", weight: 800 },
  { suffix: "Black", weight: 900 },
];

const getStyleFileName = ({
  prefix,
  style,
  suffix,
}: {
  prefix: string;
  style: FontStyle;
  suffix: string;
}) => {
  if (style === "normal") {
    return `${prefix}-${suffix}.ttf`;
  }

  return suffix === "Regular"
    ? `${prefix}-Italic.ttf`
    : `${prefix}-${suffix}Italic.ttf`;
};

const createStaticFamilyDefinitions = ({
  directory,
  family,
  prefix,
}: {
  directory: string;
  family: string;
  prefix: string;
}): GeistFontDefinition[] =>
  fontWeights.flatMap(({ suffix, weight }) =>
    (["normal", "italic"] satisfies FontStyle[]).map((style) => ({
      family,
      path: [
        directory,
        getStyleFileName({
          prefix,
          style,
          suffix,
        }),
      ],
      style,
      weight,
    })),
  );

const pixelFontDefinitions: GeistFontDefinition[] = [
  {
    family: satoriFontFamilies.geistPixelCircle,
    path: ["GeistPixel", "GeistPixel-Circle.ttf"],
    style: "normal",
    weight: 500,
  },
  {
    family: satoriFontFamilies.geistPixelGrid,
    path: ["GeistPixel", "GeistPixel-Grid.ttf"],
    style: "normal",
    weight: 500,
  },
  {
    family: satoriFontFamilies.geistPixelLine,
    path: ["GeistPixel", "GeistPixel-Line.ttf"],
    style: "normal",
    weight: 500,
  },
  {
    family: satoriFontFamilies.geistPixelSquare,
    path: ["GeistPixel", "GeistPixel-Square.ttf"],
    style: "normal",
    weight: 500,
  },
  {
    family: satoriFontFamilies.geistPixelTriangle,
    path: ["GeistPixel", "GeistPixel-Triangle.ttf"],
    style: "normal",
    weight: 500,
  },
];

const geistFontDefinitions: GeistFontDefinition[] = [
  ...createStaticFamilyDefinitions({
    directory: "Geist",
    family: satoriFontFamilies.geistSans,
    prefix: "Geist",
  }),
  ...createStaticFamilyDefinitions({
    directory: "GeistMono",
    family: satoriFontFamilies.geistMono,
    prefix: "GeistMono",
  }),
  ...pixelFontDefinitions,
];

let fontCache: Promise<Font[]> | undefined;

const readGeistFont = async (path: readonly string[]) =>
  await readFile(join(process.cwd(), ...fontRoot, ...path));

const loadGeistFont = async ({
  family,
  path,
  style,
  weight,
}: GeistFontDefinition): Promise<Font> => ({
  data: await readGeistFont(path),
  name: family,
  style,
  weight,
});

export const getSatoriFonts = () => {
  fontCache ??= Promise.all(geistFontDefinitions.map(loadGeistFont));

  return fontCache;
};
