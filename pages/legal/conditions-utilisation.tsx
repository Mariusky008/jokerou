import Head from 'next/head';
import Link from 'next/link';

export default function ConditionsUtilisation() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head children={<>
        <title>Conditions d'Utilisation - Grim</title>
      </>} />

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Conditions d'Utilisation
          </h1>

          <div className="space-y-8">
            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Inscription et compte</h2>
              <p className="text-gray-300 mb-4">
                Pour utiliser Grim, vous devez :<br />
                - Être âgé d'au moins 16 ans<br />
                - Créer un compte avec des informations exactes<br />
                - Maintenir la confidentialité de vos identifiants<br />
                - Accepter d'être géolocalisé pendant les parties
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Règles du jeu</h2>
              <p className="text-gray-300 mb-4">
                En participant aux parties, vous acceptez de :<br />
                - Respecter les zones de jeu définies<br />
                - Ne pas tricher ou utiliser des outils non autorisés<br />
                - Respecter les autres joueurs<br />
                - Suivre les consignes de sécurité
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Comportement des utilisateurs</h2>
              <p className="text-gray-300 mb-4">
                Il est strictement interdit de :<br />
                - Harceler ou intimider d'autres joueurs<br />
                - Partager des contenus inappropriés<br />
                - Perturber le déroulement des parties<br />
                - Usurper l'identité d'autres joueurs
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Sécurité et responsabilité</h2>
              <p className="text-gray-300 mb-4">
                Les joueurs sont responsables de :<br />
                - Leur sécurité physique pendant le jeu<br />
                - Respecter le code de la route<br />
                - Ne pas entrer dans des propriétés privées<br />
                - Signaler tout comportement dangereux
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Sanctions</h2>
              <p className="text-gray-300">
                En cas de non-respect des conditions d'utilisation, Grim se réserve le droit de :<br />
                - Avertir l'utilisateur<br />
                - Suspendre temporairement le compte<br />
                - Bannir définitivement l'utilisateur<br />
                - Signaler aux autorités compétentes si nécessaire
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Modifications des conditions</h2>
              <p className="text-gray-300">
                Grim se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements importants par email et devront les accepter pour continuer à utiliser le service.
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Contact</h2>
              <p className="text-gray-300">
                Pour toute question concernant ces conditions d'utilisation :<br />
                Email : legal@grim.com<br />
                Support : support@grim.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 