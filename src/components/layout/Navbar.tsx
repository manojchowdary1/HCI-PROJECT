
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Book, Calendar, Clock, User, FileText, BarChart } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
}

const NavItem = ({ to, icon: Icon, children, active }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal hover:bg-secondary",
          active && "bg-secondary"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </Button>
    </Link>
  );
};

export function Navbar() {
  // In a real app, you would determine the active route
  const currentPath = window.location.pathname;

  return (
    <div className="flex flex-col h-full space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">StudyPrep</h2>
        <div className="space-y-1">
          <NavItem 
            to="/" 
            icon={Book} 
            active={currentPath === "/" || currentPath === "/dashboard"}
          >
            Dashboard
          </NavItem>
          <NavItem 
            to="/planner" 
            icon={Calendar}
            active={currentPath === "/planner"}
          >
            Study Planner
          </NavItem>
          <NavItem 
            to="/resources" 
            icon={FileText}
            active={currentPath === "/resources"}
          >
            Resources
          </NavItem>
          <NavItem 
            to="/pomodoro" 
            icon={Clock}
            active={currentPath === "/pomodoro"}
          >
            Pomodoro Timer
          </NavItem>
          <NavItem 
            to="/progress" 
            icon={BarChart}
            active={currentPath === "/progress"}
          >
            Progress
          </NavItem>
          <NavItem 
            to="/profile" 
            icon={User}
            active={currentPath === "/profile"}
          >
            Profile
          </NavItem>
        </div>
      </div>
    </div>
  );
}
