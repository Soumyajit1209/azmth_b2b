
import React from 'react';
import { RecordingSection } from './RecordingSection';
import { TrainingSection } from './TrainingSection';

interface VoiceCloneContentProps {
  isRecording: boolean;
  recordingTime: number;
  hasRecording: boolean;
  isPlaying: boolean;
  voiceTraining: {
    inProgress: boolean;
    progress: number;
    completed: boolean;
  };
  toggleRecording: () => void;
  togglePlayback: () => void;
  resetRecording: () => void;
  startVoiceTraining: () => void;
}

export const VoiceCloneContent: React.FC<VoiceCloneContentProps> = ({
  isRecording,
  recordingTime,
  hasRecording,
  isPlaying,
  voiceTraining,
  toggleRecording,
  togglePlayback,
  resetRecording,
  startVoiceTraining
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <RecordingSection 
        isRecording={isRecording}
        recordingTime={recordingTime}
        hasRecording={hasRecording}
        isPlaying={isPlaying}
        toggleRecording={toggleRecording}
        togglePlayback={togglePlayback}
        resetRecording={resetRecording}
      />
      
      <TrainingSection 
        hasRecording={hasRecording}
        voiceTraining={voiceTraining}
        startVoiceTraining={startVoiceTraining}
      />
    </div>
  );
};
