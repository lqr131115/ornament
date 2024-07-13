import { color2rgba } from "@/utils/color";

/**
 *
 * @returns [min, max] 随机数
 */
export const getRandom = (min: number, max: number) => {
  return Math.random() * (max + 1 - min) + min;
};

export const getTimeText = () => {
  return new Date().toTimeString().substring(0, 8);
};

export const getTextPoints = (
  canvas: HTMLCanvasElement,
  options?: { color?: string; gap?: number }
) => {
  const points: { x: number; y: number }[] = [];
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const { color = "#000", gap = 5 } = options ?? {};
  const pixelColor = getCanvasPixelColor(color2rgba(color).val);
  const { width, height, data } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  for (let i = 0; i < width; i += gap) {
    for (let j = 0; j < height; j += gap) {
      const idx = (j * width + i) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if(pixelColor.toLocaleString() === [r, g, b, a].toLocaleString()) {
        points.push({ x: i, y: j });
      }
    }
  }
  return points;
};

export const getCanvasPixelColor = (rgba: number[]) => {
  const [red, green, blue, alpha] = rgba;
  const rgb = [red, green, blue].map((c) => Math.floor(c));
  return [...rgb, Math.floor(alpha <= 1 ? alpha * 255 : alpha)];
};
