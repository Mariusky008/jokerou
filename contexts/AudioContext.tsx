import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isMusicPlaying: boolean;
  audioVolume: number;
  toggleMusic: () => Promise<void>;
  adjustVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);

  useEffect(() => {
    const audio = new Audio('/sounds/ambient.mp3');
    audio.loop = true;
    audio.volume = audioVolume;
    audioRef.current = audio;

    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume !== null) {
      const volume = parseFloat(savedVolume);
      setAudioVolume(volume);
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = async () => {
    try {
      if (!audioRef.current) return;

      if (!isMusicPlaying) {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      } else {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
    } catch (error) {
      console.error('Erreur audio:', error);
    }
  };

  const adjustVolume = (volume: number) => {
    setAudioVolume(volume);
    localStorage.setItem('audioVolume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  return (
    <AudioContext.Provider value={{ isMusicPlaying, audioVolume, toggleMusic, adjustVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
} 