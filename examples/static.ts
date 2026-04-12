import { renderToString } from "../src";
import { flipFrames } from "../src";

console.log("Static render of 12:34:56\n");
console.log(renderToString("12:34:56"));

console.log("\n\nFlip animation frames: 3 → 4\n");
const frames = flipFrames("3", "4");
for (const frame of frames) {
  console.log(`--- phase: ${frame.phase} ---`);
  console.log(frame.lines.join("\n"));
  console.log();
}
