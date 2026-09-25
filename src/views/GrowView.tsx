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
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="relative bg-[#02180e] text-white py-16 sm:py-20 border-b border-[#084c2e] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_grow_hero', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=80')}
            alt="Grow Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            SPIRITUAL MATURITY & DISCIPLESHIP
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            GROW IN CHRIST
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            "Grow in the grace and knowledge of our Lord and Savior Jesus Christ." Equipping every believer with sound doctrine, fervent prayer, and daily fellowship with God.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Section 1: Daily Devotional Feature */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#d6e5dc] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-[#07472c]">
              <Sparkles className="w-5 h-5 text-[#c99726]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">DAILY BREAD & MEDITATION</span>
            </div>
            <span className="text-xs font-mono text-slate-500">Saturday, September 19, 2026</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-mono px-3 py-1 bg-[#eef6f1] text-[#07472c] border border-[#c2decc] rounded-full font-bold inline-block">
              THEME: WALKING IN PRUDENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#032014] font-serif-title">
              "The Prudent Man Foreseeth the Evil"
            </h2>
            <div className="p-4 bg-[#f8faf8] border-l-4 border-[#c99726] rounded-r-xl text-slate-800 font-mono text-xs sm:text-sm">
              "A prudent man foreseeth the evil, and hideth himself; but the simple pass on, and are punished." — Proverbs 22:3
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Divine wisdom does not simply rescue you after a calamity; it grants you foresight to anticipate and avoid traps before they manifest. As a believer positioned in the marketplace, family, or ministry, cultivate the spiritual sensitivity to discern motives, timing, and environments. Spend time in God's presence at <em>The Secret Place</em> where heavenly strategy is downloaded.
            </p>

            <div className="bg-[#fbf7ee] p-4 rounded-xl border border-[#c99726]/40 text-xs text-[#855e10] space-y-1">
              <strong className="block font-bold text-[#032014]">Daily Prayer Focus:</strong>
              <p>Lord, open my spiritual eyes to discern the traps of the adversary. Impart unto me the spirit of foresight, prudence, and excellent judgment in Jesus' name. Amen.</p>
            </div>
          </div>
        </div>

        {/* Section 2: 4 Pathways of Growth */}
        <div>
          <div className="mb-8">
            <span className="text-xs font-mono font-bold tracking-widest text-[#07472c] bg-[#eef6f1] px-3 py-1 rounded-full border border-[#c2decc] uppercase">
              STRUCTURED DISCIPLESHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#032014] font-serif-title mt-2">
              Core Spiritual Growth Tracks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Bible Study */}
            <div className="bg-white rounded-2xl p-6 border border-[#d6e5dc] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#c99726]" />
              </div>
              <h3 className="text-lg font-bold text-[#032014] font-serif-title">Systematic Bible Study</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Weekly study guides, chapter-by-chapter expositions, and hermeneutics to help you read and rightly divide the Scriptures.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#07472c]" />
                  <span>Epistle of Ephesians Series</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#07472c]" />
                  <span>Proverbs: Practical Wisdom</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Prayer Discipline */}
            <div className="bg-white rounded-2xl p-6 border border-[#d6e5dc] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#c99726]" />
              </div>
              <h3 className="text-lg font-bold text-[#032014] font-serif-title">The Secret Place Prayer Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Building stamina in tongues, midnight vigils, fasting, and biblical intercession for your family and nation.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#07472c]" />
                  <span>Wednesdays at 7:00 PM</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#07472c]" />
                  <span>Monthly All-Night Vigils</span>
                </li>
              </ul>
            </div>

            {/* Card 3: New Believers Class */}
            <div className="bg-white rounded-2xl p-6 border border-[#d6e5dc] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#c99726]" />
              </div>
              <h3 className="text-lg font-bold text-[#032014] font-serif-title">Foundation School</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A 6-week foundational course covering salvation, water baptism, the Holy Spirit, stewardship, and church membership.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#07472c]" />
                  <span>Sundays at 7:00 AM</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#07472c]" />
                  <span>Certificate upon completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Foundation School Enrollment Form */}
        <div className="bg-[#02180e] text-white rounded-3xl p-8 sm:p-10 border border-[#084c2e]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
                NEW CONVERTS & BELIEVERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-title">
                Enroll in Foundation School
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Whether you just accepted Jesus Christ, recently moved to our neighborhood, or desire to ground your theological understanding in the charismatic faith, Foundation School is tailored for you.
              </p>
              <div className="flex items-center space-x-2 text-xs text-emerald-200 font-mono">
                <Calendar className="w-4 h-4 text-[#c99726]" />
                <span>Next Intake: First Sunday of Every Month at 7:00 AM</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#042819] p-6 rounded-2xl border border-[#084c2e]">
              {foundationFormSubmitted ? (
                <div className="text-center py-6 space-y-2 text-[#f5cf72]">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-[#c99726]" />
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
                      className="w-full px-3.5 py-2.5 bg-[#02180e] border border-[#084c2e] rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#c99726]"
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
                      className="w-full px-3.5 py-2.5 bg-[#02180e] border border-[#084c2e] rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
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
