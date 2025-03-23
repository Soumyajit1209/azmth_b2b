
import React from 'react';
import { Mic, Play, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordingSectionProps {
  isRecording: boolean;
  recordingTime: number;
  hasRecording: boolean;
  isPlaying: boolean;
  toggleRecording: () => void;
  togglePlayback: () => void;
  resetRecording: () => void;
}

export const RecordingSection: React.FC<RecordingSectionProps> = ({
  isRecording,
  recordingTime,
  hasRecording,
  isPlaying,
  toggleRecording,
  togglePlayback,
  resetRecording
}) => {
  return (
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
  );
};
