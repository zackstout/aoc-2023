const fs = require("fs");

// Annoying... have to write full path if you run script from root of project..
const input = fs.readFileSync("./days/01/input.txt", "utf-8");

/**
 * Find the first and last digit expressed in each line.
 * For part two, digits can be written in text.
 * Tricky part is capturing final digit correctly (cases such as "twone").
 */
const parse = (txt) => {
  const lines = txt.split("\n");
  const nums = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  // Wait wtf, "sixteen"??? nvm...

  // const txt2 = `two1nine
  // eightwothree
  // abcone2threexyz
  // xtwone3four
  // 4nineeightseven2
  // zoneight234
  // 7pqrstsixteen`;

  return lines.reduce((sum, line, idx) => {
    // For part one, you could just mtach "/\d/g"
    const digits = line
      .match(/(\d|one|two|three|four|five|six|seven|eight|nine)/g)
      .map((x) => {
        return isNaN(x) ? nums.indexOf(x) + 1 : parseInt(x);
      });
    // console.log(idx);

    // Huh.... we needed to do this, rather than take the last element of the match array..... odd......
    // I bet it was a case of ending in like "twone"... which SHOULD count as "one", but which we would have counted as "two"...
    const re = /.*(\d|one|two|three|four|five|six|seven|eight|nine)/;
    const last = line.match(re)[1];
    const lastReal = isNaN(last) ? nums.indexOf(last) + 1 : parseInt(last);

    // if (idx > 998) {
    //   console.log(
    //     digits,
    //     line,
    //     digits[0] * 10 + digits.at(-1),
    //     line.match(new RegExp(".*(" + re + ")"))
    //   );
    // }
    // const unit = digits[digits.length - 1];
    return sum + digits[0] * 10 + lastReal;
  }, 0);
};

console.log(parse(input));
