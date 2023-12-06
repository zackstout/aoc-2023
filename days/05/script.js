const fs = require("fs");
const input = fs.readFileSync("./days/05/input.txt", "utf-8");
const ex = fs.readFileSync("./days/05/ex.txt", "utf-8");

const parseRules = (lines) => {
  const allRules = {};

  let label = "";
  let rules = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(":")) {
      if (label) {
        allRules[label] = rules
          .filter((r) => r)
          .map((r) => r.split(" ").map((x) => parseInt(x)));
        rules = [];
      }

      label = line;
    } else {
      rules.push(line);
    }
    if (i === lines.length - 1) {
      allRules[label] = rules
        .filter((r) => r)
        .map((r) => r.split(" ").map((x) => parseInt(x)));
      rules = [];
    }
  }
  return allRules;
};

const orderOfMaps = [
  "seed",
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  // "location",
];

const seedToLocation = (n, rulesInput) => {
  let curr = n;
  for (let val of orderOfMaps) {
    const key = Object.keys(rulesInput).find((k) => k.startsWith(val));
    const rules = rulesInput[key];
    //   console.log(key, rules);

    // Rule has structure [destRangeStart, srcRangeStart, rangeLength]
    const relevantRange = rules.find(
      (r) => r[1] <= curr && curr <= r[1] + r[2] - 1
    );
    if (relevantRange) {
      curr = relevantRange[0] + (curr - relevantRange[1]);
    } else {
      // do nothing -- curr stays the same
    }
  }
  return curr;
};

const partOne = () => {
  const lines = input.split("\n");

  //   console.log(lines);
  const seeds = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((x) => parseInt(x));

  const allRules = parseRules(lines);
  //   console.log(seeds, allRules);

  //   console.log(Math.min(...seeds.map(seedToLocation)));

  // PART TWO -- works for example, super naive, causes Fatal JavaScript invalid size error for actual input.... ok...
  //   const seedsReal = [];
  //   for (let i = 0; i < seeds.length; i += 2) {
  //     for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
  //       seedsReal.push(j);
  //     }
  //   }

  console.log(Math.min(...seeds.map((s) => seedToLocation(s, allRules))));
};

/**
 * Seems like... we need to start with seed ranges.
 * And for each range we need to determine how it intersects with each of next ranges (from relevant map).
 * That will generate a new set of ranges (that may be shifted), each of which must be intersected with each of NEXT ranges (and so on).
 * Until we reach end, where we are looking for the smallest possible value that we can make, from any of our ranges, and the relevant map.
 */

const partTwo = () => {
  const lines = ex.split("\n");

  const seeds = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((x) => parseInt(x));

  const allRules = parseRules(lines);

  console.log(seeds, allRules);

  const endpoints = [];

  orderOfMaps.forEach((val) => {
    const key = Object.keys(allRules).find((k) => k.startsWith(val));
    const rules = allRules[key];
    console.log(rules);

    rules.forEach((r) => {});
  });

  const startingRanges = [];

  const findMinimumLocationValueAvailableFromRanges = (
    ranges,
    map,
    isLast = false
  ) => {
    if (isLast) {
    } else {
    }
  };
};

partTwo();
