import { expect, it, mock, test } from "bun:test";
import { Resource, createResourceFactory } from "src";

it("creates a resource class factory", () => {
  class TestResource extends Resource<{ name: string }, { id: number }> {
    type = "test";
    getDeployInput() {
      return { name: "testName" };
    }
    deploy() {
      return Promise.resolve({ id: 123 });
    }
  }

  const resource = new TestResource({
    config: { name: "sampleName" },
  });

  expect(resource.config.name).toBe("sampleName");
  expect(resource.type).toBe("test");
});

test("merges config and intrinsic config", async () => {
  const factory = createResourceFactory<{ name: string }>();

  const TestResource = factory({
    type: "testTypeWithOverride",
    getIntrinsicConfig: () => ({ name: "intrinsicName" }),
    deploy: () => Promise.resolve({}),
  });

  const resource = new TestResource({ config: { name: "overrideName" } });
  expect((await resource.getDeployInput()).name).toBe("intrinsicName");
});

it("passes dependencies to getIntrinsicConfig", () => {
  const getIntrinsicConfigMock = mock((deps) => deps.dep1);

  const childFactory = createResourceFactory<
    { name: string },
    { id: number }
  >();

  const ChildResource = childFactory({
    type: "childType",
    deploy: () => Promise.resolve({ id: 123 }),
  });

  const childResource = new ChildResource({ config: { name: "child-name" } });

  const factory = createResourceFactory<
    { name: string },
    { id: number },
    { dep1: Resource }
  >();

  const Resource = factory({
    type: "testTypeWithDeps",
    deploy: () => Promise.resolve({ id: 123 }),
    getIntrinsicConfig: getIntrinsicConfigMock,
  });

  const resource = new Resource({
    dependencies: {
      dep1: childResource,
    },
  });

  resource.getDeployInput();

  expect(getIntrinsicConfigMock.mock.calls[0]).toEqual([
    { dep1: childResource },
  ]);
});

it('passes merged config to "deploy"', async () => {
  const deployMock = mock(() => Promise.resolve({}));

  const factory = createResourceFactory<{ name: string; a: 1 }>();

  const TestResource = factory({
    type: "testType",
    deploy: deployMock,
    getIntrinsicConfig: () => ({ a: 1 }),
  });

  const resource = new TestResource({ config: { name: "testName" } });

  await resource.runDeploy();
  expect(deployMock.mock.calls[0]).toEqual([{ a: 1, name: "testName" }]);
});

it("assigns outputs after deploy", async () => {
  const factory = createResourceFactory<{ name: string }, { id: number }>();

  const TestResource = factory({
    type: "testType",
    deploy: () => Promise.resolve({ id: 123 }),
  });

  const resource = new TestResource({ config: { name: "testName" } });
  expect(resource.output).toBe(null);

  await resource.runDeploy();
  expect(resource.output).toEqual({ id: 123 });
});
