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

const partOne = () => {
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

  // Dumb and hacky we are inputting this manually...oh welll
  let dir = "R";

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

  while (true) {
    pathLength++;
    const next = getNext();
    visited.set(`${pos.r},${pos.c}`, 1);
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

  grid.forEach((line, r) => {
    // r.forEach((char, c) => {});
    console.log(
      ...line.map((char, c) => {
        return char === "S"
          ? chalk.red(char)
          : visited.has(`${r},${c}`)
          ? chalk.blue(char)
          : chalk.green(char);
      })
    );
    // line.forEach((char) => {
    //   console.log(char === "J" ? chalk.blue(char) : chalk.green(char));
    // });
  });

  return visited;
};

const pathOfLoop = partOne();

const partTwo = () => {
  const mapOne = new Map();
  const mapTwo = new Map();

  let pos = { r: 0, c: 0 };

  // while (true){
  //     // Flood

  //     const visited = new Map();

  // }
};

partTwo();

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
