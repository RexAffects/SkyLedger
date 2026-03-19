import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About & Methodology",
  description:
    "How SkyLedger works: our data sources, methodology, evidence standards, and mission.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">About SkyLedger</h1>

      {/* Mission */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Mission</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          SkyLedger exists to bring transparency to weather modification
          programs. We believe that citizens have a right to know what is
          happening in their skies, who is responsible, and whether it is
          authorized.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We do not make accusations or draw conclusions. We aggregate publicly
          available government data, facilitate citizen observations, and present
          the facts. If weather modification is beneficial, the data will show
          it. If it is harmful, the data will show that too. Either way, people
          deserve access to the information.
        </p>
      </section>

      {/* Data Sources */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <DataSourceCard
            title="ADS-B Flight Data"
            source="ADSB.lol"
            description="Unfiltered, real-time aircraft position data from the ADS-B Exchange network. Unlike commercial flight trackers, this data is not filtered or blocked &mdash; military, government, and privacy-blocked aircraft are visible."
          />
          <DataSourceCard
            title="FAA Aircraft Registry"
            source="registry.faa.gov"
            description="The complete United States aircraft registration database, updated daily. Every registered aircraft's tail number, owner name, owner address, aircraft type, and registration status."
          />
          <DataSourceCard
            title="NOAA Weather Modification Reports"
            source="library.noaa.gov"
            description="Reports filed under the Weather Modification Reporting Act of 1972 (15 USC 330). Operators are required to report weather modification activities to NOAA at least 10 days before starting. 1,084+ reports in the database."
          />
          <DataSourceCard
            title="Federal Contracts"
            source="USASpending.gov"
            description="Searchable database of all federal government contract awards. Includes contracts to weather modification companies, geoengineering research grants, and related government spending."
          />
          <DataSourceCard
            title="Air Quality Data"
            source="EPA AQS / AirNow"
            description="Real-time and historical air quality measurements from EPA monitoring stations across the United States. Includes particulate matter, ozone, and other pollutant readings."
          />
          <DataSourceCard
            title="Weather Conditions"
            source="NWS API"
            description="National Weather Service data at the time and location of each observation. Provides atmospheric context (temperature, humidity, wind) that is relevant to understanding trail persistence."
          />
        </div>
      </section>

      {/* Methodology */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Methodology</h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-medium">Evidence Integrity</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Every photo submitted to SkyLedger is SHA-256 hashed in the
              user&apos;s browser before upload. The hash is stored alongside the
              photo. Anyone can independently verify that a photo has not been
              modified since submission by downloading the photo, generating its
              SHA-256 hash, and comparing it to the stored hash. This is the same
              standard used by the eyeWitness to Atrocities app, which has
              produced evidence accepted in international courts.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Structured Observations</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Reports use a structured form that captures factual observations:
              what was seen, when, where, and how many aircraft. We specifically
              avoid fields that ask for conclusions or interpretations. The
              observation type field (persistent trail, spray pattern, grid
              pattern, etc.) describes what was visually observed, not what is
              assumed about intent.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Null Reports</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Citizens can submit &quot;null reports&quot; &mdash; observations
              that nothing unusual was seen. This is critically important for
              scientific credibility. It establishes baseline data and prevents
              the dataset from being biased toward only unusual activity.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Verification Levels</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Each report carries a verification level:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>
                <strong>Level 1 &mdash; Unverified:</strong> Single citizen
                observation, no corroboration.
              </li>
              <li>
                <strong>Level 2 &mdash; Corroborated:</strong> Multiple
                independent observations of the same event from different
                locations.
              </li>
              <li>
                <strong>Level 3 &mdash; Flight-Matched:</strong> Observation
                correlated with a specific aircraft via ADS-B data and FAA
                registry.
              </li>
              <li>
                <strong>Level 4 &mdash; Expert Verified:</strong> Reviewed by a
                qualified professional (atmospheric scientist, pilot, etc.).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">Flight Correlation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When a citizen submits an observation with GPS coordinates and a
              timestamp, SkyLedger queries ADS-B flight data for aircraft that
              were in the vicinity at that time. Matched aircraft are
              cross-referenced with the FAA registry to identify the owner, and
              with NOAA reports to determine if the operator has filed required
              weather modification activity reports.
            </p>
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Legal Framework</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          All data presented on SkyLedger comes from publicly available
          government databases and voluntary citizen observations. We do not
          access private systems, intercept communications, or conduct
          surveillance. Aircraft position data is broadcast openly on the 1090
          MHz frequency and is received by thousands of volunteer antennas
          worldwide.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          SkyLedger is open source under the AGPL-3.0 license. The complete
          source code is available for public audit. We do not collect personal
          information from observers beyond what they voluntarily submit.
        </p>
      </section>

      {/* Open Source */}
      <section className="mt-12 mb-8">
        <h2 className="text-xl font-semibold">Open Source</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          SkyLedger is licensed under AGPL-3.0. This means:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
          <li>Anyone can view, audit, and verify the source code</li>
          <li>Anyone can fork and run their own instance</li>
          <li>
            Any modified version must also be open source (preventing co-option)
          </li>
          <li>The platform cannot be permanently taken down</li>
        </ul>
      </section>
    </div>
  );
}

function DataSourceCard({
  title,
  source,
  description,
}: {
  title: string;
  source: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <p className="text-xs text-muted-foreground font-mono">{source}</p>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
