import type { Tuple } from "../helpers/tuple";

import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents.split("\n")
    .map((line) => line.split(""));
};

const getLetters = (
  grid: Array<Array<string>>,
  position: Tuple<number>,
  direction: Tuple<number>,
  keyword: string
) => {
  let result = "";

  for (let i = 0; i < keyword.length; i += 1) {
    const y = position[0] + (direction[0] * i);
    const x = position[1] + (direction[1] * i);

    if (y < 0 || (y > grid.length - 1) || x < 0 || (x > grid[0]?.length - 1)) {
      continue;
    }

    result += grid[y][x];
  }

  return result;
}

const getKeywordMatches = (
  grid: Array<Array<string>>,
  position: Tuple<number>,
  keyword: string
) => {
  const directions: Array<Tuple<number>> = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
    [-1, -1], // Up-Left
    [-1, 1], // Up-Right
    [1, -1], // Down-Left
    [1, 1] // Down-Right
  ];

  return directions
    .map((direction) => getLetters(grid, position, direction, keyword))
    .filter((letters) => letters === keyword);
}

const calculatePartOne = () => {
  const grid = parseInput();
  const keyword = "XMAS";
  let result = [];

  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const position: Tuple<number> = [y, x];

      result.push(...getKeywordMatches(grid, position, keyword));
    }
  }

  return result.length;
};

const calculatePartTwo = () => {
  return null;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());