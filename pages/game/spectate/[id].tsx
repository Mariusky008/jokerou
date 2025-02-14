import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAudio } from '../../../contexts/AudioContext';
import ShopButton from '../../../components/ShopButton';

// Import dynamique de la carte pour éviter les erreurs SSR
const Map = dynamic(
  () => import('../../../components/Map').then(mod => mod.default),
  { 
    loading: () => (
      <div className="h-[600px] bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-white text-xl">Chargement de la carte...</div>
      </div>
    ),
    ssr: false
  }
);

interface Player {
  id: string;
  name: string;
  avatar: string;
  position: [number, number];
  role: 'grim' | 'hunter' | 'illusionist' | 'informer' | 'saboteur';
  isReady: boolean;
  level: number;
  health?: number;
  stamina?: number;
  powerCooldown?: number;
  lastAction?: string;
  killCount?: number;
  distanceTraveled?: number;
  isStreaming?: boolean;
  streamDuration?: number;
  streamPoints?: number;
}

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
  type?: 'kill' | 'escape' | 'power' | 'event' | 'info';
  icon?: string;
}

interface GameEvent {
  id: string;
  type: 'zone' | 'power' | 'encounter' | 'escape' | 'kill';
  description: string;
  position?: [number, number];
  timestamp: Date;
  duration?: number;
}

interface GameStats {
  grimEscapes: number;
  hunterKills: number;
  powerUsed: number;
  distanceCovered: number;
  closestEncounter: number;
  longestChase: number;
}

interface TalkieMessage {
  id: string;
  playerName: string;
  playerRole: string;
  isPlaying: boolean;
  timestamp: Date;
}

interface StreamReward {
  duration: number; // en minutes
  points: number;
  achieved: boolean;
}

export default function SpectateGame() {
  const router = useRouter();
  const { id } = router.query;
  const { toggleMusic, isMusicPlaying, audioVolume, adjustVolume } = useAudio();
  const mapRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(3600);
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'grim1',
      name: 'Le Grim',
      avatar: '🎭',
      position: [48.8566, 2.3522],
      role: 'grim',
      isReady: true,
      level: 15,
      health: 100,
      stamina: 100,
      powerCooldown: 0,
      lastAction: "S'est caché dans l'ombre",
      isStreaming: true,
      streamDuration: 15,
      streamPoints: 150
    },
    {
      id: 'hunter1',
      name: 'Thomas',
      avatar: '🎯',
      position: [48.8570, 2.3525],
      role: 'hunter',
      isReady: true,
      level: 10,
      health: 95,
      stamina: 80,
      powerCooldown: 0,
      killCount: 1,
      distanceTraveled: 1.0,
      lastAction: "Coordonne l'équipe",
      isStreaming: true,
      streamDuration: 25,
      streamPoints: 250
    },
    {
      id: 'informer1',
      name: 'Sophie',
      avatar: '🔍',
      position: [48.8568, 2.3520],
      role: 'informer',
      isReady: true,
      level: 12,
      health: 100,
      stamina: 90,
      powerCooldown: 30,
      lastAction: "Analyse les traces",
      isStreaming: true,
      streamDuration: 18,
      streamPoints: 180,
      distanceTraveled: 0.8
    },
    {
      id: 'saboteur1',
      name: 'Marcus',
      avatar: '⚡',
      position: [48.8572, 2.3528],
      role: 'saboteur',
      isReady: true,
      level: 8,
      health: 85,
      stamina: 75,
      powerCooldown: 15,
      lastAction: "Prépare un piège",
      isStreaming: true,
      streamDuration: 10,
      streamPoints: 120,
      distanceTraveled: 0.5
    }
  ]);

  const [activeEvents, setActiveEvents] = useState<GameEvent[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    grimEscapes: 3,
    hunterKills: 2,
    powerUsed: 8,
    distanceCovered: 2.5,
    closestEncounter: 15,
    longestChase: 45
  });

  const [highlightMoment, setHighlightMoment] = useState<{
    title: string;
    description: string;
    timestamp: Date;
    type: 'epic' | 'normal';
  } | null>(null);

  const [talkieMessages, setTalkieMessages] = useState<TalkieMessage[]>([]);
  const [isTalkieEnabled, setIsTalkieEnabled] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [talkieVolume, setTalkieVolume] = useState(0.5);
  const [isPlayingRadioSound, setIsPlayingRadioSound] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamPoints, setStreamPoints] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [streamRewards] = useState<StreamReward[]>([
    { duration: 5, points: 100, achieved: false },
    { duration: 15, points: 300, achieved: false },
    { duration: 30, points: 600, achieved: false }
  ]);

  const [showVideoModal, setShowVideoModal] = useState<string | null>(null);

  // Effet pour démarrer la musique au chargement de la page
  useEffect(() => {
    if (!isMusicPlaying) {
      toggleMusic();
    }
    return () => {
      if (isMusicPlaying) {
        toggleMusic();
      }
    };
  }, []);

  // Effet pour simuler le mouvement des joueurs
  useEffect(() => {
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

  // Mettre à jour le temps et simuler les mouvements des joueurs
  useEffect(() => {
    const interval = setInterval(() => {
      // Mettre à jour le temps restant
      setTimeLeft(prev => Math.max(0, prev - 1));

      // Simuler les mouvements des joueurs
      setPlayers(prev => prev.map(player => {
        const newPosition: [number, number] = [
          player.position[0] + (Math.random() - 0.5) * 0.001,
          player.position[1] + (Math.random() - 0.5) * 0.001
        ];
        
        // Simuler la consommation de stamina
        const newStamina = Math.max(0, player.stamina - (Math.random() * 2));
        
        // Simuler le cooldown des pouvoirs
        const newPowerCooldown = Math.max(0, player.powerCooldown - 1);
        
        // Calculer la distance parcourue
        const distance = Math.sqrt(
          Math.pow(newPosition[0] - player.position[0], 2) +
          Math.pow(newPosition[1] - player.position[1], 2)
        ) * 111000; // Conversion en mètres approximative
        
        return {
          ...player,
          position: newPosition,
          stamina: newStamina,
          powerCooldown: newPowerCooldown,
          distanceTraveled: (player.distanceTraveled || 0) + distance
        };
      }));

      // Simuler des événements aléatoires
      if (Math.random() < 0.1) {
        const eventTypes = ['zone', 'power', 'encounter', 'escape', 'kill'];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const newEvent: GameEvent = {
          id: Date.now().toString(),
          type: eventType as any,
          description: getEventDescription(eventType),
          position: [48.8566 + (Math.random() - 0.5) * 0.01, 2.3522 + (Math.random() - 0.5) * 0.01],
          timestamp: new Date(),
          duration: Math.floor(Math.random() * 30) + 15
        };
        setActiveEvents(prev => [...prev, newEvent]);
        
        // Ajouter un message système pour l'événement
        addSystemMessage(newEvent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getEventDescription = (type: string): string => {
    const descriptions = {
      zone: "Une nouvelle zone de danger est apparue !",
      power: "Un joueur a utilisé un pouvoir spécial !",
      encounter: "Une rencontre tendue entre le Grim et un chasseur !",
      escape: "Le Grim s'est échappé de justesse !",
      kill: "Un chasseur a été éliminé !"
    };
    return descriptions[type as keyof typeof descriptions] || "Un événement mystérieux s'est produit";
  };

  const addSystemMessage = (event: GameEvent) => {
    const icons = {
      zone: '⚠️',
      power: '⚡',
      encounter: '⚔️',
      escape: '🏃',
      kill: '💀'
    };
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      author: 'Système',
      content: event.description,
      timestamp: new Date(),
      isSystem: true,
      type: event.type as any,
      icon: icons[event.type as keyof typeof icons]
    }]);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Effet pour gérer les sons du talkie-walkie
  useEffect(() => {
    const radioStart = new Audio('/sounds/radio-start.mp3');
    const radioEnd = new Audio('/sounds/radio-end.mp3');
    const radioClick = new Audio('/sounds/radio-click.mp3');

    radioStart.volume = talkieVolume;
    radioEnd.volume = talkieVolume;
    radioClick.volume = talkieVolume;

    return () => {
      radioStart.pause();
      radioEnd.pause();
      radioClick.pause();
    };
  }, [talkieVolume]);

  // Simuler des messages talkie-walkie
  useEffect(() => {
    if (!isTalkieEnabled) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% de chance d'avoir un message
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        const duration = Math.floor(Math.random() * 5) + 2; // 2-7 secondes

        const newMessage: TalkieMessage = {
          id: Date.now().toString(),
          playerName: randomPlayer.name,
          playerRole: randomPlayer.role,
          isPlaying: true,
          timestamp: new Date()
        };

        setTalkieMessages(prev => [...prev, newMessage]);
        
        // Jouer le son de début
        const radioStart = new Audio('/sounds/radio-start.mp3');
        radioStart.volume = talkieVolume;
        radioStart.play();
        setIsPlayingRadioSound(true);

        // Arrêter le message après la durée
        setTimeout(() => {
          setTalkieMessages(prev => 
            prev.map(msg => 
              msg.id === newMessage.id ? { ...msg, isPlaying: false } : msg
            )
          );
          // Jouer le son de fin
          const radioEnd = new Audio('/sounds/radio-end.mp3');
          radioEnd.volume = talkieVolume;
          radioEnd.play();
          setIsPlayingRadioSound(false);
        }, duration * 1000);
      }
    }, 5000); // Vérifier toutes les 5 secondes

    return () => clearInterval(interval);
  }, [isTalkieEnabled, players, talkieVolume]);

  // Effet pour gérer le temps de streaming et les récompenses
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => {
          const newDuration = prev + 1/60; // Incrémentation d'une minute
          
          // Vérifier les récompenses
          streamRewards.forEach(reward => {
            if (!reward.achieved && newDuration >= reward.duration) {
              setStreamPoints(prev => prev + reward.points);
              addSystemMessage({
                id: Date.now().toString(),
                type: 'power',
                description: `Récompense de streaming : +${reward.points} points pour ${reward.duration} minutes de direct !`,
                timestamp: new Date()
              });
              reward.achieved = true;
            }
          });
          
          return newDuration;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, streamRewards]);

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Head>
          <title>Mode Spectateur - GRIM</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link href="/hunts" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
              <span>←</span>
              <span>Retour aux chasses</span>
            </Link>
            <div className="flex items-center gap-4">
              <ShopButton />
            </div>
          </div>

          {/* Header avec timer et contrôles */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/spectate" className="text-blue-500 hover:text-blue-400">
              ← Retour
            </Link>
            
            {/* Timer */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text"
            >
              {formatTime(timeLeft)}
            </motion.div>
          </div>

          {/* Grille principale */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Colonne de gauche - Liste des joueurs */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Joueurs ({players.length})</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="bg-gray-800 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center text-xl">
                          {player.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-purple-400">Niveau {player.level}</div>
                        </div>
                      </div>
                      {player.isStreaming && (
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Talkie-Walkie (Desktop) */}
              <div className="hidden lg:block bg-gray-900 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Contrôles audio</h3>
                
                {/* Musique d'ambiance */}
                <div className="space-y-3 mb-6 border-b border-gray-800 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Musique d'ambiance</span>
                    <button
                      onClick={toggleMusic}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                        isMusicPlaying ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <span>{isMusicPlaying ? '🔊' : '🔇'}</span>
                      <span>{isMusicPlaying ? 'Activée' : 'Désactivée'}</span>
                    </button>
                  </div>
                  
                  {isMusicPlaying && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">Volume</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={audioVolume}
                        onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                        className="flex-1 accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Talkie-walkie */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Talkie-walkie</span>
                    <button
                      onClick={() => setIsTalkieEnabled(!isTalkieEnabled)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                        isTalkieEnabled ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <span>📻</span>
                      <span>{isTalkieEnabled ? 'Activé' : 'Désactivé'}</span>
                    </button>
                  </div>

                  {isTalkieEnabled && (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Volume</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={talkieVolume}
                          onChange={(e) => setTalkieVolume(parseFloat(e.target.value))}
                          className="flex-1 accent-purple-500"
                        />
                      </div>

                      {/* Sélection du canal */}
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Canal</div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'all', label: 'Tous', icon: '📻' },
                            { id: 'hunters', label: 'Chasseurs', icon: '🎯' },
                            { id: 'specials', label: 'Spéciaux', icon: '🎭' }
                          ].map((channel) => (
                            <button
                              key={channel.id}
                              onClick={() => setSelectedChannel(channel.id)}
                              className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                selectedChannel === channel.id
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>{channel.icon}</span>
                                <span className="truncate">{channel.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Menu camembert mobile */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="lg:hidden fixed bottom-4 right-4 z-50"
              >
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg text-2xl"
                >
                  🎮
                </button>

                <AnimatePresence>
                  {showMobileMenu && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute bottom-16 right-0 flex flex-col gap-4"
                    >
                      {/* Bouton Talkie-Walkie */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setIsTalkieEnabled(!isTalkieEnabled);
                          setShowMobileMenu(false);
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          isTalkieEnabled ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                      >
                        📻
                      </motion.button>

                      {/* Bouton Musique */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMusic}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          isMusicPlaying ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                      >
                        {isMusicPlaying ? '🔊' : '🔇'}
                      </motion.button>

                      {/* Contrôle du volume (apparaît si la musique est active) */}
                      {isMusicPlaying && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="absolute -left-32 bottom-0 bg-gray-900 rounded-lg p-3 flex items-center gap-2"
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={audioVolume}
                            onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                            className="w-24 accent-purple-500"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Colonne centrale - Carte et flux vidéo */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-2xl overflow-hidden h-[600px]">
                <Map
                  ref={mapRef}
                  showGrim={true}
                  onPlayerSelect={setSelectedPlayer}
                  specialZones={activeEvents.filter(e => e.type === 'zone').map(e => ({
                    id: e.id,
                    type: 'danger',
                    position: e.position || [0, 0],
                    name: 'Zone dangereuse',
                    description: e.description,
                    icon: '⚠️',
                    isActive: true,
                    nextAppearance: 0
                  }))}
                  players={players}
                  onToggleStream={() => {}}
                  isStreaming={false}
                  isSpectator={true}
                />
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Flux vidéo en direct</h2>
                <div className="grid grid-cols-2 gap-4">
                  {players.filter(p => p.isStreaming).length === 0 ? (
                    <div className="col-span-2 bg-gray-800 rounded-xl p-4 text-center">
                      <p className="text-gray-400">Aucun flux vidéo actif pour le moment</p>
                    </div>
                  ) : (
                    players.filter(p => p.isStreaming).map((player) => (
                      <motion.div
                        key={player.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-purple-500/50 transition-all"
                        onClick={() => setShowVideoModal(player.id)}
                      >
                        <div className="relative w-full aspect-video">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 animate-gradient" />
                          
                          <div className="absolute top-2 left-2 bg-red-600/90 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                            <span className="animate-pulse">●</span>
                            EN DIRECT
                          </div>
                          
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{player.avatar}</span>
                                <div>
                                  <div className="font-medium">{player.name}</div>
                                  <div className="text-xs text-purple-400">
                                    {Math.floor(player.streamDuration || 0)} min • {player.streamPoints} points
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

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

              {/* Classement rapide */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl p-4"
              >
                <h2 className="text-lg font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  Classement rapide
                </h2>
                <div className="space-y-2">
                  {players
                    .sort((a, b) => ((b.streamPoints || 0) + (b.killCount || 0) * 100) - ((a.streamPoints || 0) + (a.killCount || 0) * 100))
                    .slice(0, 3)
                    .map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 rounded-lg p-2 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">#{index + 1}</span>
                          <span>{player.avatar}</span>
                          <div className="flex flex-col">
                            <span className="font-medium">{player.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              player.role === 'grim' ? 'bg-purple-500/20 text-purple-400' :
                              player.role === 'hunter' ? 'bg-red-500/20 text-red-400' :
                              player.role === 'informer' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {player.role}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{(player.streamPoints || 0) + (player.killCount || 0) * 100} pts</div>
                          {player.isStreaming && (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                              <span className="animate-pulse">●</span> En direct
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            </div>

            {/* Colonne de droite - Communications et événements */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Communications</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {messages.filter(msg => !msg.isSystem).map((message) => (
                    <div
                      key={message.id}
                      className="bg-gray-800 p-3 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-purple-400">{message.author}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{message.content}</p>
                    </div>
                  ))}
                  {messages.filter(msg => !msg.isSystem).length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      Aucune communication pour le moment
                    </div>
                  )}
                </div>
              </div>

              {/* Événements actifs */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Événements actifs</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-800/50 pr-2">
                  {activeEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-800 rounded-xl p-4 border border-purple-500/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center">
                          <span>{
                            event.type === 'zone' ? '⚠️' :
                            event.type === 'power' ? '⚡' :
                            event.type === 'encounter' ? '⚔️' :
                            event.type === 'escape' ? '🏃' : '💀'
                          }</span>
                        </div>
                        <div>
                          <div className="font-medium">{event.description}</div>
                          {event.duration && (
                            <div className="text-sm text-purple-400">
                              Expire dans {event.duration}s
                            </div>
                          )}
                        </div>
                      </div>
                      {event.position && (
                        <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                          <span>📍</span>
                          <span>Position: {event.position[0].toFixed(4)}, {event.position[1].toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {activeEvents.length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      Aucun événement actif
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal pour le flux vidéo en plein écran */}
        <AnimatePresence>
          {showVideoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1001] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowVideoModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  {selectedPlayer && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center text-2xl">
                        {selectedPlayer.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedPlayer.name}</h3>
                        <div className="text-sm text-purple-400">
                          {Math.floor(selectedPlayer.streamDuration || 0)} minutes de stream
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowVideoModal(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 animate-gradient" />
                  
                  <div className="absolute top-4 left-4 bg-red-600/90 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="animate-pulse">●</span>
                    EN DIRECT
                  </div>

                  {selectedPlayer && (
                    <div className="absolute top-4 right-4 bg-purple-600/90 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPlayer.streamPoints} points
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interface mobile du talkie-walkie */}
        <AnimatePresence>
          {isTalkieEnabled && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="lg:hidden fixed bottom-20 left-4 right-4 bg-gray-900 rounded-2xl p-4 border border-purple-500/20 shadow-lg z-40"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Talkie-walkie</h3>
                <button
                  onClick={() => setIsTalkieEnabled(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Volume */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={talkieVolume}
                    onChange={(e) => setTalkieVolume(parseFloat(e.target.value))}
                    className="flex-1 accent-purple-500"
                  />
                </div>

                {/* Sélection du canal */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Canal</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'all', label: 'Tous', icon: '📻' },
                      { id: 'hunters', label: 'Chasseurs', icon: '🎯' },
                      { id: 'specials', label: 'Spéciaux', icon: '🎭' }
                    ].map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedChannel === channel.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{channel.icon}</span>
                          <span className="truncate">{channel.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages récents */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Messages récents</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {talkieMessages.length > 0 ? (
                      talkieMessages.slice(-3).map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2 rounded-lg ${
                            msg.isPlaying
                              ? 'bg-purple-600/20 border border-purple-500/30'
                              : 'bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{msg.playerName}</span>
                            {msg.isPlaying && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-2 h-2 rounded-full bg-purple-500"
                              />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-2">
                        Aucun message récent
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
          }
        `}</style>
      </div>
    </>
  );
} 