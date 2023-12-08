import { resource } from "@notation/core";
import path from "node:path";
import fs from "node:fs/promises";
import * as z from "zod";
import * as fflate from "fflate";

export type ZipSchema = {
  Key: { filePath: string };
  CreateParams: { filePath: string };
  UpdateParams: { filePath: string };
  ReadResult: { getArrayBuffer: () => Buffer };
};

const zipResource = resource<ZipSchema>({
  type: "std/fs/Zip",
});

export const zipSchema = zipResource.defineSchema({
  filePath: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    primaryKey: true,
  },
  getArrayBuffer: {
    valueType: z.function(z.tuple([]), z.instanceof(Buffer)),
    propertyType: "computed",
    presence: "required",
  },
});

export const Zip = zipSchema.defineOperations({
  create: async (config) => {
    await zip.package(config.filePath);
    await zip.read(config.filePath);
  },

  read: async (config) => {
    return zip.read(config.filePath);
  },

  update: async (config) => {
    await zip.delete(config.filePath);
    await zip.package(config.filePath);
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
