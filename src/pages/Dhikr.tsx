
import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Filter, Plus, RotateCcw, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  addDhikrChallenge, 
  getDhikrChallenges, 
  getDhikrCounter, 
  setDhikrCounter, 
  updateDhikrChallenge 
} from "@/lib/storage";
import { DhikrItem } from "@/lib/types";
import { getRandomMotivation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Dhikr data
const dhikrItems: DhikrItem[] = [
  {
    id: "subhanallah",
    arabicText: "سبحان الله",
    translation: "Glory be to Allah",
    transliteration: "Subhan Allah",
    count: 33,
    virtue: "تسبيح يرفع الدرجات عند الله"
  },
  {
    id: "alhamdulillah",
    arabicText: "الحمد لله",
    translation: "Praise be to Allah",
    transliteration: "Alhamdulillah",
    count: 33,
    virtue: "ذكر يملأ ميزان العبد"
  },
  {
    id: "allahuakbar",
    arabicText: "الله أكبر",
    translation: "Allah is the Greatest",
    transliteration: "Allahu Akbar",
    count: 33,
    virtue: "ذكر يعظم الله تعالى"
  },
  {
    id: "lailahaillallah",
    arabicText: "لا إله إلا الله",
    translation: "There is no god but Allah",
    transliteration: "La ilaha illallah",
    count: 100,
    virtue: "أفضل ما قاله النبي والنبيون من قبله"
  },
  {
    id: "astagfirullah",
    arabicText: "أستغفر الله",
    translation: "I seek forgiveness from Allah",
    transliteration: "Astaghfirullah",
    count: 100,
    virtue: "سبب لمغفرة الذنوب"
  },
  {
    id: "lailahaillallah",
    arabicText: "لا حول ولا قوة إلا بالله",
    translation: "There is no power or strength except with Allah",
    transliteration: "La hawla wala quwwata illa billah",
    count: 100,
    virtue: "كنز من كنوز الجنة"
  },
];

// Morning/Evening Dhikr categories
const dhikrCategories = {
  morning: dhikrItems.slice(0, 4),
  evening: dhikrItems.slice(2, 6),
  afterPrayer: dhikrItems.slice(0, 3),
  general: dhikrItems,
};

const Dhikr = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [dhikrCounters, setDhikrCounters] = useState<Record<string, number>>({});
  const [challenges, setChallenges] = useState(getDhikrChallenges());
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    target: 33,
  });
  const [motivationalMessage, setMotivationalMessage] = useState(getRandomMotivation());

  // Load saved dhikr counters
  useEffect(() => {
    const counters: Record<string, number> = {};
    dhikrItems.forEach(item => {
      counters[item.id] = getDhikrCounter(item.id);
    });
    setDhikrCounters(counters);
  }, []);

  // Update counter in localStorage when changed
  const updateCounter = (id: string, value: number) => {
    const newCounters = { ...dhikrCounters, [id]: value };
    setDhikrCounters(newCounters);
    setDhikrCounter(id, value);
  };

  // Handle dhikr count button click
  const handleCount = (id: string) => {
    const newCount = (dhikrCounters[id] || 0) + 1;
    updateCounter(id, newCount);
    
    // Check if this count completes any challenges
    challenges.forEach(challenge => {
      if (!challenge.completed) {
        const updatedChallenge = updateDhikrChallenge(challenge.id, 1);
        if (updatedChallenge?.completed) {
          showCompletionMessage(updatedChallenge.title);
        }
      }
    });
    
    // Show motivational message at intervals
    if (newCount % 33 === 0) {
      setMotivationalMessage(getRandomMotivation());
      toast({
        title: "أحسنت!",
        description: "استمر في الذكر، فإن الذكر يطمئن القلوب",
      });
    }
  };

  // Reset a counter
  const resetCounter = (id: string) => {
    updateCounter(id, 0);
  };

  // Add new challenge
  const addNewChallenge = () => {
    if (!newChallenge.title.trim()) {
      toast({
        title: "لم يتم إضافة التحدي",
        description: "يرجى إدخال عنوان للتحدي",
        variant: "destructive",
      });
      return;
    }
    
    addDhikrChallenge({
      title: newChallenge.title,
      target: newChallenge.target,
    });
    
    setChallenges(getDhikrChallenges());
    setNewChallenge({ title: "", target: 33 });
    
    toast({
      title: "تم إضافة التحدي",
      description: `تم إضافة تحدي "${newChallenge.title}" بنجاح`,
    });
  };

  // Show completion message
  const showCompletionMessage = (title: string) => {
    setChallenges(getDhikrChallenges());
    
    toast({
      title: "تم إكمال التحدي!",
      description: `لقد أكملت تحدي "${title}" بنجاح. جزاك الله خيرًا`,
      variant: "default",
    });
    
    // Show a new motivational message
    setMotivationalMessage(getRandomMotivation());
  };

  // Get dhikr items for current tab
  const getCurrentDhikrItems = () => {
    return dhikrCategories[activeTab as keyof typeof dhikrCategories] || dhikrItems;
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">الأذكار والتسبيح</h1>
        <p className="text-muted-foreground">سبّح بحمد ربك وأكثر من ذكره</p>
      </div>
      
      {/* Motivational message */}
      <Card className="mb-6 bg-islamic-gold/10 border-islamic-gold/20">
        <CardContent className="p-4">
          <p className="text-center arabic-text">{motivationalMessage}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dhikr counter section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>مسبحة الأذكار</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="general">عام</TabsTrigger>
                    <TabsTrigger value="morning">أذكار الصباح</TabsTrigger>
                    <TabsTrigger value="evening">أذكار المساء</TabsTrigger>
                    <TabsTrigger value="afterPrayer">بعد الصلاة</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>
                انقر على الذكر لزيادة العداد
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getCurrentDhikrItems().map((dhikr) => (
                  <Card 
                    key={`${dhikr.id}-${activeTab}`}
                    className="overflow-hidden"
                  >
                    <div 
                      className="p-4 bg-islamic-green/10 hover:bg-islamic-green/20 transition-colors cursor-pointer"
                      onClick={() => handleCount(dhikr.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold arabic-text">{dhikr.arabicText}</h3>
                        <Badge variant="secondary">{dhikr.count}×</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{dhikr.transliteration}</p>
                      <p className="text-sm text-muted-foreground">{dhikr.translation}</p>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center">
                      <div className="w-full mr-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">العدد الحالي:</span>
                          <span className="font-medium">{dhikrCounters[dhikr.id] || 0}</span>
                        </div>
                        <Progress 
                          value={Math.min(100, ((dhikrCounters[dhikr.id] || 0) / dhikr.count) * 100)} 
                        />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetCounter(dhikr.id);
                        }}
                        title="إعادة ضبط العداد"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardFooter className="bg-muted/50 py-2 px-4">
                      <p className="text-xs text-muted-foreground">{dhikr.virtue}</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Challenges section */}
        <div className="md:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Trophy className="ml-2 h-5 w-5 text-islamic-gold" />
                  تحديات الأذكار
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة تحدي جديد</DialogTitle>
                      <DialogDescription>
                        أضف تحديًا جديدًا للأذكار والتسبيحات
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">عنوان التحدي</label>
                        <Input
                          placeholder="مثال: قراءة سورة الملك يوميًا"
                          value={newChallenge.title}
                          onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">الهدف (عدد المرات)</label>
                        <div className="flex">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setNewChallenge({ ...newChallenge, target: Math.max(1, newChallenge.target - 10) })}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            className="mx-2 text-center"
                            value={newChallenge.target}
                            onChange={(e) => setNewChallenge({ ...newChallenge, target: parseInt(e.target.value) || 1 })}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setNewChallenge({ ...newChallenge, target: newChallenge.target + 10 })}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={addNewChallenge}>إضافة التحدي</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                ضع لنفسك أهدافًا وتحديات للأذكار
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              {challenges.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {challenges.map((challenge) => (
                      <Card key={challenge.id} className={challenge.completed ? "bg-islamic-green/5 border-islamic-green/20" : ""}>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">
                              {challenge.title}
                              {challenge.completed && (
                                <Badge className="mr-2 bg-islamic-green text-white">
                                  <Check className="h-3 w-3 ml-1" /> مكتمل
                                </Badge>
                              )}
                            </CardTitle>
                            {challenge.completed && (
                              <Star className="h-4 w-4 text-islamic-gold" />
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-2">
                          <div className="flex justify-between mb-1 text-sm">
                            <span>التقدم:</span>
                            <span>{challenge.current} / {challenge.target}</span>
                          </div>
                          <Progress 
                            value={Math.min(100, (challenge.current / challenge.target) * 100)}
                            className={challenge.completed ? "bg-islamic-green/20" : ""}
                          />
                          
                          {challenge.completed && challenge.completedAt && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              اكتمل في: {new Date(challenge.completedAt).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">لا توجد تحديات حالية</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    أضف تحديًا جديدًا للأذكار والتسبيحات للحفاظ على مداومة الذكر
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>إضافة تحدي جديد</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إضافة تحدي جديد</DialogTitle>
                        <DialogDescription>
                          أضف تحديًا جديدًا للأذكار والتسبيحات
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">عنوان التحدي</label>
                          <Input
                            placeholder="مثال: قراءة سورة الملك يوميًا"
                            value={newChallenge.title}
                            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">الهدف (عدد المرات)</label>
                          <div className="flex">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setNewChallenge({ ...newChallenge, target: Math.max(1, newChallenge.target - 10) })}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              className="mx-2 text-center"
                              value={newChallenge.target}
                              onChange={(e) => setNewChallenge({ ...newChallenge, target: parseInt(e.target.value) || 1 })}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setNewChallenge({ ...newChallenge, target: newChallenge.target + 10 })}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button onClick={addNewChallenge}>إضافة التحدي</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dhikr;
