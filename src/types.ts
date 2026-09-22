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

export interface ChurchPhoto {
  id: string;
  title: string;
  event: string;
  category: 'All' | 'Worship & Prayer' | 'Conferences & Summits' | 'Fellowship & Community' | 'Youth & Kids' | 'Special Services';
  date: string;
  imageUrl: string;
  caption: string;
  location?: string;
  featured?: boolean;
}

export type FontTheme = 'cinzel' | 'playfair' | 'modern' | 'cormorant';
