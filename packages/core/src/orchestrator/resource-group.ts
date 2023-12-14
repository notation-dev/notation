import { resources, resourceGroups, getNextResourceGroupCount } from "./state";
import { BaseResource } from "./resource";

export type ResourceGroupOptions = {
  dependencies?: Record<string, number>;
  [key: string]: any;
};

export abstract class ResourceGroup {
  type: string;
  id: number;
  dependencies: Record<string, number>;
  config: Record<string, any>;
  resources: BaseResource[];

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

  add<T extends BaseResource>(resource: T) {
    if (resources.includes(resource)) {
      throw new Error(`Resource ${resource.type} has already been registered.`);
    }
    resource.groupId = this.id;
    resource.groupType = this.type;
    resources.push(resource);
    this.resources.push(resource);
    return resource;
  }

  findResource<T extends new (...opts: any[]) => BaseResource>(
    ResourceClass: T,
  ) {
    return this.resources.find((r) => r instanceof ResourceClass) as
      | InstanceType<T>
      | undefined;
  }
}
