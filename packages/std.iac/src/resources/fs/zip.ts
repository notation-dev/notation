import { resource } from "@notation/core";
import * as z from "zod";
import { fs, zip } from "src/utils/zip";
import { getSourceSha256 } from "src/utils/hash";

export type ZipSchema = {
  Key: { sourceFilePath: string };
  CreateParams: { sourceFilePath: string };
  UpdateParams: { sourceFilePath: string };
  ReadResult: void;
};

const zipResource = resource<ZipSchema>({
  type: "std/fs/Zip",
});

export const zipSchema = zipResource.defineSchema({
  sourceFilePath: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    primaryKey: true,
  },
  filePath: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    secondaryKey: true,
  },
  sourceSha256: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
  },
  file: {
    valueType: z.instanceof(Buffer),
    propertyType: "computed",
    presence: "required",
  },
} as const);

export const Zip = zipSchema.defineOperations({
  setIntrinsicConfig: async ({ config }) => {
    const sourceSha256 = await getSourceSha256(config.sourceFilePath!);
    const filePath = `${config.sourceFilePath}.zip`;
    return { sourceSha256, filePath };
  },
  read: async (config) => {
    return {
      ...config,
      file: await fs.read(config.filePath),
    };
  },
  create: async (params) => {
    await zip.package(params.sourceFilePath, params.filePath);
  },
  update: async (config) => {
    await fs.delete(config.filePath);
    await zip.package(config.sourceFilePath, config.filePath);
  },
  delete: async (config) => {
    await fs.delete(config.filePath);
  },
});

export type ZipFileInstance = InstanceType<typeof Zip>;
