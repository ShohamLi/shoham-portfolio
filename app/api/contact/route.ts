import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1) Server config checks (fail fast)
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY is missing" }), { status: 500 });
    }
    if (!to || !from) {
      return new Response(JSON.stringify({ error: "Server email configuration is missing" }), { status: 500 });
    }

    // 2) Parse body
    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
    }

    const nameStr = String(body.name ?? "").trim();
    const emailStr = String(body.email ?? "").trim();
    const messageStr = String(body.message ?? "").trim();

    // 3) Validate fields
    if (!nameStr) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    if (!emailStr) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailStr);
    if (!emailOk) {
      return new Response(JSON.stringify({ error: "Please enter a valid email" }), { status: 400 });
    }

    if (!messageStr) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    // 4) Build email content
    const subject = `Portfolio message from ${nameStr || "Someone"}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6">
        <h2>New portfolio message</h2>
        <p><b>Name:</b> ${escapeHtml(nameStr)}</p>
        <p><b>Email:</b> ${escapeHtml(emailStr)}</p>
        <p><b>Message:</b></p>
        <pre style="background:#f4f4f4;padding:12px;border-radius:8px;white-space:pre-wrap">${escapeHtml(
          messageStr
        )}</pre>
      </div>
    `;

    // 5) Send
    await resend.emails.send({
      from,
      to,
      subject,
      replyTo: emailStr, // now always valid
      html,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to send" }), { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
