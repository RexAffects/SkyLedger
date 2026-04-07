import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, page, type } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 });
    }

    const address = process.env.GMAIL_ADDRESS;
    const password = process.env.GMAIL_APP_PASSWORD;

    if (!address || !password) {
      console.warn("Gmail not configured — feedback not sent");
      return NextResponse.json({ success: true });
    }

    const subject = `[SkyLedger Feedback] ${type === "bug" ? "Bug Report" : type === "feature" ? "Feature Request" : "Feedback"} — ${page || "unknown page"}`;

    const text = [
      `Type: ${type || "general"}`,
      `Page: ${page || "not specified"}`,
      `Time: ${new Date().toISOString()}`,
      "",
      "Message:",
      message.trim(),
    ].join("\n");

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: address, pass: password },
    });

    await transport.sendMail({
      from: address,
      to: address,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
