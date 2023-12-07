import { createResourceSchema } from "@notation/core";
import * as z from "zod";

export const routeSchema = createResourceSchema({
  RouteId: {
    type: z.string(),
    primaryKey: true,
    computed: true,
  },
  ApiId: {
    type: z.string(),
    secondaryKey: true,
  },
  ApiKeyRequired: {
    type: z.boolean(),
    optional: true,
  },
  AuthorizationScopes: {
    type: z.array(z.string()),
    optional: true,
  },
  AuthorizationType: {
    type: z.enum(["NONE", "AWS_IAM", "CUSTOM", "JWT"]),
    optional: true,
  },
  AuthorizerId: {
    type: z.string(),
    optional: true,
  },
  ModelSelectionExpression: {
    type: z.string(),
    optional: true,
  },
  OperationName: {
    type: z.string(),
    optional: true,
  },
  RequestModels: {
    type: z.record(z.string()),
    optional: true,
  },
  RequestParameters: {
    type: z.record(
      z.object({
        Required: z.boolean(),
      }),
    ),
    optional: true,
  },
  RouteKey: {
    type: z.string(),
    optional: true,
  },
  RouteResponseSelectionExpression: {
    type: z.string(),
    optional: true,
  },
  Target: {
    type: z.string(),
    optional: true,
    intrinsic: true,
  },
});
