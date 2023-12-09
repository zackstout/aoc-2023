const fs = require("fs");
const input = fs.readFileSync("./days/06/input.txt", "utf-8");

const ex = `Time:      7  15   30
    Distance:  9  40  200`;

const parse = (txt) => {
  return txt.split("\n").map((l) =>
    l
      .split(":")[1]
      .split(/\s/)
      .filter((x) => x)
      .map((x) => parseInt(x))
  );
};

const parseTwo = (txt) => {
  return parse(txt).map((nums) => {
    return parseInt(nums.reduce((str, n) => str + n, ""));
  });
};

const findNumWaysToWin = (time, recordDistance) => {
  let numWaysToWin = 0;

  for (let j = 1; j < time; j++) {
    const dist = j * (time - j);
    if (dist > recordDistance) {
      numWaysToWin++;
    }
  }

  return numWaysToWin;
};

const partOne = () => {
  let total = 1;

  const data = parse(input);

  console.log(data);

  for (let i = 0; i < data[0].length; i++) {
    const time = data[0][i];
    const recordDistance = data[1][i];
    console.log(time, recordDistance);
    const numWaysToWin = findNumWaysToWin(time, recordDistance);
    total *= numWaysToWin;
  }
  console.log(total);
};

const partTwo = () => {
  const d = parseTwo(input);
  console.log(d);
  const [time, recordDistance] = d;
  const numWaysToWin = findNumWaysToWin(time, recordDistance);
  console.log(numWaysToWin);
};

console.time("run");
partOne();
console.timeEnd("run");
