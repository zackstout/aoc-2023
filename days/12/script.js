import { readFileSync } from "fs";
const input = readFileSync("./days/12/input.txt", "utf-8");

// Woof, first time we had to do recursion... not terrible!

// Takes string like "#.#.###", returns "[1, 1, 3]"
const getGroups = (str) => {
  let num = 0;
  const result = [];
  for (const char of str) {
    // console.log(char);
    if (char === "#") {
      num++;
    } else {
      if (num > 0) result.push(num);
      num = 0;
    }
  }
  if (num > 0) {
    result.push(num);
  }
  return result;
};

const x = getGroups("#.#.###");
const y = getGroups(".#.###.#.######");
// console.log(x, y);

// Takes a str like "???.###"
const getNumWays = (str, target) => {
  const idx = str.indexOf("?");

  let total = 0;

  //   let result = [];
  //   console.log("get num ways", str, idx);
  if (idx > -1) {
    const str1 = str.slice(0, idx) + "." + str.slice(idx + 1);
    const str2 = str.slice(0, idx) + "#" + str.slice(idx + 1);
    // result.push [...getNumWays(str1), ...getNumWays(str2)];

    total += getNumWays(str1, target);
    total += getNumWays(str2, target);
  } else {
    const gps = getGroups(str).toString();
    // console.log("gps", gps, gps == "1,1,3", target, gps == target);
    if (gps == target) {
      total++;
    }
  }

  return total;
};

const ex = "???.###";

const ex2 = "?#?#?#?#?#?#?#?";

const run = () => {
  //   console.log("num", getNumWays(ex, "1,1,3"));
  let total = 0;

  input.split("\n").forEach((line, idx) => {
    // if (idx < 5) {
    //   console.log(line.split(" "));

    // }
    if (idx % 20 === 0) {
      console.log(idx);
    }
    const [val, nums] = line.split(" ");
    total += getNumWays(val, nums);
  });

  console.log("Total", total);
};

console.time("run");
run();
console.timeEnd("run");
