import { BaseResource } from "@notation/core";

export function ResourceList(props: { resources: BaseResource[] }) {
  return (
    <ul>
      {props.resources.map((resource) => (
        <li key={resource.id}>
          <code>
            <span>{resource.meta.serviceName}</span>.
            <span>{resource.meta.resourceName}</span>
          </code>
        </li>
      ))}
    </ul>
  );
}
