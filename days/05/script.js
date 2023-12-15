// const fs = require("fs");
import { readFileSync } from "fs";
import d from "../../utils.js";
const { getIntersection, getDifference } = d;

const input = readFileSync("./days/05/input.txt", "utf-8");
const ex = readFileSync("./days/05/ex.txt", "utf-8");

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
 *
 *
 * Right.. we start with seed ranges. We always, at each step, have some list of ranges that include nums we care about
 * (that are possible to reach from seeds).
 * Then at each new level, we need to go through all the rules, and we need to find
 * WHERE THEY OVERLAP/INTERSECT with any of the intervals we care about.
 * (And then you have to shift some of them)
 * So having that function is like 90% of the work.
 * And then the final step... you just compare each value against a stored minimum.
 */

// const partTwo = () => {
//   const lines = ex.split("\n");

//   const seeds = lines[0]
//     .split(": ")[1]
//     .split(" ")
//     .map((x) => parseInt(x));

//   const allRules = parseRules(lines);

//   console.log(seeds, allRules);

//   // These are the "intervals we care about" -- endpoints of intervals that seeds may reach.
//   let endpoints = [];
//   for (let i = 0; i < seeds.length; i += 2) {
//     endpoints.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
//   }
//   console.log(endpoints);

//   //   let minimumReachableLocation = Infinity;

//   orderOfMaps.forEach((val) => {
//     const key = Object.keys(allRules).find((k) => k.startsWith(val));
//     const rules = allRules[key];
//     // console.log(key, rules);

//     const newEndpoints = [];

//     // if (key.startsWith("humidity")) {
//     //   // Final case -- check for minimum
//     //   console.log("Total final endpoints", endpoints.length);
//     // //   if (endpoints)
//     // } else {
//     // Add new endpoints, then shift any required endpoints
//     rules.forEach((r) => {
//       endpoints.forEach((pts) => {
//         const [e1, e2] = pts;
//         const range = [r[1], r[1] + r[2] - 1];
//         const [r1, r2] = range;
//         const doOverlap = Math.max(e1, r1) <= Math.min(e2, r2);
//         const shiftVal = r[0] - r1; // Say the src is 7, and dest is 2 -- then we shift by -5

//         // Four cases for how the ranges may overlap -- well, and the fifth case where they don't overlap at all..
//         if (doOverlap) {
//           if (r1 <= e1 && r2 >= e2) {
//             // Easy case -- points we care about are enclosed by src range: shift them all
//             newEndpoints.push([e1 + shiftVal, e2 + shiftVal]);
//           } else if (r1 >= e1 && r2 <= e2) {
//             // Hard case -- points we care about are enclosed within src range
//             newEndpoints.push([e1, r1]);
//             newEndpoints.push([r1 + shiftVal, r2 + shiftVal]);
//             newEndpoints.push([r2, e2]);
//           } else if (e1 <= r1) {
//             // Points we care about left-overlaps src range
//             newEndpoints.push([e1, r1]);
//             newEndpoints.push([r1 + shiftVal, e2 + shiftVal]);
//           } else {
//             // Points we care about right-overlaps src range
//             newEndpoints.push([e1, r2]);
//             newEndpoints.push([r2 + shiftVal, e2 + shiftVal]);
//           }
//         } else {
//           newEndpoints.push([e1, e2]);
//         }
//       });
//     });
//     // }
//     endpoints = [];
//     newEndpoints.forEach((e, i) => {
//       if (!endpoints.some((a) => a[0] === e[0] && a[1] === e[1])) {
//         endpoints.push(e);
//       }
//     });

//     console.log(
//       "First few endpoints...",
//       key,
//       endpoints
//         .filter((x) => x[0] !== 0)
//         .sort((a, b) => a[0] - b[0])
//         .slice(0, 5)
//     );
//   });

//   //   console.log(
//   //     "Final endpoints...",
//   //     endpoints.sort((a, b) => a[0] - b[0]).slice(0, 5),
//   //     Math.min(...endpoints.map((e) => e[0]))
//   //   );
//   //   const startingRanges = [];

//   //   const findMinimumLocationValueAvailableFromRanges = (
//   //     ranges,
//   //     map,
//   //     isLast = false
//   //   ) => {
//   //     if (isLast) {
//   //     } else {
//   //     }
//   //   };

//   const s = new Set();
//   s.add([1, 1]);
//   s.add([1, 1]);
// };

// partTwo();

const partTwoAttemptTwo = () => {
  const lines = input.split("\n");

  const seeds = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((x) => parseInt(x));

  // These are the "intervals we care about" -- endpoints of intervals that seeds may reach.
  let intervals = [];
  for (let i = 0; i < seeds.length; i += 2) {
    // Also be inclusive of (right) endpoint
    intervals.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
  }

  const allRules = parseRules(lines);
  Object.keys(allRules).forEach((key) => {
    const val = allRules[key];
    const newVal = [];
    val.forEach((arr) => {
      const [dest, src, range] = arr;
      // NOTE: these ranges are inclusive of (right) endpoint.
      newVal.push({
        src: [src, src + range - 1],
        dest: dest - src, // The shift value
      });
    });
    allRules[key] = newVal;
  });

  console.log(seeds, intervals, allRules["seed-to-soil map:"]);

  orderOfMaps.forEach((val) => {
    const key = Object.keys(allRules).find((k) => k.startsWith(val));

    // if (!val.includes("seed")) return;
    const mapping = allRules[key];

    // console.log("processing", key, mapping, intervals);

    let newIntervals = [];

    intervals.forEach((interval) => {
      const intersections = [];
      mapping.forEach((rule) => {
        const { src, dest } = rule;
        // See where the rule's src interval intersects the current interval.
        // Take that intersection and shift it properly, then add it to newIntervals.
        const intersection = getIntersection(src, interval);
        if (intersection !== null) {
          intersections.push(intersection);
          newIntervals.push(intersection.map((x) => x + dest));
        }
      });

      // Tricky part.... we need to then find all pieces of interval that WEREN'T intersected by a src interval,
      // and also add those to the newIntervals.
      const nonShiftedIntervalPieces = getDifference(interval, intersections);
      newIntervals = newIntervals.concat(nonShiftedIntervalPieces);
    });

    intervals = newIntervals;
    console.log("set new intervals for key", key);
  });

  return Math.min(...intervals.map((i) => i[0]));
};

// Shit, 22911600 is too low.....
// Damn, really not sure what we're doing wrong now.
// Prob some off-by-one or range endpoint edge case....

// Ahhhh sweet it was issue with getDifference, it wasn't accounting for fact ranges are inclusive.
console.log("Part two", partTwoAttemptTwo());

console.log(
  getDifference(
    [2, 8],
    [
      [1, 2],
      [4, 5],
      [7, 9],
    ]
  )
);

/**
 * Ugh.... can we just reverse?
 *
 * Start with seed 0, look up locations that corresopnd to it? No.... doesn't go backwards, does it?
 * Because multiple combos of src range and dest shift value could lead to same result. So you can't go back from result to src/dest....
 */
