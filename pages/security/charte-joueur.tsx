import Head from 'next/head';
import Link from 'next/link';

export default function CharteJoueur() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Charte du Joueur - Jokerou</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Charte du Joueur
          </h1>

          <div className="space-y-8">
            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Valeurs fondamentales</h2>
              <p className="text-gray-300 mb-4">
                En tant que joueur Jokerou, je m'engage à :<br />
                - Respecter tous les participants<br />
                - Faire preuve de fair-play<br />
                - Jouer dans un esprit sportif<br />
                - Privilégier le plaisir du jeu<br />
                - Contribuer à une communauté positive
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Comportement en jeu</h2>
              <p className="text-gray-300 mb-4">
                Je m'engage à :<br />
                - Respecter les règles du jeu<br />
                - Ne pas tricher ou exploiter de bugs<br />
                - Accepter la défaite avec dignité<br />
                - Célébrer la victoire avec humilité<br />
                - Aider les nouveaux joueurs
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Communication</h2>
              <p className="text-gray-300 mb-4">
                Dans mes échanges, je m'engage à :<br />
                - Utiliser un langage respectueux<br />
                - Éviter tout propos discriminatoire<br />
                - Signaler les comportements toxiques<br />
                - Encourager la communication positive<br />
                - Partager des retours constructifs
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Esprit d'équipe</h2>
              <p className="text-gray-300 mb-4">
                En tant que membre de l'équipe :<br />
                - Je collabore avec mes coéquipiers<br />
                - Je partage les informations utiles<br />
                - Je reste positif même en difficulté<br />
                - Je soutiens mes partenaires<br />
                - Je respecte les stratégies d'équipe
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Respect de l'environnement</h2>
              <p className="text-gray-300 mb-4">
                Je m'engage à :<br />
                - Respecter les espaces publics<br />
                - Ne pas déranger les non-joueurs<br />
                - Préserver la tranquillité des lieux<br />
                - Signaler les zones dangereuses<br />
                - Maintenir la propreté des lieux de jeu
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Sanctions</h2>
              <p className="text-gray-300">
                Je comprends que le non-respect de cette charte peut entraîner :<br />
                - Un avertissement<br />
                - Une suspension temporaire<br />
                - Une exclusion définitive<br />
                - La perte des privilèges acquis
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Engagement</h2>
              <p className="text-gray-300">
                En jouant à Jokerou, je m'engage à respecter cette charte et à contribuer à faire de ce jeu une expérience positive pour tous les participants.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 