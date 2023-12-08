import { BaseResource } from "src/orchestrator/resource";
import { State } from "./state";

export async function createResource(resource: BaseResource, state: State) {
  let backoff = 1000;
  try {
    const input = await resource.getParams();
    await resource.create(input);

    const output = input;

    if (resource.read) {
      const readResult = await resource.read(input);
      Object.assign(output, readResult);
    }

    resource.output = output;

    await state.update(resource.id, {
      id: resource.id,
      meta: resource.meta,
      lastOperation: "create",
      lastOperationAt: new Date().toISOString(),
      config: resource.config,
      input,
      output,
    });
  } catch (err: any) {
    // todo: set a hold interval in the resource that takes a moment to propagate e.g. iam role
    // when creating, check if any dependencies have a hold, and wait until lastUpdated + holdInterval
    if (
      resource.retryLaterOnError &&
      err.toString().includes(resource.retryLaterOnError)
    ) {
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
