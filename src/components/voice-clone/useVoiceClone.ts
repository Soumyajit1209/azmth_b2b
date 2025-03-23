
import { useState } from 'react';

export const useVoiceClone = () => {
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

  return {
    isRecording,
    recordingTime,
    hasRecording,
    isPlaying,
    voiceTraining,
    toggleRecording,
    startVoiceTraining,
    resetRecording,
    togglePlayback
  };
};
