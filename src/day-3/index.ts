import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents.match(/mul\(\d+,\d+\)/g);
};

const calculatePartOne = () => {
  return parseInput()
    .map((instruction) => {
      return instruction.match(/\d+/g)
        .map((x) => parseFloat(x));
    })
    .map(([x, y]) => x * y)
    .reduce((res, x) => res + x, 0);
};

const calculatePartTwo = () => {
  return null
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());