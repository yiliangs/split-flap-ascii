# ascii-flip-clock

A TypeScript library for rendering flip-clock style animations using ASCII/box-drawing characters in the terminal.

## Features

- **ASCII digit glyphs** — box-drawing characters (`┌ ─ ┐ │ └ ┘ ├ ┤`) for clean monospace rendering
- **Flip animation frames** — generates intermediate frames simulating a mechanical flip-clock transition
- **Live clock** — `startClock()` drives a real-time terminal clock with 1 s updates
- **Static rendering** — `renderToString()` for one-shot glyph output

## Install

```bash
npm install ascii-flip-clock
```

## Quick start

### Live terminal clock

```ts
import { startClock } from "ascii-flip-clock";

const stop = startClock(
  { format24: true, showSeconds: true },
  (rendered) => {
    process.stdout.write("\x1b[2J\x1b[H");
    console.log(rendered);
  }
);

// stop() to clean up
```

### Static render

```ts
import { renderToString } from "ascii-flip-clock";

console.log(renderToString("12:34"));
```

### Flip frames between digits

```ts
import { flipFrames } from "ascii-flip-clock";

const frames = flipFrames("3", "4");
// frames[0].phase === "top-old"
// frames[3].phase === "done"
```

## API

| Export | Description |
|---|---|
| `renderLine(text, opts?)` | Returns `string[]` (one per row) for the given text |
| `renderToString(text, opts?)` | Same as above, joined with `\n` |
| `flipFrames(from, to)` | Returns `FlipFrame[]` for a single character transition |
| `flipFramesMulti(from, to)` | Returns `FlipFrame[][]` for multi-character transitions |
| `startClock(opts?, onFrame)` | Starts a live clock, returns a `stop()` function |
| `createClockTick(prev, opts?)` | Single tick: returns current time string + flip frames |
| `getGlyph(char)` | Returns the raw `string[]` glyph for a character |
| `DIGIT_HEIGHT` / `DIGIT_WIDTH` | Glyph dimensions (7 × 6) |

## Examples

```bash
npx ts-node examples/demo.ts    # live clock
npx ts-node examples/static.ts  # static output
```

## License

MIT
