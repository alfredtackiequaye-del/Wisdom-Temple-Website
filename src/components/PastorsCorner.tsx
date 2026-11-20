import React, { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { PageId } from '../types';
import { PASTORAL_COUPLE_IMAGE } from '../assets/pastoralImage';
import { useBanners } from '../utils/bannerManager';
import { useSiteContent } from '../utils/contentManager';
import { reveal } from '../utils/motion';
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
  pastorName: propPastorName,
  pastorTitle: propPastorTitle,
  pastorImage = PASTORAL_COUPLE_IMAGE,
  weeklyTheme: propWeeklyTheme,
  weeklyScripture: propWeeklyScripture,
  greetingSummary: propGreetingSummary,
  fullMessage: propFullMessage,
  dateLabel: propDateLabel,
}) => {
  const { getBanner } = useBanners();
  const { content } = useSiteContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pastorName = propPastorName || content.pastorName;
  const pastorTitle = propPastorTitle || content.pastorTitle;
  const weeklyTheme = propWeeklyTheme || content.pastoralTheme;
  const weeklyScripture = propWeeklyScripture || content.pastoralScripture;
  const greetingSummary = propGreetingSummary || content.pastoralGreetingSummary;
  const fullMessage = propFullMessage || content.pastoralFullMessage;
  const dateLabel = propDateLabel || content.pastoralDateLabel;

  const activePastorImage = getBanner('pastoral_couple', pastorImage);

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-mist-200" id="pastors-corner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <m.div {...reveal()} className="lg:col-span-5">
          <img
            src={activePastorImage}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== '/rev_gabriel_and_helena_dela.jpg') {
                target.src = '/rev_gabriel_and_helena_dela.jpg';
              }
            }}
            alt={`${pastorName} - ${pastorTitle}`}
            className="w-full max-w-md mx-auto aspect-[4/5] object-cover object-top rounded-2xl shadow-lg"
          />
        </m.div>

        <m.div {...reveal(0.1)} className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
            A word from our pastor
          </p>
          <h2 className="mt-3 font-serif-title text-3xl sm:text-4xl lg:text-5xl text-forest-900">
            {weeklyTheme}
          </h2>
          <p className="mt-3 text-sm text-slate-500 italic">{weeklyScripture}</p>

          <blockquote className="mt-7 border-l-2 border-gold-500 pl-6 text-lg leading-relaxed text-slate-700 line-clamp-6">
            {greetingSummary}
          </blockquote>
          <p className="mt-5 pl-6 text-sm text-slate-600">
            <span className="font-semibold text-forest-900">{pastorName}</span>
            {' · '}
            {pastorTitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Read the full message
            </button>
            <button
              onClick={() => onNavigate('about', 'leadership')}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-forest-900 hover:text-gold-700 transition-colors cursor-pointer"
            >
              Meet our pastors
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </m.div>
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
            <m.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-2xl w-full bg-white rounded-3xl border-2 border-gold-500/50 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-forest-950 text-white p-6 border-b border-forest-700 flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-gold-300 uppercase tracking-wider block font-bold">
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
                <div className="p-4 bg-mist-50 border-l-4 border-gold-500 rounded-r-xl text-xs sm:text-sm text-slate-600 italic">
                  {weeklyScripture}
                </div>

                {fullMessage.map((para, i) => (
                  <p key={i} className="leading-relaxed text-slate-700">
                    {para}
                  </p>
                ))}

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-serif-title font-bold text-base text-forest-900">In Christ's Unfailing Love,</p>
                    <p className="text-xs text-gold-500 font-bold">{pastorName} & Lady Dr. Helena Dela</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onNavigate('prayer-request');
                    }}
                    className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Prayer Request
                  </button>
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
