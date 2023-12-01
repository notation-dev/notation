import { Resource, BaseSchema } from "src/orchestrator/resource";
import { State, StateNode } from "./state";

export async function readResource<T>(
  resource: Resource<BaseSchema & { output: T }>,
  state: State,
  stateNode: StateNode,
): Promise<T | null> {
  if (!resource.read) {
    return stateNode.output;
  }

  const pk = await resource.getPrimaryKey(stateNode.input, stateNode.output);

  try {
    return await resource.read(pk);
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
