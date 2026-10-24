"use client";

import { useState, type FormEvent } from "react";
import {
  CONTACT_FORM_ENDPOINT,
  CONTACT_FORM_NAME,
  CONTACT_LIMITS,
} from "@/lib/contact";
import { SUBPAGE } from "@/lib/subpage-copy";

type Status =
  | "idle"
  | "pending"
  | "success"
  | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const copy = SUBPAGE.contact.form;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("pending");
    try {
      const params = new URLSearchParams({
        "form-name": CONTACT_FORM_NAME,
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
        website: String(data.get("website") ?? ""),
        consent: data.get("consent") === "on" ? "tak" : "",
      });
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (response.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "success"
      ? copy.success
      : status === "error"
        ? copy.error
        : null;
  const disabled = status === "pending";

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-field">
        <label htmlFor="contact-name">{copy.name}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.name}
          disabled={disabled}
        />
      </div>
      <div className="contact-field">
        <label htmlFor="contact-email">{copy.email}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={CONTACT_LIMITS.email}
          disabled={disabled}
        />
      </div>
      <div className="contact-field contact-field-wide">
        <label htmlFor="contact-subject">{copy.subject}</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          maxLength={CONTACT_LIMITS.subject}
          disabled={disabled}
        />
      </div>
      <div className="contact-field contact-field-wide">
        <label htmlFor="contact-message">{copy.message}</label>
        <textarea
          id="contact-message"
          name="message"
          rows={7}
          required
          maxLength={CONTACT_LIMITS.message}
          disabled={disabled}
        />
      </div>
      <div className="contact-trap" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="contact-consent contact-field-wide">
        <input type="checkbox" name="consent" required disabled={disabled} />
        <span>{copy.consent}</span>
      </label>
      <div className="contact-actions contact-field-wide">
        <button type="submit" className="cta" disabled={disabled}>
          <span>{disabled ? copy.pending : copy.submit}</span>
          <span aria-hidden className="cta-rule" />
        </button>
        {message ? (
          <p className="contact-status" role="status" data-status={status}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
