import React, { useState, useEffect, useCallback } from "react";
import { SiteContentConfig, ContentSectionId } from "../types";

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  // --- Homepage & Hero ---
  heroEyebrow: "A place to belong",
  heroHeadline: "Faith. Purpose. Community.",
  heroSubtitle: "A vibrant church family in the heart of Tabora.",
  heroButtonPrimary: "PLAN YOUR VISIT",
  heroButtonSecondary: "UPCOMING EVENTS",
  experienceSectionBadge: "EXPERIENCE WISDOM TEMPLE",
  experienceSectionTitle: "Get Connected & Grow in Faith",
  experienceSectionSubtitle:
    "Whether joining in person or online, here are clear steps for you and your family.",
  experienceMod1Title: "Visit In-Person",
  experienceMod1Desc:
    "Join us at Star Junction, Tabora for charismatic praise, spirit-filled worship, and foundational biblical teaching.",
  experienceMod2Title: "Watch on Demand",
  experienceMod2Desc:
    "Catch up on previous Sunday sermons, Wisdom Summit series, and midweek teachings anywhere on video or audio.",
  experienceMod3Title: "The Secret Place Prayer Service",
  experienceMod3Desc:
    "Our midweek prayer service of passionate intercession, prophetic ministry, and personal renewal in God's presence.",
  firstTimeVisitorEyebrow: "Visiting for the First Time?",
  firstTimeVisitorTitle: "You're Welcome Here",
  firstTimeVisitorDesc:
    "Stepping into a new church should feel warm, uplifting, and inspiring. At Wisdom Temple, you are received as honored family from the moment you arrive.",

  // --- Church Identity & Contact ---
  churchName: "Wisdom Temple",
  churchTagline:
    "Raising Leaders. Shaping Visions. Influencing Society Through Christ.",
  churchDescription:
    "A Bible-believing charismatic Church committed to raising leaders, shaping visions and influencing society through Christ.",
  churchAddress: "Wisdom Temple, Star Junction, Tabora - Accra, Ghana",
  churchLandmark: "Star Junction, Tabora",
  churchPhone: "0245009764",
  churchWhatsApp: "0245009764",
  churchEmail: "icgcwisdomtemple@gmail.com",
  officeHours: "Tuesday – Friday: 8:30 AM – 4:30 PM",
  socialYoutube: "https://www.youtube.com/@icgcwisdomtemple",
  socialFacebook: "https://facebook.com",
  socialInstagram: "https://instagram.com",
  socialTiktok: "https://tiktok.com",

  // --- Pastoral Leadership & Pastor's Desk ---
  pastorName: "Rev. Gabriel Dela",
  pastorTitle: "Shepherd & Senior Minister",
  firstLadyName: "Lady Dr. Helena Dela",
  firstLadyTitle: "First Lady",
  combinedPastoralTitle: "Rev. Gabriel Dela & Lady Dr. Helena Dela",
  pastoralTheme: "Walking in Kingdom Wisdom & Divine Direction",
  pastoralScripture:
    "“Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.” — Proverbs 3:5-6",
  pastoralDateLabel: "Weekly Charge • Updated This Sunday",
  pastoralGreetingSummary:
    "Beloved family and honored guests, I warmly welcome you into a week loaded with supernatural breakthrough and divine clarity. At Wisdom Temple, we believe that when God's Word illuminates your path, confusion gives way to conviction, and stagnation turns into momentum. Whatever mountains or decisions confront you this week, know that the God who called you is already ahead of you.",
  pastoralFullMessage: [
    "Beloved family and honored guests, I warmly welcome you into a week loaded with supernatural breakthrough and divine clarity. At Wisdom Temple, we believe that when God's Word illuminates your path, confusion gives way to conviction, and stagnation turns into momentum.",
    "The world often tells us to rely strictly on human intellect, connections, and hustle. While excellence and diligence are biblical virtues, kingdom wisdom teaches us that true elevation begins on your knees in communion with the Holy Spirit. When you invite Jesus into your career, your family, your business, and your quiet thoughts, He grants you divine insight that surpasses human strategy.",
    "This week, make time for the secret place of prayer. Speak life over your household, guard your peace fiercely against negativity, and stand firm on God's covenant promises. Lady Dr. Helena Dela and I are lifting you daily in our pastoral prayers.",
    "May the peace of God which transcends all human understanding guard your heart and mind through Christ Jesus. You are blessed, highly favored, and destined for greatness!",
  ],
  pastoralBio:
    "Rev. Gabriel Dela serves as the Shepherd and Senior Minister of ICGC Wisdom Temple. Alongside his wife, Lady Dr. Helena Dela, they shepherd the Wisdom Temple family with passionate biblical exposition, pastoral compassion, and prophetic intercession, dedicated to raising leaders, shaping visions, and influencing society through Christ.",

  // --- About Us & Mandate ---
  aboutHeadline: "ABOUT WISDOM TEMPLE",
  aboutWhoWeAre1:
    "Wisdom Temple is a Bible-believing, charismatic church committed to raising leaders, shaping visions, and influencing society through Jesus Christ, located in Star Junction, Tabora - Accra, Ghana.",
  aboutWhoWeAre2:
    "At Wisdom Temple, we believe every human being possesses God-given potential waiting to be activated through the Word of God, charismatic prayer, and practical discipleship. Whether you are a student, an artisan, a corporate executive, or a parent, you will find a home where your faith is grounded, your gifts are sharpened, and your purpose is unleased.",
  aboutVisionTitle:
    "To Establish the House of God Through the Development of the Human Personality",
  aboutVisionText:
    "We envision a congregation of believers who have discovered their god-given identity, walking in divine dignity, moral uprightness, and spiritual authority across Ghana, Africa, and the global diaspora.",
  aboutMissionTitle:
    "Raising Leaders, Shaping Visions, and Influencing Society Through Christ",
  aboutMissionText:
    "We accomplish this mission through regular exposition of the Holy Scriptures, fervent charismatic prayer at The Secret Place, leadership mentoring, and purposeful generational ministries.",
  pillar1Title: "Raising Leaders",
  pillar1Desc:
    "Instilling godly discipline, ethical accountability, and servant leadership in every believer, from youth to seasoned executives.",
  pillar2Title: "Shaping Visions",
  pillar2Desc:
    "Assisting men and women to discover divine purpose, formulate clear personal and family blueprints, and execute enterprise with biblical excellence.",
  pillar3Title: "Influencing Society Through Christ",
  pillar3Desc:
    "Deploying believers into politics, healthcare, education, law, industry, and the arts as salt and light to reform systems with the mind of Christ.",
  heritageStoryHeadline: "The Heritage & Journey of Wisdom Temple",
  heritageStoryText1:
    "Wisdom Temple was established in Accra, Ghana, with an uncompromising mandate to raise leaders, shape visions, and influence society through the transforming gospel of Jesus Christ.",
  heritageStoryText2:
    "Wisdom Temple champions a powerful charismatic wave focused on human dignity, self-reliance, leadership development, and societal influence. Wisdom Temple carries this mantle with fervor in Star Junction, Tabora - Accra.",
  churchCouncilHeadline: "Church Governance & Leadership Councils",
  churchCouncilDesc:
    "Institutional policies, capital developments, annual budgets, and fiduciary kingdom stewardship overseen with integrity and excellence.",

  // --- Services & Schedules ---
  sundayServiceName: "Sunday Celebration Service",
  sundayServiceTime: "8:00 AM",
  sundayServiceDay: "Every Sunday",
  sundayServiceDesc:
    "A vibrant encounter with uplifting praise, charismatic worship, and foundational biblical teaching.",
  midweekServiceName: "The Secret Place Prayer Service",
  midweekServiceSubtitle: "A Time of Prayer, Worship and Encounter",
  midweekServiceTime: "7:00 PM",
  midweekServiceDay: "Every Wednesday",
  midweekServiceDesc:
    "Our midweek prayer service of fervent prayer, prophetic ministry, and personal spiritual renewal.",

  // --- Giving & Finances ---
  givingHeadline: "Honour the Lord with Your Substance",
  givingScriptureText:
    "“Honor the LORD with your wealth and with the best part of everything you produce. Then he will fill your barns with grain, and your vats will overflow with good wine.” — Proverbs 3:9-10",
  givingInstructions:
    "You can send your FIRSTFRUIT, OFFERING & PLEDGES to our MoMo or Bank Account.",
  givingMomoMtn: "0555577099",
  givingMomoTelecel: "0555577099 (Via Other Networks)",
  givingMomoAt: "0555577099 (Via Other Networks)",
  givingMomoAccountName: "Wisdom Temple (Kokomlemle)",
  givingBankName: "Consolidated Bank Ghana Ltd. (CBG)",
  givingBankAccountNumber: "0523529100002",
  givingBankAccountName: "Wisdom Temple (Kokomlemle)",
  givingBankBranch:
    "Consolidated Bank Ghana Ltd. (CBG) • Acc: 0523529100002 • Wisdom Temple (Kokomlemle)",

  // --- Footer & Bulletin ---
  bulletinEyebrow: "Weekly Bulletin & Devotionals",
  bulletinTitle: "Stay connected with our church family.",
  bulletinDescription:
    "Receive weekly sermon highlights, prayer focuses, and church announcements straight to your inbox.",
  footerConnectDescription:
    "Stay inspired and connected through our official media broadcasts, weekly live streams, and ministry updates.",
  footerCopyrightNotice: "© 2026 ICGC. All rights reserved.",
};

const STORAGE_KEY = "icgc_site_content_v1";
const EVENT_NAME = "icgc_content_updated";

// Load stored content or fallback
export function loadSiteContent(): SiteContentConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    const storedContent = { ...DEFAULT_SITE_CONTENT, ...parsed };

    if (
      storedContent.heroHeadline ===
      "Raising Leaders, Shaping Visions, Influencing Society Through Christ."
    ) {
      storedContent.heroEyebrow = DEFAULT_SITE_CONTENT.heroEyebrow;
      storedContent.heroHeadline = DEFAULT_SITE_CONTENT.heroHeadline;
      storedContent.heroSubtitle = DEFAULT_SITE_CONTENT.heroSubtitle;
    }

    return storedContent;
  } catch (err) {
    console.error("Failed to load site content from localStorage:", err);
    return DEFAULT_SITE_CONTENT;
  }
}

// Save all content
export function saveSiteContent(
  content: Partial<SiteContentConfig>,
): SiteContentConfig {
  try {
    const current = loadSiteContent();
    const updated = { ...current, ...content };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    void fetch('/api/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    return updated;
  } catch (err) {
    console.error("Failed to save site content to localStorage:", err);
    return DEFAULT_SITE_CONTENT;
  }
}

// Update single field
export function updateSiteField<K extends keyof SiteContentConfig>(
  field: K,
  value: SiteContentConfig[K],
): SiteContentConfig {
  const current = loadSiteContent();
  const updated = { ...current, [field]: value };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    void fetch('/api/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
  } catch (err) {
    console.error(`Failed to update field ${String(field)}:`, err);
  }
  return updated;
}

// Reset single field
export function resetSiteField<K extends keyof SiteContentConfig>(
  field: K,
): SiteContentConfig {
  const current = loadSiteContent();
  const updated = { ...current, [field]: DEFAULT_SITE_CONTENT[field] };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    void fetch('/api/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: DEFAULT_SITE_CONTENT[field] }),
    });
  } catch (err) {
    console.error(`Failed to reset field ${String(field)}:`, err);
  }
  return updated;
}

// Reset entire content to default
export function resetAllSiteContent(): SiteContentConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: DEFAULT_SITE_CONTENT }),
    );
    void fetch('/api/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_SITE_CONTENT),
    });
  } catch (err) {
    console.error("Failed to reset all content:", err);
  }
  return DEFAULT_SITE_CONTENT;
}

// Export as JSON
export function exportContentJson(): void {
  const content = loadSiteContent();
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `icgc-wisdom-temple-content-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import JSON
export function importContentJson(jsonString: string): boolean {
  try {
    if (jsonString.length > 250_000) return false;
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== "object" || parsed === null) return false;

    for (const [key, value] of Object.entries(parsed)) {
      if (!(key in DEFAULT_SITE_CONTENT)) return false;
      const expectedValue =
        DEFAULT_SITE_CONTENT[key as keyof SiteContentConfig];
      if (Array.isArray(expectedValue)) {
        if (
          !Array.isArray(value) ||
          value.some((item) => typeof item !== "string")
        )
          return false;
      } else if (typeof value !== typeof expectedValue) {
        return false;
      }
    }

    const merged = { ...DEFAULT_SITE_CONTENT, ...parsed };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
    void fetch('/api/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });
    return true;
  } catch (err) {
    console.error("Failed to import JSON content:", err);
    return false;
  }
}

// React Hook for subscribing to site content
export function useSiteContent() {
  const [content, setContent] = useState<SiteContentConfig>(loadSiteContent);

  useEffect(() => {
    // Initial sync
    setContent(loadSiteContent());
    fetch('/api/site-content')
      .then((response) => response.ok ? response.json() : {})
      .then((remoteContent) => {
        if (remoteContent && Object.keys(remoteContent).length) {
          setContent({ ...DEFAULT_SITE_CONTENT, ...remoteContent });
        }
      })
      .catch(() => undefined);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContentConfig>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      } else {
        setContent(loadSiteContent());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateField = useCallback(
    <K extends keyof SiteContentConfig>(
      field: K,
      value: SiteContentConfig[K],
    ) => {
      updateSiteField(field, value);
    },
    [],
  );

  const resetField = useCallback(
    <K extends keyof SiteContentConfig>(field: K) => {
      resetSiteField(field);
    },
    [],
  );

  const saveAll = useCallback((newContent: Partial<SiteContentConfig>) => {
    saveSiteContent(newContent);
  }, []);

  const resetAll = useCallback(() => {
    resetAllSiteContent();
  }, []);

  return {
    content,
    updateField,
    resetField,
    saveAll,
    resetAll,
    exportContentJson,
    importContentJson,
  };
}
