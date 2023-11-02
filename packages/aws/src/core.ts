import { ResourceGroup, ResourceGroupOptions } from "@notation/core";

export class AwsResourceGroup<Config extends {}> extends ResourceGroup<Config> {
  constructor(opts: ResourceGroupOptions<Config>) {
    super(opts);
    this.platform = "aws";
  }
}
