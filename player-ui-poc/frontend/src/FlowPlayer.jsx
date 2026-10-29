import React, { Suspense, useEffect, useMemo } from "react";
import { ReactPlayer } from "@player-ui/react";
import { ReferenceAssetsPlugin } from "@player-ui/reference-assets-plugin-react";

export function FlowPlayer({ flow, onComplete, onError }) {
  const reactPlayer = useMemo(() => new ReactPlayer({ plugins: [new ReferenceAssetsPlugin()] }), [flow]);

  useEffect(() => {
    let active = true;
    reactPlayer
      .start(flow)
      .then((result) => active && onComplete({ outcome: result.endState.outcome, data: result.data }))
      .catch((error) => active && onError(error));
    return () => {
      active = false;
    };
  }, [reactPlayer]);

  return (
    <Suspense fallback={<p>Loading flow...</p>}>
      <reactPlayer.Component />
    </Suspense>
  );
}
