import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { Request, Response } from "express";
import sharp from "sharp";
import { UPLOAD_DIR } from "./albums";
import { readState, writeState } from "./database";

type StoredBanner = { currentUrl: string; updatedAt: string };

const BANNER_DIR = path.join(UPLOAD_DIR, "banners");
const DATA_URL = /^data:image\/[a-z0-9.+-]+;base64,/i;

/**
 * Turns an uploaded data: URL into a WebP file under /uploads/banners and
 * returns its public URL. Files are named by content hash, so the same image
 * saved to several related banner slots is stored once.
 */
async function storeBannerImage(dataUrl: string): Promise<string> {
  const input = Buffer.from(dataUrl.replace(DATA_URL, ""), "base64");
  const webp = await sharp(input, { failOn: "error" })
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();
  const name = `${crypto.createHash("sha256").update(webp).digest("hex").slice(0, 20)}.webp`;
  await fs.mkdir(BANNER_DIR, { recursive: true });
  await fs.writeFile(path.join(BANNER_DIR, name), webp);
  return `/uploads/banners/${name}`;
}

/** One-time move of banners saved as inline data: URLs into image files. */
export async function migrateInlineBanners() {
  const banners = readState<Record<string, StoredBanner>>("site-banners", {});
  const inline = Object.entries(banners).filter(([, b]) =>
    DATA_URL.test(b.currentUrl),
  );
  if (!inline.length) return;
  for (const [id, banner] of inline) {
    try {
      banner.currentUrl = await storeBannerImage(banner.currentUrl);
    } catch (err) {
      console.warn(`Could not migrate banner "${id}":`, err);
    }
  }
  writeState("site-banners", banners);
  console.log(`Moved ${inline.length} inline banner image(s) to ${BANNER_DIR}`);
}

export async function getSiteContent(_req: Request, res: Response) {
  res.json(readState("site-content", {}));
}

export async function updateSiteContent(req: Request, res: Response) {
  const current = readState<Record<string, unknown>>("site-content", {});
  const updates = req.body;
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    res.status(400).json({ error: "Content updates must be an object." });
    return;
  }
  writeState("site-content", { ...current, ...updates });
  res.json({ content: { ...current, ...updates } });
}

export async function getSiteBanners(_req: Request, res: Response) {
  res.json(readState("site-banners", {}));
}

export async function updateSiteBanner(req: Request, res: Response) {
  let url = String(req.body?.url || "").trim();
  if (!url || url.length > 12_000_000) {
    res
      .status(400)
      .json({ error: "A valid banner URL or image payload is required." });
    return;
  }
  if (DATA_URL.test(url)) {
    try {
      url = await storeBannerImage(url);
    } catch {
      res
        .status(415)
        .json({
          error: "That file isn't a supported image. Use JPG, PNG or WebP.",
        });
      return;
    }
  }
  // Re-read after the async conversion so concurrent saves don't clobber each other.
  const current = readState<Record<string, StoredBanner>>("site-banners", {});
  const banner = { currentUrl: url, updatedAt: new Date().toISOString() };
  writeState("site-banners", { ...current, [req.params.id]: banner });
  res.json({ banner });
}

export async function resetSiteBanner(req: Request, res: Response) {
  const current = readState<Record<string, unknown>>("site-banners", {});
  delete current[req.params.id];
  writeState("site-banners", current);
  res.status(204).end();
}
