
// Quran API - Using Alquran.cloud API
export const fetchSurahList = async () => {
  const response = await fetch('https://api.alquran.cloud/v1/surah');
  const data = await response.json();
  return data.data;
};

export const fetchSurah = async (surahNumber: number) => {
  const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
  const data = await response.json();
  return data.data;
};

export const fetchSurahWithTranslation = async (surahNumber: number, language = 'en') => {
  const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,${language}`);
  const data = await response.json();
  return data.data;
};

// QuranPages API - For page images
export const getQuranPageImageUrl = (page: number, width = 800) => {
  return `https://api.qurancdn.com/api/qdc/images/w${width}/page/${page}`;
};

// Audio Recitation API
export const getRecitersList = async () => {
  const response = await fetch('https://api.qurancdn.com/api/qdc/audio/reciters');
  const data = await response.json();
  return data.reciters;
};

export const getRecitationUrl = (surahNumber: number, reciterId: string) => {
  return `https://api.qurancdn.com/api/qdc/audio/recitation/${reciterId}/segments/by_surah/${surahNumber}`;
};

// Hadith API - Using sunnah.com API
export const fetchHadithCollections = async () => {
  const response = await fetch('https://api.sunnah.com/v1/collections', {
    headers: {
      'x-api-key': 'SqD712P3E82xnwOAEOkGd5JZH8s9wRR24TqNFzjk'
    }
  });
  const data = await response.json();
  return data.data;
};

export const fetchHadithsByCollection = async (collectionName: string, page = 1, limit = 20) => {
  const response = await fetch(`https://api.sunnah.com/v1/collections/${collectionName}/hadiths?page=${page}&limit=${limit}`, {
    headers: {
      'x-api-key': 'SqD712P3E82xnwOAEOkGd5JZH8s9wRR24TqNFzjk'
    }
  });
  const data = await response.json();
  return data.data;
};

// Prayer Times API - Using Aladhan API
export const fetchPrayerTimes = async (latitude: number, longitude: number, method = 2) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const response = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`);
  const data = await response.json();
  return data.data;
};

export const fetchHijriDate = async () => {
  const response = await fetch('https://api.aladhan.com/v1/gToH');
  const data = await response.json();
  return data.data;
};

// Utility to get random Islamic motivation message
const motivationalMessages = [
  "ادْعُونِي أَسْتَجِبْ لَكُمْ - Call upon Me; I will respond to you.",
  "مَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ - And whoever relies upon Allah - then He is sufficient for him.",
  "إِنَّ مَعَ الْعُسْرِ يُسْرًا - Indeed, with hardship will be ease.",
  "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ - And when My servants ask you concerning Me - indeed I am near.",
  "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ - And your Lord is going to give you, and you will be satisfied.",
  "فَاذْكُرُونِي أَذْكُرْكُمْ - So remember Me; I will remember you.",
  "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا - And whoever fears Allah - He will make for him a way out.",
  "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ - And will provide for him from where he does not expect.",
  "وَأَن تَصُومُوا خَيْرٌ لَّكُمْ - And to fast is better for you.",
  "وَاللَّهُ مَعَ الصَّابِرِينَ - And Allah is with the patient.",
];

export const getRandomMotivation = () => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};
