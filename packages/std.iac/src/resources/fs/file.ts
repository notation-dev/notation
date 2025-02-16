import { resource } from "@notation/core";
import { getSourceSha256 } from "src/utils/hash";
import * as z from "zod";
import * as fs from "node:fs/promises";

export type FileSchema = {
  Key: { filePath: string };
  CreateParams: { filePath: string };
  UpdateParams: { filePath: string };
  ReadResult: void;
};

const fileResource = resource<FileSchema>({
  type: "std/fs/File",
});

export const fileSchema = fileResource.defineSchema({
  filePath: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    primaryKey: true,
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

export const File = fileSchema.defineOperations({
  setIntrinsicConfig: async ({ config }) => {
    const sourceSha256 = await getSourceSha256(config.filePath!);
    return { sourceSha256 };
  },
  read: async (config) => {
    const file = await fs.readFile(config.filePath);
    return { ...config, file };
  },
  create: async () => {},
  update: async () => {},
  delete: async () => {},
});

export type FileInstance = InstanceType<typeof File>;
