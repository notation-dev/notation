import { Resource } from "src/orchestrator/resource";
import { State } from "./state";

export async function createResource(resource: Resource, state: State) {
  let backoff = 1000;
  try {
    const input = await resource.getInput();
    resource.output = await resource.create(input);

    await state.update(resource.id, {
      id: resource.id,
      provider: resource.type,
      lastOperation: "create",
      lastOperationAt: new Date().toISOString(),
      input: input,
      output: resource.output,
    });
  } catch (err: any) {
    // todo: set a hold interval in the resource that takes a moment to propagate e.g. iam role
    // when creating, check if any dependencies have a hold, and wait until lastUpdated + holdInterval
    if (resource.retryOn && err.toString().includes(resource.retryOn)) {
      console.log(`[Retry]: Creating ${resource.type} ${resource.id}`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 1.5;
      await createResource(resource, state);
      // todo: move to resource
    } else if (err.name === "ConflictException") {
      // todo: provide some means to requisition the resource
      console.log(
        `[Info]: Resource ${resource.type} ${resource.id} already exists but isn't owned by Notation.`,
      );
      throw err;
    } else {
      throw err;
    }
  }
}
