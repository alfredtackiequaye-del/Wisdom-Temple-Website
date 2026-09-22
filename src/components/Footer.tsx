import React, { useState } from 'react';
import { PageId } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { ICGCLogo } from './ICGCLogo';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
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
    <footer className="bg-[#02170e] text-emerald-100/80 border-t-2 border-[#c99726]/40 relative overflow-hidden" id="main-footer">
      {/* Newsletter / Stay Connected Bar in ICGC Forest & Gold */}
      <div className="bg-gradient-to-r from-[#032014] via-[#042819] to-[#032014] border-b border-[#084c2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c99726]/15 text-[#f5cf72] border border-[#c99726]/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#e5b138]" />
                <span>STAY CONNECTED WITH WISDOM TEMPLE</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Receive church updates, weekly messages, and devotional encouragement.
              </h3>
              <p className="text-sm text-emerald-200/70 mt-2 max-w-xl">
                Join our spiritual community bulletin. We send monthly sermon highlights, prayer focuses, and conference alerts directly to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {newsletterSubmitted ? (
                <div className="p-4 bg-[#05321f] border border-[#0f7646] rounded-xl flex items-center space-x-3 text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-[#f5cf72] shrink-0" />
                  <span className="text-sm font-medium">Thank you for subscribing! You will receive our next community bulletin.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-[#02170e] border border-[#094c2d] rounded-xl text-white placeholder-emerald-400/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726] focus:border-[#c99726]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl transition-all shadow-md hover:shadow-[#c99726]/20 whitespace-nowrap cursor-pointer"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Church Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => handleNav('home')}>
              <ICGCLogo size="md" variant="horizontal" theme="dark" forceWhite={true} />
            </div>
            
            <p className="text-sm text-emerald-200/70 leading-relaxed max-w-sm">
              {CHURCH_INFO.description}
            </p>

            {/* Service Times Highlight */}
            <div className="p-4 bg-[#032416] rounded-xl border border-[#c99726]/30 space-y-2.5">
              <div className="flex items-center space-x-2 text-[#f5cf72] font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#c99726]" />
                <span>WEEKLY WORSHIP SERVICES</span>
              </div>
              <div className="text-xs text-emerald-100 space-y-1">
                <div className="flex justify-between border-b border-[#063c24] pb-1.5">
                  <span className="font-semibold text-white">Sunday Celebration</span>
                  <span className="text-[#f5cf72] font-black">8:00 AM</span>
                </div>
                <div className="flex justify-between pt-1">
                  <div>
                    <span className="font-semibold text-white">The Secret Place</span>
                    <span className="block text-[11px] text-emerald-300/70">Midweek Prayer & Encounter</span>
                  </div>
                  <span className="text-[#f5cf72] font-black">Wed 7:00 PM</span>
                </div>
              </div>
            </div>

            {/* Social Media Placeholders */}
            <div className="pt-2">
              <span className="text-xs text-[#e5b138] block mb-2 font-bold tracking-wider">OFFICIAL SOCIAL CHANNELS</span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 bg-[#042819] border border-[#084c2e] rounded text-emerald-200">
                  {CHURCH_INFO.social.facebook}
                </span>
                <span className="px-2.5 py-1 bg-[#042819] border border-[#084c2e] rounded text-emerald-200">
                  {CHURCH_INFO.social.instagram}
                </span>
                <span className="px-2.5 py-1 bg-[#042819] border border-[#084c2e] rounded text-emerald-200">
                  {CHURCH_INFO.social.youtube}
                </span>
                <span className="px-2.5 py-1 bg-[#042819] border border-[#084c2e] rounded text-emerald-200">
                  {CHURCH_INFO.social.tiktok}
                </span>
                <span className="px-2.5 py-1 bg-[#042819] border border-[#084c2e] rounded text-emerald-200">
                  {CHURCH_INFO.social.x}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#f5cf72] uppercase tracking-wider border-b border-[#084c2e] pb-2">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#f5cf72] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#f5cf72] transition-colors">
                  About the Church
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('watch-listen')} className="hover:text-[#f5cf72] transition-colors">
                  Sermons & Media
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('events')} className="hover:text-[#f5cf72] transition-colors">
                  Events & Conferences
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#f5cf72] transition-colors">
                  Photo Gallery & Moments
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ministries')} className="hover:text-[#f5cf72] transition-colors">
                  Ministries
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('grow')} className="hover:text-[#f5cf72] transition-colors">
                  Grow & Discipleship
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('give')} className="hover:text-white transition-colors text-[#f5cf72] font-bold flex items-center space-x-1">
                  <Heart className="w-3.5 h-3.5 fill-[#c99726] text-[#c99726]" />
                  <span>Give Online</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect & Visitor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#f5cf72] uppercase tracking-wider border-b border-[#084c2e] pb-2">
              CONNECT WITH US
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('new-here')} className="hover:text-[#f5cf72] transition-colors font-medium text-white flex items-center space-x-1">
                  <span>I'm New (Plan Your Visit)</span>
                  <ArrowRight className="w-3 h-3 text-[#c99726]" />
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('prayer')} className="hover:text-[#f5cf72] transition-colors">
                  Prayer Request
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#f5cf72] transition-colors">
                  Contact Church Office
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('connect', 'membership')} className="hover:text-[#f5cf72] transition-colors">
                  Membership Classes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('connect', 'testimonies')} className="hover:text-[#f5cf72] transition-colors">
                  Share Your Testimony
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('events', 'wisdom-summit')} className="hover:text-[#f5cf72] transition-colors">
                  Wisdom Summit 2026
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="hover:text-[#f5cf72] transition-colors text-emerald-400/80">
                  Staff / Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#f5cf72] uppercase tracking-wider border-b border-[#084c2e] pb-2">
              CHURCH CONTACT
            </h4>
            <div className="space-y-3 text-sm text-emerald-200/80">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#c99726] shrink-0 mt-1" />
                <div>
                  <span className="text-white font-medium block">Physical Address</span>
                  <span className="font-mono text-xs text-emerald-100">{CHURCH_INFO.physicalAddress}</span>
                  <span className="block text-xs text-emerald-300/70">{CHURCH_INFO.location}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-[#c99726] shrink-0 mt-1" />
                <div>
                  <span className="text-white font-medium block">Telephone</span>
                  <span className="font-mono text-xs text-emerald-100">{CHURCH_INFO.phone}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-[#c99726] shrink-0 mt-1" />
                <div>
                  <span className="text-white font-medium block">Email Address</span>
                  <span className="font-mono text-xs text-emerald-100">{CHURCH_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-[#084c2e] flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-400/70 gap-4">
          <p>© 2026 Wisdom Temple. All rights reserved. A Christ-centered charismatic assembly.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => handleNav('about', 'beliefs')} className="hover:text-white transition-colors">
              Statement of Faith
            </button>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
