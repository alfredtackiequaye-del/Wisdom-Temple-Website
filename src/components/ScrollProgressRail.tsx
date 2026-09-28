import React, { useEffect, useState } from "react";

interface RailSection {
  id: string;
  label: string;
}

interface ScrollProgressRailProps {
  sections: RailSection[];
}

/**
 * Desktop-only dot rail on the page edge that tracks which section is in
 * view and lets a visitor jump straight to any of them.
 */
export const ScrollProgressRail: React.FC<ScrollProgressRailProps> = ({
  sections,
}) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-42% 0px -50% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Page sections"
      className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-1.5 rounded-full bg-forest-950/70 backdrop-blur-md border border-white/10 px-2 py-4 shadow-[0_16px_38px_rgba(3,32,20,0.28)]"
    >
      {sections.map((section) => {
        const active = section.id === activeId;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            aria-label={`Jump to ${section.label}`}
            aria-current={active}
            className="group relative flex items-center justify-center py-2 cursor-pointer"
          >
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-white/10 bg-forest-950/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {section.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                active
                  ? "h-2.5 w-2.5 bg-gold-400 shadow-[0_0_0_4px_rgba(201,151,38,0.25)]"
                  : "h-1.5 w-1.5 bg-white/30 group-hover:bg-gold-300"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
