import * as path from "path";
import { fileURLToPath } from "url";

const getDirname = (importUrl: string) => {
  const __filename = fileURLToPath(importUrl);
  return path.dirname(__filename);
}

export default getDirname;