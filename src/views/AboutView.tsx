import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { CHURCH_INFO, BELIEFS } from '../data/churchData';
import { PASTORAL_COUPLE_IMAGE } from '../assets/pastoralImage';
import { useBanners } from '../utils/bannerManager';
import { useSiteContent } from '../utils/contentManager';
import { 
  Target, 
  Compass, 
  BookOpen, 
  UserCheck, 
  History, 
  CheckCircle2, 
  Shield,
  X
} from 'lucide-react';

interface AboutViewProps {
  initialSubTab?: string;
  onNavigate: (page: PageId) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ initialSubTab }) => {
  const { getBanner } = useBanners();
  const { content } = useSiteContent();
  const [activeTab, setActiveTab] = useState<string>('who-we-are');
  const [showCouncilModal, setShowCouncilModal] = useState<boolean>(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Page Header Banner - ICGC Forest & Gold */}
      <section className="relative bg-[#02180e] text-white py-16 sm:py-20 border-b border-[#084c2e] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_about_hero', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80')}
            alt="About Us Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            {content.churchAddress.toUpperCase()}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            {content.aboutHeadline}
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            {content.churchDescription}
          </p>
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#d6e5dc] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex space-x-1 py-3 min-w-max text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'who-we-are', label: 'Who We Are', icon: Compass },
              { id: 'vision-mission', label: 'Our Vision & Mission', icon: Target },
              { id: 'beliefs', label: 'Our Beliefs', icon: BookOpen },
              { id: 'leadership', label: 'Our Leadership', icon: UserCheck },
              { id: 'story', label: 'Our Story & Heritage', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#032014] text-white shadow-sm border border-[#c99726]/50'
                      : 'text-slate-600 hover:text-[#032014] hover:bg-[#eef6f1]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f5cf72]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Tab 1: Who We Are */}
        {activeTab === 'who-we-are' && (
          <div className="space-y-10 animate-in fade-in duration-150">
            <div className="space-y-4">
              <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                IDENTITY & NATURE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032014] font-serif-title">
                A Christ-Centered Assembly in Ghana
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {content.aboutWhoWeAre1}
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                {content.aboutWhoWeAre2}
              </p>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#032014] font-serif-title">Spiritual Fervor</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Passionate worship and dedicated prayer at our Sunday services and Wednesday's <em>The Secret Place</em>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#032014] font-serif-title">Intellectual Excellence</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sound doctrine that engages the mind, provides practical solutions, and fosters marketplace dominance.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#032014] font-serif-title">Social Responsibility</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Active commitment to our community, welfare programs, student mentoring, and civic righteousness.
                </p>
              </div>
            </div>

            {/* Service Schedule Banner */}
            <div className="bg-[#032014] text-white rounded-3xl p-8 border border-[#084c2e] space-y-4 shadow-xl">
              <h3 className="text-2xl font-bold font-serif-title text-[#f5cf72]">Join Us for Worship</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-[#02180e] rounded-xl border border-[#084c2e]">
                  <span className="text-xs text-[#f5cf72] font-bold block">{content.sundayServiceName.toUpperCase()}</span>
                  <p className="text-lg font-bold text-white mt-1">Every Sunday at {content.sundayServiceTime}</p>
                  <p className="text-xs text-emerald-300/70 mt-1">{content.sundayServiceDesc}</p>
                </div>
                <div className="p-4 bg-[#02180e] rounded-xl border border-[#084c2e]">
                  <span className="text-xs text-[#f5cf72] font-bold block">{content.midweekServiceName.toUpperCase()}</span>
                  <p className="text-lg font-bold text-white mt-1">Every Wednesday at {content.midweekServiceTime}</p>
                  <p className="text-xs text-emerald-300/70 mt-1">{content.midweekServiceDesc}</p>
                </div>
              </div>
            </div>

            {/* Pastoral Leadership Feature on Who We Are */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d6e5dc] shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div 
                onClick={() => setActiveTab('leadership')}
                className="w-full md:w-56 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden bg-[#032014] border-2 border-[#c99726]/40 shadow-md relative group cursor-pointer"
              >
                <img
                  src={getBanner('pastoral_couple', PASTORAL_COUPLE_IMAGE)}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/rev_gabriel_and_helena_dela.jpg'; }}
                  alt={`${content.combinedPastoralTitle} - Shepherd and First Lady`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[9px] text-[#f5cf72] font-bold uppercase tracking-wider block">
                    PASTORAL LEADERSHIP
                  </span>
                  <p className="text-xs font-bold font-serif-title leading-tight text-white mt-0.5">
                    {content.combinedPastoralTitle}
                  </p>
                </div>
              </div>

              <div className="space-y-3 flex-1 text-center md:text-left">
                <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc] inline-block">
                  SHEPHERD OF WISDOM TEMPLE
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#032014] font-serif-title">
                  {content.combinedPastoralTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {content.pastoralBio}
                </p>
                <button
                  onClick={() => setActiveTab('leadership')}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-[#07472c] hover:text-[#c99726] transition-colors uppercase tracking-wider cursor-pointer pt-1"
                >
                  <span>Read Full Leadership Profile & Vision</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vision & Mission */}
        {activeTab === 'vision-mission' && (
          <div className="space-y-10 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision Card */}
              <div className="bg-white rounded-3xl p-8 border border-[#d6e5dc] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest block">
                  OUR VISION
                </span>
                <h3 className="text-2xl font-bold text-[#032014] font-serif-title">
                  {content.aboutVisionTitle}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.aboutVisionText}
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white rounded-3xl p-8 border border-[#d6e5dc] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest block">
                  OUR MISSION
                </span>
                <h3 className="text-2xl font-bold text-[#032014] font-serif-title">
                  {content.aboutMissionTitle}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.aboutMissionText}
                </p>
              </div>
            </div>

            {/* The 3 Pillars */}
            <div className="bg-white rounded-3xl p-8 border border-[#d6e5dc] space-y-6">
              <h3 className="text-xl font-bold text-[#032014] font-serif-title">
                The Three Pillars of Our Mandate
              </h3>
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#07472c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#032014] block font-semibold">1. {content.pillar1Title}</strong>
                    {content.pillar1Desc}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#07472c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#032014] block font-semibold">2. {content.pillar2Title}</strong>
                    {content.pillar2Desc}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#07472c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#032014] block font-semibold">3. {content.pillar3Title}</strong>
                    {content.pillar3Desc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Beliefs */}
        {activeTab === 'beliefs' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="space-y-2">
              <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                DOCTRINAL STATEMENT
              </span>
              <h2 className="text-3xl font-extrabold text-[#032014] font-serif-title mt-2">
                What We Believe
              </h2>
              <p className="text-sm text-slate-600">
                Our faith is rooted in classical charismatic orthodoxy, centered on the infallible authority of the Holy Scriptures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BELIEFS.map((belief, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#d6e5dc] shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-[#07472c] text-xs font-bold">
                    <Shield className="w-4 h-4 text-[#c99726]" />
                    <span>ARTICLE {idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#032014] font-serif-title">{belief.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{belief.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Leadership */}
        {activeTab === 'leadership' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="space-y-2">
              <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                SPIRITUAL OVERSIGHT
              </span>
              <h2 className="text-3xl font-extrabold text-[#032014] font-serif-title mt-2">
                Our Pastoral Leadership
              </h2>
              <p className="text-sm text-slate-600">
                Dedicated servant-leaders guiding Wisdom Temple with pastoral care, biblical counsel, and vision.
              </p>
            </div>

            {/* Senior Minister & Shepherd Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#d6e5dc] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 rounded-2xl bg-[#032014] overflow-hidden relative border-2 border-[#c99726]/40 shadow-xl group aspect-[3/4] flex items-center justify-center">
                <img
                  src={getBanner('pastoral_couple', PASTORAL_COUPLE_IMAGE)}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/rev_gabriel_and_helena_dela.jpg'; }}
                  alt="Rev. Gabriel Dela and Lady Dr. Helena Dela - Shepherd and First Lady of Wisdom Temple"
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] text-[#f5cf72] font-bold uppercase tracking-widest bg-[#02180e]/90 px-2.5 py-1 rounded-md border border-[#c99726]/40 inline-block mb-1">
                    PASTORAL COUPLE
                  </span>
                  <p className="font-serif-title font-bold text-base sm:text-lg text-white leading-tight">
                    Rev. Gabriel Dela & Lady Dr. Helena Dela
                  </p>
                  <p className="text-[11px] text-emerald-200/80">
                    Shepherd & First Lady • ICGC Wisdom Temple
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc] inline-block mb-2">
                    SHEPHERD OF WISDOM TEMPLE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#032014] font-serif-title">
                    Rev. Gabriel Dela
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-[#c99726] font-bold">Shepherd & Senior Minister</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-600 font-medium">With <strong className="text-[#032014]">Lady Dr. Helena Dela</strong></span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p>
                    <strong className="text-[#032014]">Rev. Gabriel Dela</strong> is the Shepherd and Senior Minister of ICGC Wisdom Temple. Called with an apostolic heart and an unquenchable passion for the Kingdom of God, Rev. Gabriel leads the Wisdom Temple congregation with doctrinal clarity, prophetic insight, and a shepherd's compassionate care.
                  </p>
                  <p>
                    Ministering side-by-side with him is his beloved wife, <strong className="text-[#032014]">Lady Dr. Helena Dela</strong>, who serves graciously as the First Lady of Wisdom Temple. Lady Dr. Helena Dela is a pillar of wisdom, prayer, and encouragement, actively nurturing the women's fellowship, family life ministries, and raising believers who embody godly dignity and professional excellence.
                  </p>
                  <p>
                    Together, Rev. Gabriel Dela and Lady Dr. Helena Dela are committed to fulfilling the God-given mandate of Wisdom Temple: <em>"Raising Leaders, Shaping Visions, and Influencing Society Through Christ."</em> Under their pastoral oversight, Wisdom Temple has flourished as a vibrant house of prayer, leadership excellence, and transformative ministry in Tabora, Accra, and across Ghana.
                  </p>
                </div>

                {/* Key Ministry Pillars under their Pastoral Care */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-[#f4f7f4] rounded-xl border border-[#d6e5dc]">
                    <span className="text-[10px] text-[#07472c] font-bold uppercase block">Core Emphasis</span>
                    <p className="text-xs font-bold text-[#032014] mt-0.5">Biblical Exposition</p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Practical life application</span>
                  </div>
                  <div className="p-3 bg-[#f4f7f4] rounded-xl border border-[#d6e5dc]">
                    <span className="text-[10px] text-[#07472c] font-bold uppercase block">Prayer Altar</span>
                    <p className="text-xs font-bold text-[#032014] mt-0.5">The Secret Place</p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Midweek prayer & power</span>
                  </div>
                  <div className="p-3 bg-[#f4f7f4] rounded-xl border border-[#d6e5dc]">
                    <span className="text-[10px] text-[#07472c] font-bold uppercase block">Leadership</span>
                    <p className="text-xs font-bold text-[#032014] mt-0.5">Wisdom Summit</p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Annual leadership conference</span>
                  </div>
                </div>

                <div className="p-4 bg-[#eef6f1] rounded-xl border border-[#c2decc] text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-[#032014] flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#07472c]"></span>
                    <span>Pastoral Counsel & Consultation:</span>
                  </p>
                  <p>
                    Pastoral sessions are available by scheduled appointment through the Church Administration Office at Wisdom Temple, Star Junction, Tabora.
                  </p>
                </div>
              </div>
            </div>

            {/* Church Council, Pastoral Council & Leadership Governance */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#032014] font-serif-title flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#c99726]" />
                  <span>Church Governance & Leadership Councils</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* 1. Pastoral Council */}
                <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] text-center space-y-2 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#eef6f1] text-[#07472c] mx-auto flex items-center justify-center font-bold border border-[#c2decc]">
                      PC
                    </div>
                    <h4 className="text-sm font-bold text-[#032014] font-serif-title">Pastoral Council</h4>
                    <p className="text-xs text-[#07472c] font-semibold">Spiritual Oversight</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Doctrinal integrity, pastoral intercession, discipleship, and spiritual shepherd care across all congregations.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-2 border-t border-slate-100">
                    Spiritual Authority
                  </span>
                </div>

                {/* 2. Church Council (Formerly Church Board) with Official Photo */}
                <div 
                  onClick={() => setShowCouncilModal(true)}
                  className="bg-white rounded-2xl border-2 border-[#c99726]/50 hover:border-[#c99726] overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="relative aspect-[16/11] bg-[#02180e] overflow-hidden">
                    <img
                      src="/church_council.png"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== '/church_council.jpg') {
                          target.src = '/church_council.jpg';
                        }
                      }}
                      alt="ICGC Wisdom Temple Church Council"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <span className="text-[9px] uppercase tracking-wider text-[#f5cf72] font-bold block">
                        STEWARDSHIP & GOVERNANCE
                      </span>
                      <span className="text-xs font-bold text-white block">Wisdom Temple</span>
                    </div>
                  </div>

                  <div className="p-4 text-center space-y-1 bg-white flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#032014] font-serif-title group-hover:text-[#c99726] transition-colors">
                        Church Council
                      </h4>
                      <p className="text-xs text-[#07472c] font-semibold">Governance & Administration</p>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">
                        Institutional policies, capital developments, annual budgets, and fiduciary kingdom stewardship.
                      </p>
                    </div>
                    <span className="text-[10px] text-[#c99726] font-bold block pt-2 border-t border-slate-100">
                      Click to View Photo ↗
                    </span>
                  </div>
                </div>

                {/* 3. Ministry Deacons */}
                <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] text-center space-y-2 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#eef6f1] text-[#07472c] mx-auto flex items-center justify-center font-bold border border-[#c2decc]">
                      DM
                    </div>
                    <h4 className="text-sm font-bold text-[#032014] font-serif-title">Ministry Deacons</h4>
                    <p className="text-xs text-[#07472c] font-semibold">Sanctuary Operations</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Hospitality, protocol, member welfare, logistical execution, and order within the sanctuary.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-2 border-t border-slate-100">
                    Service & Operations
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Story & Heritage */}
        {activeTab === 'story' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="space-y-3">
              <span className="text-xs text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                OUR JOURNEY OF FAITH
              </span>
              <h2 className="text-3xl font-extrabold text-[#032014] font-serif-title mt-2">
                {content.heritageStoryHeadline}
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {content.churchDescription}
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-[#c99726] pl-6 space-y-2 bg-white p-6 rounded-r-2xl border border-l-0 border-[#d6e5dc]">
                <span className="text-xs text-[#07472c] font-bold">FOUNDATIONAL PHILOSOPHY</span>
                <h3 className="text-xl font-bold text-[#032014] font-serif-title">Dignity, Excellence & Empowerment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.heritageStoryText1}
                </p>
              </div>

              <div className="border-l-4 border-[#c99726] pl-6 space-y-2 bg-white p-6 rounded-r-2xl border border-l-0 border-[#d6e5dc]">
                <span className="text-xs text-[#07472c] font-bold">LOOKING TO THE FUTURE</span>
                <h3 className="text-xl font-bold text-[#032014] font-serif-title">Building for Generations</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.heritageStoryText2}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Church Council Photo Lightbox Modal */}
      {showCouncilModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowCouncilModal(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#02180e] rounded-3xl border-2 border-[#c99726]/60 shadow-2xl overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#07472c] bg-[#032014]">
              <div>
                <span className="text-[10px] font-bold text-[#f5cf72] uppercase tracking-wider block">
                  ICGC WISDOM TEMPLE
                </span>
                <h3 className="text-lg font-bold font-serif-title text-white">
                  Church Council
                </h3>
              </div>
              <button
                onClick={() => setShowCouncilModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Photo */}
            <div className="relative aspect-[3831/2275] max-h-[75vh] w-full bg-black/80 flex items-center justify-center p-2">
              <img
                src="/church_council.png"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/church_council.jpg') {
                    target.src = '/church_council.jpg';
                  }
                }}
                alt="Wisdom Temple Church Council"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#032014] border-t border-[#07472c] text-center space-y-1">
              <p className="text-xs font-bold text-[#fce49e] uppercase tracking-wider">
                Governance, Strategic Oversight & Fiduciary Kingdom Stewardship
              </p>
              <p className="text-[11px] text-emerald-200/80">
                Wisdom Temple, Star Junction, Tabora • Accra, Ghana
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
