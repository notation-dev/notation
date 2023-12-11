import * as z from "zod";
import { FallbackIf } from "src/utils/types";

export type Schema = Record<string, SchemaItem<any>>;

export type SchemaItem<T> = {
  valueType: z.ZodType<T>;
  presence: "required" | "optional";
  sensitive?: true;
  hidden?: true;
  ignore?: true;
} & (
  | {
      propertyType: "param";
      immutable?: true;
      defaultValue?: T;
      primaryKey?: true;
      secondaryKey?: true;
    }
  | {
      propertyType: "computed";
      primaryKey?: true;
    }
  | {
      propertyType: "derived";
    }
);

/**
 * Extracts the primary key type from a schema
 */
export type ComputedPrimaryKey<S extends Schema> = FallbackIf<
  MapSchema<S, { propertyType: "param" }, "primaryKey">,
  {},
  void
>;

/**
 * Extract the compound key of a resource from a schema
 */
export type CompoundKey<S extends Schema> = MapSchema<
  S,
  never,
  "primaryKey" | "secondaryKey"
>;

/**
 * Extract the write params of a resource from a schema
 */
export type Params<S extends Schema> = MapSchema<
  S,
  { propertyType: "computed" | "derived" }
>;

/**
 * Extract the read result of a resource from a schema
 * Partial as it's pretty tricky to know what will come back from a read
 */
export type Result<S extends Schema> = DeepPartial<
  MapSchema<S, { propertyType: "param" | "derived" }>
>;

/**
 * Maps the schema to the output type, containing all properties
 */
export type Output<S extends Schema> = MapSchema<S>;

/**
 * Produces a schema type that is constrained by an API's types
 */
export type SchemaFromApi<
  ApiCompoundKey,
  ApiCreateParams,
  ApiUpdateParams,
  ApiReadResult,
> = {
  // todo: infer propertyType too
  [K in keyof ApiCompoundKey]: SchemaItem<ApiCompoundKey[K]> &
    ({ primaryKey: true } | { secondaryKey: true });
} & {
  [K in keyof OmitOptional<
    Omit<ApiCreateParams, keyof ApiCompoundKey>
  >]: SchemaItem<ApiCreateParams[K]> & {
    propertyType: "param";
    presence: "required";
  };
} & {
  [K in keyof PickOptional<
    Omit<ApiCreateParams, keyof ApiCompoundKey>
  >]: SchemaItem<ApiCreateParams[K]> & {
    propertyType: "param";
    presence: "optional";
  };
} & {
  [K in keyof Omit<ApiCreateParams, keyof ApiUpdateParams>]: SchemaItem<
    ApiCreateParams[K]
  > & {
    propertyType: "param";
    immutable: true;
  };
} & {
  [K in keyof Omit<
    ApiReadResult,
    keyof ApiCreateParams | keyof ApiCompoundKey
  >]: SchemaItem<ApiReadResult[K]> & {
    propertyType: "computed";
  };
};

/**
 * Maps zod `valueType` to the output type.
 * Makes optional fields optional.
 * Excludes properties matching the `ExcludeConditions` type.
 */
type MapSchema<
  S extends Schema,
  ExcludeConditions = never,
  ExcludeKey = any,
> = S extends {
  [K in keyof S]: { valueType: any };
}
  ? Intersect<
      {
        [K in keyof S as S[K] extends
          | { presence: "optional" }
          | ExcludeConditions
          ? never
          : ExcludeKey extends keyof S[K]
          ? K
          : never]: S[K]["valueType"]["_output"];
      },
      {
        [K in keyof S as S[K] extends { presence: "optional" }
          ? S[K] extends ExcludeConditions
            ? never
            : ExcludeKey extends keyof S[K]
            ? K
            : never
          : never]?: S[K]["valueType"]["_output"];
      }
    >
  : never;

/**
 * Unpack an intersection
 */
type Intersect<T, U> = [T] extends [U] ? T : [U] extends [T] ? U : T & U;

/**
 * Get non-optional properties from a type.
 */
type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];

type OmitOptional<T> = Pick<T, OptionalKeys<T>>;
type PickOptional<T> = Omit<T, OptionalKeys<T>>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
