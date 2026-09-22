import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../types';
import { GIVING_DETAILS } from '../data/churchData';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Copy,
  ZoomIn,
  X,
  Download
} from 'lucide-react';

interface GiveViewProps {
  onNavigate: (page: PageId) => void;
}

export const GiveView: React.FC<GiveViewProps> = () => {
  const [selectedFund, setSelectedFund] = useState<string>('Tithes');
  const [currency, setCurrency] = useState<'GHS' | 'USD'>('GHS');
  const [amount, setAmount] = useState<string>('100');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [donorName, setDonorName] = useState('');
  const [generatedReference, setGeneratedReference] = useState<string | null>(null);
  const [flyerModalOpen, setFlyerModalOpen] = useState(false);

  const funds = [
    { id: 'Tithes', label: 'Tithes (Malachi 3:10)', desc: 'Honor God with the first tenth of your income.' },
    { id: 'Offering', label: 'Sunday / General Offering', desc: 'Freewill thanksgiving seed for worship.' },
    { id: 'Firstfruit', label: 'Firstfruit Seed', desc: 'Consecrating your beginning harvest unto the Lord.' },
    { id: 'Pledges', label: 'Pledges & Vows', desc: 'Redeeming sacred vows made before God.' },
    { id: 'Wisdom-Summit', label: 'Wisdom Summit 2026 Seed', desc: 'Partner towards conference staging, media, and guest hospitality.' },
    { id: 'Building', label: 'Temple Expansion Project', desc: 'Sanctuary development, seating, and media infrastructure.' },
    { id: 'Missions', label: 'Missions & Community Welfare', desc: 'Benevolence fund aiding widows, orphans, and local outreach.' },
  ];

  const quickAmounts = currency === 'GHS' 
    ? ['50', '100', '200', '500', '1000']
    : ['25', '50', '100', '250', '500'];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateReference = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = selectedFund.substring(0, 3).toUpperCase();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `WT-${prefix}-${randomCode}`;
    setGeneratedReference(ref);
  };

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Deep Forest & Gold */}
      <section className="bg-[#02180e] text-white py-16 sm:py-20 border-b border-[#084c2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            STEWARDSHIP & GENEROSITY
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            DIGITAL GIVING & STEWARDSHIP
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/90 max-w-2xl mx-auto leading-relaxed">
            You can send your FIRSTFRUIT, OFFERING & PLEDGES to our MoMo or Bank Account.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Official Giving Flyer Banner Display */}
        <div className="bg-gradient-to-r from-[#032014] via-[#053521] to-[#032014] rounded-3xl p-6 sm:p-8 border border-[#c99726]/40 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c99726]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 text-center lg:text-left flex-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#c99726]/20 border border-[#c99726]/50 text-[#f5cf72] text-xs font-mono font-bold uppercase">
                <span>OFFICIAL CHURCH GIVING FLYER</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-title">
                Direct Channels for Firstfruit, Offerings & Pledges
              </h2>
              <p className="text-emerald-100/90 text-sm leading-relaxed max-w-xl">
                Send your seed directly via official MTN Mobile Money or CBG Bank Account under 
                <strong className="text-[#f5cf72]"> Wisdom Temple (Kokomlemle)</strong>.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFlyerModalOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>VIEW FULL GIVING FLYER</span>
                </button>
                <a
                  href="/giving_details_official.jpg"
                  download="Wisdom_Temple_Giving_Details.jpg"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#f5cf72]" />
                  <span>SAVE FLYER</span>
                </a>
              </div>
            </div>

            {/* Clickable Flyer Preview Thumbnail */}
            <div 
              onClick={() => setFlyerModalOpen(true)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden border-2 border-[#c99726]/60 shadow-2xl hover:border-[#f5cf72] transition-all transform hover:scale-[1.02] shrink-0 max-w-sm w-full bg-black/40"
            >
              <img
                src="/giving_details_official.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://i.imgur.com/DCRspmB.png') {
                    target.src = 'https://i.imgur.com/DCRspmB.png';
                  }
                }}
                alt="Wisdom Temple Giving Details"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <span className="px-3.5 py-1.5 rounded-lg bg-[#02180e]/90 text-[#f5cf72] text-xs font-bold border border-[#c99726]/60 shadow-lg flex items-center space-x-1.5 opacity-90 group-hover:opacity-100">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Tap to Enlarge</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Giving Workflow & Reference Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Fund & Amount Selection */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#d6e5dc] shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-wider block mb-1">
                STEP 1: SELECT PURPOSE
              </span>
              <h2 className="text-2xl font-bold text-[#032014] font-serif-title">Where to Direct Your Seed</h2>
            </div>

            {/* Funds List */}
            <div className="space-y-2.5">
              {funds.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFund(f.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedFund === f.id
                      ? 'border-[#c99726] bg-[#fbf7ee] shadow-xs ring-1 ring-[#c99726]'
                      : 'border-[#d6e5dc] hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#032014] text-sm">{f.label}</span>
                    <input
                      type="radio"
                      name="giving-fund"
                      checked={selectedFund === f.id}
                      onChange={() => setSelectedFund(f.id)}
                      className="text-[#c99726] focus:ring-[#c99726]"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Currency & Amount */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-wider">
                  STEP 2: AMOUNT & CURRENCY
                </span>
                <div className="flex items-center space-x-1 bg-[#eef6f1] p-1 rounded-lg text-xs font-bold border border-[#c2decc]">
                  <button
                    onClick={() => setCurrency('GHS')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      currency === 'GHS' ? 'bg-[#032014] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    ₵ GHS
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      currency === 'USD' ? 'bg-[#032014] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              {/* Quick Pills */}
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(q)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      amount === q
                        ? 'bg-[#032014] text-[#f5cf72] border-[#032014] shadow'
                        : 'bg-white text-slate-700 border-[#d6e5dc] hover:bg-[#eef6f1]'
                    }`}
                  >
                    {currency === 'GHS' ? '₵' : '$'} {q}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                  {currency === 'GHS' ? '₵' : '$'}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-[#032014] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                />
              </div>
            </div>

            {/* Reference Generator Form */}
            <form onSubmit={handleGenerateReference} className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-wider block">
                STEP 3: GENERATE PAYMENT REFERENCE CODE
              </span>
              <p className="text-xs text-slate-500">
                Use your generated code in the reference/memo field when sending via MoMo or Bank Transfer for instant recognition.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Your Full Name (e.g. John Mensah)"
                  className="flex-1 px-4 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                >
                  Generate Reference
                </button>
              </div>

              {generatedReference && (
                <div className="p-4 bg-[#fbf7ee] border border-[#c99726] rounded-xl flex items-center justify-between animate-in zoom-in-95 duration-150">
                  <div>
                    <span className="text-[10px] text-[#07472c] font-mono font-bold block">YOUR GIVING REFERENCE</span>
                    <strong className="text-lg font-mono text-[#032014]">{generatedReference}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedReference, 'ref')}
                    className="p-2 bg-white rounded-lg text-[#032014] hover:bg-[#eef6f1] border border-[#d6e5dc] text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'ref' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#c99726]" />}
                    <span>{copiedKey === 'ref' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Giving Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mobile Money Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#032014] text-base font-serif-title">Mobile Money (MoMo)</h3>
                  <p className="text-[11px] text-slate-500">Firstfruit, Offering & Pledges</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* Official MTN MoMo Number from Church Flyer */}
                <div className="p-4 bg-[#fbf7ee] rounded-2xl border-2 border-[#c99726]/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#07472c] font-bold block">
                      OFFICIAL CHURCH MOMO NUMBER
                    </span>
                    <span className="text-lg font-mono text-[#032014] font-black tracking-wider">
                      {GIVING_DETAILS.momo.mtn}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      Account: <strong>Wisdom Temple (Kokomlemle)</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(GIVING_DETAILS.momo.mtn, 'mtn')}
                    className="px-3 py-2 bg-white text-[#032014] hover:bg-[#032014] hover:text-white rounded-xl border border-[#c99726] text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    title="Copy MTN MoMo Number"
                  >
                    {copiedKey === 'mtn' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#c99726]" />}
                    <span>{copiedKey === 'mtn' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Merchant / Subscriber Account: <strong className="text-[#032014]">Wisdom Temple (Kokomlemle)</strong>
              </p>
            </div>

            {/* Bank Transfer Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#032014] text-base font-serif-title">Bank Account (CBG)</h3>
                  <p className="text-[11px] text-slate-500">Consolidated Bank Ghana</p>
                </div>
              </div>

              <div className="p-4 bg-[#f8faf8] rounded-2xl border-2 border-[#d6e5dc] space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                      BANK NAME
                    </span>
                    <strong className="text-sm text-[#032014] block">
                      {GIVING_DETAILS.bank.bankName}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                      ACCOUNT NUMBER
                    </span>
                    <span className="text-base font-mono text-[#032014] font-black tracking-wide block">
                      {GIVING_DETAILS.bank.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(GIVING_DETAILS.bank.accountNumber, 'cbg-acc')}
                    className="px-3 py-1.5 bg-white text-[#032014] hover:bg-[#032014] hover:text-white rounded-lg border border-[#d6e5dc] text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedKey === 'cbg-acc' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#c99726]" />}
                    <span>{copiedKey === 'cbg-acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                    ACCOUNT NAME
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {GIVING_DETAILS.bank.accountName}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                You can pay via CBG Mobile App, USSD, or direct deposit at any CBG branch nationwide.
              </p>
            </div>

            {/* Online Payment Card (Card / International) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#032014] text-base font-serif-title">Online Payment & Cards</h3>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, & Diaspora Giving</p>
                </div>
              </div>

              <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#d6e5dc] text-xs text-slate-600 font-mono">
                {GIVING_DETAILS.online.paymentUrl}
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-[#07472c] bg-[#eef6f1] p-2.5 rounded-xl border border-[#c2decc]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#c99726]" />
                <span>SSL Encrypted & Certified Church Gateway</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accountability & Integrity Pledge */}
        <div className="bg-[#032014] text-white rounded-3xl p-8 sm:p-12 border border-[#084c2e] space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-[#f5cf72] text-xs font-mono font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>FINANCIAL INTEGRITY & GOVERNANCE</span>
          </div>
          <h3 className="text-2xl font-bold font-serif-title text-white">Our Stewardship Commitment</h3>
          <p className="text-emerald-100/90 text-sm leading-relaxed max-w-3xl">
            At Wisdom Temple, we manage all kingdom funds with the highest standard of ethical governance, financial auditing, and biblical stewardship. Every cedi given fuels ministry operations, gospel outreach, pastoral care, and community benevolence. Audited accounts are reported annually to the Church Board.
          </p>
        </div>
      </div>

      {/* Official Giving Flyer Modal */}
      <AnimatePresence>
        {flyerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setFlyerModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#02180e] rounded-3xl overflow-hidden border border-[#c99726]/50 shadow-2xl p-4 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#084c2e] pb-3">
                <div>
                  <h3 className="font-bold text-white text-lg font-serif-title">Official Giving Details Flyer</h3>
                  <p className="text-xs text-emerald-300/80">Wisdom Temple (Kokomlemle)</p>
                </div>
                <button
                  onClick={() => setFlyerModalOpen(false)}
                  className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-auto rounded-2xl flex items-center justify-center bg-black/50">
                <img
                  src="/giving_details_official.jpg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://i.imgur.com/DCRspmB.png') {
                      target.src = 'https://i.imgur.com/DCRspmB.png';
                    }
                  }}
                  alt="Official Giving Flyer"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-emerald-200/90">
                <div className="flex items-center space-x-2">
                  <span>MoMo: <strong className="text-white font-mono">0555577099</strong></span>
                  <span>•</span>
                  <span>CBG: <strong className="text-white font-mono">0523529100002</strong></span>
                </div>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="/giving_details_official.jpg"
                  download="Wisdom_Temple_Giving.jpg"
                  className="px-4 py-2 bg-gradient-to-r from-[#c99726] to-[#e5b138] text-[#021a10] font-black rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res Flyer</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
