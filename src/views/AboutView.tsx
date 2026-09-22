import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { CHURCH_INFO, BELIEFS } from '../data/churchData';
import { 
  Target, 
  Compass, 
  BookOpen, 
  UserCheck, 
  History, 
  CheckCircle2, 
  Shield
} from 'lucide-react';

interface AboutViewProps {
  initialSubTab?: string;
  onNavigate: (page: PageId) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ initialSubTab }) => {
  const [activeTab, setActiveTab] = useState<string>('who-we-are');

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Page Header Banner - ICGC Forest & Gold */}
      <section className="bg-[#02180e] text-white py-16 sm:py-20 border-b border-[#084c2e] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            INTERNATIONAL CENTRAL GOSPEL CHURCH • GHANA
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            ABOUT ICGC WISDOM TEMPLE
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            {CHURCH_INFO.description}
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
              <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                IDENTITY & NATURE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032014] font-serif-title">
                A Christ-Centered Assembly in Ghana
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                ICGC Wisdom Temple is a Bible-believing, charismatic church committed to raising leaders, shaping visions, and influencing society through Jesus Christ. We belong to the global family of the International Central Gospel Church (ICGC), an evangelical charismatic movement headquartered in Accra, Ghana.
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                At Wisdom Temple, we believe every human being possesses God-given potential waiting to be activated through the Word of God, charismatic prayer, and practical discipleship. Whether you are a student, an artisan, a corporate executive, or a parent, you will find a home where your faith is grounded, your gifts are sharpened, and your purpose is unleased.
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
                  <span className="text-xs text-[#f5cf72] font-mono font-bold block">SUNDAY CELEBRATION</span>
                  <p className="text-lg font-bold text-white mt-1">Every Sunday at 8:00 AM</p>
                  <p className="text-xs text-emerald-300/70 mt-1">Main Sanctuary & Online Broadcast</p>
                </div>
                <div className="p-4 bg-[#02180e] rounded-xl border border-[#084c2e]">
                  <span className="text-xs text-[#f5cf72] font-mono font-bold block">THE SECRET PLACE</span>
                  <p className="text-lg font-bold text-white mt-1">Every Wednesday at 7:00 PM</p>
                  <p className="text-xs text-emerald-300/70 mt-1">Midweek Prayer, Worship and Encounter</p>
                </div>
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
                <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-widest block">
                  OUR VISION
                </span>
                <h3 className="text-2xl font-bold text-[#032014] font-serif-title">
                  To Establish the House of God Through the Development of the Human Personality
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We envision a congregation of believers who have discovered their god-given identity, walking in divine dignity, moral uprightness, and spiritual authority across Ghana, Africa, and the global diaspora.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white rounded-3xl p-8 border border-[#d6e5dc] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-widest block">
                  OUR MISSION
                </span>
                <h3 className="text-2xl font-bold text-[#032014] font-serif-title">
                  Raising Leaders, Shaping Visions, and Influencing Society Through Christ
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We accomplish this mission through regular exposition of the Holy Scriptures, fervent charismatic prayer at The Secret Place, leadership mentoring, and purposeful generational ministries.
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
                    <strong className="text-[#032014] block font-semibold">1. Raising Leaders</strong>
                    Instilling godly discipline, ethical accountability, and servant leadership in every believer, from youth to seasoned executives.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#07472c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#032014] block font-semibold">2. Shaping Visions</strong>
                    Assisting men and women to discover divine purpose, formulate clear personal and family blueprints, and execute enterprise with biblical excellence.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#07472c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#032014] block font-semibold">3. Influencing Society Through Christ</strong>
                    Deploying believers into politics, healthcare, education, law, industry, and the arts as salt and light to reform systems with the mind of Christ.
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
              <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
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
                  <div className="flex items-center space-x-2 text-[#07472c] font-mono text-xs font-bold">
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
              <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                SPIRITUAL OVERSIGHT
              </span>
              <h2 className="text-3xl font-extrabold text-[#032014] font-serif-title mt-2">
                Our Pastoral Leadership
              </h2>
              <p className="text-sm text-slate-600">
                Dedicated servant-leaders guiding ICGC Wisdom Temple with pastoral care, biblical counsel, and vision.
              </p>
            </div>

            {/* Senior Minister Profile Card (Placeholder strictly preserved) */}
            <div className="bg-white rounded-3xl p-8 border border-[#d6e5dc] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 aspect-[3/4] rounded-2xl bg-[#032014] overflow-hidden relative flex items-center justify-center text-slate-400">
                <img
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80"
                  alt="Pastor of ICGC Wisdom Temple"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02180e] via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-xs text-[#f5cf72] font-bold">
                  [PASTOR NAME]
                </span>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-widest">
                    SENIOR MINISTER
                  </span>
                  <h3 className="text-2xl font-bold text-[#032014] font-serif-title">[PASTOR NAME]</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Senior Pastor, ICGC Wisdom Temple</p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Serving with deep commitment to the ICGC vision of raising leaders and shaping visions. Through systematic teaching of the Scriptures, charismatic prayer, and a heart for family life, [PASTOR NAME] leads the assembly to experience spiritual wisdom and societal influence.
                </p>

                <div className="p-4 bg-[#f4f7f4] rounded-xl border border-[#d6e5dc] text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-[#032014]">Pastoral Consultation Hours:</p>
                  <p>Tuesdays & Thursdays by appointment via the Church Office: <span className="font-mono text-[#07472c] font-bold">{CHURCH_INFO.phone}</span></p>
                </div>
              </div>
            </div>

            {/* Church Board & Pastoral Council Placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#eef6f1] text-[#07472c] mx-auto flex items-center justify-center font-bold border border-[#c2decc]">
                  PC
                </div>
                <h4 className="text-sm font-bold text-[#032014] font-serif-title">Pastoral Council</h4>
                <p className="text-xs text-slate-500 font-mono">[PASTORAL TEAM PLACEHOLDER]</p>
                <p className="text-[11px] text-slate-400">Spiritual oversight, prayer and discipleship</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#eef6f1] text-[#07472c] mx-auto flex items-center justify-center font-bold border border-[#c2decc]">
                  CB
                </div>
                <h4 className="text-sm font-bold text-[#032014] font-serif-title">Church Board</h4>
                <p className="text-xs text-slate-500 font-mono">[BOARD MEMBERS PLACEHOLDER]</p>
                <p className="text-[11px] text-slate-400">Governance, administration and stewardship</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d6e5dc] text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#eef6f1] text-[#07472c] mx-auto flex items-center justify-center font-bold border border-[#c2decc]">
                  DM
                </div>
                <h4 className="text-sm font-bold text-[#032014] font-serif-title">Ministry Deacons</h4>
                <p className="text-xs text-slate-500 font-mono">[DEACONS PLACEHOLDER]</p>
                <p className="text-[11px] text-slate-400">Hospitality, protocol, welfare and operations</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Story & Heritage */}
        {activeTab === 'story' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#07472c] font-bold uppercase tracking-widest bg-[#e4f0e8] px-3 py-1 rounded-full border border-[#c2decc]">
                OUR JOURNEY OF FAITH
              </span>
              <h2 className="text-3xl font-extrabold text-[#032014] font-serif-title mt-2">
                The Heritage of ICGC & Wisdom Temple
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                The International Central Gospel Church (ICGC) was inaugurated on February 26, 1984 in Accra, Ghana. From humble beginnings, God has expanded this movement into hundreds of branches across Ghana, Europe, North America, and across the African continent.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-[#c99726] pl-6 space-y-2 bg-white p-6 rounded-r-2xl border border-l-0 border-[#d6e5dc]">
                <span className="text-xs font-mono text-[#07472c] font-bold">FOUNDATIONAL PHILOSOPHY</span>
                <h3 className="text-xl font-bold text-[#032014] font-serif-title">Dignity, Excellence & Empowerment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  ICGC pioneered a fresh charismatic wave in Ghana focused on human dignity, self-reliance, leadership development, and societal influence. ICGC Wisdom Temple carries this mantle with fervor in Star Junction, Tabora - Accra.
                </p>
              </div>

              <div className="border-l-4 border-[#c99726] pl-6 space-y-2 bg-white p-6 rounded-r-2xl border border-l-0 border-[#d6e5dc]">
                <span className="text-xs font-mono text-[#07472c] font-bold">LOOKING TO THE FUTURE</span>
                <h3 className="text-xl font-bold text-[#032014] font-serif-title">Building for Generations</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Today, ICGC Wisdom Temple continues to expand its community reach, raising children in kingdom righteousness, equipping youth for modern challenges, and hosting conferences like the annual Wisdom Summit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
