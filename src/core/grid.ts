import { FlipConfig, FlipJob, PatternFn } from "./types";
import { computeFlipSteps, resolveFlipConfig } from "./flip";

export class FlipGrid {
  private state: string[][];
  private _rows: number;
  private _cols: number;
  private flipCfg: FlipConfig;

  constructor(rows: number, cols: number, config?: Partial<FlipConfig>) {
    this._rows = rows;
    this._cols = cols;
    this.flipCfg = resolveFlipConfig(config);
    this.state = Array.from({ length: rows }, () => Array(cols).fill(" "));
  }

  get rows(): number {
    return this._rows;
  }
  get cols(): number {
    return this._cols;
  }
  get flipConfig(): FlipConfig {
    return this.flipCfg;
  }

  getText(): string[] {
    return this.state.map((row) => row.join(""));
  }

  setText(lines: string[]): void {
    for (let r = 0; r < this._rows; r++) {
      const line = (lines[r] || "").padEnd(this._cols);
      for (let c = 0; c < this._cols; c++) {
        this.state[r][c] = line[c];
      }
    }
  }

  charAt(row: number, col: number): string {
    return this.state[row]?.[col] ?? " ";
  }

  plan(
    lines: string[],
    pattern?: PatternFn,
    force = false,
    noise = 0
  ): FlipJob[] {
    const delayFn = pattern || (() => 0);
    const jobs: FlipJob[] = [];

    for (let r = 0; r < this._rows; r++) {
      const line = (lines[r] || "").padEnd(this._cols);
      for (let c = 0; c < this._cols; c++) {
        const from = this.state[r][c];
        const to = line[c];
        if (from === " " && to === " ") continue;

        let cfg = this.flipCfg;
        if (noise > 0) {
          const jitter = (Math.random() * 2 - 1) * noise;
          cfg = {
            ...cfg,
            drumRolls: Math.max(
              0,
              Math.round(cfg.drumRolls * (1 + jitter))
            ),
          };
        }

        const steps = computeFlipSteps(from, to, cfg, force);
        if (steps.length > 0) {
          jobs.push({
            row: r,
            col: c,
            delay: delayFn(r, c, this._rows, this._cols),
            steps,
          });
        }
      }
    }

    return jobs;
  }

  resize(rows: number, cols: number): void {
    const prev = this.getText();
    this._rows = rows;
    this._cols = cols;
    this.state = Array.from({ length: rows }, () => Array(cols).fill(" "));
    this.setText(prev);
  }

  setFlipConfig(partial: Partial<FlipConfig>): void {
    this.flipCfg = { ...this.flipCfg, ...partial };
  }
}
