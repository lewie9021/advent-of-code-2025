import type { Tuple } from "../helpers/tuple";

import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";

const parseInput = (): Tuple<Array<number>> => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split("\n")
    .reduce((res, line) => {
      const [a, b] = line.split(/\s+/);

      res[0].push(parseInt(a));
      res[1].push(parseInt(b));

      return res;
    }, [[], []]);
};

const getPairs = (lists: Tuple<Array<number>>): Array<Tuple<number>> => {
  const [leftList, rightList] = lists.map((list) => list.toSorted());

  return leftList.map((leftNum, index) => {
    return [leftNum, rightList[index]]
  });
};

const calculatePartOne = () => {
  const lists = parseInput();
  const pairs = getPairs(lists);

  return pairs.reduce((res, [leftNum, rightNum]) => {
    return res + Math.abs(leftNum - rightNum);
  }, 0);
};

const calculatePartTwo = () => {
  const [leftList, rightList] = parseInput();

  return leftList.reduce((res, leftNum) => {
    const matches = rightList.filter((x) => x === leftNum).length;

    return res + (leftNum * matches);
  }, 0);
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());