"use client";

import { useContext } from "react";
import { LanguageContext } from "./provider";
import { translations } from "./translations";

function getNestedValue(
  obj: Record<string, unknown>,
  key: string,
): string | undefined {
  const result = key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[part] : undefined,
      obj,
    );
  return typeof result === "string" ? result : undefined;
}

export function useTranslation() {
  const { language, setLanguage } = useContext(LanguageContext);

  function t(key: string): string {
    const value = getNestedValue(
      translations[language] as unknown as Record<string, unknown>,
      key,
    );
    if (value !== undefined) return value;
    // Fallback to English
    const fallback = getNestedValue(
      translations.en as unknown as Record<string, unknown>,
      key,
    );
    return fallback ?? key;
  }

  return { t, language, setLanguage };
}
