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
  let cancelled = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  const promise = new Promise<void>((resolve) => {
    if (jobs.length === 0) {
      resolve();
      return;
    }

    let pending = jobs.length;

    for (const job of jobs) {
      const t = setTimeout(() => {
        if (cancelled) return;

        let idx = 0;
        const tick = () => {
          if (cancelled) return;
          if (idx >= job.steps.length) {
            const last = job.steps[job.steps.length - 1];
            onJobDone?.(job.row, job.col, last.char);
            pending--;
            if (pending === 0) resolve();
            return;
          }
          onStep(job.row, job.col, job.steps[idx]);
          idx++;
          timeouts.push(setTimeout(tick, flipSpeed));
        };
        tick();
      }, job.delay);
      timeouts.push(t);
    }
  });

  return {
    promise,
    cancel() {
      cancelled = true;
      for (const t of timeouts) clearTimeout(t);
    },
  };
}
