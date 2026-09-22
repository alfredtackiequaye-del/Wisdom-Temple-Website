import React, { useState, useEffect, useRef } from 'react';
import { Type, Check, ChevronDown, Sparkles } from 'lucide-react';
import { FontTheme } from '../types';

interface FontThemeOption {
  id: FontTheme;
  name: string;
  subtitle: string;
  headingFont: string;
  bodyFont: string;
  sampleText: string;
  tag: string;
}

export const FONT_OPTIONS: FontThemeOption[] = [
  {
    id: 'modern',
    name: 'Modern Contemporary',
    subtitle: 'Outfit & Plus Jakarta Sans (Sleek, High-Impact Church)',
    headingFont: 'Outfit Bold',
    bodyFont: 'Plus Jakarta Sans',
    sampleText: 'Experience God • Trust His Word • Follow His Lead',
    tag: 'Legacy Hills Style'
  },
  {
    id: 'cinzel',
    name: 'Majestic Imperial',
    subtitle: 'Sacred Reverence & Classical Altar',
    headingFont: 'Cinzel',
    bodyFont: 'Outfit',
    sampleText: 'Raising Leaders, Shaping Visions',
    tag: 'Traditional Classical'
  },
  {
    id: 'playfair',
    name: 'Pastoral Elegance',
    subtitle: 'Warm Editorial & Devotional',
    headingFont: 'Playfair Display',
    bodyFont: 'Outfit',
    sampleText: 'Wisdom Temple Charismatic Altar',
    tag: 'Warm & Literary'
  },
  {
    id: 'cormorant',
    name: 'Cathedral Heritage',
    subtitle: 'Classical Liturgical Grace',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Outfit',
    sampleText: 'Unto Him Be Glory In The Church',
    tag: 'Classic Hymnal'
  }
];

interface FontThemeSelectorProps {
  currentTheme: FontTheme;
  onThemeChange: (theme: FontTheme) => void;
  variant?: 'navbar' | 'floating' | 'banner';
}

export const FontThemeSelector: React.FC<FontThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  variant = 'navbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = FONT_OPTIONS.find((opt) => opt.id === currentTheme) || FONT_OPTIONS[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      {variant === 'navbar' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#063821] hover:bg-[#07472c] text-emerald-100 hover:text-white border border-[#c99726]/40 text-xs font-semibold transition-all cursor-pointer shadow-sm group"
          title="Change Church Website Typography Pairing"
          aria-label="Typography Font Switcher"
        >
          <Type className="w-3.5 h-3.5 text-[#f5cf72] group-hover:rotate-12 transition-transform" />
          <span className="hidden xl:inline text-[11px] font-mono tracking-wider text-[#f5cf72]">
            FONT:
          </span>
          <span className="text-[11px] font-medium truncate max-w-[100px] text-white">
            {activeOption.headingFont}
          </span>
          <ChevronDown className={`w-3 h-3 text-[#f5cf72] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#02180e] hover:bg-[#07472c] text-white border border-[#c99726]/50 shadow-xl transition-all cursor-pointer backdrop-blur-md"
        >
          <Type className="w-4 h-4 text-[#f5cf72]" />
          <div className="text-left">
            <div className="text-[9px] font-mono uppercase text-[#f5cf72] font-bold">Typography</div>
            <div className="text-xs font-bold leading-tight">{activeOption.name}</div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-[#f5cf72] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#032014] text-white shadow-2xl border border-[#c99726]/40 z-50 p-3 space-y-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 pt-1 pb-2 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#f5cf72] uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>PREMIUM FONT PAIRINGS</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Select your preferred typographical aesthetic for Wisdom Temple.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto scrollbar-none">
            {FONT_OPTIONS.map((option) => {
              const isSelected = option.id === currentTheme;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    onThemeChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border cursor-pointer flex flex-col justify-between space-y-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#07472c] to-[#042819] border-[#c99726] shadow-md ring-1 ring-[#c99726]/50'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">
                        {option.name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                        isSelected 
                          ? 'bg-[#c99726] text-[#02180e]' 
                          : 'bg-white/10 text-emerald-300'
                      }`}>
                        {option.tag}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#f5cf72] shrink-0" />
                    )}
                  </div>

                  <div className="text-[11px] text-slate-300">
                    <span className="font-semibold text-[#f5cf72]">{option.headingFont}</span>
                    <span className="text-white/40 mx-1.5">+</span>
                    <span>{option.bodyFont}</span>
                    <span className="text-white/40 mx-1.5">•</span>
                    <span className="text-emerald-200/70">{option.subtitle}</span>
                  </div>

                  {/* Visual Preview Sample */}
                  <div 
                    className="p-2 rounded-lg bg-black/40 border border-white/5 text-sm tracking-tight text-white/95"
                    style={{ 
                      fontFamily: option.id === 'cinzel' 
                        ? 'Cinzel, serif' 
                        : option.id === 'playfair' 
                        ? 'Playfair Display, serif' 
                        : option.id === 'cormorant' 
                        ? 'Cormorant Garamond, serif' 
                        : 'Outfit, sans-serif'
                    }}
                  >
                    "{option.sampleText}"
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-200/60 font-mono">
            <span>Dynamic real-time preview</span>
            <span>Saved to browser preference</span>
          </div>
        </div>
      )}
    </div>
  );
};
