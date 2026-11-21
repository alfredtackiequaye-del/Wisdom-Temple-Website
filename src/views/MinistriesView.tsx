import React, { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { Ministry, PageId } from '../types';
import { useBanners } from '../utils/bannerManager';
import { 
  Users, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  X,
  MessageCircle,
  Heart,
  BookOpen,
  Sparkles,
  Eye
} from 'lucide-react';
import { PosterImage } from '../components/PosterImage';
import { CHURCH_INFO } from '../data/churchData';
import { reveal, staggerContainer, staggerItem, LIFT_SPRING } from '../utils/motion';

import { PageHero } from '../components/PageHero';
interface MinistriesViewProps {
  ministries: Ministry[];
  initialMinistryId?: string;
  onNavigate: (page: PageId) => void;
  onJoinMinistry: (ministryName: string, name: string, email: string, phone: string) => void;
}

type PathwayId = 'all' | 'family' | 'formation' | 'service';

const PATHWAYS = [
  {
    id: 'family' as const,
    icon: Heart,
    eyebrow: 'Belong',
    title: 'For Me & My Family',
    description: 'Age- and life-stage communities where every member of the family can be known, supported and strengthened.',
    ministryIds: ['children', 'youth', 'young-adults', 'women', 'men', 'couples-marriage'],
  },
  {
    id: 'formation' as const,
    icon: BookOpen,
    eyebrow: 'Grow',
    title: 'Grow Spiritually',
    description: 'Build strong foundations in the Word and deepen your life of prayer, discipleship and Christian maturity.',
    ministryIds: ['discipleship', 'prayer'],
  },
  {
    id: 'service' as const,
    icon: Sparkles,
    eyebrow: 'Serve',
    title: 'Serve & Make an Impact',
    description: 'Use your gifts to reach people, strengthen worship and help the Gospel make a practical difference.',
    ministryIds: ['evangelism', 'multimedia'],
  },
];

export const MinistriesView: React.FC<MinistriesViewProps> = ({
  ministries,
  initialMinistryId,
  onNavigate,
  onJoinMinistry,
}) => {
  const { getBanner } = useBanners();
  const [selectedPathway, setSelectedPathway] = useState<PathwayId>('all');
  const [activeJoinMinistry, setActiveJoinMinistry] = useState<Ministry | null>(null);
  const [activeDetailMinistry, setActiveDetailMinistry] = useState<Ministry | null>(null);

  // Join modal form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  const selectedIds = selectedPathway === 'all'
    ? null
    : PATHWAYS.find((pathway) => pathway.id === selectedPathway)?.ministryIds;
  const filteredMinistries = selectedIds
    ? ministries.filter((ministry) => selectedIds.includes(ministry.id))
    : ministries;

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !activeJoinMinistry) return;

    onJoinMinistry(activeJoinMinistry.name, userName, userEmail, userPhone);
    setJoinSuccess(true);
    setTimeout(() => {
      setJoinSuccess(false);
      setActiveJoinMinistry(null);
      setUserName('');
      setUserEmail('');
      setUserPhone('');
    }, 2200);
  };

  // The enrollment dialog closes on Escape and puts focus on its first field.
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!activeJoinMinistry) return;
    nameInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActiveJoinMinistry(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeJoinMinistry]);

  useEffect(() => {
    if (!initialMinistryId) return;
    const requestedMinistry = ministries.find((ministry) => ministry.id === initialMinistryId);
    if (requestedMinistry) setActiveDetailMinistry(requestedMinistry);
  }, [initialMinistryId, ministries]);

  useEffect(() => {
    if (!activeDetailMinistry) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setActiveDetailMinistry(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDetailMinistry]);

  const whatsappHref = `https://wa.me/233${CHURCH_INFO.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent('Hello Wisdom Temple, I would like help finding the right ministry for me.')}`;

  return (
    <div className="page-warm-bg min-h-screen text-slate-900 pb-24 overflow-x-clip">
      {/* Header Banner - ICGC Forest & Gold */}
      <PageHero
        image={getBanner('page_ministries_hero', '/assets/photos/wisdom-summit-team-lineup.webp')}
        imagePosition="center 8%"
        eyebrow="Body of Christ · Wisdom Temple"
        title="Ministries Directory"
        text="Every member has a calling. Find your family, sharpen your talents, and impact society through our vibrant ministry departments."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-20">
        {/* Three visitor-centred pathways */}
        <section aria-labelledby="pathways-heading" className="space-y-8">
          <m.div {...reveal()} className="max-w-3xl">
            <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">Start with what you need</span>
            <h2 id="pathways-heading" className="mt-2 text-3xl sm:text-5xl text-forest-900 font-display">How would you like to connect?</h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">Choose a pathway or explore every ministry below. You can learn more before deciding whether to express interest.</p>
          </m.div>

          <m.div {...staggerContainer(0.12)} className="grid md:grid-cols-3 gap-5" role="group" aria-label="Choose a ministry pathway">
            {PATHWAYS.map(({ id, icon: Icon, eyebrow, title, description }) => {
              const active = selectedPathway === id;
              return (
                <m.button
                  key={id}
                  variants={staggerItem}
                  onClick={() => setSelectedPathway(active ? 'all' : id)}
                  aria-pressed={active}
                  className={`text-left rounded-3xl border p-6 sm:p-7 transition-all cursor-pointer ${active ? 'bg-forest-950 border-gold-500 text-white shadow-lift' : 'bg-white border-mist-300 text-forest-900 hover:border-gold-500/60 hover:shadow-md'}`}
                >
                  <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-gold-400 text-forest-950' : 'bg-gold-50 text-gold-700'}`}>
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className={`mt-5 block text-[11px] font-bold uppercase tracking-[0.18em] ${active ? 'text-gold-300' : 'text-gold-700'}`}>{eyebrow}</span>
                  <span className="mt-1 block text-2xl font-display">{title}</span>
                  <span className={`mt-3 block text-sm leading-relaxed ${active ? 'text-emerald-100/85' : 'text-slate-600'}`}>{description}</span>
                </m.button>
              );
            })}
          </m.div>

          {selectedPathway !== 'all' && (
            <button onClick={() => setSelectedPathway('all')} className="text-sm font-semibold text-forest-700 hover:text-forest-950 underline underline-offset-4 cursor-pointer">
              Show all ministries
            </button>
          )}
        </section>

        {/* Ministries grouped by visitor goal */}
        <div className="space-y-20" aria-live="polite">
          {PATHWAYS.map((pathway) => {
            const sectionMinistries = filteredMinistries.filter((ministry) => pathway.ministryIds.includes(ministry.id));
            if (!sectionMinistries.length) return null;
            return (
              <section key={pathway.id} aria-labelledby={`${pathway.id}-heading`} className="space-y-8">
                <m.div {...reveal()} className="flex flex-wrap items-end justify-between gap-4 border-b border-mist-300 pb-5">
                  <div>
                    <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">{pathway.eyebrow}</span>
                    <h2 id={`${pathway.id}-heading`} className="mt-1 text-3xl sm:text-4xl text-forest-900 font-display">{pathway.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">{pathway.description}</p>
                  </div>
                  <span className="text-sm text-slate-500">{sectionMinistries.length} {sectionMinistries.length === 1 ? 'ministry' : 'ministries'}</span>
                </m.div>

                <m.div key={`${selectedPathway}-${pathway.id}`} {...staggerContainer(0.08)} className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {sectionMinistries.map((ministry) => (
                    <m.article
                      key={ministry.id}
                      variants={staggerItem}
                      whileHover={{ y: -5 }}
                      transition={LIFT_SPRING}
                      className="group bg-white rounded-3xl border border-mist-300 overflow-hidden shadow-sm hover:shadow-lift hover:border-gold-500/40 transition-shadow flex flex-col"
                    >
                      <div className="relative aspect-[16/10] bg-forest-950 overflow-hidden">
                        <PosterImage src={getBanner('ministry_' + ministry.id, ministry.image)} alt={ministry.name} />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-forest-950/90 backdrop-blur-md rounded-full text-[11px] font-bold text-gold-300 border border-gold-500/40">{pathway.eyebrow}</span>
                      </div>

                      <div className="p-6 flex-1 space-y-4">
                        <h3 className="text-xl text-forest-900 font-display leading-snug">{ministry.name}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{ministry.shortDescription}</p>
                        <div className="pt-4 border-t border-mist-200 space-y-2.5 text-sm text-slate-700">
                          <div className="flex items-start gap-2"><Users className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" /><span><strong className="text-forest-900">For:</strong> {ministry.audience}</span></div>
                          <div className="flex items-start gap-2"><Clock className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" /><span><strong className="text-forest-900">Meets:</strong> {ministry.meetingSchedule}</span></div>
                        </div>
                      </div>

                      <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                        <button onClick={() => setActiveDetailMinistry(ministry)} className="py-3 border border-forest-900/20 text-forest-900 hover:bg-mist-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" /> View ministry
                        </button>
                        <button onClick={() => setActiveJoinMinistry(ministry)} className="py-3 bg-forest-900 hover:bg-forest-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-gold-500/30">
                          Express interest
                        </button>
                      </div>
                    </m.article>
                  ))}
                </m.div>
              </section>
            );
          })}
        </div>

        {/* Not sure where to start? */}
        <section aria-labelledby="start-heading" className="pattern-band relative py-16 sm:py-20">
          <m.div {...reveal()} className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-[0.22em]">Not sure where to start?</span>
            <h2 id="start-heading" className="text-3xl sm:text-4xl text-white font-serif-title">Let us help you find your people</h2>
            <span className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-12 bg-gold-400/60" />
              <span className="w-2 h-2 rotate-45 bg-gold-400" />
              <span className="h-px w-12 bg-gold-400/60" />
            </span>
            <p className="text-emerald-100/85 leading-relaxed">
              Tell us a little about you and our welcome team will point you to the right ministry. Or simply visit on a Sunday and meet us in person.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-forest-950 text-sm font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
              </a>
              <button
                onClick={() => onNavigate('new-here')}
                className="px-7 py-3.5 rounded-xl border border-white/25 text-white hover:bg-white/10 text-sm font-bold transition-colors cursor-pointer"
              >
                Plan your visit
              </button>
            </div>
          </m.div>
        </section>
      </div>

      {/* Join ministry dialog */}
      {activeJoinMinistry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveJoinMinistry(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-forest-950 border border-gold-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-forest-700 pb-3">
              <div>
                <span className="text-[10px] text-gold-300 font-bold uppercase tracking-widest">Ministry enrollment</span>
                <h2 id="join-title" className="text-white text-xl font-serif-title">{activeJoinMinistry.name}</h2>
              </div>
              <button onClick={() => setActiveJoinMinistry(null)} aria-label="Close" className="text-emerald-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {joinSuccess ? (
              <div role="status" className="py-8 text-center text-gold-300 space-y-2 animate-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-10 h-10 mx-auto text-gold-500" />
                <h3 className="font-bold text-white text-base">Interest registered!</h3>
                <p className="text-xs text-emerald-200">
                  The coordinator for {activeJoinMinistry.name} will reach out to you with fellowship details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-3 text-xs">
                <p className="text-emerald-200/80 text-xs">
                  Fill out your details and our ministry leadership team will connect with you.
                </p>

                <div>
                  <label htmlFor="join-name" className="block text-emerald-200 font-semibold uppercase mb-1">Full Name *</label>
                  <input
                    id="join-name"
                    ref={nameInputRef}
                    type="text"
                    required
                    autoComplete="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Ama Serwaa"
                    className="w-full px-3.5 py-2.5 bg-forest-850 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label htmlFor="join-phone" className="block text-emerald-200 font-semibold uppercase mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    id="join-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. +233 24 000 0000"
                    className="w-full px-3.5 py-2.5 bg-forest-850 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label htmlFor="join-email" className="block text-emerald-200 font-semibold uppercase mb-1">Email Address</label>
                  <input
                    id="join-email"
                    type="email"
                    autoComplete="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="ama@example.com"
                    className="w-full px-3.5 py-2.5 bg-forest-850 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    Submit interest
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      </div>
    </div>
  );
};
