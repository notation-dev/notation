import { Resource } from "src/orchestrator/resource";
import { State, StateNode } from "./state";

export async function readResource(
  resource: Resource,
  state: State,
  stateNode: StateNode,
) {
  if (!resource.read) {
    return stateNode.output;
  }

  const key = await resource.getCompoundKey();

  try {
    return resource.read(key);
  } catch (err: any) {
    // todo: normalise not found errors within resource class
    // add logic for interpreting error in resource
    if (err.name === "NoSuchEntityException") {
      return null;
    }
    console.log(
      `[Error]: Reading remote resource ${resource.type} ${resource.id}`,
    );
    throw err;
  }
}
