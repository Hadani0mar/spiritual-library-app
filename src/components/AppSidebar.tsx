
import { Link, useLocation } from "react-router-dom";
import { Book, Calendar, Home, Moon, Settings, Sun, Users } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  const menuItems = [
    { title: "الرئيسية", path: "/", icon: Home },
    { title: "القرآن الكريم", path: "/quran", icon: Book },
    { title: "الأحاديث النبوية", path: "/hadith", icon: Users },
    { title: "مواقيت الصلاة", path: "/prayer-times", icon: Calendar },
    { title: "الأذكار والتسبيح", path: "/dhikr", icon: Users },
    { title: "الإعدادات", path: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-between items-center p-4">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-islamic-green text-white flex items-center justify-center">
            <Book className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">تطبيق إسلامي</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-2 space-x-reverse",
                        location.pathname === item.path ? "font-bold text-islamic-green" : ""
                      )}
                    >
                      <item.icon className="h-5 w-5 ml-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
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
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
