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
    { id: 'roles', name: 'Rôles spéciaux', icon: '🎭' },
    { id: 'powers', name: 'Pouvoirs', icon: '⚡' },
    { id: 'points', name: 'Points', icon: '🏆' },
    { id: 'zones', name: 'Zones', icon: '🎯' },
    { id: 'meetup', name: 'Rencontre', icon: '🤝' }
  ];

  const rules = {
    basic: [
      {
        title: "Objectifs",
        content: [
          "Le Grim doit survivre pendant 60 minutes",
          "Les Chasseurs doivent capturer le Grim en s'approchant à moins de 50 mètres",
          "Tous les joueurs doivent rester dans la zone de jeu délimitée"
        ]
      },
      {
        title: "Élimination",
        content: [
          "Sortir de la zone de jeu entraîne une élimination immédiate",
          "Le Grim est éliminé si un Chasseur s'approche à moins de 50 mètres",
          "Les Chasseurs ne peuvent pas être éliminés mais peuvent être ralentis"
        ]
      }
    ],
    roles: [
      {
        title: "Rôles de base",
        content: [
          "Le Grim (🎭) : Doit survivre pendant 60 minutes en évitant les chasseurs",
          "Les Chasseurs (🎯) : Doivent capturer le Grim en s'approchant à moins de 50 mètres",
        ]
      },
      {
        title: "L'Illusionniste (Traître)",
        content: [
          "Se fait passer pour un Chasseur mais aide secrètement le Grim",
          "Peut fournir de fausses informations aux autres Chasseurs",
          "Peut créer un leurre sur la carte (faux signal du Grim)",
          "Doit maintenir sa couverture pour ne pas être découvert"
        ]
      },
      {
        title: "L'Informateur (Neutre)",
        content: [
          "Se déplace librement sur la carte",
          "Peut vendre des informations au plus offrant",
          "Choisit de donner des infos exactes ou fausses",
          "Gagne des points en fonction de l'utilité de ses informations"
        ]
      },
      {
        title: "Le Saboteur (Piègeur)",
        content: [
          "Place des pièges sur la carte qui ralentissent les Chasseurs",
          "Peut créer des zones de brouillage des communications",
          "Capable de désactiver temporairement les pouvoirs d'un autre joueur",
          "Doit gérer stratégiquement ses ressources de pièges"
        ]
      }
    ],
    powers: [
      {
        title: "Pouvoirs du Grim",
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
          "Vision Thermique (🔥) : Détecte les traces récentes du Grim",
          "Coordination (📡) : Partage la position avec les autres chasseurs"
        ]
      },
      {
        title: "Pouvoirs de l'Illusionniste",
        content: [
          "Faux Signal (🎭) : Crée un leurre du Grim sur la carte",
          "Brouillage (📡) : Perturbe les communications des Chasseurs",
          "Couverture (🎪) : Masque temporairement son statut de traître"
        ]
      },
      {
        title: "Pouvoirs de l'Informateur",
        content: [
          "Radar Avancé (🔍) : Détecte tous les joueurs dans un rayon",
          "Marchandage (💰) : Propose des informations aux autres joueurs",
          "Anonymat (🎭) : Cache son identité lors des échanges"
        ]
      },
      {
        title: "Pouvoirs du Saboteur",
        content: [
          "Piège Paralysant (⚡) : Immobilise temporairement un joueur",
          "Zone de Brouillage (📡) : Désactive les pouvoirs dans une zone",
          "Sabotage (🔧) : Désactive le pouvoir d'un joueur ciblé"
        ]
      },
      {
        title: "Points d'intérêt",
        content: [
          "Stations de recharge (⚡) : Recharge rapide des pouvoirs spéciaux",
          "Zones bonus (⭐) : Points d'expérience supplémentaires",
          "Caches secrètes (🎭) : Zones où le Grim peut se cacher temporairement",
          "Points stratégiques (🎯) : Zones offrant une meilleure visibilité aux chasseurs"
        ]
      }
    ],
    points: [
      {
        title: "Système de points",
        content: [
          "Victoire en tant que Grim : 1000 XP",
          "Victoire en tant que Chasseur : 500 XP",
          "Victoire en tant qu'Illusionniste (non découvert) : 1200 XP",
          "Points de l'Informateur : 50-200 XP par info vendue selon l'utilité",
          "Points du Saboteur : 100 XP par piège utilisé avec succès",
          "Bonus de temps pour capture rapide : jusqu'à 300 XP",
          "Bonus d'utilisation de pouvoirs : 50 XP par pouvoir",
          "Bonus de découverte : 100 XP pour chaque nouveau point d'intérêt trouvé"
        ]
      },
      {
        title: "Progression des niveaux",
        content: [
          "Niveau 1 à 5 : 1000 XP par niveau",
          "Niveau 6 à 10 : 2000 XP par niveau",
          "Niveau 11 à 20 : 3000 XP par niveau",
          "Niveau 21+ : 5000 XP par niveau",
          "Votre barre de progression est visible dans votre profil",
          "Un indicateur montre l'XP actuel et l'XP requis pour le prochain niveau"
        ]
      },
      {
        title: "Niveaux et Récompenses",
        content: [
          "Nouveaux pouvoirs débloqués tous les 5 niveaux",
          "Rôles spéciaux débloqués à partir du niveau 10",
          "Badges spéciaux pour les performances exceptionnelles",
          "Skins et avatars exclusifs aux niveaux élevés",
          "Titres spéciaux (Maître de l'Évasion, Chasseur d'Élite, Illusionniste Suprême, etc.)"
        ]
      },
      {
        title: "Suivi de progression",
        content: [
          "Accédez à votre profil pour voir votre progression détaillée",
          "Statistiques complètes de vos parties (victoires, défaites, rôles joués)",
          "Historique des XP gagnés par partie",
          "Badges et récompenses débloqués",
          "Prochaines récompenses à débloquer"
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
          "Zones de couverture : Endroits avec une meilleure dissimulation pour le Grim",
          "Points de surveillance : Positions avantageuses pour les chasseurs",
          "Zones interdites : Certaines zones peuvent être temporairement inaccessibles"
        ]
      },
      {
        title: "Système de notification",
        content: [
          "Alerte sonore lors de l'activation d'une nouvelle zone spéciale",
          "Indicateur visuel pulsant pour les zones actives",
          "Compte à rebours avant la prochaine apparition d'une zone",
          "Notification visuelle lors de l'entrée dans une zone active"
        ]
      }
    ],
    meetup: [
      {
        title: "Point de rencontre après-partie",
        content: [
          "Un lieu de rencontre est proposé à la fin de chaque partie",
          "Participation entièrement optionnelle et basée sur la convivialité",
          "Lieu choisi dans un endroit public et animé pour plus de sécurité",
          "Possibilité de commenter la partie et partager les meilleurs moments"
        ]
      },
      {
        title: "Système de rencontre",
        content: [
          "Le point de rencontre est révélé uniquement aux joueurs ayant terminé la partie",
          "Un délai de 15 minutes est accordé pour que tout le monde puisse arriver",
          "Un chat dédié est disponible pour coordonner la rencontre",
          "Les joueurs peuvent indiquer leur participation via l'application"
        ]
      },
      {
        title: "Sécurité et convivialité",
        content: [
          "Les lieux de rencontre sont toujours des endroits publics bien fréquentés",
          "La participation est strictement volontaire et peut être annulée à tout moment",
          "Un système de badges spéciaux pour les joueurs participant aux rencontres",
          "Possibilité de créer des liens et former des équipes pour les futures parties"
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
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl w-full max-w-4xl shadow-2xl border border-gray-700/50"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-purple-400">📖</span>
                Règles du jeu
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <div className="border-b border-gray-700/50 bg-gray-900/50">
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 p-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-sm font-medium hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {rules[activeTab as keyof typeof rules] && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {rules[activeTab as keyof typeof rules].map((section, index) => (
                    <div key={section.title} className="mb-6 last:mb-0">
                      <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-gray-700/50">
                          <span className="text-purple-400 text-xl">
                            {activeTab === 'basic' ? '📜' :
                             activeTab === 'roles' ? '🎭' :
                             activeTab === 'powers' ? '⚡' :
                             activeTab === 'points' ? '🏆' :
                             activeTab === 'zones' ? '🎯' : '🤝'}
                          </span>
                          {section.title}
                        </h3>
                        <ul className="grid gap-3">
                          {section.content && section.content.map((item, i) => (
                            <li
                              key={i}
                              className="text-gray-300 bg-gray-800/30 p-3 rounded-lg hover:bg-gray-800/50 hover:text-white transition-all duration-200 flex items-start gap-3"
                            >
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 