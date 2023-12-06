const fs = require("fs");
const path = require("path");

const run = () => {
  for (let i = 2; i <= 25; i++) {
    let dayName = i.toString();
    if (dayName.length < 2) dayName = "0" + dayName;
    fs.mkdirSync(path.join(__dirname, "days/" + dayName));
    fs.writeFileSync(`days/${dayName}/input.txt`, "");
    fs.writeFileSync(
      `days/${dayName}/script.js`,
      `const fs = require("fs");
    const input = fs.readFileSync("./days/${dayName}/input.txt", "utf-8");`
    );
  }
};

run();
