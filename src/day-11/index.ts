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

const cache: Record<string, number> = {};

const getCacheKey = (stone: number, blinks: number) => [stone, blinks].join("|");

const resolveStone = (stone: number) => {
  if (stone === 0) {
    return [1];
  }

  const digits = getDigits(stone);

  if (digits.length % 2 === 0) {
    const middle = digits.length / 2;

    return [
      parseInt(digits.slice(0, middle).join("")),
      parseInt(digits.slice(middle).join(""))
    ];
  }

  return [stone * 2024];
};

const blinkV2 = (stone: number, blinks: number) => {
  if (blinks < 1) {
    return 1;
  }

  const cacheResult = cache[getCacheKey(stone, blinks)];

  if (typeof cacheResult !== "undefined") {
    return cacheResult;
  }

  return resolveStone(stone)
    .reduce((total, value) => {
      const count = blinkV2(value, blinks - 1);
      cache[getCacheKey(value, blinks - 1)] = count;

      return total + count;
    }, 0);
};

const calculatePartOne = () => {
  let result = parseInput();

  for (let i = 0; i < 25; i += 1) {
    result = blink(result);
  }

  return result.length;
};

const calculatePartTwo = () => {
  const stones = parseInput();
  let total = 0;

  for (let i = 0; i < stones.length; i += 1) {
    total += blinkV2(stones[i], 75);
  }

  return total;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());
