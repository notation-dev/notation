import { useRemoteState } from "./hooks/remote-state";
import { Header } from "./blocks/header";
import { ResourceList } from "./blocks/resource-list";

function App() {
  const state = useRemoteState();
  return (
    <div>
      <Header />
      <ResourceList resources={Object.values(state)} />
    </div>
  );
}

export default App;
