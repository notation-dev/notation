type Resource = {
  id: number;
  type: string;
} & Record<string, any>;

const resources: Resource[] = [];

export const getResources = () => resources;

let idCounter = 0;

export const registerResource = (type: string, opts: Record<string, any>) => {
  const id = idCounter++;
  const resource = { id, type, ...opts };
  resources.push(resource);
  return resource;
};

export const fn = (opts: Record<string, any>) => {
  return registerResource("function", opts);
};
