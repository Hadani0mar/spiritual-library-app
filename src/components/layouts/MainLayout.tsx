
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full islamic-pattern">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <MobileNav />
          <main className="flex-1 p-4 overflow-auto">
            <Outlet />
          </main>
          <footer className="p-2 text-center text-xs text-muted-foreground hidden md:block">
            تم التطوير بواسطة m0usa_0mar
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
