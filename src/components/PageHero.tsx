import React from "react";
import { m, useReducedMotion } from "motion/react";
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

/** "Contact Us" -> "Contact <em>Us</em>": the last word takes the serif accent. */
const AccentLast: React.FC<{ text: string }> = ({ text: raw }) => {
  // Staff-entered titles are sometimes all caps; set them in Title Case.
  const text =
    raw === raw.toUpperCase()
      ? raw.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
      : raw;
  const i = text.trim().lastIndexOf(" ");
  if (i === -1) return <span className="text-gold-400">{text}</span>;
  return (
    <>
      {text.slice(0, i)} <span className="text-gold-400">{text.slice(i + 1)}</span>
    </>
  );
};

/**
 * The shared page header: a full-bleed photo under an ink fade, a mono eyebrow,
 * and a heavy left-aligned headline anchored to the bottom, ruled off from the
 * intro text. Every inner page opens the same way.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  image,
  imagePosition = "center 30%",
  eyebrow,
  title,
  text,
  children,
}) => {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, ease: EASE_OUT, delay },
  });

  return (
    <section className="relative isolate overflow-hidden bg-forest-950 text-white min-h-[62vh] flex flex-col justify-end pt-32 pb-12 sm:pb-16">
      <div className="absolute inset-0 -z-10">
        <img
          src={image}
          alt=""
          decoding="async"
          style={{ objectPosition: imagePosition }}
          className="hero-drift w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/40 to-forest-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/60 to-transparent" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.p {...rise(0)} className="text-xs uppercase tracking-wider text-gold-300">
          {eyebrow}
        </m.p>
        <m.h1
          {...rise(0.08)}
          className="mt-4 max-w-5xl font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-white"
        >
          {typeof title === "string" ? <AccentLast text={title} /> : title}
        </m.h1>
        {(text || children) && (
          <m.div
            {...rise(0.2)}
            className="mt-10 pt-7 border-t border-white/20 grid gap-6 lg:grid-cols-12 lg:items-end"
          >
            {text && (
              <p className="lg:col-span-7 text-lg text-emerald-50/90 leading-relaxed">{text}</p>
            )}
            {children && <div className="lg:col-span-5 lg:justify-self-end">{children}</div>}
          </m.div>
        )}
      </div>
    </section>
  );
};
