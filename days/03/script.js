const fs = require("fs");
const input = fs.readFileSync("./days/03/input.txt", "utf-8");

const getNumberPositions = (lines) => {
  const numberPositions = {};
  const digits = "0123456789".split("");

  // Find where all the numbers are (they could have multiple digits)
  for (let i = 0; i < lines.length; i++) {
    let num = "";
    for (let j = 0; j < lines[0].length; j++) {
      const char = lines[i][j];
      if (digits.includes(char)) {
        num += char;
      } else {
        if (num) {
          numberPositions[`${i},${j - num.length}`] = num;
          num = "";
        }
      }
      if (j === lines[0].length - 1) {
        numberPositions[`${i},${j - num.length}`] = num;
      }
    }
  }

  return numberPositions;
};

const partOne = () => {
  const lines = input.split("\n");
  //   console.log(lines.length, lines[0].length);

  const charactersSeen = new Set();

  const symbols = ["*", "@", "#", "-", "=", "/", "+", "%", "$", "&"];

  let total = 0;

  const numberPositions = getNumberPositions(lines);

  Object.entries(numberPositions).forEach(([pos, val]) => {
    const [i, j] = pos.split(",").map((x) => parseInt(x));
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= val.length; dx++) {
        if (symbols.includes(lines[i + dy]?.[j + dx])) {
          // There is a symbol adjacent to this number
          total += parseInt(val);
        }
      }
    }
  });

  console.log("Total:", total);

  //   console.log(Object.entries(numberPositions).slice(0, 5));
};

const partTwo = () => {
  const lines = input.split("\n");
  const numberPositions = getNumberPositions(lines);

  const gearPositions = {};

  Object.entries(numberPositions).forEach(([pos, val]) => {
    const [i, j] = pos.split(",").map((x) => parseInt(x));
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= val.length; dx++) {
        if (lines[i + dy]?.[j + dx] === "*") {
          // There is a gear adjacent to this number
          const key = `${i + dy},${j + dx}`;
          if (!gearPositions[key]) gearPositions[key] = [];
          gearPositions[key].push(parseInt(val));
        }
      }
    }
  });

  //   console.log("gears...", gearPositions);

  const total = Object.values(gearPositions).reduce((acc, val) => {
    if (val.length === 2) {
      return acc + val[0] * val[1];
    }
    return acc;
  }, 0);
  console.log("Total:", total);
};

partTwo();
