import React from 'react';
import { motion } from 'motion/react';
import { PhotoGallery } from '../components/PhotoGallery';
import { ChurchPhoto, PageId } from '../types';
import { Camera, Sparkles, MapPin, Calendar, Users, ArrowLeft } from 'lucide-react';

interface GalleryViewProps {
  photos: ChurchPhoto[];
  onNavigate: (page: PageId) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ photos, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#fafcfb] pb-24">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-24 bg-[#032014] text-white overflow-hidden border-b border-[#c99726]/30">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c99726] rounded-full filter blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#07472c] rounded-full filter blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[#f5cf72] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#07472c] text-[#f5cf72] border border-[#c99726]/40 text-xs font-mono font-bold uppercase tracking-widest">
              <Camera className="w-3.5 h-3.5 text-[#c99726]" />
              <span>OFFICIAL CHURCH MEDIA ARCHIVE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif-title tracking-tight text-white">
              Moments of <span className="text-[#f5cf72]">Faith</span> & Fellowship
            </h1>

            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed max-w-2xl">
              Witness the glory of God at work at Wisdom Temple. Browse high-resolution highlights from our Sunday celebrations, prophetic midweek altars, youth camps, and transformative annual leadership summits.
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <Sparkles className="w-4 h-4 text-[#f5cf72]" />
                <span>{photos.length} Captured Moments</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <MapPin className="w-4 h-4 text-[#c99726]" />
                <span>Star Junction, Tabora - Accra</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <Users className="w-4 h-4 text-[#f5cf72]" />
                <span>Charismatic Fellowship</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <PhotoGallery
          photos={photos}
          title="Recent Church Events Gallery"
          subtitle="Click on any moment to open the interactive high-resolution lightbox viewer with descriptions, keyboard navigation, and sharing."
          showFilters={true}
        />
      </section>
    </div>
  );
};
