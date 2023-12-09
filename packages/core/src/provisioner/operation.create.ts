import { BaseResource } from "src/orchestrator/resource";
import { State } from "./state";

export async function createResource(resource: BaseResource, state: State) {
  let backoff = 1000;
  try {
    const params = await resource.getParams();
    const maybeComputedPrimaryKey = await resource.create(params);

    resource.output = { ...params };

    if (maybeComputedPrimaryKey) {
      Object.assign(resource.output, maybeComputedPrimaryKey);
    }

    async function getSettledReadResult() {
      if (!resource.read) return {};
      const key = resource.getCompoundKey();
      const readResult = await resource.read(key);

      if (!resource.retryReadOnCondition?.hasOwnProperty(resource.type)) {
        return readResult;
      }

      const needsRetry = resource.retryReadOnCondition.some((condition) => {
        if (!condition) return false;
        const { key, value, reason } = condition;
        const msg = `[Info]: ${reason}`;

        if (value && readResult[key] !== value) {
          console.log(msg);
          return true;
        }

        if (!readResult[key]) {
          console.log(msg);
          return true;
        }

        return false;
      });

      if (needsRetry) {
        await new Promise((resolve) => setTimeout(resolve, backoff));
        backoff *= 1.2;
        return getSettledReadResult();
      }

      return readResult;
    }

    const readResult = await getSettledReadResult();

    Object.assign(resource.output, readResult);

    await state.update(resource.id, {
      id: resource.id,
      meta: resource.meta,
      lastOperation: "create",
      lastOperationAt: new Date().toISOString(),
      config: resource.config,
      params,
      output,
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
