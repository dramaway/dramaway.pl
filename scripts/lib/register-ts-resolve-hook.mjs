/**
 * Resolve extensionless imports to `.ts` for node:test.
 * Next does this itself; Node does not.
 *
 * Synchronous on purpose: `module.registerHooks` (Node 22.15+) does not
 * unwrap a Promise, and an async hook makes `url` come back undefined.
 * The older `register()` API may hand back a Promise; returning it is enough.
 */
function shouldAppendTs(specifier, context) {
  const parent = context.parentURL ?? "";
  const fromProjectSource =
    parent.includes("/apps/web/") || parent.includes("/scripts/");
  const relative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExtension = /\.(?:[cm]?[jt]s|json|css|mjs)$/.test(specifier);
  return fromProjectSource && relative && !hasExtension;
}

function isMissing(error) {
  const code = error && error.code;
  return code === "ERR_MODULE_NOT_FOUND" || code === "MODULE_NOT_FOUND";
}

export function resolve(specifier, context, nextResolve) {
  if (!shouldAppendTs(specifier, context)) {
    return nextResolve(specifier, context);
  }
  try {
    const resolved = nextResolve(`${specifier}.ts`, context);
    if (resolved && typeof resolved.then === "function") {
      return resolved.catch((error) => {
        if (!isMissing(error)) throw error;
        return nextResolve(specifier, context);
      });
    }
    return resolved;
  } catch (error) {
    if (!isMissing(error)) throw error;
    return nextResolve(specifier, context);
  }
}
