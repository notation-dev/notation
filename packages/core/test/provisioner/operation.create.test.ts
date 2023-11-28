import { expect, it, mock } from "bun:test";
import { createResourceFactory } from "src/orchestrator/resource";
import { createResource } from "src/provisioner/operation.create";

type Schema = {
  input: { name: string };
  output: { id: number; name: string };
  primaryKey: { id: number };
};

it("passes computed input to resource.create", async () => {
  const createMock = mock(() => Promise.resolve({ id: 1, name: "name" }));

  const factory = createResourceFactory<Schema>();

  const TestResource = factory({
    type: "testType",
    getPrimaryKey: () => ({ id: 1 }),
    create: createMock,
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
    getIntrinsicInput: () => ({ name: "name" }),
  });

  const resource = new TestResource({});

  await createResource(resource, {});
  expect(createMock.mock.calls[0]).toEqual([{ name: "name" }]);
});

it("assigns outputs after deploy", async () => {
  const factory = createResourceFactory<Schema>();

  const TestResource = factory({
    type: "testType",
    getPrimaryKey: () => ({ id: 1 }),
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
  });

  const resource = new TestResource({ config: { name: "testName" } });
  expect(resource.output).toBe(null);

  await createResource(resource, {});
  expect(resource.output).toEqual({ id: 1, name: "name" });
});
