import * as fs from "fs";
import * as path from "path";
import cloneDeep from "lodash/cloneDeep.js";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split("")
    .map((x) => parseInt(x));
};

const repeat = <T>(x: T, times: number) => {
  const result: Array<T> = [];

  for (let i = 0; i < times; i += 1) {
    result.push(x);
  }

  return result;
};

const explodeDiskMap = (diskMap: Array<number>) => {
  let result: Array<number> = [];
  let id = 0;

  for (let i = 0; i < diskMap.length; i += 1) {
    const block = diskMap[i];

    if (i % 2 === 0) {
      result.push(...repeat(id, block));
      id += 1;

      continue;
    }

    result.push(...repeat(NaN, block));
  }

  return result;
};

const compactDiskMap = (diskMap: Array<number>) => {
  let result: Array<number> = cloneDeep(diskMap);
  let lastEmptyIndex = diskMap.length - 1;

  for (let i = 0; i < lastEmptyIndex; i += 1) {
    const blockL = result[i];

    if (!isNaN(blockL)) {
      continue;
    }

    // Find file block to fill empty space.
    for (let j = lastEmptyIndex; j >= i; j -= 1) {
      const blockR = result[j];

      if (isNaN(blockR)) {
        continue;
      }

      if (!isNaN(blockR)) {
        result[i] = blockR;
        result[j] = NaN;
        lastEmptyIndex = j - 1;
        break;
      }
    }
  }

  return result;
};

const calculateChecksum = (diskMap: Array<number>) => {
  return diskMap.reduce((res, x, i) => {
    if (isNaN(x)) {
      return res;
    }

    return res + (i * x);
  }, 0);
};

const calculatePartOne = () => {
  const diskMap = parseInput();

  return calculateChecksum(compactDiskMap(explodeDiskMap(diskMap)));
};

const calculatePartTwo = () => {
  return null;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());