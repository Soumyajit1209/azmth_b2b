
import React, { useState } from 'react';
import { Search, User, MessageSquare, Phone, Clock, ArrowRight } from 'lucide-react';
import { DashboardCard } from '../ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Customer {
  id: number;
  name: string;
  company: string;
  phone: string;
  lastInteraction: string;
  profileImage?: string;
}

const customers: Customer[] = [
  {
    id: 1,
    name: 'Jane Cooper',
    company: 'Apple Inc.',
    phone: '+1 (555) 123-4567',
    lastInteraction: '2 hours ago',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&q=80'
  },
  {
    id: 2,
    name: 'Robert Fox',
    company: 'Google LLC',
    phone: '+1 (555) 234-5678',
    lastInteraction: 'Yesterday',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&auto=format&q=80'
  },
  {
    id: 3,
    name: 'Esther Howard',
    company: 'Microsoft Corp',
    phone: '+1 (555) 345-6789',
    lastInteraction: '3 days ago',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&q=80'
  }
];

export const CustomerSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.company.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query)
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Customer Insights</h2>
      
      <DashboardCard glass>
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">RAG-Powered Customer Search</h3>
            <div className="badge-pill bg-secondary text-secondary-foreground">
              AI Enabled
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Find customers and retrieve their complete history with semantic search powered by our AI retrieval system.
          </p>
          
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, company, or phone number..."
              className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-28 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button 
              type="submit" 
              className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div>
              {searchResults.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-secondary/50">
                    <p className="text-sm font-medium">
                      Found {searchResults.length} matching customer{searchResults.length !== 1 && 's'}
                    </p>
                  </div>
                  <div className="divide-y">
                    {searchResults.map(customer => (
                      <div 
                        key={customer.id} 
                        className={cn(
                          "p-4 hover:bg-secondary/50 transition-colors cursor-pointer",
                          selectedCustomer?.id === customer.id && "bg-secondary/50"
                        )}
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                            {customer.profileImage ? (
                              <img 
                                src={customer.profileImage} 
                                alt={customer.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{customer.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{customer.company}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 flex-shrink-0"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : query && !isSearching ? (
                <div className="bg-secondary/50 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">No customers found matching "{query}"</p>
                </div>
              ) : (
                <div className="bg-secondary/50 rounded-lg p-6 text-center">
                  {isSearching ? (
                    <p className="text-muted-foreground">Searching for customers...</p>
                  ) : (
                    <p className="text-muted-foreground">Search for a customer to see their details</p>
                  )}
                </div>
              )}
            </div>
            
            <div>
              {selectedCustomer ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b bg-secondary/50 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-secondary overflow-hidden">
                      {selectedCustomer.profileImage ? (
                        <img 
                          src={selectedCustomer.profileImage} 
                          alt={selectedCustomer.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{selectedCustomer.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.company}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Phone className="h-3.5 w-3.5" />
                          <span>Phone</span>
                        </div>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                      
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Last Interaction</span>
                        </div>
                        <p className="font-medium">{selectedCustomer.lastInteraction}</p>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">Interaction History</h5>
                        <span className="text-xs text-muted-foreground">Last 30 days</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3 p-3 bg-background rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium">Phone Call</p>
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Discussion about new product features</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 p-3 bg-background rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium">Email</p>
                              <span className="text-xs text-muted-foreground">Yesterday</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Sent pricing proposal for enterprise plan</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg h-full flex items-center justify-center p-6 bg-secondary/30">
                  <div className="text-center max-w-sm">
                    <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h4 className="text-lg font-medium mb-2">No customer selected</h4>
                    <p className="text-sm text-muted-foreground">
                      Search and select a customer to view their complete profile and interaction history.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
