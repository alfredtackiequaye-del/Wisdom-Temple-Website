import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Images,
  Loader2,
  Plus,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { AlbumCategory, AlbumPhoto, PhotoAlbum } from "../types";
import {
  ALBUM_CATEGORIES,
  adminAlbums,
  formatAlbumDate,
  uploadOrderKey,
} from "../utils/albums";

const UPLOAD_CONCURRENCY = 3;
const today = () => new Date().toISOString().slice(0, 10);

type DetailsForm = {
  title: string;
  date: string;
  category: AlbumCategory;
  location: string;
  description: string;
};

const emptyForm = (): DetailsForm => ({
  title: "",
  date: today(),
  category: "Worship & Prayer",
  location: "",
  description: "",
});

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-gold-500";
const labelClass = "block text-xs font-bold text-slate-600 mb-1.5";

export const AdminAlbumManager: React.FC = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    try {
      setAlbums(await adminAlbums.list());
    } catch (err) {
      setError((err as Error).message);
      setAlbums([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replaceAlbum = (album: PhotoAlbum) =>
    setAlbums((prev) =>
      (prev || []).map((a) => (a.id === album.id ? album : a)),
    );

  const selected = albums?.find((a) => a.id === selectedId) || null;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-900 text-gold-300 border-2 border-gold-500 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      <div className="bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950 rounded-3xl p-6 sm:p-8 border border-forest-700 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-widest">
              Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title text-white">
              Photo Albums
            </h2>
            <p className="text-sm text-emerald-100/80">
              Create an album for each service or program, upload the photos,
              then publish it to show it on the Gallery page.
            </p>
          </div>
          {!selected && !creating && (
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 text-sm font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New album
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {creating ? (
        <CreateAlbum
          onCancel={() => setCreating(false)}
          onCreated={(album) => {
            setAlbums((prev) => [album, ...(prev || [])]);
            setCreating(false);
            setSelectedId(album.id);
            notify("Album created. Now add photos.");
          }}
        />
      ) : selected ? (
        <AlbumEditor
          album={selected}
          onBack={() => setSelectedId(null)}
          onChange={replaceAlbum}
          onDeleted={() => {
            setAlbums((prev) =>
              (prev || []).filter((a) => a.id !== selected.id),
            );
            setSelectedId(null);
            notify("Album deleted.");
          }}
          notify={notify}
        />
      ) : (
        <AlbumList albums={albums} onOpen={setSelectedId} />
      )}
    </div>
  );
};

const AlbumList: React.FC<{
  albums: PhotoAlbum[] | null;
  onOpen: (id: string) => void;
}> = ({ albums, onOpen }) => {
  if (albums === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 p-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading albums…
      </div>
    );
  }
  if (albums.length === 0) {
    return (
      <div className="p-10 text-center rounded-3xl border-2 border-dashed border-slate-300 bg-white">
        <Images className="w-10 h-10 mx-auto text-gold-500" />
        <p className="mt-3 text-sm font-bold text-forest-900">No albums yet</p>
        <p className="text-xs text-slate-500">
          Click “New album” to create the first one.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {albums.map((album) => (
        <button
          key={album.id}
          onClick={() => onOpen(album.id)}
          className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-gold-500 transition-all cursor-pointer"
        >
          <div className="relative aspect-[4/3] bg-mist-100">
            {album.cover ? (
              <img
                src={album.cover.thumbUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Images className="w-10 h-10" />
              </div>
            )}
            <span
              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                album.published
                  ? "bg-forest-700 text-white"
                  : "bg-white/90 text-slate-700 border border-slate-300"
              }`}
            >
              {album.published ? "Published" : "Draft"}
            </span>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-[11px] font-semibold text-gold-600">
              {formatAlbumDate(album.date)} · {album.photoCount}{" "}
              {album.photoCount === 1 ? "photo" : "photos"}
            </p>
            <h3 className="text-base text-forest-900 font-serif-title">
              {album.title}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
};

const DetailsFields: React.FC<{
  form: DetailsForm;
  onChange: (form: DetailsForm) => void;
}> = ({ form, onChange }) => {
  const set = <K extends keyof DetailsForm>(key: K, value: DetailsForm[K]) =>
    onChange({ ...form, [key]: value });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className={labelClass}>Album title *</label>
        <input
          className={inputClass}
          value={form.title}
          maxLength={120}
          placeholder="e.g. Wisdom Summit 2026, Night 1"
          onChange={(e) => set("title", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Date of the program *</label>
        <input
          type="date"
          className={inputClass}
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Category *</label>
        <select
          className={inputClass}
          value={form.category}
          onChange={(e) => set("category", e.target.value as AlbumCategory)}
        >
          {ALBUM_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className={labelClass}>Location</label>
        <input
          className={inputClass}
          value={form.location}
          maxLength={120}
          placeholder="e.g. Main Auditorium"
          onChange={(e) => set("location", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <label className={labelClass}>Short description</label>
        <textarea
          className={`${inputClass} min-h-24`}
          value={form.description}
          maxLength={1000}
          placeholder="A sentence or two about the program."
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
    </div>
  );
};

const CreateAlbum: React.FC<{
  onCancel: () => void;
  onCreated: (album: PhotoAlbum) => void;
}> = ({ onCancel, onCreated }) => {
  const [form, setForm] = useState<DetailsForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Give the album a title.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      onCreated(await adminAlbums.create(form));
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm"
    >
      <h3 className="text-xl text-forest-900 font-serif-title">New album</h3>
      <DetailsFields form={form} onChange={setForm} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-gold-300 text-sm font-bold hover:bg-forest-800 cursor-pointer"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Create album
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

type UploadState = {
  total: number;
  done: number;
  failed: { name: string; error: string }[];
};

const AlbumEditor: React.FC<{
  album: PhotoAlbum;
  onBack: () => void;
  onChange: (album: PhotoAlbum) => void;
  onDeleted: () => void;
  notify: (message: string) => void;
}> = ({ album, onBack, onChange, onDeleted, notify }) => {
  const [form, setForm] = useState<DetailsForm>(() => ({
    title: album.title,
    date: album.date,
    category: album.category,
    location: album.location || "",
    description: album.description,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [upload, setUpload] = useState<UploadState | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  // Uploads finish out of order; keep the latest album in a ref so each
  // completed photo is appended to the current list, not a stale copy.
  const albumRef = useRef(album);
  albumRef.current = album;

  const photos = album.photos || [];
  const coverId = album.coverPhotoId || photos[0]?.id;
  const uploading =
    upload !== null && upload.done + upload.failed.length < upload.total;

  const run = async (action: () => Promise<void>) => {
    setError("");
    try {
      await action();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const saveDetails = () =>
    run(async () => {
      if (!form.title.trim()) throw new Error("Album title cannot be empty.");
      setSaving(true);
      try {
        onChange(await adminAlbums.update(album.id, form));
        notify("Album details saved.");
      } finally {
        setSaving(false);
      }
    });

  const setPublished = (published: boolean) =>
    run(async () => {
      onChange(await adminAlbums.update(album.id, { published }));
      notify(
        published
          ? "Album is now live on the Gallery."
          : "Album hidden from the Gallery.",
      );
    });

  const setCover = (photoId: string) =>
    run(async () => {
      onChange(await adminAlbums.update(album.id, { coverPhotoId: photoId }));
    });

  const saveCaption = (photo: AlbumPhoto, caption: string) =>
    run(async () => {
      if ((photo.caption || "") === caption.trim()) return;
      const updated = await adminAlbums.updatePhoto(
        album.id,
        photo.id,
        caption,
      );
      const current = albumRef.current;
      onChange({
        ...current,
        photos: (current.photos || []).map((p) =>
          p.id === photo.id ? updated : p,
        ),
      });
    });

  const removePhoto = (photo: AlbumPhoto) =>
    run(async () => {
      if (!window.confirm("Delete this photo from the album?")) return;
      await adminAlbums.removePhoto(album.id, photo.id);
      const current = albumRef.current;
      const remaining = (current.photos || []).filter((p) => p.id !== photo.id);
      const coverGone = current.coverPhotoId === photo.id;
      const cover =
        remaining.find(
          (p) => p.id === (coverGone ? undefined : current.coverPhotoId),
        ) || remaining[0];
      onChange({
        ...current,
        photos: remaining,
        photoCount: remaining.length,
        coverPhotoId: coverGone ? undefined : current.coverPhotoId,
        cover: cover ? { url: cover.url, thumbUrl: cover.thumbUrl } : null,
        published: remaining.length > 0 && current.published,
      });
    });

  const removeAlbum = () =>
    run(async () => {
      const ok = window.confirm(
        `Delete “${album.title}” and all ${photos.length} photos? This can't be undone.`,
      );
      if (!ok) return;
      await adminAlbums.remove(album.id);
      onDeleted();
    });

  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) return;
    setUpload({ total: files.length, done: 0, failed: [] });
    const batchStartedAt = new Date().toISOString();
    const queue = files.map((file, index) => ({
      file,
      order: uploadOrderKey(batchStartedAt, index),
    }));
    const worker = async () => {
      for (let item = queue.shift(); item; item = queue.shift()) {
        const { file, order } = item;
        try {
          const photo = await adminAlbums.uploadPhoto(album.id, file, order);
          const current = albumRef.current;
          const next = [...(current.photos || []), photo].sort((a, b) =>
            (a.sortKey || a.uploadedAt).localeCompare(
              b.sortKey || b.uploadedAt,
            ),
          );
          const cover =
            next.find((p) => p.id === current.coverPhotoId) || next[0];
          const updated = {
            ...current,
            photos: next,
            photoCount: next.length,
            cover: { url: cover.url, thumbUrl: cover.thumbUrl },
          };
          albumRef.current = updated;
          onChange(updated);
          setUpload((u) => u && { ...u, done: u.done + 1 });
        } catch (err) {
          const failure = { name: file.name, error: (err as Error).message };
          setUpload((u) => u && { ...u, failed: [...u.failed, failure] });
        }
      }
    };
    await Promise.all(
      Array.from(
        { length: Math.min(UPLOAD_CONCURRENCY, files.length) },
        worker,
      ),
    );
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All albums
      </button>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Status bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              album.published
                ? "bg-forest-700 text-white"
                : "bg-slate-100 text-slate-700 border border-slate-300"
            }`}
          >
            {album.published ? "Published" : "Draft"}
          </span>
          <span className="text-sm text-slate-600">
            {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {album.published && (
            <a
              href={`/?album=${album.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-forest-700 border border-mist-400 hover:bg-mist-100"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View on site
            </a>
          )}
          <button
            onClick={() => setPublished(!album.published)}
            disabled={!album.published && photos.length === 0}
            title={
              photos.length === 0 ? "Add photos before publishing" : undefined
            }
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              album.published
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-gold-500 text-forest-950 hover:bg-gold-400"
            }`}
          >
            {album.published ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Unpublish
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Publish to Gallery
              </>
            )}
          </button>
        </div>
      </div>

      {!album.published && photos.length > 0 && !uploading && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gold-50 border-2 border-gold-500/60">
          <div className="flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-forest-900">
                This album is a draft, so visitors can't see it yet.
              </p>
              <p className="text-xs text-slate-600">
                Check the photos below, then publish it to show it on the
                Gallery page.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPublished(true)}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 text-forest-950 text-sm font-bold hover:bg-gold-400 cursor-pointer shrink-0"
          >
            <Eye className="w-4 h-4" /> Publish to Gallery
          </button>
        </div>
      )}

      {/* Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!uploading) uploadFiles(e.dataTransfer.files);
        }}
        className={`rounded-3xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? "border-gold-500 bg-gold-50" : "border-slate-300 bg-white"
        }`}
      >
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <UploadCloud className="w-10 h-10 mx-auto text-gold-500" />
        <p className="mt-3 text-sm font-bold text-forest-900">
          Drag photos here, or
        </p>
        <button
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-gold-300 text-sm font-bold hover:bg-forest-800 cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Choose photos
        </button>
        <p className="mt-2 text-xs text-slate-500">
          JPG, PNG or WebP. Select many at once; large photos are resized
          automatically.
        </p>

        {upload && (
          <div className="mt-5 max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>
                {uploading
                  ? `Uploading ${upload.done + upload.failed.length + 1} of ${upload.total}…`
                  : `Uploaded ${upload.done} of ${upload.total}`}
              </span>
              <span>
                {Math.round(
                  ((upload.done + upload.failed.length) / upload.total) * 100,
                )}
                %
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gold-500 transition-all"
                style={{
                  width: `${((upload.done + upload.failed.length) / upload.total) * 100}%`,
                }}
              />
            </div>
            {upload.failed.length > 0 && (
              <ul className="text-xs text-red-600 space-y-0.5">
                {upload.failed.map((f, i) => (
                  <li key={i}>
                    {f.name}: {f.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-forest-900 font-serif-title">Photos</h3>
            <p className="text-xs text-slate-500">
              <Star className="inline w-3.5 h-3.5 text-gold-500 fill-gold-500" />{" "}
              marks the album cover
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="space-y-2">
                <div className="group relative aspect-square rounded-xl overflow-hidden bg-mist-100">
                  <img
                    src={photo.thumbUrl}
                    alt={photo.caption || ""}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      onClick={() => setCover(photo.id)}
                      title="Use as album cover"
                      aria-label="Use as album cover"
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow cursor-pointer ${
                        coverId === photo.id
                          ? "bg-gold-500 text-forest-950"
                          : "bg-white/90 text-slate-600 hover:text-gold-600"
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${coverId === photo.id ? "fill-forest-950" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => removePhoto(photo)}
                      title="Delete photo"
                      aria-label="Delete photo"
                      className="w-8 h-8 rounded-full bg-white/90 text-slate-600 hover:text-red-600 flex items-center justify-center shadow cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <input
                  defaultValue={photo.caption || ""}
                  placeholder="Add a caption (optional)"
                  maxLength={200}
                  onBlur={(e) => saveCaption(photo, e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-lg text-forest-900 font-serif-title">
          Album details
        </h3>
        <DetailsFields form={form} onChange={setForm} />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={saveDetails}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-gold-300 text-sm font-bold hover:bg-forest-800 cursor-pointer"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save details
          </button>
          <button
            onClick={removeAlbum}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete album
          </button>
        </div>
      </div>
    </div>
  );
};
