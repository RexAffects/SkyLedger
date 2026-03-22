"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/constants";
import type { CitizenReport } from "@/lib/types";

// Leaflet CSS must be imported client-side
import "leaflet/dist/leaflet.css";

export interface FlightTrail {
  icao_hex: string;
  tail_number: string | null;
  positions: [number, number][]; // [lat, lng][]
  color: string;
  altitude_ft: number;
  heading: number;
  showAltitude?: boolean;
}

interface MapContainerProps {
  reports?: CitizenReport[];
  flightTrails?: FlightTrail[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  onFlightDotClick?: (icaoHex: string) => void;
  compassHeading?: number;
  className?: string;
  userLocation?: [number, number];
}

export function MapContainer({
  reports = [],
  flightTrails = [],
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  onMapClick,
  onFlightDotClick,
  compassHeading,
  className = "h-[600px] w-full",
  userLocation,
}: MapContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <MapInner
      reports={reports}
      flightTrails={flightTrails}
      center={center}
      zoom={zoom}
      onMapClick={onMapClick}
      onFlightDotClick={onFlightDotClick}
      compassHeading={compassHeading}
      className={className}
      userLocation={userLocation}
    />
  );
}

/** Project a point from lat/lng at a bearing (degrees) by a distance (degrees). */
function projectPoint(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceDeg: number
): [number, number] {
  const rad = (bearingDeg * Math.PI) / 180;
  const dLat = distanceDeg * Math.cos(rad);
  const dLng = (distanceDeg * Math.sin(rad)) / Math.cos((lat * Math.PI) / 180);
  return [lat + dLat, lng + dLng];
}

function MapInner({
  reports,
  flightTrails,
  center,
  zoom,
  onMapClick,
  onFlightDotClick,
  compassHeading,
  className,
  userLocation,
}: MapContainerProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
    Polyline: typeof import("react-leaflet").Polyline;
    Polygon: typeof import("react-leaflet").Polygon;
    CircleMarker: typeof import("react-leaflet").CircleMarker;
    Tooltip: typeof import("react-leaflet").Tooltip;
    useMapEvents: typeof import("react-leaflet").useMapEvents;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  } | null>(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([rl, leaflet]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });
        setMapComponents({
          MapContainer: rl.MapContainer,
          TileLayer: rl.TileLayer,
          Marker: rl.Marker,
          Popup: rl.Popup,
          Polyline: rl.Polyline,
          Polygon: rl.Polygon,
          CircleMarker: rl.CircleMarker,
          Tooltip: rl.Tooltip,
          useMapEvents: rl.useMapEvents,
          L: leaflet.default,
        });
      }
    );
  }, []);

  if (!MapComponents) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const {
    MapContainer: LeafletMap,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    Polygon,
    CircleMarker,
    Tooltip,
  } = MapComponents;

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      className={className}
      style={{ borderRadius: "0.5rem" }}
    >
      {/* Counter-rotate "You" tooltip in compass mode */}
      {typeof compassHeading === "number" && (
        <style>{`.leaflet-tooltip-bottom { transform-origin: center top; rotate: ${compassHeading}deg; }`}</style>
      )}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onMapClick && (
        <ClickHandler
          onClick={onMapClick}
          useMapEvents={MapComponents.useMapEvents}
        />
      )}
      {typeof compassHeading === "number" && (
        <CompassDragHandler
          compassHeading={compassHeading}
          useMapEvents={MapComponents.useMapEvents}
        />
      )}

      {/* Citizen report markers */}
      {reports?.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
        >
          <Popup>
            <div className="min-w-[200px]">
              <p className="font-semibold text-sm">
                {report.observation_type.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {new Date(report.observed_at).toLocaleDateString()}{" "}
                {new Date(report.observed_at).toLocaleTimeString()}
              </p>
              {report.notes && (
                <p className="text-xs mt-2">{report.notes}</p>
              )}
              <a
                href={`/reports/${report.id}`}
                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
              >
                View full report
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* User location pin */}
      {userLocation && (
        <>
          {/* Direction cone when compass is active */}
          {typeof compassHeading === "number" && (
            <Polygon
              positions={[
                userLocation,
                projectPoint(userLocation[0], userLocation[1], compassHeading - 20, 0.018),
                projectPoint(userLocation[0], userLocation[1], compassHeading, 0.025),
                projectPoint(userLocation[0], userLocation[1], compassHeading + 20, 0.018),
              ]}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.25,
                weight: 0,
              }}
            />
          )}
          {/* Halo */}
          <CircleMarker
            center={userLocation}
            radius={20}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.15,
              weight: 1,
            }}
          />
          {/* Inner dot + label */}
          <Marker
            position={userLocation}
            interactive={false}
            icon={MapComponents.L.divIcon({
              className: "",
              iconSize: [16, 16],
              iconAnchor: [8, 8],
              html: `<div style="position:relative;width:16px;height:16px">
                <svg viewBox="0 0 16 16" width="16" height="16" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))"><circle cx="8" cy="8" r="7" fill="#3b82f6" stroke="#fff" stroke-width="3"/></svg>
                <span style="position:absolute;left:50%;top:18px;transform:translateX(-50%)${typeof compassHeading === "number" ? ` rotate(${compassHeading}deg)` : ""};white-space:nowrap;font-size:11px;font-weight:600;color:#1a1a1a;background:rgba(255,255,255,.9);padding:1px 5px;border-radius:3px;border:1px solid rgba(0,0,0,.15);box-shadow:0 1px 3px rgba(0,0,0,.15)">You</span>
              </div>`,
            })}
          />
        </>
      )}

      {/* Flight trails */}
      {flightTrails?.map((trail) => {
        if (trail.positions.length < 2) return null;
        const currentPos = trail.positions[trail.positions.length - 1];

        return (
          <span key={trail.icao_hex}>
            {/* Trail line */}
            <Polyline
              positions={trail.positions}
              pathOptions={{
                color: trail.color,
                weight: 3,
                opacity: 0.7,
                dashArray: undefined,
              }}
            />

            {/* Current position arrow + label (same DOM element so label stays pinned) */}
            <Marker
              position={currentPos}
              icon={MapComponents.L.divIcon({
                className: "",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                html: `<div style="position:relative;width:20px;height:20px${onFlightDotClick ? ";cursor:pointer" : ""}">
                  <svg viewBox="0 0 20 20" width="20" height="20" style="transform:rotate(${trail.heading}deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))"><polygon points="10,1 4,17 10,13 16,17" fill="${trail.color}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>
                  <span style="position:absolute;left:22px;top:50%;transform:translateY(-50%)${typeof compassHeading === "number" ? ` rotate(${compassHeading}deg)` : ""};transform-origin:left center;white-space:nowrap;font-size:11px;font-family:ui-monospace,SFMono-Regular,monospace;font-weight:600;color:#1a1a1a;background:rgba(255,255,255,.9);padding:1px 5px;border-radius:3px;border:1px solid rgba(0,0,0,.15);box-shadow:0 1px 3px rgba(0,0,0,.15);pointer-events:auto${onFlightDotClick ? ";cursor:pointer" : ""}">${trail.tail_number || trail.icao_hex}${trail.showAltitude ? ` <span style="font-weight:400;color:#6b7280">${trail.altitude_ft.toLocaleString()} ft</span>` : ""}</span>
                </div>`,
              })}
              eventHandlers={
                onFlightDotClick
                  ? { click: () => onFlightDotClick(trail.icao_hex) }
                  : undefined
              }
            />
          </span>
        );
      })}
    </LeafletMap>
  );
}

function ClickHandler({
  onClick,
  useMapEvents,
}: {
  onClick: (lat: number, lng: number) => void;
  useMapEvents: typeof import("react-leaflet").useMapEvents;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * When compass mode is active, Leaflet's built-in drag handler operates in
 * unrotated screen space, making panning feel broken. This component disables
 * the default drag, captures touch/mouse events, rotates the delta vector by
 * the compass heading, and applies the corrected pan via map.panBy().
 *
 * Pinch-to-zoom is left untouched (only single-finger drags are intercepted).
 */
function CompassDragHandler({
  compassHeading,
  useMapEvents,
}: {
  compassHeading: number;
  useMapEvents: typeof import("react-leaflet").useMapEvents;
}) {
  const headingRef = useRef(compassHeading);
  headingRef.current = compassHeading;

  const map = useMapEvents({});

  useEffect(() => {
    map.dragging.disable();
    const container = map.getContainer();

    // --- Touch (mobile) ---
    let touchDragging = false;
    let lastTouch = { x: 0, y: 0 };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchDragging = true;
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        touchDragging = false; // multi-touch → let Leaflet zoom handle it
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchDragging || e.touches.length !== 1) {
        touchDragging = false;
        return;
      }
      e.preventDefault(); // prevent page scroll

      const touch = e.touches[0];
      const dx = touch.clientX - lastTouch.x;
      const dy = touch.clientY - lastTouch.y;
      lastTouch = { x: touch.clientX, y: touch.clientY };

      const h = headingRef.current * (Math.PI / 180);
      const mapDx = dx * Math.cos(h) - dy * Math.sin(h);
      const mapDy = dx * Math.sin(h) + dy * Math.cos(h);
      map.panBy([-mapDx, -mapDy], { animate: false });
    };

    const onTouchEnd = () => {
      touchDragging = false;
    };

    // --- Mouse (desktop) ---
    let mouseDragging = false;
    let lastMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      mouseDragging = true;
      lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDragging) return;

      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      lastMouse = { x: e.clientX, y: e.clientY };

      const h = headingRef.current * (Math.PI / 180);
      const mapDx = dx * Math.cos(h) - dy * Math.sin(h);
      const mapDy = dx * Math.sin(h) + dy * Math.cos(h);
      map.panBy([-mapDx, -mapDy], { animate: false });
    };

    const onMouseUp = () => {
      mouseDragging = false;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);
    container.addEventListener("touchcancel", onTouchEnd);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);

    return () => {
      map.dragging.enable();
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
    };
  }, [map]);

  return null;
}
