import type { Tuple } from "../helpers/tuple";

import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split("\n")
    .map((line) => line.split(""));
};

const getLocationsByAntenna = (grid: Array<Array<string>>) => {
  let result: Record<string, Array<Tuple<number>>> = {};

  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const cell = grid[y][x];

      if (cell === ".") {
        continue;
      }

      if (!result[cell]) {
        result[cell] = [];
      }

      result[cell].push([y, x]);
    }
  }

  return result;
}

const getAntennaCombinations = (locations: Array<Tuple<number>>) => {
  let result: Array<Tuple<Tuple<number>>> = [];

  for (let i = 0; i < locations.length; i += 1) {
    const a = locations[i];

    for (let j = i + 1; j < locations.length; j += 1) {
      const b = locations[j];

      result.push([a, b]);
    }
  }

  return result;
};

const getAntinodeLocations = (grid: Array<Array<string>>, combination: Tuple<Tuple<number>>) => {
  const [[aY, aX], [bY, bX]] = combination;
  const diffY = aY - bY;
  const diffX = aX - bX;
  const locations: Array<Tuple<number>> = [
    [aY + diffY, aX + diffX],
    [bY - diffY, bX - diffX],
  ];

  return locations
    .filter(([x, y]) => y >= 0 && x >= 0 && y < grid.length && x < grid[y].length);
};

const calculatePartOne = () => {
  const grid = parseInput();
  const locationsByAntenna = getLocationsByAntenna(grid);
  let result: Array<Tuple<number>> = [];

  for (const key in locationsByAntenna) {
    const locations = locationsByAntenna[key];
    const combinations = getAntennaCombinations(locations);

    for (let i = 0; i < combinations.length; i += 1) {
      result.push(...getAntinodeLocations(grid, combinations[i]));
    }
  }

  return uniqWith(result, isEqual).length;
};

const calculatePartTwo = () => {
  return null;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());