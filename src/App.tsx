/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PageId, 
  Sermon, 
  ChurchEvent, 
  PrayerRequest, 
  VisitPlan, 
  ContactMessage,
  EventRegistration,
  ChurchPhoto
} from './types';
import { 
  INITIAL_SERMONS, 
  INITIAL_EVENTS, 
  INITIAL_MINISTRIES, 
  INITIAL_TESTIMONIES, 
  INITIAL_CHURCH_PHOTOS,
  CHURCH_INFO 
} from './data/churchData';

// Shared Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { VideoModal } from './components/VideoModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { ShareModal } from './components/ShareModal';
import { EventRegistrationModal } from './components/EventRegistrationModal';

// Views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { WatchListenView } from './views/WatchListenView';
import { GrowView } from './views/GrowView';
import { MinistriesView } from './views/MinistriesView';
import { EventsView } from './views/EventsView';
import { GalleryView } from './views/GalleryView';
import { NewHereView } from './views/NewHereView';
import { PrayerRequestView } from './views/PrayerRequestView';
import { GiveView } from './views/GiveView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentSubTab, setCurrentSubTab] = useState<string | undefined>(undefined);

  // Media Player State
  const [activeAudioSermon, setActiveAudioSermon] = useState<Sermon | null>(null);
  const [activeVideoSermon, setActiveVideoSermon] = useState<Sermon | null>(null);

  // Modals
  const [registeringEvent, setRegisteringEvent] = useState<ChurchEvent | null>(null);
  const [shareData, setShareData] = useState<{ isOpen: boolean; title: string; desc: string }>({
    isOpen: false,
    title: '',
    desc: '',
  });

  // State Collections for Interactive Church Features
  const [sermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [ministries] = useState(INITIAL_MINISTRIES);
  const [testimonies] = useState(INITIAL_TESTIMONIES);
  const [photos] = useState<ChurchPhoto[]>(INITIAL_CHURCH_PHOTOS);

  // User Submissions
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([
    {
      id: 'pr-1',
      fullName: 'Sister Abigail',
      category: 'Healing & Health',
      email: 'abigail@example.com',
      phone: '+233 24 123 4567',
      requestText: 'Praying for complete restoration of health and divine strength for my mother following surgery.',
      isConfidential: true,
      wantsFollowup: true,
      dateSubmitted: 'Sep 18, 2026',
      status: 'new',
    },
    {
      id: 'pr-2',
      fullName: 'Brother Kojo',
      category: 'Financial Breakthrough & Employment',
      email: 'kojo@example.com',
      phone: '+233 20 987 6543',
      requestText: 'Seeking divine favor and wisdom in an upcoming interview with a multinational engineering firm.',
      isConfidential: false,
      wantsFollowup: true,
      dateSubmitted: 'Sep 17, 2026',
      status: 'prayed',
    },
  ]);

  const [visitPlans, setVisitPlans] = useState<VisitPlan[]>([
    {
      id: 'vp-1',
      fullName: 'Kwame & Efua Asante',
      email: 'kwame@example.com',
      phone: '+233 24 555 1234',
      serviceDate: 'This Sunday',
      serviceTime: '8:00 AM',
      adultsCount: 2,
      childrenCount: 2,
      needAssistance: false,
      specialNeeds: 'First time visiting, eager to check children into Kingdom Kids.',
      dateSubmitted: 'Sep 19, 2026',
      status: 'planned',
    }
  ]);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([
    {
      id: 'msg-1',
      fullName: 'Nana Yeboah',
      email: 'nana@example.com',
      phone: '+233 20 111 2233',
      subject: 'Wisdom Summit Inquiries',
      message: 'Will there be syndicate sessions for tertiary students at the upcoming Wisdom Summit?',
      dateSubmitted: 'Sep 18, 2026',
      status: 'unread',
    }
  ]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Scroll to top on page change
  const handleNavigate = (page: PageId, subTab?: string) => {
    setCurrentPage(page);
    setCurrentSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    showToast(`Registration confirmed for ${reg.fullName}! Pass code: ${reg.registrationCode}`);
  };

  const handlePrayerSubmit = (req: Omit<PrayerRequest, 'id' | 'dateSubmitted' | 'status'>) => {
    const newReq: PrayerRequest = {
      ...req,
      id: `pr-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'new',
    };
    setPrayerRequests(prev => [newReq, ...prev]);
    showToast('Your prayer request has been placed on the altar.');
  };

  const handleVisitPlanSubmit = (plan: Omit<VisitPlan, 'id' | 'dateSubmitted' | 'status'>) => {
    const newPlan: VisitPlan = {
      ...plan,
      id: `vp-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'planned',
    };
    setVisitPlans(prev => [newPlan, ...prev]);
    showToast('Your Sunday visit has been scheduled! Our host team will meet you.');
  };

  const handleContactSubmit = (msg: Omit<ContactMessage, 'id' | 'dateSubmitted' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'unread',
    };
    setContactMessages(prev => [newMsg, ...prev]);
    showToast('Your message was sent to the church office.');
  };

  const handleJoinMinistry = (ministryName: string, name: string, email: string, phone: string) => {
    showToast(`Interest in ${ministryName} registered for ${name}!`);
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] font-sans text-[#0f241a] flex flex-col selection:bg-[#c99726] selection:text-[#021a10]">
      {/* Persistent Navigation */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        unreadAdminCount={prayerRequests.filter(p => p.status === 'new').length + visitPlans.filter(v => v.status === 'planned').length}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {currentPage === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                sermons={sermons}
                events={events}
                ministries={ministries}
                testimonies={testimonies}
                photos={photos}
                onPlayAudio={handlePlayAudio}
                onWatchVideo={handleWatchVideo}
                onRegisterEvent={(e) => setRegisteringEvent(e)}
                onSubmitPrayer={handlePrayerSubmit}
                onShare={handleOpenShare}
              />
            )}

            {currentPage === 'gallery' && (
              <GalleryView
                photos={photos}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'about' && (
              <AboutView 
                initialSubTab={currentSubTab} 
                onNavigate={handleNavigate} 
              />
            )}

            {currentPage === 'watch-listen' && (
              <WatchListenView
                sermons={sermons}
                initialCategory={currentSubTab}
                onPlayAudio={handlePlayAudio}
                onWatchVideo={handleWatchVideo}
                onShare={handleOpenShare}
              />
            )}

            {currentPage === 'grow' && (
              <GrowView onNavigate={handleNavigate} />
            )}

            {currentPage === 'ministries' && (
              <MinistriesView
                ministries={ministries}
                initialMinistryId={currentSubTab}
                onNavigate={handleNavigate}
                onJoinMinistry={handleJoinMinistry}
              />
            )}

            {currentPage === 'events' && (
              <EventsView
                events={events}
                initialSubTab={currentSubTab}
                onRegisterEvent={(e) => setRegisteringEvent(e)}
                onShare={handleOpenShare}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'new-here' && (
              <NewHereView
                onNavigate={handleNavigate}
                onSubmitVisitPlan={handleVisitPlanSubmit}
              />
            )}

            {(currentPage === 'prayer' || currentPage === 'prayer-request') && (
              <PrayerRequestView
                onNavigate={handleNavigate}
                onSubmitPrayerRequest={handlePrayerSubmit}
              />
            )}

            {currentPage === 'give' && (
              <GiveView onNavigate={handleNavigate} />
            )}

            {currentPage === 'contact' && (
              <ContactView
                onNavigate={handleNavigate}
                onSubmitContactMessage={handleContactSubmit}
              />
            )}

            {currentPage === 'admin' && (
              <AdminView
                prayerRequests={prayerRequests}
                visitPlans={visitPlans}
                contactMessages={contactMessages}
                events={events}
                onUpdatePrayerStatus={(id, status) => {
                  setPrayerRequests(prev => prev.map(p => p.id === id ? { ...p, status } : p));
                  showToast('Prayer status updated');
                }}
                onUpdateVisitStatus={(id, status) => {
                  setVisitPlans(prev => prev.map(v => v.id === id ? { ...v, status } : v));
                  showToast('Visitor status updated');
                }}
                onUpdateMessageStatus={(id, status) => {
                  setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
                  showToast('Message status updated');
                }}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals & Sticky Overlays */}
      {/* 1. Video Player Modal */}
      {activeVideoSermon && (
        <VideoModal
          sermon={activeVideoSermon}
          onClose={() => setActiveVideoSermon(null)}
          onShare={() => handleOpenShare(activeVideoSermon.title, `Watch this message from Wisdom Temple: ${activeVideoSermon.scripture}`)}
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
        onClose={() => setShareData(prev => ({ ...prev, isOpen: false }))}
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

