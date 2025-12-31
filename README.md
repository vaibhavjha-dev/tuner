# ZeD's Guitar Tuner

A professional-grade, high-precision guitar tuner web application built with Next.js and modern web technologies. Experience real-time pitch detection, visual feedback, and reference tones in a beautiful, responsive interface.

## ✨ Features

- **Real-time Tuning**: Precise pitch detection using your device's microphone.
- **Visual Feedback**:
  - **Dynamic Gauge**: Smooth needle movement indicating pitch deviation.
  - **Color Indicators**: 
    - 🟢 **Green**: Perfect tune (within ±5 cents).
    - 🟠 **Orange**: Correct note, fine-tuning needed.
    - ⚪ **Neutral**: Waiting for input.
- **Reference Tones**: Click on any of the 6 guitar strings (E2, A2, D3, G3, B3, E4) to hear the reference note.
- **Microphone Control**: Easy Start/Stop functionality for the microphone.
- **Modern UI/UX**:
  - Glassmorphism effects with backdrop blur.
  - Smooth animations and transitions.
  - Responsive design for desktop and mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Processing**: Web Audio API (Oscillators for playback, Analyzer for detection)
- **Language**: TypeScript

## 📖 Usage

1. **Allow Microphone Access**: When prompted, allow the browser to access your microphone.
2. **Start Tuning**: Click the **Start Tuner** button.
3. **Play a String**: Pluck a guitar string. The tuner will detect the note and show you how far off you are.
   - The needle moves left (flat) or right (sharp).
   - Aim for the center (0 cents) and the green indicator.
4. **Reference Notes**: Tap any of the string buttons at the bottom to hear what the perfect note sounds like.

## 🌐 Browser Support

This application relies on the **Web Audio API** and **MediaStream API**. It is supported in most modern browsers, including:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

*Note: Microphone access requires a secure context (HTTPS) or localhost.*
