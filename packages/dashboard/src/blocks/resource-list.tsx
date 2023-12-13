import { BaseResource } from "@notation/core";

export function ResourceList(props: {
  resources: BaseResource[];
  onClick: (resource: BaseResource) => void;
}) {
  return (
    <div className="flex h-full bg-neutral-50 hover:overflow-auto">
      <ul>
        {aggregateResources(props.resources).map((resourceGroup) => (
          <ul
            key={`${resourceGroup[0].groupType}-${resourceGroup[0].groupId}`}
            className="mt-3 mb-5"
          >
            <li className="px-4 py-2 text-xs text-gray-500 font-semibold">
              {resourceGroup[0].groupType} #{resourceGroup[0].groupId}
            </li>
            <ul>
              {resourceGroup.map((resource) => (
                <li
                  key={resource.id}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                  onClick={() => props.onClick(resource)}
                >
                  <code className="text-xs">{resource.id}</code>
                </li>
              ))}
            </ul>
          </ul>
        ))}
      </ul>
    </div>
  );
}

function aggregateResources(resources: BaseResource[]) {
  const groupedResources: Record<string, BaseResource[]> = {};
  resources.forEach((resource) => {
    const key = `${resource.groupId}`;
    if (!groupedResources[key]) {
      groupedResources[key] = [];
    }
    groupedResources[key].push(resource);
  });
  return Object.values(groupedResources).sort((a, b) =>
    a[0].groupType.localeCompare(b[0].groupType),
  );
}
