import React, { useState } from 'react';
import { PrayerRequest, PageId } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { 
  Send, 
  CheckCircle2, 
  Lock,
  Copy,
  Check,
  ShieldCheck,
  PhoneCall
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
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const categories = [
    'Healing & Health',
    'Family & Marriage',
    'Financial Breakthrough',
    'Fruit of the Womb',
    'Spiritual Growth',
    'Academic & Career',
    'Thanksgiving & Praise',
    'Other Petition',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const code = `WT-ALTAR-${randomCode}`;

    onSubmitPrayerRequest({
      fullName: fullName.trim() ? fullName : 'Anonymous Intercession',
      phone: phone || 'Confidential',
      email: email || 'Confidential',
      category,
      requestText,
      isConfidential,
      wantsFollowup,
    });

    setSubmittedCode(code);
  };

  const handleCopyCode = () => {
    if (submittedCode) {
      navigator.clipboard.writeText(submittedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="bg-[#02180e] text-white py-14 sm:py-20 border-b border-[#084c2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            THE ALTAR OF INTERCESSION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            SUBMIT A PRAYER REQUEST
          </h1>
          <p className="text-sm sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            "The effectual fervent prayer of a righteous man availeth much." You do not walk alone. Our pastors and Secret Place intercessors stand with you in faith.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8 sm:space-y-12">
        {/* Pastoral Assurance Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#d6e5dc] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center shrink-0">
            <Lock className="w-6 sm:w-7 h-6 sm:h-7 text-[#c99726]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#032014] text-base sm:text-lg font-serif-title">
              Strict Pastoral Confidentiality
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every request is handled with spiritual reverence. If you select confidential, only Shepherd Rev. Gabriel Dela and the designated pastoral prayer intercessors receive your petition.
            </p>
          </div>
        </div>

        {/* Prayer Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#d6e5dc] shadow-md">
          {submittedCode ? (
            <div className="py-8 sm:py-12 text-center space-y-5 animate-in zoom-in-95 duration-200 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#f5cf72] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#07472c]" />
              </div>
              <h3 className="text-2xl font-bold text-[#032014] font-serif-title">
                Your Petition Has Been Placed on the Altar
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Thank you for entrusting your request to us. Our pastoral intercessory team will uphold you in prayer this Wednesday at <em>The Secret Place</em>.
              </p>

              {/* Reference Box */}
              <div className="p-4 sm:p-5 bg-[#fbf7ee] rounded-2xl border border-[#c99726]/50 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#07472c] font-bold block">
                    INTERCESSION REFERENCE CODE
                  </span>
                  <span className="text-lg font-mono font-black text-[#032014]">
                    {submittedCode}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Category: {category}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-white text-[#032014] hover:bg-slate-50 border border-[#c99726] rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#c99726]" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 bg-[#eef6f1] p-3 rounded-xl border border-[#c2decc]">
                <span>Delivered securely to the pastoral altar. You can check in anytime via the prayer desk.</span>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmittedCode(null);
                    setRequestText('');
                  }}
                  className="px-5 py-2.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Submit Another Request
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-5 py-2.5 bg-[#eef6f1] hover:bg-[#e0eee4] text-[#07472c] font-bold text-xs rounded-xl cursor-pointer border border-[#c2decc]"
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
                  rows={4}
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="Share what is on your heart. Our intercessors will lift this specifically before the Throne of Grace..."
                  className="w-full p-4 bg-[#f8faf8] border border-[#d6e5dc] rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Leave blank for anonymous"
                    className="w-full px-3.5 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +233 24 000 0000"
                    className="w-full px-3.5 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-start space-x-2.5 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d6e5dc] text-[#c99726] focus:ring-[#c99726] mt-0.5 shrink-0"
                  />
                  <span>
                    Keep strictly confidential (only Senior Pastor and Pastoral intercessors will view this)
                  </span>
                </label>

                <label className="flex items-start space-x-2.5 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsFollowup}
                    onChange={(e) => setWantsFollowup(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d6e5dc] text-[#c99726] focus:ring-[#c99726] mt-0.5 shrink-0"
                  />
                  <span>I would appreciate a pastoral follow-up or prayer call</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>PLACE PETITION ON THE ALTAR</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Urgent Prayer Line */}
        <div className="bg-[#fbf7ee] rounded-2xl p-5 sm:p-6 border border-[#c99726]/40 text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-[#07472c]">
            <PhoneCall className="w-4 h-4 text-[#c99726]" />
            <h4 className="font-bold text-[#032014] text-xs sm:text-sm font-serif-title">
              Urgent Prayer or Pastoral Need?
            </h4>
          </div>
          <p className="text-xs text-slate-700">
            For critical emergencies or immediate prayer counsel, call our 24/7 Church Line: <strong className="font-mono text-[#07472c] font-bold">{CHURCH_INFO.phone}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
