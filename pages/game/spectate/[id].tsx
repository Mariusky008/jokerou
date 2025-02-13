import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  role: 'grim' | 'hunter';
  isReady: boolean;
  level: number;
}

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export default function SpectateGame() {
  const router = useRouter();
  const { id } = router.query;

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
      level: 15
    },
    {
      id: 'hunter1',
      name: 'Alex',
      avatar: '🎯',
      position: [48.8566, 2.3522],
      role: 'hunter',
      isReady: true,
      level: 8
    },
    {
      id: 'hunter2',
      name: 'Marie',
      avatar: '🎯',
      position: [48.8566, 2.3522],
      role: 'hunter',
      isReady: true,
      level: 12
    }
  ]);

  // Mettre à jour le temps et simuler les mouvements des joueurs
  useEffect(() => {
    const interval = setInterval(() => {
      // Mettre à jour le temps restant
      setTimeLeft(prev => Math.max(0, prev - 1));

      // Simuler les mouvements des joueurs (à remplacer par les vraies données)
      setPlayers(prev => prev.map(player => ({
        ...player,
        position: [
          player.position[0] + (Math.random() - 0.5) * 0.001,
          player.position[1] + (Math.random() - 0.5) * 0.001
        ]
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simuler les messages du chat
  useEffect(() => {
    const events = [
      "Le Grim a utilisé son pouvoir de camouflage !",
      "Un chasseur a repéré des traces suspectes...",
      "Une zone spéciale est apparue sur la carte !",
      "Le Grim s'est échappé de justesse !",
      "Les chasseurs se rapprochent..."
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const event = events[Math.floor(Math.random() * events.length)];
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          author: 'Système',
          content: event,
          timestamp: new Date(),
          isSystem: true
        }]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Spectateur - GRIM</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/spectate" className="text-blue-500 hover:text-blue-400">
            ← Retour aux parties en direct
          </Link>
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Mode spectateur</span>
            <span className="text-2xl">👁️</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section principale avec la carte */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Map
                isSpectator={true}
                players={players}
              />
            </motion.div>

            {/* Liste des joueurs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {players.map(player => (
                <div
                  key={player.id}
                  className="bg-gray-900 p-4 rounded-xl flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                    ${player.role === 'grim' 
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600'
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
              ))}
            </div>
          </div>

          {/* Chat et événements */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-neon-blue"
            >
              <h2 className="text-xl font-bold mb-4">Événements de la partie</h2>
              <div className="space-y-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.isSystem
                        ? 'bg-blue-900/30 border border-blue-500/20'
                        : 'bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold ${
                        msg.isSystem ? 'text-blue-400' : ''
                      }`}>
                        {msg.author}
                      </span>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{msg.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shadow-neon-blue {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
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