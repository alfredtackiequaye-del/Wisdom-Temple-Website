import React, { useState } from 'react';
import { m } from 'motion/react';
import { ChurchEvent, PageId } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { useBanners } from '../utils/bannerManager';
import { reveal, staggerContainer, staggerItem, LIFT_SPRING } from '../utils/motion';
import { getEventStatus, EventStatus } from '../utils/eventStatus';
import { parseEventDates } from '../utils/structuredData';
import { buildIcsMulti, downloadIcs, CalendarVisit } from '../utils/visitSchedule';
import {
  CalendarPlus,
  Clock,
  MapPin,
  Share2,
  Sun,
  Flame,
} from 'lucide-react';
import { PosterImage } from '../components/PosterImage';
import { ClosingInvite } from '../components/ClosingInvite';

interface EventsViewProps {
  events: ChurchEvent[];
  initialSubTab?: string;
  onRegisterEvent: (event: ChurchEvent) => void;
  onShare: (title: string, desc: string) => void;
  onNavigate: (page: PageId) => void;
}

const VENUE = 'Wisdom Temple, Star Junction, Tabora - Accra, Ghana';
const CATEGORIES = ['All', 'Conference', 'Prayer', 'Youth', 'Special Service'];

/** One calendar slot for a single-day event whose date and time can be read, else null. */
const slotForEvent = (event: ChurchEvent): CalendarVisit | null => {
  const parsed = parseEventDates(event.date, event.time);
  if (!parsed || parsed.endDate || !parsed.startDate.includes('T')) return null;
  return { title: event.name, start: Date.parse(parsed.startDate), lengthH: 3, location: event.venue || VENUE };
};

const StatusChip: React.FC<{ status: EventStatus }> = ({ status }) => {
  if (status.kind === 'live') {
    return (
      <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-700">
        <span className="live-dot" aria-hidden="true" /> Happening now
      </span>
    );
  }
  if (status.kind === 'soon') {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
        {status.days === 1 ? 'Tomorrow' : `In ${status.days} days`}
      </span>
    );
  }
  if (status.kind === 'past') {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
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

  const countFor = (cat: string) => (cat === 'All' ? events.length : events.filter((e) => e.category === cat).length);

  const filteredEvents = selectedCategory === 'All'
    ? events.filter((event) => event.id !== (events.find((item) => item.isFeatured)?.id))
    : events.filter(e => e.category === selectedCategory);

  const featuredEvent = events.find(e => e.isFeatured) || events.find(e => getEventStatus(e.date, e.time).kind !== 'past') || events[0];
  const featuredStatus = featuredEvent ? getEventStatus(featuredEvent.date, featuredEvent.time) : null;
  const featuredSlot = featuredEvent ? slotForEvent(featuredEvent) : null;

  return (
    <div className="page-warm-bg min-h-screen text-slate-900 pb-24 overflow-x-clip">
      <section className="relative overflow-hidden bg-forest-950 text-white">
        <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden="true">
          <div className="absolute -top-40 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/[0.03] to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 pb-12 sm:pt-36 sm:pb-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.2em] text-gold-300">Church services & special gatherings</p>
              <h1 className="mt-5 max-w-3xl font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.98] text-white">
                Make room for <span className="font-serif font-normal italic text-gold-400">what matters.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-emerald-100/75">
                Join us for worship, prayer and moments that bring our church family together.
                There is always a place for you.
              </p>
            </div>

            <div className="lg:col-span-5 lg:pb-1">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-emerald-200/60">Gather with us every week</p>
              <div className="grid grid-cols-2 divide-x divide-white/10 border-y border-white/15">
                {[
                  { icon: Sun, ...CHURCH_INFO.services.sunday },
                  { icon: Flame, ...CHURCH_INFO.services.midweek },
                ].map((service) => (
                  <div key={service.name} className="min-w-0 py-5 first:pr-4 last:pl-5 sm:py-6">
                    <div className="flex items-center gap-2 text-gold-300">
                      <service.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">{service.day}</span>
                    </div>
                    <p className="mt-2 font-display text-2xl sm:text-3xl text-white">{service.time}</p>
                    <p className="mt-1 text-xs text-emerald-100/65">{service.name}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('new-here')}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
              >
                Plan your first visit <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 sm:py-20 space-y-16 sm:space-y-20">
        {/* Featured programme */}
        {featuredEvent && selectedCategory === 'All' && (
          <m.section
            {...reveal()}
            aria-label="Featured event"
            className="grid overflow-hidden rounded-3xl border border-mist-300 bg-white shadow-sm lg:grid-cols-12"
          >
            <div className="relative min-h-56 overflow-hidden bg-forest-950 sm:min-h-72 lg:col-span-5">
              <PosterImage
                src={getBanner('event_' + featuredEvent.id, featuredEvent.image)}
                alt={featuredEvent.name}
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:col-span-7 lg:p-12">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Featured gathering</p>
                {featuredStatus && <StatusChip status={featuredStatus} />}
              </div>
              <h2 className="mt-4 max-w-xl font-display text-3xl sm:text-4xl text-forest-950">{featuredEvent.name}</h2>
              {featuredEvent.theme && <p className="mt-2 text-base text-forest-700">{featuredEvent.theme}</p>}
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">{featuredEvent.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-gold-700" aria-hidden="true" />{featuredEvent.date} · {featuredEvent.time}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-700" aria-hidden="true" />{featuredEvent.venue}</span>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => featuredEvent.registrationRequired ? onRegisterEvent(featuredEvent) : onNavigate('new-here')}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold-500 px-6 text-sm font-bold text-forest-950 transition-colors hover:bg-gold-400"
                >
                  {featuredEvent.registrationRequired ? 'Register now' : 'Plan your visit'}
                </button>
                <button
                  onClick={() => onShare(featuredEvent.name, `${featuredEvent.theme || featuredEvent.shortDescription} — ${featuredEvent.date} at ICGC WISDOM TEMPLE`)}
                  aria-label={`Share ${featuredEvent.name}`}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest-700 transition-colors hover:text-gold-700"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" /> Share
                </button>
                {featuredSlot && featuredStatus?.kind !== 'past' && (
                  <button
                    onClick={() => downloadIcs(buildIcsMulti([featuredSlot], featuredEvent.shortDescription), `${featuredEvent.id}.ics`)}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest-700 transition-colors hover:text-gold-700"
                  >
                    <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Add to calendar
                  </button>
                )}
              </div>
            </div>
          </m.section>
        )}

        {/* Upcoming events */}
        <m.div
          {...reveal()}
          className="flex flex-col gap-6 border-b border-mist-300 pb-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">Come together</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-forest-950">Upcoming gatherings</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">Find a gathering that speaks to this season of your life.</p>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`min-h-10 rounded-full border px-4 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'border-forest-950 bg-forest-950 text-white'
                    : 'border-mist-300 bg-transparent text-forest-700 hover:border-forest-700'
                }`}
              >
                {cat}<span className="ml-1.5 tabular-nums opacity-65">{countFor(cat)}</span>
              </button>
            ))}
          </div>
        </m.div>

        <m.div
          key={selectedCategory}
          {...staggerContainer(0.08)}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredEvents.map((event) => {
            const status = getEventStatus(event.date, event.time);
            const slot = slotForEvent(event);
            const ended = status.kind === 'past';
            return (
              <m.article
                key={event.id}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                transition={LIFT_SPRING}
                className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-mist-300 bg-white transition-[border-color,box-shadow,opacity] hover:border-gold-500/50 hover:shadow-lg ${ended ? 'opacity-70' : ''}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-forest-950">
                  <PosterImage
                    src={getBanner('event_' + event.id, event.image)}
                    alt={event.name}
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700">{event.category}</p>
                    <StatusChip status={status} />
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-snug text-forest-950">{event.name}</h3>
                  {event.theme && <p className="mt-1 text-sm text-slate-600">{event.theme}</p>}
                  <div className="mt-4 space-y-2 border-t border-mist-200 pt-4 text-xs text-slate-600">
                    <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" /><span>{event.date} · {event.time}</span></p>
                    <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" /><span className="break-words">{event.venue}</span></p>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{event.shortDescription}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-mist-200 pt-4">
                    <button
                      onClick={() => event.registrationRequired ? onRegisterEvent(event) : onNavigate('new-here')}
                      disabled={ended && event.registrationRequired}
                      className="min-h-11 text-sm font-bold text-forest-950 transition-colors hover:text-gold-700 disabled:cursor-not-allowed disabled:text-slate-500"
                    >
                      {ended && event.registrationRequired ? 'Registration closed' : event.registrationRequired ? 'Register' : 'Plan your visit'}
                    </button>
                  {slot && !ended && (
                    <button
                      onClick={() => downloadIcs(buildIcsMulti([slot], event.shortDescription), `${event.id}.ics`)}
                      className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-forest-700 transition-colors hover:text-gold-700"
                    >
                      <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Add to calendar
                    </button>
                  )}
                  </div>
                </div>
              </m.article>
            );
          })}
          {filteredEvents.length === 0 && (
            <p className="col-span-full rounded-2xl border border-mist-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
              No gatherings are scheduled in this category right now. Please check back soon.
            </p>
          )}
        </m.div>

      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-2">
        <ClosingInvite onNavigate={onNavigate} />
      </div>
    </div>
  );
};
