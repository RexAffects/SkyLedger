import type { Metadata } from "next";
import { FlightsView } from "./flights-view";

export const metadata: Metadata = {
  title: "Track Flights",
  description:
    "Track aircraft in real-time using unfiltered ADS-B data. Look up any tail number to find the owner in the FAA registry.",
};

export default function FlightsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Track Flights</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time aircraft tracking via ADS-B with FAA registry lookup.
          Unlike commercial flight trackers, this data is unfiltered &mdash;
          military, government, and privacy-blocked aircraft are visible.
        </p>
      </div>
      <FlightsView />
    </div>
  );
}
