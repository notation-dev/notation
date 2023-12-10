import { operation } from "./operation.base";
import { BaseResource } from "src/orchestrator/resource";
import { State } from "../state";
import { readResource } from ".";

export const updateResource = operation("Updating", update);

async function update(opts: {
  resource: BaseResource;
  state: State;
  patch: any;
}): Promise<void> {
  const { resource, state, patch } = opts;

  if (!resource.update) {
    throw new Error(
      `Update not implemented for ${resource.type} ${resource.id}`,
    );
  }

  await resource.update(patch);

  const params = await resource.getParams();

  resource.setOutput(params);

  if (resource.read) {
    const result = await readResource({ resource, state });
    resource.setOutput({ ...resource.output, ...result });
  }

  await state.update(resource.id, {
    lastOperation: "update",
    lastOperationAt: new Date().toISOString(),
    params: resource.toState(params),
    output: resource.toState(resource.output),
  });
}
