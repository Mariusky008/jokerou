import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Player {
  id: string;
  name: string;
  avatar: string;
  role: 'grim' | 'hunter';
}

interface TalkieWalkieProps {
  currentPlayer: Player;
  players: Player[];
  onMessageStart?: () => void;
  onMessageEnd?: () => void;
}

export default function TalkieWalkie({ currentPlayer, players, onMessageStart, onMessageEnd }: TalkieWalkieProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'all' | string>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [volume, setVolume] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  // Références pour les effets sonores
  const startSound = useRef<HTMLAudioElement | null>(null);
  const endSound = useRef<HTMLAudioElement | null>(null);
  const clickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialisation des effets sonores
    if (typeof window !== 'undefined') {
      startSound.current = new Audio('/sounds/radio-start.mp3');
      endSound.current = new Audio('/sounds/radio-end.mp3');
      clickSound.current = new Audio('/sounds/radio-click.mp3');

      // Préchargement des sons
      startSound.current.load();
      endSound.current.load();
      clickSound.current.load();

      // Configuration du volume
      if (startSound.current) startSound.current.volume = 0.5;
      if (endSound.current) endSound.current.volume = 0.5;
      if (clickSound.current) clickSound.current.volume = 0.3;
    }

    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const generateBeep = (frequency: number, duration: number, type: 'up' | 'down' | 'click') => {
    if (!audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    // Configuration du type de son
    oscillator.type = 'sine';
    
    const now = audioContext.current.currentTime;
    
    // Configuration du volume
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    
    // Configuration de la fréquence selon le type
    if (type === 'up') {
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.linearRampToValueAtTime(frequency * 1.5, now + duration);
    } else if (type === 'down') {
      oscillator.frequency.setValueAtTime(frequency * 1.5, now);
      oscillator.frequency.linearRampToValueAtTime(frequency, now + duration);
    } else {
      oscillator.frequency.setValueAtTime(frequency, now);
    }
    
    gainNode.gain.linearRampToValueAtTime(0, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  };

  const playStartSound = () => {
    generateBeep(880, 0.1, 'up');
  };

  const playEndSound = () => {
    generateBeep(880, 0.1, 'down');
  };

  const playClickSound = () => {
    generateBeep(440, 0.05, 'click');
  };

  const startRecording = async () => {
    try {
      if (audioContext.current?.state === 'suspended') {
        await audioContext.current.resume();
      }
      playStartSound();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      // Configuration de l'analyseur audio pour l'animation du volume
      if (audioContext.current) {
        analyser.current = audioContext.current.createAnalyser();
        const source = audioContext.current.createMediaStreamSource(stream);
        source.connect(analyser.current);
        analyser.current.fftSize = 256;
        
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        const updateVolume = () => {
          if (analyser.current && isRecording) {
            analyser.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setVolume(average);
            requestAnimationFrame(updateVolume);
          }
        };
        updateVolume();
      }

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        audioChunks.current = [];
        // Ici, vous pouvez implémenter l'envoi de l'audio au serveur
        console.log('Audio enregistré:', audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      onMessageStart?.();
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    playEndSound();
    setAudioStream(null);
    setIsRecording(false);
    setVolume(0);
    onMessageEnd?.();
  };

  const handleOpenClose = () => {
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
    playClickSound();
    setIsOpen(!isOpen);
  };

  const generateNotificationSound = (type: 'private' | 'global') => {
    if (!audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    const now = audioContext.current.currentTime;
    
    // Configuration du volume
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    
    if (type === 'private') {
      // Son plus aigu et double bip pour les messages privés
      oscillator.frequency.setValueAtTime(1200, now);
      gainNode.gain.setValueAtTime(0.2, now + 0.1);
      gainNode.gain.setValueAtTime(0, now + 0.15);
      gainNode.gain.setValueAtTime(0.2, now + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    } else {
      // Son plus grave et simple pour les messages globaux
      oscillator.frequency.setValueAtTime(800, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
    }
    
    oscillator.start(now);
    oscillator.stop(now + (type === 'private' ? 0.3 : 0.2));
  };

  const playMessageNotification = (isPrivate: boolean) => {
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
    generateNotificationSound(isPrivate ? 'private' : 'global');
  };

  const generatePowerSound = (type: 'activation' | 'recharge') => {
    if (!audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    const now = audioContext.current.currentTime;
    
    if (type === 'activation') {
      // Son mystique pour l'activation d'un pouvoir
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } else {
      // Son de recharge (plus court et plus simple)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.linearRampToValueAtTime(800, now + 0.2);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    }
  };

  const generateZoneSound = (type: 'activation' | 'deactivation' | 'enter') => {
    if (!audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    const now = audioContext.current.currentTime;
    
    switch (type) {
      case 'activation':
        // Son d'apparition d'une zone
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.3);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;
        
      case 'deactivation':
        // Son de disparition d'une zone
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;
        
      case 'enter':
        // Son d'entrée dans une zone
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
        
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
    }
  };

  const playPowerSound = (type: 'activation' | 'recharge') => {
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
    generatePowerSound(type);
  };

  const playZoneSound = (type: 'activation' | 'deactivation' | 'enter') => {
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
    generateZoneSound(type);
  };

  // Exposer les fonctions de son pour être utilisées par le composant parent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).playMessageNotification = playMessageNotification;
      (window as any).playPowerSound = playPowerSound;
      (window as any).playZoneSound = playZoneSound;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).playMessageNotification;
        delete (window as any).playPowerSound;
        delete (window as any).playZoneSound;
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 bg-gray-900 rounded-lg p-4 shadow-xl w-80 border border-purple-500/20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Talkie-Walkie</h3>
              <button
                onClick={handleOpenClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous les joueurs</option>
                  {players
                    .filter(player => player.id !== currentPlayer.id)
                    .map(player => (
                      <option key={player.id} value={player.id}>
                        {player.avatar} {player.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="relative">
                <motion.div
                  className="absolute left-0 bottom-0 w-full h-1 bg-purple-500 rounded"
                  style={{
                    scaleX: volume / 255,
                    transformOrigin: 'left'
                  }}
                />
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onMouseLeave={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  <span className="text-white font-medium">
                    {isRecording ? 'Relâcher pour envoyer' : 'Maintenir pour parler'}
                  </span>
                  {isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-3 h-3 rounded-full bg-red-400"
                    />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenClose}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-xl flex items-center justify-center border-2 border-purple-400/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </motion.button>
    </div>
  );
} 