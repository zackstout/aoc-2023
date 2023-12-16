import { readFileSync } from "fs";
const input = readFileSync("./days/15/input.txt", "utf-8");

const getHash = (str) => {
  let v = 0;
  let i = 0;
  while (i < str.length) {
    const c = str.charCodeAt(i);
    // console.log(c);
    v += c;
    v *= 17;
    v %= 256;
    i++;
  }
  return v;
};

const run = () => {
  //   return getHash("HASH");
  //   return getHash("rn=1");
  return input.split(",").reduce((sum, val) => sum + getHash(val), 0);
};

const partTwo = () => {
  const map = new Map();
  for (let i = 0; i <= 256; i++) {
    map.set(i, []);
  }
  //   console.log(map);

  const ex = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";

  //   return getHash("rn=1");

  ex.split(",").forEach((instruction, idx) => {
    const opIdx = instruction.split("").findIndex((x) => x.match(/[-=]/));
    // const label = instruction.split(/[-=]/)[0]; // this works fine

    // The label of the lens on which in the instruction operates
    const label = instruction.slice(0, opIdx);
    const op = instruction[opIdx];
    // Only relevant when op is "=" ("-" is unary)
    const val = parseInt(instruction.slice(opIdx + 1));
    const boxNumber = getHash(label);
    // if (idx > 5) return;
    // console.log(opIdx, val, op, label, boxNumber);
    const box = map.get(boxNumber);

    // console.log("===============");
    // console.log(instruction, "label", label, "box", box);

    if (op === "=") {
      const newLabel = `${label} ${val}`;
      const idx = box.findIndex((x) => x.split(" ")[0] === label);
      if (idx > -1) {
        box.splice(idx, 1, newLabel);
      } else {
        box.push(newLabel);
      }
    } else if (op === "-") {
      // Remove lens with our label from our box
      const idx = box.findIndex((x) => x.split(" ")[0] === label); // not sure about "includes" ... Seems like there can only be one??
      //   console.log("removal index", idx);
      if (idx > -1) {
        box.splice(idx, 1);
      }
    }
    // console.log("box after", box);
  });

  //   return [...map.values()].filter((x) => x.length > 0).slice(0, 5);
  return [...map.keys()].reduce((sum, key) => {
    const val = map.get(key).reduce((boxSum, lens, lensIdx) => {
      let [label, n] = lens.split(" ");
      n = parseInt(n);
      //   const boxNum = getHash(label);
      const boxNum = key;
      const v = (1 + boxNum) * (lensIdx + 1) * n;
      return boxSum + v;
    }, 0);
    return sum + val;
  }, 0);
};

// Hmm.... 278999 is too low.....
// Ah nice, it was issue with "includes" -- I bet there were labels that belonged to other labels, like "pb" and "apbcd"
console.time("run");
console.log("Part two", partTwo());
console.timeEnd("run");
