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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Règles du jeu
            </h2>

            {/* Navigation des onglets */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Contenu principal en deux colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne de gauche avec image et points clés */}
              <div className="space-y-6">
                <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 bg-purple-600/30 rounded-full flex items-center justify-center mb-4"
                    >
                      <span className="text-4xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center px-6"
                    >
                      <h3 className="text-xl font-bold text-white mb-2">{tabs.find(t => t.id === activeTab)?.name}</h3>
                      <p className="text-sm text-purple-200">Maîtrisez les règles pour devenir un joueur d'élite</p>
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Points clés de la section active */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-900/30 p-6 rounded-xl border border-purple-500/20"
                >
                  <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Points clés
                  </h3>
                  <ul className="space-y-3">
                    {rules[activeTab as keyof typeof rules][0].content.slice(0, 3).map((point, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-center gap-3 bg-purple-500/10 p-3 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-purple-400 text-xl">✓</span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Colonne de droite avec les détails */}
              <div className="space-y-6">
                {rules[activeTab as keyof typeof rules].map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 p-6 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-purple-400">{section.title}</h3>
                        <p className="text-sm text-gray-400">Section {index + 1} sur {rules[activeTab as keyof typeof rules].length}</p>
                      </div>
                    </div>
                    <div className="space-y-3 ml-4 border-l-2 border-purple-500/20 pl-4">
                      {section.content.map((item, i) => (
                        <p key={i} className="text-gray-300">• {item}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bannière de conseil en bas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">💡</span>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-purple-400">Conseil :</span> Commencez par maîtriser les règles de base avant de vous lancer dans des stratégies avancées
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium hover:bg-purple-500 transition-colors"
                onClick={onClose}
              >
                Compris !
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 