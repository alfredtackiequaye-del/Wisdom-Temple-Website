import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  X, 
  Heart, 
  Users, 
  Flame, 
  Calendar, 
  Compass, 
  Headphones, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { PageId } from '../types';

interface QuickActionsMenuProps {
  onNavigate: (page: PageId, subTab?: string) => void;
}

interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  page: PageId;
  subTab?: string;
  badge?: string;
  bgClass: string;
  iconColor: string;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const quickActions: QuickActionItem[] = [
    {
      id: 'give',
      title: 'Give Online',
      description: 'Tithes, offerings & MoMo payment details',
      icon: Heart,
      page: 'give',
      badge: 'First Fruits',
      bgClass: 'bg-[#c99726]/15',
      iconColor: 'text-[#dfb15b]',
    },
    {
      id: 'prayer',
      title: 'Request Prayer',
      description: 'Confidential prayer with pastoral team',
      icon: Flame,
      page: 'prayer',
      badge: '24/7 Altar',
      bgClass: 'bg-emerald-950/60',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'ministries',
      title: 'Join a Ministry',
      description: 'Discover departments & serve with joy',
      icon: Users,
      page: 'ministries',
      badge: 'Volunteer',
      bgClass: 'bg-blue-950/60',
      iconColor: 'text-blue-400',
    },
    {
      id: 'new-here',
      title: 'Plan Your Visit',
      description: "First time at Wisdom Temple? We'll welcome you",
      icon: Compass,
      page: 'new-here',
      badge: "I'm New",
      bgClass: 'bg-amber-950/60',
      iconColor: 'text-amber-400',
    },
    {
      id: 'watch-listen',
      title: 'Watch & Listen',
      description: 'Recent sermons, video messages & podcasts',
      icon: Headphones,
      page: 'watch-listen',
      bgClass: 'bg-teal-950/60',
      iconColor: 'text-emerald-300',
    },
    {
      id: 'events',
      title: 'Upcoming Events',
      description: 'Wisdom Summit & worship calendar',
      icon: Calendar,
      page: 'events',
      bgClass: 'bg-purple-950/60',
      iconColor: 'text-purple-300',
    },
  ];

  const handleActionClick = (page: PageId, subTab?: string) => {
    onNavigate(page, subTab);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={menuRef} className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 w-80 sm:w-96 bg-[#02180e]/98 backdrop-blur-xl border border-[#c99726]/40 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-white"
          >
            {/* Header */}
            <div className="bg-[#032014] px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#c99726]/20 border border-[#c99726]/50 flex items-center justify-center text-[#dfb15b]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">Quick Actions</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#c99726]/20 text-[#dfb15b] border border-[#c99726]/30">
                      Wisdom Temple
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/70">One-click access to common tasks</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="p-2.5 space-y-1.5 max-h-[380px] overflow-y-auto custom-scrollbar">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.page, action.subTab)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#032014]/60 hover:bg-[#053521] border border-transparent hover:border-white/10 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${action.bgClass} border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <IconComponent className={`w-4 h-4 ${action.iconColor}`} />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white group-hover:text-[#f5cf72] transition-colors">
                            {action.title}
                          </span>
                          {action.badge && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-[#c99726]/20 text-[#f5cf72] border border-[#c99726]/30">
                              {action.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-200/65 truncate">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-500/60 group-hover:text-[#f5cf72] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>

            {/* Footer info strip */}
            <div className="px-4 py-2.5 bg-[#01140b] border-t border-[#084c2e] flex items-center justify-between text-[10px] text-emerald-300/70">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#c99726]" />
                <span>Sunday Worship at 8:00 AM</span>
              </span>
              <span className="text-emerald-400/50">Star Junction, Tabora</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-3 rounded-full shadow-2xl transition-all cursor-pointer border ${
          isOpen
            ? 'bg-[#c99726] text-[#02180e] border-[#f5cf72] shadow-[#c99726]/40'
            : 'bg-[#032416] text-white border-[#c99726]/60 hover:border-[#f5cf72] shadow-black/80 hover:bg-[#04331f]'
        }`}
        aria-expanded={isOpen}
        aria-label="Toggle Quick Actions Menu"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isOpen ? 'bg-[#02180e]/15 text-[#02180e]' : 'bg-[#c99726]/20 text-[#f5cf72]'
        }`}>
          {isOpen ? <X className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
        </div>
        <span className="text-xs font-bold tracking-wide">
          {isOpen ? 'Close' : 'Quick Actions'}
        </span>
        {!isOpen && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5cf72] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e5b138]"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
