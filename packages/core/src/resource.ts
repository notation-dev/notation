import { OptionalIfAllPropertiesOptional } from "./types";

type BaseSchema = {
  create: { input: any; output: any };
  read: { input: any; output: any };
  update: { input: any; output: any };
  delete: { input: any; output: any };
};

type OperationFn<
  Schema extends BaseSchema,
  Operation extends keyof BaseSchema,
> = (input: Schema[Operation]["input"]) => Promise<Schema[Operation]["output"]>;

type CreateFn<Schema extends BaseSchema> = OperationFn<Schema, "create">;
type ReadFn<Schema extends BaseSchema> = OperationFn<Schema, "read">;
type UpdateFn<Schema extends BaseSchema> = OperationFn<Schema, "update">;
type DeleteFn<Schema extends BaseSchema> = OperationFn<Schema, "delete">;

type CreateInput<Schema extends BaseSchema> = Schema["create"]["input"];
type ReadOutput<Schema extends BaseSchema> = Schema["read"]["output"];

type ResourceOpts<C, D> = OptionalIfAllPropertiesOptional<"config", C> &
  OptionalIfAllPropertiesOptional<"dependencies", D>;

export abstract class Resource<
  Schema extends BaseSchema = BaseSchema,
  Dependencies extends Record<string, Resource> = {},
  Config = CreateInput<Schema>,
> {
  abstract type: string;
  abstract idKey: string;
  abstract retryOn: string[] | undefined;

  config: Config;
  dependencies: Dependencies;
  id: number = -1;
  groupId: number = -1;
  output: ReadOutput<Schema> = null as ReadOutput<Schema>;

  constructor(opts: ResourceOpts<Config, Dependencies>) {
    this.config = opts.config || ({} as Config);
    this.dependencies = opts.dependencies || ({} as Dependencies);
    return this;
  }

  abstract getCreateInput(): Promise<CreateInput<Schema>> | CreateInput<Schema>;

  abstract create: CreateFn<Schema>;
  abstract read: ReadFn<Schema>;
  abstract update: UpdateFn<Schema>;
  abstract delete: DeleteFn<Schema>;
}

export function createResourceFactory<
  Schema extends BaseSchema = BaseSchema,
  Dependencies extends Record<string, Resource> = {},
  IdKey = keyof Schema["delete"]["input"],
>() {
  type DerivedResourceConstructor<Config> = new (
    opts: ResourceOpts<Config, Dependencies>,
  ) => Resource<Schema, Dependencies, Config>;

  function factory<
    DefaultConfig extends Partial<CreateInput<Schema>> = Partial<
      CreateInput<Schema>
    >,
    Config = Omit<CreateInput<Schema>, keyof DefaultConfig>,
  >(opts: {
    type: string;
    idKey: IdKey;
    retryOn?: string[];
    create: CreateFn<Schema>;
    read: ReadFn<Schema>;
    update: UpdateFn<Schema>;
    delete: DeleteFn<Schema>;
    getIntrinsicConfig: (
      dependencies: Dependencies,
    ) => Promise<DefaultConfig> | DefaultConfig;
  }): DerivedResourceConstructor<Config>;

  function factory<Config = CreateInput<Schema>>(opts: {
    type: string;
    idKey: IdKey;
    retryOn?: string[];
    create: CreateFn<Schema>;
    read: ReadFn<Schema>;
    update: UpdateFn<Schema>;
    delete: DeleteFn<Schema>;
  }): DerivedResourceConstructor<Config>;

  function factory<Config>(opts: any) {
    return class extends Resource<Schema, Dependencies> {
      type = opts.type;
      idKey = opts.idKey;
      retryOn = opts.retryOn;

      async getCreateInput() {
        if ("getIntrinsicConfig" in opts) {
          return {
            ...this.config,
            ...(await opts.getIntrinsicConfig(this.dependencies)),
          } as CreateInput<Schema>;
        }
        return this.config as CreateInput<Schema>;
      }

      create = opts.create;
      update = opts.update;
      read = opts.read;
      delete = opts.delete;
    };
  }

  return factory;
}
