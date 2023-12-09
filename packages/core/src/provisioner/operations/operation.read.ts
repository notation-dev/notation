import { operation } from "./operation.base";
import { BaseResource } from "src/orchestrator/resource";
import { StateNode } from "../state";

export const readResource = operation("Reading", read);

async function read(opts: { resource: BaseResource; stateNode: StateNode }) {
  const { resource, stateNode } = opts;

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
