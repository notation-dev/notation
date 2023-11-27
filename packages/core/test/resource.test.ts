import { expect, it, mock, test } from "bun:test";
import { Resource, createResourceFactory } from "src";

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
it("creates a resource class factory", () => {
  const factory = createResourceFactory<Schema>();

  const TestResource = factory({
    type: "test-resource",
    idKey: "id",
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
    idKey: "id",
    getIntrinsicConfig: () => ({ name: "intrinsicName" }),
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
  });

  const resource = new TestResource({ config: { name: "overrideName" } });
  expect((await resource.getCreateInput()).name).toBe("intrinsicName");
});

it("passes dependencies to getIntrinsicConfig", () => {
  const getIntrinsicConfigMock = mock((deps) => deps.dep1);

  const childFactory = createResourceFactory<Schema>();

  const ChildResource = childFactory({
    type: "childType",
    idKey: "id",
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
  });

  const childResource = new ChildResource({ config: { name: "child-name" } });

  const factory = createResourceFactory<Schema, { dep1: Resource }>();

  const Resource = factory({
    type: "testTypeWithDeps",
    idKey: "id",
    create: () => Promise.resolve({ id: 1, name: "name" }),
    read: () => Promise.resolve({ id: 1, name: "name" }),
    update: () => Promise.resolve({ id: 1, name: "name" }),
    delete: () => Promise.resolve({}),
    getIntrinsicConfig: getIntrinsicConfigMock,
  });

  const resource = new Resource({
    dependencies: {
      dep1: childResource,
    },
  });

  resource.getCreateInput();

  expect(getIntrinsicConfigMock.mock.calls[0]).toEqual([
    { dep1: childResource },
  ]);
});
