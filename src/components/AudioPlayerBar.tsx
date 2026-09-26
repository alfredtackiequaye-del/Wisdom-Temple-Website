import React, { useState, useRef, useEffect } from 'react';
import { Sermon } from '../types';
import { Play, Pause, X, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';

interface AudioPlayerBarProps {
  sermon: Sermon | null;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ sermon, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1800); // 30m simulated duration
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (sermon) {
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [sermon]);

  if (!sermon) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime(prev => Math.min(Math.max(0, prev + seconds), duration));
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-forest-950 border-t border-forest-700 text-white shadow-2xl px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Sermon Details */}
        <div className="flex items-center space-x-3 w-full md:w-1/3">
          <img
            src={sermon.thumbnail}
            alt={sermon.title}
            className="w-12 h-12 rounded-lg object-cover border border-forest-700 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate font-serif-title">{sermon.title}</h4>
            <p className="text-xs text-gold-300 truncate">{sermon.speaker}</p>
            <span className="text-[11px] text-emerald-300/80">{sermon.scripture}</span>
          </div>
        </div>

        {/* Player Controls & Scrubber */}
        <div className="flex flex-col items-center w-full md:w-2/5 space-y-1">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSkip(-15)}
              className="text-emerald-200/70 hover:text-white transition-colors cursor-pointer"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-forest-950" /> : <Play className="w-5 h-5 fill-forest-950 ml-0.5" />}
            </button>

            <button
              onClick={() => handleSkip(15)}
              className="text-emerald-200/70 hover:text-white transition-colors cursor-pointer"
              title="Fast forward 15 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={cyclePlaybackRate}
              className="px-2 py-0.5 rounded text-xs bg-forest-850 text-gold-300 font-semibold hover:bg-forest-800 border border-forest-700 cursor-pointer"
            >
              {playbackRate}x
            </button>
          </div>

          <div className="w-full flex items-center space-x-2 text-[11px] text-emerald-200/80">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1 bg-forest-850 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
            <span>{sermon.duration}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end space-x-4 w-full md:w-1/4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-emerald-200/70 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-xs px-2 py-1 bg-forest-850 text-gold-300 rounded border border-gold-500/40 font-medium">
            {sermon.category}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200/70 hover:text-white hover:bg-forest-850 transition-colors cursor-pointer"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
