import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, GivingRecord } from '../types';
import { GIVING_DETAILS } from '../data/churchData';
import { useBanners } from '../utils/bannerManager';
import { useSiteContent } from '../utils/contentManager';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Copy,
  ZoomIn,
  X,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface GiveViewProps {
  onNavigate: (page: PageId) => void;
  onSubmitGiving?: (record: Omit<GivingRecord, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export const GiveView: React.FC<GiveViewProps> = ({ onNavigate, onSubmitGiving }) => {
  const { getBanner } = useBanners();
  const { content } = useSiteContent();
  const [selectedFund, setSelectedFund] = useState<string>('FirstFruit');
  const [currency, setCurrency] = useState<'GHS' | 'USD'>('GHS');
  const [amount, setAmount] = useState<string>('100');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Mobile Money (MTN MoMo)' | 'Bank Transfer (CBG)'>('Mobile Money (MTN MoMo)');
  const [notes, setNotes] = useState('');
  const [flyerModalOpen, setFlyerModalOpen] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<GivingRecord | null>(null);

  const funds = [
    { 
      id: 'FirstFruit', 
      label: 'First Fruit (Malachi 3:10)', 
      desc: '"Bring all the tithes and first fruits into the storehouse, that there may be food in My house..." — Malachi 3:10' 
    },
    { id: 'Offering', label: 'Sunday / General Offering', desc: 'Freewill thanksgiving seed for worship.' },
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

  const handleRecordGiving = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = selectedFund.substring(0, 3).toUpperCase();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `WT-${prefix}-${randomCode}`;
    const numAmount = parseFloat(amount) || 0;

    const recordData: Omit<GivingRecord, 'id' | 'dateSubmitted' | 'status'> = {
      donorName: donorName.trim() || 'Anonymous Kingdom Giver',
      fund: selectedFund,
      amount: numAmount,
      currency,
      paymentMethod,
      referenceCode: ref,
      phoneOrTxnId: donorPhone.trim() || 'Direct Transfer',
      notes: notes.trim() || undefined,
    };

    if (onSubmitGiving) {
      onSubmitGiving(recordData);
    }

    const receipt: GivingRecord = {
      ...recordData,
      id: `give-${Date.now()}`,
      dateSubmitted: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'pending-verification',
    };

    setCompletedReceipt(receipt);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Deep Forest & Gold */}
      <section className="relative bg-[#02180e] text-white py-14 sm:py-20 border-b border-[#084c2e] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_give_hero', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1920&q=80')}
            alt="Give Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4 relative z-10">
          <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            STEWARDSHIP & GENEROSITY
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            {content.givingHeadline.toUpperCase()}
          </h1>
          <p className="text-sm sm:text-lg text-emerald-200/90 max-w-2xl mx-auto leading-relaxed">
            {content.givingInstructions}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8 sm:space-y-12">
        {/* Official Giving Flyer Banner Display */}
        <div className="bg-[#032014] rounded-2xl p-5 sm:p-8 border border-white/10 shadow-xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 justify-between">
            <div className="space-y-3 sm:space-y-4 text-center lg:text-left flex-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#02180e] border border-white/10 text-[#dfb15b] text-[11px] sm:text-xs font-mono font-bold uppercase">
                <span>OFFICIAL CHURCH GIVING FLYER</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-light text-white font-serif">
                Direct Channels for Firstfruit, Offerings & Pledges
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-xl">
                Send your seed directly via official MTN Mobile Money or CBG Bank Account under 
                <strong className="text-[#dfb15b]"> Wisdom Temple (Kokomlemle)</strong>.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFlyerModalOpen(true)}
                  className="px-4 sm:px-5 py-2.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>VIEW FULL GIVING FLYER</span>
                </button>
                <a
                  href="/giving_details_official.jpg"
                  download="Wisdom_Temple_Giving_Details.jpg"
                  className="px-3.5 sm:px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg border border-white/20 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#dfb15b]" />
                  <span>SAVE FLYER</span>
                </a>
              </div>
            </div>

            {/* Clickable Flyer Preview Thumbnail */}
            <div 
              onClick={() => setFlyerModalOpen(true)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden border-2 border-[#c99726]/60 shadow-2xl hover:border-[#f5cf72] transition-all transform hover:scale-[1.02] shrink-0 max-w-xs sm:max-w-sm w-full bg-black/40"
            >
              <img
                src={getBanner('giving_flyer', '/giving_details_official.jpg')}
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
                <span className="px-3 py-1.5 rounded-lg bg-[#02180e]/90 text-[#f5cf72] text-xs font-bold border border-[#c99726]/60 shadow-lg flex items-center space-x-1.5 opacity-90 group-hover:opacity-100">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Tap to Enlarge</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Giving Form & Details */}
        {completedReceipt ? (
          /* Official Digital Giving Receipt Confirmation */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#c99726]/60 shadow-xl space-y-6 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#eef6f1] text-[#07472c] border-2 border-[#c99726] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 text-[#07472c]" />
              </div>
              <span className="text-xs font-mono font-bold text-[#07472c] uppercase tracking-wider block">
                OFFICIAL KINGDOM STEWARDSHIP RECEIPT
              </span>
              <h3 className="text-2xl font-black text-[#032014] font-serif-title">
                Giving Successfully Logged
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you for honoring God with your substance. Your contribution reference has been registered with the Wisdom Temple Treasury.
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="bg-[#fbf7ee] rounded-2xl p-5 sm:p-6 border border-[#c99726]/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5cd96] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#07472c] font-bold block">REFERENCE CODE</span>
                  <span className="text-lg font-mono font-black text-[#032014] tracking-wide">
                    {completedReceipt.referenceCode}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(completedReceipt.referenceCode, 'receipt-ref')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#032014] rounded-lg border border-[#c99726] text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                >
                  {copiedKey === 'receipt-ref' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#c99726]" />}
                  <span>{copiedKey === 'receipt-ref' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Giver Name</span>
                  <strong className="text-slate-900 font-semibold">{completedReceipt.donorName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Giving Purpose</span>
                  <strong className="text-slate-900 font-semibold">{completedReceipt.fund}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Amount Seeded</span>
                  <strong className="text-emerald-900 text-sm font-black font-mono">
                    {completedReceipt.currency === 'GHS' ? 'GH₵' : '$'} {completedReceipt.amount.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Channel</span>
                  <strong className="text-slate-900 font-semibold">{completedReceipt.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Contact / Txn ID</span>
                  <span className="font-mono text-slate-700">{completedReceipt.phoneOrTxnId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    ● Recorded / Pending Audit
                  </span>
                </div>
              </div>

              {completedReceipt.notes && (
                <div className="pt-2 border-t border-[#e5cd96] text-xs">
                  <span className="text-slate-500 block">Prayer Petition / Notes:</span>
                  <p className="text-slate-800 italic mt-0.5">"{completedReceipt.notes}"</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-3 px-4 bg-[#032014] hover:bg-[#063821] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#f5cf72]" />
                <span>PRINT / SAVE RECEIPT</span>
              </button>
              <button
                type="button"
                onClick={() => setCompletedReceipt(null)}
                className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-[#07472c] border border-[#c2decc] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Log Another Seed
              </button>
            </div>

            <div className="p-3 bg-[#eef6f1] rounded-xl border border-[#c2decc] text-center text-[11px] text-slate-600">
              <span>Admin & Treasury Notice: This record has been saved and can be reconciled in the </span>
              <button 
                onClick={() => onNavigate('admin')}
                className="font-bold text-[#07472c] underline hover:text-[#032014] cursor-pointer"
              >
                Staff Portal
              </button>.
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Fund Selection & Giving Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-6">
              <div>
                <span className="text-[11px] sm:text-xs font-mono text-[#07472c] font-bold uppercase tracking-wider block mb-1">
                  STEP 1: SELECT PURPOSE & AMOUNT
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#032014] font-serif-title">
                  Where to Direct Your Seed
                </h2>
              </div>

              {/* Funds List */}
              <div className="space-y-2.5">
                {funds.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFund(f.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedFund === f.id
                        ? 'border-[#c99726] bg-[#fbf7ee] shadow-xs ring-1 ring-[#c99726]'
                        : 'border-[#d6e5dc] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#032014] text-xs sm:text-sm">{f.label}</span>
                      <input
                        type="radio"
                        name="giving-fund"
                        checked={selectedFund === f.id}
                        onChange={() => setSelectedFund(f.id)}
                        className="text-[#c99726] focus:ring-[#c99726]"
                      />
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-snug">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Currency & Amount */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-mono text-[#07472c] font-bold uppercase tracking-wider">
                    AMOUNT & CURRENCY
                  </span>
                  <div className="flex items-center space-x-1 bg-[#eef6f1] p-1 rounded-lg text-xs font-bold border border-[#c2decc]">
                    <button
                      type="button"
                      onClick={() => setCurrency('GHS')}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        currency === 'GHS' ? 'bg-[#032014] text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      ₵ GHS
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        currency === 'USD' ? 'bg-[#032014] text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>

                {/* Quick Amount Chips */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                        amount === q
                          ? 'bg-[#032014] text-[#f5cf72] border-[#032014] shadow'
                          : 'bg-white text-slate-700 border-[#d6e5dc] hover:bg-[#eef6f1]'
                      }`}
                    >
                      {currency === 'GHS' ? '₵' : '$'}{q}
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
                    min="1"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full pl-10 pr-4 py-3 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-[#032014] font-bold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
              </div>

              {/* Step 2: Log / Record Your Payment Form */}
              <form onSubmit={handleRecordGiving} className="pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <span className="text-[11px] sm:text-xs font-mono text-[#07472c] font-bold uppercase tracking-wider block mb-0.5">
                    STEP 2: GIVER DETAILS & LOG PAYMENT
                  </span>
                  <p className="text-xs text-slate-500">
                    Fill in your details below so the church office can attribute your gift and issue your reference.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#032014] uppercase mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Samuel Annan"
                      className="w-full px-3.5 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#032014] uppercase mb-1">
                      Phone / MoMo Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="e.g. 024 123 4567 or Txn ID"
                      className="w-full px-3.5 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#032014] uppercase mb-1">
                      Payment Channel Used
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                    >
                      <option value="Mobile Money (MTN MoMo)">Mobile Money (MTN MoMo)</option>
                      <option value="Bank Transfer (CBG)">Bank Transfer (CBG)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#032014] uppercase mb-1">
                      Prayer Petition or Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Thanksgiving for promotion"
                      className="w-full px-3.5 py-2.5 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>LOG PAYMENT & GET DIGITAL RECEIPT</span>
                </button>
              </form>
            </div>

            {/* Right Column: Church Payment Channels & Official Accounts */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              {/* Mobile Money Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#032014] text-base font-serif-title">Mobile Money (MoMo)</h3>
                    <p className="text-[11px] text-slate-500">Firstfruit, Offering & Pledges</p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Official MTN MoMo Number from Church Flyer */}
                  <div className="p-4 bg-[#fbf7ee] rounded-2xl border-2 border-[#c99726]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#07472c] font-bold block">
                        OFFICIAL CHURCH MOMO NUMBER
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(content.givingMomoMtn, 'mtn')}
                        className="px-2.5 py-1 bg-white text-[#032014] hover:bg-[#032014] hover:text-white rounded-lg border border-[#c99726] text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        title="Copy MTN MoMo Number"
                      >
                        {copiedKey === 'mtn' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#c99726]" />}
                        <span>{copiedKey === 'mtn' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-xl sm:text-2xl font-mono text-[#032014] font-black tracking-wider">
                      {content.givingMomoMtn}
                    </div>

                    <div className="text-xs text-slate-700 bg-white/80 p-2 rounded-lg border border-[#e5cd96]">
                      Account Name: <strong className="text-[#032014]">{content.givingMomoAccountName}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Send directly from your MTN, Telecel, or AT wallet to this number. Use your name or reference in the memo.
                </p>
              </div>

              {/* Bank Transfer Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#032014] text-base font-serif-title">Bank Account</h3>
                    <p className="text-[11px] text-slate-500">{content.givingBankName}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#f8faf8] rounded-2xl border-2 border-[#d6e5dc] space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        BANK NAME
                      </span>
                      <strong className="text-sm text-[#032014] block">
                        {content.givingBankName}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        ACCOUNT NUMBER
                      </span>
                      <span className="text-sm sm:text-base font-mono text-[#032014] font-black tracking-wide block">
                        {content.givingBankAccountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(content.givingBankAccountNumber, 'cbg-acc')}
                      className="px-2.5 py-1 bg-white text-[#032014] hover:bg-[#032014] hover:text-white rounded-lg border border-[#d6e5dc] text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
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
                      {content.givingBankAccountName}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Pay via CBG Mobile App, online banking, USSD, or direct counter deposit at any CBG branch nationwide.
                </p>
              </div>

              {/* Online Payment Card (Card / International) */}
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#032014] text-base font-serif-title">International & Cards</h3>
                    <p className="text-[11px] text-slate-500">Visa, Mastercard, & Diaspora Giving</p>
                  </div>
                </div>

                <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#d6e5dc] text-xs text-slate-600 font-mono truncate">
                  {GIVING_DETAILS.online.paymentUrl}
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[#07472c] bg-[#eef6f1] p-2.5 rounded-xl border border-[#c2decc]">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#c99726]" />
                  <span>SSL Encrypted & Certified Church Gateway</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accountability & Integrity Pledge */}
        <div className="bg-[#032014] text-white rounded-3xl p-6 sm:p-12 border border-[#084c2e] space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-[#f5cf72] text-xs font-mono font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>FINANCIAL INTEGRITY & GOVERNANCE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white">Our Stewardship Commitment</h3>
          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-3xl">
            At Wisdom Temple, we manage all kingdom funds with the highest standard of ethical governance, financial auditing, and biblical stewardship. Every cedi given fuels ministry operations, gospel outreach, pastoral care, and community benevolence. Audited accounts are reported annually to the Church Council.
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
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
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
                  <h3 className="font-bold text-white text-base sm:text-lg font-serif-title">Official Giving Details Flyer</h3>
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
                  src={getBanner('giving_flyer', '/giving_details_official.jpg')}
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
                <a
                  href="/giving_details_official.jpg"
                  download="Wisdom_Temple_Giving.jpg"
                  className="px-4 py-2 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold rounded-lg text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res Flyer</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
