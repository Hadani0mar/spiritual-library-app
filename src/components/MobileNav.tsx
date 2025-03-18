
import { Link, useLocation } from "react-router-dom";
import { Book, Calendar, Home, Menu, Moon, Settings, Sun, Users, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const menuItems = [
    { title: "الرئيسية", path: "/", icon: Home },
    { title: "القرآن الكريم", path: "/quran", icon: Book },
    { title: "الأحاديث النبوية", path: "/hadith", icon: Users },
    { title: "مواقيت الصلاة", path: "/prayer-times", icon: Calendar },
    { title: "الأذكار والتسبيح", path: "/dhikr", icon: Users },
    { title: "الإعدادات", path: "/settings", icon: Settings },
  ];

  return (
    <div className="lg:hidden bg-background shadow-sm p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-islamic-green text-white flex items-center justify-center">
            <Book className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">تطبيق إسلامي</span>
        </Link>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-islamic-green text-white flex items-center justify-center">
                      <Book className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold">تطبيق إسلامي</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-2 space-x-reverse p-2 rounded-md hover:bg-muted",
                        location.pathname === item.path ? "font-bold text-islamic-green bg-muted" : ""
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-5 w-5 ml-2" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
                  تم التطوير بواسطة m0usa_0mar
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
