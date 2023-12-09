import { BaseResource } from "src/orchestrator/resource";
import { StateNode } from "./state";

export async function readResource(
  resource: BaseResource,
  stateNode: StateNode,
) {
  if (!resource.read) {
    return stateNode.output;
  }

  const key = await resource.getCompoundKey();

  try {
    const result = await resource.read(key);
    const params = await resource.getParams();
    return { ...params, ...result };
  } catch (err: any) {
    // todo: normalise not found errors within resource class
    // add logic for interpreting error in resource
    // if (err.name === "NoSuchEntityException") {
    //   return null;
    // }
    console.log(
      `[Error]: Reading remote resource ${resource.type} ${resource.id}`,
    );
    throw err;
  }
}
