import { createResourceFactory } from "@notation/core";
import path from "node:path";
import fs from "node:fs/promises";

export type ZipInput = { fileName: string };
export type ZipOutput = { contents: Buffer };

const createZipClass = createResourceFactory<ZipInput, ZipOutput>();

export const Zip = createZipClass({
  type: "std/zip",

  deploy: async (config: ZipInput) => {
    const zipPath = path.join(process.cwd(), `${config.fileName}.zip`);
    const zipFile = await fs.readFile(zipPath);
    return { contents: zipFile };
  },
});

export type ZipFileInstance = InstanceType<typeof Zip>;
