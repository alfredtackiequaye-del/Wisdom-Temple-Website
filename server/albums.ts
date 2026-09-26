import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { Request, Response } from "express";
import sharp, { type OutputInfo } from "sharp";
import { appendAudit, readState, writeState } from "./database";

/**
 * Photo albums. Metadata lives in SQLite app_state ("photo-albums");
 * image files live on disk under UPLOAD_DIR and are served at /uploads.
 * Swap the three file helpers below for object storage when hosting on a
 * platform without a persistent disk.
 */

export const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR || path.join(process.cwd(), ".data/uploads"),
);
const STATE_KEY = "photo-albums";
const LARGE_EDGE = 2048;
const THUMB_EDGE = 640;

export const ALBUM_CATEGORIES = [
  "Worship & Prayer",
  "Conferences & Summits",
  "Fellowship & Community",
  "Youth & Kids",
  "Special Services",
] as const;

interface AlbumPhoto {
  id: string;
  width: number;
  height: number;
  caption?: string;
  uploadedAt: string;
  /** Keeps photos in the order they were selected, not the order uploads finish. */
  sortKey?: string;
}

interface PhotoAlbum {
  id: string;
  title: string;
  description: string;
  category: (typeof ALBUM_CATEGORIES)[number];
  date: string; // YYYY-MM-DD
  location?: string;
  coverPhotoId?: string;
  published: boolean;
  photos: AlbumPhoto[];
  createdAt: string;
  updatedAt: string;
}

// --- storage -------------------------------------------------------------

const albumDir = (albumId: string) => path.join(UPLOAD_DIR, "albums", albumId);

const writePhotoFiles = async (
  albumId: string,
  photoId: string,
  large: Buffer,
  thumb: Buffer,
) => {
  await fs.mkdir(albumDir(albumId), { recursive: true });
  await fs.writeFile(path.join(albumDir(albumId), `${photoId}.webp`), large);
  await fs.writeFile(
    path.join(albumDir(albumId), `${photoId}-thumb.webp`),
    thumb,
  );
};

const removePhotoFiles = async (albumId: string, photoId: string) => {
  await Promise.all(
    [`${photoId}.webp`, `${photoId}-thumb.webp`].map((name) =>
      fs.rm(path.join(albumDir(albumId), name), { force: true }),
    ),
  );
};

const removeAlbumFiles = (albumId: string) =>
  fs.rm(albumDir(albumId), { recursive: true, force: true });

// --- helpers -------------------------------------------------------------

const readAlbums = () => readState<PhotoAlbum[]>(STATE_KEY, []);
const saveAlbums = (albums: PhotoAlbum[]) => writeState(STATE_KEY, albums);
const newId = () => crypto.randomBytes(8).toString("hex");
const actor = (res: Response) =>
  (res.locals.adminUser as { email?: string } | undefined)?.email || "admin";

const photoUrls = (albumId: string, photo: AlbumPhoto) => ({
  url: `/uploads/albums/${albumId}/${photo.id}.webp`,
  thumbUrl: `/uploads/albums/${albumId}/${photo.id}-thumb.webp`,
});

const coverOf = (album: PhotoAlbum) =>
  album.photos.find((p) => p.id === album.coverPhotoId) || album.photos[0];

const toPublicAlbum = (album: PhotoAlbum, withPhotos: boolean) => {
  const cover = coverOf(album);
  const { photos, ...meta } = album;
  return {
    ...meta,
    photoCount: photos.length,
    cover: cover ? photoUrls(album.id, cover) : null,
    ...(withPhotos
      ? { photos: photos.map((p) => ({ ...p, ...photoUrls(album.id, p) })) }
      : {}),
  };
};

const byNewest = (a: PhotoAlbum, b: PhotoAlbum) =>
  b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);

const cleanText = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : undefined;

/** Validates editable album fields; returns an error message or the clean fields. */
const readAlbumFields = (
  body: Record<string, unknown>,
  requireAll: boolean,
) => {
  const fields: Partial<PhotoAlbum> = {};
  const title = cleanText(body.title, 120);
  if (title !== undefined) fields.title = title;
  const description = cleanText(body.description, 1000);
  if (description !== undefined) fields.description = description;
  const location = cleanText(body.location, 120);
  if (location !== undefined) fields.location = location;
  if (body.category !== undefined) {
    if (!ALBUM_CATEGORIES.includes(body.category as PhotoAlbum["category"])) {
      return { error: "Choose a valid album category." };
    }
    fields.category = body.category as PhotoAlbum["category"];
  }
  if (body.date !== undefined) {
    if (
      typeof body.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.date)
    ) {
      return { error: "Album date must be YYYY-MM-DD." };
    }
    fields.date = body.date;
  }
  if (requireAll && (!fields.title || !fields.category || !fields.date)) {
    return { error: "Title, category and date are required." };
  }
  if (fields.title === "") return { error: "Album title cannot be empty." };
  return { fields };
};

// --- public handlers -----------------------------------------------------

export function listPublicAlbums(_req: Request, res: Response) {
  const albums = readAlbums()
    .filter((a) => a.published && a.photos.length > 0)
    .sort(byNewest)
    .map((a) => toPublicAlbum(a, false));
  res.json(albums);
}

export function getPublicAlbum(req: Request, res: Response) {
  const album = readAlbums().find((a) => a.id === req.params.id);
  if (!album || !album.published) {
    res.status(404).json({ error: "Album not found." });
    return;
  }
  res.json(toPublicAlbum(album, true));
}

// --- admin handlers ------------------------------------------------------

export function listAdminAlbums(_req: Request, res: Response) {
  res.json(
    readAlbums()
      .sort(byNewest)
      .map((a) => toPublicAlbum(a, true)),
  );
}

export function createAlbum(req: Request, res: Response) {
  const parsed = readAlbumFields(req.body || {}, true);
  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const now = new Date().toISOString();
  const album: PhotoAlbum = {
    id: newId(),
    description: "",
    published: false,
    photos: [],
    createdAt: now,
    updatedAt: now,
    ...(parsed.fields as Pick<PhotoAlbum, "title" | "category" | "date">),
  };
  saveAlbums([...readAlbums(), album]);
  appendAudit(actor(res), "create", "photo-albums", album.id);
  res.status(201).json(toPublicAlbum(album, true));
}

export function updateAlbum(req: Request, res: Response) {
  const body = (req.body || {}) as Record<string, unknown>;
  const parsed = readAlbumFields(body, false);
  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const albums = readAlbums();
  const album = albums.find((a) => a.id === req.params.id);
  if (!album) {
    res.status(404).json({ error: "Album not found." });
    return;
  }
  Object.assign(album, parsed.fields);
  if (typeof body.published === "boolean") {
    if (body.published && album.photos.length === 0) {
      res
        .status(400)
        .json({ error: "Add at least one photo before publishing." });
      return;
    }
    album.published = body.published;
  }
  if (typeof body.coverPhotoId === "string") {
    if (!album.photos.some((p) => p.id === body.coverPhotoId)) {
      res.status(400).json({ error: "Cover photo must belong to this album." });
      return;
    }
    album.coverPhotoId = body.coverPhotoId;
  }
  album.updatedAt = new Date().toISOString();
  saveAlbums(albums);
  appendAudit(actor(res), "update", "photo-albums", album.id);
  res.json(toPublicAlbum(album, true));
}

export async function deleteAlbum(req: Request, res: Response) {
  const albums = readAlbums();
  const album = albums.find((a) => a.id === req.params.id);
  if (!album) {
    res.status(404).json({ error: "Album not found." });
    return;
  }
  saveAlbums(albums.filter((a) => a.id !== album.id));
  await removeAlbumFiles(album.id);
  appendAudit(actor(res), "delete", "photo-albums", album.id);
  res.status(204).end();
}

/** Body is the raw image (Content-Type image/*), one photo per request. */
export async function uploadAlbumPhoto(req: Request, res: Response) {
  if (!readAlbums().some((a) => a.id === req.params.id)) {
    res.status(404).json({ error: "Album not found." });
    return;
  }
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    res.status(400).json({ error: "Send the photo as the request body." });
    return;
  }

  let large: { data: Buffer; info: OutputInfo };
  let thumb: Buffer;
  try {
    const source = sharp(req.body, { failOn: "error" }).rotate();
    large = await source
      .clone()
      .resize({
        width: LARGE_EDGE,
        height: LARGE_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    thumb = await source
      .clone()
      .resize({
        width: THUMB_EDGE,
        height: THUMB_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 74 })
      .toBuffer();
  } catch {
    res.status(415).json({
      error: "That file isn't a supported image. Use JPG, PNG or WebP.",
    });
    return;
  }

  const photo: AlbumPhoto = {
    id: newId(),
    width: large.info.width,
    height: large.info.height,
    uploadedAt: new Date().toISOString(),
  };
  const order = req.get("X-Upload-Order");
  photo.sortKey =
    order && /^[\w.:#-]{1,64}$/.test(order) ? order : photo.uploadedAt;
  await writePhotoFiles(req.params.id, photo.id, large.data, thumb);

  // Re-read after the async work so concurrent uploads don't overwrite each other.
  const albums = readAlbums();
  const album = albums.find((a) => a.id === req.params.id);
  if (!album) {
    await removePhotoFiles(req.params.id, photo.id);
    res.status(404).json({ error: "Album was deleted during upload." });
    return;
  }
  album.photos.push(photo);
  album.photos.sort((a, b) =>
    (a.sortKey || a.uploadedAt).localeCompare(b.sortKey || b.uploadedAt),
  );
  album.updatedAt = photo.uploadedAt;
  saveAlbums(albums);
  appendAudit(
    actor(res),
    "upload-photo",
    "photo-albums",
    `${album.id}/${photo.id}`,
  );
  res.status(201).json({ ...photo, ...photoUrls(album.id, photo) });
}

export function updateAlbumPhoto(req: Request, res: Response) {
  const albums = readAlbums();
  const album = albums.find((a) => a.id === req.params.id);
  const photo = album?.photos.find((p) => p.id === req.params.photoId);
  if (!album || !photo) {
    res.status(404).json({ error: "Photo not found." });
    return;
  }
  const caption = cleanText(req.body?.caption, 200);
  if (caption !== undefined) photo.caption = caption || undefined;
  album.updatedAt = new Date().toISOString();
  saveAlbums(albums);
  res.json({ ...photo, ...photoUrls(album.id, photo) });
}

export async function deleteAlbumPhoto(req: Request, res: Response) {
  const albums = readAlbums();
  const album = albums.find((a) => a.id === req.params.id);
  if (!album || !album.photos.some((p) => p.id === req.params.photoId)) {
    res.status(404).json({ error: "Photo not found." });
    return;
  }
  album.photos = album.photos.filter((p) => p.id !== req.params.photoId);
  if (album.coverPhotoId === req.params.photoId) album.coverPhotoId = undefined;
  if (album.photos.length === 0) album.published = false;
  album.updatedAt = new Date().toISOString();
  saveAlbums(albums);
  await removePhotoFiles(album.id, req.params.photoId);
  appendAudit(
    actor(res),
    "delete-photo",
    "photo-albums",
    `${album.id}/${req.params.photoId}`,
  );
  res.status(204).end();
}
