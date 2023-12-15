import { readFileSync } from "fs";
const input = readFileSync("./days/14/input.txt", "utf-8");

const exInput = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

// Keep all #'s fixed. Move all O's as far to front as possible.
const rollLine = (arr) => {
  const result = [...new Array(arr.length)].map((x) => ".");
  let lastFixedSeen = -1;
  let numRocksSinceLastFixed = 0;

  let i = 0;
  const len = arr.length;
  while (i < len) {
    const v = arr.shift();
    // console.log("i", i, "v", v);

    if (v === "#") {
      if (lastFixedSeen > -1) {
        result[lastFixedSeen] = "#";
      }
      // Move all moveable rocks up to this point
      //   console.log("Got a #", lastFixedSeen, numRocksSinceLastFixed);
      for (
        let j = lastFixedSeen + 1;
        j < lastFixedSeen + 1 + numRocksSinceLastFixed;
        j++
      ) {
        // console.log("set result[j]", j);
        if (j > len) break;
        result[j] = "O";
      }

      lastFixedSeen = i;
      numRocksSinceLastFixed = 0;
    } else if (v === "O") {
      numRocksSinceLastFixed++;
    }
    i++;
  }

  // Handle final "#"-and-rocks batch:
  if (lastFixedSeen > -1) result[lastFixedSeen] = "#";
  for (
    let j = lastFixedSeen + 1;
    j < lastFixedSeen + 1 + numRocksSinceLastFixed;
    j++
  ) {
    // console.log("set result[j]", j);
    if (j > len) break;
    result[j] = "O";
  }

  return result;
  //   return arr;
};

const rollGrid = (grid, dir) => {
  const newGrid = [...new Array(grid.length)].map((x) => []);

  if (dir === "N") {
    // Go through each column one by one to build up new columns
    for (let i = 0; i < grid[0].length; i++) {
      const col = grid.map((row) => row[i]);
      rollLine(col).forEach((v, j) => {
        newGrid[j].push(v);
      });
    }
  } else if (dir === "E") {
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i].reverse();
      newGrid[i] = rollLine(row).reverse();
    }
  } else if (dir === "S") {
    for (let i = 0; i < grid[0].length; i++) {
      const col = grid.map((row) => row[i]);
      rollLine(col.reverse())
        .reverse()
        .forEach((v, j) => {
          newGrid[j].push(v);
        });
    }
  } else if (dir === "W") {
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      newGrid[i] = rollLine(row);
    }
  }

  return newGrid;
};

const getGridValue = (grid) => {
  let sum = 0;

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    sum += row.filter((v) => v === "O").length * (grid.length - i);
  }

  // console.log("Sum", sum);
  return sum;
};

const partOne = () => {
  const grid = input.split("\n");
  const rolledGrid = rollGrid(grid, "N");

  console.log(getGridValue(rolledGrid));

  //   const exLine = ["O", ".", ".", ".", ".", "#", ".", ".", "O", "."];
  //   console.log(rollLine(exLine));
};

// ====== ====== ====== ====== ====== ====== ====== ====== ====== ======

const areSameGrid = (g1, g2) => {
  for (let i = 0; i < g1.length; i++) {
    const row1Str = g1[i].join("");
    // console.log("g2[i]", g2[i], g1, g2);
    const row2Str = Array.isArray(g2[i]) ? g2[i].join("") : g2[i];
    if (row1Str !== row2Str) return false;
  }
  return true;
};

const areSameArrayStart = (a1, a2) => {
  const len = Math.min(a1.length, a2.length);

  for (let i = 0; i < len; i++) {
    if (a1[i] !== a2[i]) return false;
  }

  return true;
};

const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const findRepeatingPattern = (arr) => {
  let startIdx = 0;
  const maxAttempts = 100;

  while (startIdx < arr.length - 2) {
    const a = arr.slice(startIdx);

    let attempt = 2;
    // console.log("Attempt", attempt, "start", startIdx, a.length);

    while (attempt < maxAttempts && attempt < a.length) {
      const chunks = chunk(a, attempt);

      //   console.log("chunks", chunks);

      let res = true;
      for (let c of chunks) {
        if (!areSameArrayStart(c, chunks[0])) {
          res = false;
        }
      }
      if (res) {
        return {
          startIdx,
          size: attempt,
        };
      }

      attempt++;
    }

    startIdx++;
  }
};

const partTwo = () => {
  let grid = input.split("\n");

  //   return findRepeatingPattern([1, 2, 5, 3, 7, 8, 5, 7, 8, 5, 7, 8]);

  let i = 0;

  const values = [];

  while (i < 1_000_000_000) {
    let gridCopy = grid;
    gridCopy = rollGrid(gridCopy, "N");
    gridCopy = rollGrid(gridCopy, "W");
    gridCopy = rollGrid(gridCopy, "S");
    gridCopy = rollGrid(gridCopy, "E");

    // NOTE: This didn't get used -- naive approach that we had to transcend
    if (areSameGrid(gridCopy, grid)) {
      console.log("Same grid!!!", i, grid);
      grid = gridCopy;
      break;
    }
    i++;
    grid = gridCopy;

    // if (i % 1 === 0) {
    //   console.log("Iter..", i, getGridValue(grid));
    // }

    values.push(getGridValue(grid));

    // Huh.... at some point settles into cycle of 5,4,5,3,8,9,9.... (each plus 60).... So we just need to know 1_000_000_000 % 7 = 6..
    // since 7 is length of repeating region...
    // So we just have to find length of repeating region and where it starts....
    if (i > 1000) {
      break;
    }
  }

  console.log(values.slice(0, 20));

  console.log(findRepeatingPattern(values));

  const { startIdx, size } = findRepeatingPattern(values);

  //   console.log("Answer:", values[startIdx])
  //   const targetIdx = 1_000_000_000 % size;
  const dist = (1_000_000_000 - startIdx) % size;

  // Wooooooow I don't know why we need the minus 1, but it works!!!
  // Must be like... idk haha
  console.log(dist, startIdx, startIdx + dist, values[startIdx + dist - 1]);

  //   console.log(grid.map((l) => l.join("")));
};

console.time("Two");
console.log(partTwo());
console.timeEnd("Two");
