import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/newsletter";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const email =
    body && typeof body === "object" && "email" in body
      ? (body as { email?: unknown }).email
      : undefined;
  const result = subscribeNewsletter(email);

  if (result.status === "invalid") {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 501 });
}
