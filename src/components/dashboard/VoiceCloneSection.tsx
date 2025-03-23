
import React from 'react';
import { DashboardCard } from '../ui/DashboardCard';
import { VoiceCloneHeader } from '../voice-clone/VoiceCloneHeader';
import { VoiceCloneContent } from '../voice-clone/VoiceCloneContent';
import { useVoiceClone } from '../voice-clone/useVoiceClone';

export const VoiceCloneSection: React.FC = () => {
  const {
    isRecording,
    recordingTime,
    hasRecording,
    isPlaying,
    voiceTraining,
    toggleRecording,
    startVoiceTraining,
    resetRecording,
    togglePlayback
  } = useVoiceClone();

  return (
    <>
      <VoiceCloneHeader />
      
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
          
          <VoiceCloneContent 
            isRecording={isRecording}
            recordingTime={recordingTime}
            hasRecording={hasRecording}
            isPlaying={isPlaying}
            voiceTraining={voiceTraining}
            toggleRecording={toggleRecording}
            startVoiceTraining={startVoiceTraining}
            resetRecording={resetRecording}
            togglePlayback={togglePlayback}
          />
        </div>
      </DashboardCard>
    </>
  );
};
