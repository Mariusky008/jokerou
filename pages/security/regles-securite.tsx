import Head from 'next/head';
import Link from 'next/link';

export default function ReglesSecurite() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Règles de Sécurité - Jokerou</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Règles de Sécurité
          </h1>

          <div className="space-y-8">
            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Sécurité physique</h2>
              <p className="text-gray-300 mb-4">
                Pour votre sécurité pendant le jeu :<br />
                - Restez vigilant à votre environnement<br />
                - Ne traversez pas en dehors des passages piétons<br />
                - Évitez les zones mal éclairées la nuit<br />
                - Gardez une distance de sécurité avec les autres joueurs<br />
                - Ne courez pas dans les zones dangereuses
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Zones interdites</h2>
              <p className="text-gray-300 mb-4">
                Il est strictement interdit de :<br />
                - Pénétrer dans des propriétés privées<br />
                - Accéder aux zones en travaux<br />
                - Entrer dans les bâtiments fermés<br />
                - Franchir les barrières de sécurité<br />
                - Jouer sur les voies de circulation
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Équipement recommandé</h2>
              <p className="text-gray-300 mb-4">
                Pour jouer en toute sécurité :<br />
                - Portez des chaussures adaptées<br />
                - Ayez un téléphone chargé<br />
                - Portez des vêtements réfléchissants la nuit<br />
                - Emportez de l'eau<br />
                - Gardez une batterie externe
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Comportement responsable</h2>
              <p className="text-gray-300 mb-4">
                Pendant le jeu :<br />
                - Respectez le code de la route<br />
                - Évitez les comportements suspects<br />
                - Ne harcelez pas les autres joueurs<br />
                - Restez calme en toute situation<br />
                - Aidez les joueurs en difficulté
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">En cas d'urgence</h2>
              <p className="text-gray-300 mb-4">
                Numéros importants :<br />
                - Police : 17<br />
                - SAMU : 15<br />
                - Pompiers : 18<br />
                - Urgences : 112<br />
                - Support Jokerou : +33 1 23 45 67 89
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Signalement</h2>
              <p className="text-gray-300">
                En cas de problème :<br />
                - Utilisez le bouton SOS dans l'app<br />
                - Contactez immédiatement le support<br />
                - Signalez les comportements dangereux<br />
                - Quittez la zone si nécessaire
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Contact sécurité</h2>
              <p className="text-gray-300">
                Pour toute question sur la sécurité :<br />
                Email : securite@jokerou.com<br />
                Urgence : +33 1 23 45 67 89<br />
                Support 24/7 via l'application
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 