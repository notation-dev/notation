import { useState, useEffect } from "react";
import { BaseResource } from "@notation/core";

export const useRemoteState = () => {
  const [state, setState] = useState({});

  useEffect(() => {
    const evtSource = new EventSource("/state");

    evtSource.onmessage = function (event) {
      setState(JSON.parse(event.data) ?? {});
    };

    return () => {
      evtSource.close();
    };
  }, []);

  return state as Record<string, BaseResource>;
};
