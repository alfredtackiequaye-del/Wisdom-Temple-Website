import React from 'react';
import { Sermon } from '../types';
import { X, Calendar, User, BookOpen, Share2, Download, Youtube, ExternalLink } from 'lucide-react';

interface VideoModalProps {
  sermon: Sermon | null;
  onClose: () => void;
  onShare: (sermon: Sermon) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ sermon, onClose, onShare }) => {
  if (!sermon) return null;

  const youtubeWatchUrl = sermon.youtubeUrl || (sermon.videoEmbedUrl?.includes('/embed/') 
    ? `https://www.youtube.com/watch?v=${sermon.videoEmbedUrl.split('/embed/')[1].split('?')[0]}`
    : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#02180e]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#02180e] border border-[#084c2e] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#084c2e] bg-[#01120a] shrink-0">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#042819] text-[#f5cf72] border border-[#c99726]/40">
              {sermon.category}
            </span>
            <span className="text-xs text-emerald-200 font-mono hidden sm:inline">{sermon.series || 'Wisdom Broadcast'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-[#042819] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video bg-black shrink-0 w-full">
          {sermon.videoEmbedUrl ? (
            <iframe
              src={`${sermon.videoEmbedUrl}?autoplay=1&rel=0`}
              title={sermon.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={sermon.thumbnail} 
                alt={sermon.title}
                className="w-full h-full object-cover opacity-75" 
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#c99726] text-[#021a10] flex items-center justify-center shadow-lg mb-4">
                  <svg className="w-8 h-8 ml-1 fill-[#021a10]" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-xs font-mono text-[#f5cf72] uppercase tracking-widest mb-1">WISDOM TEMPLE STREAMING</p>
                <h3 className="text-xl md:text-2xl font-bold text-white max-w-lg font-serif-title">{sermon.title}</h3>
                <p className="text-xs text-emerald-200 mt-1 font-mono">Broadcast available on church official YouTube & audio feed</p>
              </div>
            </div>
          )}
        </div>

        {/* Sermon Details & Notes */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#084c2e]">
            <div>
              <h2 className="text-xl font-bold text-white font-serif-title">{sermon.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 mt-2">
                <div className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-[#c99726]" />
                  <span className="font-mono text-emerald-100">{sermon.speaker}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{sermon.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#c99726]" />
                  <span className="text-[#f5cf72] font-semibold">{sermon.scripture}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {youtubeWatchUrl && (
                <a
                  href={youtubeWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-red-950/70 hover:bg-red-900/80 text-red-200 text-xs font-semibold rounded-lg transition-colors border border-red-800/60"
                >
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3 h-3 text-red-400" />
                </a>
              )}

              <button
                onClick={() => onShare(sermon)}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#042819] hover:bg-[#063821] text-emerald-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#084c2e]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#c99726]" />
                <span>Share</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([`${sermon.title}\nScripture: ${sermon.scripture}\nSpeaker: ${sermon.speaker}\nDate: ${sermon.date}\nYouTube: ${youtubeWatchUrl || ''}\n\nSummary:\n${sermon.summary}`], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${sermon.title.toLowerCase().replace(/\s+/g, '-')}-outline.txt`;
                  a.click();
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#c99726] hover:bg-[#b8861d] text-[#021a10] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Study Notes</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">Message Summary</h4>
            <p className="text-sm text-emerald-100/90 leading-relaxed">{sermon.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
