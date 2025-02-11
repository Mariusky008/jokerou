import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GameRules from '../components/GameRules';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  role?: 'grim' | 'hunter' | 'illusionist' | 'informer' | 'saboteur' | null;
  isReady: boolean;
  level: number;
}

export default function Roles() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [role, setRole] = useState<'grim' | 'hunter' | 'illusionist' | 'informer' | 'saboteur' | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRules, setShowRules] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      name: 'Vous',
      avatar: '👤',
      role: null,
      isReady: true,
      level: 8
    },
    {
      id: '2',
      name: 'Alex',
      avatar: '👤',
      role: null,
      isReady: true,
      level: 12
    },
    {
      id: '3',
      name: 'Marie',
      avatar: '👤',
      role: null,
      isReady: true,
      level: 5
    },
    {
      id: '4',
      name: 'Lucas',
      avatar: '👤',
      role: null,
      isReady: false,
      level: 15
    }
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Distribution des rôles en fonction du niveau et du nombre de joueurs
    const distributeRoles = () => {
      const eligiblePlayers = players.filter(p => p.level >= 10);
      const totalPlayers = players.length;
      
      // Toujours un Grim
      let availableRoles = ['grim'];
      
      // Ajouter les rôles spéciaux si assez de joueurs de niveau 10+
      if (eligiblePlayers.length >= 2) {
        // Maximum un rôle spécial par partie
        const specialRole = Math.random() < 0.3 ? // 30% de chance d'avoir un rôle spécial
          ['illusionist', 'informer', 'saboteur'][Math.floor(Math.random() * 3)] :
          null;
        if (specialRole) availableRoles.push(specialRole);
      }
      
      // Le reste sont des chasseurs
      while (availableRoles.length < totalPlayers) {
        availableRoles.push('hunter');
      }

      // Mélanger les rôles
      availableRoles.sort(() => Math.random() - 0.5);

      // Attribuer les rôles aux joueurs
      const assignedPlayers = players.map((player, index) => {
        const role = availableRoles[index];
        // Vérifier le niveau minimum pour les rôles spéciaux
        if (['illusionist', 'informer', 'saboteur'].includes(role) && player.level < 10) {
          return { ...player, role: 'hunter' };
        }
        return { ...player, role };
      });

      setPlayers(assignedPlayers);
      // Définir le rôle du joueur actuel
      const currentPlayerRole = assignedPlayers.find(p => p.id === '1')?.role;
      setRole(currentPlayerRole || 'hunter');
    };

    distributeRoles();
    
    // Compte à rebours avant la révélation
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRevealed(true);
          setTimeout(() => {
            router.push('/game');
          }, 45000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Scroll automatique vers le bas du chat
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: 'Vous',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const roleInfo = {
    grim: {
      title: '🎭 Vous êtes le Grim !',
      description: 'Votre mission : échapper aux chasseurs pendant 60 minutes dans la zone délimitée.',
      powers: [
        'Mode Fantôme (1x) : Invisibilité pendant 30 secondes',
        'Leurre (2x) : Envoyez une fausse position',
      ],
      rules: [
        'Restez dans la zone délimitée (élimination immédiate en cas de sortie)',
        'Évitez les chasseurs à moins de 50 mètres',
        'Utilisez vos pouvoirs stratégiquement'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    hunter: {
      title: '🎯 Vous êtes un Chasseur !',
      description: 'Votre mission : traquer et capturer le Grim dans la zone délimitée.',
      powers: [
        'Radar Grim (1x) : Position exacte pendant 10 secondes',
        'Indice de Distance : Notification de proximité toutes les 10 minutes',
      ],
      rules: [
        'Restez dans la zone délimitée (élimination immédiate en cas de sortie)',
        'Coordonnez-vous avec les autres chasseurs',
        'Approchez-vous à moins de 50 mètres du Grim pour gagner'
      ],
      color: 'from-blue-500 to-green-500'
    },
    illusionist: {
      title: '🎪 Vous êtes l\'Illusionniste !',
      description: 'Votre mission : aider secrètement le Grim tout en maintenant votre couverture de chasseur.',
      powers: [
        'Faux Signal (2x) : Créez un leurre du Grim sur la carte',
        'Brouillage (1x) : Perturbez les communications des Chasseurs',
        'Couverture (1x) : Masquez temporairement votre statut'
      ],
      rules: [
        'Maintenez votre couverture auprès des autres chasseurs',
        'Coordonnez-vous secrètement avec le Grim',
        'Évitez d\'être découvert par les autres chasseurs'
      ],
      color: 'from-indigo-500 to-purple-500'
    },
    informer: {
      title: '🔍 Vous êtes l\'Informateur !',
      description: 'Votre mission : vendez des informations aux deux camps pour maximiser vos gains.',
      powers: [
        'Radar Avancé (3x) : Détectez tous les joueurs dans un rayon',
        'Marchandage (∞) : Proposez des informations aux autres joueurs',
        'Anonymat (2x) : Cachez votre identité lors des échanges'
      ],
      rules: [
        'Restez neutre dans le conflit',
        'Vendez vos informations au plus offrant',
        'Gérez votre réputation auprès des deux camps'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    saboteur: {
      title: '⚡ Vous êtes le Saboteur !',
      description: 'Votre mission : perturbez la traque en plaçant des pièges stratégiques.',
      powers: [
        'Piège Paralysant (3x) : Immobilisez temporairement un joueur',
        'Zone de Brouillage (2x) : Désactivez les pouvoirs dans une zone',
        'Sabotage (1x) : Désactivez le pouvoir d\'un joueur ciblé'
      ],
      rules: [
        'Placez vos pièges stratégiquement',
        'Gérez vos ressources de pièges',
        'Créez le chaos dans la traque'
      ],
      color: 'from-red-500 to-pink-500'
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Attribution des Rôles - Grim</title>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Section principale */}
          <div className="lg:col-span-2">
            {!isRevealed ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 rounded-2xl p-8 shadow-neon text-center h-[600px] flex flex-col items-center justify-center"
              >
                <h1 className="text-4xl font-bold mb-8">Attribution des rôles</h1>
                <div className="text-8xl font-bold text-purple-500 mb-4">{countdown}</div>
                <p className="text-gray-400 text-xl">Préparez-vous à découvrir votre rôle...</p>
                <div className="mt-8 text-gray-500">
                  Tous les joueurs doivent être prêts pour commencer
                </div>
              </motion.div>
            ) : role && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900 rounded-2xl p-8 shadow-neon"
              >
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-4xl font-bold text-center mb-6 bg-gradient-to-r ${roleInfo[role].color} text-transparent bg-clip-text`}
                >
                  {roleInfo[role].title}
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-center text-gray-300 mb-8"
                >
                  {roleInfo[role].description}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold mb-4">Vos pouvoirs :</h2>
                  {roleInfo[role].powers.map((power, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                      className="bg-gray-800 p-4 rounded-lg"
                    >
                      {power}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-4 mt-8"
                >
                  <h2 className="text-2xl font-semibold mb-4">Règles importantes :</h2>
                  {roleInfo[role].rules.map((rule, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.2 }}
                      className="bg-gray-800 p-4 rounded-lg flex items-center gap-3"
                    >
                      <div className="text-red-500 text-xl">⚠️</div>
                      <div>{rule}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="mt-8 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20"
                >
                  <div className="flex items-center gap-3 text-purple-400">
                    <div className="text-xl">📍</div>
                    <div>La zone de jeu sera affichée sur votre carte. Des alertes vous préviendront si vous vous en approchez trop près.</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-8 text-center text-gray-400"
                >
                  La partie commence dans quelques secondes...
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Sidebar avec liste des joueurs et chat */}
          <div className="space-y-8">
            {/* Liste des joueurs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-neon"
            >
              <h2 className="text-xl font-bold mb-4">Joueurs ({players.length})</h2>
              <div className="space-y-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        {player.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-purple-400">Niveau {player.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isRevealed && player.role && (
                        <div className="text-2xl">
                          {player.role === 'grim' ? '🎭' : player.role === 'hunter' ? '🎯' : player.role === 'illusionist' ? '🎪' : player.role === 'informer' ? '🔍' : '⚡'}
                        </div>
                      )}
                      <div className={`w-3 h-3 rounded-full ${player.isReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-neon"
            >
              <h2 className="text-xl font-bold mb-4">Chat pré-partie</h2>
              <div
                ref={chatRef}
                className="space-y-4 h-[300px] overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800"
              >
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold">{msg.author}</span>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{msg.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez un message..."
                  className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Envoyer
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal des règles */}
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />

      <style jsx global>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
        
        /* Styles pour la scrollbar du chat */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #8b5cf6;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
} 