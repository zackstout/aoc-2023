import { readFileSync } from "fs";
const input = readFileSync("./days/17/input.txt", "utf-8");

const ex = `2413432311323
    3215453535623
    3255245654254
    3446585845452
    4546657867536
    1438598798454
    4457876987766
    3637877979653
    4654967986887
    4564679986453
    1224686865563
    2546548887735
    4322674655533`;

const run = () => {
  const g = ex.split("\n").map((x) => x.trim());

  let queue = [
    {
      r: 0,
      c: -1,
      times: 0,
      val: 0,
      dir: "R",
    },
  ];

  const rows = g.length;
  const cols = g[0].length;

  const dirs = ["U", "R", "D", "L"];
  const goRight = (dir) => {
    return dirs.concat(dirs)[dirs.indexOf(dir) + 1];
  };
  const goLeft = (dir) => {
    return dirs.concat(dirs)[dirs.indexOf(dir) - 1 + 4];
  };

  let n = 0;

  const res = new Map();

  while (queue.length > 0) {
    n++;

    // if (n > 10) break;
    const { r, c, times, dir, val } = queue.shift();
    let nextNode = null;
    switch (dir) {
      case "R":
        nextNode = { r: r, c: c + 1 };
        break;
      case "L":
        nextNode = { r: r, c: c - 1 };
        break;
      case "U":
        nextNode = { r: r - 1, c: c };
        break;
      case "D":
        nextNode = { r: r + 1, c: c };
        break;
    }

    // console.log(nextNode, r, c, times, dir, val);

    if (nextNode.r === rows - 1 && nextNode.c === cols - 1) {
      console.log("Got a finish");
    }

    if (
      nextNode.r > -1 &&
      nextNode.c > -1 &&
      nextNode.r < rows &&
      nextNode.c < cols
    ) {
      const nextChar = g[nextNode.r][nextNode.c];
      const nextDirs = [goLeft(dir), goRight(dir)];
      if (times < 3) {
        nextDirs.push(dir);
      }
      res[`${nextNode.r},${nextNode.c}`] = val + parseInt(nextChar);

      nextDirs.forEach((newDir) => {
        if (res[`${nextNode.r},${nextNode.c}`] >= val + parseInt(nextChar)) {
          queue.push({
            ...nextNode,
            dir: newDir,
            times: dir === newDir ? times + 1 : 0,
            val: val + parseInt(nextChar),
          });
        }
      });
    }
  }

  return g;
};

console.time("run");
console.log(run());
console.timeEnd("run");
