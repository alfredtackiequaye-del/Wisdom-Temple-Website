import React, { useState, useEffect } from 'react';
import { BannerConfig, BannerCategory } from '../types';
import { PASTORAL_COUPLE_IMAGE } from '../assets/pastoralImage';

export const DEFAULT_BANNERS: BannerConfig[] = [
  // --- Hero & Main Homepage ---
  {
    id: 'hero_banner',
    name: 'Homepage Hero Banner',
    category: 'hero',
    categoryLabel: 'Homepage & Hero',
    location: 'Home Page (Main Top Banner)',
    currentUrl: '/hero_icgc_banner.jpg',
    defaultUrl: '/hero_icgc_banner.jpg',
    recommendedSize: '1920 × 1080 px',
    aspectRatio: '16:9 Landscape',
    width: 1920,
    height: 1080,
    description: 'The primary cinematic background banner displayed at the very top of the Home page.',
    designNotes: 'Keep critical text and faces centered in the middle 60%. Dark overlays are applied automatically at the top and bottom.'
  },
  {
    id: 'pastoral_couple',
    name: 'Shepherd & First Lady Portrait',
    category: 'pastoral',
    categoryLabel: 'Pastoral & Leadership',
    location: "Pastor's Corner, About View & Leadership Cards",
    currentUrl: PASTORAL_COUPLE_IMAGE,
    defaultUrl: PASTORAL_COUPLE_IMAGE,
    recommendedSize: '1200 × 1200 px',
    aspectRatio: '1:1 Square (or 4:5 Portrait 1080×1350)',
    width: 1200,
    height: 1200,
    description: 'Official portrait photo of Rev. Gabriel Dela & Lady Dr. Helena Dela.',
    designNotes: 'High quality professional studio portrait. Clear lighting with neutral or church sanctuary background.'
  },

  // --- Featured Events & Conferences ---
  {
    id: 'wisdom_summit_banner',
    name: 'Wisdom Summit 2026 Banner',
    category: 'events',
    categoryLabel: 'Events & Conferences',
    location: 'Home Page Summit Showcase & Events Directory',
    currentUrl: '/wisdom_summit_banner.png',
    defaultUrl: '/wisdom_summit_banner.png',
    recommendedSize: '1200 × 675 px',
    aspectRatio: '16:9 Landscape',
    width: 1200,
    height: 675,
    description: 'Premier annual Wisdom Summit conference flyer with guest ministers and theme.',
    designNotes: 'Include theme: "Dominion Through Divine Insight", dates Oct 7-11, 2026, and speaker portraits.'
  },
  {
    id: 'secret_place_banner',
    name: 'The Secret Place Prayer Service Banner',
    category: 'events',
    categoryLabel: 'Events & Conferences',
    location: 'Home Experience Card, Midweek Service & Events',
    currentUrl: '/secret_place_banner.jpg',
    defaultUrl: '/secret_place_banner.jpg',
    recommendedSize: '1200 × 675 px',
    aspectRatio: '16:9 Landscape',
    width: 1200,
    height: 675,
    description: 'Official promotional graphic for Wednesday 7:00 PM The Secret Place prayer service.',
    designNotes: 'Atmosphere of fervent prayer and worship. Golden and deep emerald tones recommended.'
  },
  {
    id: 'event_secret_place_night',
    name: 'Night of Encounters All-Night Banner',
    category: 'events',
    categoryLabel: 'Events & Conferences',
    location: 'Events Page (All-Night Vigil Card)',
    currentUrl: '/secret_place_banner.jpg',
    defaultUrl: '/secret_place_banner.jpg',
    recommendedSize: '1200 × 675 px',
    aspectRatio: '16:9 Landscape',
    width: 1200,
    height: 675,
    description: 'Flyer banner for the monthly/quarterly All-Night prophetic vigil.',
    designNotes: 'High contrast with event time: 10:00 PM - 4:30 AM.'
  },
  {
    id: 'event_youth_summit',
    name: 'Ignite Youth & Young Adults Summit Banner',
    category: 'events',
    categoryLabel: 'Events & Conferences',
    location: 'Events Page (Youth Summit Card)',
    currentUrl: '/youth_ministry.jpg',
    defaultUrl: '/youth_ministry.jpg',
    recommendedSize: '1200 × 675 px',
    aspectRatio: '16:9 Landscape',
    width: 1200,
    height: 675,
    description: 'Promotional graphic for Ignite Youth & Young Adults Summit.',
    designNotes: 'Vibrant, engaging visuals appealing to youth and young professionals.'
  },
  {
    id: 'event_couples_seminar',
    name: 'Covenant Love Marriage Colloquium Banner',
    category: 'events',
    categoryLabel: 'Events & Conferences',
    location: 'Events Page (Marriage & Family Card)',
    currentUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    recommendedSize: '1200 × 675 px',
    aspectRatio: '16:9 Landscape',
    width: 1200,
    height: 675,
    description: 'Banner for Covenant Love couples colloquium and marriage banquets.',
    designNotes: 'Warm, elegant couple or family imagery.'
  },

  // --- Ministries Cards ---
  {
    id: 'ministry_children',
    name: 'Children’s Ministry (Kingdom Kids)',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory & Home Featured Ministries',
    currentUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard (or 16:10 800×500)',
    width: 800,
    height: 600,
    description: 'Card banner for Kingdom Kids Sunday children church.',
    designNotes: 'Happy children in church or Sunday school activity.'
  },
  {
    id: 'ministry_youth',
    name: 'Youth Ministry (Gen-Impact / New Breed Youth)',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory & Home Featured Ministries',
    currentUrl: '/youth_ministry.jpg',
    defaultUrl: '/youth_ministry.jpg',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for Gen-Impact & New Breed teen youth ministry.',
    designNotes: 'High energy, vibrant youth fellowship in worship or community.'
  },
  {
    id: 'ministry_young_adults',
    name: 'Young Adults & Professionals (New Breed)',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory & Home Featured Ministries',
    currentUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for tertiary students, fresh graduates, and young corporate professionals (New Breed).',
    designNotes: 'Modern young adults collaborating or worshiping.'
  },
  {
    id: 'new_breed_banner',
    name: 'New Breed (Youth & Young Adults) Banner',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'New Breed Youth & Young Adults Fellowship / Events',
    currentUrl: '/youth_ministry.jpg',
    defaultUrl: '/youth_ministry.jpg',
    recommendedSize: '1200 × 675 px',
    aspectRatio: '16:9 Landscape (or 4:3)',
    width: 1200,
    height: 675,
    description: 'Official New Breed banner graphic for youth meetings, camps, and young adult summits.',
    designNotes: 'High-energy, modern ICGC New Breed branding with vibrant youth atmosphere.'
  },
  {
    id: 'ministry_women',
    name: 'Women’s Ministry (Precious Vessels)',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory & Home Featured Ministries',
    currentUrl: '/womens_fellowship.jpg',
    defaultUrl: '/womens_fellowship.jpg',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for Precious Vessels women fellowship.',
    designNotes: 'Graceful Christian women fellowship, prayer, or leadership.'
  },
  {
    id: 'ministry_men',
    name: 'Men’s Ministry (Mighty Men of Valour)',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory & Home Featured Ministries',
    currentUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for Mighty Men of Valour fellowship.',
    designNotes: 'Men standing in prayer, brotherhood, or church leadership.'
  },
  {
    id: 'ministry_couples',
    name: 'Couples & Marriage Ministry',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory',
    currentUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for marriage enrichment, retreats, and pre-marital counseling.',
    designNotes: 'Warm, Christ-centered marriage/couple imagery.'
  },
  {
    id: 'ministry_evangelism',
    name: 'Evangelism & Community Outreach',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory',
    currentUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for street missions, hospital visits, and community relief.',
    designNotes: 'Hands of compassionate outreach and evangelism.'
  },
  {
    id: 'ministry_multimedia',
    name: 'Multimedia & Sound Tech',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory',
    currentUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for live broadcast, sound engineering, camera, and lighting crew.',
    designNotes: 'Church sound console, video cameras, or broadcast sanctuary gear.'
  },
  {
    id: 'ministry_discipleship',
    name: 'Discipleship & Foundation School',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory',
    currentUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for new believers foundation classes and biblical doctrines.',
    designNotes: 'Open Bible, study notebook, and spiritual growth setting.'
  },
  {
    id: 'ministry_prayer',
    name: 'Intercessory Prayer Department',
    category: 'ministries',
    categoryLabel: 'Ministries Cards',
    location: 'Ministries Directory',
    currentUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '800 × 600 px',
    aspectRatio: '4:3 Standard',
    width: 800,
    height: 600,
    description: 'Card banner for church intercessors and 24/7 prayer wall.',
    designNotes: 'Deep prayer, outstretched hands in worship, and altar intercession.'
  },

  // --- Giving & Stewardship ---
  {
    id: 'giving_flyer',
    name: 'Official Giving & Payment Accounts Flyer',
    category: 'giving',
    categoryLabel: 'Giving & Stewardship',
    location: 'Give Page (Payment Accounts & MoMo Modal/Card)',
    currentUrl: '/giving_details_official.jpg',
    defaultUrl: '/giving_details_official.jpg',
    recommendedSize: '1080 × 1350 px',
    aspectRatio: '4:5 Portrait Flyer (or 1080×1080)',
    width: 1080,
    height: 1350,
    description: 'Official infographic flyer detailing church MTN MoMo (0555577099) and CBG bank account.',
    designNotes: 'High-res flyer with crisp text for mobile viewers to easily read account numbers.'
  },

  // --- Page Header Banners ---
  {
    id: 'page_about_hero',
    name: 'About Us Page Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'About View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for the About Us / Church History page.',
    designNotes: 'Sanctuary or worship background with subtle contrast for white titles.'
  },
  {
    id: 'page_ministries_hero',
    name: 'Ministries Directory Page Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Ministries View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for the Ministries Directory page.',
    designNotes: 'Church community, serving hands, or congregation.'
  },
  {
    id: 'page_events_hero',
    name: 'Events & Calendar Page Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Events View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for the Events & Calendar page.',
    designNotes: 'Auditorium conference lighting or worship assembly.'
  },
  {
    id: 'page_watch_hero',
    name: 'Watch & Listen Sermons Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Watch & Listen View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for Sermon Broadcasts and Media library.',
    designNotes: 'Pulpit Bible, acoustic sanctuary, or charismatic minister preaching.'
  },
  {
    id: 'page_grow_hero',
    name: 'Discipleship & Spiritual Growth Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Grow View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for Discipleship classes, Foundation School, and Bible Reading Plans.',
    designNotes: 'Spiritual illumination, open Bible, and path of discipleship.'
  },
  {
    id: 'page_newhere_hero',
    name: 'Plan Your Visit (First Time Guests) Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'New Here View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for First Time Visitors & Welcome Reception.',
    designNotes: 'Warm, smiling church ushers, welcome team, and sanctuary.'
  },
  {
    id: 'page_give_hero',
    name: 'Giving & Tithe Page Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Give View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for Biblical Stewardship and Online Giving page.',
    designNotes: 'Giving hands, seeds of blessing, and joyful generosity.'
  },
  {
    id: 'page_gallery_hero',
    name: 'Church Photo Gallery Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Gallery View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for Church Life & Photography gallery.',
    designNotes: 'Vibrant montage of church life and celebration.'
  },
  {
    id: 'page_prayer_hero',
    name: 'Prayer Request Page Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Prayer Request View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for 24/7 Pastoral Intercession and confidential prayer submission.',
    designNotes: 'Hands in prayer, spiritual reflection, and divine peace.'
  },
  {
    id: 'page_contact_hero',
    name: 'Contact & Directions Header Banner',
    category: 'pages',
    categoryLabel: 'Page Header Banners',
    location: 'Contact View (Top Header)',
    currentUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1920&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1920&q=80',
    recommendedSize: '1920 × 600 px',
    aspectRatio: '3.2:1 Panoramic',
    width: 1920,
    height: 600,
    description: 'Panoramic header image for Star Junction Tabora location, maps, and secretariat contacts.',
    designNotes: 'Church architectural facade or welcome lobby.'
  }
];

const STORAGE_KEY = 'wt_church_banners_custom_v2';
const EVENT_KEY = 'wt_banners_updated_event';
const IDB_DB_NAME = 'ICGC_Wisdom_Banners_DB_v2';
const IDB_STORE_NAME = 'banners_store';

// In-Memory Fast Cache for instant synchronous access everywhere
const IN_MEMORY_CACHE: Record<string, { currentUrl: string; updatedAt?: string }> = {};

// Open IndexedDB safely
const openBannerDB = (): Promise<IDBDatabase | null> => {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(IDB_DB_NAME, 1);
      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('Could not open IndexedDB, falling back to LocalStorage.');
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
};

// Initialize In-Memory cache from LocalStorage & IndexedDB on boot
const initializeBannerCache = () => {
  try {
    const savedJson = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('wt_church_banners_custom_v1');
    if (savedJson) {
      const parsed = JSON.parse(savedJson);
      Object.assign(IN_MEMORY_CACHE, parsed);
    }
  } catch (err) {
    console.error('Error loading LocalStorage banners:', err);
  }

  // Also query IndexedDB in background to ensure HD base64 images are restored
  openBannerDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        if (Array.isArray(req.result)) {
          let hasNew = false;
          req.result.forEach((item: { id: string; currentUrl: string; updatedAt?: string }) => {
            if (item && item.id && item.currentUrl) {
              IN_MEMORY_CACHE[item.id] = { currentUrl: item.currentUrl, updatedAt: item.updatedAt };
              hasNew = true;
            }
          });
          if (hasNew && typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { initialLoad: true } }));
          }
        }
      };
    } catch (err) {
      console.warn('Error reading from banner IndexedDB:', err);
    }
  });
};

// Auto-run initialization
initializeBannerCache();

/**
 * Compresses an uploaded image file on an HTML5 canvas to high efficiency WebP/JPEG data URL.
 * Transforms 5MB-15MB files into ~150KB - 280KB without visual degradation.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 1920,
  maxHeight = 1200,
  quality = 0.84
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image data into canvas'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl || dataUrl.startsWith('data:image/png')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Load all banners from storage merged with defaults
 */
export const loadAllBanners = (): BannerConfig[] => {
  return DEFAULT_BANNERS.map((banner) => {
    const override = IN_MEMORY_CACHE[banner.id];
    if (override && override.currentUrl) {
      return {
        ...banner,
        currentUrl: override.currentUrl,
        updatedAt: override.updatedAt,
      };
    }
    return banner;
  });
};

const ALIAS_MAP: Record<string, string[]> = {
  'new_breed_banner': ['ministry_young_adults', 'ministry_young-adults', 'ministry_youth', 'event_youth_summit', 'event_nextgen-youth-camp'],
  'ministry_young_adults': ['ministry_young-adults', 'new_breed_banner'],
  'ministry_young-adults': ['ministry_young_adults', 'new_breed_banner'],
  'ministry_youth': ['ministry_youth_new_breed', 'new_breed_banner'],
  'event_youth_summit': ['event_nextgen-youth-camp', 'event_nextgen_youth_camp'],
  'event_nextgen-youth-camp': ['event_youth_summit', 'event_nextgen_youth_camp'],
  'event_secret_place_night': ['event_secret-place-allnight', 'event_secret_place_allnight'],
  'event_secret-place-allnight': ['event_secret_place_night', 'event_secret_place_allnight'],
  'event_couples_seminar': ['event_couples-marriage-seminar', 'event_couples_marriage_seminar'],
  'event_couples-marriage-seminar': ['event_couples_seminar', 'event_couples_marriage_seminar'],
  'ministry_couples': ['ministry_couples-marriage', 'ministry_couples_marriage'],
  'ministry_couples-marriage': ['ministry_couples', 'ministry_couples_marriage'],
};

/**
 * Get active URL for a single banner ID with normalized fallback & alias support
 */
export const getBannerUrl = (bannerId: string, fallbackUrl?: string): string => {
  // 1. Direct match in cache
  if (IN_MEMORY_CACHE[bannerId]?.currentUrl) {
    return IN_MEMORY_CACHE[bannerId].currentUrl;
  }

  // 2. Normalized underscores / hyphens
  const underscoreKey = bannerId.replace(/-/g, '_');
  if (IN_MEMORY_CACHE[underscoreKey]?.currentUrl) {
    return IN_MEMORY_CACHE[underscoreKey].currentUrl;
  }

  const hyphenKey = bannerId.replace(/_/g, '-');
  if (IN_MEMORY_CACHE[hyphenKey]?.currentUrl) {
    return IN_MEMORY_CACHE[hyphenKey].currentUrl;
  }

  // 3. Alias matches in cache
  const aliases = ALIAS_MAP[bannerId] || ALIAS_MAP[underscoreKey] || ALIAS_MAP[hyphenKey] || [];
  for (const alias of aliases) {
    if (IN_MEMORY_CACHE[alias]?.currentUrl) {
      return IN_MEMORY_CACHE[alias].currentUrl;
    }
  }

  // 4. Look in default banners
  const defaultItem = DEFAULT_BANNERS.find((b) => b.id === bannerId || b.id === underscoreKey || b.id === hyphenKey);
  if (defaultItem?.currentUrl) {
    return defaultItem.currentUrl;
  }

  // 5. Check alias default
  for (const alias of aliases) {
    const aliasDefault = DEFAULT_BANNERS.find((b) => b.id === alias);
    if (aliasDefault?.currentUrl) {
      return aliasDefault.currentUrl;
    }
  }

  return fallbackUrl || defaultItem?.defaultUrl || '';
};

/**
 * Save single banner update reliably across memory, IndexedDB and LocalStorage
 */
export const saveBannerUrl = (bannerId: string, newUrl: string): BannerConfig[] => {
  const cleanUrl = newUrl.trim();
  const updatedAt = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 1. Update In-Memory cache synchronously
  IN_MEMORY_CACHE[bannerId] = {
    currentUrl: cleanUrl,
    updatedAt,
  };

  // 2. Persist to LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(IN_MEMORY_CACHE));
  } catch (err) {
    console.warn('LocalStorage full, continuing with IndexedDB persistence:', err);
  }

  // 3. Persist to IndexedDB
  openBannerDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put({ id: bannerId, currentUrl: cleanUrl, updatedAt });
    } catch (err) {
      console.error('Error writing to IndexedDB:', err);
    }
  });

  // 4. Broadcast change event for all open views & tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { bannerId, newUrl: cleanUrl } }));
  }

  void fetch(`/api/admin/site-banners/${encodeURIComponent(bannerId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: cleanUrl }),
  });

  return loadAllBanners();
};

/**
 * Reset a single banner to its default asset
 */
export const resetSingleBanner = (bannerId: string): BannerConfig[] => {
  delete IN_MEMORY_CACHE[bannerId];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(IN_MEMORY_CACHE));
  } catch (err) {
    console.error('Error updating LocalStorage after reset:', err);
  }

  openBannerDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.delete(bannerId);
    } catch (err) {
      console.error('Error deleting from IndexedDB:', err);
    }
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { bannerId, reset: true } }));
  }

  void fetch(`/api/admin/site-banners/${encodeURIComponent(bannerId)}`, { method: 'DELETE' });

  return loadAllBanners();
};

/**
 * Reset all banners to defaults
 */
export const resetAllBannersToDefault = (): BannerConfig[] => {
  Object.keys(IN_MEMORY_CACHE).forEach((k) => delete IN_MEMORY_CACHE[k]);

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('wt_church_banners_custom_v1');
  } catch (err) {
    console.error('Error clearing LocalStorage banners:', err);
  }

  openBannerDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.clear();
    } catch (err) {
      console.error('Error clearing IndexedDB:', err);
    }
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { resetAll: true } }));
  }

  return DEFAULT_BANNERS;
};

/**
 * Export banners to JSON file string
 */
export const exportBannersJson = (): string => {
  const current = loadAllBanners();
  return JSON.stringify(
    current.map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      recommendedSize: b.recommendedSize,
      aspectRatio: b.aspectRatio,
      currentUrl: b.currentUrl,
      updatedAt: b.updatedAt || 'Default',
    })),
    null,
    2
  );
};

/**
 * React hook to listen for banner changes across the entire app in real time
 */
export const useBanners = (): {
  banners: BannerConfig[];
  getBanner: (id: string, fallback?: string) => string;
  updateBanner: (id: string, url: string) => void;
  resetBanner: (id: string) => void;
  resetAll: () => void;
} => {
  const [banners, setBanners] = useState<BannerConfig[]>(loadAllBanners);

  useEffect(() => {
    const handleUpdate = () => {
      setBanners(loadAllBanners());
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    fetch('/api/site-banners')
      .then((response) => response.ok ? response.json() : {})
      .then((remoteBanners) => {
        Object.entries(remoteBanners || {}).forEach(([id, value]) => {
          const banner = value as { currentUrl?: string; updatedAt?: string };
          if (banner.currentUrl) IN_MEMORY_CACHE[id] = banner as { currentUrl: string; updatedAt?: string };
        });
        setBanners(loadAllBanners());
      })
      .catch(() => undefined);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getBanner = (id: string, fallback?: string): string => {
    const found = banners.find((b) => b.id === id);
    return found?.currentUrl || getBannerUrl(id, fallback);
  };

  const updateBanner = (id: string, url: string) => {
    const updated = saveBannerUrl(id, url);
    setBanners(updated);
  };

  const resetBanner = (id: string) => {
    const updated = resetSingleBanner(id);
    setBanners(updated);
  };

  const resetAll = () => {
    const updated = resetAllBannersToDefault();
    setBanners(updated);
  };

  return { banners, getBanner, updateBanner, resetBanner, resetAll };
};
