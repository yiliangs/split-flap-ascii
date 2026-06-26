export interface LayoutConfig {
  font: string;
  fontSize: number;
  cellWidth: number | null;
  cellHeight: number | null;
  cellGap: number;
  rowGap: number;
  width: number | null;
  color: string;
  flipColor: string;
}

export const DEFAULT_LAYOUT: LayoutConfig = {
  font: "monospace",
  fontSize: 18,
  cellWidth: null,
  cellHeight: null,
  cellGap: 0,
  rowGap: 0,
  width: null,
  color: "#ddd",
  flipColor: "#666",
};
