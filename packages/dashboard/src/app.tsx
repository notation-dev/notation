import { useRemoteState } from "./hooks/remote-state";
import { Header } from "./blocks/header";
import { ResourceList } from "./blocks/resource-list";
import { useEffect, useState } from "react";
import { BaseResource } from "@notation/core";

function App() {
  const state = useRemoteState();
  const resources = Object.values(state);
  const [activeResource, setActiveResource] = useState<BaseResource>();

  useEffect(() => {
    if (resources.length > 0 && !activeResource) {
      setActiveResource(resources[0]);
    }
  }, [resources, activeResource]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header />
      <div className="flex flex-auto h-full">
        <div className="w-1/4 border-r">
          <ResourceList
            resources={resources}
            onClick={(resource) => setActiveResource(resource)}
          />
        </div>
        <div className="flex w-3/4 h-full p-5 text-xs">
          {activeResource && (
            <pre>
              {JSON.stringify(activeResource, null, 2) ||
                "No resource selected"}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
