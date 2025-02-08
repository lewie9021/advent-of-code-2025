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

const getLastChunk = (diskMap: Array<number>, lastId = Infinity) => {
  let chunk: Array<number> = [];
  let index = -1;

  for (let i = diskMap.length - 1; i >= 0; i -= 1) {
    const value = diskMap[i];

    if (chunk.length && value !== chunk[0]) {
      break;
    }

    if (value < lastId) {
      index = i;
      chunk.push(value);
    }
  }

  return {
    index,
    value: chunk,
    size: chunk.length,
  };
}

const findEmptySpace = (diskMap: Array<number>, size: number) => {
  for (let i = 0; i < diskMap.length; i += 1) {
    const value = diskMap[i];

    if (!isNaN(value)) {
      continue;
    }

    if (diskMap.slice(i, i + size).every(isNaN)) {
      return i;
    }
  }

  return -1;
}

const compactDiskMapV2 = (diskMap: Array<number>) => {
  let lastId = Infinity;
  let nextDiskMap = cloneDeep(diskMap);

  while (lastId > 0) {
    const lastChunk = getLastChunk(nextDiskMap, lastId);
    const emptySpaceIndex = findEmptySpace(nextDiskMap, lastChunk.size);

    lastId = lastChunk.value[0];

    if (emptySpaceIndex === -1 || emptySpaceIndex > lastChunk.index) {
      continue;
    }

    for (let i = 0; i < lastChunk.size; i += 1) {
      nextDiskMap[emptySpaceIndex + i] = lastChunk.value[i];
      nextDiskMap[lastChunk.index + i] = NaN;
    }
  }

  return nextDiskMap;
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
  const diskMap = parseInput();

  return calculateChecksum(compactDiskMapV2(explodeDiskMap(diskMap)));
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());