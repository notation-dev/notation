<br />

<p align="center">
  <a href="https://www.notation.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/notation-logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset=".github/assets/notation-logo.svg">
      <img alt="Notation Logo" src=".github/assets/notation-logo.svg">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://www.notation.dev/docs/">
    <img alt="Docs" src="https://img.shields.io/badge/docs-get%20started-brightgreen"/>
  </a>
  <a href="https://discord.gg/mGzDWShPzm">
    <img alt="Discord" src="https://img.shields.io/discord/1154880135678406676">
  </a>
  <a href="https://github.com/notationhq/notation/discussions">
    <img alt="Discussions" src="https://img.shields.io/github/discussions/notationhq/notation"/>
  </a>
  <a href="https://twitter.com/intent/tweet?url=https://www.notation.dev">
    <img alt="tweet" src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"/>
  </a>
</p>

<p align="center"><em>Build, test and release cloud-native applications with TypeScript</em></p>

## Features

- &nbsp;🧩&nbsp;&nbsp; **Schema-free infra:** Write application code and let Notation figure out the infrastructure
- &nbsp;🔗&nbsp;&nbsp; **Integrated services:** Connect cloud services without learning proprietary platforms
- &nbsp;🤝&nbsp;&nbsp; **Cross-platform types:** Build with confidence – all cloud services in a unified type space
- &nbsp;🔜&nbsp;&nbsp; **Local dev & test:** Run end-to-end cloud apps right from your terminal
- &nbsp;🔜&nbsp;&nbsp; **Distributed workflows:** Compose serverless functions into powerful workflows

## Getting Started

Head over to [notation.dev/docs](https://notation.dev/docs) for documentation and tutorials.

Or, dive right in:

```sh
npx create-notation-app
```

## Concepts

#### 1. Modules are provided for a selection of cloud services

```ts
import { lambda, api } from "@notation/aws";
import { worker } from "@notation/cloudflare";
import { cloudFunction, api } from "@notation/gcp";
```

#### 2. Code and configuration are co-located

```ts
import { lambda } from "@notation/aws";

const DoSomething = lambda(() => {
  /* your code goes here */
});

DoSomething.config({
  arch: "arm",
  memory: 64,
  timeout: 5,
});
```

#### 3. Equivalent services have compatible APIs

```diff
-import { lambda } from "@notation/aws";
+import { cloudFunction } from "@notation/gcp";

-const DoSomething = lambda(() => {});
+const DoSomething = cloudFunction(() => {});
```

#### 4. Different cloud services can be connected together

```ts
import { lambda, api } from "@notation/aws";

type Payload = {
  count: number;
};

const DoSomething = lambda<Payload>((payload) => {
  return payload.toString();
});

const Api = api();

const PostRoute = api.route<Payload>({
  method: "POST",
  route: "/message",
  handler: DoSomething,
});
```

#### 5. Implicitly required resources are automatically inferred

> In the example above, Notation infers that several additional resources are required in order to support the connection between the lambda and API Gateway: a [proxy integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html), a [lambda permission](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html), an [IAM role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html), and a [policy attachment](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSLambdaBasicExecutionRole.html).

#### 6. Runtime code is extracted, packaged and deployed to the provisioned services

```js
// the compiled JavaScript module deployed to the DoSomething lambda
module.exports = {
  DoSomething: lambdaAdapter((payload) => {
    return payload.toString();
  }),
};
```

## Community

Join us on [GitHub Discussions](https://github.com/notationhq/notation/discussions) to:

- ask questions
- share your Notation projects
- tell us how Notation could be better

Use [Github Issues](https://github.com/notationhq/notation/issues/new) to:

- report a bug
- suggest a new feature
- help us improve the docs

## License

[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)
