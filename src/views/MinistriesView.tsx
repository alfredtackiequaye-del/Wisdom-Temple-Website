import React, { useState } from 'react';
import { Ministry, PageId } from '../types';
import { useBanners } from '../utils/bannerManager';
import { 
  Users, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  X,
  Filter
} from 'lucide-react';
import { PosterImage } from '../components/PosterImage';

import { PageHero } from '../components/PageHero';
import { ClosingInvite } from '../components/ClosingInvite';
interface MinistriesViewProps {
  ministries: Ministry[];
  initialMinistryId?: string;
  onNavigate: (page: PageId) => void;
  onJoinMinistry: (ministryName: string, name: string, email: string, phone: string) => void;
}

export const MinistriesView: React.FC<MinistriesViewProps> = ({
  ministries,
  initialMinistryId,
  onNavigate,
  onJoinMinistry,
}) => {
  const { getBanner } = useBanners();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeJoinMinistry, setActiveJoinMinistry] = useState<Ministry | null>(null);

  // Join modal form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  const categories = ['All', 'Generational', 'Fellowship', 'Family Life', 'Missions', 'Production', 'Spiritual Fortress', 'Spiritual Growth'];

  const filteredMinistries = selectedCategory === 'All' 
    ? ministries 
    : ministries.filter(m => m.category === selectedCategory || (selectedCategory === 'Generational' && (m.id === 'children' || m.id === 'youth' || m.id === 'young-adults')));

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

      {/* Category Tabs */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 border border-mist-300 shadow-md flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-forest-700 mr-2 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-gold-500" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-forest-900 text-gold-300 shadow-sm border border-gold-500/40'
                  : 'bg-mist-100 text-forest-700 hover:bg-mist-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ministries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMinistries.map((ministry) => (
            <div
              key={ministry.id}
              className="group bg-white rounded-2xl border border-mist-300 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-forest-950 overflow-hidden">
                  <PosterImage
                    src={getBanner('ministry_' + ministry.id, ministry.image)}
                    alt={ministry.name}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-forest-950/90 backdrop-blur-md rounded text-[10px] font-bold text-gold-300 border border-gold-500/40">
                    {ministry.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-bold text-forest-900 font-serif-title">
                    {ministry.name}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ministry.shortDescription}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span><strong>Audience:</strong> {ministry.audience}</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Clock className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                      <span><strong>Meetings:</strong> {ministry.meetingSchedule}</span>
                    </div>

                    {!/^\[.*\]$/.test(ministry.leadPlaceholder.trim()) && (
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        <span><strong>Lead:</strong> {ministry.leadPlaceholder}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveJoinMinistry(ministry)}
                  className="w-full py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center space-x-1.5 border border-gold-500/30"
                >
                  <span>JOIN THIS MINISTRY</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Ministry Modal */}
      {activeJoinMinistry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-forest-950 border border-forest-700 rounded-2xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-forest-700 pb-3">
              <div>
                <span className="text-[10px] text-gold-300 font-bold uppercase">MINISTRY ENROLLMENT</span>
                <h3 className="font-bold text-white text-base font-serif-title">{activeJoinMinistry.name}</h3>
              </div>
              <button onClick={() => setActiveJoinMinistry(null)} className="text-emerald-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {joinSuccess ? (
              <div className="py-8 text-center text-gold-300 space-y-2 animate-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-10 h-10 mx-auto text-gold-500" />
                <h4 className="font-bold text-white text-base">Interest Registered!</h4>
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
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Ama Serwaa"
                    className="w-full px-3.5 py-2.5 bg-forest-850 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. +233 24 000 0000"
                    className="w-full px-3.5 py-2.5 bg-forest-850 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="ama@example.com"
                    className="w-full px-3.5 py-2.5 bg-forest-850 border border-forest-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    SUBMIT INTEREST
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <ClosingInvite onNavigate={onNavigate} />
      </div>
    </div>
  );
};
