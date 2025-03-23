
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BadgeCheck, Phone, PhoneCall, PhoneOff, User, Users, Mic, MicOff, MessageSquare, Clock, Bot, Wand2 } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

const Calls = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  
  const toggleCall = () => {
    if (!isCallActive) {
      setIsCallActive(true);
      setCallDuration(0);
      
      // Simulate call progress
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Store interval ID to clean up later
      return () => clearInterval(interval);
    } else {
      setIsCallActive(false);
    }
  };
  
  const toggleAI = () => {
    setIsAIMode(!isAIMode);
  };
  
  const customers = [
    { id: '1', name: 'Emma Thompson', company: 'Acme Inc', lastContact: '2 days ago', status: 'Active', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Michael Chen', company: 'TechSoft', lastContact: 'Yesterday', status: 'Pending', photo: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Sophia Rodriguez', company: 'Global Media', lastContact: '1 week ago', status: 'Active', photo: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'James Wilson', company: 'DataServe', lastContact: '3 days ago', status: 'Inactive', photo: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Olivia Johnson', company: 'FinSolutions', lastContact: 'Today', status: 'Active', photo: 'https://i.pravatar.cc/150?img=5' },
  ];
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const customerDetails = customers.find(c => c.id === selectedCustomer);
  
  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Call Management</h1>
          <p className="text-muted-foreground">
            Manage your calls and switch between human and AI modes seamlessly
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="active">Active Call</TabsTrigger>
                <TabsTrigger value="recent">Recent Calls</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                <DashboardCard className="bg-card/50 border-none">
                  <div className="flex flex-col space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Active Call Control</h3>
                      {isCallActive && (
                        <div className="badge-pill bg-destructive/20 text-destructive flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                          </span>
                          Live Call
                        </div>
                      )}
                    </div>
                    
                    {!isCallActive && !selectedCustomer ? (
                      <div className="bg-background/50 rounded-lg p-8 text-center">
                        <div className="flex flex-col items-center max-w-md mx-auto">
                          <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                          <h4 className="text-lg font-medium mb-2">No Active Call</h4>
                          <p className="text-muted-foreground text-sm mb-6">
                            Select a customer from the list to initiate a call, or use the quick call button below.
                          </p>
                          <Button onClick={toggleCall} className="gap-2">
                            <PhoneCall className="h-4 w-4" />
                            Start New Call
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                        <div className="col-span-1 bg-background/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="relative mb-4">
                            {customerDetails ? (
                              <img 
                                src={customerDetails.photo} 
                                alt={customerDetails.name} 
                                className="h-20 w-20 rounded-full"
                              />
                            ) : (
                              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            
                            {isCallActive && (
                              <span className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-background"></span>
                            )}
                          </div>
                          
                          <h4 className="text-lg font-medium text-center">
                            {customerDetails ? customerDetails.name : 'Unknown Customer'}
                          </h4>
                          <p className="text-sm text-muted-foreground text-center mb-4">
                            {customerDetails ? customerDetails.company : 'No company'}
                          </p>
                          
                          {isCallActive && (
                            <div className="text-center mb-4">
                              <p className="text-sm text-muted-foreground">Duration</p>
                              <p className="text-xl font-mono">{formatTime(callDuration)}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-auto">
                            {isCallActive ? (
                              <Button variant="destructive" onClick={toggleCall} className="gap-2">
                                <PhoneOff className="h-4 w-4" />
                                End Call
                              </Button>
                            ) : (
                              <Button onClick={toggleCall} className="gap-2">
                                <PhoneCall className="h-4 w-4" />
                                Start Call
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-span-2 bg-background/50 rounded-lg p-4 flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">Call Assistant</h4>
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground mr-2">AI Mode</span>
                              <Button
                                variant={isAIMode ? "default" : "outline"}
                                size="sm"
                                className="gap-2"
                                onClick={toggleAI}
                              >
                                {isAIMode ? (
                                  <>
                                    <Bot className="h-4 w-4" />
                                    AI Speaking
                                  </>
                                ) : (
                                  <>
                                    <User className="h-4 w-4" />
                                    You Speaking
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border border-border rounded-lg p-3 flex-1 mb-4 bg-card/30 overflow-y-auto max-h-[300px]">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg rounded-tl-none">
                                  <p className="text-sm">Hi Michael, this is John from SalesAI. How are you doing today?</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg rounded-tl-none">
                                  <p className="text-sm">I'm doing well, thanks for asking. What can I help you with today?</p>
                                </div>
                              </div>
                              
                              {isAIMode && (
                                <div className="flex items-start gap-3">
                                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="bg-primary/20 p-3 rounded-lg rounded-tl-none">
                                    <p className="text-sm">I wanted to follow up on our last conversation about the CRM integration. Have you had a chance to review the proposal I sent over?</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-accent/10 rounded-lg p-3">
                              <h5 className="font-medium text-sm flex items-center gap-2 mb-2">
                                <Wand2 className="h-4 w-4 text-accent" />
                                AI Suggestions
                              </h5>
                              {isCallActive ? (
                                <div className="space-y-2">
                                  <p className="text-xs px-2 py-1 bg-accent/20 rounded-lg text-accent-foreground">
                                    Ask about their current pain points with their existing solution.
                                  </p>
                                  <p className="text-xs px-2 py-1 bg-accent/20 rounded-lg text-accent-foreground">
                                    Mention our new integration with Salesforce that addresses their needs.
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  Start a call to see real-time suggestions.
                                </p>
                              )}
                            </div>
                            
                            <div className="bg-muted/20 rounded-lg p-3">
                              <h5 className="font-medium text-sm flex items-center gap-2 mb-2">
                                <BadgeCheck className="h-4 w-4 text-primary" />
                                Notes & Follow-ups
                              </h5>
                              <ul className="text-xs space-y-1 text-muted-foreground">
                                <li className="flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                                  Last contact: Discussed pricing options
                                </li>
                                <li className="flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                                  Follow-up: Send updated proposal
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DashboardCard>
              </TabsContent>
              
              <TabsContent value="recent" className="mt-6">
                <DashboardCard className="bg-card/50 border-none">
                  <h3 className="text-xl font-semibold mb-6">Recent Calls</h3>
                  <div className="space-y-4">
                    {[
                      { id: 1, customer: 'Emma Thompson', company: 'Acme Inc', time: '10:32 AM', duration: '12m 37s', incoming: true, ai: true },
                      { id: 2, customer: 'Michael Chen', company: 'TechSoft', time: 'Yesterday', duration: '5m 12s', incoming: false, ai: false },
                      { id: 3, customer: 'Sophia Rodriguez', company: 'Global Media', time: 'Yesterday', duration: '8m 45s', incoming: true, ai: true },
                      { id: 4, customer: 'James Wilson', company: 'DataServe', time: '2 days ago', duration: '15m 22s', incoming: false, ai: false },
                      { id: 5, customer: 'Olivia Johnson', company: 'FinSolutions', time: '3 days ago', duration: '7m 18s', incoming: true, ai: true },
                    ].map((call) => (
                      <div 
                        key={call.id} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/80 transition-colors border-b border-border/20 last:border-0"
                      >
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          call.incoming ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
                        }`}>
                          <PhoneCall className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{call.customer}</p>
                              <p className="text-xs text-muted-foreground">{call.company}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground">{call.time}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-muted/30">{call.duration}</span>
                                {call.ai && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary-foreground">AI</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              </TabsContent>
              
              <TabsContent value="scheduled" className="mt-6">
                <DashboardCard className="bg-card/50 border-none">
                  <h3 className="text-xl font-semibold mb-6">Scheduled Calls</h3>
                  <div className="space-y-4">
                    {[
                      { id: 1, customer: 'Robert Garcia', company: 'Webflow Inc', time: 'Today, 3:00 PM', duration: '30m', type: 'Discovery' },
                      { id: 2, customer: 'Anna Kim', company: 'Retail Giant', time: 'Tomorrow, 10:15 AM', duration: '45m', type: 'Demo' },
                      { id: 3, customer: 'David Miller', company: 'HealthTech', time: 'Thu, Jun 15, 2:30 PM', duration: '1h', type: 'Follow-up' },
                    ].map((call) => (
                      <div 
                        key={call.id} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/80 transition-colors border-b border-border/20 last:border-0"
                      >
                        <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{call.customer}</p>
                              <p className="text-xs text-muted-foreground">{call.company}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground">{call.type}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{call.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <PhoneCall className="h-3 w-3" />
                          <span>Join</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              </TabsContent>
            </Tabs>
            
            <DashboardCard className="bg-card/50 border-none">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Call Analytics</h3>
                <select className="bg-background border border-border rounded p-1 text-sm">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <PhoneCall className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Calls</p>
                      <p className="text-2xl font-semibold">
                        <AnimatedNumber value={248} />
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">AI-Handled</p>
                      <p className="text-2xl font-semibold">
                        <AnimatedNumber value={157} />
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Human-Handled</p>
                      <p className="text-2xl font-semibold">
                        <AnimatedNumber value={91} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-48 bg-background/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Daily Call Volume</h4>
                <div className="h-32">
                  {/* Chart would go here - placeholder for now */}
                  <div className="flex h-full items-end gap-1">
                    {[35, 42, 28, 57, 68, 47, 38].map((value, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-accent/80 to-accent/20 rounded-t"
                           style={{ height: `${value}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <DashboardCard className="bg-card/50 border-none">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Customers</h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <Users className="h-3 w-3" />
                  <span>All</span>
                </Button>
              </div>
              
              <div className="space-y-1">
                {customers.map((customer) => (
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
              </div>
            </DashboardCard>
            
            {selectedCustomer && (
              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <img 
                      src={customerDetails?.photo}
                      alt={customerDetails?.name}
                      className="h-16 w-16 rounded-full mb-2"
                    />
                    <h4 className="font-medium">{customerDetails?.name}</h4>
                    <p className="text-sm text-muted-foreground">{customerDetails?.company}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>Chat</span>
                      </Button>
                      <Button size="sm" className="gap-1">
                        <PhoneCall className="h-3 w-3" />
                        <span>Call</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t border-border/20">
                    <div>
                      <p className="text-xs text-muted-foreground">Last Contact</p>
                      <p className="text-sm">{customerDetails?.lastContact}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
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
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-1.5"></span>
                          <span>Interested in premium plan</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-1.5"></span>
                          <span>Needs integration with Shopify</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            )}
            
            <DashboardCard className="bg-card/50 border-none">
              <h3 className="text-lg font-semibold mb-4">Voice Assistant</h3>
              <div className="p-4 bg-background/50 rounded-lg flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Mic className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Ask anything about your customers</p>
                  <p className="text-xs text-muted-foreground">Search data, get insights, schedule calls...</p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calls;
