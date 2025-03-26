import React, { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  Video,
  Play,
  Pause,
  Upload,
  X,
  Volume2,
  PauseCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

const VoiceClone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (audioSourceRef.current) {
        URL.revokeObjectURL(audioSourceRef.current);
      }
    };
  }, [audioBlob]);

  // Function to start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create blob from recorded chunks
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      // Start timer
      setRecordingTime(0);
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      setIsRecording(true);
      toast.info("Recording started", {
        description: "Speak naturally for the best voice clone result.",
        icon: <Mic className="h-4 w-4" />,
      });
    } catch (error) {
      console.error("Error accessing microphone", error);
      toast.error("Microphone Access Failed", {
        description: "Please check your microphone permissions and try again.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecording(true);

      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      toast.success("Recording Stopped", {
        description: `Total recording time: ${recordingTime} seconds`,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
    }
  };

  // Function to send recording to backend
  const sendRecordingToBackend = async () => {
    if (!audioBlob) {
      toast.error("No Recording Available", {
        description: "Please record your voice before training.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      return;
    }

    // Create FormData to send file
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      // Start training state
      setIsTraining(true);
      setTrainingProgress(0);

      toast.info("Training Started", {
        description: "Your voice clone is being processed...",
        icon: <Upload className="h-4 w-4" />,
      });

      // Send to backend API
      const response = await axios.post("/api/voice-clone/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setTrainingProgress(percentCompleted);
        },
      });

      // Handle successful upload
      if (response.data.success) {
        // Training complete
        setTrainingProgress(100);
        toast.success("Voice Clone Created", {
          description: "Your AI voice is now ready to use!",
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      } else {
        // Handle error from backend
        toast.error("Voice Clone Training Failed", {
          description: response.data.message || "Please try again.",
          icon: <AlertTriangle className="h-4 w-4" />,
        });
        setIsTraining(false);
      }
    } catch (error) {
      console.error("Error uploading recording", error);
      toast.error("Upload Failed", {
        description: "Could not upload your recording. Please try again.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      setIsTraining(false);
    }
  };

  // Function to play/pause recorded audio
  const toggleAudioPlayback = () => {
    if (!audioBlob) {
      toast.error("No Recording Available", {
        description: "Please record your voice first.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      return;
    }

    // If no audio element exists or source has changed, create a new one
    if (!audioRef.current || !audioSourceRef.current) {
      // Revoke previous object URL if it exists
      if (audioSourceRef.current) {
        URL.revokeObjectURL(audioSourceRef.current);
      }

      // Create new object URL
      const audioURL = URL.createObjectURL(audioBlob);
      audioSourceRef.current = audioURL;

      // Create new audio element
      const audio = new Audio(audioURL);

      // Set up event listeners
      audio.onended = () => {
        setIsPlaying(false);
        toast.info("Playback Finished", {
          description: "Audio playback has completed.",
          icon: <Volume2 className="h-4 w-4" />,
        });
      };

      audioRef.current = audio;
    }

    // Ensure audio reference exists
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast.info("Playback Paused", {
          description: "Your recording is paused.",
          icon: <PauseCircle className="h-4 w-4" />,
        });
      } else {
        // Use a promise to handle play() which can throw an error
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          toast.error("Playback Error", {
            description: "Could not play the audio. Please try again.",
            icon: <AlertTriangle className="h-4 w-4" />,
          });
        });
        setIsPlaying(true);
        toast.info("Playback Started", {
          description: "Playing your voice recording.",
          icon: <Play className="h-4 w-4" />,
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">
            Voice & Video Clone
          </h1>
          <p className="text-muted-foreground">
            Create your AI voice and video clones for outbound calls and
            meetings
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
                <h3 className="text-xl font-semibold mb-4">
                  Record Your Voice
                </h3>
                <p className="text-muted-foreground mb-6">
                  Provide at least 30 seconds of speech for the best results.
                  Read naturally as if you're having a conversation.
                </p>

                <div className="flex flex-col items-center bg-background/50 p-6 rounded-lg mb-6">
                  <div
                    className={`relative mb-4 ${
                      isRecording ? "animate-pulse" : ""
                    }`}
                  >
                    <div
                      className={`h-24 w-24 rounded-full flex items-center justify-center ${
                        isRecording
                          ? "bg-destructive/20"
                          : hasRecording
                          ? "bg-accent/20"
                          : "bg-muted/20"
                      }`}
                    >
                      <Mic
                        className={`h-10 w-10 ${
                          isRecording
                            ? "text-destructive"
                            : hasRecording
                            ? "text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    {isRecording && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse"></span>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    {isRecording ? (
                      <p className="text-destructive">
                        Recording in progress...
                      </p>
                    ) : hasRecording ? (
                      <p className="text-accent">Recording complete</p>
                    ) : (
                      <p className="text-muted-foreground">Ready to record</p>
                    )}
                    <p className="text-2xl font-mono mt-2">
                      {Math.floor(recordingTime / 60)}:
                      {(recordingTime % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant={isRecording ? "destructive" : "default"}
                    onClick={isRecording ? stopRecording : startRecording}
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
                        {hasRecording ? "Record Again" : "Start Recording"}
                      </>
                    )}
                  </Button>

                  {hasRecording && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={toggleAudioPlayback}
                    >
                      {isPlaying ? (
                        <>
                          <PauseCircle className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Play
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </DashboardCard>

              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-xl font-semibold mb-4">
                  Train Your AI Voice
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our AI will learn your voice patterns, speech style, and
                  intonation to create a perfect replica.
                </p>

                <div className="bg-background/50 p-6 rounded-lg h-[calc(100%-100px)] flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Voice Quality</span>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        High Fidelity
                      </span>
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
                          <Progress
                            value={trainingProgress}
                            className="h-1.5"
                          />
                        </div>
                      ) : trainingProgress === 100 ? (
                        <div className="bg-green-900/20 text-green-400 p-4 rounded-lg">
                          Voice clone created successfully! Your AI voice is now
                          ready to use in calls.
                        </div>
                      ) : (
                        <Button
                          onClick={sendRecordingToBackend}
                          className="w-full gap-2"
                        >
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
                  Listen to your AI voice clone and test it with different
                  scripts.
                </p>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="bg-background/50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium mb-4">Sample Scripts</h4>
                    <div className="space-y-4">
                      {[
                        "Hello, this is John from SalesAI. How are you today?",
                        "I'm calling about our new product line that might interest you.",
                        "Would you like to schedule a follow-up meeting next week?",
                      ].map((text, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-3 bg-card/30 rounded-lg"
                        >
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
                <h3 className="text-xl font-semibold mb-4">
                  Create Video Avatar
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload a short video of yourself to create an AI avatar for
                  video calls.
                </p>

                <div className="flex flex-col items-center bg-background/50 p-6 rounded-lg mb-6">
                  <div className="relative mb-6 w-full aspect-video bg-black/40 rounded-lg flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground/40" />
                    <div className="absolute bottom-4 right-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-2"
                        disabled
                      >
                        <Upload className="h-4 w-4" />
                        Upload Video
                      </Button>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="bg-yellow-900/20 text-yellow-400 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">
                          Feature Unavailable
                        </span>
                      </div>
                      <p className="text-sm">
                        Video clone feature is not available in the current app
                        version. Stay tuned for future updates!
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      For best results:
                    </p>
                    <ul className="text-sm space-y-2 text-muted-foreground opacity-50">
                      <li className="flex items-start gap-2">
                        <span className="bg-accent/20 text-accent h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          1
                        </span>
                        Record a 20-30 second video with good lighting
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-accent/20 text-accent h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          2
                        </span>
                        Look directly at the camera and speak naturally
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-accent/20 text-accent h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          3
                        </span>
                        Show different expressions (smile, neutral, etc.)
                      </li>
                    </ul>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard className="bg-card/50 border-none">
                <h3 className="text-xl font-semibold mb-4">
                  Test Video Avatar
                </h3>
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
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                      <p className="text-yellow-400 text-sm">
                        Feature Unavailable
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center opacity-50">
                      <span className="text-sm">Voice synchronization</span>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        Disabled
                      </span>
                    </div>

                    <textarea
                      className="w-full h-20 bg-card/30 border-none rounded-lg p-3 text-sm focus:ring-accent opacity-50"
                      placeholder="Type text for your avatar to speak..."
                      defaultValue="Hello, I'm your AI video avatar. I can represent you in video calls while maintaining your speaking style and expressions."
                      disabled
                    />

                    <Button className="w-full" disabled>
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
