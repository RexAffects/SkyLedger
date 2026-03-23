"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function Home() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("home.stats.bansLabel"),
      value: t("home.stats.bansValue"),
      href: "/learn/state-bans",
      detail: t("home.stats.bansDetail"),
    },
    {
      label: t("home.stats.billsLabel"),
      value: t("home.stats.billsValue"),
      href: "/learn/pending-bills",
      detail: t("home.stats.billsDetail"),
    },
    {
      label: t("home.stats.federalLabel"),
      value: t("home.stats.federalValue"),
      href: "/learn/clear-skies-act",
      detail: t("home.stats.federalDetail"),
    },
    {
      label: t("home.stats.hearingLabel"),
      value: t("home.stats.hearingValue"),
      href: "/learn/congressional-hearing",
      detail: t("home.stats.hearingDetail"),
    },
  ];

  const learnTopics = [
    {
      title: t("home.knowledge.factsTitle"),
      description: t("home.knowledge.factsDescription"),
      href: "/learn/facts",
    },
    {
      title: t("home.knowledge.moneyTitle"),
      description: t("home.knowledge.moneyDescription"),
      href: "/learn/follow-the-money",
    },
    {
      title: t("home.knowledge.operatorsTitle"),
      description: t("home.knowledge.operatorsDescription"),
      href: "/learn/operators",
    },
    {
      title: t("home.knowledge.legislationTitle"),
      description: t("home.knowledge.legislationDescription"),
      href: "/learn/legislation",
    },
  ];

  const trackerFeatures = [
    {
      label: t("home.tracker.ownerLabel"),
      detail: t("home.tracker.ownerDetail"),
    },
    {
      label: t("home.tracker.destLabel"),
      detail: t("home.tracker.destDetail"),
    },
    {
      label: t("home.tracker.typeLabel"),
      detail: t("home.tracker.typeDetail"),
    },
    {
      label: t("home.tracker.liveLabel"),
      detail: t("home.tracker.liveDetail"),
    },
    {
      label: t("home.tracker.taggedLabel"),
      detail: t("home.tracker.taggedDetail"),
    },
    {
      label: t("home.tracker.tamperLabel"),
      detail: t("home.tracker.tamperDetail"),
    },
  ];

  const dataSources = [
    t("home.dataSources.adsb"),
    t("home.dataSources.faa"),
    t("home.dataSources.noaa"),
    t("home.dataSources.usa"),
    t("home.dataSources.epa"),
    t("home.dataSources.state"),
  ];

  return (
    <div>
      {/* Hero — animated gradient + noise */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-24 sm:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-3 text-lg font-medium text-foreground/70">
              {t("home.hero.subtitle")}
            </p>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {t("home.hero.description")}
            </p>
          </div>

          {/* Stats — glass cards with animated counters */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="glass group rounded-xl p-4 text-center transition-all hover:scale-[1.03]"
              >
                <p className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
                  {stat.detail}
                </p>
              </Link>
            ))}
          </div>

          {/* Three Pillars — bento layout */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            <Link
              href="/flights"
              className="group sm:col-span-2 rounded-xl glass glow-blue p-8 text-center sm:text-left transition-all hover:scale-[1.01]"
            >
              <p className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {t("home.pillars.track.title")}
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
                {t("home.pillars.track.description")}
              </p>
              <p className="mt-5 text-sm text-primary font-semibold">
                {t("home.pillars.track.cta")}
              </p>
            </Link>

            <div className="flex flex-col gap-4">
              <Link
                href="/get-involved"
                className="group flex-1 rounded-xl glass p-6 text-center transition-all hover:scale-[1.02]"
              >
                <p className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {t("home.pillars.action.title")}
                </p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {t("home.pillars.action.description")}
                </p>
                <p className="mt-3 text-sm text-primary font-semibold">
                  {t("home.pillars.action.cta")}
                </p>
              </Link>

              <Link
                href="/learn"
                className="group flex-1 rounded-xl glass p-6 text-center transition-all hover:scale-[1.02]"
              >
                <p className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {t("home.pillars.learn.title")}
                </p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {t("home.pillars.learn.description")}
                </p>
                <p className="mt-3 text-sm text-primary font-semibold">
                  {t("home.pillars.learn.cta")}
                </p>
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground/80">
            {t("home.disclaimer")}{" "}
            <Link
              href="/learn/facts"
              className="underline hover:text-primary transition-colors"
            >
              {t("home.disclaimerLink")}
            </Link>
          </p>
        </div>
      </section>

      {/* Urgent: April 2026 experiments */}
      <section className="scroll-reveal py-10 px-4 sm:px-6 lg:px-8">
        <Link
          href="/learn/operators/stardust-solutions#experiments"
          className="block max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-8 transition-all hover:border-red-400 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-600 text-white animate-pulse">
                {t("home.urgent.badge")}
              </span>
              <span className="text-lg sm:text-xl font-bold text-red-800 dark:text-red-200">
                {t("home.urgent.title")}
              </span>
            </div>
            <p className="mt-3 text-sm text-red-800 dark:text-red-200 font-medium text-center max-w-2xl mx-auto">
              {t("home.urgent.description")}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-red-700 dark:text-red-300 max-w-2xl mx-auto text-left">
              <li>
                <span className="font-semibold">
                  {t("home.urgent.bullet1Label")}
                </span>{" "}
                {t("home.urgent.bullet1")}
              </li>
              <li>
                <span className="font-semibold">
                  {t("home.urgent.bullet2Label")}
                </span>{" "}
                {t("home.urgent.bullet2")}
              </li>
              <li>
                <span className="font-semibold">
                  {t("home.urgent.bullet3Label")}
                </span>{" "}
                {t("home.urgent.bullet3")}
              </li>
              <li>
                {t("home.urgent.bullet4Pre")}{" "}
                <span className="font-semibold">
                  {t("home.urgent.bullet4Quote1")}
                </span>{" "}
                {t("home.urgent.bullet4Mid")}{" "}
                <span className="font-semibold">
                  {t("home.urgent.bullet4Quote2")}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-red-600 dark:text-red-400 font-bold text-center">
              {t("home.urgent.cta")}
            </p>
          </div>
        </Link>
      </section>

      {/* Submit a Photo CTA */}
      <section className="scroll-reveal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t("home.photo.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("home.photo.descriptionPre")}{" "}
              <span className="group relative inline-block">
                <span className="border-b border-dotted border-muted-foreground/50 cursor-help">
                  {t("home.photo.sha256")}
                </span>
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg opacity-0 transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto z-50">
                  <span className="font-semibold block mb-1">
                    {t("home.photo.tooltipTitle")}
                  </span>
                  {t("home.photo.tooltipBody")}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
                </span>
              </span>{" "}
              {t("home.photo.descriptionPost")}
            </p>
          </div>
          <div className="mt-12 mx-auto max-w-4xl">
            <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_-5px_rgb(0_0_0/0.12)] border border-border/30">
              <Image
                src="/images/trail-examples.jpg"
                alt="Examples of citizen-submitted sky observations showing various trail patterns and atmospheric phenomena"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority={false}
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {t("home.photo.caption")}
            </p>
          </div>
          <div className="mt-8 text-center">
            <LinkButton
              href="/reports/new"
              size="lg"
              className="glow-blue"
            >
              {t("home.photo.button")}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* What the flight tracker shows you */}
      <section className="scroll-reveal py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t("home.tracker.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("home.tracker.description")}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trackerFeatures.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
              >
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <LinkButton href="/flights" size="lg" className="glow-blue">
              {t("home.tracker.button")}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Knowledge Bank */}
      <section className="scroll-reveal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t("home.knowledge.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("home.knowledge.description")}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {learnTopics.map((topic) => (
              <Link key={topic.title} href={topic.href}>
                <Card className="h-full transition-all hover:scale-[1.01]">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-base">{topic.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {topic.description}
                    </p>
                    <p className="mt-3 text-xs text-primary font-semibold">
                      {t("home.knowledge.readMore")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Support the Cause */}
      <section className="scroll-reveal py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t("home.help.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("home.help.description")}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Card className="transition-all hover:scale-[1.02]">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
                <h3 className="mt-4 font-semibold">
                  {t("home.help.trackTitle")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("home.help.trackDescription")}
                </p>
                <LinkButton
                  href="/flights"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  {t("home.help.trackButton")}
                </LinkButton>
              </CardContent>
            </Card>
            <Card className="transition-all hover:scale-[1.02]">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">
                  {t("home.help.learnTitle")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("home.help.learnDescription")}
                </p>
                <LinkButton
                  href="/learn"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  {t("home.help.learnButton")}
                </LinkButton>
              </CardContent>
            </Card>
            <Card className="transition-all hover:scale-[1.02]">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">
                  {t("home.help.legalTitle")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("home.help.legalDescription")}
                </p>
                <LinkButton
                  href="/learn/legislation"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  {t("home.help.legalButton")}
                </LinkButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="scroll-reveal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t("home.dataSources.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("home.dataSources.description")}
            </p>
          </div>
          <div className="mt-12 mx-auto max-w-xl">
            <ul className="space-y-3">
              {dataSources.map((source) => (
                <li key={source} className="flex items-center gap-3 text-sm">
                  <svg
                    className="h-5 w-5 shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="scroll-reveal hero-gradient noise-overlay relative py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            {t("home.finalCta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("home.finalCta.description")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/flights" size="lg" className="glow-blue">
              {t("home.finalCta.trackButton")}
            </LinkButton>
            <LinkButton href="/learn" variant="outline" size="lg">
              {t("home.finalCta.evidenceButton")}
            </LinkButton>
            <LinkButton href="/get-involved" variant="outline" size="lg">
              {t("home.finalCta.actionButton")}
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
