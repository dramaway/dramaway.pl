import assert from "node:assert/strict";
import { test } from "node:test";
import { contentSecurityPolicy } from "../../apps/web/src/lib/content-security-policy.ts";
import {
  DEFAULT_UMAMI_COLLECT_ORIGIN,
  DEFAULT_UMAMI_SCRIPT_URL,
  UMAMI_TRACKED_DOMAINS,
  umamiCollectOrigin,
  umamiDataHostUrl,
  umamiScript,
  umamiScriptOrigin,
} from "../../apps/web/src/lib/umami.ts";

const WEBSITE = "website-test";

function directive(policy, name) {
  const found = policy.split("; ").find((part) => part.startsWith(`${name} `));
  assert.ok(found, `${name} missing`);
  return found;
}

test("no website id means no script and no Umami host in CSP", () => {
  assert.equal(umamiScript({}), null);
  assert.equal(umamiScript({ websiteId: "   " }), null);
  assert.equal(umamiDataHostUrl({ websiteId: WEBSITE }), null);
  assert.equal(umamiScriptOrigin({ scriptUrl: DEFAULT_UMAMI_SCRIPT_URL }), null);
  assert.equal(umamiCollectOrigin({}), null);
  const policy = contentSecurityPolicy({ nodeEnv: "production" });
  assert.equal(policy.includes("umami.is"), false);
  assert.match(policy, /upgrade-insecure-requests/);
});

test("a website id loads the official snippet and splits script and collect hosts", () => {
  const script = umamiScript({ websiteId: `  ${WEBSITE}  ` });
  assert.deepEqual(script, {
    src: DEFAULT_UMAMI_SCRIPT_URL,
    websiteId: WEBSITE,
    domains: UMAMI_TRACKED_DOMAINS,
  });
  assert.equal(umamiDataHostUrl({ websiteId: WEBSITE, hostUrl: "   " }), null);
  assert.equal(UMAMI_TRACKED_DOMAINS, "fundacja.dramaway.pl");

  const policy = contentSecurityPolicy({
    nodeEnv: "development",
    websiteId: WEBSITE,
  });
  assert.equal(policy.includes("upgrade-insecure-requests"), false);
  const scriptOrigin = "https://cloud.umami.is";
  assert.equal(directive(policy, "script-src").split(scriptOrigin).length - 1, 1);
  assert.equal(directive(policy, "script-src").includes(DEFAULT_UMAMI_COLLECT_ORIGIN), false);
  assert.equal(
    directive(policy, "connect-src").split(DEFAULT_UMAMI_COLLECT_ORIGIN).length - 1,
    1,
  );
  assert.equal(directive(policy, "connect-src").includes(scriptOrigin), false);
});

test("the script host comes from NEXT_PUBLIC_UMAMI_SCRIPT_URL", () => {
  const script = umamiScript({
    websiteId: WEBSITE,
    scriptUrl: "  https://stats.example.eu/a/script.js  ",
  });
  assert.equal(script.src, "https://stats.example.eu/a/script.js");
  assert.equal(umamiDataHostUrl({ websiteId: WEBSITE, scriptUrl: script.src }), null);
  const policy = contentSecurityPolicy({
    websiteId: WEBSITE,
    scriptUrl: "https://stats.example.eu/a/script.js",
  });
  assert.equal(
    directive(policy, "script-src").includes("https://stats.example.eu"),
    true,
  );
  assert.equal(
    directive(policy, "connect-src").includes(DEFAULT_UMAMI_COLLECT_ORIGIN),
    true,
  );
  assert.equal(policy.includes("cloud.umami.is"), false);
});

test("NEXT_PUBLIC_UMAMI_HOST_URL sets data-host-url and replaces the gateway", () => {
  const settings = {
    websiteId: WEBSITE,
    hostUrl: "  https://collect.example.eu  ",
  };
  assert.equal(umamiDataHostUrl(settings), "https://collect.example.eu");
  assert.equal(umamiCollectOrigin(settings), "https://collect.example.eu");
  const policy = contentSecurityPolicy(settings);
  assert.equal(
    directive(policy, "connect-src").includes("https://collect.example.eu"),
    true,
  );
  assert.equal(policy.includes("gateway.umami.is"), false);
  assert.equal(
    directive(policy, "script-src").includes("https://cloud.umami.is"),
    true,
  );
});

test("a non-https script URL does not render or widen CSP", () => {
  const settings = {
    websiteId: WEBSITE,
    scriptUrl: "http://cloud.umami.is/script.js",
    hostUrl: "https://collect.example.eu",
  };
  assert.equal(umamiScript(settings), null);
  assert.equal(umamiDataHostUrl(settings), null);
  const policy = contentSecurityPolicy(settings);
  assert.equal(policy.includes("umami.is"), false);
  assert.equal(policy.includes("collect.example.eu"), false);
});

test("a non-https host URL is ignored and the gateway stays", () => {
  const settings = {
    websiteId: WEBSITE,
    hostUrl: "http://collect.example.eu",
  };
  assert.equal(umamiDataHostUrl(settings), null);
  assert.equal(umamiCollectOrigin(settings), DEFAULT_UMAMI_COLLECT_ORIGIN);
});
