import React, { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
import { ChurchPhoto } from "../types";
import {
  galleryThumbnailUrl,
  optimizedImageUrl,
} from "../utils/optimizedImage";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Share2,
  Check,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  ArrowRight,
} from "lucide-react";
import { reveal } from "../utils/motion";

interface PhotoGalleryProps {
  photos: ChurchPhoto[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
  onViewAll?: () => void;
  className?: string;
  theme?: "dark" | "light";
  layout?: "cards" | "editorial";
  /** Omit the built-in eyebrow/title/subtitle block. */
  hideHeader?: boolean;
  /** Editorial tiles without title and category labels (e.g. album photos). */
  plainTiles?: boolean;
}

const CATEGORIES = [
  "All",
  "Worship & Prayer",
  "Conferences & Summits",
  "Fellowship & Community",
  "Youth & Kids",
  "Special Services",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  title = "MOMENTS OF FAITH & FELLOWSHIP",
  subtitle = "A visual testament of God's moving presence, spirit-filled worship, vibrant youth, and community transformation at Wisdom Temple.",
  showFilters = true,
  limit,
  onViewAll,
  className = "",
  theme = "dark",
  layout = "cards",
  hideHeader = false,
  plainTiles = false,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory =
      selectedCategory === "All" || photo.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.location &&
        photo.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const displayPhotos = limit ? filteredPhotos.slice(0, limit) : filteredPhotos;

  // Active photo in lightbox
  const currentPhoto =
    activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  // Lightbox Navigation Handlers
  const handleNext = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev !== null ? (prev + 1) % filteredPhotos.length : 0,
    );
  }, [activePhotoIndex, filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        : 0,
    );
  }, [activePhotoIndex, filteredPhotos.length]);

  const handleClose = useCallback(() => {
    setActivePhotoIndex(null);
    setIsFullscreen(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, handleNext, handlePrev, handleClose]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activePhotoIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePhotoIndex]);

  const handleShare = (photo: ChurchPhoto) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${photo.title} | ICGC Wisdom Temple`,
          text: photo.caption,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`space-y-8 sm:space-y-10 ${className}`}>
      {/* Section Header */}
      {!hideHeader && (
        <div className="max-w-3xl space-y-3">
          <m.p
            {...reveal()}
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark ? "text-gold-300" : "text-gold-700"
            }`}
          >
            Photo gallery
          </m.p>
          <m.h2
            {...reveal()}
            className={`font-display text-3xl sm:text-4xl lg:text-5xl ${
              isDark ? "text-white" : "text-forest-950"
            }`}
          >
            {title}
          </m.h2>

          {subtitle && (
            <m.p
              {...reveal()}
              className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                isDark ? "text-emerald-100/80" : "text-slate-600"
              }`}
            >
              {subtitle}
            </m.p>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      {showFilters && (
        <m.div
          {...reveal()}
          className="flex flex-col gap-4 border-y border-mist-300 py-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="grid w-full gap-3 sm:w-auto sm:flex-1 sm:grid-cols-2 lg:max-w-2xl">
            <div>
              <label htmlFor="gallery-category" className={`mb-1.5 block text-xs font-semibold ${isDark ? "text-emerald-100" : "text-slate-600"}`}>
                Browse by category
              </label>
              <select
                id="gallery-category"
                name="gallery-category"
                value={selectedCategory}
                onChange={(event) => {
                  const category = CATEGORIES.find((item) => item === event.target.value);
                  if (category) setSelectedCategory(category);
                }}
                className={`min-h-11 w-full rounded-xl border px-3 text-sm ${
                  isDark
                    ? "border-forest-700 bg-forest-950 text-white"
                    : "border-mist-300 bg-white text-forest-950"
                }`}
              >
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === "All"
                      ? photos.length
                      : photos.filter((photo) => photo.category === cat).length;
                  return (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All photos" : cat} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="relative w-full shrink-0 self-end">
              <label htmlFor="gallery-search" className={`mb-1.5 block text-xs font-semibold ${isDark ? "text-emerald-100" : "text-slate-600"}`}>
                Search the gallery
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-[2.85rem] h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input
                id="gallery-search"
                name="gallery-search"
                autoComplete="off"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search events or moments…"
                className={`min-h-11 w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm ${
                  isDark
                    ? "border-forest-700 bg-forest-950 text-white placeholder:text-emerald-200/50"
                    : "border-mist-300 bg-white text-forest-950 placeholder:text-slate-500"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear photo search"
                  className="absolute right-2 top-[2.85rem] -translate-y-1/2 rounded-full p-2 text-slate-500 transition-colors hover:text-forest-950"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </m.div>
      )}

      {/* Grid of Church Moments */}
      {displayPhotos.length === 0 ? (
        <div className="max-w-xl mx-auto rounded-3xl border border-mist-300 bg-white p-8 py-16 text-center text-forest-950">
          <Filter className="mx-auto mb-3 h-10 w-10 text-gold-600" aria-hidden="true" />
          <h3 className="font-display text-xl">
            No photos found
          </h3>
          <p className="mt-1 max-w-sm mx-auto text-sm text-slate-600">
            No church memories match "{searchQuery}" under the selected
            category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-5 min-h-11 rounded-full bg-forest-950 px-5 text-sm font-bold text-white transition-colors hover:bg-forest-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
          className={
            layout === "editorial"
              ? "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
              : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {displayPhotos.map((photo, index) => (
            <m.button
              key={photo.id}
              {...reveal(Math.min(index, 6) * 0.05)}
              whileHover={{ y: -2 }}
              type="button"
              aria-label={`View ${photo.title}`}
              className={
                layout === "editorial"
                  ? "group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-mist-300 bg-white text-left shadow-sm transition-[border-color,box-shadow,transform] hover:border-gold-500/50 hover:shadow-lg"
                  : "group relative rounded-3xl overflow-hidden bg-forest-900 border border-gold-500/30 hover:border-gold-500 transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-500 shadow-xl hover:shadow-2xl hover:shadow-gold-500/20 flex flex-col justify-between cursor-pointer"
              }
              onClick={() => setActivePhotoIndex(filteredPhotos.findIndex((p) => p.id === photo.id))}
            >
              <div
                className={
                  layout === "editorial"
                    ? "relative aspect-[16/10] w-full overflow-hidden bg-mist-200"
                    : "relative w-full aspect-[16/11] overflow-hidden bg-black/40"
                }
              >
                <img
                  src={photo.thumbnailUrl ?? optimizedImageUrl(photo.imageUrl)}
                  alt={photo.title}
                  width={1200}
                  height={825}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("hero_icgc_banner")) {
                      target.src = "/assets/optimized/hero_icgc_banner.webp";
                    }
                  }}
                  referrerPolicy="no-referrer"
                />

                {!plainTiles && (
                  <span className="pointer-events-none absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-forest-950/75 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </div>

              {layout === "editorial" && !plainTiles && (
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <p className="truncate text-[9px] font-semibold uppercase tracking-[0.11em] text-gold-700 sm:text-[10px]">
                    {photo.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-display text-sm leading-snug text-forest-950 sm:text-base">
                    {photo.title}
                  </h3>
                  <p className="mt-2 hidden line-clamp-2 text-xs leading-relaxed text-slate-600 sm:block">
                    {photo.caption}
                  </p>
                  <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-3 text-[10px] text-slate-500 sm:text-xs">
                    <span className="truncate">{photo.event}</span>
                    <span className="shrink-0">{photo.date}</span>
                  </div>
                </div>
              )}

              {layout === "cards" && (
                <div className="h-[1px] w-full bg-white/10" />
              )}

              {/* Lower Details Card */}
              <div
                className={
                  layout === "editorial"
                    ? "hidden"
                    : "p-5 sm:p-6 bg-forest-900 flex-1 flex flex-col justify-between space-y-3"
                }
              >
                {/* Event and Date Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-gold-300 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    <span>{photo.date}</span>
                    <span className="text-gold-500/50">•</span>
                    <span className="text-emerald-200/90 truncate font-medium">
                      {photo.event}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif-title text-white group-hover:text-gold-200 transition-colors leading-snug tracking-tight">
                    {photo.title}
                  </h3>

                  {/* Caption snippet */}
                  <p className="text-xs sm:text-sm text-emerald-100/75 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                {/* Footer Metadata & Action */}
                <div className="pt-3 border-t border-forest-700/70 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-300/80 truncate max-w-[65%]">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span className="text-[11px] truncate">
                      {photo.location || "Wisdom Temple, Tabora"}
                    </span>
                  </div>

                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-gold-300 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>View Moment</span>
                    <ChevronRight className="w-4 h-4 text-gold-500" />
                  </span>
                </div>
              </div>
            </m.button>
          ))}
        </div>
      )}

      {/* View All Button when limited */}
      {limit && filteredPhotos.length > limit && onViewAll && (
        <div className="text-center pt-4">
          <button
            onClick={onViewAll}
            className="px-8 py-3.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer inline-flex items-center space-x-2"
          >
            <span>EXPLORE ALL CHURCH MOMENTS ({photos.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {currentPhoto && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${currentPhoto.title}`}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            {/* Lightbox Header Bar */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-black/90 border-b border-white/10 text-white">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-forest-700 text-gold-300 text-xs font-bold tracking-wider uppercase border border-gold-500/40">
                  {currentPhoto.category}
                </span>
                <span className="text-xs text-white/70 hidden sm:inline-block">
                  Photo {activePhotoIndex !== null ? activePhotoIndex + 1 : 1}{" "}
                  of {filteredPhotos.length}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => handleShare(currentPhoto)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-[background-color,border-color,color,box-shadow,opacity,transform] flex items-center space-x-1.5 cursor-pointer"
                  title="Share Photo"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline text-emerald-400">
                        Link Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-gold-300" />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-[background-color,border-color,color,box-shadow,opacity,transform] cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-gold-300" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gold-300" />
                  )}
                </button>

                <button
                  onClick={handleClose}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold border border-red-500/50 transition-[background-color,border-color,color,box-shadow,opacity,transform] flex items-center space-x-1 cursor-pointer"
                  title="Close Lightbox (Esc)"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>

            {/* Lightbox Main Stage */}
            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0 overflow-hidden">
              {/* Previous Arrow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/70 hover:bg-forest-700 text-white border border-white/20 hover:border-gold-500 transition-[background-color,border-color,color,box-shadow,opacity,transform] cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Previous Photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Main Photo Display with Motion */}
              <m.div
                key={currentPhoto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-5xl max-h-[72vh] flex items-center justify-center"
              >
                <img
                  src={optimizedImageUrl(currentPhoto.imageUrl)}
                  alt={currentPhoto.title}
                  width={1200}
                  height={825}
                  className="max-h-[70vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl border border-white/15"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </m.div>

              {/* Next Arrow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/70 hover:bg-forest-700 text-white border border-white/20 hover:border-gold-500 transition-[background-color,border-color,color,box-shadow,opacity,transform] cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Next Photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Lightbox Footer Details & Thumbnail Navigator */}
            <div className="relative z-20 px-4 sm:px-8 py-5 bg-black/95 border-t border-white/10 text-white space-y-3">
              {/* Photo Title & Metadata */}
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-gold-300 font-semibold">
                    <span>{currentPhoto.event}</span>
                    <span className="text-white/40">•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{currentPhoto.date}</span>
                    </span>
                    {currentPhoto.location && (
                      <>
                        <span className="text-white/40">•</span>
                        <span className="flex items-center space-x-1 text-emerald-300">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{currentPhoto.location}</span>
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif-title text-white">
                    {currentPhoto.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {currentPhoto.caption}
                  </p>
                </div>
              </div>

              {/* Thumbnail Strip for Rapid Navigation */}
              <div className="max-w-4xl mx-auto pt-2 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {filteredPhotos.map((thumb, idx) => (
                  <button
                    key={thumb.id}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-14 h-12 rounded-lg overflow-hidden shrink-0 transition-[background-color,border-color,color,box-shadow,opacity,transform] cursor-pointer ${
                      idx === activePhotoIndex
                        ? "ring-2 ring-gold-500 scale-105 opacity-100"
                        : "opacity-50 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={
                        thumb.thumbnailUrl ??
                        galleryThumbnailUrl(thumb.imageUrl)
                      }
                      alt={thumb.title}
                      width={120}
                      height={100}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
