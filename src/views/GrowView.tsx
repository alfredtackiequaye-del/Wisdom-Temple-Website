import React, { useState } from 'react';
import { PageId } from '../types';
import { useBanners } from '../utils/bannerManager';
import { 
  BookOpen, 
  Sparkles, 
  Flame, 
  GraduationCap, 
  CheckCircle2, 
  Calendar
} from 'lucide-react';

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

  return (
    <div className="bg-mist-50 min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="relative bg-forest-950 text-white py-16 sm:py-20 border-b border-forest-700 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_grow_hero', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=80')}
            alt="Grow Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs text-gold-300 font-bold uppercase tracking-widest bg-forest-850 px-3.5 py-1.5 rounded-full border border-gold-500/40 inline-block">
            SPIRITUAL MATURITY & DISCIPLESHIP
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            Grow in Christ
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            "Grow in the grace and knowledge of our Lord and Savior Jesus Christ." Equipping every believer with sound doctrine, fervent prayer, and daily fellowship with God.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Section 1: Daily Devotional Feature */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-mist-300 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-forest-700">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span className="text-xs font-bold uppercase tracking-wider">DAILY BREAD & MEDITATION</span>
            </div>
            <span className="text-xs text-slate-500">Saturday, September 19, 2026</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <span className="text-xs px-3 py-1 bg-mist-100 text-forest-700 border border-mist-400 rounded-full font-bold inline-block">
              THEME: WALKING IN PRUDENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-serif-title">
              "The Prudent Man Foreseeth the Evil"
            </h2>
            <div className="p-4 bg-mist-50 border-l-4 border-gold-500 rounded-r-xl text-slate-800 text-xs sm:text-sm">
              "A prudent man foreseeth the evil, and hideth himself; but the simple pass on, and are punished." — Proverbs 22:3
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Divine wisdom does not simply rescue you after a calamity; it grants you foresight to anticipate and avoid traps before they manifest. As a believer positioned in the marketplace, family, or ministry, cultivate the spiritual sensitivity to discern motives, timing, and environments. Spend time in God's presence at <em>The Secret Place</em> where heavenly strategy is downloaded.
            </p>

            <div className="bg-gold-50 p-4 rounded-xl border border-gold-500/40 text-xs text-gold-700 space-y-1">
              <strong className="block font-bold text-forest-900">Daily Prayer Focus:</strong>
              <p>Lord, open my spiritual eyes to discern the traps of the adversary. Impart unto me the spirit of foresight, prudence, and excellent judgment in Jesus' name. Amen.</p>
            </div>
          </div>
        </div>

        {/* Section 2: 4 Pathways of Growth */}
        <div>
          <div className="mb-8">
            <span className="text-xs font-bold tracking-widest text-forest-700 bg-mist-100 px-3 py-1 rounded-full border border-mist-400 uppercase">
              STRUCTURED DISCIPLESHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-serif-title mt-2">
              Core Spiritual Growth Tracks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Bible Study */}
            <div className="bg-white rounded-2xl p-6 border border-mist-300 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-mist-100 text-forest-700 border border-mist-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-bold text-forest-900 font-serif-title">Systematic Bible Study</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Weekly study guides, chapter-by-chapter expositions, and hermeneutics to help you read and rightly divide the Scriptures.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Epistle of Ephesians Series</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Proverbs: Practical Wisdom</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Prayer Discipline */}
            <div className="bg-white rounded-2xl p-6 border border-mist-300 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-mist-100 text-forest-700 border border-mist-400 flex items-center justify-center">
                <Flame className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-bold text-forest-900 font-serif-title">The Secret Place Prayer Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Building stamina in tongues, midnight vigils, fasting, and biblical intercession for your family and nation.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Wednesdays at 7:00 PM</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Monthly All-Night Vigils</span>
                </li>
              </ul>
            </div>

            {/* Card 3: New Believers Class */}
            <div className="bg-white rounded-2xl p-6 border border-mist-300 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-mist-100 text-forest-700 border border-mist-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-bold text-forest-900 font-serif-title">Foundation School</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A 6-week foundational course covering salvation, water baptism, the Holy Spirit, stewardship, and church membership.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Sundays at 7:00 AM</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Certificate upon completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Foundation School Enrollment Form */}
        <div className="bg-forest-950 text-white rounded-3xl p-8 sm:p-10 border border-forest-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs text-gold-300 font-bold uppercase tracking-widest bg-forest-850 px-3.5 py-1.5 rounded-full border border-gold-500/40 inline-block">
                NEW CONVERTS & BELIEVERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-title">
                Enroll in Foundation School
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Whether you just accepted Jesus Christ, recently moved to our neighborhood, or desire to ground your theological understanding in the charismatic faith, Foundation School is tailored for you.
              </p>
              <div className="flex items-center space-x-2 text-xs text-emerald-200">
                <Calendar className="w-4 h-4 text-gold-500" />
                <span>Next Intake: First Sunday of Every Month at 7:00 AM</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-forest-850 p-6 rounded-2xl border border-forest-700">
              {foundationFormSubmitted ? (
                <div className="text-center py-6 space-y-2 text-gold-300">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-gold-500" />
                  <h4 className="text-base font-bold text-white">Enrollment Registered!</h4>
                  <p className="text-xs text-emerald-200">
                    The Foundation School coordinator will contact you with classroom materials and syllabus details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFoundationSignup} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={foundationName}
                      onChange={(e) => setFoundationName(e.target.value)}
                      placeholder="e.g. Yaw Boateng"
                      className="w-full px-3.5 py-2.5 bg-forest-950 border border-forest-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 uppercase mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={foundationPhone}
                      onChange={(e) => setFoundationPhone(e.target.value)}
                      placeholder="e.g. +233 24 000 0000"
                      className="w-full px-3.5 py-2.5 bg-forest-950 border border-forest-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    ENROLL IN FOUNDATION SCHOOL
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
