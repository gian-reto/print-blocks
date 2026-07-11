import type { ImageTransform } from "@react-thermal-printer/image";

const black = 0;
const white = 255;
const threshold = 128;

/**
 * Applies standard Floyd-Steinberg dithering while preserving transparent gaps.
 *
 * The transform bundled with `@react-thermal-printer/image` diffuses only part
 * of the quantization error, which pushes darker heatmap shades toward solid
 * black. This implementation uses the standard full-error weights so adjacent
 * grayscale buckets remain distinguishable on a monochrome printer.
 */
export const floydSteinbergDither: ImageTransform = (image) => {
  const data = new Uint8ClampedArray(image.data);
  const luminance = new Float64Array(image.width * image.height);

  for (let pixel = 0; pixel < luminance.length; pixel += 1) {
    const offset = pixel * 4;
    const red = data[offset] ?? 0;
    const green = data[offset + 1] ?? 0;
    const blue = data[offset + 2] ?? 0;

    luminance[pixel] = red * 0.299 + green * 0.587 + blue * 0.114;
  }

  const addError = (x: number, y: number, error: number) => {
    if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
      return;
    }

    const pixel = y * image.width + x;

    if (data[pixel * 4 + 3] === 0) {
      return;
    }

    luminance[pixel] = (luminance[pixel] ?? 0) + error;
  };

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const pixel = y * image.width + x;
      const offset = pixel * 4;

      if (data[offset + 3] === 0) {
        continue;
      }

      const currentLuminance = luminance[pixel] ?? 0;
      const value = currentLuminance < threshold ? black : white;
      const error = currentLuminance - value;

      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;

      addError(x + 1, y, (error * 7) / 16);
      addError(x - 1, y + 1, (error * 3) / 16);
      addError(x, y + 1, (error * 5) / 16);
      addError(x + 1, y + 1, error / 16);
    }
  }

  return {
    ...image,
    data: new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
  };
};
