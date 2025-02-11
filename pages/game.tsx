import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import TalkieWalkie from '../components/TalkieWalkie';

// Import dynamique de la carte pour éviter les erreurs SSR
const MapComponent = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-900 rounded-2xl flex items-center justify-center">
      <div className="text-2xl text-gray-400">Chargement de la carte...</div>
    </div>
  ),
});

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
  role: 'joker' | 'hunter';
  stats: PlayerStats;
  description: string;
}

export default function Game() {
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isJoker] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [privateMessage, setPrivateMessage] = useState('');
  const [globalMessage, setGlobalMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showJoker, setShowJoker] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

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
      description: 'Meilleure dissimulation pour le Joker',
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

  const [currentPlayer] = useState<Player>({
    id: 'current',
    name: 'Vous',
    avatar: '👤',
    role: isJoker ? 'joker' : 'hunter',
    stats: {
      gamesPlayed: 42,
      winRate: 75,
      level: 15,
      xp: 15000
    },
    description: 'Votre profil'
  });

  const [players] = useState<Player[]>([
    {
      id: 'player1',
      name: 'Alex',
      avatar: '👤',
      role: 'hunter',
      stats: {
        gamesPlayed: 23,
        winRate: 65,
        level: 8,
        xp: 8000
      },
      description: 'Chasseur expérimenté'
    },
    {
      id: 'player2',
      name: 'Marie',
      avatar: '👤',
      role: 'hunter',
      stats: {
        gamesPlayed: 35,
        winRate: 80,
        level: 12,
        xp: 12000
      },
      description: 'Chasseuse redoutable'
    },
    {
      id: 'player3',
      name: 'Lucas',
      avatar: '👤',
      role: 'hunter',
      stats: {
        gamesPlayed: 28,
        winRate: 70,
        level: 10,
        xp: 10000
      },
      description: 'Chasseur stratégique'
    }
  ]);

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

    // Timer pour cacher le Joker après 30 secondes
    if (showJoker) {
      const jokerTimer = setTimeout(() => {
        setShowJoker(false);
      }, 30000);
      return () => {
        clearTimeout(jokerTimer);
        clearInterval(timer);
      };
    }

    return () => clearInterval(timer);
  }, [showJoker]);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const usePower = (powerId: string) => {
    setPowers((prev) =>
      prev.map((power) => {
        if (power.id === powerId && power.remainingUses > 0 && power.cooldown === 0) {
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
        // Si le cooldown vient de se terminer, jouer le son de recharge
        if (power.id === powerId && power.cooldown === 1) {
          if (typeof window !== 'undefined' && (window as any).playPowerSound) {
            (window as any).playPowerSound('recharge');
          }
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Head children={<>
        <title>En Jeu - GRIM</title>
      </>} />

      <div className="container mx-auto px-4 py-8">
        {/* En-tête du jeu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${isJoker ? 'bg-purple-600' : 'bg-blue-600'} flex items-center justify-center text-2xl`}>
              {isJoker ? '🎭' : '🎯'}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">
                {isJoker ? 'Vous êtes le Grim' : 'Vous êtes un Chasseur'}
              </h1>
              <p className="text-gray-400">
                {isJoker ? 'Échappez aux chasseurs' : 'Traquez le Grim'}
              </p>
            </div>
          </div>

          <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {formatTime(timeLeft)}
          </div>
        </motion.div>

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
              <MapComponent 
                showJoker={showJoker} 
                onPlayerSelect={setSelectedPlayer}
                specialZones={specialZones}
              />
            </motion.div>

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
                    <p className="text-purple-400">Niveau {selectedPlayer.stats.level}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{selectedPlayer.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-lg font-bold">{selectedPlayer.stats.gamesPlayed}</div>
                    <div className="text-sm text-gray-400">Parties jouées</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-lg font-bold">{selectedPlayer.stats.winRate}%</div>
                    <div className="text-sm text-gray-400">Taux de victoire</div>
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