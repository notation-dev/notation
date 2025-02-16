import path from "node:path";
import * as fs from "node:fs/promises";
import * as fflate from "fflate";

export const zip = {
  package: async (sourceFilePath: string, filePath: string) => {
    const inputFile = await fs.readFile(sourceFilePath);
    const fileName = path.basename(sourceFilePath);
    const archive = fflate.zipSync(
      { [fileName]: inputFile },
      // ensure deterministic output
      { level: 9, mtime: "0/0/00 00:00 PM" },
    );
    await fs.writeFile(filePath, archive);
  },
};
