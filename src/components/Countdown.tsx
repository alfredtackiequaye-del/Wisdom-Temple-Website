import React from "react";
import { m, AnimatePresence } from "motion/react";
import { EASE_OUT } from "../utils/motion";
import { NextService } from "../utils/visitSchedule";

/** A ticking countdown cell whose number slides as it changes. */
const Tick: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center min-w-[3.4rem] sm:min-w-[4rem] rounded-xl bg-forest-950/70 border border-gold-500/25 px-2 py-2 sm:py-2.5">
    <div className="relative h-7 sm:h-8 w-full overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="absolute text-xl sm:text-2xl font-bold text-white tabular-nums"
        >
          {String(value).padStart(2, "0")}
        </m.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300/90">
      {label}
    </span>
  </div>
);

export const Countdown: React.FC<{ next: NextService }> = ({ next }) => {
  if (next.status === "live") {
    return (
      <div className="inline-flex items-center gap-3 rounded-full bg-red-600/15 border border-red-500/50 px-5 py-2.5">
        <span className="live-dot" aria-hidden="true" />
        <span className="text-sm sm:text-base font-bold uppercase tracking-[0.16em] text-white">
          Happening now
        </span>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/80 mb-2.5">
        Begins in
      </p>
      <div
        className="flex gap-2 sm:gap-2.5"
        role="timer"
        aria-label={`${next.days} days, ${next.hours} hours and ${next.minutes} minutes to go`}
      >
        <Tick value={next.days} label="Days" />
        <Tick value={next.hours} label="Hrs" />
        <Tick value={next.minutes} label="Min" />
        <Tick value={next.seconds} label="Sec" />
      </div>
    </div>
  );
};
