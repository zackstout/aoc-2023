import { readFileSync } from "fs";
const input = readFileSync("./days/23/input.txt", "utf-8");

const ex = `#.#####################
    #.......#########...###
    #######.#########.#.###
    ###.....#.>.>.###.#.###
    ###v#####.#v#.###.#.###
    ###.>...#.#.#.....#...#
    ###v###.#.#.#########.#
    ###...#.#.#.......#...#
    #####.#.#.#######.#.###
    #.....#.#.#.......#...#
    #.#####.#.#.#########v#
    #.#...#...#...###...>.#
    #.#.#v#######v###.###v#
    #...#.>.#...>.>.#.###.#
    #####v#.#.###v#.#.###.#
    #.....#...#...#.#.#...#
    #.#########.###.#.#.###
    #...###...#...#...#.###
    ###.###.#.###v#####v###
    #...#...#.#.>.>.#.>.###
    #.###.###.#.###.#.#v###
    #.....###...###...#...#
    #####################.#`;

const run = () => {
  const g = ex.split("\n").map((l) => l.trim());
  const gMap = new Map();
  g.forEach((r, ri) => {
    r.split("").forEach((c, ci) => {
      gMap.set(`${ri},${ci}`, c);
    });
  });

  /**
   * I wonder if saying "Ignore the cell you just came from" is enough...
   * There COULD be loops/squares that a path gets caught in... if it doesn't know all the cells within itself... (that it has already seen/visited)..
   * Yeah I guess we want to rule that out... so each path has to remember its entire composition...
   * Each path needs its own memory.... since paths are allowed to overlap with each OTHER...just not with themselves..
   * Maybe if each path's memory is a Set (or map) it's not so bad... But then how to keep track of "last"...
   */

  const start = {
    r: 0,
    c: g[0].indexOf("."),
  };
  const end = {
    r: g.length - 1,
    c: g[g.length - 1].indexOf("."),
  };

  const path = {
    last: `${start.r},${start.c}`,
  };
  const pathMem = new Map();
  pathMem.set(path.last, 1);
  path.memory = pathMem;

  let paths = [path];

  let n = 0;

  while (paths.length > 0) {
    n++;
    // let hitEnd = false;

    const newPaths = [];

    paths.forEach((path) => {
      const node = path.last.split(",").map((x) => parseInt(x));

      console.log(paths.length);

      // Look at all 4 neighbors, filter out any that are included in path.memory
      const ds = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      const nbrs = ds
        .map((d) => {
          return {
            r: node[0] + d[0],
            c: node[1] + d[1],
            val: gMap.get(`${node[0] + d[0]},${node[1] + d[1]}`),
          };
        })
        .filter((x) => x.val !== undefined && x.val !== "#")
        .filter((x) => !path.memory.has(`${x.r},${x.c}`));

      //   console.log("Nbrs", nbrs);

      // I guess oddness of if nbrs is length 1 or not... that is, is this a branch?
      // How we handle path differs.
      // I guess we could just always remove path and then add new path for each nbr.

      nbrs.forEach((nbr) => {
        // If nbr is ".", simply add that to path and set it as new "last".
        // If nbr is an arrow, then skip ahead to next node.
        // -- NOTE: I suppose there could be cases of multiple arrows in a row...
        // But it looks like that's not the case...
        // Huh... seems like example and input both only have ">" and "v" ... not up or left...

        const newPath = { ...path };

        // if (nbr.r === end.r && nbr.c === end.c) {
        //   hitEnd = true;
        // }

        if (nbr.val === ".") {
          newPath.last = `${nbr.r},${nbr.c}`;
          newPath.memory.set(`${nbr.r},${nbr.c}`, 1);
        } else if (nbr.val === ">" && nbr.c === node[1] + 1) {
          newPath.last = `${nbr.r},${nbr.c + 1}`;
          newPath.memory.set(`${nbr.r},${nbr.c}`, 1);
          newPath.memory.set(`${nbr.r},${nbr.c + 1}`, 1);
        } else if (nbr.val === "v" && nbr.r === node[0] + 1) {
          newPath.last = `${nbr.r + 1},${nbr.c}`;
          newPath.memory.set(`${nbr.r},${nbr.c}`, 1);
          newPath.memory.set(`${nbr.r + 1},${nbr.c}`, 1);
        }

        const last = newPath.last.split(",").map((x) => parseInt(x));

        if (last[0] !== end.r || last[1] !== end.c) {
          newPaths.push(newPath);
        } else {
          console.log("Got an end", newPath.memory.size);
        }
      });
    });

    paths = newPaths;

    // console.log("new paths", newPaths);

    // if (n > 14) break;

    // hitEnd = true;
    // if (hitEnd) break;
  }

  // Ahh I see ... big mistake.... We're just checking if char === "v", not if that is BELOW us...

  //   return paths
  //     .sort((a, b) => a.memory.size > b.memory.size)
  //     .map((x) => x.memory.size);
};

console.time("run");
console.log(run());
console.timeEnd("run");
