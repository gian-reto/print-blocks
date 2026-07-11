import type { ReactNode } from "react";

export type SatoriPreviewExample = {
  element: ReactNode;
};

export type SatoriPreview = {
  examples: SatoriPreviewExample[];
  title: string;
};

export type SatoriPreviewFactory = (width: number) => SatoriPreview;

export type SatoriPreviewModule = {
  default: SatoriPreviewFactory;
};
