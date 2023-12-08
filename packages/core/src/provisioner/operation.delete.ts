import { BaseResource } from "src/orchestrator/resource";
import { State } from "./state";

export async function deleteResource(resource: BaseResource, state: State) {
  const compoundKey = resource.getCompoundKey();
  const message = `Destroying ${resource.type} ${resource.id}`;

  try {
    await resource.delete(compoundKey);
    console.log(`[Success]: ${message}`);
  } catch (err: any) {
    // @todo: declare these in the resource provider
    if (
      [
        "NotFoundException",
        "ResourceNotFoundException",
        "NoSuchEntityException",
      ].includes(err.name) ||
      ["ENOENT"].find((srt) => err.message.includes(srt))
    ) {
      console.log(
        `Resource ${resource.type} ${resource.id} has already been deleted. \n→ Removing from state.\n`,
      );
    } else {
      console.log(`[Error]: ${message}`);
      throw err;
    }
  }

  await state.delete(resource.id);
}
