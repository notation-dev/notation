import { BaseResource } from "src/orchestrator/resource";
import { State } from "./state";

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

  const params = await resource.getParams();
  const output = { ...params };

  if (resource.read) {
    const result = await resource.read(key);
    Object.assign(output, result);
  }

  resource.output = output;

  await state.update(resource.id, {
    lastOperation: "update",
    lastOperationAt: new Date().toISOString(),
    params,
    output,
  });
}
