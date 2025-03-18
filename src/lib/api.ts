
// Quran API - Using Alquran.cloud API
export const fetchSurahList = async () => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching surah list:", error);
    // Return fallback data if API fails
    return getFallbackSurahs();
  }
};

export const fetchSurah = async (surahNumber: number) => {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching surah:", error);
    // Return fallback data for this surah if API fails
    return getFallbackSurah(surahNumber);
  }
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

// Get city name from coordinates using OpenStreetMap Nominatim
export const getCityNameFromCoordinates = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=ar`);
    const data = await response.json();
    
    // Try to get city, town, or village name
    const city = 
      data.address.city || 
      data.address.town || 
      data.address.village || 
      data.address.county ||
      data.address.state;
    
    if (city) {
      return city;
    } else {
      return "غير معروف";
    }
  } catch (error) {
    console.error("Error fetching city name:", error);
    return "غير معروف";
  }
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
  "اللَّهُمَّ لا سَهْلَ إِلّا ما جَعَلْتَهُ سَهْلاً وَأَنْتَ تَجْعَلُ الحَزْنَ إِذا شِئْتَ سَهْلاً - O Allah, nothing is easy except what You make easy, and You make the difficult easy if You wish.",
  "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ - Indeed, Allah does not allow to be lost the reward of those who do good.",
  "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ - And my success is not but through Allah.",
  "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ - Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
];

export const getRandomMotivation = () => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};

// Fallback data in case the Quran API fails
const getFallbackSurahs = () => {
  return [
    { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", numberOfAyahs: 7 },
    { number: 2, name: "البقرة", englishName: "Al-Baqara", numberOfAyahs: 286 },
    { number: 3, name: "آل عمران", englishName: "Aal-Imran", numberOfAyahs: 200 },
    { number: 4, name: "النساء", englishName: "An-Nisa", numberOfAyahs: 176 },
    { number: 5, name: "المائدة", englishName: "Al-Ma'ida", numberOfAyahs: 120 },
    // Add more surahs as needed
  ];
};

// Fallback data for a specific surah
const getFallbackSurah = (surahNumber: number) => {
  // Basic structure with minimal data for Al-Fatiha
  if (surahNumber === 1) {
    return {
      number: 1,
      name: "الفاتحة",
      englishName: "Al-Fatiha",
      numberOfAyahs: 7,
      ayahs: [
        { number: 1, text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", numberInSurah: 1 },
        { number: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", numberInSurah: 2 },
        { number: 3, text: "الرَّحْمَنِ الرَّحِيمِ", numberInSurah: 3 },
        { number: 4, text: "مَالِكِ يَوْمِ الدِّينِ", numberInSurah: 4 },
        { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", numberInSurah: 5 },
        { number: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", numberInSurah: 6 },
        { number: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", numberInSurah: 7 }
      ]
    };
  }
  
  // Return a minimal structure for other surahs
  return {
    number: surahNumber,
    name: "سورة",
    englishName: "Surah",
    numberOfAyahs: 1,
    ayahs: [
      { number: 1, text: "عذراً، لم نتمكن من جلب محتوى هذه السورة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.", numberInSurah: 1 }
    ]
  };
};
