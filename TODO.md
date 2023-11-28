**Deploy Workflow**

```
for each resource in orchestration graph:
  state_node = find in state by resource.id

  if not state_node
    update_state (resource, pending)
    needs_deploy = true

for each state_node in state
  resource_node = find in resources by state.id

  // refresh state node
  state_node = find in state by resource.id

  if state_node
    latest_state_node = read live resource

    if state_node.outputs != latest_state_node.outputs
      log: report drift
      update_state (latest_state_node, drifted)

  if refresh_only
    continue

  if resource_node is undefined
    operation = delete

  else if state_node is pending
    operation = create

  else if state_node is drifted or resource.input != state_node.input
    operation = update

	if dry-run
		log operation

	else
		run operation
```
