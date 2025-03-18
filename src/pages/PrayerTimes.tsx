
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, BellOff, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { fetchHijriDate, fetchPrayerTimes } from "@/lib/api";
import { getNotificationSettings, getPrayerMethod, setNotificationSettings, setPrayerMethod } from "@/lib/storage";
import { PRAYER_METHODS, PrayerTimes as PrayerTimesType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const PrayerTimes = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [calculationMethod, setCalculationMethod] = useState<string>(getPrayerMethod().toString());
  const [notifySettings, setNotifySettings] = useState(getNotificationSettings());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { data: prayerTimes, isLoading: prayerTimesLoading } = useQuery({
    queryKey: ['prayerTimes', location?.latitude, location?.longitude, calculationMethod],
    queryFn: () => fetchPrayerTimes(location!.latitude, location!.longitude, parseInt(calculationMethod)),
    enabled: !!location,
  });

  const { data: hijriDate, isLoading: hijriLoading } = useQuery({
    queryKey: ['hijriDate'],
    queryFn: fetchHijriDate,
  });

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('loading');
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationStatus('success');
        },
        error => {
          console.error("Error getting location:", error);
          setLocationStatus('error');
          // Default to Mecca coordinates if location access is denied
          setLocation({ latitude: 21.3891, longitude: 39.8579 });
          
          toast({
            title: "تعذر الوصول إلى الموقع",
            description: "تم استخدام إحداثيات مكة المكرمة بشكل افتراضي. يرجى السماح بالوصول إلى موقعك للحصول على مواقيت دقيقة.",
            variant: "destructive",
          });
        }
      );
    } else {
      setLocationStatus('error');
      toast({
        title: "المتصفح لا يدعم تحديد الموقع",
        description: "تم استخدام إحداثيات مكة المكرمة بشكل افتراضي.",
        variant: "destructive",
      });
      // Default to Mecca coordinates if geolocation is not supported
      setLocation({ latitude: 21.3891, longitude: 39.8579 });
    }
  }, [toast]);

  // Handle notification settings change
  const handleNotificationChange = (key: keyof typeof notifySettings) => {
    const newSettings = { ...notifySettings, [key]: !notifySettings[key] };
    setNotifySettings(newSettings);
    setNotificationSettings(newSettings);
    
    if (newSettings[key]) {
      // Request notification permission
      if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
      
      toast({
        title: "تم تفعيل الإشعارات",
        description: "سيتم إشعارك بمواقيت الصلاة على هذا الجهاز.",
      });
    }
  };

  // Handle calculation method change
  const handleMethodChange = (value: string) => {
    setCalculationMethod(value);
    setPrayerMethod(parseInt(value));
  };

  // Get prayer time object
  const getPrayerTimeObject = (prayerTimes: PrayerTimesType) => {
    return [
      { name: 'الفجر', time: prayerTimes.timings.Fajr, icon: <Clock className="h-5 w-5" /> },
      { name: 'الشروق', time: prayerTimes.timings.Sunrise, icon: <Clock className="h-5 w-5" /> },
      { name: 'الظهر', time: prayerTimes.timings.Dhuhr, icon: <Clock className="h-5 w-5" /> },
      { name: 'العصر', time: prayerTimes.timings.Asr, icon: <Clock className="h-5 w-5" /> },
      { name: 'المغرب', time: prayerTimes.timings.Maghrib, icon: <Clock className="h-5 w-5" /> },
      { name: 'العشاء', time: prayerTimes.timings.Isha, icon: <Clock className="h-5 w-5" /> },
    ];
  };

  // Calculate time until next prayer
  const calculateNextPrayer = (prayerTimes: PrayerTimesType) => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const prayers = [
      { name: 'الفجر', time: new Date(`${todayStr} ${prayerTimes.timings.Fajr}`) },
      { name: 'الشروق', time: new Date(`${todayStr} ${prayerTimes.timings.Sunrise}`) },
      { name: 'الظهر', time: new Date(`${todayStr} ${prayerTimes.timings.Dhuhr}`) },
      { name: 'العصر', time: new Date(`${todayStr} ${prayerTimes.timings.Asr}`) },
      { name: 'المغرب', time: new Date(`${todayStr} ${prayerTimes.timings.Maghrib}`) },
      { name: 'العشاء', time: new Date(`${todayStr} ${prayerTimes.timings.Isha}`) },
    ];
    
    // Find the next prayer
    for (const prayer of prayers) {
      if (prayer.time > now) {
        const timeDiff = prayer.time.getTime() - now.getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
          name: prayer.name,
          time: prayer.time,
          timeRemaining: `${hoursDiff}:${String(minutesDiff).padStart(2, '0')}`,
          progress: calculateProgress(now, getPreviousPrayer(prayers, now).time, prayer.time),
        };
      }
    }
    
    // If all prayers for today have passed, return Fajr for tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    
    const fajrTomorrow = new Date(`${tomorrowStr} ${prayerTimes.timings.Fajr}`);
    const timeDiff = fajrTomorrow.getTime() - now.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      name: 'الفجر (غدا)',
      time: fajrTomorrow,
      timeRemaining: `${hoursDiff}:${String(minutesDiff).padStart(2, '0')}`,
      progress: calculateProgress(now, prayers[prayers.length - 1].time, fajrTomorrow),
    };
  };

  // Get the previous prayer time
  const getPreviousPrayer = (prayers: { name: string; time: Date }[], now: Date) => {
    for (let i = prayers.length - 1; i >= 0; i--) {
      if (prayers[i].time <= now) {
        return prayers[i];
      }
    }
    
    // If no prayer today has passed, return Isha from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return { name: 'العشاء (أمس)', time: yesterday };
  };

  // Calculate progress between prayers
  const calculateProgress = (now: Date, previousPrayer: Date, nextPrayer: Date) => {
    const total = nextPrayer.getTime() - previousPrayer.getTime();
    const elapsed = now.getTime() - previousPrayer.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const nextPrayer = prayerTimes ? calculateNextPrayer(prayerTimes) : null;

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">مواقيت الصلاة</h1>
        <p className="text-muted-foreground">مواقيت الصلاة حسب موقعك الحالي</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Hijri date card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="ml-2 h-5 w-5 text-islamic-gold" />
              التاريخ الهجري
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hijriLoading ? (
              <Skeleton className="h-6 w-full" />
            ) : hijriDate ? (
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {hijriDate.hijri.day} {hijriDate.hijri.month.ar} {hijriDate.hijri.year}
                </div>
                <div className="text-sm text-muted-foreground">
                  {hijriDate.hijri.weekday.ar}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                تعذر تحميل التاريخ الهجري
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Location card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MapPin className="ml-2 h-5 w-5 text-islamic-blue" />
              الموقع الحالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            {locationStatus === 'loading' ? (
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <Skeleton className="h-6 w-full" />
              </div>
            ) : locationStatus === 'success' ? (
              <div className="text-center">
                <div className="font-medium">تم تحديد موقعك بنجاح</div>
                <div className="text-sm text-muted-foreground">
                  {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : ''}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="font-medium text-destructive">تعذر تحديد الموقع</div>
                <div className="text-sm text-muted-foreground">
                  تم استخدام موقع مكة المكرمة الافتراضي
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Calculation method card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="ml-2 h-5 w-5 text-islamic-teal" />
              طريقة الحساب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={calculationMethod}
              onValueChange={handleMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر طريقة الحساب" />
              </SelectTrigger>
              <SelectContent>
                {PRAYER_METHODS.map(method => (
                  <SelectItem key={method.id} value={method.id.toString()}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      {/* Next prayer card */}
      <Card className="mb-8 bg-islamic-green/10 border-islamic-green/20">
        <CardHeader>
          <CardTitle>الصلاة القادمة</CardTitle>
        </CardHeader>
        <CardContent>
          {prayerTimesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3 mx-auto" />
              <Skeleton className="h-6 w-1/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : nextPrayer ? (
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{nextPrayer.name}</div>
              <div className="text-xl mb-4">
                الوقت المتبقي: <span className="font-bold">{nextPrayer.timeRemaining}</span> ساعة
              </div>
              
              <Progress value={nextPrayer.progress} className="mb-2" />
              <div className="text-xs text-muted-foreground">
                {nextPrayer.progress.toFixed(0)}% من الوقت بين الصلاتين
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              تعذر حساب الصلاة القادمة
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prayer times list */}
        <Card>
          <CardHeader>
            <CardTitle>مواقيت الصلاة اليوم</CardTitle>
            <CardDescription>
              {prayerTimes?.date?.readable || currentTime.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prayerTimesLoading ? (
              <div className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : prayerTimes ? (
              <div className="space-y-4">
                {getPrayerTimeObject(prayerTimes).map((prayer, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {prayer.icon}
                        <span className="font-semibold mr-2">{prayer.name}</span>
                      </div>
                      <span>{prayer.time}</span>
                    </div>
                    {index < 5 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                تعذر تحميل مواقيت الصلاة
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Notifications settings */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الإشعارات</CardTitle>
            <CardDescription>
              اضبط إشعارات مواقيت الصلاة والتذكيرات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="prayer-notifications">إشعارات الصلاة</Label>
                  <div className="text-sm text-muted-foreground">
                    تلقي إشعارات عند دخول وقت الصلاة
                  </div>
                </div>
                <div className="flex items-center">
                  {notifySettings.prayerTimes ? (
                    <Bell className="ml-2 h-4 w-4 text-islamic-gold" />
                  ) : (
                    <BellOff className="ml-2 h-4 w-4" />
                  )}
                  <Switch
                    id="prayer-notifications"
                    checked={notifySettings.prayerTimes}
                    onCheckedChange={() => handleNotificationChange('prayerTimes')}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="friday-reminder">تذكير يوم الجمعة</Label>
                  <div className="text-sm text-muted-foreground">
                    تذكير بيوم الجمعة وفضل قراءة سورة الكهف
                  </div>
                </div>
                <div className="flex items-center">
                  {notifySettings.fridayReminder ? (
                    <Bell className="ml-2 h-4 w-4 text-islamic-gold" />
                  ) : (
                    <BellOff className="ml-2 h-4 w-4" />
                  )}
                  <Switch
                    id="friday-reminder"
                    checked={notifySettings.fridayReminder}
                    onCheckedChange={() => handleNotificationChange('fridayReminder')}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quran-reminder">تذكير قراءة القرآن</Label>
                  <div className="text-sm text-muted-foreground">
                    تذكير يومي بقراءة ورد من القرآن الكريم
                  </div>
                </div>
                <div className="flex items-center">
                  {notifySettings.quranReminder ? (
                    <Bell className="ml-2 h-4 w-4 text-islamic-gold" />
                  ) : (
                    <BellOff className="ml-2 h-4 w-4" />
                  )}
                  <Switch
                    id="quran-reminder"
                    checked={notifySettings.quranReminder}
                    onCheckedChange={() => handleNotificationChange('quranReminder')}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    if (Notification && Notification.permission !== "granted") {
                      Notification.requestPermission().then(permission => {
                        if (permission === "granted") {
                          toast({
                            title: "تم تفعيل الإشعارات",
                            description: "ستصلك الإشعارات عند دخول أوقات الصلاة.",
                          });
                        }
                      });
                    } else {
                      toast({
                        title: "الإشعارات مفعلة بالفعل",
                        description: "ستصلك الإشعارات عند دخول أوقات الصلاة.",
                      });
                    }
                  }}
                >
                  اختبار الإشعارات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrayerTimes;
