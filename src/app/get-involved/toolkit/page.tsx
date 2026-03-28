"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PHONE_SCRIPT,
  PHONE_TIPS,
  EMAIL_TEMPLATES,
  LETTER_TEMPLATE,
  TESTIMONY_SCRIPT,
  TESTIMONY_TIPS,
  SOCIAL_POSTS,
  FOLLOW_UP_STEPS,
  type EmailTemplate,
} from "@/lib/data/toolkit";

// ---------------------------------------------------------------------------
// Copy Button (inline, supports custom label)
// ---------------------------------------------------------------------------

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
    >
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
        />
      </svg>
      {copied ? "Copied!" : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Section anchor nav
// ---------------------------------------------------------------------------

const sections = [
  { id: "call", label: "Phone Script" },
  { id: "email", label: "Email Templates" },
  { id: "letter", label: "Formal Letter" },
  { id: "testify", label: "Hearing Testimony" },
  { id: "share", label: "Share Kit" },
  { id: "follow-up", label: "Follow Up" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ToolkitPage() {
  const [selectedEmail, setSelectedEmail] = useState<EmailTemplate>(
    EMAIL_TEMPLATES[0],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/get-involved"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Get Involved
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Citizen Action Toolkit</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Everything you need to contact your legislator, testify at hearings, and
        share the facts &mdash; ready to copy, customize, and send. Each tool
        takes 5 minutes or less.
      </p>

      {/* Jump links */}
      <nav className="mt-6 flex flex-wrap gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted transition-colors"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* ================================================================ */}
      {/* 1. PHONE CALL SCRIPT */}
      {/* ================================================================ */}
      <section id="call" className="mt-12 scroll-mt-20">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold">
            1
          </span>
          <h2 className="text-xl font-bold">Phone Call Script</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            60 seconds
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Phone calls are the <strong>#1 most impactful</strong> form of
          constituent contact. Legislative offices tally every call. This takes
          60 seconds.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-5">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
            {PHONE_SCRIPT}
          </pre>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <CopyBtn text={PHONE_SCRIPT} label="Copy Script" />
          <span className="text-xs text-muted-foreground">
            Fill in [YOUR NAME], [CITY], [STATE], and [LEGISLATOR NAME]
          </span>
        </div>

        {/* What to expect */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold">What to expect when you call</h3>
          <div className="mt-3 space-y-3">
            {PHONE_TIPS.map((tip, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legislator lookup */}
        <div className="mt-6 rounded-lg border-2 border-primary/30 bg-primary/5 p-5">
          <h3 className="font-semibold text-sm">Find Your Legislator</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            You need your <strong>state</strong> representative and senator (not
            federal). Enter your address to find them.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="https://openstates.org/find_your_legislator/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Find State Legislator &rarr;
            </a>
            <a
              href="https://www.house.gov/representatives/find-your-representative"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition-colors"
            >
              Find Federal Representative
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. EMAIL TEMPLATES */}
      {/* ================================================================ */}
      <section id="email" className="mt-12 scroll-mt-20">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold">
            2
          </span>
          <h2 className="text-xl font-bold">Email Templates</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            4 templates
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Different emails for different stages. Start with First Contact, then
          follow up if you don&apos;t hear back.
        </p>

        {/* Template selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {EMAIL_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedEmail(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedEmail.id === t.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {t.name}
              <span className="ml-1.5 text-[10px] opacity-70">{t.badge}</span>
            </button>
          ))}
        </div>

        {/* Selected template */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">
            <span className="font-medium">Subject:</span> {selectedEmail.subject}
          </p>
          <div className="rounded-lg border border-border bg-muted/30 p-5">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
              {selectedEmail.body}
            </pre>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <CopyBtn
              text={`Subject: ${selectedEmail.subject}\n\n${selectedEmail.body}`}
              label="Copy Email"
            />
            <span className="text-xs text-muted-foreground">
              Fill in the [BRACKETED] sections — the rest is ready
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. FORMAL LETTER */}
      {/* ================================================================ */}
      <section id="letter" className="mt-12 scroll-mt-20">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-bold">
            3
          </span>
          <h2 className="text-xl font-bold">Formal Letter</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            2 minutes
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          A formal letter carries more weight than an email. Print it, sign it,
          and mail it — or send it as an attachment. Based on the approach that
          passed Florida&apos;s felony ban.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-5">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
            {LETTER_TEMPLATE}
          </pre>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <CopyBtn text={LETTER_TEMPLATE} label="Copy Letter" />
          <span className="text-xs text-muted-foreground">
            Fill in [YOUR NAME], [STATE NAME], and [LEGISLATOR NAME]
          </span>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. COMMITTEE HEARING TESTIMONY */}
      {/* ================================================================ */}
      <section id="testify" className="mt-12 scroll-mt-20">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-bold">
            4
          </span>
          <h2 className="text-xl font-bold">Committee Hearing Testimony</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            2 minutes
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          When a bill reaches committee, the public can testify. This is the
          most powerful thing a citizen can do — show up and speak. Here&apos;s a
          template to get you started.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-5">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
            {TESTIMONY_SCRIPT}
          </pre>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <CopyBtn text={TESTIMONY_SCRIPT} label="Copy Testimony" />
          <span className="text-xs text-muted-foreground">
            Add your personal statement — 1-2 sentences about why this matters to
            you
          </span>
        </div>

        {/* Tips */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Tips for testifying</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {TESTIMONY_TIPS.map((tip, i) => (
              <div
                key={i}
                className="rounded-lg border border-border p-3"
              >
                <p className="text-sm font-medium">{tip.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tip.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. SOCIAL MEDIA SHARE KIT */}
      {/* ================================================================ */}
      <section id="share" className="mt-12 scroll-mt-20">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm font-bold">
            5
          </span>
          <h2 className="text-xl font-bold">Social Media Share Kit</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
            Copy &amp; paste
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Pre-written posts for every platform. Copy, paste, post.
        </p>

        <div className="mt-4 space-y-4">
          {SOCIAL_POSTS.map((post, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{post.platform}</span>
                <CopyBtn text={post.text} label="Copy" />
              </div>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed font-sans text-muted-foreground">
                {post.text}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. FOLLOW-UP GUIDE */}
      {/* ================================================================ */}
      <section id="follow-up" className="mt-12 scroll-mt-20 mb-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-bold">
            6
          </span>
          <h2 className="text-xl font-bold">After You Act: Follow Up</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Most people do one thing and stop. Following up is what separates
          noise from pressure. Here&apos;s what to do after each action.
        </p>

        <div className="mt-4 space-y-4">
          {FOLLOW_UP_STEPS.map((step, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{step.afterAction}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-medium">
                  {step.timeline}
                </span>
              </div>
              <ol className="mt-2 space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                {step.steps.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-8 rounded-lg border-2 border-primary/30 bg-primary/5 p-6 text-center">
          <p className="font-semibold">Ready to see what it looks like when it works?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            See the exact timelines and strategies that passed bans in Tennessee,
            Florida, and Louisiana.
          </p>
          <Link
            href="/get-involved/state-ban"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Read the Winning Playbook &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
