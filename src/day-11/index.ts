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

const blinkV2 = (stones: Array<number>, blinks: number) => {
  if (blinks < 1) {
    return stones.length;
  }

  return stones.reduce((total, stone) => {
    const cacheResult = cache[getCacheKey(stone, blinks)];

    if (typeof cacheResult !== "undefined") {
      return total + cacheResult;
    }

    if (stone === 0) {
      const result = blinkV2([1], blinks - 1);
      cache[getCacheKey(1, blinks - 1)] = result;

      return total + result;
    }

    const digits = getDigits(stone);

    if (digits.length % 2 === 0) {
      const middle = digits.length / 2;
      const leftDigits = parseInt(digits.slice(0, middle).join(""));
      const rightDigits = parseInt(digits.slice(middle).join(""));
      const leftResult = blinkV2([leftDigits], blinks - 1);
      const rightResult = blinkV2([rightDigits], blinks - 1);
      const result = leftResult + rightResult;

      cache[getCacheKey(leftDigits, blinks - 1)] = leftResult;
      cache[getCacheKey(rightDigits, blinks - 1)] = rightResult;

      return total + result;
    }

    const result = blinkV2([stone * 2024], blinks - 1);
    cache[getCacheKey(stone * 2024, blinks - 1)] = result;

    return total + result;
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

  return blinkV2(stones, 75);
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());
