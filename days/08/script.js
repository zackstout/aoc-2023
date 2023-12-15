const fs = require("fs");
const input = fs.readFileSync("./days/08/input.txt", "utf-8");

const ex = `RL

    AAA = (BBB, CCC)
    BBB = (DDD, EEE)
    CCC = (ZZZ, GGG)
    DDD = (DDD, DDD)
    EEE = (EEE, EEE)
    GGG = (GGG, GGG)
    ZZZ = (ZZZ, ZZZ)`;

const partOne = () => {
  const data = input.split("\n");
  const inst = data[0].split("");
  const rest = data.slice(2).map((x) => x.split(" = ").map((x) => x.trim()));

  rest.forEach((r) => {
    const newarr = [];
    r[1].split(", ").forEach((x, i) => {
      newarr.push(i === 0 ? x.slice(1) : x.slice(0, x.length - 1));
    });
    r[1] = newarr;
  });

  //   console.log(inst, "rest", rest);

  let numSteps = 0;

  let curr = "AAA";

  while (true) {
    const i = inst[numSteps % inst.length];
    const idx = i === "R" ? 1 : 0;
    let nextEl = rest.find((a) => a[0] === curr);
    const next = nextEl[1][idx];
    curr = next;
    numSteps++;
    if (next === "ZZZ") {
      console.log("Done", numSteps);
      break;
    }
  }
};

// partOne();

const exTwo = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

/**
 * Hmm.... looks like the naive while loop isn't going to cut it here...
 *
 * can we go backwards?
 *
 * oh wait.... just track when each one hits a z.......
 *
 * nah, idk haha
 *
 * do we have to track cycles and shit?
 */

const chunk = (str, size) => {
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
};

const findIntervalAtWhichNodeHitsZ = (node, inst, memo) => {
  let numSteps = 0;

  let hit = -1;

  while (true) {
    const i = inst[numSteps % inst.length];
    const idx = i === "R" ? 1 : 0;

    const nextEl = memo.get(node);
    const next = nextEl[idx];
    // console.log(node, nextEl);

    if (next[2] === "Z") {
      if (hit > 0) {
        console.log("Got second hit", numSteps);
        return { start: hit, length: numSteps - hit };
      } else {
        hit = numSteps;
      }
      //   console.log("Got a Z hit", numSteps - hit);

      //   hit = numSteps - hit;
    }

    node = next;
    numSteps++;

    if (numSteps > 100000) return -1;
  }
};

function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

const lcm = (a, b) => {
  //   let min = Math.max(a, b);
  //   while (true) {
  //     if (min % a == 0 && min % b == 0) {
  //       return min;
  //     }
  //     min++;
  //   }
  return (a * b) / gcd(a, b);
};

// WOOOOOOOW, 12030780859469 IS THE RIGHT ANSWER????

// Lol, gcd is the mvp here. Much more efficient lcm calculation, hell yeah.

// I'm still confused with the intervals always work..... seems like you would need to ALSO be a common multiple of the length of LR string...
// which I don't think they are......

const partTwo = () => {
  const data = input.split("\n");
  const inst = data[0].split("");
  const rest = data.slice(2).map((x) => x.split(" = ").map((x) => x.trim()));

  rest.forEach((r) => {
    const newarr = [];
    r[1].split(", ").forEach((x, i) => {
      newarr.push(i === 0 ? x.slice(1) : x.slice(0, x.length - 1));
    });
    r[1] = newarr;
  });

  //   const numWithSameOutputs = rest.filter((x) => x[1][1] === x[1][0]).length;
  //   const numTerminalPoints = rest.filter(
  //     (x) => x[1][1] === x[1][0] && x[1][1] === x[0]
  //   ).length;

  // Key is name of el ("AAA"), value is array of left/right options (["BBB", "ZZZ"])
  const memo = new Map();

  rest.forEach((el) => {
    memo.set(el[0], el[1]);
  });

  const startingNodes = rest.filter((r) => r[0][2] === "A").map((x) => x[0]);
  console.log(startingNodes.length);
  //   let node = startingNodes[0];

  const intervals = startingNodes
    .map((n) => {
      return findIntervalAtWhichNodeHitsZ(n, inst, memo);
    })
    .map((x) => x.length);

  console.log(intervals);

  const arr = [2, 3, 4];
  console.log(intervals.reduce((acc, val) => lcm(acc, val), 1));
  //   startingNodes.forEach((n, idx) => {
  //     if (idx !== 3) return;
  //     const x = findIntervalAtWhichNodeHitsZ(n, inst, memo);
  //     // console.log("x", x);
  //   });

  //   let numSteps = 0;

  //   while (true) {
  //     const i = inst[numSteps % inst.length];
  //     const idx = i === "R" ? 1 : 0;

  //     const nextEl = memo.get(node);
  //     const next = nextEl[idx];
  //     // console.log(node, nextEl);

  //     if (next[2] === "Z") {
  //       console.log("Got a Z hit", numSteps - hit);

  //       //   hit = numSteps - hit;
  //     }

  //     node = next;
  //     numSteps++;

  //     if (numSteps > 50000) break;
  //   }

  //   console.log(
  //     inst.length,
  //     rest.slice(0, 5),
  //     numWithSameOutputs,
  //     numTerminalPoints,
  //     rest.length
  //   );

  //   console.log(chunk("abcdefghijklmnop", 3));

  //   let numSteps = 0;

  //   let nodesWeCareAbout = rest.filter((r) => r[0][2] === "A").map((x) => x[0]);

  //   console.log(nodesWeCareAbout);

  //   // Key is name of el ("AAA"), value is array of left/right options (["BBB", "ZZZ"])
  //   const memo = new Map();

  //   rest.forEach((el) => {
  //     memo.set(el[0], el[1]);
  //   });

  //   //   return console.log(rest.filter((r) => r[0][2] === "C").length);

  //   // let positions =

  //   const hasHitZ = [...new Array(nodesWeCareAbout.length).map((x) => 0)];

  //   while (true) {
  //     const i = inst[numSteps % inst.length];
  //     const idx = i === "R" ? 1 : 0;

  //     const nextNodes = [];

  //     nodesWeCareAbout.forEach((node, nodeIdx) => {
  //       //   let nextEl = rest.find((a) => a[0] === node);
  //       const nextEl = memo.get(node);
  //       const next = nextEl[idx];
  //       nextNodes.push(next);
  //       if (next[2] === "Z") {
  //         hasHitZ[nodeIdx] = numSteps;
  //         // console.log("Got a hit...!", hasHitZ);
  //       }
  //       //   curr = next;
  //     });

  //     nodesWeCareAbout = nextNodes;

  //     numSteps++;

  //     if (numSteps % 10000000 === 0) {
  //       console.log(nodesWeCareAbout.length, nodesWeCareAbout.slice(0, 3));
  //     }

  //     // console.log("rest", rest);
  //     // break;

  //     if (nextNodes.every((n) => n[2] === "Z")) {
  //       console.log("We are done", numSteps);
  //       break;
  //     }

  //     // if (hasHitZ.every((x) => x > 0)) {
  //     //   console.log("first every", hasHitZ, numSteps);
  //     //   break;
  //     // }
  //   }
};

console.time("run");
partTwo();
console.timeEnd("run");
