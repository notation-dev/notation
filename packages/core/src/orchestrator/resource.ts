import {
  Schema,
  SchemaItem,
  SchemaFromApi,
  Params,
  Result,
  Output,
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
};

type ResultCondition<T, K extends keyof T> = {
  key: K;
  reason: string;
  value?: T[K];
};

type ResultConditions<T> = {
  [K in keyof T]?: ResultCondition<T, K>;
}[keyof T][];

type ResourceOpts<C, D> = OptionalIfAllPropertiesOptional<"config", C> &
  OptionalIfAllPropertiesOptional<"dependencies", D>;

export interface BaseResource {
  type: string;
  schema: any;
  config: any;
  id: number;
  groupId: number;
  output: Output<any>;
  meta: {
    moduleName: string;
    serviceName: string;
    resourceName: string;
  };
  dependencies: Record<string, BaseResource>;
  create: (params: any) => Promise<void>;
  read?: (key: any) => Promise<Result<any>>;
  update?: (key: any, params: any) => Promise<void>;
  delete: (primaryKey: any) => Promise<void>;
  retryReadOnCondition?: any; // todo
  failOnError?: (ErrorMatcher & { reason: string })[];
  notFoundOnError?: ErrorMatcher[];
  retryLaterOnError?: ErrorMatcher[];
  getCompoundKey(): Promise<any> | any;
  setIntrinsicConfig?: (deps: any) => Record<string, any>;
  getInput(): Promise<Params<Schema>> | Params<Schema>;
}

export abstract class Resource<
  S extends Schema = any,
  D extends Record<string, BaseResource> = {},
  C extends Record<string, any> = Params<S>,
> implements BaseResource
{
  config: C;
  dependencies: D;
  abstract type: string;
  abstract schema: S;
  abstract id: number;
  abstract groupId: number;
  abstract output: Output<S>;
  abstract create: (params: Params<S>) => Promise<void>;
  abstract read?: (key: CompoundKey<S>) => Promise<Result<S>>;
  abstract update?: (key: CompoundKey<S>, params: Params<S>) => Promise<void>;
  abstract delete: (primaryKey: CompoundKey<S>) => Promise<void>;
  abstract retryReadOnCondition?: ResultConditions<Result<S>>;
  abstract failOnError?: (ErrorMatcher & { reason: string })[];
  abstract notFoundOnError?: ErrorMatcher[];
  abstract retryLaterOnError?: ErrorMatcher[];
  abstract getCompoundKey(): Promise<CompoundKey<S>> | CompoundKey<S>;
  abstract setIntrinsicConfig(deps: D): Record<string, any>;

  constructor(opts: ResourceOpts<C, D>) {
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

  async getInput() {
    const params = await this.getParams();
    const compoundKey = this.getCompoundKey();
    return {
      ...params,
      ...compoundKey,
    };
  }

  async getParams() {
    if (this.setIntrinsicConfig) {
      return {
        ...(this.config as any as Params<S>),
        ...(await this.setIntrinsicConfig(this.dependencies)),
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
>(meta: { type: string }) {
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
          create: (params: Params<S>) => Promise<void>;
          read?: (key: CompoundKey<S>) => Promise<Result<S>>;
          update?: (key: CompoundKey<S>, params: Params<S>) => Promise<void>;
          delete: (primaryKey: CompoundKey<S>) => Promise<void>;
          retryReadOnCondition?: ResultConditions<Result<S>>;
          failOnError?: (ErrorMatcher & { reason: string })[];
          notFoundOnError?: ErrorMatcher[];
          retryLaterOnError?: ErrorMatcher[];
          setIntrinsicConfig?: () => IntrinsicConfig;
        }) => {
          return class ImplementedResource<
            D extends Record<string, BaseResource> = {},
            C extends Record<string, any> = Omit<
              Params<S>,
              keyof IntrinsicConfig
            >,
          > extends Resource<S, NoInfer<D>, NoInfer<C>> {
            static type = meta.type;
            type = meta.type;
            schema = schema;
            id = -1;
            groupId = -1;
            output = outputProxy as any as Output<S>;
            dependencies = {} as NoInfer<D>;
            create = opts.create;
            read = opts.read;
            update = opts.update;
            delete = opts.delete;
            retryReadOnCondition = opts.retryReadOnCondition;
            failOnError = opts.failOnError;
            notFoundOnError = opts.notFoundOnError;
            retryLaterOnError = opts.retryLaterOnError;

            setIntrinsicConfig() {
              if (!opts.setIntrinsicConfig) return {};
              return opts.setIntrinsicConfig();
            }

            getCompoundKey() {
              const key = {} as CompoundKey<S>;
              for (const [k, v] of Object.entries(schema)) {
                if (["primaryKey", "secondaryKey"].includes(v.propertyType)) {
                  // @ts-ignore
                  key[k] = this.output[k];
                }
              }
              return key;
            }

            static requireDependencies<
              Dependencies extends Record<string, BaseResource>,
            >() {
              return {
                setIntrinsicConfig<IntrinsicConfig extends Partial<Params<S>>>(
                  setIntrinsicConfig: (deps: Dependencies) => IntrinsicConfig,
                ) {
                  return class DependencyAwareResource extends ImplementedResource<
                    Dependencies,
                    Omit<Params<S>, keyof IntrinsicConfig>
                  > {
                    setIntrinsicConfig() {
                      const superIntrinsicConfig = super.setIntrinsicConfig();
                      return {
                        ...superIntrinsicConfig,
                        ...setIntrinsicConfig(this.dependencies),
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

const outputProxy = new Proxy(
  {},
  {
    get(target, prop) {
      throw new Error(
        `Resource outputs are not available at compile time. Accessed output property "${prop.toString()}.`,
      );
    },
  },
);
