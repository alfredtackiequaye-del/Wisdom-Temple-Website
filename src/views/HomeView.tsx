import React, { useState, useEffect, useRef } from "react";
import { m, AnimatePresence, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  PageId,
  Sermon,
  ChurchEvent,
  Testimony,
} from "../types";
import { PastorsCorner } from "../components/PastorsCorner";
import { useBanners } from "../utils/bannerManager";
import { optimizedImageUrl } from "../utils/optimizedImage";
import { useSiteContent } from "../utils/contentManager";
import { EASE_OUT, reveal, staggerContainer, staggerItem, LIFT_SPRING } from "../utils/motion";
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
  ChevronRight,
  CheckCircle2,
  Quote,
  Share2,
  Youtube,
  ExternalLink,
  ZoomIn,
  X,
} from "lucide-react";
import { PosterImage } from "../components/PosterImage";

interface HomeViewProps {
  onNavigate: (page: PageId, subTab?: string) => void;
  sermons: Sermon[];
  events: ChurchEvent[];
  testimonies: Testimony[];
  onPlayAudio: (sermon: Sermon) => void;
  onWatchVideo: (sermon: Sermon) => void;
  onRegisterEvent: (event: ChurchEvent) => void;
  onShare: (title: string, desc: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  sermons,
  events,
  testimonies,
  onPlayAudio,
  onWatchVideo,
  onRegisterEvent,
  onShare,
}) => {
  const { getBanner } = useBanners();
  const { content } = useSiteContent();
  const prefersReducedMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(
    heroScrollProgress,
    [0, 1],
    [0, prefersReducedMotion ? 0 : 110],
  );
  const heroWords = content.heroHeadline.split(" ");
  const heroSrc = getBanner("hero_banner", "/hero_icgc_banner.jpg");

  // Placeholder testimonies (e.g. "[CHURCH MEMBER NAME]") are never shown publicly.
  const publishedTestimonies = testimonies.filter(
    (t) => t.approved && !/^\[.*\]$/.test(t.personName.trim()),
  );

  // Latest message
  const latestSermon = sermons[0];
  const [playLatestInline, setPlayLatestInline] = useState(false);

  // Testimony modal state
  const [showTestimonyModal, setShowTestimonyModal] = useState(false);
  const [testimonyName, setTestimonyName] = useState("");
  const [testimonyTitle, setTestimonyTitle] = useState("");
  const [testimonyContent, setTestimonyContent] = useState("");
  const [testimonySuccess, setTestimonySuccess] = useState(false);

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
      {/* 1. HERO SECTION - Bold, minimal, full-bleed (Legacy Hills Church style) */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="premium-hero relative min-h-[78vh] lg:min-h-[86vh] flex flex-col justify-end overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 lg:pb-28"
        id="hero-section"
      >
        <m.div className="absolute inset-0 z-0 overflow-hidden" style={{ y: heroImageY }}>
          {content.heroVideoUrl ? (
            <video
              className="w-full h-full object-cover object-center"
              src={content.heroVideoUrl}
              poster={getBanner("hero_banner", "/hero_icgc_banner.jpg")}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <m.img
              src={heroSrc}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== "https://i.imgur.com/0ULg34j.png") {
                  target.src = "https://i.imgur.com/0ULg34j.png";
                }
              }}
              srcSet={
                /hero_icgc_banner\.(webp|jpg)$/.test(heroSrc)
                  ? "/assets/optimized/hero_icgc_banner-mobile.webp 900w, /assets/optimized/hero_icgc_banner.webp 2048w"
                  : undefined
              }
              sizes="100vw"
              fetchPriority="high"
              decoding="async"
              alt="Wisdom Temple Official Banner"
              initial={prefersReducedMotion ? { scale: 1 } : { scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: "easeOut" }}
              className="hero-drift w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/55 via-forest-950/45 to-forest-950/95 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/85 via-forest-950/15 to-transparent pointer-events-none" />
        </m.div>

        <div className="hero-content-column relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-left flex flex-col items-start">
          <h1
            aria-label={content.heroHeadline}
            className="max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-[5.8rem] leading-[0.98] tracking-[-0.02em] font-bold text-white font-display text-shadow-hero drop-shadow-[0_5px_18px_rgba(0,0,0,0.5)]"
          >
            <span aria-hidden="true">
              {heroWords.map((word, i) => (
                <m.span
                  key={`${word}-${i}`}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 34 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: prefersReducedMotion ? 0 : 0.15 + i * 0.06,
                    ease: EASE_OUT,
                  }}
                  className="inline-block mr-[0.22em] last:mr-0"
                >
                  {word}
                </m.span>
              ))}
            </span>
          </h1>

          <m.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: "easeOut" }}
            className="mt-7 max-w-xl text-sm sm:text-base text-emerald-50/90 leading-[1.7] font-medium drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)]"
          >
            {content.heroSubtitle}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.68, ease: "easeOut" }}
            className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <span className="inline-flex items-center gap-3 rounded-2xl border border-gold-400/50 bg-forest-950/60 px-4 sm:px-5 py-3 backdrop-blur-md text-white">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300" />
              <span className="flex flex-col leading-tight">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                  {content.sundayServiceDay}
                </span>
                <span className="text-lg sm:text-2xl font-bold">
                  {content.sundayServiceTime}
                </span>
              </span>
            </span>
            <span className="inline-flex items-center gap-3 rounded-2xl border border-gold-400/50 bg-forest-950/60 px-4 sm:px-5 py-3 backdrop-blur-md text-white">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300" />
              <span className="flex flex-col leading-tight">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                  {content.midweekServiceDay}
                </span>
                <span className="text-lg sm:text-2xl font-bold">
                  {content.midweekServiceTime}
                </span>
              </span>
            </span>
          </m.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full mt-9">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.75, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6"
          >
            <button
              onClick={() => onNavigate("new-here")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl cta-shine bg-gold-400 text-forest-950 font-bold text-sm sm:text-base shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-300 cursor-pointer"
            >
              {content.heroButtonPrimary}
            </button>

            <button
              onClick={() => onNavigate("events")}
              className="group w-full sm:w-auto px-2 py-4 text-white font-semibold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2 transition-colors hover:text-gold-300 cursor-pointer"
            >
              <span>{content.heroButtonSecondary}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </m.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MODULAR EXPERIENCE ROW - Inspired by connection-rincon.com */}
      {/* ========================================================================= */}
      <section
        id="experience-row"
        className="cinematic-panel py-16 sm:py-20 border-b border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div {...reveal()} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-semibold text-forest-600 uppercase tracking-[0.22em] bg-mist-100 px-3.5 py-2 rounded-full border border-mist-300 inline-block mb-4">
              {content.experienceSectionBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-900 font-display tracking-[-0.06em]">
              {content.experienceSectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              {content.experienceSectionSubtitle}
            </p>
          </m.div>

          <m.div
            {...staggerContainer(0.15)}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5"
          >
            {/* Module 1: Visit In-Person */}
            <m.div
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={LIFT_SPRING}
              className="editorial-card premium-card rounded-[4px] p-7 sm:p-8 md:col-span-5 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-forest-950 text-gold-300 flex items-center justify-center shadow-lift">
                  <MapPin className="w-6 h-6 text-gold-400" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-600">
                    {content.sundayServiceDay} @ {content.sundayServiceTime}
                  </span>
                  <h3 className="text-2xl font-bold text-forest-900 font-display tracking-[-0.04em]">
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-forest-800 group-hover:text-gold-600 transition-colors cursor-pointer"
                >
                  <span>Plan your visit</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </m.div>

            {/* Module 2: Watch on Demand */}
            <m.div
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={LIFT_SPRING}
              className="editorial-card premium-card rounded-[4px] p-7 sm:p-8 md:col-span-4 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-forest-950 text-gold-300 flex items-center justify-center shadow-lift">
                  <Play className="w-6 h-6 text-gold-400 fill-gold-400" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-600">
                    TEACHING FOR EVERY SEASON
                  </span>
                  <h3 className="text-2xl font-bold text-forest-900 font-display tracking-[-0.04em]">
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-forest-800 group-hover:text-gold-600 transition-colors cursor-pointer"
                >
                  <span>Explore the message library</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </m.div>

            {/* Module 3: The Secret Place */}
            <m.div
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={LIFT_SPRING}
              className="editorial-card premium-card rounded-[4px] p-7 sm:p-8 md:col-span-3 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-forest-950 text-gold-300 flex items-center justify-center shadow-lift">
                  <Flame className="w-6 h-6 text-gold-400" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-600">
                    {content.midweekServiceDay} @ {content.midweekServiceTime}
                  </span>
                  <h3 className="text-2xl font-bold text-forest-900 font-display tracking-[-0.04em]">
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-forest-800 group-hover:text-gold-600 transition-colors cursor-pointer"
                >
                  <span>Share a prayer request</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LATEST MESSAGE (MEDIA SECTION) - ICGC Deep Forest Theme */}
      {/* ========================================================================= */}
      {latestSermon && (
        <section
          className="ambient-glow py-20 bg-forest-950 text-white border-b border-forest-700"
          id="latest-message"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.div
              {...reveal()}
              className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-forest-700 gap-4"
            >
              <div>
                <span className="text-xs text-gold-300 uppercase tracking-widest block font-bold">
                  BIBLICAL TEACHING FOR EVERY SEASON
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-serif-title">
                  A Message for Your Journey
                </h2>
              </div>
              <button
                onClick={() => onNavigate("watch-listen")}
                className="inline-flex items-center space-x-1 text-sm font-semibold text-gold-300 hover:text-white transition-colors"
              >
                <span>Explore all messages</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </m.div>

            {/* Featured Message Layout */}
            <m.div
              {...reveal(0.1)}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-forest-900 rounded-3xl p-6 sm:p-8 border border-forest-700 shadow-2xl"
            >
              {/* Media Thumbnail Container / Embedded Player */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black border border-forest-700">
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
                        className="w-16 h-16 rounded-full bg-gold-500 hover:bg-gold-400 text-forest-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer mb-2"
                        aria-label="Play Message Video inline"
                      >
                        <Play className="w-7 h-7 ml-1 fill-forest-950" />
                      </button>
                      <span className="text-xs font-medium text-white uppercase tracking-wider bg-black/80 px-3 py-1 rounded-md">
                        Click to Play Video
                      </span>
                    </div>
                    <span className="absolute top-4 left-4 px-3 py-1 bg-forest-950/90 rounded text-xs font-bold text-gold-400">
                      {latestSermon.category}
                    </span>
                    <span className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/80 rounded text-xs text-white">
                      {latestSermon.duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-emerald-300/70">
                      {latestSermon.date}
                    </span>
                    <span className="text-emerald-700">•</span>
                    <span className="text-xs text-gold-400 font-semibold">
                      {latestSermon.series}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug font-serif">
                    {latestSermon.title}
                  </h3>
                  <p className="text-sm text-gold-400 font-medium">
                    {latestSermon.speaker}
                  </p>
                  <p className="text-xs text-emerald-200/80 mt-1">
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
                    className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-forest-950" />
                    <span>
                      {playLatestInline ? "EXPAND PLAYER" : "WATCH MESSAGE"}
                    </span>
                  </button>

                  <button
                    onClick={() => onPlayAudio(latestSermon)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/15 transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-gold-400" />
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
            </m.div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. PASTOR'S CORNER - WEEKLY PASTORAL MESSAGE & GREETING */}
      {/* ========================================================================= */}
      <PastorsCorner onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* 6. UPCOMING EVENTS GRID */}
      {/* ========================================================================= */}
      <section
        className="py-16 sm:py-20 bg-mist-50 border-b border-mist-200"
        id="upcoming-events"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            {...reveal()}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-mist-200 px-3 py-1 rounded-full border border-mist-400">
                GATHER, WORSHIP & GROW
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-2 font-serif-title">
                Gatherings & Events
              </h2>
            </div>
            <button
              onClick={() => onNavigate("events")}
              className="inline-flex items-center space-x-1 text-sm font-semibold text-forest-700 hover:text-forest-500 transition-colors"
            >
              <span>Explore all gatherings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </m.div>

          <m.div
            {...staggerContainer(0.12)}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {events.slice(0, 3).map((event) => (
              <m.div
                key={event.id}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={LIFT_SPRING}
                className="bg-white rounded-2xl border border-mist-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-forest-900">
                    <PosterImage
                      src={getBanner("event_" + event.id, event.image)}
                      alt={event.name}
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-forest-950/90 text-gold-300 rounded text-xs font-bold backdrop-blur-md border border-gold-500/30">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs text-forest-700 font-bold flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-gold-500" />
                      <span>{event.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1 font-serif-title">
                      {event.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {event.shortDescription}
                    </p>

                    <div className="text-xs text-slate-500 space-y-1 pt-2">
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
                    className="w-full py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-gold-500/30"
                  >
                    Event details & registration
                  </button>
                </div>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCRIPTURE BAND - a pause between sections */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden py-24 sm:py-32 text-white text-center">
        <img
          src="/assets/photos/wisdom-summit-team-lineup.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-forest-950/85" />
        <m.div {...reveal()} className="max-w-3xl mx-auto px-6 space-y-5">
          <Quote className="w-9 h-9 text-gold-400 mx-auto" aria-hidden="true" />
          <p className="font-display text-2xl sm:text-4xl leading-snug">
            Happy is the one who finds wisdom, and the one who gets understanding.
          </p>
          <span className="block text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Proverbs 3:13
          </span>
        </m.div>
      </section>

      {/* ========================================================================= */}
      {/* 10. TESTIMONIES SECTION */}
      {/* ========================================================================= */}
      {publishedTestimonies.length > 0 && (
        <section
          className="py-20 bg-mist-50 border-b border-mist-200"
          id="testimonies"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.div {...reveal()} className="mb-10 max-w-2xl">
              <div>
                <span className="text-[10px] font-bold tracking-[0.22em] text-forest-700 uppercase">
                  STORIES OF FAITH
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-[0.98] text-forest-900 mt-3 font-serif-title">
                  Stories of hope, faith & transformation
                </h2>
              </div>
            </m.div>

            <m.div
              {...staggerContainer(0.08)}
              className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {publishedTestimonies.map((item) => (
                <m.div
                  key={item.id}
                  variants={staggerItem}
                  className="min-w-[min(86vw,330px)] sm:min-w-[350px] snap-start bg-white rounded-[22px] p-6 sm:p-7 border border-mist-300 shadow-sm flex flex-col justify-between min-h-[280px]"
                >
                  <div className="space-y-3">
                    <Quote className="w-8 h-8 text-forest-700/30" />
                    <h3 className="text-base font-bold text-forest-900 font-serif-title">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                      "{item.testimony}"
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-forest-900 font-bold block">
                        {item.personName}
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        {item.date}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-mist-100 text-forest-700 rounded text-[10px] border border-mist-400">
                      {item.category}
                    </span>
                  </div>
                </m.div>
              ))}
            </m.div>

            <button
              onClick={() => setShowTestimonyModal(true)}
              className="mt-8 inline-flex items-center space-x-2 text-forest-700 hover:text-gold-600 font-bold text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer"
            >
              <span>Share your story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Share Testimony Modal */}
      {showTestimonyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-forest-900 border border-forest-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-forest-700 pb-3">
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
                <CheckCircle2 className="w-10 h-10 mx-auto text-gold-300" />
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
                    className="w-full px-3.5 py-2.5 bg-forest-950 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                    className="w-full px-3.5 py-2.5 bg-forest-950 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                    className="w-full px-3.5 py-2.5 bg-forest-950 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    SUBMIT PRAISE REPORT
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


    </div>
  );
};
