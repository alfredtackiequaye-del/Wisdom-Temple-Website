import React, { useState } from 'react';
import { PageId, ContactMessage } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (page: PageId) => void;
  onSubmitContactMessage: (msg: Omit<ContactMessage, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigate,
  onSubmitContactMessage,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !message.trim()) return;

    onSubmitContactMessage({
      fullName,
      email: email || 'Not provided',
      phone: phone || 'Not provided',
      subject,
      message,
    });

    setSubmitted(true);
  };

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header Banner - ICGC Forest & Gold */}
      <section className="bg-[#02180e] text-white py-16 sm:py-20 border-b border-[#084c2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            GET IN TOUCH • WE ARE HERE FOR YOU
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-serif-title">
            CONTACT WISDOM TEMPLE
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            Have questions about services, pastoral care, baby dedications, weddings, or ministry membership? Reach out to our administrative team today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & Church Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d6e5dc] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#032014] font-serif-title">Church Office & Sanctuary</h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] shrink-0">
                    <MapPin className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <strong className="block text-[#032014] font-semibold mb-0.5">Sanctuary Address</strong>
                    <p className="font-mono text-xs text-slate-600">{CHURCH_INFO.location}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Landmark: {CHURCH_INFO.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] shrink-0">
                    <Phone className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <strong className="block text-[#032014] font-semibold mb-0.5">Telephone / Prayer Line</strong>
                    <p className="font-mono text-xs text-[#07472c] font-bold">{CHURCH_INFO.phone}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Available Mon - Sat for pastoral inquiries</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] shrink-0">
                    <Mail className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <strong className="block text-[#032014] font-semibold mb-0.5">Official Email</strong>
                    <p className="font-mono text-xs text-slate-600">{CHURCH_INFO.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] shrink-0">
                    <Clock className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <strong className="block text-[#032014] font-semibold mb-0.5">Office Hours</strong>
                    <p className="text-xs text-slate-600">Tuesday – Friday: 8:30 AM – 4:30 PM</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Saturdays by appointment with departments</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('new-here')}
                  className="w-full py-3 bg-[#032014] hover:bg-[#063821] text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center border border-[#c99726]/30"
                >
                  PLAN YOUR SUNDAY VISIT
                </button>
                <button
                  onClick={() => onNavigate('prayer-request')}
                  className="w-full py-3 bg-[#fbf7ee] hover:bg-[#f5ecda] text-[#855e10] border border-[#e5b138]/60 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  REQUEST PASTORAL PRAYER
                </button>
              </div>
            </div>

            {/* Interactive Map Visual */}
            <div className="bg-white rounded-3xl p-6 border border-[#d6e5dc] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#07472c]">
                  DIRECTIONS & LOCATION
                </span>
                <span className="text-[11px] text-slate-400 font-mono">GPS Mapping</span>
              </div>

              <div className="aspect-[16/9] rounded-2xl bg-[#02180e] relative overflow-hidden flex items-center justify-center text-center p-4">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="Church Map Satellite"
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#c99726] to-[#e5b138] text-[#021a10] flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5 fill-[#021a10]" />
                  </div>
                  <strong className="block text-white text-xs font-serif-title">Wisdom Temple</strong>
                  <p className="text-[11px] text-emerald-200 font-mono">{CHURCH_INFO.location}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Located near {CHURCH_INFO.landmark}. Accessible via public transport and rideshare services (Uber, Bolt, Yango).
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Wisdom+Temple+Star+Junction+Tabora+Accra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#eef6f1] hover:bg-[#e0eee4] text-[#07472c] font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all border border-[#c2decc]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#c99726]" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-[#d6e5dc] shadow-md">
            <div className="mb-8 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#07472c] bg-[#eef6f1] px-3 py-1 rounded-full border border-[#c2decc]">
                SEND A MESSAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#032014] font-serif-title mt-2">
                Send Us an Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Our church secretariat responds to emails within 24 to 48 hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#f5cf72] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-[#07472c]" />
                </div>
                <h3 className="text-2xl font-bold text-[#032014] font-serif-title">Message Received!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your message has been forwarded to the church administration. We will reach out via email or phone shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-[#032014] hover:bg-[#063821] text-white font-bold text-xs rounded-xl cursor-pointer border border-[#c99726]/30"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Mensah"
                    className="w-full px-4 py-3 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#032014] font-semibold uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="samuel@example.com"
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
                </div>

                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Subject / Department</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Pastoral Counseling Appointment">Pastoral Counseling Appointment</option>
                    <option value="Baby Dedication / Wedding Inquiry">Baby Dedication / Wedding Inquiry</option>
                    <option value="Joining a Ministry Team">Joining a Ministry Team</option>
                    <option value="Wisdom Summit Inquiries">Wisdom Summit 2026 Inquiries</option>
                    <option value="Giving / Welfare Inquiries">Giving / Welfare Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#032014] font-semibold uppercase mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you today? Feel free to provide details..."
                    className="w-full p-4 bg-[#f8faf8] border border-[#d6e5dc] rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c99726]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#c99726] to-[#e5b138] hover:from-[#d8a531] hover:to-[#f0be47] text-[#021a10] font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE TO OFFICE</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
