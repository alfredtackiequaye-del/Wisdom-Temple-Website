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

import { PageHero } from '../components/PageHero';
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
    <div className="page-warm-bg min-h-screen text-slate-900 pb-24 overflow-x-clip">
      {/* Header Banner - ICGC Forest & Gold */}
      <PageHero
        image={getBanner('page_contact_hero', '/assets/photos/wisdom-summit-sisters.webp')}
        imagePosition="center 18%"
        eyebrow="Get in touch"
        title="Contact Us"
        text="Have questions, counseling requests, or administrative inquiries? We would love to hear from you."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Church Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-mist-300 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-forest-900 font-serif-title">Church Office & Sanctuary</h2>
              
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-mist-100 text-forest-700 border border-mist-400 shrink-0">
                    <MapPin className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <strong className="block text-forest-900 font-semibold mb-0.5">Sanctuary Address</strong>
                    <p className="text-xs text-slate-700">{content.churchAddress}</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Wisdom+Temple+Star+Junction+Tabora+Accra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[11px] text-forest-700 hover:text-gold-500 font-semibold mt-1 transition-colors"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-mist-100 text-forest-700 border border-mist-400 shrink-0">
                    <Phone className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <strong className="block text-forest-900 font-semibold mb-0.5">WhatsApp / Phone</strong>
                    <a 
                      href={`https://wa.me/233${content.churchWhatsApp.replace(/^0/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-forest-700 font-bold hover:text-gold-500 transition-colors block"
                    >
                      {content.churchPhone}
                    </a>
                    <span className="text-[11px] text-slate-600 block mt-0.5">WhatsApp & Direct Call Line</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-mist-100 text-forest-700 border border-mist-400 shrink-0">
                    <Mail className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <strong className="block text-forest-900 font-semibold mb-0.5">Official Email</strong>
                    <a 
                      href={`mailto:${content.churchEmail}`} 
                      className="text-xs text-forest-700 font-bold hover:text-gold-500 transition-colors block"
                    >
                      {content.churchEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-mist-100 text-forest-700 border border-mist-400 shrink-0">
                    <Clock className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <strong className="block text-forest-900 font-semibold mb-0.5">Office Hours</strong>
                    <p className="text-xs text-slate-600">{content.officeHours}</p>
                  </div>
                </div>
              </div>

              {/* Pastoral Care Action */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('prayer-request')}
                  className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center border border-gold-500/30 shadow-sm"
                >
                  REQUEST PASTORAL PRAYER
                </button>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-mist-300 shadow-md">
            <div className="mb-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-mist-100 px-3 py-1 rounded-full border border-mist-400">
                SEND A MESSAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-serif-title mt-2">
                Send Us an Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Our church secretariat responds to emails within 24 to 48 hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 sm:py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 sm:w-10 h-8 sm:h-10 text-forest-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-forest-900 font-serif-title">Message Received!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your message has been forwarded to the church administration. We will reach out via email or phone shortly.
                </p>

                <div className="p-4 bg-gold-50 rounded-2xl border border-gold-500/50 max-w-sm mx-auto text-left">
                  <span className="text-[10px] uppercase text-forest-700 font-bold block">
                    INQUIRY TICKET CODE
                  </span>
                  <span className="text-base sm:text-lg font-black text-forest-900 block">
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
                    className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl cursor-pointer border border-gold-500/30 shadow"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Mensah"
                    className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-forest-900 font-semibold uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="samuel@example.com"
                      className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-forest-900 font-semibold uppercase mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +233 24 000 0000"
                      className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-forest-900 font-semibold uppercase mb-1.5">Subject / Department</label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                  <label className="block text-forest-900 font-semibold uppercase mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you today? Feel free to provide details..."
                    className="w-full p-4 bg-mist-50 border border-mist-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-2"
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
