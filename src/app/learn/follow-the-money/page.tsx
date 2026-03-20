import type { Metadata } from "next";
import Link from "next/link";
import {
  FUNDING_TIMELINE,
  PIPELINE_STEPS,
  PLAYERS,
  CONNECTIONS,
  RED_FLAGS,
  SOURCE_CATEGORIES,
  type NetworkPlayer,
  type NetworkConnection,
  type PipelineStep as PipelineStepType,
  type FundingEntry,
  type AggregatedRedFlag,
  type NetworkSource,
} from "@/lib/data/network";

export const metadata: Metadata = {
  title: "Follow the Money — Who Funds Geoengineering | SkyLedger",
  description:
    "The funding network behind geoengineering: $150M+ from a small network of connected investors with defense ties, Epstein connections, and political access. Every claim sourced.",
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

function FundingBar({ entry, maxAmount }: { entry: FundingEntry; maxAmount: number }) {
  const pct = maxAmount > 0 ? Math.max((entry.amountNumeric / maxAmount) * 100, 2) : 2;
  return (
    <div className="flex items-start gap-3 text-xs">
      <span className="shrink-0 w-24 font-medium text-right pt-0.5">
        {entry.period}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div
            className="h-5 rounded bg-red-500/80 dark:bg-red-500/60 transition-all"
            style={{ width: `${pct}%` }}
          />
          <span className="font-bold whitespace-nowrap">{entry.amount}</span>
        </div>
        <ul className="mt-1 space-y-0.5 text-muted-foreground">
          {entry.events.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PipelineCard({ step }: { step: PipelineStepType }) {
  return (
    <div className="rounded-lg border border-border p-4 relative flex-1">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {step.step}
      </span>
      <h3 className="mt-2 font-semibold text-sm">{step.label}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
      <ul className="mt-2 space-y-0.5">
        {step.entities.map((e, i) => (
          <li key={i} className="text-xs text-muted-foreground">
            &bull; {e}
          </li>
        ))}
      </ul>
      {step.saccaRole && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium border-t border-border pt-2">
          Sacca: {step.saccaRole}
        </p>
      )}
    </div>
  );
}

const TYPE_COLORS: Record<NetworkPlayer["type"], string> = {
  fund: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  individual:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "defense-vc":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  corporate:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  research:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const TYPE_LABELS: Record<NetworkPlayer["type"], string> = {
  fund: "Investment Fund",
  individual: "Individual",
  "defense-vc": "Defense/Intelligence VC",
  corporate: "Corporate",
  research: "Research Funder",
};

function PlayerCard({ player }: { player: NetworkPlayer }) {
  return (
    <details className="group rounded-lg border border-border overflow-hidden [&>summary]:cursor-pointer [&>summary]:list-none [&>summary::-webkit-details-marker]:hidden">
      <summary className="p-4 hover:bg-muted/30 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm">{player.name}</h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[player.type]}`}
              >
                {TYPE_LABELS[player.type]}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {player.tagline}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {player.keyStats.map((s, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded border border-border font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <svg
            className="h-4 w-4 shrink-0 mt-1 text-muted-foreground transition-transform group-open:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </summary>

      <div className="border-t border-border p-4 space-y-4 bg-muted/10">
        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {player.summary}
        </p>

        {/* Sections */}
        {player.sections.map((section, i) => (
          <div key={i}>
            <h4 className="text-xs font-semibold text-foreground mb-1.5">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.content.map((item, j) => (
                <li
                  key={j}
                  className="text-xs text-muted-foreground leading-relaxed pl-3 relative before:content-['\2022'] before:absolute before:left-0 before:text-muted-foreground/50"
                >
                  {item}
                </li>
              ))}
            </ul>
            {section.sources && section.sources.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {section.sources.map((s, k) => (
                  <SourceLink key={k} source={s} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Quotes */}
        {player.quotes && player.quotes.length > 0 && (
          <div className="space-y-2">
            {player.quotes.map((q, i) => (
              <blockquote
                key={i}
                className="border-l-2 border-primary pl-3 text-xs italic text-muted-foreground"
              >
                &ldquo;{q.text}&rdquo;
                {q.speaker && (
                  <span className="block mt-0.5 not-italic font-medium">
                    &mdash; {q.speaker}
                  </span>
                )}
              </blockquote>
            ))}
          </div>
        )}

        {/* Red Flags */}
        {player.redFlags && player.redFlags.length > 0 && (
          <div className="rounded border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-3">
            <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1.5">
              Red Flags
            </p>
            <ul className="space-y-1">
              {player.redFlags.map((rf, i) => (
                <li
                  key={i}
                  className="text-xs text-red-700 dark:text-red-400 pl-3 relative before:content-['\26A0'] before:absolute before:left-0"
                >
                  {rf}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Social Media */}
        {player.socialMedia && player.socialMedia.length > 0 && (
          <div className="flex items-center gap-3">
            {player.socialMedia.map((sm, i) => (
              <a
                key={i}
                href={sm.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline"
              >
                {sm.platform}: {sm.handle} &rarr;
              </a>
            ))}
          </div>
        )}

        {/* Link to operator profile */}
        {player.operatorSlug && (
          <Link
            href={`/learn/operators/${player.operatorSlug}`}
            className="inline-block text-xs text-primary font-medium hover:underline"
          >
            Full operator profile &rarr;
          </Link>
        )}

        {/* Sources */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {player.sources.map((s, i) => (
            <SourceLink key={i} source={s} />
          ))}
        </div>
      </div>
    </details>
  );
}

const CONNECTION_TYPE_COLORS: Record<NetworkConnection["type"], string> = {
  investor:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  donor:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  advisor:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  partner:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  founder: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

function ConnectionRow({ conn }: { conn: NetworkConnection }) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-2 pr-2 text-xs font-medium whitespace-nowrap align-top">
        {conn.from}
      </td>
      <td className="py-2 pr-2 text-xs font-medium whitespace-nowrap align-top">
        {conn.to}
      </td>
      <td className="py-2 pr-2 text-xs text-muted-foreground align-top">
        {conn.relationship}
      </td>
      <td className="py-2 pr-2 align-top">
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${CONNECTION_TYPE_COLORS[conn.type]}`}
        >
          {conn.type}
        </span>
      </td>
      <td className="py-2 align-top">
        <SourceLink source={conn.source} />
      </td>
    </tr>
  );
}

function ConnectionCard({ conn }: { conn: NetworkConnection }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium">{conn.from}</span>
        <span className="text-xs text-muted-foreground">&rarr;</span>
        <span className="text-xs font-medium">{conn.to}</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${CONNECTION_TYPE_COLORS[conn.type]}`}
        >
          {conn.type}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{conn.relationship}</p>
      <div className="mt-1">
        <SourceLink source={conn.source} />
      </div>
    </div>
  );
}

function RedFlagCard({
  flag,
  index,
}: {
  flag: AggregatedRedFlag;
  index: number;
}) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
          {index + 1}
        </span>
        <div>
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            {flag.flag}
          </p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {flag.detail}
          </p>
          <div className="mt-1">
            <SourceLink source={flag.source} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceLink({ source }: { source: NetworkSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[10px] text-primary hover:underline"
    >
      {source.label} &rarr;
    </a>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function FollowTheMoneyPage() {
  const maxFunding = Math.max(...FUNDING_TIMELINE.map((e) => e.amountNumeric));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/learn"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Knowledge Base
      </Link>

      {/* ============================================================ */}
      {/* SECTION 1: HERO */}
      {/* ============================================================ */}
      <section className="mt-6">
        <h1 className="text-3xl font-bold">Follow the Money</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Who funds geoengineering &mdash; and how they&apos;re connected
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard value="$150M+" label="Total geoengineering startup funding" />
          <StatCard value="$105M+" label="Invested in 2025 alone" />
          <StatCard value="1 fund" label="At every seat of the pipeline" />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Every claim below links to its primary source. Verify everything
          yourself.
        </p>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: THE ACCELERATION */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          The Acceleration
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          More money poured into geoengineering startups in 2025 than the
          entire prior history combined.
        </p>

        <div className="mt-4 space-y-4">
          {FUNDING_TIMELINE.map((entry) => (
            <FundingBar
              key={entry.period}
              entry={entry}
              maxAmount={maxFunding}
            />
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-4">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            $105M+ in 2025 &mdash; more than the entire prior history combined.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            The money is moving from &ldquo;study it&rdquo; to &ldquo;build
            and deploy.&rdquo; Stardust alone accounts for ~65% of all
            geoengineering startup funding.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: THE PIPELINE */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          The Pipeline
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Fund the research, lobby for government support, invest in deployment
          companies, collect the contracts. One fund &mdash; Lowercarbon
          Capital (Chris Sacca) &mdash; sits at every seat.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE_STEPS.map((step) => (
            <PipelineCard key={step.step} step={step} />
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm font-semibold">
            The full loop
          </p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Fund the research (Harvard SGRP) &rarr; Lobby for government
            support (SilverLining) &rarr; Invest in the companies that get
            deployment contracts (Stardust, Rainmaker) &rarr; Governments
            can&apos;t stop once they start (termination shock) &rarr;
            Perpetual revenue.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Chris Sacca publicly said he had &ldquo;zero financial
            interests&rdquo; in geoengineering. Then he occupied every seat in
            the pipeline.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: KEY PLAYERS */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Key Players
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          8 profiles of the investors and entities behind geoengineering.
          Click to expand.
        </p>

        <div className="mt-4 space-y-3">
          {PLAYERS.map((player) => (
            <PlayerCard key={player.slug} player={player} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: THE NETWORK */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          The Network
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {CONNECTIONS.length} documented cross-connections between investors,
          defense agencies, political figures, and geoengineering companies.
        </p>

        {/* Desktop table */}
        <div className="mt-4 hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-2 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                  From
                </th>
                <th className="py-2 pr-2 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                  To
                </th>
                <th className="py-2 pr-2 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                  Relationship
                </th>
                <th className="py-2 pr-2 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                  Type
                </th>
                <th className="py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {CONNECTIONS.map((conn, i) => (
                <ConnectionRow key={i} conn={conn} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 sm:hidden space-y-2">
          {CONNECTIONS.map((conn, i) => (
            <ConnectionCard key={i} conn={conn} />
          ))}
        </div>

        {/* Key observations */}
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <h3 className="text-sm font-semibold">Key Observations</h3>
          <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">The Palantir Node:</strong>{" "}
              Lauder and Thiel are both early Palantir investors. Palantir now
              has a strategic defense partnership with the Israeli Defense
              Ministry. This is the strongest direct financial link between two
              key network nodes.
            </p>
            <p>
              <strong className="text-foreground">The Epstein Node:</strong>{" "}
              Both Lauder (900+ DOJ file mentions) and Thiel ($40M fund) had
              documented relationships with Jeffrey Epstein. Epstein
              specifically brokered connections between Thiel and Israeli
              defense/intelligence.
            </p>
            <p>
              <strong className="text-foreground">
                The Geoengineering Pipeline:
              </strong>{" "}
              Sacca and Cohler co-funded SilverLining geoengineering
              lobbying in 2020, then both invested in Stardust&apos;s $60M
              commercial round in 2025. Coordinated move from nonprofit
              research to for-profit deployment.
            </p>
            <p>
              <strong className="text-foreground">
                The Israeli Defense Thread:
              </strong>{" "}
              Stardust&apos;s founders came from Israeli nuclear programs. AWZ
              (seed investor) is formally partnered with the Israeli MoD.
              Palantir (Lauder + Thiel) has a strategic defense partnership
              with Israel. The common thread isn&apos;t just climate &mdash;
              it&apos;s Israel.
            </p>
            <p>
              <strong className="text-foreground">
                Trump Administration Access:
              </strong>{" "}
              Both Lauder and Thiel are major Trump donors with direct White
              House access. Geoengineering regulation (or lack thereof) is a
              government decision. The people funding geoengineering have
              direct access to the people who decide whether to regulate it.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: THE FOUNDERS */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          The Founders
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The three co-founders of Stardust Solutions &mdash; the most funded
          geoengineering company in existence &mdash; all come from Israel&apos;s
          nuclear weapons establishment.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm">Yanai Yedvab</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              CEO &amp; Co-founder
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              30 years in Israeli national labs. Head of the Physics Division at
              the Negev Nuclear Research Center (Dimona). Deputy Chief Research
              Scientist at the Israel Atomic Energy Commission (2011-2015).
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm">Amyad Spector</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              CPO &amp; Co-founder
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Physics researcher at Dimona. Nearly a decade of &ldquo;unspecified
              government R&amp;D.&rdquo; No public quotes in any media article.
              No interviews. The &ldquo;ghost founder.&rdquo;
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm">Eli Waxman</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lead Scientist &amp; Co-founder
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Astrophysicist at Weizmann Institute. 170 papers, 23K citations.
              Former Chief Scientist of the IAEC (2013-2015). Headed PM&apos;s
              COVID advisory committee.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold">
            Zero published papers on geoengineering
          </p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Despite building the world&apos;s most-funded geoengineering
            company, none of the three founders have published a single
            peer-reviewed paper on geoengineering, atmospheric science, or
            aerosols. Waxman is a world-class astrophysicist &mdash; but his
            170 papers are all in astrophysics, not atmospheric science.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Cornell researcher Douglas MacMartin: &ldquo;They&apos;ve ignored
            every recommendation from everyone and think they can turn a
            profit in this field.&rdquo;
          </p>
          <Link
            href="/learn/operators/stardust-solutions"
            className="mt-2 inline-block text-xs text-primary font-medium hover:underline"
          >
            Full Stardust Solutions profile &rarr;
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7: RED FLAGS */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Red Flags
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {RED_FLAGS.length} documented concerns across the funding network.
          Each one is sourced.
        </p>

        <div className="mt-4 space-y-3">
          {RED_FLAGS.map((flag, i) => (
            <RedFlagCard key={i} flag={flag} index={i} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8: VERIFY IT YOURSELF */}
      {/* ============================================================ */}
      <section className="mt-10 mb-8">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Verify It Yourself
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Don&apos;t take our word for it. Every claim on this page links to
          its primary source. Here they are, organized by topic.
        </p>

        <div className="mt-4 space-y-4">
          {SOURCE_CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <h3 className="text-xs font-semibold text-foreground mb-2">
                {cat.title}
              </h3>
              <div className="space-y-1">
                {cat.sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-primary hover:underline"
                  >
                    {s.label} &rarr;
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-sm font-semibold">The Bottom Line</p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            $150M+ is flowing into companies that want to spray the atmosphere
            with secret particles, founded by nuclear weapons scientists, funded
            by intelligence-connected VCs, with investors who have documented
            Epstein ties and direct access to the White House. The scientific
            community overwhelmingly opposes them. 600+ scientists signed a
            non-use agreement. Three states have banned it. And still the money
            accelerates.
          </p>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            We&apos;re not asking anyone to believe anything. We&apos;re
            presenting documented facts and asking: why?
          </p>
        </div>
      </section>
    </div>
  );
}
