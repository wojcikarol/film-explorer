import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  if (typeof window === "undefined") return;
  const flag = import.meta.env.VITE_ENABLE_MOCKS;
  const isDev = import.meta.env.DEV;
  if (!isDev && flag !== "true") return;
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: "/mockServiceWorker.js" },
  });
}
