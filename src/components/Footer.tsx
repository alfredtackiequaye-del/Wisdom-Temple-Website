import React, { useState } from 'react';
import { PageId } from '../types';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Youtube,
  Send,
  Lock
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId, subTab?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    }
  };

  const handleNav = (page: PageId, subTab?: string) => {
    onNavigate(page, subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#02140c] text-emerald-100/80 border-t-2 border-[#c99726]/40 relative overflow-hidden" id="main-footer">
      {/* Newsletter / Bulletin Bar */}
      <div className="bg-[#042015] border-b border-[#084c2e]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="text-xs font-semibold text-[#dfb15b] uppercase tracking-[0.2em] mb-2">
                Weekly Bulletin & Devotionals
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Stay connected with our church family.
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/70 mt-1 max-w-xl">
                Receive weekly sermon highlights, prayer focuses, and church announcements straight to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {newsletterSubmitted ? (
                <div className="p-3.5 bg-[#042819] border border-[#0f7646] rounded-xl flex items-center space-x-3 text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-[#f5cf72] shrink-0" />
                  <span className="text-xs font-medium">Thank you for subscribing! You will receive our next church bulletin.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2.5 bg-[#02170e] border border-[#094c2d] rounded-lg text-white placeholder-emerald-400/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726] focus:border-[#c99726]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory - Clean, Simple, Professional 3-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Connect & Social Channels */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#f5cf72] uppercase tracking-wider border-b border-[#084c2e] pb-2">
              Connect With Us
            </h4>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Stay inspired and connected through our official media broadcasts, weekly live streams, and ministry updates.
            </p>

            {/* Official Social Links */}
            <div className="pt-1">
              <div className="flex items-center space-x-2.5">
                <a
                  href="https://www.youtube.com/@icgcwisdomtemple"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#032416] border border-[#084c2e] hover:border-[#c99726] text-emerald-300 hover:text-[#f5cf72] flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                  aria-label="YouTube"
                  title="YouTube @icgcwisdomtemple"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#032416] border border-[#084c2e] hover:border-[#c99726] text-emerald-300 hover:text-[#f5cf72] flex items-center justify-center transition-all hover:scale-105 shadow-sm font-bold text-xs"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#032416] border border-[#084c2e] hover:border-[#c99726] text-emerald-300 hover:text-[#f5cf72] flex items-center justify-center transition-all hover:scale-105 shadow-sm font-bold text-xs"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  ig
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#032416] border border-[#084c2e] hover:border-[#c99726] text-emerald-300 hover:text-[#f5cf72] flex items-center justify-center transition-all hover:scale-105 shadow-sm font-bold text-xs"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  tt
                </a>
                <button
                  onClick={() => handleNav('contact')}
                  className="w-9 h-9 rounded-full bg-[#032416] border border-[#084c2e] hover:border-[#c99726] text-emerald-300 hover:text-[#f5cf72] flex items-center justify-center transition-all hover:scale-105 shadow-sm cursor-pointer"
                  aria-label="Send Message"
                  title="Contact Church Office"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#f5cf72] uppercase tracking-wider border-b border-[#084c2e] pb-2">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
              <button onClick={() => handleNav('about')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                About Us
              </button>
              <button onClick={() => handleNav('watch-listen')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                Sermons & Media
              </button>
              <button onClick={() => handleNav('ministries')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                Ministries
              </button>
              <button onClick={() => handleNav('events')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                Events Calendar
              </button>
              <button onClick={() => handleNav('gallery')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                Photo Gallery
              </button>
              <button onClick={() => handleNav('prayer')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                Prayer Requests
              </button>
              <button onClick={() => handleNav('new-here')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                Plan a Visit
              </button>
              <button onClick={() => handleNav('contact')} className="text-left hover:text-[#f5cf72] transition-colors cursor-pointer py-0.5">
                Contact Office
              </button>
              <button 
                onClick={() => handleNav('give')} 
                className="col-span-2 text-left hover:text-white transition-colors text-[#f5cf72] font-bold flex items-center space-x-1.5 cursor-pointer pt-1"
              >
                <Heart className="w-3.5 h-3.5 fill-[#c99726] text-[#c99726]" />
                <span>Give Online (Tithes & Offering)</span>
              </button>
              <button 
                onClick={() => handleNav('admin')} 
                className="col-span-2 text-left hover:text-white transition-colors text-emerald-300/80 font-medium flex items-center space-x-1.5 cursor-pointer pt-0.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#c99726]" />
                <span>Church Staff Administration</span>
              </button>
            </div>
          </div>

          {/* Column 3: Church Office & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#f5cf72] uppercase tracking-wider border-b border-[#084c2e] pb-2">
              Church Office & Sanctuary
            </h4>
            <div className="space-y-3 text-xs text-emerald-200/80">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#c99726] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block text-xs">Sanctuary</span>
                  <span className="text-emerald-300/80 text-[11px] leading-relaxed block">
                    Star Junction, Tabora — Accra, Ghana
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-[#c99726] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block text-xs">WhatsApp / Phone</span>
                  <a 
                    href="https://wa.me/233245009764" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-300 hover:text-[#f5cf72] transition-colors font-mono text-xs"
                  >
                    0245009764
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-[#c99726] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block text-xs">Official Email</span>
                  <a 
                    href="mailto:icgcwisdomtemple@gmail.com" 
                    className="text-emerald-300 hover:text-[#f5cf72] transition-colors text-xs"
                  >
                    icgcwisdomtemple@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#c99726] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block text-xs">Office Hours</span>
                  <span className="text-emerald-300/80 text-[11px] block">
                    Tuesday – Friday: 8:30 AM – 4:30 PM
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => handleNav('contact')}
                  className="w-full py-2 px-3 bg-[#032416] hover:bg-[#04331f] border border-[#084c2e] hover:border-[#c99726]/50 rounded-lg text-emerald-200 hover:text-white text-xs font-semibold text-center transition-all cursor-pointer"
                >
                  Get Directions & Contact Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Clean Links */}
        <div className="mt-10 pt-6 border-t border-[#084c2e]/60 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-400/70 gap-3">
          <p>© 2026 ICGC. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
            <button onClick={() => handleNav('about', 'beliefs')} className="hover:text-white transition-colors cursor-pointer">
              Statement of Faith
            </button>
            <span>•</span>
            <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer">
              Church Secretariat
            </button>
            <span>•</span>
            <button 
              onClick={() => handleNav('admin')} 
              className="text-[#f5cf72] hover:text-white font-medium flex items-center space-x-1.5 transition-colors cursor-pointer bg-[#042819] hover:bg-[#073c25] px-2.5 py-1 rounded-lg border border-[#c99726]/40"
              title="Church Staff Administration Portal"
            >
              <Lock className="w-3 h-3 text-[#c99726]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
