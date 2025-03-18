
// LocalStorage keys
const KEYS = {
  LAST_SURAH: 'islamic-app:last-surah',
  LAST_AYAH: 'islamic-app:last-ayah',
  LAST_PAGE: 'islamic-app:last-page',
  RECITER: 'islamic-app:selected-reciter',
  PRAYER_METHOD: 'islamic-app:prayer-method',
  DHIKR_COUNTER: 'islamic-app:dhikr-counter',
  DHIKR_CHALLENGES: 'islamic-app:dhikr-challenges',
  NOTIFICATION_SETTINGS: 'islamic-app:notification-settings',
  QURAN_VIEW_MODE: 'islamic-app:quran-view-mode', // 'text' or 'image'
};

// Generic get and set functions
const getItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Last read position in Quran
export const getLastReadingSurah = (): number => getItem(KEYS.LAST_SURAH, 1);
export const setLastReadingSurah = (surahNumber: number): void => setItem(KEYS.LAST_SURAH, surahNumber);

export const getLastReadingAyah = (): number => getItem(KEYS.LAST_AYAH, 1);
export const setLastReadingAyah = (ayahNumber: number): void => setItem(KEYS.LAST_AYAH, ayahNumber);

export const getLastReadingPage = (): number => getItem(KEYS.LAST_PAGE, 1);
export const setLastReadingPage = (pageNumber: number): void => setItem(KEYS.LAST_PAGE, pageNumber);

// Reciter preference
export const getSelectedReciter = (): string => getItem(KEYS.RECITER, '7');
export const setSelectedReciter = (reciterId: string): void => setItem(KEYS.RECITER, reciterId);

// Prayer calculation method
export const getPrayerMethod = (): number => getItem(KEYS.PRAYER_METHOD, 2);
export const setPrayerMethod = (method: number): void => setItem(KEYS.PRAYER_METHOD, method);

// Dhikr counter
export const getDhikrCounter = (dhikrType: string): number => {
  const counters = getItem<Record<string, number>>(KEYS.DHIKR_COUNTER, {});
  return counters[dhikrType] || 0;
};

export const setDhikrCounter = (dhikrType: string, count: number): void => {
  const counters = getItem<Record<string, number>>(KEYS.DHIKR_COUNTER, {});
  counters[dhikrType] = count;
  setItem(KEYS.DHIKR_COUNTER, counters);
};

interface DhikrChallenge {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

// Dhikr challenges
export const getDhikrChallenges = (): DhikrChallenge[] => getItem<DhikrChallenge[]>(KEYS.DHIKR_CHALLENGES, []);

export const addDhikrChallenge = (challenge: Omit<DhikrChallenge, 'id' | 'createdAt' | 'current' | 'completed'>): void => {
  const challenges = getDhikrChallenges();
  const newChallenge: DhikrChallenge = {
    ...challenge,
    id: Date.now().toString(),
    current: 0,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  challenges.push(newChallenge);
  setItem(KEYS.DHIKR_CHALLENGES, challenges);
};

export const updateDhikrChallenge = (id: string, progress: number): DhikrChallenge | null => {
  const challenges = getDhikrChallenges();
  const challengeIndex = challenges.findIndex(c => c.id === id);
  
  if (challengeIndex === -1) return null;
  
  const challenge = challenges[challengeIndex];
  challenge.current += progress;
  
  if (challenge.current >= challenge.target && !challenge.completed) {
    challenge.completed = true;
    challenge.completedAt = new Date().toISOString();
  }
  
  challenges[challengeIndex] = challenge;
  setItem(KEYS.DHIKR_CHALLENGES, challenges);
  
  return challenge;
};

// Notification settings
interface NotificationSettings {
  prayerTimes: boolean;
  fridayReminder: boolean;
  quranReminder: boolean;
}

export const getNotificationSettings = (): NotificationSettings => 
  getItem<NotificationSettings>(KEYS.NOTIFICATION_SETTINGS, {
    prayerTimes: true,
    fridayReminder: true,
    quranReminder: false,
  });

export const setNotificationSettings = (settings: NotificationSettings): void => 
  setItem(KEYS.NOTIFICATION_SETTINGS, settings);

// Quran view mode
export const getQuranViewMode = (): 'text' | 'image' => getItem<'text' | 'image'>(KEYS.QURAN_VIEW_MODE, 'text');
export const setQuranViewMode = (mode: 'text' | 'image'): void => setItem(KEYS.QURAN_VIEW_MODE, mode);

// Clear all stored data
export const clearAllData = (): void => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
};
