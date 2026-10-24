import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseContact,
  smtpConfig,
} from "../../apps/web/src/lib/contact.ts";

const valid = {
  name: "Ola",
  email: "ola@example.com",
  subject: "Cześć",
  message: "Treść",
  consent: true,
};

test("valid message passes and is trimmed", () => {
  const result = parseContact({ ...valid, name: "  Ola " });
  assert.equal(result.status, "ok");
  assert.equal(result.value.name, "Ola");
});

test("missing consent, bad email, empty message are invalid", () => {
  assert.equal(parseContact({ ...valid, consent: false }).status, "invalid");
  assert.equal(parseContact({ ...valid, email: "x" }).status, "invalid");
  assert.equal(parseContact({ ...valid, message: " " }).status, "invalid");
  assert.equal(parseContact(null).status, "invalid");
});

test("honeypot is spam; subject newlines are flattened", () => {
  assert.equal(parseContact({ ...valid, website: "x" }).status, "spam");
  const result = parseContact({ ...valid, subject: "a\r\nBcc: x" });
  assert.equal(result.value.subject, "a Bcc: x");
});

test("smtp config needs host, user and password", () => {
  assert.equal(smtpConfig({}), null);
  const config = smtpConfig({
    SMTP_HOST: "h",
    SMTP_USER: "u",
    SMTP_PASS: "p",
  });
  assert.equal(config.to, "biuro@dramaway.pl");
  assert.equal(config.port, 587);
});
