"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/use-translation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold">{SITE_NAME}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t("footer.platform")}</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/map"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.liveMap")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.evidenceLedger")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reports/new"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.submitObservation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/operators"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.operatorProfiles")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t("footer.takeAction")}</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/get-involved/legal"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.legalHub")}
                </Link>
              </li>
              <li>
                <Link
                  href="/get-involved/foia"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.foiaGenerator")}
                </Link>
              </li>
              <li>
                <Link
                  href="/get-involved/donate"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.supportFight")}
                </Link>
              </li>
              <li>
                <Link
                  href="/get-involved/testing"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.testingGuide")}
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/protect-yourself"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.protectYourself")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t("footer.about")}</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.missionMethodology")}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/RexAffects/OpenSkies"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("footer.sourceCode")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
