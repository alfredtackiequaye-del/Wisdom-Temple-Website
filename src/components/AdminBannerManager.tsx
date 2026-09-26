import React, { useState, useRef } from "react";
import { BannerConfig, BannerCategory, PageId } from "../types";
import {
  useBanners,
  loadAllBanners,
  saveBannerUrl,
  resetSingleBanner,
  resetAllBannersToDefault,
  exportBannersJson,
  compressImageFile,
  getRelatedBannerIds,
} from "../utils/bannerManager";
import {
  Image as ImageIcon,
  UploadCloud,
  Link as LinkIcon,
  Check,
  RotateCcw,
  Search,
  Maximize2,
  Download,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Copy,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Eye,
} from "lucide-react";

interface AdminBannerManagerProps {
  onNavigate?: (page: PageId, subTab?: string) => void;
}

export const AdminBannerManager: React.FC<AdminBannerManagerProps> = ({
  onNavigate,
}) => {
  const { banners, updateBanner, resetBanner, resetAll } = useBanners();

  const [selectedCategory, setSelectedCategory] =
    useState<BannerCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUrls, setEditingUrls] = useState<Record<string, string>>({});
  const [activeTabMode, setActiveTabMode] = useState<
    Record<string, "url" | "upload">
  >({});
  const [detectedDimensions, setDetectedDimensions] = useState<
    Record<
      string,
      {
        width: number;
        height: number;
        status: "match" | "close" | "mismatch";
        sizeInfo?: string;
      }
    >
  >({});
  const [compressingId, setCompressingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewModalBanner, setPreviewModalBanner] =
    useState<BannerConfig | null>(null);
  const [showGuideAccordion, setShowGuideAccordion] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const categories: { key: BannerCategory; label: string; count: number }[] = [
    { key: "all", label: "All Banners", count: banners.length },
    {
      key: "hero",
      label: "Homepage & Hero",
      count: banners.filter((b) => b.category === "hero").length,
    },
    {
      key: "ministries",
      label: "Ministries Cards",
      count: banners.filter((b) => b.category === "ministries").length,
    },
    {
      key: "events",
      label: "Events & Summits",
      count: banners.filter((b) => b.category === "events").length,
    },
    {
      key: "pages",
      label: "Page Headers",
      count: banners.filter((b) => b.category === "pages").length,
    },
    {
      key: "pastoral",
      label: "Pastoral & Leadership",
      count: banners.filter((b) => b.category === "pastoral").length,
    },
    {
      key: "giving",
      label: "Giving & Stewardship",
      count: banners.filter((b) => b.category === "giving").length,
    },
  ];

  const filteredBanners = banners.filter((banner) => {
    const matchesCategory =
      selectedCategory === "all" || banner.category === selectedCategory;
    const matchesSearch =
      banner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.recommendedSize
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle URL change
  const handleUrlInputChange = (id: string, value: string) => {
    setEditingUrls((prev) => ({ ...prev, [id]: value }));
  };

  // Measure dimensions of a loaded image URL or base64
  const measureImageDimensions = (
    id: string,
    url: string,
    targetWidth: number,
    targetHeight: number,
    sizeInfo?: string,
  ) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const targetRatio = targetWidth / targetHeight;
      const actualRatio = w / h;
      const ratioDiff = Math.abs(targetRatio - actualRatio);

      let status: "match" | "close" | "mismatch" = "mismatch";
      if (w === targetWidth && h === targetHeight) {
        status = "match";
      } else if (ratioDiff < 0.15) {
        status = "close";
      }

      setDetectedDimensions((prev) => ({
        ...prev,
        [id]: { width: w, height: h, status, sizeInfo },
      }));
    };
    img.src = url;
  };

  // Handle File Upload with Automatic High Quality Canvas Compression
  const handleFileUpload = async (
    banner: BannerConfig,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Error: Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    const origSizeKb = Math.round(file.size / 1024);
    setCompressingId(banner.id);

    try {
      // Auto-compress image to ensure lightweight storage and instant loading
      const compressedDataUrl = await compressImageFile(
        file,
        banner.width,
        banner.height,
        0.86,
      );

      const approxNewKb = Math.round((compressedDataUrl.length * 0.75) / 1024);
      const sizeMsg =
        origSizeKb > 500
          ? `Optimized from ${(origSizeKb / 1024).toFixed(1)}MB to ~${approxNewKb}KB`
          : `Ready (~${approxNewKb}KB)`;

      setEditingUrls((prev) => ({ ...prev, [banner.id]: compressedDataUrl }));
      measureImageDimensions(
        banner.id,
        compressedDataUrl,
        banner.width,
        banner.height,
        sizeMsg,
      );
      showToast(
        `✓ Image loaded & optimized. Click "Save Live Banner" below to publish.`,
      );
    } catch (err) {
      console.error("Compression error:", err);
      // Fallback to FileReader if canvas compression fails
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setEditingUrls((prev) => ({ ...prev, [banner.id]: dataUrl }));
          measureImageDimensions(
            banner.id,
            dataUrl,
            banner.width,
            banner.height,
          );
          showToast(
            `Image loaded for "${banner.name}". Click "Save Live Banner" to apply.`,
          );
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressingId(null);
    }
  };

  // Handle Save
  const handleSaveBanner = (banner: BannerConfig) => {
    const newUrl = editingUrls[banner.id] || banner.currentUrl;
    if (!newUrl.trim()) {
      showToast("Please enter an image URL or upload an image file.");
      return;
    }

    updateBanner(banner.id, newUrl.trim());
    const relatedCount = getRelatedBannerIds(banner.id).length;
    showToast(
      relatedCount > 1
        ? `✓ "${banner.name}" updated across ${relatedCount} linked ${relatedCount === 2 ? "banner" : "banners"} with the same theme.`
        : `✓ "${banner.name}" updated successfully and is now active across the main website!`,
    );
  };

  // Handle Reset Single
  const handleResetSingle = (banner: BannerConfig) => {
    resetBanner(banner.id);
    setEditingUrls((prev) => {
      const copy = { ...prev };
      delete copy[banner.id];
      return copy;
    });
    setDetectedDimensions((prev) => {
      const copy = { ...prev };
      delete copy[banner.id];
      return copy;
    });
    showToast(`✓ Reset "${banner.name}" to default asset.`);
  };

  // Handle Reset All
  const handleResetAll = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all custom banners to default assets?",
      )
    ) {
      resetAll();
      setEditingUrls({});
      setDetectedDimensions({});
      showToast("✓ All banners have been reset to factory defaults.");
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const data = exportBannersJson();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icgc-wisdom-temple-banners-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Downloaded banner roster JSON configuration file.");
  };

  // Copy dimension string
  const handleCopyDimension = (banner: BannerConfig) => {
    navigator.clipboard.writeText(`${banner.width}x${banner.height}`);
    setCopiedId(banner.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(
      `Copied "${banner.width} × ${banner.height} px" to clipboard for Canva/Photoshop!`,
    );
  };

  // Helper to resolve live page navigation
  const getBannerPageRoute = (
    banner: BannerConfig,
  ): { page: PageId; subTab?: string; label: string } => {
    switch (banner.category) {
      case "hero":
        return { page: "home", label: "View on Home Page" };
      case "pastoral":
        return {
          page: "about",
          subTab: "leadership",
          label: "View Pastoral Bio",
        };
      case "events":
        return { page: "events", label: "View on Events Page" };
      case "ministries":
        return { page: "ministries", label: "View on Ministries" };
      case "giving":
        return { page: "give", label: "View Giving Page" };
      case "pages":
        if (banner.id.includes("about"))
          return { page: "about", label: "View About Page" };
        if (banner.id.includes("events"))
          return { page: "events", label: "View Events Page" };
        if (banner.id.includes("ministries"))
          return { page: "ministries", label: "View Ministries" };
        if (banner.id.includes("give"))
          return { page: "give", label: "View Giving Page" };
        if (banner.id.includes("watch"))
          return { page: "watch-listen", label: "View Watch Page" };
        if (banner.id.includes("grow"))
          return { page: "grow", label: "View Grow Page" };
        if (banner.id.includes("prayer"))
          return { page: "prayer", label: "View Prayer Page" };
        if (banner.id.includes("contact"))
          return { page: "contact", label: "View Contact Page" };
        if (banner.id.includes("newhere"))
          return { page: "new-here", label: "View New Here Page" };
        if (banner.id.includes("gallery"))
          return { page: "gallery", label: "View Gallery Page" };
        return { page: "home", label: "View on Website" };
      default:
        return { page: "home", label: "View on Website" };
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#032014] text-white border border-[#c99726] px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-[#f5cf72] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#02180e] via-[#042d1b] to-[#02180e] rounded-2xl p-6 sm:p-8 text-white border border-[#c99726]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c99726]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#f5cf72] text-[11px] font-mono font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>MEDIA & ASSET MANAGEMENT PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title tracking-tight text-white">
              Banners & Card Graphics Manager
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              Upload, replace, and customize all 22 visual banner slots across
              the entire church website. Photos are automatically compressed
              into ultra-crisp web assets and saved persistently to your browser
              database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJson}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 backdrop-blur-sm transition-all flex items-center space-x-2 cursor-pointer"
              title="Download backup configuration of all banner URLs"
            >
              <Download className="w-4 h-4 text-[#f5cf72]" />
              <span>Export Roster (JSON)</span>
            </button>
            <button
              onClick={handleResetAll}
              className="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 rounded-xl text-xs font-bold border border-rose-500/30 transition-all flex items-center space-x-2 cursor-pointer"
              title="Reset all custom uploaded banners to original default assets"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Reset All to Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Sizes Designer Cheat Sheet */}
      <div className="bg-white rounded-2xl border border-[#d6e5dc] shadow-sm overflow-hidden">
        <button
          onClick={() => setShowGuideAccordion(!showGuideAccordion)}
          className="w-full px-6 py-4 bg-[#f8faf8] border-b border-[#e2ede6] flex items-center justify-between text-left hover:bg-[#eef6f1] transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#032014] text-[#f5cf72] flex items-center justify-center font-bold text-xs">
              📐
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#032014]">
                Church Media Team • Dimension Cheat Sheet & Design Guidelines
              </h3>
              <p className="text-xs text-slate-500">
                Official specifications for graphic designers creating flyers in
                Canva, Photoshop, or Figma
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#07472c]">
            <span>{showGuideAccordion ? "Hide Specs" : "View Specs"}</span>
            {showGuideAccordion ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {showGuideAccordion && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white text-xs">
            {/* Spec 1: Hero */}
            <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#d6e5dc] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#032014] text-sm">
                  Homepage Hero
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                  16:9
                </span>
              </div>
              <div className="text-base font-extrabold text-[#07472c] font-mono">
                1920 × 1080 px
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Full-width cinematic hero header. Keep key titles centered.
                Overlays are applied automatically.
              </p>
            </div>

            {/* Spec 2: Ministry Cards */}
            <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#d6e5dc] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#032014] text-sm">
                  Ministry Cards
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">
                  4:3 / 16:10
                </span>
              </div>
              <div className="text-base font-extrabold text-[#07472c] font-mono">
                800 × 600 px
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Used in Ministries Directory grid and Home Preview cards. Crisp
                group photos or ministry emblems.
              </p>
            </div>

            {/* Spec 3: Featured Events */}
            <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#d6e5dc] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#032014] text-sm">
                  Event & Summit Flyers
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                  16:9 Landscape
                </span>
              </div>
              <div className="text-base font-extrabold text-[#07472c] font-mono">
                1200 × 675 px
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                High-impact conference & prayer banners (Wisdom Summit, The
                Secret Place, All-Night).
              </p>
            </div>

            {/* Spec 4: Page Headers & Flyers */}
            <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#d6e5dc] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#032014] text-sm">
                  Giving Flyer & Page Headers
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                  4:5 / 3.2:1
                </span>
              </div>
              <div className="text-base font-extrabold text-[#07472c] font-mono">
                1080×1350 / 1920×600 px
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Giving flyer is portrait infographic. Page headers are wide
                panoramic top strips.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Category Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === cat.key
                  ? "bg-[#032014] text-[#f5cf72] shadow-md border border-[#c99726]/40"
                  : "bg-white text-slate-700 hover:bg-[#eef6f1] border border-[#d6e5dc]"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedCategory === cat.key
                    ? "bg-[#c99726] text-[#021a10]"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search banner, size, page..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#d6e5dc] text-xs focus:ring-2 focus:ring-[#07472c] focus:outline-none placeholder-slate-400 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanners.map((banner) => {
          const isCustom = banner.currentUrl !== banner.defaultUrl;
          const currentUrlValue = editingUrls[banner.id] ?? banner.currentUrl;
          const mode = activeTabMode[banner.id] || "upload";
          const detected = detectedDimensions[banner.id];
          const isCompressing = compressingId === banner.id;
          const routeInfo = getBannerPageRoute(banner);

          return (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${
                isCustom
                  ? "border-[#c99726] ring-1 ring-[#c99726]/30"
                  : "border-[#d6e5dc]"
              }`}
            >
              {/* Top Banner Card Info */}
              <div>
                {/* Visual Preview Container */}
                <div className="relative aspect-[16/9] bg-[#02180e] overflow-hidden group">
                  <img
                    src={currentUrlValue}
                    alt={banner.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== banner.defaultUrl) {
                        target.src = banner.defaultUrl;
                      }
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-[#02180e]/90 text-[#f5cf72] text-[10px] font-mono font-bold border border-[#c99726]/40 backdrop-blur-md">
                      {banner.categoryLabel}
                    </span>
                    {isCustom ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Custom Live</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[10px] font-medium backdrop-blur-md">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Dimension Overlay Badge */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyDimension(banner)}
                      className="px-2.5 py-1 rounded bg-[#02180e]/95 hover:bg-[#032014] text-[#f5cf72] text-[11px] font-mono font-bold border border-[#c99726]/60 backdrop-blur-md flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
                      title="Click to copy dimension for Canva / Photoshop"
                    >
                      <span>📏 {banner.recommendedSize}</span>
                      {copiedId === banner.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-70" />
                      )}
                    </button>

                    <button
                      onClick={() => setPreviewModalBanner(banner)}
                      className="p-1.5 rounded-lg bg-[#02180e]/90 hover:bg-[#032014] text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
                      title="Full Screen Preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#032014] font-serif-title leading-snug">
                      {banner.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[11px] text-slate-500 font-medium">
                        📍 {banner.location}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {banner.description}
                    </p>
                  </div>

                  {/* Recommended Aspect & Size Highlight Box */}
                  <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#d6e5dc] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        Target Size:
                      </span>
                      <span className="font-mono font-bold text-[#07472c]">
                        {banner.recommendedSize}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Aspect Ratio:</span>
                      <span className="font-medium text-slate-700">
                        {banner.aspectRatio}
                      </span>
                    </div>
                    {banner.designNotes && (
                      <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                        💡 {banner.designNotes}
                      </p>
                    )}
                  </div>

                  {/* Mode Selector Tabs (Upload File vs Direct URL) */}
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <button
                      onClick={() =>
                        setActiveTabMode((prev) => ({
                          ...prev,
                          [banner.id]: "upload",
                        }))
                      }
                      className={`text-xs font-bold pb-1 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                        mode === "upload"
                          ? "text-[#07472c] border-b-2 border-[#07472c]"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                    <button
                      onClick={() =>
                        setActiveTabMode((prev) => ({
                          ...prev,
                          [banner.id]: "url",
                        }))
                      }
                      className={`text-xs font-bold pb-1 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                        mode === "url"
                          ? "text-[#07472c] border-b-2 border-[#07472c]"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Image URL / Imgur</span>
                    </button>
                  </div>

                  {/* Mode A: File Upload UI */}
                  {mode === "upload" && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        ref={(el) => {
                          fileInputRefs.current[banner.id] = el;
                        }}
                        onChange={(e) => handleFileUpload(banner, e)}
                        className="hidden"
                      />
                      <div
                        onClick={() =>
                          fileInputRefs.current[banner.id]?.click()
                        }
                        className="border-2 border-dashed border-[#c2decc] hover:border-[#07472c] bg-[#f8faf8] hover:bg-[#eef6f1] rounded-xl p-4 text-center cursor-pointer transition-all space-y-1 group relative"
                      >
                        {isCompressing ? (
                          <div className="py-2 flex flex-col items-center justify-center space-y-1">
                            <Loader2 className="w-6 h-6 text-[#07472c] animate-spin" />
                            <span className="text-xs font-bold text-[#07472c]">
                              Optimizing & Compressing...
                            </span>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-6 h-6 text-[#07472c] mx-auto group-hover:scale-110 transition-transform" />
                            <div className="text-xs font-bold text-[#032014]">
                              Choose Photo or Drag & Drop
                            </div>
                            <p className="text-[10px] text-slate-500">
                              PNG, JPG, WebP • Auto-optimized for instant site
                              loading
                            </p>
                          </>
                        )}
                      </div>

                      {/* Dimension & size verification badge */}
                      {detected && (
                        <div
                          className={`p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
                            detected.status === "match"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : detected.status === "close"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-orange-50 text-orange-800 border border-orange-200"
                          }`}
                        >
                          {detected.status === "match" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <div className="text-[11px] leading-tight">
                            <span>
                              Dimensions:{" "}
                              <strong>
                                {detected.width} × {detected.height} px
                              </strong>
                            </span>
                            {detected.sizeInfo && (
                              <span className="block text-[10px] opacity-80 mt-0.5 font-mono">
                                {detected.sizeInfo}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode B: Direct URL Input UI */}
                  {mode === "url" && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Direct Image URL (Imgur, Unsplash, CDN):
                      </label>
                      <input
                        type="url"
                        value={currentUrlValue}
                        onChange={(e) => {
                          handleUrlInputChange(banner.id, e.target.value);
                          if (e.target.value.startsWith("http")) {
                            measureImageDimensions(
                              banner.id,
                              e.target.value,
                              banner.width,
                              banner.height,
                            );
                          }
                        }}
                        placeholder="https://i.imgur.com/example.jpg"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#d6e5dc] text-xs focus:ring-2 focus:ring-[#07472c] focus:outline-none font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-2.5">
                <div className="flex items-center gap-2 pt-3">
                  <button
                    onClick={() => handleSaveBanner(banner)}
                    className="flex-1 py-2.5 bg-[#032014] hover:bg-[#07472c] text-[#f5cf72] font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center space-x-1.5 border border-[#c99726]/40"
                  >
                    <Check className="w-4 h-4 text-[#f5cf72]" />
                    <span>Save Live Banner</span>
                  </button>

                  {isCustom && (
                    <button
                      onClick={() => handleResetSingle(banner)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
                      title="Reset this banner to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Live Preview Link */}
                {onNavigate && (
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate(routeInfo.page, routeInfo.subTab)
                      }
                      className="text-[#07472c] hover:text-[#c99726] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{routeInfo.label}</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </button>
                    {banner.updatedAt && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {banner.updatedAt}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Lightbox Preview Modal */}
      {previewModalBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#02180e] border border-[#c99726]/60 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#032014] border-b border-[#084c2e] flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <span className="font-bold font-serif-title">
                  {previewModalBanner.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#c99726]/20 text-[#f5cf72] text-[10px] font-mono">
                  {previewModalBanner.recommendedSize}
                </span>
              </div>
              <button
                onClick={() => setPreviewModalBanner(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={
                  editingUrls[previewModalBanner.id] ||
                  previewModalBanner.currentUrl
                }
                alt={previewModalBanner.name}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg border border-white/10"
              />
            </div>

            <div className="p-4 bg-[#032014] border-t border-[#084c2e] flex items-center justify-between text-xs text-emerald-200">
              <span>📍 {previewModalBanner.location}</span>
              <button
                onClick={() => setPreviewModalBanner(null)}
                className="px-4 py-2 rounded-xl bg-[#c99726] text-[#021a10] font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
