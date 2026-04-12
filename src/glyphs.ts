/**
 * Each glyph is an array of strings representing rows of the ASCII character.
 * All glyphs are 6 rows tall and 6 columns wide for uniform grid alignment.
 */

export type Glyph = string[];

export const DIGIT_HEIGHT = 7;
export const DIGIT_WIDTH = 6;

const DIGITS: Record<string, Glyph> = {
  "0": [
    " ┌───┐",
    " │   │",
    " │   │",
    " │   │",
    " │   │",
    " │   │",
    " └───┘",
  ],
  "1": [
    "     ┐",
    "     │",
    "     │",
    "     │",
    "     │",
    "     │",
    "     ┘",
  ],
  "2": [
    " ┌───┐",
    "     │",
    "     │",
    " ┌───┘",
    " │    ",
    " │    ",
    " └───┘",
  ],
  "3": [
    " ┌───┐",
    "     │",
    "     │",
    " ├───┤",
    "     │",
    "     │",
    " └───┘",
  ],
  "4": [
    " ┐   ┐",
    " │   │",
    " │   │",
    " └───┤",
    "     │",
    "     │",
    "     ┘",
  ],
  "5": [
    " ┌───┐",
    " │    ",
    " │    ",
    " └───┐",
    "     │",
    "     │",
    " └───┘",
  ],
  "6": [
    " ┌───┐",
    " │    ",
    " │    ",
    " ├───┐",
    " │   │",
    " │   │",
    " └───┘",
  ],
  "7": [
    " ┌───┐",
    "     │",
    "     │",
    "     │",
    "     │",
    "     │",
    "     ┘",
  ],
  "8": [
    " ┌───┐",
    " │   │",
    " │   │",
    " ├───┤",
    " │   │",
    " │   │",
    " └───┘",
  ],
  "9": [
    " ┌───┐",
    " │   │",
    " │   │",
    " └───┤",
    "     │",
    "     │",
    " └───┘",
  ],
  ":": [
    "      ",
    "      ",
    "   ●  ",
    "      ",
    "   ●  ",
    "      ",
    "      ",
  ],
  " ": [
    "      ",
    "      ",
    "      ",
    "      ",
    "      ",
    "      ",
    "      ",
  ],
};

export function getGlyph(char: string): Glyph {
  return DIGITS[char] ?? DIGITS[" "];
}

export function getAllGlyphs(): Record<string, Glyph> {
  return { ...DIGITS };
}
