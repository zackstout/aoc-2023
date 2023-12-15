import { mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";

const run = () => {
  for (let i = 15; i <= 25; i++) {
    let dayName = i.toString();
    if (dayName.length < 2) dayName = "0" + dayName;
    mkdirSync(join(resolve(), "days/" + dayName));
    writeFileSync(`days/${dayName}/input.txt`, "");
    writeFileSync(
      `days/${dayName}/script.js`,
      `import {readFileSync} from "fs";
    const input = readFileSync("./days/${dayName}/input.txt", "utf-8");
    const run = () => {};
    
    console.time("run");
    run();
    console.timeEnd("run");`
    );
  }
};

run();
