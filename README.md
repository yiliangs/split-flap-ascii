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
  rows: 4,
  cols: 30,
  cell: { flipSpeed: 35, drumRolls: 4 },
});

// Set text immediately
board.setText(["HELLO WORLD"]);

// Flip to new text with a pattern
await board.flipTo(
  ["DEPARTURES", "NEW YORK  14:30  ON TIME"],
  patterns.wave("left", 25)
);
```

### Browser (IIFE)

```html
<script src="dist/split-flap.iife.js"></script>
<script>
  const { SplitFlapDisplay, patterns } = SplitFlap;
  // same API as above
</script>
```

## API

### `SplitFlapCell`

A single flap unit. Created internally by `SplitFlapDisplay`, but can be used standalone.

| Method | Description |
|---|---|
| `set(char)` | Set character immediately, no animation |
| `flipTo(char): Promise` | Animate flip to target character |
| `cancel()` | Stop in-progress animation |
| `.char` | Current character (getter) |
| `.el` | The DOM element |

### `SplitFlapDisplay`

A grid of cells with orchestration.

| Method | Description |
|---|---|
| `setText(lines: string[])` | Set all cells immediately |
| `flipTo(lines, pattern?): Promise` | Flip all cells with a delay pattern |
| `getText(): string[]` | Read current display text |
| `cellAt(row, col)` | Access individual cell |
| `cancelAll()` | Stop all in-progress animations |
| `resize(rows, cols)` | Resize the grid |

### `patterns`

Delay functions that control the order cells flip.

| Pattern | Description |
|---|---|
| `patterns.simultaneous()` | All cells flip at once |
| `patterns.sequential(delay?)` | Left→right, top→bottom |
| `patterns.random(maxDelay?)` | Each cell gets a random delay |
| `patterns.fromCorner(corner?, speed?)` | Expand from `'tl'` `'tr'` `'bl'` `'br'` |
| `patterns.fromCenter(speed?)` | Radial expansion from center |
| `patterns.wave(direction?, speed?)` | `'left'` `'right'` `'top'` `'bottom'` |
| `patterns.diagonal(speed?)` | Top-left diagonal sweep |
| `patterns.custom(fn)` | Your own `(row, col, rows, cols) => delayMs` |

### `CellConfig`

| Option | Default | Description |
|---|---|---|
| `flipChar` | `'—'` | Character shown during flip transition |
| `flipSpeed` | `35` | Milliseconds per animation frame |
| `drumRolls` | `4` | Random characters to cycle through before settling |
| `charset` | A–Z, 0–9, punctuation | Pool for drum roll characters |

## CSS classes

The library creates DOM elements with these classes — style them however you want:

| Class | Element |
|---|---|
| `.sf-display` | Container |
| `.sf-row` | One row of cells |
| `.sf-cell` | Individual cell |
| `.sf-flipping` | Added to cell during flip-char frames |

## Demo

```bash
npm run build
# open index.html in browser
```

## License

MIT
