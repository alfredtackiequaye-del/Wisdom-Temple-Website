import type { Request, Response } from "express";
import { readState, writeState } from "./database";

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
  const current = readState<Record<string, unknown>>("site-banners", {});
  const url = String(req.body?.url || "").trim();
  if (!url || url.length > 2_000_000) {
    res.status(400).json({ error: "A valid banner URL or image payload is required." });
    return;
  }
  const updated = { ...current, [req.params.id]: { currentUrl: url, updatedAt: new Date().toISOString() } };
  writeState("site-banners", updated);
  res.json({ banner: updated[req.params.id] });
}

export async function resetSiteBanner(req: Request, res: Response) {
  const current = readState<Record<string, unknown>>("site-banners", {});
  delete current[req.params.id];
  writeState("site-banners", current);
  res.status(204).end();
}
