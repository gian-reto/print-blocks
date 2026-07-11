import type { AppConfig } from "../../config";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { SatoriPreview, SatoriPreviewModule } from "./types";
import { PreviewMain, type PreviewPageEntry } from "./page";
import layoutHtml from "./layout.html?raw";
import { renderSatoriSvg } from "../../render/satori";
import { renderToStaticMarkup } from "react-dom/server";

const previewModules = import.meta.glob<SatoriPreviewModule>(
  "../../render/blocks/**/component.preview.tsx",
);

type RegisterPreviewRouteOptions = {
  config: AppConfig;
};

type PreviewEntry = {
  preview: SatoriPreview;
};

const getRequestedPrinterDotWidth = (
  rawValue: string | undefined,
  fallback: number,
) => {
  if (rawValue === undefined) {
    return fallback;
  }

  const printerDotWidth = Number(rawValue);

  return Number.isSafeInteger(printerDotWidth) && printerDotWidth > 0
    ? printerDotWidth
    : fallback;
};

const loadPreviewEntries = async (width: number): Promise<PreviewEntry[]> => {
  const entries = await Promise.all(
    Object.values(previewModules).map(async (loadModule) => ({
      preview: (await loadModule()).default(width),
    })),
  );

  return entries.sort((left, right) =>
    left.preview.title.localeCompare(right.preview.title),
  );
};

const createSvgDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const renderPreviewEntries = async (
  entries: PreviewEntry[],
  config: AppConfig,
  printerDotWidth: number,
): Promise<PreviewPageEntry[]> =>
  await Promise.all(
    entries.map(async ({ preview }) => ({
      title: preview.title,
      examples: await Promise.all(
        preview.examples.map(async (example) => {
          const svg = await renderSatoriSvg({
            context: {
              imageSource: {
                maxImageInputPixels: config.maxImageInputPixels,
                maxRemoteImageBytes: config.maxRemoteImageBytes,
                remoteImageTimeoutMs: config.remoteImageTimeoutMs,
              },
              printerDotWidth,
            },
            element: example.element,
          });

          return {
            src: createSvgDataUrl(svg),
          };
        }),
      ),
    })),
  );

const renderPreviewPage = (entries: PreviewPageEntry[]) => {
  const main = renderToStaticMarkup(<PreviewMain entries={entries} />);

  return layoutHtml.replace("<!-- PLACEHOLDER -->", main);
};

export const registerPreviewRoute = (
  app: OpenAPIHono,
  { config }: RegisterPreviewRouteOptions,
) => {
  app.get("/preview", async (c) => {
    const printerDotWidth = getRequestedPrinterDotWidth(
      c.req.query("width"),
      config.printerDotWidth,
    );
    const entries = await loadPreviewEntries(printerDotWidth);
    const renderedEntries = await renderPreviewEntries(
      entries,
      config,
      printerDotWidth,
    );

    c.header("cache-control", "no-store");

    return c.html(renderPreviewPage(renderedEntries));
  });
};
