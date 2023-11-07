import { OptionalIfAllPropertiesOptional } from "./types";

type ResourceOpts<C, D> = OptionalIfAllPropertiesOptional<"config", C> &
  OptionalIfAllPropertiesOptional<"dependencies", D>;

export abstract class Resource<
  Input = {},
  Output = {},
  Config = Input,
  Dependencies extends Record<string, Resource> = {},
> {
  abstract type: string;
  config: Config;
  dependencies: Dependencies;
  id: number = -1;
  groupId: number = -1;
  output: Output = null as Output;

  constructor(opts: ResourceOpts<Config, Dependencies>) {
    this.config = opts.config || ({} as Config);
    this.dependencies = opts.dependencies || ({} as Dependencies);
    return this;
  }

  abstract getDeployInput(): Input;
  abstract deploy(input: Input): Promise<Output>;
}

export function createResourceFactory<
  Input = {},
  Output = {},
  Dependencies extends Record<string, Resource> = {},
>() {
  type DerivedResourceConstructor<Config> = new (
    opts: ResourceOpts<Config, Dependencies>,
  ) => Resource<Input, Output, Config, Dependencies>;

  function factory<
    DefaultConfig extends Partial<Input> = Partial<Input>,
    Config = Omit<Input, keyof DefaultConfig> & {
      [P in keyof DefaultConfig]?: never;
    },
  >(opts: {
    type: string;
    getIntrinsicConfig: (dependencies: Dependencies) => DefaultConfig;
    deploy: (input: Input) => Promise<Output>;
  }): DerivedResourceConstructor<Config>;

  function factory<Config = Input>(opts: {
    type: string;
    deploy: (input: Input) => Promise<Output>;
  }): DerivedResourceConstructor<Config>;

  function factory<Config>(opts: any) {
    return class extends Resource<Input, Output, Config, Dependencies> {
      type = opts.type;

      getDeployInput() {
        if ("getIntrinsicConfig" in opts) {
          return {
            ...this.config,
            ...opts.getIntrinsicConfig(this.dependencies),
          } as Input;
        }
        return this.config as any as Input;
      }

      deploy = opts.deploy;
    };
  }

  return factory;
}
