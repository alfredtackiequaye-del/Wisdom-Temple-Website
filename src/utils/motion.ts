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

/**
 * Parent for a staggered reveal: children with `staggerItem` fade/rise in
 * sequence as the group enters the viewport. Spread onto the container.
 */
export const staggerContainer = (stagger = 0.12, delayChildren = 0) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  },
});

/** Child variant for `staggerContainer`. Spread `variants={staggerItem}` onto each item. */
export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Spring used for tactile hover/tap lifts on cards and buttons. */
export const LIFT_SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;
