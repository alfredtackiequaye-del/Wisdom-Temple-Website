import React, { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { PhotoGallery } from "../components/PhotoGallery";
import { ChurchPhoto, PageId, PhotoAlbum } from "../types";
import { useBanners } from "../utils/bannerManager";
import {
  albumToGalleryPhotos,
  fetchAlbum,
  formatAlbumDate,
  usePublishedAlbums,
} from "../utils/albums";
import { reveal } from "../utils/motion";
import {
  Camera,
  Church,
  MapPin,
  CalendarDays,
  ArrowLeft,
  Images,
  Share2,
  Check,
} from "lucide-react";

interface GalleryViewProps {
  photos: ChurchPhoto[];
  onNavigate: (page: PageId) => void;
}

const albumIdFromUrl = () =>
  typeof window === "undefined"
    ? null
    : new URLSearchParams(window.location.search).get("album");

const setAlbumInUrl = (albumId: string | null) => {
  try {
    window.history.replaceState(null, "", albumId ? `/?album=${albumId}` : "/");
  } catch {
    // Non-critical: sharing links just won't reflect the open album.
  }
};

export const GalleryView: React.FC<GalleryViewProps> = ({
  photos,
  onNavigate,
}) => {
  const { getBanner } = useBanners();
  const { albums } = usePublishedAlbums();
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(albumIdFromUrl);
  const albumsRef = useRef<HTMLDivElement>(null);

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
      id: "event_atmosphere_of_prayer",
      fallback: "/atmosphere_of_prayer.jpg",
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

  const albumPhotoTotal = (albums || []).reduce((n, a) => n + a.photoCount, 0);

  const openAlbum = (albumId: string | null) => {
    setOpenAlbumId(albumId);
    setAlbumInUrl(albumId);
    albumsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-forest-950 text-white pb-24">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-24 bg-forest-900 text-white overflow-hidden border-b border-gold-500/30">
        {/* Background Ambient Header Image & Glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src={getBanner(
              "page_gallery_hero",
              "/assets/optimized/hero_icgc_banner.webp",
            )}
            alt="Congregation worshipping during a church service"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-forest-700 rounded-full filter blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <button
              onClick={() => onNavigate("home")}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gold-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-700 text-gold-300 border border-gold-500/40 text-xs font-bold uppercase tracking-widest">
              <Church className="w-3.5 h-3.5 text-gold-500" />
              <span>CHURCH SERVICES & SPECIAL EVENTS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif-title tracking-tight text-white">
              Worship in <span className="text-gold-300">Focus</span>
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
                <Camera className="w-4 h-4 text-gold-300" />
                <span>
                  {albums && albums.length > 0
                    ? `${albums.length} ${albums.length === 1 ? "Album" : "Albums"} · ${albumPhotoTotal} Photos`
                    : `${serviceAndEventPhotos.length} Service & Event Photos`}
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span>Star Junction, Tabora - Accra</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <CalendarDays className="w-4 h-4 text-gold-300" />
                <span>Sunday, Midweek & Special Gatherings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Albums */}
      <div
        ref={albumsRef}
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {openAlbumId ? (
          <AlbumDetail albumId={openAlbumId} onBack={() => openAlbum(null)} />
        ) : (
          (albums === null || albums.length > 0) && (
            <AlbumGrid albums={albums} onOpen={openAlbum} />
          )
        )}
      </div>

      {/* Highlights */}
      {!openAlbumId && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <PhotoGallery
            photos={serviceAndEventPhotos}
            title="Church Services & Special Events"
            subtitle="Browse photographs from worship services, prayer gatherings, conferences, youth programs, and special church events. Select any photo to view it in full size."
            showFilters={true}
            layout="editorial"
          />
        </section>
      )}
    </div>
  );
};

const AlbumGrid: React.FC<{
  albums: PhotoAlbum[] | null;
  onOpen: (albumId: string) => void;
}> = ({ albums, onOpen }) => (
  <section className="pt-14 sm:pt-16">
    <m.div {...reveal()} className="max-w-2xl space-y-2 mb-8 sm:mb-10">
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
        Photo Albums
      </span>
      <h2 className="text-3xl sm:text-4xl text-white font-serif-title">
        Programs & Church Life
      </h2>
      <p className="text-sm sm:text-base text-emerald-100/75 leading-relaxed">
        Full photo collections from our services, conferences and special
        programs. Open an album to browse every photo.
      </p>
    </m.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {albums === null
        ? [0, 1, 2].map((i) => (
            <div key={i} className="space-y-4" aria-hidden="true">
              <div className="aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-white/5 animate-pulse" />
              <div className="h-5 w-2/3 rounded bg-white/5 animate-pulse" />
            </div>
          ))
        : albums.map((album, index) => (
            <m.button
              key={album.id}
              {...reveal(Math.min(index, 5) * 0.06)}
              onClick={() => onOpen(album.id)}
              className="group text-left cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest-900 ring-1 ring-white/10 group-hover:ring-gold-500/60 transition-all">
                {album.cover && (
                  <img
                    src={album.cover.thumbUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-950/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
                  <Images className="w-3.5 h-3.5 text-gold-300" />
                  {album.photoCount}{" "}
                  {album.photoCount === 1 ? "photo" : "photos"}
                </span>
              </div>
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  {album.category} · {formatAlbumDate(album.date)}
                </p>
                <h3 className="text-xl text-white font-serif-title group-hover:text-gold-200 transition-colors">
                  {album.title}
                </h3>
                {album.location && (
                  <p className="text-xs text-emerald-100/60 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    {album.location}
                  </p>
                )}
              </div>
            </m.button>
          ))}
    </div>
  </section>
);

const AlbumDetail: React.FC<{ albumId: string; onBack: () => void }> = ({
  albumId,
  onBack,
}) => {
  const [album, setAlbum] = useState<PhotoAlbum | null>(null);
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setAlbum(null);
    setMissing(false);
    fetchAlbum(albumId)
      .then((data) => active && setAlbum(data))
      .catch(() => active && setMissing(true));
    return () => {
      active = false;
    };
  }, [albumId]);

  const share = async () => {
    const url = `${window.location.origin}/?album=${albumId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: album?.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  };

  return (
    <section className="pt-10 sm:pt-12 space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All albums
      </button>

      {missing ? (
        <div className="py-16 text-center space-y-2">
          <h2 className="text-2xl text-white font-serif-title">
            This album isn't available
          </h2>
          <p className="text-sm text-emerald-100/70">
            It may have been moved or unpublished.
          </p>
        </div>
      ) : !album ? (
        <div className="space-y-4" aria-busy="true">
          <div className="h-4 w-48 rounded bg-white/5 animate-pulse" />
          <div className="h-9 w-2/3 rounded bg-white/5 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{album.category}</span>
                <span className="text-white/30">·</span>
                <span>{formatAlbumDate(album.date)}</span>
                {album.location && (
                  <>
                    <span className="text-white/30">·</span>
                    <span>{album.location}</span>
                  </>
                )}
              </p>
              <h2 className="text-3xl sm:text-5xl text-white font-serif-title">
                {album.title}
              </h2>
              {album.description && (
                <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
                  {album.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-100/80">
                <Images className="w-4 h-4 text-gold-300" />
                {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
              </span>
              <button
                onClick={share}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/50 text-gold-300 text-xs font-bold hover:bg-gold-500 hover:text-forest-950 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                {copied ? "Link copied" : "Share album"}
              </button>
            </div>
          </div>

          <PhotoGallery
            photos={albumToGalleryPhotos(album)}
            hideHeader
            showFilters={false}
            plainTiles
            layout="editorial"
          />
        </>
      )}
    </section>
  );
};
