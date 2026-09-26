import React, { useState, useMemo } from 'react';
import { Sermon } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { useBanners } from '../utils/bannerManager';
import { 
  Search, 
  Play, 
  Headphones, 
  BookOpen, 
  Filter, 
  Share2, 
  Youtube,
  ExternalLink
} from 'lucide-react';

interface WatchListenViewProps {
  sermons: Sermon[];
  initialCategory?: string;
  onPlayAudio: (sermon: Sermon) => void;
  onWatchVideo: (sermon: Sermon) => void;
  onShare: (title: string, desc: string) => void;
}

export const WatchListenView: React.FC<WatchListenViewProps> = ({
  sermons,
  initialCategory,
  onPlayAudio,
  onWatchVideo,
  onShare,
}) => {
  const { getBanner } = useBanners();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory && initialCategory !== 'all' ? initialCategory : 'All'
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('All');

  // Categories
  const categories = ['All', 'Sunday Message', 'The Secret Place', 'Wisdom Summit', 'Special Teaching'];

  // Speakers extracted from sermons
  const speakers = useMemo(() => {
    const list = Array.from(new Set(sermons.map(s => s.speaker)));
    return ['All', ...list];
  }, [sermons]);

  // Filtered sermons
  const filteredSermons = useMemo(() => {
    return sermons.filter((sermon) => {
      const matchesCategory = selectedCategory === 'All' || sermon.category === selectedCategory;
      const matchesSpeaker = selectedSpeaker === 'All' || sermon.speaker === selectedSpeaker;
      const matchesQuery = 
        sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sermon.series && sermon.series.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSpeaker && matchesQuery;
    });
  }, [sermons, selectedCategory, selectedSpeaker, searchQuery]);

  return (
    <div className="bg-mist-50 min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="relative bg-forest-950 text-white py-16 sm:py-20 border-b border-forest-700 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_watch_hero', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1920&q=80')}
            alt="Watch Listen Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs text-gold-300 font-bold uppercase tracking-widest bg-forest-850 px-3.5 py-1.5 rounded-full border border-gold-500/40 inline-block">
            DIGITAL SANCTUARY & TEACHINGS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            Watch & Listen
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            Feast on the timeless, transformational counsel of God. Explore Sunday messages, midweek encounters at The Secret Place, and Wisdom Summit teachings.
          </p>

          {/* YouTube Channel Banner */}
          <div className="pt-2">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-forest-850 border border-forest-700 rounded-full text-xs text-emerald-200">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Official YouTube Channel: <strong className="text-gold-300">{CHURCH_INFO.social.youtube}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-mist-300 shadow-lg space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sermon title, scripture (e.g. Proverbs 4:7), series, or keyword..."
              className="w-full pl-12 pr-4 py-3.5 bg-mist-50 border border-mist-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-forest-700 mr-2 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-gold-500" />
                <span>Category:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-forest-900 text-white shadow-sm border border-gold-500/40'
                      : 'bg-mist-100 text-forest-700 hover:bg-mist-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Speaker Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-forest-700 font-semibold">Speaker:</span>
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                className="px-3 py-1.5 bg-mist-50 border border-mist-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                {speakers.map((spk) => (
                  <option key={spk} value={spk}>
                    {spk}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sermon List Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Latest Message Hero Player (Displayed when not filtering search) */}
        {!searchQuery && selectedCategory === 'All' && selectedSpeaker === 'All' && sermons.length > 0 && (
          <div className="mb-12 bg-forest-900 rounded-3xl p-6 sm:p-8 border border-forest-700 shadow-2xl text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-forest-700">
              <div className="flex items-center space-x-2.5">
                <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>LATEST MESSAGE</span>
                </span>
                <span className="text-xs text-gold-300 font-semibold">Wisdom Temple YouTube Broadcast</span>
              </div>

              {sermons[0].youtubeUrl && (
                <a
                  href={sermons[0].youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-emerald-200 hover:text-white font-semibold transition-colors bg-forest-950 hover:bg-red-950/60 px-3.5 py-1.5 rounded-lg border border-forest-700 hover:border-red-800/60"
                >
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* 16:9 Responsive Video Player */}
              <div className="lg:col-span-7 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-forest-700 bg-black">
                {sermons[0].videoEmbedUrl ? (
                  <iframe
                    src={`${sermons[0].videoEmbedUrl}?rel=0`}
                    title={`${sermons[0].title} - Wisdom Temple`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={sermons[0].thumbnail}
                    alt={sermons[0].title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Message Details */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <span className="text-xs text-gold-300 uppercase tracking-wider block font-semibold">
                    {sermons[0].category} • {sermons[0].series || 'Vision & Destiny'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-serif-title">
                    {sermons[0].title}
                  </h2>
                  <p className="text-xs text-emerald-200/90 mt-1">
                    {sermons[0].speaker} • Scripture: {sermons[0].scripture}
                  </p>
                </div>

                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {sermons[0].summary}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => onPlayAudio(sermons[0])}
                    className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Headphones className="w-4 h-4 fill-forest-950" />
                    <span>Listen Audio</span>
                  </button>

                  <button
                    onClick={() => onWatchVideo(sermons[0])}
                    className="px-4 py-2.5 bg-forest-800 hover:bg-forest-700 text-emerald-100 font-bold text-xs rounded-xl border border-forest-700 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-100" />
                    <span>Video Details & Notes</span>
                  </button>

                  <button
                    onClick={() => onShare(sermons[0].title, `Watch '${sermons[0].title}' from Wisdom Temple: https://www.youtube.com/watch?v=cnVwK9eU7EI`)}
                    className="px-4 py-2.5 bg-forest-850 hover:bg-forest-800 text-emerald-200 font-bold text-xs rounded-xl border border-forest-700 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-gold-500" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span>Showing <strong>{filteredSermons.length}</strong> messages</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-forest-700 hover:underline font-semibold cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>

        {filteredSermons.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-mist-300 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 font-serif-title">No messages found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white rounded-2xl border border-mist-300 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-forest-950 overflow-hidden">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-forest-950/90 backdrop-blur-md text-gold-300 text-[10px] font-bold uppercase rounded border border-gold-500/40">
                      {sermon.category}
                    </span>

                    <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-forest-950/90 text-emerald-200 text-[10px] rounded">
                      {sermon.duration}
                    </span>

                    {/* Quick Watch Icon Overlay */}
                    <button
                      onClick={() => onWatchVideo(sermon)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-forest-950/50 backdrop-blur-xs transition-opacity cursor-pointer"
                      aria-label={`Watch ${sermon.title}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-forest-950" />
                      </div>
                    </button>
                  </div>

                  {/* Sermon Details */}
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="">{sermon.date}</span>
                      {sermon.series && (
                        <span className="text-forest-700 font-semibold truncate max-w-[140px]">
                          {sermon.series}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1 font-serif-title">
                      {sermon.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium">
                      {sermon.speaker}
                    </p>

                    <div className="flex items-center space-x-1.5 text-xs text-forest-700 font-semibold bg-mist-100 border border-mist-400 px-2.5 py-1 rounded-md w-fit">
                      <BookOpen className="w-3.5 h-3.5 text-gold-500" />
                      <span>{sermon.scripture}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                      {sermon.summary}
                    </p>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-2">
                  <div className="flex items-center justify-between pt-3 gap-2">
                    <button
                      onClick={() => onWatchVideo(sermon)}
                      className="flex-1 py-2 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-gold-500/30"
                    >
                      <Play className="w-3.5 h-3.5 fill-gold-300 text-gold-300" />
                      <span>Watch</span>
                    </button>

                    <button
                      onClick={() => onPlayAudio(sermon)}
                      className="flex-1 py-2 bg-gold-50 hover:bg-gold-50 text-gold-700 border border-gold-400/60 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5 text-gold-500" />
                      <span>Listen</span>
                    </button>

                    <button
                      onClick={() => onShare(sermon.title, `Listen to this message from Wisdom Temple: ${sermon.scripture}`)}
                      className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Share Sermon"
                    >
                      <Share2 className="w-4 h-4 text-forest-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
