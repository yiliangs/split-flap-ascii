import { FlipStep, FlipConfig } from "./types";

export const DEFAULT_FLIP_CONFIG: FlipConfig = {
  flipChar: "-",
  flipSpeed: 35,
  drumRolls: 4,
  charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
};

export function resolveFlipConfig(
  partial?: Partial<FlipConfig>
): FlipConfig {
  return { ...DEFAULT_FLIP_CONFIG, ...partial };
}

export function computeFlipSteps(
  from: string,
  to: string,
  config?: Partial<FlipConfig>,
  force = false
): FlipStep[] {
  if (from === to && !force) return [];

  const cfg = resolveFlipConfig(config);
  const steps: FlipStep[] = [];

  for (let i = 0; i < cfg.drumRolls; i++) {
    steps.push({ char: cfg.flipChar, intermediate: true });
    steps.push({
      char: cfg.charset[Math.floor(Math.random() * cfg.charset.length)],
      intermediate: false,
    });
  }
  steps.push({ char: cfg.flipChar, intermediate: true });
  steps.push({ char: to, intermediate: false });

  return steps;
}
