import { createResourceFactory } from "@notation/core";
import path from "node:path";
import fs from "node:fs/promises";
import * as fflate from "fflate";

export type ZipSchema = {
  input: { filePath: string };
  output: { contents: Buffer };
  primaryKey: { filePath: string };
};

const createZipClass = createResourceFactory<ZipSchema>();

export const Zip = createZipClass({
  type: "std/fs/Zip",

  getPrimaryKey: (input) => ({
    filePath: input.filePath,
  }),

  create: async (config) => {
    await zip.package(config.filePath);
    return zip.read(config.filePath);
  },

  read: async (config) => {
    return zip.read(config.filePath);
  },

  update: async (config) => {
    await zip.delete(config.filePath);
    await zip.package(config.filePath);
    return zip.read(config.filePath);
  },

  delete: async (config) => {
    await zip.delete(config.filePath);
  },
});

export type ZipFileInstance = InstanceType<typeof Zip>;

// @todo: move to utils
const zip = {
  path: (filePath: string) => `${filePath}.zip`,

  read: async (filePath: string) => {
    const contents = await fs.readFile(zip.path(filePath));
    return { contents };
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
