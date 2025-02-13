import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAudio } from '../../../contexts/AudioContext';

// Import dynamique de la carte pour éviter les erreurs SSR
const Map = dynamic(
  () => import('../../../components/Map').then((mod) => mod.default),
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
  health: number;
  stamina: number;
  powerCooldown: number;
  lastAction?: string;
  killCount?: number;
  distanceTraveled?: number;
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
  playerId: string;
  playerName: string;
  playerRole: string;
  timestamp: Date;
  duration: number;
  isPlaying: boolean;
}

export default function SpectateGame() {
  const router = useRouter();
  const { id } = router.query;
  const { toggleMusic, isMusicPlaying, audioVolume, adjustVolume } = useAudio();

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
      killCount: 0,
      distanceTraveled: 0,
      lastAction: "S'est caché dans l'ombre"
    },
    {
      id: 'hunter1',
      name: 'Alex',
      avatar: '🎯',
      position: [48.8570, 2.3525],
      role: 'hunter',
      isReady: true,
      level: 8,
      health: 100,
      stamina: 100,
      powerCooldown: 0,
      killCount: 2,
      distanceTraveled: 1.2,
      lastAction: "A activé son radar"
    },
    {
      id: 'hunter2',
      name: 'Marie',
      avatar: '🎯',
      position: [48.8562, 2.3518],
      role: 'hunter',
      isReady: true,
      level: 12,
      health: 100,
      stamina: 90,
      powerCooldown: 30,
      killCount: 1,
      distanceTraveled: 0.8,
      lastAction: "A placé un piège"
    },
    {
      id: 'illusionist1',
      name: 'Sophie',
      avatar: '🎪',
      position: [48.8568, 2.3520],
      role: 'illusionist',
      isReady: true,
      level: 18,
      health: 100,
      stamina: 95,
      powerCooldown: 15,
      killCount: 0,
      distanceTraveled: 0.9,
      lastAction: "A créé un leurre"
    },
    {
      id: 'hunter3',
      name: 'Thomas',
      avatar: '🎯',
      position: [48.8564, 2.3526],
      role: 'hunter',
      isReady: true,
      level: 10,
      health: 85,
      stamina: 75,
      powerCooldown: 45,
      killCount: 1,
      distanceTraveled: 1.5,
      lastAction: "A utilisé sa vision thermique"
    },
    {
      id: 'informer1',
      name: 'Lucas',
      avatar: '🔍',
      position: [48.8567, 2.3523],
      role: 'informer',
      isReady: true,
      level: 20,
      health: 100,
      stamina: 100,
      powerCooldown: 0,
      killCount: 0,
      distanceTraveled: 1.1,
      lastAction: "A vendu une information"
    },
    {
      id: 'hunter4',
      name: 'Emma',
      avatar: '🎯',
      position: [48.8565, 2.3519],
      role: 'hunter',
      isReady: true,
      level: 9,
      health: 95,
      stamina: 80,
      powerCooldown: 20,
      killCount: 0,
      distanceTraveled: 0.7,
      lastAction: "A coordonné une attaque"
    },
    {
      id: 'saboteur1',
      name: 'Hugo',
      avatar: '⚡',
      position: [48.8563, 2.3521],
      role: 'saboteur',
      isReady: true,
      level: 15,
      health: 100,
      stamina: 85,
      powerCooldown: 10,
      killCount: 0,
      distanceTraveled: 1.3,
      lastAction: "A désactivé un pouvoir"
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
  const [isTalkieEnabled, setIsTalkieEnabled] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'hunters' | 'special'>('all');
  const [talkieVolume, setTalkieVolume] = useState(0.5);
  const [isPlayingRadioSound, setIsPlayingRadioSound] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
          playerId: randomPlayer.id,
          playerName: randomPlayer.name,
          playerRole: randomPlayer.role,
          timestamp: new Date(),
          duration: duration,
          isPlaying: true
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Mode Spectateur - GRIM</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-8">
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

          {/* Menu hamburger pour mobile */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 relative z-[9999]"
            >
              <span className="text-2xl">☰</span>
            </button>

            {/* Menu mobile */}
            <AnimatePresence>
              {showMobileMenu && (
                <>
                  {/* Overlay pour fermer le menu en cliquant en dehors */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997]"
                    onClick={() => setShowMobileMenu(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute right-0 top-12 w-64 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-4 z-[9998] border border-gray-800"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Musique</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleMusic}
                            className="p-2 rounded-lg bg-gray-800"
                          >
                            {isMusicPlaying ? '🔊' : '🔈'}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={audioVolume}
                            onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                            className="w-20 accent-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-gray-400">Talkie-walkie</span>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setIsTalkieEnabled(!isTalkieEnabled)}
                            className={`p-2 rounded-lg bg-gray-800 ${
                              isTalkieEnabled ? 'text-green-400' : 'text-gray-400'
                            }`}
                          >
                            📻 {isTalkieEnabled ? 'ON' : 'OFF'}
                          </button>
                          {isTalkieEnabled && (
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={talkieVolume}
                              onChange={(e) => setTalkieVolume(parseFloat(e.target.value))}
                              className="w-20 accent-green-500"
                            />
                          )}
                        </div>
                        {isTalkieEnabled && (
                          <select
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value as 'all' | 'hunters' | 'special')}
                            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="all">Tous les canaux</option>
                            <option value="hunters">Canal chasseurs</option>
                            <option value="special">Canal spécial</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Contrôles desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMusic}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                title={isMusicPlaying ? "Couper la musique" : "Jouer la musique"}
              >
                {isMusicPlaying ? '🔊' : '🔈'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioVolume}
                onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                className="w-24 accent-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsTalkieEnabled(!isTalkieEnabled)}
                className={`bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isTalkieEnabled ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                📻 {isTalkieEnabled ? 'ON' : 'OFF'}
              </button>
              {isTalkieEnabled && (
                <>
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value as 'all' | 'hunters' | 'special')}
                    className="bg-gray-800 rounded-lg px-3 py-2"
                  >
                    <option value="all">Tous les canaux</option>
                    <option value="hunters">Canal chasseurs</option>
                    <option value="special">Canal spécial</option>
                  </select>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={talkieVolume}
                    onChange={(e) => setTalkieVolume(parseFloat(e.target.value))}
                    className="w-24 accent-green-500"
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Mode spectateur</span>
              <span className="text-2xl">👁️</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section principale avec la carte */}
          <div className="lg:col-span-3 space-y-8">
            {/* Carte interactive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Map
                isSpectator={true}
                players={players}
              />
              
              {/* Événements sur la carte */}
              <AnimatePresence>
                {activeEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute"
                    style={{
                      left: `${(event.position?.[1] || 0) * 100}%`,
                      top: `${(event.position?.[0] || 0) * 100}%`
                    }}
                  >
                    <div className={`p-2 rounded-full ${
                      event.type === 'zone' ? 'bg-red-500/50' :
                      event.type === 'power' ? 'bg-purple-500/50' :
                      event.type === 'encounter' ? 'bg-yellow-500/50' :
                      event.type === 'escape' ? 'bg-green-500/50' :
                      'bg-blue-500/50'
                    }`}>
                      {event.type === 'zone' ? '⚠️' :
                       event.type === 'power' ? '⚡' :
                       event.type === 'encounter' ? '⚔️' :
                       event.type === 'escape' ? '🏃' :
                       '💀'}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Statistiques des joueurs - Version modifiée */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {players.map(player => (
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPlayer(player)}
                  className={`bg-gray-900 p-4 rounded-xl cursor-pointer border-2 ${
                    selectedPlayer?.id === player.id ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                      ${player.role === 'grim' 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                        : player.role === 'illusionist' ? 'bg-gradient-to-br from-pink-600 to-purple-600'
                        : player.role === 'informer' ? 'bg-gradient-to-br from-cyan-600 to-blue-600'
                        : player.role === 'saboteur' ? 'bg-gradient-to-br from-red-600 to-orange-600'
                        : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                      }`}
                    >
                      {player.avatar}
                    </div>
                    <div>
                      <div className="font-bold">{player.name}</div>
                      <div className="text-sm text-gray-400">Niveau {player.level}</div>
                    </div>
                  </div>

                  {/* Nouvelles statistiques */}
                  <div className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-gray-400">Éliminations</div>
                        <div className="font-bold text-lg">{player.killCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Distance</div>
                        <div className="font-bold text-lg">{player.distanceTraveled?.toFixed(1)}km</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-gray-400 text-sm">Dernière action</div>
                      <div className="text-sm mt-1">{player.lastAction || 'Aucune action'}</div>
                    </div>

                    {player.powerCooldown > 0 && (
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-gray-400 text-sm">Pouvoir disponible dans</div>
                        <div className="text-sm mt-1">{Math.ceil(player.powerCooldown / 60)}min</div>
                      </div>
                    )}

                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-gray-400 text-sm">Rôle</div>
                      <div className="text-sm mt-1 font-medium">
                        {player.role === 'grim' ? 'Grim' :
                         player.role === 'illusionist' ? 'Illusionniste' :
                         player.role === 'informer' ? 'Informateur' :
                         player.role === 'saboteur' ? 'Saboteur' :
                         'Chasseur'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Statistiques globales de la partie */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">🏃</div>
                <div className="text-xl font-bold text-blue-400">{gameStats.grimEscapes}</div>
                <div className="text-sm text-gray-400">Évasions</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">💀</div>
                <div className="text-xl font-bold text-blue-400">{gameStats.hunterKills}</div>
                <div className="text-sm text-gray-400">Éliminations</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-xl font-bold text-blue-400">{gameStats.powerUsed}</div>
                <div className="text-sm text-gray-400">Pouvoirs</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">📏</div>
                <div className="text-xl font-bold text-blue-400">{gameStats.distanceCovered}km</div>
                <div className="text-sm text-gray-400">Distance</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">⚔️</div>
                <div className="text-xl font-bold text-blue-400">{gameStats.closestEncounter}m</div>
                <div className="text-sm text-gray-400">Plus proche</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="text-xl font-bold text-blue-400">{gameStats.longestChase}s</div>
                <div className="text-sm text-gray-400">Plus longue traque</div>
              </div>
            </div>
          </div>

          {/* Chat et événements */}
          <div className="space-y-8">
            {/* Informations du joueur sélectionné */}
            <AnimatePresence>
              {selectedPlayer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-900 rounded-2xl p-6 shadow-neon-blue"
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    {selectedPlayer.avatar} {selectedPlayer.name}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Rôle</div>
                        <div className="font-bold">
                          {selectedPlayer.role === 'grim' ? 'Grim' :
                           selectedPlayer.role === 'illusionist' ? 'Illusionniste' :
                           selectedPlayer.role === 'informer' ? 'Informateur' :
                           selectedPlayer.role === 'saboteur' ? 'Saboteur' :
                           'Chasseur'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Niveau</div>
                        <div className="font-bold">{selectedPlayer.level}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Dernière action</div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        {selectedPlayer.lastAction || 'Aucune action récente'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flux d'événements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-neon-blue"
            >
              <h2 className="text-xl font-bold mb-4">Événements de la partie</h2>
              <div className="space-y-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg ${
                      msg.isSystem
                        ? 'bg-blue-900/30 border border-blue-500/20'
                        : 'bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold flex items-center gap-2 ${
                        msg.isSystem ? 'text-blue-400' : ''
                      }`}>
                        {msg.icon && <span>{msg.icon}</span>}
                        {msg.author}
                      </span>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{msg.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Moments forts */}
        <AnimatePresence>
          {highlightMoment && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 shadow-lg max-w-md"
            >
              <h3 className="text-xl font-bold mb-2">{highlightMoment.title}</h3>
              <p className="text-gray-200">{highlightMoment.description}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section des messages talkie-walkie */}
        {isTalkieEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 w-80 sm:w-96 bg-gradient-to-br from-gray-900/95 to-green-900/20 backdrop-blur-md border-2 border-green-500/30 rounded-2xl p-4 sm:p-6 shadow-neon-green"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`relative ${isPlayingRadioSound ? 'animate-pulse' : ''}`}>
                  <span className="text-2xl sm:text-3xl">📻</span>
                  {isPlayingRadioSound && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Talkie-Walkie</h3>
                  <div className={`text-xs ${isPlayingRadioSound ? 'text-green-400' : 'text-gray-400'}`}>
                    {isPlayingRadioSound ? 'Transmission en cours...' : 'En attente de transmission'}
                  </div>
                </div>
              </div>
              {isPlayingRadioSound && (
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full">
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-0" />
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300" />
                  </span>
                  <span className="text-green-400 text-xs font-medium">LIVE</span>
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-72 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800/50 pr-2">
              {talkieMessages
                .filter(msg => {
                  if (selectedChannel === 'all') return true;
                  if (selectedChannel === 'hunters') return msg.playerRole === 'hunter';
                  return ['illusionist', 'informer', 'saboteur'].includes(msg.playerRole);
                })
                .map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`relative ${
                      msg.isPlaying 
                        ? 'bg-gradient-to-r from-green-900/40 to-green-800/20 border-2 border-green-500/30' 
                        : 'bg-gray-800/30'
                    } rounded-lg p-3 sm:p-4`}
                  >
                    {msg.isPlaying && (
                      <div className="absolute -top-1 -right-1 w-3 h-3">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          msg.isPlaying ? 'bg-green-500/20' : 'bg-gray-700/50'
                        }`}>
                          <span className="text-xl">
                            {msg.playerRole === 'grim' ? '🎭' :
                             msg.playerRole === 'hunter' ? '🎯' :
                             msg.playerRole === 'illusionist' ? '🎪' :
                             msg.playerRole === 'informer' ? '🔍' :
                             '⚡'}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm sm:text-base">{msg.playerName}</span>
                          <div className="text-xs text-gray-400">
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                        msg.isPlaying ? 'bg-gray-700' : 'bg-gray-700/50'
                      }`}>
                        {msg.isPlaying && (
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: msg.duration, ease: "linear" }}
                            className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          />
                        )}
                      </div>
                      <span className={`text-xs font-medium ${msg.isPlaying ? 'text-green-400' : 'text-gray-400'}`}>
                        {msg.isPlaying ? 'EN DIRECT' : `${msg.duration}s`}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .shadow-neon-blue {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        
        .shadow-neon-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
} 