import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChurchPhoto } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Calendar, 
  MapPin, 
  Share2, 
  Check, 
  Search,
  Filter,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowRight,
  Eye
} from 'lucide-react';

interface PhotoGalleryProps {
  photos: ChurchPhoto[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
  onViewAll?: () => void;
  className?: string;
  theme?: 'dark' | 'light';
}

const CATEGORIES = [
  'All',
  'Worship & Prayer',
  'Conferences & Summits',
  'Fellowship & Community',
  'Youth & Kids',
  'Special Services',
] as const;

type CategoryFilter = typeof CATEGORIES[number];

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  title = "MOMENTS OF FAITH & FELLOWSHIP",
  subtitle = "A visual testament of God's moving presence, spirit-filled worship, vibrant youth, and community transformation at Wisdom Temple.",
  showFilters = true,
  limit,
  onViewAll,
  className = "",
  theme = 'dark'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    const matchesQuery = 
      !searchQuery.trim() ||
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.location && photo.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const displayPhotos = limit ? filteredPhotos.slice(0, limit) : filteredPhotos;

  // Active photo in lightbox
  const currentPhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  // Lightbox Navigation Handlers
  const handleNext = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => 
      prev !== null ? (prev + 1) % filteredPhotos.length : 0
    );
  }, [activePhotoIndex, filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => 
      prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
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
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, handleNext, handlePrev, handleClose]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activePhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePhotoIndex]);

  const handleShare = (photo: ChurchPhoto) => {
    if (navigator.share) {
      navigator.share({
        title: `${photo.title} | ICGC Wisdom Temple`,
        text: photo.caption,
        url: window.location.href,
      }).catch(() => {});
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

  const isDark = theme === 'dark';

  return (
    <div className={`space-y-10 sm:space-y-12 ${className}`}>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#c99726]/15 border border-[#c99726]/40 text-[#fce49e] text-xs font-mono font-bold uppercase tracking-widest shadow-lg backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f5cf72] animate-pulse" />
          <span>MOMENTS OF FAITH & GLORY</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-black font-serif-title tracking-tight uppercase ${
            isDark ? 'text-white' : 'text-[#032014]'
          }`}
        >
          {title.includes('&') ? (
            <>
              {title.split('&')[0]}
              <span className="text-[#dfb15b]">
                & {title.split('&')[1]}
              </span>
            </>
          ) : (
            title
          )}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${
              isDark ? 'text-emerald-100/80' : 'text-slate-600'
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Filter and Search Bar */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-6xl mx-auto px-4"
        >
          {/* Category Tabs Pill Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none p-1.5 rounded-2xl bg-[#02180e]/90 border border-[#c99726]/30 backdrop-blur-md shadow-xl">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = cat === 'All' 
                ? photos.length 
                : photos.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#c99726] text-[#021a10] shadow-sm font-bold'
                      : 'text-emerald-100/80 hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  <span>{cat === 'All' ? 'All Moments' : cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#021a10]/20 text-[#021a10]' : 'bg-black/30 text-emerald-200'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#c99726] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event, keyword..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl bg-[#02180e]/90 border border-[#c99726]/35 focus:outline-none focus:border-[#c99726] focus:ring-2 focus:ring-[#c99726]/20 shadow-xl text-white placeholder-emerald-200/50 backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Grid of Church Moments - High-end Editorial Showcase */}
      {displayPhotos.length === 0 ? (
        <div className="text-center py-16 bg-[#032014]/80 rounded-3xl border border-[#c99726]/30 max-w-xl mx-auto p-8 shadow-xl backdrop-blur-md text-white">
          <Filter className="w-12 h-12 text-[#c99726]/60 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-serif-title">No Moments Found</h3>
          <p className="text-xs text-emerald-200/70 mt-1 max-w-sm mx-auto">
            No church memories match "{searchQuery}" under the selected category.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-5 px-5 py-2.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer shadow-sm transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto px-4">
          {displayPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl overflow-hidden bg-[#032215] border border-[#c99726]/30 hover:border-[#c99726] transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#c99726]/20 flex flex-col justify-between cursor-pointer"
              onClick={() => {
                const originalIndex = filteredPhotos.findIndex((p) => p.id === photo.id);
                setActivePhotoIndex(originalIndex !== -1 ? originalIndex : 0);
              }}
            >
              {/* Photo Area with 16:11 Aspect Proportion */}
              <div className="relative w-full aspect-[16/11] overflow-hidden bg-black/40">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1200&q=80';
                    }
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Ambient Subtle Overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Floating Category Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#02180e]/90 text-[#f5cf72] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#c99726]/40 backdrop-blur-md shadow-md flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c99726]" />
                    <span>{photo.category}</span>
                  </span>
                </div>

                {/* Quick View / Lightbox Icon */}
                <div className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-[#02180e]/85 backdrop-blur-md border border-[#c99726]/40 text-[#f5cf72] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#c99726] group-hover:text-[#021a10] transition-all duration-300">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Solid Divider Line */}
              <div className="h-[1px] w-full bg-white/10" />

              {/* Lower Details Card */}
              <div className="p-5 sm:p-6 bg-[#032215] flex-1 flex flex-col justify-between space-y-3">
                {/* Event and Date Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-[#f5cf72] font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#c99726]" />
                    <span>{photo.date}</span>
                    <span className="text-[#c99726]/50">•</span>
                    <span className="text-emerald-200/90 truncate font-medium">{photo.event}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif-title text-white group-hover:text-[#fce49e] transition-colors leading-snug tracking-tight">
                    {photo.title}
                  </h3>

                  {/* Caption snippet */}
                  <p className="text-xs sm:text-sm text-emerald-100/75 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                {/* Footer Metadata & Action */}
                <div className="pt-3 border-t border-[#07472c]/70 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-300/80 truncate max-w-[65%]">
                    <MapPin className="w-3.5 h-3.5 text-[#c99726] shrink-0" />
                    <span className="text-[11px] truncate">{photo.location || 'Wisdom Temple, Tabora'}</span>
                  </div>

                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#f5cf72] group-hover:translate-x-1 transition-transform shrink-0">
                    <span>View Moment</span>
                    <ChevronRight className="w-4 h-4 text-[#c99726]" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View All Button when limited */}
      {limit && filteredPhotos.length > limit && onViewAll && (
        <div className="text-center pt-4">
          <button
            onClick={onViewAll}
            className="px-8 py-3.5 rounded-lg bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer inline-flex items-center space-x-2"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            {/* Lightbox Header Bar */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-black/90 border-b border-white/10 text-white">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-[#07472c] text-[#f5cf72] text-xs font-mono font-bold tracking-wider uppercase border border-[#c99726]/40">
                  {currentPhoto.category}
                </span>
                <span className="text-xs text-white/70 font-mono hidden sm:inline-block">
                  Photo {activePhotoIndex !== null ? activePhotoIndex + 1 : 1} of {filteredPhotos.length}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => handleShare(currentPhoto)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all flex items-center space-x-1.5 cursor-pointer"
                  title="Share Photo"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#f5cf72]" />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-[#f5cf72]" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-[#f5cf72]" />
                  )}
                </button>

                <button
                  onClick={handleClose}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold border border-red-500/50 transition-all flex items-center space-x-1 cursor-pointer"
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
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/70 hover:bg-[#07472c] text-white border border-white/20 hover:border-[#c99726] transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Previous Photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Main Photo Display with Motion */}
              <motion.div
                key={currentPhoto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-5xl max-h-[72vh] flex items-center justify-center"
              >
                <img
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.title}
                  className="max-h-[70vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl border border-white/15"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Next Arrow Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/70 hover:bg-[#07472c] text-white border border-white/20 hover:border-[#c99726] transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
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
                  <div className="flex items-center space-x-2 text-xs text-[#f5cf72] font-semibold">
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
                    className={`relative w-14 h-12 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer ${
                      idx === activePhotoIndex
                        ? 'ring-2 ring-[#c99726] scale-105 opacity-100'
                        : 'opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={thumb.imageUrl}
                      alt={thumb.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
