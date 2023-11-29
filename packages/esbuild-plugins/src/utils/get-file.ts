export type GetFile = (
  filePath: string,
) => string | Promise<string> | undefined;

export const fsGetFile = async (filePath: string) => {
  const fs = await import("fs/promises");
  return fs.readFile(filePath, { encoding: "utf-8" });
};

export const withFileCheck = (getFile: GetFile) => (filePath: string) => {
  const fileContent = getFile(filePath);
  if (!fileContent) {
    throw new Error(`Module ${filePath} is empty or does not exist`);
  }
  return fileContent;
};
