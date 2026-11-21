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
import { SectionHeader } from "../components/SectionHeader";

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
        className="premium-hero relative min-h-[92vh] flex flex-col justify-end overflow-hidden pt-28 sm:pt-36 pb-12 sm:pb-16"
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
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-forest-950/30 to-forest-950 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/70 via-transparent to-transparent pointer-events-none" />
        </m.div>

        <div className="hero-content-column relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <h1
            aria-label={content.heroHeadline}
            className="max-w-5xl text-[3.4rem] sm:text-7xl lg:text-[7.4rem] leading-[0.92] text-white font-display"
          >
            <span aria-hidden="true">
              {heroWords.map((word, i) => (
                <m.span
                  key={`${word}-${i}`}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 40 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: prefersReducedMotion ? 0 : 0.15 + i * 0.07,
                    ease: EASE_OUT,
                  }}
                  // The word that closes each sentence carries the meaning.
                  className={`inline-block mr-[0.2em] last:mr-0 ${
                    /[.!]$/.test(word) ? "text-gold-400 pr-[0.04em]" : ""
                  }`}
                >
                  {word}
                </m.span>
              ))}
            </span>
          </h1>

          <m.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE_OUT }}
            className="mt-10 sm:mt-14 pt-8 border-t border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end"
          >
            <p className="lg:col-span-4 text-lg text-emerald-50/90 leading-relaxed">
              {content.heroSubtitle}
            </p>

            <dl className="lg:col-span-4 grid grid-cols-2 gap-6">
              {[
                { label: content.sundayServiceDay, time: content.sundayServiceTime },
                { label: content.midweekServiceDay, time: content.midweekServiceTime },
              ].map((service) => (
                <div key={service.label}>
                  <dt className="text-xs uppercase tracking-wider text-gold-300">
                    {service.label}
                  </dt>
                  <dd className="mt-1.5 font-display text-3xl sm:text-4xl text-white">
                    {service.time}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="lg:col-span-4 flex flex-wrap lg:justify-end items-center gap-x-6 gap-y-4">
              <button
                onClick={() => onNavigate("new-here")}
                className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold text-base transition-colors cursor-pointer"
              >
                {content.heroButtonPrimary}
              </button>
              <button
                onClick={() => onNavigate("events")}
                className="arrow-link text-white hover:text-gold-300 transition-colors cursor-pointer"
              >
                {content.heroButtonSecondary}
              </button>
            </div>
          </m.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MODULAR EXPERIENCE ROW - Inspired by connection-rincon.com */}
      {/* ========================================================================= */}
      <section id="experience-row" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={content.experienceSectionBadge}
            title={content.experienceSectionTitle}
            subtitle={content.experienceSectionSubtitle}
          />

          <m.ol
            {...staggerContainer(0.12)}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              {
                icon: MapPin,
                label: `${content.sundayServiceDay} · ${content.sundayServiceTime}`,
                title: content.experienceMod1Title,
                text: content.experienceMod1Desc,
                cta: "Plan your visit",
                go: () => onNavigate("new-here"),
              },
              {
                icon: Play,
                label: "Teaching for every season",
                title: content.experienceMod2Title,
                text: content.experienceMod2Desc,
                cta: "Watch messages",
                go: () => onNavigate("watch-listen"),
              },
              {
                icon: Flame,
                label: `${content.midweekServiceDay} · ${content.midweekServiceTime}`,
                title: content.experienceMod3Title,
                text: content.experienceMod3Desc,
                cta: "Request prayer",
                go: () => onNavigate("prayer"),
              },
            ].map((card, i) => (
              <m.li
                key={card.title}
                variants={staggerItem}
                className="group relative flex flex-col bg-mist-50 p-8 sm:p-10 transition-colors hover:bg-white"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl text-forest-950/15 group-hover:text-gold-500 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <card.icon className="w-6 h-6 text-forest-950" aria-hidden="true" />
                </div>
                <p className="mt-10 text-xs uppercase tracking-wider text-gold-700">
                  {card.label}
                </p>
                <h3 className="mt-2 font-display text-3xl text-forest-950">
                  {card.title}
                </h3>
                <p className="mt-4 text-base text-slate-600 leading-relaxed flex-1">
                  {card.text}
                </p>
                <button
                  onClick={card.go}
                  className="arrow-link mt-8 self-start text-forest-950 group-hover:text-gold-700 transition-colors cursor-pointer"
                >
                  {card.cta}
                </button>
              </m.li>
            ))}
          </m.ol>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LATEST MESSAGE (MEDIA SECTION) - ICGC Deep Forest Theme */}
      {/* ========================================================================= */}
      {latestSermon && (
        <section
          className="py-20 sm:py-28 bg-forest-950 text-white"
          id="latest-message"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              tone="dark"
              eyebrow="Latest message"
              title="A Message for Your Journey"
              action={{ label: "All messages", onClick: () => onNavigate("watch-listen") }}
            />

            {/* Featured Message Layout */}
            <m.div
              {...reveal(0.1)}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
            >
              {/* Media Thumbnail Container / Embedded Player */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-video bg-black">
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
                  <h3 className="text-2xl sm:text-3xl text-white leading-snug font-display">
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
      <section className="py-20 sm:py-28" id="upcoming-events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Gather, worship & grow"
            title="Upcoming Events"
            action={{ label: "All events", onClick: () => onNavigate("events") }}
          />

          <m.ul {...staggerContainer(0.1)} className="divide-y divide-forest-950/15 border-b border-forest-950/15">
            {events.slice(0, 3).map((event) => (
              <m.li
                key={event.id}
                variants={staggerItem}
                className="group grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-8 items-center py-7 first:pt-0"
              >
                <div className="sm:col-span-3 relative aspect-[16/10] overflow-hidden rounded-2xl bg-forest-900">
                  <PosterImage
                    src={getBanner("event_" + event.id, event.image)}
                    alt={event.name}
                  />
                </div>
                <div className="sm:col-span-6">
                  <p className="text-xs uppercase tracking-wider text-gold-700">
                    {event.category} · {event.date}
                  </p>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl text-forest-950">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-base text-slate-600 line-clamp-2">
                    {event.shortDescription}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{event.venue}</span>
                  </p>
                </div>
                <div className="sm:col-span-3 sm:text-right">
                  <button
                    onClick={() => onRegisterEvent(event)}
                    className="px-6 py-3 bg-forest-950 hover:bg-forest-800 text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Event details
                  </button>
                </div>
              </m.li>
            ))}
          </m.ul>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCRIPTURE BAND - a pause between sections */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-forest-950 py-28 sm:py-40 text-white">
        <img
          src="/assets/photos/wisdom-summit-team-lineup.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 w-full h-full object-cover object-center opacity-25 grayscale"
        />
        <m.figure {...reveal()} className="max-w-5xl mx-auto px-6 text-center">
          <blockquote className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-[-0.01em]">
            “Happy is the one who finds <span className="italic text-gold-400">wisdom</span>, and the one who gets understanding.”
          </blockquote>
          <figcaption className="mt-8 text-sm uppercase tracking-wider text-gold-300">
            Proverbs 3:13
          </figcaption>
        </m.figure>
      </section>

      {/* ========================================================================= */}
      {/* 10. TESTIMONIES SECTION */}
      {/* ========================================================================= */}
      {publishedTestimonies.length > 0 && (
        <section
          className="py-20 sm:py-28 bg-mist-100"
          id="testimonies"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Stories of faith"
              title="Stories of hope, faith & transformation"
              action={{ label: "Share your story", onClick: () => setShowTestimonyModal(true) }}
            />

            <m.div
              {...staggerContainer(0.08)}
              className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {publishedTestimonies.map((item) => (
                <m.div
                  key={item.id}
                  variants={staggerItem}
                  className="min-w-[min(86vw,330px)] sm:min-w-[360px] snap-start bg-mist-50 p-8 flex flex-col justify-between min-h-[300px]"
                >
                  <div className="space-y-4">
                    <Quote className="w-7 h-7 text-gold-500" aria-hidden="true" />
                    <h3 className="font-display text-2xl text-forest-950">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      “{item.testimony}”
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-forest-950/10 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-forest-950 font-semibold block">
                        {item.personName}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {item.date}
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-gold-700">
                      {item.category}
                    </span>
                  </div>
                </m.div>
              ))}
            </m.div>
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
