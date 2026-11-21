import React from "react";
import { m } from "motion/react";
import { reveal } from "../utils/motion";

interface SectionHeaderProps {
  eyebrow?: string;
  /** Plain text; the last word is set in the serif accent. */
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  tone?: "light" | "dark";
  id?: string;
}

/** Splits "A Message for Your Journey" into ["A Message for Your", "Journey"]. */
const splitLastWord = (title: string): [string, string] => {
  const trimmed = title.trim();
  const i = trimmed.lastIndexOf(" ");
  return i === -1 ? ["", trimmed] : [trimmed.slice(0, i), trimmed.slice(i + 1)];
};

/**
 * The site's one section heading: mono eyebrow, heavy headline with the last
 * word in Instrument Serif italic, an optional arrow link, and a hairline.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  action,
  tone = "light",
  id,
}) => {
  const dark = tone === "dark";
  const [lead, last] = splitLastWord(title);

  return (
    <m.div
      {...reveal()}
      className={`mb-12 sm:mb-14 pb-7 border-b ${dark ? "border-white/15" : "border-forest-950/15"} grid gap-6 lg:grid-cols-12 lg:items-end`}
    >
      <div className="lg:col-span-8">
        {eyebrow && (
          <p
            className={`text-xs uppercase tracking-wider ${dark ? "text-gold-300" : "text-gold-700"}`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className={`mt-3 font-display text-4xl sm:text-5xl lg:text-6xl ${dark ? "text-white" : "text-forest-950"}`}
        >
          {lead && <>{lead} </>}
          <span className={dark ? "text-gold-400" : "text-gold-600"}>{last}</span>
        </h2>
        {subtitle && (
          <p
            className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? "text-emerald-100/85" : "text-slate-600"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="lg:col-span-4 lg:text-right">
          <button
            onClick={action.onClick}
            className={`arrow-link cursor-pointer transition-colors ${dark ? "text-white hover:text-gold-300" : "text-forest-950 hover:text-gold-700"}`}
          >
            {action.label}
          </button>
        </div>
      )}
    </m.div>
  );
};
