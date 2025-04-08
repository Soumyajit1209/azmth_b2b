"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneCall } from "lucide-react"

interface CallDialerProps {
  onCall: (number: string, line: string) => void
  defaultNumber?: string
}

export const CallDialer: React.FC<CallDialerProps> = ({ onCall, defaultNumber = "" }) => {
  const [selectedNumber, setSelectedNumber] = useState("")
  const [inputNumber, setInputNumber] = useState(defaultNumber)

  const outgoingNumbers = [
    { id: "1", label: "Office Line", number: "+1 (555) 123-4567" },
    { id: "2", label: "Mobile", number: "+1 (555) 987-6543" },
    { id: "3", label: "Sales Line", number: "+1 (555) 456-7890" },
  ]

  const handleCall = () => {
    if (inputNumber.trim()) {
      onCall(inputNumber, selectedNumber)
    }
  }

  return (
    <div className="bg-background rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Call Dialer</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Outgoing Line</label>
          <select
            className="w-full p-2 rounded-md border border-border bg-background"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
          >
            <option value="">Select outgoing number</option>
            {outgoingNumbers.map((line) => (
              <option key={line.id} value={line.number}>
                {line.label} ({line.number})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">Dial Number</label>
          <div className="flex gap-2">
            <input
              type="tel"
              className="flex-1 p-2 rounded-md border border-border bg-background"
              placeholder="Enter phone number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
            />
            <Button onClick={handleCall} disabled={!selectedNumber || !inputNumber.trim()} className="gap-1">
              <PhoneCall className="h-4 w-4" />
              <span>Call</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((digit) => (
            <Button
              key={digit}
              variant="outline"
              className="h-12 w-full"
              onClick={() => setInputNumber((prev) => prev + digit)}
            >
              {digit}
            </Button>
          ))}
        </div>

        <Button variant="ghost" className="w-full" onClick={() => setInputNumber("")}>
          Clear
        </Button>
      </div>
    </div>
  )
}
