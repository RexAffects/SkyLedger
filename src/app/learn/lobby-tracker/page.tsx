import type { Metadata } from "next";
import Link from "next/link";
import {
  LOBBY_STATS,
  LOBBYING_FIRMS,
  RAINMAKER_LOBBYING,
  ANTI_BAN_ACTIVITIES,
  LOBBY_TIMELINE,
  LOBBY_RED_FLAGS,
  LOBBY_PIPELINE,
  LOBBY_SOURCE_CATEGORIES,
  DARK_MONEY_LIMITATIONS,
  type LobbyingFirm,
  type AntiBanActivity,
  type LobbyRedFlag,
  type LobbyTimelineEvent,
} from "@/lib/data/lobbying";
import { StateLookup } from "./state-lookup";

export const metadata: Metadata = {
  title: "Lobby Tracker — Who's Lobbying for Geoengineering | SkyLedger",
  description:
    "Who's lobbying for geoengineering and who's taking their money. Federal filings, campaign contributions, anti-ban lobbying, and state-by-state data — every claim sourced.",
};

// ============================================================
// INLINE COMPONENTS
// ============================================================

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function LobbyFirmCard({ firm }: { firm: LobbyingFirm }) {
  return (
    <details className="rounded-lg border border-border group">
      <summary className="cursor-pointer p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold mt-0.5">
          {firm.name.charAt(0)}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-sm">{firm.name}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              {firm.totalSpending}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Client: <strong>{firm.client}</strong> &middot; {firm.period}
          </p>
        </div>
        <svg
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </summary>

      <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
        {/* Details */}
        <ul className="space-y-1.5">
          {firm.details.map((d, i) => (
            <li
              key={i}
              className="text-sm text-muted-foreground flex gap-2"
            >
              <span className="shrink-0 text-primary">&bull;</span>
              {d}
            </li>
          ))}
        </ul>

        {/* Lobbyists */}
        {firm.lobbyists.length > 0 && (
          <div>
            <p className="text-xs font-medium">Named lobbyists:</p>
            <p className="text-xs text-muted-foreground">
              {firm.lobbyists.join(", ")}
            </p>
          </div>
        )}

        {/* Issues */}
        <div>
          <p className="text-xs font-medium">Issues lobbied:</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {firm.issues.map((issue, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {issue}
              </span>
            ))}
          </div>
        </div>

        {/* Target agencies */}
        <div>
          <p className="text-xs font-medium">Target agencies:</p>
          <p className="text-xs text-muted-foreground">
            {firm.targetAgencies.join(", ")}
          </p>
        </div>

        {/* Red flags */}
        {firm.redFlags && firm.redFlags.length > 0 && (
          <div className="rounded-md bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800">
            <p className="text-xs font-medium text-red-800 dark:text-red-300">
              Red flags:
            </p>
            <ul className="mt-1 space-y-1">
              {firm.redFlags.map((rf, i) => (
                <li
                  key={i}
                  className="text-xs text-red-700 dark:text-red-400"
                >
                  &bull; {rf}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources */}
        <div className="text-xs text-muted-foreground space-y-0.5 pt-1 border-t border-border">
          {firm.sources.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary hover:underline"
            >
              {s.label} &rarr;
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}

function AntiBanCard({ activity }: { activity: AntiBanActivity }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
          {activity.targetState === "Federal"
            ? "US"
            : activity.targetState}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-sm">{activity.company}</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
              {activity.targetState === "Federal"
                ? "Federal"
                : activity.targetState}
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Target: {activity.targetBill}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {activity.activity}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <strong>Who:</strong> {activity.lobbyistOrFirm} &middot;{" "}
            {activity.date}
          </p>
          {activity.outcome && (
            <p className="mt-1 text-xs font-medium">
              Outcome: {activity.outcome}
            </p>
          )}
          <a
            href={activity.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-primary hover:underline"
          >
            {activity.source.label} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

function RedFlagCard({
  flag,
  index,
}: {
  flag: LobbyRedFlag;
  index: number;
}) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
          {index + 1}
        </span>
        <div>
          <h4 className="font-semibold text-sm text-red-900 dark:text-red-200">
            {flag.flag}
          </h4>
          <p className="mt-1 text-sm text-red-800 dark:text-red-300">
            {flag.detail}
          </p>
          <a
            href={flag.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Source: {flag.source.label} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

const TIMELINE_TYPE_COLORS: Record<
  LobbyTimelineEvent["type"],
  string
> = {
  lobbying:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  legislation:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  funding:
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  testimony:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
};

// ============================================================
// PAGE
// ============================================================

export default function LobbyTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/learn"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Knowledge Base
      </Link>

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}
      <h1 className="mt-6 text-3xl font-bold">Lobby Tracker</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Who&apos;s lobbying for geoengineering &mdash; and who&apos;s
        taking their money. Federal filings, anti-ban testimony, and
        state-by-state data. Every filing below links to its primary
        source on LDA.gov, OpenSecrets, or state disclosure databases.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          value={LOBBY_STATS.totalLobbyingSpend}
          label="Federal lobbying spend (2024–2025)"
        />
        <StatCard
          value={LOBBY_STATS.kStreetFirms}
          label="K Street firms hired"
        />
        <StatCard
          value={LOBBY_STATS.statesWithActivity}
          label="States with ban bills facing opposition"
        />
        <StatCard
          value={LOBBY_STATS.fedBills}
          label="Federal bills targeted by lobbying"
        />
      </div>

      {/* Rainmaker callout */}
      <div className="mt-6 rounded-lg border-2 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 p-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-600 text-white">
            KEY FINDING
          </span>
          <span className="text-sm font-bold text-orange-800 dark:text-orange-200">
            Rainmaker: $450K to Fight the Ban
          </span>
        </div>
        <p className="mt-2 text-sm text-orange-800 dark:text-orange-300">
          Rainmaker Technology spent{" "}
          <strong>{RAINMAKER_LOBBYING.totalSpending2025}</strong> on
          federal lobbying in 2025 &mdash;{" "}
          <strong>{RAINMAKER_LOBBYING.multiplier}</strong>. Their top
          priority: defeating the Clear Skies Act (H.R. 4403), which
          would criminalize what they do. They hired{" "}
          {RAINMAKER_LOBBYING.firmCount} K Street firms and briefed the
          White House and Pentagon.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {RAINMAKER_LOBBYING.sources.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
            >
              {s.label} &rarr;
            </a>
          ))}
        </div>
      </div>

      {/* ====================================================== */}
      {/* THE LOBBYING MACHINE */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          The Lobbying Machine
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          These are the lobbying firms hired by geoengineering companies
          to influence federal policy. Each entry is sourced from LDA.gov
          filings or investigative reporting.
        </p>
        <div className="mt-4 space-y-3">
          {LOBBYING_FIRMS.map((firm) => (
            <LobbyFirmCard key={firm.slug} firm={firm} />
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* FIGHTING THE BANS */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Fighting the Bans
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          When states try to ban geoengineering, the industry shows up to
          fight. Here are the specific documented instances of companies
          lobbying against ban legislation.
        </p>
        <div className="mt-4 space-y-3">
          {ANTI_BAN_ACTIVITIES.map((activity, i) => (
            <AntiBanCard key={i} activity={activity} />
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* THE PIPELINE CONTINUES */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          The Pipeline: Research &rarr; Lobbying &rarr; Profit &rarr;
          Protection
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This is how the same money flows through every stage &mdash;
          from funding the research to lobbying for government programs to
          investing in deployment companies to fighting the bans.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {LOBBY_PIPELINE.map((step) => (
            <div
              key={step.step}
              className="rounded-lg border border-border p-4"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {step.step}
              </span>
              <h3 className="mt-2 font-semibold text-sm">{step.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {step.description}
              </p>
              <ul className="mt-2 space-y-0.5">
                {step.entities.map((e, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground"
                  >
                    &bull; {e}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium border-t border-border pt-2">
                {step.lobbyConnection}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/learn/follow-the-money"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See the full funding network on Follow the Money &rarr;
          </Link>
        </div>
      </section>

      {/* ====================================================== */}
      {/* TIMELINE */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Timeline
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          How geoengineering lobbying has escalated from a single
          nonprofit to a multi-firm industry operation.
        </p>
        <div className="mt-6 space-y-0">
          {LOBBY_TIMELINE.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${TIMELINE_TYPE_COLORS[event.type]}`}
                >
                  {event.type === "lobbying"
                    ? "$"
                    : event.type === "legislation"
                      ? "L"
                      : event.type === "testimony"
                        ? "T"
                        : "F"}
                </div>
                {i < LOBBY_TIMELINE.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-xs font-medium text-muted-foreground">
                  {event.date}
                </p>
                <p className="text-sm mt-0.5">{event.event}</p>
                {event.source && (
                  <a
                    href={event.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-[10px] text-primary hover:underline"
                  >
                    {event.source.label} &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* LOOK UP YOUR STATE */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Look Up Your State
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Select your state to see ban status, lobbying activity, and
          industry opposition. If we don&apos;t have data for your state
          yet, you can help us research it.
        </p>
        <div className="mt-4">
          <StateLookup />
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHAT YOU WON'T SEE HERE */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          What You Won&apos;t See Here
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Lobbying disclosure has real limits. We show only what&apos;s in
          the public record. Here&apos;s what the system doesn&apos;t
          capture:
        </p>
        <div className="mt-4 space-y-3">
          {DARK_MONEY_LIMITATIONS.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold">{item.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* RED FLAGS */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Red Flags
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Patterns in the lobbying data that should concern anyone
          watching this industry.
        </p>
        <div className="mt-4 space-y-3">
          {LOBBY_RED_FLAGS.map((flag, i) => (
            <RedFlagCard key={i} flag={flag} index={i} />
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* VERIFY IT YOURSELF */}
      {/* ====================================================== */}
      <section className="mt-12">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Verify It Yourself
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Every data point on this page can be independently verified
          through these public databases:
        </p>
        <div className="mt-4 space-y-4">
          {LOBBY_SOURCE_CATEGORIES.map((cat, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold">{cat.title}</h3>
              <ul className="mt-1 space-y-0.5">
                {cat.sources.map((s, j) => (
                  <li key={j}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {s.label} &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* BOTTOM LINE + CROSS-LINKS */}
      {/* ====================================================== */}
      <section className="mt-12 mb-8">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="font-semibold">The Bottom Line</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Geoengineering companies are spending hundreds of thousands
            of dollars to fight the very laws designed to protect you.
            The same investors who fund the lobbying also fund the
            deployment companies. When your legislator says there&apos;s
            no need for a ban, ask them to check the lobbying filings.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every item on this page is independently verifiable through
            public records. We&apos;re not asking anyone to believe
            anything &mdash; we&apos;re showing you what&apos;s in the
            filings.
          </p>
        </div>

        {/* Cross-links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/learn/follow-the-money" className="block group">
            <div className="rounded-lg border border-border p-4 h-full transition-all hover:border-primary/40 hover:shadow-sm">
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                Follow the Money
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                The full funding network &mdash; who funds the research,
                the companies, and the lobbying.
              </p>
            </div>
          </Link>
          <Link
            href="/get-involved/contact-legislator"
            className="block group"
          >
            <div className="rounded-lg border border-border p-4 h-full transition-all hover:border-primary/40 hover:shadow-sm">
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                Contact Your Legislator
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Ready-to-use templates for pushing a ban in your state.
              </p>
            </div>
          </Link>
          <Link href="/get-involved/toolkit" className="block group">
            <div className="rounded-lg border border-border p-4 h-full transition-all hover:border-primary/40 hover:shadow-sm">
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                Citizen Action Toolkit
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Phone scripts, email templates, testimony guides, and
                social media share kit.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
