import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useSiteContent } from '../utils/contentManager';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useSiteContent();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Message Dialog */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-80 sm:w-88 bg-[#02180e] border border-[#084c2e] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-white">
          {/* Header */}
          <div className="bg-[#032014] px-4 py-3 text-white flex items-center justify-between border-b border-[#084c2e]">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#042819] border border-[#c99726]/40 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#f5cf72]" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight font-serif-title text-white">{content.churchName}</h4>
                <span className="text-[10px] text-[#f5cf72] font-medium">Official Church WhatsApp Helpdesk</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#01120a] text-xs space-y-3">
            <div className="p-3 bg-[#042819] rounded-xl border border-[#084c2e] text-emerald-100/90 space-y-1.5">
              <p className="font-semibold text-white">Peace and Grace to you! 🙏</p>
              <p className="text-emerald-200/80">
                Welcome to {content.churchName}. How can our pastoral care and welcoming team assist you today?
              </p>
            </div>

            <div className="space-y-1.5 text-emerald-200">
              <div className="p-2 bg-[#042819]/80 rounded-lg border border-[#084c2e] text-[11px]">
                <span className="text-[#f5cf72] font-semibold block">{content.sundayServiceName}</span>
                <span>Sundays at {content.sundayServiceTime} • {content.churchAddress}</span>
              </div>
              <div className="p-2 bg-[#042819]/80 rounded-lg border border-[#084c2e] text-[11px]">
                <span className="text-[#f5cf72] font-semibold block">{content.midweekServiceName}</span>
                <span>Wednesdays at {content.midweekServiceTime} • Fasting & Prayer</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider block mb-1">
                Direct WhatsApp Line
              </span>
              <div className="p-2.5 bg-[#042819] rounded-lg border border-[#c99726]/40 flex items-center justify-between text-[#f5cf72] font-bold text-xs">
                <span>{content.churchWhatsApp}</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#02180e] border border-[#084c2e] rounded text-emerald-300">Ghana</span>
              </div>
            </div>

            <a
              href={`https://wa.me/233${content.churchWhatsApp.replace(/^0/, '')}?text=Hello%20Wisdom%20Temple%2C%20I%20would%20like%20to%20connect%20with%20the%20church.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-3 sm:px-4 sm:py-3 bg-[#032014] hover:bg-[#063821] text-white rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-[#c99726]"
        aria-label="Contact Wisdom Temple on WhatsApp"
        id="whatsapp-floating-btn"
      >
        <MessageCircle className="w-5 h-5 text-[#f5cf72] fill-[#f5cf72]" />
        <span className="text-xs font-bold text-[#f5cf72] hidden sm:inline">WhatsApp Us</span>
      </button>
    </div>
  );
};
