import {
  Sermon,
  ChurchEvent,
  Ministry,
  Testimony,
  ChurchPhoto,
} from "../types";
import { PASTORAL_COUPLE_IMAGE } from "../assets/pastoralImage";

export const CHURCH_INFO = {
  name: "Wisdom Temple",
  tagline:
    "Raising Leaders. Shaping Visions. Influencing Society Through Christ.",
  description:
    "A Bible-believing charismatic Church committed to raising leaders, shaping visions and influencing society through Christ.",
  location: "Star Junction, Tabora - Accra, Ghana",
  landmark: "Star Junction, Tabora",
  physicalAddress: "Wisdom Temple, Star Junction, Tabora - Accra",
  phone: "0245009764",
  email: "icgcwisdomtemple@gmail.com",
  whatsapp: "0245009764",
  shepherd: {
    title: "Shepherd & Senior Minister",
    name: "Rev. Gabriel Dela",
    wifeTitle: "First Lady",
    wifeName: "Lady Dr. Helena Dela",
    combinedTitle: "Rev. Gabriel Dela & Lady Dr. Helena Dela",
    image: PASTORAL_COUPLE_IMAGE,
    fallbackImage: "/assets/optimized/rev_gabriel_and_helena_dela.webp",
    role: "Shepherd of Wisdom Temple",
    bio: "Rev. Gabriel Dela serves as the Shepherd and Senior Minister of ICGC Wisdom Temple. Alongside his wife, Lady Dr. Helena Dela, they shepherd the Wisdom Temple family with passionate biblical exposition, pastoral compassion, and prophetic intercession, dedicated to raising leaders, shaping visions, and influencing society through Christ.",
  },
  services: {
    sunday: {
      name: "Sunday Celebration Service",
      time: "8:00 AM",
      day: "Every Sunday",
      description:
        "A vibrant encounter with uplifting praise, charismatic worship, and foundational biblical teaching.",
    },
    midweek: {
      name: "The Secret Place Prayer Service",
      subtitle: "A Time of Prayer, Worship and Encounter",
      time: "7:00 PM",
      day: "Every Wednesday",
      description:
        "Our midweek prayer service of fervent prayer, prophetic ministry, and personal spiritual renewal.",
    },
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://www.youtube.com/@icgcwisdomtemple",
    tiktok: "https://tiktok.com",
    x: "https://x.com",
  },
  paymentPlaceholders: {
    mtnMoMo: "0555577099",
    telecelCash: "0555577099 (Via Other Networks)",
    atMoney: "0555577099 (Via Other Networks)",
    bankDetails: "Consolidated Bank Ghana (CBG) - Acc: 0523529100002",
    accountName: "Wisdom Temple (Kokomlemle)",
    onlinePayment: "",
    givingFlyer: "/giving_details_official.jpg",
  },
};

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: "sermon-1",
    title: "Dream Big",
    speaker: "Wisdom Temple",
    date: "September 13, 2026",
    scripture: "Genesis 37:5-11, Habakkuk 2:2-3",
    category: "Sunday Message",
    series: "Vision & Destiny",
    duration: "Message Broadcast",
    summary:
      "Dare to expand your spiritual horizons and pursue God-sized visions with faith and diligence. Discover divine principles for overcoming limitations, anchoring your confidence in God, and bringing supernatural visions to pass.",
    thumbnail: "https://i.ytimg.com/vi/cnVwK9eU7EI/hqdefault.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    videoEmbedUrl: "https://www.youtube.com/embed/cnVwK9eU7EI",
    youtubeUrl: "https://www.youtube.com/watch?v=cnVwK9eU7EI",
  },
  {
    id: "sermon-2",
    title: "The Secret Place: Accessing Heavenly Counsel",
    speaker: "[PASTOR / SPEAKER NAME]",
    date: "September 9, 2026",
    scripture: "Psalm 91:1-4, Matthew 6:6",
    category: "The Secret Place",
    series: "Atmosphere of Prayer",
    duration: "45 mins",
    summary:
      "He that dwelleth in the secret place shall abide under the shadow of the Almighty. Powerful keys to developing a consistent, transformative prayer altar in personal and family life.",
    thumbnail: "/assets/optimized/secret_place_banner.webp",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "sermon-3",
    title: "Raising Leaders: The Discipline of Character",
    speaker: "[PASTOR / SPEAKER NAME]",
    date: "September 6, 2026",
    scripture: "1 Timothy 3:1-7, Proverbs 22:1",
    category: "Sunday Message",
    series: "The Leadership Mandate",
    duration: "58 mins",
    summary:
      "Gift opens the door, but character keeps the room. An in-depth charismatic exploration of personal integrity, spiritual fortitude, and societal influence through Christ.",
    thumbnail:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "sermon-4",
    title: "Shaping Visions in the Marketplace",
    speaker: "[PASTOR / SPEAKER NAME]",
    date: "August 30, 2026",
    scripture: "Habakkuk 2:1-3, Nehemiah 2:17-18",
    category: "Special Teaching",
    series: "Kingdom Economics & Enterprise",
    duration: "64 mins",
    summary:
      "Practical principles on articulating god-given visions into actionable enterprise, professional excellence, and ethical marketplace transformation.",
    thumbnail:
      "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "sermon-5",
    title: "Wisdom Summit Archive: Dominion Through Knowledge",
    speaker: "[PASTOR / SPEAKER NAME]",
    date: "August 23, 2026",
    scripture: "Hosea 4:6, Isaiah 33:6",
    category: "Wisdom Summit",
    series: "Wisdom Summit Keynote",
    duration: "70 mins",
    summary:
      "Wisdom and knowledge shall be the stability of thy times. An apostolic address calling believers to rise with clarity and spiritual excellence.",
    thumbnail:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "sermon-6",
    title: "Wrestling in the Spirit: The Midnight Cry",
    speaker: "[PASTOR / SPEAKER NAME]",
    date: "August 19, 2026",
    scripture: "Acts 16:25-26, Ephesians 6:18",
    category: "The Secret Place",
    series: "Atmosphere of Prayer",
    duration: "48 mins",
    summary:
      "Unlocking divine intervention through sacrificial midnight supplication and authoritative declarations in the Holy Ghost.",
    thumbnail:
      "https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=1200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: "wisdom-summit-2026",
    name: "WISDOM SUMMIT 2026",
    theme: "Dominion Through Divine Insight",
    date: "October 7 - 9 & October 11, 2026",
    time: "6:30 PM each night (Oct 7 - 9) & 8:00 AM prompt (Oct 11)",
    venue: "Wisdom Temple Auditorium, Star Junction, Tabora - Accra",
    shortDescription:
      "Wisdom Summit 2026: Raising visionary leaders and uncovering kingdom wisdom for destiny and societal impact.",
    fullDescription:
      "Wisdom Summit 2026 is Wisdom Temple’s premier annual conference with Host Rev Gabriel Dela and special guest ministers Rev Albert, Rev Dickson, and Rev Paul.",
    speaker:
      "Host: Rev Gabriel Dela • Guests: Rev Albert, Rev Dickson, Rev Paul",
    scripture: "Proverbs 3:13-18",
    category: "Conference",
    image: "/assets/optimized/wisdom_summit_banner.webp",
    registrationRequired: true,
    registrationStatus: "Open",
    isFeaturedSummit: true,
  },
  {
    id: "secret-place-allnight",
    name: "The Secret Place: Night of Encounters",
    theme: "Breaking Territorial Boundaries",
    date: "October 30, 2026",
    time: "10:00 PM - 4:30 AM",
    venue: "Auditorium, Star Junction, Tabora - Accra",
    shortDescription:
      "A night dedicated to travailing prayer, prophetic declarations, spiritual warfare, and deep immersion in the Holy Spirit.",
    speaker: "Resident Pastors & Prayer Ministry",
    category: "Prayer",
    image: "/assets/optimized/secret_place_banner.webp",
    registrationRequired: false,
    registrationStatus: "Open",
  },
  {
    id: "nextgen-youth-camp",
    name: "Ignite Youth & Young Adults Summit",
    theme: "Unashamed: Light in the Darkness",
    date: "November 14, 2026",
    time: "10:00 AM - 3:00 PM",
    venue: "Youth Center, Star Junction, Tabora - Accra",
    shortDescription:
      "Empowering students and young professionals to take bold stands for Christ, navigate peer pressure, and excel academically and spiritually.",
    speaker: "[YOUTH PASTOR / SPEAKER NAME]",
    category: "Youth",
    image: "/assets/optimized/youth_ministry.webp",
    registrationRequired: true,
    registrationStatus: "Open",
  },
  {
    id: "couples-marriage-seminar",
    name: "Covenant Love: Marriage & Family Colloquium",
    theme: "Building Indestructible Marriages",
    date: "November 28, 2026",
    time: "4:00 PM - 7:30 PM",
    venue: "Fellowship Hall, Star Junction, Tabora - Accra",
    shortDescription:
      "Practical, biblical insights for married couples and singles preparing for marital blessing in Christ.",
    speaker: "[FAMILY LIFE COUNSELORS]",
    category: "Special Service",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    registrationRequired: true,
    registrationStatus: "Open",
  },
];

export const MINISTRIES: Ministry[] = [
  {
    id: "children",
    name: "Children’s Ministry (Kingdom Kids)",
    category: "Generational",
    shortDescription:
      "Nurturing infants, toddlers, and young minds with biblical foundations, creative worship, and godly values.",
    audience: "Ages 1 to 12",
    meetingSchedule: "Sundays at 8:00 AM during Main Service",
    leadPlaceholder: "[CHILDREN MINISTRY DIRECTOR]",
    image:
      "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "youth",
    name: "Youth Ministry (Gen-Impact / New Breed Youth)",
    category: "Generational",
    shortDescription:
      "A dynamic, high-energy environment shaping junior high and high school youth into fervent disciples of Jesus Christ.",
    audience: "Teens aged 13 to 19",
    meetingSchedule: "Saturdays at 4:00 PM & Sunday breakout",
    leadPlaceholder: "[YOUTH PASTOR NAME]",
    image: "/assets/optimized/youth_ministry.webp",
  },
  {
    id: "young-adults",
    name: "Young Adults & Professionals (New Breed)",
    category: "Professionals & Campus",
    shortDescription:
      "Connecting tertiary students, fresh graduates, and career professionals for networking, mentoring, and spiritual stamina.",
    audience: "Young Adults aged 20 to 35",
    meetingSchedule: "Bi-weekly Fridays at 6:30 PM",
    leadPlaceholder: "[YOUNG ADULTS COORDINATOR]",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "women",
    name: "Women’s Ministry (Precious Vessels)",
    category: "Fellowship",
    shortDescription:
      "Strengthening women in faith, family leadership, career stewardship, and compassionate outreach.",
    audience: "All adult women",
    meetingSchedule: "Monthly on 2nd Saturdays at 9:00 AM",
    leadPlaceholder: "[WOMEN’S MINISTRY LEADER]",
    image: "/assets/optimized/womens_fellowship.webp",
  },
  {
    id: "men",
    name: "Men’s Ministry (Mighty Men of Valour)",
    category: "Fellowship",
    shortDescription:
      "Sharpening men to stand with moral authority, spiritual depth, fatherhood excellence, and business acumen.",
    audience: "All adult men",
    meetingSchedule: "Monthly on 3rd Saturdays at 7:00 AM",
    leadPlaceholder: "[MEN’S MINISTRY LEADER]",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "couples-marriage",
    name: "Couples & Marriage Ministry",
    category: "Family Life",
    shortDescription:
      "Fostering Christ-centered marriages through mentorship, marital enrichment retreats, and pre-marital counseling.",
    audience: "Married couples & engaged partners",
    meetingSchedule: "Quarterly workshops and romantic fellowship banquets",
    leadPlaceholder: "[MARRIAGE COMMITTEE LEADERS]",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "evangelism",
    name: "Evangelism & Community Outreach",
    category: "Missions",
    shortDescription:
      "Advancing the Great Commission through hospital visitations, street evangelism, prison ministry, and welfare support.",
    audience: "All soul winners",
    meetingSchedule: "Alternate Saturdays at 3:30 PM",
    leadPlaceholder: "[EVANGELISM DIRECTOR]",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "multimedia",
    name: "Multimedia & Sound Tech",
    category: "Production",
    shortDescription:
      "Stewarding the digital sanctuary through professional live streaming, acoustic sound balance, lighting, and graphic design.",
    audience: "Technical creatives & enthusiasts",
    meetingSchedule: "Wednesdays at 5:30 PM & Sunday mornings",
    leadPlaceholder: "[MEDIA HEAD]",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "discipleship",
    name: "Discipleship & Foundation School",
    category: "Spiritual Growth",
    shortDescription:
      "Guiding new believers through repentance, water baptism, charismatic doctrines, and spiritual gifts activation.",
    audience: "New converts & transferees",
    meetingSchedule: "Sundays at 7:00 AM (Classrooms)",
    leadPlaceholder: "[FOUNDATION DEAN]",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prayer",
    name: "Intercessory Prayer Department",
    category: "Spiritual Fortress",
    shortDescription:
      "Maintaining constant 24/7 prayer coverage for the church leadership, members, the nation of Ghana, and the global body of Christ.",
    audience: "Fervent prayer warriors",
    meetingSchedule: "Wednesdays before The Secret Place & Friday Vigils",
    leadPlaceholder: "[CHIEF INTERCESSOR]",
    image:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
  },
];

export const INITIAL_TESTIMONIES: Testimony[] = [
  {
    id: "testimony-1",
    personName: "[CHURCH MEMBER NAME]",
    title: "Divine Healing & Breakthrough in Career",
    testimony:
      "After participating in The Secret Place Wednesday prayers, God opened doors that had been closed for over two years. A supernatural promotion came through, and physical symptoms vanished completely.",
    date: "September 2026",
    category: "Healing & Career",
    approved: true,
  },
  {
    id: "testimony-2",
    personName: "[CHURCH MEMBER NAME]",
    title: "Restoration of Family Peace & Marriage",
    testimony:
      "My spouse and I were at the brink of giving up until we sat under the teaching of wisdom at Wisdom Temple. The practical principles of covenant love healed our communication and renewed our vows.",
    date: "August 2026",
    category: "Family Restoration",
    approved: true,
  },
  {
    id: "testimony-3",
    personName: "[YOUTH MEMBER NAME]",
    title: "Freedom from Anxiety & Clear Academic Vision",
    testimony:
      "Gen-Impact youth sessions gave me confidence and spiritual purpose. I learned to pray in the Spirit and anchor my study habits in God. My grades turned around miraculously.",
    date: "August 2026",
    category: "Academic & Spiritual",
    approved: true,
  },
];

export const BELIEFS = [
  {
    title: "The Holy Scriptures",
    text: "We believe the Bible is the inspired, infallible, and authoritative Word of God, our supreme rule of faith and conduct.",
  },
  {
    title: "The Eternal Godhead",
    text: "We believe in one God eternally existent in three Persons: God the Father, God the Son, and God the Holy Spirit.",
  },
  {
    title: "Salvation by Grace",
    text: "We believe that through the sacrificial death and resurrection of Jesus Christ, repentance toward God and faith in Jesus Christ brings eternal salvation.",
  },
  {
    title: "The Baptism of the Holy Spirit",
    text: "We believe in the baptism of the Holy Spirit with charismatic gifts, empowering believers for victorious living, healing, and effective ministry.",
  },
  {
    title: "Transformational Leadership",
    text: "We believe in raising believers of excellence who exercise godly dominion, solve societal challenges, and influence governance, commerce, and culture.",
  },
  {
    title: "The Blessed Hope",
    text: "We believe in the personal, imminent return of our Lord Jesus Christ and the resurrection of both the just and unjust.",
  },
];

export const INITIAL_MINISTRIES = MINISTRIES;

export const GIVING_DETAILS = {
  momo: {
    mtn: "0555577099",
    telecel: CHURCH_INFO.paymentPlaceholders.telecelCash,
    at: CHURCH_INFO.paymentPlaceholders.atMoney,
    accountName: "Wisdom Temple (Kokomlemle)",
  },
  bank: {
    bankName: "Consolidated Bank Ghana Ltd. (CBG)",
    accountNumber: "0523529100002",
    accountName: "Wisdom Temple (Kokomlemle)",
    details:
      "Consolidated Bank Ghana Ltd. (CBG) • Acc: 0523529100002 • Wisdom Temple (Kokomlemle)",
  },
  online: {
    paymentUrl: CHURCH_INFO.paymentPlaceholders.onlinePayment,
  },
  flyer: "/giving_details_official.jpg",
  instructions:
    "You can send your FIRSTFRUIT, OFFERING & PLEDGES to our MoMo or Bank Account.",
};

export const INITIAL_CHURCH_PHOTOS: ChurchPhoto[] = [
  {
    id: "photo-pastoral-shepherds",
    title: "Rev. Gabriel Dela & Lady Dr. Helena Dela",
    event: "Pastoral Leadership",
    category: "Fellowship & Community",
    date: "September 2026",
    imageUrl: PASTORAL_COUPLE_IMAGE,
    caption:
      "Rev. Gabriel Dela and Lady Dr. Helena Dela, Shepherds of ICGC Wisdom Temple, providing apostolic oversight, pastoral compassion, and biblical vision.",
    location: "Wisdom Temple, Star Junction, Tabora - Accra",
    featured: true,
  },
  {
    id: "photo-1",
    title: "Wisdom Summit 2026: Leadership Colloquium",
    event: "Wisdom Summit 2026",
    category: "Conferences & Summits",
    date: "September 2026",
    imageUrl: "/assets/optimized/wisdom_summit_banner.webp",
    caption:
      "Official keynote gathering of ministers, marketplace leaders, and delegates from across Ghana at Wisdom Temple.",
    location: "Wisdom Temple Main Sanctuary, Star Junction",
    featured: true,
  },
  {
    id: "photo-2",
    title: "The Secret Place Prayer Service",
    event: "The Secret Place",
    category: "Worship & Prayer",
    date: "September 2026",
    imageUrl: "/assets/optimized/secret_place_banner.webp",
    caption:
      "Our sacred Wednesday night prayer service of fervent prayer, prophetic ministry, and personal spiritual renewal.",
    location: "Main Auditorium Altar",
    featured: true,
  },
  {
    id: "photo-3",
    title: "Sunday Morning Adoration & Worship",
    event: "Sunday Celebration",
    category: "Worship & Prayer",
    date: "September 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Congregants united in heartfelt praise and spiritual adoration during the 8:00 AM celebration service.",
    location: "Auditorium Sanctuary",
    featured: false,
  },
  {
    id: "photo-4",
    title: "Destiny Generation Youth Explosion",
    event: "Youth & Young Adults Summit",
    category: "Youth & Kids",
    date: "August 2026",
    imageUrl: "/assets/optimized/youth_ministry.webp",
    caption:
      "Dynamic teens and young adults being equipped with spiritual stamina, vision, and leadership excellence.",
    location: "Wisdom Temple Youth Center",
    featured: true,
  },
  {
    id: "photo-5",
    title: "Precious Vessels Women’s Fellowship",
    event: "Women in Leadership Conference",
    category: "Fellowship & Community",
    date: "August 2026",
    imageUrl: "/assets/optimized/womens_fellowship.webp",
    caption:
      "Celebrating Christian womanhood, mentorship, family preservation, and virtuous kingdom leadership.",
    location: "Fellowship Hall",
    featured: false,
  },
  {
    id: "photo-6",
    title: "Kingdom Kids Children’s Bible Class",
    event: "Sunday School Academy",
    category: "Youth & Kids",
    date: "September 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Trained teachers grounding our next generation in scripture stories, memorization, and creative worship.",
    location: "King’s Court Children’s Auditorium",
    featured: false,
  },
  {
    id: "photo-7",
    title: "Foundational Truths Bible Study",
    event: "Spiritual Growth Class",
    category: "Special Services",
    date: "September 2026",
    imageUrl: "/assets/optimized/open_bible.webp",
    caption:
      "Deep systematic study of God’s infallible Word guiding believers into victorious daily discipleship.",
    location: "Wisdom Temple Study Center",
    featured: false,
  },
  {
    id: "photo-8",
    title: "Joyful Praise & Covenant Worship",
    event: "Sunday Celebration",
    category: "Worship & Prayer",
    date: "July 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Vibrant celebratory songs and live instrumentation ushering God’s people into divine presence.",
    location: "Main Sanctuary",
    featured: false,
  },
  {
    id: "photo-9",
    title: "Tabora Community Compassion Outreach",
    event: "Missions & Benevolence",
    category: "Fellowship & Community",
    date: "July 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Expressing Christ’s unconditional love through food baskets, medical care, and community empowerment in Tabora.",
    location: "Star Junction Community Grounds",
    featured: false,
  },
  {
    id: "photo-10",
    title: "Youth & Young Professionals Workshop",
    event: "Career & Faith Mentorship",
    category: "Youth & Kids",
    date: "June 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Interactive mentoring seminar bridging spiritual convictions and career excellence for university students.",
    location: "Conference Room B",
    featured: false,
  },
  {
    id: "photo-11",
    title: "Intercessory Prayer Altar",
    event: "All-Night Vigil",
    category: "Worship & Prayer",
    date: "June 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Pastors and intercessors holding hands in travailing prayer for Ghana, our families, and the global church.",
    location: "Prayer Chapel",
    featured: false,
  },
  {
    id: "photo-12",
    title: "Warm Hospitality & New Guest Reception",
    event: "First-Time Visitors Lounge",
    category: "Fellowship & Community",
    date: "May 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Pastoral team and protocol officers welcoming first-time attendees with love, gifts, and personal prayer.",
    location: "Guest Welcome Center",
    featured: true,
  },
];
