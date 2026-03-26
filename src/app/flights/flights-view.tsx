"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AircraftLookup } from "@/components/flights/aircraft-card";
import { FlightLayer } from "@/components/map/flight-layer";
import { FlightDetailPanel } from "@/components/flights/flight-detail-panel";
import { MapContainer, type FlightTrail } from "@/components/map/map-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompassCalibrationDialog } from "@/components/flights/compass-calibration-dialog";

export function FlightsView() {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [showFlights, setShowFlights] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<{
    tail_number: string | null;
    callsign: string | null;
    icao_hex: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [flightTrails, setFlightTrails] = useState<FlightTrail[]>([]);
  const [radius, setRadius] = useState(50);
  const [scanPhase, setScanPhase] = useState<
    "idle" | "locating" | "scanning" | "found" | "tracking"
  >("idle");
  const [foundCount, setFoundCount] = useState(0);
  const scanPhaseRef = useRef(scanPhase);
  scanPhaseRef.current = scanPhase;
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [highlightedIcao, setHighlightedIcao] = useState<string | null>(null);
  const [compassMode, setCompassMode] = useState(false);
  const [heading, setHeading] = useState(0);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [showCalibration, setShowCalibration] = useState(false);

  const handleFlightDotClick = useCallback((icaoHex: string) => {
    setHighlightedIcao(icaoHex);
  }, []);

  useEffect(() => {
    if (selectedFlight && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedFlight]);

  // Compass / device orientation
  const smoothHeadingRef = useRef(0);
  const rafRef = useRef<number>(0);
  const gotOrientationData = useRef(false);
  const compassAccuracyRef = useRef<number>(0);
  const poorAccuracyStartRef = useRef<number>(0);

  useEffect(() => {
    if (!compassMode) {
      setHeading(0);
      smoothHeadingRef.current = 0;
      gotOrientationData.current = false;
      return;
    }

    let rawHeading = 0;

    const handler = (e: DeviceOrientationEvent) => {
      // iOS provides webkitCompassHeading (degrees clockwise from north)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ios = (e as any).webkitCompassHeading as number | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iosAccuracy = (e as any).webkitCompassAccuracy as number | undefined;
      if (typeof iosAccuracy === "number") {
        compassAccuracyRef.current = iosAccuracy;
      }
      if (typeof ios === "number" && !isNaN(ios)) {
        gotOrientationData.current = true;
        rawHeading = ios;
        return;
      }
      // Android: alpha is counterclockwise from north when absolute
      if (e.alpha !== null && e.absolute) {
        gotOrientationData.current = true;
        rawHeading = 360 - e.alpha;
        return;
      }
      // Fallback: non-absolute alpha (less reliable but still useful)
      if (e.alpha !== null) {
        gotOrientationData.current = true;
        rawHeading = 360 - e.alpha;
      }
      // If event fired but alpha is null — sensor not providing data,
      // gotOrientationData stays false so the timeout will catch it
    };

    // Show calibration on first compass use
    const firstUse = !localStorage.getItem("skyledger:compass-first-use");
    const dismissed = !!localStorage.getItem("skyledger:compass-cal-dismissed");
    if (firstUse && !dismissed) {
      setShowCalibration(true);
    }

    // Smooth heading updates synced to animation frames
    const tick = () => {
      const prev = smoothHeadingRef.current;
      // Shortest angular distance (handles 359° → 1° wraparound)
      let diff = rawHeading - prev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const next = (prev + diff * 0.25 + 360) % 360;
      smoothHeadingRef.current = next;
      setHeading(next);

      // Check compass accuracy degradation (iOS reports webkitCompassAccuracy)
      if (compassAccuracyRef.current > 25) {
        if (!poorAccuracyStartRef.current) poorAccuracyStartRef.current = Date.now();
        if (Date.now() - poorAccuracyStartRef.current > 5000) {
          if (!localStorage.getItem("skyledger:compass-cal-dismissed")) {
            setShowCalibration(true);
          }
          poorAccuracyStartRef.current = 0; // reset so it doesn't fire every frame
        }
      } else {
        poorAccuracyStartRef.current = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Try absolute orientation first (Android), fall back to standard
    let eventName = "deviceorientationabsolute";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).DeviceOrientationAbsoluteEvent) {
      eventName = "deviceorientation";
    }

    window.addEventListener(eventName, handler as EventListener);
    if (eventName !== "deviceorientation") {
      window.addEventListener("deviceorientation", handler as EventListener);
    }

    // If no data arrives after 3 seconds, show help
    const timeout = setTimeout(() => {
      if (!gotOrientationData.current) {
        setCompassMode(false);
        cancelAnimationFrame(rafRef.current);

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);

        if (isIOS) {
          setCompassError(
            "ios"
          );
        } else if (isAndroid) {
          setCompassError(
            "android"
          );
        } else {
          setCompassError(
            "desktop"
          );
        }
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener(eventName, handler as EventListener);
      window.removeEventListener("deviceorientation", handler as EventListener);
    };
  }, [compassMode]);

  const handleCompassToggle = useCallback(async () => {
    if (compassMode) {
      setCompassMode(false);
      setCompassError(null);
      return;
    }

    // iOS 13+ requires permission request — must be triggered by user gesture
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === "function") {
      try {
        const permission = await DOE.requestPermission();
        if (permission !== "granted") {
          setCompassError("ios-denied");
          return;
        }
      } catch {
        setCompassError("ios-denied");
        return;
      }
    }

    setCompassError(null);
    setCompassMode(true);
  }, [compassMode]);

  const handleTrailsUpdate = useCallback((trails: FlightTrail[]) => {
    setFlightTrails(trails);
  }, []);

  const handleFirstFetch = useCallback((count: number) => {
    setFoundCount(count);
    setScanPhase("found");
    setTimeout(() => setScanPhase("tracking"), 2000);
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setScanPhase("locating");
    navigator.geolocation.getCurrentPosition((pos) => {
      setMapCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setScanPhase("scanning");
      setShowFlights(true);
    });
  };

  return (
    <div className="space-y-8">
      {/* Aircraft Lookup */}
      <AircraftLookup />

      {/* Live Flight Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Flight Tracker</CardTitle>
            <Button onClick={handleUseMyLocation} variant="outline" size="sm">
              {mapCenter ? "Update Location" : "Use My Location"}
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <label className="text-xs text-muted-foreground shrink-0">
              Radius:
            </label>
            <div className="flex gap-1">
              {[5, 10, 25, 50].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    radius === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {r} nm
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              (~{Math.round(radius * 1.15)} miles)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click any aircraft to see full details including owner, route, and
            airports. Data refreshes every 5–10 seconds.
          </p>
        </CardHeader>
        <CardContent>
          {!showFlights ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground/50"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold">
                Ready to scan your skies
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Click &quot;Use My Location&quot; to see aircraft near you in
                real-time.
              </p>
              <Button onClick={handleUseMyLocation} className="mt-4">
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Map */}
                <div
                  className="relative overflow-hidden rounded-lg"
                  style={{ height: 400 }}
                >
                  <div
                    style={compassMode ? {
                      position: "absolute" as const,
                      top: "-21%",
                      left: "-21%",
                      width: "142%",
                      height: "142%",
                      transform: `rotate(${-heading}deg)`,
                      transformOrigin: "center center",
                    } : {
                      height: "100%",
                    }}
                  >
                    <MapContainer
                      center={
                        mapCenter
                          ? [mapCenter.lat, mapCenter.lng]
                          : undefined
                      }
                      zoom={10}
                      className="h-full w-full"
                      flightTrails={flightTrails}
                      onFlightDotClick={handleFlightDotClick}
                      compassHeading={compassMode ? heading : undefined}
                      userLocation={
                        mapCenter
                          ? [mapCenter.lat, mapCenter.lng]
                          : undefined
                      }
                      reports={
                        selectedFlight
                          ? [
                              {
                                id: selectedFlight.icao_hex,
                                latitude: selectedFlight.latitude,
                                longitude: selectedFlight.longitude,
                                observed_at: new Date().toISOString(),
                                observation_type: "aircraft",
                                aircraft_count: null,
                                duration_minutes: null,
                                trail_behavior: null,
                                notes: selectedFlight.tail_number || selectedFlight.icao_hex,
                                photo_urls: [],
                                evidence_hash: "",
                                exif_data: null,
                                weather_conditions: null,
                                verification_level: 3,
                                status: "active",
                                created_at: new Date().toISOString(),
                                tail_number: selectedFlight.tail_number || null,
                              },
                            ]
                          : []
                      }
                    />
                  </div>

                  {/* Compass toggle button */}
                  {showFlights && (
                    <button
                      onClick={handleCompassToggle}
                      className={`absolute top-2 right-2 z-[1001] w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-md transition-colors ${
                        compassMode
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background/90 border-border text-muted-foreground hover:bg-muted"
                      }`}
                      title={compassMode ? "Disable compass" : "Orient map to your direction"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        style={{
                          transform: compassMode
                            ? `rotate(${heading}deg)`
                            : undefined,
                        }}
                      >
                        {/* Compass needle: red half points north */}
                        <polygon points="12,2 9,12 12,10 15,12" fill="currentColor" stroke="none" opacity={compassMode ? 1 : 0.6} />
                        <polygon points="12,22 9,12 12,14 15,12" fill="currentColor" stroke="none" opacity={0.25} />
                        <circle cx="12" cy="12" r="10" strokeWidth="1.5" fill="none" />
                      </svg>
                    </button>
                  )}

                  {/* North indicator + recalibrate button when compass is active */}
                  {compassMode && (
                    <div
                      className="absolute top-2 left-2 z-[1001] flex items-center gap-1.5 bg-background/90 rounded-full px-2 py-1 border border-border shadow-sm"
                    >
                      <span
                        className="text-red-500 text-xs font-bold"
                        style={{
                          display: "inline-block",
                          transform: `rotate(${-heading}deg)`,
                        }}
                      >
                        N
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {Math.round(heading)}°
                      </span>
                      <button
                        onClick={() => setShowCalibration(true)}
                        className="text-[10px] text-primary hover:text-primary/80 font-medium ml-0.5"
                        title="Recalibrate compass"
                      >
                        Cal
                      </button>
                    </div>
                  )}

                  {/* Compass help / error notification */}
                  {compassError && (
                    <div className="absolute inset-x-2 bottom-2 z-[1001] bg-background/95 border border-border rounded-lg shadow-lg p-3 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5">
                          <p className="font-semibold text-sm text-foreground">
                            {compassError === "desktop"
                              ? "Compass requires a mobile device"
                              : "Compass orientation not available"}
                          </p>

                          {compassError === "ios" && (
                            <>
                              <p className="text-muted-foreground">
                                Your iPhone may have motion access disabled. To enable:
                              </p>
                              <ol className="text-muted-foreground list-decimal list-inside space-y-0.5">
                                <li>Open <strong>Settings</strong> on your iPhone</li>
                                <li>Scroll to <strong>Safari</strong> (or your browser)</li>
                                <li>Enable <strong>Motion &amp; Orientation Access</strong></li>
                                <li>Return here and tap the compass button again</li>
                              </ol>
                            </>
                          )}

                          {compassError === "ios-denied" && (
                            <>
                              <p className="text-muted-foreground">
                                Motion permission was denied. To fix:
                              </p>
                              <ol className="text-muted-foreground list-decimal list-inside space-y-0.5">
                                <li>Open <strong>Settings &gt; Safari</strong></li>
                                <li>Enable <strong>Motion &amp; Orientation Access</strong></li>
                                <li>Come back to this page and <strong>reload</strong></li>
                                <li>Tap the compass button — you&apos;ll be asked again</li>
                              </ol>
                            </>
                          )}

                          {compassError === "android" && (
                            <>
                              <p className="text-muted-foreground">
                                Motion sensors need to be enabled in Chrome. To turn on:
                              </p>
                              <ol className="text-muted-foreground list-decimal list-inside space-y-0.5">
                                <li>Tap the <strong>three dots menu</strong> (bottom-right)</li>
                                <li>Tap <strong>Settings</strong></li>
                                <li>Under General, tap <strong>Site Settings</strong></li>
                                <li>Under Permissions, tap <strong>Motion Sensors</strong></li>
                                <li>Enable <strong>&quot;Sites can use motion sensors&quot;</strong></li>
                                <li>Return here and tap the compass button again</li>
                              </ol>
                              <p className="text-muted-foreground mt-1">
                                Using a different browser? Look for motion/sensor permissions in your browser&apos;s site settings.
                              </p>
                            </>
                          )}

                          {compassError === "desktop" && (
                            <p className="text-muted-foreground">
                              Live compass orientation uses your phone&apos;s gyroscope and
                              magnetometer. Open this page on your phone to use it.
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setCompassError(null)}
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Scanning overlay */}
                  {scanPhase !== "tracking" && scanPhase !== "idle" && (
                    <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-background/80 rounded-lg pointer-events-none">
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-radar-ping" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-radar-ping" style={{ animationDelay: "0.5s" }} />
                        <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-radar-ping" style={{ animationDelay: "1s" }} />
                        <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg
                            className="h-8 w-8 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="mt-4 text-sm font-medium">
                        {scanPhase === "locating" && "Getting your location..."}
                        {scanPhase === "scanning" && "Scanning airspace..."}
                        {scanPhase === "found" && `Found ${foundCount} aircraft`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Flight list */}
                <div>
                  <FlightLayer
                    mapCenter={mapCenter}
                    radius={radius}
                    onTrailsUpdate={handleTrailsUpdate}
                    onFirstFetch={handleFirstFetch}
                    highlightedIcao={highlightedIcao}
                    onFlightSelect={(flight) => {
                      setHighlightedIcao(null);
                      setSelectedFlight({
                        tail_number: flight.tail_number,
                        callsign: flight.callsign,
                        icao_hex: flight.icao_hex,
                        latitude: flight.latitude,
                        longitude: flight.longitude,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Detail Panel — appears when you click on an aircraft */}
              {selectedFlight && (
                <div ref={detailPanelRef}>
                <FlightDetailPanel
                  hex={selectedFlight.icao_hex}
                  callsign={selectedFlight.callsign || undefined}
                  tail={selectedFlight.tail_number || undefined}
                  onClose={() => setSelectedFlight(null)}
                />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compass calibration dialog */}
      <CompassCalibrationDialog
        open={showCalibration}
        onClose={() => setShowCalibration(false)}
      />

      {/* How it works */}
      <div className="rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">How flight tracking works</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. ADS-B Reception</p>
            <p className="mt-1">
              Aircraft broadcast their position on 1090 MHz. Thousands of
              volunteer antennas worldwide receive these signals and feed them
              to ADSB.lol — an unfiltered, open-data network.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. FAA Registry</p>
            <p className="mt-1">
              Every U.S.-registered aircraft has a tail number linked to an
              owner in the FAA database. This database is public and updated
              daily. We cross-reference to show you who owns what&apos;s flying.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. Route & Operator Info</p>
            <p className="mt-1">
              Click any aircraft to see its departure and arrival airports,
              owner details, and whether it belongs to a known weather
              modification operator. All from free, public data sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
