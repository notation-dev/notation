import { deployApp } from "@notation/core";
import { compile } from "./compile";

export async function deploy(entryPoint: string) {
  await compile(entryPoint);
  console.log(`Deploying ${entryPoint}`);

  try {
    await deployApp(entryPoint);
  } catch (err: any) {
    if (err.name === "CredentialsProviderError") {
      console.log(
        "\nAWS credentials not found.",
        "\n\nEnsure you have a default profile set up in ~/.aws/credentials.",
        "\n\nIf using another profile run AWS_PROFILE=otherProfile notation deploy.\n",
      );
      process.exit(1);
    }
    console.log(err);
    process.exit(1);
  }
}
