import path from "node:path";
import fs from "node:fs/promises";
import * as fflate from "fflate";

export const zip = {
  path: (filePath: string) => `${filePath}.zip`,

  read: async (filePath: string) => {
    const contents = await fs.readFile(zip.path(filePath));
    return { getArrayBuffer: () => contents };
  },

  package: async (filePath: string) => {
    const inputFile = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    const archive = fflate.zipSync({ [fileName]: inputFile }, { level: 9 });
    await fs.writeFile(zip.path(filePath), archive);
  },

  delete: async (filePath: string) => {
    await fs.unlink(zip.path(filePath));
  },
};
