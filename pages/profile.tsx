import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import GameRules from '../components/GameRules';

// Types pour les données du profil
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  jokerGames: number;
  hunterGames: number;
  captureRate: number;
  escapeRate: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

export default function Profile() {
  // Données simulées du profil
  const [stats] = useState<Stats>({
    gamesPlayed: 42,
    gamesWon: 28,
    jokerGames: 15,
    hunterGames: 27,
    captureRate: 75,
    escapeRate: 60,
    level: 8,
    xp: 2400,
    nextLevelXp: 3000
  });

  const [badges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Joker Invincible',
      description: 'A survécu pendant 60 minutes en tant que Joker',
      icon: '🎭',
      rarity: 'legendary'
    },
    {
      id: '2',
      name: 'Chasseur Élite',
      description: 'A capturé le Joker en moins de 10 minutes',
      icon: '🎯',
      rarity: 'epic'
    },
    {
      id: '3',
      name: 'Stratège',
      description: 'A utilisé tous ses pouvoirs dans une partie',
      icon: '🧠',
      rarity: 'rare'
    },
    {
      id: '4',
      name: 'Premier Sang',
      description: 'Première capture en tant que chasseur',
      icon: '🏆',
      rarity: 'common'
    }
  ]);

  const [showRules, setShowRules] = useState(false);

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-yellow-400 to-orange-500'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Profil - Jokerou</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Bouton des règles */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowRules(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors shadow-lg"
          >
            <span>📜</span>
            Règles du jeu
          </button>
        </div>

        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Section Profil */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-2xl p-8 shadow-neon"
          >
            <div className="flex items-center mb-8">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">John Doe</h1>
                <p className="text-gray-400">Niveau {stats.level}</p>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>XP: {stats.xp}</span>
                <span>{stats.nextLevelXp}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                  style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                <div className="text-gray-400">Parties jouées</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="text-2xl font-bold">{stats.gamesWon}</div>
                <div className="text-gray-400">Victoires</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="text-2xl font-bold">{stats.captureRate}%</div>
                <div className="text-gray-400">Taux de capture</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="text-2xl font-bold">{stats.escapeRate}%</div>
                <div className="text-gray-400">Taux d'évasion</div>
              </div>
            </div>
          </motion.div>

          {/* Section Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-2xl p-8 shadow-neon"
          >
            <h2 className="text-2xl font-bold mb-6">Badges</h2>
            <div className="grid gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gray-800 p-4 rounded-xl flex items-center"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${rarityColors[badge.rarity]} flex items-center justify-center text-2xl`}>
                    {badge.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold">{badge.name}</h3>
                    <p className="text-gray-400 text-sm">{badge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal des règles */}
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />

      <style jsx global>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  );
} 