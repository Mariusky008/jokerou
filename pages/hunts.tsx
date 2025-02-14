import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import GameRules from '../components/GameRules';
import { useAudio } from '../contexts/AudioContext';

interface Hunt {
  id: string;
  date: Date;
  city: string;
  participants: number;
  maxParticipants: number;
  status: 'open' | 'full' | 'ongoing' | 'completed' | 'waiting';
  creator: {
    name: string;
    avatar: string;
  };
  timeToStart?: number; // Temps restant en secondes
  isWaiting?: boolean; // Pour suivre si l'utilisateur est inscrit
  inviteLink: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

// Fonction utilitaire pour jouer les sons
const playSound = (soundName: string) => {
  const audio = new Audio();
  audio.src = `/sounds/${soundName}.mp3`;
  audio.volume = 0.7;
  
  return new Promise((resolve, reject) => {
    audio.addEventListener('canplaythrough', async () => {
      try {
        await audio.play();
        resolve(true);
      } catch (error) {
        console.error(`Erreur lors de la lecture du son ${soundName}:`, error);
        reject(error);
      }
    }, { once: true });

    audio.addEventListener('error', (error) => {
      console.error(`Erreur lors du chargement du son ${soundName}:`, error);
      reject(error);
    }, { once: true });

    audio.load();
  });
};

export default function Hunts() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showImmersiveStart, setShowImmersiveStart] = useState(false);
  const [startingHunt, setStartingHunt] = useState<Hunt | null>(null);
  const [countdown, setCountdown] = useState(5);
  const { isMusicPlaying, audioVolume, toggleMusic, adjustVolume } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hunts, setHunts] = useState<Hunt[]>([
    {
      id: '5',
      date: new Date(Date.now() + 600000), // Dans 10 minutes (600000 ms)
      city: 'Bordeaux',
      participants: 8,
      maxParticipants: 12,
      status: 'open',
      creator: {
        name: 'Thomas',
        avatar: '👤'
      },
      timeToStart: 600,
      inviteLink: ''
    },
    {
      id: '0',
      date: new Date(Date.now() + 915000), // Dans 15 minutes et 15 secondes (915000 ms)
      city: 'Bordeaux',
      participants: 10,
      maxParticipants: 12,
      status: 'open',
      creator: {
        name: 'Sophie',
        avatar: '🎭'
      },
      timeToStart: 915,
      inviteLink: ''
    },
    {
      id: '1',
      date: new Date(Date.now() + 600000), // Dans 10 minutes
      city: 'Paris',
      participants: 8,
      maxParticipants: 12,
      status: 'open',
      creator: {
        name: 'Admin',
        avatar: '👑'
      },
      timeToStart: 600, // Initialisation du timeToStart
      inviteLink: ''
    },
    {
      id: '2',
      date: new Date(Date.now() + 7200000), // Dans 2 heures
      city: 'Lyon',
      participants: 12,
      maxParticipants: 12,
      status: 'full',
      creator: {
        name: 'Marie',
        avatar: '👤'
      },
      timeToStart: 7200,
      inviteLink: ''
    },
    {
      id: '3',
      date: new Date(Date.now() + 86400000), // Demain
      city: 'Marseille',
      participants: 4,
      maxParticipants: 12,
      status: 'open',
      creator: {
        name: 'Lucas',
        avatar: '👤'
      },
      timeToStart: 86400,
      inviteLink: ''
    }
  ]);

  const [newHunt, setNewHunt] = useState({
    city: '',
    date: '',
    time: '',
    maxParticipants: 12,
    inviteLink: ''
  });

  // Ajout d'un état pour suivre si le composant est monté
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialisation unique de l'audio
  useEffect(() => {
    const audio = new Audio('/sounds/ambient.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Afficher la notification pour informer l'utilisateur
    setNotification({
      message: 'Cliquez sur le bouton 🔈 pour activer la musique d\'ambiance',
      type: 'success'
    });

    // Essayer de démarrer automatiquement
    const startAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.log('Démarrage automatique impossible - interaction utilisateur requise');
      }
    };
    startAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Modification du useEffect pour la mise à jour des timers
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setHunts(prevHunts => prevHunts.map(hunt => ({
        ...hunt,
        timeToStart: Math.max(0, Math.floor((hunt.date.getTime() - Date.now()) / 1000))
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted]);

  // Effet pour jouer les sons lors du démarrage immersif
  useEffect(() => {
    if (showImmersiveStart) {
      // Son d'ambiance au démarrage
      playSound('radio-start');

      // Son pour chaque seconde du compte à rebours
      const countdownSound = () => {
        if (countdown > 0) {
          playSound('radio-click');
        }
      };

      const soundInterval = setInterval(countdownSound, 1000);

      // Son final lors de la redirection
      const finalSound = setTimeout(() => {
        playSound('radio-end');
      }, countdown * 1000);

      return () => {
        clearInterval(soundInterval);
        clearTimeout(finalSound);
      };
    }
  }, [showImmersiveStart, countdown]);

  const handleCreateHunt = (e: React.FormEvent) => {
    e.preventDefault();
    
    // À remplacer par la vérification d'authentification réelle
    const isAuthenticated = true; // Temporairement mis à true pour les tests
    
    if (!isAuthenticated) {
      setNotification({
        message: 'Veuillez vous connecter pour créer une chasse',
        type: 'error'
      });
      setTimeout(() => {
        router.push('/auth');
      }, 1500);
      return;
    }

    const dateTime = new Date(`${newHunt.date}T${newHunt.time}`);
    
    // Générer un ID unique pour le lien d'invitation
    const inviteId = Math.random().toString(36).substring(2, 15);
    const inviteLink = `${window.location.origin}/hunts/join/${inviteId}`;
    
    const hunt: Hunt = {
      id: Date.now().toString(),
      date: dateTime,
      city: newHunt.city,
      participants: 0,
      maxParticipants: newHunt.maxParticipants,
      status: 'open',
      creator: {
        name: 'Vous',
        avatar: '👤'
      },
      timeToStart: 0,
      isWaiting: false,
      inviteLink
    };

    setHunts(prev => [...prev, hunt]);
    setNewHunt({
      city: '',
      date: '',
      time: '',
      maxParticipants: 12,
      inviteLink: inviteLink
    });
    
    setNotification({
      message: `Votre chasse à ${hunt.city} a été créée avec succès !`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleJoinHunt = (huntId: string) => {
    // À remplacer par la vérification d'authentification réelle
    const isAuthenticated = true; // Temporairement mis à true pour les tests
    
    if (!isAuthenticated) {
      setNotification({
        message: 'Veuillez vous connecter pour rejoindre une chasse',
        type: 'error'
      });
      setTimeout(() => {
        router.push('/auth');
      }, 1500);
      return;
    }

    const selectedHunt = hunts.find(h => h.id === huntId);
    if (!selectedHunt) return;

    const timeToStart = Math.floor((selectedHunt.date.getTime() - Date.now()) / 1000);
    const isStartingSoon = timeToStart <= 900; // 15 minutes = 900 secondes

    setHunts(prev => prev.map(hunt => {
      if (hunt.id === huntId && hunt.participants < hunt.maxParticipants) {
        return {
          ...hunt,
          participants: hunt.participants + 1,
          isWaiting: true,
          status: hunt.participants + 1 >= hunt.maxParticipants ? 'full' : 'open'
        };
      }
      return hunt;
    }));

    // Ne déclencher la séquence immersive que si la partie commence dans moins de 15 minutes
    if (isStartingSoon) {
      playSound('radio-start');
      setStartingHunt(selectedHunt);
      setShowImmersiveStart(true);
      setCountdown(10);

      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            playSound('radio-end');
            setTimeout(() => {
              router.push('/roles');
            }, 1000);
            return 0;
          }
          playSound('radio-click');
          return prev - 1;
        });
      }, 1000);
    } else {
      // Afficher une notification de confirmation d'inscription
      setNotification({
        message: `Vous êtes inscrit à la chasse de ${selectedHunt.city} !`,
        type: 'success'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getButtonStyle = (hunt: Hunt) => {
    if (hunt.status === 'full') {
      return 'bg-gray-700 text-gray-400 cursor-not-allowed';
    }
    
    const timeToStart = Math.floor((hunt.date.getTime() - Date.now()) / 1000);
    
    if (hunt.isWaiting) {
      if (timeToStart <= 900) { // 15 minutes = 900 secondes
        return 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg hover:shadow-green-500/50';
      }
      return 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white shadow-lg hover:shadow-yellow-500/50';
    }
    
    return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50';
  };

  const getButtonText = (hunt: Hunt) => {
    if (hunt.status === 'full') return 'Complet';
    
    const timeToStart = Math.floor((hunt.date.getTime() - Date.now()) / 1000);
    
    if (hunt.isWaiting) {
      if (timeToStart <= 900) { // 15 minutes = 900 secondes
        return 'Rejoindre';
      }
      return 'En attente';
    }
    
    return "S'inscrire";
  };

  const formatTimeToStart = (hunt: Hunt) => {
    if (!isMounted) {
      // Rendu initial côté serveur
      const hours = Math.floor(hunt.timeToStart / 3600);
      const minutes = Math.floor((hunt.timeToStart % 3600) / 60);
      return `Début dans ${hours}h ${minutes}m`;
    }

    // Rendu côté client après le montage
    const timeToStart = Math.floor((hunt.date.getTime() - Date.now()) / 1000);
    if (timeToStart <= 0) return 'La partie commence !';
    
    const hours = Math.floor(timeToStart / 3600);
    const minutes = Math.floor((timeToStart % 3600) / 60);
    const seconds = timeToStart % 60;
    
    if (hours > 0) {
      return `Début dans ${hours}h ${minutes}m`;
    }
    return `Début dans ${minutes}m ${seconds}s`;
  };

  const copyInviteLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setNotification({
        message: "Lien d'invitation copié ! Vous pouvez maintenant l'envoyer à qui vous voulez pour qu'il rejoigne la partie.",
        type: 'success'
      });
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } catch (err) {
      setNotification({
        message: "Erreur lors de la copie du lien",
        type: 'error'
      });
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Chasses disponibles - GRIM</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-2 ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                : 'bg-gradient-to-r from-red-600 to-red-500 text-white'
            }`}>
              <span>{notification.type === 'success' ? '✅' : '❌'}</span>
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Séquence de démarrage immersive */}
      <AnimatePresence>
        {showImmersiveStart && startingHunt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center"
          >
            <div className="relative w-full max-w-4xl p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
                >
                  Préparez-vous pour la chasse !
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-900/80 rounded-2xl p-6"
                  >
                    <div className="text-2xl mb-4">🎯 Objectif</div>
                    <div className="text-lg text-gray-300">
                      Traquez ou échappez-vous dans les rues de {startingHunt.city}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-900/80 rounded-2xl p-6"
                  >
                    <div className="text-2xl mb-4">Participants</div>
                    <div className="text-lg text-gray-300">
                      {startingHunt.participants} chasseurs prêts pour l'action
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="bg-gray-900/80 rounded-2xl p-6"
                  >
                    <div className="text-2xl mb-4">🎭 Distribution des rôles</div>
                    <div className="text-lg text-gray-300">
                      <ul className="text-left space-y-2">
                        <li>• 1 Grim mystérieux</li>
                        <li>• Plusieurs chasseurs</li>
                        <li>• Possible rôle spécial (niveau 10+ requis)</li>
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="bg-gray-900/80 rounded-2xl p-6"
                  >
                    <div className="text-2xl mb-4">⭐ Rôles spéciaux</div>
                    <div className="text-lg text-gray-300">
                      <ul className="text-left space-y-2">
                        <li>• Illusionniste : aide secrètement le Grim</li>
                        <li>• Informateur : vend des infos aux deux camps</li>
                        <li>• Saboteur : perturbe la traque</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-32 h-32 rounded-full border-4 border-purple-500"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  <motion.div
                    className="text-8xl font-bold relative z-10"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {countdown}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 text-xl text-gray-400"
                >
                  Attribution des rôles dans quelques secondes...
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton de musique flottant avec notification */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-gray-900/90 rounded-full shadow-lg p-4 flex items-center gap-4">
          <button
            onClick={async () => {
              await toggleMusic();
              if (!isMusicPlaying) {
                setNotification({
                  message: 'Musique activée',
                  type: 'success'
                });
              }
            }}
            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all duration-300 group relative"
            title={isMusicPlaying ? "Couper la musique" : "Jouer la musique"}
          >
            {isMusicPlaying ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl"
              >
                🔊
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl"
              >
                🔈
              </motion.div>
            )}
            {!isMusicPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-12 whitespace-nowrap bg-gray-900 px-4 py-2 rounded-full text-sm"
              >
                Cliquez pour activer la musique
              </motion.div>
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={audioVolume}
              onChange={(e) => adjustVolume(parseFloat(e.target.value))}
              className="w-24 accent-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Chasses disponibles
          </h1>

          {/* Menu desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setShowRules(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>📜</span>
              Règles du jeu
            </button>
            <Link
              href="/leaderboards"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>🏆</span>
              Classements
            </Link>
            <Link
              href="/profile"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>👤</span>
              Mon profil
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>➕</span>
              Créer une chasse
            </button>
          </div>

          {/* Menu hamburger pour mobile */}
          <div className="block lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute right-4 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg border border-purple-500/20 z-50"
            >
              <div className="p-2 space-y-2">
                <button
                  onClick={() => {
                    setShowRules(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>📜</span>
                  Règles du jeu
                </button>

                <Link
                  href="/leaderboards"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>🏆</span>
                  Classements
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>👤</span>
                  Mon profil
                </Link>

                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>➕</span>
                  Créer une chasse
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des chasses */}
        <div className="grid gap-6">
          {hunts.map(hunt => (
            <motion.div
              key={hunt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-neon"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                    🎭
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Chasse à {hunt.city}</h2>
                    <p className="text-gray-400">{formatDate(hunt.date)}</p>
                    <p className="text-lg font-semibold text-center mt-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">{formatTimeToStart(hunt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-sm text-gray-400">Créée par</div>
                    <div className="flex items-center gap-2">
                      <span>{hunt.creator.avatar}</span>
                      <span>{hunt.creator.name}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Participants</div>
                    <div className="font-bold">
                      {hunt.participants}/{hunt.maxParticipants}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleJoinHunt(hunt.id)}
                      disabled={hunt.status === 'full' || hunt.isWaiting}
                      className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${getButtonStyle(hunt)}`}
                    >
                      {getButtonText(hunt)}
                    </button>
                    {hunt.status !== 'full' && (
                      <button
                        onClick={() => copyInviteLink(`${window.location.origin}/hunts/join/${hunt.id}`)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                        title="Copier le lien d'invitation"
                      >
                        <span>📋</span>
                        Inviter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de création de chasse */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Créer une nouvelle chasse</h2>
            
            <form onSubmit={handleCreateHunt} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2" htmlFor="city">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  value={newHunt.city}
                  onChange={(e) => setNewHunt({ ...newHunt, city: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={newHunt.date}
                  onChange={(e) => setNewHunt({ ...newHunt, date: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2" htmlFor="time">
                  Heure
                </label>
                <input
                  type="time"
                  id="time"
                  value={newHunt.time}
                  onChange={(e) => setNewHunt({ ...newHunt, time: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2" htmlFor="maxParticipants">
                  Nombre maximum de participants
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  min="4"
                  max="20"
                  value={newHunt.maxParticipants}
                  onChange={(e) => setNewHunt({ ...newHunt, maxParticipants: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {newHunt.inviteLink && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <label className="block text-gray-400 mb-2">
                    Lien d'invitation
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newHunt.inviteLink}
                      readOnly
                      className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyInviteLink(newHunt.inviteLink)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>📋</span>
                      Copier
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Partagez ce lien avec vos amis pour les inviter à rejoindre la chasse
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewHunt({
                      city: '',
                      date: '',
                      time: '',
                      maxParticipants: 12,
                      inviteLink: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                >
                  Créer la chasse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal des règles */}
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />

      <style jsx>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  );
} 