**Focus two: deploy command**

- If state file doesn't exit, create it
- Create interface for state file (in core?)
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
if dry run
	plan = read state file

for each resource in orchestration graph:
	get corresponding resource in state file

  if exists
    current_state = read live resource

    if changed
      log: report drift

      if dry run
        update state file with current_state, marking as drifted

  calculate diff between resource and current_state
  calculate reconciliation operation

	if dry run
		log intended operation

	else
		run operation

	read updated live resource
  update state
```

**Destroy Workflow**

```
for each resource:
	read live resource -> update state

	if resource exists
		delete resource
		update state
```
