/** Shared easing for all UI motion: quick start, gentle settle. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * The one scroll-reveal used across the site: a short fade and rise, played
 * once as the element enters the viewport. Spread onto a `motion.*` element.
 */
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -60px 0px" },
  transition: { duration: 0.6, ease: EASE_OUT, delay },
});
