import { useEffect } from "react";
import { PageId } from "../types";

const SITE = "Wisdom Temple";

/** Search/share title and description for each public page. */
const PAGE_META: Record<PageId, { title: string; description: string }> = {
  home: {
    title: `${SITE} | Raising Leaders, Shaping Visions`,
    description:
      "A Bible-believing charismatic church at Star Junction, Tabora - Accra, Ghana. Join us Sundays at 8:00 AM and Wednesdays for The Secret Place.",
  },
  about: {
    title: `About Us | ${SITE}`,
    description:
      "Meet Rev. Gabriel Dela and the Wisdom Temple family, and learn our vision, mission and what we believe.",
  },
  "watch-listen": {
    title: `Watch & Listen | ${SITE}`,
    description:
      "Watch Sunday messages, Wisdom Summit sessions and midweek teachings, or listen on audio from anywhere.",
  },
  grow: {
    title: `Grow in Faith | ${SITE}`,
    description:
      "Discipleship classes, devotionals and resources to help you grow in your walk with God.",
  },
  ministries: {
    title: `Ministries | ${SITE}`,
    description:
      "Find your place to serve and belong: youth, women, men, children and more at Wisdom Temple.",
  },
  events: {
    title: `Events | ${SITE}`,
    description:
      "Upcoming gatherings including Wisdom Summit 2026, Atmosphere of Prayer and youth events. Register online.",
  },
  gallery: {
    title: `Photo Gallery | ${SITE}`,
    description: "Photos from services, summits and life together at Wisdom Temple.",
  },
  connect: {
    title: `Connect | ${SITE}`,
    description: "Get in touch with the Wisdom Temple family.",
  },
  "new-here": {
    title: `Plan Your Visit | ${SITE}`,
    description:
      "New to Wisdom Temple? Find service times, directions at Star Junction, Tabora, and what to expect on your first Sunday.",
  },
  prayer: {
    title: `Prayer | ${SITE}`,
    description: "Share a prayer request and join us in prayer.",
  },
  "prayer-request": {
    title: `Prayer Requests | ${SITE}`,
    description:
      "Submit a prayer request and our pastoral prayer team will stand with you in faith.",
  },
  give: {
    title: `Give | ${SITE}`,
    description:
      "Give your tithes, offerings and first fruits securely by Mobile Money or bank transfer.",
  },
  contact: {
    title: `Contact Us | ${SITE}`,
    description:
      "Reach the Wisdom Temple office by phone, WhatsApp, email or visit us at Star Junction, Tabora - Accra.",
  },
  admin: {
    title: `Church Administration Portal | ${SITE}`,
    description: "Staff sign-in for Wisdom Temple administration.",
  },
};

const setMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

/** Keeps the tab title, search snippet and share preview in step with the current page. */
export const usePageMeta = (page: PageId) => {
  useEffect(() => {
    const { title, description } = PAGE_META[page] ?? PAGE_META.home;
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    if (page === "admin") setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    else document.head.querySelector('meta[name="robots"]')?.remove();
  }, [page]);
};
