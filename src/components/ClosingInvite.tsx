import React from "react";
import { m } from "motion/react";
import { PageId } from "../types";
import { reveal } from "../utils/motion";

/** The "Come and see for yourself" invitation that closes the content pages. */
export const ClosingInvite: React.FC<{ onNavigate: (page: PageId) => void }> = ({ onNavigate }) => (
  <m.div {...reveal()} className="text-center max-w-2xl mx-auto space-y-5 pb-4">
    <h3 className="text-3xl sm:text-4xl text-forest-900 font-serif-title">Come and see for yourself</h3>
    <p className="text-slate-600 leading-relaxed">
      Whether you join us on a Sunday morning, a Wednesday evening or online, there is a seat saved for you.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={() => onNavigate("new-here")}
        className="px-7 py-3.5 rounded-xl bg-forest-900 text-white text-sm font-bold hover:bg-forest-700 transition-colors cursor-pointer"
      >
        Plan your visit
      </button>
      <button
        onClick={() => onNavigate("watch-listen")}
        className="px-7 py-3.5 rounded-xl border border-forest-900/25 text-forest-900 text-sm font-bold hover:bg-white transition-colors cursor-pointer"
      >
        Watch online
      </button>
      <button
        onClick={() => onNavigate("contact")}
        className="px-4 py-3.5 text-sm font-semibold text-forest-700 hover:text-forest-500 cursor-pointer"
      >
        Get in touch
      </button>
    </div>
  </m.div>
);
