import { readFileSync } from "fs";
const input = readFileSync("./days/24/input.txt", "utf-8");

const ex = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

const findLineEquation = (px, py, vx, vy) => {
  const numXIntervalsAway = px / vx;
  const b = py + -1 * vy * numXIntervalsAway;
  return { m: vy / vx, b };
};

const findIntersection = (l1, l2) => {
  const { m: m1, b: b1 } = l1;
  const { m: m2, b: b2 } = l2;
  const x = (b2 - b1) / (m1 - m2);
  return { x: x, y: m1 * x + b1 };
};

// Yes! This works!!
const isWithinFuture = (line, pt) => {
  const px = line.p[0];
  const py = line.p[1];
  const vx = line.v[0];
  const vy = line.v[1];

  const isXPositive = pt.x - px > 0;
  const isXChangePositive = vx > 0;
  const isInXFuture =
    (isXPositive && isXChangePositive) || (!isXPositive && !isXChangePositive);

  const isYPositive = pt.y - py > 0;
  const isYChangePositive = vy > 0;
  const isInYFuture =
    (isYPositive && isYChangePositive) || (!isYPositive && !isYChangePositive);

  return isInXFuture && isInYFuture;
};

const intersectionPointIsWithinBoundsAndFuture = (l1, l2, b1, b2) => {
  const line1 = findLineEquation(l1.p[0], l1.p[1], l1.v[0], l1.v[1]);
  const line2 = findLineEquation(l2.p[0], l2.p[1], l2.v[0], l2.v[1]);
  const intersection = findIntersection(line1, line2);

  const isWithinBounds =
    intersection.x >= b1 &&
    intersection.x <= b2 &&
    intersection.y >= b1 &&
    intersection.y <= b2;

  // return intersection is within bounds, and is in future for both lines
  // future just means, intersection point is in same direction from starting point as velocity. for both x and y.

  //   console.log("intersection...", intersection, isWithinBounds, b1, b2);
  return (
    isWithinBounds &&
    isWithinFuture(l1, intersection) &&
    isWithinFuture(l2, intersection)
  );
};

const run = () => {
  const lines = input.split("\n").map((line) => {
    const [ps, vs] = line.split(" @ ");
    return {
      p: ps.split(", ").map((x) => parseInt(x)),
      v: vs.split(", ").map((x) => parseInt(x)),
    };
  });

  let count = 0;

  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      // TESTING
      //   if (intersectionPointIsWithinBoundsAndFuture(lines[i], lines[j], 7, 27)) {
      //     count++;
      //   }

      if (
        intersectionPointIsWithinBoundsAndFuture(
          lines[i],
          lines[j],
          200000000000000,
          400000000000000
        )
      ) {
        count++;
      }
    }
  }

  return count;

  //   return lines;

  const l1 = findLineEquation(5, 4, -3, -1);
  const l2 = findLineEquation(-5, 4, 3, -1);
  return findIntersection(l1, l2);
};

console.time("run");
console.log(run());
console.timeEnd("run");
