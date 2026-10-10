import React, { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'motion/react';
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
  ArrowRight,
  ChevronDown,
  CalendarPlus,
  DoorOpen,
  Music,
  MessageCircle
} from 'lucide-react';
import { reveal, staggerContainer, staggerItem, LIFT_SPRING, EASE_OUT } from '../utils/motion';
import { getNextSunday, resolveVisit, buildIcs } from '../utils/visitSchedule';
import { ScrollStory } from '../components/ScrollStory';

/** Live countdown to the next Sunday service (or "on now"). Ticks every 30s; kept separate so only it re-renders. */
const NextServicePill: React.FC = () => {
  const [next, setNext] = useState(() => getNextSunday());
  useEffect(() => {
    const id = window.setInterval(() => setNext(getNextSunday()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-2 text-sm">
      <span className="live-dot" aria-hidden="true" />
      {next.status === 'live' ? (
        <span className="font-semibold text-white">{next.label}. Come as you are.</span>
      ) : (
        <span className="text-emerald-100/90">
          Next service in{' '}
          <strong className="text-gold-300">
            {next.days > 0 ? `${next.days}d ` : ''}{next.hours}h {next.minutes}m
          </strong>
          <span className="hidden sm:inline text-emerald-200/60"> · Sunday, 8:00 AM</span>
        </span>
      )}
    </div>
  );
};

const SUNDAY_STORY = [
  {
    icon: DoorOpen,
    label: '7:15 AM',
    title: 'Doors open',
    text: 'Arrive early, find parking and meet our welcome team. Ushers in badges will guide you to a seat.',
    image: '/assets/photos/wisdom-summit-full-team.webp',
    alt: 'The Wisdom Temple welcome team smiling together',
  },
  {
    icon: Music,
    label: '8:00 AM',
    title: 'Service begins',
    text: 'Praise, worship and the Word. We start on time and the service runs about two hours.',
    image: '/assets/optimized/hero_icgc_banner.webp',
    alt: 'Worshippers gathered in the Wisdom Temple auditorium',
  },
  {
    icon: Coffee,
    label: 'About 10:00 AM',
    title: 'Stay and connect',
    text: 'Light refreshments, a welcome gift and friendly conversation with our pastoral team.',
    image: '/assets/photos/wisdom-summit-sisters.webp',
    alt: 'Members of the Wisdom Temple family enjoying fellowship',
  },
];

const FAQS = [
  { q: 'How long is the service?', a: 'Sunday Celebration starts at 8:00 AM sharp and runs about two hours. Doors open 45 minutes before, so you can arrive early and settle in.' },
  { q: 'What should I wear?', a: 'Come comfortable and modest. Both traditional Ghanaian attire and smart casual are welcome.' },
  { q: 'What about my children?', a: "Kingdom Kids is a safe, secure children's church with trained Bible teachers for ages 1 to 12. Tell us how many children are coming below and our hosts will prepare registration." },
  { q: 'Will I be singled out as a visitor?', a: "No. You will not be asked to stand or introduce yourself. Our welcome team is there to help, not to put you on the spot." },
  { q: 'Where do I park?', a: 'There is secure compound parking with protocol attendants who will direct you.' },
  { q: 'Is there anything for me after the service?', a: 'Yes. Join our pastoral team for light refreshments, and pick up a welcome token and devotional. You can also ask about membership, baptism or small groups.' },
];

interface NewHereViewProps {
  onNavigate: (page: PageId) => void;
  onSubmitVisitPlan: (plan: Omit<VisitPlan, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export const NewHereView: React.FC<NewHereViewProps> = ({ onNavigate, onSubmitVisitPlan }) => {
  const { getBanner } = useBanners();
  const heroBg = getBanner('page_newhere_hero', '/assets/optimized/hero_icgc_banner.webp');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceDate, setServiceDate] = useState('This Sunday (8:00 AM)');
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [needAssistance, setNeedAssistance] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');
  const [planSubmitted, setPlanSubmitted] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const prefersReducedMotion = useReducedMotion();

  // Hero photo drifts slightly slower than the page.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroBgY = useTransform(heroProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '18%']);

  // Mobile sticky call-to-action: show once the hero is gone, hide while the form is on screen.
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const hero = heroRef.current;
    const form = document.getElementById('pre-register');
    if (!hero || !form) return;
    let heroGone = false;
    let formVisible = false;
    const update = () => setShowStickyCta(heroGone && !formVisible);
    const heroObs = new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting; update(); });
    const formObs = new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; update(); }, { threshold: 0.15 });
    heroObs.observe(hero);
    formObs.observe(form);
    return () => { heroObs.disconnect(); formObs.disconnect(); };
  }, []);

  const whatsappHref = () => {
    const number = `233${CHURCH_INFO.whatsapp.replace(/^0/, '')}`;
    const party = `${adultsCount} adult(s)${childrenCount > 0 ? `, ${childrenCount} child(ren)` : ''}`;
    const text = `Hello Wisdom Temple, this is ${fullName}. I have pre-registered to visit on ${serviceDate.replace(/\s*\(.*\)/, '')} at ${serviceTime}. Party: ${party}. My code is ${reservationCode}.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  const downloadCalendar = () => {
    const visit = resolveVisit(serviceDate);
    if (!visit) return;
    const blob = new Blob([buildIcs(visit)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wisdom-temple-visit.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Multi-step form
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const serviceTime = serviceDate.startsWith('The Secret Place') ? '7:00 PM' : '8:00 AM';

  const validateStep = (index: number) => {
    const next: { fullName?: string; phone?: string } = {};
    if (index === 0) {
      if (!fullName.trim()) next.fullName = 'Please tell us your name so we can welcome you.';
      if (phone.trim() && phone.replace(/\D/g, '').length < 9) next.phone = 'That number looks too short. Include the full number.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToStep = (index: number) => setStep(index);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  // Waits for the outgoing step's exit animation to finish before the new heading exists.
  const firstStepRender = useRef(true);
  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      return;
    }
    const id = window.setTimeout(() => stepHeadingRef.current?.focus({ preventScroll: true }), 320);
    return () => window.clearTimeout(id);
  }, [step]);

  const handleNext = () => {
    if (validateStep(step)) goToStep(Math.min(step + 1, 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      handleNext();
      return;
    }
    if (!validateStep(0)) {
      goToStep(0);
      return;
    }

    onSubmitVisitPlan({
      fullName,
      email: email || 'Not provided',
      phone: phone || 'Not provided',
      serviceDate,
      serviceTime,
      adultsCount,
      childrenCount,
      needAssistance,
      specialNeeds: specialNotes,
    });

    setReservationCode(`WT-GUEST-${Math.floor(1000 + Math.random() * 9000)}`);
    setPlanSubmitted(true);
    setStep(0);
  };

  return (
    <div className="visit-page-bg min-h-screen text-slate-900 pb-24 overflow-x-clip">
      {/* Hero: a warm welcome with the people who will greet you */}
      <section ref={heroRef} className="ambient-glow relative isolate bg-forest-950 text-white overflow-hidden border-b border-gold-500/30">
        <m.div className="absolute -inset-y-10 inset-x-0 -z-10" style={{ y: heroBgY }}>
          <img
            src={heroBg}
            srcSet={
              /hero_icgc_banner\.(webp|jpg)$/.test(heroBg)
                ? '/assets/optimized/hero_icgc_banner-mobile.webp 900w, /assets/optimized/hero_icgc_banner.webp 2048w'
                : undefined
            }
            sizes="100vw"
            alt=""
            aria-hidden="true"
            decoding="async"
            className="hero-drift w-full h-full object-cover opacity-45"
          />
          {/* Lets the photo glow on the right while keeping the headline readable on the left. */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/25" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest-950 to-transparent" />
          <div className="absolute inset-0 hero-grain" />
        </m.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <m.span {...reveal()} className="text-xs text-gold-300 font-bold uppercase tracking-[0.22em] inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
              You are our honored guest
            </m.span>
            <m.h1 {...reveal(0.08)} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-serif-title leading-[1.05]">
              Plan your visit.
              <span className="block text-gold-300">We saved you a seat.</span>
            </m.h1>
            <m.p {...reveal(0.16)} className="text-base sm:text-lg text-emerald-100/85 max-w-xl leading-relaxed">
              Visiting a church for the first time should feel warm, easy and
              unhurried. Here is exactly what to expect, from the car park to
              the coffee afterwards.
            </m.p>
            <m.div {...reveal(0.24)} className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#pre-register"
                className="cta-shine px-7 py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold text-sm transition-colors"
              >
                Pre-register my visit
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CHURCH_INFO.physicalAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gold-300 transition-colors"
              >
                Get directions
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </m.div>
            <m.div {...reveal(0.32)} className="pt-2">
              <NextServicePill />
            </m.div>
          </div>

          <m.div {...reveal(0.12)} className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-gold-400/15 blur-2xl" aria-hidden="true" />
              <img
                src="/assets/photos/wisdom-summit-full-team.webp"
                alt="The Wisdom Temple welcome team smiling together"
                className="relative w-full aspect-[4/3] object-cover rounded-3xl border border-white/15 shadow-2xl"
              />
              <div className="absolute -bottom-5 left-5 right-5 sm:left-auto sm:right-6 sm:w-64 rounded-2xl bg-forest-900/95 border border-gold-500/40 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-[11px] uppercase tracking-widest text-gold-300 font-bold">Look for our hosts</p>
                <p className="text-xs text-emerald-100/85 mt-0.5">Ushers in badges will meet you at the door.</p>
              </div>
            </div>
          </m.div>
        </div>

        {/* Quick facts */}
        <div className="border-t border-white/10 bg-forest-950/70 backdrop-blur-sm">
          <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
            {[
              { icon: Clock, term: 'Sundays', desc: '8:00 AM sharp' },
              { icon: Heart, term: 'Midweek', desc: 'Wednesdays, 7:00 PM' },
              { icon: MapPin, term: 'Where', desc: CHURCH_INFO.landmark },
              { icon: Baby, term: 'Kingdom Kids', desc: 'Ages 1 to 12' },
            ].map(({ icon: Icon, term, desc }) => (
              <li key={term} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gold-300" />
                </span>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-emerald-300/70 font-semibold">{term}</span>
                  <span className="block font-semibold text-white">{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 space-y-20">
        {/* Sunday at a glance: a pinned photo that changes as you scroll through the morning */}
        <section aria-labelledby="sunday-glance">
          <m.div {...reveal()} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">Sunday at a glance</span>
            <h2 id="sunday-glance" className="text-3xl sm:text-4xl text-forest-900 font-serif-title">A relaxed morning, start to finish</h2>
          </m.div>

          <ScrollStory steps={SUNDAY_STORY} />
        </section>

        {/* Your visit, step by step */}
        <section aria-labelledby="visit-steps" className="pattern-band relative py-16 sm:py-20">
          <m.div {...reveal()} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-[0.22em]">Your visit, step by step</span>
            <h2 id="visit-steps" className="text-3xl sm:text-4xl text-white font-serif-title">What to expect on Sunday</h2>
            <span className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-12 bg-gold-400/60" />
              <span className="w-2 h-2 rotate-45 bg-gold-400" />
              <span className="h-px w-12 bg-gold-400/60" />
            </span>
          </m.div>

          <m.ol {...staggerContainer(0.16)} className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <span className="hidden md:block absolute top-[3.25rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" aria-hidden="true" />
            {[
              {
                n: 1, tag: 'Before you come', title: 'Service times & directions', note: 'Doors open 45 minutes before service',
                items: [
                  { icon: Clock, label: 'Sunday Celebration', text: '8:00 AM sharp, about 2 hours.' },
                  { icon: Clock, label: 'Midweek', text: 'The Secret Place, Wednesdays at 7:00 PM.' },
                  { icon: MapPin, label: 'Location', text: `Wisdom Temple Auditorium, ${CHURCH_INFO.location}.` },
                  { icon: ShieldCheck, label: 'Parking', text: 'Secure compound parking with protocol attendants.' },
                  { icon: Smile, label: 'Dress code', text: 'Comfortable and modest. Ghanaian attire and smart casual are both welcome.' },
                ],
              },
              {
                n: 2, tag: 'When you arrive', title: 'Hospitality & children care', note: 'Dedicated hosts at the welcome desk',
                items: [
                  { icon: Heart, label: 'Welcome team', text: 'Ushers in badges will guide you to your seat.' },
                  { icon: Baby, label: 'Kingdom Kids', text: "Safe children's church with trained Bible teachers, ages 1 to 12." },
                  { icon: Users, label: 'Seating', text: 'Air-conditioned auditorium with comfortable seats and live audio-visual displays.' },
                  { icon: CheckCircle2, label: 'No awkward spotlights', text: "You won't be singled out or asked to stand." },
                ],
              },
              {
                n: 3, tag: 'After service', title: 'Reception & connection', note: 'Pastoral fellowship & devotional gift pack',
                items: [
                  { icon: Coffee, label: 'Guest reception', text: 'Light refreshments with our pastoral team right after service.' },
                  { icon: CheckCircle2, label: 'Welcome gift', text: 'A special token and devotional to bless your journey.' },
                  { icon: ArrowRight, label: 'Next steps', text: 'Learn about membership, baptism, or join a small group.' },
                ],
              },
            ].map((step) => (
              <m.li
                key={step.n}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={LIFT_SPRING}
                className="relative bg-white rounded-3xl border border-mist-300 shadow-sm hover:shadow-lift hover:border-gold-500/50 transition-shadow flex flex-col"
              >
                <div className="px-6 pt-6 flex items-center gap-4">
                  <span className="w-14 h-14 rounded-2xl bg-forest-900 text-gold-300 border border-gold-500/40 flex items-center justify-center font-serif-title text-2xl shadow-md">
                    {step.n}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">{step.tag}</span>
                </div>
                <div className="p-6 space-y-4 flex-1">
                  <h3 className="text-xl text-forest-900 font-serif-title">{step.title}</h3>
                  <ul className="text-sm text-slate-700 space-y-3">
                    {step.items.map(({ icon: Icon, label, text }) => (
                      <li key={label} className="flex items-start gap-3">
                        <Icon className="w-4 h-4 text-gold-600 shrink-0 mt-1" />
                        <span><strong className="text-slate-900">{label}.</strong> {text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mx-6 mb-6 py-2.5 px-3 rounded-xl bg-gold-50 border border-gold-200 text-xs font-semibold text-forest-800 text-center">
                  {step.note}
                </div>
              </m.li>
            ))}
          </m.ol>
        </section>

        {/* Common questions */}
        <section aria-labelledby="visit-faq" className="max-w-3xl mx-auto">
          <m.div {...reveal()} className="text-center mb-10 space-y-3">
            <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.22em]">Good to know</span>
            <h2 id="visit-faq" className="text-3xl sm:text-4xl text-forest-900 font-serif-title">Questions first-time guests ask</h2>
          </m.div>
          <m.div {...staggerContainer(0.08)} className="space-y-3">
            {FAQS.map((item) => (
              <m.details
                key={item.q}
                variants={staggerItem}
                className="group bg-white rounded-2xl border border-mist-300 open:border-gold-500/60 open:shadow-md transition-shadow"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-4 text-forest-900 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-gold-600 shrink-0 transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-6 pb-5 -mt-1 text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </m.details>
            ))}
          </m.div>
        </section>

        {/* Plan Your Visit Interactive Form */}
        <div id="pre-register" className="grid lg:grid-cols-12 gap-8 items-start scroll-mt-28">
        <m.aside {...reveal()} className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-forest-900 text-white p-7 border border-forest-700 shadow-lg">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold-400/15 blur-3xl" aria-hidden="true" />
            <h2 className="relative text-2xl font-serif-title text-gold-300">Find us</h2>
            <p className="relative mt-2 text-sm text-emerald-100/85 leading-relaxed">
              {CHURCH_INFO.physicalAddress}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CHURCH_INFO.physicalAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-forest-950 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <MapPin className="w-4 h-4" /> Open in Maps
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="/assets/photos/wisdom-summit-sisters.webp" alt="Smiling members of the Wisdom Temple family" loading="lazy" className="aspect-square w-full object-cover rounded-2xl shadow-md" />
            <img src="/assets/photos/wisdom-summit-team-red.webp" alt="Wisdom Temple team members welcoming guests" loading="lazy" className="aspect-square w-full object-cover rounded-2xl shadow-md" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Questions before you come? Message us on WhatsApp at {CHURCH_INFO.whatsapp} and a real person will reply.
          </p>
        </m.aside>
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-12 border border-mist-300 shadow-md w-full">
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
                Thank you, <strong>{fullName}</strong>. Our hospitality team has recorded your visit for {serviceDate.replace(/\s*\(.*\)/, '')} at {serviceTime}. A guest reception pass has been reserved in your name.
              </p>

              <div className="p-4 bg-gold-50 rounded-2xl border border-gold-500/50 max-w-md mx-auto text-left space-y-1">
                <span className="text-[10px] uppercase text-forest-700 font-bold block">
                  VISITOR RESERVATION CODE
                </span>
                <span className="text-base sm:text-lg font-black text-forest-900 block">
                  {reservationCode}
                </span>
                <span className="text-xs text-slate-600 block">
                  Party: {adultsCount} Adult(s) {childrenCount > 0 ? `• ${childrenCount} Child(ren)` : ''}
                </span>
              </div>

              <div className="pt-3 flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-whatsapp hover:bg-whatsapp-dark text-forest-950 font-bold text-xs rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Confirm on WhatsApp
                </a>
                {resolveVisit(serviceDate) && (
                  <button
                    onClick={downloadCalendar}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 hover:bg-forest-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4 text-gold-300" /> Add to my calendar
                  </button>
                )}
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
            <form onSubmit={handleSubmit} noValidate className="text-xs">
              {/* Progress */}
              <ol className="flex items-center justify-center gap-2 sm:gap-3 mb-8" aria-label="Form progress">
                {['About you', 'Your visit', 'Review'].map((label, i) => (
                  <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={i === step ? 'step' : undefined}>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        i < step ? 'bg-forest-700 text-gold-300' : i === step ? 'bg-gold-500 text-forest-950 ring-4 ring-gold-500/20' : 'bg-mist-200 text-slate-500'
                      }`}
                    >
                      {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </span>
                    <span className={`hidden sm:inline font-semibold ${i === step ? 'text-forest-900' : 'text-slate-500'}`}>{label}</span>
                    {i < 2 && <span className="w-6 sm:w-10 h-px bg-mist-300" aria-hidden="true" />}
                  </li>
                ))}
              </ol>

              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={step}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="space-y-4"
                >
                  {step === 0 && (
                    <>
                      <h3 ref={stepHeadingRef} tabIndex={-1} className="text-lg font-serif-title text-forest-900 outline-none">Who is coming?</h3>
                      <div>
                        <label htmlFor="visit-name" className="block text-forest-900 font-semibold uppercase mb-1.5">Full Name *</label>
                        <input
                          id="visit-name"
                          type="text"
                          required
                          autoComplete="name"
                          value={fullName}
                          onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: undefined }); }}
                          placeholder="e.g. Kwabena Osei"
                          aria-invalid={Boolean(errors.fullName)}
                          aria-describedby={errors.fullName ? 'visit-name-error' : undefined}
                          className={`w-full px-4 py-3 bg-mist-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500${errors.fullName ? 'border-red-400' : 'border-mist-300'}`}
                        />
                        {errors.fullName && <p id="visit-name-error" role="alert" className="mt-1.5 text-red-700 font-medium">{errors.fullName}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="visit-email" className="block text-forest-900 font-semibold uppercase mb-1.5">Email Address</label>
                          <input
                            id="visit-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="kwabena@example.com"
                            className="w-full px-4 py-3 bg-mist-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 border-mist-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="visit-phone" className="block text-forest-900 font-semibold uppercase mb-1.5">Phone (WhatsApp preferred)</label>
                          <input
                            id="visit-phone"
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: undefined }); }}
                            placeholder="e.g. +233 24 000 0000"
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={errors.phone ? 'visit-phone-error' : undefined}
                            className={`w-full px-4 py-3 bg-mist-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500${errors.phone ? 'border-red-400' : 'border-mist-300'}`}
                          />
                          {errors.phone && <p id="visit-phone-error" role="alert" className="mt-1.5 text-red-700 font-medium">{errors.phone}</p>}
                        </div>
                      </div>
                      <p className="text-slate-500">Optional, but a phone number lets our hosts message you before Sunday.</p>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <h3 ref={stepHeadingRef} tabIndex={-1} className="text-lg font-serif-title text-forest-900 outline-none">When are you coming?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-3">
                          <label htmlFor="visit-date" className="block text-forest-900 font-semibold uppercase mb-1.5">Planned Service</label>
                          <select id="visit-date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} className="w-full px-4 py-3 bg-mist-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 border-mist-300">
                            <option value="This Sunday (8:00 AM)">This Sunday (8:00 AM)</option>
                            <option value="Next Sunday (8:00 AM)">Next Sunday (8:00 AM)</option>
                            <option value="The Secret Place (Wed 7:00 PM)">The Secret Place (Wed 7:00 PM)</option>
                            <option value="Later this month">Later this month</option>
                          </select>
                        </div>
                        <div className="sm:col-span-3 sm:grid sm:grid-cols-2 sm:gap-4 space-y-4 sm:space-y-0">
                          <div>
                            <label htmlFor="visit-adults" className="block text-forest-900 font-semibold uppercase mb-1.5">Adults</label>
                            <select id="visit-adults" value={adultsCount} onChange={(e) => setAdultsCount(Number(e.target.value))} className="w-full px-4 py-3 bg-mist-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 border-mist-300">
                              <option value={1}>1 Adult</option>
                              <option value={2}>2 Adults</option>
                              <option value={3}>3 Adults</option>
                              <option value={4}>4+ Adults</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="visit-children" className="block text-forest-900 font-semibold uppercase mb-1.5">Children (Ages 1-12)</label>
                            <select id="visit-children" value={childrenCount} onChange={(e) => setChildrenCount(Number(e.target.value))} className="w-full px-4 py-3 bg-mist-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 border-mist-300">
                              <option value={0}>No Children</option>
                              <option value={1}>1 Child</option>
                              <option value={2}>2 Children</option>
                              <option value={3}>3+ Children</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {childrenCount > 0 && (
                        <p className="p-3 rounded-xl bg-gold-50 border border-gold-200 text-forest-800">
                          Kingdom Kids will be ready for them with trained Bible teachers. Our hosts will help you register at the door.
                        </p>
                      )}
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h3 ref={stepHeadingRef} tabIndex={-1} className="text-lg font-serif-title text-forest-900 outline-none">Anything we should know?</h3>
                      <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={needAssistance}
                          onChange={(e) => setNeedAssistance(e.target.checked)}
                          className="w-4 h-4 rounded border-mist-300 text-gold-500 focus:ring-gold-500"
                        />
                        <span>I or a family member would appreciate assistance (e.g. mobility, wheelchair, translations)</span>
                      </label>
                      <div>
                        <label htmlFor="visit-notes" className="block text-forest-900 font-semibold uppercase mb-1.5">Questions or Special Notes</label>
                        <textarea
                          id="visit-notes"
                          rows={3}
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          placeholder="Tell us anything that will make your visit comfortable..."
                          className="w-full px-4 py-3 bg-mist-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 border-mist-300"
                        />
                      </div>
                      <dl className="rounded-2xl bg-gold-50 border border-gold-200 p-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-slate-700">
                        <dt className="font-bold text-forest-900">Name</dt><dd>{fullName}</dd>
                        <dt className="font-bold text-forest-900">Service</dt><dd>{serviceDate}</dd>
                        <dt className="font-bold text-forest-900">Party</dt><dd>{adultsCount} adult(s){childrenCount > 0 ? `, ${childrenCount} child(ren)` : ''}</dd>
                        <dt className="font-bold text-forest-900">Contact</dt><dd>{[phone, email].filter(Boolean).join(' · ') || 'Not provided'}</dd>
                      </dl>
                    </>
                  )}
                </m.div>
              </AnimatePresence>

              <div className="pt-6 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(step - 1)}
                    className="px-5 py-3 rounded-lg border border-mist-400 text-forest-700 font-bold text-xs uppercase tracking-wider hover:bg-mist-50 cursor-pointer"
                  >
                    Back
                  </button>
                ) : <span />}
                {step < 2 ? (
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Confirm my visit
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
        </div>
      </div>

      {/* Mobile: keeps the main action in reach while reading */}
      <div
        className={`lg:hidden fixed bottom-4 left-4 right-20 z-30 transition-all duration-300 ${
          showStickyCta ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
        }`}
        aria-hidden={!showStickyCta}
      >
        <a
          href="#pre-register"
          tabIndex={showStickyCta ? 0 : -1}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gold-400 text-forest-950 font-bold text-sm shadow-xl"
        >
          <CalendarPlus className="w-4 h-4" /> Pre-register my visit
        </a>
      </div>
    </div>
  );
};
