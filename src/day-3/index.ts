import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents.match(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g);
};

const runMul = (instruction: string) => {
  return instruction.match(/\d+/g)
    .map((x) => parseFloat(x))
    .reduce((res, x) => res * x);
}

const calculatePartOne = () => {
  return parseInput()
    .filter((instruction) => instruction.startsWith("mul("))
    .map((instruction) => runMul(instruction))
    .reduce((res, x) => res + x);
};

const calculatePartTwo = () => {
  let enabled = true;
  let total = 0;

  const instructions = parseInput();

  for (let i = 0; i < instructions.length; i += 1) {
    const instruction = instructions[i];

    if (instruction.startsWith("do(")) {
      enabled = true;
    }

    if (instruction.startsWith("don't(")) {
      enabled = false;
    }

    if (instruction.startsWith("mul(") && enabled) {
      total += runMul(instruction);
    }
  }

  return total;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());