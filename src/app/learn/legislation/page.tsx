import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legislation Tracker — Weather Modification Laws Across America",
  description:
    "Track every state and federal bill addressing weather modification and geoengineering. 3 states have enacted bans, 30+ have introduced bills, and a federal ban is on the table.",
};

// ============================================================
// DATA
// ============================================================

type BillStatus =
  | "enacted"
  | "pending"
  | "advancing"
  | "failed"
  | "died_in_committee";

interface StateBill {
  state: string;
  bill: string;
  year: number;
  status: BillStatus;
  statusLabel: string;
  penalty?: string;
  summary: string;
  sourceUrl?: string;
  sourceLabel?: string;
  notes?: string;
}

const enactedBans: StateBill[] = [
  {
    state: "Tennessee",
    bill: "SB 2691 / HB 2063",
    year: 2024,
    status: "enacted",
    statusLabel: "Enacted — April 2024",
    penalty: "Class C misdemeanor, up to $10,000/day",
    summary:
      "First state in the nation to ban geoengineering. Prohibits the intentional injection, release, or dispersal of chemicals into the atmosphere to affect temperature, weather, or sunlight intensity. Signed by Governor Bill Lee.",
    sourceUrl:
      "https://wapp.capitol.tn.gov/apps/BillInfo/default.aspx?BillNumber=SB2691&GA=113",
    sourceLabel: "Tennessee Legislature — SB 2691",
  },
  {
    state: "Florida",
    bill: "SB 56",
    year: 2025,
    status: "enacted",
    statusLabel: "Enacted — June 2025",
    penalty: "Third-degree felony — up to 5 years in prison, $100,000 fine",
    summary:
      "First state to criminalize weather modification as a felony. Prohibits weather modification and climate engineering. Requires airports to report suspected activity. Establishes a public complaint system. Passed 82-28 in the House. Governor DeSantis signed it calling it protection from chemical experimentation.",
    sourceUrl: "https://www.flsenate.gov/Session/Bill/2025/56",
    sourceLabel: "Florida Senate — SB 56",
  },
  {
    state: "Louisiana",
    bill: "Act No. 95",
    year: 2025,
    status: "enacted",
    statusLabel: "Enacted — August 2025",
    penalty: "Up to $200,000 per violation",
    summary:
      "Bans weather modification and requires reporting of suspected operations. Louisiana DEQ established a public reporting portal. Over 400 citizen reports were filed in the first months after enactment.",
    sourceUrl:
      "https://internet.deq.louisiana.gov/portal/ONLINESERVICES/FORMS/ACT-NO-95-WEATHER-MODIFICATION-REPORTING",
    sourceLabel: "Louisiana DEQ — Act No. 95 Reporting Portal",
  },
];

const pendingBills: StateBill[] = [
  {
    state: "Pennsylvania",
    bill: "SB 508",
    year: 2025,
    status: "pending",
    statusLabel: "In committee",
    penalty: "Felony — minimum $500,000 fine, 2 years imprisonment",
    summary:
      "Clean Air Preservation Act. Bans cloud seeding and solar radiation modification. State Police and sheriffs issue cease-and-desist orders. Air National Guard assists investigations. The strongest proposed penalties of any state bill.",
    sourceUrl:
      "https://www.legis.state.pa.us/cfdocs/billinfo/billinfo.cfm?syear=2025&sind=0&body=S&type=B&bn=508",
    sourceLabel: "Pennsylvania Legislature — SB 508",
  },
  {
    state: "Rhode Island",
    bill: "HB 5217",
    year: 2025,
    status: "pending",
    statusLabel: "In committee",
    penalty: "Minimum $500,000 fine, up to 2 years per violation",
    summary:
      "Bans geoengineering and weather modification including stratospheric aerosol injection and cloud seeding. Enforced by Department of Environmental Management. Attorney General pursues violators.",
  },
  {
    state: "Iowa",
    bill: "Senate File (2026)",
    year: 2026,
    status: "advancing",
    statusLabel: "Advancing — subcommittee approved",
    summary:
      "Senate subcommittee advanced a bill in January 2026 that would criminalize acts attempting to alter the weather. One of the most active bills in the current session.",
    sourceUrl:
      "https://iowacapitaldispatch.com/2026/01/26/iowa-senators-advance-ban-on-geoengineering-weather-altering-activities/",
    sourceLabel: "Iowa Capital Dispatch",
  },
  {
    state: "North Carolina",
    bill: "HB 362",
    year: 2025,
    status: "pending",
    statusLabel: "Referred to Rules Committee",
    summary:
      "Clean Skies Geoengineering Ban. Prohibits atmospheric modification including stratospheric aerosol injection and cloud seeding. Environmental Management Commission develops enforcement rules.",
    sourceUrl:
      "https://lrs.sog.unc.edu/bill/clean-skies-geoengineering-ban",
    sourceLabel: "NC Legislative Reporting Service",
  },
  {
    state: "New Jersey",
    bill: "SB 4161",
    year: 2025,
    status: "pending",
    statusLabel: "Under consideration",
    penalty: "$10,000 first offense, $25,000 second, $50,000 subsequent (each day separate)",
    summary:
      "Bans release of hazardous chemicals for geoengineering, cloud seeding, and aerosol injection. DEP enforces and must issue regulations within 18 months. Escalating penalty structure.",
  },
  {
    state: "Texas",
    bill: "SB 1154",
    year: 2025,
    status: "pending",
    statusLabel: "Awaiting action",
    summary:
      "Prohibits governmental entities from engaging in geoengineering or weather modification. Exempts private institutions and emergency activities. Would repeal provisions allowing public weather modification contracts. Notable because Texas currently runs 5 active cloud seeding programs covering one-sixth of the state.",
  },
  {
    state: "Vermont",
    bill: "HB 217",
    year: 2025,
    status: "pending",
    statusLabel: "In committee",
    penalty: "Felony — up to $50,000 fine, 2 years per day of violation",
    summary:
      "Clean Air Preservation Act. Bans geoengineering and polluting atmospheric interventions including cloud seeding and solar radiation modification.",
  },
  {
    state: "Oklahoma",
    bill: "SB 430",
    year: 2025,
    status: "pending",
    statusLabel: "In committee",
    summary:
      "Prohibits intentional injection, release, or dispersion of chemicals, chemical compounds, substances, or apparatus in the state for weather modification purposes.",
  },
  {
    state: "New Hampshire",
    bill: "HB 1618",
    year: 2026,
    status: "pending",
    statusLabel: "Introduced — 2026 session",
    summary:
      "Bans solar radiation management, geoengineering, weather modification, and atmospheric pollution. Reintroduced after a 2025 proposal died in committee.",
  },
];

const failedBills: StateBill[] = [
  {
    state: "Montana",
    bill: "SB 473",
    year: 2025,
    status: "failed",
    statusLabel: "Passed Senate, killed in House",
    summary:
      "Would have banned stratospheric aerosol injection and solar radiation management while permitting cloud seeding for water resources. Passed the Senate in March 2025 but was killed on the House floor April 10, 2025 by a vote of 45-55.",
    notes: "Closest any failed bill has come to enactment.",
  },
  {
    state: "Arizona",
    bill: "SRM Ban (2025)",
    year: 2025,
    status: "failed",
    statusLabel: "Passed Senate, died in House",
    summary:
      "Passed the state Senate — a major legislative milestone — but did not advance past the House.",
  },
  {
    state: "Kentucky",
    bill: "HB 506",
    year: 2024,
    status: "died_in_committee",
    statusLabel: "Died in committee",
    summary:
      "Proposed ban on geoengineering activities. Republican sponsors expressed concern about environmental impacts but the bill did not advance.",
  },
  {
    state: "Minnesota",
    bill: "SF 4630",
    year: 2024,
    status: "died_in_committee",
    statusLabel: "Died in committee",
    summary: "Proposed geoengineering ban that did not advance past committee review.",
  },
  {
    state: "Illinois",
    bill: "2025 proposal",
    year: 2025,
    status: "died_in_committee",
    statusLabel: "Rejected by committee",
    summary: "Proposal rejected following review by scientific and environmental councils.",
  },
  {
    state: "Mississippi",
    bill: "2025 proposal",
    year: 2025,
    status: "died_in_committee",
    statusLabel: "Rejected by committee",
    summary: "Proposal rejected following committee review.",
  },
  {
    state: "North Dakota",
    bill: "2025 proposal",
    year: 2025,
    status: "died_in_committee",
    statusLabel: "Rejected by committee",
    summary: "Proposal rejected following committee review. North Dakota currently operates one of the longest-running cloud seeding programs in the nation.",
  },
  {
    state: "South Dakota",
    bill: "2025 proposal",
    year: 2025,
    status: "died_in_committee",
    statusLabel: "Rejected by committee",
    summary: "Proposal rejected following committee review.",
  },
  {
    state: "Utah",
    bill: "2025 proposal",
    year: 2025,
    status: "died_in_committee",
    statusLabel: "Rejected by committee",
    summary: "Proposal rejected following committee review. Utah operates an active state cloud seeding program.",
  },
  {
    state: "Wyoming",
    bill: "2025 proposal",
    year: 2025,
    status: "died_in_committee",
    statusLabel: "Rejected by committee",
    summary: "2025 proposal rejected. A 2026 draft (26LSO-0208) is being prepared for the next session.",
  },
];

const timelineEvents = [
  { date: "April 2024", event: "Tennessee becomes the first state to ban geoengineering (SB 2691)", type: "enacted" as const },
  { date: "January 2025", event: "Rhode Island introduces HB 5217 with $500K penalties", type: "introduced" as const },
  { date: "February 2025", event: "Texas introduces SB 1154; New Jersey introduces SB 4161", type: "introduced" as const },
  { date: "March 2025", event: "Montana SB 473 passes Senate; NC, PA, and VT introduce bills", type: "introduced" as const },
  { date: "April 2025", event: "Florida SB 56 passes both chambers (82-28 House vote). Montana SB 473 killed in House (45-55)", type: "mixed" as const },
  { date: "June 2025", event: "Governor DeSantis signs Florida SB 56 into law — first state felony", type: "enacted" as const },
  { date: "July 2025", event: "Clear Skies Act (H.R. 4403) introduced in Congress — federal ban", type: "federal" as const },
  { date: "August 2025", event: "Louisiana Act No. 95 takes effect. 400+ citizen reports filed", type: "enacted" as const },
  { date: "September 2025", event: "Congressional hearing: \"Playing God with the Weather.\" EPA Administrator Zeldin shifts to transparency", type: "federal" as const },
  { date: "February 2026", event: "GAO report reveals NOAA oversight is broken — 78% error rate, zero fines ever issued", type: "federal" as const },
  { date: "January 2026", event: "Iowa Senate subcommittee advances geoengineering ban", type: "introduced" as const },
];

// ============================================================
// COMPONENTS
// ============================================================

function StatusBadge({ status }: { status: BillStatus }) {
  const styles: Record<BillStatus, string> = {
    enacted:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    advancing:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    failed:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    died_in_committee:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const labels: Record<BillStatus, string> = {
    enacted: "Enacted",
    advancing: "Advancing",
    pending: "Pending",
    failed: "Failed",
    died_in_committee: "Died in Committee",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function BillCard({ bill }: { bill: StateBill }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">{bill.state}</h3>
            <StatusBadge status={bill.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {bill.bill} &middot; {bill.statusLabel}
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono shrink-0">
          {bill.year}
        </span>
      </div>

      {bill.penalty && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground">Penalty</p>
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {bill.penalty}
          </p>
        </div>
      )}

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {bill.summary}
      </p>

      {bill.notes && (
        <p className="mt-2 text-xs text-muted-foreground italic">
          {bill.notes}
        </p>
      )}

      {bill.sourceUrl && bill.sourceLabel && (
        <a
          href={bill.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-primary hover:underline"
        >
          Source: {bill.sourceLabel} &rarr;
        </a>
      )}
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function LegislationTrackerPage() {
  const totalStates =
    enactedBans.length + pendingBills.length + failedBills.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Legislation Tracker</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Citizens are driving a national legislative movement against weather
        modification. Three states have enacted bans, a federal bill is on the
        table, and lawmakers in 30+ states have introduced legislation &mdash;
        all since April 2024. This page tracks every bill we know about.
      </p>

      {/* ============================================================ */}
      {/* DASHBOARD */}
      {/* ============================================================ */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 text-center">
          <p className="text-3xl font-bold text-green-800 dark:text-green-300">
            {enactedBans.length}
          </p>
          <p className="text-xs font-medium text-green-700 dark:text-green-400 mt-1">
            States enacted bans
          </p>
        </div>
        <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">
            {pendingBills.length}
          </p>
          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mt-1">
            Bills pending
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
          <p className="text-3xl font-bold">{failedBills.length}</p>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Bills failed / died
          </p>
        </div>
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 text-center">
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
            {totalStates}
          </p>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mt-1">
            Total states with bills
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ENACTED BANS */}
      {/* ============================================================ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Enacted Bans</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These states have signed weather modification bans into law. Citizens
          in these states can report violations through official channels.
        </p>

        <div className="mt-4 space-y-4">
          {enactedBans.map((bill) => (
            <BillCard key={bill.state} bill={bill} />
          ))}
        </div>

        {/* Penalty Comparison */}
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-sm">Penalty Comparison</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                    State
                  </th>
                  <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                    Classification
                  </th>
                  <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                    Max Fine
                  </th>
                  <th className="pb-2 text-xs font-medium text-muted-foreground">
                    Prison Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 pr-4 font-medium">Tennessee</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Misdemeanor
                  </td>
                  <td className="py-2 pr-4">$10,000/day</td>
                  <td className="py-2 text-muted-foreground">None</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Florida</td>
                  <td className="py-2 pr-4 text-red-700 dark:text-red-400 font-medium">
                    Felony
                  </td>
                  <td className="py-2 pr-4">$100,000</td>
                  <td className="py-2 text-red-700 dark:text-red-400 font-medium">
                    Up to 5 years
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Louisiana</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Civil penalty
                  </td>
                  <td className="py-2 pr-4">$200,000/violation</td>
                  <td className="py-2 text-muted-foreground">None</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The trend is toward harsher penalties. Tennessee started with
            misdemeanor classification in 2024. By 2025, Florida made it a
            felony with prison time.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEDERAL ACTION */}
      {/* ============================================================ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Federal Action</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">Clear Skies Act</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Federal Bill
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  H.R. 4403 &middot; 119th Congress &middot; Introduced July 15,
                  2025
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-red-700 dark:text-red-400">
              Penalty: Up to $100,000 fine and 5 years imprisonment
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Would ban all weather modification and geoengineering at the
              federal level. Repeals any existing federal authority permitting
              it. Creates a public reporting system through EPA. Sponsored by
              Rep. Marjorie Taylor Greene with 3 cosponsors. Currently referred
              to the House Committee on Energy and Commerce.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/learn/clear-skies-act"
                className="text-xs text-primary hover:underline font-medium"
              >
                Full bill analysis &rarr;
              </Link>
              <a
                href="https://www.congress.gov/bill/119th-congress/house-bill/4403/text"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Read the bill text &rarr;
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border p-5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">
                Congressional Hearing
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                September 2025
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              &quot;Playing God with the Weather &mdash; A Disastrous
              Forecast&quot;
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              House Subcommittee hearing with three expert witnesses under sworn
              testimony. Dr. Pielke testified that weather modification has been
              practiced for 70 years without knowing if it works. Meteorologist
              Marks raised safety concerns about silver iodide. EPA
              Administrator Zeldin announced a shift to &quot;total
              transparency.&quot; Bipartisan agreement that citizens deserve
              answers.
            </p>
            <Link
              href="/learn/congressional-hearing"
              className="mt-3 inline-block text-xs text-primary hover:underline font-medium"
            >
              Full hearing summary &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-border p-5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">GAO Oversight Report</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                February 2026
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              GAO-26-108013 &mdash; &quot;Weather Modification: NOAA Should
              Strengthen Oversight&quot;
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The government&apos;s own auditor found that NOAA&apos;s oversight
              is broken: 78% of filed reports contain errors, 4 of 10 states
              had unreported activities, reporting forms haven&apos;t changed
              since 1974, and NOAA has never issued a single fine in 50+ years
              of authority. This report is fuel for every pending state bill.
            </p>
            <a
              href="https://www.gao.gov/products/gao-26-108013"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-primary hover:underline"
            >
              Read the GAO report &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PENDING BILLS */}
      {/* ============================================================ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Pending &amp; Active Bills</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These bills are currently in state legislatures. Contact your
          representatives to show support.
        </p>
        <div className="mt-4 space-y-4">
          {pendingBills.map((bill) => (
            <BillCard key={bill.state} bill={bill} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAILED BILLS */}
      {/* ============================================================ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Failed &amp; Rejected Bills</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These bills didn&apos;t pass &mdash; but they show the breadth of the
          movement. Montana came within 6 votes. Many of these states are
          expected to reintroduce bills in their 2026&ndash;2027 sessions.
        </p>
        <div className="mt-4 space-y-3">
          {failedBills.map((bill) => (
            <div
              key={`${bill.state}-${bill.year}`}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{bill.state}</h3>
                  <StatusBadge status={bill.status} />
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {bill.year}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {bill.bill} &middot; {bill.summary}
              </p>
              {bill.notes && (
                <p className="mt-1 text-xs text-muted-foreground italic">
                  {bill.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* TIMELINE */}
      {/* ============================================================ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Key moments in the national legislative movement against weather
          modification.
        </p>
        <div className="mt-4 space-y-0">
          {timelineEvents.map((event, i) => {
            const dotColor =
              event.type === "enacted"
                ? "bg-green-500"
                : event.type === "federal"
                  ? "bg-blue-500"
                  : event.type === "mixed"
                    ? "bg-yellow-500"
                    : "bg-gray-400";
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0 mt-1.5`}
                  />
                  {i < timelineEvents.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-xs font-medium text-muted-foreground">
                    {event.date}
                  </p>
                  <p className="text-sm mt-0.5">{event.event}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* EXTERNAL TRACKERS */}
      {/* ============================================================ */}
      <section className="mt-12">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="font-semibold">External Trackers</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            For the most up-to-date bill status across all states:
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://srm360.org/us-bans/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                SRM360 &mdash; Interactive map of all US geoengineering
                proposals &rarr;
              </a>
            </li>
            <li>
              <a
                href="https://carnegieendowment.org/research/2025/11/united-states-geoengineering-carbon-removal-bipartisan-backlash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Carnegie Endowment &mdash; Bipartisan Backlash Against
                Geoengineering &rarr;
              </a>
            </li>
            <li>
              <a
                href="https://www.gao.gov/products/gao-26-108013"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GAO &mdash; Weather Modification Oversight Report (Feb 2026)
                &rarr;
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ARKANSAS NOTE */}
      {/* ============================================================ */}
      <section className="mt-8">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="font-semibold">Your State Not Listed?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Not every state has introduced a bill yet. If your state
            isn&apos;t listed above, that&apos;s an opportunity. Contact your
            state representative and point them to Tennessee, Florida, and
            Louisiana as models. The{" "}
            <Link
              href="/get-involved"
              className="text-primary hover:underline"
            >
              Get Involved
            </Link>{" "}
            page has step-by-step guidance.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA */}
      {/* ============================================================ */}
      <div className="mt-8 mb-8 rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <h3 className="text-lg font-bold">Ready to take action?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Support legal efforts, contact your representatives, and help bring
          transparency to your state.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/get-involved"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Involved &rarr;
          </Link>
          <a
            href="https://www.house.gov/representatives/find-your-representative"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Find Your Representative &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
