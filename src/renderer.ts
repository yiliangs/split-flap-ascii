import { getGlyph, DIGIT_HEIGHT, DIGIT_WIDTH, Glyph } from "./glyphs";

export interface RenderOptions {
  gap?: number;
}

export function renderLine(text: string, opts: RenderOptions = {}): string[] {
  const gap = opts.gap ?? 1;
  const spacer = " ".repeat(gap);

  const glyphs: Glyph[] = [...text].map((ch) => getGlyph(ch));
  const lines: string[] = [];

  for (let row = 0; row < DIGIT_HEIGHT; row++) {
    lines.push(glyphs.map((g) => g[row]).join(spacer));
  }

  return lines;
}

export function renderToString(text: string, opts: RenderOptions = {}): string {
  return renderLine(text, opts).join("\n");
}
