
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays,
  Clock,
  Mic,
  MicOff,
  Plus,
  ChevronLeft,
  ChevronRight, 
  MoreHorizontal,
  User,
  Video,
  Phone,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const Calendar = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<null | {
    id: number;
    title: string;
    time: string;
    type: 'call' | 'meeting' | 'video';
    with: string;
    company: string;
    description: string;
  }>(null);
  
  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };
  
  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };
  
  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const getWeekDates = () => {
    const sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - currentDate.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      return date;
    });
  };
  
  const weekDates = getWeekDates();
  
  const calendarEvents = [
    { id: 1, day: 1, hour: 9, title: 'Product Demo', time: '9:00 AM', duration: 1, type: 'video' as const, with: 'Michael Chen', company: 'TechSoft', description: 'Demonstrate new AI features to potential client' },
    { id: 2, day: 1, hour: 13, title: 'Sales Call', time: '1:00 PM', duration: 0.5, type: 'call' as const, with: 'Emma Thompson', company: 'Acme Inc', description: 'Follow-up call about the enterprise plan' },
    { id: 3, day: 2, hour: 11, title: 'Team Meeting', time: '11:00 AM', duration: 1, type: 'meeting' as const, with: 'Sales Team', company: 'Internal', description: 'Weekly sales team sync' },
    { id: 4, day: 3, hour: 15, title: 'Client Onboarding', time: '3:00 PM', duration: 1.5, type: 'video' as const, with: 'Olivia Johnson', company: 'FinSolutions', description: 'Onboarding session for new enterprise client' },
    { id: 5, day: 4, hour: 10, title: 'Strategy Call', time: '10:00 AM', duration: 1, type: 'call' as const, with: 'James Wilson', company: 'DataServe', description: 'Discuss integration needs and timeline' },
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-0.5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            </p>
            <Button 
              variant={isVoiceActive ? "default" : "outline"}
              className="gap-2"
              onClick={toggleVoice}
            >
              {isVoiceActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              {isVoiceActive ? 'Voice Active' : 'Voice Commands'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <DashboardCard className="bg-card/50 border-none p-0 overflow-hidden">
              <div className="sticky top-0 grid grid-cols-8 bg-background/70 backdrop-blur-sm border-b border-border">
                <div className="border-r border-border p-2 text-center"></div>
                {weekDates.map((date, index) => {
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <div 
                      key={index} 
                      className={`border-r last:border-r-0 border-border p-2 text-center ${isToday ? 'bg-primary/10' : ''}`}
                    >
                      <p className="text-sm font-medium">{days[index]}</p>
                      <p className={`text-lg font-mono ${isToday ? 'text-primary font-bold' : ''}`}>{date.getDate()}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="overflow-auto max-h-[600px]">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-border/60 min-h-[80px]">
                    <div className="border-r border-border/60 p-2 text-center flex flex-col items-center justify-center text-muted-foreground">
                      <span className="text-xs">{hour % 12 || 12}</span>
                      <span className="text-xs">{hour >= 12 ? 'PM' : 'AM'}</span>
                    </div>
                    
                    {Array.from({ length: 7 }, (_, day) => {
                      const eventsThisHour = calendarEvents.filter(
                        event => event.day === day && event.hour === hour
                      );
                      
                      return (
                        <div key={day} className="border-r last:border-r-0 border-border/60 p-1 relative">
                          {eventsThisHour.map(event => (
                            <div 
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className={`
                                p-1 rounded cursor-pointer text-xs mb-1
                                ${event.type === 'call' ? 'bg-blue-900/30 text-blue-400' : 
                                  event.type === 'video' ? 'bg-purple-900/30 text-purple-400' : 
                                  'bg-green-900/30 text-green-400'}
                              `}
                              style={{ height: `${event.duration * 70}px` }}
                            >
                              <div className="flex items-center gap-1">
                                {event.type === 'call' ? <Phone className="h-3 w-3" /> :
                                 event.type === 'video' ? <Video className="h-3 w-3" /> :
                                 <User className="h-3 w-3" />}
                                <span className="truncate">{event.title}</span>
                              </div>
                              <span className="text-[10px] opacity-80">{event.time}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <DashboardCard className="bg-card/50 border-none">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Add Event</h3>
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {isVoiceActive ? (
                <div className="bg-background/50 rounded-lg p-4 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                      <Mic className="h-8 w-8 text-accent" />
                    </div>
                    <span className="absolute top-0 right-0 h-4 w-4 bg-accent rounded-full animate-pulse"></span>
                  </div>
                  
                  <p className="text-sm text-center mb-4">
                    Voice assistant is active. Try saying:
                  </p>
                  
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="bg-accent/20 text-accent h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">1</span>
                      "Schedule a call with Michael tomorrow at 10 AM"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-accent/20 text-accent h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">2</span>
                      "Move my 3 PM meeting to Friday at 2 PM"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-accent/20 text-accent h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">3</span>
                      "What's on my calendar for Thursday?"
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Event Title</label>
                      <input 
                        type="text" 
                        placeholder="Enter title" 
                        className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Date</label>
                        <input 
                          type="date" 
                          className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Time</label>
                        <input 
                          type="time" 
                          className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Event Type</label>
                      <select className="w-full mt-1 p-2 rounded bg-card border border-border text-sm">
                        <option>Call</option>
                        <option>Video Meeting</option>
                        <option>In-person Meeting</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Attendees</label>
                      <input 
                        type="text" 
                        placeholder="Add attendees" 
                        className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                      />
                    </div>
                    
                    <Button className="w-full">
                      Schedule Event
                    </Button>
                  </div>
                </div>
              )}
            </DashboardCard>
            
            {selectedEvent && (
              <DashboardCard className="bg-card/50 border-none">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Event Details</h3>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      selectedEvent.type === 'call' ? 'bg-blue-900/30 text-blue-400' : 
                      selectedEvent.type === 'video' ? 'bg-purple-900/30 text-purple-400' : 
                      'bg-green-900/30 text-green-400'
                    }`}>
                      {selectedEvent.type === 'call' ? <Phone className="h-5 w-5" /> :
                       selectedEvent.type === 'video' ? <Video className="h-5 w-5" /> :
                       <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedEvent.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedEvent.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t border-border/20">
                    <div>
                      <p className="text-xs text-muted-foreground">With</p>
                      <p className="text-sm">{selectedEvent.with} • {selectedEvent.company}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm">{selectedEvent.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-1">
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button className="flex-1 gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Join
                    </Button>
                  </div>
                </div>
              </DashboardCard>
            )}
            
            <DashboardCard className="bg-card/50 border-none">
              <h3 className="font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {calendarEvents.slice(0, 3).map(event => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-background/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      event.type === 'call' ? 'bg-blue-900/30 text-blue-400' : 
                      event.type === 'video' ? 'bg-purple-900/30 text-purple-400' : 
                      'bg-green-900/30 text-green-400'
                    }`}>
                      {event.type === 'call' ? <Phone className="h-4 w-4" /> :
                       event.type === 'video' ? <Video className="h-4 w-4" /> :
                       <User className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {weekDates[event.day].toLocaleDateString('en-US', { weekday: 'short' })}, {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
