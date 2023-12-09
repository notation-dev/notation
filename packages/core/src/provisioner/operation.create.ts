import { BaseResource } from "src/orchestrator/resource";
import { State } from "./state";

export async function createResource(resource: BaseResource, state: State) {
  let backoff = 1000;
  try {
    const attributes = await resource.getParams();
    const maybeComputedPrimaryKey = await resource.create(attributes);

    if (maybeComputedPrimaryKey) {
      Object.assign(attributes, maybeComputedPrimaryKey);
    }

    if (resource.read) {
      const readResult = await resource.read(attributes);
      Object.assign(attributes, readResult);
    }

    resource.output = attributes;

    await state.update(resource.id, {
      id: resource.id,
      meta: resource.meta,
      lastOperation: "create",
      lastOperationAt: new Date().toISOString(),
      config: resource.config,
      attributes,
    });
  } catch (err: any) {
    if (
      resource.retryLaterOnError &&
      resource.retryLaterOnError.some(
        (retry) => retry.name === err.name && retry.message === err.message,
      )
    ) {
      console.log(`[Retry]: Creating ${resource.type} ${resource.id}`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 1.5;
      await createResource(resource, state);
    }
    // else if (err.name === "ConflictException") {
    //   // todo: provide some means to requisition the resource
    //   console.log(
    //     `[Info]: Resource ${resource.type} ${resource.id} already exists but isn't owned by Notation.`,
    //   );
    //   throw err;
    // }
    else {
      throw err;
    }
  }
}
