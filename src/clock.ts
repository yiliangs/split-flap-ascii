import { flipFramesMulti, FlipFrame } from "./flip";
import { renderLine, RenderOptions } from "./renderer";
import { DIGIT_HEIGHT } from "./glyphs";

export interface ClockOptions {
  format24?: boolean;
  showSeconds?: boolean;
  renderOpts?: RenderOptions;
}

function timeString(opts: ClockOptions): string {
  const now = new Date();
  let h = now.getHours();
  if (!opts.format24) h = h % 12 || 12;
  const hh = String(h).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return opts.showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

export function createClockTick(
  prev: string,
  opts: ClockOptions = {}
): { text: string; frames: FlipFrame[][]; current: string } {
  const current = timeString(opts);
  const frames = flipFramesMulti(prev, current);
  return { text: current, frames, current };
}

export function startClock(
  opts: ClockOptions = {},
  onFrame: (rendered: string, timeStr: string) => void
): () => void {
  let prev = "";
  let stopped = false;

  const tick = () => {
    if (stopped) return;
    const { current } = createClockTick(prev, opts);
    const rendered = renderLine(current, opts.renderOpts).join("\n");
    onFrame(rendered, current);
    prev = current;
  };

  tick();
  const interval = setInterval(tick, 1000);

  return () => {
    stopped = true;
    clearInterval(interval);
  };
}
