import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle,
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
  XCircle,
  Sparkles
} from 'lucide-react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

// Type definitions
interface CalendarEvent {
  id: number;
  day: number;
  hour: number;
  title: string;
  time: string;
  duration: number;
  type: 'call' | 'meeting' | 'video';
  with: string;
  company: string;
  description: string;
}

// AI Agent API service
interface AIAgentService {
  processVoiceCommand: (command: string) => Promise<AIAgentResponse>;
  fetchAgentSuggestions: () => Promise<string[]>;
}

interface AIAgentResponse {
  action: 'schedule' | 'move' | 'list' | 'unknown';
  message: string;
  eventInfo?: {
    title?: string;
    day?: string | number;
    time?: string;
    with?: string;
    type?: string;
    company?: string;
    description?: string;
    originalEventId?: number;
  };
}

// AI Agent API implementation
const aiAgentService: AIAgentService = {
  processVoiceCommand: async (command: string): Promise<AIAgentResponse> => {
    try {
      const response = await fetch('/api/calendar-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process command');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        action: 'unknown',
        message: "I'm having trouble connecting to the AI service. Please try again later."
      };
    }
  },
  
  fetchAgentSuggestions: async (): Promise<string[]> => {
    try {
      const response = await fetch('/api/calendar-agent/suggestions');
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error('Error fetching agent suggestions:', error);
      return [
        "Schedule a call with Michael tomorrow at 10 AM",
        "Move my 3 PM meeting to Friday at 2 PM",
        "What's on my calendar for Thursday?"
      ];
    }
  }
};

const Calendar = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: 1, day: 1, hour: 9, title: 'Product Demo', time: '9:00 AM', duration: 1, type: 'video', with: 'Michael Chen', company: 'TechSoft', description: 'Demonstrate new AI features to potential client' },
    { id: 2, day: 1, hour: 13, title: 'Sales Call', time: '1:00 PM', duration: 0.5, type: 'call', with: 'Emma Thompson', company: 'Acme Inc', description: 'Follow-up call about the enterprise plan' },
    { id: 3, day: 2, hour: 11, title: 'Team Meeting', time: '11:00 AM', duration: 1, type: 'meeting', with: 'Sales Team', company: 'Internal', description: 'Weekly sales team sync' },
    { id: 4, day: 3, hour: 15, title: 'Client Onboarding', time: '3:00 PM', duration: 1.5, type: 'video', with: 'Olivia Johnson', company: 'FinSolutions', description: 'Onboarding session for new enterprise client' },
    { id: 5, day: 4, hour: 10, title: 'Strategy Call', time: '10:00 AM', duration: 1, type: 'call', with: 'James Wilson', company: 'DataServe', description: 'Discuss integration needs and timeline' },
  ]);
  
  // New states for AI integration
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [suggestionExamples, setSuggestionExamples] = useState<string[]>([
    "Schedule a call with Michael tomorrow at 10 AM",
    "Move my 3 PM meeting to Friday at 2 PM",
    "What's on my calendar for Thursday?"
  ]);
  const [newEventFormData, setNewEventFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'Call',
    attendees: ''
  });

  // For simulating voice recognition
  //const recognitionRef = useRef<any>(null);
  
  // Fetch suggestion examples from AI agent on component mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      const suggestions = await aiAgentService.fetchAgentSuggestions();
      if (suggestions.length > 0) {
        setSuggestionExamples(suggestions);
      }
    };
    
    fetchSuggestions();
  }, []);
  
  // // Initialize speech recognition
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  //     // @ts-ignore - This is a browser API that TypeScript might not recognize
  //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //     recognitionRef.current = new SpeechRecognition();
  //     recognitionRef.current.continuous = true;
  //     recognitionRef.current.interimResults = true;
      
  //     recognitionRef.current.onresult = (event: any) => {
  //       const transcript = Array.from(event.results)
  //         .map((result: any) => result[0])
  //         .map((result) => result.transcript)
  //         .join('');
        
  //       setVoiceInput(transcript);
  //     };
      
  //     recognitionRef.current.onerror = (event: any) => {
  //       console.error("Speech recognition error", event.error);
  //       setIsListening(false);
  //     };
  //   }

  //   return () => {
  //     if (recognitionRef.current) {
  //       recognitionRef.current.stop();
  //     }
  //   };
  // }, []);
  
  // // Toggle voice recognition
  // useEffect(() => {
  //   if (isVoiceActive) {
  //     if (recognitionRef.current) {
  //       try {
  //         recognitionRef.current.start();
  //         setIsListening(true);
  //       } catch (error) {
  //         console.error("Could not start speech recognition", error);
  //       }
  //     } else {
  //       setAiResponse("Speech recognition not supported in this browser");
  //     }
  //   } else {
  //     if (recognitionRef.current) {
  //       recognitionRef.current.stop();
  //       setIsListening(false);
  //     }
  //   }
  // }, [isVoiceActive]);
  
  // Process voice input when available
  useEffect(() => {
    if (voiceInput && isVoiceActive) {
      processVoiceCommand(voiceInput);
    }
  }, [voiceInput]);
  
  // Function to process voice commands using AI agent
  const processVoiceCommand = async (command: string) => {
    setAiProcessing(true);
    
    try {
      // Send command to AI agent
      const response = await aiAgentService.processVoiceCommand(command);
      
      // Handle the response based on the action
      switch (response.action) {
        case 'schedule':
          if (response.eventInfo) {
            addEventFromCommand(response.eventInfo);
          }
          break;
        case 'move':
          if (response.eventInfo && response.eventInfo.originalEventId) {
            updateExistingEvent(response.eventInfo);
          }
          break;
        case 'list':
          // Response message already contains the list of events
          break;
        default:
          // Unknown action, just display the response message
          break;
      }
      
      // Set the AI response message
      setAiResponse(response.message);
    } catch (error) {
      console.error('Error processing command:', error);
      setAiResponse("I had trouble processing that command. Please try again.");
    } finally {
      setAiProcessing(false);
      setVoiceInput('');
    }
  };
  
  // Update an existing event
  const updateExistingEvent = (eventInfo: AIAgentResponse['eventInfo']) => {
    if (!eventInfo || !eventInfo.originalEventId) return;
    
    setCalendarEvents(prev => {
      return prev.map(event => {
        if (event.id === eventInfo.originalEventId) {
          // Update the event properties that have changed
          const updatedEvent = { ...event };
          
          if (eventInfo.day !== undefined) {
            const dayIndex = typeof eventInfo.day === 'string' 
              ? getDayIndex(eventInfo.day) 
              : eventInfo.day;
            updatedEvent.day = dayIndex;
          }
          
          if (eventInfo.time) {
            updatedEvent.time = eventInfo.time;
            // Also update hour based on time
            updatedEvent.hour = getHourFromTimeString(eventInfo.time);
          }
          
          if (eventInfo.title) {
            updatedEvent.title = eventInfo.title;
          }
          
          if (eventInfo.with) {
            updatedEvent.with = eventInfo.with;
          }
          
          if (eventInfo.type) {
            updatedEvent.type = eventInfo.type as 'call' | 'meeting' | 'video';
          }
          
          if (eventInfo.description) {
            updatedEvent.description = eventInfo.description;
          }
          
          return updatedEvent;
        }
        return event;
      });
    });
  };
  
  // Helper function to get day index from day name
  const getDayIndex = (dayName: string): number => {
    if (dayName.toLowerCase() === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.getDay();
    } else if (dayName.toLowerCase() === 'today') {
      return new Date().getDay();
    } else {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      return dayNames.indexOf(dayName.toLowerCase());
    }
  };
  
  // Helper function to extract hour from time string
  const getHourFromTimeString = (timeString: string): number => {
    const timeMatch = timeString.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      if (timeMatch[3].toLowerCase() === 'pm' && hour < 12) {
        hour += 12;
      } else if (timeMatch[3].toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      return hour;
    }
    return 9; // Default to 9 AM if parsing fails
  };
  
  // Add event from AI agent response
  const addEventFromCommand = (eventInfo: AIAgentResponse['eventInfo']) => {
    if (!eventInfo) return;
    
    // Get day index
    let dayIndex = 0;
    if (eventInfo.day !== undefined) {
      dayIndex = typeof eventInfo.day === 'string' 
        ? getDayIndex(eventInfo.day) 
        : eventInfo.day;
    }
    
    // Get hour from time string
    let hour = 9; // Default
    if (eventInfo.time) {
      hour = getHourFromTimeString(eventInfo.time);
    }
    
    // Determine event type
    let eventType: 'call' | 'meeting' | 'video' = 'meeting';
    if (eventInfo.type) {
      if (eventInfo.type.toLowerCase().includes('call') && !eventInfo.type.toLowerCase().includes('video')) {
        eventType = 'call';
      } else if (eventInfo.type.toLowerCase().includes('video')) {
        eventType = 'video';
      }
    }
    
    // Create new event
    const newEvent: CalendarEvent = {
      id: calendarEvents.length + 1,
      day: dayIndex,
      hour,
      title: eventInfo.title || 'New Event',
      time: eventInfo.time || '9:00 AM',
      duration: 1,
      type: eventType,
      with: eventInfo.with || 'Unspecified',
      company: eventInfo.company || 'Unknown',
      description: eventInfo.description || `AI-scheduled ${eventType}`
    };
    
    setCalendarEvents(prev => [...prev, newEvent]);
  };
  
  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
    if (isVoiceActive) {
      setAiResponse('');
    }
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
  
  // Handle manual form submission
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewEventFormData({
      ...newEventFormData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleManualSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse date
    const dateObj = new Date(newEventFormData.date);
    const dayIndex = dateObj.getDay();
    
    // Parse time
    const timeMatch = newEventFormData.time.match(/(\d+):(\d+)/);
    let hour = 9;
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
    }
    
    // Create event type
    let eventType: 'call' | 'meeting' | 'video' = 'meeting';
    if (newEventFormData.type.toLowerCase().includes('call')) {
      eventType = 'call';
    } else if (newEventFormData.type.toLowerCase().includes('video')) {
      eventType = 'video';
    }
    
    // Format time for display
    const formattedTime = formatTime(newEventFormData.time);
    
    // Create new event
    const newEvent: CalendarEvent = {
      id: calendarEvents.length + 1,
      day: dayIndex,
      hour,
      title: newEventFormData.title || 'New Event',
      time: formattedTime,
      duration: 1,
      type: eventType,
      with: newEventFormData.attendees || 'Unspecified',
      company: 'Unspecified',
      description: `Manually scheduled ${eventType}`
    };
    
    setCalendarEvents([...calendarEvents, newEvent]);
    
    // Reset form
    setNewEventFormData({
      title: '',
      date: '',
      time: '',
      type: 'Call',
      attendees: ''
    });
    
    setAiResponse('Event has been scheduled!');
    setTimeout(() => setAiResponse(''), 3000);
  };
  
  // Helper to format time
  const formatTime = (timeString: string) => {
    const timeMatch = timeString.match(/(\d+):(\d+)/);
    if (!timeMatch) return '9:00 AM';
    
    const hour = parseInt(timeMatch[1]);
    const minutes = timeMatch[2];
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${period}`;
  };
  
  // Find clashes in schedule
  const findScheduleClashes = () => {
    const clashes: {event1: CalendarEvent, event2: CalendarEvent}[] = [];
    
    for (let i = 0; i < calendarEvents.length; i++) {
      for (let j = i + 1; j < calendarEvents.length; j++) {
        const event1 = calendarEvents[i];
        const event2 = calendarEvents[j];
        
        // Check if events are on the same day and overlap in time
        if (event1.day === event2.day) {
          const event1End = event1.hour + event1.duration;
          const event2End = event2.hour + event2.duration;
          
          if ((event1.hour <= event2.hour && event1End > event2.hour) || 
              (event2.hour <= event1.hour && event2End > event1.hour)) {
            clashes.push({event1, event2});
          }
        }
      }
    }
    
    return clashes;
  };
  
  // Delete an event
  const deleteEvent = (eventId: number) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== eventId));
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(null);
    }
    setAiResponse('Event has been cancelled');
    setTimeout(() => setAiResponse(''), 3000);
  };
  
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
        
        {/* AI Response Alert - Show when there's a response */}
        {aiResponse && (
          <div className={`flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg transition-opacity ${aiResponse ? 'opacity-100' : 'opacity-0'}`}>
            <Sparkles className="h-5 w-5 text-primary" />
            <p>{aiResponse}</p>
          </div>
        )}
        
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
                    <div className={`h-16 w-16 rounded-full ${isListening ? 'bg-accent animate-pulse' : 'bg-accent/20'} flex items-center justify-center`}>
                      <Mic className={`h-8 w-8 ${isListening ? 'text-white' : 'text-accent'}`} />
                    </div>
                    {isListening && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-accent rounded-full animate-ping"></span>
                    )}
                  </div>
                  
                  {aiProcessing ? (
                    <div className="text-center space-y-2 w-full">
                      <p className="text-sm">Processing your request...</p>
                      <div className="flex justify-center gap-1">
                        <span className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                        <span className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-center mb-4">
                        {isListening ? 'I\'m listening...' : 'Voice assistant is active. Try saying:'}
                        {voiceInput && <span className="block mt-1 text-accent font-medium">"{voiceInput}"</span>}
                      </p>
                      
                      <ul className="text-xs space-y-2 text-muted-foreground">
                        {suggestionExamples.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="bg-accent/20 text-accent h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">{index + 1}</span>
                            "{suggestion}"
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-background/50 rounded-lg p-4">
                  <form className="space-y-3" onSubmit={handleManualSchedule}>
                    <div>
                      <label className="text-xs text-muted-foreground">Event Title</label>
                      <input 
                        type="text" 
                        name="title"
                        value={newEventFormData.title}
                        onChange={handleFormChange}
                        placeholder="Enter title" 
                        className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Date</label>
                        <input 
                          type="date" 
                          name="date"
                          value={newEventFormData.date}
                          onChange={handleFormChange}
                          className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Time</label>
                        <input 
                          type="time" 
                          name="time"
                          value={newEventFormData.time}
                          onChange={handleFormChange}
                          className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Event Type</label>
                      <select 
                        name="type"
                        value={newEventFormData.type}
                        onChange={handleFormChange}
                        className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                      >
                        <option>Call</option>
                        <option>Video Meeting</option>
                        <option>In-person Meeting</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Attendees</label>
                      <input 
                        type="text" 
                        name="attendees"
                        value={newEventFormData.attendees}
                        onChange={handleFormChange}
                        placeholder="Add attendees" 
                        className="w-full mt-1 p-2 rounded bg-card border border-border text-sm"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Schedule Event
                    </Button>
                  </form>
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
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    selectedEvent.type === 'call' ? 'bg-blue-900/20' : 
                    selectedEvent.type === 'video' ? 'bg-purple-900/20' : 
                    'bg-green-900/20'
                  }`}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-background flex items-center justify-center">
                      {selectedEvent.type === 'call' ? <Phone className="h-5 w-5" /> :
                       selectedEvent.type === 'video' ? <Video className="h-5 w-5" /> :
                       <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedEvent.title}</h4>
                      <p className="text-xs opacity-80">with {selectedEvent.with}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{days[selectedEvent.day]}, {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.duration} hour{selectedEvent.duration !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.with}, {selectedEvent.company}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <h5 className="text-sm font-medium mb-1">Description</h5>
                    <p className="text-xs text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Edit</Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => deleteEvent(selectedEvent.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DashboardCard>
            )}
            
            {/* Schedule clashes */}
            {findScheduleClashes().length > 0 && (
              <DashboardCard className="bg-card/50 border-none">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold">Schedule Conflicts</h3>
                </div>
                
                <div className="space-y-2">
                  {findScheduleClashes().map((clash, index) => (
                    <div key={index} className="bg-background/50 p-3 rounded-lg text-sm">
                      <p className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span>
                          <strong>{clash.event1.title}</strong> and <strong>{clash.event2.title}</strong>
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground ml-5">
                        {days[clash.event1.day]} at {clash.event1.time} & {clash.event2.time}
                      </p>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            )}
            
            {/* Daily summary */}
            <DashboardCard className="bg-card/50 border-none">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Today's Schedule</h3>
              </div>
              
              <div className="space-y-2">
                {calendarEvents
                  .filter(event => event.day === new Date().getDay())
                  .sort((a, b) => a.hour - b.hour)
                  .map(event => (
                    <div 
                      key={event.id} 
                      className="bg-background/50 p-3 rounded-lg text-sm flex items-center gap-2 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`h-2 w-2 rounded-full ${
                        event.type === 'call' ? 'bg-blue-500' : 
                        event.type === 'video' ? 'bg-purple-500' : 
                        'bg-green-500'
                      }`}></div>
                      <span>{event.time} - {event.title}</span>
                    </div>
                  ))}
                  
                {calendarEvents.filter(event => event.day === new Date().getDay()).length === 0 && (
                  <div className="bg-background/50 p-3 rounded-lg text-sm text-center text-muted-foreground">
                    No events scheduled for today
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;