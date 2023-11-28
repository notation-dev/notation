**Focus two: deploy command**

- Implement apply workflow

**Apply Workflow**

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
