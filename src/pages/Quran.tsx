
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Book, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSurahList, getQuranPageImageUrl, getRandomMotivation } from "@/lib/api";
import { setLastReadingPage, getLastReadingPage } from "@/lib/storage";
import { Surah } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Quran = () => {
  const { toast } = useToast();
  const [activeSurah, setActiveSurah] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(getLastReadingPage() || 1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState(getRandomMotivation());

  // Fetch list of surahs
  const { data: surahs, isLoading: surahsLoading } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahList,
  });

  useEffect(() => {
    // Show a random motivational message
    setMotivationalMessage(getRandomMotivation());
    
    // Update last reading position
    if (activePage) {
      setLastReadingPage(activePage);
    }
  }, [activeSurah, activePage]);

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) newPage = 1;
    if (newPage > 604) newPage = 604; // Total Quran pages
    
    setActivePage(newPage);
  };

  // Handle surah selection
  const handleSurahSelect = (surahNumber: number) => {
    setActiveSurah(surahNumber);
    // Map surah to approximate page number
    const surahPages: Record<number, number> = {
      1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 
      10: 208, 11: 221, 12: 235, 13: 249, 14: 255, 15: 261, 16: 267, 
      17: 282, 18: 293, 19: 305, 20: 312, 21: 322, 22: 332, 23: 342, 
      24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404, 
      31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 
      38: 453, 39: 458, 40: 467, 41: 477, 42: 483, 43: 489, 44: 496, 
      45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518, 51: 520, 
      52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 
      59: 545, 60: 549, 61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 
      66: 560, 67: 562, 68: 564, 69: 566, 70: 568, 71: 570, 72: 572, 
      73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 
      80: 585, 81: 586, 82: 587, 83: 589, 84: 590, 85: 591, 86: 592, 
      87: 593, 88: 594, 89: 595, 90: 596, 91: 596, 92: 597, 93: 598, 
      94: 598, 95: 599, 96: 599, 97: 600, 98: 600, 99: 601, 100: 601, 
      101: 602, 102: 602, 103: 603, 104: 603, 105: 603, 106: 604, 
      107: 604, 108: 604, 109: 604, 110: 604, 111: 604, 112: 604, 
      113: 604, 114: 604
    };
    
    // Set page according to surah
    if (surahPages[surahNumber]) {
      setActivePage(surahPages[surahNumber]);
    }
    
    setDropdownOpen(false);
  };

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">القرآن الكريم</h1>
          <p className="text-muted-foreground">اقرأ واستمع إلى كلام الله عز وجل</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Surah dropdown for mobile view */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>قائمة السور</CardTitle>
              <CardDescription>
                اختر سورة للقراءة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>اختر سورة</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[50vh] overflow-auto w-full">
                  {surahsLoading ? (
                    Array(10).fill(0).map((_, i) => (
                      <DropdownMenuItem key={i} disabled>
                        <Skeleton className="h-6 w-full" />
                      </DropdownMenuItem>
                    ))
                  ) : (
                    surahs?.map((surah: Surah) => (
                      <DropdownMenuItem 
                        key={surah.number}
                        onClick={() => handleSurahSelect(surah.number)}
                        className={activeSurah === surah.number ? "bg-secondary" : ""}
                      >
                        <span className="ml-2">{surah.number}.</span>
                        <span>{surah.name}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="mt-4">
                <h3 className="font-medium mb-2">عرض المصحف</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  اختر الصفحة المراد قراءتها
                </p>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    صفحة <span className="font-bold">{activePage}</span> من 604
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handlePageChange(activePage - 1)}
                    disabled={activePage <= 1}
                  >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    السابق
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handlePageChange(activePage + 1)}
                    disabled={activePage >= 604}
                  >
                    التالي
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Button>
                </div>

                <div className="mt-4">
                  <label htmlFor="page-input" className="text-sm font-medium">
                    انتقال إلى صفحة محددة:
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      id="page-input"
                      type="number"
                      min="1"
                      max="604"
                      value={activePage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (!isNaN(page) && page >= 1 && page <= 604) {
                          setActivePage(page);
                        }
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "تم الانتقال",
                          description: `تم الانتقال إلى الصفحة ${activePage}`,
                        });
                      }}
                    >
                      انتقال
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quran display */}
        <div className="md:col-span-3">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="text-center p-4">
                <div className="relative">
                  <img 
                    src={getQuranPageImageUrl(activePage)} 
                    alt={`صفحة ${activePage} من المصحف`}
                    className="max-w-full max-h-[80vh] mx-auto rounded-md shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                      toast({
                        title: "خطأ في تحميل الصورة",
                        description: "تعذر تحميل صورة المصحف. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-4">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Developer Info */}
      <Card className="mt-6 p-4">
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground">تم تطوير التطبيق بواسطة <strong>Bn0mar</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quran;
