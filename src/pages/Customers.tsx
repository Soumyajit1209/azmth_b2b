
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Mic,
  MicOff,
  BarChart,
  Phone,
  User,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Bot,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';

const Customers = () => {
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
  const toggleVoiceSearch = () => {
    setIsVoiceSearch(!isVoiceSearch);
  };
  
  const customers = [
    { id: '1', name: 'Emma Thompson', company: 'Acme Inc', email: 'emma@acme.com', phone: '+1 (555) 123-4567', status: 'Active', lastContact: '2 days ago', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Michael Chen', company: 'TechSoft', email: 'michael@techsoft.com', phone: '+1 (555) 234-5678', status: 'Pending', lastContact: 'Yesterday', photo: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Sophia Rodriguez', company: 'Global Media', email: 'sophia@globalmedia.com', phone: '+1 (555) 345-6789', status: 'Active', lastContact: '1 week ago', photo: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'James Wilson', company: 'DataServe', email: 'james@dataserve.com', phone: '+1 (555) 456-7890', status: 'Inactive', lastContact: '3 days ago', photo: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Olivia Johnson', company: 'FinSolutions', email: 'olivia@finsolutions.com', phone: '+1 (555) 567-8901', status: 'Active', lastContact: 'Today', photo: 'https://i.pravatar.cc/150?img=5' },
    { id: '6', name: 'Robert Garcia', company: 'Webflow Inc', email: 'robert@webflow.com', phone: '+1 (555) 678-9012', status: 'Active', lastContact: '5 days ago', photo: 'https://i.pravatar.cc/150?img=6' },
    { id: '7', name: 'Anna Kim', company: 'Retail Giant', email: 'anna@retailgiant.com', phone: '+1 (555) 789-0123', status: 'Pending', lastContact: '1 day ago', photo: 'https://i.pravatar.cc/150?img=7' },
    { id: '8', name: 'David Miller', company: 'HealthTech', email: 'david@healthtech.com', phone: '+1 (555) 890-1234', status: 'Active', lastContact: '4 days ago', photo: 'https://i.pravatar.cc/150?img=8' },
  ];
  
  const filteredCustomers = searchQuery
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customers;
    
  const customerDetails = customers.find(c => c.id === selectedCustomer);
  
  const interactions = [
    { id: 1, type: 'call', date: 'Today, 10:32 AM', summary: 'Discussed premium plan options', ai: true },
    { id: 2, type: 'email', date: 'Yesterday', summary: 'Sent pricing proposal', ai: false },
    { id: 3, type: 'meeting', date: '3 days ago', summary: 'Product demo with team', ai: false },
    { id: 4, type: 'call', date: '1 week ago', summary: 'Initial outreach', ai: true },
  ];
  
  const notes = [
    { id: 1, date: 'Today', note: 'Interested in enterprise plan, needs approval from IT department' },
    { id: 2, date: 'Yesterday', note: 'Mentioned budget constraints, considering quarterly payment option' },
    { id: 3, date: 'Last week', note: 'Has concerns about integration with their existing CRM' },
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships with AI-powered insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <DashboardCard className="bg-card/50 border-none">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search customers..." 
                    className="pl-8 bg-background/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant={isVoiceSearch ? "default" : "outline"} 
                  size="icon"
                  onClick={toggleVoiceSearch}
                  className={isVoiceSearch ? "bg-accent text-accent-foreground" : ""}
                >
                  {isVoiceSearch ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              {isVoiceSearch && (
                <div className="bg-background/50 rounded-lg p-3 mb-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center relative">
                    <Mic className="h-4 w-4 text-accent" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-accent rounded-full animate-pulse"></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Voice Search Active</p>
                    <p className="text-xs text-muted-foreground">Try "Find customers from TechSoft"</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-background/80 transition-colors ${
                      selectedCustomer === customer.id ? 'bg-background/80 border-l-2 border-primary' : ''
                    }`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <img 
                      src={customer.photo}
                      alt={customer.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{customer.company}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${
                      customer.status === 'Active' ? 'bg-green-400' : 
                      customer.status === 'Pending' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                  </button>
                ))}
                
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No customers found</p>
                  </div>
                )}
              </div>
            </DashboardCard>
            
            <DashboardCard className="bg-card/50 border-none">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Quick Stats</h3>
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                  <BarChart className="h-3 w-3" />
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold">{customers.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-900/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active</p>
                      <p className="text-lg font-semibold">{customers.filter(c => c.status === 'Active').length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-yellow-900/20 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-lg font-semibold">{customers.filter(c => c.status === 'Pending').length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-900/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Inactive</p>
                      <p className="text-lg font-semibold">{customers.filter(c => c.status === 'Inactive').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {selectedCustomer ? (
              <>
                <DashboardCard className="bg-card/50 border-none">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <img 
                      src={customerDetails?.photo}
                      alt={customerDetails?.name}
                      className="h-16 w-16 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h2 className="text-xl font-bold">{customerDetails?.name}</h2>
                          <p className="text-muted-foreground">{customerDetails?.company}</p>
                        </div>
                        
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          customerDetails?.status === 'Active' ? 'bg-green-900/20 text-green-400' : 
                          customerDetails?.status === 'Pending' ? 'bg-yellow-900/20 text-yellow-400' : 
                          'bg-gray-900/20 text-gray-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            customerDetails?.status === 'Active' ? 'bg-green-400' : 
                            customerDetails?.status === 'Pending' ? 'bg-yellow-400' : 'bg-gray-400'
                          }`}></span>
                          {customerDetails?.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customerDetails?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customerDetails?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Last contact: {customerDetails?.lastContact}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" className="gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>Message</span>
                      </Button>
                      <Button size="sm" className="gap-1">
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
                
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="interactions">Interactions</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DashboardCard className="bg-card/50 border-none">
                        <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
                        <div className="space-y-4">
                          <div className="bg-background/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-accent" />
                              <h4 className="text-sm font-medium">AI Sentiment Analysis</h4>
                            </div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Positive</span>
                              <span className="text-xs">78%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                          </div>
                          
                          <div className="bg-background/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-4 w-4 text-yellow-400" />
                              <h4 className="text-sm font-medium">Engagement Score</h4>
                            </div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">High</span>
                              <span className="text-xs">85/100</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                          
                          <div className="bg-background/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <BarChart className="h-4 w-4 text-primary" />
                              <h4 className="text-sm font-medium">Activity Timeline</h4>
                            </div>
                            <div className="space-y-3">
                              {[
                                { month: 'Jan', value: 12 },
                                { month: 'Feb', value: 8 },
                                { month: 'Mar', value: 15 },
                                { month: 'Apr', value: 22 },
                                { month: 'May', value: 17 },
                                { month: 'Jun', value: 28 },
                              ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <span className="text-xs w-8">{item.month}</span>
                                  <div className="h-1.5 bg-primary/80 rounded-full" style={{ width: `${item.value * 3}px` }}></div>
                                  <span className="text-xs">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DashboardCard>
                      
                      <DashboardCard className="bg-card/50 border-none">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">AI Recommendations</h3>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            Refresh
                          </Button>
                        </div>
                        
                        <div className="bg-accent/10 p-4 rounded-lg mb-4">
                          <div className="flex gap-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Next Best Action</p>
                              <p className="text-xs text-muted-foreground">Based on customer interactions</p>
                            </div>
                          </div>
                          <p className="text-sm mb-3">
                            Schedule a follow-up demo of the Enterprise plan features, focusing on the Shopify integration they asked about in the last call.
                          </p>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Schedule Demo</span>
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">More Suggestions</h4>
                          
                          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Send case study about how similar companies in their industry benefited from our solution</p>
                          </div>
                          
                          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Offer a customized pricing plan that addresses their budget constraints</p>
                          </div>
                          
                          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Connect them with our technical team to address integration concerns</p>
                          </div>
                        </div>
                      </DashboardCard>
                    </div>
                    
                    <DashboardCard className="bg-card/50 border-none">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Filter className="h-3 w-3" />
                          <span>Filter</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {interactions.slice(0, 3).map((interaction) => (
                          <div key={interaction.id} className="flex gap-3 border-b border-border/20 last:border-0 pb-4 last:pb-0">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              interaction.type === 'call' 
                                ? 'bg-blue-900/30 text-blue-400' 
                                : interaction.type === 'email'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-purple-900/30 text-purple-400'
                            }`}>
                              {interaction.type === 'call' 
                                ? <Phone className="h-4 w-4" />
                                : interaction.type === 'email'
                                ? <MessageSquare className="h-4 w-4" />
                                : <Users className="h-4 w-4" />
                              }
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium capitalize">{interaction.type}</p>
                                <div className="flex items-center gap-1">
                                  {interaction.ai && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground">AI</span>
                                  )}
                                  <span className="text-xs text-muted-foreground">{interaction.date}</span>
                                </div>
                              </div>
                              <p className="text-sm">{interaction.summary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DashboardCard>
                  </TabsContent>
                  
                  <TabsContent value="interactions" className="mt-6">
                    <DashboardCard className="bg-card/50 border-none">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Interaction History</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Filter className="h-3 w-3" />
                            <span>Filter</span>
                          </Button>
                          <Button size="sm" className="gap-1">
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {interactions.map((interaction) => (
                          <div key={interaction.id} className="flex gap-3 border-b border-border/20 last:border-0 pb-6 last:pb-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              interaction.type === 'call' 
                                ? 'bg-blue-900/30 text-blue-400' 
                                : interaction.type === 'email'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-purple-900/30 text-purple-400'
                            }`}>
                              {interaction.type === 'call' 
                                ? <Phone className="h-5 w-5" />
                                : interaction.type === 'email'
                                ? <MessageSquare className="h-5 w-5" />
                                : <Users className="h-5 w-5" />
                              }
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <p className="font-medium capitalize">{interaction.type}</p>
                                  <p className="text-xs text-muted-foreground">{interaction.date}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {interaction.ai && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground">AI-Handled</span>
                                  )}
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm mb-3">{interaction.summary}</p>
                              <div className="bg-background/50 p-3 rounded-lg text-sm">
                                <p className="mb-2 font-medium text-xs">Details:</p>
                                <p className="text-sm text-muted-foreground">
                                  {interaction.type === 'call' 
                                    ? 'Call lasted 12 minutes. Customer had questions about integration capabilities and pricing for the enterprise tier.'
                                    : interaction.type === 'email'
                                    ? 'Email contained detailed pricing information including volume discounts and payment terms. Awaiting customer response.'
                                    : 'Met with the client\'s IT team to demonstrate product features. Team was particularly interested in the API capabilities.'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DashboardCard>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-6">
                    <DashboardCard className="bg-card/50 border-none">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Notes & Follow-ups</h3>
                        <Button size="sm" className="gap-1">
                          <Plus className="h-3 w-3" />
                          <span>Add Note</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        {notes.map((note) => (
                          <div key={note.id} className="bg-background/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-xs text-muted-foreground">{note.date}</p>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm">{note.note}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-background/50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-3">Add New Note</h4>
                        <textarea 
                          className="w-full h-24 bg-card/30 border-none rounded-lg p-3 mb-3 focus:ring-accent text-sm" 
                          placeholder="Type your note here..."
                        />
                        <div className="flex justify-end">
                          <Button>Save Note</Button>
                        </div>
                      </div>
                    </DashboardCard>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="mt-6">
                    <DashboardCard className="bg-card/50 border-none">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Documents</h3>
                        <Button size="sm" className="gap-1">
                          <Plus className="h-3 w-3" />
                          <span>Upload</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { id: 1, name: 'Sales Proposal.pdf', date: 'Uploaded yesterday', size: '2.4 MB' },
                          { id: 2, name: 'Meeting Minutes.docx', date: 'Uploaded 3 days ago', size: '543 KB' },
                          { id: 3, name: 'Product Specs.pdf', date: 'Uploaded last week', size: '1.2 MB' },
                        ].map((doc) => (
                          <div key={doc.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                            <div className="h-10 w-10 rounded-lg bg-muted/20 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{doc.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">{doc.date}</p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">{doc.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </DashboardCard>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <DashboardCard className="bg-card/50 border-none h-[400px] flex flex-col items-center justify-center">
                <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold mb-1">No Customer Selected</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Select a customer from the list or use the search functionality to find a specific customer
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Customer
                </Button>
              </DashboardCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
