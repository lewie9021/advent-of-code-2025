import type { Tuple } from "../helpers/tuple";

import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");
  const [rules, updates] = contents.split("\n\n");

  return {
    rules: rules
      .split("\n")
      .map((line) => {
        return line
          .split("|")
          .map((x) => parseInt(x));
      }) as Array<Tuple<number>>,
    updates: updates
      .split("\n")
      .map((line) => {
        return line
          .split(",")
          .map((x) => parseInt(x));
      })
  };
};

const getCorrectOrder = (update: Array<number>, rules: Array<Tuple<number>>) => {
  return update.toSorted((a, b) => {
    const rule = rules.find((x) => x.includes(a) && x.includes(b));

    if (!rule) {
      return 0;
    }

    if (rule[1] === a) {
      return 1;
    }

    return -1;
  });
};

const calculatePartOne = () => {
  const { rules, updates } = parseInput();

  return updates
    .filter((update) => {
      const sorted = getCorrectOrder(update, rules);

      return update.every((x, i) => x === sorted[i]);
    })
    .reduce((res, update) => {
      const middleIndex = Math.ceil(update.length / 2) - 1

      return res + update[middleIndex];
    }, 0);
};

const calculatePartTwo = () => {
  return null
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());