import React, { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { PageId } from "../types";
import { CHURCH_INFO } from "../data/churchData";
import { ICGCLogo } from "./ICGCLogo";
import {
  Menu,
  X,
  ChevronDown,
  Clock,
  MapPin,
  Heart,
  Headphones,
  Sparkles,
  ShieldCheck,
  Camera,
} from "lucide-react";

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, subTab?: string) => void;
  unreadAdminCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  unreadAdminCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [watchDropdownOpen, setWatchDropdownOpen] = useState(false);
  const [connectDropdownOpen, setConnectDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = currentPage === "home";
  // Frosted glass: the page shows through, the menu stays readable over photos.
  const frosted =
    "bg-forest-900/[0.97] backdrop-blur-md border-b border-gold-500/25 shadow-lg shadow-black/25";

  const handleNavClick = (page: PageId, subTab?: string) => {
    onNavigate(page, subTab);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setWatchDropdownOpen(false);
    setConnectDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`z-40 w-full text-white transition-[background-color,box-shadow,border-color] duration-300 ${
        isHome
          ? // Clear over the home hero, frosted once the page scrolls.
            `fixed top-0 left-0 ${scrolled || mobileMenuOpen ? frosted : "bg-transparent border-b border-transparent"}`
          : `sticky top-0 ${frosted}`
      }`}
    >
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          {/* Official ICGC Logo Identity in Pure White */}
          <div
            onClick={() => handleNavClick("home")}
            className="cursor-pointer select-none group"
            id="brand-logo"
          >
            <ICGCLogo
              size="md"
              variant="horizontal"
              theme="dark"
              forceWhite={true}
            />
          </div>

          {/* Desktop Navigation Links - Legacy Hills Church Streamlined Structure */}
          <nav className="hidden xl:flex items-center space-x-0.5 2xl:space-x-2 text-sm font-medium whitespace-nowrap">
            <button
              onClick={() => handleNavClick("home")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "home"
                  ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                  : "text-emerald-100 hover:text-white hover:bg-forest-800"
              }`}
            >
              HOME
            </button>

            {/* Plan A Visit (Signature Modern Church Navigation) */}
            <button
              onClick={() => handleNavClick("new-here")}
              className={`px-3 py-2 rounded-md transition-all font-semibold ${
                currentPage === "new-here"
                  ? "text-gold-200 bg-forest-700 font-bold border-b-2 border-gold-500"
                  : "text-emerald-100 hover:text-white hover:bg-forest-800"
              }`}
            >
              PLAN A VISIT
            </button>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick("about")}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                  currentPage === "about"
                    ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                    : "text-emerald-100 hover:text-white hover:bg-forest-800"
                }`}
              >
                <span>ABOUT</span>
                <ChevronDown className="w-3.5 h-3.5 text-gold-500" />
              </button>

              <AnimatePresence>
                {aboutDropdownOpen && (
                  <m.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 flex flex-col w-56 bg-forest-850 border border-gold-500/30 rounded-lg shadow-2xl py-2 mt-0 z-50 backdrop-blur-md"
                  >
                    <button
                      onClick={() => handleNavClick("about", "who-we-are")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Who We Are
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "vision-mission")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Our Vision & Mission
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "beliefs")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Our Beliefs
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "leadership")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Our Leadership
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "story")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Our Story & Heritage
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Watch & Listen Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setWatchDropdownOpen(true)}
              onMouseLeave={() => setWatchDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick("watch-listen")}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                  currentPage === "watch-listen"
                    ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                    : "text-emerald-100 hover:text-white hover:bg-forest-800"
                }`}
              >
                <span>WATCH</span>
                <ChevronDown className="w-3.5 h-3.5 text-gold-500" />
              </button>

              <AnimatePresence>
                {watchDropdownOpen && (
                  <m.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 flex flex-col w-56 bg-forest-850 border border-gold-500/30 rounded-lg shadow-2xl py-2 mt-0 z-50 backdrop-blur-md"
                  >
                    <button
                      onClick={() => handleNavClick("watch-listen", "all")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      All Sermons & Media
                    </button>
                    <button
                      onClick={() =>
                        handleNavClick("watch-listen", "Sunday Message")
                      }
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Sunday Messages
                    </button>
                    <button
                      onClick={() =>
                        handleNavClick("watch-listen", "The Secret Place")
                      }
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      The Secret Place (Wednesdays)
                    </button>
                    <button
                      onClick={() =>
                        handleNavClick("watch-listen", "Wisdom Summit")
                      }
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Wisdom Summit Archive
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grow */}
            <button
              onClick={() => handleNavClick("grow")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "grow"
                  ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                  : "text-emerald-100 hover:text-white hover:bg-forest-800"
              }`}
            >
              GROW
            </button>

            {/* Ministries */}
            <button
              onClick={() => handleNavClick("ministries")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "ministries"
                  ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                  : "text-emerald-100 hover:text-white hover:bg-forest-800"
              }`}
            >
              MINISTRIES
            </button>

            {/* Events */}
            <button
              onClick={() => handleNavClick("events")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "events"
                  ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                  : "text-emerald-100 hover:text-white hover:bg-forest-800"
              }`}
            >
              EVENTS
            </button>

            {/* Photo Gallery */}
            <button
              onClick={() => handleNavClick("gallery")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "gallery"
                  ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                  : "text-emerald-100 hover:text-white hover:bg-forest-800"
              }`}
            >
              GALLERY
            </button>

            {/* Connect Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setConnectDropdownOpen(true)}
              onMouseLeave={() => setConnectDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick("contact")}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                  currentPage === "connect" ||
                  currentPage === "prayer" ||
                  currentPage === "prayer-request" ||
                  currentPage === "contact"
                    ? "text-gold-300 bg-forest-700 font-bold border-b-2 border-gold-500"
                    : "text-emerald-100 hover:text-white hover:bg-forest-800"
                }`}
              >
                <span>CONNECT</span>
                <ChevronDown className="w-3.5 h-3.5 text-gold-500" />
              </button>

              <AnimatePresence>
                {connectDropdownOpen && (
                  <m.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 flex flex-col w-56 bg-forest-850 border border-gold-500/30 rounded-lg shadow-2xl py-2 mt-0 z-50 backdrop-blur-md"
                  >
                    <button
                      onClick={() => handleNavClick("new-here")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      I'm New / Plan Your Visit
                    </button>
                    <button
                      onClick={() => handleNavClick("prayer")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Prayer Request
                    </button>
                    <button
                      onClick={() => handleNavClick("contact")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Contact Us
                    </button>
                    <button
                      onClick={() => handleNavClick("grow")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-forest-600 hover:text-gold-300 transition-colors"
                    >
                      Membership & Growth
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action: Give Button */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <button
              onClick={() => handleNavClick("give")}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              id="nav-give-btn"
            >
              <Heart className="w-3.5 h-3.5 fill-forest-950 text-forest-950" />
              <span>GIVE</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick("give")}
              className="px-3.5 py-1.5 rounded-md bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-1"
            >
              <Heart className="w-3 h-3 fill-forest-950" />
              <span>GIVE</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-emerald-200 hover:text-white hover:bg-forest-800 focus:outline-none cursor-pointer transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu in ICGC Deep Forest & Gold */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="xl:hidden bg-forest-900 border-t border-gold-500/30 px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto"
          >
            {/* Quick Schedule Reminder */}
            <div className="p-3 bg-forest-950 rounded-lg border border-forest-800 text-xs text-emerald-200/90 space-y-1">
              <div className="flex items-center space-x-1 text-gold-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                <span>Sunday: 8:00 AM | Secret Place (Wed): 7:00 PM</span>
              </div>
              <div className="text-emerald-300/80 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-gold-500" />
                <span>{CHURCH_INFO.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleNavClick("home")}
                className={`p-3 rounded-lg text-left text-sm font-semibold transition-colors ${currentPage === "home" ? "bg-gold-500 text-forest-950 font-bold" : "bg-forest-800 text-white hover:bg-forest-700"}`}
              >
                HOME
              </button>
              <button
                onClick={() => handleNavClick("new-here")}
                className={`p-3 rounded-lg text-left text-sm font-semibold transition-colors ${currentPage === "new-here" ? "bg-gold-500 text-forest-950 font-bold" : "bg-forest-800 text-gold-300 hover:bg-forest-700"}`}
              >
                ✨ PLAN A VISIT
              </button>
            </div>

            <div className="pt-2 space-y-1">
              <button
                onClick={() => handleNavClick("about")}
                aria-current={["about"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${["about"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                ABOUT THE CHURCH
              </button>
              <button
                onClick={() => handleNavClick("about", "leadership")}
                className="w-full text-left pl-6 pr-3 py-2 rounded-md text-xs font-semibold text-gold-300 hover:bg-forest-700 flex items-center space-x-1.5 transition-colors"
              >
                <span>↳ Our Pastoral Leadership</span>
              </button>
              <button
                onClick={() => handleNavClick("watch-listen")}
                aria-current={["watch-listen"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${["watch-listen"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                <span>WATCH & LISTEN</span>
                <Headphones className="w-4 h-4 text-gold-400" />
              </button>
              <button
                onClick={() => handleNavClick("grow")}
                aria-current={["grow"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${["grow"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                GROW (BIBLE & DEVOTIONALS)
              </button>
              <button
                onClick={() => handleNavClick("ministries")}
                aria-current={["ministries"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${["ministries"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                MINISTRIES DIRECTORY
              </button>
              <button
                onClick={() => handleNavClick("events")}
                aria-current={["events"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${["events"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                <span>EVENTS & WISDOM SUMMIT</span>
                <Sparkles className="w-4 h-4 text-gold-400" />
              </button>
              <button
                onClick={() => handleNavClick("gallery")}
                aria-current={["gallery"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${["gallery"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                <span>PHOTO GALLERY & MOMENTS</span>
                <Camera className="w-4 h-4 text-gold-400" />
              </button>
              <button
                onClick={() => handleNavClick("prayer")}
                aria-current={["prayer", "prayer-request"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${["prayer", "prayer-request"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                PRAYER REQUEST
              </button>
              <button
                onClick={() => handleNavClick("contact")}
                aria-current={["contact"].includes(currentPage) ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${["contact"].includes(currentPage) ? "bg-forest-700 text-gold-300 font-bold border-l-2 border-gold-400" : "font-medium text-emerald-100 hover:bg-forest-700 hover:text-gold-300"}`}
              >
                CONTACT US
              </button>
            </div>

            <div className="pt-4 border-t border-forest-800">
              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick("give")}
                className="w-full py-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm"
              >
                <Heart className="w-4 h-4 fill-forest-950" />
                <span>GIVE / FIRST FRUIT & OFFERINGS</span>
              </m.button>

            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};
