import React, { useState } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '../ui/SearchInput';
import { UserButton } from "@clerk/clerk-react";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 border-b bg-card flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={20} />
          <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
        </Button>

        {!isSearchOpen && (
          <h1 className="text-lg font-medium text-foreground animate-fade-in md:block hidden">
            Sales Individual Dashboard
          </h1>
        )}

        <div className={`${isSearchOpen ? 'w-full md:w-96' : 'w-0 md:w-auto opacity-0 md:opacity-100'} transition-all duration-300 overflow-hidden`}>
          <SearchInput onClose={() => setIsSearchOpen(false)} isExpanded={isSearchOpen} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isSearchOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={20} />
            <span className="sr-only">Search</span>
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Replace default profile button with Clerk's UserButton */}
        <UserButton />
      </div>
    </header>
  );
};
