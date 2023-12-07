import { createResourceSchema } from "@notation/core";
import * as z from "zod";

export const integrationSchema = createResourceSchema({
  IntegrationId: {
    type: z.string(),
    primaryKey: true,
    computed: true,
  },
  ApiId: {
    type: z.string(),
    secondaryKey: true,
  },
  ApiGatewayManaged: {
    type: z.boolean(),
    computed: true,
  },
  ConnectionId: {
    type: z.string(),
    optional: true,
  },
  ConnectionType: {
    type: z.enum(["INTERNET", "VPC_LINK"]),
    optional: true,
  },
  ContentHandlingStrategy: {
    type: z.enum(["CONVERT_TO_BINARY", "CONVERT_TO_TEXT"]),
    optional: true,
  },
  CredentialsArn: {
    type: z.string(),
    optional: true,
  },
  Description: {
    type: z.string(),
    optional: true,
  },
  IntegrationMethod: {
    type: z.string(),
    optional: true,
  },
  IntegrationSubtype: {
    type: z.string(),
    optional: true,
  },
  IntegrationType: {
    type: z.enum(["AWS", "AWS_PROXY", "HTTP", "HTTP_PROXY", "MOCK"]),
    optional: true,
  },
  IntegrationUri: {
    type: z.string(),
    optional: true,
  },
  PassthroughBehavior: {
    type: z.enum(["NEVER", "WHEN_NO_MATCH", "WHEN_NO_TEMPLATES"]),
    optional: true,
  },
  PayloadFormatVersion: {
    type: z.string(),
    optional: true,
  },
  RequestParameters: {
    type: z.record(z.string()),
    optional: true,
  },
  RequestTemplates: {
    type: z.record(z.string()),
    optional: true,
  },
  ResponseParameters: {
    type: z.record(z.record(z.string())),
    optional: true,
  },
  TemplateSelectionExpression: {
    type: z.string(),
    optional: true,
  },
  TimeoutInMillis: {
    type: z.number(),
    optional: true,
  },
  TlsConfig: {
    type: z.object({
      ServerNameToVerify: z.string().optional(),
    }),
    optional: true,
  },
});
