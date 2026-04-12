import { startClock } from "../src";

const clear = () => process.stdout.write("\x1b[2J\x1b[H");

const stop = startClock(
  { format24: true, showSeconds: true },
  (rendered) => {
    clear();
    console.log("\n" + rendered + "\n");
  }
);

process.on("SIGINT", () => {
  stop();
  process.exit(0);
});
