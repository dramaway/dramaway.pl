"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_LIMITS } from "@/lib/contact";
import { SUBPAGE } from "@/lib/subpage-copy";

type Status =
  | "idle"
  | "pending"
  | "success"
  | "invalid"
  | "unconfigured"
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
          consent: data.get("consent") === "on",
        }),
      });
      if (response.ok) {
        form.reset();
        setStatus("success");
      } else if (response.status === 400) {
        setStatus("invalid");
      } else if (response.status === 501) {
        setStatus("unconfigured");
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
      : status === "invalid"
        ? copy.invalid
        : status === "unconfigured"
          ? copy.unconfigured
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
