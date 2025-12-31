"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { autoCorrelate, getNote } from "@/lib/tuner"

export interface PitchData {
    note: string
    octave: number
    cents: number
    frequency: number
    perfectFrequency: number
}

export function useTuner() {
    const [isListening, setIsListening] = useState(false)
    const [pitch, setPitch] = useState<PitchData | null>(null)

    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const rafId = useRef<number>(0)

    const updatePitch = useCallback(() => {
        if (!analyserRef.current || !audioContextRef.current) return

        const buffer = new Float32Array(analyserRef.current.fftSize)
        analyserRef.current.getFloatTimeDomainData(buffer)

        const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate)

        if (frequency > -1) {
            const noteData = getNote(frequency)
            setPitch(noteData)
        }

        rafId.current = requestAnimationFrame(updatePitch)
    }, [])

    const startListening = async () => {
        if (isListening) return

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
            const audioCtx = new AudioContextClass()
            audioContextRef.current = audioCtx

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaStreamRef.current = stream

            const analyser = audioCtx.createAnalyser()
            analyser.fftSize = 2048 // Higher FFT size for better resolution roughly

            const source = audioCtx.createMediaStreamSource(stream)
            source.connect(analyser)

            analyserRef.current = analyser
            sourceRef.current = source

            setIsListening(true)
            rafId.current = requestAnimationFrame(updatePitch)
        } catch (error) {
            console.error("Error accessing microphone", error)
        }
    }

    const stopListening = () => {
        if (rafId.current) {
            cancelAnimationFrame(rafId.current)
            rafId.current = 0
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect()
            sourceRef.current = null
        }
        if (analyserRef.current) {
            analyserRef.current.disconnect()
            analyserRef.current = null
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop())
            mediaStreamRef.current = null
        }
        if (audioContextRef.current) {
            if (audioContextRef.current.state !== "closed") {
                audioContextRef.current.close().catch(console.error)
            }
            audioContextRef.current = null
        }

        setIsListening(false)
        setPitch(null)
    }

    useEffect(() => {
        return () => {
            if (isListening) {
                stopListening()
            }
        }
    }, [isListening]) // Add dependency to ensure cleanup works? 
    // Actually, standard cleanup practice.

    return {
        isListening,
        pitch,
        startListening,
        stopListening
    }
}
