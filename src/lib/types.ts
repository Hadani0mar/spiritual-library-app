
// Types for Quran data
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

// Types for Hadith data
export interface HadithCollection {
  name: string;
  title: string;
  shortIntro: string;
  hasBooks: boolean;
  hasChapters: boolean;
  totalHadith: number;
  totalAvailableHadith: number;
}

export interface Hadith {
  collection: string;
  bookNumber: string;
  chapterNumber: string;
  hadithNumber: string;
  text: string;
  grades: { grade: string }[];
}

// Types for Prayer Times
export interface PrayerTimes {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  date: {
    readable: string;
    hijri: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
    };
  };
}

// Types for Dhikr
export interface DhikrItem {
  id: string;
  arabicText: string;
  translation: string;
  transliteration: string;
  count: number;
  virtue: string;
}

// Types for Reciter
export interface Reciter {
  id: string;
  name: string;
  style?: string;
  recitationStyle?: string;
}

// Prayer calculation methods
export interface PrayerMethod {
  id: number;
  name: string;
  description?: string;
}

export const PRAYER_METHODS: PrayerMethod[] = [
  { id: 1, name: "جامعة العلوم الإسلامية بكراتشي", description: "University of Islamic Sciences, Karachi" },
  { id: 2, name: "الجمعية الإسلامية بأمريكا الشمالية", description: "Islamic Society of North America" },
  { id: 3, name: "رابطة العالم الإسلامي", description: "Muslim World League" },
  { id: 4, name: "أم القرى", description: "Umm al-Qura University, Makkah" },
  { id: 5, name: "الهيئة المصرية العامة للمساحة", description: "Egyptian General Authority of Survey" },
  { id: 7, name: "معهد الجيوفيزياء، جامعة طهران", description: "Institute of Geophysics, University of Tehran" },
  { id: 8, name: "الجزائر", description: "Algeria" },
  { id: 9, name: "الكويت", description: "Kuwait" },
  { id: 10, name: "قطر", description: "Qatar" },
  { id: 11, name: "مجلس العلماء الإندونيسي", description: "Majlis Ugama Islam Singapura, Singapore" },
  { id: 12, name: "الاتحاد الإسلامي فرنسا", description: "Union Organization islamic de France" },
  { id: 13, name: "الإدارة الدينية لمسلمي روسيا", description: "Spiritual Administration of Muslims of Russia" },
];
