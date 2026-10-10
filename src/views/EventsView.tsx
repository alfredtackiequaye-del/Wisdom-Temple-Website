import React, { useState } from 'react';
import { m } from 'motion/react';
import { ChurchEvent, PageId } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { useBanners } from '../utils/bannerManager';
import { reveal, staggerContainer, staggerItem, LIFT_SPRING } from '../utils/motion';
import { getEventDateParts, getEventStatus, EventStatus } from '../utils/eventStatus';
import { parseEventDates } from '../utils/structuredData';
import { buildIcsMulti, downloadIcs, CalendarVisit } from '../utils/visitSchedule';
import {
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  Share2,
  Ticket,
  Sun,
  Flame,
} from 'lucide-react';
import { PosterImage } from '../components/PosterImage';
import { PageHero } from '../components/PageHero';
import { ClosingInvite } from '../components/ClosingInvite';

interface EventsViewProps {
  events: ChurchEvent[];
  initialSubTab?: string;
  onRegisterEvent: (event: ChurchEvent) => void;
  onShare: (title: string, desc: string) => void;
  onNavigate: (page: PageId) => void;
}

const VENUE = 'Wisdom Temple, Star Junction, Tabora - Accra, Ghana';
const SUMMIT_LENGTH_H = 3;

/** One calendar slot for a single-day event whose date and time can be read, else null. */
const slotForEvent = (event: ChurchEvent): CalendarVisit | null => {
  const parsed = parseEventDates(event.date, event.time);
  if (!parsed || parsed.endDate || !parsed.startDate.includes('T')) return null;
  return { title: event.name, start: Date.parse(parsed.startDate), lengthH: 3, location: event.venue || VENUE };
};

/** The Wisdom Summit runs over four sessions: three evenings and a Sunday morning (per the flyer). */
const summitSlots = (name: string): CalendarVisit[] => [
  ...[7, 8, 9].map((day) => ({ title: name, start: Date.UTC(2026, 9, day, 18, 30), lengthH: SUMMIT_LENGTH_H, location: VENUE })),
  { title: name, start: Date.UTC(2026, 9, 11, 8, 0), lengthH: SUMMIT_LENGTH_H, location: VENUE },
];

const StatusChip: React.FC<{ status: EventStatus }> = ({ status }) => {
  if (status.kind === 'live') {
    return (
      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-forest-950/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
        <span className="live-dot" aria-hidden="true" /> Happening now
      </span>
    );
  }
  if (status.kind === 'soon') {
    return (
      <span className="px-2.5 py-1 rounded-full bg-gold-400 text-forest-950 text-[10px] font-bold uppercase tracking-wider">
        {status.days === 1 ? 'Tomorrow' : `In ${status.days} days`}
      </span>
    );
  }
  if (status.kind === 'past') {
    return (
      <span className="px-2.5 py-1 rounded-full bg-slate-700/90 text-white text-[10px] font-bold uppercase tracking-wider">
        Concluded
      </span>
    );
  }
  return null;
};

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  initialSubTab,
  onRegisterEvent,
  onShare,
  onNavigate,
}) => {
  const { getBanner } = useBanners();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Conference', 'Prayer', 'Youth', 'Special Service'];
  const countFor = (cat: string) => (cat === 'All' ? events.length : events.filter((e) => e.category === cat).length);

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const featuredSummit = events.find(e => e.isFeaturedSummit) || events[0];
  const summitStatus = featuredSummit ? getEventStatus(featuredSummit.date, featuredSummit.time) : null;
  const addSummitToCalendar = () =>
    downloadIcs(buildIcsMulti(summitSlots(featuredSummit.name), 'Free entry. Register online to reserve your seat.'), 'wisdom-summit-2026.ics');

  return (
    <div className="page-warm-bg min-h-screen text-slate-900 pb-24 overflow-x-clip">
      <PageHero
        image={getBanner('page_events_hero', '/assets/photos/wisdom-summit-full-team.webp')}
        imagePosition="center 30%"
        eyebrow="Calendar & sacred gatherings"
        title="Events & Conferences"
        text="Experience spiritual elevation, transformative encounters, and fellowship at our conferences, prayer vigils, and seasonal summits."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-20">
        {/* Featured Wisdom Summit */}
        {featuredSummit && (
          <m.section
            {...reveal()}
            aria-label="Featured event"
            className="ambient-glow relative overflow-hidden bg-forest-950 rounded-[2rem] border border-gold-500/30 p-6 sm:p-10 lg:p-12 text-white shadow-xl"
          >
            <div className="relative flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 bg-gold-400 text-forest-950 font-bold text-[11px] uppercase tracking-[0.18em] rounded-full">
                  Annual flagship conference
                </span>
                {summitStatus && <StatusChip status={summitStatus} />}
              </div>
              <button
                onClick={() => onShare(featuredSummit.name, `${featuredSummit.theme} - Register now for Wisdom Summit 2026 at Wisdom Temple`)}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-100 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-white/15"
              >
                <Share2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Share Summit</span>
              </button>
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="group relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                  <img
                    src={getBanner('wisdom_summit_banner', '/wisdom_summit_banner.png')}
                    alt="Wisdom Summit 2026 flyer with the guest speakers and schedule"
                    className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-white/[0.06] backdrop-blur border border-white/15 p-6 sm:p-8 text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center mx-auto">
                  <Ticket className="w-7 h-7 text-gold-300" />
                </div>
                <div>
                  <h2 className="font-serif-title text-2xl text-white">Wisdom Summit 2026</h2>
                  <p className="text-sm text-gold-300 mt-1">October 7 - 9 & 11, 2026</p>
                  <p className="text-xs text-emerald-100/80 mt-3 leading-relaxed">
                    Admission is free. Register to reserve your seat and receive event notifications.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => onRegisterEvent(featuredSummit)}
                    className="cta-shine w-full py-3.5 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Register for Wisdom Summit
                  </button>
                  {featuredSummit.id === 'wisdom-summit-2026' && summitStatus?.kind !== 'past' && (
                    <button
                      onClick={addSummitToCalendar}
                      className="w-full py-3 rounded-lg border border-white/20 text-emerald-100 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <CalendarPlus className="w-4 h-4 text-gold-300" /> Add to my calendar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </m.section>
        )}

        {/* Filter bar */}
        <m.div
          {...reveal()}
          className="flex flex-wrap items-end justify-between gap-4 border-b border-mist-300 pb-5"
        >
          <div>
            <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">On the calendar</span>
            <h2 className="mt-1 text-3xl sm:text-4xl text-forest-900 font-serif-title">All scheduled gatherings</h2>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-forest-900 text-gold-300 shadow-sm border border-gold-500/40'
                    : 'bg-white text-forest-700 border border-mist-300 hover:border-gold-500/50'
                }`}
              >
                {cat} ({countFor(cat)})
              </button>
            ))}
          </div>
        </m.div>

        {/* Events grid. flex-wrap so an incomplete last row centres itself. */}
        <m.div
          key={selectedCategory}
          {...staggerContainer(0.1)}
          className="flex flex-wrap justify-center gap-8 !mt-10"
        >
          {filteredEvents.map((event) => {
            const status = getEventStatus(event.date, event.time);
            const parts = getEventDateParts(event.date, event.time);
            const slot = slotForEvent(event);
            const ended = status.kind === 'past';
            return (
              <m.article
                key={event.id}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={LIFT_SPRING}
                className={`group bg-white rounded-3xl border border-mist-300 overflow-hidden shadow-sm hover:shadow-lift hover:border-gold-500/40 transition-shadow flex flex-col justify-between w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] ${ended ? 'opacity-75' : ''}`}
              >
                <div>
                  <div className="relative">
                    <div className="relative aspect-[16/9] bg-forest-950 overflow-hidden">
                      <PosterImage
                        src={getBanner('event_' + event.id, event.image)}
                        alt={event.name}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-forest-950/90 backdrop-blur-md rounded-full text-[10px] font-bold text-gold-300 border border-gold-500/40">
                        {event.category}
                      </span>
                      <span className="absolute bottom-3 left-3"><StatusChip status={status} /></span>
                    </div>
                    {parts && (
                      <span className="absolute -bottom-6 right-5 z-10 w-14 rounded-xl overflow-hidden text-center shadow-lg bg-white border border-mist-300" aria-hidden="true">
                        <span className="block bg-gold-500 text-forest-950 text-[10px] font-bold tracking-widest py-0.5">{parts.month}</span>
                        <span className="block text-forest-900 font-serif-title text-2xl leading-tight py-1">{parts.day}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl text-forest-900 font-serif-title line-clamp-2 leading-snug pr-16">
                      {event.name}
                    </h3>

                    <div className="space-y-1.5">
                      <div className="flex items-start gap-1.5 text-xs text-forest-700 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {event.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  {event.registrationRequired === false ? (
                    <button
                      onClick={() => onNavigate('new-here')}
                      className="w-full py-3 bg-white hover:bg-mist-50 text-forest-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-forest-900/25"
                    >
                      Just come. Plan your visit
                    </button>
                  ) : (
                    <button
                      onClick={() => onRegisterEvent(event)}
                      disabled={ended}
                      className="w-full py-3 bg-forest-900 hover:bg-forest-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-gold-500/30"
                    >
                      {ended ? 'Registration closed' : 'Register now'}
                    </button>
                  )}
                  {slot && !ended && (
                    <button
                      onClick={() => downloadIcs(buildIcsMulti([slot], event.shortDescription), `${event.id}.ics`)}
                      className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-forest-700 hover:text-forest-500 cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" /> Add to my calendar
                    </button>
                  )}
                </div>
              </m.article>
            );
          })}
        </m.div>

        {/* Weekly regular services on a patterned band */}
        <section aria-labelledby="weekly-heading" className="pattern-band relative py-16 sm:py-20">
          <m.div {...reveal()} className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-[0.22em]">Every week</span>
            <h2 id="weekly-heading" className="text-3xl sm:text-4xl text-white font-serif-title">Regular weekly gatherings</h2>
            <span className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-12 bg-gold-400/60" />
              <span className="w-2 h-2 rotate-45 bg-gold-400" />
              <span className="h-px w-12 bg-gold-400/60" />
            </span>
            <p className="text-emerald-100/80">No registration needed. Just come as you are.</p>
          </m.div>

          <m.div
            {...staggerContainer(0.15)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Sun, ...CHURCH_INFO.services.sunday },
              { icon: Flame, ...CHURCH_INFO.services.midweek },
            ].map((service) => (
              <m.div
                key={service.name}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={LIFT_SPRING}
                className="rounded-3xl bg-white/[0.06] backdrop-blur border border-white/15 hover:border-gold-400/60 transition-colors p-7 sm:p-8 flex flex-col gap-4"
              >
                <span className="w-12 h-12 rounded-xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-gold-300" />
                </span>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300">
                    {service.day} @ {service.time}
                  </span>
                  <h3 className="text-2xl text-white font-serif-title">{service.name}</h3>
                </div>
                <p className="text-sm text-emerald-100/80 leading-relaxed flex-1">{service.description}</p>
                <button
                  onClick={() => onNavigate('new-here')}
                  className="self-start inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 cursor-pointer"
                >
                  Plan your visit →
                </button>
              </m.div>
            ))}
          </m.div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <ClosingInvite onNavigate={onNavigate} />
      </div>
    </div>
  );
};
