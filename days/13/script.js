import { readFileSync } from "fs";
const input = readFileSync("./days/13/input.txt", "utf-8");
const exInput = readFileSync("./days/13/ex.txt", "utf-8");

const getGridMap = (gridText) => {
  const m = new Map();
  const lines = gridText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      m.set(`${i},${j}`, line[j]);
    }
  }
  return {
    map: m,
    rows: lines.length,
    cols: lines[0].length,
  };
};

const getRow = (gridInfo, r) => {
  return [...gridInfo.map.keys()]
    .filter((k) => k.split(",")[0] == r)
    .map((k) => gridInfo.map.get(k));
};

const getCol = (gridInfo, c) => {
  return [...gridInfo.map.keys()]
    .filter((k) => k.split(",")[1] == c)
    .map((k) => gridInfo.map.get(k));
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const getLineOfReflection = (gridInfo, ignore) => {
  const { rows, cols } = gridInfo;
  //   console.log("get line...", rows);
  // Treat i as referring to the space AFTER the row at index i
  for (let i = 0; i < rows - 1; i++) {
    // Check if all rows BEFORE this space match all the rows AFTER it.
    let idx1 = i;
    let idx2 = i + 1;
    let areEqual = true;
    // console.log("+++++++");
    // console.log("Testing row", i);

    while (idx1 >= 0 && idx2 <= rows - 1) {
      //   console.log("while loop", idx1, idx2);
      const r1 = getRow(gridInfo, idx1);
      const r2 = getRow(gridInfo, idx2);
      if (!arraysEqual(r1, r2)) {
        areEqual = false;
        break;
      }
      idx1--;
      idx2++;
    }

    // console.log("get lor", ignore?.type, ignore?.type);

    if (areEqual && !(ignore?.type === "row" && ignore?.value === i + 1)) {
      return {
        type: "row",
        value: i + 1, // We want number of rows above, so add 1
      };
    }
  }

  // Do same exact thing with columns
  for (let i = 0; i < cols - 1; i++) {
    // Check if all cols BEFORE this space match all the cols AFTER it.
    let idx1 = i;
    let idx2 = i + 1;
    let areEqual = true;
    // console.log("+++++++");
    // console.log("Testing row", i);

    while (idx1 >= 0 && idx2 <= cols - 1) {
      //   console.log("while loop", idx1, idx2);
      const r1 = getCol(gridInfo, idx1);
      const r2 = getCol(gridInfo, idx2);
      if (!arraysEqual(r1, r2)) {
        areEqual = false;
        break;
      }
      idx1--;
      idx2++;
    }

    if (areEqual && !(ignore?.type === "col" && ignore?.value === i + 1)) {
      return {
        type: "col",
        value: i + 1, // We want number of rows above, so add 1
      };
    }
  }

  //   return getCol(gridInfo, 0);
};

const partOne = () => {
  const gridTexts = input.split("\n\n");
  let sum = 0;
  gridTexts.forEach((gt) => {
    const gInfo = getGridMap(gt);
    const { type, value } = getLineOfReflection(gInfo);
    if (type === "row") {
      sum += 100 * value;
    } else {
      sum += value;
    }
  });
  return sum;
  //   return getLineOfReflection(getGridMap(gridTexts[0]));
};

// console.log(partOne());

// For part two.... Each grid has exactly one cell that needs to be swapped to the other value, in order to produce a different line of reflection....

// A SMUDGE.... ON THE LENS..?!?
// lol

const dupeMap = (m) => {
  const r = new Map();
  [...m.keys()].forEach((key) => {
    r.set(key, m.get(key));
  });
  return r;
};

// ================================================================================

const partTwo = () => {
  const gridTexts = input.split("\n\n");
  // const { map, rows, cols } = getGridMap(gridTexts[0]);
  console.log(gridTexts.length);

  let sum = 0;

  gridTexts.forEach((gt, gridIdx) => {
    const { rows, cols, map } = getGridMap(gt);

    // if (gridIdx !== 9) {
    //   return;
    // }
    // console.log(map);

    // Store original line of reflection -- need to ensure other one is NEW
    let lor = getLineOfReflection({ rows, cols, map });
    let i = 0;
    while (i < rows * cols) {
      const m = dupeMap(map);
      const r = Math.floor(i / cols);
      const c = i % cols;
      const key = `${r},${c}`;
      const v = map.get(key);
      m.set(key, v === "#" ? "." : "#");

      // Oh that's funny, we weren't passing lor as a second arg...
      const newLor = getLineOfReflection({ rows, cols, map: m }, lor);
      // console.log(
      //   "lor",
      //   i,
      //   r,
      //   c,
      //   key,
      //   map.get(key),
      //   m.get(key),
      //   newLor?.value,
      //   newLor?.type,
      //   lor.type,
      //   lor.value
      // );
      if (newLor !== undefined) {
        lor = newLor;
        console.log("Found for grid..", gridIdx);
        break;
      }
      // console.log("v", v, r, c);
      i++;
      // if (i > 5) break;
    }

    if (i === rows * cols) {
      console.log("Uh oh", gridIdx, rows, cols);
      throw Error("there ought to be a new LoR...");
    }

    const { type, value } = lor;
    if (type === "row") {
      sum += 100 * value;
    } else {
      sum += value;
    }
  });

  return sum;
};

// 22s .... shoot, 41349 is too low....
// Ok, because we're missing a lot of grids.... that is we're not finding a different line of ref....
console.time("two");
console.log("TWO", partTwo());
console.timeEnd("two");

// Oh I see the problem.
// We're returning the first LoR we find, as soon as we find it...
// Jeez why does it take so long??
// 30s...
