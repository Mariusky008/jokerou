import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isMusicPlaying: boolean;
  audioVolume: number;
  toggleMusic: () => Promise<void>;
  adjustVolume: (volume: number) => void;
  hasUserInteracted: boolean;
  setHasUserInteracted: (value: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

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

    // Ajouter un gestionnaire d'événements pour détecter l'interaction utilisateur
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const toggleMusic = async () => {
    try {
      if (!audioRef.current) return;

      if (!isMusicPlaying) {
        if (!hasUserInteracted) {
          console.log('En attente de l\'interaction utilisateur pour démarrer la musique');
          return;
        }
        await audioRef.current.play();
        setIsMusicPlaying(true);
      } else {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
    } catch (error) {
      console.log('Erreur lors de la lecture audio:', error);
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
    <AudioContext.Provider value={{ 
      isMusicPlaying, 
      audioVolume, 
      toggleMusic, 
      adjustVolume,
      hasUserInteracted,
      setHasUserInteracted
    }}>
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