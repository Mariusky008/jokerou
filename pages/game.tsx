import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import TalkieWalkie from '../components/TalkieWalkie';
import Link from 'next/link';
import EventEffects from '../components/EventEffects';
import { useAudio } from '../contexts/AudioContext';
import GameLeaderboard from '../components/GameLeaderboard';
import { gameService } from '../services/gameService';
import { PlayerAction } from '../utils/pointsCalculator';

// Import dynamique de la carte pour éviter les erreurs SSR
const Map = dynamic(
  () => import('../components/Map').then((mod) => mod.default),
  { 
    loading: () => (
      <div className="h-[600px] bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-white text-xl">Chargement de la carte...</div>
      </div>
    ),
    ssr: false
  }
);

interface Power {
  id: string;
  name: string;
  description: string;
  icon: string;
  cooldown: number;
  remainingUses: number;
}

interface SpecialZone {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'recharge' | 'cover' | 'surveillance' | 'bonus';
  isActive: boolean;
  nextAppearance: number; // Temps en secondes avant la prochaine apparition
}

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isPrivate?: boolean;
  recipient?: string;
}

interface PlayerStats {
  gamesPlayed: number;
  winRate: number;
  level: number;
  xp: number;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  position: [number, number];
  role: 'grim' | 'hunter' | 'illusionist' | 'informer' | 'saboteur';
  isReady: boolean;
  level: number;
  points: number;
  achievements?: {
    kills?: number;
    distance?: number;
    powerUses?: number;
    timeAlive?: number;
  };
  health?: number;
  stamina?: number;
  powerCooldown?: number;
  lastAction?: string;
  killCount?: number;
  distanceTraveled?: number;
  isStreaming?: boolean;
  streamDuration?: number;
  streamPoints?: number;
  speed?: number;
}

// Types pour les événements spontanés
interface SpontaneousEvent {
  id: string;
  type: 'power_boost' | 'speed_bonus' | 'instant_level' | 'special_ability';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  challenge: {
    description: string;
    timeLimit: number;
    targetLocation: [number, number];
    distance: number;
  };
  reward: {
    type: string;
    description: string;
    duration?: number;
  };
  status: 'pending' | 'active' | 'completed' | 'failed';
  startTime?: number;
}

interface EventNotification {
  id: string;
  eventId: string;
  title: string;
  message: string;
  type: 'event_start' | 'event_success' | 'event_fail' | 'event_expire';
  timestamp: number;
}

interface Effect {
  type: 'reward' | 'zone';
  color: string;
  position?: [number, number];
  duration?: number;
}

interface PossibleEvent {
  id: string;
  name: string;
  description: string;
  type: 'power_boost' | 'speed_bonus' | 'instant_level' | 'special_ability';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  isActive: boolean;
}

export default function Game() {
  const { toggleMusic, isMusicPlaying } = useAudio();

  // Effet pour arrêter la musique au chargement de la page
  useEffect(() => {
    if (isMusicPlaying) {
      toggleMusic();
    }
  }, []);

  const [isGrim] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [showIntroPopup, setShowIntroPopup] = useState(true);
  const [showGrim, setShowGrim] = useState(true);
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [selectedPower, setSelectedPower] = useState<Power | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [privateMessage, setPrivateMessage] = useState('');
  const [globalMessage, setGlobalMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const [activeEvents, setActiveEvents] = useState<SpontaneousEvent[]>([]);
  const [showEventEffects, setShowEventEffects] = useState(false);
  const [eventType, setEventType] = useState<'challenge' | 'zone' | null>(null);
  const [currentEffect, setCurrentEffect] = useState<Effect | null>(null);
  const [possibleEvents, setPossibleEvents] = useState<PossibleEvent[]>([
    {
      id: 'sprint',
      name: 'Sprint mystique',
      description: 'Courez à toute vitesse vers le point indiqué pour obtenir un bonus de vitesse',
      type: 'speed_bonus',
      rarity: 'common',
      icon: '⚡',
      isActive: false
    },
    {
      id: 'power',
      name: 'Zone de pouvoir',
      description: 'Atteignez la zone mystique pour recharger instantanément vos pouvoirs',
      type: 'power_boost',
      rarity: 'rare',
      icon: '✨',
      isActive: false
    },
    {
      id: 'level',
      name: 'Ascension éclair',
      description: 'Accomplissez un défi rapide pour gagner un niveau instantanément',
      type: 'instant_level',
      rarity: 'epic',
      icon: '🌟',
      isActive: false
    },
    {
      id: 'ability',
      name: 'Don ancestral',
      description: 'Prouvez votre valeur pour débloquer une capacité légendaire temporaire',
      type: 'special_ability',
      rarity: 'legendary',
      icon: '👑',
      isActive: false
    }
  ]);

  const [powers, setPowers] = useState<Power[]>([
    {
      id: 'ghost',
      name: 'Mode Fantôme',
      description: 'Invisibilité pendant 30 secondes',
      icon: '👻',
      cooldown: 0,
      remainingUses: 1
    },
    {
      id: 'decoy',
      name: 'Leurre',
      description: 'Envoie une fausse position',
      icon: '🎭',
      cooldown: 0,
      remainingUses: 2
    }
  ]);

  const [specialZones, setSpecialZones] = useState<SpecialZone[]>([
    {
      id: 'recharge1',
      name: 'Station de recharge',
      description: 'Recharge instantanément vos pouvoirs spéciaux',
      icon: '⚡',
      type: 'recharge',
      isActive: false,
      nextAppearance: 300 // 5 minutes
    },
    {
      id: 'cover1',
      name: 'Zone de couverture',
      description: 'Meilleure dissimulation pour le Grim',
      icon: '🌫️',
      type: 'cover',
      isActive: false,
      nextAppearance: 300
    },
    {
      id: 'surveillance1',
      name: 'Point de surveillance',
      description: 'Position avantageuse pour les chasseurs',
      icon: '👁️',
      type: 'surveillance',
      isActive: false,
      nextAppearance: 300
    },
    {
      id: 'bonus1',
      name: 'Zone bonus',
      description: '+200 XP pour tous les joueurs dans la zone',
      icon: '⭐',
      type: 'bonus',
      isActive: false,
      nextAppearance: 300
    }
  ]);

  const [currentPlayer, setCurrentPlayer] = useState<Player & { speed?: number }>({
    id: 'current',
    name: 'Vous',
    avatar: '👤',
    position: [48.8566, 2.3522],
    role: isGrim ? 'grim' : 'hunter',
    isReady: true,
    level: 10,
    points: 150,
    achievements: {
      kills: 2,
      distance: 1.5,
      powerUses: 3
    },
    speed: 1
  });

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'player1',
      name: 'Alex',
      avatar: '👤',
      position: [48.8570, 2.3525],
      role: 'hunter',
      isReady: true,
      level: 8,
      points: 150,
      achievements: {
        kills: 2,
        distance: 1.5,
        powerUses: 3
      }
    },
    {
      id: 'player2',
      name: 'Marie',
      avatar: '👤',
      position: [48.8562, 2.3518],
      role: 'hunter',
      isReady: true,
      level: 12,
      points: 280,
      achievements: {
        kills: 1,
        distance: 2.1,
        powerUses: 5
      }
    },
    {
      id: 'player3',
      name: 'Lucas',
      avatar: '👤',
      position: [48.8575, 2.3515],
      role: 'hunter',
      isReady: true,
      level: 10,
      points: 200,
      achievements: {
        kills: 0,
        distance: 1.8,
        powerUses: 4
      }
    }
  ]);

  const mapRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamPoints, setStreamPoints] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [streamRewards] = useState([
    { duration: 5, points: 100, achieved: false },
    { duration: 15, points: 300, achieved: false },
    { duration: 30, points: 600, achieved: false }
  ]);

  // Fonction pour générer un événement spontané
  const generateSpontaneousEvent = useCallback((playerPosition: [number, number]) => {
    // Générer une position aléatoire dans un rayon de 100-300 mètres autour du joueur
    const radius = Math.random() * 200 + 100; // Entre 100 et 300 mètres
    const angle = Math.random() * Math.PI * 2; // Angle aléatoire en radians

    // Convertir les coordonnées polaires en coordonnées cartésiennes
    const offsetX = radius * Math.cos(angle);
    const offsetY = radius * Math.sin(angle);

    // Calculer la nouvelle position en pourcentage par rapport à la carte
    const mapWidth = 1000; // Largeur de référence de la carte en mètres
    const mapHeight = 1000; // Hauteur de référence de la carte en mètres

    const targetX = 50 + (offsetX / mapWidth) * 100; // Centré sur 50%
    const targetY = 50 + (offsetY / mapHeight) * 100; // Centré sur 50%

    // Créer l'événement
    const newEvent: SpontaneousEvent = {
      id: Date.now().toString(),
      type: 'speed_bonus',
      rarity: 'common',
      challenge: {
        description: "Atteignez la zone marquée pour obtenir un bonus de vitesse !",
        timeLimit: 60,
        targetLocation: [targetX, targetY],
        distance: radius
      },
      reward: {
        type: 'speed_boost',
        description: "Bonus de vitesse pendant 30 secondes",
        duration: 30
      },
      status: 'pending'
    };

    // Afficher l'effet de défi
    setEventType('challenge');
    setShowEventEffects(true);

    // Créer une notification
    createEventNotification(
      newEvent.id,
      'event_start',
      "🎯 Nouveau défi !",
      newEvent.challenge.description
    );

    // Après 2 secondes, afficher la zone
    setTimeout(() => {
      setEventType('zone');
      setActiveEvents(prev => [...prev, newEvent]);
    }, 2000);

    return newEvent;
  }, []);

  // Fonction pour créer une notification
  const createEventNotification = useCallback((
    eventId: string,
    type: EventNotification['type'],
    title: string,
    message: string
  ) => {
    // Afficher uniquement l'effet visuel au centre de l'écran
    setEventType('challenge');
    setShowEventEffects(true);
    
    // Créer un événement complet
    const newEvent: SpontaneousEvent = {
      id: eventId,
      type: 'speed_bonus',
      rarity: 'common',
      challenge: {
        description: message,
        timeLimit: 60,
        targetLocation: [50, 50], // Position par défaut au centre
        distance: 100
      },
      reward: {
        type: 'speed_boost',
        description: "Bonus de vitesse pendant 30 secondes",
        duration: 30
      },
      status: 'active'
    };

    // Après 2 secondes, afficher la zone
    setTimeout(() => {
      setEventType('zone');
      setActiveEvents(prev => [...prev, newEvent]);
    }, 2000);
  }, []);

  // Fonction pour calculer la distance entre deux points
  const calculateDistance = (pos1: [number, number], pos2: [number, number]): number => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = pos1[0] * Math.PI/180;
    const φ2 = pos2[0] * Math.PI/180;
    const Δφ = (pos2[0]-pos1[0]) * Math.PI/180;
    const Δλ = (pos2[1]-pos1[1]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Effet pour vérifier la position du joueur par rapport aux événements
  useEffect(() => {
    if (!currentPlayer.position) return;

    setActiveEvents(prev => prev.map(event => {
      // Ignorer les événements déjà complétés ou échoués
      if (event.status === 'completed' || event.status === 'failed') return event;

      // Calculer la distance entre le joueur et la cible
      const distance = calculateDistance(
        currentPlayer.position,
        event.challenge.targetLocation
      );

      // Si le joueur est assez proche de la cible (10 mètres)
      if (distance <= 10) {
        // Si l'événement n'est pas encore actif, le démarrer
        if (event.status === 'pending') {
          createEventNotification(
            event.id,
            'event_start',
            'Défi commencé !',
            'Le compte à rebours est lancé. Restez dans la zone !'
          );
          return { ...event, status: 'active', startTime: Date.now() };
        }
        
        // Si l'événement est actif et le temps n'est pas écoulé, le valider
        if (event.status === 'active' && event.startTime) {
          const timeElapsed = Date.now() - event.startTime;
          if (timeElapsed <= event.challenge.timeLimit * 1000) {
            createEventNotification(
              event.id,
              'event_success',
              'Défi réussi !',
              `Vous avez obtenu : ${event.reward.description}`
            );

            // Appliquer la récompense
            applyEventReward(event);

            return { ...event, status: 'completed' };
          }
        }
      }
      
      return event;
    }));
  }, [currentPlayer.position, createEventNotification]);

  // Fonction pour appliquer les récompenses
  const applyEventReward = (event: SpontaneousEvent) => {
    // Afficher l'effet de récompense
    setCurrentEffect({
      type: 'reward',
      color: event.rarity === 'legendary' ? '#FFD700' :
             event.rarity === 'epic' ? '#FF44CC' :
             event.rarity === 'rare' ? '#4477FF' : '#8B5CF6'
    });

    switch (event.type) {
      case 'power_boost':
        setPowers(prev => prev.map(power => ({
          ...power,
          remainingUses: power.remainingUses + 1
        })));
        break;
      case 'speed_bonus':
        // Augmenter temporairement la vitesse du joueur
        setCurrentPlayer(prev => ({
          ...prev,
          speed: prev.speed * 1.5
        }));
        setTimeout(() => {
          setCurrentPlayer(prev => ({
            ...prev,
            speed: prev.speed / 1.5
          }));
        }, event.reward.duration * 1000);
        break;
      case 'instant_level':
        setCurrentPlayer(prev => ({
          ...prev,
          level: prev.level + 1
        }));
        break;
      case 'special_ability':
        // Ajouter un nouveau pouvoir temporaire
        const newPower: Power = {
          id: `power_${Date.now()}`,
          name: 'Pouvoir Mystique',
          description: 'Un pouvoir rare et puissant',
          icon: '✨',
          cooldown: 60,
          remainingUses: 1
        };
        setPowers(prev => [...prev, newPower]);
        setTimeout(() => {
          setPowers(prev => prev.filter(p => p.id !== newPower.id));
        }, event.reward.duration * 1000);
        break;
    }
  };

  // Gestionnaire d'événements spontanés
  useEffect(() => {
    if (!currentPlayer.position) return;

    const interval = setInterval(() => {
      // Chance de générer un événement (10%)
      if (Math.random() < 0.1) {
        const event = generateSpontaneousEvent(currentPlayer.position);
        setActiveEvents(prev => [...prev, event]);
        
        // Afficher l'effet de zone
        setCurrentEffect({
          type: 'zone',
          position: event.challenge.targetLocation,
          color: event.rarity === 'legendary' ? '#FFD700' :
                 event.rarity === 'epic' ? '#FF44CC' :
                 event.rarity === 'rare' ? '#4477FF' : '#8B5CF6',
          duration: 5000
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPlayer.position]);

  // Vérification de la progression des événements
  useEffect(() => {
    const checkInterval = setInterval(() => {
      setActiveEvents(prev => prev.map(event => {
        if (event.status !== 'active' || !event.startTime) return event;

        const timeElapsed = Date.now() - event.startTime;
        if (timeElapsed > event.challenge.timeLimit * 1000) {
          createEventNotification(
            event.id,
            'event_expire',
            'Défi échoué !',
            'Temps écoulé. Une autre opportunité se présentera bientôt !'
          );
          return { ...event, status: 'failed' };
        }

        return event;
      }));
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [createEventNotification]);

  useEffect(() => {
    // Timer pour le jeu et les cooldowns
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });

      setPowers((prev) =>
        prev.map((power) => ({
          ...power,
          cooldown: Math.max(0, power.cooldown - 1)
        }))
      );
    }, 1000);

    // Timer pour cacher le Grim après 30 secondes
    if (showGrim) {
      const grimTimer = setTimeout(() => {
        setShowGrim(false);
      }, 30000);

      return () => {
        clearTimeout(grimTimer);
        clearInterval(timer);
      };
    }
  }, [showGrim]);

  useEffect(() => {
    // Scroll automatique vers le bas du chat
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Timer pour les zones spéciales
    const zoneTimer = setInterval(() => {
      setSpecialZones(prev => prev.map(zone => {
        if (zone.nextAppearance <= 0) {
          // Si le temps est écoulé, activer la zone pour 1 minute
          if (!zone.isActive) {
            // Jouer le son d'activation de zone
            if (typeof window !== 'undefined' && (window as any).playZoneSound) {
              (window as any).playZoneSound('activation');
            }
            return {
              ...zone,
              isActive: true,
              nextAppearance: 60 // 1 minute d'activation
            };
          } else {
            // Jouer le son de désactivation de zone
            if (typeof window !== 'undefined' && (window as any).playZoneSound) {
              (window as any).playZoneSound('deactivation');
            }
            return {
              ...zone,
              isActive: false,
              nextAppearance: 300 // 5 minutes avant la prochaine apparition
            };
          }
        }
        return {
          ...zone,
          nextAppearance: zone.nextAppearance - 1
        };
      }));
    }, 1000);

    return () => clearInterval(zoneTimer);
  }, []);

  // Mettre à jour l'état des événements possibles quand un événement démarre
  useEffect(() => {
    setPossibleEvents(prev => prev.map(event => ({
      ...event,
      isActive: activeEvents.some(active => active.type === event.type)
    })));
  }, [activeEvents]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const usePower = async (powerId: string) => {
    setPowers((prev) =>
      prev.map((power) => {
        if (power.id === powerId && power.remainingUses > 0 && power.cooldown === 0) {
          // Enregistrer l'action et les points
          const action: PlayerAction = {
            type: 'power_use',
            value: 1,
            details: {
              powerType: power.id
            }
          };
          
          gameService.recordPlayerAction(currentPlayer.id, action)
            .then(points => {
              // Mettre à jour les points du joueur
              setCurrentPlayer(prev => ({
                ...prev,
                points: prev.points + points,
                achievements: {
                  ...prev.achievements,
                  powerUses: (prev.achievements?.powerUses || 0) + 1
                }
              }));
            });

          // Jouer le son d'activation du pouvoir
          if (typeof window !== 'undefined' && (window as any).playPowerSound) {
            (window as any).playPowerSound('activation');
          }
          return {
            ...power,
            remainingUses: power.remainingUses - 1,
            cooldown: powerId === 'ghost' ? 30 : 15
          };
        }
        return power;
      })
    );
  };

  const handleSendGlobalMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: 'Vous',
        content: globalMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setGlobalMessage('');
      // Jouer le son de notification globale
      if (typeof window !== 'undefined' && (window as any).playMessageNotification) {
        (window as any).playMessageNotification(false);
      }
    }
  };

  const handleSendPrivateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (privateMessage.trim() && selectedPlayer) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: 'Vous',
        content: privateMessage,
        timestamp: new Date(),
        isPrivate: true,
        recipient: selectedPlayer.name
      };
      setMessages(prev => [...prev, newMessage]);
      setPrivateMessage('');
      // Jouer le son de notification privée
      if (typeof window !== 'undefined' && (window as any).playMessageNotification) {
        (window as any).playMessageNotification(true);
      }
    }
  };

  // Simuler la réception de messages (pour démonstration)
  useEffect(() => {
    const simulateIncomingMessage = () => {
      const isPrivate = Math.random() > 0.5;
      const newMessage: Message = {
        id: Date.now().toString(),
        author: players[Math.floor(Math.random() * players.length)].name,
        content: isPrivate ? "Message privé de test" : "Message global de test",
        timestamp: new Date(),
        isPrivate,
        recipient: isPrivate ? 'Vous' : undefined
      };
      setMessages(prev => [...prev, newMessage]);
      // Jouer le son de notification approprié
      if (typeof window !== 'undefined' && (window as any).playMessageNotification) {
        (window as any).playMessageNotification(isPrivate);
      }
    };

    // Simuler un message toutes les 10 secondes (pour démonstration)
    const interval = setInterval(simulateIncomingMessage, 10000);
    return () => clearInterval(interval);
  }, [players]);

  const handleMessageStart = () => {
    // Ajouter un effet visuel ou sonore quand quelqu'un commence à parler
    console.log('Début du message audio');
  };

  const handleMessageEnd = () => {
    // Ajouter un effet visuel ou sonore quand quelqu'un arrête de parler
    console.log('Fin du message audio');
  };

  const handleCreateEvent = () => {
    if (!currentPlayer.position) return;
    
    // Sélectionner un événement aléatoire parmi les possibles
    const availableEvents = possibleEvents.filter(e => !e.isActive);
    if (availableEvents.length === 0) return;
    
    const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    
    // Mettre à jour l'état de l'événement
    setPossibleEvents(prev => prev.map(event => 
      event.id === selectedEvent.id ? { ...event, isActive: true } : event
    ));

    // Générer une position aléatoire pour l'événement
    const radius = Math.random() * 200 + 100;
    const angle = Math.random() * Math.PI * 2;
    const targetX = currentPlayer.position[0] + (radius * Math.cos(angle)) / 111000;
    const targetY = currentPlayer.position[1] + (radius * Math.sin(angle)) / 111000;

    // Créer l'événement
    const newEvent: SpontaneousEvent = {
      id: Date.now().toString(),
      type: selectedEvent.type,
      rarity: selectedEvent.rarity,
      challenge: {
        description: selectedEvent.description,
        timeLimit: 60,
        targetLocation: [targetX, targetY],
        distance: radius
      },
      reward: {
        type: selectedEvent.type,
        description: `Bonus de ${selectedEvent.name}`,
        duration: 30
      },
      status: 'pending'
    };

    // Afficher l'effet de défi
    setEventType('challenge');
    setShowEventEffects(true);

    // Ajouter l'événement à la liste des événements actifs
    setActiveEvents(prev => [...prev, newEvent]);
  };

  // Remplacer l'effet de streaming existant
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(async () => {
        setStreamDuration(prev => {
          const newDuration = prev + 1/60; // Incrémentation d'une minute
          
          // Enregistrer l'action de streaming
          const action: PlayerAction = {
            type: 'stream',
            details: {
              streamDuration: newDuration
            }
          };
          
          gameService.recordPlayerAction(currentPlayer.id, action)
            .then(points => {
              setStreamPoints(prev => prev + points);
              setCurrentPlayer(prev => ({
                ...prev,
                points: prev.points + points,
                achievements: {
                  ...prev.achievements,
                  streamMinutes: Math.floor(newDuration)
                }
              }));

              // Vérifier les récompenses de streaming
              streamRewards.forEach(reward => {
                if (!reward.achieved && newDuration >= reward.duration) {
                  setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    author: 'Système',
                    content: `🎉 Récompense de streaming : +${points} points pour ${reward.duration} minutes de direct !`,
                    timestamp: new Date()
                  }]);
                  reward.achieved = true;
                }
              });
            });
          
          return newDuration;
        });
      }, 60000); // Vérifier toutes les minutes
    }
    return () => clearInterval(interval);
  }, [isStreaming, currentPlayer.id]);

  const handleToggleStream = useCallback(() => {
    if (!isStreaming) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setIsStreaming(true);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            author: 'Système',
            content: 'Vous avez commencé à diffuser votre vidéo en direct.',
            timestamp: new Date()
          }]);
        })
        .catch(error => {
          console.error('Erreur d\'accès à la caméra:', error);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            author: 'Système',
            content: 'Impossible d\'accéder à la caméra. Vérifiez vos permissions.',
            timestamp: new Date()
          }]);
        });
    } else {
      setIsStreaming(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        author: 'Système',
        content: 'Vous avez arrêté la diffusion en direct.',
        timestamp: new Date()
      }]);
    }
  }, [isStreaming]);

  useEffect(() => {
    // Simuler le mouvement des joueurs
    const interval = setInterval(() => {
      setPlayers(prevPlayers => prevPlayers.map(player => ({
        ...player,
        position: [
          player.position[0] + (Math.random() - 0.5) * 0.0005,
          player.position[1] + (Math.random() - 0.5) * 0.0005
        ]
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const recordDistance = async (distance: number) => {
    const action: PlayerAction = {
      type: 'distance',
      value: distance
    };

    const points = await gameService.recordPlayerAction(currentPlayer.id, action);
    setCurrentPlayer(prev => ({
      ...prev,
      points: prev.points + points,
      achievements: {
        ...prev.achievements,
        distance: (prev.achievements?.distance || 0) + distance
      }
    }));
  };

  useEffect(() => {
    const initGame = async () => {
      const initialPlayers = [currentPlayer, ...players].map(player => ({
        id: player.id,
        position: player.position
      }));

      await gameService.startGame(initialPlayers, [48.8566, 2.3522]);
    };

    initGame();

    return () => {
      // Terminer la partie si le composant est démonté
      if (currentPlayer.role === 'grim') {
        gameService.endGame('grim');
      } else {
        gameService.endGame('hunters');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Bouton pour créer des événements */}
      <button
        onClick={handleCreateEvent}
        className="fixed bottom-24 left-4 z-[9998] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
      >
        <span>⚡</span>
        Créer un événement
      </button>

      <Head>
        <title>Partie en cours - GRIM</title>
      </Head>

      {/* Pop-up d'introduction */}
      <AnimatePresence>
        {showIntroPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl p-4 md:p-8 mx-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/20"
            >
              {/* Bouton de fermeture */}
              <button
                onClick={() => setShowIntroPopup(false)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-200 border-2 border-red-700"
              >
                ✕
              </button>
              <motion.div
                className="absolute -inset-px rounded-2xl"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.3)',
                    '0 0 40px rgba(236, 72, 153, 0.3)',
                    '0 0 20px rgba(168, 85, 247, 0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative">
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                >
                  {isGrim ? "🎭 C'est parti, le Grim !" : "🎯 En chasse, Chasseur !"}
                </motion.h2>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 text-base md:text-lg text-gray-300"
                >
                  <p className="text-center">
                    {isGrim 
                      ? "Il est temps de quitter votre position actuelle et de trouver une cachette sûre. Les chasseurs arrivent !" 
                      : "Le Grim est quelque part dans la zone. Coordonnez-vous et partez à sa recherche !"}
                  </p>
                  <div className="mt-6 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20">
                    <p className="text-center text-purple-300">
                      👀 Consultez attentivement la carte pour repérer les zones stratégiques et les points d'intérêt.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* En-tête du jeu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${isGrim ? 'bg-purple-600' : 'bg-blue-600'} flex items-center justify-center text-2xl`}>
              {isGrim ? '🎭' : '🎯'}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">
                {isGrim ? 'Vous êtes le Grim' : 'Vous êtes un Chasseur'}
              </h1>
              <p className="text-gray-400">
                {isGrim ? 'Échappez aux chasseurs' : 'Traquez le Grim'}
              </p>
            </div>
          </div>

          <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/leaderboards"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 md:py-3 md:px-6 text-xs md:text-base rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-1 md:gap-2"
            >
              <span className="text-xs md:text-base">🏆</span>
              Classements
            </Link>
            <Link
              href="/profile"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 md:py-3 md:px-6 text-xs md:text-base rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-1 md:gap-2"
            >
              <span className="text-xs md:text-base">👤</span>
              Mon profil
            </Link>
          </div>
        </motion.div>

        {/* Effets visuels pour les événements */}
        <AnimatePresence>
          {showEventEffects && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-auto"
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div className="relative bg-gray-900/90 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-purple-500/20">
                {/* Bouton de fermeture */}
                <button
                  onClick={() => setShowEventEffects(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-400">×</span>
                </button>
                
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-4xl"
                  >
                    🎯
                  </motion.div>
                  <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Nouveau défi !
                  </h2>
                  <p className="text-gray-300 text-center">
                    Un nouvel événement est apparu sur la carte. Soyez le premier à l'atteindre !
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section principale avec la carte */}
          <div className="lg:col-span-3">
            {/* Carte du jeu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Map
                ref={mapRef}
                showGrim={showGrim}
                onPlayerSelect={(player: Player) => setSelectedPlayer(player)}
                specialZones={specialZones}
                onToggleStream={handleToggleStream}
                isStreaming={isStreaming}
              />

              {/* Informations de streaming */}
              {isStreaming && (
                <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="animate-pulse text-red-500">●</span>
                    <span className="font-medium">En direct</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Durée du stream</div>
                      <div className="font-bold">{Math.floor(streamDuration)} minutes</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Points gagnés</div>
                      <div className="font-bold">{streamPoints}</div>
                    </div>
                  </div>
                  {/* Barre de progression vers la prochaine récompense */}
                  {streamRewards.find(r => !r.achieved) && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-400 mb-1">
                        Prochaine récompense dans {
                          streamRewards.find(r => !r.achieved)?.duration || 0
                        } minutes
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{
                            width: `${(streamDuration / (streamRewards.find(r => !r.achieved)?.duration || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Événements spéciaux */}
            <div className="space-y-2 mb-8">
              <AnimatePresence>
                {possibleEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`relative p-4 rounded-lg backdrop-blur-sm transition-all duration-300 cursor-help overflow-hidden
                      ${event.isActive 
                        ? `bg-gradient-to-r 
                            ${event.rarity === 'legendary' ? 'from-yellow-600 to-yellow-500 shadow-yellow-500/50' :
                              event.rarity === 'epic' ? 'from-purple-600 to-pink-500 shadow-purple-500/50' :
                              event.rarity === 'rare' ? 'from-blue-600 to-cyan-500 shadow-blue-500/50' :
                              'from-green-600 to-emerald-500 shadow-green-500/50'}
                            shadow-lg`
                        : 'bg-gray-800/80 hover:bg-gray-800/90'
                      }`}
                    title={event.description}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{event.icon}</span>
                      <div className="flex-1">
                        <div className={`font-bold text-lg ${event.isActive ? 'text-white' : 'text-gray-300'}`}>
                          {event.name}
                        </div>
                        <div className={`text-sm ${event.isActive ? 'text-white/90' : 'text-gray-400'}`}>
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pouvoirs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {powers.map((power) => (
                <button
                  key={power.id}
                  onClick={() => usePower(power.id)}
                  disabled={power.remainingUses === 0 || power.cooldown > 0}
                  className={`power-button bg-gray-900 p-4 rounded-xl flex items-center ${
                    power.remainingUses === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : power.cooldown > 0
                      ? 'opacity-75 cursor-wait'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="power-icon w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                    {power.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                      {power.name}
                    </h3>
                    <p className="text-sm text-gray-400">{power.description}</p>
                    {power.cooldown > 0 && (
                      <div className="power-cooldown mt-1 text-sm">
                        <span className="text-purple-400">
                          Cooldown: {power.cooldown}s
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      Utilisations restantes
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                      {power.remainingUses}
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>

            {/* Nouvelle section : Zones spéciales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Zones spéciales
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {specialZones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`zone-card bg-gray-900 p-4 rounded-xl flex items-center ${
                      zone.isActive ? 'active' : ''
                    }`}
                  >
                    <div className={`zone-icon w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      zone.isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-800'
                    }`}>
                      {zone.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                        {zone.name}
                      </h3>
                      <p className="text-sm text-gray-400">{zone.description}</p>
                      {!zone.isActive ? (
                        <div className="zone-timer mt-1">
                          Apparaît dans: {Math.floor(zone.nextAppearance / 60)}:{(zone.nextAppearance % 60).toString().padStart(2, '0')}
                        </div>
                      ) : (
                        <div className="zone-timer mt-1 active">
                          Active pendant: {Math.floor(zone.nextAppearance / 60)}:{(zone.nextAppearance % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar avec le chat et les infos joueurs */}
          <div className="space-y-8">
            {/* Infos du joueur sélectionné */}
            {selectedPlayer && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {selectedPlayer.avatar}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">{selectedPlayer.name}</h3>
                    <p className="text-purple-400">Niveau {selectedPlayer.level}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">Position: {selectedPlayer.position[0].toFixed(4)}, {selectedPlayer.position[1].toFixed(4)}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-lg font-bold">{selectedPlayer.level}</div>
                    <div className="text-sm text-gray-400">Niveau</div>
                  </div>
                </div>
                <form onSubmit={handleSendPrivateMessage} className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">
                  <input
                    type="text"
                    value={privateMessage}
                    onChange={(e) => setPrivateMessage(e.target.value)}
                    placeholder="Message privé..."
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Envoyer
                  </button>
                </form>
              </motion.div>
            )}

            {/* Chat global */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-neon"
            >
              <h2 className="text-xl font-bold mb-4">Chat de partie</h2>
              <div
                ref={chatRef}
                className="space-y-4 h-[300px] overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-gray-800 p-3 rounded-lg ${
                      msg.isPrivate ? 'border border-purple-500/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold">
                        {msg.author}
                        {msg.isPrivate && msg.recipient && (
                          <span className="text-purple-400"> → {msg.recipient}</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{msg.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendGlobalMessage} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={globalMessage}
                  onChange={(e) => setGlobalMessage(e.target.value)}
                  placeholder="Message global..."
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Envoyer
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ajouter le composant TalkieWalkie */}
      <TalkieWalkie
        currentPlayer={currentPlayer}
        players={players}
        onMessageStart={handleMessageStart}
        onMessageEnd={handleMessageEnd}
      />

      <div className="mt-8">
        <GameLeaderboard 
          players={[currentPlayer, ...players]}
          gameId={`game-${Date.now()}`}
          gameDate={new Date()}
        />
      </div>

      <style jsx global>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #8b5cf6;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
} 