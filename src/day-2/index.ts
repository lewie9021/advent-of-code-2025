import * as fs from "fs";
import * as path from "path";
import getDirname from "../helpers/getDirname.ts";

const parseInput = () => {
  const contents = fs.readFileSync(path.join(getDirname(import.meta.url), "./input.txt"), "utf8");

  return contents
    .split("\n")
    .map((line) => {
      return line
        .split(/\s+/)
        .map((x) => parseInt(x));
    });
};

const isReportSafe = (report: Array<number>) => {
  if (report.length < 2) {
    return true;
  }

  // Determine expected order based on first two levels.
  const order = (report[0] - report[1]) < 0 ? "asc" : "desc";

  for (let i = 1; i < report.length; i += 1) {
    const level = report[i];
    const prevLevel = report[i - 1];

    if (level < prevLevel && order === "asc") {
      return false;
    }

    if (level > prevLevel && order === "desc") {
      return false;
    }

    const diff = Math.abs(level - prevLevel);

    // Ensure levels differ between 1 and 3.
    if (diff < 1 || diff > 3) {
      return false;
    }
  }

  return true;
};

const calculatePartOne = () => {
  const reports = parseInput();
  const safeReports = reports.filter(isReportSafe);

  return safeReports.length;
};

const calculatePartTwo = () => {
  const reports = parseInput();
  const safeReports = reports.filter((report) => {
    // Create a list of combinations that remove a single level
    // to be tested (along with the original report).
    const combinations = [
      report,
      ...report.map((level, index) => {
        return [
          ...report.slice(0, index),
          ...report.slice(index + 1),
        ];
      })
    ];

    return combinations.some(isReportSafe);
  });

  return safeReports.length;
};

console.log("Part One:", calculatePartOne());
console.log("Part Two:", calculatePartTwo());