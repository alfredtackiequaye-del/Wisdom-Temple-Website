import React from "react";
import { optimizedImageUrl } from "../utils/optimizedImage";

interface PosterImageProps {
  src: string;
  alt: string;
}

/**
 * Shows a flyer or photo uncropped inside a fixed-ratio card: the full image
 * sits over a blurred, zoomed copy of itself that fills the empty edges.
 * The parent must be `relative overflow-hidden` with a set aspect ratio.
 */
export const PosterImage: React.FC<PosterImageProps> = ({ src, alt }) => {
  const url = optimizedImageUrl(src);
  return (
    <>
      <img
        src={url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-70"
      />
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="relative w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </>
  );
};
