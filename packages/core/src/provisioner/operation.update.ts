import { BaseResource } from "src/orchestrator/resource";
import { State, StateNode } from "./state";

export async function updateResource(
  resource: BaseResource,
  state: State,
  patch: any,
): Promise<void> {
  if (!resource.update) {
    throw new Error(
      `Update not implemented for ${resource.type} ${resource.id}`,
    );
  }

  const key = await resource.getCompoundKey();
  await resource.update(key, patch);

  if (resource.read) {
    resource.output = await resource.read(key);
  }

  await state.update(resource.id, {
    lastOperation: "update",
    lastOperationAt: new Date().toISOString(),
    input: await resource.getInput(),
    output: resource.output,
  });
}
