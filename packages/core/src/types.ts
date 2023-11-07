export type IfAllPropertiesOptional<T, Y, N> = T extends Partial<T>
  ? Partial<T> extends T
    ? Y
    : N
  : N;

/**
 * @param K - The record key
 * @param T - The record value type
 * @description If T is Partial<T>, return { [key in K]?: T }, else return { [key in K]: T }
 */
export type OptionalIfAllPropertiesOptional<
  K extends string,
  T,
> = IfAllPropertiesOptional<T, { [key in K]?: T }, { [key in K]: T }>;
