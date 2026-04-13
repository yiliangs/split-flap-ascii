import { FlipGrid } from "../core/grid";
import { FlipConfig, PatternFn } from "../core/types";
import { LayoutConfig, DEFAULT_LAYOUT } from "./types";

export type TextAlign = "left" | "center" | "right";

export interface DisplayConfig {
  rows: number;
  cols: number;
  flip?: Partial<FlipConfig>;
  flipSpeed?: number;
  noise?: number;
  align?: TextAlign;
  layout?: Partial<LayoutConfig>;
}

interface CellAnim {
  row: number;
  col: number;
  delay: number;
  steps: { char: string; intermediate: boolean }[];
  idx: number;
  speed: number;
}

const NBSP = "\u00A0";

export class SplitFlapDisplay {
  private container: HTMLElement;
  private grid: FlipGrid;
  private layout: LayoutConfig;
  private flipSpeed: number;
  private noise: number;
  private align: TextAlign;
  private rowWeights: Map<number, number> = new Map();
  private cells: HTMLElement[][] = [];
  private animId = 0;
  private animResolve: (() => void) | null = null;

  constructor(container: HTMLElement, config: DisplayConfig) {
    this.container = container;
    this.grid = new FlipGrid(config.rows, config.cols, config.flip);
    this.layout = { ...DEFAULT_LAYOUT, ...config.layout };
    this.flipSpeed = config.flipSpeed ?? 35;
    this.noise = config.noise ?? 0;
    this.align = config.align ?? "left";
    this.buildDom();
  }

  get rows(): number {
    return this.grid.rows;
  }
  get cols(): number {
    return this.grid.cols;
  }

  private justifyValue(): string {
    switch (this.align) {
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  }

  private buildDom(): void {
    this.container.innerHTML = "";
    this.container.style.display = "inline-flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "stretch";

    const cellW =
      this.layout.cellWidth != null
        ? `${this.layout.cellWidth}px`
        : "0.6em";
    const gap = this.layout.cellGap;
    this.container.style.minWidth = `calc(${this.grid.cols} * ${cellW} + ${this.grid.cols - 1} * ${gap}px)`;

    const jc = this.justifyValue();
    this.cells = [];

    for (let r = 0; r < this.grid.rows; r++) {
      const rowEl = document.createElement("div");
      rowEl.className = "sf-row";
      rowEl.style.display = "flex";
      rowEl.style.gap = gap + "px";
      rowEl.style.justifyContent = jc;
      rowEl.style.minHeight = "1.4em";
      if (r > 0) rowEl.style.marginTop = this.layout.rowGap + "px";

      const row: HTMLElement[] = [];
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = document.createElement("span");
        cell.className = "sf-cell";
        this.applyCellStyles(cell, r);
        const ch = this.grid.charAt(r, c);
        cell.textContent = ch === " " ? NBSP : ch;
        row.push(cell);
        rowEl.appendChild(cell);
      }

      this.cells.push(row);
      this.container.appendChild(rowEl);
    }

    this.updateVisibility();
  }

  private applyCellStyles(el: HTMLElement, row?: number): void {
    const l = this.layout;
    el.style.display = "inline-block";
    el.style.textAlign = "center";
    el.style.fontFamily = l.font;
    el.style.fontSize = l.fontSize + "px";
    el.style.color = l.color;
    el.style.whiteSpace = "pre";
    el.style.overflow = "hidden";
    el.style.width =
      l.cellWidth != null ? l.cellWidth + "px" : "0.6em";
    el.style.lineHeight =
      l.cellHeight != null ? l.cellHeight + "px" : "1.4";
    const w = row != null ? this.rowWeights.get(row) : undefined;
    el.style.fontWeight = w != null ? String(w) : "normal";
  }

  private setCellChar(
    cell: HTMLElement,
    char: string,
    intermediate: boolean
  ): void {
    cell.textContent = char === " " ? NBSP : char;
    cell.style.color = intermediate
      ? this.layout.flipColor
      : this.layout.color;
  }

  private updateVisibility(): void {
    const text = this.grid.getText();
    for (let r = 0; r < this.grid.rows; r++) {
      const line = text[r];
      let first = -1;
      let last = -1;
      for (let i = 0; i < line.length; i++) {
        if (line[i] !== " ") {
          if (first === -1) first = i;
          last = i;
        }
      }
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.cells[r]?.[c];
        if (!cell) continue;
        cell.style.display =
          first === -1 || c < first || c > last
            ? "none"
            : "inline-block";
      }
    }
  }

  private sync(): void {
    const text = this.grid.getText();
    for (let r = 0; r < this.grid.rows; r++) {
      const line = text[r];
      let first = -1;
      let last = -1;
      for (let i = 0; i < line.length; i++) {
        if (line[i] !== " ") {
          if (first === -1) first = i;
          last = i;
        }
      }
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.cells[r]?.[c];
        if (!cell) continue;
        cell.textContent = line[c] === " " ? NBSP : line[c];
        cell.style.color = this.layout.color;
        cell.style.display =
          first === -1 || c < first || c > last
            ? "none"
            : "inline-block";
      }
    }
  }

  getText(): string[] {
    return this.grid.getText();
  }

  setText(lines: string[]): void {
    this.cancelAll();
    this.grid.setText(lines);
    this.sync();
  }

  async flipTo(
    lines: string[],
    pattern?: PatternFn,
    force = false
  ): Promise<void> {
    this.cancelAll();

    const oldText = this.grid.getText();
    const jobs = this.grid.plan(lines, pattern, force, this.noise);
    this.grid.setText(lines);

    if (jobs.length === 0) {
      this.sync();
      return;
    }

    const newText = this.grid.getText();
    for (let r = 0; r < this.grid.rows; r++) {
      const ol = oldText[r] || "";
      const nl = newText[r] || "";
      let first = -1;
      let last = -1;
      for (let i = 0; i < this.grid.cols; i++) {
        if ((ol[i] && ol[i] !== " ") || (nl[i] && nl[i] !== " ")) {
          if (first === -1) first = i;
          last = i;
        }
      }
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.cells[r]?.[c];
        if (!cell) continue;
        cell.style.display =
          first === -1 || c < first || c > last
            ? "none"
            : "inline-block";
      }
    }

    const baseSpeed = this.flipSpeed;
    const n = this.noise;
    const avgSteps =
      jobs.reduce((s, j) => s + j.steps.length, 0) / jobs.length;
    const jitterCap = baseSpeed * avgSteps;
    const anims: CellAnim[] = jobs.map((j) => ({
      row: j.row,
      col: j.col,
      delay: n > 0 ? j.delay + Math.random() * n * jitterCap : j.delay,
      steps: j.steps,
      idx: -1,
      speed:
        n > 0
          ? baseSpeed * Math.max(0.2, 1 + (Math.random() * 2 - 1) * n)
          : baseSpeed,
    }));
    const total = anims.length;

    await new Promise<void>((resolve) => {
      this.animResolve = resolve;
      let start = 0;
      let done = 0;

      const tick = (ts: number) => {
        if (!this.animResolve) return;
        if (!start) start = ts;
        const elapsed = ts - start;

        for (let i = 0; i < total; i++) {
          const a = anims[i];
          if (a.idx >= a.steps.length - 1) continue;
          const local = elapsed - a.delay;
          if (local < 0) continue;
          const target = Math.min(
            Math.floor(local / a.speed),
            a.steps.length - 1
          );
          if (target <= a.idx) continue;
          a.idx = target;
          const step = a.steps[target];
          this.setCellChar(
            this.cells[a.row][a.col],
            step.char,
            step.intermediate
          );
          if (target >= a.steps.length - 1) done++;
        }

        if (done >= total) {
          this.animId = 0;
          this.animResolve = null;
          this.updateVisibility();
          resolve();
        } else {
          this.animId = requestAnimationFrame(tick);
        }
      };

      this.animId = requestAnimationFrame(tick);
    });
  }

  cancelAll(): void {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = 0;
    }
    if (this.animResolve) {
      this.animResolve();
      this.animResolve = null;
    }
    this.sync();
  }

  cellAt(row: number, col: number): HTMLElement | undefined {
    return this.cells[row]?.[col];
  }

  setLayout(partial: Partial<LayoutConfig>): void {
    this.layout = { ...this.layout, ...partial };
    this.buildDom();
  }

  setFlipConfig(partial: Partial<FlipConfig>): void {
    this.grid.setFlipConfig(partial);
  }

  setFlipSpeed(ms: number): void {
    this.flipSpeed = ms;
  }

  setNoise(n: number): void {
    this.noise = Math.max(0, Math.min(1, n));
  }

  setAlign(align: TextAlign): void {
    this.align = align;
    const jc = this.justifyValue();
    for (const rowCells of this.cells) {
      const rowEl = rowCells[0]?.parentElement;
      if (rowEl) rowEl.style.justifyContent = jc;
    }
  }

  setRowWeight(row: number, weight: number | null): void {
    if (weight == null) {
      this.rowWeights.delete(row);
    } else {
      this.rowWeights.set(row, weight);
    }
    const cells = this.cells[row];
    if (!cells) return;
    const val = weight != null ? String(weight) : "normal";
    for (const cell of cells) cell.style.fontWeight = val;
  }

  resize(rows: number, cols: number): void {
    this.cancelAll();
    this.grid.resize(rows, cols);
    this.buildDom();
  }
}
