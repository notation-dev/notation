let resourceGroups: ResourceGroup<{}>[] = [];
let resources: Resource[] = [];

let resourceGroupCounter = 0;
let resourceCounter = 0;

export type Resource<Config = {}> = {
  id: number;
  groupId: number;
  type: string;
  dependencies: Record<string, number>;
  config: Config;
};

export type ResourceOptions<Config extends {}> = {
  type: string;
  dependencies?: Record<string, number>;
  config?: Config;
};

export type ResourceGroupOptions<Config extends {}> = {
  type: string;
  dependencies?: Record<string, number>;
  config?: Config;
};

export class ResourceGroup<Config extends {}> {
  id: number;
  type: string;
  platform: string;
  dependencies: Record<string, number>;
  config: Config;
  resources: Resource[];

  constructor(opts: ResourceGroupOptions<Config>) {
    const { type, dependencies, config } = opts;
    this.id = resourceGroupCounter++;
    this.type = type;
    this.platform = "core";
    this.dependencies = dependencies || {};
    this.config = config || ({} as Config);
    this.resources = [];
    resourceGroups.push(this);
    return this;
  }

  createResource = <ResourceConfig extends {}>(
    opts: ResourceOptions<ResourceConfig>,
  ) => {
    const resource: Resource<ResourceConfig> = {
      id: resourceCounter++,
      groupId: this.id,
      type: opts.type,
      dependencies: opts.dependencies || {},
      config: opts.config || ({} as ResourceConfig),
    };
    resources.push(resource);
    this.resources.push(resource);
    return resource;
  };

  findResourceByType = (type: string) => {
    return this.resources.find((r) => r.type === type);
  };
}

export const getResourceGroups = () => resourceGroups;
export const getResources = () => resources;

export const reset = () => {
  resources = [];
  resourceGroups = [];
  resourceCounter = 0;
  resourceGroupCounter = 0;
};
