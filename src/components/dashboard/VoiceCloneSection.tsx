
import React, { useState } from 'react';
import { Mic, Play, UploadCloud, X, Volume2 } from 'lucide-react';
import { DashboardCard } from '../ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const VoiceCloneSection: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceTraining, setVoiceTraining] = useState({
    inProgress: false,
    progress: 0,
    completed: false
  });
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setRecordingTime(0);
      setIsRecording(true);
      
      // Simulate recording time
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            clearInterval(interval);
            setIsRecording(false);
            setHasRecording(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  
  const startVoiceTraining = () => {
    setVoiceTraining({
      inProgress: true,
      progress: 0,
      completed: false
    });
    
    // Simulate training progress
    const interval = setInterval(() => {
      setVoiceTraining(prev => {
        const newProgress = prev.progress + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            inProgress: false,
            progress: 100,
            completed: true
          };
        }
        return {
          ...prev,
          progress: newProgress
        };
      });
    }, 100);
  };
  
  const resetRecording = () => {
    setHasRecording(false);
    setRecordingTime(0);
    setVoiceTraining({
      inProgress: false,
      progress: 0,
      completed: false
    });
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Simulate playback ending after a few seconds
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Voice Cloning</h2>
      
      <DashboardCard glass>
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Create Your AI Voice Clone</h3>
            <div className="badge-pill bg-primary/10 text-primary">
              New Feature
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Record your voice to create a personalized AI voice clone. This helps our system generate natural-sounding responses for your outbound calls.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-secondary/50 rounded-lg p-6 flex flex-col items-center justify-center relative">
              <div className="absolute top-3 right-3">
                {hasRecording && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={resetRecording} 
                    className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className={`relative mb-4 ${isRecording ? 'animate-pulse' : ''}`}>
                <div className={`h-20 w-20 rounded-full ${
                  isRecording 
                    ? 'bg-destructive/20' 
                    : hasRecording 
                    ? 'bg-primary/20' 
                    : 'bg-secondary-foreground/10'
                } flex items-center justify-center`}>
                  <Mic className={`h-8 w-8 ${
                    isRecording 
                      ? 'text-destructive' 
                      : hasRecording 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`} />
                </div>
                {isRecording && (
                  <>
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive"></span>
                    <div className="absolute inset-0 rounded-full animate-ping border-2 border-destructive opacity-75"></div>
                  </>
                )}
              </div>
              
              <div className="text-center mb-4">
                {isRecording ? (
                  <p className="text-sm text-destructive font-medium">Recording in progress...</p>
                ) : hasRecording ? (
                  <p className="text-sm text-primary font-medium">Recording complete</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Ready to record</p>
                )}
                {(isRecording || hasRecording) && (
                  <p className="text-xl font-mono mt-1">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant={isRecording ? "destructive" : "default"} 
                  onClick={toggleRecording} 
                  className="gap-2"
                >
                  {isRecording ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75"></span>
                      </span>
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      {hasRecording ? 'Record Again' : 'Start Recording'}
                    </>
                  )}
                </Button>
                
                {hasRecording && (
                  <Button 
                    variant="outline" 
                    onClick={togglePlayback} 
                    className="gap-2"
                  >
                    {isPlaying ? <Volume2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Playing...' : 'Play'}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-medium mb-2">Voice Training</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Our AI needs a minimum of 30 seconds of your voice to create an accurate clone. For best results, read naturally as if you're having a conversation.
                </p>
              </div>
              
              {hasRecording && (
                <div className="space-y-4">
                  {voiceTraining.completed ? (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg p-4 text-sm">
                      Voice clone created successfully! Your AI voice is now ready to use in calls.
                    </div>
                  ) : voiceTraining.inProgress ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Training your voice clone...</p>
                      <Progress value={voiceTraining.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground">Please wait while we process your recording.</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={startVoiceTraining} 
                      className="w-full gap-2"
                    >
                      <UploadCloud className="h-4 w-4" />
                      Start Voice Training
                    </Button>
                  )}
                </div>
              )}
              
              {!hasRecording && (
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg p-4 text-sm">
                  Please record your voice sample first to create a voice clone.
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
