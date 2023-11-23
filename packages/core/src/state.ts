import { Resource } from "./resource";
import { ResourceGroup } from "./resource-group";

export let resourceGroups: ResourceGroup[] = [];
export let resources: Resource[] = [];

let resourceGroupCounter = -1;
let resourceCounter = -1;

export const getNextResourceCount = () => {
  return ++resourceCounter;
};

export const getNextResourceGroupCount = () => {
  return ++resourceGroupCounter;
};

export const resetResourceGroupCounters = () => {
  resources = [];
  resourceGroups = [];
  resourceCounter = -1;
  resourceGroupCounter = -1;
};
