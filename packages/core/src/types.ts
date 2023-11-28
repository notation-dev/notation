export type IfAllPropertiesOptional<T, Y, N> = T extends Partial<T>
  ? Partial<T> extends T
    ? Y
    : N
  : N;

/**
 * @typeparam K - The record key
 * @typeparam T - The record value type
 * @description If T is Partial<T>, return { [key in K]?: T }, else return { [key in K]: T }
 */
export type OptionalIfAllPropertiesOptional<
  K extends string,
  T,
> = IfAllPropertiesOptional<T, { [key in K]?: T }, { [key in K]: T }>;

/**
 * Extracts the keys from type `T` that are required.
 * A key is considered required if it is present in `Required<T>`.
 *
 * @typeparam T - The type to extract required keys from.
 *
 * @returns A union of the keys of `T` that are required.
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: T[K] extends Required<T>[K] ? K : never;
}[keyof T];

/**
 * Creates a tuple type consisting of each required key of type `T` as a separate element.
 * This type maps over each key in `T`, including it in the tuple if it is required.
 * If `T` has no required keys, an empty tuple type is returned.
 *
 * @typeparam T - The type to create a tuple of required keys from.
 *
 * @returns A tuple type with each required key of `T` as a separate element, or an empty tuple if `T` has no required keys.
 */
export type RequiredKeysTuple<T> = keyof T extends infer D
  ? D extends keyof T
    ? T[D] extends Required<T>[D]
      ? [D, ...RequiredKeysTuple<Omit<T, D>>]
      : RequiredKeysTuple<Omit<T, D>>
    : never
  : [];
