"use client"

import { useState } from "react"
import { useTuner } from "@/hooks/use-tuner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Music2 } from "lucide-react"
import { GUITAR_STRINGS } from "@/lib/tuner"

export default function TunerPage() {
  const { isListening, pitch, startListening, stopListening } = useTuner()
  const [selectedString, setSelectedString] = useState<string | null>(null)

  const cents = pitch ? pitch.cents : 0
  const note = pitch ? pitch.note : "-"
  const octave = pitch ? pitch.octave : ""

  // Calculate needle rotation (-90 to 90 degrees for -50 to +50 cents)
  // Clamp cents between -50 and 50 for display
  const clampedCents = Math.max(-50, Math.min(50, cents))
  const rotation = (clampedCents / 50) * 45 // 45 degrees swing each way

  const isInTune = Math.abs(cents) < 5 && pitch !== null
  const tuningColor = isInTune
    ? "text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
    : "text-white"

  const needleColor = isInTune ? "bg-green-500" : "bg-primary"

  return (
    <main className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-neutral-50">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            ZeD's Guitar Tuner
          </h1>
          <p className="text-neutral-400">Professional Grade Guitar Tuner</p>
        </div>

        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-10 flex flex-col items-center gap-8">

            {/* Tuner Display */}
            <div className="relative w-64 h-32 mt-4">
              {/* Gauge Arc */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border-[12px] border-neutral-800 border-t-transparent border-r-transparent -rotate-45" />

              {/* Center Note Display */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                {note !== "-" && <div className={`text-8xl font-black transition-all duration-200 ${tuningColor}`}>
                  {note}
                  <span className="text-2xl font-medium text-neutral-500 ml-1 absolute top-2">{octave}</span>
                </div>}
              </div>

              {/* Frequency Display */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-neutral-500 font-mono min-h-[24px] whitespace-nowrap z-20">
                {pitch ? `${pitch.frequency.toFixed(1)} Hz` : isListening ? "Listening..." : "Ready"}
              </div>

              {/* Needle */}
              <div
                className="absolute bottom-0 left-1/2 w-1.5 h-32 origin-bottom transition-transform duration-150 ease-out z-50"
                style={{
                  transform: `translateX(-50%) rotate(${rotation}deg)`,
                }}
              >
                <div className={`w-full h-full rounded-full ${needleColor} shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
              </div>

              {/* Ticks */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-36 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-white -translate-x-1/2" /> {/* 0 */}
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-white -translate-x-1/2 rotate-[22.5deg] origin-bottom -translate-y-[2px]" />
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-white -translate-x-1/2 rotate-[-22.5deg] origin-bottom -translate-y-[2px]" />
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-white -translate-x-1/2 rotate-[45deg] origin-bottom -translate-y-[2px]" />
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-white -translate-x-1/2 rotate-[-45deg] origin-bottom -translate-y-[2px]" />
              </div>
            </div>

            {/* Cents display pill */}
            <Badge variant="outline" className={`mt-14 px-4 py-1 text-lg border-neutral-700 ${Math.abs(cents) < 5 && pitch ? "bg-green-500/10 text-green-400 border-green-500/50" : "text-neutral-400"}`}>
              {pitch ? `${cents > 0 ? "+" : ""}${cents} cents` : "Ready"}
            </Badge>

            {/* Control Button */}
            {!isListening ? (
              <Button
                onClick={startListening}
                size="lg"
                className="rounded-full w-full h-14 text-lg bg-white text-black hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Mic className="mr-2 h-5 w-5" /> Start Tuner
              </Button>
            ) : (
              <Button
                onClick={stopListening}
                variant="destructive"
                size="lg"
                className="rounded-full w-full h-14 text-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50 cursor-pointer"
              >
                <MicOff className="mr-2 h-5 w-5" /> Stop Tuner
              </Button>
            )}

          </CardContent>
        </Card>

        {/* Reference Strings */}
        <div className="grid grid-cols-6 gap-2">
          {GUITAR_STRINGS.map((s) => {
            const isMatch = pitch && pitch.note === s.note && pitch.octave === s.octave
            const isExact = isMatch && Math.abs(pitch.cents) < 5
            const isSelected = selectedString === `${s.note}${s.octave}`

            let statusColor = "border-neutral-800 bg-neutral-900/30 text-neutral-500 hover:bg-neutral-800 hover:text-white"

            if (isExact) {
              statusColor = "border-green-500 bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(60, 179, 113,0.4)] animate-pulse"
            } else if (isMatch) {
              statusColor = "border-orange-500 bg-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            } else if (isSelected) {
              statusColor = "border-purple-500 bg-purple-500/10 text-purple-400"
            }

            return (
              <Button
                key={`${s.note}${s.octave}`}
                variant="outline"
                onClick={() => {
                  setSelectedString(`${s.note}${s.octave}`)
                  const AudioContext = window.AudioContext || (window as any).webkitAudioContext
                  const audioContext = new AudioContext()
                  const oscillator = audioContext.createOscillator()
                  const gainNode = audioContext.createGain()

                  oscillator.type = "triangle"
                  oscillator.frequency.setValueAtTime(s.frequency, audioContext.currentTime)

                  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)

                  oscillator.connect(gainNode)
                  gainNode.connect(audioContext.destination)

                  oscillator.start()
                  oscillator.stop(audioContext.currentTime + 2.5)

                  oscillator.onended = () => {
                    audioContext.close()
                  }
                }}
                className={`h-16 flex flex-col gap-0.5 transition-all cursor-pointer ${statusColor}`}
              >
                <span className="text-xl font-bold">{s.note}</span>
                <span className="text-xs opacity-50">{s.octave}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
