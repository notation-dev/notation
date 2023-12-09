import fsExtra from "fs-extra/esm";
import { Resource } from "..";

export type StateNode = {
  id: number;
  meta: Resource["meta"];
  config: {};
  params: {};
  output: {};
  lastOperation: "drift" | "create" | "update" | "delete";
  lastOperationAt: string;
};

export class State {
  state: Record<string, StateNode>;
  constructor() {
    this.state = {};
  }
  async get(id: number): Promise<StateNode | void> {
    this.state = await readState();
    return this.state[id];
  }
  async update(id: number, patch: Partial<StateNode>) {
    this.state = await readState();
    this.state[id] = {
      ...this.state[id],
      ...patch,
    };
    await writeState(this.state);
  }
  async delete(id: number) {
    this.state = await readState();
    delete this.state[id];
    await writeState(this.state);
  }
  async values() {
    this.state = await readState();
    return Object.values(this.state);
  }
}

async function readState(): Promise<Record<string, StateNode>> {
  const filePath = "./.notation/state.json";

  if (await fsExtra.pathExists(filePath)) {
    return fsExtra.readJSON(filePath);
  } else {
    await fsExtra.ensureFile(filePath);
    await fsExtra.writeJSON(filePath, {});
    return {};
  }
}

async function writeState(state: Record<string, StateNode>) {
  await fsExtra.ensureDir("./.notation");
  await fsExtra.ensureFile("./.notation/state.json");
  await fsExtra.writeJSON("./.notation/state.json", state, { spaces: 2 });
}
