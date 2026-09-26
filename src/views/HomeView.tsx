import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  PageId,
  Sermon,
  ChurchEvent,
  Ministry,
  PrayerRequest,
  Testimony,
  ChurchPhoto,
} from "../types";
import { CHURCH_INFO, INITIAL_CHURCH_PHOTOS } from "../data/churchData";
import { PASTORAL_COUPLE_IMAGE } from "../assets/pastoralImage";
import { PhotoGallery } from "../components/PhotoGallery";
import { QuickActionsMenu } from "../components/QuickActionsMenu";
import { PastorsCorner } from "../components/PastorsCorner";
import { useBanners } from "../utils/bannerManager";
import { useSiteContent } from "../utils/contentManager";
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
  Compass,
} from "lucide-react";

interface HomeViewProps {
  onNavigate: (page: PageId, subTab?: string) => void;
  sermons: Sermon[];
  events: ChurchEvent[];
  ministries: Ministry[];
  testimonies: Testimony[];
  onPlayAudio: (sermon: Sermon) => void;
  onWatchVideo: (sermon: Sermon) => void;
  onRegisterEvent: (event: ChurchEvent) => void;
  onSubmitPrayer: (
    req: Omit<PrayerRequest, "id" | "dateSubmitted" | "status">,
  ) => void;
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
  const { getBanner } = useBanners();
  const { content } = useSiteContent();
  const prefersReducedMotion = useReducedMotion();

  // Latest message
  const latestSermon = sermons[0];
  const featuredSummit = events.find((e) => e.isFeaturedSummit) || events[0];
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
    const targetDate = new Date("2026-10-07T18:00:00");
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
  const [prayerName, setPrayerName] = useState("");
  const [prayerEmail, setPrayerEmail] = useState("");
  const [prayerPhone, setPrayerPhone] = useState("");
  const [prayerText, setPrayerText] = useState("");
  const [contactMe, setContactMe] = useState(false);
  const [isPrivate] = useState(true);
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // Testimony modal state
  const [showTestimonyModal, setShowTestimonyModal] = useState(false);
  const [testimonyName, setTestimonyName] = useState("");
  const [testimonyTitle, setTestimonyTitle] = useState("");
  const [testimonyContent, setTestimonyContent] = useState("");
  const [testimonySuccess, setTestimonySuccess] = useState(false);

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerName.trim() || !prayerText.trim()) return;

    onSubmitPrayer({
      fullName: prayerName,
      email: prayerEmail || "Not provided",
      phone: prayerPhone || "Not provided",
      category: "General Intercession",
      requestText: prayerText,
      wantsFollowup: contactMe,
      isConfidential: isPrivate,
    });

    setPrayerSubmitted(true);
    setPrayerName("");
    setPrayerEmail("");
    setPrayerPhone("");
    setPrayerText("");
  };

  const handleTestimonySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyName.trim() || !testimonyContent.trim()) return;
    setTestimonySuccess(true);
    setTimeout(() => {
      setTestimonySuccess(false);
      setShowTestimonyModal(false);
      setTestimonyName("");
      setTestimonyTitle("");
      setTestimonyContent("");
    }, 2000);
  };

  return (
    <div className="space-y-0 text-slate-900">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION - Minimal, Airy, Image-Forward (connection-rincon style) */}
      {/* ========================================================================= */}
      <section
        className="premium-hero relative min-h-[78vh] lg:min-h-[86vh] flex flex-col justify-end overflow-hidden pt-24 sm:pt-32 pb-12 sm:pb-16"
        id="hero-section"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            src={getBanner("hero_banner", "/hero_icgc_banner.jpg")}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== "https://i.imgur.com/0ULg34j.png") {
                target.src = "https://i.imgur.com/0ULg34j.png";
              }
            }}
            alt="Wisdom Temple Official Banner"
            initial={
              prefersReducedMotion
                ? { scale: 1, opacity: 0.7 }
                : { scale: 1.12, opacity: 0.2 }
            }
            animate={
              prefersReducedMotion
                ? { scale: 1, opacity: 0.7 }
                : { scale: [1.08, 1.12, 1.08], y: [0, -8, 0], opacity: 0.7 }
            }
            transition={{
              opacity: {
                duration: prefersReducedMotion ? 0 : 1.2,
                ease: "easeOut",
              },
              scale: {
                duration: 18,
                repeat: prefersReducedMotion ? 0 : Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              y: {
                duration: 22,
                repeat: prefersReducedMotion ? 0 : Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
            className="w-full h-full object-cover object-center opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071914]/35 via-[#071914]/10 to-[#071914]/90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071914]/80 via-[#071914]/18 to-[#071914]/28 pointer-events-none" />
        </div>

        <div className="hero-content-column relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-left flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="glass-chip inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[#f2d49b] text-[8px] sm:text-[9px] font-medium tracking-[0.32em] uppercase mb-6"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f2d49b]" />
            <span>{content.heroEyebrow}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: "easeOut" }}
            className="max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-[5.8rem] leading-[0.98] tracking-[-0.02em] font-bold text-white font-display text-shadow-hero drop-shadow-[0_5px_18px_rgba(0,0,0,0.5)]"
          >
            {content.heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.62, ease: "easeOut" }}
            className="mt-7 max-w-md text-sm sm:text-base text-emerald-50/90 leading-[1.7] font-medium drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)]"
          >
            {content.heroSubtitle}
          </motion.p>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full mt-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.86, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start gap-3"
          >
            <button
              onClick={() => onNavigate("new-here")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#f3d79a] via-[#e0b96a] to-[#c7933a] text-[#1b120d] font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-[0_18px_32px_rgba(196,149,58,0.22)] transition-all hover:-translate-y-0.5 hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{content.heroButtonPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("events")}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/12 bg-white/[0.04] text-[#f8f5f1] font-semibold text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm transition-all hover:bg-white/[0.07] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#f5cf72]" />
              <span>{content.heroButtonSecondary}</span>
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="absolute right-5 sm:right-8 lg:right-10 bottom-8 hidden sm:flex items-center gap-3 rounded-2xl border border-white/25 bg-[#fdf9ee]/95 px-4 py-3 text-[#123426] shadow-[0_16px_38px_rgba(3,32,20,0.28)] backdrop-blur-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a5c37] text-[#f5cf72]">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#b8861d]">
              Visit Wisdom Temple
            </span>
            <span className="block text-xs font-semibold">
              {CHURCH_INFO.landmark}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MODULAR EXPERIENCE ROW - Inspired by connection-rincon.com */}
      {/* ========================================================================= */}
      <section className="cinematic-panel py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-semibold text-[#0d5a3d] uppercase tracking-[0.22em] bg-[#edf6f0] px-3.5 py-2 rounded-full border border-[#d4e9db] inline-block mb-4">
              {content.experienceSectionBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142d24] font-display tracking-[-0.06em]">
              {content.experienceSectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              {content.experienceSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            {/* Module 1: Visit In-Person */}
            <div className="editorial-card premium-card rounded-[4px] p-7 sm:p-8 md:col-span-5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d1f18] text-[#f5cf72] flex items-center justify-center shadow-[0_15px_30px_rgba(13,31,24,0.2)]">
                  <MapPin className="w-6 h-6 text-[#d7a94b]" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0d5a3d]">
                    SUNDAYS @ {content.sundayServiceTime}
                  </span>
                  <h3 className="text-2xl font-bold text-[#142d24] font-display tracking-[-0.04em]">
                    {content.experienceMod1Title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.experienceMod1Desc}
                </p>
              </div>
              <div className="pt-6 mt-5 border-t border-slate-200/80">
                <button
                  onClick={() => onNavigate("new-here")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0a3d2d] group-hover:text-[#b88418] transition-colors cursor-pointer"
                >
                  <span>Plan Your Sunday Visit</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Module 2: Watch on Demand */}
            <div className="editorial-card premium-card rounded-[4px] p-7 sm:p-8 md:col-span-4 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d1f18] text-[#f5cf72] flex items-center justify-center shadow-[0_15px_30px_rgba(13,31,24,0.2)]">
                  <Play className="w-6 h-6 text-[#d7a94b] fill-[#d7a94b]" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0d5a3d]">
                    MESSAGES & PODCASTS
                  </span>
                  <h3 className="text-2xl font-bold text-[#142d24] font-display tracking-[-0.04em]">
                    {content.experienceMod2Title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.experienceMod2Desc}
                </p>
              </div>
              <div className="pt-6 mt-5 border-t border-slate-200/80">
                <button
                  onClick={() => onNavigate("watch-listen")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0a3d2d] group-hover:text-[#b88418] transition-colors cursor-pointer"
                >
                  <span>Browse Sermon Archive</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Module 3: The Secret Place */}
            <div className="editorial-card premium-card rounded-[4px] p-7 sm:p-8 md:col-span-3 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d1f18] text-[#f5cf72] flex items-center justify-center shadow-[0_15px_30px_rgba(13,31,24,0.2)]">
                  <Flame className="w-6 h-6 text-[#d7a94b]" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0d5a3d]">
                    WEDNESDAYS @ {content.midweekServiceTime}
                  </span>
                  <h3 className="text-2xl font-bold text-[#142d24] font-display tracking-[-0.04em]">
                    {content.experienceMod3Title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.experienceMod3Desc}
                </p>
              </div>
              <div className="pt-6 mt-5 border-t border-slate-200/80">
                <button
                  onClick={() => onNavigate("prayer")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0a3d2d] group-hover:text-[#b88418] transition-colors cursor-pointer"
                >
                  <span>Submit Prayer / Join</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FIRST-TIME VISITOR SECTION - Clean Architectural Design */}
      {/* ========================================================================= */}
      <section
        className="py-24 bg-[#fbfcfb] border-b border-slate-200"
        id="first-time-visitor"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#76550f] mb-2">
              {content.firstTimeVisitorEyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#032014] font-serif tracking-tight">
              {content.firstTimeVisitorTitle}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              {content.firstTimeVisitorDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Guest Hospitality */}
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-[#c99726] shadow-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="p-7 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-[#031e13] text-[#dfb15b] flex items-center justify-center">
                      <Users className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#76550f]">
                      Guest Hospitality
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#032014] tracking-tight">
                    Come As You Are
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    A welcoming environment where you can encounter God and
                    connect with people. No pretenses—just a warm, supportive
                    charismatic community eager to walk with you.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="p-7 space-y-3">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 block">
                    What You'll Experience:
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        Dedicated greeting & hospitality team
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        Assisted compound parking & comfortable seating
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        Complimentary visitor gift pack & reception
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-7 pt-0">
                <button
                  onClick={() => onNavigate("new-here")}
                  className="w-full py-3 px-4 bg-[#f8faf8] hover:bg-[#031e13] text-[#031e13] hover:text-white font-semibold text-xs tracking-wider uppercase rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Plan Your Sunday Visit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Worship & The Word */}
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-[#c99726] shadow-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="p-7 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-[#031e13] text-[#dfb15b] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#76550f]">
                      Worship & The Word
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#032014] tracking-tight">
                    Experience God
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    Transformative biblical teaching, intimate worship, and
                    fervent prayer. Our services are rooted in charismatic
                    truth, spiritual vitality, and practical wisdom for daily
                    life.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="p-7 space-y-3">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 block">
                    What You'll Experience:
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        Practical, life-changing Bible preaching
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        Intimate praise & charismatic worship
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        The Secret Place midweek prayer service
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-7 pt-0">
                <button
                  onClick={() => onNavigate("watch-listen")}
                  className="w-full py-3 px-4 bg-[#f8faf8] hover:bg-[#031e13] text-[#031e13] hover:text-white font-semibold text-xs tracking-wider uppercase rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Listen to Latest Messages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Family & Ministries */}
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-[#c99726] shadow-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="p-7 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-[#031e13] text-[#dfb15b] flex items-center justify-center">
                      <Shield className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#76550f]">
                      Family & Ministries
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#032014] tracking-tight">
                    Find Your Place
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    Discover opportunities to grow, serve, and become part of
                    our generational church family. There is an active
                    fellowship for every age and life stage.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="p-7 space-y-3">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 block">
                    Ministries for Everyone:
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        Men of Integrity & Precious Vessels Women
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        Destiny Generation Youth & Teens Network
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-medium text-slate-800">
                        King's Court safe & fun Children's Church
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-7 pt-0">
                <button
                  onClick={() => onNavigate("ministries")}
                  className="w-full py-3 px-4 bg-[#f8faf8] hover:bg-[#031e13] text-[#031e13] hover:text-white font-semibold text-xs tracking-wider uppercase rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Explore All Ministries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Visitor CTA */}
          <div className="mt-14 text-center">
            <button
              onClick={() => onNavigate("new-here")}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#031e13] hover:bg-[#073623] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Register Your First Visit</span>
              <ArrowRight className="w-4 h-4 text-[#dfb15b]" />
            </button>
            <p className="text-xs text-slate-500 mt-2.5">
              Let us know in advance so our hospitality team can warmly receive
              you and your family!
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LATEST MESSAGE (MEDIA SECTION) - ICGC Deep Forest Theme */}
      {/* ========================================================================= */}
      {latestSermon && (
        <section
          className="py-20 bg-[#02180e] text-white border-b border-[#084c2e]"
          id="latest-message"
        >
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
                onClick={() => onNavigate("watch-listen")}
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
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <button
                        onClick={() => setPlayLatestInline(true)}
                        className="w-16 h-16 rounded-full bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer mb-2"
                        aria-label="Play Message Video inline"
                      >
                        <Play className="w-7 h-7 ml-1 fill-[#021a10]" />
                      </button>
                      <span className="text-xs font-mono font-medium text-white uppercase tracking-wider bg-black/80 px-3 py-1 rounded-md">
                        Click to Play Video
                      </span>
                    </div>
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#02180e]/90 rounded text-xs font-bold text-[#dfb15b]">
                      {latestSermon.category}
                    </span>
                    <span className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/80 rounded font-mono text-xs text-white">
                      {latestSermon.duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-emerald-300/70">
                      {latestSermon.date}
                    </span>
                    <span className="text-emerald-700">•</span>
                    <span className="text-xs font-mono text-[#dfb15b] font-semibold">
                      {latestSermon.series}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug font-serif">
                    {latestSermon.title}
                  </h3>
                  <p className="text-sm text-[#dfb15b] font-mono font-medium">
                    {latestSermon.speaker}
                  </p>
                  <p className="text-xs font-mono text-emerald-200/80 mt-1">
                    Scripture: {latestSermon.scripture}
                  </p>
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
                    className="px-6 py-3 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-[#021a10]" />
                    <span>
                      {playLatestInline ? "EXPAND PLAYER" : "WATCH MESSAGE"}
                    </span>
                  </button>

                  <button
                    onClick={() => onPlayAudio(latestSermon)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/15 transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-[#dfb15b]" />
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
      {/* 4. PASTOR'S CORNER - WEEKLY PASTORAL MESSAGE & GREETING */}
      {/* ========================================================================= */}
      <PastorsCorner onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* 5. THE SECRET PLACE (PROMOTIONAL MIDWEEK SECTION) - Solid Architectural Theme */}
      {/* ========================================================================= */}
      <section
        className="py-20 bg-[#031e13] text-white relative border-b border-[#084c2e]"
        id="the-secret-place"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#dfb15b] flex items-center space-x-2">
                <Flame className="w-4 h-4 text-[#dfb15b]" />
                <span>Midweek Prayer Service</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-light text-white tracking-tight font-serif">
                THE SECRET{" "}
                <span className="font-normal text-[#dfb15b]">PLACE</span>
              </h2>

              <p className="text-xl sm:text-2xl text-[#dfb15b] font-serif font-light">
                A Time of Prayer, Worship and Encounter
              </p>

              <p className="text-emerald-100/90 text-base leading-relaxed max-w-xl">
                "He who dwells in the secret place of the Most High shall abide
                under the shadow of the Almighty." (Psalm 91:1). Step away from
                the busyness of the week into an atmosphere charged with
                heartfelt intercession, prophetic guidance, and divine
                breakthrough.
              </p>

              <div className="p-4 bg-[#02180e] rounded-xl border border-white/10 max-w-md space-y-2">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-[#c99726]" />
                  <div>
                    <span className="text-xs text-emerald-300/70 uppercase font-mono">
                      Service Schedule
                    </span>
                    <p className="text-base font-bold text-white">
                      Every Wednesday at 7:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2 border-t border-white/10">
                  <MapPin className="w-5 h-5 text-[#c99726]" />
                  <div>
                    <span className="text-xs text-emerald-300/70 uppercase font-mono">
                      Venue
                    </span>
                    <p className="text-sm font-mono text-emerald-200">
                      Wisdom Temple Auditorium & Online
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate("prayer")}
                  className="px-8 py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-2 shadow-sm"
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
                className="group relative rounded-xl overflow-hidden border border-white/20 shadow-xl bg-black cursor-pointer max-w-sm sm:max-w-md w-full"
                title="Click to enlarge Secret Place banner"
              >
                <img
                  src={getBanner(
                    "secret_place_banner",
                    "/secret_place_banner.jpg",
                  )}
                  alt="The Secret Place - Midweek Encounter"
                  className="w-full h-auto object-contain block mx-auto"
                  referrerPolicy="no-referrer"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                  <span className="text-xs font-bold text-[#dfb15b] flex items-center space-x-1.5 bg-[#02180e] px-3.5 py-1.5 rounded-lg border border-white/20 shadow">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to Enlarge Banner</span>
                  </span>
                </div>

                {/* Badge top corner */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-[#02180e]/90 text-[#dfb15b] border border-white/20 rounded-md text-[10px] font-mono font-bold flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-[#dfb15b]" />
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
        <section
          className="py-20 bg-[#02180e] text-white relative border-b border-[#084c2e]"
          id="wisdom-summit"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#042015] rounded-2xl border border-white/15 p-8 sm:p-12 relative shadow-xl">
              {/* Event Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span className="px-3.5 py-1 bg-[#c99726] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-md">
                  ANNUAL FLAGSHIP CONFERENCE
                </span>
                <button
                  onClick={() =>
                    onShare(
                      featuredSummit.name,
                      `${featuredSummit.theme} - Join us for Wisdom Summit 2026 at Wisdom Temple`,
                    )
                  }
                  className="p-2 rounded-lg bg-[#031a10] hover:bg-[#06301f] text-emerald-200 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer border border-white/10"
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
                    className="group relative rounded-xl overflow-hidden border border-white/20 shadow-xl bg-black cursor-pointer w-full"
                    title="Click to enlarge banner"
                  >
                    <img
                      src={getBanner(
                        "wisdom_summit_banner",
                        "/wisdom_summit_banner.png",
                      )}
                      alt="Wisdom Summit 2026"
                      className="w-full h-auto object-cover block"
                      referrerPolicy="no-referrer"
                    />

                    {/* Hover Overlay with Enlarge Cue */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <span className="text-xs font-bold text-[#dfb15b] flex items-center space-x-1.5 bg-[#02180e] px-3.5 py-1.5 rounded-lg border border-white/20 shadow">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Click to Enlarge Official Banner</span>
                      </span>
                    </div>

                    {/* Corner Badge */}
                    <div className="absolute top-3 right-3 bg-[#02180e]/90 px-3 py-1 rounded-md border border-white/20 text-[10px] font-bold text-[#dfb15b] uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-[#dfb15b]" />
                      <span>Wisdom Summit</span>
                    </div>
                  </div>
                </div>

                {/* Countdown & Registration Beside */}
                <div className="lg:col-span-5 xl:col-span-4 bg-[#02180e] rounded-xl border border-white/15 p-6 sm:p-8 text-center space-y-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#dfb15b] block font-bold">
                      CONFERENCE COUNTDOWN
                    </span>
                    <p className="text-xs text-emerald-300/80 mt-1 font-mono">
                      October 7 - 9 & 11, 2026
                    </p>
                  </div>

                  {/* Timer Boxes */}
                  <div className="grid grid-cols-4 gap-2.5 text-center">
                    <div className="bg-[#032416] border border-white/10 rounded-lg p-3">
                      <span className="text-2xl sm:text-3xl font-black text-[#dfb15b] font-mono block">
                        {timeLeft.days}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">
                        Days
                      </span>
                    </div>
                    <div className="bg-[#032416] border border-white/10 rounded-lg p-3">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">
                        Hours
                      </span>
                    </div>
                    <div className="bg-[#032416] border border-white/10 rounded-lg p-3">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">
                        Mins
                      </span>
                    </div>
                    <div className="bg-[#032416] border border-white/10 rounded-lg p-3">
                      <span className="text-2xl sm:text-3xl font-black text-[#dfb15b] font-mono block">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-semibold">
                        Secs
                      </span>
                    </div>
                  </div>

                  {/* Registering Button Beside */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => onRegisterEvent(featuredSummit)}
                      className="w-full py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      REGISTER FOR WISDOM SUMMIT
                    </button>
                    <p className="text-[11px] text-emerald-300/70">
                      Free Entry • Reserved Seating
                    </p>
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
      <section
        className="py-16 sm:py-20 bg-[#f4f7f4] border-b border-[#e0e9e3]"
        id="upcoming-events"
      >
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
              onClick={() => onNavigate("events")}
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
                      src={getBanner("event_" + event.id, event.image)}
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
      <section
        className="py-20 bg-white border-b border-[#e0e9e3]"
        id="about-intro"
      >
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
                As a vibrant charismatic church in Ghana, our heart is to build
                believers who reflect Christ's character, excel in their careers
                and callings, and bring transformative godly leadership to every
                sphere of human endeavor.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("about")}
                  className="px-6 py-3.5 bg-[#032014] hover:bg-[#063821] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md border border-[#c99726]/30"
                >
                  LEARN MORE
                </button>
                <button
                  onClick={() => onNavigate("about", "leadership")}
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
                  <span className="text-xs font-mono text-[#07472c] font-bold uppercase block">
                    Core Scripture
                  </span>
                  <p className="text-xs font-semibold text-[#032014] mt-1">
                    "Wisdom is the principal thing; therefore get wisdom: and
                    with all thy getting get understanding."
                  </p>
                  <span className="text-[10px] text-[#76550f] font-mono block mt-1 font-bold">
                    Proverbs 4:7
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-5 bg-[#032014] text-white rounded-2xl border border-[#084c2e] shadow-xl">
                  <span className="text-[#f5cf72] font-serif-title font-bold text-xl block">
                    Kingdom Heritage
                  </span>
                  <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                    Committed to holistic human development: spiritual,
                    intellectual, and socioeconomic transformation in Africa.
                  </p>
                </div>
                <div
                  onClick={() => onNavigate("about", "leadership")}
                  className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#02180e] relative border-2 border-[#c99726]/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={getBanner("pastoral_couple", PASTORAL_COUPLE_IMAGE)}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/rev_gabriel_and_helena_dela.jpg";
                    }}
                    alt="Rev. Gabriel Dela and Lady Dr. Helena Dela - Shepherd and First Lady of Wisdom Temple"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white bg-black/60 p-2.5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-mono text-[#dfb15b] uppercase tracking-wider block font-bold">
                      SHEPHERD & FIRST LADY
                    </span>
                    <p className="text-xs sm:text-sm font-semibold font-serif leading-tight text-white mt-0.5">
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
      <section
        className="py-20 bg-[#f4f7f4] border-b border-[#e0e9e3]"
        id="ministries-preview"
      >
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
              onClick={() => onNavigate("ministries")}
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
                      src={getBanner("ministry_" + ministry.id, ministry.image)}
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
                    onClick={() => onNavigate("ministries", ministry.id)}
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
      <section
        className="py-24 bg-[#02180e] text-white relative border-b border-[#084c2e]"
        id="church-gallery"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <PhotoGallery
            photos={photos}
            title="Moments of Faith & Fellowship"
            subtitle="Explore high-resolution highlights from our recent Sunday celebrations, prophetic prayer altars, youth camps, and annual leadership summits."
            showFilters={true}
            limit={6}
            theme="dark"
            onViewAll={() => onNavigate("gallery")}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. PRAYER REQUEST SECTION - ICGC Forest & Gold Altar */}
      {/* ========================================================================= */}
      <section
        className="py-20 bg-[#02180e] text-white relative border-b border-[#084c2e]"
        id="prayer-request"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#dfb15b]">
              PASTORAL CARE & INTERCESSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-white font-serif">
              HOW CAN WE{" "}
              <span className="font-normal text-[#dfb15b]">PRAY FOR YOU?</span>
            </h2>
            <p className="text-base sm:text-lg text-emerald-200/80 max-w-xl mx-auto leading-relaxed">
              Whatever you're facing, you don't have to face it alone. Share
              your prayer request with us.
            </p>
          </div>

          <div className="bg-[#032416] rounded-2xl border border-white/10 p-6 sm:p-10 shadow-xl">
            {prayerSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#dfb15b] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">
                  Prayer Request Received
                </h3>
                <p className="text-sm text-emerald-200/80 max-w-md mx-auto leading-relaxed">
                  Our pastoral intercessors and prayer team have received your
                  request. We will bring it before God at our prayer altars.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setPrayerSubmitted(false)}
                    className="px-6 py-2.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
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
                    <span>
                      I would like someone from the church to contact me.
                    </span>
                  </label>

                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-300/70">
                    <Lock className="w-3.5 h-3.5 text-[#c99726] shrink-0" />
                    <span>
                      Your request is kept strictly confidential among pastoral
                      intercessors.
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
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
      <section
        className="py-20 bg-[#f4f7f4] border-b border-[#e0e9e3]"
        id="testimonies"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#07472c] uppercase">
                TESTIMONIALS
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-[0.98] text-[#032014] mt-3 font-serif-title">
                How lives are transformed through love, and faith.
              </h2>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonies.map((item) => (
              <div
                key={item.id}
                className="min-w-[min(86vw,330px)] sm:min-w-[350px] snap-start bg-white rounded-[22px] p-6 sm:p-7 border border-[#d6e5dc] shadow-sm flex flex-col justify-between min-h-[280px]"
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
                    <span className="font-mono text-[#032014] font-bold block">
                      {item.personName}
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      {item.date}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#eef6f1] text-[#07472c] rounded font-mono text-[10px] border border-[#c2decc]">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowTestimonyModal(true)}
            className="mt-8 inline-flex items-center space-x-2 text-[#07472c] hover:text-[#b8861d] font-bold text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer"
          >
            <span>Share your testimony</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. GIVING TEASER ON HOMEPAGE - Official ICGC Forest & Gold */}
      {/* ========================================================================= */}
      <section
        className="py-16 bg-[#032014] text-white border-t border-white/10"
        id="giving-teaser"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 bg-[#c99726]/20 border border-[#c99726]/40 rounded-full flex items-center justify-center mx-auto text-[#dfb15b]">
            <Heart className="w-6 h-6 fill-[#c99726] text-[#c99726]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-white font-serif">
            WORSHIP THROUGH{" "}
            <span className="font-normal text-[#dfb15b]">GIVING</span>
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Your generosity helps support the work of the ministry and enables
            us to serve people, maintain our sanctuary, and advance the Gospel
            in Ghana.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate("give")}
              className="px-8 py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center space-x-2"
            >
              <span>GIVE FIRST FRUIT & OFFERINGS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Share Testimony Modal */}
      {showTestimonyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#032416] border border-[#094c2d] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#084c2e] pb-3">
              <h3 className="font-bold text-white text-base font-serif-title">
                Share Your Testimony
              </h3>
              <button
                onClick={() => setShowTestimonyModal(false)}
                className="text-emerald-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {testimonySuccess ? (
              <div className="py-8 text-center text-emerald-300 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-[#f5cf72]" />
                <p className="text-sm font-bold text-white">
                  Thank you for sharing what God has done!
                </p>
                <p className="text-xs text-emerald-300/70">
                  Your praise report has been submitted to the pastoral team.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleTestimonySubmit}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">
                    Your Name *
                  </label>
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
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">
                    Testimony Title *
                  </label>
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
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">
                    Your Praise Report *
                  </label>
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
                    className="w-full py-3 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
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
            className="relative max-w-4xl w-full bg-[#02180e] rounded-2xl border border-white/20 p-4 sm:p-6 shadow-2xl overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#c99726]" />
                <span className="font-bold text-sm tracking-wide text-[#dfb15b]">
                  WISDOM SUMMIT 2026 — OFFICIAL BANNER
                </span>
              </div>
              <button
                onClick={() => setFlyerModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
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
                className="w-full sm:w-auto px-6 py-2.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
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
            className="relative max-w-2xl w-full bg-[#02180e] rounded-2xl border border-white/20 p-4 sm:p-6 shadow-2xl overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-[#dfb15b]" />
                <span className="font-bold text-sm tracking-wide text-[#dfb15b]">
                  THE SECRET PLACE — OFFICIAL BANNER
                </span>
              </div>
              <button
                onClick={() => setSecretPlaceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
              <img
                src={getBanner(
                  "secret_place_banner",
                  "/secret_place_banner.jpg",
                )}
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
                  onNavigate("prayer");
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                SUBMIT PRAYER REQUEST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Actions Menu for immediate one-click navigation */}
      <QuickActionsMenu onNavigate={onNavigate} />
    </div>
  );
};
