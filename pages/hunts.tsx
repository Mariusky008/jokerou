import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

export default function Hunts() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [hunts, setHunts] = useState<Hunt[]>([
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
      timeToStart: 600 // Initialisation du timeToStart
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
      timeToStart: 7200
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
      timeToStart: 86400
    }
  ]);

  const [newHunt, setNewHunt] = useState({
    city: '',
    date: '',
    time: '',
    maxParticipants: 12
  });

  // Ajout d'un état pour suivre si le composant est monté
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  const handleCreateHunt = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${newHunt.date}T${newHunt.time}`);
    
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
      }
    };

    setHunts(prev => [...prev, hunt]);
    setShowCreateModal(false);
    setNewHunt({
      city: '',
      date: '',
      time: '',
      maxParticipants: 12
    });
    
    setNotification({
      message: `Votre chasse à ${hunt.city} a été créée avec succès !`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleJoinHunt = (huntId: string) => {
    setHunts(prev => prev.map(hunt => {
      if (hunt.id === huntId && hunt.participants < hunt.maxParticipants) {
        const timeToStart = Math.floor((hunt.date.getTime() - Date.now()) / 1000);
        const hours = Math.floor(timeToStart / 3600);
        const minutes = Math.floor((timeToStart % 3600) / 60);
        
        let timeMessage = '';
        if (hours > 0) {
          timeMessage = `Début dans ${hours}h ${minutes}m`;
        } else {
          timeMessage = `Début dans ${minutes}m`;
        }

        setNotification({
          message: `Vous êtes inscrit à la chasse à ${hunt.city} ! ${timeMessage}`,
          type: 'success'
        });
        setTimeout(() => setNotification(null), 5000);

        // Si la partie commence dans moins de 15 minutes, rediriger vers la page des rôles
        if (timeToStart <= 900) {
          setTimeout(() => {
            router.push('/roles');
          }, 1500);
        }

        return {
          ...hunt,
          participants: hunt.participants + 1,
          isWaiting: true,
          status: hunt.participants + 1 >= hunt.maxParticipants ? 'full' : 'open'
        };
      }
      return hunt;
    }));
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
    
    if (hunt.isWaiting) {
      return 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white shadow-lg hover:shadow-yellow-500/50';
    }
    
    const timeToStart = Math.floor((hunt.date.getTime() - Date.now()) / 1000);
    if (timeToStart <= 900) { // 15 minutes = 900 secondes
      return 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg hover:shadow-green-500/50';
    }
    
    return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50';
  };

  const getButtonText = (hunt: Hunt) => {
    if (hunt.status === 'full') return 'Complet';
    if (hunt.isWaiting) return 'En attente';
    const timeToStart = Math.floor((hunt.date.getTime() - Date.now()) / 1000);
    return timeToStart <= 900 ? 'Rejoindre' : "S'inscrire";
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Chasses disponibles - Jokerou</title>
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

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Chasses disponibles
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
          >
            <span>🎯</span>
            Créer une chasse
          </button>
        </div>

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
                    🎮
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Chasse à {hunt.city}</h2>
                    <p className="text-gray-400">{formatDate(hunt.date)}</p>
                    <p className="text-sm text-purple-400">{formatTimeToStart(hunt)}</p>
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

                  <button
                    onClick={() => handleJoinHunt(hunt.id)}
                    disabled={hunt.status === 'full' || hunt.isWaiting}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${getButtonStyle(hunt)}`}
                  >
                    {getButtonText(hunt)}
                  </button>
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

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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

      <style jsx>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  );
} 