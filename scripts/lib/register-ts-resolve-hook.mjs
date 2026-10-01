/**
 * Resolve extensionless imports to `.ts` for node:test.
 * Next does this itself; Node does not.
 */
export async function resolve(specifier, context, nextResolve) {
  const parent = context.parentURL ?? "";
  const fromProjectSource =
    parent.includes("/apps/web/") || parent.includes("/scripts/");
  const relative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExtension = /\.(?:[cm]?[jt]s|json|css|mjs)$/.test(specifier);
  if (fromProjectSource && relative && !hasExtension) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch (error) {
      const code = error && error.code;
      if (code !== "ERR_MODULE_NOT_FOUND" && code !== "MODULE_NOT_FOUND") throw error;
    }
  }
  return nextResolve(specifier, context);
}
