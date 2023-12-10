import { resource } from "@notation/core";
import * as z from "zod";
import { zip } from "src/utils/zip";

export type ZipSchema = {
  Key: { filePath: string };
  CreateParams: { filePath: string };
  UpdateParams: { filePath: string };
  ReadResult: { contentsBuffer: Buffer; sha256: string };
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
  contentsBuffer: {
    valueType: z.instanceof(Buffer),
    propertyType: "computed",
    presence: "required",
    hidden: true,
  },
  sha256: {
    valueType: z.string(),
    propertyType: "computed",
    presence: "required",
  },
});

export const Zip = zipSchema.defineOperations({
  create: async (params) => {
    await zip.package(params.filePath);
  },
  async read(key) {
    try {
      const result = await zip.read(key.filePath);
      return result;
    } catch {
      await zip.package(key.filePath);
      return zip.read(key.filePath);
    }
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
