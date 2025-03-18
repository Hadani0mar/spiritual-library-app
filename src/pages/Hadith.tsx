
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book, Copy, Search, Share2, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { fetchHadithCollections, fetchHadithsByCollection } from "@/lib/api";
import { Hadith as HadithType } from "@/lib/types";

const Hadith = () => {
  const { toast } = useToast();
  const [selectedCollection, setSelectedCollection] = useState("bukhari");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch hadith collections
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['hadithCollections'],
    queryFn: fetchHadithCollections,
  });

  // Fetch hadiths for selected collection
  const { data: hadiths, isLoading: hadithsLoading } = useQuery({
    queryKey: ['hadiths', selectedCollection, page, limit],
    queryFn: () => fetchHadithsByCollection(selectedCollection, page, limit),
    enabled: !!selectedCollection,
  });

  // Filter hadiths based on search term
  const filteredHadiths = hadiths?.filter((hadith: HadithType) => 
    !searchTerm || hadith.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy hadith to clipboard
  const copyHadith = (hadith: HadithType) => {
    const hadithText = `${hadith.text}\n\n[${hadith.collection}, Hadith ${hadith.hadithNumber}]`;
    
    navigator.clipboard.writeText(hadithText).then(() => {
      toast({
        title: "تم نسخ الحديث",
        description: "تم نسخ الحديث إلى الحافظة",
      });
    });
  };

  // Share hadith
  const shareHadith = (hadith: HadithType) => {
    const hadithText = `${hadith.text}\n\n[${hadith.collection}, Hadith ${hadith.hadithNumber}]`;
    
    if (navigator.share) {
      navigator.share({
        title: `Hadith ${hadith.hadithNumber} - ${hadith.collection}`,
        text: hadithText,
      }).catch(error => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(hadithText).then(() => {
        toast({
          title: "تم نسخ الحديث",
          description: "تم نسخ الحديث إلى الحافظة لمشاركته",
        });
      });
    }
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">الأحاديث النبوية</h1>
        <p className="text-muted-foreground">اقرأ وابحث في الأحاديث النبوية الشريفة</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Collections sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>المجموعات</CardTitle>
            <CardDescription>
              اختر مجموعة للاطلاع على الأحاديث
            </CardDescription>
          </CardHeader>
          <CardContent>
            {collectionsLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full mb-2" />
              ))
            ) : collections ? (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-1">
                  {collections.map((collection: any) => (
                    <Button
                      key={collection.name}
                      variant={selectedCollection === collection.name ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedCollection(collection.name);
                        setPage(1);
                      }}
                    >
                      <Users className="ml-2 h-4 w-4" />
                      <span>{collection.title}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-4">
                <p>تعذر تحميل المجموعات</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Hadiths content */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>
                {collections?.find((c: any) => c.name === selectedCollection)?.title || "الأحاديث"}
              </CardTitle>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في الأحاديث..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {hadithsLoading ? (
              <div className="space-y-6">
                {Array(5).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredHadiths?.length > 0 ? (
              <div className="space-y-6">
                {filteredHadiths.map((hadith: HadithType) => (
                  <Card key={hadith.hadithNumber} className="bg-card hover:bg-muted/30 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          حديث رقم {hadith.hadithNumber}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyHadith(hadith)}
                            title="نسخ الحديث"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => shareHadith(hadith)}
                            title="مشاركة الحديث"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="arabic-text leading-relaxed text-lg" dir="rtl">
                        {hadith.text}
                      </p>
                      
                      {hadith.grades?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {hadith.grades.map((grade, index) => (
                            <Badge key={index} variant="secondary">
                              {grade.grade}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {/* Pagination */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    الصفحة السابقة
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    صفحة {page}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={filteredHadiths.length < limit}
                  >
                    الصفحة التالية
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-medium mb-2">لم يتم العثور على أحاديث</h3>
                {searchTerm ? (
                  <p className="text-muted-foreground">
                    لم يتم العثور على أي حديث يطابق "{searchTerm}"
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    قم باختيار مجموعة أخرى أو تغيير معايير البحث
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Hadith;
