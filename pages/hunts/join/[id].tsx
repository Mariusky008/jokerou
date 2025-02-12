import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

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
  timeToStart?: number;
}

interface JoinPageProps {
  hunt?: Hunt;
  error?: string;
}

export default function JoinHunt() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (id) {
      // Simuler une requête API pour récupérer les détails de la chasse
      setTimeout(() => {
        // Pour la démo, on crée une fausse chasse
        const mockHunt: Hunt = {
          id: id as string,
          date: new Date(Date.now() + 3600000), // Dans 1 heure
          city: 'Paris',
          participants: 8,
          maxParticipants: 12,
          status: 'open',
          creator: {
            name: 'Alex',
            avatar: '👤'
          },
          timeToStart: 3600
        };

        if (mockHunt.participants >= mockHunt.maxParticipants) {
          setError('Cette chasse est déjà complète');
        } else {
          setHunt(mockHunt);
        }
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleJoin = async () => {
    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = false; // À remplacer par votre logique d'authentification réelle
    
    if (!isAuthenticated) {
      // Sauvegarder l'URL actuelle pour rediriger l'utilisateur après l'authentification
      const returnUrl = window.location.pathname;
      router.push(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setJoining(true);
    // Simuler une requête API pour rejoindre la chasse
    setTimeout(() => {
      setJoining(false);
      router.push('/hunts');
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !hunt) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <Head>
          <title>Erreur - Invitation invalide</title>
        </Head>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-neon"
        >
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">
            {error || "Cette invitation n'est pas valide"}
          </h1>
          <p className="text-gray-400 mb-8">
            L'invitation a peut-être expiré ou la chasse est déjà complète.
          </p>
          <Link
            href="/hunts"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 inline-flex items-center gap-2"
          >
            <span>🎯</span>
            Voir les chasses disponibles
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>Rejoindre la chasse - GRIM</title>
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-neon"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
            Invitation à une chasse
          </h1>
          <p className="text-gray-400">
            Vous avez été invité à participer à une chasse !
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                🎮
              </div>
              <div>
                <h2 className="text-xl font-bold">Chasse à {hunt.city}</h2>
                <p className="text-gray-400">{formatDate(hunt.date)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Créée par</div>
                <div className="flex items-center gap-2">
                  <span>{hunt.creator.avatar}</span>
                  <span>{hunt.creator.name}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Participants</div>
                <div className="font-bold">
                  {hunt.participants}/{hunt.maxParticipants}
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center gap-3 text-purple-400">
                <div className="text-xl">⏰</div>
                <div>La chasse commence dans {Math.floor(hunt.timeToStart / 3600)}h {Math.floor((hunt.timeToStart % 3600) / 60)}m</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleJoin}
              disabled={joining}
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 ${
                joining ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {joining ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <span>🎯</span>
                  Rejoindre la chasse
                </>
              )}
            </button>
            <Link
              href="/hunts"
              className="text-center text-gray-400 hover:text-white transition-colors"
            >
              Retour aux chasses disponibles
            </Link>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  );
} 