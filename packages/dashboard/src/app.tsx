import { useRemoteState } from "./hooks/remote-state";
import { ResourceList } from "./blocks/resource-list";

function App() {
  const state = useRemoteState();
  return (
    <div>
      <ResourceList resources={Object.values(state)} />
    </div>
  );
}

export default App;
