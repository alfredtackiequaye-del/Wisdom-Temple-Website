import { useEffect, useState } from "react";
import { AlbumCategory, AlbumPhoto, ChurchPhoto, PhotoAlbum } from "../types";

export const ALBUM_CATEGORIES: AlbumCategory[] = [
  "Worship & Prayer",
  "Conferences & Summits",
  "Fellowship & Community",
  "Youth & Kids",
  "Special Services",
];

/** "2026-09-14" -> "14 September 2026" */
export const formatAlbumDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/** Adapts album photos to the shared gallery/lightbox component. */
export const albumToGalleryPhotos = (album: PhotoAlbum): ChurchPhoto[] =>
  (album.photos || []).map((photo) => ({
    id: photo.id,
    title: photo.caption || album.title,
    event: album.title,
    category: album.category,
    date: formatAlbumDate(album.date),
    imageUrl: photo.url,
    thumbnailUrl: photo.thumbUrl,
    // A photo's own caption is shown as its title, so don't repeat it below.
    caption: photo.caption ? "" : album.description,
    location: album.location,
  }));

const SERVER_OUTDATED =
  "The photo album service isn't available on this server. Restart it (npm run dev) or redeploy, then try again.";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "same-origin", ...init });
  // A server started before albums existed answers with the site's HTML page.
  const isJson = (response.headers.get("content-type") || "").includes(
    "application/json",
  );
  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => ({})) : {};
    if (!isJson && response.status === 404) throw new Error(SERVER_OUTDATED);
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  if (!isJson) throw new Error(SERVER_OUTDATED);
  return (await response.json()) as T;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const fetchAlbums = () => request<PhotoAlbum[]>("/api/albums");
export const fetchAlbum = (id: string) =>
  request<PhotoAlbum>(`/api/albums/${encodeURIComponent(id)}`);

/** Published albums for the public gallery. */
export const usePublishedAlbums = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    fetchAlbums()
      .then((data) => active && setAlbums(data))
      .catch(() => active && (setAlbums([]), setError(true)));
    return () => {
      active = false;
    };
  }, []);
  return { albums, error };
};

/**
 * Shrinks large phone photos before upload so they send quickly on mobile
 * data. Falls back to the original file if the browser can't decode it.
 */
export const prepareUpload = async (
  file: File,
  maxEdge = 2560,
): Promise<Blob> => {
  if (file.size < 1.5 * 1024 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
};

/**
 * Sort key for one file in an upload batch: later batches sort after earlier
 * ones, and files within a batch keep the order they were selected in.
 */
export const uploadOrderKey = (batchStartedAt: string, index: number) =>
  `${batchStartedAt}#${String(index).padStart(5, "0")}`;

type AlbumFields = Pick<
  PhotoAlbum,
  "title" | "description" | "category" | "date"
> & {
  location?: string;
};

export const adminAlbums = {
  list: () => request<PhotoAlbum[]>("/api/admin/albums"),
  create: (fields: AlbumFields) =>
    request<PhotoAlbum>("/api/admin/albums", jsonInit("POST", fields)),
  update: (
    id: string,
    changes: Partial<AlbumFields> & {
      published?: boolean;
      coverPhotoId?: string;
    },
  ) =>
    request<PhotoAlbum>(`/api/admin/albums/${id}`, jsonInit("PATCH", changes)),
  remove: (id: string) =>
    request<void>(`/api/admin/albums/${id}`, { method: "DELETE" }),
  /** `order` sorts photos within the album; see uploadOrderKey. */
  uploadPhoto: async (albumId: string, file: File, order: string) => {
    const body = await prepareUpload(file);
    return request<AlbumPhoto>(`/api/admin/albums/${albumId}/photos`, {
      method: "POST",
      headers: {
        "Content-Type": body.type || file.type || "image/jpeg",
        "X-Upload-Order": order,
      },
      body,
    });
  },
  updatePhoto: (albumId: string, photoId: string, caption: string) =>
    request<AlbumPhoto>(
      `/api/admin/albums/${albumId}/photos/${photoId}`,
      jsonInit("PATCH", { caption }),
    ),
  removePhoto: (albumId: string, photoId: string) =>
    request<void>(`/api/admin/albums/${albumId}/photos/${photoId}`, {
      method: "DELETE",
    }),
};
