import React, { useState, useEffect } from 'react';
import { m } from 'motion/react';
import { PageId } from '../types';
import { reveal, staggerContainer, staggerItem, LIFT_SPRING } from '../utils/motion';
import { CHURCH_INFO, BELIEFS } from '../data/churchData';
import { PASTORAL_COUPLE_IMAGE } from '../assets/pastoralImage';
import { optimizedImageUrl } from '../utils/optimizedImage';
import { useBanners } from '../utils/bannerManager';
import { useSiteContent } from '../utils/contentManager';
import { 
  Target, 
  Compass, 
  BookOpen, 
  UserCheck, 
  History, 
  CheckCircle2, 
  Shield,
  Flame,
  Heart,
  Clock,
  MapPin,
  ArrowRight,
  X
} from 'lucide-react';
import { ScrollStory } from '../components/ScrollStory';

interface AboutViewProps {
  initialSubTab?: string;
  onNavigate: (page: PageId) => void;
}

/** Shared heading block used at the top of each About tab. */
const TabIntro: React.FC<{ eyebrow: string; title: string; text?: string }> = ({ eyebrow, title, text }) => (
  <m.div {...reveal()} className="text-center max-w-3xl mx-auto space-y-4">
    <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">{eyebrow}</span>
    <h2 className="text-4xl sm:text-5xl text-forest-900 font-serif-title leading-[1.08]">{title}</h2>
    <span className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-12 bg-gold-500/60" />
      <span className="w-2 h-2 rotate-45 bg-gold-500" />
      <span className="h-px w-12 bg-gold-500/60" />
    </span>
    {text && <p className="text-lg text-slate-600 leading-relaxed">{text}</p>}
  </m.div>
);

/** Closing call-to-action shared by every About tab. */
const ClosingInvite: React.FC<{ onNavigate: (page: PageId) => void }> = ({ onNavigate }) => (
  <m.div {...reveal()} className="text-center max-w-2xl mx-auto space-y-5 pb-4">
    <h3 className="text-3xl sm:text-4xl text-forest-900 font-serif-title">Come and see for yourself</h3>
    <p className="text-slate-600 leading-relaxed">
      Whether you join us on a Sunday morning, a Wednesday evening or online, there is a seat saved for you.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={() => onNavigate('new-here')}
        className="px-7 py-3.5 rounded-xl bg-forest-900 text-white text-sm font-bold hover:bg-forest-700 transition-colors cursor-pointer"
      >
        Plan your visit
      </button>
      <button
        onClick={() => onNavigate('watch-listen')}
        className="px-7 py-3.5 rounded-xl border border-forest-900/25 text-forest-900 text-sm font-bold hover:bg-white transition-colors cursor-pointer"
      >
        Watch online
      </button>
      <button
        onClick={() => onNavigate('contact')}
        className="px-4 py-3.5 text-sm font-semibold text-forest-700 hover:text-forest-500 cursor-pointer"
      >
        Get in touch
      </button>
    </div>
  </m.div>
);

export const AboutView: React.FC<AboutViewProps> = ({ initialSubTab, onNavigate }) => {
  const { getBanner } = useBanners();
  const { content } = useSiteContent();
  const [activeTab, setActiveTab] = useState<string>('who-we-are');
  const [showCouncilModal, setShowCouncilModal] = useState<boolean>(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="bg-mist-50 min-h-screen text-slate-900 pb-24 overflow-x-clip">
      {/* Page Header Banner - ICGC Forest & Gold */}
      <section className="ambient-glow relative bg-forest-950 text-white py-16 sm:py-20 border-b border-forest-700 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={getBanner('page_about_hero', '/assets/photos/wisdom-summit-team-red.webp')}
            alt=""
            className="hero-drift w-full h-full object-cover object-[center_30%] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/55 to-forest-950" />
          <div className="absolute inset-0 hero-grain" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs text-gold-300 font-bold uppercase tracking-widest bg-forest-850 px-3.5 py-1.5 rounded-full border border-gold-500/40 inline-block">
            {content.churchAddress.toUpperCase()}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            {content.aboutHeadline}
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            {content.churchDescription}
          </p>
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-mist-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex space-x-1 py-3 min-w-max text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'who-we-are', label: 'Who We Are', icon: Compass },
              { id: 'vision-mission', label: 'Our Vision & Mission', icon: Target },
              { id: 'beliefs', label: 'Our Beliefs', icon: BookOpen },
              { id: 'leadership', label: 'Our Leadership', icon: UserCheck },
              { id: 'story', label: 'Our Story & Heritage', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-forest-900 text-white shadow-sm border border-gold-500/50'
                      : 'text-slate-600 hover:text-forest-900 hover:bg-mist-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-300' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Tab 1: Who We Are */}
        {activeTab === 'who-we-are' && (
          <div className="space-y-20 sm:space-y-24 animate-in fade-in duration-150">
            {/* Intro: editorial two-column with an overlapping photo pair */}
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <m.div {...reveal()} className="lg:col-span-6 space-y-6">
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em] inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" aria-hidden="true" />
                  Identity & nature
                </span>
                <h2 className="text-4xl sm:text-5xl text-forest-900 font-serif-title leading-[1.08]">
                  A Christ-Centered Assembly <span className="text-gold-600">in Ghana</span>
                </h2>
                <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-serif-title !font-normal">
                  {content.aboutWhoWeAre1}
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  {content.aboutWhoWeAre2}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => onNavigate('new-here')}
                    className="px-6 py-3 rounded-lg bg-forest-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-forest-700 transition-colors cursor-pointer"
                  >
                    Plan your visit
                  </button>
                  <button
                    onClick={() => setActiveTab('story')}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-500 cursor-pointer"
                  >
                    Read our story
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </m.div>

              <m.div {...reveal(0.12)} className="lg:col-span-6">
                <div className="relative pb-10 pr-6 sm:pr-10">
                  <div className="absolute -inset-4 rounded-[2rem] bg-gold-400/15 blur-2xl" aria-hidden="true" />
                  <img
                    src="/assets/photos/wisdom-summit-full-team.webp"
                    alt="The Wisdom Temple family celebrating together"
                    className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-lift border border-white"
                  />
                  <img
                    src="/assets/photos/wisdom-summit-sisters.webp"
                    alt="Members of Wisdom Temple smiling together"
                    loading="lazy"
                    className="absolute bottom-0 right-0 w-1/2 aspect-[4/3] object-cover rounded-2xl shadow-xl border-4 border-gold-50"
                  />
                  <div className="absolute top-5 left-5 rounded-full bg-forest-950/90 backdrop-blur px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gold-300 border border-gold-500/40 inline-flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Star Junction, Tabora
                  </div>
                </div>
              </m.div>
            </div>

            {/* At a glance */}
            <m.ul {...staggerContainer(0.1)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-8">
              {[
                { icon: Clock, term: 'Sundays', desc: content.sundayServiceTime },
                { icon: Flame, term: 'Wednesdays', desc: `${content.midweekServiceTime} · The Secret Place` },
                { icon: MapPin, term: 'Find us', desc: CHURCH_INFO.landmark },
                { icon: Heart, term: 'For the family', desc: 'Kingdom Kids, ages 1 to 12' },
              ].map(({ icon: Icon, term, desc }) => (
                <m.li key={term} variants={staggerItem} className="bg-white rounded-2xl border border-mist-300 shadow-sm p-5 flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold-300" />
                  </span>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-gold-700 font-bold">{term}</span>
                    <span className="block text-sm font-semibold text-forest-900 leading-snug">{desc}</span>
                  </div>
                </m.li>
              ))}
            </m.ul>

            {/* Core values: a pinned photo that changes as you read each one */}
            <div className="space-y-12">
              <m.div {...reveal()} className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">What we hold dear</span>
                <h3 className="text-3xl sm:text-4xl text-forest-900 font-serif-title">Three things shape everything we do</h3>
              </m.div>
              <ScrollStory
                stickyTop="top-44"
                steps={[
                  {
                    icon: Flame,
                    label: '01 · Our worship',
                    title: 'Spiritual Fervor',
                    text: "Passionate worship and dedicated prayer at our Sunday services and Wednesday's The Secret Place.",
                    image: '/assets/optimized/hero_icgc_banner.webp',
                    alt: 'Worshippers gathered in the Wisdom Temple auditorium',
                  },
                  {
                    icon: BookOpen,
                    label: '02 · Our teaching',
                    title: 'Intellectual Excellence',
                    text: 'Sound doctrine that engages the mind, provides practical solutions, and fosters marketplace dominance.',
                    image: '/assets/photos/wisdom-summit-team-lineup.webp',
                    alt: 'Wisdom Temple team members posing together at the Wisdom Summit',
                  },
                  {
                    icon: Heart,
                    label: '03 · Our community',
                    title: 'Social Responsibility',
                    text: 'Active commitment to our community, welfare programs, student mentoring, and civic righteousness.',
                    image: '/assets/photos/wisdom-summit-sisters.webp',
                    alt: 'Members of the Wisdom Temple family smiling together',
                  },
                ]}
              />
            </div>

            {/* Worship times on a patterned band */}
            <section aria-labelledby="join-worship" className="pattern-band relative py-16 sm:py-20">
              <m.div {...reveal()} className="text-center max-w-2xl mx-auto mb-10 space-y-3">
                <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-[0.22em]">Worship with us</span>
                <h3 id="join-worship" className="text-3xl sm:text-4xl text-white font-serif-title">Join us for worship</h3>
                <span className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
                  <span className="h-px w-12 bg-gold-400/60" />
                  <span className="w-2 h-2 rotate-45 bg-gold-400" />
                  <span className="h-px w-12 bg-gold-400/60" />
                </span>
              </m.div>
              <m.div {...staggerContainer(0.14)} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  { name: content.sundayServiceName, when: `Every Sunday at ${content.sundayServiceTime}`, desc: content.sundayServiceDesc, icon: Clock },
                  { name: content.midweekServiceName, when: `Every Wednesday at ${content.midweekServiceTime}`, desc: content.midweekServiceDesc, icon: Flame },
                ].map(({ name, when, desc, icon: Icon }) => (
                  <m.div
                    key={name}
                    variants={staggerItem}
                    className="rounded-3xl bg-white/[0.06] backdrop-blur border border-white/15 p-7 hover:border-gold-400/60 transition-colors"
                  >
                    <span className="w-11 h-11 rounded-xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold-300" />
                    </span>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-gold-300">{name}</p>
                    <p className="mt-1 text-2xl text-white font-serif-title">{when}</p>
                    <p className="mt-2 text-sm text-emerald-100/80 leading-relaxed">{desc}</p>
                  </m.div>
                ))}
              </m.div>
              <div className="text-center mt-10">
                <button
                  onClick={() => onNavigate('new-here')}
                  className="cta-shine px-8 py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold text-sm transition-colors cursor-pointer"
                >
                  Plan your first visit
                </button>
              </div>
            </section>

            {/* Pastoral leadership feature */}
            <m.div {...reveal()} className="ambient-glow relative overflow-hidden rounded-[2rem] bg-forest-950 text-white border border-gold-500/30 shadow-xl">
              <div className="relative grid md:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('leadership')}
                  aria-label="Read the full leadership profile"
                  className="md:col-span-4 group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold-500/50 shadow-2xl cursor-pointer"
                >
                  <img
                    src={getBanner('pastoral_couple', PASTORAL_COUPLE_IMAGE)}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/rev_gabriel_and_helena_dela.jpg'; }}
                    alt={`${content.combinedPastoralTitle} - Shepherd and First Lady`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </button>
                <div className="md:col-span-8 space-y-4 text-center md:text-left">
                  <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-[0.22em]">Shepherd of Wisdom Temple</span>
                  <h3 className="text-3xl sm:text-4xl font-serif-title text-white">{content.combinedPastoralTitle}</h3>
                  <p className="text-emerald-100/85 leading-relaxed">{content.pastoralBio}</p>
                  <button
                    onClick={() => setActiveTab('leadership')}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 cursor-pointer"
                  >
                    Read the full leadership profile
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </m.div>

            {/* Closing invitation */}
            <ClosingInvite onNavigate={onNavigate} />
          </div>
        )}

        {/* Tab 2: Vision & Mission */}
        {activeTab === 'vision-mission' && (
          <div className="space-y-20 sm:space-y-24 animate-in fade-in duration-150">
            <TabIntro
              eyebrow="Where we are headed"
              title="Our vision and mission"
              text="Everything we do points toward one calling and one mandate."
            />

            {/* Vision and mission on a patterned band */}
            <section aria-label="Vision and mission" className="pattern-band relative py-16 sm:py-20">
              <m.div {...staggerContainer(0.18)} className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {[
                  { icon: Compass, label: 'Our vision', title: content.aboutVisionTitle, text: content.aboutVisionText },
                  { icon: Target, label: 'Our mission', title: content.aboutMissionTitle, text: content.aboutMissionText },
                ].map(({ icon: Icon, label, title, text }) => (
                  <m.div
                    key={label}
                    variants={staggerItem}
                    className="rounded-3xl bg-white/[0.06] backdrop-blur border border-white/15 p-8 sm:p-10 hover:border-gold-400/60 transition-colors"
                  >
                    <span className="w-12 h-12 rounded-2xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gold-300" />
                    </span>
                    <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">{label}</p>
                    <h3 className="mt-2 text-2xl sm:text-3xl text-white font-serif-title leading-snug">{title}</h3>
                    <p className="mt-4 text-emerald-100/85 leading-relaxed">{text}</p>
                  </m.div>
                ))}
              </m.div>
            </section>

            {/* The three pillars */}
            <section aria-labelledby="pillars-heading" className="space-y-12">
              <m.div {...reveal()} className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">Our mandate</span>
                <h3 id="pillars-heading" className="text-3xl sm:text-4xl text-forest-900 font-serif-title">The three pillars we build on</h3>
              </m.div>
              <m.ol {...staggerContainer(0.14)} className="grid md:grid-cols-3 gap-6">
                {[
                  { n: '01', title: content.pillar1Title, desc: content.pillar1Desc },
                  { n: '02', title: content.pillar2Title, desc: content.pillar2Desc },
                  { n: '03', title: content.pillar3Title, desc: content.pillar3Desc },
                ].map((pillar) => (
                  <m.li
                    key={pillar.n}
                    variants={staggerItem}
                    whileHover={{ y: -6 }}
                    transition={LIFT_SPRING}
                    className="relative overflow-hidden bg-white rounded-3xl border border-mist-300 hover:border-gold-500/50 shadow-sm hover:shadow-lift p-8 transition-shadow"
                  >
                    <span
                      data-num={pillar.n}
                      className="absolute -top-4 -right-1 font-serif-title text-8xl text-gold-500/20 select-none before:content-[attr(data-num)]"
                      aria-hidden="true"
                    />
                    <span className="relative block w-10 h-1 rounded-full bg-gold-500 mb-5" aria-hidden="true" />
                    <h4 className="relative text-xl text-forest-900 font-serif-title">{pillar.title}</h4>
                    <p className="relative mt-3 text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                  </m.li>
                ))}
              </m.ol>
            </section>

            <ClosingInvite onNavigate={onNavigate} />
          </div>
        )}

        {/* Tab 3: Beliefs */}
        {activeTab === 'beliefs' && (
          <div className="space-y-20 sm:space-y-24 animate-in fade-in duration-150">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Pinned introduction */}
              <m.div {...reveal()} className="lg:col-span-5 lg:sticky lg:top-44 space-y-6">
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em] inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" aria-hidden="true" />
                  Doctrinal statement
                </span>
                <h2 className="text-4xl sm:text-5xl text-forest-900 font-serif-title leading-[1.08]">
                  What we <span className="text-gold-600">believe</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our faith is rooted in classical charismatic orthodoxy, centered on the infallible authority of the Holy Scriptures.
                </p>
                <div className="ambient-glow relative overflow-hidden rounded-3xl bg-forest-950 text-white p-7 border border-gold-500/30 shadow-xl">
                  <BookOpen className="w-7 h-7 text-gold-300" aria-hidden="true" />
                  <p className="mt-4 font-serif-title text-2xl leading-snug">
                    {BELIEFS.length} articles of faith that guide how we worship, teach and live.
                  </p>
                  <button
                    onClick={() => onNavigate('new-here')}
                    className="mt-5 group inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 cursor-pointer"
                  >
                    Visit and hear it for yourself
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </m.div>

              {/* Articles */}
              <m.ol {...staggerContainer(0.08)} className="lg:col-span-7 space-y-4">
                {BELIEFS.map((belief, idx) => (
                  <m.li
                    key={idx}
                    variants={staggerItem}
                    className="group bg-white rounded-2xl border border-mist-300 hover:border-gold-500/60 shadow-sm hover:shadow-md transition-all p-6 sm:p-7 flex gap-5"
                  >
                    <span className="font-serif-title text-4xl text-gold-700 leading-none pt-1 w-12 shrink-0" aria-hidden="true">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-xl text-forest-900 font-serif-title">{belief.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{belief.text}</p>
                    </div>
                  </m.li>
                ))}
              </m.ol>
            </div>

            <ClosingInvite onNavigate={onNavigate} />
          </div>
        )}

        {/* Tab 4: Leadership */}
        {activeTab === 'leadership' && (
          <div className="space-y-20 sm:space-y-24 animate-in fade-in duration-150">
            <TabIntro
              eyebrow="Spiritual oversight"
              title="Our pastoral leadership"
              text="Dedicated servant-leaders guiding Wisdom Temple with pastoral care, biblical counsel, and vision."
            />

            {/* Shepherd spotlight */}
            <m.div {...reveal()} className="ambient-glow relative overflow-hidden rounded-[2rem] bg-forest-950 text-white border border-gold-500/30 shadow-xl">
              <div className="relative grid lg:grid-cols-12 gap-10 p-6 sm:p-10 lg:p-12 items-start">
                <div className="lg:col-span-5 lg:sticky lg:top-44">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold-500/50 shadow-2xl">
                    <img
                      src={getBanner('pastoral_couple', PASTORAL_COUPLE_IMAGE)}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/rev_gabriel_and_helena_dela.jpg'; }}
                      alt="Rev. Gabriel Dela and Lady Dr. Helena Dela - Shepherd and First Lady of Wisdom Temple"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/90 to-transparent p-5 pt-16">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gold-300">Pastoral couple</p>
                      <p className="font-serif-title text-xl text-white leading-tight">Rev. Gabriel Dela & Lady Dr. Helena Dela</p>
                      <p className="text-xs text-emerald-200/80 mt-1">Shepherd & First Lady · ICGC Wisdom Temple</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-[0.22em]">Shepherd of Wisdom Temple</span>
                    <h3 className="mt-2 text-4xl sm:text-5xl font-serif-title text-white leading-tight">Rev. Gabriel Dela</h3>
                    <p className="mt-2 text-sm text-emerald-200/80">
                      <span className="text-gold-300 font-bold">Shepherd & Senior Minister</span> · With <strong className="text-white">Lady Dr. Helena Dela</strong>
                    </p>
                  </div>

                  <div className="space-y-4 text-emerald-100/85 leading-relaxed">
                    <p>
                      <strong className="text-white">Rev. Gabriel Dela</strong> is the Shepherd and Senior Minister of ICGC Wisdom Temple. Called with an apostolic heart and an unquenchable passion for the Kingdom of God, Rev. Gabriel leads the Wisdom Temple congregation with doctrinal clarity, prophetic insight, and a shepherd's compassionate care.
                    </p>
                    <p>
                      Ministering side-by-side with him is his beloved wife, <strong className="text-white">Lady Dr. Helena Dela</strong>, who serves graciously as the First Lady of Wisdom Temple. Lady Dr. Helena Dela is a pillar of wisdom, prayer, and encouragement, actively nurturing the women's fellowship, family life ministries, and raising believers who embody godly dignity and professional excellence.
                    </p>
                    <p>
                      Together, Rev. Gabriel Dela and Lady Dr. Helena Dela are committed to fulfilling the God-given mandate of Wisdom Temple: <em className="text-gold-200">"Raising Leaders, Shaping Visions, and Influencing Society Through Christ."</em> Under their pastoral oversight, Wisdom Temple has flourished as a vibrant house of prayer, leadership excellence, and transformative ministry in Tabora, Accra, and across Ghana.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { k: 'Core emphasis', v: 'Biblical Exposition', d: 'Practical life application' },
                      { k: 'Prayer altar', v: 'The Secret Place', d: 'Midweek prayer & power' },
                      { k: 'Leadership', v: 'Wisdom Summit', d: 'Annual leadership conference' },
                    ].map((item) => (
                      <div key={item.k} className="rounded-xl bg-white/[0.06] border border-white/15 p-4">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gold-300">{item.k}</span>
                        <span className="block mt-1 text-sm font-semibold text-white">{item.v}</span>
                        <span className="block mt-0.5 text-xs text-emerald-200/70">{item.d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gold-500/30 bg-gold-400/10 p-4 text-sm text-emerald-100/90">
                    <p className="font-bold text-gold-200">Pastoral counsel & consultation</p>
                    <p className="mt-1">
                      Pastoral sessions are available by scheduled appointment through the Church Administration Office at Wisdom Temple, Star Junction, Tabora.
                    </p>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="mt-3 group inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 cursor-pointer"
                    >
                      Request an appointment
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Governance */}
            <section aria-labelledby="governance-heading" className="space-y-10">
              <m.div {...reveal()} className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">Governance</span>
                <h3 id="governance-heading" className="text-3xl sm:text-4xl text-forest-900 font-serif-title">Church governance & leadership councils</h3>
              </m.div>

              <m.div {...staggerContainer(0.14)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pastoral Council */}
                <m.div variants={staggerItem} className="bg-white rounded-3xl border border-mist-300 shadow-sm hover:shadow-lift hover:border-gold-500/50 transition-all p-8 flex flex-col">
                  <span className="w-12 h-12 rounded-2xl bg-forest-900 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gold-300" />
                  </span>
                  <h4 className="mt-5 text-xl text-forest-900 font-serif-title">Pastoral Council</h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-gold-700 mt-1">Spiritual oversight</p>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                    Doctrinal integrity, pastoral intercession, discipleship, and spiritual shepherd care across all congregations.
                  </p>
                  <span className="mt-5 pt-4 border-t border-mist-200 text-xs text-slate-600">Spiritual authority</span>
                </m.div>

                {/* Church Council with official photo */}
                <m.button
                  type="button"
                  variants={staggerItem}
                  onClick={() => setShowCouncilModal(true)}
                  className="group text-left bg-white rounded-3xl border-2 border-gold-500/50 hover:border-gold-500 overflow-hidden shadow-md hover:shadow-lift transition-all flex flex-col cursor-pointer"
                >
                  <span className="relative block aspect-[16/11] bg-forest-950 overflow-hidden">
                    <img
                      src={optimizedImageUrl('/church_council.png')}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== '/church_council.jpg') {
                          target.src = '/church_council.jpg';
                        }
                      }}
                      alt="ICGC Wisdom Temple Church Council"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent" />
                    <span className="absolute bottom-3 left-4 right-4 text-[10px] uppercase tracking-widest text-gold-300 font-bold">Stewardship & governance</span>
                  </span>
                  <span className="p-8 pt-6 flex flex-col flex-1">
                    <span className="text-xl text-forest-900 font-serif-title group-hover:text-gold-700 transition-colors">Church Council</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-700 mt-1">Governance & administration</span>
                    <span className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                      Institutional policies, capital developments, annual budgets, and fiduciary kingdom stewardship.
                    </span>
                    <span className="mt-5 pt-4 border-t border-mist-200 text-xs font-bold text-gold-700">View the council photo ↗</span>
                  </span>
                </m.button>

                {/* Ministry Deacons */}
                <m.div variants={staggerItem} className="bg-white rounded-3xl border border-mist-300 shadow-sm hover:shadow-lift hover:border-gold-500/50 transition-all p-8 flex flex-col">
                  <span className="w-12 h-12 rounded-2xl bg-forest-900 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-gold-300" />
                  </span>
                  <h4 className="mt-5 text-xl text-forest-900 font-serif-title">Ministry Deacons</h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-gold-700 mt-1">Sanctuary operations</p>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                    Hospitality, protocol, member welfare, logistical execution, and order within the sanctuary.
                  </p>
                  <span className="mt-5 pt-4 border-t border-mist-200 text-xs text-slate-600">Service & operations</span>
                </m.div>
              </m.div>
            </section>

            <ClosingInvite onNavigate={onNavigate} />
          </div>
        )}

        {/* Tab 5: Story & Heritage */}
        {activeTab === 'story' && (
          <div className="space-y-20 sm:space-y-24 animate-in fade-in duration-150">
            <TabIntro
              eyebrow="Our journey of faith"
              title={content.heritageStoryHeadline}
              text={content.churchDescription}
            />
            <ScrollStory
              stickyTop="top-44"
              steps={[
                {
                  icon: History,
                  label: 'Foundational philosophy',
                  title: 'Dignity, Excellence & Empowerment',
                  text: content.heritageStoryText1,
                  image: '/assets/photos/wisdom-summit-team-red.webp',
                  alt: 'Wisdom Temple team members welcoming guests with open hands',
                },
                {
                  icon: Compass,
                  label: 'Looking to the future',
                  title: 'Building for Generations',
                  text: content.heritageStoryText2,
                  image: '/assets/photos/wisdom-summit-full-team.webp',
                  alt: 'The Wisdom Summit team celebrating together',
                },
              ]}
            />
            <ClosingInvite onNavigate={onNavigate} />
          </div>
        )}
      </div>

      {/* Church Council Photo Lightbox Modal */}
      {showCouncilModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowCouncilModal(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-forest-950 rounded-3xl border-2 border-gold-500/60 shadow-2xl overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-forest-700 bg-forest-900">
              <div>
                <span className="text-[10px] font-bold text-gold-300 uppercase tracking-wider block">
                  ICGC WISDOM TEMPLE
                </span>
                <h3 className="text-lg font-bold font-serif-title text-white">
                  Church Council
                </h3>
              </div>
              <button
                onClick={() => setShowCouncilModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Photo */}
            <div className="relative aspect-[3831/2275] max-h-[75vh] w-full bg-black/80 flex items-center justify-center p-2">
              <img
                src={optimizedImageUrl('/church_council.png')}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/church_council.jpg') {
                    target.src = '/church_council.jpg';
                  }
                }}
                alt="Wisdom Temple Church Council"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-forest-900 border-t border-forest-700 text-center space-y-1">
              <p className="text-xs font-bold text-gold-200 uppercase tracking-wider">
                Governance, Strategic Oversight & Fiduciary Kingdom Stewardship
              </p>
              <p className="text-[11px] text-emerald-200/80">
                Wisdom Temple, Star Junction, Tabora • Accra, Ghana
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
