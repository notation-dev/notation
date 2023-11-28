import fsExtra from "fs-extra/esm";

export type State = Record<
  string,
  {
    id: number;
    provider: string;
    input: any;
    output: any;
    lastOperation: "drift" | "create" | "update" | "delete";
    lastOperationAt: string;
  }
>;

export async function readState(): Promise<State> {
  const filePath = "./.notation/state.json";

  if (await fsExtra.pathExists(filePath)) {
    return fsExtra.readJSON(filePath);
  } else {
    await fsExtra.writeJSON(filePath, {});
    return {};
  }
}

export async function writeState(state: State) {
  await fsExtra.ensureDir("./.notation");
  await fsExtra.writeJSON("./.notation/state.json", state, { spaces: 2 });
}
