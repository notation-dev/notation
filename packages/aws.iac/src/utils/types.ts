/**
 * Fix AWS SDK types
 * For create and update: remove undefined from value
 * For read: make all options required
 */
export type AwsSchema<S extends SdkSchema> = {
  Key: S["Key"];
  CreateParams: ExcludeUndefined<S["CreateParams"]>;
  UpdateParams: S["UpdateParams"] extends undefined
    ? ExcludeUndefined<S["UpdateParams"]>
    : never;
  ReadResult: S["ReadResult"] extends undefined
    ? {}
    : ExcludeUndefined<S["ReadResult"]>;
};

/**
 *  Unwraps type
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Excludes undefined from object properties
 * For forcing exact optional types and removing
 * the undefined that AWS's SDK adds to every property
 */
export type ExcludeUndefined<T> = Prettify<{
  [P in keyof T]: ExcludeUndefined<Exclude<T[P], undefined>>;
}>;

type SdkSchema = {
  Key: any;
  CreateParams: any;
  UpdateParams?: any;
  ReadResult?: any;
};
