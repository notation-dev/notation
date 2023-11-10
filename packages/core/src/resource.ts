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
  abstract retryOn: string[] | undefined;
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

  async runDeploy() {
    let backoff = 1000;
    try {
      const input = this.getDeployInput();
      this.output = await this.deploy(input);
    } catch (err: any) {
      if (this.retryOn?.includes(err.name)) {
        console.log(`Retrying ${this.type} ${this.id}`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        backoff *= 1.5;
        await this.runDeploy();
      } else {
        throw err;
      }
    }
  }
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
    Config = Omit<Input, keyof DefaultConfig>,
  >(opts: {
    type: string;
    getIntrinsicConfig: (dependencies: Dependencies) => DefaultConfig;
    deploy: (input: Input) => Promise<Output>;
    retryOn?: string[];
  }): DerivedResourceConstructor<Config>;

  function factory<Config = Input>(opts: {
    type: string;
    deploy: (input: Input) => Promise<Output>;
  }): DerivedResourceConstructor<Config>;

  function factory<Config>(opts: any) {
    return class extends Resource<Input, Output, Config, Dependencies> {
      type = opts.type;
      retryOn = opts.retryOn;

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
