const LOCAL_IMAGE_PATTERN =
  /^\/(?!assets\/optimized\/)([^?#]+)\.(?:jpe?g|png)(?:[?#].*)?$/i;

/** Return the generated WebP path for a public image when one exists. */
export function optimizedImageUrl(source: string): string {
  const match = source.match(LOCAL_IMAGE_PATTERN);
  if (!match) return source;

  const [, path] = match;
  const filename = path.split("/").pop() || "";
  const optimizedPath = `/assets/optimized/${filename.replace(/\.(?:jpe?g|png)$/i, "")}.webp`;

  return optimizedPath;
}

export function galleryThumbnailUrl(source: string): string {
  const optimizedSource = optimizedImageUrl(source);
  if (optimizedSource !== source) return optimizedSource;

  if (source.includes("images.unsplash.com")) {
    return source.replace(/([?&])w=\d+/i, "$1w=320");
  }

  return source;
}
