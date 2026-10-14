import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isNewsletterEmail,
  isNewsletterEnabled,
  mailerLiteConfigured,
  subscribeNewsletter,
} from "../../apps/web/src/lib/newsletter.ts";

test("a missing newsletter switch stays on", () => {
  assert.equal(isNewsletterEnabled(undefined), true);
  assert.equal(isNewsletterEnabled(null), true);
  assert.equal(isNewsletterEnabled(true), true);
});

test("an explicit false hides the newsletter", () => {
  assert.equal(isNewsletterEnabled(false), false);
});

test("newsletter addresses need a domain", () => {
  assert.equal(isNewsletterEmail("biuro@dramaway.pl"), true);
  assert.equal(isNewsletterEmail("  biuro@dramaway.pl  "), true);
  assert.equal(isNewsletterEmail("wpisz swój e-mail"), false);
  assert.equal(isNewsletterEmail(""), false);
  assert.equal(isNewsletterEmail("a@b"), false);
  assert.equal(isNewsletterEmail(null), false);
});

test("subscribe does not send, even when MailerLite secrets exist", () => {
  assert.deepEqual(subscribeNewsletter("not-an-email"), { status: "invalid" });
  assert.deepEqual(subscribeNewsletter("biuro@dramaway.pl"), {
    status: "unconfigured",
  });
  assert.equal(
    mailerLiteConfigured({
      MAILERLITE_API_KEY: "key",
      MAILERLITE_GROUP_ID: "4",
    }),
    true,
  );
  assert.equal(mailerLiteConfigured({}), false);
  assert.deepEqual(subscribeNewsletter("biuro@dramaway.pl"), {
    status: "unconfigured",
  });
});
