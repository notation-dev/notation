import path from "node:path";
import fs from "node:fs/promises";
import * as fflate from "fflate";
import crypto from "crypto";

export const zip = {
  path: (filePath: string) => `${filePath}.zip`,

  getSourceSha256: async (filePath: string) => {
    const sourceBuffer = await fs.readFile(filePath);
    const sourceSha256 = crypto
      .createHash("sha256")
      .update(sourceBuffer)
      .digest("hex");
    return sourceSha256;
  },

  read: async (filePath: string) => {
    try {
      return fs.readFile(zip.path(filePath));
    } catch {
      await zip.package(zip.path(filePath));
      return fs.readFile(zip.path(filePath));
    }
  },

  package: async (filePath: string) => {
    const inputFile = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    const archive = fflate.zipSync(
      { [fileName]: inputFile },
      // ensure deterministic output
      { level: 9, mtime: "0/0/00 00:00 PM" },
    );
    await fs.writeFile(zip.path(filePath), archive);
  },

  delete: async (filePath: string) => {
    await fs.unlink(zip.path(filePath));
  },
};
