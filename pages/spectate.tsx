import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LiveGame {
  id: string;
  city: string;
  startTime: Date;
  players: {
    total: number;
    hunters: number;
    grim: number;
  };
  spectators: number;
  status: 'starting' | 'in_progress' | 'ending';
  timeLeft: number;
}

export default function Spectate() {
  const router = useRouter();
  const [liveGames, setLiveGames] = useState<LiveGame[]>([
    {
      id: '1',
      city: 'Paris',
      startTime: new Date(),
      players: {
        total: 8,
        hunters: 7,
        grim: 1
      },
      spectators: 12,
      status: 'in_progress',
      timeLeft: 2400 // 40 minutes
    },
    {
      id: '2',
      city: 'Lyon',
      startTime: new Date(Date.now() - 900000), // Started 15 minutes ago
      players: {
        total: 6,
        hunters: 5,
        grim: 1
      },
      spectators: 8,
      status: 'in_progress',
      timeLeft: 1800 // 30 minutes
    }
  ]);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Mettre à jour le temps restant
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGames(prev => prev.map(game => ({
        ...game,
        timeLeft: Math.max(0, game.timeLeft - 1)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeElapsed = (startTime: Date) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    return formatTime(elapsed);
  };

  const handleSpectateGame = (gameId: string) => {
    router.push(`/game/spectate/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Parties en direct - GRIM</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-2 ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                : 'bg-gradient-to-r from-red-600 to-red-500 text-white'
            }`}>
              <span>{notification.type === 'success' ? '✅' : '❌'}</span>
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-500 hover:text-blue-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
            Parties en direct
          </h1>
        </div>

        {/* Liste des parties en direct */}
        <div className="grid gap-6">
          {liveGames.map(game => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-neon-blue"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl">
                    👁️
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Partie à {game.city}</h2>
                    <p className="text-gray-400">En cours depuis {formatTimeElapsed(game.startTime)}</p>
                    <p className="text-lg font-semibold mt-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
                      Temps restant : {formatTime(game.timeLeft)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-sm text-gray-400">Joueurs</div>
                    <div className="font-bold">
                      {game.players.total} ({game.players.hunters} 🎯 | {game.players.grim} 🎭)
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Spectateurs</div>
                    <div className="font-bold">
                      {game.spectators} 👁️
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpectateGame(game.id)}
                    className="px-6 py-2 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
                  >
                    <span>👁️</span>
                    Regarder
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {liveGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-xl">
                Aucune partie en cours pour le moment.
              </p>
              <p className="text-gray-500 mt-2">
                Revenez plus tard pour regarder des parties en direct !
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        .shadow-neon-blue {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
} 