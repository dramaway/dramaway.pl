import assert from "node:assert/strict";
import { test } from "node:test";
import { contentSecurityPolicy } from "../../apps/web/src/lib/content-security-policy.ts";
import {
  DEFAULT_UMAMI_SCRIPT_URL,
  UMAMI_TRACKED_DOMAINS,
  umamiCollectOrigin,
  umamiScript,
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
  assert.equal(umamiCollectOrigin({ scriptUrl: DEFAULT_UMAMI_SCRIPT_URL }), null);
  const policy = contentSecurityPolicy({ nodeEnv: "production" });
  assert.equal(policy.includes("umami.is"), false);
  assert.equal(policy.includes("gateway.umami.is"), false);
  assert.match(policy, /upgrade-insecure-requests/);
});

test("a website id loads the default script and one host in both CSP lists", () => {
  const script = umamiScript({ websiteId: `  ${WEBSITE}  ` });
  assert.deepEqual(script, {
    src: DEFAULT_UMAMI_SCRIPT_URL,
    websiteId: WEBSITE,
    domains: UMAMI_TRACKED_DOMAINS,
    hostUrl: "https://cloud.umami.is",
  });
  assert.equal(UMAMI_TRACKED_DOMAINS, "fundacja.dramaway.pl");

  const policy = contentSecurityPolicy({
    nodeEnv: "development",
    websiteId: WEBSITE,
  });
  assert.equal(policy.includes("upgrade-insecure-requests"), false);
  assert.equal(policy.includes("gateway.umami.is"), false);
  const origin = "https://cloud.umami.is";
  assert.equal(directive(policy, "script-src").split(origin).length - 1, 1);
  assert.equal(directive(policy, "connect-src").split(origin).length - 1, 1);
});

test("the script host comes from NEXT_PUBLIC_UMAMI_SCRIPT_URL", () => {
  const script = umamiScript({
    websiteId: WEBSITE,
    scriptUrl: "  https://stats.example.eu/a/script.js  ",
  });
  assert.equal(script.src, "https://stats.example.eu/a/script.js");
  assert.equal(script.hostUrl, "https://stats.example.eu");
  const policy = contentSecurityPolicy({
    websiteId: WEBSITE,
    scriptUrl: "https://stats.example.eu/a/script.js",
  });
  assert.equal(
    directive(policy, "script-src").includes("https://stats.example.eu"),
    true,
  );
  assert.equal(
    directive(policy, "connect-src").includes("https://stats.example.eu"),
    true,
  );
  assert.equal(policy.includes("cloud.umami.is"), false);
});

test("a non-https script URL does not render or widen CSP", () => {
  const settings = {
    websiteId: WEBSITE,
    scriptUrl: "http://cloud.umami.is/script.js",
  };
  assert.equal(umamiScript(settings), null);
  const policy = contentSecurityPolicy(settings);
  assert.equal(policy.includes("umami.is"), false);
});
