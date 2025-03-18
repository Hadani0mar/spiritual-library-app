
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Book, Bookmark, Play, Settings, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSurah, fetchSurahList, getQuranPageImageUrl, getRandomMotivation } from "@/lib/api";
import { 
  getLastReadingAyah, 
  getLastReadingPage, 
  getLastReadingSurah, 
  getQuranViewMode, 
  getSelectedReciter, 
  setLastReadingAyah, 
  setLastReadingPage, 
  setLastReadingSurah,
  setQuranViewMode,
} from "@/lib/storage";
import { Surah, SurahDetail } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Quran = () => {
  const { toast } = useToast();
  const [activeSurah, setActiveSurah] = useState<number>(getLastReadingSurah());
  const [activeAyah, setActiveAyah] = useState<number>(getLastReadingAyah());
  const [activePage, setActivePage] = useState<number>(getLastReadingPage());
  const [openTabs, setOpenTabs] = useState<number[]>([activeSurah]);
  const [viewMode, setViewMode] = useState<'text' | 'image'>(getQuranViewMode());
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciter, setReciter] = useState(getSelectedReciter());
  const [motivationalMessage, setMotivationalMessage] = useState("");

  // Fetch list of surahs
  const { data: surahs, isLoading: surahsLoading } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahList,
  });

  // Fetch selected surah details
  const { data: surahDetail, isLoading: surahDetailLoading } = useQuery({
    queryKey: ['surah', activeSurah],
    queryFn: () => fetchSurah(activeSurah),
    enabled: !!activeSurah,
  });

  useEffect(() => {
    // Show a random motivational message when surah changes
    setMotivationalMessage(getRandomMotivation());
    
    // Update last reading position
    if (activeSurah) {
      setLastReadingSurah(activeSurah);
    }
    if (activeAyah) {
      setLastReadingAyah(activeAyah);
    }
    if (activePage) {
      setLastReadingPage(activePage);
    }
    
    // Update view mode in localStorage
    setQuranViewMode(viewMode);
  }, [activeSurah, activeAyah, activePage, viewMode]);

  // Handle playing audio
  const playAudio = (surahNumber: number) => {
    if (audio) {
      audio.pause();
      audio.remove();
      setAudio(null);
      setIsPlaying(false);
    }

    const surahNumberStr = surahNumber.toString().padStart(3, '0');
    const audioUrl = `https://verse.mp3quran.net/arabic/${reciter}/${surahNumberStr}.mp3`;
    
    const newAudio = new Audio(audioUrl);
    newAudio.addEventListener('ended', () => setIsPlaying(false));
    newAudio.addEventListener('error', () => {
      toast({
        title: "خطأ في تشغيل الصوت",
        description: "تعذر تشغيل الصوت. يرجى التحقق من اتصالك بالإنترنت أو اختيار قارئ آخر.",
        variant: "destructive",
      });
      setIsPlaying(false);
    });
    
    newAudio.play().then(() => {
      setIsPlaying(true);
      setAudio(newAudio);
    }).catch(error => {
      console.error("Error playing audio:", error);
      toast({
        title: "خطأ في تشغيل الصوت",
        description: "تعذر تشغيل الصوت. قد يكون هذا بسبب إعدادات المتصفح أو اتصال الإنترنت.",
        variant: "destructive",
      });
    });
  };

  // Handle tab opening and closing
  const handleTabOpen = (surahNumber: number) => {
    if (!openTabs.includes(surahNumber)) {
      setOpenTabs([...openTabs, surahNumber]);
    }
    setActiveSurah(surahNumber);
    setActiveAyah(1); // Reset to first ayah when changing surah
  };

  const handleTabClose = (surahNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenTabs = openTabs.filter(tab => tab !== surahNumber);
    setOpenTabs(newOpenTabs);
    
    if (activeSurah === surahNumber && newOpenTabs.length > 0) {
      setActiveSurah(newOpenTabs[newOpenTabs.length - 1]);
    }
  };

  // Pagination for image view
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) newPage = 1;
    if (newPage > 604) newPage = 604; // Total Quran pages
    
    setActivePage(newPage);
  };

  // Format surah name with bismillah
  const formatSurahName = (surah: Surah) => {
    return `${surah.number}. ${surah.name} (${surah.englishName})`;
  };

  // Share functionality
  const shareSurah = () => {
    if (!surahDetail) return;
    
    const shareText = `سورة ${surahDetail.name} - ${surahDetail.englishName}\n\nاقرأ القرآن الكريم في تطبيقنا الإسلامي`;
    
    if (navigator.share) {
      navigator.share({
        title: `سورة ${surahDetail.name}`,
        text: shareText,
        url: window.location.href,
      }).catch(error => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "تم نسخ النص",
          description: "تم نسخ نص المشاركة إلى الحافظة.",
        });
      });
    }
  };

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">القرآن الكريم</h1>
          <p className="text-muted-foreground">اقرأ واستمع إلى كلام الله عز وجل</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'text' | 'image')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="طريقة العرض" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">نص</SelectItem>
              <SelectItem value="image">صور المصحف</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إعدادات القرآن</DialogTitle>
                <DialogDescription>
                  ضبط إعدادات قراءة القرآن واستماعه
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">اختيار القارئ</h4>
                  <Select
                    value={reciter}
                    onValueChange={setReciter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القارئ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">عبد الباسط عبد الصمد</SelectItem>
                      <SelectItem value="6">سعد الغامدي</SelectItem>
                      <SelectItem value="7">ماهر المعيقلي</SelectItem>
                      <SelectItem value="3">عبد الرحمن السديس</SelectItem>
                      <SelectItem value="128">مشاري راشد العفاسي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={shareSurah} variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Motivational message */}
      {motivationalMessage && (
        <Card className="mb-6 bg-islamic-green/5 border-islamic-green/20">
          <CardContent className="p-4">
            <p className="text-center arabic-text">{motivationalMessage}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Surah list sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>قائمة السور</CardTitle>
            <CardDescription>
              انقر على السورة لفتحها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {surahsLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full mb-2" />
                ))
              ) : (
                <div className="space-y-1">
                  {surahs?.map((surah: Surah) => (
                    <Button
                      key={surah.number}
                      variant={activeSurah === surah.number ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleTabOpen(surah.number)}
                    >
                      <span className="ml-2">{surah.number}.</span>
                      <span>{surah.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Surah content */}
        <div className="md:col-span-2 lg:col-span-3">
          {openTabs.length === 0 ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-8">
                <Book className="h-16 w-16 mx-auto mb-4 text-islamic-green opacity-50" />
                <h3 className="text-xl font-medium mb-2">اختر سورة للقراءة</h3>
                <p className="text-muted-foreground">
                  اختر سورة من القائمة على اليمين لبدء القراءة
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="border-b p-2">
                <TabsList className="flex-wrap">
                  {openTabs.map(tabId => {
                    const surah = surahs?.find((s: Surah) => s.number === tabId);
                    return surah ? (
                      <TabsTrigger
                        key={tabId}
                        value={tabId.toString()}
                        className="flex items-center"
                        onClick={() => setActiveSurah(tabId)}
                      >
                        <span className="truncate max-w-[100px]">{surah.name}</span>
                        <button
                          className="ml-1 rounded-full hover:bg-muted p-1"
                          onClick={(e) => handleTabClose(tabId, e)}
                        >
                          &times;
                        </button>
                      </TabsTrigger>
                    ) : null;
                  })}
                </TabsList>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs value={activeSurah.toString()} className="w-full">
                  {openTabs.map(tabId => (
                    <TabsContent key={tabId} value={tabId.toString()} className="m-0">
                      {viewMode === 'text' ? (
                        <div className="p-6">
                          {surahDetailLoading ? (
                            <div className="space-y-4">
                              <Skeleton className="h-10 w-full" />
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-6 w-full" />
                              <Skeleton className="h-6 w-5/6" />
                            </div>
                          ) : surahDetail ? (
                            <div>
                              <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                  {formatSurahName(surahDetail)}
                                </h2>
                                <Button
                                  onClick={() => playAudio(surahDetail.number)}
                                  variant="outline"
                                  className="flex items-center"
                                >
                                  {isPlaying ? 'إيقاف' : 'استماع'} <Play className="h-4 w-4 mr-2" />
                                </Button>
                              </div>
                              
                              {surahDetail.number !== 9 && ( // All surahs except At-Tawbah start with Bismillah
                                <div className="text-center mb-6 arabic-text text-islamic-green text-xl">
                                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                                </div>
                              )}
                              
                              <div className="space-y-4">
                                {surahDetail.ayahs.map((ayah) => (
                                  <div 
                                    key={ayah.number} 
                                    className={`p-2 rounded-md arabic-text text-lg leading-loose ${
                                      ayah.numberInSurah === activeAyah ? 'bg-islamic-green/10' : ''
                                    }`}
                                    onClick={() => setActiveAyah(ayah.numberInSurah)}
                                  >
                                    {ayah.text} 
                                    <span className="inline-block mr-2 p-1 bg-islamic-gold/20 text-islamic-darkGreen rounded-full text-sm">
                                      {ayah.numberInSurah}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p>لم يتم العثور على معلومات السورة</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <div className="flex justify-between items-center mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(activePage - 1)}
                              disabled={activePage <= 1}
                            >
                              <ArrowRight className="h-4 w-4 ml-2" />
                              الصفحة السابقة
                            </Button>
                            
                            <div className="text-sm">
                              صفحة <span className="font-bold">{activePage}</span> من 604
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(activePage + 1)}
                              disabled={activePage >= 604}
                            >
                              الصفحة التالية
                              <ArrowLeft className="h-4 w-4 mr-2" />
                            </Button>
                          </div>
                          
                          <div className="relative">
                            <img 
                              src={getQuranPageImageUrl(activePage)} 
                              alt={`صفحة ${activePage} من المصحف`}
                              className="max-w-full max-h-[70vh] mx-auto rounded-md shadow-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=خطأ+في+تحميل+الصفحة';
                              }}
                            />
                            
                            <Button 
                              variant="outline"
                              size="icon"
                              className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm"
                              onClick={() => {
                                toast({
                                  title: "تم حفظ الموقع",
                                  description: `تم حفظ موقع القراءة عند الصفحة ${activePage}`,
                                });
                              }}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quran;
