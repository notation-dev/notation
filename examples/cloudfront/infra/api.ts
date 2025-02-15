import { apiGateway, cloudFront } from "@notation/aws.iac";
import { api, router } from "@notation/aws/api-gateway";
import { getTodos } from "../runtime/todos.fn";

const todoApi = api({ name: "todo-api" });
const todoRouter = router(todoApi);

todoRouter.get("/todos2", getTodos);

const apiResource = todoApi.findResource(apiGateway.Api)!;

const cdn = todoApi.add(
  new cloudFront.Distribution({
    id: "my-cdn",
    config: {
      CallerReference: "todoApiCallerReference",
      Comment: "CloudFront Distribution for Todo API",
      Enabled: false,
    },
    dependencies: {
      origin: apiResource,
    },
  }),
);
