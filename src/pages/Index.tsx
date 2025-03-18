
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Book, Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchHijriDate, fetchPrayerTimes, getRandomMotivation } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { getLastReadingPage, getLastReadingSurah } from "@/lib/storage";
import { PRAYER_METHODS } from "@/lib/types";

const Index = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivation, setMotivation] = useState(getRandomMotivation());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Get user location for prayer times
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.error("Error getting location:", error);
          // Default to Mecca coordinates if location access is denied
          setLocation({ latitude: 21.3891, longitude: 39.8579 });
        }
      );
    }
  }, []);

  // Fetch prayer times
  const { data: prayerTimes, isLoading: prayerTimesLoading } = useQuery({
    queryKey: ['prayerTimes', location?.latitude, location?.longitude],
    queryFn: () => fetchPrayerTimes(location!.latitude, location!.longitude),
    enabled: !!location,
  });

  // Fetch Hijri date
  const { data: hijriDate, isLoading: hijriLoading } = useQuery({
    queryKey: ['hijriDate'],
    queryFn: fetchHijriDate,
  });

  // Get next prayer time
  const getNextPrayer = () => {
    if (!prayerTimes) return null;
    
    const prayers = [
      { name: 'الفجر', time: prayerTimes.timings.Fajr },
      { name: 'الشروق', time: prayerTimes.timings.Sunrise },
      { name: 'الظهر', time: prayerTimes.timings.Dhuhr },
      { name: 'العصر', time: prayerTimes.timings.Asr },
      { name: 'المغرب', time: prayerTimes.timings.Maghrib },
      { name: 'العشاء', time: prayerTimes.timings.Isha },
    ];
    
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Find the next prayer
    for (const prayer of prayers) {
      const prayerTime = new Date(`${todayStr} ${prayer.time}`);
      if (prayerTime > now) {
        return { name: prayer.name, time: prayer.time };
      }
    }
    
    // If all prayers for today have passed, return Fajr for tomorrow
    return { name: 'الفجر (غدًا)', time: prayerTimes.timings.Fajr };
  };

  const nextPrayer = getNextPrayer();
  const lastSurah = getLastReadingSurah();
  const lastPage = getLastReadingPage();

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">بسم الله الرحمن الرحيم</h1>
        <p className="text-muted-foreground">
          {hijriLoading ? (
            <Skeleton className="h-6 w-48 mx-auto" />
          ) : (
            hijriDate && (
              `${hijriDate.hijri.day} ${hijriDate.hijri.month.ar} ${hijriDate.hijri.year} هـ`
            )
          )}
        </p>
        <p className="text-muted-foreground mt-1">
          {currentTime.toLocaleDateString('ar-SA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-islamic-green/10 border-islamic-green/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-islamic-green">
              <Clock className="mr-2 h-5 w-5" />
              الصلاة القادمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prayerTimesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : nextPrayer ? (
              <>
                <div className="text-2xl font-bold">{nextPrayer.name}</div>
                <div className="text-sm text-muted-foreground">{nextPrayer.time}</div>
              </>
            ) : (
              <div className="text-sm">جاري تحميل مواقيت الصلاة...</div>
            )}
          </CardContent>
        </Card>

        <Link to="/quran">
          <Card className="h-full bg-islamic-gold/10 border-islamic-gold/20 hover:bg-islamic-gold/20 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-islamic-gold">
                <Book className="mr-2 h-5 w-5" />
                القرآن الكريم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">آخر قراءة: سورة {lastSurah} (صفحة {lastPage})</div>
              <CardDescription className="mt-1">انقر لمتابعة القراءة</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link to="/hadith">
          <Card className="h-full bg-islamic-blue/10 border-islamic-blue/20 hover:bg-islamic-blue/20 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-islamic-blue">
                <Users className="mr-2 h-5 w-5" />
                الأحاديث النبوية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">صحيح البخاري، صحيح مسلم، وغيرها</div>
              <CardDescription className="mt-1">استكشف الأحاديث النبوية الشريفة</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dhikr">
          <Card className="h-full bg-islamic-teal/10 border-islamic-teal/20 hover:bg-islamic-teal/20 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-islamic-teal">
                <Calendar className="mr-2 h-5 w-5" />
                الأذكار والتسبيح
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">أذكار الصباح والمساء والتسبيحات</div>
              <CardDescription className="mt-1">تحديات يومية للذكر والتسبيح</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>آية اليوم</CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="border-r-4 border-islamic-green pr-4 py-2 mb-4">
            <p className="text-lg arabic-text">{motivation}</p>
          </blockquote>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>مواقيت الصلاة اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            {prayerTimesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : prayerTimes ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">الفجر</span>
                  <span>{prayerTimes.timings.Fajr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">الشروق</span>
                  <span>{prayerTimes.timings.Sunrise}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">الظهر</span>
                  <span>{prayerTimes.timings.Dhuhr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">العصر</span>
                  <span>{prayerTimes.timings.Asr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">المغرب</span>
                  <span>{prayerTimes.timings.Maghrib}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">العشاء</span>
                  <span>{prayerTimes.timings.Isha}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                يرجى السماح بالوصول إلى موقعك لعرض مواقيت الصلاة
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>روابط سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/quran" 
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Book className="h-8 w-8 mb-2 text-islamic-green" />
                <span className="text-sm">القرآن الكريم</span>
              </Link>
              <Link 
                to="/hadith" 
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Users className="h-8 w-8 mb-2 text-islamic-blue" />
                <span className="text-sm">الأحاديث النبوية</span>
              </Link>
              <Link 
                to="/prayer-times" 
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Clock className="h-8 w-8 mb-2 text-islamic-gold" />
                <span className="text-sm">مواقيت الصلاة</span>
              </Link>
              <Link 
                to="/dhikr" 
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Calendar className="h-8 w-8 mb-2 text-islamic-teal" />
                <span className="text-sm">الأذكار والتسبيح</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
