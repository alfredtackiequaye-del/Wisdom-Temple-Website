import React, { useState } from 'react';
import { ChurchEvent, EventRegistration } from '../types';
import { X, Calendar, MapPin, CheckCircle2, Ticket } from 'lucide-react';

interface EventRegistrationModalProps {
  event: ChurchEvent | null;
  onClose: () => void;
  onRegister: (registration: EventRegistration) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, onClose, onRegister }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [confirmedRegistration, setConfirmedRegistration] = useState<EventRegistration | null>(null);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventName: event.name,
      fullName,
      email,
      phone: phone || 'Not provided',
      attendeesCount,
      registrationCode: `WT-${new Date().getFullYear()}-${randomDigits}`,
      dateRegistered: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onRegister(newReg);
    setConfirmedRegistration(newReg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02180e]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#02180e] border border-[#084c2e] rounded-2xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#084c2e] bg-[#01120a]">
          <div className="flex items-center space-x-2 text-[#f5cf72]">
            <Ticket className="w-5 h-5 text-[#c99726]" />
            <h3 className="font-bold text-white text-base font-serif-title">Event Registration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-[#042819] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {confirmedRegistration ? (
            /* Confirmation Pass */
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-[#c99726]/20 border border-[#c99726]/40 rounded-full flex items-center justify-center mx-auto text-[#f5cf72]">
                <CheckCircle2 className="w-8 h-8 text-[#07472c]" />
              </div>

              <div>
                <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3 py-1 rounded-full border border-[#c99726]/40">
                  REGISTRATION CONFIRMED
                </span>
                <h4 className="text-xl font-bold text-white mt-3 font-serif-title">{event.name}</h4>
                <p className="text-xs text-emerald-200/80 mt-1">We look forward to hosting you in God's presence.</p>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="bg-[#042819] border border-[#c99726]/40 rounded-xl p-4 text-left relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-[#c99726] to-[#e5b138] text-[#021a10] font-black text-[10px] uppercase tracking-wider rounded-bl-lg">
                  ENTRY PASS
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">Attendee</span>
                    <span className="font-bold text-white text-sm">{confirmedRegistration.fullName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#084c2e]">
                    <div>
                      <span className="text-[10px] text-emerald-300 uppercase">Pass Code</span>
                      <span className="font-mono text-[#f5cf72] font-bold text-sm block">
                        {confirmedRegistration.registrationCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-300 uppercase">Seats Reserved</span>
                      <span className="font-bold text-white text-sm block">{confirmedRegistration.attendeesCount} Person(s)</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#084c2e] text-[11px] text-emerald-200/80 space-y-0.5 font-mono">
                    <p className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#c99726]" />
                      <span>{event.date} • {event.time}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#c99726]" />
                      <span>{event.venue}</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-emerald-200/80">
                A confirmation note has been recorded. Present this pass code or your name at the registration desk upon arrival.
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl transition-all cursor-pointer shadow"
              >
                Done
              </button>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 bg-[#042819] rounded-xl border border-[#084c2e]">
                <h4 className="text-sm font-bold text-white font-serif-title">{event.name}</h4>
                <div className="text-xs text-emerald-200/80 mt-1 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c99726] shrink-0" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c99726] shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full px-3.5 py-2.5 bg-[#042819] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwame@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#042819] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +233 24 000 0000"
                    className="w-full px-3.5 py-2.5 bg-[#042819] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                  Number of Attendees
                </label>
                <select
                  value={attendeesCount}
                  onChange={(e) => setAttendeesCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#042819] border border-[#084c2e] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                >
                  <option value={1}>1 Attendee (Just myself)</option>
                  <option value={2}>2 Attendees</option>
                  <option value={3}>3 Attendees</option>
                  <option value={4}>4 Attendees</option>
                  <option value={5}>5+ Attendees (Family / Group)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  CONFIRM FREE REGISTRATION
                </button>
                <p className="text-[11px] text-center text-emerald-200/70 mt-2">
                  Admission is free. Registration helps our ushering and protocol team prepare seating.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
