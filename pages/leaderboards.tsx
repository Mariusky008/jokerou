import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import GameLeaderboard from '../components/GameLeaderboard';

interface GameHistory {
  id: string;
  date: Date;
  players: {
    id: string;
    name: string;
    avatar: string;
    role: 'grim' | 'hunter' | 'illusionist' | 'informer' | 'saboteur';
    points: number;
    level: number;
    achievements?: {
      kills?: number;
      distance?: number;
      powerUses?: number;
      timeAlive?: number;
    };
  }[];
  duration: number;
  winner: string;
}

export default function Leaderboards() {
  // Simulation de l'historique des parties (à remplacer par des données réelles)
  const [gameHistory] = useState<GameHistory[]>([
    {
      id: 'game-1',
      date: new Date('2024-01-15T20:00:00'),
      players: [
        {
          id: 'p1',
          name: 'Alex',
          avatar: '🎯',
          role: 'hunter',
          points: 850,
          level: 15,
          achievements: {
            kills: 3,
            distance: 2.5,
            powerUses: 6
          }
        },
        {
          id: 'p2',
          name: 'Sophie',
          avatar: '🔍',
          role: 'informer',
          points: 720,
          level: 12,
          achievements: {
            kills: 1,
            distance: 3.2,
            powerUses: 8
          }
        },
        {
          id: 'p3',
          name: 'Marcus',
          avatar: '⚡',
          role: 'saboteur',
          points: 680,
          level: 9,
          achievements: {
            kills: 2,
            distance: 1.8,
            powerUses: 5
          }
        },
        {
          id: 'p4',
          name: 'Le Grim',
          avatar: '👻',
          role: 'grim',
          points: 950,
          level: 18,
          achievements: {
            kills: 4,
            distance: 4.0,
            powerUses: 10
          }
        }
      ],
      duration: 3600,
      winner: 'Grim'
    },
    {
      id: 'game-2',
      date: new Date('2024-01-14T18:30:00'),
      players: [
        {
          id: 'p5',
          name: 'Emma',
          avatar: '🎭',
          role: 'illusionist',
          points: 780,
          level: 14,
          achievements: {
            kills: 2,
            distance: 2.8,
            powerUses: 7
          }
        },
        {
          id: 'p6',
          name: 'Lucas',
          avatar: '🎯',
          role: 'hunter',
          points: 920,
          level: 16,
          achievements: {
            kills: 5,
            distance: 3.5,
            powerUses: 9
          }
        },
        {
          id: 'p7',
          name: 'Nina',
          avatar: '🔮',
          role: 'informer',
          points: 650,
          level: 11,
          achievements: {
            kills: 1,
            distance: 2.2,
            powerUses: 4
          }
        }
      ],
      duration: 2800,
      winner: 'Chasseurs'
    },
    {
      id: 'game-3',
      date: new Date('2024-01-13T21:15:00'),
      players: [
        {
          id: 'p8',
          name: 'Thomas',
          avatar: '⚔️',
          role: 'hunter',
          points: 890,
          level: 17,
          achievements: {
            kills: 4,
            distance: 3.8,
            powerUses: 8
          }
        },
        {
          id: 'p9',
          name: 'Léa',
          avatar: '🌟',
          role: 'illusionist',
          points: 750,
          level: 13,
          achievements: {
            kills: 2,
            distance: 2.6,
            powerUses: 6
          }
        },
        {
          id: 'p10',
          name: 'Hugo',
          avatar: '🎭',
          role: 'grim',
          points: 820,
          level: 15,
          achievements: {
            kills: 3,
            distance: 3.0,
            powerUses: 7
          }
        }
      ],
      duration: 3200,
      winner: 'Chasseurs'
    },
    {
      id: 'game-4',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
      players: [
        {
          id: 'p11',
          name: 'Sarah',
          avatar: '🎯',
          role: 'hunter',
          points: 980,
          level: 19,
          achievements: {
            kills: 6,
            distance: 4.2,
            powerUses: 11
          }
        },
        {
          id: 'p12',
          name: 'Max',
          avatar: '⚡',
          role: 'saboteur',
          points: 840,
          level: 16,
          achievements: {
            kills: 3,
            distance: 3.1,
            powerUses: 8
          }
        },
        {
          id: 'p13',
          name: 'Julie',
          avatar: '🔍',
          role: 'informer',
          points: 690,
          level: 12,
          achievements: {
            kills: 1,
            distance: 2.4,
            powerUses: 5
          }
        },
        {
          id: 'p14',
          name: 'Le Grim',
          avatar: '👻',
          role: 'grim',
          points: 910,
          level: 17,
          achievements: {
            kills: 4,
            distance: 3.7,
            powerUses: 9
          }
        }
      ],
      duration: 3900,
      winner: 'Chasseurs'
    }
  ]);

  const [selectedGame, setSelectedGame] = useState<GameHistory | null>(null);
  const [filter, setFilter] = useState<'all' | 'recent' | 'best'>('all');

  const filteredGames = gameHistory.filter(game => {
    switch (filter) {
      case 'recent':
        return new Date(game.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
      case 'best':
        return game.players.some(p => p.points > 400);
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Classements - GRIM</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Historique des parties
          </h1>
          <Link
            href="/game"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors"
          >
            Retour au jeu
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Toutes les parties
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'recent'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            7 derniers jours
          </button>
          <button
            onClick={() => setFilter('best')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'best'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Meilleures parties
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {filteredGames.map(game => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-900 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-gray-800 ${
                  selectedGame?.id === game.id ? 'border-2 border-purple-500' : ''
                }`}
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">
                      Partie du {new Date(game.date).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(game.date).toLocaleTimeString()} - Durée: {Math.floor(game.duration / 60)}min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-purple-400">
                      Victoire: {game.winner}
                    </div>
                    <div className="text-xs text-gray-400">
                      {game.players.length} joueurs
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {game.players.slice(0, 3).map(player => (
                    <div
                      key={player.id}
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm"
                      title={`${player.name} - ${player.points} points`}
                    >
                      {player.avatar}
                    </div>
                  ))}
                  {game.players.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm">
                      +{game.players.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="sticky top-8">
            {selectedGame ? (
              <GameLeaderboard
                players={selectedGame.players}
                gameId={selectedGame.id}
                gameDate={selectedGame.date}
                onClose={() => setSelectedGame(null)}
              />
            ) : (
              <div className="bg-gray-900 rounded-2xl p-8 text-center">
                <p className="text-gray-400">
                  Sélectionnez une partie pour voir son classement détaillé
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 