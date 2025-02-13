import { Tuple } from "../helpers/tuple";

import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split(" ")
    .map((x) => parseInt(x));
};

const getDigits = (x: number) => {
  return x
    .toString()
    .split("")
    .map((x) => parseInt(x));
};

const blink = (stones: Array<number>) => {
  return stones.reduce((res, stone) => {
    if (stone === 0) {
      res.push(1);

      return res;
    }

    const digits = getDigits(stone);

    if (digits.length % 2 === 0) {
      const middle = digits.length / 2;
      const leftDigits = digits.slice(0, middle);
      const rightDigits = digits.slice(middle);

      res.push(parseInt(leftDigits.join("")));
      res.push(parseInt(rightDigits.join("")));

      return res;
    }

    res.push(stone * 2024);

    return res;
  }, []);
};

const calculatePartOne = () => {
  let result = parseInput();

  for (let i = 0; i < 25; i += 1) {
    result = blink(result);
  }

  return result.length;
};

const calculatePartTwo = () => {
  return null;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());
