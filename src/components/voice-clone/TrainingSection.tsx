
import React from 'react';
import { UploadCloud } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface TrainingSectionProps {
  hasRecording: boolean;
  voiceTraining: {
    inProgress: boolean;
    progress: number;
    completed: boolean;
  };
  startVoiceTraining: () => void;
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({
  hasRecording,
  voiceTraining,
  startVoiceTraining
}) => {
  return (
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
  );
};
