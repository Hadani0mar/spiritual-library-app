import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";
import BottomNav from "@/components/BottomNav";
import { FileText } from 'lucide-react'; // استيراد أيقونة التوثيق

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full islamic-pattern">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <MobileNav />
          <main className="flex-1 p-4 pb-20 lg:pb-4 overflow-auto">
            <Outlet />
          </main>
          <BottomNav />
          <footer className="p-2 text-center text-xs text-muted-foreground hidden md:block">
            <FileText color="blue" className="inline-block mr-1" /> {/* إضافة الأيقونة */}
            تم التطوير بواسطة Bn0mar
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
