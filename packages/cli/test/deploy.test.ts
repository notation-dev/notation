import { expect, it, mock, test } from "bun:test";
import { createResourceFactory } from "@notation/core";
import { runDeploy } from "../src/deploy";

type Schema = {
  create: {
    input: { name: string };
    output: { id: number; name: string };
  };
  read: {
    input: { id: number };
    output: { id: number; name: string };
  };
  update: {
    input: { id: number; name: string };
    output: { id: number; name: string };
  };
  delete: {
    input: { id: number };
    output: {};
  };
};

it("passes computed input to resource.create", async () => {
  const createMock = mock(() => Promise.resolve({ id: 1, name: "name" }));

  const factory = createResourceFactory<Schema>();

  const TestResource = factory({
    type: "testType",
    idKey: "id",
    create: createMock,
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
    getIntrinsicConfig: () => ({ name: "name" }),
  });

  const resource = new TestResource({});

  await runDeploy(resource);
  expect(createMock.mock.calls[0]).toEqual([{ name: "name" }]);
});

it("assigns outputs after deploy", async () => {
  const factory = createResourceFactory<Schema>();

  const TestResource = factory({
    type: "testType",
    idKey: "id",
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
  });

  const resource = new TestResource({ config: { name: "testName" } });
  expect(resource.output).toBe(null);

  await runDeploy(resource);
  expect(resource.output).toEqual({ id: 1, name: "name" });
});
