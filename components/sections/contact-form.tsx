"use client";

import { useState } from "react";
import { IconMail } from "@/components/icons";
import { ActionButton } from "@/components/ui/action-button";
import { CONTACT_PANEL, INPUT_FIELD } from "@/lib/styles";

export function ContactForm() {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  async function submitMail() {
    setStatus("idle");
    setStatusMsg("");

    if (!message.trim()) {
      setStatus("error");
      setStatusMsg("Please write a message first.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: fromEmail, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setStatusMsg(data?.error || "Failed to send. Please try again.");
        return;
      }

      setStatus("success");
      setStatusMsg("Message sent successfully. Thanks!");
      setName("");
      setFromEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusMsg("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function resetStatusOnEdit() {
    if (status !== "idle") {
      setStatus("idle");
      setStatusMsg("");
    }
  }

  return (
    <div className="h-full min-w-0">
      <div className={CONTACT_PANEL}>
        <h3 className="text-xl font-normal">Send a message</h3>

        <div className="mt-6 grid min-w-0 gap-4">
          <div className="grid gap-2">
            <label htmlFor="contact-name" className="text-xs text-white/70">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                resetStatusOnEdit();
              }}
              className={INPUT_FIELD}
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-email" className="text-xs text-white/70">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={fromEmail}
              onChange={(e) => {
                setFromEmail(e.target.value);
                resetStatusOnEdit();
              }}
              className={INPUT_FIELD}
              placeholder="your@email.com"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-message" className="text-xs text-white/70">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              autoComplete="off"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                resetStatusOnEdit();
              }}
              className={`min-h-[140px] resize-none ${INPUT_FIELD}`}
              placeholder="Write your message..."
            />
          </div>

          <div className="mt-2 flex items-center gap-3 [&>button]:w-full sm:[&>button]:w-auto">
            <ActionButton onClick={submitMail} icon={<IconMail />}>
              {sending ? "Sending..." : "Send message"}
            </ActionButton>
          </div>

          {status !== "idle" ? (
            <div
              className={
                "mt-4 rounded-2xl border p-4 text-sm backdrop-blur " +
                (status === "success"
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                  : "border-rose-400/25 bg-rose-400/10 text-rose-100")
              }
            >
              {statusMsg}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
