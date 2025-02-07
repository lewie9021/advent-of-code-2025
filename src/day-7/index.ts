import * as fs from "fs";
import * as path from "path";
import pick from "lodash/pick.js";
import getDirname from "../helpers/getDirname.ts";

type Operator = (a: number, b: number) => number;

const OPERATORS: Record<string, Operator> = {
  "+": (a: number, b: number) => a + b,
  "*": (a: number, b: number) => a * b,
  "||": (a: number, b: number) => parseInt(`${a}${b}`),
};

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split("\n")
    .map((line) => {
      const [target, numbers] = line.split(": ");

      return {
        numbers: numbers
          .split(" ")
          .map((x) => parseInt(x)),
        target: parseInt(target),
      };
    });
};

const resolveEquation = (
  target: number,
  numbers: Array<number>,
  operators: Record<string, Operator>,
  result = 0,
  equation = ""
) => {
  const [number, ...remainingNumbers] = numbers;

  if (result === target && !numbers.length) {
    return equation;
  }

  if (!number || result > target) {
    return null;
  }

  if (!result) {
    return resolveEquation(target, remainingNumbers, operators, number, `${number}`);
  }

  for (const symbol in operators) {
    const exec = operators[symbol];
    const fork = resolveEquation(
      target,
      remainingNumbers,
      operators,
      exec(result, number),
      `${equation} ${symbol} ${number}`
    );

    if (fork != null) {
      return fork;
    }
  }
};

const calculatePartOne = () => {
  const equations = parseInput();
  const operators = pick(OPERATORS, ["+", "*"]);

  return equations
    .filter(({ numbers, target }) => resolveEquation(target, numbers, operators))
    .reduce((res, x) => res + x.target, 0);
};

const calculatePartTwo = () => {
  const equations = parseInput();
  const operators = pick(OPERATORS, ["+", "*", "||"]);

  return equations
    .filter(({ numbers, target }) => resolveEquation(target, numbers, operators))
    .reduce((res, x) => res + x.target, 0);
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());