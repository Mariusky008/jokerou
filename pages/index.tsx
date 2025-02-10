import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import GameRules from '../components/GameRules';

const initialPlayers = [
  {
    id: 1,
    avatar: "🎭",
    role: "joker",
    name: "Le Joker",
    position: { x: 30, y: 40 }
  },
  {
    id: 2,
    avatar: "👤",
    role: "hunter",
    name: "Marie",
    position: { x: 45, y: 35 }
  },
  {
    id: 3,
    avatar: "👤",
    role: "hunter",
    name: "Lucas",
    position: { x: 60, y: 50 }
  },
  {
    id: 4,
    avatar: "👤",
    role: "hunter",
    name: "Sarah",
    position: { x: 25, y: 60 }
  }
];

export default function Home() {
  const [nextGameTime, setNextGameTime] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [playerPositions, setPlayerPositions] = useState(initialPlayers);

  const features = [
    {
      icon: "🎭",
      title: "Mode Fantôme",
      description: "Devenez invisible pendant 30 secondes pour semer vos poursuivants"
    },
    {
      icon: "🎯",
      title: "Radar de Traque",
      description: "Utilisez des outils de pistage avancés pour localiser votre cible"
    },
    {
      icon: "🌍",
      title: "Zone de Jeu",
      description: "Un périmètre défini et sécurisé pour une expérience de jeu équitable"
    },
    {
      icon: "⚡",
      title: "Pouvoirs Spéciaux",
      description: "Débloquez des capacités uniques en progressant"
    }
  ];

  const testimonials = [
    {
      name: "Thomas L.",
      role: "Joker Légendaire",
      quote: "La meilleure expérience de jeu urbain ! L'adrénaline est au maximum quand on est poursuivi.",
      avatar: "👤",
      rating: 5
    },
    {
      name: "Sarah M.",
      role: "Chasseuse Élite",
      quote: "La coordination entre chasseurs est incroyable. Chaque partie est unique et intense !",
      avatar: "👤",
      rating: 5
    },
    {
      name: "Lucas R.",
      role: "Stratège Urbain",
      quote: "Les pouvoirs spéciaux ajoutent une dimension stratégique passionnante au jeu.",
      avatar: "👤",
      rating: 5
    }
  ];

  useEffect(() => {
    const calculateNextGameTime = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(18, 0, 0, 0);
      
      if (now.getHours() >= 18) {
        next.setDate(next.getDate() + 1);
      }
      
      const diff = next.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    };

    const timer = setInterval(() => {
      setNextGameTime(calculateNextGameTime());
    }, 60000);

    setNextGameTime(calculateNextGameTime());

    // Rotation automatique des fonctionnalités
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    // Animation des joueurs
    const moveInterval = setInterval(() => {
      setPlayerPositions(prev => prev.map(player => {
        // Le Joker se déplace plus rapidement et de manière plus erratique
        const moveRange = player.role === 'joker' ? 15 : 10;
        return {
          ...player,
          position: {
            x: player.position.x + (Math.random() - 0.5) * moveRange,
            y: player.position.y + (Math.random() - 0.5) * moveRange
          }
        };
      }));
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(featureInterval);
      clearInterval(moveInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Head>
        <title key="title">Jokerou - Le jeu de cache-cache urbain révolutionnaire</title>
        <meta key="description" name="description" content="Découvrez Jokerou, le jeu qui transforme votre ville en terrain de jeu. Cache-cache en temps réel, pouvoirs spéciaux et expérience unique garantie !" />
        <link key="favicon" rel="icon" href="/favicon.ico" />
      </Head>

      {/* Modal des règles */}
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* Hero Section avec Vidéo Background */}
      <div className="relative h-screen overflow-hidden">
        {/* Fond animé avec motif de carte de ville */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black/95 to-pink-900/90">
            {/* Motif de grille représentant les rues */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-[pulse_4s_ease-in-out_infinite]"></div>
            
            {/* Points d'intérêt animés remplacés par des avatars */}
            <div className="absolute inset-0 z-0">
              {playerPositions.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    x: [
                      `${player.position.x}%`,
                      `${player.position.x + (player.role === 'joker' ? 15 : 10) * (Math.random() - 0.5)}%`,
                      `${player.position.x}%`
                    ],
                    y: [
                      `${player.position.y}%`,
                      `${player.position.y + (player.role === 'joker' ? 15 : 10) * (Math.random() - 0.5)}%`,
                      `${player.position.y}%`
                    ]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className={`absolute flex flex-col items-center ${player.role === 'joker' ? 'z-10' : 'z-5'}`}
                  style={{
                    left: `${player.position.x}%`,
                    top: `${player.position.y}%`
                  }}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      player.role === 'joker' 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50' 
                        : 'bg-gradient-to-br from-blue-600 to-green-600 shadow-lg shadow-blue-500/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    animate={{
                      boxShadow: player.role === 'joker' 
                        ? ['0 0 20px rgba(139, 92, 246, 0.5)', '0 0 40px rgba(236, 72, 153, 0.5)', '0 0 20px rgba(139, 92, 246, 0.5)']
                        : ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 40px rgba(16, 185, 129, 0.5)', '0 0 20px rgba(59, 130, 246, 0.5)']
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    }}
                  >
                    {player.avatar}
                  </motion.div>
                  <motion.div 
                    className="mt-2 px-2 py-1 rounded-full text-xs font-bold bg-black/50 backdrop-blur-sm whitespace-nowrap"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {player.name}
                  </motion.div>
                  {player.role === 'joker' && (
                    <motion.div
                      className="absolute -inset-2 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0, 0.2]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)'
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Lignes représentant les routes principales avec animation */}
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  d="M0,50 H100"
                  stroke="white"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <motion.path
                  d="M50,0 V100"
                  stroke="white"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.7 }}
                />
                {/* Routes secondaires */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <path d="M25,0 V100" stroke="white" strokeWidth="0.3" strokeDasharray="4 4" />
                  <path d="M75,0 V100" stroke="white" strokeWidth="0.3" strokeDasharray="4 4" />
                  <path d="M0,25 H100" stroke="white" strokeWidth="0.3" strokeDasharray="4 4" />
                  <path d="M0,75 H100" stroke="white" strokeWidth="0.3" strokeDasharray="4 4" />
                </motion.g>
              </svg>
            </div>

            {/* Effet de scan radar */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
                animate={{
                  top: ['0%', '100%'],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-4xl mx-auto"
          >
            {/* Badge "En direct" recentré */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-28 flex items-center justify-center w-full">
              <div className="bg-gradient-to-r from-purple-500/20 to-transparent px-4 py-2 rounded-full relative overflow-hidden group hover:from-purple-500/30 transition-all duration-300 flex items-center gap-2">
                <span className="text-purple-400">🎮</span>
                <span className="text-purple-400 whitespace-nowrap">EN DIRECT</span>
                <span className="text-sm text-purple-400/80 ml-2">3 parties en cours</span>
              </div>
            </div>

            {/* Titre principal avec effet de glitch */}
            <h1 className="text-8xl font-black mb-8 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-[textShadow_5s_ease-in-out_infinite]">
                Trouver le GRIM
              </span>
            </h1>

            {/* Description avec effet de typing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-3xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                Vous aurez 1 heure pour traquer et trouver le GRIM dans votre ville.<br/>
                Le premier jeu de cache-cache urbain
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="block mt-4 text-xl"
                >
                  <span className="text-purple-400">Une expérience unique chaque soir à </span>
                  <span className="font-mono bg-purple-500/20 px-2 py-1 rounded">18:00</span>
                  <span className="text-purple-400"> dans votre ville</span>
                </motion.span>
              </p>
            </motion.div>

            {/* Stats en temps réel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="grid grid-cols-3 gap-8 mb-12"
            >
              <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">12</div>
                <div className="text-sm text-gray-400">Chasseurs en ligne</div>
              </div>
              <div className="bg-pink-900/30 backdrop-blur-sm p-4 rounded-xl border border-pink-500/20">
                <div className="text-2xl font-bold text-pink-400">3</div>
                <div className="text-sm text-gray-400">Parties en cours</div>
              </div>
              <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">2.5 km</div>
                <div className="text-sm text-gray-400">Zone de jeu</div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Link href="/auth" 
                  className="relative w-full inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-center"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Inscription à la prochaine chasse
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Overlay avec motif de points */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_2px,_rgba(0,0,0,0.2)_3px)] bg-[length:30px_30px]"></div>
      </div>

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Une expérience de jeu révolutionnaire
              </span>
            </h2>
            <p className="text-xl text-gray-400">Découvrez des fonctionnalités uniques qui redéfinissent le cache-cache</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className={`bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 ${index === activeFeature ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Comment ça marche ?
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-4 mt-4">Inscrivez-vous</h3>
                <p className="text-gray-400">Créez votre compte et rejoignez la communauté des joueurs dans votre ville</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-4 mt-4">Attendez 18h</h3>
                <p className="text-gray-400">Chaque soir, une nouvelle partie commence. Découvrez votre rôle : Joker ou Chasseur</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-4 mt-4">Jouez !</h3>
                <p className="text-gray-400">Utilisez vos pouvoirs, coordonnez-vous et vivez une expérience unique</p>
              </div>
            </motion.div>
          </div>

          {/* Nouveau bouton des règles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setShowRules(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2 mx-auto"
            >
              <span>📜</span>
              Consulter les règles complètes
            </button>
          </motion.div>
        </div>
      </section>

      {/* Nouvelle section : Modes de jeu */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Modes de jeu
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Jouez en solo ou en équipe, choisissez votre style !
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">🎮</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Mode Solo
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Vivez l'expérience classique : parcourez la ville en solitaire, utilisez vos pouvoirs et votre stratégie pour échapper aux chasseurs ou traquer le Joker.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Liberté de mouvement totale
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Prise de décision rapide
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Parfait pour les joueurs expérimentés
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">👥</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Mode Duo Stratégique
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Faites équipe avec un ami ! L'un sur le terrain, l'autre derrière son écran pour une expérience de jeu unique combinant action et stratégie.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Un joueur sur le terrain suit les instructions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Un stratège à distance analyse la carte et coordonne les actions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Communication en temps réel pour une meilleure coordination
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Parfait pour combiner réflexion et action
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-6 rounded-2xl inline-block backdrop-blur-sm border border-purple-500/20">
              <p className="text-gray-300">
                <span className="text-purple-400 font-bold">Conseil : </span>
                Le mode duo est recommandé pour les nouveaux joueurs, permettant une meilleure prise en main du jeu et des stratégies plus élaborées.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Le jeu en action */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-b from-black to-purple-900/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Le jeu en action 🏃‍♂️
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Une chasse palpitante en temps réel dans les rues de votre ville
              <span className="block mt-2 text-purple-400 font-semibold animate-pulse">
                🔴 En direct : 3 chasseurs traquent le Joker dans le quartier Saint-Michel
              </span>
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne de gauche - Commentaires en direct et statut du jeu */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                      Direct
                    </h3>
                    <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-sm text-red-400 font-semibold">Live</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    >
                      En direct de Saint-Michel
                    </motion.span>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-yellow-500/20 to-transparent p-4 rounded-xl border-l-4 border-yellow-500 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"
                      animate={{ 
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span 
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-yellow-400"
                      >
                        🎭 Système
                      </motion.span>
                    </div>
                    <p className="text-gray-300 relative z-10">Le Joker vient d'utiliser son pouvoir de camouflage près de la fontaine !</p>
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 30, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-500/50 to-transparent"
                    />
                    <span className="text-sm text-yellow-400/80">Il y a 30 secondes</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-purple-500/20 to-transparent p-4 rounded-xl relative overflow-hidden group hover:from-purple-500/30 transition-all duration-300"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"
                      animate={{ 
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-400 group-hover:scale-110 transition-transform duration-300">👤 Marie</span>
                      <motion.span 
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-purple-400/80 text-sm px-2 py-0.5 rounded-full bg-purple-500/20"
                      >
                        Chasseuse
                      </motion.span>
                    </div>
                    <p className="text-gray-300 relative z-10">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Je le vois près du café ! Il se dirige vers la rue piétonne 
                      </motion.span>
                      <motion.span
                        animate={{ 
                          x: [0, 5, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="inline-block"
                      >
                        🏃‍♂️
                      </motion.span>
                    </p>
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 45, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"
                    />
                    <span className="text-sm text-purple-400/80">Il y a 45 secondes</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-500/20 to-transparent p-4 rounded-xl relative overflow-hidden group hover:from-blue-500/30 transition-all duration-300"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"
                      animate={{ 
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400 group-hover:scale-110 transition-transform duration-300">👤 Lucas</span>
                      <motion.span 
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-blue-400/80 text-sm px-2 py-0.5 rounded-full bg-blue-500/20"
                      >
                        Chasseur
                      </motion.span>
                    </div>
                    <p className="text-gray-300 relative z-10">
                      Je prends position devant la place centrale pour lui couper la route ! 
                      <motion.span
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 15, 0]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="inline-block ml-1"
                      >
                        🎯
                      </motion.span>
                    </p>
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 60, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"
                    />
                    <span className="text-sm text-blue-400/80">Il y a 1 minute</span>
                  </motion.div>

                  {/* Indicateur de nouvelle activité */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      y: [20, 0, -20]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-purple-400/80 bg-purple-500/20 px-3 py-1 rounded-full"
                  >
                    Nouvelle activité...
                  </motion.div>
                </div>

                {/* Statut du jeu amélioré */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20"
                >
                  <h4 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <motion.span
                      animate={{ 
                        rotate: [0, 360]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      ⚡
                    </motion.span>
                    Statut de la partie
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Temps écoulé</span>
                      <motion.span 
                        className="text-purple-400 font-bold"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        12:45
                      </motion.span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Chasseurs actifs</span>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold">3/4</span>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-green-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Zone de jeu</span>
                      <motion.span 
                        className="text-purple-400 font-bold"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          color: ["#A78BFA", "#EC4899", "#A78BFA"]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        800m²
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Colonne centrale et droite - Image du jeu avec overlay interactif */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/20 shadow-2xl">
                <Image 
                  src="/images/photo.png"
                  alt="Partie en cours"
                  width={1200}
                  height={600}
                  className="object-cover w-full h-full"
                  loading="eager"
                />
                
                {/* Overlay avec animations et indicateurs en temps réel */}
                <div className="absolute inset-0">
                  {/* Radar animé */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-purple-500 rounded-full"
                  />

                  {/* Points d'intérêt avec pulsations */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/4 left-1/3 flex flex-col items-center"
                  >
                    <div className="bg-red-500 p-2 rounded-lg text-sm font-bold mb-2">
                      🏃‍♂️ Joker repéré
                    </div>
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                  </motion.div>

                  {/* Zones stratégiques */}
                  <motion.div
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute bottom-1/3 right-1/4 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl"
                  >
                    <span className="text-sm font-bold">🎯 Zone de traque active</span>
                  </motion.div>

                  {/* Indicateur de distance */}
                  <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-xl backdrop-blur-sm">
                    <div className="text-sm font-bold text-purple-400">Distance du Joker</div>
                    <div className="text-2xl font-bold">150m</div>
                  </div>
                </div>
              </div>

              {/* Légende interactive avec informations en temps réel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-6 grid grid-cols-3 gap-4"
              >
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">🎭</div>
                  <div className="text-sm">
                    <div className="font-bold">Joker</div>
                    <div className="text-purple-400">Camouflage : 15s</div>
                  </div>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">📍</div>
                  <div className="text-sm">
                    <div className="font-bold">Position</div>
                    <div className="text-purple-400">Quartier St-Michel</div>
                  </div>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">⚡</div>
                  <div className="text-sm">
                    <div className="font-bold">Bonus Actif</div>
                    <div className="text-purple-400">Vitesse +20%</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section Témoignages */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Ce qu'en pensent nos joueurs
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-purple-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div className="text-yellow-400">{'★'.repeat(testimonial.rating)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Zone de jeu sécurisée */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Zone de jeu sécurisée
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Pour garantir une expérience équitable et sécurisée
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Périmètre défini
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Avant chaque partie, une zone de jeu est clairement délimitée sur la carte. Cette zone est soigneusement choisie pour offrir une expérience de jeu optimale et sécurisée.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">⚠️</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Règle d'élimination
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Sortir de la zone délimitée entraîne une élimination immédiate. Cette règle s'applique à tous les joueurs, Joker comme Chasseurs, pour maintenir l'équilibre du jeu.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-6 rounded-2xl inline-block backdrop-blur-sm border border-purple-500/20"
            >
              <p className="text-gray-300">
                <span className="text-purple-400 font-bold">Note importante :</span> La zone de jeu est visible en permanence sur la carte et des alertes vous préviendront si vous vous en approchez trop près.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Prêt à relever le défi ?
              </span>
            </h2>
            <p className="text-2xl text-gray-300 mb-12">
              Rejoignez la communauté Jokerou et vivez une expérience de jeu unique
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/auth" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-2xl py-6 px-16 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                Créer un compte gratuitement
              </Link>
            </motion.div>
            <p className="mt-6 text-gray-400">
              Déjà plus de 1000 joueurs nous font confiance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer avec mentions légales */}
      <footer className="py-16 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-12">
              {/* Section Légal */}
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-6 text-purple-400">Légal</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <Link href="/legal/mentions-legales" className="hover:text-purple-400 transition-colors">
                      Mentions légales
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Informations légales sur l'entreprise et le service</p>
                  </li>
                  <li>
                    <Link href="/legal/conditions-utilisation" className="hover:text-purple-400 transition-colors">
                      Conditions d'utilisation
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Règles et conditions d'utilisation du service</p>
                  </li>
                  <li>
                    <Link href="/legal/politique-confidentialite" className="hover:text-purple-400 transition-colors">
                      Politique de confidentialité
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Gestion et protection de vos données personnelles</p>
                  </li>
                  <li>
                    <Link href="/legal/rgpd" className="hover:text-purple-400 transition-colors">
                      RGPD
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Conformité avec le Règlement Général sur la Protection des Données</p>
                  </li>
                </ul>
              </div>

              {/* Section Sécurité */}
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-6 text-purple-400">Sécurité</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <Link href="/security/regles-securite" className="hover:text-purple-400 transition-colors">
                      Règles de sécurité
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Consignes pour jouer en toute sécurité</p>
                  </li>
                  <li>
                    <Link href="/security/charte-joueur" className="hover:text-purple-400 transition-colors">
                      Charte du joueur
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Code de conduite et valeurs de notre communauté</p>
                  </li>
                  <li>
                    <Link href="/security/signaler-probleme" className="hover:text-purple-400 transition-colors">
                      Signaler un problème
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Procédure de signalement d'incidents</p>
                  </li>
                </ul>
              </div>

              {/* Section Contact */}
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-6 text-purple-400">Contact</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <Link href="/support" className="hover:text-purple-400 transition-colors">
                      Contact
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Notre équipe vous répond sous 24h</p>
                  </li>
                  <li>
                    <a href="mailto:contact@jokerou.com" className="hover:text-purple-400 transition-colors">
                      contact@jokerou.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Notre équipe vous répond sous 24h</p>
                  </li>
                  <li>
                    <Link href="/support/faq" className="hover:text-purple-400 transition-colors">
                      FAQ
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Réponses aux questions fréquentes</p>
                  </li>
                  <li>
                    <Link href="/support" className="hover:text-purple-400 transition-colors">
                      Support
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Assistance technique et aide en jeu</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright et RGPD */}
            <div className="mt-12 pt-8 border-t border-purple-500/20 text-center">
              <p className="text-sm text-gray-400 mb-2">
                © {new Date().getFullYear()} Jokerou. Tous droits réservés.
              </p>
              <p className="text-xs text-gray-500">
                Jokerou s'engage à protéger vos données personnelles conformément au RGPD.
                <Link href="/legal/politique-confidentialite" className="text-purple-400 hover:text-purple-300 ml-2">
                  En savoir plus sur nos cookies
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 