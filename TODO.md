**Focus two: deploy command**

- Implement deploy workflow within CLI
- Implement destroy workflow within CLI

## Data Structures

**State file**

```
{
  lastUpdated: "2023-11-27T11:35:29.489Z"
  resources: Map({
    "lambda-1": {
      id: "lambda-1",
      provider: "@notation/aws",
      config: {},
      lastOperation: "drift" | "create" | "update"
      lastChanged: "2023-11-27T11:35:29.489Z"
    }
  })
}
```

## Workflows

**Deploy Workflow**

```
for each resource in orchestration graph:
	state_node = find resource in state

  // refresh state
  if exists
    latest_state_node = read live resource

    if changed
      log: report drift
      update state with latest_state_node, marking as drifted

  if refresh
    return

  // reconcile infra
  calculate diff between resource and latest_state_node
  calculate reconciliation operation

	if dry-run
		log intended operation

	else
		run operation

	read updated live resource
  update state
```

**Destroy Workflow**

```
deploy --refresh

for each resource in state:
	read live resource -> update state

	if resource exists
		delete resource
		update state
```
