import { BaseResource } from "src/orchestrator/resource";

export const operation = <Opts extends { resource: BaseResource }, V>(
  gerund: string,
  operation: (opts: Opts) => Promise<V>,
) => {
  return async (opts: Opts & { dryRun?: boolean }): Promise<V> => {
    const { dryRun, ...opOpts } = opts;
    const message = `${gerund} ${opOpts.resource.type} ${opOpts.resource.id}`;

    if (dryRun) {
      console.log(`[Dry Run]: ${message}`);
      return {} as V;
    }

    try {
      const result = await operation(opOpts as unknown as Opts);
      console.log(`[Success]: ${message}`);
      return result;
    } catch (err) {
      console.error(`[Error]: ${message}`);
      throw err;
    }
  };
};
