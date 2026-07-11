export const supportedImageFormats = ["jpeg", "png", "webp", "svg"] as const;

export type SupportedImageFormat = (typeof supportedImageFormats)[number];

export const isSupportedImageFormat = (
  format: string,
): format is SupportedImageFormat =>
  supportedImageFormats.includes(format as SupportedImageFormat);
