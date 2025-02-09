import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameRulesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameRules({ isOpen, onClose }: GameRulesProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', name: 'Règles de base', icon: '📜' },
    { id: 'powers', name: 'Pouvoirs et bonus', icon: '⚡' },
    { id: 'points', name: 'Points et niveaux', icon: '🏆' },
    { id: 'zones', name: 'Zones spéciales', icon: '🎯' }
  ];

  const rules = {
    basic: [
      {
        title: "Objectifs",
        content: [
          "Le Joker doit survivre pendant 60 minutes",
          "Les Chasseurs doivent capturer le Joker en s'approchant à moins de 50 mètres",
          "Tous les joueurs doivent rester dans la zone de jeu délimitée"
        ]
      },
      {
        title: "Élimination",
        content: [
          "Sortir de la zone de jeu entraîne une élimination immédiate",
          "Le Joker est éliminé si un Chasseur s'approche à moins de 50 mètres",
          "Les Chasseurs ne peuvent pas être éliminés mais peuvent être ralentis"
        ]
      }
    ],
    powers: [
      {
        title: "Pouvoirs du Joker",
        content: [
          "Mode Fantôme (👻) : Invisibilité pendant 45 secondes",
          "Leurre (🎭) : Envoie une fausse position",
          "Piège (⚡) : Ralentit les chasseurs pendant 20 secondes"
        ]
      },
      {
        title: "Pouvoirs des Chasseurs",
        content: [
          "Super Radar (🎯) : Détection précise pendant 30 secondes",
          "Vision Thermique (🔥) : Détecte les traces récentes du Joker",
          "Coordination (📡) : Partage la position avec les autres chasseurs"
        ]
      },
      {
        title: "Points d'intérêt",
        content: [
          "Stations de recharge (⚡) : Recharge rapide des pouvoirs spéciaux",
          "Zones bonus (⭐) : Points d'expérience supplémentaires",
          "Caches secrètes (🎭) : Zones où le Joker peut se cacher temporairement",
          "Points stratégiques (🎯) : Zones offrant une meilleure visibilité aux chasseurs"
        ]
      }
    ],
    points: [
      {
        title: "Système de points",
        content: [
          "Victoire en tant que Joker : 1000 XP",
          "Victoire en tant que Chasseur : 500 XP",
          "Bonus de temps pour capture rapide : jusqu'à 300 XP",
          "Bonus d'utilisation de pouvoirs : 50 XP par pouvoir",
          "Bonus de découverte : 100 XP pour chaque nouveau point d'intérêt trouvé"
        ]
      },
      {
        title: "Niveaux et Récompenses",
        content: [
          "Nouveaux pouvoirs débloqués tous les 5 niveaux",
          "Badges spéciaux pour les performances exceptionnelles",
          "Skins et avatars exclusifs aux niveaux élevés",
          "Titres spéciaux (Maître de l'Évasion, Chasseur d'Élite, etc.)"
        ]
      }
    ],
    zones: [
      {
        title: "Zone de jeu principale",
        content: [
          "Périmètre de jeu clairement délimité sur la carte",
          "Alertes de proximité avec la bordure",
          "Zone qui se rétrécit progressivement après 30 minutes",
          "Adaptation aux rues et places de la ville"
        ]
      },
      {
        title: "Zones spéciales",
        content: [
          "Zones de recharge : Points stratégiques pour recharger les pouvoirs",
          "Zones de couverture : Endroits avec une meilleure dissimulation pour le Joker",
          "Points de surveillance : Positions avantageuses pour les chasseurs",
          "Zones interdites : Certaines zones peuvent être temporairement inaccessibles"
        ]
      }
    ]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  Règles du jeu
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 flex items-center gap-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
              {rules[activeTab as keyof typeof rules].map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-8 last:mb-0"
                >
                  <h3 className="text-xl font-bold mb-4 text-purple-400">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="text-purple-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 