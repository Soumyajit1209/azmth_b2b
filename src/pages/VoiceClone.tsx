
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, Video, Play, Pause, Upload, X, Volume2 } from 'lucide-react';

const VoiceClone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
      // Simulate recording
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
  
  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 2;
      });
    }, 200);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Voice & Video Clone</h1>
          <p className="text-muted-foreground">
            Create your AI voice and video clones for outbound calls and meetings
          </p>
        </div>
        
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Clone
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video Clone
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="mt-6 space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-xl font-semibold mb-4">Record Your Voice</h3>
                <p className="text-muted-foreground mb-6">
                  Provide at least 30 seconds of speech for the best results. Read naturally as if you're having a conversation.
                </p>
                
                <div className="flex flex-col items-center bg-background/50 p-6 rounded-lg mb-6">
                  <div className={`relative mb-4 ${isRecording ? 'animate-pulse' : ''}`}>
                    <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                      isRecording 
                        ? 'bg-destructive/20' 
                        : hasRecording 
                        ? 'bg-accent/20' 
                        : 'bg-muted/20'
                    }`}>
                      <Mic className={`h-10 w-10 ${
                        isRecording ? 'text-destructive' : hasRecording ? 'text-accent' : 'text-muted-foreground'
                      }`} />
                    </div>
                    {isRecording && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse"></span>
                    )}
                  </div>
                  
                  <div className="text-center mb-6">
                    {isRecording ? (
                      <p className="text-destructive">Recording in progress...</p>
                    ) : hasRecording ? (
                      <p className="text-accent">Recording complete</p>
                    ) : (
                      <p className="text-muted-foreground">Ready to record</p>
                    )}
                    <p className="text-2xl font-mono mt-2">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </p>
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
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75"></span>
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
                      <Button variant="outline" className="gap-2">
                        <Play className="h-4 w-4" />
                        Play
                      </Button>
                    )}
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-xl font-semibold mb-4">Train Your AI Voice</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI will learn your voice patterns, speech style, and intonation to create a perfect replica.
                </p>
                
                <div className="bg-background/50 p-6 rounded-lg h-[calc(100%-100px)] flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Voice Quality</span>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">High Fidelity</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Similarity</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} className="h-1.5" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stability</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-1.5" />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {hasRecording ? (
                      isTraining ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Training Progress</span>
                            <span>{trainingProgress}%</span>
                          </div>
                          <Progress value={trainingProgress} className="h-1.5" />
                        </div>
                      ) : trainingProgress === 100 ? (
                        <div className="bg-green-900/20 text-green-400 p-4 rounded-lg">
                          Voice clone created successfully! Your AI voice is now ready to use in calls.
                        </div>
                      ) : (
                        <Button onClick={startTraining} className="w-full gap-2">
                          <Upload className="h-4 w-4" />
                          Start Training
                        </Button>
                      )
                    ) : (
                      <div className="bg-yellow-900/20 text-yellow-400 p-4 rounded-lg">
                        Please record your voice first to create a voice clone.
                      </div>
                    )}
                  </div>
                </div>
              </DashboardCard>
            </div>
            
            {trainingProgress === 100 && (
              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-xl font-semibold mb-4">Voice Clone Demo</h3>
                <p className="text-muted-foreground mb-6">
                  Listen to your AI voice clone and test it with different scripts.
                </p>
                
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="bg-background/50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium mb-4">Sample Scripts</h4>
                    <div className="space-y-4">
                      {["Hello, this is John from SalesAI. How are you today?", 
                        "I'm calling about our new product line that might interest you.", 
                        "Would you like to schedule a follow-up meeting next week?"].map((text, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-card/30 rounded-lg">
                          <p className="text-sm">{text}</p>
                          <Button variant="ghost" size="icon">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-background/50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium mb-4">Custom Text</h4>
                    <textarea 
                      className="w-full h-32 bg-card/30 border-none rounded-lg p-3 mb-4 focus:ring-accent" 
                      placeholder="Type any text to hear it in your voice clone..."
                    />
                    <Button className="gap-2">
                      <Volume2 className="h-4 w-4" />
                      Speak Text
                    </Button>
                  </div>
                </div>
              </DashboardCard>
            )}
          </TabsContent>
          
          <TabsContent value="video" className="mt-6 space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-xl font-semibold mb-4">Create Video Avatar</h3>
                <p className="text-muted-foreground mb-6">
                  Upload a short video of yourself to create an AI avatar for video calls.
                </p>
                
                <div className="flex flex-col items-center bg-background/50 p-6 rounded-lg mb-6">
                  <div className="relative mb-6 w-full aspect-video bg-black/40 rounded-lg flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground/40" />
                    <div className="absolute bottom-4 right-4">
                      <Button size="sm" variant="secondary" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Video
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <p className="text-sm text-muted-foreground">
                      For best results:
                    </p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="bg-accent/20 text-accent h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        Record a 20-30 second video with good lighting
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-accent/20 text-accent h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        Look directly at the camera and speak naturally
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-accent/20 text-accent h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        Show different expressions (smile, neutral, etc.)
                      </li>
                    </ul>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-xl font-semibold mb-4">Test Video Avatar</h3>
                <p className="text-muted-foreground mb-6">
                  Preview your AI video avatar before using it in calls.
                </p>
                
                <div className="bg-background/50 p-6 rounded-lg h-[calc(100%-100px)] flex flex-col justify-between">
                  <div className="relative w-full aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <img 
                        src="https://github.com/shadcn.png" 
                        alt="Video avatar preview" 
                        className="w-full h-full object-cover opacity-60"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="z-10 bg-background/20 backdrop-blur-sm">
                      <Play className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="px-2 py-1 rounded bg-background/30 backdrop-blur-sm text-xs">
                        Demo Preview
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Voice synchronization</span>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Enabled</span>
                    </div>
                    
                    <textarea 
                      className="w-full h-20 bg-card/30 border-none rounded-lg p-3 text-sm focus:ring-accent" 
                      placeholder="Type text for your avatar to speak..."
                      defaultValue="Hello, I'm your AI video avatar. I can represent you in video calls while maintaining your speaking style and expressions."
                    />
                    
                    <Button className="w-full">
                      Generate Demo
                    </Button>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VoiceClone;
