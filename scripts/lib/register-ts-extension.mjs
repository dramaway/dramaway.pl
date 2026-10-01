/**
 * Lets node:test import extensionless TypeScript inside apps/web.
 * Next resolves those imports; Node does not.
 *
 * Node 22.15+ can install hooks synchronously. 22.12–22.14 (still inside
 * engines.node) only has the async register() API.
 */
import { register } from "node:module";

const hooks = await import("node:module");

if (typeof hooks.registerHooks === "function") {
  const { resolve } = await import("./register-ts-resolve-hook.mjs");
  hooks.registerHooks({ resolve });
} else {
  await register(new URL("./register-ts-resolve-hook.mjs", import.meta.url).href, {
    parentURL: import.meta.url,
  });
}
