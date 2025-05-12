
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function AppLayout({ children, className }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className={cn("min-h-screen flex w-full", className)}>
        {!isMobile && (
          <Sidebar>
            <SidebarContent>
              <Navbar />
            </SidebarContent>
          </Sidebar>
        )}
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {isMobile && (
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">StudyPrep</h2>
              </div>
            </header>
          )}
          
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
