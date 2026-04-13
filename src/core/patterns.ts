import { PatternFn } from "./types";

export const patterns = {
  simultaneous: (): PatternFn => () => 0,

  sequential: (delayPerCell = 30): PatternFn =>
    (r, c, _rows, cols) => (r * cols + c) * delayPerCell,

  random: (maxDelay = 600): PatternFn => () => Math.random() * maxDelay,

  fromCorner: (
    corner: "tl" | "tr" | "bl" | "br" = "tl",
    speed = 18
  ): PatternFn =>
    (r, c, rows, cols) => {
      const cr = corner.includes("b") ? rows - 1 : 0;
      const cc = corner.includes("r") ? cols - 1 : 0;
      return (Math.abs(r - cr) + Math.abs(c - cc)) * speed;
    },

  fromCenter: (speed = 22): PatternFn =>
    (r, c, rows, cols) => {
      const cr = (rows - 1) / 2;
      const cc = (cols - 1) / 2;
      return Math.sqrt((r - cr) ** 2 + (c - cc) ** 2) * speed;
    },

  wave: (
    direction: "left" | "right" | "top" | "bottom" = "left",
    speed = 25
  ): PatternFn =>
    (r, c, rows, cols) => {
      switch (direction) {
        case "left":
          return c * speed;
        case "right":
          return (cols - 1 - c) * speed;
        case "top":
          return r * speed;
        case "bottom":
          return (rows - 1 - r) * speed;
      }
    },

  diagonal: (speed = 22): PatternFn => (r, c) => (r + c) * speed,

  custom: (fn: PatternFn): PatternFn => fn,
};
