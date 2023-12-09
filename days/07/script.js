const fs = require("fs");
const input = fs.readFileSync("./days/07/input.txt", "utf-8");
const exInput = fs.readFileSync("./days/07/ex.txt", "utf-8");

const daySixteen = () => {
  const lines = input.split("\n");

  //   const path = "R2, R200, R2";

  // 2016 day 1 puzzle lol

  const path = `R2, L3, R2, R4, L2, L1, R2, R4, R1, L4, L5, R5, R5, R2, R2, R1, L2, L3, L2, L1, R3, L5, R187, R1, R4, L1, R5, L3, L4, R50, L4, R2, R70, L3, L2, R4, R3, R194, L3, L4, L4, L3, L4, R4, R5, L1, L5, L4, R1, L2, R4, L5, L3, R4, L5, L5, R5, R3, R5, L2, L4, R4, L1, R3, R1, L1, L2, R2, R2, L3, R3, R2, R5, R2, R5, L3, R2, L5, R1, R2, R2, L4, L5, L1, L4, R4, R3, R1, R2, L1, L2, R4, R5, L2, R3, L4, L5, L5, L4, R4, L2, R1, R1, L2, L3, L2, R2, L4, R3, R2, L1, L3, L2, L4, L4, R2, L3, L3, R2, L4, L3, R4, R3, L2, L1, L4, R4, R2, L4, L4, L5, L1, R2, L5, L2, L3, R2, L2`;

  // Huh... 46 and 78 are wrong.... hmm....Oh duh we have many undefineds
  // Finally got it haha
  const pathTest = "R5, L5, R5, R3";

  let pos = {
    x: 0,
    y: 0,
    dir: "N",
  };

  const dirs = ["N", "E", "S", "W"];

  pathTest.split(", ").forEach((x) => {
    const dir = x[0];
    const num = parseInt(x.slice(1));

    if (dir === "R") {
      pos.dir = dirs.concat(dirs)[dirs.indexOf(pos.dir) + 1];
    } else {
      pos.dir = dirs.concat(dirs)[dirs.concat(dirs).lastIndexOf(pos.dir) - 1];
    }

    switch (pos.dir) {
      case "N":
        pos.y += num;
        break;
      case "E":
        pos.x += num;
        break;
      case "S":
        pos.y -= num;
        break;
      case "W":
        pos.x -= num;
        break;
    }

    console.log("New pos", pos.dir, pos.x, pos.y);
  });

  console.log(Math.abs(pos.x) + Math.abs(pos.y));
};

// console.time("run");
// daySixteen();
// console.timeEnd("run");

const getCount = (str) => {
  const count = {};
  for (let char of str.split("")) {
    if (!count[char]) {
      count[char] = 0;
    }
    count[char]++;
  }
  return count;
};

const isPair = (str) => {
  return Object.values(getCount(str)).some((x) => x === 2);
};

const isTwoPair = (str) => {
  return Object.values(getCount(str)).filter((x) => x === 2).length === 2;
};

const isThreeofakind = (str) => {
  return Object.values(getCount(str)).some((x) => x === 3);
};

const isFourofakind = (str) => {
  return Object.values(getCount(str)).some((x) => x === 4);
};

const isFiveofakind = (str) => {
  return Object.values(getCount(str)).some((x) => x === 5);
};

const isFullHouse = (str) => {
  return (
    Object.values(getCount(str)).some((x) => x === 3) &&
    Object.values(getCount(str)).some((x) => x === 2)
  );
};

const getRank = (hand) => {
  if (isFiveofakind(hand)) {
    return 1;
  }
  if (isFourofakind(hand)) {
    return 2;
  }
  if (isFullHouse(hand)) {
    return 3;
  }
  if (isThreeofakind(hand)) {
    return 4;
  }
  if (isTwoPair(hand)) {
    return 5;
  }
  if (isPair(hand)) {
    return 6;
  }
  return 7;
};

/**
 * hmm we have to account for ALL js...
 * can we just iterate through?
 * and eacn time try to make best one.... IGNORING other js???
 *
 */
const getRankWithJokers = (hand, order) => {
  if (!hand.includes("J")) {
    return getRank(hand);
  }

  while (hand.includes("J")) {
    // Remove the first J from the hand...
    const tmp = hand.split("");
    const jIndex = tmp.findIndex((x) => x === "J");
    tmp.splice(jIndex, 1);
    hand = tmp.join("");

    // ...And then find best hand you can, assuming you can create ANY new card..

    let bestRank = Infinity;
    let bestCard = "";
    for (let i = 1; i < order.length; i++) {
      let newHand = hand + order[i];
      const rank = getRank(newHand);
      if (rank < bestRank) {
        bestRank = rank;
        bestCard = order[i];
      }
    }

    hand = hand + bestCard;

    // ============
  }
  //   console.log("done with loop :P", hand);
  return getRank(hand);
};

const partTwo = () => {
  // Almost only thing that changes from part one... aside from getRank vs getRankWithJokers
  const order = "J23456789TQKA";

  let data = input.split("\n").map((x) => x.split(" "));

  data = data.sort((a, b) => {
    const aRank = getRankWithJokers(a[0], order);
    const bRank = getRankWithJokers(b[0], order);

    if (aRank === bRank) {
      //   console.log("Same..");
      let aCopy = a[0];
      let bCopy = b[0];
      while (aCopy.length > 0) {
        const aIdx = order.split("").findIndex((x) => x == aCopy[0]);
        const bIdx = order.split("").findIndex((x) => x == bCopy[0]);

        if (aIdx === bIdx) {
          aCopy = aCopy.split("").slice(1).join("");
          bCopy = bCopy.split("").slice(1).join("");
          continue;
        } else {
          return bIdx - aIdx;
        }
      }
    }

    return aRank - bRank;
  });

  console.log(data.slice(0, 5));
  let total = 0;

  // Ahhh so weird, ex gives 6640, but they say should be 6440....... 200 off????
  // Oooh jeez had to reverse whoops..
  for (let i = data.reverse().length - 1; i >= 0; i--) {
    const [hand, bet] = data[i];
    total += parseInt(bet) * (i + 1);
    console.log(hand, bet, i + 1);
  }

  console.log(total);
};

const partOne = () => {
  const lines = input.split("\n");

  const order = "23456789TJQKA";

  const test = "32T3K";
  //   console.log(test, getCount(test), isPair(test), isThreeofakind(test));

  let data = input.split("\n").map((x) => x.split(" "));

  data = data.sort((a, b) => {
    const aRank = getRank(a[0]);
    const bRank = getRank(b[0]);

    if (aRank === bRank) {
      //   console.log("Same..");
      let aCopy = a[0];
      let bCopy = b[0];
      while (aCopy.length > 0) {
        const aIdx = order.split("").findIndex((x) => x == aCopy[0]);
        const bIdx = order.split("").findIndex((x) => x == bCopy[0]);

        if (aIdx === bIdx) {
          aCopy = aCopy.split("").slice(1).join("");
          bCopy = bCopy.split("").slice(1).join("");
          continue;
        } else {
          return bIdx - aIdx;
        }
      }
    }

    return aRank - bRank;
  });

  console.log(data.slice(0, 5));
  let total = 0;

  // Ahhh so weird, ex gives 6640, but they say should be 6440....... 200 off????
  // Oooh jeez had to reverse whoops..
  for (let i = data.reverse().length - 1; i >= 0; i--) {
    const [hand, bet] = data[i];
    total += parseInt(bet) * (i + 1);
    console.log(hand, bet, i + 1);
  }

  console.log(total);
};

console.time("run");
partTwo();
console.timeEnd("run");
