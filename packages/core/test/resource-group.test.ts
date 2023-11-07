import { beforeEach, expect, it } from "bun:test";
import {
  createResourceFactory,
  ResourceGroup,
  getResourceGroups,
  getResources,
} from "src";
import { reset } from "src/state";

beforeEach(() => {
  reset();
});

class TestResourceGroup extends ResourceGroup {
  platform = "test-platform";
}

const TestResource = createResourceFactory<{ a: number }, {}>()({
  type: "test-resource",
  deploy() {
    throw new Error("Method not implemented.");
  },
});

const testResource = new TestResource({ config: { a: 1 } });
const testResource2 = new TestResource({ config: { a: 2 } });

it("creates a resource group", () => {
  const resourceGroup = new TestResourceGroup("test-group", { a: 1 });
  expect(resourceGroup.id).toBe(0);
  expect(resourceGroup.type).toBe("test-group");
  expect(resourceGroup.platform).toBe("test-platform");
  expect(resourceGroup.config).toEqual({ a: 1 });
  expect(resourceGroup.resources).toEqual([]);
});

it("stores resource groups in the global array", () => {
  new TestResourceGroup("test-group", { type: "test1" });
  new TestResourceGroup("test-group-2", { type: "test2" });

  expect(getResourceGroups()).toHaveLength(2);
  expect(getResourceGroups()[0].type).toBe("test-group");
  expect(getResourceGroups()[1].type).toBe("test-group-2");
});

it("creates a resource within a group", () => {
  const resourceGroup = new TestResourceGroup("test-group", { a: 1 });
  const resource = resourceGroup.add(testResource);

  expect(resource.id).toBe(0);
  expect(resource.type).toBe("test-resource");
  expect(resource.groupId).toBe(resourceGroup.id);
  expect(resourceGroup.resources).toContain(resource);
});

it("stores resources in the global array", () => {
  const resourceGroup = new TestResourceGroup("test-group", { a: 1 });
  resourceGroup.add(testResource);
  resourceGroup.add(testResource2);

  expect(getResources()).toHaveLength(2);
  expect((getResources()[0].config as any).a).toBe(1);
  expect((getResources()[1].config as any).a).toBe(2);
});

it("increments resource group IDs", () => {
  const rg1 = new TestResourceGroup("test-group", { type: "group1" });
  const rg2 = new TestResourceGroup("test-group", { type: "group2" });

  expect(rg1.id).toBe(0);
  expect(rg2.id).toBe(1);
});

it("finds a resource by type within a group", () => {
  const resourceGroup = new TestResourceGroup("test-group", { type: "group1" });
  const resource = resourceGroup.add(testResource);

  expect(resourceGroup.findResource("test-resource")).toBe(resource);
  expect(resourceGroup.findResource("nonExistentType")).toBeUndefined();
});

it("references resources within groups", () => {
  const rg1 = new TestResourceGroup("test-group", {});
  const r1 = rg1.add(testResource);
  const r2 = rg1.add(testResource2);

  expect(getResources()).toContain(r1);
  expect(getResources()).toContain(r2);
});

it("throws an error when adding an existing resource", () => {
  const rg1 = new TestResourceGroup("test-group", {});
  rg1.add(testResource);
  expect(() => rg1.add(testResource)).toThrow();
});

it("increments resource IDs globally", () => {
  const rg1 = new TestResourceGroup("test-group", {});
  const r1 = rg1.add(testResource);
  const rg2 = new TestResourceGroup("test-group", {});
  const r2 = rg2.add(testResource2);
  expect(r1.id).toBe(0);
  expect(r2.id).toBe(1);
});
