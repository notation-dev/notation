import {
  resources,
  resourceGroups,
  getNextResourceCount,
  getNextResourceGroupCount,
} from "./state";
import { Resource } from "./resource";

export type ResourceGroupOptions = {
  dependencies?: Record<string, number>;
  [key: string]: any;
};

export abstract class ResourceGroup {
  type: string;
  id: number;
  dependencies: Record<string, number>;
  config: Record<string, any>;
  resources: Resource[];

  constructor(type: string, opts: ResourceGroupOptions) {
    const { dependencies, ...config } = opts;
    this.type = type;
    this.id = getNextResourceGroupCount();
    this.dependencies = dependencies || {};
    this.config = config || {};
    this.resources = [];
    resourceGroups.push(this);
    return this;
  }

  add<T extends Resource>(resource: T) {
    if (resources.includes(resource)) {
      throw new Error(`Resource ${resource.type} has already been registered.`);
    }
    resource.id = getNextResourceCount();
    resource.groupId = this.id;
    resources.push(resource);
    this.resources.push(resource);
    return resource;
  }

  findResource<T extends new (...opts: any[]) => Resource>(ResourceClass: T) {
    return this.resources.find((r) => r instanceof ResourceClass) as
      | InstanceType<T>
      | undefined;
  }
}
