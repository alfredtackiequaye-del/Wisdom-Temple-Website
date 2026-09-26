import React from "react";
import { motion } from "motion/react";
import { PhotoGallery } from "../components/PhotoGallery";
import { ChurchPhoto, PageId } from "../types";
import { useBanners } from "../utils/bannerManager";
import { Camera, Church, MapPin, CalendarDays, ArrowLeft } from "lucide-react";

interface GalleryViewProps {
  photos: ChurchPhoto[];
  onNavigate: (page: PageId) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  photos,
  onNavigate,
}) => {
  const { getBanner } = useBanners();
  const bannerByPhotoId: Record<string, { id: string; fallback: string }> = {
    "photo-1": {
      id: "wisdom_summit_banner",
      fallback: "/wisdom_summit_banner.png",
    },
    "photo-2": {
      id: "secret_place_banner",
      fallback: "/secret_place_banner.jpg",
    },
    "photo-4": { id: "event_youth_summit", fallback: "/youth_ministry.jpg" },
    "photo-5": { id: "ministry_women", fallback: "/womens_fellowship.jpg" },
    "photo-6": {
      id: "ministry_children",
      fallback:
        "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80",
    },
    "photo-11": {
      id: "event_secret_place_night",
      fallback: "/secret_place_banner.jpg",
    },
  };

  const serviceAndEventPhotos = photos
    .filter((photo) => photo.id !== "photo-pastoral-shepherds")
    .map((photo) => {
      const banner = bannerByPhotoId[photo.id];
      return banner
        ? { ...photo, imageUrl: getBanner(banner.id, banner.fallback) }
        : photo;
    });

  return (
    <div className="min-h-screen bg-[#02180e] text-white pb-24">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-24 bg-[#032014] text-white overflow-hidden border-b border-[#c99726]/30">
        {/* Background Ambient Header Image & Glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src={getBanner(
              "page_gallery_hero",
              "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1920&q=80",
            )}
            alt="Congregation worshipping during a church service"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c99726] rounded-full filter blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#07472c] rounded-full filter blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <button
              onClick={() => onNavigate("home")}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#f5cf72] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#07472c] text-[#f5cf72] border border-[#c99726]/40 text-xs font-bold uppercase tracking-widest">
              <Church className="w-3.5 h-3.5 text-[#c99726]" />
              <span>CHURCH SERVICES & SPECIAL EVENTS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif-title tracking-tight text-white">
              Worship in <span className="text-[#f5cf72]">Focus</span>
            </h1>

            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed max-w-2xl">
              A dedicated visual record of life at Wisdom Temple, from Sunday
              celebration services and midweek prayer altars to youth
              gatherings, conferences, and the special events that bring our
              church family together.
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <Camera className="w-4 h-4 text-[#f5cf72]" />
                <span>
                  {serviceAndEventPhotos.length} Service & Event Photos
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <MapPin className="w-4 h-4 text-[#c99726]" />
                <span>Star Junction, Tabora - Accra</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <CalendarDays className="w-4 h-4 text-[#f5cf72]" />
                <span>Sunday, Midweek & Special Gatherings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <PhotoGallery
          photos={serviceAndEventPhotos}
          title="Church Services & Special Events"
          subtitle="Browse photographs from worship services, prayer gatherings, conferences, youth programs, and special church events. Select any photo to view it in full size."
          showFilters={true}
          layout="editorial"
        />
      </section>
    </div>
  );
};
