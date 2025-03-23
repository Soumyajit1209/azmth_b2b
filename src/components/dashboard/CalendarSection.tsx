
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { DashboardCard } from '../ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  duration: string;
  type: 'call' | 'meeting';
  participants: number;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Generate calendar days for current month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay() || 7; // Adjust to use Monday as first day (1-7)
};

// Generate sample events
const generateEvents = (date: Date): CalendarEvent[] => {
  // Only generate events for the current date and next two days
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const today = new Date();
  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isTomorrow = day === new Date(today.getTime() + 86400000).getDate() && 
                     month === new Date(today.getTime() + 86400000).getMonth() &&
                     year === new Date(today.getTime() + 86400000).getFullYear();
  const isDayAfterTomorrow = day === new Date(today.getTime() + 172800000).getDate() && 
                             month === new Date(today.getTime() + 172800000).getMonth() &&
                             year === new Date(today.getTime() + 172800000).getFullYear();
  
  if (isToday) {
    return [
      { id: 1, title: 'Client Call: TechCorp', time: '11:00 AM', duration: '30 min', type: 'call', participants: 2 },
      { id: 2, title: 'Team Meeting', time: '2:00 PM', duration: '1 hour', type: 'meeting', participants: 5 },
    ];
  } else if (isTomorrow) {
    return [
      { id: 3, title: 'Product Demo: Acme Inc', time: '10:30 AM', duration: '45 min', type: 'call', participants: 3 },
    ];
  } else if (isDayAfterTomorrow) {
    return [
      { id: 4, title: 'Sales Review', time: '9:00 AM', duration: '1 hour', type: 'meeting', participants: 7 },
      { id: 5, title: 'Follow-up: GlobalTech', time: '3:15 PM', duration: '30 min', type: 'call', participants: 2 },
    ];
  }
  
  return [];
};

export const CalendarSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMonth, setViewMonth] = useState(currentMonth);
  const [viewYear, setViewYear] = useState(currentYear);
  
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfMonth = getFirstDayOfMonth(viewYear, viewMonth) - 1; // Adjust to 0-indexed
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const events = generateEvents(selectedDate);
  
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  
  const isToday = (day: number) => {
    const now = new Date();
    return (
      day === now.getDate() &&
      viewMonth === now.getMonth() &&
      viewYear === now.getFullYear()
    );
  };
  
  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };
  
  const hasEvents = (day: number) => {
    const checkDate = new Date(viewYear, viewMonth, day);
    return generateEvents(checkDate).length > 0;
  };
  
  const handleSelectDate = (day: number) => {
    setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <DashboardCard className="lg:col-span-2" glass>
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Upcoming Schedule</h3>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="w-28 text-center font-medium">
                  {MONTHS[viewMonth]} {viewYear}
                </div>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 rounded-md"></div>
              ))}
              
              {days.map(day => {
                const hasEventsToday = hasEvents(day);
                
                return (
                  <button
                    key={day}
                    className={cn(
                      "h-10 rounded-md flex items-center justify-center relative",
                      isSelected(day) && !isToday(day) && "bg-primary/10 text-primary font-medium",
                      isToday(day) && "bg-primary text-primary-foreground font-medium",
                      !isSelected(day) && !isToday(day) && "hover:bg-secondary/80"
                    )}
                    onClick={() => handleSelectDate(day)}
                  >
                    {day}
                    {hasEventsToday && (
                      <span className={cn(
                        "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                        isToday(day) ? "bg-primary-foreground" : "bg-primary"
                      )}></span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">
                  {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}, {selectedDate.getFullYear()}
                </h4>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Add Event
                </Button>
              </div>
              
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map(event => (
                    <div 
                      key={event.id} 
                      className={cn(
                        "p-3 rounded-lg border-l-4 flex gap-4",
                        event.type === 'call' ? "border-primary bg-primary/5" : "border-accent bg-accent/5"
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                        event.type === 'call' ? "bg-primary/10" : "bg-accent/10"
                      )}>
                        {event.type === 'call' ? (
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        ) : (
                          <Users className="h-5 w-5 text-accent" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">{event.title}</h5>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{event.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span>{event.participants} participant{event.participants !== 1 && 's'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 bg-secondary/50 rounded-lg">
                    <p className="text-muted-foreground">No events scheduled for this day</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h3 className="text-lg font-semibold mb-4">Today's Overview</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="text-primary text-sm font-medium mb-1">Scheduled Calls</div>
                <div className="text-2xl font-bold">3</div>
              </div>
              
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="text-accent text-sm font-medium mb-1">Meetings</div>
                <div className="text-2xl font-bold">2</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Next Event</h4>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Client Call: TechCorp</h5>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>11:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>2 participants</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Starting in</div>
                    <div className="text-lg font-mono font-semibold">00:47:23</div>
                  </div>
                  
                  <Button size="sm" className="gap-2">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Join
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Recommendations</h4>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">AI Suggestion:</span> Schedule follow-up with Acme Inc. next week to discuss implementation timeline.
                </p>
                <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                  Schedule Now
                </Button>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
