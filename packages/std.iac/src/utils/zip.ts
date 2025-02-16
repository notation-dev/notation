import path from "node:path";
import fsp from "node:fs/promises";
import * as fflate from "fflate";

export const zip = {
  package: async (sourceFilePath: string, filePath: string) => {
    const inputFile = await fsp.readFile(sourceFilePath);
    const fileName = path.basename(sourceFilePath);
    const archive = fflate.zipSync(
      { [fileName]: inputFile },
      // ensure deterministic output
      { level: 9, mtime: "0/0/00 00:00 PM" },
    );
    await fsp.writeFile(filePath, archive);
  },
};

export const fs = {
  read: async (filePath: string) => {
    return fsp.readFile(filePath);
  },
  delete: async (filePath: string) => {
    await fsp.unlink(filePath);
  },
};
