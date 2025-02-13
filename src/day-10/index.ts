import { Tuple } from "../helpers/tuple";

import * as fs from "fs";
import * as path from "path";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";
import last from "lodash/last.js";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split("\n")
    .map((line) => {
      return line
        .split("")
        .map((x) => parseInt(x));
    });
};

const findTrailheads = (map: Array<Array<number>>) => {
  const result: Array<Tuple<number>> = [];

  for (let y = 0; y < map.length; y += 1) {
    const row = map[y];

    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === 0) {
        result.push([y, x]);
      }
    }
  }

  return result;
};

const directions: Array<Tuple<number>> = [
  [-1, 0], // Up
  [1, 0], // Down
  [0, -1], // Left
  [0, 1], // Right
];

const walkTrail = (
  map: Array<Array<number>>,
  trail: Array<Tuple<number>>,
) => {
  const tail = last(trail);
  const [tailY, tailX] = tail;
  const tailHeight = map[tailY][tailX];

  if (tailHeight === 9) {
    return [trail];
  }

  const nextPositions = directions
    .map(([y, x]) => [tailY + y, tailX + x] as Tuple<number>)
    .filter(([y, x]) => y >= 0 && x >= 0 && y < map.length && x < map[y].length)
    .filter(([y, x]) => map[y][x] === tailHeight + 1);

  if (!nextPositions.length) {
    return [];
  }

  return nextPositions.reduce<Array<Array<Tuple<number>>>>((res, nextPosition) => {
    res.push(...walkTrail(map, [...trail, nextPosition]));

    return res
  }, []);
};

const calculatePartOne = () => {
  const map = parseInput();

  return findTrailheads(map)
    .map((trailhead) => {
      const trailTails = walkTrail(map, [trailhead])
        .map((trail) => last(trail));

      return uniqWith(trailTails, isEqual).length;
    })
    .reduce((total, score) => total + score, 0);
};

const calculatePartTwo = () => {
  const map = parseInput();

  return findTrailheads(map)
    .map((trailhead) => {
      return walkTrail(map, [trailhead])
        .map((trail) => last(trail))
        .length;
    })
    .reduce((total, score) => total + score, 0);
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());