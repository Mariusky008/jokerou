import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import GameRules from '../components/GameRules';

interface Player {
  id: number;
  avatar: string;
  role: string;
  name: string;
  position: { x: number; y: number };
  level: number;
}

const initialPlayers = [
  {
    id: 1,
    avatar: "🎭",
    role: "Grim",
    name: "Le Grim",
    position: { x: 30, y: 40 },
    level: 15
  },
  {
    id: 2,
    avatar: "👤",
    role: "hunter",
    name: "Marie",
    position: { x: 45, y: 35 },
    level: 12
  },
  {
    id: 3,
    avatar: "👤",
    role: "hunter",
    name: "Lucas",
    position: { x: 60, y: 50 },
    level: 8
  },
  {
    id: 4,
    avatar: "👤",
    role: "hunter",
    name: "Sarah",
    position: { x: 25, y: 60 },
    level: 10
  }
];

// Ajout du composant SafetyZoneModal
const SafetyZoneModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Zone de jeu sécurisée
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section de gauche avec image et points clés */}
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
                  <span className="text-4xl">🛡️</span>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center px-6"
                >
                  <h3 className="text-xl font-bold text-white mb-2">Votre sécurité est notre priorité</h3>
                  <p className="text-sm text-purple-200">Protection active 24/7 pour une expérience de jeu sereine</p>
                </motion.div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

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
                <motion.li 
                  className="flex items-center gap-3 bg-purple-500/10 p-3 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-purple-400 text-xl">✓</span>
                  <span>Modération 24/7</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-3 bg-purple-500/10 p-3 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-purple-400 text-xl">✓</span>
                  <span>Zones sécurisées</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-3 bg-purple-500/10 p-3 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-purple-400 text-xl">✓</span>
                  <span>Protection RGPD</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          {/* Section de droite avec les onglets */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-400">Sécurité et modération</h3>
                  <p className="text-sm text-gray-400">Protection active des joueurs</p>
                </div>
              </div>
              <div className="space-y-3 ml-4 border-l-2 border-purple-500/20 pl-4">
                <p className="text-gray-300">• Signalement en temps réel</p>
                <p className="text-gray-300">• Modérateurs actifs 24/7</p>
                <p className="text-gray-300">• Filtrage automatique</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-400">Zones de jeu</h3>
                  <p className="text-sm text-gray-400">Périmètres sécurisés</p>
                </div>
              </div>
              <div className="space-y-3 ml-4 border-l-2 border-blue-500/20 pl-4">
                <p className="text-gray-300">• Zones clairement définies</p>
                <p className="text-gray-300">• Alertes automatiques</p>
                <p className="text-gray-300">• Adaptation dynamique</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400">Protection des données</h3>
                  <p className="text-sm text-gray-400">Conformité RGPD</p>
                </div>
              </div>
              <div className="space-y-3 ml-4 border-l-2 border-green-500/20 pl-4">
                <p className="text-gray-300">• Données cryptées</p>
                <p className="text-gray-300">• Localisation sécurisée</p>
                <p className="text-gray-300">• Respect de la vie privée</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bannière de confiance en bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔰</span>
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-purple-400">100% sécurisé</span> - Plus de 10 000 parties jouées en toute sécurité
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
  );
};

export default function Home() {
  const [nextGameTime, setNextGameTime] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [showSafetyZone, setShowSafetyZone] = useState(false);
  const [playerPositions, setPlayerPositions] = useState(initialPlayers);
  const [particles, setParticles] = useState([]);
  const [isClient, setIsClient] = useState(false);

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
      role: "Grim Légendaire",
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
        // Le Grim se déplace plus rapidement et de manière plus erratique
        const moveRange = player.role === 'grim' ? 15 : 10;
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

  useEffect(() => {
    setIsClient(true);
    // Générer les positions des particules uniquement côté client
    const newParticles = [...Array(20)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Head children={<>
        <title>GRIM - Le jeu de traque urbain révolutionnaire</title>
        <meta name="description" content="Découvrez Grim, le jeu qui transforme votre ville en terrain de jeu. Cache-cache en temps réel, pouvoirs spéciaux et expérience unique garantie !" />
        <link rel="icon" href="/favicon.ico" />
      </>} />

      
      {/* Modals */}
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />
      <SafetyZoneModal isOpen={showSafetyZone} onClose={() => setShowSafetyZone(false)} />

      {/* Hero Section avec Vidéo Background */}
      <div className="relative h-screen overflow-hidden">
        {/* Image de fond avec effets */}
        <div className="absolute inset-0">
          <Image
            src="/images/portrait.png"
            alt="Portrait du Grim"
            fill
            priority
            quality={100}
            className="opacity-85 brightness-125 object-cover object-center"
            sizes="100vw"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black/95 to-pink-900/90">
            {/* Motif de grille représentant les rues */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-[pulse_4s_ease-in-out_infinite]"></div>
            
            {/* Points d'intérêt animés */}
            <div className="absolute inset-0 z-0">
              {playerPositions.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    x: [
                      `${player.position.x}%`,
                      `${player.position.x + (player.role === 'grim' ? 15 : 10) * (Math.random() - 0.5)}%`,
                      `${player.position.x}%`
                    ],
                    y: [
                      `${player.position.y}%`,
                      `${player.position.y + (player.role === 'grim' ? 15 : 10) * (Math.random() - 0.5)}%`,
                      `${player.position.y}%`
                    ]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className={`absolute flex flex-col items-center ${player.role === 'grim' ? 'z-10' : 'z-5'}`}
                  style={{
                    left: `${player.position.x}%`,
                    top: `${player.position.y}%`
                  }}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                      player.role === 'grim'
                        ? 'bg-purple-600 hover:bg-purple-500'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    animate={{
                      boxShadow: player.role === 'grim'
                        ? '0 0 20px rgba(147, 51, 234, 0.5)'
                        : '0 0 20px rgba(37, 99, 235, 0.5)',
                    }}
                  >
                    {player.avatar}
                  </motion.div>
                  {player.role === 'grim' && (
                    <motion.div 
                      className="mt-2 px-3 py-1 bg-purple-600 rounded-full text-sm"
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
                      Niveau {player.level}
                    </motion.div>
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
           

            {/* Titre principal avec effet de glitch */}
            <h1 className="text-8xl font-black mb-8 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-[textShadow_5s_ease-in-out_infinite]">
                Le GRIM
              </span>
            </h1>

            {/* Description avec effet de typing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-3xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                1 heure pour traquer et trouver le GRIM dans votre ville.<br/>

                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="block mt-4 text-xl"
                >
                  <span className="text-purple-400">Une expérience unique chaque jour de </span>
                  <span className="font-mono bg-purple-500/20 px-2 py-1 rounded">18:00</span>à
                  <span className="font-mono bg-purple-500/20 px-2 py-1 rounded">21:00</span>

                  
                </motion.span>
              </p>
            </motion.div>

            {/* Stats en temps réel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="grid grid-cols-2 gap-8 mb-12"
            >
              <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">16</div>
                <div className="text-sm text-gray-400">1 Grim</div>
                <div className="text-sm text-gray-400">15 Chasseurs</div>
              </div>
              <div className="bg-pink-900/30 backdrop-blur-sm p-4 rounded-xl border border-pink-500/20">
                <div className="text-2xl font-bold text-pink-400">2.5 km</div>
                <div className="text-sm text-gray-400">Zone de traque</div>
                <div className="text-sm text-gray-400">Zone de chasse</div>
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
                  className="relative w-full inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base sm:text-xl py-3 sm:py-5 px-6 sm:px-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-center"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Inscription à la prochaine chasse
                </Link>
              </motion.div>

              {/* Nouveau bouton pour regarder une partie en direct */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Link href="/spectate" 
                  className="relative w-full inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-base sm:text-xl py-3 sm:py-5 px-6 sm:px-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/50 text-center flex items-center justify-center gap-3"
                >
                  <span>👁️</span>
                  Regarder une partie en direct
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Overlay avec motif de points */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_2px,_rgba(0,0,0,0.2)_3px)] bg-[length:30px_30px]"></div>
      </div>

      {/* Section Comment ça marche */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            Comment ça marche ?
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-gray-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 h-full overflow-hidden">
                <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold z-10 shadow-lg border-2 border-purple-400">1</div>
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden group-hover:transform group-hover:scale-105 transition-all duration-500">
                  <Image
                    src="/images/signup.jpg"
                    alt="Création de compte"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 mt-4">Créez votre compte</h3>
                <p className="text-gray-400">Rejoignez la communauté GRIM et préparez-vous à vivre une expérience de jeu unique en plein air. Quelques clics suffisent pour commencer l'aventure.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-gray-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 h-full overflow-hidden">
                <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold z-10 shadow-lg border-2 border-purple-400">2</div>
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden group-hover:transform group-hover:scale-105 transition-all duration-500">
                  <Image
                    src="/images/choose-game.jpg"
                    alt="Choix de partie"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 mt-4">Choisissez votre partie</h3>
                <p className="text-gray-400">Consultez les créneaux disponibles dans votre ville et rejoignez une partie ou créez en une. 
                  Découvrez votre rôle mystère : serez-vous le GRIM ou l'un des Chasseurs ?</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-gray-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 h-full overflow-hidden">
                <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold z-10 shadow-lg border-2 border-purple-400">3</div>
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden group-hover:transform group-hover:scale-105 transition-all duration-500">
                  <Image
                    src="/images/chase.jpg"
                    alt="Lancement de la chasse"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 mt-4">Lancez la chasse</h3>
                <p className="text-gray-400">Au signal de départ, la partie de 60 minutes commence ! Les Chasseurs partent à la recherche du GRIM qui doit leur échapper dans les rues de la ville.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-gray-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 h-full overflow-hidden">
                <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold z-10 shadow-lg border-2 border-purple-400">4</div>
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden group-hover:transform group-hover:scale-105 transition-all duration-500">
                  <Image
                    src="/images/powers.jpg"
                    alt="Utilisation des pouvoirs"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 mt-4">Utilisez vos pouvoirs</h3>
                <p className="text-gray-400">Déployez des capacités spéciales, coordonnez-vous avec votre équipe via le talkie-walkie et exploitez les zones stratégiques pour remporter la victoire !</p>
              </div>
            </motion.div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSafetyZone(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-3"
            >
              <span className="text-xl">🛡️</span>
              Zone sécurisée
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRules(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-3"
            >
              <span className="text-xl">📜</span>
              Règles du jeu
            </motion.button>
          </div>
        </div>
      </section>

      {/* Section Pourquoi nous rejoindre */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20 relative overflow-hidden">
        {/* Particules d'arrière-plan animées */}
        <div className="absolute inset-0">
          {isClient && particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-purple-500/20"
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                scale: 0
              }}
              animate={{
                x: [null, `${Math.random() * 100}%`],
                y: [null, `${Math.random() * 100}%`],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            {/* Effet de lumière derrière le titre */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent relative">
              Pourquoi nous rejoindre ?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une expérience unique qui combine jeu, récompenses et rencontres réelles. Créez vos propres traques privées avec famille ou amis et définissez vos récompenses personnalisées !
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte Adrénaline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group relative"
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-700" />
              
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl flex items-center justify-center text-3xl mb-6 relative"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                🎯
                {/* Effet de pulse */}
                <div className="absolute inset-0 rounded-xl bg-purple-500/20 animate-ping" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Montée d'adrénaline garantie
              </h3>
              <ul className="space-y-4 text-gray-300">
                <motion.li
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Traquez ou échappez-vous dans les rues de votre ville</span>
                </motion.li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Utilisez des pouvoirs uniques pour déjouer vos adversaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Formez des alliances secrètes et trahissez au bon moment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Vivez des parties intenses avec des rebondissements constants</span>
                </li>
              </ul>
            </motion.div>

            {/* Carte Récompenses */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl flex items-center justify-center text-3xl mb-6 relative">
                🎁
                {/* Effet de pulse */}
                <div className="absolute inset-0 rounded-xl bg-purple-500/20 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Des récompenses concrètes
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Gagnez des points à chaque action : éliminations, évasions, streaming</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Échangez vos points contre des bons d'achat (Amazon, Fnac...)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Profitez de récompenses locales : restaurants, cinéma, activités</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Débloquez des avantages exclusifs en jeu</span>
                </li>
              </ul>
            </motion.div>

            {/* Carte Rencontres */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl flex items-center justify-center text-3xl mb-6 relative">
                🤝
                {/* Effet de pulse */}
                <div className="absolute inset-0 rounded-xl bg-purple-500/20 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Du virtuel au réel
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Rencontrez vos adversaires après chaque partie</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>5 minutes de débriefing dans un lieu révélé par le Grim</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Partagez vos stratégies et moments forts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Créez des liens avec la communauté locale de joueurs</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             whileHover={{ y: -10 }}
             transition={{ delay: 0.4 }}
             className="bg-purple-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group relative">
             <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl flex items-center justify-center text-3xl mb-6 relative">
             👥
                {/* Effet de pulse */}
                <div className="absolute inset-0 rounded-xl bg-purple-500/20 animate-ping" />
                </div>
              <h3  className="text-xl font-bold mb-2">Parties publiques ou privées </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Participez à une traque dans votre ville</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Ou créez une partie personnalisée avec famille ou amis</span>
                  </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Définissez vos propres règles et choisissez une récompense excitante pour le vainqueur (argent, gages, repas...) !</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Créez des liens avec la communauté locale de joueurs</span>
                </li>
              </ul>
              
            </motion.div>

            
            
          </div>

          {/* Bouton d'appel à l'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/auth"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-lg overflow-hidden"
            >
              {/* Effet de particules au survol */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      x: [0, (i - 2) * 30],
                      y: [0, (Math.random() - 0.5) * 20]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
              <span className="relative z-10">Rejoignez l'aventure</span>
              <span className="relative z-10 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section Boutique et Points */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Gagnez des récompenses
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chaque action compte ! Gagnez des points en jouant et échangez-les contre des récompenses exclusives.
            </p>
          </motion.div>

          {/* Exemples de récompenses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl flex items-center justify-center text-3xl">
                  🛍️
                </div>
                <div>
                  <h3 className="text-xl font-bold">Bons d'achat</h3>
                  <p className="text-gray-400">Amazon, Fnac, etc.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Bon 10€</span>
                  <span className="font-bold text-purple-400">5000 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Bon 20€</span>
                  <span className="font-bold text-purple-400">9000 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Bon 50€</span>
                  <span className="font-bold text-purple-400">20000 pts</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl flex items-center justify-center text-3xl">
                  🍕
                </div>
                <div>
                  <h3 className="text-xl font-bold">Récompenses locales</h3>
                  <p className="text-gray-400">Restaurants & activités</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Pizza offerte</span>
                  <span className="font-bold text-purple-400">4000 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Menu Burger</span>
                  <span className="font-bold text-purple-400">3500 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Place de ciné</span>
                  <span className="font-bold text-purple-400">3000 pts</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl flex items-center justify-center text-3xl">
                  🎮
                </div>
                <div>
                  <h3 className="text-xl font-bold">Bonus en jeu</h3>
                  <p className="text-gray-400">Avantages exclusifs</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Skin exclusif</span>
                  <span className="font-bold text-purple-400">2500 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Double XP (1h)</span>
                  <span className="font-bold text-purple-400">1500 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <span>Pack VIP</span>
                  <span className="font-bold text-purple-400">7500 pts</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Comment gagner des points */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/20"
            >
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="text-lg font-bold mb-2">Éliminations</h4>
              <p className="text-gray-400">100 points par élimination</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/20"
            >
              <div className="text-3xl mb-4">🏃</div>
              <h4 className="text-lg font-bold mb-2">Évasion</h4>
              <p className="text-gray-400">150 points par évasion réussie</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/20"
            >
              <div className="text-3xl mb-4">📺</div>
              <h4 className="text-lg font-bold mb-2">Streaming</h4>
              <p className="text-gray-400">10 points par minute de stream</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/20"
            >
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="text-lg font-bold mb-2">Pouvoirs</h4>
              <p className="text-gray-400">50 points par utilisation</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              <span>Découvrir la boutique</span>
              <span>→</span>
            </Link>
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
                🔴 En direct : 3 chasseurs traquent le Grim dans le quartier Saint-Michel
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
                    <p className="text-gray-300 relative z-10">Le Grim vient d'utiliser son pouvoir de camouflage près de la fontaine !</p>
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
                      🏃‍♂️ Grim repéré
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
                    <div className="text-sm font-bold text-purple-400">Distance du Grim</div>
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
                    <div className="font-bold">Grim</div>
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

      {/* Section Rencontres après-jeu */}
      <section className="relative overflow-hidden">
        {/* Arrière-plan lumineux et coloré */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-indigo-500/30 to-pink-500/30"></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]"
            style={{ 
              '--tw-gradient-from': 'rgba(139, 92, 246, 0.3)'
            } as React.CSSProperties}
          />
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(236,72,153,0.2),transparent)]"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Au-delà du virtuel
            </motion.h2>
            <motion.div 
              className="mt-6 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-2xl text-white/90">
                Prolongez l'expérience GRIM dans le monde réel
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {/* Carte Débriefing */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                <motion.div 
                  className="flex items-center justify-between mb-6"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <h3 className="text-2xl font-semibold text-white">Débriefing stratégique</h3>
                  <span className="text-3xl">🎯</span>
                </motion.div>
                <ul className="space-y-4 text-white/90">
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="mr-3 text-purple-300">•</span>
                    <span>Rencontrez vos coéquipiers 5 minutes après chaque partie</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="mr-3 text-purple-300">•</span>
                    <span>Analysez les stratégies et partagez vos tactiques</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="mr-3 text-purple-300">•</span>
                    <span>Développez votre réseau de joueurs locaux</span>
                  </motion.li>
                </ul>
              </div>
            </motion.div>

            {/* Carte Communauté */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 hover:border-pink-400/50 transition-all duration-300">
                <motion.div 
                  className="flex items-center justify-between mb-6"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <h3 className="text-2xl font-semibold text-white">Communauté locale</h3>
                  <motion.span 
                    className="text-3xl"
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🌟
                  </motion.span>
                </motion.div>
                <ul className="space-y-4 text-white/90">
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="mr-3 text-pink-300">•</span>
                    <span>Découvrez les lieux de rencontre de votre ville</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="mr-3 text-pink-300">•</span>
                    <span>Participez aux événements communautaires mensuels</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="mr-3 text-pink-300">•</span>
                    <span>Rejoignez une communauté de passionnés</span>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Statistique */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-white/10 backdrop-blur-xl px-12 py-8 rounded-2xl border border-purple-500/20"
            >
              <motion.p 
                className="text-sm text-white/80 uppercase tracking-wide"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Impact social
              </motion.p>
              <motion.p 
                className="mt-3 text-5xl font-bold text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                +60<span className="text-purple-400">%</span>
              </motion.p>
              <p className="mt-2 text-xl text-white/90">des joueurs ont créé des amitiés durables</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Parties Privées */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Créez votre propre traque privée
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Organisez des parties exclusives avec vos amis et votre famille. Définissez vos règles, choisissez un gain pour le vainqueur et créez une expérience unique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-xl p-6 shadow-xl border border-purple-500/20"
            >
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Entre amis</h3>
              <p className="text-gray-400">
                Invitez jusqu'à 20 amis pour une partie privée. Définissez un gain motivant pour pimenter la compétition !
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-xl p-6 shadow-xl border border-purple-500/20"
            >
              <div className="text-3xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold mb-2">En famille</h3>
              <p className="text-gray-400">
                Créez des parties adaptées à tous les âges. Une activité ludique et sécurisée pour toute la famille.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-xl p-6 shadow-xl border border-purple-500/20"
            >
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Gain personnalisé</h3>
              <p className="text-gray-400">
                Définissez un gain pour le vainqueur : argent, gage, repas... Rendez la partie encore plus excitante !
              </p>
            </motion.div>
          </div>

          {/* Section des gains personnalisés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 mb-12 border border-purple-500/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center text-2xl">
                🎁
              </div>
              <h3 className="text-2xl font-bold">Gains personnalisés</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Rendez vos parties encore plus excitantes en définissant un gain pour le vainqueur. Quelques idées :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-900/20 p-3 rounded-lg">
                <span className="text-purple-400">🍽️</span> Un dîner au restaurant
              </div>
              <div className="bg-purple-900/20 p-3 rounded-lg">
                <span className="text-purple-400">🎬</span> Une sortie cinéma
              </div>
              <div className="bg-purple-900/20 p-3 rounded-lg">
                <span className="text-purple-400">🎮</span> Un jeu vidéo
              </div>
            </div>
          </motion.div>

          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Prêt à organiser votre traque ?</h3>
                <p className="text-gray-400">
                  Créez votre partie privée en quelques clics et invitez vos proches.
                </p>
              </div>
              <Link
                href="/hunts"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 whitespace-nowrap"
              >
                Créer une partie privée
              </Link>
            </div>
          </div>
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
                Vivez l'expérience classique : parcourez la ville en solitaire, utilisez vos pouvoirs et votre stratégie pour échapper aux chasseurs ou traquer le Grim.
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
            <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-6 rounded-2xl inline-block backdrop-blur-sm border border-purple-500/20"
            >
              <p className="text-gray-300">
                <span className="text-purple-400 font-bold">Conseil : </span>
                Le mode duo est recommandé pour les nouveaux joueurs, permettant une meilleure prise en main du jeu et des stratégies plus élaborées.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

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

      {/* Section CTA finale */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Prêt à relever le défi ?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-8 px-4">
              Rejoignez la communauté GRIM et participez à une expérience de jeu unique
            </p>
            <Link
              href="/auth"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-base md:text-lg"
            >
              Créer un compte gratuitement
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-20 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Section Légal */}
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Légal
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/legal/mentions-legales" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/legal/conditions-utilisation" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/legal/politique-confidentialite" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/legal/rgpd" className="text-gray-400 hover:text-purple-400 transition-colors">
                    RGPD
                  </Link>
                </li>
              </ul>
            </div>

            {/* Section Sécurité */}
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Sécurité
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/security/regles-securite" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Règles de sécurité
                  </Link>
                </li>
                <li>
                  <Link href="/security/charte-joueur" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Charte du joueur
                  </Link>
                </li>
                <li>
                  <Link href="/security/signaler-probleme" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Signaler un problème
                  </Link>
                </li>
              </ul>
            </div>

            {/* Section Contact */}
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Contact
              </h3>
              <ul className="space-y-4">
                <li className="text-gray-400">
                  <span className="text-purple-400">Email :</span> contact@grim.com
                </li>
                <li className="text-gray-400">
                  <span className="text-purple-400">Support :</span> +33 7 68 23 33 47
                </li>
                <li className="text-gray-400">
                  <span className="text-purple-400">Adresse :</span> 7 rue saint Pierre, 40100 Dax
                </li>
              </ul>
            </div>

            {/* Section Réseaux sociaux */}
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Suivez-nous
              </h3>
              <div className="flex flex-col space-y-4">
                <a 
                  href="https://twitter.com/GrimGame" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </div>
                  <span>@GrimGame</span>
                </a>
                <a 
                  href="https://instagram.com/grim.game" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>@grim.game</span>
                </a>
                <a 
                  href="https://discord.gg/grimgame" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                    </svg>
                  </div>
                  <span>Discord Grim</span>
                </a>
                <a 
                  href="https://youtube.com/@GrimGameOfficiel" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Grim Officiel</span>
                </a>
                <a 
                  href="https://tiktok.com/@grim.game" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <span>@grim.game</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 GRIM. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 