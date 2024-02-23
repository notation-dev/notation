import {
  Schema,
  SchemaItem,
  SchemaFromApi,
  Params,
  Result,
  Output,
  State,
  ComputedPrimaryKey,
  CompoundKey,
} from "./resource.schema";
import {
  OptionalIfAllPropertiesOptional,
  Fallback,
  NoInfer,
} from "src/utils/types";

export type { Schema, SchemaItem };

type ErrorMatcher = {
  name: string;
  message?: string;
  reason: string;
};

type ResultCondition<T, K extends keyof T = keyof T> = {
  key: K;
  reason: string;
  value?: T[K];
};

type ResultConditions<T> = {
  [K in keyof T]?: ResultCondition<T, K>;
}[keyof T][];

type ResourceOpts<C, D> = OptionalIfAllPropertiesOptional<"config", C> &
  OptionalIfAllPropertiesOptional<"dependencies", D> & { id: string };

export interface BaseResource {
  readonly type: `${string}/${string}/${string}`;
  readonly schema: Schema;
  readonly config: any;
  id: string;
  groupId: number;
  groupType: string;
  readonly output: {};
  readonly meta: {
    moduleName: string;
    serviceName: string;
    resourceName: string;
  };
  readonly dependencies: Record<string, BaseResource | void>;
  readonly retryReadOnCondition?: ({
    key: any;
    value?: any;
    reason: string;
  } | void)[]; // todo: can this be neater?
  readonly failOnError?: (ErrorMatcher & { reason: string })[];
  readonly notFoundOnError?: ErrorMatcher[];
  readonly retryLaterOnError?: ErrorMatcher[];
  readonly key: {};
  create: (params: any) => Promise<{} | void>;
  read?: (key: any) => Promise<Result<any>>;
  update?: (key: any, patch: any, params: any, state: any) => Promise<void>;
  delete: (key: any, state: any) => Promise<void>;
  getParams(): Promise<{}>;
  toState(output: {}): {};
  toComparable(output: {}): {};
  setOutput(result: {}): void;
  setIntrinsicConfig?: (opts: {
    id: string;
    config: any;
    deps: any;
  }) => Record<string, any> | Promise<Record<string, any>>;
}

export abstract class Resource<
  S extends Schema = any,
  D extends Record<string, BaseResource | void> = {},
  C extends Record<string, any> = Params<S>,
> implements BaseResource
{
  config: C;
  id: string;
  groupId = -1;
  groupType = "";
  output = null as any as Output<S>;
  dependencies = {} as NoInfer<D>;
  abstract type: `${string}/${string}/${string}`;
  abstract schema: S;
  abstract create: (params: Params<S>) => Promise<ComputedPrimaryKey<S>>;
  abstract read?: (key: CompoundKey<S>) => Promise<Result<S>>;
  abstract update?: (
    key: CompoundKey<S>,
    patch: Params<S>,
    params: Params<S>,
    state: State<S>,
  ) => Promise<void>;
  abstract delete: (key: CompoundKey<S>, state: State<S>) => Promise<void>;
  abstract retryReadOnCondition?: ResultConditions<Output<S>>;
  abstract failOnError?: (ErrorMatcher & { reason: string })[];
  abstract notFoundOnError?: ErrorMatcher[];
  abstract retryLaterOnError?: ErrorMatcher[];
  abstract setIntrinsicConfig(opts: {
    id: string;
    config: C;
    deps: D;
  }): Record<string, any> | Promise<Record<string, any>>;

  constructor(opts: ResourceOpts<C, D>) {
    this.id = opts.id;
    this.config = opts.config || ({} as C);
    this.dependencies = opts.dependencies || ({} as D);
    return this;
  }

  get meta() {
    const parts = this.type.split("/");
    return {
      moduleName: `@notation/${parts[0]}.iac`,
      serviceName: parts[1]!,
      resourceName: parts[2]!,
    };
  }

  get key() {
    const key = {} as CompoundKey<S>;
    for (const [k, v] of Object.entries(this.schema)) {
      let schemaItem = v as CompoundKey<any>;
      if (schemaItem.primaryKey || schemaItem.secondaryKey) {
        // @ts-ignore
        key[k] = this.output[k];
      }
    }
    return key;
  }

  setOutput(output: Output<S>) {
    this.output = output as Output<S>;
  }

  toComparable(output: Output<S>) {
    const parsed = {} as Output<S>;
    for (const [k, v] of Object.entries(this.schema)) {
      if (this.schema[k].volatile) continue;
      if (this.schema[k].hidden) continue;
      if (this.schema[k].propertyType !== "param") continue;
      if (k in output) {
        // @ts-ignore
        parsed[k] = output[k];
      }
    }
    return parsed;
  }

  toState(output: Output<S>) {
    const parsed = {} as Output<S>;
    for (const [k] of Object.entries(this.schema)) {
      if (this.schema[k].hidden) continue;
      if (k in output) {
        // @ts-ignore
        parsed[k] = output[k];
      }
    }
    return parsed;
  }

  async getParams() {
    if (this.setIntrinsicConfig) {
      return {
        ...(this.config as any as Params<S>),
        ...(await this.setIntrinsicConfig({
          id: this.id,
          config: this.config,
          deps: this.dependencies,
        })),
      } as any as Params<S>;
    }
    return this.config as any as Params<S>;
  }
}

export function resource<
  ApiSchema extends {
    Key: any;
    CreateParams: any;
    UpdateParams: any;
    ReadResult: any;
  },
>(meta: { type: `${string}/${string}/${string}` }) {
  return {
    defineSchema<
      S extends SchemaFromApi<
        ApiSchema["Key"],
        ApiSchema["CreateParams"],
        Fallback<ApiSchema["UpdateParams"], ApiSchema["CreateParams"]>,
        Fallback<ApiSchema["ReadResult"], {}>
      >,
    >(schema: S) {
      return {
        defineOperations: <
          IntrinsicConfig extends Partial<Params<S>> = {},
        >(opts: {
          create: (params: Params<S>) => Promise<ComputedPrimaryKey<S>>;
          read?: (key: CompoundKey<S>) => Promise<Result<S>>;
          update?: (
            key: CompoundKey<S>,
            patch: Params<S>,
            params: Params<S>,
            state: State<S>,
          ) => Promise<void>;
          delete: (key: CompoundKey<S>, state: State<S>) => Promise<void>;
          retryReadOnCondition?: ResultConditions<Output<S>>;
          failOnError?: (ErrorMatcher & { reason: string })[];
          notFoundOnError?: ErrorMatcher[];
          retryLaterOnError?: ErrorMatcher[];
          setIntrinsicConfig?: (opts: {
            config: Partial<Params<S>>;
          }) => IntrinsicConfig | Promise<IntrinsicConfig>;
        }) => {
          return class SimpleResource<
            D extends Record<string, BaseResource | void> = {},
            C extends Record<string, any> = Omit<
              Params<S>,
              keyof IntrinsicConfig
            >,
          > extends Resource<S, NoInfer<D>, NoInfer<C>> {
            static type = meta.type;
            type = meta.type;
            schema = schema;
            create = opts.create;
            read = opts.read ? opts.read! : undefined;
            update = opts.update ? opts.update! : undefined;
            delete = opts.delete;
            retryReadOnCondition = opts.retryReadOnCondition;
            failOnError = opts.failOnError;
            notFoundOnError = opts.notFoundOnError;
            retryLaterOnError = opts.retryLaterOnError;

            async setIntrinsicConfig() {
              if (!opts.setIntrinsicConfig) return {};
              return await opts.setIntrinsicConfig({
                config: this.config as any as Partial<Params<S>>,
              });
            }

            static requireDependencies<
              Dependencies extends Record<string, BaseResource | void>,
            >() {
              return {
                setIntrinsicConfig<
                  DepAwareIntrinsicConfig extends Partial<Params<S>>,
                >(
                  setIntrinsicConfig: (opts: {
                    id: string;
                    config: Params<S>;
                    deps: Dependencies;
                  }) =>
                    | DepAwareIntrinsicConfig
                    | Promise<DepAwareIntrinsicConfig>,
                ) {
                  return class DependencyAwareResource extends SimpleResource<
                    Dependencies,
                    Omit<
                      Params<S>,
                      keyof DepAwareIntrinsicConfig | keyof IntrinsicConfig
                    >
                  > {
                    async setIntrinsicConfig() {
                      const superIntrinsicConfig =
                        await super.setIntrinsicConfig();
                      return {
                        ...superIntrinsicConfig,
                        ...(await setIntrinsicConfig({
                          id: this.id,
                          config: this.config as Params<S>,
                          deps: this.dependencies,
                        })),
                      };
                    }
                  };
                },
              };
            }
          };
        },
      };
    },
  };
}
