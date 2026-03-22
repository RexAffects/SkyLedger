"use client";

import { useEffect, useState } from "react";
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
      {/* Counter-rotate tooltip boxes in compass mode, pivoting from their anchor edge */}
      {typeof compassHeading === "number" && (
        <style>{`
          .leaflet-tooltip-right { transform-origin: left center; rotate: ${compassHeading}deg; }
          .leaflet-tooltip-left { transform-origin: right center; rotate: ${compassHeading}deg; }
          .leaflet-tooltip-top { transform-origin: center bottom; rotate: ${compassHeading}deg; }
          .leaflet-tooltip-bottom { transform-origin: center top; rotate: ${compassHeading}deg; }
        `}</style>
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
          {/* Inner dot */}
          <CircleMarker
            center={userLocation}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#3b82f6",
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 10]}>
              <span className="text-xs font-semibold">You</span>
            </Tooltip>
          </CircleMarker>
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

            {/* Current position arrow */}
            <Marker
              position={currentPos}
              icon={MapComponents.L.divIcon({
                className: "",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                html: `<svg viewBox="0 0 20 20" width="20" height="20" style="transform:rotate(${trail.heading}deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))${onFlightDotClick ? ";cursor:pointer" : ""}"><polygon points="10,1 4,17 10,13 16,17" fill="${trail.color}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
              })}
              eventHandlers={
                onFlightDotClick
                  ? { click: () => onFlightDotClick(trail.icao_hex) }
                  : undefined
              }
            >
              <Tooltip permanent interactive direction="right" offset={[10, 0]}>
                <span
                  className={`text-xs font-mono font-semibold ${onFlightDotClick ? "cursor-pointer hover:underline" : ""}`}
                  onClick={onFlightDotClick ? (e) => { e.stopPropagation(); onFlightDotClick(trail.icao_hex); } : undefined}
                >
                  {trail.tail_number || trail.icao_hex}
                  {trail.showAltitude && (
                    <span className="font-normal text-gray-500">
                      {" "}{trail.altitude_ft.toLocaleString()} ft
                    </span>
                  )}
                </span>
              </Tooltip>
            </Marker>
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
