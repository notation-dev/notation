import { BaseResource } from "src/orchestrator/resource";

export const operation = <Opts extends { resource: BaseResource }, V>(
  action: string,
  operation: (opts: Opts) => Promise<V>,
) => {
  return async (
    opts: Opts & { dryRun?: boolean; quiet?: boolean },
  ): Promise<V> => {
    const { dryRun, quiet, ...opOpts } = opts;
    const message = `${action} ${opOpts.resource.id}`;

    if (dryRun) {
      console.log(`[Dry Run]: ${message}`);
      return {} as V;
    }

    try {
      const result = await operation(opOpts as unknown as Opts);
      if (!quiet) console.log(`[Success]: ${message}`);
      return result;
    } catch (err) {
      console.error(`[Error]: ${message}`);
      throw err;
    }
  };
};
