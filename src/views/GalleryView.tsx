import React, { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { PhotoGallery } from "../components/PhotoGallery";
import { PhotoAlbum } from "../types";
import { INITIAL_CHURCH_PHOTOS } from "../data/churchData";
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
  ArrowLeft,
  Images,
  Share2,
  Check,
  ArrowRight,
} from "lucide-react";

const albumIdFromUrl = () =>
  typeof window === "undefined"
    ? null
    : new URLSearchParams(window.location.search).get("album");

const setAlbumInUrl = (albumId: string | null) => {
  try {
    window.history.replaceState(null, "", albumId ? `/gallery?album=${albumId}` : "/gallery");
  } catch {
    // Non-critical: sharing links just won't reflect the open album.
  }
};

export const GalleryView: React.FC = () => {
  const { getBanner } = useBanners();
  const { albums, error: albumsError } = usePublishedAlbums();
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(albumIdFromUrl);
  const albumsRef = useRef<HTMLDivElement>(null);

  const albumPhotoTotal = (albums || []).reduce((n, a) => n + a.photoCount, 0);
  const albumSummary =
    albums === null
      ? "Loading program albums…"
      : albumsError
        ? "Program albums could not be loaded"
        : albums.length === 0
          ? "New program albums are coming soon"
          : `${albums.length} ${albums.length === 1 ? "program album" : "program albums"} · ${albumPhotoTotal} photos`;

  const openAlbum = (albumId: string | null) => {
    setOpenAlbumId(albumId);
    setAlbumInUrl(albumId);
    albumsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-mist-50 text-forest-950 pb-20">
      <section className="relative isolate overflow-hidden bg-forest-950 text-white">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <img
            src={getBanner(
              "page_gallery_hero",
              "/assets/optimized/hero_icgc_banner.webp",
            )}
            alt=""
            width={1920}
            height={1080}
            decoding="async"
            className="hero-drift w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/90 to-forest-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-forest-950/25" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 pb-14 sm:pt-40 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Life at ICGC Wisdom Temple
            </p>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.98] text-white">
              Church life, <span className="font-serif font-normal italic text-gold-400">captured.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-emerald-100/80">
              Browse photo albums from our worship services, conferences and
              church programs. Each collection brings the moments of a program
              together in one place.
            </p>
            <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-5 text-sm text-emerald-100/75">
              <Camera className="h-4 w-4 text-gold-300" aria-hidden="true" />
              <span>{albumSummary}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Albums */}
      <div
        ref={albumsRef}
        className="scroll-mt-24 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
      >
        {openAlbumId ? (
          <AlbumDetail albumId={openAlbumId} onBack={() => openAlbum(null)} />
        ) : (
          <AlbumGrid albums={albums} error={albumsError} onOpen={openAlbum} />
        )}
      </div>
    </div>
  );
};

const AlbumGrid: React.FC<{
  albums: PhotoAlbum[] | null;
  error: boolean;
  onOpen: (albumId: string) => void;
}> = ({ albums, error, onOpen }) => (
  <section className="pb-20 pt-12 sm:pt-16">
    <m.div {...reveal()} className="mb-7 flex flex-col gap-3 border-b border-mist-300 pb-6 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">Program collections</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl text-forest-950">Photo albums</h2>
      </div>
      <p className="max-w-lg text-sm leading-relaxed text-slate-600">
        Select an album to explore all the photos from that service or program.
      </p>
    </m.div>

    {error || albums?.length === 0 ? (
      <>
        <div
          role={error ? "alert" : "status"}
          className="rounded-2xl border border-mist-300 bg-white px-6 py-8 text-center"
        >
          <Images className="mx-auto h-9 w-9 text-gold-700" aria-hidden="true" />
          <h3 className="mt-4 font-display text-xl text-forest-950">
            {error ? "Program albums are temporarily unavailable" : "Program albums are on the way"}
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
            {error
              ? "You can still browse these featured church photos while we restore the album service."
              : "New program albums will appear here when published. Browse these featured church photos in the meantime."}
          </p>
        </div>
        <div className="mt-12">
          <PhotoGallery
            photos={INITIAL_CHURCH_PHOTOS}
            title="Featured Church Photos"
            subtitle="Selected moments of worship, fellowship, and church life at Wisdom Temple."
          />
        </div>
      </>
    ) : (
      <div className={albums?.length === 1 ? "grid grid-cols-1" : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
      {albums === null
        ? [0, 1, 2].map((i) => (
            <div key={i} className="space-y-4" aria-hidden="true">
              <div className="aspect-[4/3] rounded-2xl bg-mist-200 animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-mist-200 animate-pulse" />
              <div className="h-5 w-2/3 rounded bg-mist-200 animate-pulse" />
            </div>
          ))
        : albums.map((album, index) => (
            <m.button
              key={album.id}
              {...reveal(Math.min(index, 5) * 0.06)}
              onClick={() => onOpen(album.id)}
              className={`group grid w-full overflow-hidden rounded-3xl border border-mist-300 bg-white text-left shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg ${
                albums.length === 1 ? "md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              <div className={`relative overflow-hidden bg-forest-900 ${
                albums.length === 1 ? "aspect-[16/9] md:aspect-auto md:min-h-72" : "aspect-[4/3]"
              }`}>
                {album.cover && (
                  <img
                    src={album.cover.thumbUrl}
                    alt=""
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-forest-950/85 px-3 py-1.5 text-xs font-semibold text-white">
                  <Images className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
                </span>
              </div>
              <div className={`flex flex-col justify-center p-5 sm:p-7 ${albums.length === 1 ? "sm:p-9" : ""}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-700">
                  {album.category} <span aria-hidden="true">·</span> {formatAlbumDate(album.date)}
                </p>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl text-forest-950 transition-colors group-hover:text-gold-700">
                  {album.title}
                </h3>
                {album.description && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {album.description}
                  </p>
                )}
                {album.location && (
                  <p className="mt-3 text-xs text-slate-600">
                    {album.location}
                  </p>
                )}
                <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-forest-950">
                  View album <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </m.button>
          ))}
      </div>
    )}
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
    const url = `${window.location.origin}/gallery?album=${albumId}`;
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
    <section className="mt-10 space-y-8 rounded-3xl bg-forest-950 p-5 sm:mt-12 sm:p-8">
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
