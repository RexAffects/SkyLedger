"use client";

import { useState } from "react";
import Link from "next/link";
import {
  STATE_LOBBYING,
  type StateLobbyingSummary,
} from "@/lib/data/lobbying";

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

const BAN_STATUS_STYLES: Record<
  StateLobbyingSummary["banStatus"],
  { bg: string; text: string; label: string }
> = {
  enacted: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    label: "Ban Enacted",
  },
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    label: "Bill Pending",
  },
  failed: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    label: "Bill Failed",
  },
  none: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "No Bill Introduced",
  },
};

const ACTIVITY_STYLES: Record<
  StateLobbyingSummary["lobbyingActivity"],
  { color: string; label: string }
> = {
  high: { color: "text-red-600 dark:text-red-400", label: "High" },
  medium: { color: "text-orange-600 dark:text-orange-400", label: "Medium" },
  low: { color: "text-yellow-600 dark:text-yellow-400", label: "Low" },
  none: { color: "text-muted-foreground", label: "None detected" },
};

export function StateLookup() {
  const [selected, setSelected] = useState("");

  const stateData = selected
    ? STATE_LOBBYING.find((s) => s.state === selected)
    : null;

  const stateName =
    US_STATES.find((s) => s.code === selected)?.name ?? selected;

  return (
    <div>
      {/* Dropdown */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="state-select"
          className="text-sm font-medium"
        >
          Select your state:
        </label>
        <select
          id="state-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">— Choose a state —</option>
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {selected && (
        <div className="mt-6 space-y-4">
          {stateData ? (
            <>
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold">{stateData.stateName}</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${BAN_STATUS_STYLES[stateData.banStatus].bg} ${BAN_STATUS_STYLES[stateData.banStatus].text}`}
                >
                  {BAN_STATUS_STYLES[stateData.banStatus].label}
                  {stateData.banBill ? ` — ${stateData.banBill}` : ""}
                </span>
                <span className="text-xs">
                  Lobbying activity:{" "}
                  <span
                    className={`font-medium ${ACTIVITY_STYLES[stateData.lobbyingActivity].color}`}
                  >
                    {ACTIVITY_STYLES[stateData.lobbyingActivity].label}
                  </span>
                </span>
              </div>

              {/* Highlights */}
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold">What we know</h4>
                <ul className="mt-2 space-y-1.5">
                  {stateData.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex gap-2"
                    >
                      <span className="shrink-0 text-primary">&bull;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Anti-ban activity */}
              {stateData.antiBanActivities.length > 0 && (
                <div className="rounded-lg border-2 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 p-4">
                  <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                    Industry Opposition
                  </h4>
                  {stateData.antiBanActivities.map((a, i) => (
                    <div key={i} className="mt-3">
                      <p className="text-sm text-orange-800 dark:text-orange-300">
                        <strong>{a.company}</strong> — {a.activity}
                      </p>
                      <p className="mt-1 text-xs text-orange-700 dark:text-orange-400">
                        {a.date}
                        {a.outcome && <> &mdash; Outcome: {a.outcome}</>}
                      </p>
                      <a
                        href={a.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Source: {a.source.label} &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Sources */}
              {stateData.sources.length > 0 && (
                <div className="text-xs text-muted-foreground space-y-0.5">
                  {stateData.sources.map((s, i) => (
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
              )}

              {/* Action links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/get-involved/contact-legislator"
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Contact your legislator &rarr;
                </Link>
                <Link
                  href="/learn/legislation"
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  See legislation tracker &rarr;
                </Link>
              </div>
            </>
          ) : (
            /* State not in our database */
            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <h3 className="text-lg font-bold">{stateName}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We don&apos;t have lobbying data for {stateName} yet.
                This doesn&apos;t mean nothing is happening &mdash; it
                means we haven&apos;t been able to verify and source
                specific lobbying activity in this state.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                You can help: check your state&apos;s lobbying disclosure
                database for weather modification or geoengineering filings
                and send us what you find.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://www.followthemoney.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Search FollowTheMoney.org &rarr;
                </a>
                <Link
                  href="/get-involved/contact-legislator"
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Contact your legislator &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
