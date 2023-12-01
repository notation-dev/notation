import { Resource } from "src/orchestrator/resource";
import { State, StateNode } from "./state";

export async function deleteResource(
  resource: Resource,
  state: State,
  stateNode: StateNode,
) {
  const primaryKey = resource.getPrimaryKey(stateNode.input, stateNode.output);
  const message = `Destroying ${resource.type} ${resource.id}`;

  try {
    await resource.delete(primaryKey);
    console.log(`[Success]: ${message}`);
  } catch (err: any) {
    // @todo: declare these in the resource provider
    if (
      [
        "NotFoundException",
        "ResourceNotFoundException",
        "NoSuchEntityException",
      ].includes(err.name) ||
      ["ENOENT"].find((srt) => err.message.includes(srt))
    ) {
      console.log(
        `Resource ${resource.type} ${resource.id} has already been deleted. \n→ Removing from state.\n`,
      );
    } else {
      console.log(`[Error]: ${message}`);
      throw err;
    }
  }

  await state.update(resource.id, {
    lastOperation: "delete",
    lastOperationAt: new Date().toISOString(),
    input: stateNode.input,
    output: null,
  });
}
