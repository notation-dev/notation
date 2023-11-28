import { expect, it, mock, test } from "bun:test";
import { Resource, createResourceFactory } from "src";

type Schema = {
  input: { name: string };
  output: { id: number; name: string };
  primaryKey: { id: number };
};

it("creates a resource class factory", () => {
  const factory = createResourceFactory<Schema>();

  const TestResource = factory({
    type: "test-resource",
    getPrimaryKey: () => ({ id: 1 }),
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
  });

  const resource = new TestResource({
    config: { name: "sampleName" },
  });

  expect(resource.config.name).toBe("sampleName");
  expect(resource.type).toBe("test-resource");
});

test("merges config and intrinsic config", async () => {
  const factory = createResourceFactory<Schema>();

  const TestResource = factory({
    type: "test-resource",
    getPrimaryKey: () => ({ id: 1 }),
    getIntrinsicInput: () => ({ name: "intrinsicName" }),
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
  });

  const resource = new TestResource({ config: { name: "overrideName" } });
  // @ts-expect-error
  expect((await resource.getInput()).name).toBe("intrinsicName");
});

it("passes dependencies to getIntrinsicConfig", () => {
  const getIntrinsicInputMock = mock((deps) => deps.dep1);

  const childFactory = createResourceFactory<Schema>();

  const ChildResource = childFactory({
    type: "childType",
    getPrimaryKey: () => ({ id: 1 }),
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
  });

  const childResource = new ChildResource({ config: { name: "child-name" } });

  const factory = createResourceFactory<Schema, { dep1: Resource }>();

  const Resource = factory({
    type: "testTypeWithDeps",
    getPrimaryKey: () => ({ id: 1 }),
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
    getIntrinsicInput: getIntrinsicInputMock,
  });

  const resource = new Resource({
    dependencies: {
      dep1: childResource,
    },
  });

  resource.getInput();

  expect(getIntrinsicInputMock.mock.calls[0]).toEqual([
    { dep1: childResource },
  ]);
});
