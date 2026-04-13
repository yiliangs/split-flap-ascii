export interface FlipStep {
  char: string;
  intermediate: boolean;
}

export interface FlipConfig {
  flipChar: string;
  drumRolls: number;
  charset: string;
}

export type PatternFn = (
  row: number,
  col: number,
  rows: number,
  cols: number
) => number;

export interface FlipJob {
  row: number;
  col: number;
  delay: number;
  steps: FlipStep[];
}
