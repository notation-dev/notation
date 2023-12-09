import { resource } from "@notation/core";
import * as z from "zod";
import { zip } from "src/utils/zip";

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
