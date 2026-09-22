import React, { useState } from 'react';

interface ICGCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem-only' | 'horizontal';
  theme?: 'dark' | 'light' | 'gold';
  className?: string;
  forceWhite?: boolean;
}

export const ICGCLogo: React.FC<ICGCLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  className = '',
  forceWhite = true, // Default to pure white per user directive
}) => {
  const isLight = theme === 'light' && !forceWhite;
  const isGold = theme === 'gold' && !forceWhite;

  // Authentic pure white ICGC emblem assets for dark backgrounds
  const logoSrc = isLight
    ? '/church_logo_trimmed.png'
    : isGold
      ? '/church_logo_gold.png'
      : '/church_logo_white.png'; // Pure white emblem

  const [imageError, setImageError] = useState(false);

  // Exact 131:112 aspect ratio (524x448) dimensions to prevent ANY distortion
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          wrapper: 'h-8 w-[37.4px]',
          img: 'h-8 w-[37.4px]',
          title: 'text-sm font-bold',
          tagline: 'text-[8.5px]',
        };
      case 'lg':
        return {
          wrapper: 'h-12 w-[56.1px]',
          img: 'h-12 w-[56.1px]',
          title: 'text-xl font-bold',
          tagline: 'text-[11px]',
        };
      case 'xl':
        return {
          wrapper: 'h-16 w-[74.8px]',
          img: 'h-16 w-[74.8px]',
          title: 'text-2xl font-bold',
          tagline: 'text-[13px]',
        };
      case 'md':
      default:
        return {
          wrapper: 'h-10 w-[46.8px]',
          img: 'h-10 w-[46.8px]',
          title: 'text-base sm:text-lg font-bold',
          tagline: 'text-[9.5px]',
        };
    }
  };

  const dims = getDimensions();
  // Pure white fill for vector fallback
  const svgFill = isLight ? '#063c24' : isGold ? '#f5cf72' : '#ffffff';

  const emblem = (
    <div 
      className={`relative flex items-center justify-center shrink-0 select-none ${dims.wrapper}`}
      title="Wisdom Temple"
    >
      {!imageError ? (
        <img
          src={logoSrc}
          alt="Wisdom Temple Emblem"
          width={524}
          height={448}
          className={`${dims.img} aspect-[131/112] object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105`}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg 
          viewBox="0 0 120 100" 
          className="w-full h-full drop-shadow-sm transition-transform duration-200 group-hover:scale-105" 
          aria-hidden="true"
          fill="none"
        >
          <defs>
            <mask id="icgc-pillar-mask">
              <rect x="0" y="0" width="120" height="100" fill="#ffffff" />
              <circle cx="60" cy="52" r="18.2" fill="#000000" />
            </mask>
          </defs>

          {/* Back arc of the orbital ring (passes behind pillars) */}
          <path 
            d="M 20,73 A 40 11.5 0 0 1 100,73 A 31 6 0 0 0 29,73 Z" 
            fill={svgFill}
          />

          {/* The Four Foundational Apostolic Pillars (Acts 2:42) */}
          <g mask="url(#icgc-pillar-mask)" fill={svgFill}>
            {/* Pillar 1: Doctrine (Far Left) */}
            <rect x="41.5" y="38" width="7.6" height="33" rx="0.5" />
            {/* Pillar 2: Fellowship (Center Left) */}
            <rect x="51.3" y="31" width="7.6" height="44.5" rx="0.5" />
            {/* Pillar 3: Breaking of Bread (Center Right - Highest Peak) */}
            <rect x="61.1" y="22" width="7.6" height="49.5" rx="0.5" />
            {/* Pillar 4: Prayers (Far Right) */}
            <rect x="70.9" y="33.5" width="7.6" height="41.5" rx="0.5" />
          </g>

          {/* Front arc of the orbital ring (passes in front of pillars) */}
          <path 
            d="M 20,73 A 40 11.5 0 0 0 100,73 A 31 6 0 0 1 29,73 Z" 
            fill={svgFill}
          />

          {/* Central Globe Sphere */}
          <circle cx="60" cy="52" r="14.5" fill={svgFill} />
        </svg>
      )}
    </div>
  );

  if (variant === 'emblem-only') {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {emblem}
      <div className="flex flex-col justify-center">
        <span className={`${dims.title} tracking-tight font-serif-title ${isLight ? 'text-[#063c24]' : 'text-white'}`}>
          WISDOM TEMPLE
        </span>
        <span className={`${dims.tagline} tracking-wider uppercase font-semibold ${isLight ? 'text-[#0a5c37]' : 'text-white'}`}>
          Raising Leaders • Shaping Visions
        </span>
      </div>
    </div>
  );
};

