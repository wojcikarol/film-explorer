import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { enableMocking } = await import("@/mocks/browser");
        await enableMocking();
      } catch (e) {
        console.warn("MSW failed to start", e);
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#888" }}>
        Ładowanie…
      </div>
    );
  }

  return <App />;
}
