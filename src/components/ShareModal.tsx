import React, { useState } from 'react';
import { X, Check, Copy, Share2, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, description }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `${title} - Wisdom Temple. ${description}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-forest-950 border border-forest-700 rounded-2xl p-6 shadow-2xl space-y-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gold-300">
            <Share2 className="w-5 h-5 text-gold-500" />
            <h3 className="text-lg font-bold text-white font-serif-title">Share Content</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-forest-850 rounded-xl border border-forest-700">
          <h4 className="text-sm font-semibold text-white font-serif-title">{title}</h4>
          <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">{description}</p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={shareToWhatsApp}
            className="w-full py-2.5 px-4 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-xl flex items-center justify-center space-x-2 text-sm shadow transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full py-2.5 px-4 bg-forest-850 hover:bg-forest-800 text-emerald-100 font-semibold rounded-xl flex items-center justify-center space-x-2 text-sm transition-all cursor-pointer border border-forest-700"
          >
            {copied ? <Check className="w-4 h-4 text-gold-300" /> : <Copy className="w-4 h-4 text-gold-500" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Link to Share'}</span>
          </button>
        </div>

        <div className="pt-2 text-center text-[11px] text-emerald-300/70">
          Official Media • Wisdom Temple Ghana
        </div>
      </div>
    </div>
  );
};
