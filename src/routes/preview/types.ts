import type { ReactNode } from "react";

export type SatoriPreviewExample = {
  element: ReactNode;
  width?: number;
};

export type SatoriPreview = {
  examples: SatoriPreviewExample[];
  title: string;
};

export type SatoriPreviewModule = {
  default: SatoriPreview;
};
