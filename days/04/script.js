const fs = require("fs");
const input = fs.readFileSync("./days/04/input.txt", "utf-8");

const partOne = () => {
  const lines = input.split("\n");

  let total = 0;

  lines.forEach((line, idx) => {
    const [id, rest] = line.split(":");
    const [winning, values] = rest.split("|").map((x) =>
      x
        .split(" ")
        .map((char) => parseInt(char))
        .filter((x) => x)
    );

    // if (idx === 0) console.log(winning, values, id);

    const totalWinners = values.filter((x) => winning.includes(x)).length;

    // if (idx < 10) console.log(id, totalWinners);

    if (totalWinners === 0) return;
    total += Math.pow(2, totalWinners - 1);
  });

  console.log("Total", total);
};

const partTwo = () => {
  const lines = input.split("\n");

  // Key is game id. Value is how many copies of the card we have generated.
  const allCopies = {};

  lines.forEach((line, idx) => {
    let [id, rest] = line.split(":");
    id = parseInt(id.split(/\s/).at(-1));
    const [winning, values] = rest.split("|").map((x) =>
      x
        .split(" ")
        .map((char) => parseInt(char))
        .filter((x) => x)
    );

    const numCopies = allCopies[id] ?? 0;
    const numCards = numCopies + 1;
    const totalWinners = values.filter((x) => winning.includes(x)).length;

    for (let j = 0; j < numCards; j++) {
      for (let i = id + 1; i <= id + totalWinners; i++) {
        if (!allCopies[i]) allCopies[i] = 0;
        allCopies[i] += 1;
      }
    }
  });

  console.log(
    "Total",
    lines.length + Object.values(allCopies).reduce((acc, val) => acc + val, 0)
  );
};

partTwo();
