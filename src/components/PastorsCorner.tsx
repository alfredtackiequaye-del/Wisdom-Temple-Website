import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../types';
import { PASTORAL_COUPLE_IMAGE } from '../assets/pastoralImage';
import { 
  Quote, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  HeartHandshake, 
  ArrowRight, 
  Share2, 
  Check, 
  X, 
  MessageSquare, 
  PhoneCall,
  ChevronRight
} from 'lucide-react';

interface PastorsCornerProps {
  onNavigate: (page: PageId, subTab?: string) => void;
  pastorName?: string;
  pastorTitle?: string;
  pastorImage?: string;
  weeklyTheme?: string;
  weeklyScripture?: string;
  greetingSummary?: string;
  fullMessage?: string[];
  dateLabel?: string;
}

export const PastorsCorner: React.FC<PastorsCornerProps> = ({
  onNavigate,
  pastorName = "Rev. Gabriel Dela",
  pastorTitle = "Senior Minister & Resident Pastor",
  pastorImage = PASTORAL_COUPLE_IMAGE,
  weeklyTheme = "Walking in Kingdom Wisdom & Divine Direction",
  weeklyScripture = "“Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.” — Proverbs 3:5-6",
  greetingSummary = "Beloved family and honored guests, I warmly welcome you into a week loaded with supernatural breakthrough and divine clarity. At Wisdom Temple, we believe that when God's Word illuminates your path, confusion gives way to conviction, and stagnation turns into momentum. Whatever mountains or decisions confront you this week, know that the God who called you is already ahead of you.",
  fullMessage = [
    "Beloved family and honored guests, I warmly welcome you into a week loaded with supernatural breakthrough and divine clarity. At Wisdom Temple, we believe that when God's Word illuminates your path, confusion gives way to conviction, and stagnation turns into momentum.",
    "The world often tells us to rely strictly on human intellect, connections, and hustle. While excellence and diligence are biblical virtues, kingdom wisdom teaches us that true elevation begins on your knees in communion with the Holy Spirit. When you invite Jesus into your career, your family, your business, and your quiet thoughts, He grants you divine insight that surpasses human strategy.",
    "This week, make time for the secret place of prayer. Speak life over your household, guard your peace fiercely against negativity, and stand firm on God's covenant promises. Lady Dr. Helena Dela and I are lifting you daily in our pastoral prayers.",
    "May the peace of God which transcends all human understanding guard your heart and mind through Christ Jesus. You are blessed, highly favored, and destined for greatness!"
  ],
  dateLabel = "Weekly Charge • Updated This Sunday"
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const textToShare = `Pastor's Corner: "${weeklyTheme}" by ${pastorName}\n${weeklyScripture}\n\nRead more at Wisdom Temple: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: `Pastor's Corner | ${pastorName}`,
        text: textToShare,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="py-20 bg-[#fbfcfb] border-b border-slate-200 relative" id="pastors-corner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-14">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#b8861d]">
            The Shepherd's Desk · Pastor's Corner
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#032014] font-serif tracking-tight">
            A Word from our <span className="font-normal text-[#b8861d]">Resident Pastor</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Weekly spiritual nourishment, pastoral encouragement, and divine direction to anchor your life, family, and purpose.
          </p>
        </div>

        {/* Feature Layout: Image & Brief Text Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-12 relative">
          {/* Left Column: Space for Pastor's Portrait */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-xl overflow-hidden bg-[#02180e] border border-slate-200 group">
              <img
                src={pastorImage}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/rev_gabriel_and_helena_dela.jpg') {
                    target.src = '/rev_gabriel_and_helena_dela.jpg';
                  }
                }}
                alt={`${pastorName} - ${pastorTitle}`}
                className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500 ease-out"
              />

              {/* Bottom Scrim for text readability */}
              <div className="absolute inset-x-0 bottom-0 bg-[#02180e]/95 border-t border-white/10 p-5 text-white pointer-events-none">
                <span className="text-[11px] font-mono text-[#dfb15b] uppercase tracking-wider block font-bold">
                  RESIDENT PASTOR
                </span>
                <h4 className="text-xl sm:text-2xl font-serif text-white mt-0.5">
                  {pastorName}
                </h4>
                <p className="text-xs text-emerald-200/90 mt-1 flex items-center space-x-1.5">
                  <span>With Lady Dr. Helena Dela</span>
                  <span>•</span>
                  <span>Wisdom Temple</span>
                </p>
              </div>
            </div>

            {/* Quick Contact & Counseling Note */}
            <div className="mt-4 flex items-center justify-between w-full max-w-md px-1 text-xs text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-600 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#b8861d]" />
                <span>{dateLabel}</span>
              </span>
              <button
                onClick={() => onNavigate('about', 'leadership')}
                className="text-[#032014] hover:text-[#b8861d] font-semibold inline-flex items-center space-x-0.5 cursor-pointer transition-colors"
              >
                <span>Read Biography</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Weekly Message / Greeting Text Block */}
          <div className="lg:col-span-7 space-y-6">
            {/* Theme & Scripture Block */}
            <div className="p-5 rounded-xl bg-[#f8faf8] border-l-4 border-[#c99726] border-y border-r border-slate-200">
              <span className="text-[11px] font-mono font-bold text-[#032014] uppercase tracking-wider block">
                This Week's Pastoral Theme
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#032014] mt-1 tracking-tight">
                {weeklyTheme}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 italic mt-2 flex items-start space-x-2">
                <BookOpen className="w-4 h-4 text-[#c99726] shrink-0 mt-0.5" />
                <span>{weeklyScripture}</span>
              </p>
            </div>

            {/* Brief Text Block with Quote Decoration */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-3">
              <Quote className="w-8 h-8 text-[#c99726]/20 absolute -left-4 -top-2 fill-[#c99726]/10" />

              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif italic text-justify">
                "{greetingSummary}"
              </p>
            </div>

            {/* Key Action Principles for the Week */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[#f8faf8] rounded-lg border border-slate-200">
                <span className="text-[10px] font-mono text-[#07472c] font-bold uppercase block">1. Focus</span>
                <p className="text-xs font-bold text-[#032014] mt-0.5">Seek God First</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Prioritize morning devotion</span>
              </div>
              <div className="p-3 bg-[#f8faf8] rounded-lg border border-slate-200">
                <span className="text-[10px] font-mono text-[#07472c] font-bold uppercase block">2. Posture</span>
                <p className="text-xs font-bold text-[#032014] mt-0.5">Guard Your Peace</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Reject fear & negativity</span>
              </div>
              <div className="p-3 bg-[#f8faf8] rounded-lg border border-slate-200">
                <span className="text-[10px] font-mono text-[#07472c] font-bold uppercase block">3. Expectation</span>
                <p className="text-xs font-bold text-[#032014] mt-0.5">Walk in Boldness</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">God goes before you</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-lg bg-[#032014] hover:bg-[#073623] text-white font-semibold text-xs tracking-wider uppercase shadow-sm transition-colors cursor-pointer inline-flex items-center space-x-2"
              >
                <span>Read Full Weekly Charge</span>
                <ArrowRight className="w-4 h-4 text-[#dfb15b]" />
              </button>

              <button
                onClick={() => onNavigate('prayer-request')}
                className="px-5 py-3 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece6] text-[#032014] font-semibold text-xs tracking-wider uppercase border border-slate-300 transition-colors cursor-pointer inline-flex items-center space-x-1.5"
              >
                <HeartHandshake className="w-4 h-4 text-[#c99726]" />
                <span>Request Pastoral Prayer</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                title="Share Weekly Greeting"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Full Weekly Charge Modal */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-2xl w-full bg-white rounded-3xl border-2 border-[#c99726]/50 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#02180e] text-white p-6 border-b border-[#07472c] flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#f5cf72] uppercase tracking-wider block font-bold">
                    PASTOR'S CORNER • FULL WEEKLY CHARGE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white mt-1">
                    {weeklyTheme}
                  </h3>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    By {pastorName} • {pastorTitle}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <div className="p-4 bg-[#f8faf8] border-l-4 border-[#c99726] rounded-r-xl text-xs sm:text-sm text-slate-600 italic">
                  {weeklyScripture}
                </div>

                {fullMessage.map((para, i) => (
                  <p key={i} className="leading-relaxed text-slate-700">
                    {para}
                  </p>
                ))}

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-serif-title font-bold text-base text-[#032014]">In Christ's Unfailing Love,</p>
                    <p className="text-xs text-[#c99726] font-bold">{pastorName} & Lady Dr. Helena Dela</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onNavigate('prayer-request');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#07472c] hover:bg-[#09603a] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Prayer Request
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
