import express from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAdminSession,
  createStaff,
  listStaff,
  loginAdmin,
  logoutAdmin,
  removeStaff,
  requireAdmin,
  requireRole,
  updateStaff,
} from "./server/adminAuth";
import {
  createPublicRecord,
  listAdminRecords,
  updateRecordStatus,
} from "./server/adminRecords";
import {
  getSiteBanners,
  getSiteContent,
  migrateInlineBanners,
  resetSiteBanner,
  updateSiteBanner,
  updateSiteContent,
} from "./server/siteConfig";
import { closeDatabase } from "./server/database";
import {
  UPLOAD_DIR,
  createAlbum,
  deleteAlbum,
  deleteAlbumPhoto,
  getPublicAlbum,
  listAdminAlbums,
  listPublicAlbums,
  updateAlbum,
  updateAlbumPhoto,
  uploadAlbumPhoto,
} from "./server/albums";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  await migrateInlineBanners();
  const app = express();
  const HOST = process.env.HOST || "127.0.0.1";
  const PORT = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === "production";

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  // Banner uploads arrive as data: URLs and get their own, larger limit below.
  const smallJson = express.json({ limit: "256kb" });
  app.use((req, res, next) =>
    req.path.startsWith("/api/admin/site-banners/") ? next() : smallJson(req, res, next),
  );
  const isPhotoUpload = (req: express.Request) =>
    req.method === "POST" && /^\/albums\/[^/]+\/photos$/.test(req.path);
  app.use(
    "/api/admin",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
      // Album uploads send one request per photo and are session-protected.
      skip: isPhotoUpload,
    }),
  );
  app.use(
    "/uploads",
    express.static(UPLOAD_DIR, { immutable: true, maxAge: "365d", index: false }),
  );
  app.get("/healthz", (_req, res) => res.json({ ok: true, service: "wisdom-temple" }));

  app.post("/api/admin/login", loginAdmin);
  app.post("/api/admin/logout", logoutAdmin);
  app.get("/api/admin/session", requireAdmin, getAdminSession);
  app.get(
    "/api/admin/staff",
    requireAdmin,
    requireRole("super-admin"),
    listStaff,
  );
  app.post(
    "/api/admin/staff",
    requireAdmin,
    requireRole("super-admin"),
    createStaff,
  );
  app.patch(
    "/api/admin/staff/:id",
    requireAdmin,
    requireRole("super-admin"),
    updateStaff,
  );
  app.delete(
    "/api/admin/staff/:id",
    requireAdmin,
    requireRole("super-admin"),
    removeStaff,
  );
  app.get("/api/admin/records", requireAdmin, listAdminRecords);
  app.patch(
    "/api/admin/records/:collection/:id/status",
    requireAdmin,
    updateRecordStatus,
  );
  app.post("/api/records/:collection", createPublicRecord);
  app.get("/api/site-content", getSiteContent);
  app.put("/api/site-content", requireAdmin, requireRole("super-admin"), updateSiteContent);
  app.get("/api/site-banners", getSiteBanners);
  app.put(
    "/api/admin/site-banners/:id",
    requireAdmin,
    requireRole("super-admin"),
    express.json({ limit: "12mb" }),
    updateSiteBanner,
  );
  app.delete("/api/admin/site-banners/:id", requireAdmin, requireRole("super-admin"), resetSiteBanner);

  const albumEditors = requireRole("super-admin", "secretariat");
  app.get("/api/albums", listPublicAlbums);
  app.get("/api/albums/:id", getPublicAlbum);
  app.get("/api/admin/albums", requireAdmin, albumEditors, listAdminAlbums);
  app.post("/api/admin/albums", requireAdmin, albumEditors, createAlbum);
  app.patch("/api/admin/albums/:id", requireAdmin, albumEditors, updateAlbum);
  app.delete("/api/admin/albums/:id", requireAdmin, albumEditors, deleteAlbum);
  app.post(
    "/api/admin/albums/:id/photos",
    requireAdmin,
    albumEditors,
    express.raw({ type: "image/*", limit: "25mb" }),
    uploadAlbumPhoto,
  );
  app.patch("/api/admin/albums/:id/photos/:photoId", requireAdmin, albumEditors, updateAlbumPhoto);
  app.delete("/api/admin/albums/:id/photos/:photoId", requireAdmin, albumEditors, deleteAlbumPhoto);

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { hmr: false, middlewareMode: true },
      appType: "spa",
    });

    app.use((req, res, next) => {
      if (req.path === "/admin") {
        res.redirect(301, "/admin/");
        return;
      }

      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));

    // Handle /admin and /admin/*
    app.get(["/admin", "/admin/*", "/admin/index.html"], (_req, res) => {
      const adminPath = path.resolve(distPath, "admin/index.html");
      res.sendFile(adminPath, (err) => {
        if (err) {
          res.sendFile(path.resolve(distPath, "index.html"));
        }
      });
    });

    // Fallback all other routes to index.html
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  const portWasExplicitlySet = Boolean(process.env.PORT);
  let currentPort = PORT;

  const listen = () => {
    const server = app.listen(currentPort, HOST, () => {
      console.log(
        `Wisdom Temple server running on http://${HOST}:${currentPort} [${isProd ? "production" : "development"}]`,
      );
    });

    server.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE" && !portWasExplicitlySet) {
        currentPort += 1;
        listen();
        return;
      }

      throw error;
    });
  };

  listen();

  const shutdown = () => {
    closeDatabase();
    process.exit(0);
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
