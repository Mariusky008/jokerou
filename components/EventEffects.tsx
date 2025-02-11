import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap } from 'leaflet';

// Dynamic import of Leaflet
let leafletInstance: typeof import('leaflet');
if (typeof window !== 'undefined') {
  leafletInstance = require('leaflet');
}

interface ParticleProps {
  color: string;
  x: number;
  y: number;
}

interface EventEffectsProps {
  eventType: 'reward' | 'zone' | 'countdown' | 'challenge';
  position?: [number, number];
  duration?: number;
  color?: string;
  onComplete?: () => void;
  mapRef?: React.RefObject<any>;
}

const Particle = ({ color, x, y }: ParticleProps) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ backgroundColor: color }}
    initial={{ x, y, scale: 0, opacity: 1 }}
    animate={{
      x: x + (Math.random() - 0.5) * 200,
      y: y + (Math.random() - 0.5) * 200,
      scale: [0, 1.5, 0],
      opacity: [1, 0.8, 0]
    }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  />
);

const ChallengeNotification = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 10000 }}>
    <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-xl">
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          className="text-4xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg shadow-lg"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Nouveau Défi !
        </motion.div>
        <div className="text-xl text-white bg-gray-800/80 px-6 py-3 rounded-lg">
          Atteignez la zone marquée en moins de 2 minutes !
        </div>
      </div>
      <button 
        onClick={onClose}
        className="absolute -top-4 -right-4 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
);

export default function EventEffects({ 
  eventType, 
  position, 
  duration = 3000, 
  color = "#8B5CF6", 
  onComplete,
  mapRef 
}: EventEffectsProps) {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [showChallenge, setShowChallenge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration / 1000);
  const audioContext = useRef<AudioContext | null>(null);
  const isFirstRender = useRef(true);
  const effectRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialiser l'AudioContext lors d'une interaction utilisateur
  const initAudio = () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'AudioContext:', error);
      return false;
    }
  };

  const playSound = (type: 'reward' | 'challenge') => {
    if (!initAudio() || !audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    const now = audioContext.current.currentTime;

    if (type === 'reward') {
      // Son de récompense (arpège ascendant)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, now);
      oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      
      oscillator.start(now);
      oscillator.stop(now + 0.3);
    } else if (type === 'challenge') {
      // Son de défi (double bip grave)
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(220, now);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.3);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      initAudio();
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      leafletInstance = require('leaflet');
    }
  }, []);

  useEffect(() => {
    if (eventType === 'reward') {
      const newParticles = Array.from({ length: 20 }, () => ({
        color,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }));
      setParticles(newParticles);
      playSound('reward');
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    } 
    
    if (eventType === 'challenge' && isFirstRender.current) {
      setShowChallenge(true);
      playSound('challenge');
      isFirstRender.current = false;
    }

    if (eventType === 'zone' || eventType === 'countdown') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [eventType, duration, color, onComplete]);

  useEffect(() => {
    if (eventType === 'countdown' && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [eventType, timeLeft]);

  useEffect(() => {
    if (eventType === 'zone' && position && mapRef?.current && isClient && leafletInstance) {
      const updatePosition = () => {
        const mapInstance = mapRef.current as LeafletMap;
        if (!mapInstance || !effectRef.current) return;

        try {
          // Convertir les coordonnées de la carte en pixels
          const latLng = leafletInstance.latLng(position[0], position[1]);
          const point = mapInstance.latLngToContainerPoint(latLng);

          if (point) {
            effectRef.current.style.left = `${point.x}px`;
            effectRef.current.style.top = `${point.y}px`;
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la position:', error);
        }
      };

      // Initial position
      updatePosition();

      // Update position on map events
      const map = mapRef.current as LeafletMap;
      if (map && typeof map.on === 'function') {
        map.on('zoom', updatePosition);
        map.on('move', updatePosition);
        map.on('moveend', updatePosition);

        return () => {
          if (map && typeof map.off === 'function') {
            map.off('zoom', updatePosition);
            map.off('move', updatePosition);
            map.off('moveend', updatePosition);
          }
        };
      }
    }
  }, [eventType, position, mapRef, isClient]);

  return (
    <>
      {showChallenge && (
        <ChallengeNotification 
          onClose={() => {
            setShowChallenge(false);
            // Don't call onComplete here to maintain the zone effect
          }} 
        />
      )}

      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
            {eventType === 'reward' && particles.map((particle, index) => (
              <Particle key={index} {...particle} />
            ))}

            {eventType === 'zone' && position && (
              <div 
                ref={effectRef}
                className="absolute"
                style={{
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  zIndex: 1000
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `6px solid ${color}`,
                    boxShadow: `0 0 30px ${color}`,
                    backgroundColor: `${color}20`
                  }}
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{
                    scale: [0.5, 1.2, 0.5],
                    opacity: [0.8, 0.2, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {eventType === 'countdown' && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 10000 }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <div className="text-6xl font-bold text-white bg-purple-600/80 rounded-full w-24 h-24 flex items-center justify-center">
                  {timeLeft}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
} 