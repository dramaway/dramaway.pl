"use client";

import { useState, type FormEvent } from "react";
import { SUBPAGE } from "@/lib/subpage-copy";

type Status = "idle" | "pending" | "invalid" | "unconfigured" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const copy = SUBPAGE.newsletter;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setStatus("pending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json().catch(() => null)) as {
        status?: string;
      } | null;
      if (response.status === 400 || payload?.status === "invalid") {
        setStatus("invalid");
        return;
      }
      if (response.status === 501 || payload?.status === "unconfigured") {
        setStatus("unconfigured");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "invalid"
      ? copy.invalid
      : status === "unconfigured"
        ? copy.unconfigured
        : status === "error"
          ? copy.error
          : null;

  return (
    <form className="footer-newsletter" onSubmit={onSubmit}>
      <p className="footer-newsletter-lead">{copy.lead}</p>
      <div className="footer-newsletter-row">
        <label
          className="footer-newsletter-label"
          htmlFor="footer-newsletter-email"
        >
          {copy.emailLabel}
        </label>
        <input
          id="footer-newsletter-email"
          className="footer-newsletter-input"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder={copy.placeholder}
          disabled={status === "pending"}
        />
        <button type="submit" className="cta" disabled={status === "pending"}>
          <span>{status === "pending" ? copy.pending : copy.submit}</span>
          <span aria-hidden className="cta-rule" />
        </button>
      </div>
      {message ? (
        <p className="footer-newsletter-status" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
