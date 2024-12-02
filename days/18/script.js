import { readFileSync } from "fs";
const input = readFileSync("./days/18/input.txt", "utf-8");
const ex = `R 6 (#70c710)
    D 5 (#0dc571)
    L 2 (#5713f0)
    D 2 (#d2c081)
    R 2 (#59c680)
    D 2 (#411b91)
    L 5 (#8ceee2)
    U 2 (#caa173)
    L 1 (#1b58a2)
    U 2 (#caa171)
    R 2 (#7807d2)
    U 3 (#a77fa3)
    L 2 (#015232)
    U 2 (#7a21e3)`;

const run = () => {
  const d = ex.split("\n").map((x) => x.trim().split(" "));
  const dims = { x: 0, y: 0 };
  const maxDims = { x: 0, y: 0 };
  const minDims = { x: 0, y: 0 };

  d.forEach((l) => {
    // PART ONE
    const dir = l[0];
    const num = parseInt(l[1]);

    switch (dir) {
      case "D":
        dims.y += num;
        maxDims.y = Math.max(maxDims.y, dims.y);
        break;
      case "U":
        dims.y -= num;
        minDims.y = Math.min(minDims.y, dims.y);
        break;
      case "R":
        dims.x += num;
        maxDims.x = Math.max(maxDims.x, dims.x);
        break;
      case "L":
        dims.x -= num;
        minDims.x = Math.min(minDims.x, dims.x);
        break;
    }
  });
  const cols = maxDims.x - minDims.x + 1;
  const rows = maxDims.y - minDims.y + 1;

  const result = [...new Array(rows)].map((x) =>
    [...new Array(cols)].map((y) => ".")
  );
  console.log(minDims, maxDims, cols, rows);

  const pos = { x: -minDims.x, y: -minDims.y };

  const border = new Map();

  const vertices = new Map();

  d.forEach((x) => {
    let [dir, val, hex] = x;

    // PART ONE
    val = parseInt(val);

    const diffs = {
      R: { x: 1, y: 0 },
      L: { x: -1, y: 0 },
      U: { x: 0, y: -1 },
      D: { x: 0, y: 1 },
    };
    vertices.set(`${pos.x},${pos.y}`, 1);
    // console.log("pos", pos);
    // console.log("...", result[pos.y]);

    while (val > 0) {
      result[pos.y][pos.x] = "#";

      border.set(`${pos.x},${pos.y}`, 1);
      pos.x += diffs[dir].x;
      pos.y += diffs[dir].y;
      val--;
    }
  });
  console.log(result.map((x) => x.join("")).join("\n"));

  //   let sum = 0;

  //   return grid.size;

  const seen = new Map();
  const unvisited = [];

  // DON'T FORGET, MUST SWAP THIS BETWEEN EXAMPLE AND REAL INPUT
  //   const start = { x: -minDims.x - 1, y: -minDims.y - 1 };
  const start = { x: 1, y: 1 };
  unvisited.push(start);

  const deltas = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  let i = 0;

  while (unvisited.length > 0) {
    // OMG YOU'RE JOKING, WE JUST HAD TO POP INSTEAD OF SHIFT??????
    // Then it works super fast and spits out right answer...... WOW.
    const n = unvisited.pop();
    i++;
    seen.set(`${n.x},${n.y}`, 1);
    const neighbors = deltas
      .map((d) => ({
        x: n.x + d[0],
        y: n.y + d[1],
      }))
      .filter((n) => !border.has(`${n.x},${n.y}`))
      .filter((n) => !seen.has(`${n.x},${n.y}`));

    neighbors.forEach((nbr) => {
      //   seen.set(`${nbr.x},${nrb.y}`, 1);
      unvisited.push(nbr);
    });

    // console.log("nbrs", neighbors);

    if (i % 1000 === 0) {
      console.log("It", i, border.size + seen.size);
    }

    // break;
  }

  console.log("Loop its", i);

  return border.size + seen.size;
};

const runTwo = () => {
  const d = input.split("\n").map((x) => x.trim().split(" "));
  const dims = { x: 0, y: 0 };
  const maxDims = { x: 0, y: 0 };
  const minDims = { x: 0, y: 0 };

  d.forEach((l) => {
    const hex = l[2].slice(2, l[2].length - 1);
    const nVal = parseInt(hex.slice(0, 5), 16);
    const dVal = "RDLU"[parseInt(hex[5])];

    const dir = dVal;
    const num = nVal;

    switch (dir) {
      case "D":
        dims.y += num;
        maxDims.y = Math.max(maxDims.y, dims.y);
        break;
      case "U":
        dims.y -= num;
        minDims.y = Math.min(minDims.y, dims.y);
        break;
      case "R":
        dims.x += num;
        maxDims.x = Math.max(maxDims.x, dims.x);
        break;
      case "L":
        dims.x -= num;
        minDims.x = Math.min(minDims.x, dims.x);
        break;
    }
  });
  const cols = maxDims.x - minDims.x + 1;
  const rows = maxDims.y - minDims.y + 1;

  console.log(minDims, maxDims, cols, rows);

  const pos = { x: -minDims.x, y: -minDims.y };

  const vertices = new Map();
  let borderSize = 0;

  d.forEach((x) => {
    let [dir, val, hex] = x;

    hex = hex.slice(2, hex.length - 1);
    const nVal = parseInt(hex.slice(0, 5), 16);
    const dVal = "RDLU"[parseInt(hex[5])];

    val = nVal;
    dir = dVal;

    const diffs = {
      R: { x: 1, y: 0 },
      L: { x: -1, y: 0 },
      U: { x: 0, y: -1 },
      D: { x: 0, y: 1 },
    };
    vertices.set(`${pos.x},${pos.y}`, 1);

    // Get rid of while loop from part one
    pos.x += diffs[dir].x * val;
    pos.y += diffs[dir].y * val;
    borderSize += val;
  });

  // SHOELACE algorithm
  let firstSum = 0;
  let secondSum = 0;

  // don't get this at all.... this should not change our answer but it does.....
  // at least for real input... doesn't change answer for example....
  const offset = 0;

  // Each vertex is array with [x, y] shape
  const vs = [...vertices.keys()]
    .map((x) => x.split(",").map((n) => parseInt(n)))
    .map((v) => [v[0] - minDims.x + offset, v[1] - minDims.y + offset]);

  console.log(vs.every((v) => v[0] >= 0 && v[1] >= 0));

  //   const vs = [
  //     [0, 0],
  //     [3, 0],
  //     [3, 3],
  //     [0, 3],
  //   ];

  for (let i = 0; i < vs.length; i++) {
    firstSum += vs[i][0] * vs[(i + 1) % vs.length][1];
  }
  for (let i = 0; i < vs.length; i++) {
    secondSum += vs[i][1] * vs[(i + 1) % vs.length][0];
  }

  const shoelaceArea = 0.5 * Math.abs(firstSum - secondSum);

  //   return { shoelaceArea, border: border.size, interior: seen.size };

  // COMBINE SHOELACE WITH PICK'S THEOREM -- MAGIC???? (helps account for fact our grid doesn't match integer coordinate grid perfectly)
  // Ahhhhh wow this guy explains it beautifully: https://www.reddit.com/r/adventofcode/comments/18l8mao/2023_day_18_intuition_for_why_spoiler_alone/
  // I just found it as a guessed pattern from relevant quantities from example case
  // But yeah this insight essentially IS Pick's theorem
  return shoelaceArea + borderSize / 2 + 1;

  return vertices;
};

/**
 * Ok so we tried to naive brute force part 2....not a good idea.
 * I think we can compute a sum of rectangular areas....
 *
 * Shoelace algorithm?
 * Issue is [0, 0] -> [0, 3] has area of 9 in shoelace, but 16 in our grid...
 */

// PART ONE
// Hmmm, 42708 is too low...
// Arghhh so is 44413....
// Had to change shift to pop!

// PART TWO
// Shoot, 106941819907454 is too high...... but we got right answer for example..... 952408144115
// Omg and 106941819907366 is TOO LOW!!
console.time("run");
console.log("Result", runTwo());
console.timeEnd("run");
