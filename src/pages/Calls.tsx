import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BadgeCheck, Phone, PhoneCall, PhoneOff, User, Users, Mic, MicOff, MessageSquare, Clock, Bot, Wand2 } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Volume2, Edit, Download, Layers } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const Calls = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [dialNumber, setDialNumber] = useState('');
  const [outgoingLine, setOutgoingLine] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const toggleCall = async (targetNumber = '', fromNumber = '') => {
    if (!isCallActive) {
      setIsCallActive(true);
      setCallDuration(0);

      // Set dial info if provided
      if (targetNumber) setDialNumber(targetNumber);
      if (fromNumber) setOutgoingLine(fromNumber);

      // Start local media stream
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = localStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Simulate signaling (replace with actual signaling logic)
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Send ICE candidate to remote peer:', event.candidate);
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('Send offer to remote peer:', offer);

      // Simulate receiving a remote offer (replace this with actual signaling logic)
      setTimeout(async () => {
        const remoteOffer = {
          type: 'offer',
          sdp: 'v=0\r\n...' // Replace with a valid SDP offer from the remote peer
        };

        // Set the remote offer
        await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer));
        console.log('Remote offer set:', remoteOffer);

        // Create and set the local answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Generated Answer SDP:', answer.sdp);

        // Send the answer back to the remote peer (replace with actual signaling logic)
        console.log('Send answer to remote peer:', answer);
      }, 1000);

      // Simulate call progress
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Store interval ID to clean up later
      return () => clearInterval(interval);
    } else {
      endCall();
    }
  };

  const endCall = () => {
    setIsCallActive(false);

    // Stop local stream
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    // Close peer connection
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  useEffect(() => {
    return () => {
      endCall(); // Clean up on component unmount
    };
  }, []);

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

  // Call Dialer Component
  const CallDialer = () => {
    const [selectedNumber, setSelectedNumber] = useState('');
    const [inputNumber, setInputNumber] = useState('');
    
    const outgoingNumbers = [
      { id: '1', label: 'Office Line', number: '+1 (555) 123-4567' },
      { id: '2', label: 'Mobile', number: '+1 (555) 987-6543' },
      { id: '3', label: 'Sales Line', number: '+1 (555) 456-7890' },
    ];

    const handleCall = () => {
      if (inputNumber.trim()) {
        toggleCall(inputNumber, selectedNumber);
      }
    };

    return (
      <div className="bg-background/50 rounded-lg p-4">
        <h4 className="font-medium text-sm mb-3">Call Dialer</h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Outgoing Line</label>
            <select 
              className="w-full p-2 rounded-md border border-border bg-background"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
            >
              <option value="">Select outgoing number</option>
              {outgoingNumbers.map(line => (
                <option key={line.id} value={line.number}>
                  {line.label} ({line.number})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Dial Number</label>
            <div className="flex gap-2">
              <input
                type="tel"
                className="flex-1 p-2 rounded-md border border-border bg-background"
                placeholder="Enter phone number"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
              />
              <Button 
                onClick={handleCall}
                disabled={!selectedNumber || !inputNumber.trim()}
                className="gap-1"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
              <Button
                key={digit}
                variant="outline"
                className="h-12 w-full"
                onClick={() => setInputNumber(prev => prev + digit)}
              >
                {digit}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => setInputNumber('')}
          >
            Clear
          </Button>
        </div>
      </div>
    );
  };
  
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
                            Select a customer from the list to initiate a call, use the call dialer, or click the quick call button below.
                          </p>
                          <Button onClick={() => toggleCall()} className="gap-2">
                            <PhoneCall className="h-4 w-4" />
                            Start New Call
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                        <div className="col-span-1 bg-background/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="relative mb-4">
                            <video ref={localVideoRef} autoPlay muted className="h-20 w-20 rounded-full bg-muted" />
                            {isCallActive && (
                              <span className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-background"></span>
                            )}
                          </div>
                          
                          <h4 className="text-lg font-medium text-center">
                            {customerDetails ? customerDetails.name : (dialNumber ? dialNumber : 'Unknown Customer')}
                          </h4>
                          <p className="text-sm text-muted-foreground text-center mb-4">
                            {customerDetails ? customerDetails.company : (outgoingLine ? `Via: ${outgoingLine}` : 'No company')}
                          </p>
                          
                          {isCallActive && (
                            <div className="text-center mb-4">
                              <p className="text-sm text-muted-foreground">Duration</p>
                              <p className="text-xl font-mono">{formatTime(callDuration)}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-auto">
                            {isCallActive ? (
                              <Button variant="destructive" onClick={endCall} className="gap-2">
                                <PhoneOff className="h-4 w-4" />
                                End Call
                              </Button>
                            ) : (
                              <Button onClick={() => toggleCall()} className="gap-2">
                                <PhoneCall className="h-4 w-4" />
                                Start Call
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-span-2 bg-background/50 rounded-lg p-4 flex flex-col">
                          <div className="relative mb-4">
                            <video ref={remoteVideoRef} autoPlay className="w-full rounded-lg bg-muted" />
                          </div>
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
                    <div className={`h-2 w-2 rounded-full ${customer.status === 'Active' ? 'bg-green-500' : 
      customer.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
    }`}></div>
                  </button>
                ))}
              </div>
            </DashboardCard>
            
            <CallDialer />
            
            <DashboardCard className="bg-card/50 border-none">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toggleAI()}>
                  {isAIMode ? (
                    <>
                      <User className="h-4 w-4" />
                      <span>Switch to Human Mode</span>
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      <span>Switch to AI Mode</span>
                    </>
                  )}
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Send Follow-up Email</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Schedule Call</span>
                </Button>
              </div>
            </DashboardCard>
            
            {isCallActive && (
              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-lg font-semibold mb-4">Call Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      <span className="text-sm">Microphone</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Mute
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <span className="text-sm">Speaker Volume</span>
                    </div>
                    <div className="w-32">
                      <Slider defaultValue={[80]} max={100} step={1} />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Record Call</span>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <span className="text-sm">Background Noise</span>
                    </div>
                    <select className="bg-background border border-border rounded p-1 text-xs">
                      <option>Suppress Low</option>
                      <option>Suppress Medium</option>
                      <option>Suppress High</option>
                    </select>
                  </div>
                </div>
              </DashboardCard>
            )}
            
            {selectedCustomer && (
              <DashboardCard className="bg-card/50 border-none">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Customer Details</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                {customerDetails && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <img 
                        src={customerDetails.photo}
                        alt={customerDetails.name}
                        className="h-16 w-16 rounded-full mb-2"
                      />
                      <h4 className="font-medium">{customerDetails.name}</h4>
                      <p className="text-xs text-muted-foreground">{customerDetails.company}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-background/50 p-2 rounded flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          customerDetails.status === 'Active' ? 'bg-green-500/20 text-green-600' : 
                          customerDetails.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-600' : 
                          'bg-red-500/20 text-red-600'
                        }`}>
                          {customerDetails.status}
                        </span>
                      </div>
                      
                      <div className="bg-background/50 p-2 rounded flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Last Contact</span>
                        <span className="text-xs">{customerDetails.lastContact}</span>
                      </div>
                      
                      <div className="bg-background/50 p-2 rounded flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Account Value</span>
                        <span className="text-xs">$12,450.00</span>
                      </div>
                      
                      <div className="bg-background/50 p-2 rounded flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Satisfaction</span>
                        <div className="flex items-center">
                          <span className="text-xs mr-1">85%</span>
                          <Progress value={85} className="h-1.5 w-16" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-xs text-muted-foreground mb-1">Notes</h5>
                      <div className="bg-background/50 p-2 rounded text-xs h-20 overflow-y-auto">
                        Last call: Customer expressed interest in our premium plan. Send follow-up with pricing details and scheduler for product demo.
                      </div>
                    </div>
                  </div>
                )}
              </DashboardCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};


export default Calls;