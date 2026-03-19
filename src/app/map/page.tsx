import type { Metadata } from "next";
import { MapView } from "./map-view";

export const metadata: Metadata = {
  title: "Live Map",
  description:
    "Real-time map of citizen observations and weather modification activity across the United States.",
};

export default function MapPage() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-muted/30 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">Live Map</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Citizen observations plotted in real-time. Click any marker to see
            details.
          </p>
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <MapView />
        </div>
      </div>
    </div>
  );
}
