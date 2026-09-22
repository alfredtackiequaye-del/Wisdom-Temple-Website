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
  Download, 
  Check, 
  Search,
  Filter,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface PhotoGalleryProps {
  photos: ChurchPhoto[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
  onViewAll?: () => void;
  className?: string;
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
  title = "CHURCH LIFE & MOMENTS",
  subtitle = "A glimpse into our vibrant charismatic gatherings, spiritual summits, and community impact across ICGC Wisdom Temple.",
  showFilters = true,
  limit,
  onViewAll,
  className = ""
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

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#eef6f1] text-[#07472c] border border-[#c2decc] text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#c99726]" />
          <span>MOMENTS OF GLORY & IMPACT</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#032014] font-serif-title tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Filter and Search Bar */}
      {showFilters && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-6xl mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#032014] text-[#f5cf72] shadow-md border border-[#c99726]/40 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
                }`}
              >
                {cat === 'All' ? 'All Moments' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photo moments..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c99726] shadow-sm text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid of Church Moments */}
      {displayPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-2xl mx-auto p-8 shadow-sm">
          <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Moments Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your category filter or search keywords.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-[#032014] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-4">
          {displayPhotos.map((photo, index) => {
            const isFeatured = photo.featured && index === 0;
            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative overflow-hidden rounded-2xl bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${
                  isFeatured ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
                onClick={() => {
                  const originalIndex = filteredPhotos.findIndex((p) => p.id === photo.id);
                  setActivePhotoIndex(originalIndex !== -1 ? originalIndex : 0);
                }}
              >
                {/* Photo Aspect Container */}
                <div className={`w-full overflow-hidden ${isFeatured ? 'h-72 sm:h-full min-h-[340px]' : 'h-64'}`}>
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to high quality church photography
                      const target = e.currentTarget;
                      if (!target.src.includes('unsplash.com')) {
                        target.src = 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1200&q=80';
                      }
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Always visible Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-[#032014]/90 backdrop-blur-md text-[#f5cf72] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#c99726]/40 shadow-md">
                    {photo.category}
                  </span>
                </div>

                {/* Permanent gradient scrim for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Floating Zoom Icon on Hover */}
                <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 shadow-lg">
                  <ZoomIn className="w-4 h-4 text-[#f5cf72]" />
                </div>

                {/* Caption / Title info in Scrim */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white flex flex-col justify-end space-y-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center space-x-2 text-[11px] text-[#f5cf72] font-semibold">
                    <Calendar className="w-3 h-3 text-[#c99726]" />
                    <span>{photo.date}</span>
                    {photo.location && (
                      <>
                        <span className="text-white/40">•</span>
                        <span className="truncate">{photo.event}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-serif-title leading-snug tracking-tight text-white drop-shadow-md">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-emerald-100/80 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* View All Button when limited */}
      {limit && filteredPhotos.length > limit && onViewAll && (
        <div className="text-center pt-4">
          <button
            onClick={onViewAll}
            className="px-8 py-3.5 rounded-xl bg-[#032014] hover:bg-[#07472c] text-white font-bold text-xs uppercase tracking-wider border border-[#c99726]/40 shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <span>VIEW ALL CHURCH MOMENTS ({photos.length})</span>
            <ChevronRight className="w-4 h-4 text-[#f5cf72]" />
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
              // Click outside container closes
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            {/* Lightbox Header Bar */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent border-b border-white/10 text-white">
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
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-[#07472c] text-white border border-white/20 hover:border-[#c99726] transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
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
                  className="max-h-[70vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Next Arrow Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-[#07472c] text-white border border-white/20 hover:border-[#c99726] transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Next Photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Lightbox Footer Details & Thumbnail Navigator */}
            <div className="relative z-20 px-4 sm:px-8 py-5 bg-gradient-to-t from-black via-black/95 to-transparent border-t border-white/10 text-white space-y-3">
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
