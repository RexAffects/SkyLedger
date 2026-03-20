"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FOIA_AGENCIES,
  FOIA_TEMPLATES,
  generateFoiaLetter,
  type FoiaAgency,
  type FoiaTemplate,
} from "@/lib/data/foia";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const federalAgencies = FOIA_AGENCIES.filter((a) => a.level === "federal");
const stateAgencies = FOIA_AGENCIES.filter((a) => a.level === "state");

function agencyById(id: string): FoiaAgency | undefined {
  return FOIA_AGENCIES.find((a) => a.id === id);
}

function templateById(id: string): FoiaTemplate | undefined {
  return FOIA_TEMPLATES.find((t) => t.id === id);
}

function templatesForAgency(agencyId: string): FoiaTemplate[] {
  return FOIA_TEMPLATES.filter((t) => t.agencyIds.includes(agencyId));
}

function agencyNamesForTemplate(template: FoiaTemplate): string[] {
  return template.agencyIds
    .map((id) => agencyById(id)?.shortName)
    .filter(Boolean) as string[];
}

// ---------------------------------------------------------------------------
// Client Component — FOIA Generator
// ---------------------------------------------------------------------------

function FoiaGenerator() {
  const [agencyId, setAgencyId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [stateOrRegion, setStateOrRegion] = useState("");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const availableTemplates = agencyId ? templatesForAgency(agencyId) : [];

  const handleAgencyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newAgencyId = e.target.value;
      setAgencyId(newAgencyId);
      // Reset template if it no longer applies to the new agency
      if (newAgencyId) {
        const newTemplates = templatesForAgency(newAgencyId);
        if (!newTemplates.some((t) => t.id === templateId)) {
          setTemplateId("");
        }
      } else {
        setTemplateId("");
      }
      setLetter("");
      setCopied(false);
    },
    [templateId],
  );

  const handleGenerate = useCallback(() => {
    const agency = agencyById(agencyId);
    const template = templateById(templateId);
    if (!agency || !template) return;

    const result = generateFoiaLetter({
      agency,
      template,
      name: name.trim() || "[YOUR NAME]",
      address: address.trim() || "[YOUR ADDRESS]",
      stateOrRegion: stateOrRegion.trim() || undefined,
    });
    setLetter(result);
    setCopied(false);
  }, [agencyId, templateId, name, address, stateOrRegion]);

  const handleCopy = useCallback(async () => {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text for manual copy
    }
  }, [letter]);

  const handleDownload = useCallback(() => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const agency = agencyById(agencyId);
    const template = templateById(templateId);
    const slug = [agency?.shortName, template?.topic]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    a.download = `foia-request-${slug || "letter"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [letter, agencyId, templateId]);

  const canGenerate = agencyId && templateId;

  const inputClass =
    "rounded border border-border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring";

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Generate a FOIA request</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Select an agency and topic, fill in your details, and we&apos;ll
        generate a properly formatted FOIA letter you can send.
      </p>

      <div className="mt-6 space-y-5">
        {/* Agency select */}
        <div>
          <label
            htmlFor="foia-agency"
            className="mb-1.5 block text-sm font-medium"
          >
            Agency
          </label>
          <select
            id="foia-agency"
            value={agencyId}
            onChange={handleAgencyChange}
            className={inputClass}
          >
            <option value="">Select an agency...</option>
            <optgroup label="Federal Agencies">
              {federalAgencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.shortName}
                </option>
              ))}
            </optgroup>
            <optgroup label="State Agencies">
              {stateAgencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.shortName}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Topic select */}
        <div>
          <label
            htmlFor="foia-topic"
            className="mb-1.5 block text-sm font-medium"
          >
            Topic
          </label>
          <select
            id="foia-topic"
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.target.value);
              setLetter("");
              setCopied(false);
            }}
            disabled={!agencyId}
            className={inputClass}
          >
            <option value="">
              {agencyId
                ? "Select a topic..."
                : "Select an agency first"}
            </option>
            {availableTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.topic}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="foia-name"
            className="mb-1.5 block text-sm font-medium"
          >
            Your Name
          </label>
          <input
            id="foia-name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="foia-address"
            className="mb-1.5 block text-sm font-medium"
          >
            Your Address
          </label>
          <textarea
            id="foia-address"
            rows={3}
            placeholder={"123 Main Street\nCity, State 12345"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* State / Region */}
        <div>
          <label
            htmlFor="foia-state"
            className="mb-1.5 block text-sm font-medium"
          >
            State / Region{" "}
            <span className="font-normal text-muted-foreground">
              (optional &mdash; used to customize the request)
            </span>
          </label>
          <input
            id="foia-state"
            type="text"
            placeholder="e.g. Arkansas, Pacific Northwest"
            value={stateOrRegion}
            onChange={(e) => setStateOrRegion(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Generate button */}
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate}
          size="lg"
        >
          Generate Letter
        </Button>

        {/* Output */}
        {letter && (
          <div className="mt-6 space-y-3">
            <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm leading-relaxed">
              {letter}
            </pre>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                Download as .txt
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FoiaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/get-involved"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Get Involved
      </Link>

      <h1 className="mt-6 text-3xl font-bold">FOIA Request Generator</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        The Freedom of Information Act is one of the most powerful tools
        citizens have. Use this generator to create properly formatted FOIA
        requests targeting the agencies and topics most relevant to weather
        modification and geoengineering transparency.
      </p>

      {/* ---------------------------------------------------------------- */}
      {/* What is FOIA? */}
      {/* ---------------------------------------------------------------- */}
      <section className="mt-10">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold">What is FOIA?</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              The Freedom of Information Act (5 USC &sect; 552) gives you the
              legal right to request records from any federal agency. Most
              states have equivalent laws for state agencies. Agencies must
              respond within 20 business days. Fee waivers are available for
              public interest requests.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The Generator */}
      {/* ---------------------------------------------------------------- */}
      <FoiaGenerator />

      {/* ---------------------------------------------------------------- */}
      {/* Pre-Built Templates */}
      {/* ---------------------------------------------------------------- */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Pre-built templates</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These templates are ready to use with the generator above. Each
          targets specific document types and legal citations.
        </p>
        <div className="mt-4 space-y-4">
          {FOIA_TEMPLATES.map((template) => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{template.topic}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {template.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {agencyNamesForTemplate(template).map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {name}
                    </span>
                  ))}
                </div>
                {template.tips && (
                  <p className="mt-3 text-xs text-muted-foreground italic">
                    Tip: {template.tips}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Tips for Success */}
      {/* ---------------------------------------------------------------- */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Tips for success</h2>
        <div className="mt-4 rounded-lg border border-border p-6">
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
            <li>
              <span className="font-medium text-foreground">
                Be specific in your requests.
              </span>{" "}
              The more precise your document descriptions, the harder it is for
              an agency to claim the request is too broad.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Request fee waivers citing public interest.
              </span>{" "}
              The generated letters include fee waiver language. This is your
              right under FOIA and most state equivalents.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Keep copies of everything you send.
              </span>{" "}
              Save the letter, note the date, and screenshot any online
              submission confirmations.
            </li>
            <li>
              <span className="font-medium text-foreground">
                If denied, you have the right to appeal.
              </span>{" "}
              Denials must cite specific exemptions. Partial denials must still
              release all non-exempt portions.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Note the date you send the request.
              </span>{" "}
              Federal agencies have 20 business days to respond. State timelines
              vary but are typically 5&ndash;10 business days.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Consider sending via certified mail for a paper trail.
              </span>{" "}
              Email submissions are convenient, but certified mail creates a
              legally verifiable record of receipt.
            </li>
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What FOIA Has Already Uncovered */}
      {/* ---------------------------------------------------------------- */}
      <section className="mt-12 mb-8">
        <h2 className="text-xl font-semibold">
          What FOIA has already uncovered
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These discoveries were made by citizens and organizations using the
          exact same process you&apos;re about to use.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm">
                NSF &ldquo;Holy Grail&rdquo; Grant
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                ICAN&apos;s FOIA requests revealed that the National Science
                Foundation funded a $400,000 grant for stratospheric aerosol
                injection research at Cornell and Indiana University &mdash;
                described internally as the &ldquo;holy grail&rdquo; of
                geoengineering targeting.
              </p>
              <a
                href="https://icandecide.org/press-release/ican-documents-show-us-government-funded-holy-grail-of-geoengineering-research/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                Read ICAN&apos;s discovery &rarr;
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm">NOAA SABRE Program</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Through FOIA, ICAN obtained evidence that NOAA&apos;s
                Stratospheric Aerosol processes, Budget and Radiative Effects
                (SABRE) program has been ramping up government geoengineering
                research since 2021 with minimal public disclosure.
              </p>
              <a
                href="https://icandecide.org/press-release/ican-obtains-evidence-showing-the-government-is-ramping-up-geoengineering-research/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                Read ICAN&apos;s discovery &rarr;
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
