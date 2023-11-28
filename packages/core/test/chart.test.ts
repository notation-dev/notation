import { expect, it } from "bun:test";
import { stripIndent } from "common-tags";
import { createMermaidFlowChart, createMermaidLiveUrl } from "src/chart";
import { ResourceGroup } from "src/resource-group";
import { Resource } from "src/resource";

it("should create a mermaid flowchart string", () => {
  const { resourceGroups, resources } = getFixture();
  const chart = createMermaidFlowChart(resourceGroups, resources);

  const expected = stripIndent`
    flowchart TD
      subgraph GroupTypeA_0
        ResourceTypeA_0(ResourceTypeA)
        ResourceTypeB_1(ResourceTypeB)
      end
      subgraph GroupTypeB_1
        ResourceTypeC_2(ResourceTypeC)
      end

      ResourceTypeB_1 --> ResourceTypeA_0`;

  expect(chart).toBe(expected + "\n");
});

it("should create a mermaid live URL from given code", () => {
  const mermaidCode = "flowchart TD\nA --> B";
  const result = createMermaidLiveUrl(mermaidCode);
  const expected =
    "https://mermaid.live/view#pako:eNolyksKhDAQRdGtFG-sG8igQXEH9rAmRVJ-wCRNqNCIuHcDzi6Xc8HnoHBYjvz3mxSj78RpoL7_0IgOUUuUPTRxcSJi2KZRGa5l0EXqYQxOd6NSLc9n8nBWqnaovyCm0y5rkfjO-wHolSVC";
  expect(result).toBe(expected);
});

function getFixture() {
  const resourceGroups = [
    {
      id: 0,
      type: "GroupTypeA",
      config: {},
      dependencies: {},
      resources: [
        {
          id: 0,
          groupId: 0,
          config: {},
          type: "ResourceTypeA",
          dependencies: {},
        },
        {
          id: 1,
          groupId: 0,
          config: {},
          type: "ResourceTypeB",
          dependencies: {
            dep1: {
              id: 0,
              groupId: 0,
              input: {},
              type: "ResourceTypeA",
              dependencies: {},
            },
          },
        },
      ],
    },
    {
      id: 1,
      type: "GroupTypeB",
      config: {},
      dependencies: {},
      resources: [
        {
          id: 2,
          groupId: 1,
          input: {},
          type: "ResourceTypeC",
          dependencies: {},
        },
      ],
    },
  ] as ResourceGroup[];

  const resources = [
    {
      id: 0,
      groupId: 0,
      config: {},
      type: "ResourceTypeA",
      dependencies: {},
    },
    {
      id: 1,
      groupId: 0,
      config: {},
      type: "ResourceTypeB",
      dependencies: {
        dep1: {
          id: 0,
          groupId: 0,
          input: {},
          type: "ResourceTypeA",
          dependencies: {},
        },
      },
    },
    {
      id: 2,
      groupId: 1,
      config: {},
      type: "ResourceTypeC",
      dependencies: {},
    },
  ] as Resource[];

  return { resourceGroups, resources };
}
