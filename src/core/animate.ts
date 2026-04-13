import { FlipJob, FlipStep } from "./types";

export interface AnimationHandle {
  promise: Promise<void>;
  cancel(): void;
}

export function runFlipPlan(
  jobs: FlipJob[],
  flipSpeed: number,
  onStep: (row: number, col: number, step: FlipStep) => void,
  onJobDone?: (row: number, col: number, finalChar: string) => void
): AnimationHandle {
  if (jobs.length === 0) {
    return { promise: Promise.resolve(), cancel() {} };
  }

  let timerId: ReturnType<typeof setInterval> | null = null;
  let resolve: () => void;

  const promise = new Promise<void>((r) => {
    resolve = r;
    const anims = jobs.map((j) => ({ ...j, idx: -1 }));
    const total = anims.length;
    const start = Date.now();
    let done = 0;

    timerId = setInterval(() => {
      const elapsed = Date.now() - start;

      for (const a of anims) {
        if (a.idx >= a.steps.length - 1) continue;
        const local = elapsed - a.delay;
        if (local < 0) continue;
        const target = Math.min(
          Math.floor(local / flipSpeed),
          a.steps.length - 1
        );
        if (target <= a.idx) continue;
        a.idx = target;
        onStep(a.row, a.col, a.steps[target]);
        if (target >= a.steps.length - 1) {
          onJobDone?.(a.row, a.col, a.steps[a.steps.length - 1].char);
          done++;
        }
      }

      if (done >= total) {
        clearInterval(timerId!);
        timerId = null;
        resolve();
      }
    }, flipSpeed);
  });

  return {
    promise,
    cancel() {
      if (timerId != null) {
        clearInterval(timerId);
        timerId = null;
      }
      resolve();
    },
  };
}
