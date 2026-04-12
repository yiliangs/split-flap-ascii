import { getGlyph, DIGIT_HEIGHT, DIGIT_WIDTH, Glyph } from "./glyphs";

export type FlipPhase = "top-old" | "middle" | "bottom-new" | "done";

export interface FlipFrame {
  phase: FlipPhase;
  lines: string[];
}

function topHalf(g: Glyph): string[] {
  return g.slice(0, Math.ceil(DIGIT_HEIGHT / 2));
}

function bottomHalf(g: Glyph): string[] {
  return g.slice(Math.ceil(DIGIT_HEIGHT / 2));
}

function blankRow(): string {
  return "▓".repeat(DIGIT_WIDTH);
}

export function flipFrames(from: string, to: string): FlipFrame[] {
  const oldG = getGlyph(from);
  const newG = getGlyph(to);

  if (from === to) {
    return [{ phase: "done", lines: newG }];
  }

  const midRow = Math.ceil(DIGIT_HEIGHT / 2);

  // Phase 1: top half folds down — show old top, blank middle, old bottom
  const phase1: string[] = [
    ...topHalf(oldG),
    blankRow(),
    ...bottomHalf(oldG),
  ];

  // Phase 2: blank flap — show new top, blank middle, old bottom
  const phase2: string[] = [
    ...topHalf(newG),
    blankRow(),
    ...bottomHalf(oldG),
  ];

  // Phase 3: bottom flap lands — show new top, blank middle, new bottom
  const phase3: string[] = [
    ...topHalf(newG),
    blankRow(),
    ...bottomHalf(newG),
  ];

  // Phase 4: settled
  const phase4: string[] = [...newG];

  return [
    { phase: "top-old", lines: phase1 },
    { phase: "middle", lines: phase2 },
    { phase: "bottom-new", lines: phase3 },
    { phase: "done", lines: phase4 },
  ];
}

export function flipFramesMulti(from: string, to: string): FlipFrame[][] {
  const maxLen = Math.max(from.length, to.length);
  const fromPad = from.padStart(maxLen);
  const toPad = to.padStart(maxLen);

  const result: FlipFrame[][] = [];
  for (let i = 0; i < maxLen; i++) {
    result.push(flipFrames(fromPad[i], toPad[i]));
  }
  return result;
}
