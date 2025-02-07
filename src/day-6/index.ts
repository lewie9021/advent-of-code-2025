import type { Tuple } from "../helpers/tuple";

import * as fs from "fs";
import * as path from "path";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split("\n")
    .map((line) => line.split(""));
};

const rotate90 = (direction: Tuple<number>): Tuple<number> => {
  // Up -> Right
  if (direction[0] === -1 && direction[1] === 0) {
    return [0, 1];
  }

  // Right -> Down
  if (direction[0] === 0 && direction[1] === 1) {
    return [1, 0];
  }

  // Down -> Left
  if (direction[0] === 1 && direction[1] === 0) {
    return [0, -1];
  }

  // Left -> Up
  if (direction[0] === 0 && direction[1] === -1) {
    return [-1, 0];
  }
}

const isLooping = (positions: Array<Tuple<number>>) => {
  const maxLoopLength = Math.floor(positions.length / 2);

  for (let loopSize = 2; loopSize <= maxLoopLength; loopSize += 1) {
    for (let loopIndex = 0; loopIndex < loopSize; loopIndex += 1) {
      const a = positions[positions.length - 1 - loopIndex - loopSize];
      const b = positions[positions.length - 1 - loopIndex];

      if (!isEqual(a, b)) {
        break;
      }

      if (loopIndex === loopSize - 1) {
        return true;
      }
    }
  }

  return false;
};

const getStartPosition = (grid: Array<Array<string>>): Tuple<number> => {
  const startY = grid.findIndex((row) => row.includes("^"));
  const startX = grid[startY].findIndex((cell) => cell === "^");

  return [startY, startX];
};

const simulateGuardPatrolling = (grid: Array<Array<string>>) => {
  let direction: Tuple<number> = [-1, 0];
  let positions = [getStartPosition(grid)];

  while (true) {
    const position = positions[positions.length - 1];
    const nextY = position[0] + direction[0];
    const nextX = position[1] + direction[1];

    if (nextY < 0 || nextY > grid.length - 1) {
      return positions;
    }

    if (nextX < 0 || nextX > grid[0].length - 1) {
      return positions;
    }

    if (isLooping(positions)) {
      return [];
    }

    if (grid[nextY][nextX] === "#") {
      direction = rotate90(direction);
      continue;
    }

    positions.push([nextY, nextX]);
  }
};

const calculatePartOne = () => {
  const grid = parseInput();
  const positions = simulateGuardPatrolling(grid);

  return uniqWith(positions, isEqual).length;
};

const calculatePartTwo = () => {
  const grid = parseInput();
  const positions = uniqWith(simulateGuardPatrolling(grid), isEqual);
  let numOfLoops = 0;

  for (let i = 0; i < positions.length; i += 1) {
    const [y, x] = positions[i];

    if (grid[y][x] !== ".") {
      continue
    }

    grid[y][x] = "#";

    if (!simulateGuardPatrolling(grid).length) {
      numOfLoops += 1;
    }

    grid[y][x] = ".";
  }

  return numOfLoops;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());