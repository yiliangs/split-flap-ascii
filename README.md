# split-flap-ascii

Split-flap display effect for ASCII characters — like the departure boards in old train stations. Each cell independently flips through intermediate characters before settling on its target, with configurable orchestration patterns across the grid.

## Install

```bash
npm install split-flap-ascii
```

## Quick start

```ts
import { SplitFlapDisplay, patterns } from "split-flap-ascii";

const board = new SplitFlapDisplay(document.getElementById("board"), {
  rows: 6,
  cols: 36,
  flipSpeed: 35,
  flip: { drumRolls: 4 },
  layout: { font: "monospace", fontSize: 18 },
});

// Set text immediately
board.setText(["HELLO WORLD"]);

// Flip to new text with a wave pattern
await board.flipTo(
  ["DEPARTURES", "NEW YORK  14:30  ON TIME"],
  patterns.wave("left", 25)
);

// Force-flip all non-empty cells even if unchanged
await board.flipTo(board.getText(), patterns.random(600), true);
```

### Browser (IIFE)

```html
<script src="dist/split-flap.iife.js"></script>
<script>
  const { SplitFlapDisplay, patterns } = SplitFlap;
  // same API as above
</script>
```

## Architecture

The library is split into two layers:

- **`core/`** — Pure logic with no DOM dependency: flip step computation, grid state, animation timing, pattern generators. Usable in Node, terminal renderers, or custom frontends.
- **`dom/`** — DOM renderer that drives a grid of `<span>` elements with `requestAnimationFrame`.

## API

### `SplitFlapDisplay`

```ts
new SplitFlapDisplay(container: HTMLElement, config: DisplayConfig)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `rows` | `number` | — | Number of rows |
| `cols` | `number` | — | Number of columns |
| `flip` | `Partial<FlipConfig>` | — | Flip behavior (see below) |
| `flipSpeed` | `number` | `35` | Milliseconds per animation step |
| `noise` | `number` | `0` | Per-cell randomization (0–1) |
| `layout` | `Partial<LayoutConfig>` | — | Visual styling (see below) |

| Method | Description |
|---|---|
| `setText(lines: string[])` | Set all cells immediately, no animation |
| `flipTo(lines, pattern?, force?): Promise` | Animate to new text. `force` re-flips unchanged cells |
| `getText(): string[]` | Read current display text |
| `cellAt(row, col): HTMLElement` | Access a cell's DOM element |
| `cancelAll()` | Stop all in-progress animations |
| `resize(rows, cols)` | Resize the grid, rebuilds DOM |
| `setLayout(partial)` | Update layout config, rebuilds DOM |
| `setFlipConfig(partial)` | Update flip config (drumRolls, flipChar, charset) |
| `setFlipSpeed(ms)` | Update animation step duration |
| `setNoise(n)` | Set noise level (0–1) |

### `FlipConfig`

| Option | Default | Description |
|---|---|---|
| `flipChar` | `"-"` | Character shown during flip transition |
| `drumRolls` | `4` | Random characters to cycle through before settling |
| `charset` | `A–Z 0–9` | Pool for drum roll characters |

### `LayoutConfig`

| Option | Default | Description |
|---|---|---|
| `font` | `"monospace"` | Font family |
| `fontSize` | `18` | Font size in px |
| `cellWidth` | `null` (auto) | Cell width in px |
| `cellHeight` | `null` (auto) | Cell height in px |
| `cellGap` | `0` | Gap between cells in px |
| `rowGap` | `0` | Gap between rows in px |
| `color` | `"#ddd"` | Text color |
| `flipColor` | `"#666"` | Color during flip transition |

### `patterns`

Delay functions that control the order cells flip. Each returns a `PatternFn = (row, col, rows, cols) => delayMs`.

| Pattern | Description |
|---|---|
| `patterns.simultaneous()` | All cells flip at once |
| `patterns.sequential(delay?)` | Left-to-right, top-to-bottom |
| `patterns.random(maxDelay?)` | Each cell gets a random delay |
| `patterns.fromCorner(corner?, speed?)` | Expand from `"tl"` `"tr"` `"bl"` `"br"` |
| `patterns.fromCenter(speed?)` | Radial expansion from center |
| `patterns.wave(direction?, speed?)` | `"left"` `"right"` `"top"` `"bottom"` |
| `patterns.diagonal(speed?)` | Top-left diagonal sweep |
| `patterns.custom(fn)` | Your own `PatternFn` |

### Headless usage (core only)

```ts
import { FlipGrid, computeFlipSteps, runFlipPlan, patterns } from "split-flap-ascii";

const grid = new FlipGrid(4, 30, { drumRolls: 4 });
grid.setText(["HELLO WORLD"]);

const jobs = grid.plan(["GOODBYE"], patterns.wave("left", 25));
grid.setText(["GOODBYE"]);

// Drive animation yourself
const handle = runFlipPlan(jobs, 35, (row, col, step) => {
  // render step.char at (row, col)
});

// Or compute steps for a single cell
const steps = computeFlipSteps("A", "Z", { drumRolls: 4 });
```

## CSS classes

The library creates DOM elements with these classes:

| Class | Element |
|---|---|
| `.sf-row` | One row of cells |
| `.sf-cell` | Individual cell |

## Demo

```bash
npm run build
# open index.html in browser
```

## License

MIT
