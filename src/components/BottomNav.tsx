
import { Link, useLocation } from "react-router-dom";
import { Book, Calendar, Home, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { title: "الرئيسية", path: "/", icon: Home },
    { title: "القرآن", path: "/quran", icon: Book },
    { title: "الأحاديث", path: "/hadith", icon: Users },
    { title: "الصلاة", path: "/prayer-times", icon: Calendar },
    { title: "الإعدادات", path: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t shadow-lg lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 transition-colors",
              location.pathname === item.path
                ? "text-islamic-green font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
