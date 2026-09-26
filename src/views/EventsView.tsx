import React, { useState } from 'react';
import { ChurchEvent, PageId } from '../types';
import { useBanners } from '../utils/bannerManager';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Ticket
} from 'lucide-react';

interface EventsViewProps {
  events: ChurchEvent[];
  initialSubTab?: string;
  onRegisterEvent: (event: ChurchEvent) => void;
  onShare: (title: string, desc: string) => void;
  onNavigate: (page: PageId) => void;
}

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

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const featuredSummit = events.find(e => e.isFeaturedSummit) || events[0];

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="relative bg-[#02180e] text-white py-16 sm:py-20 border-b border-[#084c2e] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_events_hero', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')}
            alt="Events Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            CALENDAR & SACRED GATHERINGS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            Events & Conferences
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            Experience spiritual elevation, transformative encounters, and fellowship at our conferences, prayer vigils, and seasonal summits.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Featured Wisdom Summit Card */}
        {featuredSummit && (
          <div className="bg-[#032014] rounded-2xl border border-white/15 p-8 sm:p-12 text-white shadow-xl relative">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="px-3.5 py-1 bg-[#c99726] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-md">
                ANNUAL FLAGSHIP CONFERENCE
              </span>
              <button
                onClick={() => onShare(featuredSummit.name, `${featuredSummit.theme} - Register now for Wisdom Summit 2026 at Wisdom Temple`)}
                className="p-2 rounded-lg bg-[#042819] hover:bg-[#063821] text-emerald-200 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer border border-[#084c2e]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#c99726]" />
                <span>Share Summit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
                <div className="group relative rounded-xl overflow-hidden border border-white/20 shadow-xl bg-black w-full">
                  <img 
                    src={getBanner('wisdom_summit_banner', '/wisdom_summit_banner.png')} 
                    alt="Wisdom Summit 2026" 
                    className="w-full h-auto object-cover block mx-auto transition-transform duration-300 group-hover:scale-[1.008]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 bg-[#02180e] rounded-xl border border-white/15 p-6 sm:p-8 text-center space-y-6">
                <div className="w-14 h-14 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#dfb15b] flex items-center justify-center mx-auto">
                  <Ticket className="w-7 h-7 text-[#c99726]" />
                </div>
                <div>
                  <h4 className="font-serif font-light text-white text-xl tracking-tight">WISDOM SUMMIT 2026</h4>
                  <p className="text-xs text-emerald-300 mt-1">October 7 - 9 & 11, 2026</p>
                  <p className="text-xs text-emerald-200/80 mt-2">Admission is free. Register to reserve your seat and receive event notifications.</p>
                </div>
                <button
                  onClick={() => onRegisterEvent(featuredSummit)}
                  className="w-full py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  REGISTER FOR WISDOM SUMMIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d6e5dc] pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#032014] font-serif-title">All Scheduled Gatherings</h3>
            <p className="text-xs text-slate-500">Filter church calendar by category</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#032014] text-[#f5cf72] shadow-sm border border-[#c99726]/40'
                    : 'bg-[#eef6f1] text-[#07472c] hover:bg-[#e0eee4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-[#d6e5dc] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-[#02180e] overflow-hidden">
                  <img
                    src={getBanner('event_' + event.id, event.image)}
                    alt={event.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#02180e]/90 backdrop-blur-md rounded text-[10px] font-bold text-[#f5cf72] border border-[#c99726]/40">
                    {event.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#07472c] font-bold">
                    <span>{event.date}</span>
                    <span className="text-slate-400">{event.time}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#032014] font-serif-title line-clamp-1">
                    {event.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3">
                    {event.shortDescription}
                  </p>

                  <div className="pt-2 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center space-x-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#c99726] shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => onRegisterEvent(event)}
                  className="w-full py-2.5 bg-[#032014] hover:bg-[#063821] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-[#c99726]/30"
                >
                  REGISTER NOW
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Regular Service Times Reminder */}
        <div className="bg-[#eef6f1] rounded-2xl p-6 border border-[#c2decc] text-center space-y-2">
          <h4 className="font-bold text-[#032014] text-sm font-serif-title">Regular Weekly Gatherings</h4>
          <p className="text-xs text-[#07472c]">
            Sunday Celebration Service: <strong>Every Sunday at 8:00 AM</strong> • The Secret Place: <strong>Every Wednesday at 7:00 PM</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
