import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import GameRules from '../components/GameRules';
import PlayerMessages from '../components/PlayerMessages';

// Types pour les données du profil
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProfileData {
  avatar: string;
  name: string;
  description: string;
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

interface GameHistory {
  id: string;
  date: Date;
  role: 'joker' | 'hunter';
  result: 'victory' | 'defeat';
  duration: number;
  xpEarned: number;
  players: {
    id: string;
    name: string;
    avatar: string;
    role: 'joker' | 'hunter';
    level: number;
  }[];
}

interface Player {
  id: string;
  name: string;
  avatar: string;
}

export default function Profile() {
  // Données simulées du profil
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: '👤',
    name: 'John Doe',
    description: 'Passionné de jeux urbains et d\'aventures en plein air.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData>(profileData);

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

  const [gameHistory] = useState<GameHistory[]>([
    {
      id: '1',
      date: new Date(Date.now() - 3600000), // 1 heure avant
      role: 'joker',
      result: 'victory',
      duration: 3600, // 60 minutes
      xpEarned: 1000,
      players: [
        { id: '1', name: 'Alex', avatar: '👤', role: 'hunter', level: 12 },
        { id: '2', name: 'Marie', avatar: '👤', role: 'hunter', level: 8 },
        { id: '3', name: 'Lucas', avatar: '👤', role: 'hunter', level: 15 }
      ]
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000), // 1 jour avant
      role: 'hunter',
      result: 'victory',
      duration: 1800, // 30 minutes
      xpEarned: 500,
      players: [
        { id: '4', name: 'Sophie', avatar: '👤', role: 'joker', level: 10 },
        { id: '5', name: 'Thomas', avatar: '👤', role: 'hunter', level: 7 },
        { id: '6', name: 'Julie', avatar: '👤', role: 'hunter', level: 9 }
      ]
    }
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-yellow-400 to-orange-500'
  };

  // Fonction pour formater la durée
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleAvatarChange = (emoji: string) => {
    setEditedData({ ...editedData, avatar: emoji });
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm py-2 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
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
            {!isEditing ? (
              <div className="flex items-center mb-8">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-3xl cursor-pointer hover:bg-purple-500 transition-colors">
                  {profileData.avatar}
                </div>
                <div className="ml-6 flex-1">
                  <h1 className="text-3xl font-bold">{profileData.name}</h1>
                  <p className="text-gray-400">Niveau {stats.level}</p>
                  <p className="text-gray-300 mt-2">{profileData.description}</p>
                </div>
                <button
                  onClick={() => {
                    setEditedData(profileData);
                    setIsEditing(true);
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Modifier le profil"
                >
                  ✏️
                </button>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="mb-8">
                <div className="flex items-start gap-6">
                  <div>
                    <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-3xl mb-2">
                      {editedData.avatar}
                    </div>
                    <div className="grid grid-cols-4 gap-1 bg-gray-800 p-2 rounded-lg">
                      {['👤', '🎭', '🦸', '🦹', '🎮', '🎯', '🎪', '🎨'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAvatarChange(emoji)}
                          className={`p-2 rounded-lg ${
                            editedData.avatar === emoji ? 'bg-purple-600' : 'hover:bg-gray-700'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="name">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={editedData.description}
                        onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

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

        {/* Nouvelle section : Historique des parties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid gap-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Historique des parties
          </h2>

          <div className="space-y-6">
            {gameHistory.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl p-6 shadow-neon"
              >
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${
                      game.role === 'joker' ? 'bg-purple-600' : 'bg-blue-600'
                    } flex items-center justify-center text-2xl`}>
                      {game.role === 'joker' ? '🎭' : '🎯'}
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        {game.role === 'joker' ? 'Joker' : 'Chasseur'}
                      </div>
                      <div className="text-gray-400">{formatDate(game.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-full ${
                      game.result === 'victory' 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-red-600/20 text-red-400'
                    }`}>
                      {game.result === 'victory' ? 'Victoire' : 'Défaite'}
                    </div>
                    <div className="text-purple-400">+{game.xpEarned} XP</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <span>⏱️ Durée : {formatDuration(game.duration)}</span>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <h4 className="text-lg font-bold mb-3">Joueurs de la partie</h4>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {game.players.map((player) => (
                      <div
                        key={player.id}
                        className="bg-gray-800 p-4 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                            {player.avatar}
                          </div>
                          <div>
                            <div className="font-bold">{player.name}</div>
                            <div className="text-sm text-purple-400">
                              Niveau {player.level}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedPlayer({
                            id: player.id,
                            name: player.name,
                            avatar: player.avatar
                          })}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Envoyer un message"
                        >
                          💬
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fenêtre de messagerie */}
        {selectedPlayer && (
          <PlayerMessages
            currentPlayer={{
              id: 'current',
              name: 'Vous',
              avatar: '👤'
            }}
            selectedPlayer={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
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