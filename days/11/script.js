import { readFileSync } from "fs";
const input = readFileSync("./days/11/input.txt", "utf-8");

// DON'T FORGET TO TRIM...
const ex = `....1........
    .........2...
    3............
    .............
    .............
    ........4....
    .5...........
    ............6
    .............
    .............
    .........7...
    8....9.......`;

const actualEx = `...#......
    .......#..
    #.........
    ..........
    ......#...
    .#........
    .........#
    ..........
    .......#..
    #...#.....`;

const partOne = () => {
  const grid = input.split("\n").map((x) => x.trim());
  const gridMap = new Map();

  // Expand the galaxy first!!!
  // Just store what must be expanded so you can count properly later, rather than actually modifying grid.
  const expandedRows = [];
  const expandedCols = [];
  //   const newGrid = [];
  grid.forEach((line, r) => {
    if (line.includes("#")) {
      //   newGrid.push(line);
    } else {
      //   newGrid.push(line);
      //   newGrid.push(line);
      expandedRows.push(r);
    }
  });
  for (let c = 0; c < grid[0].length; c++) {
    const column = grid.map((line) => line[c]);
    if (column.includes("#")) {
    } else {
      expandedCols.push(c);
    }
  }

  //   return console.log(expandedRows, expandedCols);

  grid.forEach((line, r) => {
    line.split("").forEach((char, c) => {
      if (char !== ".") {
        gridMap.set(gridMap.size, { r, c });
      }
    });
  });

  let sumOfDistances = 0;

  let numPairs = 0;

  const pairsSeen = new Map();

  for (const key of gridMap.keys()) {
    for (const otherKey of gridMap.keys()) {
      const keys = [key, otherKey].map((x) => parseInt(x));
      if (key !== otherKey) {
        const pairKey = `${Math.min(...keys)},${Math.max(...keys)}`;
        if (!pairsSeen.get(pairKey)) {
          numPairs++;
          const o1 = gridMap.get(key);
          const o2 = gridMap.get(otherKey);
          let distance = 0;
          distance += Math.abs(o1.r - o2.r);
          distance += Math.abs(o1.c - o2.c);

          // Ahhhhh you have to subtract one!!!!
          const scl = 1_000_000 - 1;

          distance +=
            scl *
            expandedCols.filter(
              (c) => c > Math.min(o1.c, o2.c) && c < Math.max(o1.c, o2.c)
            ).length;
          distance +=
            scl *
            expandedRows.filter(
              (r) => r > Math.min(o1.r, o2.r) && r < Math.max(o1.r, o2.r)
            ).length;
          //   console.log(distance);
          sumOfDistances += distance;
        }
        pairsSeen.set(pairKey, 1);
      }
    }
  }

  // Hmmm... 9165297 is too low
  // Ok got it

  // Part two though.... huh..... our value is always a bit bigger than should be...
  console.log(numPairs, sumOfDistances);
};

partOne();
