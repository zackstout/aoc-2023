// ============================
// ARRAYS
// ============================

const areSameArrayStart = (a1, a2) => {
  const len = Math.min(a1.length, a2.length);

  for (let i = 0; i < len; i++) {
    if (a1[i] !== a2[i]) return false;
  }

  return true;
};

const getIntersection = (a1, a2) => {
  const maxLeft = Math.max(a1[0], a2[0]);
  const minRight = Math.min(a1[1], a2[1]);
  if (maxLeft > minRight) {
    return null;
  }
  return [maxLeft, minRight];
};

// For inputs [1, 3], [[2,4], [5,6]], expected response is [1,2]
// Assume that each of nonOverlappingArrs is guaranteed to overlap a1
// Arrays are INCLUSIVE of both endpoints
const getDifference = (a1, nonOverlappingArrs) => {
  if (nonOverlappingArrs.length === 0) return [a1];
  const result = [];
  const sortedArrs = nonOverlappingArrs.sort((a, b) => a[0] - b[0]);

  //   console.log(a1, sortedArrs);

  // Need +1 and -1 because ranges are INCLUSIVE
  for (let i = 0; i < sortedArrs.length - 1; i++) {
    result.push([sortedArrs[i][1] + 1, sortedArrs[i + 1][0] - 1]);
  }

  if (sortedArrs[0][0] > a1[0]) {
    result.push([a1[0], sortedArrs[0][0]]);
  }

  if (sortedArrs.at(-1)[1] < a1[1]) {
    result.push([sortedArrs.at(-1)[1], a1[1]]);
  }

  return result.filter((x) => x[1] >= x[0]);
};

const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

// ============================
// STRINGS
// ============================

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

// ============================
// MATHS
// ============================

const gcd = (a, b) => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

const lcm = (a, b) => {
  return (a * b) / gcd(a, b);
};

// ============================
// MAPS
// ============================

const dupeMap = (m) => {
  const r = new Map();
  [...m.keys()].forEach((key) => {
    r.set(key, m.get(key));
  });
  return r;
};

const getGridMap = (gridText) => {
  const m = new Map();
  const lines = gridText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      m.set(`${i},${j}`, line[j]);
    }
  }
  return {
    map: m,
    rows: lines.length,
    cols: lines[0].length,
  };
};

const getRow = (gridInfo, r) => {
  return [...gridInfo.map.keys()]
    .filter((k) => k.split(",")[0] == r)
    .map((k) => gridInfo.map.get(k));
};

const getCol = (gridInfo, c) => {
  return [...gridInfo.map.keys()]
    .filter((k) => k.split(",")[1] == c)
    .map((k) => gridInfo.map.get(k));
};

// ============================
// EXPORT
// ============================

export default {
  // Maps
  getRow,
  getCol,
  getGridMap,
  dupeMap,
  // Maths
  lcm,
  // Strings
  getCount,
  // Arrays
  arraysEqual,
  areSameArrayStart,
  chunk,
  getIntersection,
  getDifference,
};
