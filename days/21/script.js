import { readFileSync } from "fs";
const input = readFileSync("./days/21/input.txt", "utf-8");

const ex = `...........
    .....###.#.
    .###.##..#.
    ..#.#...#..
    ....#.#....
    .##..S####.
    .##..#...#.
    .......##..
    .##.#.####.
    .##..##.##.
    ...........`;

const numberTargetsReachableInNSteps = (n, grid) => {
  const m = new Map();
  grid.forEach((r, ri) => {
    r.forEach((v, vi) => {
      m.set(`${ri},${vi}`, v);
    });
  });

  const sri = grid.findIndex((r) => r.includes("S"));
  const sci = grid[sri].indexOf("S");

  const getViableNeighbors = (r, c) => {
    const ds = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    return ds
      .map((d) => `${r + d[0]},${c + d[1]}`)
      .filter((key) => m.get(key) !== undefined && m.get(key) !== "#")
      .map((str) => str.split(","))
      .map((arr) => ({ r: parseInt(arr[0]), c: parseInt(arr[1]) }));
  };

  //   let leaves = [{ r: sri, c: sci }];

  let leavesSeen = new Map();
  leavesSeen.set(`${sri},${sci}`, 1);

  let i = 0;

  /**
   * Iterate once for each integer less than n.
   * Each time you iterate, move all of your leaves forward to each neighbor they can move to (that is not a "#").
   */

  while (i < n) {
    // let newLeaves = [];
    let newLeaves = new Map();

    [...leavesSeen.keys()].forEach((leaf) => {
      const [r, c] = leaf.split(",").map((x) => parseInt(x));
      const nbrs = getViableNeighbors(r, c);
      //   newLeaves = [...newLeaves, ...nbrs];
      nbrs.forEach((n) => {
        newLeaves.set(`${n.r},${n.c}`, 1);
      });
    });

    // leaves = newLeaves;
    leavesSeen = newLeaves;

    i++;
  }

  //   return new Set(leavesSeen.map((l) => `${l.r},${l.c}`)).size;
  return leavesSeen.size;
  //   return getViableNeighbors(5, 5);
  return { sri, sci };
};

const run = () => {
  const grid = input.split("\n").map((l) => l.trim().split(""));
  return numberTargetsReachableInNSteps(64, grid);
};

console.time("run");
console.log(run());
console.timeEnd("run");

/**
 * Ok first attempt... big off. Baited by wording into naive attempt.
 * Second idea....
 *
 * We first pass through grid to find how many spaces each cell can reach with distance 1.
 * Then in second pass... to find how many spaces each cell can reach with distance 2... we use results from first pass.
 * Well... we need to know WHO each one in first iteration reached...
 *
 *
 * Ah no, we are fine! Just had to use a map instead of array! Easy lol
 */
