"use client";

import { useState } from "react";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"feedback" | "bug" | "feature">("feedback");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          type,
          page: window.location.pathname,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setMessage("");
        setTimeout(() => {
          setOpen(false);
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
        aria-label="Send feedback"
      >
        {open ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        )}
      </button>

      {/* Feedback panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-xl border border-border bg-background shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Send Feedback</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Help us improve SkyLedger</p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Type selector */}
            <div className="flex gap-1.5">
              {(["feedback", "bug", "feature"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    type === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "bug" ? "Bug" : t === "feature" ? "Feature" : "Feedback"}
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === "bug"
                  ? "What went wrong?"
                  : type === "feature"
                    ? "What would you like to see?"
                    : "Your thoughts..."
              }
              maxLength={1000}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{message.length}/1000</span>
              <button
                type="submit"
                disabled={!message.trim() || status === "sending" || status === "sent"}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : status === "error" ? "Retry" : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
