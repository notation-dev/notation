import { Resource } from "src/resource";
import { State } from "./state";

export async function deleteResource(
  resource: Resource,
  state: State,
  stateNode: State[string],
) {
  const primaryKey = resource.getPrimaryKey(stateNode.input, stateNode.output);

  try {
    await resource.delete(primaryKey);
    console.log(`Removed ${resource.type} ${resource.id}`);
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
        `Resource ${resource.type} ${resource.id} does not exist. \n→ Marking as deleted in state.\n`,
      );
    } else {
      throw err;
    }
  }

  state[resource.id] = {
    id: resource.id,
    provider: resource.type,
    lastOperation: "delete",
    lastOperationAt: new Date().toISOString(),
    input: stateNode.input,
    output: null,
  };
}
