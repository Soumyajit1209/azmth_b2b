import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Calendar,
  Headphones, 
  Home, 
  MessageSquare,
  Mic, 
  Phone, 
  Search, 
  Settings,
  Upload,
  User, 
  Users, 
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/clerk-react';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Analytics', icon: BarChart, path: '/analytics' },
  { name: 'Voice & Video', icon: Mic, path: '/voice-clone' },
  { name: 'Calls', icon: Phone, path: '/calls' },
  { name: 'Customers', icon: Users, path: '/customers' },
  { name: 'Calendar', icon: Calendar, path: '/calendar' },
  {name: 'Upload Document', icon: Upload, path: '/upload-doc'},
];

const secondaryNavItems: NavItem[] = [
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Help', icon: Headphones, path: '/help' }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground w-64 shrink-0 border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out z-30",
        !isOpen && "w-16 overflow-hidden" // Adjust width and hide content when closed
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
          a
        </div>
        {isOpen && ( // Conditionally render text when sidebar is open
          <div className="flex flex-col">
            <span className="text-sm font-medium">azmth</span>
            <span className="text-xs text-sidebar-foreground/60">Sales Platform</span>
          </div>
        )}
      </div>
      
      <nav className="flex flex-col gap-6 p-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2 font-normal",
                isActive(item.path) ? 
                  "bg-sidebar-accent text-sidebar-accent-foreground" : 
                  "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              asChild
            >
              <Link to={item.path}>
                <item.icon size={18} />
                {isOpen && item.name} {/* Show text only when sidebar is open */}
              </Link>
            </Button>
          ))}
        </div>
        
        <div className="border-t border-sidebar-border pt-4">
          {isOpen && ( // Conditionally render section header and items
            <>
              <h3 className="mb-1 px-2 text-xs font-medium text-sidebar-foreground/60">Support</h3>
              <div className="space-y-1">
                {secondaryNavItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2 font-normal",
                      isActive(item.path) ? 
                        "bg-sidebar-accent text-sidebar-accent-foreground" : 
                        "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    asChild
                  >
                    <Link to={item.path}>
                      <item.icon size={18} />
                      {isOpen && item.name} {/* Show text only when sidebar is open */}
                    </Link>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="mt-auto space-y-3">
          {isOpen && ( // Conditionally render footer content
            <>
              <div className="px-2">
                {/* Replace "Press Ctrl+K to search" with the search bar */}
                <form className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </form>
              </div>
            </>
          )}
          {/* Add UserButton at the bottom of the sidebar */}
          <div className="flex items-center gap-2 p-4 border-t border-sidebar-border">
            <UserButton />
          </div>
        </div>
      </nav>
    </aside>
  );
};
