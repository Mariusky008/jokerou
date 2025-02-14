import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  value: number;
  type: 'amazon' | 'local' | 'game';
  icon: string;
  partner?: string;
  available: boolean;
  discount?: number;
  expiresIn?: number;
}

interface ConfirmationModal {
  show: boolean;
  reward: Reward | null;
}

export default function Shop() {
  const [userPoints, setUserPoints] = useState(1500); // À remplacer par les points réels de l'utilisateur
  const [showConfirmation, setShowConfirmation] = useState<ConfirmationModal>({
    show: false,
    reward: null
  });
  const [filter, setFilter] = useState<'all' | 'amazon' | 'local' | 'game'>('all');
  const [sortBy, setSortBy] = useState<'points' | 'value'>('points');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [rewards] = useState<Reward[]>([
    {
      id: '1',
      name: 'Bon Amazon 10€',
      description: 'Bon d\'achat Amazon utilisable sur tout le site',
      points: 1000,
      value: 10,
      type: 'amazon',
      icon: '🛍️',
      available: true
    },
    {
      id: '2',
      name: 'Pizza offerte',
      description: 'Une pizza gratuite chez Pizza Express',
      points: 800,
      value: 15,
      type: 'local',
      partner: 'Pizza Express',
      icon: '🍕',
      available: true,
      discount: 20
    },
    {
      id: '3',
      name: 'Bon Amazon 20€',
      description: 'Bon d\'achat Amazon utilisable sur tout le site',
      points: 2000,
      value: 20,
      type: 'amazon',
      icon: '🛍️',
      available: true
    },
    {
      id: '4',
      name: 'Menu Burger',
      description: 'Un menu complet chez Burger House',
      points: 600,
      value: 12,
      type: 'local',
      partner: 'Burger House',
      icon: '🍔',
      available: true
    },
    {
      id: '5',
      name: 'Skin exclusif',
      description: 'Skin spécial pour votre personnage',
      points: 500,
      value: 5,
      type: 'game',
      icon: '🎮',
      available: true
    },
    {
      id: '6',
      name: 'Bon Amazon 50€',
      description: 'Bon d\'achat Amazon utilisable sur tout le site',
      points: 5000,
      value: 50,
      type: 'amazon',
      icon: '🛍️',
      available: true,
      discount: 10
    }
  ]);

  const filteredRewards = rewards
    .filter(reward => {
      if (filter === 'all') return true;
      return reward.type === filter;
    })
    .filter(reward =>
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'points') {
        return a.points - b.points;
      }
      return a.value - b.value;
    });

  const handlePurchase = (reward: Reward) => {
    if (userPoints >= reward.points) {
      setShowConfirmation({ show: true, reward });
    }
  };

  const confirmPurchase = () => {
    if (showConfirmation.reward) {
      setUserPoints(prev => prev - showConfirmation.reward.points);
      setShowConfirmation({ show: false, reward: null });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Boutique - GRIM</title>
      </Head>

      {/* Notification de succès */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <span>✅</span>
              Achat effectué avec succès ! Consultez votre profil pour voir vos récompenses.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {showConfirmation.show && showConfirmation.reward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Confirmer l'achat</h2>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{showConfirmation.reward.icon}</div>
                  <div>
                    <div className="font-bold text-xl">{showConfirmation.reward.name}</div>
                    <div className="text-gray-400">{showConfirmation.reward.description}</div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Coût total</div>
                  <div className="text-2xl font-bold">{showConfirmation.reward.points} points</div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmation({ show: false, reward: null })}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-purple-500 hover:text-purple-400 mb-2 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Boutique
            </h1>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
            <div className="text-gray-400">Vos points</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              {userPoints}
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setFilter('amazon')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'amazon'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Amazon
            </button>
            <button
              onClick={() => setFilter('local')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'local'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Local
            </button>
            <button
              onClick={() => setFilter('game')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'game'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Jeu
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une récompense..."
              className="w-full bg-gray-800 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'points' | 'value')}
            className="bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="points">Trier par points</option>
            <option value="value">Trier par valeur</option>
          </select>
        </div>

        {/* Liste des récompenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{reward.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl">{reward.name}</h3>
                    {reward.partner && (
                      <div className="text-sm text-purple-400">{reward.partner}</div>
                    )}
                  </div>
                </div>
                {reward.discount && (
                  <div className="bg-green-600 text-white px-2 py-1 rounded-full text-sm">
                    -{reward.discount}%
                  </div>
                )}
              </div>

              <p className="text-gray-400 mb-4 flex-1">{reward.description}</p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Valeur</div>
                  <div className="font-bold">{reward.value}€</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Points requis</div>
                  <div className="font-bold">{reward.points}</div>
                </div>

                {reward.expiresIn && (
                  <div className="flex justify-between items-center text-yellow-500">
                    <div className="text-sm">Expire dans</div>
                    <div className="font-bold">{reward.expiresIn}j</div>
                  </div>
                )}

                <button
                  onClick={() => handlePurchase(reward)}
                  disabled={userPoints < reward.points || !reward.available}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-300 ${
                    userPoints >= reward.points && reward.available
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50'
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {userPoints >= reward.points
                    ? 'Échanger'
                    : `Il vous manque ${reward.points - userPoints} points`}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 