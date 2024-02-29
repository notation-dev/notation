type Action =
  | "BatchGetItem"
  | "BatchWriteItem"
  | "DeleteItem"
  | "GetItem"
  | "PutItem"
  | "Query"
  | "Scan"
  | "UpdateItem";

export const $policy = (config: { table: any; actions: Action[] }) => ({});

export const $client = <T extends Action[]>(config: {
  table: any;
  allowedMethods: T;
}) => {
  return config.allowedMethods.reduce((acc, method) => {
    return {
      ...acc,
      [method]: async () => {},
    };
  }, {}) as Record<T[number], Function>;
};
