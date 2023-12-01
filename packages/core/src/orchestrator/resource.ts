import { OptionalIfAllPropertiesOptional } from "../utils/types";

export type BaseSchema = {
  input: any;
  output: any;
  primaryKey: any;
};

type Create<Schema extends BaseSchema> = (
  input: Schema["input"],
) => Promise<Schema["output"]>;

type Read<Schema extends BaseSchema> = (
  input: Schema["primaryKey"],
) => Promise<Schema["output"]>;

type Update<Schema extends BaseSchema> = (
  input: Schema["primaryKey"] & Partial<Schema["input"]>,
) => Promise<Schema["output"] | void>;

type Delete<Schema extends BaseSchema> = (input: Schema["primaryKey"]) => void;

type GetPrimaryKey<Schema extends BaseSchema> = (
  input: Schema["input"],
  output: Schema["output"],
) => Schema["primaryKey"];

type ResourceOpts<C, D> = OptionalIfAllPropertiesOptional<"config", C> &
  OptionalIfAllPropertiesOptional<"dependencies", D>;

export abstract class Resource<
  Schema extends BaseSchema = BaseSchema,
  Dependencies extends Record<string, Resource> = {},
  config = Schema["input"],
> {
  abstract type: string;
  abstract retryOn: string[] | undefined;

  config: config;
  dependencies: Dependencies;
  id: number = -1;
  groupId: number = -1;
  output: Schema["output"] = null as any as Schema["output"];

  constructor(opts: ResourceOpts<config, Dependencies>) {
    this.config = opts.config || ({} as config);
    this.dependencies = opts.dependencies || ({} as Dependencies);
    return this;
  }

  get meta() {
    const parts = this.type.split("/");
    return {
      moduleName: `@notation/${parts[0]}.iac`,
      serviceName: parts[1],
      resourceName: parts[2],
    };
  }

  abstract getInput(): Promise<config> | config;
  abstract getPrimaryKey: GetPrimaryKey<Schema>;

  abstract create: Create<Schema>;
  abstract read: Read<Schema> | void;
  abstract update: Update<Schema> | void;
  abstract delete: Delete<Schema>;
}

export function createResourceFactory<
  Schema extends BaseSchema = BaseSchema,
  Dependencies extends Record<string, Resource> = {},
>() {
  type DerivedResourceConstructor<Input> = new (
    opts: ResourceOpts<Input, Dependencies>,
  ) => Resource<Schema, Dependencies, Input>;

  function factory<
    IntrinsicInput extends Partial<Schema["input"]> = Partial<Schema["input"]>,
    Input = Omit<Schema["input"], keyof IntrinsicInput>,
  >(opts: {
    type: string;
    retryOn?: string[];
    create: Create<Schema>;
    read?: Read<Schema>;
    update?: Update<Schema>;
    delete: Delete<Schema>;
    getPrimaryKey: GetPrimaryKey<Schema>;
    getIntrinsicInput: (
      dependencies: Dependencies,
    ) => Promise<IntrinsicInput> | IntrinsicInput;
  }): DerivedResourceConstructor<Input>;

  // No intrinsic input
  function factory(opts: {
    type: string;
    retryOn?: string[];
    create: Create<Schema>;
    read?: Read<Schema>;
    update?: Update<Schema>;
    delete: Delete<Schema>;
    getPrimaryKey: GetPrimaryKey<Schema>;
  }): DerivedResourceConstructor<Schema["input"]>;

  function factory(opts: any) {
    return class extends Resource<Schema, Dependencies> {
      type = opts.type;
      retryOn = opts.retryOn;
      getPrimaryKey = opts.getPrimaryKey;
      create = opts.create;
      read = opts.read;
      update = opts.update;
      delete = opts.delete;

      async getInput() {
        if ("getIntrinsicInput" in opts) {
          return {
            ...this.config,
            ...(await opts.getIntrinsicInput(this.dependencies)),
          } as Schema["input"];
        }
        return this.config as Schema["input"];
      }
    };
  }

  return factory;
}
