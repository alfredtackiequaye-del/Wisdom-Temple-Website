import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
      className={`z-40 w-full text-white ${
        currentPage === "home"
          ? "absolute top-0 left-0 bg-transparent"
          : "sticky top-0 bg-[#032014] shadow-xl border-b border-[#c99726]/30"
      }`}
    >
      {/* Top Utility Announcement Bar - ICGC Official Deep Forest & Gold */}
      <div
        className={`${currentPage === "home" ? "hidden" : "hidden md:flex"} justify-between items-center px-4 lg:px-8 py-2 bg-[#02170e]/85 text-xs text-emerald-100/80 border-b border-[#05321f]/70`}
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 text-[#e5b138] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#e5b138]" />
            <span>
              Sundays: <strong>8:00 AM</strong>
            </span>
            <span className="text-emerald-800">|</span>
            <span>
              The Secret Place (Wed): <strong>7:00 PM</strong>
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-200/70">
            <MapPin className="w-3.5 h-3.5 text-[#c99726]" />
            <span>{CHURCH_INFO.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={() => handleNavClick("about", "leadership")}
            className="hover:text-[#f5cf72] transition-colors font-medium cursor-pointer text-[#e5b138]"
          >
            Our Leadership
          </button>
          <span className="text-emerald-900">•</span>
          <button
            onClick={() => handleNavClick("new-here")}
            className="hover:text-[#f5cf72] transition-colors font-medium cursor-pointer"
          >
            I'm New Here
          </button>
          <span className="text-emerald-900">•</span>
          <button
            onClick={() => handleNavClick("prayer")}
            className="hover:text-[#f5cf72] transition-colors cursor-pointer"
          >
            Request Prayer
          </button>
          <span className="text-emerald-900">•</span>
          <button
            onClick={() => handleNavClick("admin")}
            className="text-emerald-300 hover:text-[#f5cf72] font-semibold transition-colors cursor-pointer flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#042819] hover:bg-[#073c25] border border-[#c99726]/40"
            title="Church Leadership & Staff Administration"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#c99726]" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

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
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick("home")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "home"
                  ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                  : "text-emerald-100 hover:text-white hover:bg-[#063821]"
              }`}
            >
              HOME
            </button>

            {/* Plan A Visit (Signature Modern Church Navigation) */}
            <button
              onClick={() => handleNavClick("new-here")}
              className={`px-3 py-2 rounded-md transition-all font-semibold ${
                currentPage === "new-here"
                  ? "text-[#fce49e] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                  : "text-emerald-100 hover:text-white hover:bg-[#063821]"
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
                    ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                    : "text-emerald-100 hover:text-white hover:bg-[#063821]"
                }`}
              >
                <span>ABOUT</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#c99726]" />
              </button>

              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 w-56 bg-[#042d1c] border border-[#c99726]/30 rounded-lg shadow-2xl py-2 mt-0 z-50 backdrop-blur-md"
                  >
                    <button
                      onClick={() => handleNavClick("about", "who-we-are")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Who We Are
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "vision-mission")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Our Vision & Mission
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "beliefs")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Our Beliefs
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "leadership")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Our Leadership
                    </button>
                    <button
                      onClick={() => handleNavClick("about", "story")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Our Story & Heritage
                    </button>
                  </motion.div>
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
                    ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                    : "text-emerald-100 hover:text-white hover:bg-[#063821]"
                }`}
              >
                <span>WATCH</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#c99726]" />
              </button>

              <AnimatePresence>
                {watchDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 w-56 bg-[#042d1c] border border-[#c99726]/30 rounded-lg shadow-2xl py-2 mt-0 z-50 backdrop-blur-md"
                  >
                    <button
                      onClick={() => handleNavClick("watch-listen", "all")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      All Sermons & Media
                    </button>
                    <button
                      onClick={() =>
                        handleNavClick("watch-listen", "Sunday Message")
                      }
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Sunday Messages
                    </button>
                    <button
                      onClick={() =>
                        handleNavClick("watch-listen", "The Secret Place")
                      }
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      The Secret Place (Wednesdays)
                    </button>
                    <button
                      onClick={() =>
                        handleNavClick("watch-listen", "Wisdom Summit")
                      }
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Wisdom Summit Archive
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grow */}
            <button
              onClick={() => handleNavClick("grow")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "grow"
                  ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                  : "text-emerald-100 hover:text-white hover:bg-[#063821]"
              }`}
            >
              GROW
            </button>

            {/* Ministries */}
            <button
              onClick={() => handleNavClick("ministries")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "ministries"
                  ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                  : "text-emerald-100 hover:text-white hover:bg-[#063821]"
              }`}
            >
              MINISTRIES
            </button>

            {/* Events */}
            <button
              onClick={() => handleNavClick("events")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "events"
                  ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                  : "text-emerald-100 hover:text-white hover:bg-[#063821]"
              }`}
            >
              EVENTS
            </button>

            {/* Photo Gallery */}
            <button
              onClick={() => handleNavClick("gallery")}
              className={`px-3 py-2 rounded-md transition-all ${
                currentPage === "gallery"
                  ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                  : "text-emerald-100 hover:text-white hover:bg-[#063821]"
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
                onClick={() => handleNavClick("connect")}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                  currentPage === "connect" ||
                  currentPage === "new-here" ||
                  currentPage === "prayer" ||
                  currentPage === "contact"
                    ? "text-[#f5cf72] bg-[#07472c] font-bold border-b-2 border-[#c99726]"
                    : "text-emerald-100 hover:text-white hover:bg-[#063821]"
                }`}
              >
                <span>CONNECT</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#c99726]" />
              </button>

              <AnimatePresence>
                {connectDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 w-56 bg-[#042d1c] border border-[#c99726]/30 rounded-lg shadow-2xl py-2 mt-0 z-50 backdrop-blur-md"
                  >
                    <button
                      onClick={() => handleNavClick("new-here")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      I'm New / Plan Your Visit
                    </button>
                    <button
                      onClick={() => handleNavClick("prayer")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Prayer Request
                    </button>
                    <button
                      onClick={() => handleNavClick("contact")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Contact Us
                    </button>
                    <button
                      onClick={() => handleNavClick("connect", "membership")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Membership & Growth
                    </button>
                    <button
                      onClick={() => handleNavClick("connect", "testimonies")}
                      className="w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-[#085233] hover:text-[#f5cf72] transition-colors"
                    >
                      Member Testimonies
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action: Give Button */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <button
              onClick={() => handleNavClick("admin")}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-white/35 bg-black/10 text-white/90 hover:bg-white/10 hover:text-[#f5cf72] font-semibold text-[10px] uppercase tracking-[0.12em] transition-colors cursor-pointer"
              title="Open church staff administration portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#f5cf72]" />
              <span>Staff Portal</span>
            </button>
            <button
              onClick={() => handleNavClick("give")}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              id="nav-give-btn"
            >
              <Heart className="w-3.5 h-3.5 fill-[#021a10] text-[#021a10]" />
              <span>GIVE</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick("give")}
              className="px-3.5 py-1.5 rounded-md bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider flex items-center space-x-1"
            >
              <Heart className="w-3 h-3 fill-[#021a10]" />
              <span>GIVE</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-emerald-200 hover:text-white hover:bg-[#063821] focus:outline-none cursor-pointer transition-colors"
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="xl:hidden bg-[#032014] border-t border-[#c99726]/30 px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto"
          >
            {/* Quick Schedule Reminder */}
            <div className="p-3 bg-[#02170e] rounded-lg border border-[#063c24] text-xs text-emerald-200/90 space-y-1">
              <div className="flex items-center space-x-1 text-[#f5cf72] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#c99726]" />
                <span>Sunday: 8:00 AM | Secret Place (Wed): 7:00 PM</span>
              </div>
              <div className="text-emerald-300/80 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#c99726]" />
                <span>{CHURCH_INFO.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleNavClick("home")}
                className={`p-3 rounded-lg text-left text-sm font-semibold transition-colors ${currentPage === "home" ? "bg-[#c99726] text-[#021a10] font-bold" : "bg-[#063821] text-white hover:bg-[#084c2e]"}`}
              >
                HOME
              </button>
              <button
                onClick={() => handleNavClick("new-here")}
                className={`p-3 rounded-lg text-left text-sm font-semibold transition-colors ${currentPage === "new-here" ? "bg-[#c99726] text-[#021a10] font-bold" : "bg-[#063821] text-[#f5cf72] hover:bg-[#084c2e]"}`}
              >
                ✨ PLAN A VISIT
              </button>
            </div>

            <div className="pt-2 space-y-1">
              <button
                onClick={() => handleNavClick("about")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] transition-colors"
              >
                ABOUT THE CHURCH
              </button>
              <button
                onClick={() => handleNavClick("about", "leadership")}
                className="w-full text-left pl-6 pr-3 py-2 rounded-md text-xs font-semibold text-[#f5cf72] hover:bg-[#07472c] flex items-center space-x-1.5 transition-colors"
              >
                <span>↳ Our Pastoral Leadership</span>
              </button>
              <button
                onClick={() => handleNavClick("watch-listen")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] flex items-center justify-between transition-colors"
              >
                <span>WATCH & LISTEN</span>
                <Headphones className="w-4 h-4 text-[#e5b138]" />
              </button>
              <button
                onClick={() => handleNavClick("grow")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] transition-colors"
              >
                GROW (BIBLE & DEVOTIONALS)
              </button>
              <button
                onClick={() => handleNavClick("ministries")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] transition-colors"
              >
                MINISTRIES DIRECTORY
              </button>
              <button
                onClick={() => handleNavClick("events")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] flex items-center justify-between transition-colors"
              >
                <span>EVENTS & WISDOM SUMMIT</span>
                <Sparkles className="w-4 h-4 text-[#e5b138]" />
              </button>
              <button
                onClick={() => handleNavClick("gallery")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] flex items-center justify-between transition-colors"
              >
                <span>PHOTO GALLERY & MOMENTS</span>
                <Camera className="w-4 h-4 text-[#e5b138]" />
              </button>
              <button
                onClick={() => handleNavClick("prayer")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] transition-colors"
              >
                PRAYER REQUEST
              </button>
              <button
                onClick={() => handleNavClick("contact")}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-[#07472c] hover:text-[#f5cf72] transition-colors"
              >
                CONTACT US
              </button>
            </div>

            <div className="pt-4 border-t border-[#063c24]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick("give")}
                className="w-full py-3 rounded-lg bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm"
              >
                <Heart className="w-4 h-4 fill-[#021a10]" />
                <span>GIVE / FIRST FRUIT & OFFERINGS</span>
              </motion.button>

              <button
                onClick={() => handleNavClick("admin")}
                className="w-full mt-3 py-2.5 rounded-xl bg-[#042819] hover:bg-[#063821] text-center text-xs font-mono font-bold text-emerald-300 hover:text-[#f5cf72] border border-[#0d5533] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#c99726]" />
                <span>CHURCH ADMINISTRATION PORTAL</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
