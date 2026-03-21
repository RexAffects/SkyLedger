"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOperatorSlugFromOwnerName } from "@/lib/data/operators";

interface RegistrationData {
  tailNumber: string;
  make: string;
  model: string;
  year: string;
  ownerName: string;
  ownerCity: string;
  ownerState: string;
  isKnownWeatherMod: boolean;
  operatorNotes: string;
  status: string;
  llcDetection?: {
    isLLC: boolean;
    entityType: string | null;
    registrationState: string | null;
    stateRegistryUrl: string | null;
  };
}

interface LookupResult {
  tailNumber: string;
  registration: RegistrationData | null;
  livePosition: {
    lat: number;
    lon: number;
    altitude: number | string;
    speed: number;
    heading: number;
  } | null;
  isCurrentlyTracked: boolean;
}

export function AircraftLookup() {
  const [tailNumber, setTailNumber] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tailNumber.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/flights/lookup?tail=${encodeURIComponent(tailNumber.trim())}`
      );
      if (!res.ok) throw new Error("Lookup failed");
      const data: LookupResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Aircraft Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLookup} className="flex gap-2">
            <Input
              placeholder="Enter tail number (e.g., N12345)"
              value={tailNumber}
              onChange={(e) => setTailNumber(e.target.value)}
              className="font-mono"
            />
            <Button type="submit" disabled={loading || !tailNumber.trim()}>
              {loading ? "Looking up..." : "Look Up"}
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Looks up aircraft in the FAA registry and checks for current ADS-B
            position data.
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Registration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {result.tailNumber}
                </CardTitle>
                {result.registration?.isKnownWeatherMod && (
                  <Badge variant="destructive">
                    Known Weather Modification Operator
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.registration ? (
                <>
                  <div className="flex items-center gap-2">
                    <DetailRow label="Owner" value={result.registration.ownerName} />
                    {result.registration.llcDetection?.isLLC && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-amber-300 dark:border-amber-700 text-[10px] shrink-0">
                        Corporate Entity
                      </Badge>
                    )}
                  </div>
                  {result.registration.llcDetection?.isLLC && result.registration.llcDetection.stateRegistryUrl && (
                    <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-2">
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        Registered to {result.registration.llcDetection.entityType?.toUpperCase() || "LLC"}.
                        Real owner may be hidden.
                      </p>
                      <a
                        href={result.registration.llcDetection.stateRegistryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-800 dark:text-amber-200 hover:underline"
                      >
                        Search {result.registration.ownerState || "State"} Registry &rarr;
                      </a>
                    </div>
                  )}
                  <DetailRow
                    label="Location"
                    value={`${result.registration.ownerCity}, ${result.registration.ownerState}`}
                  />
                  <DetailRow
                    label="Aircraft"
                    value={`${result.registration.make} ${result.registration.model}`}
                  />
                  {result.registration.year && (
                    <DetailRow label="Year" value={result.registration.year} />
                  )}
                  <DetailRow label="Status" value={result.registration.status || "Active"} />
                  {result.registration.operatorNotes && (() => {
                    const operatorSlug = result.registration.ownerName
                      ? getOperatorSlugFromOwnerName(result.registration.ownerName)
                      : null;
                    return (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          {result.registration.operatorNotes}
                        </p>
                        {operatorSlug && (
                          <Link
                            href={`/learn/operators/${operatorSlug}`}
                            className="mt-2 inline-flex items-center text-xs font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
                          >
                            See who&apos;s behind this operator &rarr;
                          </Link>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No FAA registration data found for this tail number.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Live Position */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Live Position</CardTitle>
                <Badge variant={result.isCurrentlyTracked ? "default" : "secondary"}>
                  {result.isCurrentlyTracked ? "Currently Tracked" : "Not Airborne"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.livePosition ? (
                <>
                  <DetailRow
                    label="Position"
                    value={`${result.livePosition.lat.toFixed(4)}, ${result.livePosition.lon.toFixed(4)}`}
                  />
                  <DetailRow
                    label="Altitude"
                    value={
                      typeof result.livePosition.altitude === "number"
                        ? `${result.livePosition.altitude.toLocaleString()} ft`
                        : result.livePosition.altitude
                    }
                  />
                  <DetailRow
                    label="Speed"
                    value={`${Math.round(result.livePosition.speed)} knots`}
                  />
                  <DetailRow
                    label="Heading"
                    value={`${Math.round(result.livePosition.heading)}°`}
                  />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This aircraft is not currently broadcasting ADS-B position
                  data. It may be on the ground, in a hangar, or operating
                  without a transponder.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm mt-0.5">{value}</p>
    </div>
  );
}
