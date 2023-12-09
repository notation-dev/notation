import { operation } from "./operation.base";
import { BaseResource } from "src/orchestrator/resource";
import { State } from "../state";

export const deleteResource = operation("Destroying", delete_);

async function delete_(opts: { resource: BaseResource; state: State }) {
  const { resource, state } = opts;
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
