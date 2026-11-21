import React, { useEffect, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE_OUT } from "../utils/motion";
import { getNextSunday } from "../utils/visitSchedule";
import { Countdown } from "./Countdown";

/* ------------------------------------------------------------------ */
/* Hero: live countdown to Sunday                                       */
/* ------------------------------------------------------------------ */

export const NextServiceCard: React.FC = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="inline-flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
        Next Sunday Celebration · 8:00 AM
      </p>
      <Countdown next={getNextSunday(now)} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero: one strong photo of the people who will welcome you            */
/* ------------------------------------------------------------------ */

export const WelcomePhoto: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <m.figure
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.25, ease: EASE_OUT }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-[2rem] border border-gold-400/25" aria-hidden="true" />
      <img
        src="/assets/photos/wisdom-summit-full-team.webp"
        alt="The Wisdom Temple welcome team smiling together"
        className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
      />
      <figcaption className="absolute -bottom-6 left-6 right-6 sm:left-auto sm:right-8 sm:w-72 rounded-2xl bg-white px-5 py-4 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">
          Look for our hosts
        </p>
        <p className="mt-1 text-sm text-slate-700">
          Ushers in badges will meet you at the door and help you find a seat.
        </p>
      </figcaption>
    </m.figure>
  );
};

/* ------------------------------------------------------------------ */
/* Closing invitation before the form                                  */
/* ------------------------------------------------------------------ */

export const InvitationBand: React.FC<{ ctaHref: string }> = ({ ctaHref }) => {
  const reduce = useReducedMotion();
  return (
    <m.section
      aria-labelledby="seat-waiting"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className="relative isolate overflow-hidden rounded-[2rem] bg-forest-900 text-white shadow-[0_30px_70px_rgba(4,23,15,0.35)]"
    >
      <img
        src="/assets/optimized/hero_icgc_banner.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950 via-forest-950/90 to-forest-950/40"
        aria-hidden="true"
      />

      <div className="max-w-2xl px-7 py-14 sm:px-14 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
          This Sunday · 8:00 AM
        </p>
        <h2
          id="seat-waiting"
          className="font-serif-title mt-4 text-4xl sm:text-5xl lg:text-6xl text-white"
        >
          Your seat is <span className="text-gold-300">waiting.</span>
        </h2>
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-emerald-50/90">
          Tell us you are coming and our hosts will have a seat ready, your
          children's registration prepared, and a warm welcome at the door.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={ctaHref}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 px-7 py-4 text-base font-bold text-forest-950 shadow-lg transition-colors"
          >
            Reserve my seat
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <span className="text-sm text-emerald-100/80">
            Takes under a minute · Free · No obligation
          </span>
        </div>
      </div>
    </m.section>
  );
};

/* ------------------------------------------------------------------ */
/* Form success: a check that draws itself                              */
/* ------------------------------------------------------------------ */

export const SuccessCheck: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest-900 ring-8 ring-gold-400/15"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-gold-300" fill="none">
        <m.path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT }}
        />
      </svg>
    </m.div>
  );
};
