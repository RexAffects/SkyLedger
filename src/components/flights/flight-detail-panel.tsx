"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOperatorSlugFromOwnerName } from "@/lib/data/operators";
import { FlagAircraftDialog } from "./flag-aircraft-dialog";
import { PhotoEvidenceDialog } from "./photo-evidence-dialog";
import { WeatherContext } from "./weather-context";
import { THREAT_LEVELS } from "@/lib/constants";
import {
  pinAircraft,
  unpinAircraft,
  isAircraftPinned,
} from "@/components/map/flight-layer";

interface CommunityFlags {
  flag_count: number;
  unique_reporters: number;
  threat_level: "none" | "low" | "medium" | "high";
  first_flagged_at: string | null;
  last_flagged_at: string | null;
}

interface FlightDetail {
  icao_hex: string | null;
  tail_number: string | null;
  callsign: string | null;
  aircraft_type: string | null;
  aircraft_description: string | null;
  aircraft_photo: string | null;
  aircraft_photo_thumbnail: string | null;
  owner: {
    name: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    is_known_wx_mod: boolean;
    operator_notes: string;
    is_llc: boolean;
    llc_info: {
      entity_type: string | null;
      pierced_owner: string | null;
      pierced_source: string | null;
      confidence: string | null;
      formation_state: string | null;
      state_registry_url: string | null;
      status: string;
    } | null;
  };
  registration: {
    make: string;
    model: string;
    year: string;
    serial_number: string;
    status: string;
    type: string;
  } | null;
  route: {
    origin: {
      icao: string;
      iata: string | null;
      name: string | null;
      city: string | null;
      country: string | null;
    } | null;
    destination: {
      icao: string;
      iata: string | null;
      name: string | null;
      city: string | null;
      country: string | null;
    } | null;
    airline: string | null;
    verified: boolean;
  };
  position: {
    latitude: number;
    longitude: number;
    altitude_ft: number | null;
    speed_kts: number | null;
    heading: number | null;
    squawk: string | null;
    on_ground: boolean;
  } | null;
  community_flags: CommunityFlags | null;
  network_connections: {
    is_confirmed_operator: boolean;
    matches: {
      entity_name: string;
      entity_type: string;
      confidence: string;
      description: string;
      connection_path: string;
      operator_slugs: string[];
      player_slugs: string[];
      score: number;
    }[];
    summary: string | null;
    needs_investigation: boolean;
    pierced_match: {
      pierced_name: string;
      matches: {
        entity_name: string;
        entity_type: string;
        confidence: string;
        description: string;
        connection_path: string;
        operator_slugs: string[];
        player_slugs: string[];
        score: number;
      }[];
    } | null;
  } | null;
}

interface FlightDetailPanelProps {
  hex: string;
  callsign?: string;
  tail?: string;
  onClose: () => void;
}

export function FlightDetailPanel({
  hex,
  callsign,
  tail,
  onClose,
}: FlightDetailPanelProps) {
  const [data, setData] = useState<FlightDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{
    summary: {
      total_sightings: number;
      total_days_seen: number;
      first_seen_at: string;
      last_seen_at: string;
      primary_region: string | null;
      avg_altitude_ft: number | null;
      common_times: Record<string, number>;
    } | null;
    positions: Array<{
      latitude: number;
      longitude: number;
      altitude_ft: number | null;
      observed_at: string;
    }>;
  } | null>(null);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (hex) params.set("hex", hex);
      if (callsign) params.set("callsign", callsign);
      if (tail) params.set("tail", tail);

      try {
        const res = await fetch(`/api/flights/detail?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [hex, callsign, tail]);

  // Fetch flight history
  useEffect(() => {
    const tailNumber = tail || data?.tail_number;
    if (!tailNumber) return;

    setIsPinned(isAircraftPinned(tailNumber));

    fetch(`/api/flight-history?tail=${encodeURIComponent(tailNumber)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        if (result) setHistory(result);
      })
      .catch(() => {
        // Silent fail
      });
  }, [tail, data?.tail_number]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-red-500">
            {error || "Could not load aircraft details"}
          </p>
          <Button variant="outline" size="sm" onClick={onClose} className="mt-2">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-mono">
                {data.tail_number || data.icao_hex || "Unknown"}
              </CardTitle>
              {data.owner.is_known_wx_mod && (
                <Badge variant="destructive">Weather Modification</Badge>
              )}
            </div>
            {data.callsign && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Callsign: {data.callsign}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* WX Mod Alert */}
        {data.owner.is_known_wx_mod && data.owner.operator_notes && (() => {
          const operatorSlug = data.owner.name
            ? getOperatorSlugFromOwnerName(data.owner.name)
            : null;
          return (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Known Weather Modification Operator
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                {data.owner.operator_notes}
              </p>
              {operatorSlug && (
                <Link
                  href={`/learn/operators/${operatorSlug}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-800 dark:text-red-200 hover:underline"
                >
                  See who&apos;s behind this operator &rarr;
                </Link>
              )}
            </div>
          );
        })()}

        {/* Network Connections */}
        {data.network_connections &&
          !data.network_connections.is_confirmed_operator &&
          data.network_connections.matches.length > 0 && (
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                  {data.network_connections.matches.some(
                    (m) => m.confidence === "connected-entity"
                  )
                    ? "Network Connection Detected"
                    : "Possible Network Connection"}
                </p>
              </div>
              <div className="space-y-2">
                {data.network_connections.matches.slice(0, 3).map((match, i) => (
                  <div key={i} className="text-xs">
                    <p className="text-amber-900 dark:text-amber-100">
                      <span className="font-medium">{match.entity_name}</span>
                      <span className="text-amber-700 dark:text-amber-300">
                        {" "}
                        &mdash; {match.connection_path}
                      </span>
                    </p>
                    {match.operator_slugs.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {match.operator_slugs.map((slug) => (
                          <Link
                            key={slug}
                            href={`/learn/operators/${slug}`}
                            className="text-[10px] text-primary hover:underline"
                          >
                            View operator profile &rarr;
                          </Link>
                        ))}
                      </div>
                    )}
                    {match.player_slugs.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {match.player_slugs.map((slug) => (
                          <Link
                            key={slug}
                            href={`/learn/follow-the-money#${slug}`}
                            className="text-[10px] text-primary hover:underline"
                          >
                            Follow the money &rarr;
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {data.network_connections.pierced_match && (
                <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-700">
                  <p className="text-[11px] text-amber-800 dark:text-amber-200">
                    <span className="font-medium">LLC piercing revealed:</span>{" "}
                    {data.network_connections.pierced_match.pierced_name} &mdash;{" "}
                    {data.network_connections.pierced_match.matches[0]
                      ?.connection_path || "connected to weather modification network"}
                  </p>
                </div>
              )}
              {data.network_connections.needs_investigation && (
                <p className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 italic">
                  This is a name-similarity match, not a confirmed connection.
                  Further investigation recommended.
                </p>
              )}
              <p className="mt-2 text-[10px] text-amber-600/70 dark:text-amber-400/70">
                Network connections are informational, not accusations. They show
                relationships between entities in the weather modification funding
                network.
              </p>
            </div>
          )}

        {/* Community Flags */}
        {data.community_flags && data.community_flags.threat_level !== "none" && (
          <div
            className={`rounded-lg border p-3 ${
              data.community_flags.threat_level === "high"
                ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                : data.community_flags.threat_level === "medium"
                  ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                  : "bg-muted/50 border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {data.community_flags.unique_reporters} community{" "}
                {data.community_flags.unique_reporters === 1
                  ? "report"
                  : "reports"}
              </p>
              <Badge
                className={
                  THREAT_LEVELS[data.community_flags.threat_level].color
                }
              >
                {THREAT_LEVELS[data.community_flags.threat_level].label}
              </Badge>
            </div>
            {data.community_flags.first_flagged_at && (
              <p className="text-[11px] text-muted-foreground mt-1">
                First reported:{" "}
                {new Date(
                  data.community_flags.first_flagged_at
                ).toLocaleDateString()}
                {data.community_flags.last_flagged_at &&
                  data.community_flags.first_flagged_at !==
                    data.community_flags.last_flagged_at && (
                    <>
                      {" "}
                      &middot; Last:{" "}
                      {new Date(
                        data.community_flags.last_flagged_at
                      ).toLocaleDateString()}
                    </>
                  )}
              </p>
            )}
          </div>
        )}

        {/* Flight History */}
        <Section title="History">
          {history?.summary ? (
            <div className="space-y-2">
              <p className="text-sm">
                This aircraft has been tracked{" "}
                <span className="font-semibold">
                  {history.summary.total_sightings} time
                  {history.summary.total_sightings !== 1 ? "s" : ""}
                </span>{" "}
                across{" "}
                <span className="font-semibold">
                  {history.summary.total_days_seen} day
                  {history.summary.total_days_seen !== 1 ? "s" : ""}
                </span>
                .
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <DetailRow
                  label="First seen"
                  value={new Date(
                    history.summary.first_seen_at
                  ).toLocaleDateString()}
                />
                <DetailRow
                  label="Last seen"
                  value={
                    new Date(history.summary.last_seen_at).toDateString() ===
                    new Date().toDateString()
                      ? "Today"
                      : new Date(
                          history.summary.last_seen_at
                        ).toLocaleDateString()
                  }
                />
                {history.summary.avg_altitude_ft && (
                  <DetailRow
                    label="Avg altitude"
                    value={`${history.summary.avg_altitude_ft.toLocaleString()} ft`}
                  />
                )}
                {history.summary.common_times &&
                  Object.keys(history.summary.common_times).length > 0 && (
                    <DetailRow
                      label="Most active"
                      value={Object.entries(history.summary.common_times)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 2)
                        .map(
                          ([period]) =>
                            period.charAt(0).toUpperCase() + period.slice(1)
                        )
                        .join(", ")}
                    />
                  )}
              </div>
              {history.summary.primary_region && (
                <DetailRow
                  label="Primary area"
                  value={history.summary.primary_region}
                />
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {data?.tail_number
                ? "First sighting. This aircraft will now be tracked."
                : "No tail number — history requires a registered tail number."}
            </p>
          )}
        </Section>

        {/* Pin / Unpin Button */}
        {(data?.tail_number || tail) && (
          <button
            onClick={() => {
              const t = (data?.tail_number || tail)!;
              if (isPinned) {
                unpinAircraft(t);
                setIsPinned(false);
              } else {
                pinAircraft(t);
                setIsPinned(true);
              }
            }}
            className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
              isPinned
                ? "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {isPinned ? (
              <>Tracking this aircraft. Click to unpin.</>
            ) : (
              <>Track this aircraft — pin for history logging</>
            )}
          </button>
        )}

        {/* Route */}
        <Section title="Route">
          {data.route.origin || data.route.destination ? (
            <>
              <div className={`flex items-center gap-3${!data.route.verified ? " opacity-60" : ""}`}>
                <AirportDisplay airport={data.route.origin} label="From" />
                <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
                <AirportDisplay airport={data.route.destination} label="To" />
              </div>
              {!data.route.verified && (
                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-2 mt-2">
                  <p className="text-xs text-yellow-400">
                    <span className="font-semibold">Route unverified</span> &mdash;
                    This aircraft&apos;s position doesn&apos;t match the published route.
                    Route data comes from historical flight schedules and may be
                    outdated or reassigned.
                  </p>
                </div>
              )}
              {data.route.airline && (
                <p className="text-xs text-muted-foreground mt-2">
                  Airline: {data.route.airline}
                </p>
              )}
            </>
          ) : (
            <div className="rounded-md bg-muted/50 p-2.5">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Route not available.</span>{" "}
                Route data is only available for commercial airline flights with
                published schedules. Private planes, general aviation, and
                military aircraft typically don&apos;t publish their routes
                &mdash; which can make them more interesting to investigate.
                Check the owner info below.
              </p>
            </div>
          )}
        </Section>

        {/* Live Position */}
        {data.position && (
          <Section title="Live Position">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <DetailRow
                label="Altitude"
                value={
                  data.position.on_ground
                    ? "On Ground"
                    : data.position.altitude_ft
                      ? `${data.position.altitude_ft.toLocaleString()} ft`
                      : "Unknown"
                }
              />
              <DetailRow
                label="Speed"
                value={
                  data.position.speed_kts
                    ? `${Math.round(data.position.speed_kts)} kts`
                    : "Unknown"
                }
              />
              <DetailRow
                label="Heading"
                value={
                  data.position.heading
                    ? `${Math.round(data.position.heading)}°`
                    : "Unknown"
                }
              />
              <DetailRow
                label="Squawk"
                value={data.position.squawk || "N/A"}
              />
              <DetailRow
                label="Latitude"
                value={data.position.latitude.toFixed(4)}
              />
              <DetailRow
                label="Longitude"
                value={data.position.longitude.toFixed(4)}
              />
            </div>
            {/* Contrail conditions at aircraft altitude */}
            <WeatherContext
              latitude={data.position.latitude}
              longitude={data.position.longitude}
              altitude_ft={data.position.altitude_ft}
            />
          </Section>
        )}

        {/* Owner */}
        <Section title="Owner">
          <div className="flex items-center gap-2">
            <DetailRow
              label="Name"
              value={data.owner.name || "Unknown"}
            />
            {data.owner.is_llc && (
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-amber-300 dark:border-amber-700 text-[10px]">
                <svg className="w-3 h-3 mr-0.5 inline" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                Corporate Entity
              </Badge>
            )}
          </div>
          {(data.owner.city || data.owner.state) && (
            <DetailRow
              label="Location"
              value={
                [data.owner.city, data.owner.state, data.owner.country]
                  .filter(Boolean)
                  .join(", ")
              }
            />
          )}
          {/* LLC Piercing Info */}
          {data.owner.is_llc && data.owner.llc_info && (
            <div className="mt-2 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-2.5">
              {data.owner.llc_info.pierced_owner ? (
                <>
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                    Actual Owner: {data.owner.llc_info.pierced_owner}
                  </p>
                  {data.owner.llc_info.confidence && (
                    <Badge className="mt-1 text-[10px] bg-amber-200/50 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200">
                      {data.owner.llc_info.confidence} confidence
                    </Badge>
                  )}
                  {data.owner.llc_info.formation_state && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                      Formed in {data.owner.llc_info.formation_state}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    This aircraft is registered to a corporate entity. The real owner is hidden behind{" "}
                    <span className="font-medium">{data.owner.llc_info.entity_type?.toUpperCase() || "LLC"}</span> registration.
                  </p>
                  {data.owner.llc_info.state_registry_url && (
                    <a
                      href={data.owner.llc_info.state_registry_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-800 dark:text-amber-200 hover:underline"
                    >
                      Search {data.owner.state || "State"} Registry &rarr;
                    </a>
                  )}
                </>
              )}
            </div>
          )}
        </Section>

        {/* Aircraft */}
        <Section title="Aircraft">
          {data.aircraft_description && (
            <DetailRow label="Type" value={data.aircraft_description} />
          )}
          {data.registration && (
            <>
              {data.registration.make && (
                <DetailRow
                  label="Make / Model"
                  value={`${data.registration.make} ${data.registration.model}`}
                />
              )}
              {data.registration.year && (
                <DetailRow label="Year" value={data.registration.year} />
              )}
              {data.registration.serial_number && (
                <DetailRow
                  label="Serial Number"
                  value={data.registration.serial_number}
                />
              )}
              {data.registration.status && (
                <DetailRow label="Status" value={data.registration.status} />
              )}
            </>
          )}
        </Section>

        {/* Photo */}
        {data.aircraft_photo_thumbnail && (
          <Section title="Photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.aircraft_photo_thumbnail}
              alt={`${data.tail_number || "Aircraft"}`}
              className="rounded-md max-h-40 w-full object-cover"
            />
          </Section>
        )}

        {/* Raw identifiers */}
        <div className="pt-2 border-t border-border">
          <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
            {data.icao_hex && <span>ICAO: {data.icao_hex}</span>}
            {data.tail_number && <span>Tail: {data.tail_number}</span>}
            {data.aircraft_type && <span>Type: {data.aircraft_type}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        {data.tail_number && (
          <div className="space-y-2">
            <PhotoEvidenceDialog
              tailNumber={data.tail_number}
              icaoHex={data.icao_hex}
              latitude={data.position?.latitude}
              longitude={data.position?.longitude}
              altitudeFt={data.position?.altitude_ft}
            />
            <FlagAircraftDialog
              tailNumber={data.tail_number}
              icaoHex={data.icao_hex}
              latitude={data.position?.latitude}
              longitude={data.position?.longitude}
              altitudeFt={data.position?.altitude_ft}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}: </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function AirportDisplay({
  airport,
  label,
}: {
  airport: {
    icao: string;
    iata: string | null;
    name: string | null;
    city: string | null;
  } | null;
  label: string;
}) {
  if (!airport) {
    return (
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">Unknown</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold font-mono">
        {airport.iata || airport.icao}
      </p>
      {airport.name && (
        <p className="text-xs text-muted-foreground">{airport.name}</p>
      )}
      {airport.city && (
        <p className="text-xs text-muted-foreground">{airport.city}</p>
      )}
    </div>
  );
}
