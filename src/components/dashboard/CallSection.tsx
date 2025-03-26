import React, { useState } from 'react';
import { Phone, PhoneCall, Play, Pause, Clock } from 'lucide-react';
import { DashboardCard } from '../ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const CallSection: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const toggleCall = () => {
    if (!isCallActive) {
      setIsCallActive(true);
      setProgress(0);
      
      // Simulate call progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCallActive(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    } else {
      setIsCallActive(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Call Management</h2>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <DashboardCard className="md:col-span-2" glass>
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">AI-Powered Calling</h3>
              <div className="badge-pill bg-secondary text-secondary-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Ready</span>
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-6 flex items-center justify-center">
              {isCallActive ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-subtle"></div>
                    <div className="relative z-10 h-24 w-24 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Phone className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call in progress with AI assistance...
                  </p>
                  <Progress value={progress} className="w-full max-w-xs h-1.5 mb-2" />
                  <div className="text-sm text-muted-foreground">
                    <span className="font-mono">{Math.floor(progress / 100 * 60)}s</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h4 className="text-lg font-medium mb-4">Start an AI-powered call</h4>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md">
                    Utilize our advanced AI assistant to help you during calls with real-time suggestions and insights.
                  </p>
                  <Button onClick={toggleCall} className="gap-2">
                    <PhoneCall className="h-4 w-4" />
                    Start New Call
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-accent/10 rounded-lg p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Calls</p>
                  <p className="text-2xl font-semibold">
                    <AnimatedNumber value={12} />
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Call Duration</p>
                  <p className="text-2xl font-semibold">
                    <AnimatedNumber 
                      value={127} 
                      formatter={(value) => `${Math.floor(value / 60)}m ${value % 60}s`} 
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h3 className="text-lg font-semibold mb-4">Recent Calls</h3>
          <div className="space-y-4">
            {[
              { id: 1, name: 'Jane Cooper', time: '10:32 AM', duration: '12m 37s', incoming: true },
              { id: 2, name: 'Wade Warren', time: 'Yesterday', duration: '5m 12s', incoming: false },
              { id: 3, name: 'Esther Howard', time: 'Yesterday', duration: '8m 45s', incoming: true },
            ].map((call) => (
              <div 
                key={call.id} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  call.incoming ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{call.name}</p>
                    <span className="text-xs text-muted-foreground">{call.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{call.incoming ? 'Incoming' : 'Outgoing'}</span>
                    <span>•</span>
                    <span>{call.duration}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
