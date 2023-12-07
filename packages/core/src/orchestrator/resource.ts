import {
  Schema,
  SchemaItem,
  SchemaFromApi,
  Config,
  Params,
  Result,
  Output,
  CompoundKey,
} from "./resource.schema";
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

type Fallback<T, U> = T extends undefined ? U : T;

export abstract class Resource<S extends Schema = Schema> {
  config: Config<S>;
  dependencies: Record<string, Resource>;
  abstract type: string;
  abstract schema: S;
  abstract id: number;
  abstract groupId: number;
  abstract output: Output<S>;
  abstract getIntrinsicConfig: (deps: any) => Partial<Config<S>>;
  abstract create: (params: Params<S>) => Promise<void>;
  abstract read?: (key: CompoundKey<S>) => Promise<Result<S>>;
  abstract update?: (key: CompoundKey<S>, params: Params<S>) => Promise<void>;
  abstract delete: (primaryKey: CompoundKey<S>) => Promise<void>;
  abstract retryReadOnCondition?: ResultConditions<Result<S>>;
  abstract failOnError?: (ErrorMatcher & { reason: string })[];
  abstract notFoundOnError?: ErrorMatcher[];
  abstract retryLaterOnError?: ErrorMatcher[];
  abstract getParams(): Promise<Params<S>> | Params<S>;
  abstract getCompoundKey(): Promise<CompoundKey<S>> | CompoundKey<S>;

  constructor(resourceOpts: {
    config: Config<S>;
    dependencies?: Record<string, Resource>;
  }) {
    this.config = resourceOpts.config;
    this.dependencies = resourceOpts.dependencies || {};
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

  async getInput() {
    const params = await this.getParams();
    const compoundKey = this.getCompoundKey();
    return {
      ...params,
      ...compoundKey,
    };
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
        implement: (opts: {
          create: (params: Params<S>) => Promise<void>;
          read?: (key: CompoundKey<S>) => Promise<Result<S>>;
          update?: (key: CompoundKey<S>, params: Params<S>) => Promise<void>;
          delete: (primaryKey: CompoundKey<S>) => Promise<void>;
          retryReadOnCondition?: ResultConditions<Result<S>>;
          failOnError?: (ErrorMatcher & { reason: string })[];
          notFoundOnError?: ErrorMatcher[];
          retryLaterOnError?: ErrorMatcher[];
        }) => {
          return class ImplementedResource extends Resource<S> {
            static type = meta.type;
            type = meta.type;
            schema = schema;
            id = -1;
            groupId = -1;
            output = outputProxy as any as Output<S>;
            dependencies = {};
            create = opts.create;
            read = opts.read;
            update = opts.update;
            delete = opts.delete;
            getIntrinsicConfig = (deps: any) => ({});
            retryReadOnCondition = opts.retryReadOnCondition;
            failOnError = opts.failOnError;
            notFoundOnError = opts.notFoundOnError;
            retryLaterOnError = opts.retryLaterOnError;

            async getParams() {
              if ("getIntrinsicInput" in opts) {
                return {
                  ...this.config,
                  ...(await this.getIntrinsicConfig(this.dependencies)),
                } as Params<S>;
              }
              return this.config as Params<S>;
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

            // todo make this instance method, but add static extends method
            static withIntrinsicConfig<
              Dependencies extends Record<string, Resource> = {},
            >(
              // todo: infer intrinsic props and omit from schema
              getIntrinsicConfig: <I>(deps: Dependencies) => Partial<Config<S>>,
            ) {
              return class DependencyAwareResource extends ImplementedResource {
                constructor(resourceOpts: {
                  config: Config<S>;
                  dependencies: Dependencies;
                }) {
                  super(resourceOpts);
                  this.getIntrinsicConfig = getIntrinsicConfig;
                }
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
