import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageId, VisitPlan } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { useBanners } from '../utils/bannerManager';
import { 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Smile, 
  Coffee, 
  Baby,
  ArrowRight
} from 'lucide-react';
import { reveal } from '../utils/motion';

interface NewHereViewProps {
  onNavigate: (page: PageId) => void;
  onSubmitVisitPlan: (plan: Omit<VisitPlan, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export const NewHereView: React.FC<NewHereViewProps> = ({ onNavigate, onSubmitVisitPlan }) => {
  const { getBanner } = useBanners();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceDate, setServiceDate] = useState('Next Sunday');
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [needAssistance, setNeedAssistance] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');
  const [planSubmitted, setPlanSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onSubmitVisitPlan({
      fullName,
      email: email || 'Not provided',
      phone: phone || 'Not provided',
      serviceDate,
      serviceTime: '8:00 AM',
      adultsCount,
      childrenCount,
      needAssistance,
      specialNeeds: specialNotes,
    });

    setPlanSubmitted(true);
  };

  return (
    <div className="bg-mist-50 min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="relative bg-forest-950 text-white py-16 sm:py-20 border-b border-forest-700 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_newhere_hero', '/assets/optimized/hero_icgc_banner.webp')}
            alt="New Here Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs text-gold-300 font-bold uppercase tracking-widest bg-forest-850 px-3.5 py-1.5 rounded-full border border-gold-500/40 inline-block">
            YOU ARE OUR HONORED GUEST
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            Plan Your Visit
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            Visiting a church for the first time should be warm, refreshing, and inspiring. We can't wait to welcome you to Wisdom Temple.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* The 3-Step Visitor Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phase 1: Before You Come - Amber Gold Theme */}
          <motion.div
            {...reveal()}
            whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(201, 151, 38, 0.15)" }}
            className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/90 shadow-md hover:border-gold-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-6 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gold-500 text-forest-950 border border-gold-400 flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-md border border-amber-300">
                  BEFORE YOU COME
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-forest-900 font-serif-title">
                  Service Times & Directions
                </h3>
                <ul className="text-xs text-slate-700 space-y-3">
                  <li className="flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Sunday Celebration:</strong> 8:00 AM sharp (runs approximately 2 hours).</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Midweek:</strong> The Secret Place, Wednesdays at 7:00 PM.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Location:</strong> Wisdom Temple Auditorium, {CHURCH_INFO.location}.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Parking:</strong> Secure church compound parking with protocol attendants.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Smile className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Dress Code:</strong> Come comfortable and modest. Both traditional Ghanaian attire and smart casual are welcome.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2">
              <div className="w-full py-2 px-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] font-bold text-amber-900 text-center">
                Doors open 45 minutes before service
              </div>
            </div>
          </motion.div>

          {/* Phase 2: When You Arrive - ICGC Forest Emerald Theme */}
          <motion.div
            {...reveal(0.08)}
            whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(7, 71, 44, 0.15)" }}
            className="bg-white rounded-3xl overflow-hidden border-2 border-emerald-200/90 shadow-md hover:border-emerald-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-6 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-forest-700 text-gold-400 border border-forest-700 flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-300">
                  WHEN YOU ARRIVE
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-forest-900 font-serif-title">
                  Hospitality & Children Care
                </h3>
                <ul className="text-xs text-slate-700 space-y-3">
                  <li className="flex items-start space-x-2.5">
                    <Heart className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Welcome Team:</strong> Look for ushers in identifiable badges ready to guide you to seating.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Baby className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Kingdom Kids:</strong> Safe, secure children's church with trained Bible teachers for ages 1 to 12.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Users className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Seating:</strong> Our auditorium is air-conditioned with comfortable seating and live audio-visual displays.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">No Awkward Spotlights:</strong> You will not be singled out or asked to stand in front of the congregation.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2">
              <div className="w-full py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] font-bold text-emerald-900 text-center">
                Dedicated hosts ready at the welcome desk
              </div>
            </div>
          </motion.div>

          {/* Phase 3: After Service - ICGC Bronze & Teal Theme */}
          <motion.div
            {...reveal(0.16)}
            whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(13, 148, 136, 0.15)" }}
            className="bg-white rounded-3xl overflow-hidden border-2 border-teal-200/90 shadow-md hover:border-teal-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-6 bg-teal-50/60 border-b border-teal-100 flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-forest-900 text-gold-400 border border-forest-700 flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-3 py-1 rounded-md border border-teal-300">
                  AFTER SERVICE
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-forest-900 font-serif-title">
                  Reception & Connection
                </h3>
                <ul className="text-xs text-slate-700 space-y-3">
                  <li className="flex items-start space-x-2.5">
                    <Coffee className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Guest Reception:</strong> Join our pastoral team for light refreshments immediately after service.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Welcome Gift:</strong> A special token and devotional to bless your spiritual journey.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <ArrowRight className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Next Steps:</strong> Learn about membership, baptism, or join a small group fellowship.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2">
              <div className="w-full py-2 px-3 bg-teal-50 rounded-xl border border-teal-200/80 text-[11px] font-bold text-teal-900 text-center">
                Pastoral fellowship & devotional gift pack
              </div>
            </div>
          </motion.div>
        </div>

        {/* Plan Your Visit Interactive Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-mist-300 shadow-md max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-mist-100 px-3 py-1 rounded-full border border-mist-400">
              LET US KNOW YOU'RE COMING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-serif-title mt-2">
              Pre-Register Your Visit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              When you tell us you are coming, our host team will reserve seating, prepare children's registration, and meet you at the door.
            </p>
          </div>

          {planSubmitted ? (
            <div className="py-8 sm:py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 sm:w-10 h-8 sm:h-10 text-forest-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-forest-900 font-serif-title">We Can't Wait to Meet You!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Our hospitality team has recorded your visit for {serviceDate} at 8:00 AM. A guest reception pass has been reserved in your name.
              </p>

              <div className="p-4 bg-gold-50 rounded-2xl border border-gold-500/50 max-w-md mx-auto text-left space-y-1">
                <span className="text-[10px] uppercase text-forest-700 font-bold block">
                  VISITOR RESERVATION CODE
                </span>
                <span className="text-base sm:text-lg font-black text-forest-900 block">
                  WT-GUEST-{Math.floor(1000 + Math.random() * 9000)}
                </span>
                <span className="text-xs text-slate-600 block">
                  Party: {adultsCount} Adult(s) {childrenCount > 0 ? `• ${childrenCount} Child(ren)` : ''}
                </span>
              </div>

              <div className="pt-3 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setPlanSubmitted(false)}
                  className="px-5 py-2.5 bg-white border border-mist-400 hover:bg-slate-50 text-forest-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Plan Another Visit
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-forest-900 font-semibold uppercase mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kwabena Osei"
                  className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwabena@example.com"
                    className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1.5">Phone (WhatsApp preferred)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +233 24 000 0000"
                    className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1.5">Planned Sunday</label>
                  <select
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="This Sunday (8:00 AM)">This Sunday (8:00 AM)</option>
                    <option value="Next Sunday (8:00 AM)">Next Sunday (8:00 AM)</option>
                    <option value="The Secret Place (Wed 7:00 PM)">The Secret Place (Wed 7:00 PM)</option>
                    <option value="Later this month">Later this month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1.5">Adults</label>
                  <select
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4+ Adults</option>
                  </select>
                </div>
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1.5">Children (Ages 1-12)</label>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value={0}>No Children</option>
                    <option value={1}>1 Child</option>
                    <option value={2}>2 Children</option>
                    <option value={3}>3+ Children</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={needAssistance}
                    onChange={(e) => setNeedAssistance(e.target.checked)}
                    className="w-4 h-4 rounded border-mist-300 text-gold-500 focus:ring-gold-500"
                  />
                  <span>I or a family member would appreciate assistance (e.g. mobility, wheelchair, translations)</span>
                </label>
              </div>

              <div>
                <label className="block text-forest-900 font-semibold uppercase mb-1.5">Any Questions or Special Notes?</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Tell us anything that will make your visit comfortable..."
                  className="w-full px-4 py-2.5 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  CONFIRM MY VISIT
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
