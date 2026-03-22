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
  showAltitude?: boolean;
}

interface MapContainerProps {
  reports?: CitizenReport[];
  flightTrails?: FlightTrail[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  userLocation?: [number, number];
}

export function MapContainer({
  reports = [],
  flightTrails = [],
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  onMapClick,
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
      className={className}
      userLocation={userLocation}
    />
  );
}

function MapInner({
  reports,
  flightTrails,
  center,
  zoom,
  onMapClick,
  className,
  userLocation,
}: MapContainerProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
    Polyline: typeof import("react-leaflet").Polyline;
    CircleMarker: typeof import("react-leaflet").CircleMarker;
    Tooltip: typeof import("react-leaflet").Tooltip;
    useMapEvents: typeof import("react-leaflet").useMapEvents;
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
          CircleMarker: rl.CircleMarker,
          Tooltip: rl.Tooltip,
          useMapEvents: rl.useMapEvents,
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

            {/* Current position dot */}
            <CircleMarker
              center={currentPos}
              radius={6}
              pathOptions={{
                color: trail.color,
                fillColor: trail.color,
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Tooltip permanent direction="right" offset={[10, 0]}>
                <span className="text-xs font-mono font-semibold">
                  {trail.tail_number || trail.icao_hex}
                  {trail.showAltitude && (
                    <span className="font-normal text-gray-500">
                      {" "}{trail.altitude_ft.toLocaleString()} ft
                    </span>
                  )}
                </span>
              </Tooltip>
            </CircleMarker>
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
