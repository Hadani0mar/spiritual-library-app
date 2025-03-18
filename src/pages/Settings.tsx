import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BellRing, Book, Moon, Palette, Settings as SettingsIcon, Sun, Trash, Volume2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  clearAllData, 
  getNotificationSettings, 
  getPrayerMethod, 
  getQuranViewMode, 
  getSelectedReciter, 
  setNotificationSettings, 
  setPrayerMethod, 
  setQuranViewMode, 
  setSelectedReciter 
} from "@/lib/storage";
import { PRAYER_METHODS } from "@/lib/types";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [notifySettings, setNotifySettings] = useState(getNotificationSettings());
  const [reciter, setReciter] = useState(getSelectedReciter());
  const [prayerMethod, setPrayerMethodState] = useState(getPrayerMethod().toString());
  const [quranView, setQuranViewState] = useState(getQuranViewMode());

  // Handle notification settings change
  const handleNotificationChange = (key: keyof typeof notifySettings) => {
    const newSettings = { ...notifySettings, [key]: !notifySettings[key] };
    setNotifySettings(newSettings);
    setNotificationSettings(newSettings);
    
    toast({
      title: "تم تحديث الإعدادات",
      description: "تم تحديث إعدادات الإشعارات بنجاح",
    });
  };

  // Handle reciter change
  const handleReciterChange = (value: string) => {
    setReciter(value);
    setSelectedReciter(value);
    
    toast({
      title: "تم تحديث القارئ",
      description: "تم تحديث القارئ المفضل بنجاح",
    });
  };

  // Handle prayer method change
  const handlePrayerMethodChange = (value: string) => {
    setPrayerMethodState(value);
    setPrayerMethod(parseInt(value));
    
    toast({
      title: "تم تحديث طريقة الحساب",
      description: "تم تحديث طريقة حساب مواقيت الصلاة بنجاح",
    });
  };

  // Handle Quran view mode change
  const handleQuranViewChange = (value: 'text' | 'image') => {
    setQuranViewState(value);
    setQuranViewMode(value);
    
    toast({
      title: "تم تحديث طريقة العرض",
      description: "تم تحديث طريقة عرض القرآن الكريم بنجاح",
    });
  };

  // Clear all data
  const handleClearData = () => {
    clearAllData();
    
    toast({
      title: "تم مسح البيانات",
      description: "تم مسح جميع البيانات المحفوظة بنجاح",
      variant: "default",
    });
    
    // Reset state values to defaults
    setReciter('7');
    setPrayerMethodState('2');
    setQuranViewState('text');
    setNotifySettings({ prayerTimes: true, fridayReminder: true, quranReminder: false });
    
    // Reload page after a brief delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">ضبط إعدادات التطبيق حسب تفضيلاتك</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>إعدادات التطبيق</CardTitle>
          <CardDescription>
            تخصيص إعدادات التطبيق حسب احتياجاتك
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">عام</TabsTrigger>
              <TabsTrigger value="quran">القرآن</TabsTrigger>
              <TabsTrigger value="prayer">الصلاة</TabsTrigger>
              <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">المظهر</h3>
                <p className="text-sm text-muted-foreground">
                  اختر مظهر التطبيق المفضل لديك
                </p>
                
                <RadioGroup 
                  defaultValue={theme} 
                  className="grid grid-cols-3 gap-4 pt-2"
                  onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                >
                  <div>
                    <RadioGroupItem 
                      value="light" 
                      id="theme-light" 
                      className="sr-only" 
                    />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary"
                    >
                      <Sun className="h-6 w-6 mb-2" />
                      فاتح
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="dark" 
                      id="theme-dark" 
                      className="sr-only" 
                    />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary"
                    >
                      <Moon className="h-6 w-6 mb-2" />
                      داكن
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="system" 
                      id="theme-system" 
                      className="sr-only" 
                    />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary"
                    >
                      <Palette className="h-6 w-6 mb-2" />
                      تلقائي
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">خيارات متقدمة</h3>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash className="h-4 w-4 ml-2" />
                      مسح جميع البيانات
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>مسح جميع البيانات</AlertDialogTitle>
                      <AlertDialogDescription>
                        هذا الإجراء سيؤدي إلى مسح جميع البيانات المحفوظة، بما في ذلك آخر موضع قراءة، والإعدادات، وتحديات الحفظ.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearData}>مسح البيانات</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
            
            <TabsContent value="quran" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">القارئ المفضل</h3>
                <p className="text-sm text-muted-foreground">
                  اختر القارئ المفضل لديك للاستماع إلى القرآن الكريم
                </p>
                
                <Select value={reciter} onValueChange={handleReciterChange}>
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
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">طريقة عرض القرآن</h3>
                <p className="text-sm text-muted-foreground">
                  اختر طريقة عرض القرآن الكريم المفضلة لديك
                </p>
                
                <RadioGroup 
                  value={quranView} 
                  className="grid grid-cols-2 gap-4 pt-2"
                  onValueChange={(value) => handleQuranViewChange(value as 'text' | 'image')}
                >
                  <div>
                    <RadioGroupItem 
                      value="text" 
                      id="view-text" 
                      className="sr-only" 
                    />
                    <Label
                      htmlFor="view-text"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary"
                    >
                      <Book className="h-6 w-6 mb-2" />
                      نص
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="image" 
                      id="view-image" 
                      className="sr-only" 
                    />
                    <Label
                      htmlFor="view-image"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary"
                    >
                      <Book className="h-6 w-6 mb-2" />
                      صور المصحف
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="prayer" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">طريقة حساب مواقيت الصلاة</h3>
                <p className="text-sm text-muted-foreground">
                  اختر طريقة حساب مواقيت الصلاة المناسبة لمنطقتك
                </p>
                
                <Select value={prayerMethod} onValueChange={handlePrayerMethodChange}>
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
              </div>
              
              <div className="pt-2 text-sm bg-muted/40 p-4 rounded-md">
                <p className="mb-2 font-medium">معلومات عن طرق الحساب:</p>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground mr-4">
                  <li>تختلف طرق حساب مواقيت الصلاة حسب الموقع الجغرافي والمذهب الفقهي</li>
                  <li>اختر الطريقة المتبعة في بلدك أو المنطقة التي تعيش فيها</li>
                  <li>الطريقة الافتراضية هي الجمعية الإسلامية بأمريكا الشمالية</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>إشعارات الصلاة</Label>
                    <p className="text-sm text-muted-foreground">
                      تلقي إشعارات عند دخول وقت الصلاة
                    </p>
                  </div>
                  <Switch
                    checked={notifySettings.prayerTimes}
                    onCheckedChange={() => handleNotificationChange('prayerTimes')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تذكير يوم الجمعة</Label>
                    <p className="text-sm text-muted-foreground">
                      تذكير بيوم الجمعة وفضل قراءة سورة الكهف
                    </p>
                  </div>
                  <Switch
                    checked={notifySettings.fridayReminder}
                    onCheckedChange={() => handleNotificationChange('fridayReminder')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تذكير قراءة القرآن</Label>
                    <p className="text-sm text-muted-foreground">
                      تذكير يومي بقراءة ورد من القرآن الكريم
                    </p>
                  </div>
                  <Switch
                    checked={notifySettings.quranReminder}
                    onCheckedChange={() => handleNotificationChange('quranReminder')}
                  />
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
                              description: "ستصلك الإشعارات على هذا الجهاز بناءً على إعداداتك.",
                            });
                          } else {
                            toast({
                              title: "لم يتم السماح بالإشعارات",
                              description: "يرجى السماح بالإشعارات من إعدادات المتصفح لتلقي التنبيهات.",
                              variant: "destructive",
                            });
                          }
                        });
                      } else {
                        toast({
                          title: "الإشعارات مفعلة بالفعل",
                          description: "ستصلك الإشعارات على هذا الجهاز بناءً على إعداداتك.",
                        });
                      }
                    }}
                  >
                    <BellRing className="h-4 w-4 ml-2" />
                    اختبار الإشعارات
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>تم التطوير بواسطة Bn0mar</p>
        <p className="mt-1">جميع البيانات محفوظة محليًا في متصفحك</p>
      </div>
    </div>
  );
};

export default Settings;
