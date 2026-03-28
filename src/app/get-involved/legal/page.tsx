import type { Metadata } from "next";
import Link from "next/link";
import {
  FRONTLINE_ORGS,
  STATE_LEGAL,
  LEGAL_RESOURCES,
  type FrontlineOrg,
  type StateLegalStatus,
  type LegalResource,
} from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Legal Action Hub — SkyLedger",
  description:
    "Active legal efforts, your rights, state-by-state legal landscape, and how to support the fight against unauthorized geoengineering.",
};

const statusColors: Record<StateLegalStatus["status"], string> = {
  enacted:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "no-bill":
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  failed:
    "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
};

const statusLabels: Record<StateLegalStatus["status"], string> = {
  enacted: "Enacted",
  pending: "Pending",
  "no-bill": "No Bill",
  failed: "Failed",
};

const typeColors: Record<LegalResource["type"], string> = {
  "international-law":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "domestic-law":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "legal-analysis":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  petition:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const typeLabels: Record<LegalResource["type"], string> = {
  "international-law": "International Law",
  "domestic-law": "Domestic Law",
  "legal-analysis": "Legal Analysis",
  petition: "Petition",
};

const legalRights = [
  {
    title: "Clean Air Act",
    description:
      "Federal law regulating air emissions. Citizens can file complaints with the EPA for unpermitted releases of substances into the atmosphere.",
    link: null,
  },
  {
    title: "Freedom of Information Act",
    description:
      "Your right to request government records from federal agencies. Agencies must respond within 20 business days. Fee waivers are available for public interest requests.",
    link: { href: "/get-involved/foia", label: "Use the FOIA Generator" },
  },
  {
    title: "State Public Records Laws",
    description:
      "Every state has open records laws. You can request weather modification permits, contracts, and correspondence from state agencies.",
    link: null,
  },
  {
    title: "Right to Petition",
    description:
      "Protected by the First Amendment. Contact your legislators, attend public hearings, and submit written testimony on proposed legislation.",
    link: null,
  },
];

const ctaCards = [
  {
    title: "File a FOIA Request",
    description:
      "Use our generator to create a ready-to-send FOIA request targeting weather modification records.",
    href: "/get-involved/foia",
  },
  {
    title: "Donate to Legal Efforts",
    description:
      "Support the organizations on the front lines of legal action against unauthorized geoengineering.",
    href: "/get-involved/donate",
  },
  {
    title: "Track Flights for Evidence",
    description:
      "Use SkyLedger to monitor aircraft activity over your area and build a documented evidence trail.",
    href: "/flights",
  },
];

// Take first 4 orgs: GeoWatch, ICAN, GeoFight, Stop Geo MN
const featuredOrgs = FRONTLINE_ORGS.slice(0, 4);

// Group states by status
const groupedStates = STATE_LEGAL.reduce(
  (acc, state) => {
    if (!acc[state.status]) acc[state.status] = [];
    acc[state.status].push(state);
    return acc;
  },
  {} as Record<string, StateLegalStatus[]>,
);

const statusOrder: StateLegalStatus["status"][] = [
  "enacted",
  "pending",
  "no-bill",
  "failed",
];

export default function LegalActionHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/get-involved"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Get Involved
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Legal Action Hub</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        The legal fight against unauthorized geoengineering is accelerating.
        Four states have enacted bans, a federal lawsuit is being assembled, and
        FOIA requests are forcing documents into the light. Here is everything
        you need to understand the legal landscape and take action.
      </p>

      {/* ============================================================ */}
      {/* Section 1: Active Legal Efforts */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Active Legal Efforts
        </h2>
        <div className="mt-4 space-y-4">
          {featuredOrgs.map((org: FrontlineOrg) => (
            <div
              key={org.slug}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{org.name}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${org.tagColor}`}
                >
                  {org.tag}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {org.mission}
              </p>
              {org.keyWins && org.keyWins.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  {org.keyWins.map((win, i) => (
                    <li key={i}>{win}</li>
                  ))}
                </ul>
              )}
              <div className="mt-3">
                <a
                  href={org.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Support {org.shortName} &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section 2: State-by-State Legal Landscape */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          State-by-State Legal Landscape
        </h2>
        <div className="mt-4 space-y-6">
          {statusOrder
            .filter((status) => groupedStates[status]?.length)
            .map((status) => (
              <div key={status}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  {statusLabels[status]} ({groupedStates[status].length})
                </h3>
                <div className="space-y-4">
                  {groupedStates[status].map((state: StateLegalStatus) => (
                    <div
                      key={state.abbreviation}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold">
                            {state.state}{" "}
                            <span className="text-muted-foreground font-normal">
                              ({state.abbreviation})
                            </span>
                          </h4>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[state.status]}`}
                          >
                            {statusLabels[state.status]}
                          </span>
                        </div>
                      </div>
                      {state.bill && (
                        <p className="mt-2 text-sm">
                          <span className="font-medium">Bill:</span>{" "}
                          {state.bill}
                        </p>
                      )}
                      {state.penalty && (
                        <p className="mt-1 text-sm">
                          <span className="font-medium">Penalty:</span>{" "}
                          {state.penalty}
                        </p>
                      )}
                      {state.citizenActions.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          {state.citizenActions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      )}
                      {state.complaintPortal && (
                        <div className="mt-2">
                          <a
                            href={state.complaintPortal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            File a complaint &rarr;
                          </a>
                        </div>
                      )}
                      {state.notes && (
                        <p className="mt-2 text-xs text-muted-foreground italic">
                          {state.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section 3: Your Legal Rights */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Your Legal Rights
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {legalRights.map((right) => (
            <div
              key={right.title}
              className="rounded-lg border border-border p-4"
            >
              <h3 className="font-semibold">{right.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {right.description}
              </p>
              {right.link && (
                <Link
                  href={right.link.href}
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  {right.link.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section 4: Legal Resources */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Legal Resources
        </h2>
        <div className="mt-4 space-y-4">
          {LEGAL_RESOURCES.map((resource: LegalResource) => (
            <div
              key={resource.url}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  {resource.title} &rarr;
                </a>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${typeColors[resource.type]}`}
                >
                  {typeLabels[resource.type]}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section 5: Take Action */}
      {/* ============================================================ */}
      <section className="mt-10 mb-8">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Take Action
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {ctaCards.map((cta) => (
            <Link key={cta.href} href={cta.href}>
              <div className="rounded-lg border border-border p-4 h-full transition-shadow hover:shadow-md">
                <h3 className="font-semibold">{cta.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cta.description}
                </p>
                <p className="mt-3 text-sm font-medium text-primary">
                  Get started &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
