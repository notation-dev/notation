import { useRemoteState } from "./hooks/remote-state";
import { Header } from "./blocks/header";
import { ResourceList } from "./blocks/resource-list";

function App() {
  const state = useRemoteState();
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header />
      <div className="flex flex-auto h-full">
        <ResourceList resources={Object.values(state)} />
      </div>
    </div>
  );
}

export default App;
