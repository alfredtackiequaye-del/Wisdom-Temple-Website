import React, { useState } from 'react';
import { PageId, ContactMessage } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { useBanners } from '../utils/bannerManager';
import { useSiteContent } from '../utils/contentManager';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (page: PageId) => void;
  onSubmitContactMessage: (msg: Omit<ContactMessage, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigate,
  onSubmitContactMessage,
}) => {
  const { getBanner } = useBanners();
  const { content } = useSiteContent();
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
      <section className="relative bg-[#02180e] text-white py-14 sm:py-18 border-b border-[#084c2e] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={getBanner('page_contact_hero', '/assets/optimized/hero_icgc_banner.webp')}
            alt="Contact Us Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 relative z-10">
          <span className="text-xs text-[#f5cf72] font-bold uppercase tracking-widest bg-[#042819] px-3.5 py-1.5 rounded-full border border-[#c99726]/40 inline-block">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-serif-title">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/80 max-w-xl mx-auto leading-relaxed">
            Have questions, counseling requests, or administrative inquiries? We would love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                    <p className="text-xs text-slate-700">{content.churchAddress}</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Wisdom+Temple+Star+Junction+Tabora+Accra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[11px] text-[#07472c] hover:text-[#c99726] font-semibold mt-1 transition-colors"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] shrink-0">
                    <Phone className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <strong className="block text-[#032014] font-semibold mb-0.5">WhatsApp / Phone</strong>
                    <a 
                      href={`https://wa.me/233${content.churchWhatsApp.replace(/^0/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-[#07472c] font-bold hover:text-[#c99726] transition-colors block"
                    >
                      {content.churchPhone}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">WhatsApp & Direct Call Line</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] shrink-0">
                    <Mail className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <strong className="block text-[#032014] font-semibold mb-0.5">Official Email</strong>
                    <a 
                      href={`mailto:${content.churchEmail}`} 
                      className="text-xs text-[#07472c] font-bold hover:text-[#c99726] transition-colors block"
                    >
                      {content.churchEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#07472c] border border-[#c2decc] shrink-0">
                    <Clock className="w-5 h-5 text-[#c99726]" />
                  </div>
                  <div>
                    <strong className="block text-[#032014] font-semibold mb-0.5">Office Hours</strong>
                    <p className="text-xs text-slate-600">{content.officeHours}</p>
                  </div>
                </div>
              </div>

              {/* Pastoral Care Action */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('prayer-request')}
                  className="w-full py-3 bg-[#032014] hover:bg-[#063821] text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center border border-[#c99726]/30 shadow-sm"
                >
                  REQUEST PASTORAL PRAYER
                </button>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-[#d6e5dc] shadow-md">
            <div className="mb-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#07472c] bg-[#eef6f1] px-3 py-1 rounded-full border border-[#c2decc]">
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
              <div className="py-8 sm:py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-[#c99726]/20 border border-[#c99726]/40 text-[#f5cf72] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 sm:w-10 h-8 sm:h-10 text-[#07472c]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#032014] font-serif-title">Message Received!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your message has been forwarded to the church administration. We will reach out via email or phone shortly.
                </p>

                <div className="p-4 bg-[#fbf7ee] rounded-2xl border border-[#c99726]/50 max-w-sm mx-auto text-left">
                  <span className="text-[10px] uppercase text-[#07472c] font-bold block">
                    INQUIRY TICKET CODE
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#032014] block">
                    WT-MSG-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                  <span className="text-[11px] text-slate-500">Subject: {subject}</span>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-[#032014] hover:bg-[#063821] text-white font-bold text-xs rounded-xl cursor-pointer border border-[#c99726]/30 shadow"
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
                    className="w-full py-3.5 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-2"
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
