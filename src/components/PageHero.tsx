import React from "react";
import { m } from "motion/react";
import { EASE_OUT } from "../utils/motion";

interface PageHeroProps {
  image: string;
  /** CSS object-position for the photo, e.g. "center 30%". */
  imagePosition?: string;
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  /** Extra content under the text (badges, buttons). */
  children?: React.ReactNode;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE_OUT, delay },
});

/**
 * The shared page header: a photo that drifts slowly under a dark fade, soft gold
 * and green glows, fine grain, and a staggered entrance. Every public page uses it
 * so the whole site opens the same way.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  image,
  imagePosition = "center 30%",
  eyebrow,
  title,
  text,
  children,
}) => (
  <section className="ambient-glow relative bg-forest-950 text-white py-20 sm:py-24 border-b border-gold-500/30">
    <div className="absolute inset-0 z-0">
      <img
        src={image}
        alt=""
        decoding="async"
        style={{ objectPosition: imagePosition }}
        className="hero-drift w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/55 to-forest-950" />
      <div className="absolute inset-0 hero-grain" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
      <m.span
        {...rise(0)}
        className="text-[11px] text-gold-300 font-bold uppercase tracking-[0.22em] inline-flex items-center gap-3"
      >
        <span className="h-px w-8 bg-gold-400/70" aria-hidden="true" />
        {eyebrow}
        <span className="h-px w-8 bg-gold-400/70" aria-hidden="true" />
      </m.span>
      <m.h1
        {...rise(0.08)}
        className="text-4xl sm:text-5xl lg:text-6xl text-white font-serif-title leading-[1.08] text-shadow-hero"
      >
        {title}
      </m.h1>
      {text && (
        <m.p {...rise(0.16)} className="text-base sm:text-lg text-emerald-100/85 max-w-2xl mx-auto leading-relaxed">
          {text}
        </m.p>
      )}
      {children && <m.div {...rise(0.24)}>{children}</m.div>}
    </div>
  </section>
);
