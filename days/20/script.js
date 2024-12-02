import { readFileSync } from "fs";
const input = readFileSync("./days/20/input.txt", "utf-8");

// ** FLIP-FLOP **
// initially off/low;
// ignore high;
// if receive low, toggle and send.

// ** CONJUNCTION**
// remember inputs (initially off);
// if all inputs are HIGH, send low;
// otherwise send HIGH

// So must find all inputs to these up front.

// So to process in order... could unshift tasks from front, push new tasks onto end?

const testInput = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const testInputTwo = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

const parseRules = (str) => {
  const lines = str.split("\n").map((l) => l.trim().split(" -> "));
  const rules = {};

  lines.forEach((line) => {
    let [label, outputs] = line;
    let type = "broadcaster";

    if (label.charAt(0) === "%") {
      type = "flipFlop";
      label = label.slice(1);
    }
    if (label.charAt(0) === "&") {
      type = "conjunction";
      label = label.slice(1);
    }

    rules[label] = {
      type,
      outputs: outputs.split(", "),
    };
  });

  // Find inputs for each conjunction
  Object.entries(rules).forEach(([key, v]) => {
    if (v.type === "conjunction") {
      v.inputs = {};
      Object.entries(rules).forEach(([key2, v2]) => {
        if (v2.outputs.includes(key)) {
          v.inputs[key2] = 0;
        }
      });
    }
  });
  return rules;
};

const rules = {
  broadcaster: {
    type: "broadcaster",
    outputs: ["a", "b", "c"],
  },
  a: {
    type: "flipFlop",
    outputs: ["b"],
    value: 0, // flipFlops initialize to 0
  },
  b: {
    type: "flipFlop",
    outputs: ["c"],
    value: 0,
  },
  c: {
    type: "flipFlop",
    outputs: ["inv"],
    value: 0,
  },
  inv: {
    type: "conjunction",
    outputs: ["a"],
    // Need to find these
    inputs: {
      c: 0, // Initialize each input to 0
    },
  },
};

const rulesTwo = {
  broadcaster: {
    type: "broadcaster",
    outputs: ["a"],
  },
  a: {
    type: "flipFlop",
    outputs: ["inv", "con"],
  },
  inv: {
    type: "conjunction",
    outputs: ["b"],
    inputs: {
      a: 0,
    },
  },
  b: {
    type: "flipFlop",
    outputs: ["con"],
  },
  con: {
    type: "conjunction",
    outputs: ["output"],
    inputs: {
      a: 0,
      b: 0,
    },
  },
};

// Change example input here
const rulesObject = parseRules(input);

let lowTotal = 0;
let highTotal = 0;

let isDone = false;

const processRule = ({ ruleLabel, value, src }) => {
  const rule = rulesObject[ruleLabel];
  let nextRules = [];

  //   console.log("process rule", ruleLabel, value, src);

  if (value === 0) lowTotal++;
  if (value === 1) highTotal++;

  if (value === 0 && ruleLabel === "rx") {
    console.log("DONE!!!!");
    isDone = true;
    return [];
  }

  if (!rule) return [];

  let v = 0;

  if (rule.type === "broadcaster") {
    // Do nothing, value is already set to LOW/0
  } else if (rule.type === "flipFlop") {
    if (value === 1) {
      return [];
    }
    rule.value = rule.value === 1 ? 0 : 1;
    v = rule.value;
  } else if (rule.type === "conjunction") {
    if (rule.inputs.hasOwnProperty(src)) {
      rule.inputs[src] = value;
    }
    v = 1;
    // console.log("process conjunction", rule.inputs);
    if (Object.values(rule.inputs).every((v) => v === 1)) {
      v = 0;
    }
  }

  nextRules = rule.outputs.map((label) => {
    return { ruleLabel: label, value: v, src: ruleLabel };
  });

  //   console.log("next", nextRules);

  return nextRules;
};

/**
 * The first rule to process is always broadcaster sending a LOW signal (to each of its outputs).
 * Then the next list of rules to process, is all of those targets.
 */

/**
 * Ah shoot, second example makes this not quite work....
 * Oh nvm, it seems to work well.
 */
const run = () => {
  const pushButton = () => {
    let rulesList = [{ ruleLabel: "broadcaster" }];

    while (rulesList.length > 0) {
      const rule = rulesList.shift();
      rulesList = [...rulesList, ...processRule(rule)];
      // console.log("list", rulesList);
    }
    return true;
  };

  /**
   * So how do we detect cycles? We see if all modules are in original state...
   * So flipFlops are turned off... and conjunctions' "input" dictionaries have all 0 values...
   *
   *
   */

  let times = 0;

  while (true) {
    pushButton();
    // Ah yes add another low signal for every time we restart
    lowTotal++;
    times++;
    // console.log("========");

    if (isDone) {
      console.log(times);
      break;
    }

    // PART ONE -- WORKING
    // const backAtOriginalState = Object.values(rulesObject).every((entry) => {
    //   if (entry.type === "flipFlip") {
    //     return entry.value === 0;
    //   }
    //   if (entry.type === "conjunction") {
    //     return Object.values(entry.inputs).every((x) => x === 0);
    //   }
    //   return true;
    // });

    // // Ooooh funny the real input didn't have a cycle hahaha
    // if (backAtOriginalState || times === 1000) {
    //   console.log(rulesObject);
    //   return {
    //     times,
    //     lowTotal: lowTotal * (1000 / times),
    //     highTotal: highTotal * (1000 / times),
    //   };
    // }
  }

  //   pushButton();

  //   console.log("===========");

  //   pushButton();

  //   console.log(rulesObject);

  // OOOOOh wow, ok, We have both example inputs working....

  // Now I think it's just a matter of parse...
};

console.time("run");

const r = run();
console.log(r.lowTotal * r.highTotal);

// console.log(parseRules(testInputTwo));
console.timeEnd("run");
