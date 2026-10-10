import React, { useState } from 'react';
import { m } from 'motion/react';
import { PageId } from '../types';
import { useBanners } from '../utils/bannerManager';
import { reveal, staggerContainer, staggerItem, LIFT_SPRING } from '../utils/motion';
import {
  BookOpen,
  Sparkles,
  Flame,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Quote,
  ArrowRight
} from 'lucide-react';

import { PageHero } from '../components/PageHero';
import { ClosingInvite } from '../components/ClosingInvite';

interface GrowViewProps {
  onNavigate: (page: PageId) => void;
}

export const GrowView: React.FC<GrowViewProps> = ({ onNavigate }) => {
  const { getBanner } = useBanners();
  const [foundationFormSubmitted, setFoundationFormSubmitted] = useState(false);
  const [foundationName, setFoundationName] = useState('');
  const [foundationPhone, setFoundationPhone] = useState('');

  const handleFoundationSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (foundationName.trim()) {
      setFoundationFormSubmitted(true);
    }
  };

  const tracks = [
    {
      n: '01',
      icon: BookOpen,
      title: 'Systematic Bible Study',
      text: 'Weekly study guides, chapter-by-chapter expositions, and hermeneutics to help you read and rightly divide the Scriptures.',
      points: ['Epistle of Ephesians Series', 'Proverbs: Practical Wisdom'],
      action: { label: 'Watch the teachings', onClick: () => onNavigate('watch-listen') },
    },
    {
      n: '02',
      icon: Flame,
      title: 'The Secret Place Prayer Service',
      text: 'Building stamina in tongues, midnight vigils, fasting, and biblical intercession for your family and nation.',
      points: ['Wednesdays at 7:00 PM', 'Atmosphere of Prayer: first Fridays at 7:00 PM'],
      action: { label: 'Send a prayer request', onClick: () => onNavigate('prayer-request') },
    },
    {
      n: '03',
      icon: GraduationCap,
      title: 'Foundation School',
      text: 'A 6-week foundational course covering salvation, water baptism, the Holy Spirit, stewardship, and church membership.',
      points: ['Sundays at 7:00 AM', 'Certificate upon completion'],
      action: { label: 'Enroll below', onClick: () => document.getElementById('foundation-school')?.scrollIntoView({ behavior: 'smooth' }) },
    },
  ];

  return (
    <div className="page-warm-bg min-h-screen text-slate-900 pb-24 overflow-x-clip">
      <PageHero
        image={getBanner('page_grow_hero', '/assets/optimized/open_bible.webp')}
        imagePosition="center 40%"
        eyebrow="Spiritual maturity & discipleship"
        title="Grow in Christ"
        text={`"Grow in the grace and knowledge of our Lord and Savior Jesus Christ." Equipping every believer with sound doctrine, fervent prayer, and daily fellowship with God.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-20">
        {/* Daily devotional */}
        <m.section
          {...reveal()}
          aria-labelledby="devotional-heading"
          className="ambient-glow relative overflow-hidden rounded-[2rem] bg-forest-950 text-white border border-gold-500/30 shadow-xl"
        >
          <div className="relative grid lg:grid-cols-12 gap-10 p-6 sm:p-10 lg:p-14">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-gold-300">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em]">Daily bread & meditation</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                  Theme: Walking in prudence
                </span>
              </div>

              <h2 id="devotional-heading" className="text-3xl sm:text-4xl lg:text-5xl font-serif-title leading-[1.1]">
                "The Prudent Man Foreseeth the Evil"
              </h2>

              <blockquote className="relative rounded-2xl bg-white/[0.06] border border-white/15 p-6 pl-8 text-emerald-50">
                <Quote className="absolute -top-3 left-5 w-7 h-7 text-gold-400 bg-forest-950 px-1" aria-hidden="true" />
                <p className="font-serif-title text-xl leading-relaxed !font-normal italic">
                  "A prudent man foreseeth the evil, and hideth himself; but the simple pass on, and are punished."
                </p>
                <footer className="mt-3 text-xs font-bold uppercase tracking-widest text-gold-300">Proverbs 22:3</footer>
              </blockquote>

              <p className="text-emerald-100/85 leading-relaxed">
                Divine wisdom does not simply rescue you after a calamity; it grants you foresight to anticipate and avoid traps before they manifest. As a believer positioned in the marketplace, family, or ministry, cultivate the spiritual sensitivity to discern motives, timing, and environments. Spend time in God's presence at <em>The Secret Place</em> where heavenly strategy is downloaded.
              </p>
            </div>

            <div className="lg:col-span-5 flex items-center">
              <div className="w-full rounded-3xl bg-gold-400/10 border border-gold-400/40 p-7 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">Daily prayer focus</p>
                <p className="font-serif-title text-xl leading-relaxed text-white !font-normal">
                  Lord, open my spiritual eyes to discern the traps of the adversary. Impart unto me the spirit of foresight, prudence, and excellent judgment in Jesus' name. Amen.
                </p>
                <button
                  onClick={() => onNavigate('prayer-request')}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 cursor-pointer pt-2"
                >
                  Share your own request
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </m.section>

        {/* Growth tracks on a patterned band */}
        <section aria-labelledby="tracks-heading" className="pattern-band relative py-16 sm:py-20">
          <m.div {...reveal()} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-[0.22em]">Structured discipleship</span>
            <h2 id="tracks-heading" className="text-3xl sm:text-4xl text-white font-serif-title">Core spiritual growth tracks</h2>
            <span className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-12 bg-gold-400/60" />
              <span className="w-2 h-2 rotate-45 bg-gold-400" />
              <span className="h-px w-12 bg-gold-400/60" />
            </span>
          </m.div>

          <m.ol {...staggerContainer(0.16)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <m.li
                  key={track.n}
                  variants={staggerItem}
                  whileHover={{ y: -6 }}
                  transition={LIFT_SPRING}
                  className="relative overflow-hidden bg-white rounded-3xl p-7 shadow-lift flex flex-col"
                >
                  <span
                    data-num={track.n}
                    className="absolute -top-4 right-2 font-serif-title text-8xl text-gold-500/20 select-none before:content-[attr(data-num)]"
                    aria-hidden="true"
                  />
                  <span className="relative w-14 h-14 rounded-2xl bg-forest-900 flex items-center justify-center shadow-md">
                    <Icon className="w-7 h-7 text-gold-300" />
                  </span>
                  <h3 className="relative mt-5 text-xl text-forest-900 font-serif-title">{track.title}</h3>
                  <p className="relative mt-2 text-sm text-slate-600 leading-relaxed">{track.text}</p>
                  <ul className="relative mt-4 pt-4 border-t border-mist-200 text-sm text-slate-700 space-y-2 flex-1">
                    {track.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={track.action.onClick}
                    className="relative mt-5 self-start group inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-500 cursor-pointer"
                  >
                    {track.action.label}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </m.li>
              );
            })}
          </m.ol>
        </section>

        {/* Foundation School enrollment */}
        <m.section
          {...reveal()}
          id="foundation-school"
          aria-labelledby="foundation-heading"
          className="ambient-glow relative overflow-hidden bg-forest-950 text-white rounded-[2rem] p-6 sm:p-10 lg:p-14 border border-gold-500/30 shadow-xl scroll-mt-28"
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[11px] text-gold-300 font-bold uppercase tracking-[0.22em]">New converts & believers</span>
              <h2 id="foundation-heading" className="text-3xl sm:text-4xl lg:text-5xl font-serif-title leading-[1.1]">
                Enroll in Foundation School
              </h2>
              <p className="text-emerald-100/85 leading-relaxed">
                Whether you just accepted Jesus Christ, recently moved to our neighborhood, or desire to ground your theological understanding in the charismatic faith, Foundation School is tailored for you.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm text-emerald-100">
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Next intake: first Sunday of every month at 7:00 AM</span>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl bg-white/[0.06] backdrop-blur border border-white/15 p-6 sm:p-8">
              {foundationFormSubmitted ? (
                <div role="status" className="text-center py-6 space-y-2 text-gold-300">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-gold-500" />
                  <h3 className="text-lg font-serif-title text-white">Enrollment registered!</h3>
                  <p className="text-sm text-emerald-100/85">
                    The Foundation School coordinator will contact you with classroom materials and syllabus details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFoundationSignup} className="space-y-4">
                  <div>
                    <label htmlFor="foundation-name" className="block text-xs font-semibold text-emerald-100 uppercase mb-1.5">Your full name *</label>
                    <input
                      id="foundation-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={foundationName}
                      onChange={(e) => setFoundationName(e.target.value)}
                      placeholder="e.g. Yaw Boateng"
                      className="w-full px-4 py-3 bg-forest-950/80 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="foundation-phone" className="block text-xs font-semibold text-emerald-100 uppercase mb-1.5">Phone number (WhatsApp) *</label>
                    <input
                      id="foundation-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={foundationPhone}
                      onChange={(e) => setFoundationPhone(e.target.value)}
                      placeholder="e.g. +233 24 000 0000"
                      className="w-full px-4 py-3 bg-forest-950/80 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="cta-shine w-full py-3.5 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Enroll in Foundation School
                  </button>
                </form>
              )}
            </div>
          </div>
        </m.section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <ClosingInvite onNavigate={onNavigate} />
      </div>
    </div>
  );
};
