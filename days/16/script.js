import { readFileSync } from "fs";
const input = readFileSync("./days/16/input.txt", "utf-8");

// Ahhhh the "A" at end of lines really messes up parsing...
// Treated as escape character... huh..... Ok just manually replace it. Easy enough.
const ex = `.|...A....
|.-.A.....
.....|-...
........|.
..........
.........A
..../.AA..
.-.-/..|..
.|....-|.A
..//.|....`;

// const parse = (txt) => {
//   const lines = txt.split("An");
//   const lineLen = lines[0].length;
//   const result = new Map();
//   // for (let i=0)
//   return txt;
// };

const getNextDir = (dir, char) => {
  if (char === "/") {
    if (dir === "R") return "U";
    if (dir === "L") return "D";
    if (dir === "U") return "R";
    if (dir === "D") return "L";
  } else if (char === "A") {
    // Backslash is now "A"
    if (dir === "R") return "D";
    if (dir === "L") return "U";
    if (dir === "D") return "R";
    if (dir === "U") return "L";
  }
};

const getNumEnergizedTiles = (d, startingPos) => {
  const visited = new Set();

  const rows = d.length;
  const cols = d[0].length;

  let frontier = [];
  frontier.push(startingPos);

  const energized = new Set();

  let n = 0;
  while (frontier.length > 0) {
    n++;
    const node = frontier.shift();
    visited.add(`${node.r},${node.c},${node.dir}`);

    if (n > 1_000_000) break;
    // console.log("Next node in frontier", node);
    energized.add(`${node.r},${node.c}`);
    let nextNode = null;
    switch (node.dir) {
      case "R":
        nextNode = { r: node.r, c: node.c + 1 };
        break;
      case "L":
        nextNode = { r: node.r, c: node.c - 1 };
        break;
      case "U":
        nextNode = { r: node.r - 1, c: node.c };
        break;
      case "D":
        nextNode = { r: node.r + 1, c: node.c };
        break;
    }
    if (
      nextNode.r > -1 &&
      nextNode.c > -1 &&
      nextNode.r < rows &&
      nextNode.c < cols
    ) {
      const nextChar = d[nextNode.r][nextNode.c];
      let nextDir = null;
      switch (nextChar) {
        case ".":
          // just keep going
          frontier.push({ ...nextNode, dir: node.dir });
          break;
        case "|":
          if (["L", "R"].includes(node.dir)) {
            // split
            frontier.push({ ...nextNode, dir: "D" });
            frontier.push({ ...nextNode, dir: "U" });
          } else {
            // just keep going
            frontier.push({ ...nextNode, dir: node.dir });
          }
          break;
        case "-":
          if (["U", "D"].includes(node.dir)) {
            // split
            frontier.push({ ...nextNode, dir: "R" });
            frontier.push({ ...nextNode, dir: "L" });
          } else {
            // just keep going
            frontier.push({ ...nextNode, dir: node.dir });
          }
          break;
        case "/":
          nextDir = getNextDir(node.dir, "/");
          if (!nextDir) console.error("why no nextDir?", node.dir, "/");
          frontier.push({ ...nextNode, dir: nextDir });
          break;
        case "A":
          nextDir = getNextDir(node.dir, "A");
          if (!nextDir) console.error("why no nextDir?", node.dir, "A");
          frontier.push({ ...nextNode, dir: nextDir });
          break;
      }
    }

    // Before turning over the iteration... filter out Visited from frontier
    frontier = frontier.filter(
      (node) => !visited.has(`${node.r},${node.c},${node.dir}`)
    );
  }

  //   return { rows, cols };
  return energized.size - 1;
};

const run = () => {
  const d = input.split("\n").map((x) => x.trim());
  // .map((x) => x.length);

  return getNumEnergizedTiles(d, {
    r: 0,
    c: -1, // Actually start OFF the grid in case first character is special
    dir: "R",
  });
};

// Hmm.... seems to work.....we just need to give it a stopping condition......
// Yeah annoying to have to manually incremenet it until we stop changing the answer haha
// I wonder how much caching could help us.... given a dir and a position, you are fixed.
// Like just... ignore anyone on the frontier whose pos/dir you've already seen.
// ooooh yeah that helps a lot!!! From like 9s to 120ms, for 700_000 limit. Hell yeah!!!!

// Good thing we optimized it... because we now have to run it 110 * 4 times haha -- should be about 90s
// console.time("run");
// console.log("Result", run());
// console.timeEnd("run");

const partTwo = () => {
  const d = input.split("\n").map((x) => x.trim());

  let maxNum = 0;

  for (let c = 0; c < d[0].length; c++) {
    // Try all cells in top and bottom rows
    const n = getNumEnergizedTiles(d, { r: -1, c, dir: "D" });
    const n2 = getNumEnergizedTiles(d, { r: d.length, c, dir: "U" });
    const max = Math.max(n, n2);
    if (max > maxNum) maxNum = max;
  }
  console.log("Halfway!");
  for (let r = 0; r < d.length; r++) {
    // Try all cells in left and right cols
    const n = getNumEnergizedTiles(d, { r, c: -1, dir: "R" });
    const n2 = getNumEnergizedTiles(d, { r, c: d[0].length, dir: "L" });
    const max = Math.max(n, n2);
    if (max > maxNum) maxNum = max;
  }

  return maxNum;
};

// 42s, not terrible lol
console.time("run");
console.log("Result", partTwo());
console.timeEnd("run");
