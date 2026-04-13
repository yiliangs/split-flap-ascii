export {
  computeFlipSteps,
  resolveFlipConfig,
  FlipGrid,
  runFlipPlan,
  patterns,
} from "./core";

export type {
  FlipStep,
  FlipConfig,
  PatternFn,
  FlipJob,
  AnimationHandle,
} from "./core";

export { SplitFlapDisplay } from "./dom";
export type { DisplayConfig, LayoutConfig, TextAlign } from "./dom";
