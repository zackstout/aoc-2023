const fs = require("fs");
const input = fs.readFileSync("./days/02/input.txt", "utf-8");

const partOne = () => {
  const constraints = {
    red: 12,
    green: 13,
    blue: 14,
  };
  let total = 0;
  const lines = input.split("\n");
  //   console.log(lines[0]);
  lines.forEach((line, lineIdx) => {
    const [id, rest] = line.split(": ");
    const runs = rest.split("; ");
    const gameId = id.split(" ")[1];
    let isAllowed = true;

    runs.forEach((run) => {
      const stuff = run.split(", ");
      stuff.forEach((entry) => {
        const [amt, color] = entry.split(" ");
        const realAmt = parseInt(amt);
        const constraint = constraints[color];
        if (constraint && realAmt > constraint) {
          console.log("Not allowed", gameId);
          isAllowed = false;
        }
        // if (lineIdx === 0) {
        //   console.log(amt, color, realAmt);
        // }
      });
    });

    if (isAllowed) {
      total += parseInt(gameId);
    }
  });
  console.log("total", total);
};

const partTwo = () => {
  let total = 0;
  const lines = input.split("\n");
  //   console.log(lines[0]);
  lines.forEach((line, lineIdx) => {
    const [id, rest] = line.split(": ");
    const runs = rest.split("; ");
    const gameId = id.split(" ")[1];
    const minNeeded = {
      blue: 0,
      red: 0,
      green: 0,
    };

    runs.forEach((run) => {
      const stuff = run.split(", ");
      stuff.forEach((entry) => {
        const [amt, color] = entry.split(" ");
        const realAmt = parseInt(amt);

        minNeeded[color] = Math.max(minNeeded[color], realAmt);
      });
    });

    const value = Object.values(minNeeded).reduce((acc, val) => acc * val, 1);
    total += value;
  });
  console.log("total", total);
};

partTwo();
