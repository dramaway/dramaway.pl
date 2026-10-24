import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseContact, smtpConfig } from "@/lib/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const parsed = parseContact(body);
  if (parsed.status === "invalid") {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
  // Bots get the same answer as people; nothing is sent.
  if (parsed.status === "spam") return NextResponse.json({ status: "ok" });

  const config = smtpConfig();
  if (!config) {
    return NextResponse.json({ status: "unconfigured" }, { status: 501 });
  }

  const { name, email, subject, message } = parsed.value;
  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
    await transport.sendMail({
      from: config.from,
      to: config.to,
      replyTo: { name, address: email },
      subject: `[Formularz] ${subject || "Wiadomość ze strony"}`,
      text: `Od: ${name} <${email}>\n\n${message}\n`,
    });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 502 });
  }
  return NextResponse.json({ status: "ok" });
}
