import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameRulesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameRules({ isOpen, onClose }: GameRulesProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const tabs = [
    { id: 'basic', name: 'Règles de base', icon: '📜', gradient: 'from-blue-400 to-blue-600' },
    { id: 'roles', name: 'Rôles spéciaux', icon: '🎭', gradient: 'from-indigo-400 to-violet-600' },
    { id: 'powers', name: 'Pouvoirs et bonus', icon: '⚡', gradient: 'from-yellow-400 to-orange-600' },
    { id: 'points', name: 'Points et niveaux', icon: '🏆', gradient: 'from-green-400 to-emerald-600' },
    { id: 'zones', name: 'Zones spéciales', icon: '🎯', gradient: 'from-purple-400 to-pink-600' },
    { id: 'effects', name: 'Effets spéciaux', icon: '✨', gradient: 'from-pink-400 to-red-600' },
    { id: 'meetup', name: 'Point de rencontre', icon: '🤝', gradient: 'from-red-400 to-orange-600' }
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
    effects: [
      {
        title: "Effets visuels",
        content: [
          "Particules colorées lors de l'obtention d'une récompense",
          "Pulsations lumineuses pour indiquer les zones d'événements",
          "Compte à rebours visuel pour le temps restant",
          "Animations spéciales pour les pouvoirs activés"
        ]
      },
      {
        title: "Effets sonores",
        content: [
          "Sons de notification pour les événements spontanés",
          "Effets sonores pour les récompenses obtenues",
          "Alertes sonores pour les zones spéciales",
          "Sons ambiants selon la proximité des joueurs"
        ]
      },
      {
        title: "Retours visuels",
        content: [
          "Indicateurs de direction pour les événements proches",
          "Marqueurs pulsants sur la carte pour les zones actives",
          "Effets de transition lors des changements de zone",
          "Animations de succès pour les objectifs accomplis"
        ]
      },
      {
        title: "Immersion",
        content: [
          "Vibrations du téléphone pour les événements importants",
          "Intensité sonore variable selon la distance",
          "Effets météorologiques sur la carte",
          "Thèmes visuels adaptés à l'heure de la journée"
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
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700/50 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header amélioré */}
            <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              <div className="flex justify-between items-center">
                <motion.h2 
                  className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text flex items-center gap-3"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                >
                  <motion.span
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📜
                  </motion.span>
                  Règles du jeu
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800"
                >
                  ✕
                </motion.button>
              </div>
            </div>

            {/* Tabs améliorés */}
            <div className="border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-6 py-4 flex items-center gap-2 transition-all duration-300 ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className={`flex items-center gap-2 ${
                      activeTab === tab.id ? `bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent` : ''
                    }`}>
                      <motion.span 
                        className="text-2xl"
                        animate={activeTab === tab.id ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {tab.icon}
                      </motion.span>
                      {tab.name}
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.gradient}`}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Contenu amélioré */}
            <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {rules[activeTab as keyof typeof rules].map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onHoverStart={() => setHoveredSection(section.title)}
                      onHoverEnd={() => setHoveredSection(null)}
                      className={`mb-8 last:mb-0 p-6 rounded-xl transition-all duration-300 ${
                        hoveredSection === section.title
                          ? 'bg-gray-800/50 shadow-lg transform scale-[1.02]'
                          : 'bg-transparent'
                      }`}
                    >
                      <motion.h3 
                        className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text flex items-center gap-3"
                        whileHover={{ x: 10 }}
                      >
                        <motion.span
                          animate={hoveredSection === section.title ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {activeTab === 'basic' ? '📜' :
                           activeTab === 'roles' ? '🎭' :
                           activeTab === 'powers' ? '⚡' :
                           activeTab === 'points' ? '🏆' :
                           activeTab === 'zones' ? '🎯' :
                           activeTab === 'effects' ? '✨' : '🤝'}
                        </motion.span>
                        {section.title}
                      </motion.h3>
                      <motion.ul className="space-y-4">
                        {section.content.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + i * 0.05 }}
                            whileHover={{ x: 10 }}
                            className="flex items-start gap-4 text-gray-300 bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg group"
                          >
                            <motion.span 
                              className="text-purple-400 text-lg"
                              animate={hoveredSection === section.title ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 360]
                              } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              •
                            </motion.span>
                            <span className="flex-1 group-hover:text-white transition-colors">
                              {item}
                            </span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 