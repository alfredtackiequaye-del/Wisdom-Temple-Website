import React, { useState } from 'react';
import { PrayerRequest, PageId } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { 
  Send, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

interface PrayerRequestViewProps {
  onNavigate: (page: PageId) => void;
  onSubmitPrayerRequest: (request: Omit<PrayerRequest, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export const PrayerRequestView: React.FC<PrayerRequestViewProps> = ({
  onNavigate,
  onSubmitPrayerRequest,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string>('Healing & Health');
  const [requestText, setRequestText] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);
  const [wantsFollowup, setWantsFollowup] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Healing & Health',
    'Family & Marriage',
    'Financial Breakthrough & Employment',
    'Fruit of the Womb',
    'Spiritual Growth & Deliverance',
    'Academic & Career Favor',
    'Thanksgiving & Praise',
    'Other Petition',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    onSubmitPrayerRequest({
      fullName: fullName.trim() ? fullName : 'Anonymous Intercession',
      phone: phone || 'Confidential',
      email: email || 'Confidential',
      category,
      requestText,
      isConfidential,
      wantsFollowup,
    });

    setSubmitted(true);
  };

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="bg-[#02180e] text-white py-16 sm:py-20 border-b border-[#084c2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            THE ALTAR OF INTERCESSION
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            SUBMIT A PRAYER REQUEST
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            "The effectual fervent prayer of a righteous man availeth much." You do not walk alone. Our pastors and Secret Place intercessors stand with you in faith.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* Pastoral Assurance Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d6e5dc] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center shrink-0">
            <Lock className="w-7 h-7 text-[#c99726]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#032014] text-lg font-serif-title">Strict Pastoral Confidentiality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every request is handled with spiritual reverence. If you select confidential, only Senior Pastor [PASTOR NAME] and the designated pastoral team receive your petition.
            </p>
          </div>
        </div>

        {/* Prayer Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#d6e5dc] shadow-md">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#f5cf72] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#07472c]" />
              </div>
              <h3 className="text-2xl font-bold text-[#032014] font-serif-title">Your Petition Has Been Placed on the Altar</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for entrusting your request to us. Our ministerial team will uphold you in prayer this Wednesday at <em>The Secret Place</em>. God is faithful.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setRequestText('');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-xs rounded-xl cursor-pointer shadow"
                >
                  Submit Another Request
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-6 py-2.5 bg-[#eef6f1] hover:bg-[#e0eee4] text-[#07472c] font-bold text-xs rounded-xl cursor-pointer border border-[#c2decc]"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="space-y-2">
                <label className="block text-[#032014] font-semibold uppercase">Nature of Petition *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-2.5 text-center rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                        category === cat
                          ? 'bg-[#032014] text-[#f5cf72] border-[#032014] shadow'
                          : 'bg-[#f8faf8] text-slate-700 border-[#d6e5dc] hover:bg-[#eef6f1]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#032014] font-semibold uppercase mb-1.5">
                  Your Prayer Request / Petition *
                </label>
                <textarea
                  required
                  rows={5}
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="Share what is on your heart. Be as detailed as you wish. Our intercessors will lift this specifically before the Throne of Grace..."
                  className="w-full p-4 bg-[#f8faf8] border border-[#d6e5dc] rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Leave blank to stay anonymous"
                    className="w-full px-4 py-3 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +233 24 000 0000"
                    className="w-full px-4 py-3 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d6e5dc] text-[#c99726] focus:ring-[#c99726]"
                  />
                  <span>
                    Keep strictly confidential (only Senior Pastor and Pastoral team will see this)
                  </span>
                </label>

                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsFollowup}
                    onChange={(e) => setWantsFollowup(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d6e5dc] text-[#c99726] focus:ring-[#c99726]"
                  />
                  <span>I would appreciate a follow-up call or prayer message from pastoral care</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>PLACE PETITION ON THE ALTAR</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Urgent Prayer Line */}
        <div className="bg-[#fbf7ee] rounded-2xl p-6 border border-[#c99726]/40 text-center space-y-2">
          <h4 className="font-bold text-[#032014] text-sm font-serif-title">Urgent Prayer or Hospital Visitation Need?</h4>
          <p className="text-xs text-slate-700">
            For critical emergencies or immediate pastoral support, call our 24/7 Prayer Line: <strong className="font-mono text-[#07472c] font-bold">{CHURCH_INFO.phone}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
