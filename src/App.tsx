/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PageId,
  Sermon,
  ChurchEvent,
  PrayerRequest,
  VisitPlan,
  ContactMessage,
  EventRegistration,
  GivingRecord,
  ChurchPhoto,
} from "./types";
import {
  INITIAL_SERMONS,
  INITIAL_EVENTS,
  INITIAL_MINISTRIES,
  INITIAL_TESTIMONIES,
  INITIAL_CHURCH_PHOTOS,
  CHURCH_INFO,
} from "./data/churchData";

// Shared Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AudioPlayerBar } from "./components/AudioPlayerBar";
import { VideoModal } from "./components/VideoModal";
import { WhatsAppWidget } from "./components/WhatsAppWidget";
import { ShareModal } from "./components/ShareModal";
import { EventRegistrationModal } from "./components/EventRegistrationModal";

// Views are loaded only when their page is opened.
const HomeView = lazy(() =>
  import("./views/HomeView").then(({ HomeView }) => ({ default: HomeView })),
);
const AboutView = lazy(() =>
  import("./views/AboutView").then(({ AboutView }) => ({ default: AboutView })),
);
const WatchListenView = lazy(() =>
  import("./views/WatchListenView").then(({ WatchListenView }) => ({
    default: WatchListenView,
  })),
);
const GrowView = lazy(() =>
  import("./views/GrowView").then(({ GrowView }) => ({ default: GrowView })),
);
const MinistriesView = lazy(() =>
  import("./views/MinistriesView").then(({ MinistriesView }) => ({
    default: MinistriesView,
  })),
);
const EventsView = lazy(() =>
  import("./views/EventsView").then(({ EventsView }) => ({
    default: EventsView,
  })),
);
const GalleryView = lazy(() =>
  import("./views/GalleryView").then(({ GalleryView }) => ({
    default: GalleryView,
  })),
);
const NewHereView = lazy(() =>
  import("./views/NewHereView").then(({ NewHereView }) => ({
    default: NewHereView,
  })),
);
const PrayerRequestView = lazy(() =>
  import("./views/PrayerRequestView").then(({ PrayerRequestView }) => ({
    default: PrayerRequestView,
  })),
);
const GiveView = lazy(() =>
  import("./views/GiveView").then(({ GiveView }) => ({ default: GiveView })),
);
const ContactView = lazy(() =>
  import("./views/ContactView").then(({ ContactView }) => ({
    default: ContactView,
  })),
);
const AdminView = lazy(() =>
  import("./views/AdminView").then(({ AdminView }) => ({ default: AdminView })),
);

// Local storage helper
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
  }
  return defaultValue;
};

const saveToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

const submitServerRecord = (collection: string, record: unknown) => {
  return fetch(`/api/records/${collection}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
};

// Helper to detect initial page from URL
const getInitialPage = (): PageId => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (
      path.includes("admin") ||
      hash.includes("admin") ||
      search.includes("admin") ||
      search.includes("page=admin")
    ) {
      return "admin";
    }
  }
  return "home";
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [currentSubTab, setCurrentSubTab] = useState<string | undefined>(
    undefined,
  );

  // Sync browser URL with popstate/hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.includes("admin") ||
        hash.includes("admin") ||
        search.includes("admin") ||
        search.includes("page=admin")
      ) {
        setCurrentPage("admin");
      } else {
        setCurrentPage((prev) => (prev === "admin" ? "home" : prev));
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Leadership Admin shortcut (Ctrl+Shift+A or Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) ||
        (e.altKey && (e.key === "A" || e.key === "a"))
      ) {
        e.preventDefault();
        handleNavigate("admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Media Player State
  const [activeAudioSermon, setActiveAudioSermon] = useState<Sermon | null>(
    null,
  );
  const [activeVideoSermon, setActiveVideoSermon] = useState<Sermon | null>(
    null,
  );

  // Modals
  const [registeringEvent, setRegisteringEvent] = useState<ChurchEvent | null>(
    null,
  );
  const [shareData, setShareData] = useState<{
    isOpen: boolean;
    title: string;
    desc: string;
  }>({
    isOpen: false,
    title: "",
    desc: "",
  });

  // State Collections for Interactive Church Features
  const [sermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [ministries] = useState(INITIAL_MINISTRIES);
  const [testimonies] = useState(INITIAL_TESTIMONIES);
  const [photos] = useState<ChurchPhoto[]>(INITIAL_CHURCH_PHOTOS);

  // Initial Giving Records
  const initialGiving: GivingRecord[] = [
    {
      id: "give-1",
      donorName: "Elder Kofi Boateng",
      fund: "FirstFruit",
      amount: 500,
      currency: "GHS",
      paymentMethod: "Mobile Money (MTN MoMo)",
      referenceCode: "WT-FIR-4821",
      phoneOrTxnId: "024 456 7890",
      notes: "Firstfruit seed for divine preservation over family business.",
      dateSubmitted: "Sep 21, 2026",
      status: "confirmed",
    },
    {
      id: "give-2",
      donorName: "Anonymous Kingdom Giver",
      fund: "Wisdom-Summit",
      amount: 1000,
      currency: "GHS",
      paymentMethod: "Mobile Money (MTN MoMo)",
      referenceCode: "WT-WIS-7734",
      phoneOrTxnId: "055 557 7099",
      notes: "Wisdom Summit 2026 media and live broadcast partner seed.",
      dateSubmitted: "Sep 20, 2026",
      status: "confirmed",
    },
    {
      id: "give-3",
      donorName: "Sister Grace Mensah",
      fund: "Offering",
      amount: 200,
      currency: "GHS",
      paymentMethod: "Bank Transfer (CBG)",
      referenceCode: "WT-OFF-2190",
      phoneOrTxnId: "CBG-TX-99823",
      notes: "Midweek thanksgiving offering.",
      dateSubmitted: "Sep 19, 2026",
      status: "pending-verification",
    },
  ];

  // Initial Event Registrations
  const initialEventRegistrations: EventRegistration[] = [
    {
      id: "reg-1",
      eventId: "wisdom-summit-2026",
      eventName: "Wisdom Summit 2026",
      fullName: "David K. Ofori",
      email: "d.ofori@example.com",
      phone: "+233 24 990 1122",
      attendeesCount: 2,
      registrationCode: "WT-2026-8841",
      dateRegistered: "Sep 21, 2026",
    },
    {
      id: "reg-2",
      eventId: "night-of-encounters",
      eventName: "All-Night of Encounters",
      fullName: "Priscilla Darko",
      email: "pdarko@example.com",
      phone: "+233 50 334 5566",
      attendeesCount: 1,
      registrationCode: "WT-2026-5519",
      dateRegistered: "Sep 20, 2026",
    },
  ];

  // Persistent User Submissions
  const [givingRecords, setGivingRecords] = useState<GivingRecord[]>(() =>
    loadFromStorage("wt_giving_records", initialGiving),
  );

  const [eventRegistrations, setEventRegistrations] = useState<
    EventRegistration[]
  >(() => loadFromStorage("wt_event_registrations", initialEventRegistrations));

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() =>
    loadFromStorage("wt_prayer_requests", [
      {
        id: "pr-1",
        fullName: "Sister Abigail",
        category: "Healing & Health",
        email: "abigail@example.com",
        phone: "+233 24 123 4567",
        requestText:
          "Praying for complete restoration of health and divine strength for my mother following surgery.",
        isConfidential: true,
        wantsFollowup: true,
        dateSubmitted: "Sep 18, 2026",
        status: "new",
      },
      {
        id: "pr-2",
        fullName: "Brother Kojo",
        category: "Financial Breakthrough & Employment",
        email: "kojo@example.com",
        phone: "+233 20 987 6543",
        requestText:
          "Seeking divine favor and wisdom in an upcoming interview with a multinational engineering firm.",
        isConfidential: false,
        wantsFollowup: true,
        dateSubmitted: "Sep 17, 2026",
        status: "prayed",
      },
    ]),
  );

  const [visitPlans, setVisitPlans] = useState<VisitPlan[]>(() =>
    loadFromStorage("wt_visit_plans", [
      {
        id: "vp-1",
        fullName: "Kwame & Efua Asante",
        email: "kwame@example.com",
        phone: "+233 24 555 1234",
        serviceDate: "This Sunday",
        serviceTime: "8:00 AM",
        adultsCount: 2,
        childrenCount: 2,
        needAssistance: false,
        specialNeeds:
          "First time visiting, eager to check children into Kingdom Kids.",
        dateSubmitted: "Sep 19, 2026",
        status: "planned",
      },
    ]),
  );

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() =>
    loadFromStorage("wt_contact_messages", [
      {
        id: "msg-1",
        fullName: "Nana Yeboah",
        email: "nana@example.com",
        phone: "+233 20 111 2233",
        subject: "Wisdom Summit Inquiries",
        message:
          "Will there be syndicate sessions for tertiary students at the upcoming Wisdom Summit?",
        dateSubmitted: "Sep 18, 2026",
        status: "unread",
      },
    ]),
  );

  // Sync to storage on state change
  useEffect(() => {
    saveToStorage("wt_giving_records", givingRecords);
  }, [givingRecords]);

  useEffect(() => {
    saveToStorage("wt_event_registrations", eventRegistrations);
  }, [eventRegistrations]);

  useEffect(() => {
    saveToStorage("wt_prayer_requests", prayerRequests);
  }, [prayerRequests]);

  useEffect(() => {
    saveToStorage("wt_visit_plans", visitPlans);
  }, [visitPlans]);

  useEffect(() => {
    saveToStorage("wt_contact_messages", contactMessages);
  }, [contactMessages]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Scroll to top on page change and synchronize URL route
  const handleNavigate = (page: PageId, subTab?: string) => {
    setCurrentPage(page);
    setCurrentSubTab(subTab);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof window !== "undefined") {
      if (page === "admin") {
        if (
          !window.location.hash.includes("admin") &&
          !window.location.search.includes("admin")
        ) {
          try {
            window.history.pushState(null, "", "/#admin");
          } catch {
            window.location.hash = "admin";
          }
        }
      } else {
        if (
          window.location.hash.includes("admin") ||
          window.location.search.includes("admin") ||
          window.location.pathname.includes("admin")
        ) {
          try {
            window.history.pushState(null, "", "/");
          } catch {
            window.location.hash = "";
          }
        }
      }
    }
  };

  // Audio & Video Handlers
  const handlePlayAudio = (sermon: Sermon) => {
    setActiveAudioSermon(sermon);
    showToast(`Now Playing: ${sermon.title}`);
  };

  const handleWatchVideo = (sermon: Sermon) => {
    setActiveVideoSermon(sermon);
  };

  const handleOpenShare = (title: string, desc: string) => {
    setShareData({
      isOpen: true,
      title,
      desc,
    });
  };

  // Submissions Handlers
  const handleRegisterEventSubmit = (reg: EventRegistration) => {
    setEventRegistrations((prev) => [reg, ...prev]);
    void submitServerRecord("eventRegistrations", reg);
    showToast(
      `Pass issued for ${reg.fullName}! Pass code: ${reg.registrationCode}`,
    );
  };

  const handleGivingSubmit = (
    record: Omit<GivingRecord, "id" | "dateSubmitted" | "status">,
  ) => {
    const newRecord: GivingRecord = {
      ...record,
      id: `give-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "pending-verification",
    };
    setGivingRecords((prev) => [newRecord, ...prev]);
    void submitServerRecord("givingRecords", newRecord);
    showToast(`Giving logged with reference ${newRecord.referenceCode}`);
  };

  const handlePrayerSubmit = (
    req: Omit<PrayerRequest, "id" | "dateSubmitted" | "status">,
  ) => {
    const newReq: PrayerRequest = {
      ...req,
      id: `pr-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "new",
    };
    setPrayerRequests((prev) => [newReq, ...prev]);
    void submitServerRecord("prayerRequests", newReq);
    showToast("Your prayer request has been placed on the altar.");
  };

  const handleVisitPlanSubmit = (
    plan: Omit<VisitPlan, "id" | "dateSubmitted" | "status">,
  ) => {
    const newPlan: VisitPlan = {
      ...plan,
      id: `vp-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "planned",
    };
    setVisitPlans((prev) => [newPlan, ...prev]);
    void submitServerRecord("visitPlans", newPlan);
    showToast(
      "Your Sunday visit has been scheduled! Our host team will meet you.",
    );
  };

  const handleContactSubmit = (
    msg: Omit<ContactMessage, "id" | "dateSubmitted" | "status">,
  ) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "unread",
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    void submitServerRecord("contactMessages", newMsg);
    showToast("Your message was sent to the church office.");
  };

  const handleJoinMinistry = (ministryName: string, name: string) => {
    showToast(`Interest in ${ministryName} registered for ${name}!`);
  };

  const unreadCount =
    prayerRequests.filter((p) => p.status === "new").length +
    visitPlans.filter((v) => v.status === "planned").length +
    givingRecords.filter((g) => g.status === "pending-verification").length +
    contactMessages.filter((m) => m.status === "unread").length;

  // =========================================================================
  // STANDALONE DEDICATED ADMIN PAGE (Completely isolated from public church site)
  // =========================================================================
  if (currentPage === "admin") {
    return (
      <div className="min-h-screen bg-[#f8faf8] font-sans antialiased text-slate-900 selection:bg-[#c99726] selection:text-[#021a10]">
        <Suspense fallback={<div className="min-h-screen" />}>
          <AdminView
            initialTab={currentSubTab}
            prayerRequests={prayerRequests}
            visitPlans={visitPlans}
            contactMessages={contactMessages}
            givingRecords={givingRecords}
            eventRegistrations={eventRegistrations}
            events={events}
            onUpdatePrayerStatus={(id, status) => {
              setPrayerRequests((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status } : p)),
              );
              showToast("Prayer status updated");
            }}
            onUpdateVisitStatus={(id, status) => {
              setVisitPlans((prev) =>
                prev.map((v) => (v.id === id ? { ...v, status } : v)),
              );
              showToast("Visitor status updated");
            }}
            onUpdateMessageStatus={(id, status) => {
              setContactMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, status } : m)),
              );
              showToast("Message status updated");
            }}
            onUpdateGivingStatus={(id, status) => {
              setGivingRecords((prev) =>
                prev.map((g) => (g.id === id ? { ...g, status } : g)),
              );
              showToast("Giving status updated");
            }}
            onNavigate={handleNavigate}
          />
        </Suspense>

        {/* Standalone Admin Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#032416] text-white border border-[#c99726]/60 px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="w-2 h-2 rounded-full bg-[#f5cf72] animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8] font-sans text-[#0f241a] flex flex-col selection:bg-[#c99726] selection:text-[#021a10]">
      {/* Persistent Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        unreadAdminCount={unreadCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {currentPage === "home" && (
                <HomeView
                  onNavigate={handleNavigate}
                  sermons={sermons}
                  events={events}
                  testimonies={testimonies}
                  onPlayAudio={handlePlayAudio}
                  onWatchVideo={handleWatchVideo}
                  onRegisterEvent={(event) => setRegisteringEvent(event)}
                  onShare={handleOpenShare}
                />
              )}

              {currentPage === "about" && (
                <AboutView
                  onNavigate={handleNavigate}
                  initialSubTab={currentSubTab}
                />
              )}

              {currentPage === "watch-listen" && (
                <WatchListenView
                  sermons={sermons}
                  initialCategory={currentSubTab}
                  onPlayAudio={handlePlayAudio}
                  onWatchVideo={handleWatchVideo}
                  onShare={handleOpenShare}
                />
              )}

              {currentPage === "grow" && (
                <GrowView onNavigate={handleNavigate} />
              )}

              {currentPage === "ministries" && (
                <MinistriesView
                  ministries={ministries}
                  onJoinMinistry={handleJoinMinistry}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === "events" && (
                <EventsView
                  events={events}
                  initialSubTab={currentSubTab}
                  onRegisterEvent={(event) => setRegisteringEvent(event)}
                  onShare={handleOpenShare}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === "gallery" && (
                <GalleryView photos={photos} onNavigate={handleNavigate} />
              )}

              {currentPage === "new-here" && (
                <NewHereView
                  onNavigate={handleNavigate}
                  onSubmitVisitPlan={handleVisitPlanSubmit}
                />
              )}

              {(currentPage === "prayer" ||
                currentPage === "prayer-request") && (
                <PrayerRequestView
                  onNavigate={handleNavigate}
                  onSubmitPrayerRequest={handlePrayerSubmit}
                />
              )}

              {currentPage === "give" && (
                <GiveView
                  onNavigate={handleNavigate}
                  onSubmitGiving={handleGivingSubmit}
                />
              )}

              {currentPage === "contact" && (
                <ContactView
                  onNavigate={handleNavigate}
                  onSubmitContactMessage={handleContactSubmit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Global Modals & Sticky Overlays */}
      {/* 1. Video Player Modal */}
      {activeVideoSermon && (
        <VideoModal
          sermon={activeVideoSermon}
          onClose={() => setActiveVideoSermon(null)}
          onShare={() =>
            handleOpenShare(
              activeVideoSermon.title,
              `Watch this message from Wisdom Temple: ${activeVideoSermon.scripture}`,
            )
          }
        />
      )}

      {/* 2. Event Registration Modal */}
      {registeringEvent && (
        <EventRegistrationModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
          onRegister={handleRegisterEventSubmit}
        />
      )}

      {/* 3. Share Modal */}
      <ShareModal
        isOpen={shareData.isOpen}
        title={shareData.title}
        description={shareData.desc}
        onClose={() => setShareData((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 4. Floating WhatsApp Concierge */}
      <WhatsAppWidget />

      {/* 5. Sticky Audio Player Bar */}
      {activeAudioSermon && (
        <AudioPlayerBar
          sermon={activeAudioSermon}
          onClose={() => setActiveAudioSermon(null)}
        />
      )}

      {/* 6. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#032416] text-white border border-[#c99726]/60 px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#f5cf72] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Comprehensive Church Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
