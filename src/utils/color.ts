interface IColor {
  r: number;
  g: number;
  b: number;
  a: number;
  val: number[];
}

export const color2rgba = (color: string): IColor => {
  color = color.trim().toLowerCase();
  if (color.startsWith("#")) {
    color = color.slice(1);
    if (/[g-z]+/g.test(color)) {
      throw new Error("invalid color format");
    }
    if (color.length === 3) {
      color = color
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (color.length === 6) {
      color += "ff";
    }
    if (color.length !== 8) {
      throw new Error("invalid color format");
    }
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    const a = parseInt(color.slice(6, 8), 16);
    return { r, g, b, a, val: [r, g, b, a] };
  } else if (color.startsWith("rgb")) {
    color = color.slice(3).replace(/[\(\)a]+/g, "");
    if (/[a-z]+/g.test(color)) {
      throw new Error("invalid color format");
    }
    const [r, g, b, a = 255] = color.split(",").map((c) => parseFloat(c));
    const valid = [r, g, b, a].every((c) => c >= 0 && c <= 255);
    if (!valid) {
      throw new Error("invalid color format");
    }
    return { r, g, b, a, val: [r, g, b, a] };
  } else {
    throw new Error("invalid color format");
  }
};
