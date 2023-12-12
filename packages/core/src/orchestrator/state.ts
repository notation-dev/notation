import { BaseResource } from "./resource";
import { ResourceGroup } from "./resource-group";

export let resourceGroups: ResourceGroup[] = [];
export let resources: BaseResource[] = [];

let resourceGroupCounter = -1;

export const getNextResourceGroupCount = () => {
  return ++resourceGroupCounter;
};

export const reset = () => {
  resources = [];
  resourceGroups = [];
  resourceGroupCounter = -1;
};
