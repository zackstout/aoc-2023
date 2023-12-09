const fs = require("fs");
const input = fs.readFileSync("./days/09/input.txt", "utf-8");

// Difference sequences!!!

// const exInput = `-1 -3 -3 6 51 200 589 1453 3159 6239 11421 19656 32139 50322 75917 110887 157423 217905 294845 390810 508323`;
// const exInput = "1   3   6  10  15  21";
const exInput = "0   3   6   9  12  15";

const parse = (txt) => {
  return txt
    .split(/\s/)
    .filter((x) => x)
    .map((x) => parseInt(x));
};

const getNextValue = (sequence) => {
  let finalValues = [];
  let prev = sequence;
  let numTimes = 0;
  while (prev.some((x) => x !== 0)) {
    numTimes++;
    const newSequence = [];

    for (let i = 0; i < prev.length - 1; i++) {
      newSequence.push(prev[i + 1] - prev[i]);
    }
    // console.log("New seq", newSequence);

    finalValues.push(newSequence.at(-1));
    prev = newSequence;
  }
  console.log("Done", finalValues, numTimes);
  return finalValues.reduce((a, b) => a + b, 0) + sequence.at(-1);
};

const getNextValueTwo = (sequence) => {
  let firstValues = [];
  let prev = sequence;
  let numTimes = 0;
  while (prev.some((x) => x !== 0)) {
    numTimes++;
    const newSequence = [];

    for (let i = 0; i < prev.length - 1; i++) {
      newSequence.push(prev[i + 1] - prev[i]);
    }
    // console.log("New seq", newSequence);

    firstValues.push(newSequence.at(0));
    prev = newSequence;
  }
  //   console.log("Done", firstValues, numTimes);
  //   return -1 * firstValues.reduce((a, b) => a + b, 0) + sequence.at(0);

  let v = 0;
  for (let n of firstValues.reverse()) {
    v = n - v;
    // console.log("v", v);
  }
  return sequence.at(0) - v;
};

const partOne = () => {
  let sumOfExtrapolatedValues = 0;
  console.log(parse(exInput));

  input.split("\n").forEach((line) => {
    const seq = parse(line);
    const x = getNextValue(seq);
    sumOfExtrapolatedValues += x;
  });

  //   const seq = parse(exInput);

  //   const x = getNextValue(seq);

  console.log("Final", sumOfExtrapolatedValues);
};

const partTwo = () => {
  const ex = "10  13  16  21  30  45";
  const exInput = "1   3   6  10  15  21";
  //   const exInput = "0   3   6   9  12  15";

  //   const seq = parse(exInput);
  //   const x = getNextValueTwo(seq);
  //   console.log("x", x);

  let sumOfExtrapolatedValues = 0;
  console.log(parse(exInput));
  input.split("\n").forEach((line) => {
    const seq = parse(line);
    const x = getNextValueTwo(seq);
    sumOfExtrapolatedValues += x;
  });
  console.log("Final", sumOfExtrapolatedValues);
};

partTwo();

/**
 * Dang nice, we did each part in about 8 minutes, but we waited til next morning..
 * Probably wouldn't have cracked top 1000 though..
 * I felt good about day 8 part 1, like 12 minutes, but 3000th place lol..
 */
