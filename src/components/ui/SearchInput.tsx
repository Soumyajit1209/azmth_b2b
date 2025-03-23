
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onClose?: () => void;
  isExpanded?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  onClose, 
  isExpanded = false,
  className 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center transition-all duration-300",
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers, calls, meetings..."
          className="h-10 w-full rounded-md border border-input bg-background pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      
      {isExpanded && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close search</span>
        </button>
      )}
    </form>
  );
};
