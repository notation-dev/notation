import { Resource } from "src/orchestrator/resource";
import { State } from "./state";

export async function readResource(
  resource: Resource,
  state: State,
): Promise<any> {
  const stateNode = state.get(resource.id);

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
