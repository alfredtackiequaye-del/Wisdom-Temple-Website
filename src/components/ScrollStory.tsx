import React, { useEffect, useRef, useState } from "react";

export interface ScrollStoryStep {
  icon: React.ComponentType<{ className?: string }>;
  /** Small label above the title, e.g. a time or a chapter number. */
  label: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  action?: { label: string; onClick: () => void };
}

interface ScrollStoryProps {
  steps: ScrollStoryStep[];
  /** Tailwind `top-*` class for the pinned photo; raise it on pages with a sticky sub-nav. */
  stickyTop?: string;
}

/**
 * A pinned photo that changes as the visitor scrolls through the steps beside it (desktop).
 * On phones and tablets each step shows its own photo above its text.
 */
export const ScrollStory: React.FC<ScrollStoryProps> = ({ steps, stickyTop = "top-28" }) => {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLLIElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [steps.length]);

  const current = steps[Math.min(active, steps.length - 1)];

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
      {/* Pinned photo (desktop only) */}
      <div className="hidden lg:block">
        <div
          className={`sticky ${stickyTop} h-[min(32rem,70vh)] rounded-3xl overflow-hidden shadow-lift border border-gold-500/30 bg-forest-900`}
        >
          {steps.map((step, i) => (
            <img
              key={step.title}
              src={step.image}
              alt={i === active ? step.alt : ""}
              aria-hidden={i !== active}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
          <div className="absolute left-6 bottom-6 right-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-300">{current.label}</p>
              <p className="font-serif-title text-3xl text-white">{current.title}</p>
            </div>
            <div className="flex gap-1.5" aria-hidden="true">
              {steps.map((step, i) => (
                <span
                  key={step.title}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === active ? "w-8 bg-gold-400" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-10 lg:space-y-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="lg:min-h-[28rem] lg:flex lg:flex-col lg:justify-center"
            >
              {/* Phones and tablets: the photo sits above its step (the wrapper hides it on desktop). */}
              <div className="lg:hidden mb-5">
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[16/10] object-cover rounded-2xl shadow-md"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-14 h-14 rounded-full bg-forest-900 ring-2 ring-gold-500 border-4 border-gold-50 flex items-center justify-center shadow-lg shrink-0">
                  <Icon className="w-6 h-6 text-gold-300" />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700">{step.label}</p>
              </div>
              <h3 className="mt-4 text-2xl sm:text-3xl text-forest-900 font-serif-title">{step.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed max-w-md">{step.text}</p>
              {step.action && (
                <button
                  type="button"
                  onClick={step.action.onClick}
                  className="mt-4 self-start text-sm font-semibold text-forest-700 hover:text-forest-500 cursor-pointer"
                >
                  {step.action.label} →
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
