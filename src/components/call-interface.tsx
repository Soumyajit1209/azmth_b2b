"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Users, Bot, User, MoreVertical, Download } from "lucide-react"

interface Contact {
  name: string
  company?: string
  photo?: string
}

interface CallInterfaceProps {
  status: "connecting" | "active" | "ended"
  callType: "incoming" | "outgoing"
  contact: Contact
  duration?: number
  onEnd: () => void
  isAIMode?: boolean
  onToggleAI?: () => void
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  status,
  callType,
  contact,
  duration = 0,
  onEnd,
  isAIMode = false,
  onToggleAI,
}) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-background/50 rounded-lg p-6 flex flex-col items-center">
      {/* Connecting Animation */}
      {status === "connecting" && (
        <div className="mb-6">
          <div className="flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full opacity-75 animate-ping bg-primary/30"></div>
              <div className="absolute -inset-2 rounded-full opacity-50 animate-ping bg-primary/20 animation-delay-150"></div>
              <div className="absolute -inset-3 rounded-full opacity-25 animate-ping bg-primary/10 animation-delay-300"></div>
              <div className="relative rounded-full bg-background p-2">
                {callType === "incoming" ? (
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <PhoneOff className="h-8 w-8 text-green-500" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <PhoneOff className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-lg font-medium">
            {callType === "incoming" ? "Incoming call..." : "Connecting..."}
          </p>
        </div>
      )}

      {/* Contact Info */}
      <div className="flex flex-col items-center mb-8">
        {contact.photo ? (
          <img
            src={contact.photo || "/placeholder.svg"}
            alt={contact.name}
            className="h-24 w-24 rounded-full mb-4 border-4 border-background"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 border-4 border-background">
            <User className="h-12 w-12 text-primary" />
          </div>
        )}

        <h2 className="text-2xl font-bold">{contact.name}</h2>
        {contact.company && <p className="text-muted-foreground">{contact.company}</p>}

        {status === "active" && (
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">{formatTime(duration)}</span>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Button
          variant="outline"
          size="icon"
          className={`h-14 w-14 rounded-full ${isMuted ? "bg-destructive/20 text-destructive border-destructive/50" : ""}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={onEnd}>
          <PhoneOff className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={`h-14 w-14 rounded-full ${!isSpeakerOn ? "bg-destructive/20 text-destructive border-destructive/50" : ""}`}
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </div>

      {/* Additional Controls */}
      <div className="grid grid-cols-4 gap-4 w-full max-w-md">
        <Button variant="ghost" className="flex flex-col items-center h-auto py-2" onClick={onToggleAI}>
          {isAIMode ? (
            <>
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs">Human</span>
            </>
          ) : (
            <>
              <Bot className="h-5 w-5 mb-1" />
              <span className="text-xs">AI</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto py-2"
          onClick={() => setIsRecording(!isRecording)}
        >
          <Download className={`h-5 w-5 mb-1 ${isRecording ? "text-red-500" : ""}`} />
          <span className="text-xs">Record</span>
        </Button>

        <Button variant="ghost" className="flex flex-col items-center h-auto py-2">
          <Users className="h-5 w-5 mb-1" />
          <span className="text-xs">Participants</span>
        </Button>

        <Button variant="ghost" className="flex flex-col items-center h-auto py-2">
          <MoreVertical className="h-5 w-5 mb-1" />
          <span className="text-xs">More</span>
        </Button>
      </div>

      {/* AI Assistant Panel (only shown when active) */}
      {status === "active" && isAIMode && (
        <div className="mt-8 w-full max-w-md bg-accent/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Bot className="h-4 w-4 text-accent" />
              AI Assistant
            </h3>
            <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded">Active</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            AI is currently handling the call. You can take over at any time.
          </p>
          <div className="bg-background/50 rounded p-2 text-xs mb-2">
            <p>
              I'm discussing the new product features with the customer and addressing their concerns about pricing.
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs">
            <User className="h-3 w-3 mr-1" />
            Take Over Call
          </Button>
        </div>
      )}
    </div>
  )
}
