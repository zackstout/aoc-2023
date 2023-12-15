// const d = require("./utils");

// OOOOOOmg we finally got it working!!!!
import d from "./utils";
const { getIntersection } = d;

describe("getIntersection", () => {
  test("it computes easiest case correctly", () => {
    expect(getIntersection([1, 3], [2, 8])).toEqual([2, 3]);
  });

  test("it computes exact edge overlap correctly", () => {
    expect(getIntersection([1, 3], [3, 8])).toEqual([3, 3]);
  });
});
