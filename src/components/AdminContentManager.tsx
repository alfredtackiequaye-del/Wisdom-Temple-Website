import React, { useState, useRef } from 'react';
import { SiteContentConfig, ContentSectionId, PageId } from '../types';
import { 
  useSiteContent, 
  DEFAULT_SITE_CONTENT,
  exportContentJson,
  importContentJson 
} from '../utils/contentManager';
import { 
  Edit3, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  Layers,
  FileText,
  Home,
  User,
  Compass,
  MapPin,
  Clock,
  DollarSign,
  AlignLeft,
  X
} from 'lucide-react';

interface FieldSpec {
  key: keyof SiteContentConfig;
  label: string;
  category: ContentSectionId;
  location: string;
  type: 'text' | 'textarea' | 'paragraph-array';
  rows?: number;
  hint?: string;
}

const FIELD_SPECS: FieldSpec[] = [
  // --- Hero & Homepage ---
  {
    key: 'heroEyebrow',
    label: 'Hero Top Badge / Service Times',
    category: 'hero',
    location: 'Homepage Top Hero Banner (Pill Badge)',
    type: 'text',
    hint: 'Short prominent service hours at the top of the hero banner.'
  },
  {
    key: 'heroHeadline',
    label: 'Hero Main Headline / Mandate',
    category: 'hero',
    location: 'Homepage Hero Central Headline (H1)',
    type: 'textarea',
    rows: 2,
    hint: 'The primary central declaration of the church.'
  },
  {
    key: 'heroSubtitle',
    label: 'Hero Welcoming Subtitle',
    category: 'hero',
    location: 'Homepage Hero Subtitle below Headline',
    type: 'textarea',
    rows: 2,
    hint: 'Welcoming explanation text beneath the main headline.'
  },
  {
    key: 'heroButtonPrimary',
    label: 'Hero Primary Button Text',
    category: 'hero',
    location: 'Homepage Hero Gold CTA Button',
    type: 'text',
  },
  {
    key: 'heroButtonSecondary',
    label: 'Hero Secondary Button Text',
    category: 'hero',
    location: 'Homepage Hero Glassmorphism CTA Button',
    type: 'text',
  },
  {
    key: 'experienceSectionBadge',
    label: 'Experience Section Badge',
    category: 'hero',
    location: 'Homepage 3-Step Experience Header Badge',
    type: 'text',
  },
  {
    key: 'experienceSectionTitle',
    label: 'Experience Section Title',
    category: 'hero',
    location: 'Homepage 3-Step Experience Main Title',
    type: 'text',
  },
  {
    key: 'experienceSectionSubtitle',
    label: 'Experience Section Subtitle',
    category: 'hero',
    location: 'Homepage 3-Step Experience Subtitle',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'experienceMod1Title',
    label: 'Module 1 Title (In-Person)',
    category: 'hero',
    location: 'Homepage Experience Card 1',
    type: 'text',
  },
  {
    key: 'experienceMod1Desc',
    label: 'Module 1 Description (In-Person)',
    category: 'hero',
    location: 'Homepage Experience Card 1 Body',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'experienceMod2Title',
    label: 'Module 2 Title (Watch on Demand)',
    category: 'hero',
    location: 'Homepage Experience Card 2',
    type: 'text',
  },
  {
    key: 'experienceMod2Desc',
    label: 'Module 2 Description (Watch on Demand)',
    category: 'hero',
    location: 'Homepage Experience Card 2 Body',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'experienceMod3Title',
    label: 'Module 3 Title (The Secret Place)',
    category: 'hero',
    location: 'Homepage Experience Card 3',
    type: 'text',
  },
  {
    key: 'experienceMod3Desc',
    label: 'Module 3 Description (The Secret Place)',
    category: 'hero',
    location: 'Homepage Experience Card 3 Body',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'firstTimeVisitorEyebrow',
    label: 'First-Time Visitor Badge',
    category: 'hero',
    location: 'Homepage Visitor Welcome Section Badge',
    type: 'text',
  },
  {
    key: 'firstTimeVisitorTitle',
    label: 'First-Time Visitor Title',
    category: 'hero',
    location: 'Homepage Visitor Welcome Title',
    type: 'text',
  },
  {
    key: 'firstTimeVisitorDesc',
    label: 'First-Time Visitor Welcome Paragraph',
    category: 'hero',
    location: 'Homepage Visitor Welcome Lead Paragraph',
    type: 'textarea',
    rows: 3,
  },

  // --- Pastoral Leadership & Pastor's Desk ---
  {
    key: 'pastorName',
    label: 'Senior Minister / Shepherd Name',
    category: 'pastoral',
    location: 'Pastor\'s Desk, About Us & Header Profile',
    type: 'text',
  },
  {
    key: 'pastorTitle',
    label: 'Senior Minister Official Title',
    category: 'pastoral',
    location: 'Pastor\'s Desk & Leadership Section',
    type: 'text',
  },
  {
    key: 'firstLadyName',
    label: 'First Lady Name',
    category: 'pastoral',
    location: 'Leadership Profiles & About Section',
    type: 'text',
  },
  {
    key: 'firstLadyTitle',
    label: 'First Lady Official Title',
    category: 'pastoral',
    location: 'Leadership Profiles & About Section',
    type: 'text',
  },
  {
    key: 'combinedPastoralTitle',
    label: 'Combined Pastoral Couple Title',
    category: 'pastoral',
    location: 'Pastoral Photo Cards & Lightboxes',
    type: 'text',
  },
  {
    key: 'pastoralTheme',
    label: 'Weekly Pastoral Theme / Title',
    category: 'pastoral',
    location: 'Pastor\'s Corner Headline & Share Quote',
    type: 'text',
    hint: 'Theme of the current week from the Shepherd\'s desk.'
  },
  {
    key: 'pastoralScripture',
    label: 'Weekly Pastoral Scripture Quote',
    category: 'pastoral',
    location: 'Pastor\'s Corner Gold Scripture Block',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'pastoralDateLabel',
    label: 'Weekly Charge Date Label / Badge',
    category: 'pastoral',
    location: 'Pastor\'s Corner Top Metadata',
    type: 'text',
  },
  {
    key: 'pastoralGreetingSummary',
    label: 'Pastoral Greeting Summary (Card Excerpt)',
    category: 'pastoral',
    location: 'Pastor\'s Corner Home Card Preview',
    type: 'textarea',
    rows: 3,
  },
  {
    key: 'pastoralFullMessage',
    label: 'Pastoral Full Weekly Message (Multi-Paragraphs)',
    category: 'pastoral',
    location: 'Pastor\'s Corner Full Message Modal',
    type: 'paragraph-array',
    hint: 'Each paragraph appears formatted in the popup reader modal.'
  },
  {
    key: 'pastoralBio',
    label: 'Pastoral Couple Bio & Ministry Mandate',
    category: 'pastoral',
    location: 'About View Leadership Profile',
    type: 'textarea',
    rows: 4,
  },

  // --- Church Identity & Contacts ---
  {
    key: 'churchName',
    label: 'Official Church Name',
    category: 'church_info',
    location: 'Header Logo, Page Meta & Footer',
    type: 'text',
  },
  {
    key: 'churchTagline',
    label: 'Church Tagline / Slogan',
    category: 'church_info',
    location: 'Header, Mobile Drawer & Footer',
    type: 'text',
  },
  {
    key: 'churchDescription',
    label: 'General Church Description',
    category: 'church_info',
    location: 'About Header, Meta & SEO',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'churchAddress',
    label: 'Physical Address / Location',
    category: 'church_info',
    location: 'Contact Page, Footer & Direction Cards',
    type: 'text',
  },
  {
    key: 'churchLandmark',
    label: 'Nearest Landmark',
    category: 'church_info',
    location: 'Contact Directions & Visit Guide',
    type: 'text',
  },
  {
    key: 'churchPhone',
    label: 'Official Phone Helpline',
    category: 'church_info',
    location: 'Top Bar, Footer, Contact Page',
    type: 'text',
  },
  {
    key: 'churchWhatsApp',
    label: 'WhatsApp Helpline Number',
    category: 'church_info',
    location: 'Floating WhatsApp Widget & Contacts',
    type: 'text',
  },
  {
    key: 'churchEmail',
    label: 'Official Secretariat Email',
    category: 'church_info',
    location: 'Footer & Contact View',
    type: 'text',
  },
  {
    key: 'officeHours',
    label: 'Secretariat Office Hours',
    category: 'church_info',
    location: 'Footer & Contact View',
    type: 'text',
  },
  {
    key: 'socialYoutube',
    label: 'YouTube Channel Link',
    category: 'church_info',
    location: 'Footer & Social Buttons',
    type: 'text',
  },
  {
    key: 'socialFacebook',
    label: 'Facebook Page Link',
    category: 'church_info',
    location: 'Footer & Social Buttons',
    type: 'text',
  },
  {
    key: 'socialInstagram',
    label: 'Instagram Page Link',
    category: 'church_info',
    location: 'Footer & Social Buttons',
    type: 'text',
  },
  {
    key: 'socialTiktok',
    label: 'TikTok Profile Link',
    category: 'church_info',
    location: 'Footer & Social Buttons',
    type: 'text',
  },

  // --- About Us & Mandate ---
  {
    key: 'aboutHeadline',
    label: 'About Page Top Header',
    category: 'about',
    location: 'About View Banner Title',
    type: 'text',
  },
  {
    key: 'aboutWhoWeAre1',
    label: 'Who We Are — Paragraph 1',
    category: 'about',
    location: 'About View "Who We Are" Tab',
    type: 'textarea',
    rows: 3,
  },
  {
    key: 'aboutWhoWeAre2',
    label: 'Who We Are — Paragraph 2',
    category: 'about',
    location: 'About View "Who We Are" Tab',
    type: 'textarea',
    rows: 3,
  },
  {
    key: 'aboutVisionTitle',
    label: 'Vision Statement Title',
    category: 'about',
    location: 'About View Vision Card',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'aboutVisionText',
    label: 'Vision Statement Detailed Text',
    category: 'about',
    location: 'About View Vision Card Description',
    type: 'textarea',
    rows: 3,
  },
  {
    key: 'aboutMissionTitle',
    label: 'Mission Statement Title',
    category: 'about',
    location: 'About View Mission Card',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'aboutMissionText',
    label: 'Mission Statement Detailed Text',
    category: 'about',
    location: 'About View Mission Card Description',
    type: 'textarea',
    rows: 3,
  },
  {
    key: 'pillar1Title',
    label: 'Pillar 1 Title',
    category: 'about',
    location: 'About View Three Pillars Block',
    type: 'text',
  },
  {
    key: 'pillar1Desc',
    label: 'Pillar 1 Description',
    category: 'about',
    location: 'About View Three Pillars Block',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'pillar2Title',
    label: 'Pillar 2 Title',
    category: 'about',
    location: 'About View Three Pillars Block',
    type: 'text',
  },
  {
    key: 'pillar2Desc',
    label: 'Pillar 2 Description',
    category: 'about',
    location: 'About View Three Pillars Block',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'pillar3Title',
    label: 'Pillar 3 Title',
    category: 'about',
    location: 'About View Three Pillars Block',
    type: 'text',
  },
  {
    key: 'pillar3Desc',
    label: 'Pillar 3 Description',
    category: 'about',
    location: 'About View Three Pillars Block',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'heritageStoryHeadline',
    label: 'Heritage & Story Headline',
    category: 'about',
    location: 'About View Story & Heritage Tab',
    type: 'text',
  },
  {
    key: 'heritageStoryText1',
    label: 'Heritage Story — Foundational Philosophy',
    category: 'about',
    location: 'About View Story & Heritage Tab',
    type: 'textarea',
    rows: 3,
  },
  {
    key: 'heritageStoryText2',
    label: 'Heritage Story — Building for Generations',
    category: 'about',
    location: 'About View Story & Heritage Tab',
    type: 'textarea',
    rows: 3,
  },
  {
    key: 'churchCouncilHeadline',
    label: 'Church Council Section Headline',
    category: 'about',
    location: 'About View Governance Header',
    type: 'text',
  },
  {
    key: 'churchCouncilDesc',
    label: 'Church Council Description',
    category: 'about',
    location: 'About View Governance Card Body',
    type: 'textarea',
    rows: 2,
  },

  // --- Services & Schedules ---
  {
    key: 'sundayServiceName',
    label: 'Sunday Service Official Name',
    category: 'services',
    location: 'Home, About, Services & Footer',
    type: 'text',
  },
  {
    key: 'sundayServiceTime',
    label: 'Sunday Service Time',
    category: 'services',
    location: 'Home, About, Services & Footer',
    type: 'text',
  },
  {
    key: 'sundayServiceDay',
    label: 'Sunday Service Day / Frequency',
    category: 'services',
    location: 'Schedule Cards',
    type: 'text',
  },
  {
    key: 'sundayServiceDesc',
    label: 'Sunday Service Summary',
    category: 'services',
    location: 'Services Schedule Breakdown',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'midweekServiceName',
    label: 'Midweek Service Official Name',
    category: 'services',
    location: 'Home, About, Services & Prayer Page',
    type: 'text',
  },
  {
    key: 'midweekServiceSubtitle',
    label: 'Midweek Service Subtitle',
    category: 'services',
    location: 'The Secret Place Headers',
    type: 'text',
  },
  {
    key: 'midweekServiceTime',
    label: 'Midweek Service Time',
    category: 'services',
    location: 'Home, Schedule & Prayer Page',
    type: 'text',
  },
  {
    key: 'midweekServiceDay',
    label: 'Midweek Service Day',
    category: 'services',
    location: 'Schedule Cards',
    type: 'text',
  },
  {
    key: 'midweekServiceDesc',
    label: 'Midweek Service Summary',
    category: 'services',
    location: 'Schedule & Prayer Page',
    type: 'textarea',
    rows: 2,
  },

  // --- Giving & Finances ---
  {
    key: 'givingHeadline',
    label: 'Giving Section Headline',
    category: 'giving',
    location: 'Give Online View Header',
    type: 'text',
  },
  {
    key: 'givingScriptureText',
    label: 'Giving Biblical Scripture Quote',
    category: 'giving',
    location: 'Give View Scripture Box',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'givingInstructions',
    label: 'Giving Instructions & Notice',
    category: 'giving',
    location: 'Give View Payment Cards Header',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'givingMomoMtn',
    label: 'MTN Mobile Money (MoMo) Number',
    category: 'giving',
    location: 'Give Online & Quick Action Dialogs',
    type: 'text',
  },
  {
    key: 'givingMomoTelecel',
    label: 'Telecel Cash Instructions',
    category: 'giving',
    location: 'Give Online Payment Cards',
    type: 'text',
  },
  {
    key: 'givingMomoAt',
    label: 'AT Money Instructions',
    category: 'giving',
    location: 'Give Online Payment Cards',
    type: 'text',
  },
  {
    key: 'givingMomoAccountName',
    label: 'MoMo Registered Account Name',
    category: 'giving',
    location: 'Give Online Payment Cards & Receipt',
    type: 'text',
  },
  {
    key: 'givingBankName',
    label: 'Church Bank Name',
    category: 'giving',
    location: 'Give Online Bank Card',
    type: 'text',
  },
  {
    key: 'givingBankAccountNumber',
    label: 'Bank Account Number',
    category: 'giving',
    location: 'Give Online Bank Card & Copy Button',
    type: 'text',
  },
  {
    key: 'givingBankAccountName',
    label: 'Bank Registered Account Name',
    category: 'giving',
    location: 'Give Online Bank Card',
    type: 'text',
  },
  {
    key: 'givingBankBranch',
    label: 'Full Bank Details String',
    category: 'giving',
    location: 'Give Online Detailed Bank Section',
    type: 'text',
  },

  // --- Footer & Bulletin ---
  {
    key: 'bulletinEyebrow',
    label: 'Bulletin Bar Top Eyebrow',
    category: 'footer',
    location: 'Footer Newsletter Top Label',
    type: 'text',
  },
  {
    key: 'bulletinTitle',
    label: 'Bulletin Bar Main Title',
    category: 'footer',
    location: 'Footer Newsletter Headline',
    type: 'text',
  },
  {
    key: 'bulletinDescription',
    label: 'Bulletin Bar Description',
    category: 'footer',
    location: 'Footer Newsletter Body Text',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'footerConnectDescription',
    label: 'Footer Connect Column Description',
    category: 'footer',
    location: 'Footer Column 1 Under Socials',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'footerCopyrightNotice',
    label: 'Footer Copyright Notice',
    category: 'footer',
    location: 'Bottom Footer Bar',
    type: 'text',
  },
];

const CATEGORY_TABS: { id: ContentSectionId | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Writings', icon: Layers },
  { id: 'hero', label: 'Homepage & Hero', icon: Home },
  { id: 'pastoral', label: 'Pastoral Desk & Bio', icon: User },
  { id: 'about', label: 'About & Mandate', icon: Compass },
  { id: 'church_info', label: 'Church & Contacts', icon: MapPin },
  { id: 'services', label: 'Services & Gatherings', icon: Clock },
  { id: 'giving', label: 'Giving & MoMo Accounts', icon: DollarSign },
  { id: 'footer', label: 'Footer & Bulletin', icon: AlignLeft },
];

interface AdminContentManagerProps {
  onNavigate?: (page: PageId, subTab?: string) => void;
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({ onNavigate }) => {
  const { content, updateField, resetField, resetAll, saveAll } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<ContentSectionId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewField, setPreviewField] = useState<FieldSpec | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Local editable buffer so typing feels immediate
  const [formValues, setFormValues] = useState<SiteContentConfig>(content);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formValues if external content changes
  React.useEffect(() => {
    setFormValues(content);
  }, [content]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFieldChange = (key: keyof SiteContentConfig, value: any) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveField = (key: keyof SiteContentConfig) => {
    updateField(key, formValues[key]);
    showToast(`✓ Saved "${key}" successfully!`);
  };

  const handleSaveAllSection = (cat: ContentSectionId | 'all') => {
    saveAll(formValues);
    showToast(`✓ All changes saved and published across the website!`);
  };

  const handleResetSingleField = (spec: FieldSpec) => {
    const defaultValue = DEFAULT_SITE_CONTENT[spec.key];
    setFormValues(prev => ({ ...prev, [spec.key]: defaultValue }));
    resetField(spec.key);
    showToast(`↺ Reset "${spec.label}" back to church default.`);
  };

  const handleResetAllDefaults = () => {
    if (window.confirm('Are you sure you want to reset ALL writings, text, and copy across the entire church website back to original defaults?')) {
      resetAll();
      setFormValues(DEFAULT_SITE_CONTENT);
      showToast('↺ All site copy and writings have been restored to defaults.');
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast('Copied to clipboard!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importContentJson(content);
        if (success) {
          showToast('✓ Successfully imported site writings from backup!');
        } else {
          showToast('⚠️ Failed to parse backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filtered fields
  const filteredFields = FIELD_SPECS.filter(spec => {
    const matchesCat = selectedCategory === 'all' || spec.category === selectedCategory;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const currentVal = Array.isArray(formValues[spec.key])
      ? (formValues[spec.key] as string[]).join(' ')
      : String(formValues[spec.key] || '');
    return (
      spec.label.toLowerCase().includes(q) ||
      spec.key.toLowerCase().includes(q) ||
      spec.location.toLowerCase().includes(q) ||
      currentVal.toLowerCase().includes(q)
    );
  });

  // Calculate modified count
  const modifiedCount = FIELD_SPECS.filter(spec => {
    const cur = JSON.stringify(content[spec.key]);
    const def = JSON.stringify(DEFAULT_SITE_CONTENT[spec.key]);
    return cur !== def;
  }).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-900 text-gold-300 border-2 border-gold-500 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-gold-300" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for JSON Backup Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json" 
        className="hidden" 
      />

      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950 rounded-3xl p-6 sm:p-8 border border-forest-700 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-300 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-gold-300 uppercase tracking-widest bg-forest-850 px-3 py-1 rounded-full border border-gold-500/40">
                CHURCH CONTENT & WRITINGS MANAGER
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title tracking-tight text-white">
              Edit & Update Website Text & Copy
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              Instantly customize every write-up on the website — from the hero headlines and pastoral weekly charge to About Us pillars, service times, giving guidelines, and footer notes. All changes update in real time.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleSaveAllSection(selectedCategory)}
              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-forest-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-102"
              title="Save all changes currently edited"
            >
              <Save className="w-4 h-4" />
              <span>Save All Published Text</span>
            </button>

            <button
              onClick={exportContentJson}
              className="px-3.5 py-2.5 bg-forest-850 hover:bg-forest-800 text-emerald-200 hover:text-white border border-forest-700 hover:border-gold-500/50 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Download full JSON backup of all text"
            >
              <Download className="w-3.5 h-3.5 text-gold-300" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2.5 bg-forest-850 hover:bg-forest-800 text-emerald-200 hover:text-white border border-forest-700 hover:border-gold-500/50 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Upload previously exported JSON backup"
            >
              <Upload className="w-3.5 h-3.5 text-gold-300" />
              <span>Import Backup</span>
            </button>

            <button
              onClick={handleResetAllDefaults}
              className="px-3.5 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Reset all writings back to original church text"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* Quick Stats & Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-forest-700/70 text-xs">
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-700/60">
            <span className="text-emerald-400 font-mono text-[11px] block">Total Editable Fields</span>
            <span className="text-lg font-bold text-white font-mono">{FIELD_SPECS.length} Fields</span>
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-700/60">
            <span className="text-emerald-400 font-mono text-[11px] block">Customized Text</span>
            <span className="text-lg font-bold text-gold-300 font-mono">{modifiedCount} Modified</span>
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-700/60">
            <span className="text-emerald-400 font-mono text-[11px] block">Sync Mode</span>
            <span className="text-lg font-bold text-emerald-300 font-mono">Live Reactive</span>
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-700/60">
            <span className="text-emerald-400 font-mono text-[11px] block">Storage Engine</span>
            <span className="text-lg font-bold text-white font-mono">Persistent Local</span>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-mist-300 shadow-xs space-y-4">
        {/* Category Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            const count = tab.id === 'all' 
              ? FIELD_SPECS.length 
              : FIELD_SPECS.filter(s => s.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-forest-900 text-gold-300 shadow-xs ring-1 ring-gold-500'
                    : 'text-slate-600 hover:bg-mist-100 hover:text-forest-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-forest-800 text-gold-300' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search writings by title, field name, placement, or content text..."
            className="w-full pl-9 pr-4 py-2.5 bg-mist-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-forest-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-4">
        {filteredFields.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-mist-300 space-y-3">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No matching writings found</h4>
            <p className="text-xs text-slate-500">Try refining your search keyword or switch to another section.</p>
          </div>
        ) : (
          filteredFields.map((spec) => {
            const currentValue = formValues[spec.key];
            const defaultValue = DEFAULT_SITE_CONTENT[spec.key];
            const isModified = JSON.stringify(content[spec.key]) !== JSON.stringify(defaultValue);
            const hasUnsavedChanges = JSON.stringify(formValues[spec.key]) !== JSON.stringify(content[spec.key]);
            const strLength = Array.isArray(currentValue) 
              ? (currentValue as string[]).join('\n\n').length 
              : String(currentValue || '').length;

            return (
              <div
                key={spec.key}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-xs space-y-4 ${
                  hasUnsavedChanges
                    ? 'border-gold-500 ring-1 ring-gold-500/40 bg-amber-50/20'
                    : isModified
                    ? 'border-forest-700/30'
                    : 'border-mist-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-forest-900 font-serif-title">
                        {spec.label}
                      </h3>
                      {isModified && (
                        <span className="text-[10px] font-mono font-bold bg-mist-100 text-forest-700 px-2 py-0.5 rounded-full border border-mist-400">
                          Customized
                        </span>
                      )}
                      {hasUnsavedChanges && (
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                          Unsaved Changes
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="font-mono text-forest-700 font-bold">Placement:</span>
                      <span>{spec.location}</span>
                    </div>
                  </div>

                  {/* Top Right Controls */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {strLength} chars
                    </span>

                    <button
                      onClick={() => handleCopyText(
                        Array.isArray(currentValue) ? (currentValue as string[]).join('\n\n') : String(currentValue),
                        spec.key
                      )}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="Copy text to clipboard"
                    >
                      {copiedKey === spec.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isModified && (
                      <button
                        onClick={() => handleResetSingleField(spec)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                        title="Restore original church default"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Default</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Input Editor */}
                <div>
                  {spec.type === 'text' && (
                    <input
                      type="text"
                      value={currentValue as string || ''}
                      onChange={(e) => handleFieldChange(spec.key, e.target.value)}
                      className="w-full px-4 py-2.5 bg-mist-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-forest-700 focus:bg-white transition-all"
                    />
                  )}

                  {spec.type === 'textarea' && (
                    <textarea
                      rows={spec.rows || 3}
                      value={currentValue as string || ''}
                      onChange={(e) => handleFieldChange(spec.key, e.target.value)}
                      className="w-full px-4 py-2.5 bg-mist-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-forest-700 focus:bg-white transition-all leading-relaxed"
                    />
                  )}

                  {spec.type === 'paragraph-array' && (
                    <div className="space-y-3">
                      {(currentValue as string[] || []).map((paragraph, pIdx) => (
                        <div key={pIdx} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>Paragraph {pIdx + 1}</span>
                            {(currentValue as string[]).length > 1 && (
                              <button
                                onClick={() => {
                                  const updated = (currentValue as string[]).filter((_, i) => i !== pIdx);
                                  handleFieldChange(spec.key, updated);
                                }}
                                className="text-red-600 hover:text-red-800 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove Paragraph</span>
                              </button>
                            )}
                          </div>
                          <textarea
                            rows={3}
                            value={paragraph}
                            onChange={(e) => {
                              const updated = [...(currentValue as string[])];
                              updated[pIdx] = e.target.value;
                              handleFieldChange(spec.key, updated);
                            }}
                            className="w-full px-4 py-2.5 bg-mist-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-forest-700 focus:bg-white transition-all leading-relaxed"
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const updated = [...(currentValue as string[] || []), 'New paragraph text...'];
                          handleFieldChange(spec.key, updated);
                        }}
                        className="px-3 py-1.5 bg-mist-100 hover:bg-mist-200 text-forest-700 font-bold text-xs rounded-lg border border-mist-400 flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Paragraph</span>
                      </button>
                    </div>
                  )}

                  {spec.hint && (
                    <p className="text-[11px] text-slate-500 mt-1.5 italic flex items-center space-x-1">
                      <Info className="w-3 h-3 text-gold-500 shrink-0 inline mr-1" />
                      <span>{spec.hint}</span>
                    </p>
                  )}
                </div>

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Key: <code className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{spec.key}</code>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreviewField(spec)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleSaveField(spec.key)}
                      className="px-4 py-1.5 bg-forest-900 hover:bg-forest-700 text-gold-300 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Field</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Lightbox Modal */}
      {previewField && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewField(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-3xl border border-mist-300 shadow-2xl overflow-hidden text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-forest-900 text-white">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold-300 uppercase tracking-wider block">
                  LIVE FORMAT PREVIEW
                </span>
                <h3 className="text-base font-bold font-serif-title text-white">
                  {previewField.label}
                </h3>
              </div>
              <button
                onClick={() => setPreviewField(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-mist-100 rounded-xl border border-mist-400 text-xs text-forest-700 font-mono">
                <strong>Placement:</strong> {previewField.location}
              </div>

              <div className="p-6 bg-mist-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  Website Typography Rendering
                </span>
                {Array.isArray(formValues[previewField.key]) ? (
                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed font-serif">
                    {(formValues[previewField.key] as string[]).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                ) : (
                  <div className="text-base font-medium text-forest-900 leading-relaxed">
                    {String(formValues[previewField.key])}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Live rendering on {previewField.location}
              </span>
              <button
                onClick={() => setPreviewField(null)}
                className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-forest-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
