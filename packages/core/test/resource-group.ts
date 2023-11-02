import { beforeEach, expect, it } from "bun:test";
import {
  ResourceGroup,
  getResourceGroups,
  getResources,
  reset,
} from "src/resource-group";

beforeEach(() => {
  reset();
});

it("creates a resource group", () => {
  const resourceGroup = new ResourceGroup({ type: "test" });
  expect(resourceGroup.id).toBe(0);
  expect(resourceGroup.type).toBe("test");
  expect(resourceGroup.platform).toBe("core");
  expect(resourceGroup.resources).toEqual([]);
});

it("stores resource groups in the global array", () => {
  new ResourceGroup({ type: "test" });
  new ResourceGroup({ type: "test2" });

  expect(getResourceGroups()).toHaveLength(2);
  expect(getResourceGroups()[0].type).toBe("test");
  expect(getResourceGroups()[1].type).toBe("test2");
});

it("creates a resource within a group", () => {
  const resourceGroup = new ResourceGroup({ type: "testGroup" });
  const resource = resourceGroup.createResource({ type: "testResource" });

  expect(resource.id).toBe(0);
  expect(resource.type).toBe("testResource");
  expect(resource.groupId).toBe(resourceGroup.id);
  expect(resourceGroup.resources).toContain(resource);
});

it("stores resources in the global array", () => {
  const resourceGroup = new ResourceGroup({ type: "testGroup" });
  resourceGroup.createResource({ type: "testResource1" });
  resourceGroup.createResource({ type: "testResource2" });

  expect(getResources()).toHaveLength(2);
  expect(getResources()[0].type).toBe("testResource1");
  expect(getResources()[1].type).toBe("testResource2");
});

it("finds a resource by type within a group", () => {
  const resourceGroup = new ResourceGroup({ type: "testGroup" });
  const resource = resourceGroup.createResource({ type: "testResource" });

  expect(resourceGroup.findResourceByType("testResource")).toBe(resource);
  expect(resourceGroup.findResourceByType("nonexistentType")).toBeUndefined();
});

it("increments resource group IDs", () => {
  const rg1 = new ResourceGroup({ type: "group1" });
  const rg2 = new ResourceGroup({ type: "group2" });

  expect(rg1.id).toBe(0);
  expect(rg2.id).toBe(1);
});

it("increments resource IDs globally", () => {
  const rg1 = new ResourceGroup({ type: "group1" });
  const r1 = rg1.createResource({ type: "resource1" });
  const rg2 = new ResourceGroup({ type: "group2" });
  const r2 = rg2.createResource({ type: "resource2" });
  const r3 = rg1.createResource({ type: "resource3" });

  expect(r1.id).toBe(0);
  expect(r2.id).toBe(1);
  expect(r3.id).toBe(2);
});

it("references resources within groups", () => {
  const rg1 = new ResourceGroup({ type: "group1" });
  const r1 = rg1.createResource({ type: "resource1" });
  const r2 = rg1.createResource({ type: "resource2" });

  expect(getResources()).toContain(r1);
  expect(getResources()).toContain(r2);
});
