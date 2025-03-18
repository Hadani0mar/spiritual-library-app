
import { Link } from "react-router-dom";
import { Book, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="lg:hidden bg-background shadow-sm p-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-islamic-green text-white flex items-center justify-center">
            <Book className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">تطبيق إسلامي</span>
        </Link>
        
        <div className="flex items-center">
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
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
