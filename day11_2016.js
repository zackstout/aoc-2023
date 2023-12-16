const input = {
  1: ["PG", "PM"], // "P" for promethium
  2: ["CG", "UG", "RG", "LG"], // "C" for cobalt, "U" for curium, "R" for ruthenium, "L" for plutonium
  3: ["CM", "UM", "RM", "LM"],
  4: [],
};

const ex = {
  1: ["HM", "LM"],
  2: ["HG"],
  3: ["LG"],
  4: [],
};

// Eh.... nvm... was going to store keyed by item instead, but by floor seems fine...
// Nah let's do by item
const getConfig = (map) => {
  const result = {
    ME: 1,
  };
  Object.entries(map).forEach(([key, value]) => {
    value.forEach((el) => {
      result[el] = parseInt(key);
    });
  });

  return result;
};

// A "move" consists of a target floor, and an array of items you are bringing.

const getValidTargetFloors = (config) => {
  switch (config.ME) {
    case 1:
      return [2];
    case 2:
      return [1, 3];
    case 3:
      return [2, 4];
    case 4:
      return [3];
  }
};

const getAllPairs = (arr) => {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
};

// Ok... the only actually dangerous situation is when you have both an unpaired chip, and an unpaired generator....
// No: An unpaired chip cannot interact with any generator. That's it right??? Yes I think so.
const canCarryItemsetToFloorContainingItems = (itemset, items) => {
  const all = items.concat(itemset);
  const generators = all.filter((i) => i[1] === "G");
  const microchips = all.filter((i) => i[1] === "M");
  //   const unpairedGenerators = generators.filter(
  //     (g) => !all.some((x) => x[1] === "M" && x[0] === g[0])
  //   );
  const unpairedChips = microchips.filter(
    (m) => !all.some((x) => x[1] === "G" && x[0] === m[0])
  );
  return unpairedChips.length === 0 || generators.length === 0;

  //   console.log(
  //     "can carry",
  //     itemset,
  //     "onto floor with",
  //     items,
  //     "generators",
  //     generators,
  //     dangerousChips.length,
  //     dangerousGenerators.length,
  //     itemset.concat(items)
  //   );

  //   return dangerousGenerators.length === 0 && dangerousChips.length === 0;

  //   return itemset.filter((x) => {
  //     const isMicrochip = x[1] === "M";
  //     if (isMicrochip) {
  //       // If item is microchip (second char is "M"), we cannot take it if items includes a foreign Generator
  //       // (That is, the ONLY generators among the items match with us)
  //       // Ah no, this is wrong, this is ntot the requirement.
  //       // We CAN take foreign chips, so long as each generator is neutralized.....
  //       return dangerousGenerators.length === 0;
  //     } else {
  //       // If item is generator (second char is "G"), we cannot take if if items includes a foreign Microchip
  //       return items.map((i) => i[1] === "M").every((m) => m[0] === x[0]);
  //     }
  //   });
};

const getValidMoves = (config) => {
  const targetFloors = getValidTargetFloors(config);
  const moves = [];
  const srcFloor = config.ME;
  const availableItems = Object.keys(config).filter(
    (k) => k !== "ME" && config[k] === srcFloor
  );
  const possibleItemSets = availableItems
    .map((x) => [x])
    .concat(getAllPairs(availableItems));
  //   console.log(targetFloors, availableItems, possibleItemSets);

  targetFloors.forEach((flr) => {
    const itemsOnFloor = Object.keys(config).filter((k) => config[k] === flr);
    // console.log("items on floor", itemsOnFloor, flr);

    possibleItemSets.forEach((set) => {
      // Determine whether we are allowed to carry the itemset to the target floor
      if (canCarryItemsetToFloorContainingItems(set, itemsOnFloor)) {
        moves.push({
          target: flr,
          itemset: set,
        });
      }
    });
  });

  const logNum = (num) => {
    // console.log("log...", num, config);
    return `${Object.entries(config)
      .filter(([k, v]) => v === num)
      .map((e) => e[0])
      .join(", ")}`;
  };

  //   console.log(
  //     `
  //   ========================================
  //   4: ${logNum(4)}
  //   3: ${logNum(3)}
  //   2: ${logNum(2)}
  //   1: ${logNum(1)}

  //   Valid moves: ${moves.map((x) => `${JSON.stringify(x)}`)}
  //   ========================================
  //   `
  // moves
  //   );

  return moves;
};

const seenConfigs = new Set();

// Take a move and a config, apply the move and return a new config
const makeMove = (move, config) => {
  const r = { ...config };

  const { target, itemset } = move;
  itemset.forEach((item) => {
    r[item] = target;
  });
  r["ME"] = target;
  return r;
};

/**
 * Recursive driver function.
 * Takes in a config (where every item including ME is at the time),
 * and spits back number of steps in fastest path to end goal.
 * Computes all valid moves available from current config, and recurses.
 */
let steps = 0;

const memo = new Map();

const findMinimumNumStepsToReachEnd = (config, sum) => {
  const configStr = JSON.stringify(config);

  if (memo.has(configStr)) {
    return memo.get(configStr);
  }
  // We are done!
  if (Object.values(config).every((v) => v === 4)) {
    console.log("Wow", config);
    return 1;
  }

  //   console.log("find min...", config);
  seenConfigs.add(configStr);

  steps++;

  //   if (steps > 8) return;

  const validMoves = getValidMoves(config);

  let newConfigs = validMoves.map((x) => makeMove(x, config));
  //   console.log("call find", validMoves);

  newConfigs = newConfigs.filter((c) => !seenConfigs.has(JSON.stringify(c)));

  //   newConfigs.forEach((c) => {
  //     seenConfigs.add(JSON.stringify(c));
  //   });

  const result = Math.min(
    ...newConfigs.map((c) => findMinimumNumStepsToReachEnd(c, sum))
  );

  memo.set(configStr, result);

  return 1 + result;
};

// const run = () => {
//   const start = getConfig(input);

//   const secondConfig = makeMove(getValidMoves(start)[0], start);
//   //   return getValidMoves(secondConfig);
//   //   return getValidMoves(start);
//   console.log("running...", start);

//   return findMinimumNumStepsToReachEnd(start, 0);
// };

/**
 * Ok.... appears as if I'm just carrying one item up and down, back and forth....
 *
 * But if we disallow that entirely.... we get Infinity...
 *
 * I wonder if there are times you DO need to allow it....
 *
 * Ah maybe it's just another bug in the "canWeCarryItemset" function.....
 *
 * Ugh you're joking, now we get 91??? Now 161?? Now 113?!!?
 */

/**
 *
 * Ohoho I bet we can BFS.
 *
 * At each step...
 *
 * 1. Look at your frontier and choose the closest (to origin) item as new tip.
 * 2. Look at tip and all its valid moves (into other states/neighbors).
 * Add all those neighbors that are NOT visited already to frontier.
 * (And store the distance for each.)
 * 3. Set tip to visited.
 */

const bfs = () => {
  const start = getConfig(input);

  // Keys are stringified configurations of states, values are distances from origin
  const frontier = {};
  const visited = {};
  frontier[JSON.stringify(start)] = 0;

  while (true) {
    // Find a new tip from frontier minus visited.
    // const frontierMinusVisited = { ...frontier };
    // Object.keys(visited).forEach((key) => {
    //   delete frontierMinusVisited[key];
    // });
    const minDistance = Math.min(...Object.values(frontier));
    let tipConfig = Object.entries(frontier).find(
      (e) => e[1] === minDistance
    )?.[0];
    if (!tipConfig) {
      return frontierMinusVisited, visited, frontier;
    }
    tipConfig = JSON.parse(tipConfig);

    if (Object.values(tipConfig).every((v) => v === 4)) {
      return minDistance;
    }

    // Find all moves from tip to states that we have not yet visited.
    // Add each of those new states to the frontier.
    getValidMoves(tipConfig).forEach((m) => {
      const newConfig = makeMove(m, tipConfig);
      if (Object.keys(visited).includes(JSON.stringify(newConfig))) {
        return;
      }
      frontier[JSON.stringify(newConfig)] = minDistance + 1;
    });

    // Add current tip to visited.
    visited[JSON.stringify(tipConfig)] = true;
    delete frontier[JSON.stringify(tipConfig)];

    // return { minDistance, tipConfig, frontier };
  }

  //

  return start;
};

// Well.... now it works on example.... but runs for way too long on real input....
// Good lord takes about 1s on exmaple...
console.time("run");
console.log("RUN", bfs());
console.log(steps);
console.timeEnd("run");
