export type PageId = 
  | 'home' 
  | 'about' 
  | 'watch-listen' 
  | 'grow' 
  | 'ministries' 
  | 'events' 
  | 'gallery'
  | 'connect' 
  | 'new-here' 
  | 'prayer' 
  | 'prayer-request'
  | 'give' 
  | 'contact' 
  | 'admin';

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  category: 'Sunday Message' | 'The Secret Place' | 'Wisdom Summit' | 'Special Teaching';
  series?: string;
  duration: string;
  summary: string;
  thumbnail: string;
  audioUrl?: string;
  videoEmbedUrl?: string;
  youtubeUrl?: string;
}

export interface ChurchEvent {
  id: string;
  name: string;
  theme?: string;
  date: string;
  time: string;
  venue: string;
  shortDescription: string;
  fullDescription?: string;
  speaker?: string;
  scripture?: string;
  category: 'Conference' | 'Prayer' | 'Sunday Service' | 'Special Service' | 'Youth' | 'Community';
  image: string;
  registrationRequired: boolean;
  registrationStatus: 'Open' | 'Closed' | 'Limited Seats';
  isFeaturedSummit?: boolean;
}

export interface Ministry {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  audience: string;
  meetingSchedule: string;
  leadPlaceholder: string;
  image: string;
}

export interface PrayerRequest {
  id: string;
  fullName: string;
  category: string;
  email: string;
  phone: string;
  requestText: string;
  isConfidential: boolean;
  wantsFollowup: boolean;
  dateSubmitted: string;
  status: 'new' | 'prayed' | 'archived';
}

export interface VisitPlan {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceDate: string;
  serviceTime: string;
  adultsCount: number;
  childrenCount: number;
  needAssistance: boolean;
  specialNeeds?: string;
  dateSubmitted: string;
  status: 'planned' | 'welcomed' | 'followup-assigned';
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  dateSubmitted: string;
  status: 'unread' | 'read' | 'replied';
}


export interface Testimony {
  id: string;
  personName: string;
  title: string;
  testimony: string;
  date: string;
  category: string;
  approved: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventName: string;
  fullName: string;
  email: string;
  phone: string;
  attendeesCount: number;
  registrationCode: string;
  dateRegistered: string;
}

export interface GivingRecord {
  id: string;
  donorName: string;
  fund: string;
  amount: number;
  currency: 'GHS' | 'USD';
  paymentMethod: 'Mobile Money (MTN MoMo)' | 'Bank Transfer (CBG)';
  referenceCode: string;
  phoneOrTxnId: string;
  notes?: string;
  dateSubmitted: string;
  status: 'pending-verification' | 'confirmed';
}

export interface ChurchPhoto {
  id: string;
  title: string;
  event: string;
  category: 'All' | 'Worship & Prayer' | 'Conferences & Summits' | 'Fellowship & Community' | 'Youth & Kids' | 'Special Services';
  date: string;
  imageUrl: string;
  /** Smaller image for grids; falls back to imageUrl. */
  thumbnailUrl?: string;
  caption: string;
  location?: string;
  featured?: boolean;
}

export type AlbumCategory = Exclude<ChurchPhoto['category'], 'All'>;

export interface AlbumPhoto {
  id: string;
  width: number;
  height: number;
  caption?: string;
  uploadedAt: string;
  sortKey?: string;
  url: string;
  thumbUrl: string;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  description: string;
  category: AlbumCategory;
  date: string; // YYYY-MM-DD
  location?: string;
  coverPhotoId?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  photoCount: number;
  cover: { url: string; thumbUrl: string } | null;
  photos?: AlbumPhoto[];
}

export type StaffRole = 'super-admin' | 'pastoral' | 'finance' | 'secretariat' | 'protocol';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  roleLabel: string;
  passcode: string;
  phone?: string;
  dateAdded: string;
  lastLogin?: string;
  isActive: boolean;
}

export type BannerCategory = 
  | 'all'
  | 'hero' 
  | 'ministries' 
  | 'events' 
  | 'pages' 
  | 'pastoral' 
  | 'giving';

export interface BannerConfig {
  id: string;
  name: string;
  category: 'hero' | 'ministries' | 'events' | 'pages' | 'pastoral' | 'giving';
  categoryLabel: string;
  location: string;
  currentUrl: string;
  defaultUrl: string;
  recommendedSize: string;
  aspectRatio: string;
  width: number;
  height: number;
  description: string;
  designNotes?: string;
  updatedAt?: string;
}

export type ContentSectionId = 
  | 'hero' 
  | 'pastoral' 
  | 'about' 
  | 'church_info' 
  | 'services' 
  | 'giving' 
  | 'footer';

export interface SiteContentConfig {
  // --- Homepage & Hero ---
  heroHeadline: string;
  heroSubtitle: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  heroVideoUrl: string;
  experienceSectionBadge: string;
  experienceSectionTitle: string;
  experienceSectionSubtitle: string;
  experienceMod1Title: string;
  experienceMod1Desc: string;
  experienceMod2Title: string;
  experienceMod2Desc: string;
  experienceMod3Title: string;
  experienceMod3Desc: string;
  firstTimeVisitorEyebrow: string;
  firstTimeVisitorTitle: string;
  firstTimeVisitorDesc: string;

  // --- Church Identity & Contact ---
  churchName: string;
  churchTagline: string;
  churchDescription: string;
  churchAddress: string;
  churchLandmark: string;
  churchPhone: string;
  churchWhatsApp: string;
  churchEmail: string;
  officeHours: string;
  socialYoutube: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTiktok: string;

  // --- Pastoral Leadership & Pastor's Desk ---
  pastorName: string;
  pastorTitle: string;
  firstLadyName: string;
  firstLadyTitle: string;
  combinedPastoralTitle: string;
  pastoralTheme: string;
  pastoralScripture: string;
  pastoralDateLabel: string;
  pastoralGreetingSummary: string;
  pastoralFullMessage: string[];
  pastoralBio: string;

  // --- About Us & Mandate ---
  aboutHeadline: string;
  aboutWhoWeAre1: string;
  aboutWhoWeAre2: string;
  aboutVisionTitle: string;
  aboutVisionText: string;
  aboutMissionTitle: string;
  aboutMissionText: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  heritageStoryHeadline: string;
  heritageStoryText1: string;
  heritageStoryText2: string;
  churchCouncilHeadline: string;
  churchCouncilDesc: string;

  // --- Services & Schedules ---
  sundayServiceName: string;
  sundayServiceTime: string;
  sundayServiceDay: string;
  sundayServiceDesc: string;
  midweekServiceName: string;
  midweekServiceSubtitle: string;
  midweekServiceTime: string;
  midweekServiceDay: string;
  midweekServiceDesc: string;

  // --- Giving & Finances ---
  givingHeadline: string;
  givingScriptureText: string;
  givingInstructions: string;
  givingMomoMtn: string;
  givingMomoTelecel: string;
  givingMomoAt: string;
  givingMomoAccountName: string;
  givingBankName: string;
  givingBankAccountNumber: string;
  givingBankAccountName: string;
  givingBankBranch: string;

  // --- Footer & Bulletin ---
  bulletinEyebrow: string;
  bulletinTitle: string;
  bulletinDescription: string;
  footerConnectDescription: string;
  footerCopyrightNotice: string;
}

