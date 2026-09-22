import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PageId, Sermon, ChurchEvent, Ministry, PrayerRequest, Testimony, ChurchPhoto } from '../types';
import { CHURCH_INFO, INITIAL_CHURCH_PHOTOS } from '../data/churchData';
import { PASTORAL_COUPLE_IMAGE } from '../assets/pastoralImage';
import { PhotoGallery } from '../components/PhotoGallery';
import { 
  Play, 
  Headphones, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Flame, 
  Shield, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  Quote, 
  Share2, 
  Lock,
  Youtube,
  ExternalLink,
  ZoomIn,
  X,
  Phone,
  Gift,
  BookOpen,
  Compass
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: PageId, subTab?: string) => void;
  sermons: Sermon[];
  events: ChurchEvent[];
  ministries: Ministry[];
  testimonies: Testimony[];
  onPlayAudio: (sermon: Sermon) => void;
  onWatchVideo: (sermon: Sermon) => void;
  onRegisterEvent: (event: ChurchEvent) => void;
  onSubmitPrayer: (req: Omit<PrayerRequest, 'id' | 'dateSubmitted' | 'status'>) => void;
  onShare: (title: string, desc: string) => void;
  photos?: ChurchPhoto[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  sermons,
  events,
  ministries,
  testimonies,
  onPlayAudio,
  onWatchVideo,
  onRegisterEvent,
  onSubmitPrayer,
  onShare,
  photos = INITIAL_CHURCH_PHOTOS,
}) => {
  // Latest message
  const latestSermon = sermons[0];
  const featuredSummit = events.find(e => e.isFeaturedSummit) || events[0];
  const [playLatestInline, setPlayLatestInline] = useState(false);
  const [flyerModalOpen, setFlyerModalOpen] = useState(false);
  const [secretPlaceModalOpen, setSecretPlaceModalOpen] = useState(false);

  // Wisdom Summit Countdown Timer (Target: October 7, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 2,
    minutes: 7,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-07T18:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prayer form state
  const [prayerName, setPrayerName] = useState('');
  const [prayerEmail, setPrayerEmail] = useState('');
  const [prayerPhone, setPrayerPhone] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [contactMe, setContactMe] = useState(false);
  const [isPrivate] = useState(true);
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // Testimony modal state
  const [showTestimonyModal, setShowTestimonyModal] = useState(false);
  const [testimonyName, setTestimonyName] = useState('');
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyContent, setTestimonyContent] = useState('');
  const [testimonySuccess, setTestimonySuccess] = useState(false);

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerName.trim() || !prayerText.trim()) return;

    onSubmitPrayer({
      fullName: prayerName,
      email: prayerEmail || 'Not provided',
      phone: prayerPhone || 'Not provided',
      category: 'General Intercession',
      requestText: prayerText,
      wantsFollowup: contactMe,
      isConfidential: isPrivate,
    });

    setPrayerSubmitted(true);
    setPrayerName('');
    setPrayerEmail('');
    setPrayerPhone('');
    setPrayerText('');
  };

  const handleTestimonySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyName.trim() || !testimonyContent.trim()) return;
    setTestimonySuccess(true);
    setTimeout(() => {
      setTestimonySuccess(false);
      setShowTestimonyModal(false);
      setTestimonyName('');
      setTestimonyTitle('');
      setTestimonyContent('');
    }, 2000);
  };

  return (
    <div className="space-y-0 text-slate-900">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION - ICGC Official Deep Forest & Gold */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] lg:min-h-[90vh] bg-[#02180e] flex items-center justify-center overflow-hidden" id="hero-section">
        {/* Official Church Banner Image - Elevated visibility with smooth cinematic Ken Burns animation */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            src="/hero_icgc_banner.jpg"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== 'https://i.imgur.com/0ULg34j.png') {
                target.src = 'https://i.imgur.com/0ULg34j.png';
              }
            }}
            alt="Wisdom Temple Official Banner"
            initial={{ scale: 1.04, opacity: 0.9 }}
            animate={{
              scale: [1.04, 1.12, 1.04],
              y: [0, -10, 0],
            }}
            transition={{
              scale: { duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              y: { duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            }}
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            referrerPolicy="no-referrer"
          />

          {/* Balanced cinematic grading: Lighter overlay so the image is clearly visible, with focused center vignette for text clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#02180e]/75 via-[#02180e]/40 to-[#02180e]/95 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(2,24,14,0.45)_0%,_rgba(2,24,14,0.7)_65%,_rgba(2,24,14,0.95)_100%)] pointer-events-none" />

          {/* Dynamic Breathing Gold Ambient Light */}
          <motion.div
            animate={{
              opacity: [0.12, 0.26, 0.12],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] bg-[#c99726]/20 rounded-full blur-3xl pointer-events-none"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
          {/* Top Badge: Assembly Identity & Service Time */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-[#02180e]/90 border border-[#c99726]/60 text-[#fce49e] text-xs font-bold tracking-widest uppercase mb-6 shadow-2xl backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#c99726] shadow-[0_0_10px_#c99726] animate-pulse" />
            <span className="text-white/90">ICGC WISDOM TEMPLE</span>
            <span className="text-[#c99726]">•</span>
            <span>SUNDAYS AT 8:00 AM</span>
          </motion.div>

          {/* Headline - Legacy Hills Bold Contemporary Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.98] max-w-5xl font-serif-title drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] uppercase"
          >
            WELCOME <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#fce49e] to-[#e5b138]">HOME</span>
          </motion.h1>

          {/* Legacy Hills Style Guiding Motto & Vision */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="mt-6 text-lg sm:text-xl md:text-2xl text-[#fce49e] font-extrabold max-w-3xl leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,1)] tracking-wider uppercase"
          >
            EXPERIENCE GOD'S LOVE • TRUST HIS WORD • FOLLOW HIS LEAD
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: 'easeOut' }}
            className="mt-4 text-base sm:text-lg text-emerald-100/90 font-medium max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
          >
            Raising leaders, shaping visions, and influencing society through Christ. Join us in person at Star Junction, Tabora, or experience our service live online.
          </motion.p>

          {/* Primary & Secondary CTAs - Plan A Visit & Watch Message */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease: 'easeOut' }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('new-here')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm sm:text-base shadow-xl hover:shadow-[#c99726]/30 transition-all flex items-center justify-center space-x-2.5 cursor-pointer border border-[#f5cf72]/70 tracking-wider uppercase"
            >
              <span>PLAN YOUR VISIT</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => latestSermon && onWatchVideo(latestSermon)}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#02180e]/90 hover:bg-[#07472c] text-white font-bold text-sm sm:text-base border border-emerald-500/40 hover:border-[#c99726] backdrop-blur-md transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-xl tracking-wider uppercase"
            >
              <Play className="w-4 h-4 text-[#f5cf72] fill-[#f5cf72]" />
              <span>WATCH ONLINE</span>
            </motion.button>
          </motion.div>

          {/* Service Information Badges - Architectural Glass Panels */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
            className="mt-14 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left mx-auto"
          >
            {/* Sunday Service */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-[#02180e]/85 hover:bg-[#032014]/95 border border-[#c99726]/40 hover:border-[#c99726] backdrop-blur-md flex items-start space-x-4 transition-all shadow-xl"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#c99726] to-[#e5b138] text-[#021a10] font-black shadow-lg shadow-[#c99726]/20 shrink-0">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#f5cf72] font-bold block">Weekend Gathering</span>
                <h4 className="text-base font-bold text-white">Sunday Celebration</h4>
                <p className="text-xl font-black text-[#f5cf72] mt-0.5">8:00 AM</p>
                <span className="text-xs text-emerald-200/90 block mt-0.5">Sanctuary & Live Stream</span>
              </div>
            </motion.div>

            {/* The Secret Place */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-[#02180e]/85 hover:bg-[#032014]/95 border border-emerald-500/30 hover:border-[#f5cf72] backdrop-blur-md flex items-start space-x-4 transition-all shadow-xl"
            >
              <div className="p-3 rounded-xl bg-[#c99726]/20 text-[#f5cf72] border border-[#c99726]/40 shrink-0">
                <Flame className="w-5 h-5 text-[#f5cf72]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#f5cf72] font-bold block">Midweek Service</span>
                <h4 className="text-base font-bold text-white">The Secret Place</h4>
                <p className="text-xl font-black text-[#f5cf72] mt-0.5">Wednesdays • 7:00 PM</p>
                <span className="text-xs text-emerald-200/90 block mt-0.5">Prayer, Worship & Prophetic</span>
              </div>
            </motion.div>

            {/* Location Badge */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-[#02180e]/85 hover:bg-[#032014]/95 border border-emerald-500/30 hover:border-emerald-400 backdrop-blur-md flex items-start space-x-4 transition-all shadow-xl"
            >
              <div className="p-3 rounded-xl bg-[#07472c] text-emerald-200 border border-[#09603a] shrink-0">
                <MapPin className="w-5 h-5 text-[#f5cf72]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">Sanctuary Location</span>
                <h4 className="text-base font-bold text-white">Wisdom Temple</h4>
                <p className="text-sm font-bold text-[#f5cf72] mt-0.5">
                  Star Junction, Tabora
                </p>
                <span className="text-xs text-emerald-200/90 block mt-0.5">
                  Accra, Ghana • Secure Parking
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FIRST-TIME VISITOR SECTION - VIBRANT & COLORFUL WELCOME CARDS */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-[#f2f7f3] via-[#e9f2eb] to-[#f4f7f4] border-b border-[#dce8df]" id="first-time-visitor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold font-mono tracking-widest text-[#07472c] uppercase bg-white px-4 py-1.5 rounded-full border border-[#c2decc] shadow-sm inline-block">
              VISITING FOR THE FIRST TIME?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#032014] mt-3 font-serif-title tracking-tight">
              YOU'RE WELCOME HERE
            </h2>
            <p className="text-slate-700 text-base sm:text-lg mt-3 leading-relaxed">
              Stepping into a new church should feel warm, uplifting, and inspiring. At Wisdom Temple, you are received as honored family from the moment you arrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Warm Golden Amber & Royal Emerald */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 20px 30px -10px rgba(201, 151, 38, 0.2)" }}
              className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-md hover:border-[#c99726] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Gradient Top Banner */}
                <div className="p-6 sm:p-7 bg-gradient-to-br from-amber-500/15 via-amber-50 to-white border-b border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c99726] to-[#e5b138] text-[#021a10] flex items-center justify-center shadow-lg shadow-[#c99726]/30 border border-[#f5cf72]">
                      <Users className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 font-mono font-bold text-[11px] uppercase tracking-wider">
                      GUEST HOSPITALITY
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#032014] font-serif-title tracking-tight">
                    COME AS YOU ARE
                  </h3>
                  <p className="text-slate-700 text-sm mt-2 leading-relaxed">
                    A welcoming environment where you can encounter God and connect with people. No pretenses—just a warm, supportive charismatic community eager to walk with you.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="p-6 sm:p-7 space-y-3.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                    What You'll Experience:
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">Dedicated greeting & hospitality team</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">Assisted compound parking & comfortable seating</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">Complimentary visitor gift pack & reception</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onNavigate('new-here')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-50 to-amber-100/80 hover:from-[#c99726] hover:to-[#e5b138] text-amber-950 hover:text-[#021a10] font-black text-xs rounded-xl border border-amber-300 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm group-hover:shadow"
                >
                  <span>PLAN YOUR SUNDAY VISIT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Card 2: Deep ICGC Forest & Radiant Emerald */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, boxShadow: "0 20px 30px -10px rgba(7, 71, 44, 0.2)" }}
              className="bg-white rounded-3xl overflow-hidden border-2 border-emerald-200/80 shadow-md hover:border-emerald-600 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Gradient Top Banner */}
                <div className="p-6 sm:p-7 bg-gradient-to-br from-emerald-600/15 via-emerald-50 to-white border-b border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#07472c] to-[#042819] text-[#f5cf72] flex items-center justify-center shadow-lg shadow-[#07472c]/30 border border-[#c99726]/40">
                      <Sparkles className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 font-mono font-bold text-[11px] uppercase tracking-wider">
                      WORSHIP & THE WORD
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#032014] font-serif-title tracking-tight">
                    EXPERIENCE GOD
                  </h3>
                  <p className="text-slate-700 text-sm mt-2 leading-relaxed">
                    Transformative biblical teaching, intimate worship, and fervent prayer. Our services are rooted in charismatic truth, spiritual vitality, and practical wisdom for daily life.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="p-6 sm:p-7 space-y-3.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-900 block">
                    What You'll Experience:
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">Practical, life-changing Bible preaching</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">Intimate praise & charismatic worship</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">The Secret Place midweek prophetic prayer altar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onNavigate('watch-listen')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-50 to-emerald-100/80 hover:from-[#07472c] hover:to-[#042819] text-emerald-950 hover:text-white font-black text-xs rounded-xl border border-emerald-300 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm group-hover:shadow"
                >
                  <span>LISTEN TO LATEST MESSAGES</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Card 3: Royal Sapphire & ICGC Bronze */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, boxShadow: "0 20px 30px -10px rgba(13, 148, 136, 0.2)" }}
              className="bg-white rounded-3xl overflow-hidden border-2 border-teal-200/80 shadow-md hover:border-teal-600 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Gradient Top Banner */}
                <div className="p-6 sm:p-7 bg-gradient-to-br from-teal-600/15 via-teal-50 to-white border-b border-teal-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0a5c37] to-[#c99726] text-white flex items-center justify-center shadow-lg shadow-[#0a5c37]/25 border border-white/60">
                      <Shield className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-teal-100/90 text-teal-900 border border-teal-300 font-mono font-bold text-[11px] uppercase tracking-wider">
                      FAMILY & MINISTRIES
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#032014] font-serif-title tracking-tight">
                    FIND YOUR PLACE
                  </h3>
                  <p className="text-slate-700 text-sm mt-2 leading-relaxed">
                    Discover opportunities to grow, serve, and become part of our generational church family. There is an active fellowship for every age and life stage.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="p-6 sm:p-7 space-y-3.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-900 block">
                    Ministries for Everyone:
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">Men of Integrity & Precious Vessels Women</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">Destiny Generation Youth & Teens Network</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                      <span className="font-semibold text-slate-800">King's Court safe & fun Children's Church</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onNavigate('ministries')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-50 to-teal-100/80 hover:from-[#0a5c37] hover:to-[#042819] text-teal-950 hover:text-white font-black text-xs rounded-xl border border-teal-300 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm group-hover:shadow"
                >
                  <span>EXPLORE ALL MINISTRIES</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Visitor CTA */}
          <div className="mt-14 text-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('new-here')}
              className="inline-flex items-center space-x-2 px-9 py-4 bg-gradient-to-r from-[#032014] to-[#07472c] hover:from-[#063821] hover:to-[#0a5c37] text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer border border-[#c99726]/40"
            >
              <span>REGISTER YOUR FIRST VISIT</span>
              <ArrowRight className="w-4 h-4 text-[#f5cf72]" />
            </motion.button>
            <p className="text-xs text-slate-600 mt-2.5 font-medium">
              Let us know in advance so our hospitality team can warmly receive you and your family!
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LATEST MESSAGE (MEDIA SECTION) - ICGC Deep Forest Theme */}
      {/* ========================================================================= */}
      {latestSermon && (
        <section className="py-20 bg-[#02180e] text-white border-b border-[#084c2e]" id="latest-message">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#094c2d] gap-4">
              <div>
                <span className="text-xs font-mono text-[#f5cf72] uppercase tracking-widest block font-bold">
                  SPIRITUAL FEEDING & MEDIA
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-serif-title">
                  LATEST MESSAGE
                </h2>
              </div>
              <button
                onClick={() => onNavigate('watch-listen')}
                className="inline-flex items-center space-x-1 text-sm font-semibold text-[#f5cf72] hover:text-white transition-colors"
              >
                <span>VIEW ALL MESSAGES</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Message Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#032416] rounded-3xl p-6 sm:p-8 border border-[#094c2d] shadow-2xl">
              {/* Media Thumbnail Container / Embedded Player */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black border border-[#084c2e]">
                {playLatestInline && latestSermon.videoEmbedUrl ? (
                  <iframe
                    src={`${latestSermon.videoEmbedUrl}?autoplay=1&rel=0`}
                    title={latestSermon.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full group">
                    <img
                      src={latestSermon.thumbnail}
                      alt={latestSermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02180e]/95 via-[#02180e]/40 to-transparent flex flex-col items-center justify-center">
                      <button
                        onClick={() => setPlayLatestInline(true)}
                        className="w-18 h-18 rounded-full bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border border-[#f5cf72]/50 mb-2"
                        aria-label="Play Message Video inline"
                      >
                        <Play className="w-8 h-8 ml-1 fill-[#021a10]" />
                      </button>
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider bg-[#02180e]/80 px-3 py-1 rounded-full border border-[#c99726]/40">
                        Click to Play Video
                      </span>
                    </div>
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#02180e]/90 backdrop-blur-md rounded-md text-xs font-bold text-[#f5cf72] border border-[#c99726]/40">
                      {latestSermon.category}
                    </span>
                    <span className="absolute bottom-4 right-4 px-2.5 py-1 bg-[#02180e]/90 rounded font-mono text-xs text-emerald-200">
                      {latestSermon.duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-emerald-300/70">{latestSermon.date}</span>
                    <span className="text-emerald-700">•</span>
                    <span className="text-xs font-mono text-[#f5cf72] font-semibold">{latestSermon.series}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug font-serif-title">
                    {latestSermon.title}
                  </h3>
                  <p className="text-sm text-[#f5cf72] font-mono font-medium">{latestSermon.speaker}</p>
                  <p className="text-xs font-mono text-emerald-200/80 mt-1">Scripture: {latestSermon.scripture}</p>
                </div>

                <p className="text-sm text-emerald-100/90 leading-relaxed line-clamp-3">
                  {latestSermon.summary}
                </p>

                <div className="pt-3 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (!playLatestInline) {
                        setPlayLatestInline(true);
                      } else {
                        onWatchVideo(latestSermon);
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl transition-all flex items-center space-x-2 shadow cursor-pointer border border-[#f5cf72]/40"
                  >
                    <Play className="w-4 h-4 fill-[#021a10]" />
                    <span>{playLatestInline ? 'EXPAND PLAYER' : 'WATCH MESSAGE'}</span>
                  </button>

                  <button
                    onClick={() => onPlayAudio(latestSermon)}
                    className="px-5 py-3 bg-[#053521] hover:bg-[#07472c] text-emerald-100 font-bold text-sm rounded-xl border border-[#094c2d] transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-[#f5cf72]" />
                    <span>LISTEN AUDIO</span>
                  </button>

                  {latestSermon.youtubeUrl && (
                    <a
                      href={latestSermon.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-red-950/70 hover:bg-red-900/80 text-red-200 font-bold text-xs rounded-xl border border-red-800/60 transition-all flex items-center space-x-1.5"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3 text-red-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. THE SECRET PLACE (PROMOTIONAL MIDWEEK SECTION) - ICGC Green & Gold */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-br from-[#01140b] via-[#032014] to-[#042819] text-white relative overflow-hidden border-b border-[#084c2e]" id="the-secret-place">
        {/* Subtle Decorative Gold Flame Glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#c99726]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#c99726]/20 text-[#f5cf72] border border-[#c99726]/40 text-xs font-bold tracking-widest uppercase">
                <Flame className="w-4 h-4 text-[#f5cf72]" />
                <span>MIDWEEK PRAYER SERVICE</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-serif-title">
                THE SECRET PLACE
              </h2>

              <p className="text-xl sm:text-2xl text-[#f5cf72] font-semibold font-serif-title">
                A Time of Prayer, Worship and Encounter
              </p>

              <p className="text-emerald-100 text-base leading-relaxed max-w-xl">
                "He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty." (Psalm 91:1). 
                Step away from the busyness of the week into an atmosphere charged with heartfelt intercession, prophetic guidance, and divine breakthrough.
              </p>

              <div className="p-4 bg-[#02180e]/90 rounded-2xl border border-[#094c2d] max-w-md space-y-2">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-[#c99726]" />
                  <div>
                    <span className="text-xs text-emerald-300/70 uppercase font-mono">Service Schedule</span>
                    <p className="text-base font-bold text-white">Every Wednesday at 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2 border-t border-[#094c2d]">
                  <MapPin className="w-5 h-5 text-[#c99726]" />
                  <div>
                    <span className="text-xs text-emerald-300/70 uppercase font-mono">Venue</span>
                    <p className="text-sm font-mono text-emerald-200">Wisdom Temple Auditorium & Online</p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('prayer')}
                  className="px-8 py-4 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-base rounded-xl shadow-xl hover:shadow-[#c99726]/30 transition-all cursor-pointer inline-flex items-center space-x-2 border border-[#f5cf72]/50"
                >
                  <span>JOIN US AT THE ALTAR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Card: The Official Secret Place Banner */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => setSecretPlaceModalOpen(true)}
                className="group relative rounded-2xl overflow-hidden border border-[#c99726]/40 shadow-2xl bg-black cursor-pointer max-w-sm sm:max-w-md w-full transform hover:scale-[1.01] transition-all duration-300"
                title="Click to enlarge Secret Place banner"
              >
                <img 
                  src="/secret_place_banner.jpg" 
                  alt="The Secret Place - Midweek Encounter" 
                  className="w-full h-auto object-contain block mx-auto"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                  <span className="text-xs font-bold text-[#f5cf72] flex items-center space-x-1.5 bg-[#02180e]/95 px-3.5 py-1.5 rounded-full border border-[#c99726]/50 shadow-lg">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to Enlarge Banner</span>
                  </span>
                </div>

                {/* Badge top corner */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-[#02180e]/90 text-[#f5cf72] border border-[#c99726]/50 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1 shadow-md">
                    <Flame className="w-3 h-3 text-[#f5cf72]" />
                    <span>MIDWEEK ALTAR</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED ANNUAL EVENT: WISDOM SUMMIT 2026 */}
      {/* ========================================================================= */}
      {featuredSummit && (
        <section className="py-20 bg-[#02180e] text-white relative overflow-hidden border-b border-[#084c2e]" id="wisdom-summit">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#02180e] via-[#032416] to-[#05321f] rounded-3xl border border-[#c99726]/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              {/* Event Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span className="px-3.5 py-1 bg-gradient-to-r from-[#c99726] to-[#e5b138] text-[#021a10] font-black text-xs uppercase tracking-widest rounded-full shadow">
                  ANNUAL FLAGSHIP CONFERENCE
                </span>
                <button
                  onClick={() => onShare(featuredSummit.name, `${featuredSummit.theme} - Join us for Wisdom Summit 2026 at Wisdom Temple`)}
                  className="p-2 rounded-lg bg-[#042819] hover:bg-[#07472c] text-emerald-200 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer border border-[#094c2d]"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#c99726]" />
                  <span>Share Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Official Wisdom Summit Banner */}
                <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
                  <div 
                    onClick={() => setFlyerModalOpen(true)}
                    className="group relative rounded-2xl overflow-hidden border border-[#c99726]/40 shadow-2xl bg-black cursor-pointer w-full transform hover:scale-[1.008] transition-all duration-300"
                    title="Click to enlarge banner"
                  >
                    <img 
                      src="/wisdom_summit_banner.jpg" 
                      alt="Wisdom Summit 2026" 
                      className="w-full h-auto object-cover block"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover Overlay with Enlarge Cue */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <span className="text-xs font-bold text-[#f5cf72] flex items-center space-x-1.5 bg-[#02180e]/95 px-3.5 py-1.5 rounded-full border border-[#c99726]/50 shadow-lg">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Click to Enlarge Official Banner</span>
                      </span>
                    </div>

                    {/* Corner Badge */}
                    <div className="absolute top-3 right-3 bg-[#02180e]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#c99726]/60 text-[10px] font-bold text-[#f5cf72] uppercase tracking-wider flex items-center space-x-1 shadow-lg">
                      <Sparkles className="w-3 h-3 text-[#c99726]" />
                      <span>Wisdom Summit</span>
                    </div>
                  </div>
                </div>

                {/* Countdown & Registration Beside */}
                <div className="lg:col-span-5 xl:col-span-4 bg-[#02180e]/95 rounded-2xl border border-[#c99726]/40 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#f5cf72] block font-black">
                      CONFERENCE COUNTDOWN
                    </span>
                    <p className="text-xs text-emerald-300/80 mt-1 font-mono">October 7 - 9 & 11, 2026</p>
                  </div>

                  {/* Timer Boxes */}
                  <div className="grid grid-cols-4 gap-2.5 text-center">
                    <div className="bg-[#032416] border border-[#084c2e] rounded-xl p-3 shadow-inner">
                      <span className="text-2xl sm:text-3xl font-black text-[#f5cf72] font-mono block">
                        {timeLeft.days}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">Days</span>
                    </div>
                    <div className="bg-[#032416] border border-[#084c2e] rounded-xl p-3 shadow-inner">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">Hours</span>
                    </div>
                    <div className="bg-[#032416] border border-[#084c2e] rounded-xl p-3 shadow-inner">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">Mins</span>
                    </div>
                    <div className="bg-[#032416] border border-[#084c2e] rounded-xl p-3 shadow-inner">
                      <span className="text-2xl sm:text-3xl font-black text-[#f5cf72] font-mono block">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">Secs</span>
                    </div>
                  </div>

                  {/* Registering Button Beside */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => onRegisterEvent(featuredSummit)}
                      className="w-full py-4 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm sm:text-base rounded-xl shadow-xl transition-all cursor-pointer border border-[#f5cf72]/40 tracking-wide transform hover:-translate-y-0.5"
                    >
                      REGISTER FOR WISDOM SUMMIT
                    </button>
                    <p className="text-[11px] text-emerald-300/70">Free Entry • Reserved Seating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. UPCOMING EVENTS GRID */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#f4f7f4] border-b border-[#e0e9e3]" id="upcoming-events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#07472c] uppercase bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                CALENDAR & GATHERINGS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032014] mt-2 font-serif-title">
                UPCOMING EVENTS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="inline-flex items-center space-x-1 text-sm font-semibold text-[#07472c] hover:text-[#0b643f] transition-colors"
            >
              <span>VIEW ALL EVENTS</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-[#d6e5dc] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#032014]">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#02180e]/90 text-[#f5cf72] rounded text-xs font-bold backdrop-blur-md border border-[#c99726]/30">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs font-mono text-[#07472c] font-bold flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-[#c99726]" />
                      <span>{event.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#032014] group-hover:text-[#07472c] transition-colors line-clamp-1 font-serif-title">
                      {event.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {event.shortDescription}
                    </p>

                    <div className="text-xs text-slate-500 space-y-1 pt-2 font-mono">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onRegisterEvent(event)}
                    className="w-full py-2.5 bg-[#032014] hover:bg-[#063821] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-[#c99726]/30"
                  >
                    REGISTER NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ABOUT THE CHURCH INTRO */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-b border-[#e0e9e3]" id="about-intro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold tracking-widest text-[#07472c] uppercase bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                ABOUT WISDOM TEMPLE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#032014] leading-tight font-serif-title">
                RAISING LEADERS. <br />
                SHAPING VISIONS. <br />
                INFLUENCING SOCIETY.
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {CHURCH_INFO.description}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                As a vibrant charismatic church in Ghana, our heart is to build believers who reflect Christ's character, excel in their careers and callings, and bring transformative godly leadership to every sphere of human endeavor.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3.5 bg-[#032014] hover:bg-[#063821] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md border border-[#c99726]/30"
                >
                  LEARN MORE
                </button>
                <button
                  onClick={() => onNavigate('about', 'leadership')}
                  className="px-6 py-3.5 bg-[#eef6f1] hover:bg-[#e0eee4] text-[#07472c] border border-[#c2decc] font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  MEET OUR LEADERSHIP
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <img
                    src="/open_bible.jpg"
                    alt="Open Holy Bible - God's Word at Wisdom Temple"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 bg-[#eef6f1] border border-[#c2decc] rounded-2xl">
                  <span className="text-xs font-mono text-[#07472c] font-bold uppercase block">Core Scripture</span>
                  <p className="text-xs font-semibold text-[#032014] mt-1">
                    "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
                  </p>
                  <span className="text-[10px] text-[#c99726] font-mono block mt-1 font-bold">Proverbs 4:7</span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-5 bg-[#032014] text-white rounded-2xl border border-[#084c2e] shadow-xl">
                  <span className="text-[#f5cf72] font-serif-title font-bold text-xl block">Kingdom Heritage</span>
                  <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                    Committed to holistic human development: spiritual, intellectual, and socioeconomic transformation in Africa.
                  </p>
                </div>
                <div 
                  onClick={() => onNavigate('about', 'leadership')}
                  className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#02180e] relative border-2 border-[#c99726]/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={PASTORAL_COUPLE_IMAGE}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/rev_gabriel_and_helena_dela.jpg'; }}
                    alt="Rev. Gabriel Dela and Lady Dr. Helena Dela - Shepherd and First Lady of Wisdom Temple"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02180e]/95 via-[#02180e]/30 to-transparent" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] font-mono text-[#f5cf72] uppercase tracking-wider block font-bold">
                      SHEPHERD & FIRST LADY
                    </span>
                    <p className="text-xs sm:text-sm font-bold font-serif-title leading-tight text-white mt-0.5">
                      Rev. Gabriel Dela & Lady Dr. Helena Dela
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MINISTRIES DIRECTORY PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#f4f7f4] border-b border-[#e0e9e3]" id="ministries-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#07472c] uppercase bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                SERVE & GROW TOGETHER
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032014] mt-2 font-serif-title">
                OUR MINISTRIES
              </h2>
            </div>
            <button
              onClick={() => onNavigate('ministries')}
              className="inline-flex items-center space-x-1 text-sm font-semibold text-[#07472c] hover:text-[#0b643f] transition-colors"
            >
              <span>EXPLORE ALL MINISTRIES</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ministries.slice(0, 4).map((ministry) => (
              <div
                key={ministry.id}
                className="bg-white rounded-2xl border border-[#d6e5dc] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-[#032014] overflow-hidden">
                    <img
                      src={ministry.image}
                      alt={ministry.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#07472c]">
                      {ministry.category}
                    </span>
                    <h3 className="text-base font-bold text-[#032014] font-serif-title line-clamp-1">
                      {ministry.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {ministry.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => onNavigate('ministries', ministry.id)}
                    className="w-full py-2 bg-[#eef6f1] hover:bg-[#e0eee4] text-[#07472c] font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-[#c2decc]"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CHURCH LIFE & PHOTO GALLERY (LIGHTBOX ENABLED) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#fafcfb] border-b border-[#d6e5dc]" id="church-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PhotoGallery
            photos={photos}
            title="Moments of Faith & Fellowship"
            subtitle="Explore high-resolution highlights from our recent Sunday celebrations, prophetic prayer altars, youth camps, and annual leadership summits."
            showFilters={true}
            limit={8}
            onViewAll={() => onNavigate('gallery')}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. PRAYER REQUEST SECTION - ICGC Forest & Gold Altar */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#02180e] text-white relative border-b border-[#084c2e]" id="prayer-request">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#f5cf72]">
              PASTORAL CARE & INTERCESSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-title">
              HOW CAN WE PRAY FOR YOU?
            </h2>
            <p className="text-base sm:text-lg text-emerald-200/80 max-w-xl mx-auto leading-relaxed">
              Whatever you're facing, you don't have to face it alone. Share your prayer request with us.
            </p>
          </div>

          <div className="bg-[#032416] rounded-3xl border border-[#094c2d] p-6 sm:p-10 shadow-2xl">
            {prayerSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#f5cf72] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif-title">Prayer Request Received</h3>
                <p className="text-sm text-emerald-200/80 max-w-md mx-auto leading-relaxed">
                  Our pastoral intercessors and prayer team have received your request. We will bring it before God at our prayer altars.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setPrayerSubmitted(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#c99726] to-[#e5b138] text-[#021a10] font-black text-xs rounded-xl cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePrayerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={prayerName}
                      onChange={(e) => setPrayerName(e.target.value)}
                      placeholder="e.g. Sister Abena"
                      className="w-full px-4 py-3 bg-[#02180e] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726] placeholder-emerald-400/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={prayerEmail}
                      onChange={(e) => setPrayerEmail(e.target.value)}
                      placeholder="abena@example.com"
                      className="w-full px-4 py-3 bg-[#02180e] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726] placeholder-emerald-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={prayerPhone}
                    onChange={(e) => setPrayerPhone(e.target.value)}
                    placeholder="e.g. +233 20 000 0000"
                    className="w-full px-4 py-3 bg-[#02180e] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726] placeholder-emerald-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                    Prayer Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={prayerText}
                    onChange={(e) => setPrayerText(e.target.value)}
                    placeholder="Share your prayer need, health situation, family burden, or thanksgiving..."
                    className="w-full px-4 py-3 bg-[#02180e] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726] placeholder-emerald-400/50"
                  />
                </div>

                {/* Privacy Checkbox */}
                <div className="space-y-2 pt-2 text-xs text-emerald-200/90">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactMe}
                      onChange={(e) => setContactMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#084c2e] text-[#c99726] focus:ring-[#c99726]"
                    />
                    <span>I would like someone from the church to contact me.</span>
                  </label>

                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-300/70">
                    <Lock className="w-3.5 h-3.5 text-[#c99726] shrink-0" />
                    <span>Your request is kept strictly confidential among pastoral intercessors.</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl shadow-xl transition-all cursor-pointer border border-[#f5cf72]/40"
                  >
                    SUBMIT PRAYER REQUEST
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. TESTIMONIES SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#f4f7f4] border-b border-[#e0e9e3]" id="testimonies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#07472c] uppercase bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                PRAISE REPORTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032014] mt-2 font-serif-title">
                GOD IS STILL WORKING
              </h2>
            </div>
            <button
              onClick={() => setShowTestimonyModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#07472c] hover:bg-[#063821] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-[#c99726]/30 shadow"
            >
              <span>SHARE YOUR TESTIMONY</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonies.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-7 border border-[#d6e5dc] shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <Quote className="w-8 h-8 text-[#07472c]/30" />
                  <h3 className="text-base font-bold text-[#032014] font-serif-title">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                    "{item.testimony}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[#032014] font-bold block">{item.personName}</span>
                    <span className="text-slate-400 text-[11px]">{item.date}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#eef6f1] text-[#07472c] rounded font-mono text-[10px] border border-[#c2decc]">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. GIVING TEASER ON HOMEPAGE - Official ICGC Forest & Gold */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#032014] text-white border-t border-[#c99726]/30" id="giving-teaser">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 bg-[#c99726]/20 border border-[#c99726]/40 rounded-full flex items-center justify-center mx-auto text-[#f5cf72]">
            <Heart className="w-6 h-6 fill-[#c99726] text-[#c99726]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif-title">
            WORSHIP THROUGH GIVING
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Your generosity helps support the work of the ministry and enables us to serve people, maintain our sanctuary, and advance the Gospel in Ghana.
          </p>
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('give')}
              className="px-8 py-3.5 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl shadow-xl transition-all cursor-pointer inline-flex items-center space-x-2 border border-[#f5cf72]/40"
            >
              <span>GIVE TITHES & OFFERINGS</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Share Testimony Modal */}
      {showTestimonyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#032416] border border-[#094c2d] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#084c2e] pb-3">
              <h3 className="font-bold text-white text-base font-serif-title">Share Your Testimony</h3>
              <button onClick={() => setShowTestimonyModal(false)} className="text-emerald-300 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            {testimonySuccess ? (
              <div className="py-8 text-center text-emerald-300 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-[#f5cf72]" />
                <p className="text-sm font-bold text-white">Thank you for sharing what God has done!</p>
                <p className="text-xs text-emerald-300/70">Your praise report has been submitted to the pastoral team.</p>
              </div>
            ) : (
              <form onSubmit={handleTestimonySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={testimonyName}
                    onChange={(e) => setTestimonyName(e.target.value)}
                    placeholder="e.g. Brother Kojo"
                    className="w-full px-3.5 py-2.5 bg-[#02180e] border border-[#084c2e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">Testimony Title *</label>
                  <input
                    type="text"
                    required
                    value={testimonyTitle}
                    onChange={(e) => setTestimonyTitle(e.target.value)}
                    placeholder="e.g. Breakthrough in Employment"
                    className="w-full px-3.5 py-2.5 bg-[#02180e] border border-[#084c2e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">Your Praise Report *</label>
                  <textarea
                    rows={4}
                    required
                    value={testimonyContent}
                    onChange={(e) => setTestimonyContent(e.target.value)}
                    placeholder="Describe how the Lord intervened or answered prayer..."
                    className="w-full px-3.5 py-2.5 bg-[#02180e] border border-[#084c2e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-xs rounded-xl transition-all cursor-pointer"
                  >
                    SUBMIT PRAISE REPORT
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WISDOM SUMMIT FLYER LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {flyerModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setFlyerModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#02180e] rounded-2xl border border-[#c99726]/60 p-4 sm:p-6 shadow-2xl overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#084c2e]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#c99726]" />
                <span className="font-bold text-sm tracking-wide text-[#f5cf72]">WISDOM SUMMIT 2026 — OFFICIAL BANNER</span>
              </div>
              <button
                onClick={() => setFlyerModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#042819] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#084c2e] bg-black">
              <img 
                src="/wisdom_summit_banner.jpg" 
                alt="Wisdom Summit 2026" 
                className="w-full h-auto object-contain max-h-[75vh] mx-auto block"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-emerald-200/80 font-mono">
                October 7–9 & October 11, 2026
              </span>
              <button
                onClick={() => {
                  setFlyerModalOpen(false);
                  if (featuredSummit) onRegisterEvent(featuredSummit);
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                REGISTER NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THE SECRET PLACE BANNER LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {secretPlaceModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setSecretPlaceModalOpen(false)}
        >
          <div 
            className="relative max-w-2xl w-full bg-[#02180e] rounded-2xl border border-[#c99726]/60 p-4 sm:p-6 shadow-2xl overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#084c2e]">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-[#f5cf72]" />
                <span className="font-bold text-sm tracking-wide text-[#f5cf72]">THE SECRET PLACE — OFFICIAL BANNER</span>
              </div>
              <button
                onClick={() => setSecretPlaceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#042819] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#084c2e] bg-black">
              <img 
                src="/secret_place_banner.jpg" 
                alt="The Secret Place - Midweek Encounter" 
                className="w-full h-auto object-contain max-h-[75vh] mx-auto block"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-emerald-200/80 font-mono">
                Every Wednesday at 7:00 PM • Wisdom Temple Auditorium
              </span>
              <button
                onClick={() => {
                  setSecretPlaceModalOpen(false);
                  onNavigate('prayer');
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                SUBMIT PRAYER REQUEST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
