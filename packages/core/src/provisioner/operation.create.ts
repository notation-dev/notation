import { Resource } from "src/orchestrator/resource";
import { State } from "./state";

export async function createResource(resource: Resource, state: State) {
  let backoff = 1000;
  try {
    const input = await resource.getInput();
    resource.output = await resource.create(input);
    state[resource.id] = {
      id: resource.id,
      provider: resource.type,
      lastOperation: "create",
      lastOperationAt: new Date().toISOString(),
      input,
      output: resource.output,
    };
  } catch (err: any) {
    if (resource.retryOn && err.toString().includes(resource.retryOn)) {
      console.log(`Retrying ${resource.type} ${resource.id}`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 1.5;
      await createResource(resource, state);
    } else {
      throw err;
    }
  }
}
