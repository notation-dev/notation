import fsExtra from "fs-extra/esm";
import { Resource } from "..";

export type StateNode = {
  id: number;
  meta: Resource["meta"];
  config: any;
  input: any;
  output: any;
  lastOperation: "drift" | "create" | "update" | "delete";
  lastOperationAt: string;
};

export type State = Awaited<ReturnType<typeof getState>>;

export async function getState() {
  let state = await readState();
  return {
    get(id: number): StateNode | void {
      return state[id];
    },
    async update(id: number, patch: Partial<StateNode>) {
      state[id] = {
        ...state[id],
        ...patch,
      };
      await writeState(state);
      state = await readState();
    },
    values() {
      return Object.values(state);
    },
  };
}

async function readState(): Promise<Record<string, StateNode>> {
  const filePath = "./.notation/state.json";
  if (await fsExtra.pathExists(filePath)) {
    return fsExtra.readJSON(filePath);
  } else {
    await fsExtra.writeJSON(filePath, {});
    return {};
  }
}

async function writeState(state: Record<string, StateNode>) {
  await fsExtra.ensureDir("./.notation");
  await fsExtra.writeJSON("./.notation/state.json", state, { spaces: 2 });
}
