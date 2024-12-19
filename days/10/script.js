// const fs = require("fs");

// NOTE: Had to add "type": "module" to package.json to make import work. But now require WON'T work.
import { readFileSync } from "fs";
const input = readFileSync("./days/10/input.txt", "utf-8");
import chalk from "chalk";

const ex = `.....
    .S-7.
    .|.|.
    .L-J.
    .....`;

const exTwo = `..F7.
    .FJ|.
    SJ.L7
    |F--J
    LJ...`;

const exThree = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const exFour = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

const partOne = (input, startDir = "R") => {
  const grid = input
    .split("\n")
    .map((l) => l.split("").filter((x) => x && x !== " "));

  //   console.log(grid);

  // AHHHHHH JUST A DUMB MISTAKE, STRIPPING THE EMPTY SPACES.... SHOULD HAVE SEEN IT IMMEDIATELY

  const startingPos = grid
    .find((s) => s.includes("S"))
    .findIndex((c) => c === "S");
  const startingIdx = grid.findIndex((s) => s.includes("S"));
  const start = { r: startingIdx, c: startingPos };
  //   console.log(
  //     "START",
  //     start.r,
  //     start.c,
  //     grid.find((s) => s.includes("S"))
  //   );

  let pos = start;

  // part two
  const visited = new Map();

  const possibleDirs = new Set();
  const nodeR = grid[start.r][start.c + 1];
  const nodeL = grid[start.r][start.c - 1];
  const nodeD = grid[start.r - 1]?.[start.c];
  const nodeU = grid[start.r + 1]?.[start.c];
  if (nodeR === "-" || nodeR === "J" || nodeR === "7") possibleDirs.add("R");
  if (nodeL === "-" || nodeL === "F" || nodeL === "L") possibleDirs.add("L");
  if (nodeU === "|" || nodeU === "F" || nodeU === "7") possibleDirs.add("U");
  if (nodeD === "|" || nodeD === "J" || nodeD === "L") possibleDirs.add("D");

  console.log("start", possibleDirs);

  // Dumb and hacky we are inputting this manually...oh welll
  // let dir = startDir;

  let dir = [...possibleDirs][0];

  const getNext = () => {
    const c = pos.c;
    const r = pos.r;
    switch (dir) {
      case "R":
        pos.c = c + 1;
        return grid[r][c + 1];
      case "L":
        pos.c = c - 1;
        return grid[r][c - 1];
      case "U":
        pos.r = r - 1;
        return grid[r - 1][c];
      case "D":
        pos.r = r + 1;
        return grid[r + 1][c];
    }
    // return grid[r][c];
  };

  let pathLength = 0;

  const fullPath = [];

  while (true) {
    pathLength++;
    const next = getNext();
    visited.set(`${pos.r},${pos.c}`, 1);
    fullPath.push(`${pos.r},${pos.c},${dir}`);
    // console.log("next", next, pos, dir);
    if (next === "S") {
      console.log("DONE", pathLength);
      break;
    }
    switch (next) {
      case ".":
        console.log("Uh oh this is bad.");
        break;
      case "L":
        dir = dir === "L" ? "U" : "R";
        break;
      case "7":
        dir = dir === "U" ? "L" : "D";
        break;
      case "J":
        dir = dir === "D" ? "L" : "U";
        break;
      case "F":
        dir = dir === "U" ? "R" : "D";
        break;
      //   case "-":
      //     pos.r += dir === "R" ? 1 : -1;
      //     break;
      //   case "|":
      //     pos.c += dir === "D" ? 1 : -1;
    }
  }
  console.log(
    grid.length,
    grid[0].length,
    grid.length * grid.length,
    14024 / (grid.length * grid.length)
  );
  console.log([...visited.keys()].filter((x) => x.split(",")[0] === "139"));

  //   const line = "abcd";
  //   line
  //     .split("")
  //     .forEach((char) =>
  //       console.log(char === "c" ? chalk.blue(char) : chalk.green(char))
  //     );

  //   console.log(
  //     ...line
  //       .split("")
  //       .map((char) => (char === "c" ? chalk.blue(char) : chalk.green(char)))
  //   );

  // grid.forEach((line, r) => {
  //   // r.forEach((char, c) => {});
  //   console.log(
  //     ...line.map((char, c) => {
  //       return char === "S"
  //         ? chalk.red(char)
  //         : visited.has(`${r},${c}`)
  //         ? chalk.blue(char)
  //         : chalk.green(char);
  //     })
  //   );
  //   // line.forEach((char) => {
  //   //   console.log(char === "J" ? chalk.blue(char) : chalk.green(char));
  //   // });
  // });

  return { fullPath, visited, grid };
};

const partTwo = (startDir = "R", lookingLeft = false) => {
  const { fullPath, visited, grid } = partOne(exThree, startDir);

  const path = [...fullPath];
  const DIRS = "RDLU";
  const LEFT_DIRS = "RULD";
  const deltas = {
    R: [1, 0],
    L: [-1, 0],
    U: [0, -1],
    D: [0, 1],
  };

  const area = new Set();

  while (path.length > 0) {
    let [r, c, dir] = path.shift().split(",");
    r = +r;
    c = +c;
    // Unclear which direction we have to look for each example... just try both I guess? Take one with smaller size? Not sure.
    // Yeah, seems we want to look right in real data.
    const lookRight = DIRS.concat(DIRS)[DIRS.indexOf(dir) + 1];
    const lookLeft = LEFT_DIRS.concat(LEFT_DIRS)[LEFT_DIRS.indexOf(dir) + 1];

    const look = lookingLeft ? lookLeft : lookRight;
    const seenIdx = {
      r: r + deltas[look][1],
      c: c + deltas[look][0],
    };
    // const seenNode = grid[seenIdx.r]?.[seenIdx.c];
    const seenKey = `${seenIdx.r},${seenIdx.c}`;
    if (!visited.has(seenKey)) {
      area.add(seenKey);

      render();
      console.log("==========");

      // And ....flood fill!
      const queueSeen = new Set();
      const queue = [seenKey];
      while (queue.length > 0) {
        const nextKey = queue.shift();
        if (queueSeen.has(nextKey)) {
          continue;
        }
        // It's part of the pipe border
        if (visited.has(nextKey)) {
          continue;
        }
        const [r, c] = nextKey.split(",").map(Number);

        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) {
          continue;
        }

        // area.add(nextKey);
        queueSeen.add(nextKey);

        Object.values(deltas).forEach((delta) => {
          const neighbor = { r: r + delta[1], c: c + delta[0] };
          queue.push(`${neighbor.r},${neighbor.c}`);
        });
      }
    }
  }

  function render() {
    grid.forEach((line, r) => {
      // r.forEach((char, c) => {});
      console.log(
        ...line.map((char, c) => {
          return char === "S"
            ? chalk.red(char)
            : visited.has(`${r},${c}`)
            ? chalk.blue(char)
            : area.has(`${r},${c}`)
            ? chalk.yellow(char)
            : chalk.green(char);
        })
      );
    });
  }

  render();

  return area.size;
};

// Shoot... 390 is too low....
// 392 (left and left) or 400 (down and right) lol.
// 458 is too high
// Oh god no we got 390 again...
console.time("res");
console.log("Result:", partTwo("_", true));
console.timeEnd("res");

/**
 * Part two thoughts... hmm..... so we need to know for a given cell, is it contained within the giant loop....
 *
 * Hard one.....
 *
 *
 * Seems flood fill?? But treat the loop as wall??
 *
 * We can manually find a few cells that we KNOW are outside the loop... by looking at border....
 *
 * Like flood fill to..... some target. If you can't hit it.... you must not be connected....
 * But it's easy to image counterexamples to many targets.... so mybe you try multiple?
 *
 *
 * Hold on..
 *
 * For one thing, you don't have to flood from every cell.
 * Any time a cell is hit from a flood, it is in THAT set.
 * So you really only have to flood from.... some set of sample cells.
 * Until every cell (besides wall) is hit...
 * And then check where some KNOWN OUTER cell lives.....
 *
 * Yeah that would work.
 */

// I feel like issue is probably that by the time we're at a square, we have already turned that direction. We're not checking the look-direction BEFORE we turn. Or vice versa.
